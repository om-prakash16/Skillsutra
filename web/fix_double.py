import os

def fix_double_api_v1(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if not file.endswith(('.ts', '.tsx')): continue
            filepath = os.path.join(root, file)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content.replace('/api/v1/api/v1', '/api/v1')
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")

if __name__ == "__main__":
    fix_double_api_v1("src")
