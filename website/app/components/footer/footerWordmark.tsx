"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const WORDMARK = "OptiFlowz";

type GlyphSlot = {
  character: string;
  x: number;
  width: number;
  drawX: number;
  textureWidth: number;
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
    let pixelRatio = 1;
    let animationFrame = 0;
    let visible = true;
    let previousTimestamp = 0;
    let glyphSlots: GlyphSlot[] = [];
    const glyphProgress = Array.from({ length: WORDMARK.length }, () => 0);

    const font = () => `700 ${fontSize}px "Gabarito", sans-serif`;

    const buildScene = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));

      // Keep the slice-based liquid mask supersampled even on 1x/1.25x Windows
      // displays. Rendering it at the native low density exposes slice seams.
      pixelRatio = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      maskCanvas.width = Math.round(width * pixelRatio);
      maskCanvas.height = Math.round(height * pixelRatio);
      maskContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      maskContext.imageSmoothingEnabled = true;
      maskContext.imageSmoothingQuality = "high";

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
        const textureWidth = glyphWidth + padding * 2;
        const texture = document.createElement("canvas");
        texture.width = Math.ceil(textureWidth * pixelRatio);
        texture.height = Math.ceil(height * pixelRatio);
        const textureContext = texture.getContext("2d");
        if (textureContext) {
          textureContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          textureContext.imageSmoothingEnabled = true;
          textureContext.imageSmoothingQuality = "high";
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
          textureWidth,
          texture,
        };
      });

      if (!pointer.x) {
        pointer.x = pointer.targetX = width / 2;
        pointer.y = pointer.targetY = height / 2;
      }
    };

    const drawWarpedGlyph = (
      glyph: GlyphSlot,
      preset: MorphPreset,
      progress: number,
    ) => {
      if (progress < 0.004) {
        maskContext.drawImage(
          glyph.texture,
          0,
          0,
          glyph.texture.width,
          glyph.texture.height,
          glyph.drawX,
          0,
          glyph.textureWidth,
          height,
        );
        return;
      }

      const sourceWidth = glyph.texture.width;
      const sourceTop = Math.max(0, Math.floor((textY - fontSize * 0.92) * pixelRatio));
      const sourceBottom = Math.min(
        glyph.texture.height,
        Math.ceil((textY + fontSize * 0.12) * pixelRatio),
      );
      const visibleHeight = Math.max(1, sourceBottom - sourceTop);
      const sliceHeight = progress > 0.28 ? 1 : Math.max(1, Math.round(pixelRatio));

      for (let sourceY = sourceTop; sourceY < sourceBottom; sourceY += sliceHeight) {
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
        const destinationWidth = glyph.textureWidth * scaleX;
        const destinationX = glyph.drawX
          + (glyph.textureWidth - destinationWidth) / 2
          + displacementX;

        maskContext.drawImage(
          glyph.texture,
          0,
          sourceY,
          sourceWidth,
          sliceHeight,
          destinationX,
          sourceY / pixelRatio + displacementY,
          destinationWidth,
          (sliceHeight + 0.2) / pixelRatio,
        );
      }
    };

    const drawMorphingMask = (timestamp: number) => {
      const delta = previousTimestamp ? Math.min(34, timestamp - previousTimestamp) : 16;
      previousTimestamp = timestamp;
      const easing = reduceMotion ? 1 : 1 - Math.exp(-delta / 72);
      const liquidTime = reduceMotion ? 0 : timestamp * 0.0022;

      maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      maskContext.fillStyle = "#fff";

      glyphSlots.forEach((glyph, index) => {
        const glyphCenter = glyph.x + glyph.width / 2;
        const hoverRadius = Math.max(fontSize * 0.46, glyph.width * 1.4);
        const distance = Math.abs(pointer.x - glyphCenter) / hoverRadius;
        const ambientStrength = reduceMotion ? 0 : 0.13;
        const hoverBoost = pointer.active && !reduceMotion
          ? Math.exp(-distance * distance * 2.25) * pointer.strength * 0.76
          : 0;
        const target = Math.min(0.92, ambientStrength + hoverBoost);
        glyphProgress[index] += (target - glyphProgress[index]) * easing;
        const progress = glyphProgress[index];
        const phase = liquidTime + index * 0.68;
        const preset: MorphPreset = {
          waveX: 0.032 + Math.sin(phase * 0.72) * 0.012,
          waveY: 0.006 + Math.cos(phase * 0.83) * 0.003,
          frequencyX: 1.6 + Math.sin(phase * 0.47) * 0.3,
          frequencyY: 2.15 + Math.cos(phase * 0.54) * 0.45,
          twist: Math.sin(phase * 0.61) * 0.025,
          pinch: Math.cos(phase * 0.52) * 0.07,
          bulge: 0.1 + Math.sin(phase * 0.44) * 0.055,
          phase,
        };

        drawWarpedGlyph(glyph, preset, progress);
      });
    };

    const draw = (timestamp: number) => {
      animationFrame = window.requestAnimationFrame(draw);
      if (!visible) return;

      pointer.x += (pointer.targetX - pointer.x) * 0.18;
      pointer.y += (pointer.targetY - pointer.y) * 0.18;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.14;

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
        hover.addColorStop(0, `rgba(255, 255, 255, ${0.76 * pointer.strength})`);
        hover.addColorStop(0.24, withAlpha(brandColors.light, 0.5 * pointer.strength));
        hover.addColorStop(0.55, withAlpha(brandColors.primary, 0.24 * pointer.strength));
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
