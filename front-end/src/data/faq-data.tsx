interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const faqData: FaqItem[] = [
  {
    category: "Shade Matching",
    question: "How do I find my correct shade?",
    answer: "You can browse our Shade Guide page to explore different skin depths and undertones, helping you understand your complexion and find your ideal match visually."
  },
  {
    category: "Shade Matching",
    question: "What if I order the wrong shade?",
    answer: "We offer hassle-free exchanges and returns within 30 days so you can easily swap it out for the right shade."
  },
  {
    category: "Orders & Shipping",
    question: "How long does shipping take?",
    answer: "Standard orders typically process within 1–2 business days and arrive within 3–5 business days. Express options are available at checkout."
  },
  {
    category: "Products",
    question: "Are your formulas cruelty-free?",
    answer: "Yes, all our products are 100% cruelty-free and thoughtfully crafted without animal-derived ingredients."
  },
  {
    category: "Products",
    question: "Are your products suitable for sensitive skin?",
    answer: "Yes, all our formulas are dermatologically tested and crafted without harsh parabens, sulfates, or artificial fragrances."
  },
  {
    category: "Products",
    question: "How long do your formulas last throughout the day?",
    answer: "Our lightweight, breathable formulas are designed for long-wear performance, staying fresh and comfortable for up to 12 hours."
  }
];