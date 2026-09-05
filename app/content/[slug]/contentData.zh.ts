import type { ContentArticle } from "./contentData";
import { geoArticles } from "@/lib/geoArticles";
import { upgradeGrowthArticles } from "@/lib/contentUpgrades";

export const zhArticles: ContentArticle[] = [
  ...geoArticles(true),
  {
    slug: "why-no-sales",
    title: "为什么你的网站有流量却没有销量",
    eyebrow: "找出阻碍网站转化的问题",
    description: "只有当访客理解你的产品、信任你的网站并清楚下一步行动时，流量才真正有价值。",
    primaryCta: "获取免费审计",
    sections: [
      { type: "intro", heading: "大多数网站失败并不是因为没有流量", paragraphs: ["真正的问题，往往发生在用户进入网站之后。", "你可以获得点击、投放广告，甚至取得不错的搜索排名。", "但如果网站无法转化，这些流量就很难产生价值。"] },
      { type: "list", heading: "通常是这些问题在影响转化", items: [
        { title: "网站速度太慢", body: "用户不会一直等待。如果页面需要几秒以上才能打开，他们可能还没看到你的产品就已经离开。", takeaway: "流失的访问量，就是流失的收入", cta: "想检查网站速度？立即进行免费审计。" },
        { title: "核心信息不够清晰", body: "访客进入首页后，应该立刻明白你提供什么、服务谁，以及为什么值得选择。", takeaway: "困惑会直接降低转化", cta: "检查你的信息表达是否清晰。" },
        { title: "页面结构存在问题", body: "缺少清晰的 CTA、干扰元素太多、层级混乱，都会让用户不知道下一步该做什么。", takeaway: "没有方向，就不会产生行动", cta: "分析你的网站结构。" },
        { title: "内容无法推动行动", body: "很多网站说得太多、销售得太少，也缺乏行动紧迫感。内容应该自然地引导用户迈出下一步。", takeaway: "只有注意力，没有行动，就不会增长", cta: "找出你的转化缺口。" },
      ] },
      { type: "comparison", heading: "猜测与洞察的区别", leftLabel: "凭感觉猜测", rightLabel: "SiteScope", rows: [["随意修改", "数据驱动的洞察"], ["不断试错", "清晰的优先级"], ["进展缓慢", "更快完成改进"]] },
      { type: "simple", heading: "你不一定需要更多流量", paragraphs: ["你需要的是减少影响转化的错误。"] },
    ],
    finalHeading: "立即运行免费审计",
    finalCopy: "无需注册，几分钟内获得结果。",
    secondaryLinks: [{ label: "需要完整报告和修复计划？升级到 Pro", href: "/#pricing" }, { label: "需要我们协助修复？让我们为你重建网站", href: "/contact" }],
  },
  {
    slug: "website-mistakes",
    title: "扼杀网站增长的十大常见错误",
    eyebrow: "发现网站最关键的问题",
    description: "很多网站表面上看起来没有问题，但细小缺陷正在持续损耗注意力、信任和收入。",
    primaryCta: "获取免费审计",
    sections: [
      { type: "intro", heading: "大多数网站看起来都还不错", paragraphs: ["但在表面之下，它们可能正在悄悄流失增长机会。", "以下是最常见的问题："] },
      { type: "list", heading: "十大增长障碍", items: [
        { title: "价值主张不清晰", body: "用户无法快速理解你提供什么。" },
        { title: "加载速度缓慢", body: "每多等待一秒，都可能损失更多转化。" },
        { title: "行动号召薄弱", body: "既不紧迫，也不明确。" },
        { title: "移动端体验差", body: "多数用户通过手机访问，你的网站必须在移动端同样自然易用。" },
        { title: "缺少 SEO 结构", body: "搜索引擎无法准确理解网站内容。" },
        { title: "页面过于杂乱", body: "元素太多，用户就无法聚焦。" },
        { title: "品牌表现不一致", body: "网站传递的可信度低于企业本身。" },
        { title: "没有内容策略", body: "流量来了，却没有转化。" },
        { title: "缺少分析和洞察", body: "你不知道真正的问题在哪里。" },
        { title: "用猜测代替分析", body: "这是所有问题中影响最大的一个。" },
      ] },
      { type: "simple", heading: "手动修复所有问题并不容易", paragraphs: ["你不知道应该从哪里开始。", "你不知道什么问题最重要。", "所以很多人最终什么都没有改变。"] },
    ],
    finalHeading: "让数据告诉你应该先修复什么",
    finalCopy: "从真正限制增长的问题开始。",
    secondaryLinks: [{ label: "获取完整的优先级修复计划", href: "/#pricing" }, { label: "或者交给我们为你修复", href: "/contact" }],
  },
  {
    slug: "stop-guessing",
    title: "停止猜测，开始增长",
    eyebrow: "看清真正重要的问题",
    description: "随意修改看似有进展，但真正的增长来自知道哪里出了问题，以及应该先修复什么。",
    primaryCta: "获取免费审计",
    sections: [
      { type: "intro", heading: "大多数创业者都在猜", paragraphs: ["他们随意修改页面、尝试新设计，并照搬通用建议。", "有时有效，但大多数时候并没有。"] },
      { type: "simple", heading: "猜测会浪费大量时间", paragraphs: ["你可能修复了影响很小的问题，却忽略关键缺陷，几周过去仍没有结果。", "投入精力并不一定会带来增长。"] },
      { type: "list", heading: "数据会改变一切", items: [
        { title: "你知道该修复什么", body: "下一步行动变得清晰。" },
        { title: "你知道什么最重要", body: "不再把精力浪费在表面修改上。" },
        { title: "你的行动更快", body: "明确的优先级可以直接转化为执行。" },
      ] },
      { type: "simple", heading: "这正是 SiteScope 所做的", paragraphs: ["我们分析你的网站，告诉你哪里有问题、为什么重要，以及应该如何修复。", "不再猜测，只有清晰的答案。"] },
    ],
    finalHeading: "立即运行网站审计",
    finalCopy: "更清楚地了解是什么阻碍了网站增长。",
    secondaryLinks: [{ label: "升级到 Pro，获得完整洞察", href: "/#pricing" }, { label: "获得专家帮助，解决所有问题", href: "/contact" }],
  },
];

upgradeGrowthArticles(zhArticles, true);

export function getZhArticle(slug: string) {
  return zhArticles.find((article) => article.slug === slug);
}
