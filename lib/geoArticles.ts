import type { ContentArticle } from "@/app/content/[slug]/contentData";

const guides = [
  {
    slug: "what-is-geo", title: "What Is Generative Engine Optimization (GEO)?", zhTitle: "什么是生成式引擎优化（GEO）？",
    intro: "GEO is the practice of making useful web content easier for generative search systems to access and interpret. It does not give website owners control over AI answers or citations. Most practical work overlaps with good SEO and clear publishing.",
    zhIntro: "GEO 是让生成式搜索系统更容易访问和理解实用网页内容的实践。它不能让站长控制 AI 回答或引用。实际工作大多与良好的 SEO 和清晰内容发布相重合。",
    sections: [
      ["Start with a source worth understanding", "A landscaping company should state its service area, services, process and contact details. A phrase such as 'we create excellence' supplies little context. 'We install interlocking patios in Markham' is specific and testable. Add project examples only when they are real.", "先提供值得理解的来源", "园林公司应说明服务地区、服务内容、流程和联系方式。‘创造卓越’没有多少上下文；‘在 Markham 铺设联锁砖露台’具体且可验证。案例必须真实。"],
      ["Make meaning explicit", "Use descriptive headings, direct answers and appropriate internal links. Organization or service markup can clarify information already visible on the page. Structured data is not a special requirement for AI search and cannot compensate for an unclear offer.", "明确表达含义", "使用描述性标题、直接答案和适当内链。机构或服务标记可以明确页面上已有的信息。结构化数据不是 AI 搜索的特殊要求，也不能弥补模糊服务。"],
      ["Measure readiness and outcomes separately", "A readiness audit can flag missing page signals. It cannot establish whether ChatGPT cited your business. Track search impressions, referral visits and qualified enquiries over time, and record the date and scope of each change.", "分开衡量就绪度和结果", "就绪度审计可以标出缺失的页面信号，不能证明 ChatGPT 是否引用了企业。持续跟踪搜索曝光、引荐访问和有效咨询，并记录修改日期与范围。"],
      ["Does GEO replace SEO?", "No. Crawlability, useful content and clear site structure remain relevant. Treat GEO as part of Search Visibility rather than a separate publishing system or a reason to create near-duplicate pages.", "GEO 会替代 SEO 吗？", "不会。可抓取性、实用内容和清晰结构仍然重要。把 GEO 作为搜索可见性的一部分，不必另建发布系统或创建近似重复页面。"],
    ],
  },
  {
    slug: "seo-vs-geo", title: "SEO vs GEO: What Website Owners Need to Know", zhTitle: "SEO 与 GEO：网站经营者需要了解什么",
    intro: "SEO helps search engines discover and interpret pages. GEO focuses on whether content is understandable as a source for generative answers. They share much of the same work, but the results you can verify are different.",
    zhIntro: "SEO 帮助搜索引擎发现和理解页面。GEO 关注内容能否作为生成式答案的清晰来源。二者有大量共同工作，但可验证的结果不同。",
    sections: [
      ["Compare the outcome, not the acronym", "For SEO, inspect impressions, clicks and query performance in Search Console. For AI referrals, review identifiable referral sources and their conversions. An AI answer may mention a brand without generating a visit, so traffic alone is an incomplete picture.", "比较结果，不纠结缩写", "SEO 可在 Search Console 中查看曝光、点击和查询表现。AI 引荐可查看可识别来源及转化。AI 回答可能提及品牌但不产生访问，因此流量并非完整图景。"],
      ["One page can serve both", "A service page with a clear title, accurate availability, examples, process and FAQs helps people understand the offer. These same details give machines context. Avoid writing a second page that repeats the service merely to add 'AI' to its title.", "一个页面可以兼顾两者", "服务页包含清晰标题、准确服务范围、案例、流程和常见问题，有助于用户理解，也为机器提供上下文。不要只为标题加上‘AI’而复制服务页。"],
      ["Prioritize shared foundations", "First fix accidental noindex directives and inaccessible content. Then clarify the offer, improve headings and support important claims. Only add schema types that match the page. A scoring checklist is a prioritization aid, not Google's ranking formula.", "优先修复共同基础", "先处理意外 noindex 和无法访问的内容，再明确服务、改进标题、支持重要主张。只添加符合页面的 schema 类型。评分清单用于排序，不是 Google 排名公式。"],
      ["Should I buy a separate GEO plan?", "Not necessarily. SiteScope includes SEO and GEO under Search Visibility in the same Free and Pro plans. Choose implementation help based on the work required, not the number of acronyms on a proposal.", "需要单买 GEO 套餐吗？", "不一定。SiteScope 在同一免费和 Pro 套餐的搜索可见性中包含 SEO 和 GEO。根据实际实施工作选择帮助，不以提案缩写数量判断价值。"],
    ],
  },
  {
    slug: "improve-ai-search-visibility", title: "How to Improve Your Website's Visibility in AI Search", zhTitle: "如何改善网站在 AI 搜索中的可理解性与可见性",
    intro: "Start with accessible, specific and well-supported content. Improve the source page before looking for special AI files or shortcuts. The steps below improve clarity and readiness; they do not guarantee inclusion in an AI answer.",
    zhIntro: "从可访问、具体、有证据支持的内容开始。先改善来源页面，再考虑特殊 AI 文件或捷径。以下步骤改善清晰度与就绪度，不保证进入 AI 回答。",
    sections: [
      ["1. Check the page can be used", "Inspect the public page without signing in. Confirm important text is rendered, canonical markup points to the intended URL, and robots directives match the publication goal. Do not remove restrictions from genuinely private pages.", "1. 确认页面可以使用", "在未登录状态查看公开页面。确认重要文本已渲染、canonical 指向预期网址、robots 符合发布目标。不要移除真正私密页面的限制。"],
      ["2. Answer the real question first", "On a delivery page, begin with the service area, expected timeframe and exceptions. Follow with detailed conditions. Avoid burying the answer beneath brand history. Use examples to explain what changes the answer, such as location or product availability.", "2. 先回答真实问题", "配送页面先说明范围、预计时长和例外，再写详细条件。不要把答案埋在品牌历史后。用地区或库存等示例说明哪些条件会改变答案。"],
      ["3. Make claims verifiable", "Name the author or organization where appropriate, link to original sources for external claims and distinguish your own observations from estimates. A dated case study should describe its scope and method, not just a percentage improvement.", "3. 让主张可验证", "适当标注作者或机构，为外部事实链接原始来源，区分自身观察与估算。带日期的案例应说明范围和方法，不只写提升百分比。"],
      ["4. Review outcomes after publishing", "Keep a change log. Inspect indexing and relevant query impressions, then monitor qualified enquiries and identifiable referrals. Compare periods with similar demand where possible. One visit or one AI response is not reliable proof of causation.", "4. 发布后检查结果", "保留修改记录，检查索引与相关查询曝光，再跟踪有效咨询和可识别引荐。尽量比较需求类似的时段。单次访问或单个 AI 回答不能可靠证明因果。"],
    ],
  },
  {
    slug: "why-ai-search-may-not-cite-your-website", title: "Why AI Search May Not Understand or Cite Your Website", zhTitle: "为什么 AI 搜索可能无法理解或引用你的网站",
    intro: "A missing citation does not prove that your website has a technical fault. AI services choose sources differently across queries and time. You can investigate accessibility, clarity and evidence, but a single-page audit cannot determine the reason for an absent citation.",
    zhIntro: "没有被引用并不证明网站存在技术故障。AI 服务会随查询和时间变化选择来源。你可以检查可访问性、清晰度和证据，但单页审计不能确定未获引用的原因。",
    sections: [
      ["The page may not answer the question", "A homepage that says 'innovative solutions' may be unrelated to a specific service query. Add a genuinely useful service page that states the problem, audience, process and limits. Do not create hundreds of interchangeable city pages.", "页面可能没有回答问题", "只写‘创新解决方案’的首页可能与具体服务查询无关。建立真正实用的服务页，说明问题、受众、流程和限制。不要生成上百个可互换城市页。"],
      ["Identity may be difficult to resolve", "Inconsistent names, absent contact details and unclear ownership can make the source ambiguous. Review the visible page, About page and applicable organization markup together. SiteScope flags single-page signals; cross-page consistency still needs a manual review.", "身份可能难以确认", "不一致名称、缺失联系方式和不清晰所有者可能造成歧义。一起检查页面、关于页和适用机构标记。SiteScope 标出单页信号，跨页一致性仍需人工检查。"],
      ["Evidence may be too thin", "A claim such as 'the best provider' gives little support. Explain the method, show an original example or link to a reliable source for a factual statement. Adding random external links does not establish expertise or authority.", "证据可能不足", "‘最佳服务商’缺少支持。说明方法、展示原创示例或为事实链接可靠来源。随意增加外链不会建立专业性或权威。"],
      ["Can a tool tell me the exact reason?", "Not without relevant query, retrieval and citation data from the service involved. Treat readiness findings as implementation opportunities. Keep uncertainty explicit, and do not buy promises of guaranteed ChatGPT placement.", "工具能告诉我确切原因吗？", "没有相关服务的查询、检索和引用数据就不能。把就绪度发现视为实施机会，明确不确定性，不购买保证 ChatGPT 展示的承诺。"],
    ],
  },
];

export function geoArticles(zh = false): ContentArticle[] {
  return guides.map((guide) => ({
    slug: guide.slug, title: zh ? guide.zhTitle : guide.title, eyebrow: zh ? "AI 搜索 / GEO" : "AI Search / GEO",
    description: zh ? guide.zhIntro : guide.intro, primaryCta: zh ? "获取免费审计" : "Get Free Audit",
    sections: guide.sections.map(([heading, paragraph, zhHeading, zhParagraph]) => ({ type: "simple" as const, heading: zh ? zhHeading : heading, paragraphs: [zh ? zhParagraph : paragraph] })),
    finalHeading: zh ? "从可观察的页面问题开始" : "Start with observable page issues",
    finalCopy: zh ? "查看免费的搜索可见性预览，再选择优先修改。" : "Review a free Search Visibility preview, then choose the first change.",
    secondaryLinks: [
      { label: zh ? "GEO 就绪度审计" : "GEO readiness audit", href: "/geo-audit" },
      { label: zh ? "AI 可见性审计" : "AI visibility audit", href: "/ai-visibility-audit" },
      { label: zh ? "SEO 与 GEO" : "SEO vs GEO", href: "/content/seo-vs-geo" },
      { label: zh ? "免费审计" : "Free website audit", href: "/free-website-audit" },
    ],
  }));
}
