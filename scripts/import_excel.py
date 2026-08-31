"""
One-time (or re-run-when-needed) import: reads the Belgische_gemeenten_dashboard
Excel export and loads it into the backend's SQLite database — including an
automatically matched RefnisCode (NIS code) for each municipality, looked up
against the same belgium.json topology that powers the map.

Table/column names here match the EF Core "Municipality" model exactly. The
script drops and recreates the Municipalities table, so it stays in sync when
the model gains columns (e.g. the Setup/Status split) without needing an EF
migration; EF Core's EnsureCreated() then just finds the table already there.

Usage:
    pip install pandas openpyxl
    python import_excel.py path/to/Belgische_gemeenten_dashboard_POS_EagleBe.xlsx path/to/dashboard.db path/to/belgium.json

This is a RESEED, not a merge: it drops and recreates the Municipalities table
and reloads from the Excel file every time it runs. That's intentional while
the Excel is still the source of truth. Note that "Status" is NOT in the Excel
— it tracks the state of a sold product (in behandeling / afgerond / …) and is
edited through the app, so a reseed wipes it back to empty. Once editing through
the app is live, this script becomes a one-time initializer only, not something
to run repeatedly.
"""

import json
import re
import sqlite3
import sys
import unicodedata
from pathlib import Path

import pandas as pd

# Excel spells a few municipalities differently than the topology does.
# Add to this if the "no NIS match found" warning ever lists new names.
MANUAL_ALIASES = {
    "brussel-stad": "brussel",
}


def normalize(name: str) -> str:
    """Lowercase, strip accents/ligatures, and apply manual aliases so
    'Écaussinnes' / 'ecaussinnes' / 'ÉCAUSSINNES' all match the same key."""
    s = str(name).replace("œ", "oe").replace("Œ", "OE")
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = s.strip().lower()
    return MANUAL_ALIASES.get(s, s)


def build_nis_lookup(topology_path: Path) -> dict[str, str]:
    with open(topology_path, encoding="utf-8") as f:
        topology = json.load(f)

    lookup: dict[str, str] = {}
    for geometry in topology["objects"]["municipalities"]["geometries"]:
        props = geometry["properties"]
        lookup[normalize(props["name_nl"])] = props["nis"]
        lookup[normalize(props["name_fr"])] = props["nis"]
    return lookup


def find_nis(name: str, lookup: dict[str, str]) -> str | None:
    raw = str(name).strip()
    # Brussels communes are written bilingually in the Excel, e.g.
    # "Elsene (Ixelles)" — try the full string, then just the Dutch part.
    dutch_part = re.sub(r"\s*\(.*\)\s*$", "", raw).strip()
    return lookup.get(normalize(raw)) or lookup.get(normalize(dutch_part))


def parse_postal_codes(raw) -> str:
    """'2490, 2491' -> '[2490,2491]' — matches the JSON format the EF Core
    value converter expects for the List<int> PostalCodes property."""
    if pd.isna(raw):
        return "[]"
    codes = [int(part.strip()) for part in str(raw).split(",") if part.strip()]
    return json.dumps(codes)


def setup_for(is_pos_customer: bool, is_eaglebe_active: bool) -> str:
    """Which products a municipality runs. This is what the old single
    'Status' column held; it's now called 'Setup'."""
    if is_pos_customer and is_eaglebe_active:
        return "EagleBe"
    if is_pos_customer:
        return "Park-O-Sign"
    return "Geen"


# 'Status' is not in the Excel. It tracks the state of a sold product
# (e.g. in behandeling / afgerond) and is maintained through the app, so
# a fresh import just seeds it empty.
DEFAULT_STATUS = ""


def main() -> None:
    if len(sys.argv) != 4:
        print("Usage: python import_excel.py <excel_path> <sqlite_db_path> <belgium_topology_json>")
        sys.exit(1)

    excel_path = Path(sys.argv[1])
    db_path = Path(sys.argv[2])
    topology_path = Path(sys.argv[3])
    db_path.parent.mkdir(parents=True, exist_ok=True)

    nis_lookup = build_nis_lookup(topology_path)

    df = pd.read_excel(excel_path, sheet_name="Gemeenten")
    df["is_pos_customer"] = df["POS klant?"].fillna("").eq("Ja")
    df["is_eaglebe_active"] = df["EagleBe actief?"].fillna("").eq("Ja")

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Drop + recreate so schema changes (like the added Setup/Status split)
    # take effect on re-run. EF Core's EnsureCreated() reads columns by name,
    # so this table stays compatible with the Municipality model.
    cur.execute("DROP TABLE IF EXISTS Municipalities")
    cur.execute("""
        CREATE TABLE Municipalities (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            RefnisCode TEXT,
            Region TEXT NOT NULL,
            Province TEXT NOT NULL,
            Name TEXT NOT NULL,
            PostalCodes TEXT NOT NULL DEFAULT '[]',
            IsPosCustomer INTEGER NOT NULL,
            IsEagleBeActive INTEGER NOT NULL,
            Setup TEXT NOT NULL,
            Status TEXT NOT NULL,
            LastUpdated TEXT NOT NULL
        )
    """)

    rows = []
    unmatched = []
    for _, row in df.iterrows():
        nis = find_nis(row["Gemeente"], nis_lookup)
        if nis is None:
            unmatched.append(row["Gemeente"])
        rows.append((
            nis,
            row["Gewest"],
            row["Provincie"],
            row["Gemeente"],
            parse_postal_codes(row["Postcode(s)"]),
            int(row["is_pos_customer"]),
            int(row["is_eaglebe_active"]),
            setup_for(row["is_pos_customer"], row["is_eaglebe_active"]),
            DEFAULT_STATUS,
        ))

    cur.executemany(
        """
        INSERT INTO Municipalities
            (RefnisCode, Region, Province, Name, PostalCodes, IsPosCustomer, IsEagleBeActive, Setup, Status, LastUpdated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """,
        rows,
    )

    conn.commit()
    count = cur.execute("SELECT COUNT(*) FROM Municipalities").fetchone()[0]
    matched_count = count - len(unmatched)
    print(f"Imported {count} municipalities into {db_path}")
    print(f"RefnisCode matched: {matched_count} / {count}")
    if unmatched:
        print("No NIS match found for (RefnisCode left NULL — add an alias to MANUAL_ALIASES):")
        for name in unmatched:
            print(" -", name)


if __name__ == "__main__":
    main()