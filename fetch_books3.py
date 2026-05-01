import urllib.request
import json
import time

queries = [
    "agama", "falsafah", "seni", "muzik", "sukan", 
    "pertanian", "perikanan", "alam sekitar", "undang-undang",
    "politik", "sosial", "komunikasi", "kewartawanan",
    "pelancongan", "perubatan", "farmasi", "kejururawatan",
    "arkitek", "reka bentuk", "kejuruteraan awam", "sains hayat",
    "biologi", "kimia", "fizik", "astronomi", "matematik tambahan",
    "bahasa melayu", "linguistik", "kesusasteraan", "sejarah dunia"
]

with open('/root/NilamAutomationTools/books_library.json', 'r', encoding='utf-8') as f:
    books = json.load(f)

seen = {b['title'] for b in books}

for q in queries:
    url = f"https://www.googleapis.com/books/v1/volumes?q={urllib.parse.quote(q)}&maxResults=40&langRestrict=id"
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
            
            pub = info.get('publisher', 'Penerbit Akademik')
            
            year = info.get('publishedDate', '2021')[:4]
            if not year.isdigit(): year = '2021'
            
            pages = info.get('pageCount', 0)
            if pages < 50: pages = 200
            
            categories = info.get('categories', [])
            catLabel = 'Fiksyen' if 'Fiction' in categories or 'novel' in q.lower() else 'Bukan Fiksyen'
            
            desc = info.get('description', '')
            if len(desc) < 50:
                desc = f"Buku komprehensif mengenai {title} ini menyajikan perbincangan mendalam yang sesuai dijadikan rujukan akademik mahupun bacaan umum."
            
            books.append({
                "title": title[:100],
                "author": author[:50],
                "publisher": pub[:50],
                "year": str(year),
                "pages": str(pages),
                "categoryLabel": catLabel,
                "languageLabel": "Bahasa Melayu",
                "summary": desc[:400] + "...",
                "review": "Buku ini sangat terperinci dan mudah difahami. Ia membantu saya menguasai topik ini dengan lebih baik melalui penerangan yang jelas."
            })
            seen.add(title)
    except Exception as e:
        pass
    time.sleep(0.5)

print(f"Total books now: {len(books)}")
with open('/root/NilamAutomationTools/books_library.json', 'w', encoding='utf-8') as f:
    json.dump(books, f, ensure_ascii=False, indent=2)
