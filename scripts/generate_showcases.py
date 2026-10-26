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

def create_work02():
    f = get_fonts()
    eye_img = Image.open('public/assets/eye-detection-architecture.png').convert('RGBA')
    weather_img = Image.open('public/assets/weather-system-ui.png').convert('RGBA')
    samples_img = Image.open('public/assets/eye-detection-samples.png').convert('RGBA')
    
    # Crop row of retinal samples (y: 195 to 370)
    samples_crop = samples_img.crop((40, 195, 1227, 365))
    
    canvas_w, canvas_h = 1200, 720
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (13, 17, 23, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Top header bar (40px)
    draw.rectangle([0, 0, canvas_w, 40], fill=(22, 27, 34, 255))
    draw.line([0, 40, canvas_w, 40], fill=(38, 53, 74, 255), width=1)
    
    # Traffic dots
    draw.ellipse([16, 14, 26, 24], fill=(255, 95, 86, 255))
    draw.ellipse([34, 14, 44, 24], fill=(255, 189, 46, 255))
    draw.ellipse([52, 14, 62, 24], fill=(39, 201, 63, 255))
    
    draw.text((78, 13), "VISION_PERCEPTION :: CLINICAL_OPHTHALMIC x AGRI_WEATHER_SYS", fill=(148, 163, 184, 255), font=f['title'])
    draw.rectangle([canvas_w - 200, 10, canvas_w - 16, 30], fill=(3, 105, 161, 255))
    draw.text((canvas_w - 190, 13), "2x NATIONAL AWARDS", fill=(255, 255, 255, 255), font=f['sm'])
    
    p_w = 574
    p_h = 654
    p_top = 50
    
    # ================= LEFT: Eye Disease System =================
    left_x = 18
    draw.rectangle([left_x, p_top, left_x + p_w, p_top + p_h], fill=(16, 24, 39, 255), outline=(34, 47, 67, 255), width=1)
    # Header
    draw.rectangle([left_x, p_top, left_x + p_w, p_top + 34], fill=(24, 34, 53, 255))
    draw.text((left_x + 14, p_top + 8), "01 · 明眸八极 · 眼底多病种智能辅助诊断系统", fill=(56, 189, 248, 255), font=f['zh_title'])
    draw.rectangle([left_x + p_w - 116, p_top + 7, left_x + p_w - 12, p_top + 27], fill=(180, 83, 9, 255))
    draw.text((left_x + p_w - 108, p_top + 9), "挑战杯国赛一等奖", fill=(255, 255, 255, 255), font=f['zh_tag'])
    
    # Eye diagram
    target_eye_w = p_w - 24
    target_eye_h = int(eye_img.height * (target_eye_w / eye_img.width))
    eye_resized = eye_img.resize((target_eye_w, target_eye_h), Image.Resampling.LANCZOS)
    
    img1_y = p_top + 42
    draw.rectangle([left_x + 12, img1_y, left_x + 12 + target_eye_w, img1_y + target_eye_h], fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    canvas.paste(eye_resized, (left_x + 12, img1_y), eye_resized if eye_resized.mode == 'RGBA' else None)
    
    # Retinal Ribbon
    ribbon_y = img1_y + target_eye_h + 10
    ribbon_w = target_eye_w
    ribbon_h = int(samples_crop.height * (ribbon_w / samples_crop.width))
    ribbon_resized = samples_crop.resize((ribbon_w, ribbon_h), Image.Resampling.LANCZOS)
    
    draw.rectangle([left_x + 12, ribbon_y, left_x + 12 + ribbon_w, ribbon_y + ribbon_h], fill=(0, 0, 0, 255), outline=(34, 47, 67, 255), width=1)
    canvas.paste(ribbon_resized, (left_x + 12, ribbon_y), ribbon_resized if ribbon_resized.mode == 'RGBA' else None)
    
    # Ribbon labels
    label_y = ribbon_y + ribbon_h + 4
    labels = ["正常(N)", "糖尿病(D)", "青光眼(G)", "白内障(C)", "AMD(A)", "高血压(H)", "近视(M)", "其他(O)"]
    step = ribbon_w / 8
    for i, lbl in enumerate(labels):
        lx = left_x + 12 + int(i * step + step / 2) - 18
        draw.text((lx, label_y), lbl, fill=(148, 163, 184, 255), font=f['zh_micro'])
        
    # Technical box
    box_y = label_y + 18
    draw.rectangle([left_x + 12, box_y, left_x + p_w - 12, p_top + p_h - 14], fill=(11, 17, 28, 255), outline=(30, 41, 59, 255), width=1)
    draw.text((left_x + 22, box_y + 12), "• 双眼孪生网络 (Weight-shared Backbone) 左右眼对称性交叉融合建模", fill=(226, 232, 240, 255), font=f['zh_body'])
    draw.text((left_x + 22, box_y + 36), "• 解耦多任务 Softmax：青光眼/糖尿病/黄斑变性/白内障等 8 病种联合预测", fill=(226, 232, 240, 255), font=f['zh_body'])
    draw.text((left_x + 22, box_y + 60), "• 攻克临床长尾分布与细微病灶漏检 · 综合多病种 AUC 达 98.4%", fill=(56, 189, 248, 255), font=f['zh_body'])
    draw.text((left_x + 22, box_y + 84), "• 研发成果已形成发明专利与软件著作权，落地智能辅助筛查系统", fill=(148, 163, 184, 255), font=f['zh_body'])
    
    # ================= RIGHT: Weather System =================
    right_x = left_x + p_w + 16
    draw.rectangle([right_x, p_top, right_x + p_w, p_top + p_h], fill=(16, 24, 39, 255), outline=(34, 47, 67, 255), width=1)
    # Header
    draw.rectangle([right_x, p_top, right_x + p_w, p_top + 34], fill=(24, 34, 53, 255))
    draw.text((right_x + 14, p_top + 8), "02 · 云农四象 · 智慧农业视觉天气识别系统", fill=(52, 211, 153, 255), font=f['zh_title'])
    draw.rectangle([right_x + p_w - 116, p_top + 7, right_x + p_w - 12, p_top + 27], fill=(5, 150, 105, 255))
    draw.text((right_x + p_w - 108, p_top + 9), "RAICOM国赛二等奖", fill=(255, 255, 255, 255), font=f['zh_tag'])
    
    # Weather UI image
    w_target_w = p_w - 24
    w_target_h = int(weather_img.height * (w_target_w / weather_img.width))
    max_w_h = 360
    if w_target_h > max_w_h:
        w_target_h = max_w_h
        w_target_w = int(weather_img.width * (w_target_h / weather_img.height))
    weather_resized = weather_img.resize((w_target_w, w_target_h), Image.Resampling.LANCZOS)
    
    w_offset_x = right_x + (p_w - w_target_w) // 2
    draw.rectangle([w_offset_x - 1, img1_y - 1, w_offset_x + w_target_w + 1, img1_y + w_target_h + 1], outline=(30, 41, 59, 255), width=1)
    canvas.paste(weather_resized, (w_offset_x, img1_y), weather_resized if weather_resized.mode == 'RGBA' else None)
    
    # Weather Technical Box
    w_box_y = box_y
    draw.rectangle([right_x + 12, w_box_y, right_x + p_w - 12, p_top + p_h - 14], fill=(11, 17, 28, 255), outline=(30, 41, 59, 255), width=1)
    draw.text((right_x + 22, w_box_y + 12), "• 晴/多云/雨/雪 (Sunny/Cloudy/Rainy/Snowy) 四象田间微气象视觉感知", fill=(226, 232, 240, 255), font=f['zh_body'])
    draw.text((right_x + 22, w_box_y + 36), "• 实时多通道环境融合：光照(1200Lux)、温湿度、降水颗粒自适应感知", fill=(226, 232, 240, 255), font=f['zh_body'])
    draw.text((right_x + 22, w_box_y + 60), "• 实时识别置信度达 98.21% · 智能联动植保无人机返航避险与精准作业", fill=(52, 211, 153, 255), font=f['zh_body'])
    draw.text((right_x + 22, w_box_y + 84), "• 今日诊断架次 1,248 · 端到端 V1.0 LIVE 智慧农业生产控制台落地", fill=(148, 163, 184, 255), font=f['zh_body'])
    
    canvas.save('public/assets/work02-vision-showcase.png', 'PNG', optimize=True)
    print("Created work02-vision-showcase.png successfully!")

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
    draw.rectangle([canvas_w - 200, 10, canvas_w - 16, 30], fill=(180, 83, 9, 255))
    draw.text((canvas_w - 190, 13), "2x BRONZE MEDALS · VERIFIED", fill=(255, 255, 255, 255), font=f['sm'])
    
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
