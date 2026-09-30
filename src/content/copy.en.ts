/**
 * English page copy (docs/11 §4). Structural wording only — every product fact is read from
 * product.ts at render time. Anything conditional on a fact is marked with `requires`.
 * Checked by scripts/check-content.mjs against the claims policy.
 */
export const copy = {
  meta: {
    title: 'Lennore Alkaline Water Ionizer — Book a Free Home Demo',
    description:
      'Alkaline and acidic water by electrolysis, with adjustable pH levels on one control panel. See Lennore work with your own tap water — book a free home demo.',
  },

  nav: [
    { href: '#how', label: 'How it works' },
    { href: '#features', label: 'Features' },
    { href: '#service', label: 'Service' },
    { href: '#faq', label: 'FAQ' },
  ],

  cta: {
    primary: 'Book a Free Home Demo',
    primaryShort: 'Book Demo',
    whatsapp: 'WhatsApp us',
    call: 'Call',
  },

  hero: {
    eyebrow: 'Lennore Alkaline Water Ionizer',
    h1: 'Water, set by you.',
    /** {count}, {min}, {max} come from the hero model's phLevels. */
    sub: 'Ionized by electrolysis at your tap. {count} levels, labelled pH {min} to {max} on the panel.',
    imageAlt: 'Lennore L9 water ionizer with a colour screen and pH level buttons, on a dark stage',
    chips: {
      city: 'Free home demo in {city}',
      warranty: '{warranty} warranty',
      installation: 'Installation included',
    },
  },

  reveal: {
    h2: 'Designed for your countertop',
    chapters: [
      {
        id: 'design',
        title: 'Made for the countertop.',
        /** {spout} from product.json */
        body: 'Clean lines, a front control panel and a {spout}.',
        alt: 'Front view of the Lennore L9 ionizer',
      },
      {
        id: 'side',
        title: 'Everything connects at the side.',
        body: 'Labelled ports for {ports}.',
        alt: 'Side view of the Lennore L9 showing its labelled ports',
      },
      {
        id: 'display',
        title: 'Every level, one touch away.',
        body: 'A colour screen above the level buttons.',
        alt: 'Close-up of the L9 control panel: colour screen, paired pH buttons, Neutral, OFF and Auto Clean',
      },
    ],
  },

  how: {
    h2: 'How Lennore works',
    /** {steps} = number of visible stages, in words. */
    lede: '{steps} steps from your tap to your glass.',
    stages: [
      { id: 'in', title: 'Tap water in', body: 'Water enters through the Water In port on the side.' },
      { id: 'filter', title: 'Filtered first', body: '{filterType}.', requires: ['filter.type'] },
      {
        id: 'ionize',
        title: 'Ionized by electrolysis',
        body: 'Plates in the chamber pass a low current through the water.',
        bodyWithPlates: '{plates} {plateMaterial} plates pass a low current through the water.',
      },
      { id: 'split', title: 'Split into two', body: 'An alkaline stream and an acidic stream.' },
      {
        id: 'spout',
        title: 'Your level at the spout',
        body: 'Pick it on the panel. The right stream flows out.',
      },
    ],
    inlineCta: 'See it with your own tap water',
    inlineCtaLink: 'Book a demo',
    diagramLabel:
      'Diagram: water enters the ionizer, passes through the electrolysis chamber and splits into an alkaline stream to the spout and an acidic stream to the side outlet.',
  },

  choose: {
    h2: 'Choose your water.',
    instruction: 'Tap a level.',
    legend: 'pH level',
    streams: { alkaline: 'Alkaline stream', neutral: 'Neutral', acidic: 'Acidic stream' },
    phPrefix: 'pH ≈',
    bestFor: 'Best for',
    drinking: 'For drinking',
    footnote:
      'pH depends on your source water. At the demo we test your own tap water with reagent drops, right in front of you. Glass colours here are illustrative.',
    cta: 'Test your water at home — free',
    glassAlt: 'Illustration of a glass of water with reagent drops',
  },

  features: {
    h2: 'Features',
    lede: 'What you get on the L9, as fitted.',
    titles: {
      display: 'Colour display',
      controls: 'Level buttons',
      autoClean: 'Auto Clean',
      spout: 'Flexible spout',
      ports: 'Side connections',
    },
    imageAlt: 'Lennore L9 ionizer on a light background',
    closeupAlt: 'Close-up of the L9 colour screen and level buttons',
    whatsappCta: 'Get full specifications on WhatsApp',
  },

  built: {
    h2: 'Built to last.',
    sub: 'The parts that matter, made to keep working.',
    tiles: {
      plates: 'plates',
      filter: 'L filter life',
      autoClean: 'Auto Clean',
      warranty: 'warranty',
    },
  },

  fits: {
    h2: 'Fits your space.',
    panels: {
      countertop: {
        title: 'Countertop',
        body: 'Sits beside your sink, connects to the tap.',
        image: 'assets/images/lifestyle/LIFE_L7-RO_countertop.jpg',
        alt: 'Lennore L7+RO on a kitchen countertop',
        caption: 'Shown: Lennore L7+RO',
      },
      'under-counter': {
        title: 'Under-counter',
        body: 'Only the spout shows. Clean, hidden install.',
        image: 'assets/images/lifestyle/LIFE_RO_undersink.jpg',
        alt: 'Lennore RO unit installed in a cabinet under the sink',
        caption: 'Shown: under-sink unit',
      },
      'wall-mounted': {
        title: 'Wall-mounted',
        body: 'Frees your counter entirely.',
        image: 'assets/images/lifestyle/AI_LIFE_L9_wallmount.jpg',
        alt: 'Illustration of a Lennore L9 mounted on a kitchen wall',
        caption: 'Illustrative image',
      },
    },
    installedBy: 'Installation by {installationBy}.',
    whatsappCta: 'Not sure which fits? Send us a photo of your kitchen on WhatsApp.',
  },

  comparison: {
    h2: 'Ionizer or RO with an alkaline cartridge?',
  },

  service: {
    h2: 'A team you can reach.',
    blocks: {
      warranty: 'Warranty in writing',
      installation: 'Installation by our technicians',
      coverage: 'Service in {cities}',
      company: 'Who we are',
    },
    companyLine: 'Lennore is a brand of {legalName}.',
    cinLabel: 'CIN',
    emailLabel: 'Email',
    websiteLabel: 'Website',
    whatsappCta: 'Talk to our team',
  },

  stories: { h2: 'From homes that use it.' },

  models: {
    h2: 'Choose your model.',
    lede: 'Ask us which one suits your kitchen.',
    cta: 'Ask about a model at your demo',
  },

  pricing: { h2: 'Pricing', from: 'Starting from' },

  faq: { h2: 'Frequently asked questions' },

  lead: {
    h2: 'Book a free home demo.',
    bullets: {
      duration: 'About {minutes} minutes, with your own tap water',
      noObligation: 'No obligation to buy',
      whatsappConfirm: "We'll WhatsApp you to confirm a time",
    },
    fields: {
      name: 'Your name',
      phone: 'Mobile number',
      pincode: 'Pincode',
    },
    submit: 'Book my free demo',
    notice:
      "We'll use your name, mobile number and pincode to arrange your demo and contact you about it by call and WhatsApp. See our {privacy} for how we store your data, who we share it with (including advertising partners for measuring our ads) and how to withdraw consent or request deletion.",
    privacyLabel: 'Privacy Notice',
    alternatives: 'Prefer another way?',
    email: 'Email us',
  },

  footer: {
    disclaimer:
      'Lennore water ionizers produce alkaline and acidic water by electrolysis. pH and output vary with source water quality, flow and settings. Lennore products are household appliances and are not intended to diagnose, treat, cure or prevent any disease. Specifications are subject to change; refer to the product manual.',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/disclaimer', label: 'Disclaimer' },
    ],
    mainSite: 'lennore.in',
  },

  sticky: { label: 'Quick actions' },
} as const;

export type Copy = typeof copy;

/** Replace {tokens} in a copy string. Returns null if any token has no value. */
export function fill(template: string, values: Record<string, string | number | null | undefined>): string | null {
  let ok = true;
  const out = template.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = values[k];
    if (v === null || v === undefined || v === '') {
      ok = false;
      return '';
    }
    return String(v);
  });
  return ok ? out : null;
}
