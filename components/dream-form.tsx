"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitDreamAction, type DreamActionState } from "@/app/actions/dream-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WandSparkles } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-xl bg-gradient-to-r from-[#7750ff] via-[#4f6ad6] to-[#efc66a] text-base font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition hover:opacity-95 disabled:opacity-60 sm:h-14 sm:text-lg"
    >
      <WandSparkles className="mr-2 h-6 w-6" />
      {pending ? "Yükleniyor..." : "Rüyamı Yorumla"}
    </Button>
  );
}

export function DreamForm() {
  const initialDreamActionState: DreamActionState = {
    interpretation: "",
    category: "",
    error: null,
    saved: false,
  };

  const [state, formAction] = useActionState(
    submitDreamAction,
    initialDreamActionState
  );

  return (
    <form action={formAction} className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
      <Textarea
        name="dreamText"
        required
        minLength={10}
        className="min-h-40 resize-none rounded-xl border-[#5b4a92] bg-[#120f26] px-4 py-3 text-lg leading-relaxed font-medium text-zinc-50 placeholder:text-zinc-400 caret-[#d4c3ff] focus-visible:border-[#9f79ff] focus-visible:ring-[#9f79ff] sm:min-h-52 sm:text-xl md:text-2xl"
        placeholder="Bu gece gördüğün rüyayı detaylarıyla yaz..."
      />
      <SubmitButton />

      {state.error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      {state.interpretation ? (
        <div className="space-y-3 rounded-xl border border-[#4a3d78] bg-gradient-to-b from-[#120f24] to-[#0c0a18] p-4 shadow-[0_0_32px_rgba(110,80,190,0.2)] sm:rounded-2xl sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-white sm:text-lg">
              Yorum Sonucu
            </h3>
            <Badge className="border-[#efc66a]/50 bg-[#efc66a]/10 text-[#f3d486]">
              {state.category}
            </Badge>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
            {state.interpretation}
          </p>
          <p className="text-xs text-zinc-400">
            {state.saved
              ? "Supabase'e başarıyla kaydedildi."
              : "Sadece ekranda gösterildi (veritabanı kaydı yok)."}
          </p>
        </div>
      ) : null}
    </form>
  );
}
