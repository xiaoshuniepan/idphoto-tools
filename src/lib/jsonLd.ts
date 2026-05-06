/**
 * Schema.org JSON-LD helpers.
 *
 * Why these matter: rich-result eligibility means search engines display
 * extra info (FAQ folds, breadcrumbs, sitelinks) which significantly boosts
 * click-through rate on organic listings.
 */

const SITE_URL = "https://pickerme.cn";
const SITE_NAME = "证件照快手";

export function toolJsonLd(name: string, url: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: "zh-CN",
    offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
    featureList: ["免费", "无需注册", "浏览器端处理", "隐私安全"],
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["证件照工具", "在线证件照"],
    url: SITE_URL,
    inLanguage: "zh-CN",
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
  };
}
