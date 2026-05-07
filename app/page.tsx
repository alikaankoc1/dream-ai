import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MoonStar, Sparkles, Stars, WandSparkles } from "lucide-react";

export default function Home() {
  const sampleDreams = [
    "Sisli bir ormanda altın kapılı bir kuleye yürüyordum, kapı açılınca çocukluk evimi gördüm.",
    "Gece denizde yıldızların suya düştüğünü izledim, her yıldız bir dilek gibi parlıyordu.",
    "Bilinmeyen bir şehirde uçarak geziyordum ve herkes aynı melodiyi mırıldanıyordu.",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090714] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,70,175,0.35),_transparent_50%),radial-gradient(circle_at_75%_25%,_rgba(26,74,140,0.3),_transparent_40%)]" />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-14 md:px-10">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-[#3e3265]/70 bg-[#120f24]/85 p-6 shadow-[0_0_80px_rgba(80,52,160,0.25)] backdrop-blur md:p-10">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Badge className="border-[#efc66a]/50 bg-[#efc66a]/10 text-[#f3d486] hover:bg-[#efc66a]/20">
              DreamAI Beta
            </Badge>
            <MoonStar className="h-5 w-5 text-[#efc66a]" />
          </div>
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Rüyalarını Yapay Zeka ile Anlamlandır
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-zinc-300 md:text-base">
              Rüyanı yaz, DreamAI sembolleri analiz etsin, kategorize etsin ve
              sana derin bir yorum sunsun.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <Textarea
              className="min-h-52 resize-none border-[#3f3268] bg-[#0f0c1f]/85 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#9f79ff]"
              placeholder="Bu gece gördüğün rüyayı detaylarıyla yaz..."
            />
            <Button className="h-12 w-full bg-gradient-to-r from-[#7750ff] via-[#4f6ad6] to-[#efc66a] text-base font-semibold text-[#090714] transition hover:opacity-95">
              <WandSparkles className="mr-2 h-5 w-5" />
              Rüyamı Yorumla
            </Button>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <Stars className="h-5 w-5 text-[#efc66a]" />
            Ornek Ruyalar
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
          {sampleDreams.map((dream, index) => (
            <Card
              key={dream}
              className="border-[#2f2a50] bg-[#100d1f]/90 text-zinc-200 shadow-[0_0_24px_rgba(74,52,130,0.25)]"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-[#f3d486]">
                  <Stars className="h-4 w-4" />
                  Ornek Ruya {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-zinc-300">
                {dream}
              </CardContent>
            </Card>
          ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#2f2a50] bg-[#0f0c1f]/85 p-6 md:p-10">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
            <Sparkles className="h-5 w-5 text-[#efc66a]" />
            Nasil Calisir?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "1. Ruyani Paylas",
                text: "Ruyani serbest metin olarak yaz ve detaylari ekle.",
              },
              {
                title: "2. AI Kategorize Etsin",
                text: "DreamAI ruyani tema, duygu ve sembollere gore siniflandirir.",
              },
              {
                title: "3. Yorumu Kesfet",
                text: "Gemini tabanli yorum motoru sana anlamli bir ozet ve yorum sunar.",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="border-[#3e3265] bg-[#15112b]/90 text-zinc-200"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-[#f3d486]">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-300">
                  {item.text}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
