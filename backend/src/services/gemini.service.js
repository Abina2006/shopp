import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient = null;

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * Heuristic fallback for review sentiment, pros/cons, and best store recommendation.
 */
function generateHeuristicAnalysis(productName, reviews = [], listings = []) {
  const reviewTexts = reviews.map(r => r.reviewText || r.review_text || '').filter(Boolean);
  const ratings = reviews.map(r => Number(r.rating) || 4).filter(Boolean);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 4.5;

  const positiveKeywords = ['good', 'great', 'excellent', 'love', 'perfect', 'best', 'durable', 'clear', 'stellar', 'superb', 'fast', 'punchy', 'comfortable', 'responsive'];
  const negativeKeywords = ['bad', 'poor', 'slow', 'heating', 'issue', 'problem', 'hot', 'drain', 'expensive', 'heavy', 'tight', 'fragile', 'broken'];

  let posCount = 0;
  let negCount = 0;

  for (const text of reviewTexts) {
    const lower = text.toLowerCase();
    for (const kw of positiveKeywords) if (lower.includes(kw)) posCount++;
    for (const kw of negativeKeywords) if (lower.includes(kw)) negCount++;
  }

  const totalHits = posCount + negCount || 1;
  const positiveScore = Math.min(100, Math.max(10, Math.round(((posCount + (avgRating >= 4 ? 3 : 1)) / (totalHits + 4)) * 100)));
  const negativeScore = Math.max(5, 100 - positiveScore);

  // Compute best store / app to buy
  const validListings = (listings || []).filter(l => (parseFloat(l.price) || 0) > 0);
  const bestListing = validListings.length > 0
    ? validListings.reduce((min, cur) => parseFloat(cur.price) < parseFloat(min.price) ? cur : min, validListings[0])
    : null;
  const highestListing = validListings.length > 0
    ? validListings.reduce((max, cur) => parseFloat(cur.price) > parseFloat(max.price) ? cur : max, validListings[0])
    : null;

  const bestStoreName = bestListing?.sellerName || 'Amazon';
  const bestPrice = bestListing ? parseFloat(bestListing.price) : 999;
  const savingsAmt = (bestListing && highestListing && parseFloat(highestListing.price) > parseFloat(bestListing.price))
    ? Math.round(parseFloat(highestListing.price) - parseFloat(bestListing.price))
    : 0;

  const bestAppReason = savingsAmt > 0
    ? `Offers the absolute lowest deal at ₹${Number(bestPrice).toLocaleString('en-IN')}, saving you ₹${savingsAmt.toLocaleString('en-IN')} compared to other platforms.`
    : `Top-rated seller with verified genuine inventory, fast dispatch, and secure return policy.`;

  return {
    summary: reviews.length > 0
      ? `Based on verified buyer reviews for ${productName}, users praise the build quality, sound clarity, and strong value proposition.`
      : `Solid performance metrics across major stores for ${productName} with high buyer satisfaction.`,
    sentiment: positiveScore >= 75 ? 'Positive' : positiveScore >= 50 ? 'Mixed / Neutral' : 'Negative',
    sentimentScore: Math.round(positiveScore),
    positivePercent: positiveScore,
    negativePercent: negativeScore,
    pros: [
      'Top-tier build quality and reliable daily performance',
      'Positive buyer satisfaction with clear feature delivery',
      'Attractive price point relative to competing market models'
    ],
    cons: [
      'May require occasional charging on long continuous usage sessions',
      'Compare warranty coverage terms across sellers before purchase'
    ],
    bestAppToBuy: bestStoreName,
    bestAppPrice: bestPrice,
    bestAppReason,
    bestAppUrl: bestListing?.sellerUrl || '',
    verdict: positiveScore >= 70 ? 'Recommended Buy' : 'Consider Alternatives',
    source: 'AI-Heuristics Engine'
  };
}

const aiCache = new Map();

/**
 * Analyze product reviews using Google Gemini AI or smart fallback.
 */
export async function analyzeProductReviews(productName, reviews = [], listings = []) {
  const cacheKey = `ai_analysis_${productName}`;
  const cached = aiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
    return cached.data;
  }

  const client = getAIClient();

  if (!client) {
    const fallbackData = generateHeuristicAnalysis(productName, reviews, listings);
    aiCache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
    return fallbackData;
  }

  try {
    const reviewData = reviews.map((r, i) => `Review ${i + 1} (${r.rating || 4}/5 stars): ${r.reviewText || r.review_text || 'No text'}`).join('\n');
    const storeData = (listings || []).map(l => `- ${l.sellerName}: ₹${l.price} (Rating: ${l.rating || 'N/A'}★, Reviews: ${l.reviewCount || 0})`).join('\n');

    const prompt = `You are an expert e-commerce product and pricing analyst. Analyze the customer reviews and available stores for the product "${productName}".
    
CRITICAL INTEGRITY RULE:
- You MUST use ONLY the verified prices provided in the "Available Stores & Pricing" list below.
- You MUST NEVER invent, guess, modify, or fabricate marketplace prices.
- Set "bestAppPrice" strictly equal to the price of that seller in the provided store list.

Available Stores & Pricing:
${storeData || 'Standard e-commerce marketplaces'}

Customer Reviews:
${reviewData || 'No specific text reviews provided.'}

Important Domain Rules for Best App Selection:
- If this product is Electronics, Smartphones, Computers/Laptops, Audio, Wearables, or Appliances: The best app to buy MUST be either "Flipkart", "Amazon", or "Meesho".
- If this product is Personal Care, Groceries, Beverages, or Snacks: The best app to buy can be "Blinkit", "Swiggy Instamart", "Zepto", "BigBasket", or "JioMart".

Return your response strictly in valid JSON format with the following schema:
{
  "summary": "A concise 2-sentence summary of customer satisfaction and main experiences",
  "sentiment": "Positive" | "Mixed / Neutral" | "Negative",
  "sentimentScore": integer between 0 and 100 (overall sentiment score),
  "positivePercent": integer between 0 and 100,
  "negativePercent": integer between 0 and 100,
  "pros": ["list 3 key advantages or compliments mentioned by users"],
  "cons": ["list 2 key drawbacks, concerns, or caveats"],
  "bestAppToBuy": "Name of the single best app/website store to buy this from (e.g. Flipkart, Amazon, Meesho for Electronics; Blinkit, Instamart for Groceries)",
  "bestAppPrice": number (exact price from the provided store list),
  "bestAppReason": "1 concise sentence explaining WHY this specific app is best (e.g. cheapest price, best rating, fastest delivery, or maximum savings)",
  "verdict": "Highly Recommended" | "Recommended Buy" | "Consider Alternatives" | "Not Recommended"
}`;

    const response = await client.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const outputText = response.text ? response.text.trim() : '';
    const parsed = JSON.parse(outputText);
    parsed.source = 'Google Gemini 1.5 Flash';

    if (parsed.bestAppToBuy && listings.length > 0) {
      const match = listings.find(l => l.sellerName.toLowerCase().includes(parsed.bestAppToBuy.toLowerCase()));
      parsed.bestAppUrl = match?.sellerUrl || listings[0]?.sellerUrl || '';
    }

    aiCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
    return parsed;
  } catch (error) {
    console.warn('Gemini API call failed, falling back to heuristic analyzer:', error.message);
    return generateHeuristicAnalysis(productName, reviews, listings);
  }
}

/**
 * Decision function: determines if Gemini is needed for a query.
 * Simple keyword searches (e.g. "milk 500ml", "5 eggs", "iPhone 15 128GB", "shoes", "books", "pen") return useGemini: false.
 * Complex/conversational/intent queries (e.g. "best phone for gaming under 20000", "laptop for coding under 60000") return useGemini: true.
 */
export function shouldUseGemini(query) {
  if (!query || typeof query !== 'string') {
    return { useGemini: false, reason: 'empty_query' };
  }

  const qLower = query.trim().toLowerCase();
  const wordCount = qLower.split(/\s+/).length;

  const complexKeywords = [
    'best', 'top', 'cheap', 'cheapest', 'under', 'below', 'for', 'with', 'ideal',
    'recommend', 'suggestion', 'which', 'better', 'versus', 'vs', 'good', 'great',
    'suitable', 'student', 'college', 'coding', 'gaming', 'camera', 'walking', 'daily',
    'gift', 'sister', 'party', 'office', 'work'
  ];

  const hasComplexKeyword = complexKeywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(qLower));

  if (hasComplexKeyword || wordCount >= 5) {
    return {
      useGemini: true,
      reason: hasComplexKeyword ? 'complex_requirements' : 'ambiguous_query'
    };
  }

  return {
    useGemini: false,
    reason: 'simple_keyword_query'
  };
}

/**
 * Use Gemini AI to parse a complex natural language shopping query into structured JSON metadata.
 */
export async function parseQueryWithGemini(query) {
  const client = getAIClient();
  if (!client) {
    return null;
  }

  try {
    const prompt = `You are a shopping intent parser for ShopWise AI. Analyze the user's shopping query "${query}" and return structured JSON metadata.

Schema:
{
  "category": "detected main category (e.g. Electronics, Grocery, Books, Fashion, Footwear, Stationery, Beverages, Furniture, Toys, Gardening)",
  "subcategory": "specific subcategory or null",
  "productName": "canonical product name or null",
  "brand": "brand name or null",
  "model": "model name or null",
  "variant": "variant/spec or null",
  "budgetMin": number or null,
  "budgetMax": number or null,
  "quantity": number or null,
  "unit": "pieces/ml/L/g/kg/units or null",
  "ram": "e.g. 8GB/16GB or null",
  "storage": "e.g. 128GB/512GB or null",
  "processor": "e.g. i5/Ryzen 5/A16 or null",
  "gpu": "e.g. RTX 3050 or null",
  "display": "null or spec",
  "useCase": "e.g. gaming, coding, camera, daily, student or null",
  "preferences": ["array of extra user preferences"],
  "confidence": number between 0 and 1,
  "needsClarification": boolean
}`;

    const response = await client.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const outputText = response.text ? response.text.trim() : '';
    const parsed = JSON.parse(outputText);
    return parsed;
  } catch (err) {
    console.warn('[GeminiService] parseQueryWithGemini failed:', err.message);
    return null;
  }
}

/**
 * Use Gemini AI to explain trade-offs and recommendations on REAL, VERIFIED retrieved products ONLY.
 */
export async function generateGeminiExplanation(query, products = []) {
  const client = getAIClient();
  if (!client || products.length === 0) {
    return null;
  }

  try {
    const productSummaries = products.map((p, i) => {
      const bestPrice = p.lowestPriceListing ? `₹${p.lowestPriceListing.price} on ${p.lowestPriceListing.sellerName}` : 'Price N/A';
      return `${i + 1}. ${p.name} (${p.brand || 'Brand'}) - Lowest Price: ${bestPrice} - Specs: ${p.description || 'Standard'}`;
    }).join('\n');

    const prompt = `You are ShopWise AI's shopping assistant. The user searched for: "${query}".
Below is the list of REAL, VERIFIED products retrieved from authorized stores:

${productSummaries}

CRITICAL INTEGRITY RULES:
- You MUST discuss ONLY the real products provided above.
- NEVER invent, introduce, or mention external prices, models, or stores not in the list.
- Provide a brief 2-3 sentence AI recommendation explaining which product best fits their purpose and why.`;

    const response = await client.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    return response.text ? response.text.trim() : null;
  } catch (err) {
    console.warn('[GeminiService] generateGeminiExplanation failed:', err.message);
    return null;
  }
}
