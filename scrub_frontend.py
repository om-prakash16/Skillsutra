import os
import re

directories = [
    r"e:\Project\Ram\web\src"
]

def scrub_web3(text):
    # Web3 / NFT replacements
    text = re.sub(r'\bNFTs?\b', 'Verifications', text, flags=re.IGNORECASE)
    text = re.sub(r'\bblockchain\b', 'infrastructure', text, flags=re.IGNORECASE)
    text = re.sub(r'\bSolana\b', 'Cloud', text, flags=re.IGNORECASE)
    text = re.sub(r'\bon-chain\b', 'platform', text, flags=re.IGNORECASE)
    text = re.sub(r'\bWeb3\b', 'NextGen', text, flags=re.IGNORECASE)
    text = re.sub(r'\bminting\b', 'issuing', text, flags=re.IGNORECASE)
    text = re.sub(r'\bmint\b', 'issue', text, flags=re.IGNORECASE)
    text = re.sub(r'\bwallet\b', 'account', text, flags=re.IGNORECASE)
    text = re.sub(r'\bcrypto\b', 'secure', text, flags=re.IGNORECASE)
    
    # And replace "Verified Identity" string literals if possible?
    # Actually, we can just replace the string "Verified Identity" with "SkillProof AI" everywhere as a hardcoded fallback 
    # instead of doing `getVal("global", "site_name", "SkillProof AI")` because some places aren't React components.
    text = re.sub(r'Verified Identity', 'SkillProof AI', text)
    return text

for d in directories:
    for root, dirs, files in os.walk(d):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                new_content = scrub_web3(content)
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Scrubbed {path}")
