"use client";

import { useEffect, useRef } from "react";

import { vertexShader, fragmentShader } from "@/shaders/shaders";

// Types
interface Config {
  logoPath: string;
  logoSize: number;
  logoColor: string;
  canvasBg: string;
  distortionRadius: number;
  forceStrength: number;
  maxDisplacement: number;
  returnForce: number;
}

interface Particle {
  originalX: number;
  originalY: number;
  velocityX: number;
  velocityY: number;
}

interface Mouse {
  x: number;
  y: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

const config: Config = {
  logoPath: "/logo.png",
  logoSize: 1250,
  logoColor: "#FFFFFF",
  canvasBg: "#191919",
  distortionRadius: 3000,
  forceStrength: 0.0035,
  maxDisplacement: 100,
  returnForce: 0.025,
};

const LogoParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const positionArrayRef = useRef<Float32Array | null>(null);
  const colorArrayRef = useRef<Float32Array | null>(null);
  const positionBufferRef = useRef<WebGLBuffer | null>(null);
  const colorBufferRef = useRef<WebGLBuffer | null>(null);
  const mouseRef = useRef<Mouse>({ x: 0, y: 0 });
  const animationCountRef = useRef<number>(0);
  const animationIdRef = useRef<number | null>(null);

  const setupCanvas = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  };

  const setupWebGL = (): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: true,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
    });

    if (!gl) {
      console.error("WebGL not supported");
      return false;
    }

    glRef.current = gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return true;
  };

  const compileShader = (type: number, source: string): WebGLShader | null => {
    const gl = glRef.current;
    if (!gl) return null;

    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const shaderType = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
      console.error(
        `${shaderType} shader compilation error:`,
        gl.getShaderInfoLog(shader)
      );
      console.error(`${shaderType} shader source:`, source);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const setupShaders = (): boolean => {
    const gl = glRef.current;
    if (!gl) return false;

    const vs = compileShader(gl.VERTEX_SHADER, vertexShader);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShader);

    if (!vs || !fs) return false;

    const program = gl.createProgram();
    if (!program) return false;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return false;
    }

    programRef.current = program;
    return true;
  };

  const hexToRGB = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 1, g: 1, b: 1 };
  };

  const createParticles = (pixels: Uint8ClampedArray): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const positions: number[] = [];
    const colors: number[] = [];
    const particles: Particle[] = [];

    const logoTint = hexToRGB(config.logoColor);

    for (let i = 0; i < config.logoSize; i++) {
      for (let j = 0; j < config.logoSize; j++) {
        const pixelIndex = (i * config.logoSize + j) * 4;
        const alpha = pixels[pixelIndex + 3];

        if (alpha > 10) {
          const particleX = centerX + (j - config.logoSize / 2) * 1.0;
          const particleY = centerY + (i - config.logoSize / 2) * 1.0;

          positions.push(particleX, particleY);

          const originalR = pixels[pixelIndex] / 255;
          const originalG = pixels[pixelIndex + 1] / 255;
          const originalB = pixels[pixelIndex + 2] / 255;
          const originalA = pixels[pixelIndex + 3] / 255;

          colors.push(
            originalR * logoTint.r,
            originalG * logoTint.g,
            originalB * logoTint.b,
            originalA
          );

          particles.push({
            originalX: particleX,
            originalY: particleY,
            velocityX: 0,
            velocityY: 0,
          });
        }
      }
    }

    particlesRef.current = particles;
    positionArrayRef.current = new Float32Array(positions);
    colorArrayRef.current = new Float32Array(colors);
    createBuffers();
    animate();
  };

  const createBuffers = (): void => {
    const gl = glRef.current;
    if (!gl || !positionArrayRef.current || !colorArrayRef.current) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionArrayRef.current, gl.DYNAMIC_DRAW);
    positionBufferRef.current = positionBuffer;

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colorArrayRef.current, gl.STATIC_DRAW);
    colorBufferRef.current = colorBuffer;
  };

  const loadLogo = (): void => {
    const image = new Image();
    image.onload = function () {
      console.log("Logo loaded successfully");
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;

      tempCanvas.width = config.logoSize;
      tempCanvas.height = config.logoSize;

      const scale = 0.9;
      const size = config.logoSize * scale;
      const offset = (config.logoSize - size) / 2;

      ctx.drawImage(image, offset, offset, size, size);
      const imageData = ctx.getImageData(
        0,
        0,
        config.logoSize,
        config.logoSize
      );

      createParticles(imageData.data);
    };

    image.onerror = function () {
      console.error("Failed to load logo image from:", config.logoPath);
    };

    image.src = config.logoPath;
  };

  const updatePhysics = (): void => {
    if (animationCountRef.current < 0) return;
    animationCountRef.current--;

    const gl = glRef.current;
    const particles = particlesRef.current;
    const positionArray = positionArrayRef.current;
    const positionBuffer = positionBufferRef.current;

    if (!gl || !particles || !positionArray || !positionBuffer) return;

    const radiusSquared = config.distortionRadius * config.distortionRadius;
    const mouse = mouseRef.current;

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      const currentX = positionArray[i * 2];
      const currentY = positionArray[i * 2 + 1];

      const deltaX = mouse.x - currentX;
      const deltaY = mouse.y - currentY;
      const distanceSquared = deltaX * deltaX + deltaY * deltaY;

      if (distanceSquared < radiusSquared && distanceSquared > 0) {
        const force = -radiusSquared / distanceSquared;
        const angle = Math.atan2(deltaY, deltaX);

        const distFromOrigin = Math.sqrt(
          (currentX - particle.originalX) ** 2 +
            (currentY - particle.originalY) ** 2
        );

        const forceMultiplier = Math.max(
          0.1,
          1 - distFromOrigin / (config.maxDisplacement * 2)
        );

        particle.velocityX +=
          force * Math.cos(angle) * config.forceStrength * forceMultiplier;
        particle.velocityY +=
          force * Math.sin(angle) * config.forceStrength * forceMultiplier;
      }

      particle.velocityX *= 0.82;
      particle.velocityY *= 0.82;

      const targetX =
        currentX +
        particle.velocityX +
        (particle.originalX - currentX) * config.returnForce;
      const targetY =
        currentY +
        particle.velocityY +
        (particle.originalY - currentY) * config.returnForce;

      const offsetX = targetX - particle.originalX;
      const offsetY = targetY - particle.originalY;
      const distFromOrigin = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

      if (distFromOrigin > config.maxDisplacement) {
        const excess = distFromOrigin - config.maxDisplacement;
        const scale = config.maxDisplacement / distFromOrigin;
        const dampedScale = scale + (1 - scale) * Math.exp(-excess * 0.02);

        positionArray[i * 2] = particle.originalX + offsetX * dampedScale;
        positionArray[i * 2 + 1] = particle.originalY + offsetY * dampedScale;

        particle.velocityX *= 0.7;
        particle.velocityY *= 0.7;
      } else {
        positionArray[i * 2] = targetX;
        positionArray[i * 2 + 1] = targetY;
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positionArray);
  };

  const render = (): void => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const program = programRef.current;
    const particles = particlesRef.current;
    const positionBuffer = positionBufferRef.current;
    const colorBuffer = colorBufferRef.current;

    if (
      !gl ||
      !canvas ||
      !program ||
      !particles ||
      !positionBuffer ||
      !colorBuffer
    )
      return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    const bgColor = hexToRGB(config.canvasBg);
    gl.clearColor(bgColor.r, bgColor.g, bgColor.b, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (particles.length === 0) return;

    gl.useProgram(program);

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const colorLoc = gl.getAttribLocation(program, "a_color");
    gl.enableVertexAttribArray(colorLoc);
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, particles.length);
  };

  const animate = (): void => {
    updatePhysics();
    render();
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (event: MouseEvent): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    mouseRef.current.x = (event.clientX - rect.left) * dpr;
    mouseRef.current.y = (event.clientY - rect.top) * dpr;
    animationCountRef.current = 300;
  };

  const handleResize = (): void => {
    setupCanvas();
    const particles = particlesRef.current;
    const positionArray = positionArrayRef.current;
    const positionBuffer = positionBufferRef.current;
    const gl = glRef.current;
    const canvas = canvasRef.current;

    if (
      particles.length > 0 &&
      positionArray &&
      positionBuffer &&
      gl &&
      canvas
    ) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const dim = Math.sqrt(particles.length);

      for (let i = 0; i < particles.length; i++) {
        const row = Math.floor(i / dim);
        const col = i % dim;
        const repositionX = centerX + (col - dim / 2) * 1.0;
        const repositionY = centerY + (row - dim / 2) * 1.0;

        particles[i].originalX = repositionX;
        particles[i].originalY = repositionY;
        positionArray[i * 2] = repositionX;
        positionArray[i * 2 + 1] = repositionY;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positionArray);
    }
  };

  const init = (): void => {
    setupCanvas();
    if (!setupWebGL()) return;
    if (!setupShaders()) return;
    loadLogo();
  };

  useEffect(() => {
    init();

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-50 pointer-events-none">
      <canvas
        ref={canvasRef}
        id="canvas"
        className="block"
        style={{ background: config.canvasBg }}
      />
    </div>
  );
};

export default LogoParticles;
