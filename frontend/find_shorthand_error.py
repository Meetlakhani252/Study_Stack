import os
import re

# Regex to find { ... key = value ... }
# We look for { followed by any chars that don't include : or }
# and then an = sign.
pattern = re.compile(r'\{[^:}]*=[^}]*\}')

def check_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f, 1):
            if pattern.search(line):
                # Exclude common false positives
                if '=>' not in line and ' onClick=' not in line and ' onChange=' not in line and ' onClose=' not in line and ' onRefresh=' not in line and ' onTopicsUpdated=' not in line and ' onTopicsAdded=' not in line and ' onKeyDown=' not in line and ' onSubmit=' not in line and ' ref=' not in line and ' className=' not in line and ' value=' not in line and ' disabled=' not in line and ' key=' not in line and ' type=' not in line and ' placeholder=' not in line and ' rows=' not in line and ' maxLength=' not in line and ' style=' not in line:
                    print(f"{path}:{i}: {line.strip()}")

for root, dirs, files in os.walk('.'):
    if '.next' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            try:
                check_file(os.path.join(root, file))
            except:
                pass
