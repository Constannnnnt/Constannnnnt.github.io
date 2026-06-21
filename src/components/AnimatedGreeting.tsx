import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const GREETINGS = [
  { text: "你好", language: "Chinese" },
  { text: "Hello", language: "English" },
  { text: "Bonjour", language: "French" },
  { text: "Hola", language: "Spanish" },
  { text: "Ciao", language: "Italian" },
  { text: "Olá", language: "Portuguese" },
  { text: "こんにちは", language: "Japanese" },
  { text: "안녕하세요", language: "Korean" },
  { text: "Hallo", language: "German" },
];

const NOISE_GLYPHS = [
  "你",
  "好",
  "H",
  "e",
  "l",
  "o",
  "B",
  "n",
  "j",
  "r",
  "こ",
  "ん",
  "に",
  "ち",
  "は",
  "안",
  "녕",
  "하",
  "세",
  "요",
  "O",
  "á",
  "C",
  "i",
  "a",
];

const HOLD_MS = 1800;
const MORPH_MS = 850;

type SegmenterLike = {
  segment(input: string): Iterable<{ segment: string }>;
};

type SegmenterConstructor = new (
  locales?: string | string[],
  options?: { granularity: "grapheme" },
) => SegmenterLike;

type AnimatedGreetingProps = {
  className?: string;
};

const splitGraphemes = (value: string) => {
  const Segmenter = (Intl as typeof Intl & { Segmenter?: SegmenterConstructor }).Segmenter;

  if (Segmenter) {
    const segmenter = new Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), (part) => part.segment);
  }

  return Array.from(value);
};

const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;

const randomGlyph = () => NOISE_GLYPHS[Math.floor(Math.random() * NOISE_GLYPHS.length)];

const morphGreeting = (fromChars: string[], toChars: string[], progress: number) => {
  const length = Math.max(fromChars.length, toChars.length);

  return Array.from({ length }, (_, index) => {
    const localProgress = Math.min(Math.max((progress - index * 0.045) / 0.72, 0), 1);

    if (localProgress < 0.18) {
      return fromChars[index] ?? "";
    }

    if (localProgress < 0.82) {
      return randomGlyph();
    }

    return toChars[index] ?? "";
  }).join("");
};

export function AnimatedGreeting({ className }: AnimatedGreetingProps) {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [displayText, setDisplayText] = useState(GREETINGS[0].text);
  const [isMorphing, setIsMorphing] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    let animationFrame: number | undefined;
    const timeout = window.setTimeout(() => {
      const nextIndex = (greetingIndex + 1) % GREETINGS.length;
      const from = GREETINGS[greetingIndex].text;
      const to = GREETINGS[nextIndex].text;

      if (reduceMotion) {
        setDisplayText(to);
        setGreetingIndex(nextIndex);
        return;
      }

      const fromChars = splitGraphemes(from);
      const toChars = splitGraphemes(to);
      const startedAt = performance.now();

      setIsMorphing(true);

      const tick = (now: number) => {
        const rawProgress = Math.min((now - startedAt) / MORPH_MS, 1);
        const progress = easeInOutCubic(rawProgress);

        setDisplayText(morphGreeting(fromChars, toChars, progress));

        if (rawProgress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
          return;
        }

        setDisplayText(to);
        setGreetingIndex(nextIndex);
        setIsMorphing(false);
      };

      animationFrame = window.requestAnimationFrame(tick);
    }, HOLD_MS);

    return () => {
      window.clearTimeout(timeout);

      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [greetingIndex, reduceMotion]);

  const activeGreeting = GREETINGS[greetingIndex];

  return (
    <h1
      aria-label={`${activeGreeting.language} greeting: ${activeGreeting.text}`}
      className={cn("text-3xl sm:text-4xl font-semibold tracking-normal text-foreground leading-tight", className)}
    >
      <span
        aria-hidden="true"
        dir="auto"
        title={`${activeGreeting.language}: ${activeGreeting.text}`}
        className={cn(
          "inline-block min-w-[11ch] will-change-[filter,transform] transition-[filter,transform,color,letter-spacing] duration-300",
          isMorphing ? "scale-[0.98] blur-[0.5px] text-primary tracking-[0.08em]" : "scale-100 blur-0 text-foreground tracking-normal",
        )}
      >
        {displayText}
      </span>
    </h1>
  );
}
