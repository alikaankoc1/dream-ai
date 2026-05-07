"use server";

import { analyzeDreamWithGemini } from "@/lib/gemini";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export type DreamActionState = {
  interpretation: string;
  category: string;
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
      error: "Lutfen bir ruya metni gir.",
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
        error: `Yorum uretildi, fakat veritabani kaydi sirasinda bir sorun yasandi. (${error.message})`,
        saved: false,
      };
    }

    return {
      interpretation: dreamInsight.interpretation,
      category: dreamInsight.category,
      error: null,
      saved: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Yorum olusturulurken beklenmeyen bir sorun olustu.";

    return {
      interpretation: "",
      category: "",
      error: `Su an yorum olusturulamadi. Lutfen tekrar dene. (${errorMessage})`,
      saved: false,
    };
  }
}
