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
    eye_arch = Image.open('public/assets/eye-detection-architecture.png').convert('RGBA')
    samples_img = Image.open('public/assets/eye-detection-samples.png').convert('RGBA')
    
    # Clean, breathable canvas 1100 x 740
    canvas_w, canvas_h = 1100, 740
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (13, 17, 23, 255)) # #0D1117
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
    
    # === Section 01: Architecture Diagram ===
    sec1_top = 50
    draw.rectangle([margin_x, sec1_top, margin_x + inner_w, sec1_top + 28], fill=(16, 24, 39, 255))
    draw.text((margin_x + 12, sec1_top + 6), "01 · 双眼孪生权重共享主干网络 (Weight-shared Backbone) 与高层特征交叉融合架构", fill=(56, 189, 248, 255), font=f['zh_title'])
    
    arch_card_top = sec1_top + 28
    arch_img_w = inner_w
    arch_img_h = int(eye_arch.height * (arch_img_w / eye_arch.width))
    if arch_img_h > 310:
        arch_img_h = 310
        arch_img_w = int(eye_arch.width * (arch_img_h / eye_arch.height))
    
    arch_resized = eye_arch.resize((arch_img_w, arch_img_h), Image.Resampling.LANCZOS)
    arch_x = margin_x + (inner_w - arch_img_w) // 2
    
    # White card container
    draw.rectangle([margin_x, arch_card_top, margin_x + inner_w, arch_card_top + arch_img_h + 8], fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    canvas.paste(arch_resized, (arch_x, arch_card_top + 4), arch_resized if arch_resized.mode == 'RGBA' else None)
    
    # === Section 02: Real Retinal Disease Samples ===
    sec2_top = arch_card_top + arch_img_h + 18
    draw.rectangle([margin_x, sec2_top, margin_x + inner_w, sec2_top + 28], fill=(16, 24, 39, 255))
    draw.text((margin_x + 12, sec2_top + 6), "02 · 真实临床 8 类眼底视网膜病灶切片对照 (Clinical 8-Class Retinal Benchmark)", fill=(52, 211, 153, 255), font=f['zh_title'])
    
    # Perfect crop for Row 4 + labels (y: 520 to 804)
    crop_samples = samples_img.crop((40, 520, 1227, 804))
    
    samples_card_top = sec2_top + 28
    samples_target_w = inner_w - 60
    samples_target_h = int(crop_samples.height * (samples_target_w / crop_samples.width))
    if samples_target_h > 185:
        samples_target_h = 185
        samples_target_w = int(crop_samples.width * (samples_target_h / crop_samples.height))
        
    samples_resized = crop_samples.resize((samples_target_w, samples_target_h), Image.Resampling.LANCZOS)
    s_x = margin_x + (inner_w - samples_target_w) // 2
    
    # White card container for samples
    draw.rectangle([margin_x, samples_card_top, margin_x + inner_w, samples_card_top + samples_target_h + 8], fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    canvas.paste(samples_resized, (s_x, samples_card_top + 4), samples_resized if samples_resized.mode == 'RGBA' else None)
    
    # === Section 03: Bottom Technical Specs Strip ===
    bar_top = samples_card_top + samples_target_h + 16
    bar_h = 60
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
        draw.text((cx + 18, bar_top + 11), label, fill=(148, 163, 184, 255), font=f['zh_micro'])
        draw.text((cx + 18, bar_top + 31), val, fill=color, font=f['zh_tag'])
        
    canvas.save('public/assets/work02-vision-showcase.png', 'PNG', optimize=True)
    print("Created focused work02-vision-showcase.png successfully!")

if __name__ == '__main__':
    create_work02_eye_showcase()
