//some keywords for crisis releted

const HIGH_RISK_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "self harm",
  "want to die",
  "no reason to live",
  "hurt myself"
];

const MEDIUM_RISK_KEYWORDS = [
  "depressed",
  "hopeless",
  "worthless",
  "tired of life",
  "giving up"
];

export const detectCrisis = (text) => {
  const lowerText = text.toLowerCase();

  const isHighRisk = HIGH_RISK_KEYWORDS.some(word =>
    lowerText.includes(word)
  );

  if (isHighRisk) {
    return { riskLevel: "HIGH", trigger: true };
  }

  const isMediumRisk = MEDIUM_RISK_KEYWORDS.some(word =>
    lowerText.includes(word)
  );

  if (isMediumRisk) {
    return { riskLevel: "MEDIUM", trigger: false };
  }

  return { riskLevel: "LOW", trigger: false };
};