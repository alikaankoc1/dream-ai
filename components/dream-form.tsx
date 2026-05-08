"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
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

function TypewriterText({ text }: { text: string }) {
  const words = useMemo(() => text.split(" ").filter(Boolean), [text]);
  const [visibleWordCount, setVisibleWordCount] = useState(0);

  useEffect(() => {
    if (!words.length) return;

    const intervalId = window.setInterval(() => {
      setVisibleWordCount((currentCount) => {
        if (currentCount >= words.length) {
          window.clearInterval(intervalId);
          return currentCount;
        }

        return currentCount + 1;
      });
    }, 80);

    return () => window.clearInterval(intervalId);
  }, [words]);

  return <>{words.slice(0, visibleWordCount).join(" ")}</>;
}

const moodStyles: Record<string, { border: string; glow: string; badge: string }> = {
  "Kaygı / Endişe": {
    border: "border-[#7f63d4]",
    glow: "shadow-[0_0_32px_rgba(127,99,212,0.35)]",
    badge: "border-[#b499ff]/50 bg-[#b499ff]/10 text-[#d3c1ff]",
  },
  "Huzur / Mutluluk": {
    border: "border-[#e5b95e]",
    glow: "shadow-[0_0_32px_rgba(229,185,94,0.32)]",
    badge: "border-[#f3d486]/50 bg-[#f3d486]/10 text-[#f7e2aa]",
  },
  "Korku / Kabus": {
    border: "border-[#a23d55]",
    glow: "shadow-[0_0_32px_rgba(162,61,85,0.35)]",
    badge: "border-[#dd7088]/50 bg-[#dd7088]/10 text-[#f2adbb]",
  },
  "Gizem / Bilinmezlik": {
    border: "border-[#2f93b0]",
    glow: "shadow-[0_0_32px_rgba(47,147,176,0.35)]",
    badge: "border-[#63c9e5]/50 bg-[#63c9e5]/10 text-[#a6e7f8]",
  },
  "Aşk / Romantizm": {
    border: "border-[#c27c9c]",
    glow: "shadow-[0_0_32px_rgba(194,124,156,0.35)]",
    badge: "border-[#e5aac6]/50 bg-[#e5aac6]/10 text-[#f6d3e3]",
  },
  "Yalnızlık / Hüzün": {
    border: "border-[#8c94b8]",
    glow: "shadow-[0_0_32px_rgba(140,148,184,0.32)]",
    badge: "border-[#b0b8de]/50 bg-[#b0b8de]/10 text-[#d3d8ef]",
  },
  "Macera / Heyecan": {
    border: "border-[#d87f3f]",
    glow: "shadow-[0_0_32px_rgba(216,127,63,0.35)]",
    badge: "border-[#f3a56d]/50 bg-[#f3a56d]/10 text-[#ffd1ac]",
  },
  "Aydınlanma / Farkındalık": {
    border: "border-[#d6d6e8]",
    glow: "shadow-[0_0_32px_rgba(214,214,232,0.35)]",
    badge: "border-[#eeeeff]/60 bg-[#eeeeff]/10 text-[#f8f8ff]",
  },
  "Nostalji / Özlem": {
    border: "border-[#9b7a62]",
    glow: "shadow-[0_0_32px_rgba(155,122,98,0.35)]",
    badge: "border-[#c6a58d]/50 bg-[#c6a58d]/10 text-[#e8d4c4]",
  },
};

export function DreamForm() {
  const initialDreamActionState: DreamActionState = {
    interpretation: "",
    category: "",
    mood: "",
    error: null,
    saved: false,
  };

  const [state, formAction] = useActionState(
    submitDreamAction,
    initialDreamActionState
  );
  const currentMoodStyle =
    moodStyles[state.mood] ?? moodStyles["Gizem / Bilinmezlik"];
  const interpretationKey = useMemo(
    () => `${state.category}-${state.mood}-${state.interpretation}`,
    [state.category, state.mood, state.interpretation]
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

      <AnimatePresence mode="wait">
      {state.interpretation ? (
        <motion.div
          key={interpretationKey}
          initial={{ opacity: 0, y: -36 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className={`space-y-3 rounded-xl border bg-gradient-to-b from-[#120f24] to-[#0c0a18] p-4 sm:rounded-2xl sm:p-5 ${currentMoodStyle.border} ${currentMoodStyle.glow}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-white sm:text-lg">
              Yorum Sonucu
            </h3>
            <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-[#efc66a]/50 bg-[#efc66a]/10 text-[#f3d486]">
              {state.category}
            </Badge>
            {state.mood ? (
              <Badge className={currentMoodStyle.badge}>{state.mood}</Badge>
            ) : null}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
            <TypewriterText text={state.interpretation} />
          </p>
          <p className="text-xs text-zinc-400">
            {state.saved
              ? "Supabase'e başarıyla kaydedildi."
              : "Sadece ekranda gösterildi (veritabanı kaydı yok)."}
          </p>
        </motion.div>
      ) : null}
      </AnimatePresence>
    </form>
  );
}
