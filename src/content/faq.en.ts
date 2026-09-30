/**
 * FAQ (docs/11 §7). {tokens} in the answer are filled from product data in FAQ.astro; an item renders
 * only when every token resolves. `requires` documents which product.json keys unlock it.
 */
export type FaqItem = {
  id: string;
  q: string;
  a: string;
  requires: string[];
};

export const faq: FaqItem[] = [
  {
    id: 'vs-ro',
    q: 'How is an ionizer different from an RO purifier?',
    a: 'An RO pushes water through a membrane to reduce dissolved solids. An ionizer uses electrolysis to separate water into alkaline and acidic streams you can select. Some homes use both — our team will advise based on your water.',
    requires: [],
  },
  {
    id: 'levels',
    q: 'Which pH levels can I choose?',
    a: 'The L9 panel has {levelList}. Actual pH depends on your source water.',
    requires: ['hero.phLevels'],
  },
  {
    id: 'water-source',
    q: 'Will it work with my water (borewell / high TDS)?',
    a: '{waterGuidance} We test your water at the demo.',
    requires: ['service.waterGuidance'],
  },
  {
    id: 'drinking',
    q: 'Which levels are for drinking?',
    a: '{drinkingLevels}',
    requires: ['hero.phLevels.drinkable'],
  },
  {
    id: 'filter',
    q: 'How often do I change the filter, and what does it cost?',
    a: 'About {filterLife} litres, or about {filterMonths} months for a typical family. A replacement costs ₹{filterPrice}.',
    requires: ['hero.filter.lifeLitres', 'hero.filter.lifeMonthsTypical', 'hero.filter.replacementPrice'],
  },
  {
    id: 'warranty',
    q: "What's the warranty?",
    a: '{warranty}',
    requires: ['hero.warranty.machine'],
  },
  {
    id: 'install',
    q: 'Where can it be installed, and who installs it?',
    a: 'On the countertop, under the counter or on the wall. {installationBy} install it, usually within {leadDays} days of purchase.',
    requires: ['service.installationBy', 'service.installationLeadTimeDays'],
  },
  {
    id: 'power',
    q: 'How much electricity does it use?',
    a: '{power}.',
    requires: ['hero.powerConsumption'],
  },
  {
    id: 'demo',
    q: 'Is the demo really free?',
    a: 'Yes — about {demoMinutes} minutes at your home, no obligation.',
    requires: ['service.demoDurationMinutes'],
  },
  {
    id: 'cities',
    q: 'Which cities do you cover?',
    a: '{cities}. Elsewhere, we offer video demos.',
    requires: ['service.demoCities'],
  },
  {
    id: 'emi',
    q: 'Can I pay in EMIs?',
    a: '{emi}',
    requires: ['hero.emi'],
  },
];
