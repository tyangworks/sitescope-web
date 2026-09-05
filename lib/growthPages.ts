export type GrowthPage = {
  slug: string;
  title: string;
  zhTitle: string;
  description: string;
  zhDescription: string;
  audience: string;
  zhAudience: string;
  checks: [string, string, string, string][];
  faq: [string, string, string, string][];
  related: string;
};

export const growthPages: GrowthPage[] = [
  {
    slug: "free-website-audit", title: "Free Website Audit", zhTitle: "免费网站审计",
    description: "Find the obstacles between a visitor arriving and taking action. Start with a free preview, then decide what to fix first.",
    zhDescription: "找出从访客进入页面到采取行动之间的阻碍。先查看免费预览，再决定优先修复什么。",
    audience: "For small business owners who need a practical starting point before paying for a redesign or more advertising.",
    zhAudience: "适合准备改版或增加广告投入前，需要明确优化起点的小企业主。",
    checks: [
      ["Search Visibility", "Title, description, headings, canonical and AI-search readiness signals help explain how your page can be understood.", "搜索可见性", "检查标题、描述、层级、规范链接和 AI 搜索就绪信号，解释页面是否清晰。"],
      ["Visitor journey", "Review the main offer, supporting content and next action. An audit identifies friction; analytics confirms where users leave.", "访客路径", "查看主要服务、支持内容和下一步。审计发现阻碍，分析数据验证用户在哪里离开。"],
      ["A useful starting point", "The anonymous preview shows up to three issues. Sign in to save your free analysis; Pro adds detailed implementation guidance.", "实用起点", "匿名预览最多显示三个问题。登录保存免费分析，Pro 提供详细实施指导。"],
    ],
    faq: [["Do I need an account?", "No account is needed to run an audit and view your preview. Sign in to save it to your history.", "需要账户吗？", "无需账户即可运行审计并查看预览。登录后可保存到历史。"], ["Does the audit change my website?", "No. It observes the page and generates recommendations. You choose which changes to implement.", "会修改我的网站吗？", "不会。它观察页面并生成建议，由你决定实施哪些修改。"]], related: "website-mistakes",
  },
  {
    slug: "website-seo-audit", title: "Website SEO Audit", zhTitle: "网站 SEO 审计",
    description: "Review the on-page signals that help search engines understand your website, with evidence and a prioritized path to improvement.",
    zhDescription: "检查帮助搜索引擎理解网站的页面信号，获取检测证据和分优先级的改进方向。",
    audience: "For owners investigating weak organic discovery or reviewing a page before publishing. This is a page audit, not a backlink or keyword-ranking tracker.",
    zhAudience: "适合排查自然搜索曝光不足，或在发布前检查页面的站长。这是页面审计，不是外链或关键词排名监测。",
    checks: [["Page topic and hierarchy", "Check whether the title, description and headings communicate one clear subject. Rewrite a vague headline around the actual service and audience.", "页面主题与层级", "检查标题、描述和层级是否表达明确主题，把模糊标题改为实际服务和受众。"], ["Canonical and restrictions", "Review canonical markup and page-level robots directives. A noindex setting may be intentional; confirm the page purpose before changing it.", "规范链接与限制", "查看 canonical 和页面级 robots。noindex 可能是有意设置，修改前先确认用途。"], ["Search and AI together", "Entity and structured-data signals also support machine understanding. They are useful context, not a special AI ranking requirement.", "搜索与 AI 协同", "实体和结构化数据信号提供机器理解的上下文，并不是特殊 AI 排名要求。"]],
    faq: [["Does this replace Search Console?", "No. Search Console reports real search impressions and clicks. SiteScope reviews page signals that may explain implementation gaps.", "能替代 Search Console 吗？", "不能。Search Console 提供真实曝光和点击，SiteScope 检查可能解释实施缺口的页面信号。"], ["Will fixing every issue guarantee rankings?", "No. Relevance, competition, indexing and many other factors affect search results.", "修完所有问题能保证排名吗？", "不能。相关性、竞争、索引等多种因素共同影响搜索结果。"]], related: "seo-vs-geo",
  },
  {
    slug: "ai-visibility-audit", title: "AI Search Visibility Audit", zhTitle: "AI 搜索可见性审计",
    description: "Check whether your page provides clear, accessible context for AI search systems. Understand readiness gaps without invented citation or ranking claims.",
    zhDescription: "检查页面是否为 AI 搜索系统提供清晰、可访问的上下文，了解就绪度缺口，不虚构引用或排名。",
    audience: "For brands asking why their services are hard to describe or distinguish in an AI answer. Start by making the source page clear to people and machines.",
    zhAudience: "适合想了解为什么 AI 回答难以准确描述或区分自身服务的品牌。先让来源页面对人与机器都清晰。",
    checks: [["Who is behind the page?", "Look for organization, About, Contact and author signals. A service description should name who provides it and where it applies.", "谁在提供内容？", "查看机构、关于、联系和作者信号。服务描述应说明提供者和适用范围。"], ["Can an answer stand alone?", "Review question headings and concise paragraphs. Include scope, exceptions and a source for factual claims so excerpts retain their meaning.", "答案能独立理解吗？", "检查问题标题和简洁段落，为事实说明范围、例外和来源，使摘录保留原意。"], ["What is actually measured?", "SiteScope inspects one rendered page. It does not query ChatGPT, measure brand mentions, or verify whether any AI service cited your URL.", "实际测量什么？", "SiteScope 检查一个渲染页面，不查询 ChatGPT、不统计品牌提及，也不验证 AI 服务是否引用了网址。"]],
    faq: [["Is this an AI ranking score?", "No. It is a versioned readiness heuristic based on observed page signals. A high score does not establish citation probability.", "这是 AI 排名分吗？", "不是。它是基于页面观察的版本化就绪指标，高分不代表引用概率。"], ["How do I check real AI referrals?", "Review referral traffic and conversions in your analytics, while recognizing that some visits may not carry an identifiable referrer.", "如何查看真实 AI 引荐？", "在分析工具中查看引荐流量和转化，注意部分访问不包含可识别来源。"]], related: "improve-ai-search-visibility",
  },
  {
    slug: "geo-audit", title: "GEO Readiness Audit", zhTitle: "GEO 就绪度审计",
    description: "Turn generative engine optimization into a practical checklist: entity clarity, content structure, evidence, markup and answerability.",
    zhDescription: "把生成式引擎优化变成可执行检查：实体清晰度、内容结构、证据、标记和可回答性。",
    audience: "For marketers and developers translating GEO advice into page changes. Use the findings to create a fix backlog, then validate outcomes separately.",
    zhAudience: "适合将 GEO 建议转化为页面修改的营销人员和开发者。根据发现建立修复清单，再独立验证结果。",
    checks: [["Six transparent dimensions", "Scores summarize entity clarity, structure, evidence and trust, structured data, answerability, and topical coverage proxies. They are not search-engine weights.", "六个透明维度", "评分汇总实体清晰度、结构、证据与信任、结构化数据、可回答性和主题覆盖代理指标，并非搜索引擎权重。"], ["Evidence before advice", "A missing author signal is an observation, not proof of untrustworthy content. Confirm whether authorship is appropriate for the page before adding it.", "先证据后建议", "没有作者信号是观察，不等于内容不可信。添加前先确认页面是否需要作者身份。"], ["From findings to implementation", "Pro connects issues to priorities, implementation steps and examples where appropriate. Keep schema aligned with visible, accurate content.", "从发现到实施", "Pro 将问题连接到优先级、实施步骤和适用示例，结构化数据应符合真实可见内容。"]],
    faq: [["Do I need llms.txt?", "It is an emerging convention, not a ranking guarantee. SiteScope does not deduct points for its absence.", "需要 llms.txt 吗？", "这是新兴约定，不是排名保证。SiteScope 不因缺失它而扣分。"], ["Is GEO a separate paid plan?", "No. Search Visibility includes SEO and GEO in the existing Free and one-time Pro audit plans.", "GEO 单独收费吗？", "不。搜索可见性中的 SEO 和 GEO 已包含在现有免费和一次性 Pro 审计中。"]], related: "what-is-geo",
  },
  {
    slug: "website-conversion-audit", title: "Website Conversion Audit", zhTitle: "网站转化审计",
    description: "Find the unclear offers, missing context and confusing next steps that can stop visitors from becoming customers.",
    zhDescription: "找出可能阻碍访客成为客户的模糊服务、缺失信息和混乱行动路径。",
    audience: "For businesses receiving traffic but few enquiries. A page review suggests hypotheses; your analytics and controlled experiments determine what changes results.",
    zhAudience: "适合有流量却少咨询的企业。页面检查提出假设，分析数据和受控实验确定哪些修改真正改变结果。",
    checks: [["Offer clarity", "Can a first-time visitor name your service and intended customer? Replace broad claims with a specific outcome and the next step.", "服务清晰度", "首次访客能否说出你的服务和目标客户？把宽泛口号换成具体结果与下一步。"], ["Decision support", "Review examples, contact paths, expectations and calls to action. A form should explain what happens after submission.", "决策支持", "查看案例、联系路径、预期和行动按钮。表单应说明提交后会发生什么。"], ["Prioritize and verify", "Fix a blocked contact path before changing button colors. Track successful submissions and qualified leads rather than clicks alone.", "排序并验证", "先修复无法使用的联系路径，再改按钮颜色。跟踪成功提交和有效线索，不只看点击。"]],
    faq: [["Will the audit tell me my conversion rate?", "No. Conversion rate requires traffic and outcome data from analytics. The audit reviews visible page patterns.", "审计能告诉我转化率吗？", "不能。转化率需要分析工具中的流量和结果数据，审计检查可见页面模式。"], ["What should I fix first?", "Start with broken primary actions, then clarify the offer and reduce unnecessary steps. Validate each change against a defined conversion goal.", "先修什么？", "先修主要操作故障，再明确服务和减少步骤。用明确转化目标验证每项修改。"]], related: "why-no-sales",
  },
];
