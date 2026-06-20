import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If no 'class Config:' and no 'example=' in Field, skip
    if 'class Config:' not in content and 'example=' not in content:
        return

    # Check if we need to import ConfigDict
    needs_config_dict = 'class Config:' in content and 'ConfigDict' not in content
    
    # Replace class Config:
    # We look for:
    #     class Config:
    #         orm_mode = True
    
    content = re.sub(
        r'([ \t]+)class Config:\n[ \t]+orm_mode = True',
        r'\1model_config = ConfigDict(from_attributes=True)',
        content
    )
    
    # Replace other Configs without orm_mode?
    content = re.sub(
        r'([ \t]+)class Config:\n[ \t]+arbitrary_types_allowed = True',
        r'\1model_config = ConfigDict(arbitrary_types_allowed=True)',
        content
    )
    
    # Replace example= inside Field
    # Field(..., json_schema_extra={"example": "..."}) -> Field(..., json_schema_extra={"example": "..."})
    content = re.sub(
        r'Field\(([^,]+),\s*example=("[^"]+")\)',
        r'Field(\1, json_schema_extra={"example": \2})',
        content
    )

    # Insert ConfigDict import if needed
    if needs_config_dict and 'ConfigDict' in content:
        # try to add it to from pydantic import ...
        if 'from pydantic import BaseModel' in content:
            content = content.replace('from pydantic import BaseModel', 'from pydantic import BaseModel, ConfigDict')
        elif 'from pydantic import' in content:
            # find first from pydantic import and append
            content = re.sub(r'(from pydantic import [^\n]+)', r'\1, ConfigDict', content, count=1)
        else:
            content = 'from pydantic import ConfigDict\n' + content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk('e:/Project/Ram/server'):
    for file in files:
        if file.endswith('.py') and 'venv' not in root and 'site-packages' not in root:
            process_file(os.path.join(root, file))
print("Pydantic upgrade complete.")
