"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

export type DreamActionState = {
  interpretation: string;
  category: string;
  error: string | null;
  saved: boolean;
};

export const initialDreamActionState: DreamActionState = {
  interpretation: "",
  category: "",
  error: null,
  saved: false,
};

function createMockInterpretation(dreamText: string) {
  return {
    category: "Spirituel",
    interpretation: `Ruyanda gecen imgeler (ilk kelimeler: ${dreamText
      .split(/\s+/)
      .slice(0, 8)
      .join(" ")}) icsel arayis, belirsizlik ve degisim temasina isaret ediyor.`,
  };
}

export async function submitDreamAction(
  _prevState: DreamActionState,
  formData: FormData
): Promise<DreamActionState> {
  const dreamText = String(formData.get("dreamText") ?? "").trim();

  if (!dreamText) {
    return {
      ...initialDreamActionState,
      error: "Lutfen bir ruya metni gir.",
    };
  }

  const mock = createMockInterpretation(dreamText);

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("dreams").insert({
      dream_text: dreamText,
      interpretation: mock.interpretation,
      category: mock.category,
      user_id: null,
    });

    if (error) {
      return {
        interpretation: mock.interpretation,
        category: mock.category,
        error: `Yorum uretildi ama kayit sirasinda hata olustu: ${error.message}`,
        saved: false,
      };
    }

    return {
      interpretation: mock.interpretation,
      category: mock.category,
      error: null,
      saved: true,
    };
  } catch {
    return {
      interpretation: mock.interpretation,
      category: mock.category,
      error:
        "Yorum uretildi ancak Supabase baglantisi kurulamadigi icin kaydedilemedi.",
      saved: false,
    };
  }
}
