import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'utcnow' not in content:
        return
    
    # Replace datetime.now(timezone.utc) with datetime.now(timezone.utc)
    # and datetime.datetime.now(timezone.utc) with datetime.datetime.now(timezone.utc)
    content = re.sub(r'datetime\.utcnow\(\)', 'datetime.now(timezone.utc)', content)
    content = re.sub(r'datetime\.datetime\.utcnow\(\)', 'datetime.datetime.now(timezone.utc)', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk('e:/Project/Ram/server'):
    for file in files:
        if file.endswith('.py') and 'venv' not in root and 'site-packages' not in root and file != 'upgrade_pydantic.py':
            process_file(os.path.join(root, file))
print("Datetime UTC upgrade complete.")
