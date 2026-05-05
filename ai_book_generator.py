import subprocess
import json
import logging
import os
import time

# Data Engineering Pipeline for Synthetic AI Book Generation
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("AI-Factory")

DB_PATH = '/root/NilamAutomationTools/books_library.json'

def generate_books(count=25):
    prompt = f"""
    You are an expert data engineer generating a synthetic but highly realistic dataset.
    Generate a JSON array of {count} books in Bahasa Melayu.
    Each object MUST have exactly these keys:
    - title: String (Creative and realistic Malay book title)
    - author: String (Realistic Malay author name)
    - publisher: String (Realistic Malay publisher name)
    - year: Number (between 2015 and 2024)
    - pages: Number (between 40 and 400)
    - categoryLabel: String (Must be strictly "Buku Fiksyen" or "Buku Bukan Fiksyen")
    - languageLabel: String (Must be strictly "Bahasa Melayu")
    - summary: String (A very realistic synopsis and lessons learned, between 30 and 60 words long)
    
    Output ONLY a valid raw JSON array. DO NOT include markdown blocks like ```json.
    """
    
    cmd = [
        '/root/.nvm/versions/node/v24.14.1/bin/node',
        '/root/.nvm/versions/node/v24.14.1/lib/node_modules/@google/gemini-cli/bundle/gemini.js',
        '-p', prompt
    ]
    try:
        logger.info(f"Calling Gemini CLI to synthesize {count} records...")
        env = os.environ.copy()
        env['HOME'] = '/root'
        env['USER'] = 'root'
        env['PATH'] = '/root/.nvm/versions/node/v24.14.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True, env=env)
        
        output = result.stdout.strip()
        
        # Clean markdown if present
        if output.startswith("```json"): output = output.replace("```json", "", 1)
        if output.startswith("```"): output = output.replace("```", "", 1)
        if output.endswith("```"): output = output[::-1].replace("```", "", 1)[::-1]
            
        output = output.strip()
        
        books = json.loads(output)
        if isinstance(books, list) and len(books) > 0:
            logger.info(f"Successfully generated {len(books)} books via LLM Inference.")
            return books
        else:
            logger.error("Parsed JSON is not a valid list of books.")
            return []
            
    except subprocess.CalledProcessError as e:
        logger.error(f"Gemini CLI execution failed: {e.stderr}")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM JSON output: {e}")
        logger.debug(f"Raw malformed output: {output}")
        return []

def update_database(new_books):
    if not new_books:
        logger.warning("No books generated. Skipping database update.")
        return
        
    try:
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            library = json.load(f)
    except Exception as e:
        logger.warning(f"Failed to read existing DB (might be corrupted/empty). Starting fresh. {e}")
        library = []
        
    # Prepend new books so they are consumed first by active sessions
    library = new_books + library
    
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(library, f, ensure_ascii=False, indent=2)
        
    logger.info(f"Updated JSON Datastore. New Total: {len(library)} records.")
    
    # Commit changes to trigger CDN/GitHub raw cache updates
    try:
        os.chdir('/root/NilamAutomationTools')
        subprocess.run(['git', 'add', 'books_library.json'], check=True, capture_output=True)
        subprocess.run(['git', 'commit', '-m', f"chore(data): Auto-generated {len(new_books)} new synthetic AI books"], check=True, capture_output=True)
        subprocess.run(['git', 'push', 'origin', 'main'], check=True, capture_output=True)
        logger.info("Successfully pushed Data Lake updates to GitHub Origin.")
    except subprocess.CalledProcessError as e:
        logger.error(f"Git push failed: {e.stderr}")

if __name__ == "__main__":
    logger.info("=== Starting AI Book Generator Pipeline ===")
    start_time = time.time()
    
    # Retry mechanism for resilience
    max_retries = 3
    books = []
    
    for attempt in range(max_retries):
        books = generate_books(20)
        if books:
            break
        logger.warning(f"Attempt {attempt+1}/{max_retries} failed. Retrying in 10s...")
        time.sleep(10)
        
    if books:
        update_database(books)
        
    duration = time.time() - start_time
    logger.info(f"=== Pipeline Complete in {duration:.2f}s ===")