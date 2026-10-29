/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import BookingLockerView, { BookingSubmissionData } from './components/BookingLockerView';

// Preset Y2K Cyber Glam inspirations for quick consultation
const PRESET_IDEAS = [
  '✦ Sirène Chrome Doré & Charms 3D',
  '🌺 Papaye Hibiscus Tropical & Étoiles',
  '💎 Cyber Tribal Chrome & Croix Argentée',
  '🌸 French Amande Pop Duo Néon',
];

// Color themes that cycle on each wall hit in DVD screensaver
const COLOR_THEMES = [
  { glow: '#ff007f', border: '#ff3399', text: 'HOT PINK' },
  { glow: '#00f0ff', border: '#33ccff', text: 'CYBER CYAN' },
  { glow: '#b026ff', border: '#cc66ff', text: 'ELECTRIC PLUM' },
  { glow: '#ffe600', border: '#ffea4d', text: 'Y2K GOLD' },
  { glow: '#ff3864', border: '#ff6685', text: 'VELOUR CHERRY' },
  { glow: '#39ff14', border: '#70ff54', text: 'MATRIX ACID' },
];

export default function App() {
  // Website view state: starts at 'screensaver', transitions on click to 'corkboard', or 'booking' (Pink Locker)
  const [viewMode, setViewMode] = useState<'screensaver' | 'corkboard' | 'booking'>('screensaver');

  // Booking Confirmation Pop-up state
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    id: string;
    prestation: string;
    slot: string;
    instagram: string;
    igUrl: string;
    messageText: string;
    aiNote?: string;
  } | null>(null);

  // Input Modal state for nail art consultation
  const [showInputModal, setShowInputModal] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [activeConcept, setActiveConcept] = useState<string | null>(null);

  // Animated Waiting Screen / Transition state
  const [isLoading, setIsLoading] = useState(false);
  const [waitingStatusText, setWaitingStatusText] = useState('DISC 01: LOADED • ATELIER CONSULTATION');
  const [progressStep, setProgressStep] = useState('Connexion au studio Nails by Soa...');
  const [portalFlash, setPortalFlash] = useState(false);
  const [isScreenTransitioning, setIsScreenTransitioning] = useState(false);

  // Gemini AI Response state
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [receiptMode, setReceiptMode] = useState<'standard' | 'ai-prescription'>('standard');

  // DVD Screensaver Physics & Stats state
  const [cornerHits, setCornerHits] = useState(0);
  const [runtimeSeconds, setRuntimeSeconds] = useState(135); // 00:02:15 like screenshot
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  // CD Player state
  const [isCdPlaying, setIsCdPlaying] = useState(true);

  // Audio Context Ref for 2000s chimes
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Physics animation refs
  const logoBoxRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: 0, y: 0, dx: 2.8, dy: 2.8, width: 260, height: 260 });
  const animFrameIdRef = useRef<number | null>(null);

  // Initialize Web Audio synth
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
  }, []);

  // Retro DVD bounce chime
  const playBounceChime = useCallback((frequency = 520) => {
    try {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio playback ignore on restrict
    }
  }, []);

  // Retro 2000s console hyper-warp chime
  const playEnterWarpSound = useCallback(() => {
    try {
      initAudio();
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(260, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.4);
      osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.9);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(520, now);
      osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.5);
      osc2.frequency.exponentialRampToValueAtTime(2200, now + 1.1);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch {
      // Audio error fallback
    }
  }, [initAudio]);

  // Elapsed runtime clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRuntimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format runtime clock HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Start DVD bounce physics loop when on screensaver
  useEffect(() => {
    if (viewMode !== 'screensaver') return;

    const initialWidth = window.innerWidth || 1200;
    const initialHeight = window.innerHeight || 800;
    posRef.current.width = 260;
    posRef.current.height = 260;
    posRef.current.x = Math.max(50, initialWidth - 380);
    posRef.current.y = Math.max(100, Math.floor(initialHeight * 0.28));

    const handleResize = () => {
      const maxX = (window.innerWidth || 1200) - posRef.current.width;
      const maxY = (window.innerHeight || 800) - posRef.current.height;
      if (posRef.current.x > maxX) posRef.current.x = Math.max(0, maxX);
      if (posRef.current.y > maxY) posRef.current.y = Math.max(0, maxY);
    };
    window.addEventListener('resize', handleResize);

    const updatePhysics = () => {
      const maxX = (window.innerWidth || 1200) - posRef.current.width;
      const maxY = (window.innerHeight || 800) - posRef.current.height;

      posRef.current.x += posRef.current.dx;
      posRef.current.y += posRef.current.dy;

      let hitX = false;
      let hitY = false;

      // Horizontal boundaries
      if (posRef.current.x <= 10) {
        posRef.current.x = 10;
        posRef.current.dx = Math.abs(posRef.current.dx);
        hitX = true;
      } else if (posRef.current.x >= maxX - 10) {
        posRef.current.x = maxX - 10;
        posRef.current.dx = -Math.abs(posRef.current.dx);
        hitX = true;
      }

      // Vertical boundaries
      const topBound = 80;
      const bottomBound = maxY - 90;
      if (posRef.current.y <= topBound) {
        posRef.current.y = topBound;
        posRef.current.dy = Math.abs(posRef.current.dy);
        hitY = true;
      } else if (posRef.current.y >= bottomBound) {
        posRef.current.y = bottomBound;
        posRef.current.dy = -Math.abs(posRef.current.dy);
        hitY = true;
      }

      if (hitX || hitY) {
        setCurrentColorIndex((prev) => (prev + 1) % COLOR_THEMES.length);
        playBounceChime(hitX && hitY ? 880 : 440 + Math.random() * 200);

        if (hitX && hitY) {
          setCornerHits((prev) => prev + 1);
        }
      }

      if (logoBoxRef.current) {
        logoBoxRef.current.style.left = `${posRef.current.x}px`;
        logoBoxRef.current.style.top = `${posRef.current.y}px`;
      }

      animFrameIdRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameIdRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [viewMode, playBounceChime]);

  // Audio unlock listener
  useEffect(() => {
    const handleFirstPointer = () => {
      initAudio();
      window.removeEventListener('pointerdown', handleFirstPointer);
    };
    window.addEventListener('pointerdown', handleFirstPointer, { once: true });
    return () => window.removeEventListener('pointerdown', handleFirstPointer);
  }, [initAudio]);

  // Transition from Screensaver to Corkboard on screen click
  const handleEnterCorkboard = () => {
    if (isScreenTransitioning) return;
    setIsScreenTransitioning(true);
    playEnterWarpSound();
    setIsLoading(true);
    setWaitingStatusText('DISC 01: LOADED • OUVERTURE DU STUDIO NBS');
    setProgressStep('Ouverture de la planche moodboard liège...');

    // Flash and switch view
    setTimeout(() => {
      setPortalFlash(true);
    }, 800);

    setTimeout(() => {
      setIsLoading(false);
      setPortalFlash(false);
      setIsScreenTransitioning(false);
      setViewMode('corkboard');
    }, 1200);
  };

  // Submit Prompt to Gemini API with Animated Waiting Screen
  const handleConsultationSubmit = async (promptText: string) => {
    const textToSubmit = promptText.trim() || 'Set Papaye 3D Tropical Hibiscus Nails';
    setUserPrompt(textToSubmit);
    setActiveConcept(textToSubmit);
    setShowInputModal(false);
    setIsLoading(true);
    setWaitingStatusText('DISC 01: LOADED • CONSULTATION SUR-MESURE GEMINI AI');
    setErrorMessage(null);
    setPortalFlash(false);

    // Audio cue
    playEnterWarpSound();

    // Step progress animation messages
    const progressInterval = setInterval(() => {
      const steps = [
        'Analyse des courbures Y2K & longueur...',
        'Incrustation des charms 3D chromés...',
        'Application du vernis glitter glossy...',
        'Génération du ticket de prescription VIP...',
      ];
      setProgressStep((prev) => {
        const nextIdx = (steps.indexOf(prev) + 1) % steps.length;
        return steps[nextIdx];
      });
    }, 700);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la génération avec Gemini.');
      }

      clearInterval(progressInterval);
      setAiResponse(data.text || '');
      setReceiptMode('ai-prescription');

      // Trigger hyperspace flash transition before revealing container
      setPortalFlash(true);
      setTimeout(() => {
        setIsLoading(false);
        setPortalFlash(false);
        // Scroll to receipt ticket smoothly
        const receiptEl = document.querySelector('[data-purpose="receiptify-menu"]');
        if (receiptEl) {
          receiptEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 600);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const msg = err instanceof Error ? err.message : 'Une erreur inattendue est survenue.';
      setErrorMessage(msg);
      setIsLoading(false);
      setPortalFlash(false);
    }
  };

  // Submit Booking to Backend (Pink Locker Flow)
  const handleBookingSubmission = async (bookingData: BookingSubmissionData) => {
    setIsLoading(true);
    setWaitingStatusText('DISC 01: LOADED • ENREGISTREMENT CASIER N° 2000 & INSTAGRAM DM');
    setErrorMessage(null);
    setPortalFlash(false);

    // Audio cue
    playEnterWarpSound();

    const steps = [
      'Enregistrement de ton créneau dans le casier N° 2000...',
      'Préparation de la demande officielle Instagram DM...',
      'Génération du conseil de préparation avec Gemini AI...',
      'Impression du pass VIP studio...',
    ];
    let stepIdx = 0;
    const progressInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setProgressStep(steps[stepIdx]);
    }, 700);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation.');
      }

      clearInterval(progressInterval);
      if (data.aiPrescription) {
        setAiResponse(data.aiPrescription);
        setReceiptMode('ai-prescription');
        setActiveConcept(`${bookingData.prestation} • ${bookingData.slot}`);
      }

      setBookingConfirmation({
        id: data.bookingId,
        prestation: bookingData.prestation,
        slot: bookingData.slot,
        instagram: bookingData.instagram,
        igUrl: data.igUrl,
        messageText: data.messageText,
        aiNote: data.aiPrescription,
      });

      setPortalFlash(true);
      setTimeout(() => {
        setIsLoading(false);
        setPortalFlash(false);
        // Try opening Instagram DM
        try {
          window.open(data.igUrl, '_blank');
        } catch {
          // ignore popup blocker
        }
      }, 600);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const msg = err instanceof Error ? err.message : 'Une erreur inattendue est survenue.';
      setErrorMessage(msg);
      setIsLoading(false);
      setPortalFlash(false);
    }
  };

  // Quick open consultation modal for a specific polaroid / concept
  const handleOpenConsultation = (conceptPreset?: string) => {
    if (conceptPreset) {
      setUserPrompt(conceptPreset);
    }
    setShowInputModal(true);
  };

  // Copy prescription to clipboard
  const handleCopy = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTheme = COLOR_THEMES[currentColorIndex];

  return (
    <div className="relative min-h-screen bg-black text-neutral-800 font-sans select-none overflow-x-hidden">
      {/* ============================================================== */}
      {/* 1. CRT SCREENSAVER VIEW (INITIAL VIEW - 100% IDENTICAL)        */}
      {/* ============================================================== */}
      {viewMode === 'screensaver' && (
        <div
          className={`crt-screen relative w-screen h-screen flex flex-col justify-between cursor-pointer ${
            isScreenTransitioning ? 'open-portal-anim' : ''
          }`}
          id="screensaver-root"
          onClick={handleEnterCorkboard}
        >
          {/* Retro Scanlines & CRT layers */}
          <div className="scanlines"></div>
          <div className="crt-vignette"></div>
          <div className="crt-flicker"></div>

          {/* Background Y2K ambient elements & radial starburst grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ff007f_1px,transparent_1px)] [background-size:32px_32px]"></div>

          {/* Retro Corner Accents / CRT OSD (On-Screen Display) */}
          <header className="relative z-30 p-4 sm:p-6 flex justify-between items-start pointer-events-none">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#39ff14] animate-pulse"></div>
              <div className="font-mono text-xs tracking-widest text-emerald-400/90 pixel-font text-base sm:text-lg">
                [DVD-VIDEO] DISC_01 // PLAYING
              </div>
            </div>

            {/* Center Status: Early 2000s Sony / Cyber Glam HUD */}
            <div className="text-center bg-black/60 backdrop-blur-md border border-pink-500/30 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-[0_0_20px_rgba(255,0,127,0.25)] flex items-center gap-2 sm:gap-4">
              <span className="text-pink-400 font-extrabold tracking-widest text-[10px] sm:text-xs uppercase y2k-syne flex items-center gap-1.5">
                <span className="inline-block animate-spin text-xs sm:text-sm">💿</span> NAILS BY SOA // 2000s SPECIAL EDITION
              </span>
              <span className="text-zinc-600 hidden sm:inline">|</span>
              <span className="pixel-font text-pink-300 text-sm sm:text-lg tracking-wider hidden sm:inline" id="bounce-counter">
                CORNER HITS: {String(cornerHits).padStart(2, '0')}
              </span>
            </div>

            {/* Right HUD: Audio & Region */}
            <div className="text-right pixel-font text-pink-400 text-sm sm:text-lg tracking-wider leading-tight">
              <div>DOLBY DIGITAL 5.1 CH</div>
              <div className="text-zinc-400 text-xs sm:text-sm">CH-01: HOT PINK GLAM</div>
            </div>
          </header>

          {/* Floating Retro Sparkles in Ambient Space */}
          <div className="sparkle top-1/4 left-1/5">✦</div>
          <div className="sparkle top-2/3 left-1/3">★</div>
          <div className="sparkle top-1/3 right-1/4">✦</div>
          <div className="sparkle bottom-1/4 right-1/3">✧</div>
          <div className="sparkle bottom-1/3 left-1/2">★</div>

          {/* BOUNCING DVD LOGO CONTAINER (Equipped with glowing NBS NAILS DVD emblem) */}
          <div
            ref={logoBoxRef}
            id="dvd-logo-box"
            className="group rounded-3xl p-2 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
            style={{
              left: '140px',
              top: '544px',
              ['--glow-color' as string]: currentTheme.glow,
            }}
            title="Cliquez pour entrer dans le site Nails by Soa"
            onClick={(e) => {
              e.stopPropagation();
              handleEnterCorkboard();
            }}
          >
            {/* Holographic Border Ring on Logo Hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500 via-fuchsia-400 to-cyan-400 opacity-30 blur-md group-hover:opacity-90 group-hover:blur-xl transition duration-300 pointer-events-none"></div>

            {/* Retro NBS Nails Emblem Card */}
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden border-2 bg-black/90 group-hover:border-pink-300 transition duration-300 flex flex-col items-center justify-center p-3"
              style={{
                borderColor: currentTheme.border,
                boxShadow: `0 0 35px ${currentTheme.glow}, inset 0 0 15px ${currentTheme.glow}40`,
              }}
            >
              <div className="w-full h-full flex items-center justify-center pointer-events-none p-2">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSoyoMWE74YLWm2NmWSG8sTDgMTzgoUd6X6kwpOcdU1X9NSO8_TLWyI1QD3UjvViFGuDecow3ZshIZ_a48miOZOzFGnAvU-hP1BNgFTqUU4nCgOmp2JD6cBdoYFajp7uKWuaZg-ahoD4QhByU-Uk2Q9WUofesRJff3hkodqLd46jowiDzKjM-_AWNEYRJ_sbTUolbaJn7iiSOtyDLBVjAWcqBBkG1Cpv_OcaLc6Q-4GQfPjlKx6gzS"
                  alt="NBS Nails"
                  className="w-full h-full object-cover rounded-2xl select-none"
                />
              </div>

              {/* Retro Scanlines Layer over the logo itself */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/10 to-transparent pointer-events-none"></div>

              {/* DVD Video Sub-ribbon inside badge */}
              <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
                <span className="inline-block bg-black/80 border border-pink-500/60 px-3 py-0.5 rounded-full text-[10px] font-mono tracking-widest text-pink-300 uppercase shadow-md backdrop-blur-sm">
                  CLICK TO INSERT DISC ✦
                </span>
              </div>
            </div>
          </div>

          {/* Center Call-To-Action Instructions */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-24 pointer-events-none z-30 px-4">
            <div
              className="pointer-events-auto cursor-pointer group text-center"
              onClick={(e) => {
                e.stopPropagation();
                handleEnterCorkboard();
              }}
            >
              <div className="press-start-badge text-2xl sm:text-3xl md:text-4xl text-pink-400 font-bold tracking-wider mb-2 flex items-center justify-center gap-2 sm:gap-3">
                <span>▶</span> PRESS SCREEN OR CLICK DVD LOGO TO ENTER <span>◀</span>
              </div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-pink-200/70 font-mono flex items-center justify-center gap-2">
                <span>✧</span> CYBER DIVA NAIL ARCHITECTURE &amp; BESPOKE 3D SCULPTING <span>✧</span>
              </p>

              {/* Big Glam Enter Button */}
              <button
                type="button"
                className="mt-4 sm:mt-5 inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(255,0,127,0.7),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-pink-300/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterCorkboard();
                }}
              >
                <span>💿 LOAD DISC 01: ENTER STUDIO NOW</span>
                <span className="text-base sm:text-lg">→</span>
              </button>
            </div>
          </div>

          {/* Bottom Retro DVD Status Bar */}
          <footer className="relative z-30 p-4 sm:p-6 flex flex-wrap justify-between items-end border-t border-pink-900/40 bg-black/40 backdrop-blur-sm pointer-events-none gap-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
                <span className="text-[10px] sm:text-xs font-mono text-pink-400 tracking-wider">TRACK 04 // APPOINTMENTS READY</span>
              </div>
              <span className="text-zinc-600 hidden md:inline">•</span>
              <span className="text-[10px] sm:text-xs font-mono text-zinc-400 hidden md:inline">1080i WIDESCREEN // 60 FPS MOTION</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-mono text-pink-300/80">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-emerald-400">●</span> 14 VIP SLOTS UNLOCKED
              </div>
              <div>
                TIME: <span id="runtime-clock">{formatTime(runtimeSeconds)}</span>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ACTUAL CORKBOARD WEBSITE (100% IDENTICAL TO SCREEN.PNG)     */}
      {/* ============================================================== */}
      {viewMode === 'corkboard' && (
        <div className="min-h-screen p-2 sm:p-4 md:p-8 flex items-center justify-center selection:bg-[#e0247d] selection:text-white bg-black">
          <main
            className="w-full max-w-[1520px] wood-frame cork-texture rounded-xl sm:rounded-2xl relative overflow-hidden p-3 sm:p-6 md:p-12 transition-all border-[14px] sm:border-[18px] md:border-[24px]"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBStHzXyc_lNC55IX1sLAeBIUXKo9LA-N3Dnyh2snpMFoOnmY4eDu-XFrYp8aItQeM2BsJg0U2BjkrX6hKwvgknmmSJdpMM9d36zHd3g8IPhG6bF-QRFo0i0XZZ_kiie1ypygUHONyOQ6wY91J8FzoN34DQhFNWiXg54Cz9cIG2ABn-DxJz2E_8DtWvizqLZmKL0QnixMcsz7dnpwetyVciJ43TJbgpmijOMvuNkklk8iZVT2IlfcIb')`,
              backgroundRepeat: 'repeat',
              backgroundSize: '550px auto',
            }}
          >
            {/* Top Corner Wall Hanging Nails Decoration (Clickable to return to screensaver) */}
            <div
              className="absolute top-4 left-6 w-5 h-5 rounded-full bg-stone-800 border-2 border-black shadow-inner opacity-80 cursor-pointer hover:scale-110 transition z-40"
              title="Retourner à l'écran de veille DVD"
              onClick={() => setViewMode('screensaver')}
            ></div>
            <div
              className="absolute top-4 right-6 w-5 h-5 rounded-full bg-stone-800 border-2 border-black shadow-inner opacity-80 cursor-pointer hover:scale-110 transition z-40"
              title="Retourner à l'écran de veille DVD"
              onClick={() => setViewMode('screensaver')}
            ></div>

            {/* BEGIN: Top Banner / Header Pinboard Cluster */}
            <header className="relative z-30 mb-6 sm:mb-8 pb-2 sm:pb-4">
              <div className="flex flex-col items-center justify-center relative pt-4 pb-3">
                {/* Washi tape & Pins hanging the banner */}
                <div className="w-28 sm:w-36 h-4 sm:h-5 tape-gingham-pink tape-torn-edges absolute -top-2 left-4 sm:left-10 transform -rotate-6 z-40 flex items-center justify-center border-t border-b border-black/10">
                  <span className="text-[7px] sm:text-[9px] font-mono font-black text-[#9c1d57] tracking-widest uppercase select-none">
                    ✦ PUNK POP VIBES ✦
                  </span>
                </div>
                <div className="w-28 sm:w-36 h-4 sm:h-5 tape-crinkle-metallic tape-torn-edges absolute -top-2 right-4 sm:right-10 transform rotate-6 z-40 flex items-center justify-center border-t border-b border-white/20">
                  <span className="text-[7px] sm:text-[9px] font-marker text-white drop-shadow select-none">
                    ★ Y2K MCBLING ★
                  </span>
                </div>

                {/* Inflatable Metallic Foil Cutout Letters Container */}
                <div className="relative flex flex-col items-center justify-center text-center my-2 group select-none max-w-full">
                  {/* Floating Push Pins */}
                  <div className="absolute -top-5 left-1/4 transform -translate-x-1/2 z-40">
                    <div className="pin-head pin-pink !relative !top-0 !left-0"></div>
                  </div>
                  <div className="absolute -top-5 right-1/4 transform translate-x-1/2 z-40">
                    <div className="pin-head pin-yellow !relative !top-0 !left-0"></div>
                  </div>

                  {/* Cutout Collage Letters */}
                  <div className="relative flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-2 sm:gap-y-3 px-2 sm:px-4 py-2 sm:py-4 select-none">
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                      <div
                        className="relative inline-flex items-center justify-center w-8 h-11 sm:w-12 sm:h-14 md:w-16 md:h-20 bg-white border-2 border-black shadow-md transform -rotate-3 hover:rotate-0 transition duration-200"
                        style={{
                          clipPath: 'polygon(4% 0%, 100% 3%, 96% 98%, 0% 95%)',
                          boxShadow: '3px 4px 8px rgba(0,0,0,0.35)',
                        }}
                      >
                        <span className="font-black text-3xl sm:text-4xl md:text-6xl text-black tracking-tighter font-syne">
                          N
                        </span>
                      </div>
                      <div
                        className="relative inline-flex items-center justify-center w-8 h-11 sm:w-12 sm:h-14 md:w-16 md:h-20 bg-[#e0247d] border-2 border-white shadow-md transform rotate-2 hover:rotate-0 transition duration-200"
                        style={{
                          clipPath: 'polygon(0% 4%, 98% 0%, 94% 96%, 3% 100%)',
                          boxShadow: '3px 4px 8px rgba(0,0,0,0.35)',
                        }}
                      >
                        <span
                          className="font-black text-3xl sm:text-4xl md:text-6xl text-white tracking-tighter"
                          style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                        >
                          A
                        </span>
                      </div>
                      <div
                        className="relative inline-flex items-center justify-center w-7 h-11 sm:w-10 sm:h-14 md:w-14 md:h-20 bg-black border-2 border-[#ff2a8d] shadow-md transform -rotate-2 hover:rotate-0 transition duration-200"
                        style={{
                          clipPath: 'polygon(6% 0%, 100% 6%, 92% 100%, 0% 92%)',
                          boxShadow: '3px 4px 8px rgba(0,0,0,0.4)',
                        }}
                      >
                        <span className="font-black text-3xl sm:text-4xl md:text-6xl text-[#ff2a8d] font-receiptSub">
                          I
                        </span>
                      </div>
                      <div
                        className="relative inline-flex items-center justify-center w-8 h-11 sm:w-12 sm:h-14 md:w-16 md:h-20 bg-white border-2 border-[#9c1d57] shadow-md transform rotate-4 hover:rotate-0 transition duration-200"
                        style={{
                          clipPath: 'polygon(2% 2%, 97% 0%, 100% 94%, 5% 98%)',
                          boxShadow: '3px 4px 8px rgba(0,0,0,0.35)',
                        }}
                      >
                        <span className="font-black text-3xl sm:text-4xl md:text-6xl text-[#9c1d57] font-marker">
                          L
                        </span>
                      </div>
                      <div
                        className="relative inline-flex items-center justify-center w-8 h-11 sm:w-12 sm:h-14 md:w-16 md:h-20 bg-black border-2 border-[#e0247d] shadow-md transform -rotate-3 hover:rotate-0 transition duration-200"
                        style={{
                          clipPath: 'polygon(0% 0%, 94% 5%, 98% 97%, 3% 92%)',
                          boxShadow: '3px 4px 8px rgba(0,0,0,0.4)',
                        }}
                      >
                        <span className="font-black text-3xl sm:text-4xl md:text-6xl text-[#e0247d] font-monoReceipt">
                          S
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mx-1 md:mx-2">
                      <div
                        className="relative inline-flex items-center justify-center w-8 h-11 sm:w-12 sm:h-14 md:w-16 md:h-20 bg-[#9c1d57] border-2 border-black shadow-md transform rotate-3 hover:rotate-0 transition duration-200"
                        style={{
                          clipPath: 'polygon(5% 0%, 100% 2%, 95% 98%, 0% 94%)',
                          boxShadow: '3px 4px 8px rgba(0,0,0,0.4)',
                        }}
                      >
                        <span className="font-black text-3xl sm:text-4xl md:text-6xl text-white font-syne">
                          B
                        </span>
                      </div>
                      <div
                        className="relative inline-flex items-center justify-center w-8 h-11 sm:w-12 sm:h-14 md:w-16 md:h-20 bg-[#ff2a8d] border-2 border-white shadow-md transform -rotate-4 hover:rotate-0 transition duration-200"
                        style={{
                          clipPath: 'polygon(0% 6%, 96% 0%, 92% 96%, 4% 100%)',
                          boxShadow: '3px 4px 8px rgba(0,0,0,0.35)',
                        }}
                      >
                        <span className="font-black text-3xl sm:text-4xl md:text-6xl text-black font-marker">
                          Y
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                      <div
                        className="relative inline-flex items-center justify-center w-8 h-11 sm:w-12 sm:h-14 md:w-16 md:h-20 bg-white border-2 border-black shadow-md transform rotate-2 hover:rotate-0 transition duration-200"
                        style={{
                          clipPath: 'polygon(3% 0%, 97% 4%, 100% 96%, 0% 94%)',
                          boxShadow: '3px 4px 8px rgba(0,0,0,0.35)',
                        }}
                      >
                        <span
                          className="font-black text-3xl sm:text-4xl md:text-6xl text-black"
                          style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                        >
                          S
                        </span>
                      </div>
                      <div
                        className="relative inline-flex items-center justify-center w-8 h-11 sm:w-12 sm:h-14 md:w-16 md:h-20 bg-black border-2 border-[#e0247d] shadow-md transform -rotate-2 hover:rotate-0 transition duration-200"
                        style={{
                          clipPath: 'polygon(0% 0%, 98% 3%, 95% 97%, 3% 92%)',
                          boxShadow: '3px 4px 8px rgba(0,0,0,0.4)',
                        }}
                      >
                        <span className="font-black text-3xl sm:text-4xl md:text-6xl text-white font-syne">
                          O
                        </span>
                      </div>
                      <div
                        className="relative inline-flex items-center justify-center w-8 h-11 sm:w-12 sm:h-14 md:w-16 md:h-20 bg-[#e0247d] border-2 border-black shadow-md transform rotate-3 hover:rotate-0 transition duration-200"
                        style={{
                          clipPath: 'polygon(4% 0%, 100% 5%, 94% 100%, 0% 96%)',
                          boxShadow: '3px 4px 8px rgba(0,0,0,0.35)',
                        }}
                      >
                        <span
                          className="font-black text-3xl sm:text-4xl md:text-6xl text-white"
                          style={{ fontFamily: "'Courier Prime', monospace" }}
                        >
                          A
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pinned Badges around Header */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-1">
                    <div className="bg-white text-black px-2 py-0.5 rounded shadow-md border border-black transform -rotate-6 text-[9px] sm:text-[10px] font-black tracking-tighter">
                      I <span className="text-[#e0247d]">♥</span> NAILS
                    </div>
                    <div className="bg-[#9c1d57] text-white font-black px-2.5 sm:px-3 py-1 rounded-full shadow-lg border-2 border-white transform rotate-2 text-[10px] sm:text-xs flex items-center gap-1.5">
                      <span className="font-marker text-yellow-300 tracking-wide">"VIVRE POUR L'ART !"</span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-pink-200">• @nailsbysoa</span>
                    </div>
                    <div className="bg-black text-[#ff2a8d] border border-[#ff2a8d] px-2 sm:px-2.5 py-0.5 font-mono font-black text-[9px] sm:text-[10px] uppercase tracking-widest shadow-md transform -rotate-3">
                      [STYLE: 100% BLING]
                    </div>
                  </div>
                </div>

                {/* Subtitle Capsule Pill */}
                <div className="mt-2 sm:mt-3 bg-gradient-to-r from-[#e0247d] via-[#9c1d57] to-[#e0247d] text-white font-syne font-extrabold uppercase px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm tracking-wide sm:tracking-widest shadow-xl border-2 border-white transform -rotate-1 text-center ring-2 ring-black/40">
                  ✦ GEL-X SUR-MESURE ▪ MAXI NAILS ▪ GAINAGE ▪ PRESS-ON NAIL$ ▪ EDITORIAL NAILS ✦
                </div>
              </div>
            </header>
            {/* END: Top Banner / Header Pinboard Cluster */}

            {/* BEGIN: Main Moodboard Collage Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start relative z-20">
              {/* LEFT COLUMN: Receiptify Service Menu & Studio Rules Side-by-Side (6 Cols) */}
              <section
                className="lg:col-span-6 flex flex-col sm:flex-row items-start justify-center lg:justify-start gap-4 sm:gap-5"
                data-purpose="pinned-menu-column"
              >
                {/* Pinned Receiptify Receipt - Compact scattered paper ticket */}
                <article
                  className="relative bg-white text-black rounded-sm p-3.5 sm:p-4 shadow-2xl border-t-[5px] border-[#e0247d] font-monoReceipt transform -rotate-1 hover:rotate-0 transition duration-300 w-full sm:w-[260px] md:w-[275px] max-w-[285px] flex-shrink-0"
                  data-purpose="receiptify-menu"
                >
                  <div className="w-18 sm:w-20 h-4 tape-gingham-pink tape-torn-edges absolute -top-2.5 -left-3 transform -rotate-12 z-30 shadow-md flex items-center justify-center">
                    <span className="text-[7px] font-mono text-[#9c1d57] font-bold select-none">
                      ♥ NBS TICKET ♥
                    </span>
                  </div>
                  <div className="w-18 sm:w-20 h-4 tape-holo-foil tape-torn-edges absolute -top-2.5 -right-3 transform rotate-12 z-30 shadow-md flex items-center justify-center">
                    <span className="text-[7px] font-mono text-white font-black select-none">
                      ★ 2000s GLAM ★
                    </span>
                  </div>

                  {/* Hot Pink Pin at top */}
                  <div className="pin-head pin-pink"></div>

                  {/* Cute Receipt Header */}
                  <div className="text-center border-b border-dashed border-black/30 pb-2 mb-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <h2 className="text-xl sm:text-2xl font-black tracking-widest text-[#e0247d] font-syne leading-none uppercase">
                        RECEIPTIFY
                      </h2>
                      {aiResponse && (
                        <button
                          type="button"
                          onClick={() =>
                            setReceiptMode((prev) => (prev === 'standard' ? 'ai-prescription' : 'standard'))
                          }
                          className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black text-white hover:bg-[#e0247d] transition cursor-pointer"
                        >
                          {receiptMode === 'ai-prescription' ? '📋 MENU' : '✨ AI TICKET'}
                        </button>
                      )}
                    </div>
                    <p className="text-[8.5px] uppercase tracking-wider text-neutral-600 font-receiptSub font-bold mt-0.5">
                      {receiptMode === 'ai-prescription'
                        ? 'PRESCRIPTION NAIL ART SUR-MESURE'
                        : 'TICKET OFFICIEL NBS NAILS • PRESTATIONS'}
                    </p>
                    <p className="text-[8.5px] text-neutral-500 font-mono">
                      COMMANDE #2004-Y2K • ARTISTE : SOA
                    </p>
                    <p className="text-[8.5px] text-neutral-500 font-mono">
                      CLIENTE : VIP BADDIE CLUB
                    </p>
                  </div>

                  {/* Content: Either Standard Service Menu OR AI Populated Prescription */}
                  {receiptMode === 'ai-prescription' && aiResponse ? (
                    <div className="space-y-2 text-xs font-mono text-neutral-900">
                      <div className="p-1.5 bg-pink-50 border border-[#e0247d] rounded text-[10px]">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[#e0247d] uppercase text-[9px]">✦ CONCEPT :</span>
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="text-[8px] font-bold text-black underline hover:text-[#e0247d] cursor-pointer"
                          >
                            {copied ? '✓ COPIÉ !' : 'COPIER'}
                          </button>
                        </div>
                        <p className="font-sans italic font-bold truncate text-[10px]">"{activeConcept}"</p>
                      </div>

                      <div className="max-h-[200px] overflow-y-auto pr-1 text-[9.5px] leading-relaxed whitespace-pre-wrap font-sans">
                        {aiResponse}
                      </div>

                      <div className="pt-1.5 border-t border-dashed border-black/30 flex justify-between items-center text-[8.5px]">
                        <button
                          type="button"
                          onClick={() => handleOpenConsultation()}
                          className="px-2 py-0.5 bg-[#e0247d] hover:bg-[#ff2a8d] text-white font-syne rounded uppercase font-bold transition cursor-pointer"
                        >
                          ⚡ AUTRE SET
                        </button>
                        <button
                          type="button"
                          onClick={() => setReceiptMode('standard')}
                          className="text-neutral-600 underline cursor-pointer"
                        >
                          Voir menu
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Service Items List - Compact ticket spacing */
                    <div className="space-y-2 text-xs font-receiptSub text-neutral-900">
                      {/* Section: GEL-X */}
                      <div className="border-b border-black/15 pb-1.5">
                        <div className="flex items-center justify-between font-bold text-black border-b border-dashed border-black/25 pb-0.5 mb-1">
                          <span className="font-syne text-[11px] text-[#e0247d] tracking-wider uppercase flex items-center gap-1">
                            ✦ 01. GEL-X
                          </span>
                          <span className="text-[8.5px] font-mono text-neutral-500 uppercase">TARIFS POSE</span>
                        </div>
                        <div className="space-y-0.5 text-[10.5px] text-neutral-900">
                          <div className="flex justify-between items-baseline">
                            <span>Vernis simple</span>
                            <span className="font-bold text-black text-xs">30€</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span>French</span>
                            <span className="font-bold text-black text-xs">35€</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span>French + 2 nail art</span>
                            <span className="font-bold text-[#e0247d] text-xs">37€</span>
                          </div>
                          <div>
                            <div className="flex justify-between items-baseline">
                              <span>Nail art complet</span>
                              <span className="font-bold text-[#e0247d] text-xs">40€</span>
                            </div>
                            <p className="text-[8px] text-neutral-500 italic">Tous les ongles sont travaillés</p>
                          </div>
                          <div>
                            <div className="flex justify-between items-baseline">
                              <span>Mix&amp;Match Set</span>
                              <span className="font-extrabold text-[#9c1d57] text-xs">45-50€</span>
                            </div>
                            <p className="text-[8px] text-neutral-500 italic">Chaque ongle est différent</p>
                          </div>
                        </div>
                      </div>

                      {/* Section: GAINAGE */}
                      <div className="pt-0.5 pb-0.5">
                        <div className="flex items-center justify-between font-bold text-black border-b border-dashed border-black/25 pb-0.5 mb-1">
                          <span className="font-syne text-[11px] text-[#e0247d] tracking-wider uppercase flex items-center gap-1">
                            ✦ 02. GAINAGE
                          </span>
                          <span className="text-[8.5px] font-mono text-neutral-500 uppercase">
                            RENFORT NATUREL
                          </span>
                        </div>
                        <div className="space-y-0.5 text-[10.5px] text-neutral-900">
                          <div className="flex justify-between items-baseline">
                            <span>Vernis simple</span>
                            <span className="font-bold text-black text-xs">25€</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span>French</span>
                            <span className="font-bold text-black text-xs">30€</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span>French + 2 nail art</span>
                            <span className="font-bold text-black text-xs">30€</span>
                          </div>
                          <div>
                            <div className="flex justify-between items-baseline">
                              <span>Nail art complet</span>
                              <span className="font-bold text-[#e0247d] text-xs">35€</span>
                            </div>
                            <p className="text-[8px] text-neutral-500 italic">Tous les ongles sont travaillés</p>
                          </div>
                          <div>
                            <div className="flex justify-between items-baseline">
                              <span>Mix&amp;Match Set</span>
                              <span className="font-extrabold text-[#9c1d57] text-xs">40€</span>
                            </div>
                            <p className="text-[8px] text-neutral-500 italic">Chaque ongle est différent</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Receipt Totals & Barcode */}
                  <div className="mt-2.5 pt-1.5 border-t border-dashed border-black/30">
                    <div className="flex justify-between text-[9px] font-bold text-neutral-700">
                      <span>NB FORMULES : 10 TARIFS</span>
                      <span className="text-[#e0247d]">100% CUTE VIBES</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-extrabold text-[#9c1d57] mt-0.5">
                      <span>TOTAL ESTIMÉ :</span>
                      <span className="text-[#e0247d]">25€ - 50€ / POSE</span>
                    </div>

                    {/* Barcode Graphic Simulation */}
                    <div className="mt-2 flex flex-col items-center">
                      <div className="h-6 w-full flex justify-center items-center gap-[2px] overflow-hidden px-1">
                        <div className="h-full w-1 bg-black"></div>
                        <div className="h-full w-0.5 bg-black"></div>
                        <div className="h-full w-2 bg-black"></div>
                        <div className="h-full w-1.5 bg-black"></div>
                        <div className="h-full w-0.5 bg-black"></div>
                        <div className="h-full w-1 bg-black"></div>
                        <div className="h-full w-2 bg-black"></div>
                        <div className="h-full w-0.5 bg-black"></div>
                        <div className="h-full w-1.5 bg-black"></div>
                        <div className="h-full w-1 bg-black"></div>
                        <div className="h-full w-0.5 bg-black"></div>
                        <div className="h-full w-2 bg-black"></div>
                        <div className="h-full w-1 bg-black"></div>
                        <div className="h-full w-2.5 bg-black"></div>
                        <div className="h-full w-0.5 bg-black"></div>
                        <div className="h-full w-1 bg-black"></div>
                        <div className="h-full w-1.5 bg-black"></div>
                        <div className="h-full w-0.5 bg-black"></div>
                        <div className="h-full w-2 bg-black"></div>
                        <div className="h-full w-1 bg-black"></div>
                        <div className="h-full w-0.5 bg-black"></div>
                      </div>
                      <p className="text-[7.5px] sm:text-[8px] tracking-widest text-neutral-600 mt-0.5 font-mono font-bold text-center">
                        MERCI DE VOTRE VISITE CHEZ @NAILSBYSOA
                      </p>
                    </div>
                  </div>

                  {/* Receipt Sawtooth Edge */}
                  <div className="absolute -bottom-2 left-0 right-0 h-3 receipt-bottom-sawtooth transform rotate-180"></div>
                </article>

                {/* Studio Policy Pinned Note Card - Compact & Pinned Next to Receiptify */}
                <aside
                  className="relative bg-white rounded-md p-3 sm:p-3.5 shadow-xl border-l-[3.5px] border-[#9c1d57] border-y border-r border-black/15 font-sans transform rotate-1 sm:rotate-2 hover:rotate-0 transition w-full sm:w-[200px] md:w-[220px] max-w-[230px] flex-shrink-0"
                  data-purpose="studio-policies-card"
                >
                  <div className="w-18 h-4 tape-daisy-cherries tape-torn-edges absolute -top-2.5 right-2 transform rotate-6 z-30 shadow-md flex items-center justify-center">
                    <span className="text-[7px] font-marker text-white select-none">🌸 IMPORTANT 🍒</span>
                  </div>
                  <div className="pin-head pin-cyan"></div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-base">⚠️</span>
                    <h3 className="font-syne font-bold text-xs sm:text-[13px] tracking-wide uppercase text-black leading-tight">
                      Règles du Studio
                    </h3>
                  </div>
                  <ul className="text-[9.5px] sm:text-[10.5px] text-neutral-800 space-y-1 list-disc list-inside leading-snug">
                    <li>
                      <strong>Sans acompte :</strong> 0€ requis pour réserver.
                    </li>
                    <li>
                      <strong>Accompagnateur :</strong> Aucun (session solo / 1 créneau = 1 personne).
                    </li>
                    <li>
                      <strong>Dépose :</strong> Facturée 5€.
                    </li>
                    <li>
                      <strong>Retard :</strong> 15 min max tolérance.
                    </li>
                  </ul>
                </aside>
              </section>
              {/* END: LEFT COLUMN */}

              {/* RIGHT COLUMN: Visual Polaroid Gallery & Interactive Booking Board (6 Cols) */}
              <section className="lg:col-span-6 flex flex-col gap-6" data-purpose="pinned-gallery-column">
                {/* Gallery Header Strip */}
                <div className="flex items-center justify-between bg-black/85 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-[#e0247d] text-white">
                  <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider">
                    <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-[#e0247d] rounded-full animate-ping"></span>
                    <span className="text-[#ff2a8d] font-bold">PORTFOLIO &amp; CRÉATIONS DU MOMENT</span>
                  </div>
                  <span className="font-marker text-[10px] sm:text-xs text-yellow-300">Touchez les photos pour créer</span>
                </div>

                {/* Polaroids Cluster */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-start">
                  {/* Polaroid 1: 3D Tropical Papaya Hibiscus Claws */}
                  <figure
                    className="group relative bg-white p-3 pb-5 rounded-sm shadow-2xl border border-neutral-200 transform -rotate-2 sm:-rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer"
                    data-purpose="polaroid-card-1"
                    onClick={() => handleOpenConsultation('Set Papaye 3D Tropical Fleurs Hibiscus & Étoiles')}
                  >
                    <div className="pin-head pin-yellow"></div>
                    <div className="w-20 h-5 tape-crinkle-metallic tape-torn-edges absolute -top-2.5 -right-3 transform rotate-12 z-30 shadow-md"></div>
                    <div className="overflow-hidden rounded bg-black aspect-[3/4] relative">
                      <img
                        alt="Set Papaye 3D Tropical Nails by Soa"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2qosbMNCJJKZAt04Ehfm7tu6nkjOQ9FPQilS7MIhGpXSDJJaG0qrgD4m_bmp18ykbLtgQ4bIKdyxjwTHaM9i0YEzMdltJOYIyDYX7F5bjp2596--DUbEaFnAzS_HRqj2C80MsNsS5I7H7PS-x9P49ApoQZIpdnYmzUKb6oIB7BFyZrbAH_S1nIETF_OEuKj0LQtEOaIp0CM2DGG50cAl31qEpXK6ejqlJysVrP0o2_w9kCzktYLNM"
                      />
                      <span className="absolute top-2 left-2 bg-[#e0247d] text-white font-mono text-[9px] px-2 py-0.5 rounded tracking-widest uppercase font-bold">
                        3D Tropical
                      </span>
                    </div>
                    <figcaption className="mt-3 text-center">
                      <p className="font-marker text-xs text-black">Set Papaye 3D Tropical</p>
                      <p className="text-[10px] font-mono text-[#e0247d] font-bold">
                        Fleurs d'hibiscus &amp; étoiles de mer
                      </p>
                    </figcaption>
                  </figure>

                  {/* Polaroid 2: Bespoke Mermaid Gold Chrome */}
                  <figure
                    className="group relative bg-white p-3 pb-5 rounded-sm shadow-2xl border border-neutral-200 transform rotate-1 sm:rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer"
                    data-purpose="polaroid-card-2"
                    onClick={() => handleOpenConsultation('Griffes Sirène Chrome Doré & Charms 3D')}
                  >
                    <div className="pin-head pin-pink"></div>
                    <div className="w-24 h-5 tape-gingham-pink tape-torn-edges absolute -top-3 left-4 transform -rotate-6 z-30 shadow-md flex items-center justify-center">
                      <span className="text-[8px] font-mono text-[#9c1d57] font-black">CHROME GLAM</span>
                    </div>
                    <div className="overflow-hidden rounded bg-black aspect-[3/4] relative">
                      <img
                        alt="Griffes Sirène Chrome Doré"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPpo0nZBSrVqJvJUksDhgJeKIoJ0yapeaNHB-pTTKWHILDCJ0ILDWNVutSwt-cFiYpVHLI_wSIMJt8NCAjnKToklM3luHnbrQXpk9Ws3ePyGu7I4jnBwFDjUwRVh_QSiAQN6_GdpIPXA9SuqRVsbGNZclSbsdA8YchO1yeujCUEahoXHrA-EF7-L_Hf-IFJy3iQKeObh2GAoDX3D7dC4AvmCLQx0llggzuXfGaHkNeA02roDXve_m1"
                      />
                      <span className="absolute top-2 left-2 bg-[#9c1d57] text-white font-mono text-[9px] px-2 py-0.5 rounded tracking-widest uppercase font-bold">
                        Sirène Glam
                      </span>
                    </div>
                    <figcaption className="mt-3 text-center">
                      <p className="font-marker text-xs text-black">Griffes Sirène Chrome Doré</p>
                      <p className="text-[10px] font-mono text-[#9c1d57] font-bold">
                        Texture 3D chromée sur-mesure
                      </p>
                    </figcaption>
                  </figure>

                  {/* Polaroid 3: Pop French Duo Almond */}
                  <figure
                    className="group relative bg-white p-3 pb-5 rounded-sm shadow-2xl border border-neutral-200 transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer"
                    data-purpose="polaroid-card-3"
                    onClick={() => handleOpenConsultation('French Amande Pop Duo Néon & Micro-points')}
                  >
                    <div className="w-20 h-5 tape-pink-hearts tape-torn-edges absolute -top-2.5 left-3 transform -rotate-12 z-30 shadow-md"></div>
                    <div className="pin-head pin-cyan"></div>
                    <div className="overflow-hidden rounded bg-black aspect-[3/4] relative">
                      <img
                        alt="French Amande Pop Duo Nails"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyZd3y_ADFhya5GWxpo6npRpKC6Dk5YFhMOBfQuKV-4vmlrthnxeuPUtHTwfU6SwrNFF72ryHy4Nci6mQqqEdBPmptSyiCPbIidBoq7GmQl-oK6YIOFdabBTUcW-8-BWozagixhyU619QtgQhifPEpTS-r_O577-HYBuK0_EoTKqwiwGUPaAMAEOpP-xIF1LHDINJIlYpHjsCU0lD8h-JDI2qq_dK97k75PInq_0tfjzQCbRp4f3In"
                      />
                      <span className="absolute top-2 left-2 bg-black text-[#ff2a8d] border border-[#ff2a8d] font-bold font-mono text-[9px] px-2 py-0.5 rounded tracking-widest uppercase">
                        Clean Pop
                      </span>
                    </div>
                    <figcaption className="mt-3 text-center">
                      <p className="font-marker text-xs text-black">French Amande Pop Duo</p>
                      <p className="text-[10px] font-mono text-[#e0247d] font-bold">
                        Micro-points &amp; colorblock néon
                      </p>
                    </figcaption>
                  </figure>
                </div>

                {/* Mini FAQ flyer & Booking Sticky Note */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-2">
                  {/* Mini FAQ flyer */}
                  <div
                    className="md:col-span-6 relative bg-gradient-to-br from-[#9c1d57] via-[#e0247d] to-black p-3.5 rounded-md shadow-2xl text-white transform -rotate-1 sm:-rotate-2 hover:rotate-0 transition border-2 border-black"
                    data-purpose="vintage-postcard"
                  >
                    <div className="w-20 h-5 tape-holo-foil tape-torn-edges absolute -top-2.5 -right-2 transform rotate-12 z-20 shadow-md flex items-center justify-center">
                      <span className="text-[7px] font-mono text-white font-bold select-none">
                        ✦ FAQ TIPS ✦
                      </span>
                    </div>
                    <div className="pin-head pin-pink"></div>
                    <div className="w-16 h-4 tape-gingham-pink tape-torn-edges absolute -bottom-2 -left-2 transform rotate-45 z-20 shadow-md"></div>
                    <div className="border border-white/40 p-2.5 h-full flex flex-col justify-between bg-black/20">
                      <div className="flex justify-between items-start border-b border-white/30 pb-1.5 mb-2">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-white font-mono font-bold">
                            ✦ MINI GUIDE • FAQ ✦
                          </span>
                          <h4 className="font-syne font-black text-lg uppercase tracking-wider drop-shadow-md text-white leading-tight">
                            FAQ DU STUDIO
                          </h4>
                          <p className="text-[9px] font-mono text-yellow-300 uppercase tracking-widest">
                            INFOS PRATIQUES
                          </p>
                        </div>
                        <div className="border border-dashed border-white/60 px-1 py-0.5 text-center text-[8px] uppercase font-mono leading-none bg-black/40 rounded-sm">
                          <span className="text-yellow-300 font-bold">VIP PASS</span>
                          <br />
                          <span className="text-white">FAQ</span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-[#ff2a8d]/60 inline-block mb-1.5">
                          <p className="font-marker text-[10px] text-yellow-300 drop-shadow">
                            "RÉPONSES CLÉS"
                          </p>
                        </div>
                        <div className="space-y-1 text-[10px] font-sans">
                          <div className="bg-black/40 rounded px-1.5 py-1 border border-white/20 flex flex-col gap-0.5">
                            <div className="font-bold text-[#ff2a8d] text-[10px] flex items-center gap-1">
                              <span>❓</span> Accompagnateurs autorisés ?
                            </div>
                            <div className="text-white text-[10px] pl-3.5 font-medium">
                              🚫 Aucun (session 100% solo).
                            </div>
                          </div>
                          <div className="bg-black/40 rounded px-1.5 py-1 border border-white/20 flex flex-col gap-0.5">
                            <div className="font-bold text-[#ff2a8d] text-[10px] flex items-center gap-1">
                              <span>❓</span> Faut-il verser un acompte ?
                            </div>
                            <div className="text-white text-[10px] pl-3.5 font-medium">
                              💖 0€ (aucun acompte requis).
                            </div>
                          </div>
                          <div className="bg-black/40 rounded px-1.5 py-1 border border-white/20 flex flex-col gap-0.5">
                            <div className="font-bold text-[#ff2a8d] text-[10px] flex items-center gap-1">
                              <span>❓</span> Tarif de la dépose ?
                            </div>
                            <div className="text-white text-[10px] pl-3.5 font-medium">
                              ✨ 5€ seulement.
                            </div>
                          </div>
                          <div className="bg-black/40 rounded px-1.5 py-1 border border-white/20 flex flex-col gap-0.5">
                            <div className="font-bold text-[#ff2a8d] text-[10px] flex items-center gap-1">
                              <span>❓</span> Tolérance de retard ?
                            </div>
                            <div className="text-white text-[10px] pl-3.5 font-medium">
                              ⏱️ 15 min max avant annulation.
                            </div>
                          </div>
                          <div className="bg-black/40 rounded px-1.5 py-1 border border-white/20 flex flex-col gap-0.5">
                            <div className="font-bold text-[#ff2a8d] text-[10px] flex items-center gap-1">
                              <span>❓</span> Tenue Gel-X &amp; Gainage ?
                            </div>
                            <div className="text-white text-[10px] pl-3.5 font-medium">
                              💎 3 à 4 semaines garanties.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-1.5 border-t border-white/30">
                        <button
                          type="button"
                          onClick={() => handleOpenConsultation()}
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-black hover:bg-neutral-900 text-white font-syne font-black text-[10px] uppercase tracking-wider py-1.5 px-2 rounded shadow-md border border-[#e0247d] transform hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                          <span>✦ POSER UNE QUESTION OU IDÉE ART ✦</span>
                        </button>
                        <div className="flex justify-between items-center text-[9px] font-mono text-white/90">
                          <span>EST. 2000s</span>
                          <span>PASS VIP SOA</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Booking Sticky Note */}
                  <div
                    className="md:col-span-6 relative bg-gradient-to-br from-[#ff2a8d] to-[#e0247d] text-white p-4 sm:p-5 rounded-lg shadow-2xl transform rotate-1 sm:rotate-2 hover:rotate-0 transition border-2 border-white"
                    data-purpose="booking-sticky-note"
                  >
                    <div className="w-24 sm:w-28 h-4 sm:h-5 tape-daisy-cherries tape-torn-edges absolute -top-2.5 left-4 transform -rotate-6 z-30 shadow-md flex items-center justify-center">
                      <span className="text-[7px] sm:text-[8px] font-marker text-white">🍒 BOOK ME NOW 🍒</span>
                    </div>
                    <div className="w-20 sm:w-24 h-4 sm:h-5 tape-crinkle-metallic tape-torn-edges absolute -bottom-2 -right-2 transform rotate-6 z-30 shadow-md"></div>
                    <div className="pin-head pin-yellow"></div>
                    <div className="flex items-center justify-between border-b border-white/40 pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">💅</span>
                        <h3 className="font-marker text-base sm:text-lg tracking-wide text-yellow-300 drop-shadow">
                          RÉSERVEZ VOTRE CRÉNEAU
                        </h3>
                      </div>
                      <span className="bg-black text-[#ff2a8d] border border-white/30 text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                        CRÉNEAUX OUVERTS
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-white mb-4 font-sans font-medium">
                      Prête pour des ongles spectaculaires McBling ? Cliquez ci-dessous pour demander votre
                      rendez-vous ou lancer votre prescription sur-mesure avec l'IA du studio !
                    </p>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setViewMode('booking')}
                        className="w-full inline-flex items-center justify-between gap-2 bg-yellow-300 hover:bg-yellow-400 text-black font-syne font-black py-2.5 px-4 rounded-md shadow-md text-xs uppercase tracking-wider transform active:scale-95 transition border border-black cursor-pointer"
                        data-purpose="booking-cta-button"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>⚡</span>
                          <span>RÉSERVER UN CRÉNEAU / INSPIRATION</span>
                        </span>
                        <span>→</span>
                      </button>
                      <a
                        className="w-full inline-flex items-center justify-between gap-2 bg-black hover:bg-neutral-900 text-white font-mono py-2 px-4 rounded-md border-2 border-white text-xs uppercase tracking-wider transform hover:scale-105 active:scale-95 transition shadow"
                        data-purpose="instagram-dm-button"
                        href="https://instagram.com/nailsbysoa"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>📷</span>
                          <span>VOIR SUR INSTAGRAM @NAILSBYSOA</span>
                        </span>
                        <span className="text-[10px] bg-[#e0247d] text-white px-1.5 py-0.5 rounded font-bold">
                          IG ↗
                        </span>
                      </a>
                      <a
                        className="w-full inline-flex items-center justify-between gap-2 bg-gradient-to-r from-black via-[#9c1d57] to-black hover:opacity-90 text-white font-syne font-bold py-2 px-4 rounded-md border border-white/60 text-xs uppercase tracking-wider transform hover:scale-105 active:scale-95 transition shadow"
                        data-purpose="collab-email-button"
                        href="mailto:contact@nailsbysoa.com?subject=Collab%20Edito%20NBS"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>💌</span>
                          <span>COLLAB ÉDITO &amp; PRO (EMAIL)</span>
                        </span>
                        <span className="font-mono text-[10px] text-yellow-300">MAIL ✉</span>
                      </a>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-[10px] font-mono text-white tracking-wider font-bold">
                        ♥ RÉPONSE RAPIDE SOUS 24H ♥
                      </span>
                    </div>
                  </div>

                  {/* Retro CD Player ("NBS CYBER RADIO") */}
                  <div
                    className="md:col-span-12 relative bg-black text-white p-3 sm:p-4 rounded-xl shadow-2xl border-2 border-[#e0247d] ring-2 ring-black transform -rotate-1 hover:rotate-0 transition duration-300 mt-2 overflow-hidden"
                    data-purpose="y2k-music-player"
                  >
                    <div className="pin-head pin-yellow"></div>
                    <div className="w-24 sm:w-28 h-4 sm:h-5 tape-gingham-pink tape-torn-edges absolute -top-2.5 right-4 sm:right-6 transform rotate-6 z-30 shadow-md flex items-center justify-center">
                      <span className="text-[7px] sm:text-[8px] font-mono text-[#9c1d57] font-black tracking-wider select-none">
                        ♫ PLAYLIST 2004 ♫
                      </span>
                    </div>
                    {/* Corner Washi Tape at bottom-left matching screen.png */}
                    <div className="w-20 h-4 tape-gingham-pink tape-torn-edges absolute -bottom-2 -left-2 transform -rotate-12 z-30 shadow-md"></div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div
                        className="relative flex-shrink-0 group cursor-pointer"
                        onClick={() => setIsCdPlaying((prev) => !prev)}
                        title={isCdPlaying ? 'Mettre en pause' : 'Lancer le disque'}
                      >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg p-1 bg-white/10 border border-white/20 shadow-inner flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                          <div
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-xl border-2 border-[#ff2a8d] relative flex items-center justify-center ${
                              isCdPlaying ? 'cd-disc-spinning' : ''
                            }`}
                          >
                            <img
                              alt="NBS Y2K Leopard CD"
                              className="w-full h-full object-cover pointer-events-none select-none"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGzG_YfWgiLBuhvmuURalMtO8oVFFRj-hDA8cDYX2lqoqnYBPXjLynhtZLccVV_m6tx8GIhSYcVUnhj0_igx0Xn-fDYKsBzFfW1VyOjz8YTnQXB3od5Q5b757r3SwYMTrRNNpaE3nHRxIG0T0qnCuYdyJ-oNasHzEI1xUsQE3emsLqYX8Bvce8rzsS7F7IBDEamSBu7-VPh46aS1Gwe9iuCbF201HoSGS2h9DTom08ztJt23r22D2-"
                            />
                            <div className="absolute w-4 h-4 rounded-full bg-black border border-[#e0247d] shadow-md flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ff2a8d]"></div>
                            </div>
                          </div>
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-[#e0247d] text-white font-marker text-[8px] px-1 py-0.5 rounded shadow border border-white transform rotate-6 pointer-events-none">
                          {isCdPlaying ? 'En lecture' : 'En pause'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 w-full space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#e0247d]/40 pb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full bg-[#ff2a8d] inline-block flex-shrink-0 ${
                                isCdPlaying ? 'animate-ping' : ''
                              }`}
                            ></span>
                            <span className="font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#ff2a8d] truncate">
                              ✦ NBS CYBER RADIO • 2004 ✦
                            </span>
                          </div>
                          <span className="text-[8px] sm:text-[10px] font-mono bg-[#9c1d57] text-white border border-[#ff2a8d]/40 px-1.5 py-0.5 rounded flex-shrink-0 font-bold">
                            STEREO • 128 KBPS
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 overflow-hidden">
                            <p className="font-syne font-black text-xs sm:text-sm text-yellow-300 tracking-wide truncate">
                              Britney Spears - Toxic (McBling Mix)
                            </p>
                            <p className="text-[9px] sm:text-[10px] font-mono text-pink-200 truncate">
                              Studio Playlist • Track 01
                            </p>
                          </div>
                          <div className="text-right font-mono text-[9px] sm:text-xs text-white/80 flex-shrink-0">
                            <span className="text-[#ff2a8d] font-bold">01:24</span> / 03:45
                          </div>
                        </div>
                        <div className="w-full bg-neutral-900 rounded-full h-2 relative overflow-hidden border border-[#e0247d]/50">
                          <div className="bg-gradient-to-r from-[#e0247d] to-[#ff2a8d] h-full w-[42%] rounded-full shadow-sm"></div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              className="w-7 h-7 rounded bg-[#9c1d57] border border-[#ff2a8d]/50 flex items-center justify-center text-xs hover:bg-[#e0247d] transition active:scale-95 text-white cursor-pointer"
                              type="button"
                              onClick={() => playBounceChime(320)}
                            >
                              ⏮
                            </button>
                            <button
                              className="w-7 h-7 rounded-full bg-[#e0247d] text-white font-bold flex items-center justify-center text-xs shadow hover:scale-105 active:scale-95 transition cursor-pointer"
                              type="button"
                              onClick={() => setIsCdPlaying((prev) => !prev)}
                            >
                              {isCdPlaying ? '❚❚' : '▶'}
                            </button>
                            <button
                              className="w-7 h-7 rounded bg-[#9c1d57] border border-[#ff2a8d]/50 flex items-center justify-center text-xs hover:bg-[#e0247d] transition active:scale-95 text-white cursor-pointer"
                              type="button"
                              onClick={() => playBounceChime(640)}
                            >
                              ⏭
                            </button>
                            <button
                              className="w-7 h-7 rounded bg-neutral-900 border border-white/20 flex items-center justify-center text-[10px] hover:bg-neutral-800 transition text-[#ff2a8d] cursor-pointer"
                              type="button"
                            >
                              🔀
                            </button>
                            <button
                              className="w-7 h-7 rounded bg-neutral-900 border border-white/20 flex items-center justify-center text-[10px] hover:bg-neutral-800 transition text-yellow-300 cursor-pointer"
                              type="button"
                            >
                              🔁
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-mono text-white">
                            <span className="text-xs">🔊</span>
                            <div className="w-12 sm:w-16 bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-[#e0247d]/50">
                              <div className="bg-[#ff2a8d] h-full w-[80%]"></div>
                            </div>
                            <span className="text-[10px]">80%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* END: RIGHT COLUMN */}
            </div>
            {/* END: Main Moodboard Collage Layout */}

            {/* BEGIN: Moodboard Reference Graphic Badge & Footer */}
            <footer
              className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t-2 border-dashed border-black/40 relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4"
              data-purpose="corkboard-footer"
            >
              {/* Mini Reference Preview Card (Clickable to return to screensaver) */}
              <div
                className="flex items-center gap-3 bg-black/60 backdrop-blur-sm p-2 rounded-xl border border-white/20 cursor-pointer hover:border-[#ff2a8d] transition"
                title="Cliquer pour afficher l'écran de veille DVD"
                onClick={() => setViewMode('screensaver')}
              >
                <div className="relative w-14 sm:w-16 h-10 sm:h-11 rounded overflow-hidden border border-[#ff2a8d] shadow">
                  <img
                    alt="Inspiration Moodboard Archives Y2K"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP9pt-0oIfgHUQI9UEqRUqCWtAtnKTo_Z1tutxSmRp1w72Sq2jXVqHoE5U6Sj2GcAQ_07ur8dMHc_31Izd63_HNL2_AT3dgs3uxwxk_OFqJBtSeKdsVQak5v49lu4PsFyYWB6CpflgCBDk2fbdVWThVLs6QcPjcRx0C0FP_0xQF-ukkt18EQ3eI2XJ1FrJMtxQINvnE5g2TbYEkfwHwCkEj5Fi_j9PWl7oFK-RcFltmWoB3wSAf3Sn"
                  />
                </div>
                <div className="text-left">
                  <p className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide">
                    ARCHIVES D'INSPIRATION Y2K
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-[#ff2a8d] font-mono">
                    Planche Moodboard Liège Originale #06 • 💿 DVD MODE
                  </p>
                </div>
              </div>

              {/* Copyright & Social Handles */}
              <div className="text-center sm:text-right">
                <p className="font-syne font-bold text-[10px] sm:text-xs text-black uppercase tracking-wider">
                  © 2004 - 2025 NAILS BY SOA • TOUS DROITS RÉSERVÉS
                </p>
                <p className="text-[9px] sm:text-[11px] font-mono text-neutral-900 font-bold">
                  Nail Art Fait Main McBling • Résines Sculptées 3D • Gel-X Sur-Mesure
                </p>
              </div>
            </footer>
            {/* END: Moodboard Reference Graphic Badge & Footer */}
          </main>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2.5. PINK LOCKER BOOKING VIEW (100% IDENTICAL STITCH DESIGN)   */}
      {/* ============================================================== */}
      {viewMode === 'booking' && (
        <BookingLockerView
          onBackToCorkboard={() => setViewMode('corkboard')}
          onBackToScreensaver={() => setViewMode('screensaver')}
          onStartBookingSubmission={handleBookingSubmission}
          isLoading={isLoading}
        />
      )}

      {/* ============================================================== */}
      {/* BOOKING CONFIRMATION MODAL                                    */}
      {/* ============================================================== */}
      {bookingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-['Space_Grotesk']">
          <div
            className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#18091e] border-3 border-[#ff4a8d] p-5 sm:p-7 shadow-[0_0_60px_rgba(255,74,141,0.65)] text-white flex flex-col gap-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Washi Tape */}
            <div className="w-28 h-5 washi-tape rounded absolute -top-2.5 left-1/2 -translate-x-1/2 shadow-md"></div>

            <div className="flex items-center justify-between border-b border-pink-500/30 pb-3">
              <span className="font-label-sm text-xs uppercase tracking-widest text-pink-300 font-bold">
                CASIER N° 2000 • RÉF : {bookingConfirmation.id}
              </span>
              <button
                type="button"
                onClick={() => setBookingConfirmation(null)}
                className="w-7 h-7 rounded-full bg-pink-950 border border-pink-400 text-pink-200 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff0077] via-[#ff4a8d] to-[#ffb6c1] p-1 shadow-lg flex items-center justify-center mb-2">
                <span className="text-3xl">💖</span>
              </div>
              <h3 className="font-display-lg text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-400">
                CRÉNEAU ENREGISTRÉ !
              </h3>
              <p className="font-body-sm text-xs text-pink-200 mt-1">
                Ta demande officielle est prête pour Soa sur Instagram DM
              </p>
            </div>

            {/* Details Box */}
            <div className="bg-black/60 rounded-2xl p-4 border border-pink-500/40 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-zinc-400">PRESTATION :</span>
                <span className="text-[#ff4a8d] font-bold">{bookingConfirmation.prestation}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-zinc-400">CRÉNEAU CHOISI :</span>
                <span className="text-white font-bold">{bookingConfirmation.slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">INSTAGRAM :</span>
                <span className="text-yellow-300 font-bold">{bookingConfirmation.instagram}</span>
              </div>
            </div>

            {/* AI Note if returned */}
            {bookingConfirmation.aiNote && (
              <div className="p-3 bg-pink-950/40 rounded-xl border border-pink-500/30 text-left text-xs font-sans italic text-pink-100">
                <p className="font-bold text-[#ff4a8d] not-italic text-[11px] mb-1">
                  💬 Mot de Soa (Gemini AI) :
                </p>
                <p className="text-[11px] leading-relaxed line-clamp-4">{bookingConfirmation.aiNote}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <a
                href={bookingConfirmation.igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="puffy-btn w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#ff0077] via-[#ff4a8d] to-[#ff0077] text-white font-label-lg text-xs sm:text-sm uppercase tracking-wider border-2 border-white flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <span>💌</span>
                <span>OUVRIR MON DM INSTAGRAM MAINTENANT</span>
              </a>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBookingConfirmation(null);
                    setViewMode('corkboard');
                  }}
                  className="flex-1 py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase border border-white/20 transition cursor-pointer"
                >
                  Voir ticket sur liège
                </button>
                <button
                  type="button"
                  onClick={() => setBookingConfirmation(null)}
                  className="flex-1 py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase border border-white/20 transition cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. INPUT MODAL: BESPOKE Y2K NAIL CONSULTATION PROMPT           */}
      {/* ============================================================== */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <div
            className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#0f0414] border-2 border-pink-500/70 p-4 sm:p-6 shadow-[0_0_50px_rgba(255,0,127,0.55)] flex flex-col gap-4 sm:gap-5 overflow-hidden text-white font-['Space_Grotesk']"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Corner Sparkles */}
            <div className="absolute top-3 right-4 text-pink-400 animate-pulse text-xl">✨</div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-600/30 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-pink-500/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💿</span>
                <div>
                  <h3 className="y2k-syne font-black text-base sm:text-lg text-white">
                    DISC 01: CONSULTATION NAILS BY SOA
                  </h3>
                  <p className="pixel-font text-xs text-pink-400 tracking-wider">
                    ATELIER BESPOKE 3D SCULPTING • GEMINI AI ENGINE
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInputModal(false)}
                className="w-8 h-8 rounded-full bg-pink-950/70 border border-pink-500/40 text-pink-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Inspiration Chips */}
            <div>
              <label className="block text-[10px] sm:text-xs font-mono uppercase tracking-wider text-pink-300/80 mb-2">
                ✦ IDÉES RAPIDES &amp; INSPIRATIONS DU MOMENT :
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {PRESET_IDEAS.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => setUserPrompt(idea)}
                    className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-pink-950/60 border border-pink-500/30 hover:border-pink-400 text-pink-200 hover:text-white transition shadow-sm cursor-pointer"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Input textarea */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-pink-300">
                VOTRE VISION / DÉCORS / THEME SOUHAITÉ :
              </label>
              <textarea
                rows={3}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Ex: Longs stilettos chromés argent avec charms cœurs 3D, piercing chaîne et dégradé aurore rose..."
                className="w-full rounded-xl sm:rounded-2xl bg-black/90 border border-pink-500/50 p-3 sm:p-3.5 text-xs sm:text-sm text-pink-100 placeholder:text-pink-400/40 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-500/40 transition resize-none"
              />
            </div>

            {/* Error Message within modal if any */}
            {errorMessage && (
              <div className="p-2.5 sm:p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-mono">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowInputModal(false)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-mono uppercase text-zinc-400 hover:text-white cursor-pointer"
              >
                ANNULER
              </button>
              <button
                type="button"
                onClick={() => handleConsultationSubmit(userPrompt)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,0,127,0.7)] hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <span>💿 INSÉRER LE DISQUE ET LANCER</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. ANIMATED WAITING SCREEN OVERLAY (FEATURING IMAGE_5 AVATAR)   */}
      {/* ============================================================== */}
      {isLoading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden font-['Space_Grotesk']"
          id="y2k-transition-overlay"
        >
          {/* Chromatic Backdrop & Starlight Grid */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-xl transition-opacity duration-300 opacity-90"
            id="portal-backdrop"
          ></div>

          {/* Radiant Holographic Starburst Rays */}
          <div className="absolute inset-0 flex items-center justify-center opacity-75 pointer-events-none">
            <div className="w-[450px] sm:w-[600px] md:w-[850px] h-[450px] sm:h-[600px] md:h-[850px] rounded-full border-4 border-dashed border-pink-400/40 spin-slow"></div>
            <div className="absolute w-[350px] sm:w-[450px] md:w-[650px] h-[350px] sm:h-[450px] md:h-[650px] rounded-full border-2 border-dotted border-cyan-400/50 spin-slow-reverse"></div>
            <div className="absolute w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-gradient-to-tr from-pink-600/40 via-purple-600/30 to-cyan-500/40 blur-3xl"></div>
          </div>

          {/* Central Avatar Container (IMAGE_5: Cartoon Sticker Girl Avatar) */}
          <div
            className="relative z-10 flex flex-col items-center justify-center avatar-portal-intro text-white px-4"
            id="avatar-sticker-container"
          >
            {/* Sparkle Orbitals */}
            <div className="absolute -top-12 -left-10 text-2xl sm:text-3xl text-pink-300 animate-ping">✨</div>
            <div className="absolute top-4 -right-14 text-3xl sm:text-4xl text-cyan-300 animate-bounce">💖</div>
            <div className="absolute -bottom-6 -left-12 text-2xl sm:text-3xl text-amber-300 animate-pulse">⭐</div>
            <div className="absolute -bottom-10 -right-8 text-2xl sm:text-3xl text-fuchsia-300 animate-spin">🌸</div>

            {/* Hot Pink Y2K Glowing Halo */}
            <div className="relative flex items-center justify-center p-3 sm:p-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 blur-2xl opacity-80 animate-pulse"></div>
              {/* The Cartoon Sticker Girl Avatar IMAGE_5 */}
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center filter drop-shadow-[0_0_35px_rgba(255,0,127,0.95)]">
                <img
                  alt="NBS Nails Diva Avatar"
                  className="w-full h-full object-contain select-none"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjodFxss5PTLbiwsXzNC9kD5ZspoLVfZ6T2xVskui7usSw6NGUVIvDc4QU-0o-spOkxK7BfE6cTF48aYcgJ1a87_pWAB8PImaT2IxKMytxlUT7qaFpIB69JNxN9LB_ZV_TwDZPSZxF2rGsqr19gMQwrz6i49V0LuGlCK9ZATXjhoxanb-bg_sdT0oEQ626AhJk8IR6ptV_15xjRjvW9XxutqZejUDeX1SvKxlTMNBiqb1K-iQtZVZZ"
                />
              </div>
            </div>

            {/* Retro Glam Overlay Badges & Title */}
            <div className="mt-3 sm:mt-4 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-1 sm:py-1.5 rounded-full bg-black/80 border-2 border-pink-400 text-pink-300 font-mono text-[10px] sm:text-sm tracking-widest shadow-[0_0_25px_#ff007f] uppercase">
                <span className="animate-spin text-xs sm:text-sm">💿</span> {waitingStatusText}
              </div>

              <h2 className="y2k-syne text-xl sm:text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-400 mt-2 filter drop-shadow-[0_0_20px_rgba(255,0,127,0.8)]">
                WELCOME TO NAILS BY SOA
              </h2>
              <p className="pixel-font text-cyan-300 text-base sm:text-lg md:text-xl tracking-widest mt-1">
                ✦ 3D CYBER GLAMOUR • BESPOKE SCULPTING ✦
              </p>

              {/* Dynamic synthesis progress steps */}
              <div className="mt-3 sm:mt-4 flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-pink-950/70 border border-pink-500/40 text-pink-200 font-mono text-[10px] sm:text-xs shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{progressStep}</span>
              </div>
            </div>
          </div>

          {/* Final Hyperspace White/Hot Pink Flash Layer */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-pink-500 via-white to-fuchsia-500 pointer-events-none transition-opacity duration-300 z-30 ${
              portalFlash ? 'opacity-95' : 'opacity-0'
            }`}
            id="portal-flash"
          ></div>
        </div>
      )}

      {/* Global Error Toast */}
      {errorMessage && (
        <div className="fixed top-20 inset-x-0 mx-auto w-fit max-w-md z-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-950/95 border-2 border-red-500 text-red-200 shadow-[0_0_30px_rgba(255,0,0,0.6)] flex items-center justify-between gap-4 font-mono text-xs">
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="px-2 py-1 rounded bg-black/60 border border-red-400 text-white cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}
