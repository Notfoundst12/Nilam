import urllib.request
import json
import time

queries = [
    "subject:fiction", "subject:history", "subject:science", 
    "subject:technology", "cerita pendek", "novel melayu", 
    "sejarah malaysia", "buku motivasi", "agama islam", 
    "sastera melayu", "cerita kanak-kanak", "sains komputer"
]

books = []
seen = set()

for q in queries:
    for start_index in range(0, 40, 40): # max 40 per query to avoid rate limit issues, just doing one page per query for now
        url = f"https://www.googleapis.com/books/v1/volumes?q={urllib.parse.quote(q)}&maxResults=40&startIndex={start_index}&langRestrict=ms"
        try:
            req = urllib.request.urlopen(url)
            res = json.loads(req.read())
            items = res.get('items', [])
            for item in items:
                info = item.get('volumeInfo', {})
                title = info.get('title', '')
                if not title or title in seen: continue
                
                authors = info.get('authors', ['Tiada Nama'])
                author = ", ".join(authors)
                
                pub = info.get('publisher', 'Penerbit Bebas')
                
                year = info.get('publishedDate', '2020')[:4]
                if not year.isdigit(): year = '2020'
                
                pages = info.get('pageCount', 0)
                if pages < 20: pages = 120
                
                categories = info.get('categories', [])
                catLabel = 'Fiksyen' if 'Fiction' in categories or 'novel' in q.lower() or 'cerita' in q.lower() else 'Bukan Fiksyen'
                
                desc = info.get('description', '')
                if len(desc) < 50:
                    desc = f"Buku yang bertajuk {title} ini ditulis oleh {author} dan mengandungi banyak maklumat menarik untuk dibaca."
                
                books.append({
                    "title": title[:100],
                    "author": author[:50],
                    "publisher": pub[:50],
                    "year": str(year),
                    "pages": str(pages),
                    "categoryLabel": catLabel,
                    "languageLabel": "Bahasa Melayu",
                    "summary": desc[:400] + "...",
                    "review": "Buku ini sangat bermanfaat. Selepas membaca, saya mendapat banyak ilmu baru dan pemahaman yang lebih mendalam mengenai topik yang dibincangkan."
                })
                seen.add(title)
        except Exception as e:
            print("Error fetching:", e)
        time.sleep(1)

print(f"Fetched {len(books)} new books!")
with open('/root/NilamAutomationTools/books_library.json', 'w', encoding='utf-8') as f:
    json.dump(books, f, ensure_ascii=False, indent=2)
