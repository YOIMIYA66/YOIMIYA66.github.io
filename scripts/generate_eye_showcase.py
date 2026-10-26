import os
from PIL import Image, ImageDraw, ImageFont

def get_fonts():
    try:
        font_mono_lg = ImageFont.truetype("arialbd.ttf", 20)
        font_mono_md = ImageFont.truetype("arialbd.ttf", 14)
        font_mono_sm = ImageFont.truetype("arialbd.ttf", 11)
        font_title = ImageFont.truetype("arial.ttf", 13)
        font_zh_title = ImageFont.truetype("msyhbd.ttc", 13)
        font_zh_body = ImageFont.truetype("msyh.ttc", 11)
        font_zh_tag = ImageFont.truetype("msyhbd.ttc", 13)
        font_zh_micro = ImageFont.truetype("msyh.ttc", 10)
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

def create_work02_eye_showcase():
    f = get_fonts()
    raw_arch = Image.open('public/assets/eye-detection-architecture.png').convert('RGB')
    
    # 1. Cleanly crop out empty white padding on left (x<100) and right (x>1175)
    # Bounding box of content: (107, 67, 1167, 535)
    cropped_arch = raw_arch.crop((100, 60, 1175, 540)).convert('RGBA')
    
    # 2. Canvas setup (1100 x 640) - Spacious, breathable HUD showcase
    canvas_w, canvas_h = 1100, 640
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (13, 17, 23, 255)) # #0D1117 dark canvas
    draw = ImageDraw.Draw(canvas)
    
    # Top header bar (40px)
    draw.rectangle([0, 0, canvas_w, 40], fill=(22, 27, 34, 255))
    draw.line([0, 40, canvas_w, 40], fill=(38, 53, 74, 255), width=1)
    
    # Traffic dots
    draw.ellipse([16, 14, 26, 24], fill=(255, 95, 86, 255))
    draw.ellipse([34, 14, 44, 24], fill=(255, 189, 46, 255))
    draw.ellipse([52, 14, 62, 24], fill=(39, 201, 63, 255))
    
    draw.text((78, 13), "OPHTHALMIC_AI :: BILATERAL_RETINAL_MULTI_LABEL_DIAGNOSIS_SYSTEM", fill=(148, 163, 184, 255), font=f['title'])
    draw.rectangle([canvas_w - 240, 10, canvas_w - 16, 30], fill=(180, 83, 9, 255))
    draw.text((canvas_w - 230, 13), "CHALLENGE CUP · NATIONAL 1ST", fill=(255, 255, 255, 255), font=f['sm'])
    
    margin_x = 24
    inner_w = canvas_w - (margin_x * 2) # 1052px
    
    # === Section Header ===
    sec_top = 50
    draw.rectangle([margin_x, sec_top, margin_x + inner_w, sec_top + 28], fill=(16, 24, 39, 255))
    draw.text((margin_x + 12, sec_top + 6), "“明眸八极”双眼孪生权重共享卷积主干网络 (Weight-shared Twin CNN) 与特征交叉融合架构", fill=(56, 189, 248, 255), font=f['zh_title'])
    
    # === Main Architecture Card ===
    arch_card_top = sec_top + 28
    # Available height for card: 640 - 40 - 28 - 64 (bottom specs) - 24 = ~484px
    card_h = 470
    draw.rectangle([margin_x, arch_card_top, margin_x + inner_w, arch_card_top + card_h], fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    
    # Scale cropped architecture to fit cleanly inside white card with padding
    pad_x = 20
    pad_y = 12
    max_w = inner_w - (pad_x * 2) # 1012px
    max_h = card_h - (pad_y * 2)  # 446px
    
    scale = min(max_w / cropped_arch.width, max_h / cropped_arch.height)
    target_w = int(cropped_arch.width * scale)
    target_h = int(cropped_arch.height * scale)
    
    arch_resized = cropped_arch.resize((target_w, target_h), Image.Resampling.LANCZOS)
    paste_x = margin_x + (inner_w - target_w) // 2
    paste_y = arch_card_top + (card_h - target_h) // 2
    canvas.paste(arch_resized, (paste_x, paste_y), arch_resized if arch_resized.mode == 'RGBA' else None)
    
    # === Bottom Technical Specs Strip ===
    bar_top = arch_card_top + card_h + 12
    bar_h = 62
    draw.rectangle([margin_x, bar_top, margin_x + inner_w, bar_top + bar_h], fill=(16, 24, 39, 255), outline=(34, 47, 67, 255), width=1)
    
    col_w = inner_w // 4
    specs = [
        ("综合多病种诊断 AUC", "98.4% (Multi-label)", (56, 189, 248, 255)),
        ("多任务解耦诊断头", "8 类眼疾独立 Softmax", (251, 191, 36, 255)),
        ("双眼对称特征融合", "Cross-Eye Feature Fusion", (52, 211, 153, 255)),
        ("国家级权威认证", "第十九届“挑战杯”国赛一等奖", (248, 113, 113, 255))
    ]
    
    for i, (label, val, color) in enumerate(specs):
        cx = margin_x + (i * col_w)
        if i > 0:
            draw.line([cx, bar_top + 10, cx, bar_top + bar_h - 10], fill=(38, 53, 74, 255), width=1)
        draw.text((cx + 18, bar_top + 12), label, fill=(148, 163, 184, 255), font=f['zh_micro'])
        draw.text((cx + 18, bar_top + 33), val, fill=color, font=f['zh_tag'])
        
    canvas.save('public/assets/work02-vision-showcase.png', 'PNG', optimize=True)
    print("Created cropped work02-vision-showcase.png successfully!")

if __name__ == '__main__':
    create_work02_eye_showcase()
