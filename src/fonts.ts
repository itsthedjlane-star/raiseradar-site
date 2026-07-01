// Local brand fonts. We ship the woff2 files in /public/fonts and inject an
// @font-face block at runtime, then hold the render with delayRender() until the
// browser reports the faces are ready. This keeps renders deterministic and
// offline — no dependency on Google Fonts at render time.
import { staticFile, delayRender, continueRender } from "remotion";

type Face = { family: string; weight: string; file: string };

const FACES: Face[] = [
  { family: "Inter", weight: "400", file: "Inter-400.woff2" },
  { family: "Inter", weight: "500", file: "Inter-500.woff2" },
  { family: "Inter", weight: "600", file: "Inter-600.woff2" },
  { family: "Space Grotesk", weight: "500", file: "SpaceGrotesk-500.woff2" },
  { family: "Space Grotesk", weight: "600", file: "SpaceGrotesk-600.woff2" },
  { family: "Space Grotesk", weight: "700", file: "SpaceGrotesk-700.woff2" },
];

let started = false;

export function ensureFonts(): void {
  if (started || typeof document === "undefined") return;
  started = true;

  const style = document.createElement("style");
  style.setAttribute("data-raiseradar-fonts", "true");
  style.innerHTML = FACES.map(
    (f) =>
      `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};font-display:block;src:url('${staticFile(
        "fonts/" + f.file
      )}') format('woff2');}`
  ).join("\n");
  document.head.appendChild(style);

  const handle = delayRender("Loading RaiseRadar brand fonts");
  Promise.all(
    FACES.map((f) => document.fonts.load(`${f.weight} 40px '${f.family}'`))
  )
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}
