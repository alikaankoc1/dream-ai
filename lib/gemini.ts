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
    "Bu ruyayi su an net yorumlayamadim. Biraz daha detay eklersen daha iyi bir analiz sunabilirim.",
};

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
    throw new Error("Ruya metni bos olamaz.");
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GEMINI_API_KEY bulunamadi.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Sen bilge bir ruya yorumcususun. Sadece gecerli JSON dondur, ekstra metin ekleme.

JSON semasi:
{
  "category": "Kisisel Gelisim | Kaygi | Iliski | Spirituel | Bilinmeyen",
  "interpretation": "2-4 cumlelik derin ama kibar bir ruya yorumu"
}

Ruya:
"""${dreamText}"""
`;

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
}
