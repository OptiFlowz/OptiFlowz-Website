"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const WORDMARK = "OPTIFLOWZ";

type GlyphSlot = {
  character: string;
  x: number;
  width: number;
  drawX: number;
  textureWidth: number;
  texture: HTMLCanvasElement;
  glTexture: WebGLTexture | null;
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

type WebGLMaskState = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  positionBuffer: WebGLBuffer;
  positionLocation: number;
  resolutionLocation: WebGLUniformLocation | null;
  glyphLocation: WebGLUniformLocation | null;
  heightLocation: WebGLUniformLocation | null;
  fontSizeLocation: WebGLUniformLocation | null;
  progressLocation: WebGLUniformLocation | null;
  presetALocation: WebGLUniformLocation | null;
  presetBLocation: WebGLUniformLocation | null;
  textureLocation: WebGLUniformLocation | null;
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

    const warpCanvas = document.createElement("canvas");
    const gl = warpCanvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    const createWebGLMaskState = (): WebGLMaskState | null => {
      if (!gl) return null;

      const vertexSource = `
        attribute vec2 aPosition;
        varying vec2 vUv;

        void main() {
          vUv = aPosition * 0.5 + 0.5;
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `;
      const fragmentSource = `
        precision highp float;

        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform vec4 uGlyph;
        uniform float uHeight;
        uniform float uFontSize;
        uniform float uProgress;
        uniform vec4 uPresetA;
        uniform vec4 uPresetB;

        const float PI = 3.141592653589793;

        void main() {
          float destinationX = vUv.x * uResolution.x;
          float destinationY = (1.0 - vUv.y) * uResolution.y;
          float drawX = uGlyph.x;
          float textureWidth = uGlyph.y;
          float sourceTop = uGlyph.z;
          float visibleHeight = uGlyph.w;

          float normalizedY = ((destinationY - sourceTop) / visibleHeight - 0.5) * 2.0;
          float displacementY = uFontSize * uProgress * uPresetA.y
            * sin(normalizedY * PI * uPresetA.z + uPresetB.w * 0.73);
          float sourceY = destinationY - displacementY;
          normalizedY = ((sourceY - sourceTop) / visibleHeight - 0.5) * 2.0;

          float centerInfluence = max(0.0, 1.0 - normalizedY * normalizedY);
          float displacementX = uFontSize * uProgress * (
            uPresetA.x * sin(normalizedY * PI * uPresetA.w + uPresetB.w)
            + uPresetB.x * normalizedY
          );
          float scaleX = max(
            0.56,
            1.0 + uProgress * (
              uPresetB.y * (1.0 - abs(normalizedY))
              + uPresetB.z * centerInfluence
            )
          );
          float destinationWidth = textureWidth * scaleX;
          float destinationStart = drawX + (textureWidth - destinationWidth) * 0.5
            + displacementX;
          float sourceX = (destinationX - destinationStart) / scaleX;

          if (
            sourceX < 0.0 || sourceX > textureWidth
            || sourceY < 0.0 || sourceY > uHeight
          ) {
            discard;
          }

          float alpha = texture2D(
            uTexture,
            vec2(sourceX / textureWidth, sourceY / uHeight)
          ).a;
          if (alpha < 0.001) discard;
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `;

      const compileShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertexShader || !fragmentShader) return null;

      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
      }

      const positionBuffer = gl.createBuffer();
      if (!positionBuffer) {
        gl.deleteProgram(program);
        return null;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      return {
        gl,
        program,
        positionBuffer,
        positionLocation: gl.getAttribLocation(program, "aPosition"),
        resolutionLocation: gl.getUniformLocation(program, "uResolution"),
        glyphLocation: gl.getUniformLocation(program, "uGlyph"),
        heightLocation: gl.getUniformLocation(program, "uHeight"),
        fontSizeLocation: gl.getUniformLocation(program, "uFontSize"),
        progressLocation: gl.getUniformLocation(program, "uProgress"),
        presetALocation: gl.getUniformLocation(program, "uPresetA"),
        presetBLocation: gl.getUniformLocation(program, "uPresetB"),
        textureLocation: gl.getUniformLocation(program, "uTexture"),
      };
    };

    const webglMask = createWebGLMaskState();

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
    let edgeGuard = 0;
    let fontSize = 0;
    let textX = 0;
    let textY = 0;
    let colorSplitX = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let visible = true;
    let previousTimestamp = 0;
    let glyphSlots: GlyphSlot[] = [];
    const glyphProgress = Array.from({ length: WORDMARK.length }, () => 0);

    const font = () => `700 ${fontSize}px "Gabarito", sans-serif`;

    const buildScene = () => {
      if (webglMask) {
        glyphSlots.forEach(({ glTexture }) => {
          if (glTexture) webglMask.gl.deleteTexture(glTexture);
        });
      }

      width = Math.max(1, Math.round(canvas.clientWidth));
      height = Math.max(1, Math.round(canvas.clientHeight));
      const wordmarkStyles = canvas.parentElement
        ? getComputedStyle(canvas.parentElement)
        : null;
      edgeGuard = wordmarkStyles
        ? Math.max(0, -(Number.parseFloat(wordmarkStyles.marginLeft) || 0))
        : 0;
      const availableWidth = Math.max(1, width - edgeGuard * 2);

      // Keep the wordmark supersampled on low-density displays so both the
      // WebGL displacement and its 2D fallback retain crisp glyph edges.
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
      warpCanvas.width = Math.round(width * pixelRatio);
      warpCanvas.height = Math.round(height * pixelRatio);
      if (webglMask) {
        webglMask.gl.viewport(0, 0, warpCanvas.width, warpCanvas.height);
      }

      fontSize = height * 0.98;
      context.font = font();
      let wordMetrics = context.measureText(WORDMARK);
      let inkWidth = wordMetrics.actualBoundingBoxLeft
        + wordMetrics.actualBoundingBoxRight;
      if (!inkWidth) inkWidth = wordMetrics.width;
      fontSize *= availableWidth / inkWidth;

      context.font = font();
      wordMetrics = context.measureText(WORDMARK);
      inkWidth = wordMetrics.actualBoundingBoxLeft
        + wordMetrics.actualBoundingBoxRight;
      if (!inkWidth) inkWidth = wordMetrics.width;
      fontSize *= availableWidth / inkWidth;

      context.font = font();
      wordMetrics = context.measureText(WORDMARK);
      inkWidth = wordMetrics.actualBoundingBoxLeft
        + wordMetrics.actualBoundingBoxRight;
      if (!inkWidth) inkWidth = wordMetrics.width;
      textX = edgeGuard + wordMetrics.actualBoundingBoxLeft
        + (availableWidth - inkWidth) / 2;
      textY = height * 0.92;
      colorSplitX = textX + context.measureText("OPTI").width;
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
        let glTexture: WebGLTexture | null = null;
        if (webglMask) {
          const maskGl = webglMask.gl;
          glTexture = maskGl.createTexture();
          if (glTexture) {
            maskGl.bindTexture(maskGl.TEXTURE_2D, glTexture);
            maskGl.texParameteri(maskGl.TEXTURE_2D, maskGl.TEXTURE_MIN_FILTER, maskGl.LINEAR);
            maskGl.texParameteri(maskGl.TEXTURE_2D, maskGl.TEXTURE_MAG_FILTER, maskGl.LINEAR);
            maskGl.texParameteri(maskGl.TEXTURE_2D, maskGl.TEXTURE_WRAP_S, maskGl.CLAMP_TO_EDGE);
            maskGl.texParameteri(maskGl.TEXTURE_2D, maskGl.TEXTURE_WRAP_T, maskGl.CLAMP_TO_EDGE);
            maskGl.pixelStorei(maskGl.UNPACK_FLIP_Y_WEBGL, 0);
            maskGl.texImage2D(
              maskGl.TEXTURE_2D,
              0,
              maskGl.RGBA,
              maskGl.RGBA,
              maskGl.UNSIGNED_BYTE,
              texture,
            );
          }
        }
        return {
          character,
          x: textX + start,
          width: glyphWidth,
          drawX: textX + start - padding,
          textureWidth,
          texture,
          glTexture,
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

      // Deform the full glyph as one continuous surface. The previous
      // scanline warp produced visible horizontal seams in Windows/Edge.
      const glyphCenterX = glyph.x + glyph.width / 2;
      const glyphCenterY = textY - fontSize * 0.4;
      const phase = preset.phase;
      const horizontalDrift = fontSize * progress
        * (Math.sin(phase * 0.86) * 0.01 + preset.waveX * 0.16);
      const verticalDrift = fontSize * progress
        * (Math.cos(phase * 0.72) * 0.005 + preset.waveY * 0.2);
      const scaleX = Math.max(
        0.84,
        1 + progress * (
          preset.bulge * 0.42
          + preset.pinch * 0.18
          + Math.sin(phase * 0.62) * 0.028
        ),
      );
      const scaleY = 1 + progress * Math.cos(phase * 0.58) * 0.025;
      const skewX = progress * (
        preset.twist * 0.72
        + Math.sin(phase * 0.74) * 0.018
      );
      const skewY = progress * Math.cos(phase * 0.67) * 0.009;
      const rotation = progress * Math.sin(phase * 0.51) * 0.014;

      maskContext.save();
      maskContext.translate(
        glyphCenterX + horizontalDrift,
        glyphCenterY + verticalDrift,
      );
      maskContext.rotate(rotation);
      maskContext.transform(scaleX, skewY, skewX, scaleY, 0, 0);
      maskContext.translate(-glyphCenterX, -glyphCenterY);
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
      maskContext.restore();
    };

    const beginWebGLMaskFrame = () => {
      if (!webglMask) return;
      const maskGl = webglMask.gl;
      maskGl.viewport(0, 0, warpCanvas.width, warpCanvas.height);
      maskGl.clearColor(0, 0, 0, 0);
      maskGl.clear(maskGl.COLOR_BUFFER_BIT);
      maskGl.useProgram(webglMask.program);
      maskGl.bindBuffer(maskGl.ARRAY_BUFFER, webglMask.positionBuffer);
      maskGl.enableVertexAttribArray(webglMask.positionLocation);
      maskGl.vertexAttribPointer(
        webglMask.positionLocation,
        2,
        maskGl.FLOAT,
        false,
        0,
        0,
      );
      maskGl.uniform2f(webglMask.resolutionLocation, width, height);
      maskGl.uniform1f(webglMask.heightLocation, height);
      maskGl.uniform1f(webglMask.fontSizeLocation, fontSize);
      maskGl.uniform1i(webglMask.textureLocation, 0);
      maskGl.activeTexture(maskGl.TEXTURE0);
      maskGl.disable(maskGl.DEPTH_TEST);
      maskGl.enable(maskGl.BLEND);
      maskGl.blendFuncSeparate(
        maskGl.SRC_ALPHA,
        maskGl.ONE_MINUS_SRC_ALPHA,
        maskGl.ONE,
        maskGl.ONE_MINUS_SRC_ALPHA,
      );
      maskGl.enable(maskGl.SCISSOR_TEST);
    };

    const drawWarpedGlyphWebGL = (
      glyph: GlyphSlot,
      preset: MorphPreset,
      progress: number,
    ) => {
      if (!webglMask || !glyph.glTexture) return;
      const maskGl = webglMask.gl;
      const sourceTop = Math.max(0, textY - fontSize * 0.92);
      const sourceBottom = Math.min(height, textY + fontSize * 0.12);
      const visibleHeight = Math.max(1, sourceBottom - sourceTop);
      const scissorPadding = fontSize * 0.22;
      const scissorX = Math.max(
        0,
        Math.floor((glyph.drawX - scissorPadding) * pixelRatio),
      );
      const scissorRight = Math.min(
        warpCanvas.width,
        Math.ceil(
          (glyph.drawX + glyph.textureWidth + scissorPadding) * pixelRatio,
        ),
      );

      maskGl.scissor(scissorX, 0, Math.max(1, scissorRight - scissorX), warpCanvas.height);
      maskGl.uniform4f(
        webglMask.glyphLocation,
        glyph.drawX,
        glyph.textureWidth,
        sourceTop,
        visibleHeight,
      );
      maskGl.uniform1f(webglMask.progressLocation, progress);
      maskGl.uniform4f(
        webglMask.presetALocation,
        preset.waveX,
        preset.waveY,
        preset.frequencyX,
        preset.frequencyY,
      );
      maskGl.uniform4f(
        webglMask.presetBLocation,
        preset.twist,
        preset.pinch,
        preset.bulge,
        preset.phase,
      );
      maskGl.bindTexture(maskGl.TEXTURE_2D, glyph.glTexture);
      maskGl.drawArrays(maskGl.TRIANGLE_STRIP, 0, 4);
    };

    const drawMorphingMask = (timestamp: number) => {
      const delta = previousTimestamp ? Math.min(34, timestamp - previousTimestamp) : 16;
      previousTimestamp = timestamp;
      const easing = reduceMotion ? 1 : 1 - Math.exp(-delta / 72);
      const liquidTime = reduceMotion ? 0 : timestamp * 0.0022;

      if (webglMask) {
        beginWebGLMaskFrame();
      } else {
        maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskContext.fillStyle = "#fff";
      }

      glyphSlots.forEach((glyph, index) => {
        const glyphCenter = glyph.x + glyph.width / 2;
        const hoverRadius = Math.max(fontSize * 0.46, glyph.width * 1.4);
        const distance = Math.abs(pointer.x - glyphCenter) / hoverRadius;
        const ambientStrength = reduceMotion ? 0 : 0.42;
        const hoverBoost = pointer.active && !reduceMotion
          ? Math.exp(-distance * distance * 2.25) * pointer.strength * 1.2
          : 0;
        const target = Math.min(1.3, ambientStrength + hoverBoost);
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

        if (webglMask) drawWarpedGlyphWebGL(glyph, preset, progress);
        else drawWarpedGlyph(glyph, preset, progress);
      });

      if (webglMask) webglMask.gl.disable(webglMask.gl.SCISSOR_TEST);
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

      const splitStop = Math.max(0, Math.min(1, colorSplitX / width));
      const flowMidpoint = splitStop + (1 - splitStop) * 0.56;
      const base = context.createLinearGradient(0, 0, width, 0);
      base.addColorStop(0, "#f7fbff");
      base.addColorStop(splitStop, "#f7fbff");
      base.addColorStop(splitStop, brandColors.light);
      base.addColorStop(flowMidpoint, brandColors.primary);
      base.addColorStop(1, brandColors.dark);
      context.globalAlpha = 0.96;
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
        const boundaryWidth = Math.max(24, fontSize * 0.12);
        const boundaryProgress = Math.max(
          0,
          Math.min(1, (pointer.x - colorSplitX + boundaryWidth) / (boundaryWidth * 2)),
        );
        const flowHoverMix = boundaryProgress * boundaryProgress
          * (3 - 2 * boundaryProgress);
        const optiHoverMix = 1 - flowHoverMix;

        if (optiHoverMix > 0.01) {
          const blueHover = context.createRadialGradient(
            pointer.x,
            pointer.y,
            0,
            pointer.x,
            pointer.y,
            hoverRadius,
          );
          const blueStrength = pointer.strength * optiHoverMix;
          blueHover.addColorStop(0, withAlpha(brandColors.primary, 0.56 * blueStrength));
          blueHover.addColorStop(0.25, withAlpha(brandColors.light, 0.36 * blueStrength));
          blueHover.addColorStop(0.58, withAlpha(brandColors.dark, 0.1 * blueStrength));
          blueHover.addColorStop(1, withAlpha(brandColors.dark, 0));
          context.globalCompositeOperation = "source-over";
          context.fillStyle = blueHover;
          context.fillRect(0, 0, width, height);
        }

        if (flowHoverMix > 0.01) {
          const lightHover = context.createRadialGradient(
            pointer.x,
            pointer.y,
            0,
            pointer.x,
            pointer.y,
            hoverRadius,
          );
          const lightStrength = pointer.strength * flowHoverMix;
          lightHover.addColorStop(0, `rgba(255, 255, 255, ${0.76 * lightStrength})`);
          lightHover.addColorStop(0.24, withAlpha(brandColors.light, 0.5 * lightStrength));
          lightHover.addColorStop(0.55, withAlpha(brandColors.primary, 0.24 * lightStrength));
          lightHover.addColorStop(1, withAlpha(brandColors.dark, 0));
          context.globalCompositeOperation = "screen";
          context.fillStyle = lightHover;
          context.fillRect(0, 0, width, height);
        }
      }

      drawMorphingMask(timestamp);
      context.globalCompositeOperation = "destination-in";
      context.drawImage(webglMask ? warpCanvas : maskCanvas, 0, 0, width, height);
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
      if (webglMask) {
        glyphSlots.forEach(({ glTexture }) => {
          if (glTexture) webglMask.gl.deleteTexture(glTexture);
        });
        webglMask.gl.deleteBuffer(webglMask.positionBuffer);
        webglMask.gl.deleteProgram(webglMask.program);
      }
    };
  }, []);

  return (
    <Link className="footer-wordmark" href="/" aria-label="OptiFlowz home">
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="sr-only">OPTIFLOWZ</span>
    </Link>
  );
}
