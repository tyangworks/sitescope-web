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
    heroSubtitle: string;
    heroPlaceholder: string;
    heroButton: string;
    recentAudits: string;
    painPointsTitle: string;
    painPointsSubtitle: string;
    pricingTitle: string;
    howItWorks: string;
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
      heroSubtitle:
        "AI-powered website audits that show you exactly what to fix — and how to grow faster. No sign-up required.",
      heroPlaceholder: "Enter your website URL (e.g. https://site.com)",
      heroButton: "Get Free Audit",
      recentAudits: "Recently Analyzed Sites",
      painPointsTitle: "Most websites don't fail because of traffic.",
      painPointsSubtitle: "They fail because of hidden conversion killers.",
      pricingTitle: "Simple Pricing",
      howItWorks: "How It Works",
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
      supportUs: "Support Us",
      supportUsSubtitle:
        "If this report was helpful, please consider donating via PayPal to support our development. This is optional and won't unlock any additional content.",
      donate: "Donate via PayPal",
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
      upgradeToPro: "Upgrade to Pro - $19 CAD",
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
      title: "Get Your Custom Website",
      subtitle:
        "Tell us about your project and we'll create a high-performance website for you",
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
      heroSubtitle:
        "AI驱动的网站审计，准确告诉你需要修复什么——以及如何更快增长。无需注册。",
      heroPlaceholder: "输入你的网站URL (例如 https://site.com)",
      heroButton: "获取免费审计",
      recentAudits: "最近分析的网站",
      painPointsTitle: "大多数网站失败不是因为流量。",
      painPointsSubtitle: "它们失败是因为隐藏的转化杀手。",
      pricingTitle: "简单定价",
      howItWorks: "工作原理",
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
      supportUs: "支持我们",
      supportUsSubtitle:
        "如果这个报告对您有帮助，请考虑通过PayPal捐赠来支持我们的开发工作。这是可选的，不会解锁任何额外内容。",
      donate: "通过PayPal捐赠",
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
      upgradeToPro: "升级到Pro - $19 CAD",
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
      title: "获取您的定制网站",
      subtitle: "告诉我们您的项目信息，我们将为您创建高性能网站",
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
