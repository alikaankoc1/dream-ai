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
