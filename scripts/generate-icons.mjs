import sharp from "sharp";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");
const appDir = path.join(__dirname, "../src/app");

const svgIcon = (size) => {
  const r = Math.round(size * 0.18);
  const sw = Math.round(size * 0.11); // 획 두께
  const cx = size / 2;

  // Y 좌표 - 시각적으로 정중앙
  const topY  = size * 0.18;
  const midY  = size * 0.52;
  const botY  = size * 0.82;
  const leftX = size * 0.22;
  const rightX= size * 0.78;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#1B365D"/>
  <g stroke="white" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <polyline points="${leftX},${topY} ${cx},${midY} ${rightX},${topY}"/>
    <line x1="${cx}" y1="${midY}" x2="${cx}" y2="${botY}"/>
  </g>
</svg>`;
};

async function generate() {
  const faviconPng = await sharp(Buffer.from(svgIcon(64))).resize(32).png().toBuffer();
  writeFileSync(path.join(appDir, "favicon.ico"), faviconPng);

  await sharp(Buffer.from(svgIcon(192))).png().toFile(path.join(publicDir, "icon-192x192.png"));
  await sharp(Buffer.from(svgIcon(512))).png().toFile(path.join(publicDir, "icon-512x512.png"));
  console.log("완료");
}

generate().catch(console.error);
