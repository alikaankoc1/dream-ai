"use server";

import { analyzeDreamWithGemini } from "@/lib/gemini";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export type DreamActionState = {
  interpretation: string;
  category: string;
  mood: string;
  error: string | null;
  saved: boolean;
};

function isLikelyDreamText(input: string): boolean {
  const cleaned = input.trim().toLocaleLowerCase("tr-TR");
  if (cleaned.length < 8) return false;

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;

  const lettersOnly = cleaned.replace(/[^a-zçğıöşü]/g, "");
  if (lettersOnly.length < 6) return false;

  const vowelMatches = lettersOnly.match(/[aeıioöuü]/g) ?? [];
  const vowelRatio = vowelMatches.length / lettersOnly.length;
  if (vowelRatio < 0.2 || vowelRatio > 0.8) return false;

  // Rastgele klavye girdilerinde sık görülen uzun ünsüz dizilerini engeller.
  if (/[bcçdfgğhjklmnprsştvyz]{6,}/i.test(cleaned)) return false;
  if (/(.)\1{3,}/.test(cleaned)) return false;

  const meaningfulWordCount = words.filter(
    (word) => word.length >= 2 && /[aeıioöuü]/i.test(word)
  ).length;
  return meaningfulWordCount / words.length >= 0.6;
}

export async function submitDreamAction(
  _prevState: DreamActionState,
  formData: FormData
): Promise<DreamActionState> {
  const dreamText = String(formData.get("dreamText") ?? "").trim();

  if (!dreamText) {
    return {
      interpretation: "",
      category: "",
      mood: "",
      error: "Lütfen bir rüya metni gir.",
      saved: false,
    };
  }

  if (!isLikelyDreamText(dreamText)) {
    return {
      interpretation: "",
      category: "",
      mood: "",
      error:
        "Lütfen anlaşılır bir rüya metni yaz. Çok kısa veya rastgele harflerden oluşan girdiler yorumlanamaz.",
      saved: false,
    };
  }

  try {
    const dreamInsight = await analyzeDreamWithGemini({ dreamText });
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("dreams").insert({
      dream_text: dreamText,
      interpretation: dreamInsight.interpretation,
      category: dreamInsight.category,
    });

    if (error) {
      return {
        interpretation: dreamInsight.interpretation,
        category: dreamInsight.category,
        mood: dreamInsight.mood,
        error: `Yorum üretildi, fakat veritabanı kaydı sırasında bir sorun yaşandı. (${error.message})`,
        saved: false,
      };
    }

    return {
      interpretation: dreamInsight.interpretation,
      category: dreamInsight.category,
      mood: dreamInsight.mood,
      error: null,
      saved: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Yorum oluşturulurken beklenmeyen bir sorun oluştu.";

    return {
      interpretation: "",
      category: "",
      mood: "",
      error: `Şu an yorum oluşturulamadı. Lütfen tekrar dene. (${errorMessage})`,
      saved: false,
    };
  }
}
