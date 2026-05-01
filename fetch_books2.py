import urllib.request
import json
import time

queries = [
    "pendidikan", "kesehatan", "ekonomi", "psikologi", 
    "budaya", "teknologi", "komputer", "matematik", 
    "sains", "kejuruteraan", "motivasi diri", "keusahawanan",
    "sejarah", "geografi", "masakan", "novel remaja",
    "sastera", "pengurusan", "pemasaran", "perniagaan"
]

with open('/root/NilamAutomationTools/books_library.json', 'r', encoding='utf-8') as f:
    books = json.load(f)

seen = {b['title'] for b in books}

for q in queries:
    for lang in ['ms', 'id']:
        url = f"https://www.googleapis.com/books/v1/volumes?q={urllib.parse.quote(q)}&maxResults=40&langRestrict={lang}"
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
                
                pub = info.get('publisher', 'Penerbit Ilmu')
                
                year = info.get('publishedDate', '2020')[:4]
                if not year.isdigit(): year = '2020'
                
                pages = info.get('pageCount', 0)
                if pages < 50: pages = 150
                
                categories = info.get('categories', [])
                catLabel = 'Fiksyen' if 'Fiction' in categories or 'novel' in q.lower() or 'cerita' in q.lower() else 'Bukan Fiksyen'
                
                desc = info.get('description', '')
                if len(desc) < 50:
                    desc = f"Buku yang bertajuk {title} ini membincangkan pelbagai aspek menarik berkaitan dengan {q}. Penulisannya padat dan mudah difahami."
                
                books.append({
                    "title": title[:100],
                    "author": author[:50],
                    "publisher": pub[:50],
                    "year": str(year),
                    "pages": str(pages),
                    "categoryLabel": catLabel,
                    "languageLabel": "Bahasa Melayu",
                    "summary": desc[:400] + "...",
                    "review": "Selepas membaca buku ini, pengetahuan saya bertambah luas. Isi kandungannya sangat bermanfaat dan memberi banyak inspirasi kepada pembaca."
                })
                seen.add(title)
        except Exception as e:
            pass
        time.sleep(0.5)

print(f"Total books now: {len(books)}")
with open('/root/NilamAutomationTools/books_library.json', 'w', encoding='utf-8') as f:
    json.dump(books, f, ensure_ascii=False, indent=2)
