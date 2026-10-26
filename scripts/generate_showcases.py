import os
from PIL import Image, ImageDraw, ImageFont

def get_fonts():
    try:
        font_mono_lg = ImageFont.truetype("arialbd.ttf", 22)
        font_mono_md = ImageFont.truetype("arialbd.ttf", 15)
        font_mono_sm = ImageFont.truetype("arialbd.ttf", 12)
        font_title = ImageFont.truetype("arial.ttf", 13)
        font_zh_title = ImageFont.truetype("msyhbd.ttc", 13)
        font_zh_body = ImageFont.truetype("msyh.ttc", 11)
        font_zh_tag = ImageFont.truetype("msyhbd.ttc", 11)
        font_zh_micro = ImageFont.truetype("msyh.ttc", 9)
    except:
        font_mono_lg = ImageFont.load_default()
        font_mono_md = font_mono_lg
        font_mono_sm = font_mono_lg
        font_title = font_mono_lg
        font_zh_title = font_mono_lg
        font_zh_body = font_mono_lg
        font_zh_tag = font_mono_lg
        font_zh_micro = font_mono_lg
    return {
        'lg': font_mono_lg,
        'md': font_mono_md,
        'sm': font_mono_sm,
        'title': font_title,
        'zh_title': font_zh_title,
        'zh_body': font_zh_body,
        'zh_tag': font_zh_tag,
        'zh_micro': font_zh_micro
    }

try:
    from scripts.generate_eye_showcase import create_work02_eye_showcase as create_work02
except ImportError:
    from generate_eye_showcase import create_work02_eye_showcase as create_work02

def create_work03():
    f = get_fonts()
    kaggle_img = Image.open('public/assets/kaggle-medals-record.png').convert('RGBA')
    
    canvas_w, canvas_h = 1000, 480
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (13, 17, 23, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Top header bar (40px)
    draw.rectangle([0, 0, canvas_w, 40], fill=(22, 27, 34, 255))
    draw.line([0, 40, canvas_w, 40], fill=(38, 53, 74, 255), width=1)
    
    draw.ellipse([16, 14, 26, 24], fill=(255, 95, 86, 255))
    draw.ellipse([34, 14, 44, 24], fill=(255, 189, 46, 255))
    draw.ellipse([52, 14, 62, 24], fill=(39, 201, 63, 255))
    
    draw.text((78, 13), "KAGGLE_STANDINGS :: FRONTIER_REASONING & LOW_RESOURCE_NLP", fill=(148, 163, 184, 255), font=f['title'])
    badge_text = "2x BRONZE MEDALS · VERIFIED"
    badge_bbox = f['sm'].getbbox(badge_text)
    badge_w = badge_bbox[2] - badge_bbox[0]
    badge_pad_x = 16
    badge_total_w = badge_w + (badge_pad_x * 2)
    badge_right = canvas_w - 16
    badge_left = badge_right - badge_total_w
    draw.rectangle([badge_left, 10, badge_right, 30], fill=(180, 83, 9, 255))
    draw.text((badge_left + badge_pad_x, 13), badge_text, fill=(255, 255, 255, 255), font=f['sm'])
    
    # Real Kaggle Card
    card_margin = 20
    card_w = canvas_w - (card_margin * 2)
    card_h = 266
    card_top = 54
    draw.rectangle([card_margin, card_top, card_margin + card_w, card_top + card_h], fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    
    k_target_w = card_w - 24
    k_target_h = int(kaggle_img.height * (k_target_w / kaggle_img.width))
    if k_target_h > card_h - 20:
        k_target_h = card_h - 20
        k_target_w = int(kaggle_img.width * (k_target_h / kaggle_img.height))
    
    k_resized = kaggle_img.resize((k_target_w, k_target_h), Image.Resampling.LANCZOS)
    k_x = card_margin + (card_w - k_target_w) // 2
    k_y = card_top + (card_h - k_target_h) // 2
    canvas.paste(k_resized, (k_x, k_y), k_resized if k_resized.mode == 'RGBA' else None)
    
    # 3 Summary Stat Pillars below
    b_top = card_top + card_h + 14
    b_h = 126
    col_w = (card_w - 24) // 3
    
    # Col 1: Deep Past
    draw.rectangle([card_margin, b_top, card_margin + col_w, b_top + b_h], fill=(16, 24, 39, 255), outline=(34, 47, 67, 255), width=1)
    draw.text((card_margin + 16, b_top + 12), "DEEP PAST AKKADIAN", fill=(148, 163, 184, 255), font=f['sm'])
    draw.text((card_margin + 16, b_top + 32), "Rank 141 / 2,674", fill=(251, 191, 36, 255), font=f['lg'])
    # Bronze badge box
    draw.rectangle([card_margin + 16, b_top + 68, card_margin + 160, b_top + 88], fill=(180, 83, 9, 255))
    draw.text((card_margin + 24, b_top + 71), "BRONZE · TOP 5.3%", fill=(255, 255, 255, 255), font=f['sm'])
    draw.text((card_margin + 16, b_top + 98), "阿卡德古语稀缺语料跨模态与 PEFT", fill=(148, 163, 184, 255), font=f['zh_body'])
    
    # Col 2: Nemotron
    col2_x = card_margin + col_w + 12
    draw.rectangle([col2_x, b_top, col2_x + col_w, b_top + b_h], fill=(16, 24, 39, 255), outline=(34, 47, 67, 255), width=1)
    draw.text((col2_x + 16, b_top + 12), "NVIDIA NEMOTRON REASONING", fill=(148, 163, 184, 255), font=f['sm'])
    draw.text((col2_x + 16, b_top + 32), "Rank 256 / 4,185", fill=(251, 191, 36, 255), font=f['lg'])
    # Bronze badge box
    draw.rectangle([col2_x + 16, b_top + 68, col2_x + 160, b_top + 88], fill=(180, 83, 9, 255))
    draw.text((col2_x + 24, b_top + 71), "BRONZE · TOP 6.1%", fill=(255, 255, 255, 255), font=f['sm'])
    draw.text((col2_x + 16, b_top + 98), "测试时推理搜索 (TTS) 与思维链剪枝", fill=(148, 163, 184, 255), font=f['zh_body'])

    # Col 3: KDD Cup
    col3_x = col2_x + col_w + 12
    draw.rectangle([col3_x, b_top, col3_x + col_w, b_top + b_h], fill=(16, 24, 39, 255), outline=(34, 47, 67, 255), width=1)
    draw.text((col3_x + 16, b_top + 12), "TAAC x KDD CUP 2026", fill=(148, 163, 184, 255), font=f['sm'])
    draw.text((col3_x + 16, b_top + 32), "Rank 160 / 1,873", fill=(56, 189, 248, 255), font=f['lg'])
    # Top 8.5% badge box
    draw.rectangle([col3_x + 16, b_top + 68, col3_x + 150, b_top + 88], fill=(3, 105, 161, 255))
    draw.text((col3_x + 24, b_top + 71), "GLOBAL TOP 8.5%", fill=(255, 255, 255, 255), font=f['sm'])
    draw.text((col3_x + 16, b_top + 98), "腾讯推荐多任务表征与大规模召回", fill=(148, 163, 184, 255), font=f['zh_body'])

    canvas.save('public/assets/work03-kaggle-showcase.png', 'PNG', optimize=True)
    print("Created work03-kaggle-showcase.png successfully!")

if __name__ == '__main__':
    create_work02()
    create_work03()
