export type ContentArticle = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  primaryCta: string;
  sections: Array<
    | {
        type: "intro";
        heading: string;
        paragraphs: string[];
      }
    | {
        type: "list";
        heading: string;
        items: Array<{
          title: string;
          body: string;
          takeaway?: string;
          cta?: string;
        }>;
      }
    | {
        type: "comparison";
        heading: string;
        leftLabel: string;
        rightLabel: string;
        rows: Array<[string, string]>;
      }
    | {
        type: "simple";
        heading: string;
        paragraphs: string[];
      }
  >;
  finalHeading: string;
  finalCopy: string;
  secondaryLinks: Array<{ label: string; href: string }>;
};

export const articles: ContentArticle[] = [
  {
    slug: "why-no-sales",
    title: "Why Your Website Gets Traffic But No Sales",
    eyebrow: "Find out what's holding your site back",
    description:
      "Traffic is only useful when visitors understand your offer, trust your site, and know what to do next.",
    primaryCta: "Get Free Audit",
    sections: [
      {
        type: "intro",
        heading: "Most websites do not fail because of traffic",
        paragraphs: [
          "They fail because of what happens after users arrive.",
          "You can get clicks. You can run ads. You can even rank on search.",
          "But if your site does not convert, none of that matters.",
        ],
      },
      {
        type: "list",
        heading: "Here's what is usually going wrong",
        items: [
          {
            title: "Your site is too slow",
            body: "Users do not wait. If your page takes more than a few seconds to load, they leave before they even see your offer.",
            takeaway: "Lost traffic = lost revenue",
            cta: "Want to check your speed? Run a free audit.",
          },
          {
            title: "Your message is not clear",
            body: "When someone lands on your homepage, they should instantly know what you do, who it is for, and why it matters.",
            takeaway: "Confusion kills conversions",
            cta: "See how clear your messaging is.",
          },
          {
            title: "Your structure is broken",
            body: "Bad layout creates bad decisions. No clear CTA, too many distractions, and weak hierarchy leave users unsure where to go.",
            takeaway: "No direction = no action",
            cta: "Analyze your structure.",
          },
          {
            title: "Your content does not convert",
            body: "Most sites talk too much, sell too little, and lack urgency. Content should guide users toward action.",
            takeaway: "Attention without action = zero growth",
            cta: "Find your conversion gaps.",
          },
        ],
      },
      {
        type: "comparison",
        heading: "Guessing vs Knowing",
        leftLabel: "Guessing",
        rightLabel: "SiteScope",
        rows: [
          ["Random changes", "Data-driven insights"],
          ["Trial and error", "Clear priorities"],
          ["Slow progress", "Fast improvements"],
        ],
      },
      {
        type: "simple",
        heading: "You do not need more traffic",
        paragraphs: ["You need fewer mistakes."],
      },
    ],
    finalHeading: "Run your free audit now",
    finalCopy: "No signup required. Results in minutes.",
    secondaryLinks: [
      { label: "Want a full report and fix plan? Upgrade to Pro", href: "/#pricing" },
      { label: "Need help fixing it? Let us rebuild it for you", href: "/contact" },
    ],
  },
  {
    slug: "website-mistakes",
    title: "Top 10 Website Mistakes That Kill Your Growth",
    eyebrow: "Discover your biggest mistakes",
    description:
      "Most websites look fine on the surface. Underneath, small issues quietly leak attention, trust, and revenue.",
    primaryCta: "Get Free Audit",
    sections: [
      {
        type: "intro",
        heading: "Most websites look fine",
        paragraphs: ["But under the surface, they are leaking growth.", "Here are the most common mistakes:"],
      },
      {
        type: "list",
        heading: "The 10 growth killers",
        items: [
          { title: "No clear value proposition", body: "Users do not understand what you offer." },
          { title: "Slow loading speed", body: "Every extra second kills conversions." },
          { title: "Weak call-to-action", body: "No urgency. No clarity." },
          { title: "Poor mobile experience", body: "Most users are on mobile, and your site has to feel natural there." },
          { title: "No SEO structure", body: "Search engines cannot understand your site." },
          { title: "Too much clutter", body: "Too many elements create no focus." },
          { title: "Inconsistent branding", body: "The site feels less trustworthy than the business behind it." },
          { title: "No content strategy", body: "Traffic comes, but it does not convert." },
          { title: "No analytics or insights", body: "You do not know what is broken." },
          { title: "Guessing instead of analyzing", body: "The biggest mistake of all." },
        ],
      },
      {
        type: "simple",
        heading: "Fixing everything manually is hard",
        paragraphs: [
          "You do not know where to start.",
          "You do not know what matters most.",
          "That is why most people do nothing.",
        ],
      },
    ],
    finalHeading: "Let data show you what to fix",
    finalCopy: "Start with the issues that actually limit growth.",
    secondaryLinks: [
      { label: "Get a full prioritized fix plan", href: "/#pricing" },
      { label: "Or let us fix it for you", href: "/contact" },
    ],
  },
  {
    slug: "stop-guessing",
    title: "Stop Guessing. Start Growing.",
    eyebrow: "See what actually matters",
    description:
      "Random changes feel productive, but growth comes from knowing what is broken and what to fix first.",
    primaryCta: "Get Free Audit",
    sections: [
      {
        type: "intro",
        heading: "Most founders guess",
        paragraphs: [
          "They change random things, try new designs, and follow generic advice.",
          "Sometimes it works. Most of the time, it does not.",
        ],
      },
      {
        type: "simple",
        heading: "Guessing leads to wasted time",
        paragraphs: [
          "You might fix low-impact issues, ignore critical problems, and spend weeks with no results.",
          "Effort does not automatically create growth.",
        ],
      },
      {
        type: "list",
        heading: "Data changes everything",
        items: [
          { title: "You know what to fix", body: "The next move becomes clear." },
          { title: "You know what matters most", body: "You stop spending energy on cosmetic changes." },
          { title: "You move faster", body: "Priorities turn into action." },
        ],
      },
      {
        type: "simple",
        heading: "That is what SiteScope does",
        paragraphs: [
          "We analyze your website and show what is broken, why it matters, and how to fix it.",
          "No more guessing. Just clarity.",
        ],
      },
    ],
    finalHeading: "Run your audit now",
    finalCopy: "Get a clearer view of what is blocking your website growth.",
    secondaryLinks: [
      { label: "Upgrade to Pro for full insights", href: "/#pricing" },
      { label: "Get expert help to fix everything", href: "/contact" },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
