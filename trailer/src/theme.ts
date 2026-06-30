import { staticFile, delayRender, continueRender } from "remotion";

// Self-hosted variable fonts (latin) shipped in public/fonts — no render-time
// network needed, so the trailer renders fully offline & reproducibly.
export const fonts = {
  display: "'Space Grotesk', sans-serif", // headings / logo / numbers
  body: "'Inter', sans-serif", // supporting copy
};

if (typeof document !== "undefined") {
  const handle = delayRender("Loading RaiseRadar fonts");

  const spaceGrotesk = new FontFace(
    "Space Grotesk",
    `url(${staticFile("fonts/SpaceGrotesk.woff2")}) format('woff2')`,
    { weight: "500 700", display: "block" }
  );
  const inter = new FontFace(
    "Inter",
    `url(${staticFile("fonts/Inter.woff2")}) format('woff2')`,
    { weight: "400 600", display: "block" }
  );

  Promise.all([spaceGrotesk.load(), inter.load()])
    .then((loaded) => {
      loaded.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch(() => continueRender(handle));
}

// RaiseRadar brand palette (from the site's CSS vars)
export const colors = {
  ink: "#0B1F33",
  ink2: "#12304d",
  green: "#16E0A3",
  greenDim: "#0fae7f",
  slate: "#5B6B7B",
  mist: "#F4F7FA",
  amber: "#FFB020",
  white: "#ffffff",
  line: "#E4EAF0",
  cloud: "#c7d3df",
  steel: "#9fb0c0",
};
