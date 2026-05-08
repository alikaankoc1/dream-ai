import { GoogleGenerativeAI } from "@google/generative-ai";

export type DreamCategory =
  | "Kişisel Gelişim"
  | "Kaygı"
  | "İlişki"
  | "Spiritüel"
  | "Bilinmeyen";

export type DreamInsight = {
  category: DreamCategory;
  mood: string;
  interpretation: string;
};

type AnalyzeDreamInput = {
  dreamText: string;
};

type GeminiDreamResponse = {
  category?: string;
  mood?: string;
  interpretation?: string;
};

const FALLBACK_INSIGHT: DreamInsight = {
  category: "Bilinmeyen",
  mood: "Gizem / Bilinmezlik",
  interpretation:
    "Bu rüyayı şu an net yorumlayamadım. Biraz daha detay eklersen daha iyi bir analiz sunabilirim.",
};

const DEFAULT_MODEL_CANDIDATES = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
];

function sanitizeCategory(rawCategory?: string): DreamCategory {
  if (!rawCategory) return "Bilinmeyen";

  const normalized = rawCategory
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (normalized.includes("kisisel") && normalized.includes("gelisim")) {
    return "Kişisel Gelişim";
  }
  if (normalized.includes("kaygi")) {
    return "Kaygı";
  }
  if (normalized.includes("iliski")) {
    return "İlişki";
  }
  if (normalized.includes("spirituel")) {
    return "Spiritüel";
  }
  if (normalized.includes("bilinmeyen")) {
    return "Bilinmeyen";
  }

  return "Bilinmeyen";
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
  "category": "Kişisel Gelişim | Kaygı | İlişki | Spiritüel | Bilinmeyen",
  "mood": "Kaygı / Endişe | Huzur / Mutluluk | Korku / Kabus | Gizem / Bilinmezlik | Aşk / Romantizm | Yalnızlık / Hüzün | Macera / Heyecan | Aydınlanma / Farkındalık | Nostalji / Özlem",
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
        mood: parsed.mood?.trim() || FALLBACK_INSIGHT.mood,
        interpretation: parsed.interpretation.trim(),
      };
    } catch (error) {
      lastError = error;
    }
  }

  // Tüm aday modeller başarısız olursa akışı kırmak yerine
  // kullanıcıya güvenli bir fallback yorum göster.
  if (lastError instanceof Error) {
    const errorMessage = lastError.message;
    const modelNotFound =
      errorMessage.includes("404") ||
      errorMessage.includes("not found") ||
      errorMessage.includes("is not supported for generateContent");

    if (modelNotFound) {
      return FALLBACK_INSIGHT;
    }

    throw lastError;
  }

  return FALLBACK_INSIGHT;
}
