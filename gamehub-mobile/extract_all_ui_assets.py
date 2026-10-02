import os
import numpy as np
from PIL import Image
from scipy import ndimage

BASE_DIR = r'e:\game-zone\gamehub-mobile\assets\game\ui'
DOCS_DIR = r'e:\game-zone\docs\ui game\Pattern Break -6'

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def extract_asset_clean(image_crop, pad=10):
    """
    Given a PIL Image crop containing an asset surrounded by black background,
    use perimeter flood-fill to remove only external black pixels, preserving
    all internal black lines, text, textures, and outer glow.
    """
    arr = np.array(image_crop)
    h, w = arr.shape[:2]
    
    # Identify dark background pixels
    is_dark = np.max(arr, axis=2) < 28
    labeled, num_features = ndimage.label(is_dark)
    
    # Outer border mask
    border = np.zeros((h, w), dtype=bool)
    border[0, :] = True
    border[-1, :] = True
    border[:, 0] = True
    border[:, -1] = True
    
    # Labels touching the border are true background
    bg_labels = np.unique(labeled[border & is_dark])
    bg_mask = np.isin(labeled, bg_labels)
    fg_mask = ~bg_mask
    
    # Find bounding box of foreground
    objs = ndimage.find_objects(fg_mask)
    if not objs:
        # Fallback if nothing found
        return image_crop.convert('RGBA')
    
    y_min = min(s[0].start for s in objs if s is not None)
    y_max = max(s[0].stop for s in objs if s is not None)
    x_min = min(s[1].start for s in objs if s is not None)
    x_max = max(s[1].stop for s in objs if s is not None)
    
    # Add padding
    y_min = max(0, y_min - pad)
    y_max = min(h, y_max + pad)
    x_min = max(0, x_min - pad)
    x_max = min(w, x_max + pad)
    
    sub_rgb = arr[y_min:y_max, x_min:x_max]
    sub_fg = fg_mask[y_min:y_max, x_min:x_max]
    
    # Alpha computation: smooth glow gradient at edges
    brightness = np.max(sub_rgb, axis=2) / 255.0
    alpha = np.zeros(sub_fg.shape, dtype=np.float32)
    alpha[sub_fg] = np.clip(brightness[sub_fg] * 3.5, 0.0, 1.0)
    
    # Solid core
    core = ndimage.binary_erosion(sub_fg, iterations=2)
    alpha[core] = 1.0
    
    # Gaussian feathering
    alpha = ndimage.gaussian_filter(alpha, sigma=0.7)
    alpha = (np.clip(alpha, 0.0, 1.0) * 255).astype(np.uint8)
    
    rgba = np.dstack([sub_rgb, alpha])
    return Image.fromarray(rgba, 'RGBA')

# ==========================================
# 1. NAVIGATION ICONS (Glowing Fantasy)
# ==========================================
print("Extracting Navigation Icons...")
nav_path = os.path.join(DOCS_DIR, 'Glowing Fantasy Game Menu Icons.png')
im_nav = Image.open(nav_path)
w_nav, h_nav = im_nav.size
col_w = w_nav // 4

nav_dir = os.path.join(BASE_DIR, 'navigation')
ensure_dir(nav_dir)

nav_map = ['home.png', 'play.png', 'progress.png', 'profile.png']
for i, name in enumerate(nav_map):
    crop = im_nav.crop((i * col_w, 0, (i + 1) * col_w, h_nav))
    clean_im = extract_asset_clean(crop, pad=12)
    clean_im.save(os.path.join(nav_dir, name))
    print(f"  Saved navigation/{name} ({clean_im.size})")

# ==========================================
# 2. BUTTONS & ACTIONS (Spacious Sci-Fi)
# ==========================================
print("\nExtracting Spacious Sci-Fi Buttons...")
sheet_fn = [f for f in os.listdir(DOCS_DIR) if 'Spacious' in f][0]
im_btn = Image.open(os.path.join(DOCS_DIR, sheet_fn))
arr_btn = np.array(im_btn)

# Detect button rows
bright = np.max(arr_btn, axis=2) > 25
labeled, _ = ndimage.label(bright)
objs = ndimage.find_objects(labeled)
large_objs = []
for s in objs:
    if s is None: continue
    dy = s[0].stop - s[0].start
    dx = s[1].stop - s[1].start
    if dx * dy > 3000 and dx > 60 and dy > 40:
        large_objs.append((s[1].start, s[0].start, s[1].stop, s[0].stop, dx, dy))

large_objs.sort(key=lambda b: (b[1] + b[3]) // 2)

rows = []
curr_row = []
curr_y = -1
for b in large_objs:
    mid_y = (b[1] + b[3]) // 2
    if curr_y == -1 or abs(mid_y - curr_y) < 35:
        curr_row.append(b)
        curr_y = mid_y
    else:
        curr_row.sort(key=lambda x: x[0])
        rows.append(curr_row)
        curr_row = [b]
        curr_y = mid_y
if curr_row:
    curr_row.sort(key=lambda x: x[0])
    rows.append(curr_row)

# Define exact mapping of rows to folders & filenames
actions_dir = os.path.join(BASE_DIR, 'actions')
diff_dir = os.path.join(BASE_DIR, 'difficulty')
gameplay_dir = os.path.join(BASE_DIR, 'gameplay')
pattern_dir = os.path.join(BASE_DIR, 'pattern')
states_dir = os.path.join(BASE_DIR, 'states')

for d in [actions_dir, diff_dir, gameplay_dir, pattern_dir, states_dir]:
    ensure_dir(d)

btn_mapping = {
    # Row 1 (Large CTAs)
    (0, 0): (actions_dir, 'play-now.png'),
    (0, 1): (actions_dir, 'continue.png'),
    (0, 2): (actions_dir, 'start.png'),
    (0, 3): (actions_dir, 'challenge.png'),
    # Row 2
    (1, 0): (actions_dir, 'next.png'),
    (1, 1): (actions_dir, 'play-again.png'),
    (1, 2): (actions_dir, 'resume.png'),
    (1, 3): (actions_dir, 'exit.png'),
    # Row 3
    (2, 0): (actions_dir, 'back.png'),
    (2, 1): (actions_dir, 'retry.png'),
    (2, 2): (actions_dir, 'restart.png'),
    (2, 3): (actions_dir, 'skip.png'),
    (2, 4): (actions_dir, 'claim.png'),
    (2, 5): (actions_dir, 'ok.png'),
    # Row 4
    (3, 0): (actions_dir, 'select.png'),
    (3, 1): (actions_dir, 'confirm.png'),
    (3, 2): (actions_dir, 'cancel.png'),
    (3, 3): (actions_dir, 'remove.png'),
    (3, 4): (actions_dir, 'apply.png'),
    (3, 5): (actions_dir, 'save.png'),
    # Row 5 (Difficulty + Gameplay Power-Ups)
    (4, 0): (diff_dir, 'easy.png'),
    (4, 1): (diff_dir, 'medium.png'),
    (4, 2): (diff_dir, 'hard.png'),
    (4, 3): (gameplay_dir, 'clue.png'),
    (4, 4): (gameplay_dir, 'reveal.png'),
    (4, 5): (gameplay_dir, 'freeze.png'),
    (4, 6): (gameplay_dir, 'scan.png'),
    # Row 6 (Button Nav & Toggles)
    (5, 0): (actions_dir, 'btn-home.png'),
    (5, 1): (actions_dir, 'btn-play.png'),
    (5, 2): (actions_dir, 'btn-progress.png'),
    (5, 3): (actions_dir, 'btn-profile.png'),
    (5, 4): (actions_dir, 'sound.png'),
    (5, 5): (actions_dir, 'music.png'),
    (5, 6): (actions_dir, 'vibration.png'),
    # Row 7 (Pattern Types)
    (6, 0): (pattern_dir, 'number.png'),
    (6, 1): (pattern_dir, 'shape.png'),
    (6, 2): (pattern_dir, 'color.png'),
    (6, 3): (pattern_dir, 'count.png'),
    (6, 4): (pattern_dir, 'direction.png'),
    (6, 5): (pattern_dir, 'mixed.png'),
    (6, 6): (pattern_dir, 'random.png'),
    # Row 8 (Button States)
    (7, 0): (states_dir, 'default.png'),
    (7, 1): (states_dir, 'pressed.png'),
    (7, 2): (states_dir, 'loading.png'),
    (7, 3): (states_dir, 'disabled.png'),
    (7, 4): (states_dir, 'success.png'),
    (7, 5): (states_dir, 'danger.png'),
    (7, 6): (states_dir, 'warning.png'),
    (7, 7): (states_dir, 'info.png'),
}

for (r_idx, b_idx), (target_dir, fn) in btn_mapping.items():
    if r_idx < len(rows) and b_idx < len(rows[r_idx]):
        x1, y1, x2, y2, dx, dy = rows[r_idx][b_idx]
        crop = im_btn.crop((max(0, x1-15), max(0, y1-15), min(im_btn.size[0], x2+15), min(im_btn.size[1], y2+15)))
        clean_im = extract_asset_clean(crop, pad=10)
        out_file = os.path.join(target_dir, fn)
        clean_im.save(out_file)
        rel_dir = os.path.basename(target_dir)
        print(f"  Saved {rel_dir}/{fn} ({clean_im.size})")

# ==========================================
# 3. ICONS (Neon Fantasy Game UI Icon Sheet)
# ==========================================
print("\nExtracting Neon Fantasy UI Icons...")
icons_path = os.path.join(DOCS_DIR, 'Neon Fantasy Game UI Icon Sheet.png')
im_icons = Image.open(icons_path)
arr_icons = np.array(im_icons)

bright = np.max(arr_icons, axis=2) > 25
labeled, _ = ndimage.label(bright)
objs = ndimage.find_objects(labeled)
large_objs = []
for s in objs:
    if s is None: continue
    dy = s[0].stop - s[0].start
    dx = s[1].stop - s[1].start
    if dx > 80 and dy > 80 and dx * dy > 8000:
        large_objs.append((s[1].start, s[0].start, s[1].stop, s[0].stop, dx, dy))

large_objs.sort(key=lambda b: (b[1] // 200, b[0]))

icons_dir = os.path.join(BASE_DIR, 'icons')
ensure_dir(icons_dir)

icon_names = [
    # Row 1
    'home.png', 'play.png', 'pause.png', 'settings.png', 'profile.png',
    'stats.png', 'trophy.png', 'calendar.png', 'rank.png', 'search.png',
    # Row 2
    'upgrade.png', 'gift.png', 'shop.png', 'battle.png', 'crown.png',
    'star.png', 'energy.png', 'heart.png', 'coin.png', 'gem.png',
    # Row 3
    'help.png', 'alert.png', 'danger.png', 'success.png', 'lock.png',
    'unlock.png', 'sound.png', 'music.png', 'shuffle.png', 'target.png'
]

for idx, (x1, y1, x2, y2, dx, dy) in enumerate(large_objs):
    if idx < len(icon_names):
        fn = icon_names[idx]
        crop = im_icons.crop((max(0, x1-15), max(0, y1-15), min(im_icons.size[0], x2+15), min(im_icons.size[1], y2+15)))
        clean_im = extract_asset_clean(crop, pad=8)
        out_file = os.path.join(icons_dir, fn)
        clean_im.save(out_file)
        print(f"  Saved icons/{fn} ({clean_im.size})")

print("\nALL UI ASSETS EXTRACTED SUCCESSFULLY!")
