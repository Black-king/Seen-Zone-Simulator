export type PosterResult = {
  personName: string;
  relation: string;
  elapsedLabel: string;
  anxiety: number;
  sendCount: number;
  brainReplay: number;
  dignity: number;
  conclusion: string;
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const chars = Array.from(text);
  const lines: string[] = [];
  let line = "";

  chars.forEach((char) => {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  });

  if (line) lines.push(line);
  return lines;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = Number.parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function anxietyGrade(value: number) {
  if (value >= 96) return "尊严离线";
  if (value >= 86) return "标点分析师";
  if (value >= 72) return "反复打开";
  if (value >= 52) return "轻微破防";
  return "体面尚存";
}

export async function downloadReportPoster(result: PosterResult, accent = "#fb7185") {
  const canvas = document.createElement("canvas");
  const width = 1080;
  const height = 1440;
  const scale = window.devicePixelRatio > 1 ? 2 : 1;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(scale, scale);

  const rgb = hexToRgb(accent);
  const accentRgb = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#05070d");
  bg.addColorStop(0.46, "#0b1020");
  bg.addColorStop(1, "#15111d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Ambient glows
  const glowOne = ctx.createRadialGradient(900, 160, 10, 900, 160, 460);
  glowOne.addColorStop(0, `rgba(${accentRgb}, .45)`);
  glowOne.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glowOne;
  ctx.fillRect(0, 0, width, height);

  const glowTwo = ctx.createRadialGradient(120, 1180, 10, 120, 1180, 430);
  glowTwo.addColorStop(0, "rgba(56,189,248,.28)");
  glowTwo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glowTwo;
  ctx.fillRect(0, 0, width, height);

  // Tiny noise dots, deterministic enough for texture
  ctx.fillStyle = "rgba(255,255,255,.055)";
  for (let i = 0; i < 1300; i += 1) {
    const x = (i * 47) % width;
    const y = (i * 83) % height;
    ctx.fillRect(x, y, 1, 1);
  }

  // Main card
  roundRect(ctx, 70, 82, 940, 1276, 52);
  ctx.fillStyle = "rgba(8, 13, 26, .82)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.14)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Header pill
  roundRect(ctx, 116, 132, 398, 58, 29);
  ctx.fillStyle = `rgba(${accentRgb}, .16)`;
  ctx.fill();
  ctx.strokeStyle = `rgba(${accentRgb}, .5)`;
  ctx.stroke();

  ctx.fillStyle = "rgba(236,240,255,.78)";
  ctx.font = "700 24px Inter, system-ui, sans-serif";
  ctx.fillText("READ RECEIPT REPORT", 146, 170);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 88px Inter, system-ui, sans-serif";
  ctx.fillText("已读不回", 116, 306);
  ctx.fillStyle = accent;
  ctx.fillText("诊断报告", 116, 408);

  ctx.fillStyle = "rgba(236,240,255,.72)";
  ctx.font = "400 31px Inter, system-ui, sans-serif";
  ctx.fillText("一份没有医学依据，但非常真实的社交焦虑化验单。", 116, 474);

  // Chat snippet
  roundRect(ctx, 116, 548, 848, 236, 36);
  ctx.fillStyle = "rgba(255,255,255,.055)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.12)";
  ctx.stroke();

  roundRect(ctx, 164, 604, 298, 70, 28);
  ctx.fillStyle = `rgba(${accentRgb}, .42)`;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "500 30px Inter, system-ui, sans-serif";
  ctx.fillText("你：在吗？", 196, 650);

  ctx.fillStyle = "rgba(236,240,255,.62)";
  ctx.font = "400 26px Inter, system-ui, sans-serif";
  ctx.fillText(`${result.personName} 已读`, 164, 730);
  ctx.fillText("然后世界安静了。", 164, 762);

  // Score block
  roundRect(ctx, 116, 836, 848, 176, 36);
  ctx.fillStyle = "rgba(255,255,255,.05)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.12)";
  ctx.stroke();

  ctx.fillStyle = "rgba(236,240,255,.72)";
  ctx.font = "700 28px Inter, system-ui, sans-serif";
  ctx.fillText("焦虑指数", 164, 896);
  ctx.fillStyle = "#fff";
  ctx.font = "900 82px Inter, system-ui, sans-serif";
  ctx.fillText(`${result.anxiety}%`, 164, 980);

  const barX = 430;
  const barY = 914;
  const barW = 468;
  const barH = 34;
  roundRect(ctx, barX, barY, barW, barH, 17);
  ctx.fillStyle = "rgba(255,255,255,.09)";
  ctx.fill();
  roundRect(ctx, barX, barY, Math.max(36, (barW * result.anxiety) / 100), barH, 17);
  const barGradient = ctx.createLinearGradient(barX, barY, barX + barW, barY);
  barGradient.addColorStop(0, accent);
  barGradient.addColorStop(1, "#fff");
  ctx.fillStyle = barGradient;
  ctx.fill();

  ctx.fillStyle = "rgba(236,240,255,.78)";
  ctx.font = "600 30px Inter, system-ui, sans-serif";
  ctx.fillText(`等级：${anxietyGrade(result.anxiety)}`, 430, 1000);

  // Metrics
  const metrics = [
    ["对象", `${result.personName} / ${result.relation}`],
    ["已读时长", result.elapsedLabel],
    ["脑补次数", String(result.brainReplay)],
    ["尊严剩余", `${result.dignity}%`]
  ];

  metrics.forEach(([label, value], index) => {
    const x = 116 + (index % 2) * 424;
    const y = 1062 + Math.floor(index / 2) * 132;
    roundRect(ctx, x, y, 392, 102, 28);
    ctx.fillStyle = "rgba(255,255,255,.045)";
    ctx.fill();
    ctx.fillStyle = "rgba(236,240,255,.54)";
    ctx.font = "500 24px Inter, system-ui, sans-serif";
    ctx.fillText(label, x + 32, y + 38);
    ctx.fillStyle = "#fff";
    ctx.font = "800 32px Inter, system-ui, sans-serif";
    const clipped = value.length > 14 ? `${value.slice(0, 13)}…` : value;
    ctx.fillText(clipped, x + 32, y + 78);
  });

  // Conclusion
  ctx.font = "600 30px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(236,240,255,.88)";
  const conclusionLines = wrapText(ctx, result.conclusion, 830).slice(0, 2);
  conclusionLines.forEach((line, index) => ctx.fillText(line, 116, 1304 + index * 42));

  ctx.fillStyle = `rgba(${accentRgb}, .9)`;
  ctx.font = "700 25px Inter, system-ui, sans-serif";
  ctx.fillText("Seen Zone Simulator / 已读不回模拟器", 116, 1372);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `seen-zone-report-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
