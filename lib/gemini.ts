import { GoogleGenerativeAI } from "@google/generative-ai";

export type DreamCategory =
  | "Kisisel Gelisim"
  | "Kaygi"
  | "Iliski"
  | "Spirituel"
  | "Bilinmeyen";

export type DreamInsight = {
  category: DreamCategory;
  interpretation: string;
};

type AnalyzeDreamInput = {
  dreamText: string;
};

type GeminiDreamResponse = {
  category?: string;
  interpretation?: string;
};

const FALLBACK_INSIGHT: DreamInsight = {
  category: "Bilinmeyen",
  interpretation:
    "Bu rüyayı şu an net yorumlayamadım. Biraz daha detay eklersen daha iyi bir analiz sunabilirim.",
};

const DEFAULT_MODEL_CANDIDATES = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest",
];

function sanitizeCategory(rawCategory?: string): DreamCategory {
  const allowed: DreamCategory[] = [
    "Kisisel Gelisim",
    "Kaygi",
    "Iliski",
    "Spirituel",
    "Bilinmeyen",
  ];

  if (!rawCategory) return "Bilinmeyen";
  return allowed.includes(rawCategory as DreamCategory)
    ? (rawCategory as DreamCategory)
    : "Bilinmeyen";
}

function parseGeminiJson(text: string): GeminiDreamResponse | null {
  try {
    return JSON.parse(text) as GeminiDreamResponse;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;

    try {
      return JSON.parse(text.slice(start, end + 1)) as GeminiDreamResponse;
    } catch {
      return null;
    }
  }
}

export async function analyzeDreamWithGemini({
  dreamText,
}: AnalyzeDreamInput): Promise<DreamInsight> {
  if (!dreamText.trim()) {
    throw new Error("Rüya metni boş olamaz.");
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GEMINI_API_KEY bulunamadi.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const configuredModel = process.env.GOOGLE_GEMINI_MODEL?.trim();
  const modelCandidates = configuredModel
    ? [configuredModel, ...DEFAULT_MODEL_CANDIDATES]
    : DEFAULT_MODEL_CANDIDATES;

  const prompt = `
Sen bilge bir rüya yorumcususun. Sadece geçerli JSON döndür, ekstra metin ekleme.

JSON şeması:
{
  "category": "Kisisel Gelisim | Kaygi | Iliski | Spirituel | Bilinmeyen",
  "interpretation": "2-4 cümlelik derin ama kibar bir rüya yorumu"
}

Rüya:
"""${dreamText}"""
`;

  let lastError: unknown;

  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const parsed = parseGeminiJson(text);

      if (!parsed?.interpretation) {
        return FALLBACK_INSIGHT;
      }

      return {
        category: sanitizeCategory(parsed.category),
        interpretation: parsed.interpretation.trim(),
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini modeline erişilemedi.");
}
