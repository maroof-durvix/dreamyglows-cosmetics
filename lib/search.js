function _optionalChain(ops) {
  let lastAccessLHS = void 0;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    const op = ops[i];
    const fn = ops[i + 1];
    i += 2;
    if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
      return void 0;
    }
    if (op === "access" || op === "optionalAccess") {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === "call" || op === "optionalCall") {
      value = fn((...args) => value.call(lastAccessLHS, ...args));
      lastAccessLHS = void 0;
    }
  }
  return value;
}
export function normalizeSearchString(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, " ").replace(/\s+/g, " ").trim();
}
export function searchProducts(products, query) {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const normalizedQuery = normalizeSearchString(trimmed);
  if (!normalizedQuery) return [];
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const isDrArQuery = normalizedQuery === "dr ar" || normalizedQuery === "dr" || normalizedQuery === "drar" || normalizedQuery.includes("dr ar") || queryTokens.includes("dr") && queryTokens.includes("ar");
  const scoredResults = [];
  for (const product of products) {
    const normTitle = normalizeSearchString(product.title);
    const titleWords = normTitle.split(" ").filter(Boolean);
    const normSlug = normalizeSearchString(product.slug);
    const slugWords = normSlug.split(" ").filter(Boolean);
    const normCategory = normalizeSearchString(product.category);
    const catWords = normCategory.split(" ").filter(Boolean);
    const normConcerns = _optionalChain([product, "access", (_) => _.concern, "optionalAccess", (_2) => _2.map, "call", (_3) => _3((c) => normalizeSearchString(c))]) || [];
    const normIngredients = _optionalChain([product, "access", (_4) => _4.ingredients, "optionalAccess", (_5) => _5.map, "call", (_6) => _6((i) => normalizeSearchString(i))]) || [];
    let score = 0;
    let hasStrongMatch = false;
    const isDrArProduct = normTitle.includes("dr ar") || normSlug.includes("dr ar") || normTitle.startsWith("dr ar") || product.title.toLowerCase().startsWith("dr. ar") || product.title.toLowerCase().startsWith("dr.ar");
    if (isDrArQuery && isDrArProduct) {
      score += 150;
      hasStrongMatch = true;
    }
    if (normTitle === normalizedQuery) {
      score += 200;
      hasStrongMatch = true;
    } else if (normTitle.startsWith(normalizedQuery)) {
      score += 130;
      hasStrongMatch = true;
    } else if (normTitle.includes(normalizedQuery)) {
      score += 90;
      hasStrongMatch = true;
    } else if (normSlug.includes(normalizedQuery)) {
      score += 85;
      hasStrongMatch = true;
    }
    let matchedTokenCount = 0;
    for (const token of queryTokens) {
      if (titleWords.includes(token)) {
        score += 70;
        matchedTokenCount++;
        hasStrongMatch = true;
        continue;
      }
      const titlePrefixMatch = titleWords.some((w) => w.startsWith(token));
      if (titlePrefixMatch) {
        score += 55;
        matchedTokenCount++;
        hasStrongMatch = true;
        continue;
      }
      const slugPrefixMatch = slugWords.some((w) => w.startsWith(token));
      if (slugPrefixMatch) {
        score += 50;
        matchedTokenCount++;
        hasStrongMatch = true;
        continue;
      }
      const catPrefixMatch = catWords.some((w) => w.startsWith(token));
      if (catPrefixMatch) {
        score += 40;
        matchedTokenCount++;
        hasStrongMatch = true;
        continue;
      }
      const concernMatch = normConcerns.some(
        (c) => c.split(" ").some((w) => w.startsWith(token) || w === token)
      );
      if (concernMatch) {
        score += 35;
        matchedTokenCount++;
        hasStrongMatch = true;
        continue;
      }
      if (token.length >= 3) {
        const ingMatch = normIngredients.some(
          (ing) => ing.split(" ").some((w) => w.startsWith(token))
        );
        if (ingMatch) {
          score += 20;
          matchedTokenCount++;
          hasStrongMatch = true;
          continue;
        }
      }
    }
    const isValidMatch = isDrArQuery && isDrArProduct || normTitle.includes(normalizedQuery) || queryTokens.length > 1 && matchedTokenCount >= queryTokens.length || queryTokens.length === 1 && hasStrongMatch;
    if (isValidMatch && score > 0) {
      scoredResults.push({ product, score });
    }
  }
  scoredResults.sort((a, b) => b.score - a.score);
  return scoredResults.map((res) => res.product);
}
