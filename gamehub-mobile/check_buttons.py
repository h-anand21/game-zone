import os
from PIL import Image
import pytesseract

btn_dir = r'e:\game-zone\gamehub-mobile\assets\game\path-mind\buttons'
found = 0
for f in sorted(os.listdir(btn_dir)):
    if f.endswith('.png'):
        p = os.path.join(btn_dir, f)
        im = Image.open(p)
        text = pytesseract.image_to_string(im).strip().replace('\n', ' ')
        print(f'{f} ({im.size}): "{text}"')
        if text:
            found += 1

print(f'Total buttons with text: {found}')
