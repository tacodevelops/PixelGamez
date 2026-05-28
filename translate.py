import re
from deep_translator import GoogleTranslator  # pyrefly: ignore [missing-import]

keys_to_translate = {}

# Auto-extract games from data.ts to translate their titles and descriptions
with open('c:/Users/dahir/Documents/pixelgamez/lib/data.ts', 'r', encoding='utf-8') as f:
    data_content = f.read()

game_blocks = re.findall(r"\{\s*id:\s*['\"]([^'\"]+)['\"],\s*title:\s*['\"]([^'\"]+)['\"],\s*description:\s*['\"]([^'\"]+)['\"]", data_content)
for game_id, title, desc in game_blocks:
    keys_to_translate[f"game_{game_id}_title"] = title
    keys_to_translate[f"game_{game_id}_desc"] = desc

def process_translation():
    import sys
    import time
    
    keys = list(keys_to_translate.keys())
    english_texts = [keys_to_translate[k] for k in keys]
    
    with open('c:/Users/dahir/Documents/pixelgamez/lib/translations.ts', 'r', encoding='utf-8') as f:
        file_content = f.read()

    langs = ['ru', 'uk', 'es', 'pt', 'id', 'tl', 'ko', 'ja', 'zh', 'fi', 'sv', 'no', 'da', 'de', 'pl', 'ro', 'it', 'fr', 'th', 'vi', 'ar', 'tr', 'hi', 'nl', 'el', 'ms', 'hu', 'cs']
    
    for lang in langs:
        print(f"Translating for {lang}...", flush=True)
        target_lang = 'zh-CN' if lang == 'zh' else lang
        
        # Check if already translated
        pattern = r'\b' + lang + r':\s*\{([^}]+)\}'
        match = re.search(pattern, file_content)
        if not match: continue
        
        existing_body = match.group(1).rstrip()
        if 'game_' in existing_body and existing_body.count('game_') > 100:
            print(f"{lang} already has game translations, skipping.", flush=True)
            continue
            
        new_entries = []
        translator = GoogleTranslator(source='en', target=target_lang)
        
        for k in keys:
            try:
                translated = translator.translate(keys_to_translate[k])
                translated_str = str(translated).replace('"', '\\"') if translated else keys_to_translate[k]
                new_entries.append(f'{k}: "{translated_str}"')
            except Exception as e:
                new_entries.append(f'{k}: "{keys_to_translate[k]}"')
            time.sleep(0.3)
            
        if not existing_body.endswith(','):
            existing_body += ','
            
        new_body = existing_body + '\n    ' + ',\n    '.join(new_entries) + '\n  '
        new_block = f"{lang}: {{{new_body}}}"
        file_content = re.sub(pattern, new_block, file_content)
        
        with open('c:/Users/dahir/Documents/pixelgamez/lib/translations.ts', 'w', encoding='utf-8') as f:
            f.write(file_content)
        print(f"Saved {lang} successfully!", flush=True)
        time.sleep(2)

process_translation()
print("Done translating everything!", flush=True)
