/**
 * Score extracted CV text by matching job keywords
 */
exports.scoreCV = (text, keywords) => {
    const lowered = text.toLowerCase();
    let score = 0;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, "g");
      const matches = lowered.match(regex);
      if (matches) score += matches.length;
    });
    return score;
  };
  