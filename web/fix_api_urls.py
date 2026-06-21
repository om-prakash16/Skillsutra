import os
import re

def fix_api_urls(directory):
    pattern = re.compile(r'fetch\(`\$\{process\.env\.NEXT_PUBLIC_API_URL\}(/.*?)\`')
    pattern_or = re.compile(r'fetch\(`\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*"[^"]*"\}')
    
    count = 0
    for root, _, files in os.walk(directory):
        for file in files:
            if not file.endswith(('.ts', '.tsx')): continue
            filepath = os.path.join(root, file)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Simple replacement for `process.env.NEXT_PUBLIC_API_URL`/something
            # We want to replace it with just fetching relative or using fetchWithAuth if we can,
            # but an easy global fix is replacing `${process.env.NEXT_PUBLIC_API_URL}` with `/api/v1`
            # since the proxy maps `/api/v1` to the backend!
            
            new_content = content.replace('${process.env.NEXT_PUBLIC_API_URL}', '/api/v1')
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")
                count += 1
                
    print(f"Fixed {count} files.")

if __name__ == "__main__":
    fix_api_urls("src")
