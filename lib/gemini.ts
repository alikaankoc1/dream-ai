export type DreamCategory =
  | "Kisisel Gelisim"
  | "Kaygi"
  | "Iliski"
  | "Spirituel"
  | "Bilinmeyen";

export type DreamInsight = {
  category: DreamCategory;
  confidence: number;
  symbols: string[];
  interpretation: string;
  suggestions: string[];
};

type AnalyzeDreamInput = {
  dreamText: string;
  locale?: string;
};

export async function analyzeDreamWithGemini({
  dreamText,
  locale = "tr-TR",
}: AnalyzeDreamInput): Promise<DreamInsight> {
  if (!dreamText.trim()) {
    throw new Error("Ruya metni bos olamaz.");
  }

  // TODO: Gemini entegrasyonu aktif edilince prompt + structured output burada kurulacak.
  // const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  // const response = await model.generateContent(...)
  // return mapGeminiResponse(response);

  return Promise.resolve({
    category: "Spirituel",
    confidence: 0.82,
    symbols: ["Yildiz", "Deniz", "Yolculuk"],
    interpretation:
      locale === "tr-TR"
        ? "Ruyan, icsel yon bulma surecinde oldugunu ve sezgisel tarafinin guclendigini isaret ediyor."
        : "Your dream suggests inner guidance and growing intuition.",
    suggestions: [
      "Son gunlerde seni etkileyen bir olayi not al.",
      "Tekrarlayan sembolleri bir ruya gunlugunde takip et.",
      "Yatmadan once niyet cumlesi belirleyip sabah tekrar oku.",
    ],
  });
}
