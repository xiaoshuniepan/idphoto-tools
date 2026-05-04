export interface PhotoSize {
  id: string;
  label: string;
  group: string;
  widthMm: number;
  heightMm: number;
  // Pixels at 300dpi (standard print quality)
  widthPx: number;
  heightPx: number;
  note?: string;
}

// 1 inch = 25.4mm; 300dpi → px = mm / 25.4 * 300
const mm2px = (mm: number) => Math.round((mm / 25.4) * 300);

const raw: Omit<PhotoSize, "widthPx" | "heightPx">[] = [
  // ——— 国内标准 ———
  { id: "1cun",    label: "一寸",      group: "国内标准", widthMm: 25, heightMm: 35 },
  { id: "2cun",    label: "二寸",      group: "国内标准", widthMm: 35, heightMm: 49 },
  { id: "1cun_s",  label: "小一寸",    group: "国内标准", widthMm: 22, heightMm: 32 },
  { id: "1cun_l",  label: "大一寸",    group: "国内标准", widthMm: 33, heightMm: 48 },
  { id: "2cun_s",  label: "小二寸",    group: "国内标准", widthMm: 35, heightMm: 45 },
  { id: "2cun_l",  label: "大二寸",    group: "国内标准", widthMm: 35, heightMm: 53 },
  // ——— 证件 ———
  { id: "passport_cn", label: "护照",    group: "证件照", widthMm: 33, heightMm: 48, note: "中国护照" },
  { id: "id_card",     label: "身份证",  group: "证件照", widthMm: 26, heightMm: 32 },
  { id: "driver",      label: "驾照",    group: "证件照", widthMm: 22, heightMm: 32 },
  { id: "social",      label: "社保卡",  group: "证件照", widthMm: 26, heightMm: 32 },
  { id: "teacher",     label: "教师资格",group: "证件照", widthMm: 25, heightMm: 35 },
  // ——— 签证 ———
  { id: "visa_cn",  label: "中国签证",  group: "签证", widthMm: 33, heightMm: 48 },
  { id: "visa_us",  label: "美国签证",  group: "签证", widthMm: 51, heightMm: 51, note: "2×2 inch" },
  { id: "visa_uk",  label: "英国签证",  group: "签证", widthMm: 35, heightMm: 45 },
  { id: "visa_eu",  label: "欧洲申根",  group: "签证", widthMm: 35, heightMm: 45 },
  { id: "visa_jp",  label: "日本签证",  group: "签证", widthMm: 35, heightMm: 45 },
  // ——— 求职/学历 ———
  { id: "job",      label: "求职照",   group: "其他", widthMm: 35, heightMm: 49 },
  { id: "degree",   label: "学历照",   group: "其他", widthMm: 25, heightMm: 35 },
];

export const PHOTO_SIZES: PhotoSize[] = raw.map((s) => ({
  ...s,
  widthPx: mm2px(s.widthMm),
  heightPx: mm2px(s.heightMm),
}));

export const SIZE_GROUPS = [...new Set(PHOTO_SIZES.map((s) => s.group))];
