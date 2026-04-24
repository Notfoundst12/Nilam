"""
Generate NILAM Console Auto-Fill Script
Membaca books.csv dan menjana nilam_console_output.js
yang boleh di-paste terus ke DevTools Console.
"""
import json
import sys
from pathlib import Path

CSV_PATH = Path(__file__).parent / "books.csv"
TEMPLATE_PATH = Path(__file__).parent / "nilam_auto.js"
OUTPUT_PATH = Path(__file__).parent / "nilam_console_output.js"

REQUIRED_COLS = ["Title", "Language", "Year", "Author", "Publisher", "Type", "Pages", "Summary", "Activity"]

FILLER = (
    " Buku ini sangat bermanfaat dan memberi pengajaran yang baik"
    " untuk diamalkan dalam kehidupan harian."
)


def pad_words(text, min_words=20):
    t = str(text or "").strip()
    while len(t.split()) < min_words:
        t += FILLER
    return t.strip()


def to_int(val, default):
    try:
        return max(1, int(float(str(val).strip())))
    except (TypeError, ValueError):
        return default


def normalize(row):
    lang_raw = str(row.get("Language", "")).strip().upper()
    cat_raw = str(row.get("Type", "")).strip().lower()
    activity = str(row.get("Activity", "")).strip()
    summary = pad_words(row.get("Summary", "") or "Buku ini menarik.")

    if "bukan" in cat_raw and "fiksyen" in cat_raw:
        cat_label = "Bukan Fiksyen"
    elif "fiksyen" in cat_raw:
        cat_label = "Fiksyen"
    else:
        cat_label = "Bukan Fiksyen"

    lang_label = (
        "Bahasa Inggeris"
        if lang_raw in {"BI", "EN", "ENG", "ENGLISH"}
        else "Bahasa Melayu"
    )

    review = pad_words(
        f"Selepas membaca buku ini, saya menjalankan aktiviti {activity}."
        if activity
        else "Selepas membaca buku ini, saya memperoleh banyak ilmu dan nilai murni."
    )

    return {
        "title": str(row.get("Title", "")).strip(),
        "author": str(row.get("Author", "")).strip() or "Tidak Diketahui",
        "publisher": str(row.get("Publisher", "")).strip() or "Penerbit Umum",
        "year": str(to_int(row.get("Year"), 2020)),
        "pages": str(max(20, to_int(row.get("Pages"), 50))),
        "categoryLabel": cat_label,
        "languageLabel": lang_label,
        "summary": summary,
        "review": review,
    }


def load_csv(path):
    import csv

    with open(path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        missing = [c for c in REQUIRED_COLS if c not in reader.fieldnames]
        if missing:
            print(f"RALAT: Kolum hilang dalam CSV: {', '.join(missing)}")
            sys.exit(1)
        rows = [normalize(r) for r in reader]
    books = [b for b in rows if b["title"]]
    if not books:
        print("RALAT: Tiada buku sah dalam CSV.")
        sys.exit(1)
    return books


def generate(books):
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    books_json = json.dumps(books, ensure_ascii=False, indent=2)
    return template.replace("__BOOKS_JSON__", books_json)


def main():
    csv_path = Path(sys.argv[1]) if len(sys.argv) > 1 else CSV_PATH
    books = load_csv(csv_path)

    script = generate(books)
    OUTPUT_PATH.write_text(script, encoding="utf-8")

    print(f"Berjaya jana: {OUTPUT_PATH}")
    print(f"Jumlah buku: {len(books)}")
    print()
    for i, b in enumerate(books, 1):
        print(f"  {i}. {b['title']} ({b['categoryLabel']}, {b['languageLabel']})")
    print()
    print("ARAHAN:")
    print("  1. Login ke https://ains.moe.gov.my")
    print("  2. Buka DevTools (F12) -> Console")
    print(f"  3. Salin & paste kandungan {OUTPUT_PATH}")
    print("  4. Tekan Enter")


if __name__ == "__main__":
    main()
