import type { ContentArticle } from "@/app/content/[slug]/contentData";
export function upgradeGrowthArticles(articles: ContentArticle[], zh = false) {
  const upgrades = [
    ["why-no-sales", "Separate traffic quality from page friction", "A local repair business may receive visits from outside its service area. Before rewriting the page, compare enquiries by landing page and location in your analytics. Then test the contact form on mobile, explain the service area near the CTA, and compare qualified enquiries over comparable periods. A page audit cannot determine traffic intent or your conversion rate on its own.", "区分流量质量和页面阻碍", "本地维修企业可能收到服务范围以外的访问。改写前先在分析工具中按落地页和地区比较咨询，再在手机测试表单、在按钮附近说明服务地区，并比较相似时段的有效咨询。页面审计本身不能判断流量意图或转化率。", "/website-conversion-audit"],
    ["website-mistakes", "Turn observations into actions", "First reproduce anything that prevents a visitor completing the primary action. Next address confusing service descriptions and missing decision information. Finally improve discovery signals such as titles and internal links. A working quote form and clear service area deserve attention before a decorative animation. Record an owner, expected effect and verification step for every fix.", "把观察变成行动", "先复现阻止访客完成主要操作的问题，再处理混乱服务描述和决策信息，最后改善标题与内链等发现信号。报价表单和服务范围比装饰动画更值得优先关注。为每项修复记录负责人、预期效果和验证步骤。", "/free-website-audit"],
    ["stop-guessing", "Write a hypothesis before changing the page", "Use this format: visitors cannot understand this detail, so we will change this element and measure this outcome. Explain the consultation process above a form and monitor completed, qualified requests. Change one meaningful element at a time when possible, annotate your analytics, and account for traffic mix and seasonality before attributing a result to the change.", "修改前先写一个假设", "使用这个格式：访客无法理解某项信息，因此修改某个元素，并衡量某项结果。例如在表单上方解释咨询流程，观察完成且有效的请求。尽量一次修改一个有意义元素，在分析工具中标注，并考虑流量结构和季节性后再判断因果。", "/website-conversion-audit"],
  ];
  for (const [slug, heading, body, zhHeading, zhBody, href] of upgrades) {
    const article = articles.find((item) => item.slug === slug);
    if (!article) continue;
    article.sections.push({ type: "simple", heading: zh ? zhHeading : heading, paragraphs: [zh ? zhBody : body] });
    article.secondaryLinks.push({ label: zh ? "查看相关审计" : "Explore the relevant audit", href });
  }
}
