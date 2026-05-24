import os
import re

search_dir = r"e:\Project\Ram"

replacements = [
    (re.compile(r'\bblockchain\b', re.IGNORECASE), "blockchain"),
    (re.compile(r'\bBlockchain\b', re.IGNORECASE), "Blockchain"),
    (re.compile(r'\bBLOCKCHAIN\b', re.IGNORECASE), "BLOCKCHAIN")
]

for root, dirs, files in os.walk(search_dir):
    # skip venv, node_modules, .git, .next
    if any(ignore in root for ignore in [".git", "node_modules", "venv", ".next", "__pycache__"]):
        continue

    for file in files:
        # Ignore binary or large log files, just stick to text/code
        if file.endswith(('.py', '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.sql', '.yml', '.yaml', '.txt')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original = content
                
                # Case-preserving replace
                # A simple naive string replace is usually safer than regex, but we want to handle capitalization
                # Let's just do a string replace since 'blockchain' is distinct
                content = content.replace("Blockchain", "Blockchain")
                content = content.replace("blockchain", "blockchain")
                content = content.replace("BLOCKCHAIN", "BLOCKCHAIN")
                    
                if content != original:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Cleaned {filepath}")
            except Exception as e:
                # ignore read errors
                pass
