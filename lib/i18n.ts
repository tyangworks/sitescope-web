// lib/i18n.ts

import { useSyncExternalStore } from "react";

export type Language = "en" | "zh";

export interface Translations {
  common: {
    loading: string;
    error: string;
    back: string;
    share: string;
    delete: string;
    confirmDelete: string;
  };
  nav: {
    analyze: string;
    pricing: string;
    content: string;
    services: string;
    history: string;
    login: string;
    getStarted: string;
  };
  home: {
    heroTitle: string;
    heroAccent: string;
    heroSubtitle: string;
    heroPlaceholder: string;
    heroButton: string;
    loadingMessages: string[];
    auditPreview: string;
    resultsTime: string;
    learnWhy: string;
    recentAudits: string;
    painPointsTitle: string;
    painPointsSubtitle: string;
    painPointSpeed: string;
    painPointSeo: string;
    painPointContent: string;
    painPointCta: string;
    pricingTitle: string;
    pricingFreeTitle: string;
    pricingFreeDesc: string;
    pricingFreeButton: string;
    pricingPopular: string;
    pricingProTitle: string;
    pricingProDesc: string;
    pricingOneTime: string;
    pricingBuyPro: string;
    pricingCustomTitle: string;
    pricingCustomDesc: string;
    pricingCustomPrice: string;
    pricingContact: string;
    howItWorks: string;
    howStepUrlTitle: string;
    howStepUrlDesc: string;
    howStepAiTitle: string;
    howStepAiDesc: string;
    howStepFixTitle: string;
    howStepFixDesc: string;
    servicesTitle: string;
    servicesSubtitle: string;
    customBuild: string;
    consultExpert: string;
  };
  reports: {
    title: string;
    subtitle: string;
    newAnalysis: string;
    noReports: string;
    viewDetails: string;
    score: string;
  };
  report: {
    analyzing: string;
    estimatedTime: string;
    loadingStructure: string;
    loadingPerformance: string;
    loadingSeo: string;
    loadingAi: string;
    notFound: string;
    notFoundDesc: string;
    backToReports: string;
    deleteReport: string;
    deleting: string;
    deleteConfirm: string;
    share: string;
    shareCopied: string;
    siteReport: string;
    generatedOn: string;
    overallScore: string;
    scoreExcellent: string;
    scoreGood: string;
    scoreFair: string;
    scoreNeedsImprovement: string;
    coreIssues: string;
    coreIssuesSubtitle: string;
    impact: string;
    recommendedFix: string;
    saveFreeTitle: string;
    saveFreeDesc: string;
    signInToUnlock: string;
    moreIssues: string;
    moreIssuesSubtitle: string;
    fixPlans: string;
    fixPlansSubtitle: string;
    contentSuggestions: string;
    contentSuggestionsSubtitle: string;
    supportUs: string;
    supportUsSubtitle: string;
    donate: string;
    unlockFull: string;
    unlockFullDesc: string;
    upgradePro: string;
    upgradeProDesc: string;
    proLockedDesc: string;
    oneTime: string;
    priorityPlan: string;
    stepByStep: string;
    codeSnippets: string;
    priority: string;
    codeSnippet: string;
    enterEmail: string;
    freeUnlock: string;
    upgradeToPro: string;
    processing: string;
    proAuditOverview: string;
    proAuditSubtitle: string;
    seoAudit: string;
    geoAudit: string;
    findings: string;
    evidence: string;
    whyItMatters: string;
    implementationSteps: string;
    expectedOutcome: string;
    legacyProNotice: string;
    adminProAccess: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    email: string;
    password: string;
    loginButton: string;
    noAccount: string;
    signUp: string;
    forgotPassword: string;
    continueWithGoogle: string;
    continueWithMicrosoft: string;
  };
  cta: {
    title: string;
    subtitle: string;
    email: string;
    companyName: string;
    website: string;
    goal: string;
    message: string;
    submit: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      loading: "Loading...",
      error: "An error occurred",
      back: "Back",
      share: "Share",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this?",
    },
    nav: {
      analyze: "Analyze",
      pricing: "Pricing",
      content: "Content",
      services: "Services",
      history: "History",
      login: "Login",
      getStarted: "Get Started",
    },
    home: {
      heroTitle: "See What's Holding Your",
      heroAccent: "Growth Back",
      heroSubtitle:
        "AI-powered website audits that show you exactly what to fix — and how to grow faster. No sign-up required.",
      heroPlaceholder: "Enter your website, e.g. example.com",
      heroButton: "Get Free Audit",
      loadingMessages: [
        "Initializing cloud browser...",
        "Capturing high-res visual snapshot...",
        "Analyzing SEO and structure...",
        "Generating growth insights...",
      ],
      auditPreview: "We will audit:",
      resultsTime: "Results in less than 60 seconds",
      learnWhy: "Learn why most websites fail",
      recentAudits: "Recently Analyzed Sites",
      painPointsTitle: "Most websites don't fail because of traffic.",
      painPointsSubtitle: "They fail because of hidden conversion killers.",
      painPointSpeed: "Slow performance that kills 50%+ of mobile conversions.",
      painPointSeo: "SEO gaps blocking your business from organic growth.",
      painPointContent: "Generic content that fails to engage and convert visitors.",
      painPointCta: "Weak Call-to-Action and confusing user journeys.",
      pricingTitle: "Simple Pricing",
      pricingFreeTitle: "Free",
      pricingFreeDesc: "Basic audit & core insights for quick checkups.",
      pricingFreeButton: "Try Free",
      pricingPopular: "Most Popular",
      pricingProTitle: "Pro",
      pricingProDesc: "Detailed SEO + GEO audit, evidence, prioritized fix plan, implementation steps, and code snippets.",
      pricingOneTime: "one-time unlock",
      pricingBuyPro: "Buy Pro Audit",
      pricingCustomTitle: "Custom",
      pricingCustomDesc: "Full implementation & high-performance website build.",
      pricingCustomPrice: "Quote",
      pricingContact: "Contact Us",
      howItWorks: "How It Works",
      howStepUrlTitle: "Enter URL",
      howStepUrlDesc: "Input your website and start the analysis instantly.",
      howStepAiTitle: "AI Analysis",
      howStepAiDesc: "We scan SEO, performance, and structure issues.",
      howStepFixTitle: "Get Fix Plan",
      howStepFixDesc: "Receive actionable insights to improve growth.",
      servicesTitle: "Too busy to fix it yourself?",
      servicesSubtitle:
        "Our expert team builds high-performance, high-converting websites starting from scratch or optimizing your current stack.",
      customBuild: "Custom Website Build",
      consultExpert: "Consult With Expert",
    },
    reports: {
      title: "Audit History",
      subtitle: "View all generated website analysis reports",
      newAnalysis: "New Analysis",
      noReports: "No reports yet. Analyze your first website now!",
      viewDetails: "View Details",
      score: "Score",
    },
    report: {
      analyzing: "Analyzing Your Website",
      estimatedTime: "Estimated time: 20-30 seconds. Real value takes time.",
      loadingStructure: "Fetching site structure",
      loadingPerformance: "Running performance tests",
      loadingSeo: "Checking SEO signals",
      loadingAi: "Generating AI insights...",
      notFound: "Report Not Found",
      notFoundDesc: "This report may have been deleted or does not exist.",
      backToReports: "Back to Reports",
      deleteReport: "Delete Report",
      deleting: "Deleting...",
      deleteConfirm: "Delete this report permanently?",
      share: "Share",
      shareCopied: "Share link copied to clipboard!",
      siteReport: "Site Report",
      generatedOn: "Generated on",
      overallScore: "Overall Score",
      scoreExcellent: "Excellent",
      scoreGood: "Good",
      scoreFair: "Fair",
      scoreNeedsImprovement: "Needs Improvement",
      coreIssues: "Core Issues (Free Preview)",
      coreIssuesSubtitle: "Top 3 most critical issues",
      impact: "Impact:",
      recommendedFix: "Recommended fix:",
      saveFreeTitle: "Save and unlock your complete Free report",
      saveFreeDesc:
        "Sign in to securely claim this audit, view every Free finding, and keep it in your private report history.",
      signInToUnlock: "Sign In to Unlock Free Report",
      moreIssues: "More Issues (Email Unlock)",
      moreIssuesSubtitle: "Enter your email to unlock the complete issue list",
      fixPlans: "Fix Plans (Pro Exclusive)",
      fixPlansSubtitle: "Detailed fix steps and code snippets",
      contentSuggestions: "Content Suggestions",
      contentSuggestionsSubtitle: "Suggestions to improve user experience",
      supportUs: "Support SiteScope",
      supportUsSubtitle:
        "If this report helped you, a small PayPal donation helps us keep improving the free audit experience. Donations are optional and do not unlock extra content.",
      donate: "Donate with PayPal",
      unlockFull: "Unlock Full Report",
      unlockFullDesc:
        "Enter your email address to unlock all SEO issues in detail for free.",
      upgradePro: "Upgrade to Pro",
      upgradeProDesc:
        "Unlock detailed fix plans and code snippets with complete solutions.",
      proLockedDesc:
        "Unlock detailed SEO + GEO findings, measured evidence, a prioritized fix plan, and implementation-ready guidance.",
      oneTime: "one-time",
      priorityPlan: "Priority-ranked action plan",
      stepByStep: "Detailed fix steps",
      codeSnippets: "Ready-to-use code snippets",
      priority: "Priority",
      codeSnippet: "Code Snippet",
      enterEmail: "your@email.com",
      freeUnlock: "Free Unlock Full Report",
      upgradeToPro: "Unlock Pro Audit - $9",
      processing: "Processing...",
      proAuditOverview: "Detailed SEO + GEO Audit",
      proAuditSubtitle: "Evidence-backed findings for search engines and AI answer engines.",
      seoAudit: "Technical & On-page SEO",
      geoAudit: "Generative Engine Optimization",
      findings: "findings",
      evidence: "Evidence",
      whyItMatters: "Why it matters",
      implementationSteps: "Implementation steps",
      expectedOutcome: "Expected outcome",
      legacyProNotice: "This legacy report does not contain detailed findings. Run a new audit to use the upgraded Pro analyzer.",
      adminProAccess: "Administrator Pro access confirmed.",
    },
    auth: {
      loginTitle: "Welcome Back",
      loginSubtitle: "Sign in to your account to access your reports",
      email: "Email",
      password: "Password",
      loginButton: "Sign In",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      forgotPassword: "Forgot password?",
      continueWithGoogle: "Continue with Google",
      continueWithMicrosoft: "Continue with Microsoft",
    },
    cta: {
      title: "Contact Us",
      subtitle:
        "Tell us what you need and we will help you choose the right next step.",
      email: "Email",
      companyName: "Company Name",  // 添加公司名字段
      website: "Website (Optional)",  // 网站改为可选
      goal: "Goal",
      message: "Message",
      submit: "Submit Request",
    },
  },
  zh: {
    common: {
      loading: "加载中...",
      error: "发生错误",
      back: "返回",
      share: "分享",
      delete: "删除",
      confirmDelete: "确定要删除吗？",
    },
    nav: {
      analyze: "分析",
      pricing: "定价",
      content: "内容",
      services: "服务",
      history: "历史",
      login: "登录",
      getStarted: "开始使用",
    },
    home: {
      heroTitle: "发现阻碍你",
      heroAccent: "增长的问题",
      heroSubtitle:
        "AI驱动的网站审计，准确告诉你需要修复什么——以及如何更快增长。无需注册。",
      heroPlaceholder: "输入网站，例如 example.com",
      heroButton: "获取免费审计",
      loadingMessages: [
        "正在启动云端浏览器...",
        "正在生成高清网站截图...",
        "正在分析 SEO 和页面结构...",
        "正在生成增长建议...",
      ],
      auditPreview: "我们将审计：",
      resultsTime: "通常 60 秒内生成结果",
      learnWhy: "了解为什么大多数网站无法转化",
      recentAudits: "最近分析的网站",
      painPointsTitle: "大多数网站失败不是因为流量。",
      painPointsSubtitle: "它们失败是因为隐藏的转化杀手。",
      painPointSpeed: "加载速度慢，直接损失大量移动端转化。",
      painPointSeo: "SEO 缺口阻碍业务获得自然增长。",
      painPointContent: "内容过于普通，无法吸引访客并推动转化。",
      painPointCta: "行动按钮薄弱，用户路径混乱。",
      pricingTitle: "简单定价",
      pricingFreeTitle: "免费",
      pricingFreeDesc: "快速检查网站，获得基础审计和核心洞察。",
      pricingFreeButton: "免费试用",
      pricingPopular: "最受欢迎",
      pricingProTitle: "Pro",
      pricingProDesc: "详细 SEO + GEO 审计、检测证据、优先修复计划、实施步骤和代码片段。",
      pricingOneTime: "一次性解锁",
      pricingBuyPro: "购买 Pro 审计",
      pricingCustomTitle: "定制",
      pricingCustomDesc: "完整实施和高性能网站建设服务。",
      pricingCustomPrice: "报价",
      pricingContact: "联系我们",
      howItWorks: "工作原理",
      howStepUrlTitle: "输入网址",
      howStepUrlDesc: "输入网站地址，立即开始分析。",
      howStepAiTitle: "AI 分析",
      howStepAiDesc: "我们会扫描 SEO、性能和页面结构问题。",
      howStepFixTitle: "获取修复计划",
      howStepFixDesc: "获得可执行的增长优化建议。",
      servicesTitle: "太忙没时间自己修复？",
      servicesSubtitle:
        "我们的专家团队从零开始构建高性能、高转化的网站，或优化你现有的技术栈。",
      customBuild: "定制网站构建",
      consultExpert: "咨询专家",
    },
    reports: {
      title: "审计历史记录",
      subtitle: "查看所有已生成的网站分析报告",
      newAnalysis: "新建分析",
      noReports: "暂无报告，快去分析第一个网站吧！",
      viewDetails: "查看详情",
      score: "得分",
    },
    report: {
      analyzing: "正在分析你的网站",
      estimatedTime: "预计时间：20-30秒。真正的价值需要时间。",
      loadingStructure: "正在获取网站结构",
      loadingPerformance: "正在运行性能测试",
      loadingSeo: "正在检查 SEO 信号",
      loadingAi: "正在生成 AI 洞察...",
      notFound: "未找到报告",
      notFoundDesc: "该报告可能已被删除或不存在。",
      backToReports: "返回报告列表",
      deleteReport: "删除报告",
      deleting: "正在删除...",
      deleteConfirm: "确定要永久删除这份报告吗？",
      share: "分享",
      shareCopied: "报告链接已复制！",
      siteReport: "网站报告",
      generatedOn: "生成日期",
      overallScore: "综合得分",
      scoreExcellent: "优秀",
      scoreGood: "良好",
      scoreFair: "一般",
      scoreNeedsImprovement: "需要改进",
      coreIssues: "核心问题（免费预览）",
      coreIssuesSubtitle: "前3个最关键的问题",
      impact: "影响：",
      recommendedFix: "修复建议：",
      saveFreeTitle: "保存并解锁完整免费报告",
      saveFreeDesc:
        "登录后可安全认领本次审计、查看全部免费内容，并将报告保存到您的个人历史记录。",
      signInToUnlock: "登录并解锁免费报告",
      moreIssues: "更多问题（邮箱解锁）",
      moreIssuesSubtitle: "输入邮箱解锁完整问题列表",
      fixPlans: "修复计划（Pro专享）",
      fixPlansSubtitle: "详细的修复步骤和代码片段",
      contentSuggestions: "内容建议",
      contentSuggestionsSubtitle: "提升用户体验的建议",
      supportUs: "支持 SiteScope",
      supportUsSubtitle:
        "如果这份报告对您有帮助，欢迎通过 PayPal 小额支持我们继续优化免费审计体验。捐赠完全自愿，不会解锁额外内容。",
      donate: "通过 PayPal 捐赠",
      unlockFull: "解锁完整报告",
      unlockFullDesc: "输入您的邮箱地址即可免费解锁所有SEO问题的详细分析。",
      upgradePro: "升级到Pro",
      upgradeProDesc: "解锁详细的修复计划和代码片段，获得完整的解决方案。",
      proLockedDesc: "解锁详细 SEO + GEO 发现、检测证据、优先修复计划和可直接实施的指导。",
      oneTime: "一次性付款",
      priorityPlan: "按优先级排列的行动计划",
      stepByStep: "详细的修复步骤",
      codeSnippets: "即用型代码片段",
      priority: "优先级",
      codeSnippet: "代码片段",
      enterEmail: "your@email.com",
      freeUnlock: "免费解锁完整报告",
      upgradeToPro: "解锁 Pro 审计 - $9",
      processing: "处理中...",
      proAuditOverview: "详细 SEO + GEO 审计",
      proAuditSubtitle: "面向传统搜索引擎和 AI 答案引擎的证据型审计结果。",
      seoAudit: "技术与页面 SEO",
      geoAudit: "生成式引擎优化（GEO）",
      findings: "项发现",
      evidence: "检测证据",
      whyItMatters: "为什么重要",
      implementationSteps: "实施步骤",
      expectedOutcome: "预期结果",
      legacyProNotice: "这是一份旧版报告，不包含新的详细审计字段。请重新运行审计以使用升级后的 Pro 分析器。",
      adminProAccess: "已确认管理员 Pro 权限。",
    },
    auth: {
    loginTitle: "欢迎回来",
    loginSubtitle: "登录您的账户以访问您的报告",
    email: "邮箱",
    password: "密码",
    loginButton: "登录",
    noAccount: "还没有账户？",
    signUp: "注册",
    forgotPassword: "忘记密码？",
    continueWithGoogle: "使用 Google 继续",
    continueWithMicrosoft: "使用 Microsoft 继续",
    },
    cta: {
      title: "联系我们",
      subtitle: "告诉我们您的需求，我们会帮您选择合适的下一步。",
      email: "邮箱",
      companyName: "公司名称",  // 添加公司名字段
      website: "网站（可选）",  // 网站改为可选
      goal: "目标",
      message: "留言",
      submit: "提交请求",
    },
  },
};

const languageChangeEvent = "sitescope-language-change";

function getBrowserLanguage(): Language {
  const saved = localStorage.getItem("language");
  if (saved === "en" || saved === "zh") return saved;
  return navigator.language.split("-")[0] === "zh" ? "zh" : "en";
}

function getServerLanguage(): Language {
  return "en";
}

function subscribeToLanguage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(languageChangeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(languageChangeEvent, onStoreChange);
  };
}

// Language context hook
export function useTranslation() {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getBrowserLanguage,
    getServerLanguage,
  );

  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    window.dispatchEvent(new Event(languageChangeEvent));
  };

  const t = translations[language];

  return {
    language,
    setLanguage,
    t,
  };
}
