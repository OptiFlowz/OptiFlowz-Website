"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const WORDMARK = "OptiFlowz";

type GlyphSlot = {
  character: string;
  x: number;
  width: number;
  drawX: number;
  texture: HTMLCanvasElement;
};

type MorphPreset = {
  waveX: number;
  waveY: number;
  frequencyX: number;
  frequencyY: number;
  twist: number;
  pinch: number;
  bulge: number;
  phase: number;
};

export default function FooterWordmark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d");
    if (!maskContext) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rootStyles = getComputedStyle(document.documentElement);
    const brandColors = {
      dark: rootStyles.getPropertyValue("--blueAccent1").trim(),
      primary: rootStyles.getPropertyValue("--blueAccent2").trim(),
      light: rootStyles.getPropertyValue("--blueAccent3").trim(),
    };
    const withAlpha = (color: string, alpha: number) => {
      const hex = color.replace("#", "");
      if (/^[0-9a-f]{6}$/i.test(hex)) {
        const value = Number.parseInt(hex, 16);
        return `rgba(${value >> 16}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
      }
      return `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`;
    };

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, active: false };
    let width = 0;
    let height = 0;
    let fontSize = 0;
    let textX = 0;
    let textY = 0;
    let animationFrame = 0;
    let visible = true;
    let hoveredGlyph = -1;
    let previousTimestamp = 0;
    let glyphSlots: GlyphSlot[] = [];
    const glyphProgress = Array.from({ length: WORDMARK.length }, () => 0);
    const glyphStartedAt = Array.from({ length: WORDMARK.length }, () => 0);

    const font = () => `400 ${fontSize}px "Iowan Old Style", Baskerville, "Times New Roman", serif`;
    const morphPresets: MorphPreset[] = [
      { waveX: 0.055, waveY: 0.008, frequencyX: 1.4, frequencyY: 2.2, twist: 0, pinch: 0, bulge: 0, phase: 0.2 },
      { waveX: 0.018, waveY: 0.018, frequencyX: 2.2, frequencyY: 1.2, twist: 0.085, pinch: 0, bulge: 0, phase: 1.7 },
      { waveX: 0.012, waveY: 0.006, frequencyX: 1.8, frequencyY: 3.4, twist: -0.018, pinch: -0.24, bulge: 0, phase: 3.2 },
      { waveX: 0.008, waveY: 0.008, frequencyX: 1.2, frequencyY: 1.4, twist: 0.012, pinch: 0, bulge: 0.28, phase: 4.6 },
      { waveX: 0.07, waveY: 0.014, frequencyX: 3.8, frequencyY: 5.2, twist: 0.025, pinch: 0.08, bulge: -0.03, phase: 5.8 },
    ];

    const buildScene = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      maskCanvas.width = width;
      maskCanvas.height = height;

      fontSize = Math.min(height * 0.98, width * 0.24);
      context.font = font();
      const availableWidth = width * 0.96;
      const initialWidth = context.measureText(WORDMARK).width;
      if (initialWidth > availableWidth) fontSize *= availableWidth / initialWidth;

      context.font = font();
      const textWidth = context.measureText(WORDMARK).width;
      textX = (width - textWidth) / 2;
      textY = height * 0.92;
      glyphSlots = Array.from(WORDMARK).map((character, index) => {
        const start = context.measureText(WORDMARK.slice(0, index)).width;
        const end = context.measureText(WORDMARK.slice(0, index + 1)).width;
        const glyphWidth = end - start;
        const padding = Math.max(12, fontSize * 0.09);
        const texture = document.createElement("canvas");
        texture.width = Math.ceil(glyphWidth + padding * 2);
        texture.height = height;
        const textureContext = texture.getContext("2d");
        if (textureContext) {
          textureContext.font = font();
          textureContext.fillStyle = "#fff";
          textureContext.textAlign = "left";
          textureContext.textBaseline = "alphabetic";
          const measuredWidth = textureContext.measureText(character).width;
          textureContext.fillText(character, padding + (glyphWidth - measuredWidth) / 2, textY);
        }
        return {
          character,
          x: textX + start,
          width: glyphWidth,
          drawX: textX + start - padding,
          texture,
        };
      });

      if (!pointer.x) {
        pointer.x = pointer.targetX = width / 2;
        pointer.y = pointer.targetY = height / 2;
      }
    };

    const interpolatePreset = (from: MorphPreset, to: MorphPreset, amount: number) => {
      const result = {} as MorphPreset;
      (Object.keys(from) as Array<keyof MorphPreset>).forEach((key) => {
        result[key] = from[key] + (to[key] - from[key]) * amount;
      });
      return result;
    };

    const drawWarpedGlyph = (
      glyph: GlyphSlot,
      preset: MorphPreset,
      progress: number,
    ) => {
      if (progress < 0.004) {
        maskContext.drawImage(glyph.texture, glyph.drawX, 0);
        return;
      }

      const sourceWidth = glyph.texture.width;
      const sourceTop = Math.max(0, Math.floor(textY - fontSize * 0.92));
      const sourceBottom = Math.min(height, Math.ceil(textY + fontSize * 0.12));
      const visibleHeight = Math.max(1, sourceBottom - sourceTop);

      for (let sourceY = sourceTop; sourceY < sourceBottom; sourceY += 1) {
        const normalizedY = ((sourceY - sourceTop) / visibleHeight - 0.5) * 2;
        const centerInfluence = Math.max(0, 1 - normalizedY * normalizedY);
        const displacementX = fontSize * progress * (
          preset.waveX * Math.sin(normalizedY * Math.PI * preset.frequencyY + preset.phase)
          + preset.twist * normalizedY
        );
        const displacementY = fontSize * progress * preset.waveY
          * Math.sin(normalizedY * Math.PI * preset.frequencyX + preset.phase * 0.73);
        const scaleX = Math.max(
          0.56,
          1 + progress * (
            preset.pinch * (1 - Math.abs(normalizedY))
            + preset.bulge * centerInfluence
          ),
        );
        const destinationWidth = sourceWidth * scaleX;
        const destinationX = glyph.drawX
          + (sourceWidth - destinationWidth) / 2
          + displacementX;

        maskContext.drawImage(
          glyph.texture,
          0,
          sourceY,
          sourceWidth,
          1,
          destinationX,
          sourceY + displacementY,
          destinationWidth,
          1.65,
        );
      }
    };

    const drawMorphingMask = (timestamp: number) => {
      const targetGlyph = pointer.active
        ? glyphSlots.findIndex(({ x, width: glyphWidth }) => (
          pointer.targetX >= x && pointer.targetX < x + glyphWidth
        ))
        : -1;

      if (targetGlyph !== hoveredGlyph) {
        hoveredGlyph = targetGlyph;
        if (hoveredGlyph >= 0) glyphStartedAt[hoveredGlyph] = timestamp;
      }

      const delta = previousTimestamp ? Math.min(34, timestamp - previousTimestamp) : 16;
      previousTimestamp = timestamp;
      const easing = reduceMotion ? 1 : 1 - Math.exp(-delta / 150);

      maskContext.clearRect(0, 0, width, height);
      maskContext.fillStyle = "#fff";

      glyphSlots.forEach((glyph, index) => {
        const target = index === hoveredGlyph ? 1 : 0;
        glyphProgress[index] += (target - glyphProgress[index]) * easing;
        const progress = glyphProgress[index];
        const elapsed = reduceMotion ? 0 : Math.max(0, timestamp - glyphStartedAt[index]);
        const cycleDuration = 900;
        const cycle = elapsed / cycleDuration;
        const currentVariant = Math.floor(cycle) % morphPresets.length;
        const nextVariant = (currentVariant + 1) % morphPresets.length;
        const cycleProgress = cycle - Math.floor(cycle);
        const rawMix = Math.max(0, Math.min(1, (cycleProgress - 0.34) / 0.66));
        const mix = rawMix * rawMix * (3 - 2 * rawMix);
        const preset = interpolatePreset(
          morphPresets[currentVariant],
          morphPresets[nextVariant],
          mix,
        );

        drawWarpedGlyph(glyph, preset, progress);
      });
    };

    const drawFlowingRibbon = (
      time: number,
      center: number,
      amplitude: number,
      thickness: number,
      phase: number,
      color: string,
      opacity: number,
    ) => {
      context.beginPath();
      for (let x = -30; x <= width + 30; x += 22) {
        const y = height * center
          + Math.sin(x * 0.009 + time + phase) * amplitude
          + Math.sin(x * 0.0038 - time * 0.7 + phase) * amplitude * 0.45;
        if (x === -30) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      for (let x = width + 30; x >= -30; x -= 22) {
        const y = height * center
          + thickness
          + Math.sin(x * 0.009 + time + phase) * amplitude
          + Math.sin(x * 0.0038 - time * 0.7 + phase) * amplitude * 0.45;
        context.lineTo(x, y);
      }
      context.closePath();
      const ribbonGradient = context.createLinearGradient(
        0,
        height * center - amplitude,
        0,
        height * center + thickness + amplitude,
      );
      ribbonGradient.addColorStop(0, withAlpha(color, 0));
      ribbonGradient.addColorStop(0.5, withAlpha(color, opacity));
      ribbonGradient.addColorStop(1, withAlpha(color, 0));
      context.fillStyle = ribbonGradient;
      context.fill();
    };

    const draw = (timestamp: number) => {
      animationFrame = window.requestAnimationFrame(draw);
      if (!visible) return;

      pointer.x += (pointer.targetX - pointer.x) * 0.075;
      pointer.y += (pointer.targetY - pointer.y) * 0.075;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.07;

      const time = reduceMotion ? 0 : timestamp * 0.00038;
      context.clearRect(0, 0, width, height);
      context.font = font();
      context.textAlign = "left";
      context.textBaseline = "alphabetic";

      const base = context.createLinearGradient(textX, height, width - textX, 0);
      base.addColorStop(0, brandColors.dark);
      base.addColorStop(0.38, brandColors.primary);
      base.addColorStop(0.68, brandColors.light);
      base.addColorStop(1, brandColors.dark);
      context.globalAlpha = 0.82;
      context.fillStyle = base;
      context.fillRect(0, 0, width, height);
      context.globalAlpha = 1;

      context.globalCompositeOperation = "screen";

      const auroras = [
        {
          x: width * (0.2 + Math.sin(time * 0.72) * 0.11),
          y: height * (0.56 + Math.cos(time * 0.58) * 0.14),
          radius: width * 0.28,
          color: brandColors.primary,
          alpha: 0.34,
        },
        {
          x: width * (0.57 + Math.cos(time * 0.53 + 1.4) * 0.16),
          y: height * (0.42 + Math.sin(time * 0.76) * 0.2),
          radius: width * 0.24,
          color: brandColors.light,
          alpha: 0.3,
        },
        {
          x: width * (0.84 + Math.sin(time * 0.61 + 3.1) * 0.1),
          y: height * (0.64 + Math.cos(time * 0.48) * 0.16),
          radius: width * 0.25,
          color: brandColors.primary,
          alpha: 0.28,
        },
      ];

      for (const aurora of auroras) {
        const glow = context.createRadialGradient(
          aurora.x,
          aurora.y,
          0,
          aurora.x,
          aurora.y,
          aurora.radius,
        );
        glow.addColorStop(0, withAlpha(aurora.color, aurora.alpha));
        glow.addColorStop(0.46, withAlpha(aurora.color, aurora.alpha * 0.42));
        glow.addColorStop(1, withAlpha(aurora.color, 0));
        context.fillStyle = glow;
        context.fillRect(0, 0, width, height);
      }

      drawFlowingRibbon(
        time * 1.15,
        0.48,
        height * 0.055,
        height * 0.18,
        0,
        brandColors.light,
        0.16,
      );
      drawFlowingRibbon(
        -time * 0.82,
        0.68,
        height * 0.04,
        height * 0.11,
        2.4,
        brandColors.primary,
        0.15,
      );

      const sheenX = ((time * width * 0.13) % (width * 1.5)) - width * 0.25;
      const sheen = context.createLinearGradient(
        sheenX - width * 0.12,
        0,
        sheenX + width * 0.12,
        height,
      );
      sheen.addColorStop(0, withAlpha(brandColors.light, 0));
      sheen.addColorStop(0.5, withAlpha(brandColors.light, 0.32));
      sheen.addColorStop(1, withAlpha(brandColors.light, 0));
      context.fillStyle = sheen;
      context.fillRect(0, 0, width, height);

      if (pointer.strength > 0.01) {
        const hoverRadius = Math.max(130, Math.min(240, width * 0.17));
        const hover = context.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          hoverRadius,
        );
        hover.addColorStop(0, withAlpha(brandColors.light, 0.62 * pointer.strength));
        hover.addColorStop(0.36, withAlpha(brandColors.primary, 0.3 * pointer.strength));
        hover.addColorStop(1, withAlpha(brandColors.dark, 0));
        context.fillStyle = hover;
        context.fillRect(0, 0, width, height);
      }

      drawMorphingMask(timestamp);
      context.globalCompositeOperation = "destination-in";
      context.drawImage(maskCanvas, 0, 0, width, height);
      context.globalCompositeOperation = "source-over";
    };

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = event.clientX - bounds.left;
      pointer.targetY = event.clientY - bounds.top;
      pointer.active = true;
    };

    const leavePointer = () => {
      pointer.active = false;
    };

    const resizeObserver = new ResizeObserver(buildScene);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerleave", leavePointer);

    document.fonts.ready.then(buildScene);
    buildScene();
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", updatePointer);
      canvas.removeEventListener("pointerleave", leavePointer);
    };
  }, []);

  return (
    <Link className="footer-wordmark" href="/" aria-label="OptiFlowz home">
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="sr-only">OptiFlowz</span>
    </Link>
  );
}
