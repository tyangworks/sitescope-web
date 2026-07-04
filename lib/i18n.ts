// lib/i18n.ts

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
    notFound: string;
    overallScore: string;
    coreIssues: string;
    coreIssuesSubtitle: string;
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
    stepByStep: string;
    codeSnippets: string;
    priority: string;
    codeSnippet: string;
    enterEmail: string;
    freeUnlock: string;
    upgradeToPro: string;
    processing: string;
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
      pricingProDesc: "Full audit report + step-by-step fix plan & code snippets.",
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
      notFound: "Report Not Found",
      overallScore: "Overall Score",
      coreIssues: "Core Issues (Free Preview)",
      coreIssuesSubtitle: "Top 3 most critical issues",
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
      stepByStep: "Detailed fix steps",
      codeSnippets: "Ready-to-use code snippets",
      priority: "Priority",
      codeSnippet: "Code Snippet",
      enterEmail: "your@email.com",
      freeUnlock: "Free Unlock Full Report",
      upgradeToPro: "Unlock Pro Audit - $9",
      processing: "Processing...",
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
      pricingProDesc: "完整审计报告、分步骤修复计划和代码片段。",
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
      notFound: "未找到报告",
      overallScore: "综合得分",
      coreIssues: "核心问题（免费预览）",
      coreIssuesSubtitle: "前3个最关键的问题",
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
      stepByStep: "详细的修复步骤",
      codeSnippets: "即用型代码片段",
      priority: "优先级",
      codeSnippet: "代码片段",
      enterEmail: "your@email.com",
      freeUnlock: "免费解锁完整报告",
      upgradeToPro: "解锁 Pro 审计 - $9",
      processing: "处理中...",
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

// Language context hook
export function useTranslation() {
  // This would typically use React Context, but for simplicity we'll use localStorage
  const getLanguage = (): Language => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      if (saved && (saved === "en" || saved === "zh")) {
        return saved;
      }
      // Detect browser language
      const browserLang = navigator.language.split("-")[0];
      return browserLang === "zh" ? "zh" : "en";
    }
    return "en";
  };

  const setLanguage = (lang: Language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
      window.location.reload();
    }
  };

  const t = translations[getLanguage()];

  return {
    language: getLanguage(),
    setLanguage,
    t,
  };
}
