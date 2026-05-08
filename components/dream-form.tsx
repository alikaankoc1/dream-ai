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
    badge:
      "h-8 px-3 text-sm font-semibold tracking-wide border-[#b499ff]/60 bg-[#b499ff]/18 text-[#ece2ff] shadow-[0_0_18px_rgba(180,153,255,0.35)]",
  },
  "Huzur / Mutluluk": {
    border: "border-[#e5b95e]",
    glow: "shadow-[0_0_32px_rgba(229,185,94,0.32)]",
    badge:
      "h-8 px-3 text-sm font-semibold tracking-wide border-[#f3d486]/60 bg-[#f3d486]/18 text-[#ffefc6] shadow-[0_0_18px_rgba(243,212,134,0.35)]",
  },
  "Korku / Kabus": {
    border: "border-[#a23d55]",
    glow: "shadow-[0_0_32px_rgba(162,61,85,0.35)]",
    badge:
      "h-8 px-3 text-sm font-semibold tracking-wide border-[#dd7088]/60 bg-[#dd7088]/18 text-[#ffd5dd] shadow-[0_0_18px_rgba(221,112,136,0.35)]",
  },
  "Gizem / Bilinmezlik": {
    border: "border-[#2f93b0]",
    glow: "shadow-[0_0_32px_rgba(47,147,176,0.35)]",
    badge:
      "h-8 px-3 text-sm font-semibold tracking-wide border-[#63c9e5]/60 bg-[#63c9e5]/18 text-[#d1f4ff] shadow-[0_0_18px_rgba(99,201,229,0.35)]",
  },
  "Aşk / Romantizm": {
    border: "border-[#c27c9c]",
    glow: "shadow-[0_0_32px_rgba(194,124,156,0.35)]",
    badge:
      "h-8 px-3 text-sm font-semibold tracking-wide border-[#e5aac6]/60 bg-[#e5aac6]/18 text-[#ffe4f0] shadow-[0_0_18px_rgba(229,170,198,0.35)]",
  },
  "Yalnızlık / Hüzün": {
    border: "border-[#8c94b8]",
    glow: "shadow-[0_0_32px_rgba(140,148,184,0.32)]",
    badge:
      "h-8 px-3 text-sm font-semibold tracking-wide border-[#b0b8de]/60 bg-[#b0b8de]/18 text-[#edf0ff] shadow-[0_0_18px_rgba(176,184,222,0.35)]",
  },
  "Macera / Heyecan": {
    border: "border-[#d87f3f]",
    glow: "shadow-[0_0_32px_rgba(216,127,63,0.35)]",
    badge:
      "h-8 px-3 text-sm font-semibold tracking-wide border-[#f3a56d]/60 bg-[#f3a56d]/18 text-[#ffe2c9] shadow-[0_0_18px_rgba(243,165,109,0.35)]",
  },
  "Aydınlanma / Farkındalık": {
    border: "border-[#d6d6e8]",
    glow: "shadow-[0_0_32px_rgba(214,214,232,0.35)]",
    badge:
      "h-8 px-3 text-sm font-semibold tracking-wide border-[#eeeeff]/70 bg-[#eeeeff]/18 text-[#ffffff] shadow-[0_0_18px_rgba(238,238,255,0.35)]",
  },
  "Nostalji / Özlem": {
    border: "border-[#9b7a62]",
    glow: "shadow-[0_0_32px_rgba(155,122,98,0.35)]",
    badge:
      "h-8 px-3 text-sm font-semibold tracking-wide border-[#c6a58d]/60 bg-[#c6a58d]/18 text-[#f4e6da] shadow-[0_0_18px_rgba(198,165,141,0.35)]",
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
            <h3 className="font-serif text-xl font-semibold tracking-tight text-[#f8f4ff] sm:text-2xl">
              Yorum Sonucu
            </h3>
            <div className="flex flex-wrap items-center gap-2">
            <Badge className="h-8 px-3 text-sm font-semibold tracking-wide border-[#efc66a]/60 bg-[#efc66a]/18 text-[#ffefc6] shadow-[0_0_18px_rgba(239,198,106,0.35)]">
              {state.category}
            </Badge>
            {state.mood ? (
              <Badge className={currentMoodStyle.badge}>{state.mood}</Badge>
            ) : null}
            </div>
          </div>
          <p className="font-serif text-base leading-relaxed text-zinc-100 sm:text-xl">
            <TypewriterText text={state.interpretation} />
          </p>
        </motion.div>
      ) : null}
      </AnimatePresence>
    </form>
  );
}
