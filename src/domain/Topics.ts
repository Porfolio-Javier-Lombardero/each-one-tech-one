
// Maps human-readable category keys to TechCrunch's internal numeric tag IDs. Not sequential — these are TechCrunch's own identifiers.
export const Topics = {
  robotics: 577123751,
  policy: 577065682,
  social: 577055593,
  gaming: 577052804,
  gadgets: 449223024,
  app: 577051039,
  AI: 577047203,
  biotech: 577030454,
  financialtech: 577030453,
  hardware: 577052803,
  privacy: 426637499,
  space: 174,
  transportation: 2401,
  venture: 577030455,
  functionality: 577343450,
  state: 577303513,
  fundraising: 577234943,
  commerce: 577052802,
  entretaiment: 577030456,
  enterprise: 449557044,
  climate: 576957003,
  crypto: 576601119,
  security: 21587494,
  startups: 20429,
  techone: 17396,
} as const;

// UI-facing category labels used in the nav and URLs. These are the values users see and that travel as route params.
export const Categories = {
  App: "App's & Software",
  Smartphones: "Smartphones",
  Gadgets: "Hardware & Gadgets",
  AI: "A.I.",
  Policy: "Policy & Regulation",
} as const;

// 0 means "all categories" — used on the homepage to fetch a mixed feed without filtering by topic.
export type TopicId = typeof Categories[keyof typeof Categories] | 0;
// "smartphone" is a Guardian API string slug, not a TechCrunch numeric ID. It is the only non-numeric API identifier.
export type ApiTopicId = typeof Topics[keyof typeof Topics] | "smartphone" | 0;

// Converts a UI category label (TopicId) into the identifier the API expects (ApiTopicId).
// Smartphones maps to the Guardian slug "smartphone" instead of a TechCrunch number because Guardian is the source for that category.
export function getTopicId(topic: TopicId): ApiTopicId {
  switch (topic) {
    case "App's & Software":  return Topics.app;
    case "Smartphones":       return "smartphone";
    case "Hardware & Gadgets": return Topics.gadgets;
    case "A.I.":              return Topics.AI;
    case "Policy & Regulation": return Topics.policy;
    default:                  return 0;
  }
}
