import { Badge } from "@/components/ui/badge";
import { DreamForm } from "@/components/dream-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoonStar, Sparkles, Stars } from "lucide-react";

export default function Home() {
  const sampleDreams = [
    "Sisli bir ormanda altın kapılı bir kuleye yürüyordum, kapı açılınca çocukluk evimi gördüm.",
    "Gece denizde yıldızların suya düştüğünü izledim, her yıldız bir dilek gibi parlıyordu.",
    "Bilinmeyen bir şehirde uçarak geziyordum ve herkes aynı melodiyi mırıldanıyordu.",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090714] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,70,175,0.35),_transparent_50%),radial-gradient(circle_at_75%_25%,_rgba(26,74,140,0.3),_transparent_40%)]" />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 md:gap-12 md:px-10 md:py-14">
        <section className="mx-auto w-full max-w-3xl rounded-2xl border border-[#3e3265]/70 bg-[#120f24]/85 p-4 shadow-[0_0_80px_rgba(80,52,160,0.25)] backdrop-blur sm:rounded-3xl sm:p-6 md:p-10">
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
            <Badge className="border-[#efc66a]/50 bg-[#efc66a]/10 text-[#f3d486] hover:bg-[#efc66a]/20">
              DreamAI Beta
            </Badge>
            <MoonStar className="h-5 w-5 text-[#efc66a]" />
          </div>
          <div className="space-y-3 text-center sm:space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Rüyalarını Yapay Zeka ile Anlamlandır
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base md:text-lg">
              Rüyanı yaz, yapay zeka sembolleri analiz etsin, kategorize etsin ve
              sana derin bir yorum sunsun.
            </p>
          </div>
          <DreamForm />
        </section>

        <section className="space-y-5">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-white sm:text-3xl">
            <Stars className="h-6 w-6 text-[#efc66a]" />
            Örnek Rüyalar
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleDreams.map((dream, index) => (
            <Card
              key={dream}
              className="border-[#2f2a50] bg-[#100d1f]/90 text-zinc-200 shadow-[0_0_24px_rgba(74,52,130,0.25)]"
            >
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-[#f3d486] sm:text-xl">
                  <Stars className="h-5 w-5" />
                  Örnek Rüya {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base leading-relaxed text-zinc-300 sm:text-lg">
                {dream}
              </CardContent>
            </Card>
          ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#2f2a50] bg-[#0f0c1f]/85 p-4 sm:rounded-3xl sm:p-6 md:p-10">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-white sm:mb-6 sm:text-3xl">
            <Sparkles className="h-6 w-6 text-[#efc66a]" />
            Nasıl Çalışır?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "1. Rüyanı Paylaş",
                text: "Rüyanı serbest metin olarak yaz ve detayları ekle.",
              },
              {
                title: "2. Yapay Zeka Kategorize Etsin",
                text: "Yapay zeka rüyanı tema, duygu ve sembollere göre sınıflandırır.",
              },
              {
                title: "3. Yorumu Keşfet",
                text: "Gemini tabanlı yorum motoru sana anlamlı bir özet ve yorum sunar.",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="border-[#3e3265] bg-[#15112b]/90 text-zinc-200"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-[#f3d486] sm:text-2xl">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-base leading-relaxed text-zinc-300 sm:text-lg">
                  {item.text}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="relative mt-2 border-t border-[#5f4aa0]/40 bg-[#0f0c1f]/45 backdrop-blur-md">
        <div className="mx-auto grid w-full max-w-6xl gap-3 px-4 py-5 text-sm text-zinc-300 sm:px-6 md:grid-cols-2 md:items-center md:px-10">
          <p className="text-center md:text-left">
            © 2026 Ali Kaan Koç | DreamAI
          </p>
          <div className="flex items-center justify-center gap-2 md:justify-end">
            <a
              href="https://github.com/alikaankoc1"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profili"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#3b2f63] bg-[#15112b]/70 text-zinc-200 transition hover:border-[#7f63d4] hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.426 2.865 8.181 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.071 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.091-.648.349-1.088.635-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.018 10.018 0 0022 12.017C22 6.484 17.523 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/alikaankoc/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profili"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#3b2f63] bg-[#15112b]/70 text-zinc-200 transition hover:border-[#7f63d4] hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.854 0-2.137 1.445-2.137 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.369-1.85 3.599 0 4.264 2.368 4.264 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065a2.064 2.064 0 114.127 0 2.065 2.065 0 01-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
