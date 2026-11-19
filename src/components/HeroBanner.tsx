import React, { useCallback, useEffect, useRef } from 'react';
import { ChevronDown, Compass, GraduationCap, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SCHOOL_INFO } from '../utils/schoolData';
import { REEL_TOTAL_FRAMES, getFramePath } from '../utils/scrollReel';

export const HeroBanner: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cache of loaded HTMLImageElement objects
  const imagesMapRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);

  // Motion scroll progress across the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Layer 1: Entrance Hero typography (0.0 -> 0.28)
  const layer1Opacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const layer1Y = useTransform(scrollYProgress, [0, 0.28], [0, -70]);
  const layer1Scale = useTransform(scrollYProgress, [0, 0.28], [1, 0.95]);

  // Layer 2: Architecture & Campus narrative (0.30 -> 0.65)
  const layer2Opacity = useTransform(scrollYProgress, [0.3, 0.38, 0.56, 0.65], [0, 1, 1, 0]);
  const layer2Y = useTransform(scrollYProgress, [0.3, 0.38, 0.56, 0.65], [40, 0, 0, -40]);

  // Layer 3: Skyward Vision & Academic Pride (0.68 -> 0.96)
  const layer3Opacity = useTransform(scrollYProgress, [0.68, 0.76, 0.9, 0.98], [0, 1, 1, 0]);
  const layer3Y = useTransform(scrollYProgress, [0.68, 0.76, 0.9, 0.98], [40, 0, 0, -40]);

  // Function to render a specific frame onto the canvas with cover sizing
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Find the best image to render (exact frame or closest loaded neighbor)
    const map = imagesMapRef.current;
    let img: HTMLImageElement | undefined = map.get(frameNum);

    if (!img) {
      // Find nearest loaded frame
      let bestDist = Infinity;
      let bestFrame = 1;
      for (const loadedIdx of map.keys()) {
        const dist = Math.abs(loadedIdx - frameNum);
        if (dist < bestDist) {
          bestDist = dist;
          bestFrame = loadedIdx;
        }
      }
      img = map.get(bestFrame);
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const hRatio = canvasWidth / imgWidth;
    const vRatio = canvasHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const destWidth = imgWidth * ratio;
    const destHeight = imgHeight * ratio;
    const shiftX = (canvasWidth - destWidth) / 2;
    const shiftY = (canvasHeight - destHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight, shiftX, shiftY, destWidth, destHeight);
    activeFrameRef.current = frameNum;
  }, []);

  // Resize canvas to match display size with DPR scaling
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      drawFrame(activeFrameRef.current);
    }
  }, [drawFrame]);

  // Progressive image preloader
  useEffect(() => {
    let isMounted = true;
    const map = imagesMapRef.current;

    // Helper to load an individual frame
    const loadSingleFrame = (idx: number): Promise<HTMLImageElement | null> => {
      if (map.has(idx)) return Promise.resolve(map.get(idx)!);
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFramePath(idx, true);
        img.onload = () => {
          if (!isMounted) return resolve(null);
          map.set(idx, img);
          // If this is the first frame or the currently active frame, paint immediately
          if (idx === 1 && !activeFrameRef.current) {
            drawFrame(1);
          } else if (idx === activeFrameRef.current) {
            drawFrame(idx);
          }
          resolve(img);
        };
        img.onerror = () => {
          // Fallback to jpg if webp fails
          const fallback = new Image();
          fallback.src = getFramePath(idx, false);
          fallback.onload = () => {
            if (!isMounted) return resolve(null);
            map.set(idx, fallback);
            if (idx === activeFrameRef.current) drawFrame(idx);
            resolve(fallback);
          };
          fallback.onerror = () => resolve(null);
        };
      });
    };

    // Priority 1: Load frame 1 immediately for instant paint
    loadSingleFrame(1).then(() => {
      if (isMounted) {
        resizeCanvas();
        drawFrame(1);
      }
    });

    // Priority 2: Load keyframes spaced across the reel (every 8th frame)
    const keyframes: number[] = [];
    for (let i = 2; i <= REEL_TOTAL_FRAMES; i += 8) {
      keyframes.push(i);
    }

    // Priority 3: All remaining frames
    const remainingFrames: number[] = [];
    for (let i = 2; i <= REEL_TOTAL_FRAMES; i++) {
      if (!keyframes.includes(i)) remainingFrames.push(i);
    }

    // Chunk loader with controlled concurrency to prevent network congestion
    const loadQueue = async (queue: number[], concurrency: number = 6) => {
      let index = 0;
      const workers = Array.from({ length: concurrency }, async () => {
        while (index < queue.length && isMounted) {
          const frameNum = queue[index++];
          await loadSingleFrame(frameNum);
        }
      });
      await Promise.all(workers);
    };

    (async () => {
      await loadQueue(keyframes, 6);
      if (isMounted) {
        await loadQueue(remainingFrames, 6);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [drawFrame, resizeCanvas]);

  // Window resize listener
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Sync scroll position to frame rendering
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      // Clamped frame 1 to 238
      const clamped = Math.min(1, Math.max(0, progress));
      const targetFrame = Math.min(
        REEL_TOTAL_FRAMES,
        Math.max(1, Math.round(clamped * (REEL_TOTAL_FRAMES - 1)) + 1)
      );

      if (targetFrame !== activeFrameRef.current) {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
          drawFrame(targetFrame);
        });
      }
    });

    return () => {
      unsubscribe();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawFrame, scrollYProgress]);

  // Quick scroll to About Us section
  const handleScrollToContent = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      aria-label="Nightingale International Secondary School Interactive Reel"
      className="relative w-full h-[320vh] bg-black text-white"
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Background Canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
        />

        {/* Cinematic Film Vignette & Dynamic Lighting Gradients */}
        <div
          className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-black/80 via-black/35 to-black/85"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-70 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80"
          aria-hidden="true"
        />

        {/* Top Spacer for Translucent Fixed Navbar */}
        <div className="relative z-20 pt-24" />

        {/* LAYER 1: Giant Display Wordmark & Initial Headline (Progress 0.0 - 0.28) */}
        <motion.div
          style={{ opacity: layer1Opacity, y: layer1Y, scale: layer1Scale }}
          className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 my-auto text-center select-none pointer-events-none"
        >
          <h1
            aria-label="Nightingale International Secondary School"
            className="font-display font-bold uppercase text-white tracking-tight leading-[0.92] text-[clamp(2.5rem,10vw,8.5rem)] flex justify-center overflow-hidden drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
          >
            {SCHOOL_INFO.shortName.split('').map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 48, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.3em] font-mono-tabular text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-xl mx-auto">
            {SCHOOL_INFO.fullName}
          </p>
        </motion.div>

        {/* LAYER 2: Architecture & Modern Infrastructure Spotlight (Progress 0.30 - 0.65) */}
        <motion.div
          style={{ opacity: layer2Opacity, y: layer2Y }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 max-w-4xl mx-auto px-4 sm:px-6 pointer-events-none"
        >
          <div className="glass-card p-6 sm:p-10 border border-white/20 shadow-2xl backdrop-blur-2xl text-left">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-[#F5C542] mb-3">
              <Compass className="w-4 h-4 shrink-0" />
              <span>Campus Perspective · Multi-Tier Learning Complex</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug drop-shadow-md">
              Purpose-Built Architecture for Secondary Excellence
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
              From our spacious central assembly courtyard to vibrant multi-story gallery corridors,
              Nightingale Block D is designed to nurture focus, collaboration, and community spirit.
            </p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-white/80 border-t border-white/15 pt-4">
              <div>
                <span className="font-bold text-white block text-sm">30+ Years</span>
                <span>Rich Educational Heritage</span>
              </div>
              <div>
                <span className="font-bold text-white block text-sm">Grades 7–10</span>
                <span>Specialized Secondary Wing</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="font-bold text-white block text-sm">Kopundole</span>
                <span>Lalitpur, Nepal</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* LAYER 3: Skyward Vision & Institutional Motto (Progress 0.68 - 0.96) */}
        <motion.div
          style={{ opacity: layer3Opacity, y: layer3Y }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 max-w-3xl mx-auto px-4 sm:px-6 text-center pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Motto: “{SCHOOL_INFO.motto}” · By Work and Honor</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
            Empowering Young Minds for Tomorrow's World
          </h2>
          <p className="mt-4 text-sm sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed drop-shadow-md">
            Holistic education cultivating academic excellence, moral integrity, and lifelong leadership.
          </p>
          <div className="mt-6 pointer-events-auto">
            <a
              href="#about"
              onClick={handleScrollToContent}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-transform active:scale-95 shadow-xl cursor-pointer"
            >
              <span>Explore Curriculum & Campus</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* BOTTOM SECTION: Welcome Headline & Floating Scroll Cue */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {/* Bottom-Left Welcome Text (fades as user scrolls down into reel) */}
          <motion.div
            style={{ opacity: layer1Opacity }}
            className="max-w-xl select-none pointer-events-none"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white mb-2 drop-shadow-md">
              <GraduationCap className="w-4 h-4 shrink-0 text-[#F5C542]" aria-hidden="true" />
              <span>
                {SCHOOL_INFO.blockName} ({SCHOOL_INFO.blockGradeRange}) · Kopundole
              </span>
            </div>
            <p className="font-display font-bold text-white leading-[1.08] tracking-tight text-[clamp(1.75rem,3.5vw,2.75rem)] [text-wrap:balance] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Leading the Way in Secondary Education
            </p>
          </motion.div>

          {/* Bottom-Right Floating Minimalist Scroll Cue */}
          <motion.a
            href="#about"
            onClick={handleScrollToContent}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-xs font-mono-tabular uppercase tracking-widest text-white/80 hover:text-white transition-colors flex items-center gap-2 cursor-pointer z-30 pb-2 select-none"
          >
            <span>Scroll ↓</span>
            <ChevronDown className="w-4 h-4 text-[#F5C542]" />
          </motion.a>
        </div>
      </div>
    </section>
  );
};
