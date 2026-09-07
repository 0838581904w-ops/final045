import os

cp874_to_byte = {}
for i in range(161, 256):
    try:
        char = bytes([i]).decode('cp874')
        cp874_to_byte[char] = i
    except:
        pass

# Add HTML5 extensions (Windows-1252 0x80-0x9F)
win1252_extras = {
    '\u20ac': 0x80, '\u201a': 0x82, '\u0192': 0x83, '\u201e': 0x84,
    '\u2026': 0x85, '\u2020': 0x86, '\u2021': 0x87, '\u02c6': 0x88,
    '\u2030': 0x89, '\u0160': 0x8a, '\u2039': 0x8b, '\u0152': 0x8c,
    '\u017d': 0x8e, '\u2018': 0x91, '\u2019': 0x92, '\u201c': 0x93,
    '\u201d': 0x94, '\u2022': 0x95, '\u2013': 0x96, '\u2014': 0x97,
    '\u02dc': 0x98, '\u2122': 0x99, '\u0161': 0x9a, '\u203a': 0x9b,
    '\u0153': 0x9c, '\u017e': 0x9e, '\u0178': 0x9f
}
cp874_to_byte.update(win1252_extras)
# Some Thai characters don't decode properly in python cp874 for 0xDB-0xDE etc. Let's force them.
for i in range(0xA1, 0xFC):
    char = chr(0x0E01 + i - 0xA1)
    cp874_to_byte[char] = i

def fix_text(text):
    bytes_out = bytearray()
    for char in text:
        if ord(char) < 128:
            bytes_out.append(ord(char))
        elif char in cp874_to_byte:
            bytes_out.append(cp874_to_byte[char])
        else:
            bytes_out.append(ord('?'))
    return bytes_out.decode('utf-8', errors='replace')

directory = 'c:/laragon/www/final'
for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Only fix if it seems corrupted (contains Thai characters mapped from utf-8 bytes, e.g. E0=à)
        if 'à¸' in content or 'à¹€' in content:
            fixed = fix_text(content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed)
            print(f'Fixed {filename}')
