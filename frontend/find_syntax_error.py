import os
import re

def check_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        # Look for { something = something } but not arrow functions
        # This is a naive check but might help
        matches = re.finditer(r'\{([^}]*?)=\s*[^}]*\}', content)
        for match in matches:
            line_content = match.group(0)
            if '=>' not in line_content and ' : ' not in line_content and ' : ' not in line_content:
                # Check if it's a JSX attribute
                if ' onClick=' not in line_content and ' onChange=' not in line_content and ' onClose=' not in line_content and ' onRefresh=' not in line_content and ' onTopicsUpdated=' not in line_content and ' onTopicsAdded=' not in line_content and ' onKeyDown=' not in line_content and ' onSubmit=' not in line_content and ' ref=' not in line_content and ' className=' not in line_content and ' value=' not in line_content and ' disabled=' not in line_content and ' key=' not in line_content and ' type=' not in line_content and ' placeholder=' not in line_content and ' rows=' not in line_content and ' maxLength=' not in line_content and ' style=' not in line_content:
                    print(f"Potential error in {path}: {line_content}")

for root, dirs, files in os.walk('.'):
    if '.next' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            try:
                check_file(os.path.join(root, file))
            except:
                pass
