import React, { useState, useRef } from 'react';

export interface BookingSubmissionData {
  prestation: string;
  depose: boolean;
  date: string;
  hour: string;
  slot: string;
  instagram: string;
  inspirationNote?: string;
  hasInspirationPhoto?: boolean;
}

interface BookingLockerViewProps {
  onBackToCorkboard: () => void;
  onBackToScreensaver: () => void;
  onStartBookingSubmission: (data: BookingSubmissionData) => Promise<void>;
  isLoading?: boolean;
}

interface CalendarDay {
  day: number | string;
  status: 'available' | 'full' | 'off' | 'closed' | 'adjacent';
  dateStr?: string;
  slots?: string[];
  fullSlot?: string;
  defaultSlots?: string[];
}

const OCTOBER_DAYS: CalendarDay[] = [
  // Week 1: 28 Sep - 4 Oct
  { day: 28, status: 'adjacent' },
  { day: 29, status: 'adjacent' },
  { day: 30, status: 'adjacent' },
  { day: 1, status: 'full' },
  { day: 2, status: 'off' },
  { day: 3, status: 'off' },
  { day: 4, status: 'off' },
  // Week 2: 5 Oct - 11 Oct
  { day: 5, status: 'closed' },
  {
    day: 6,
    status: 'available',
    dateStr: 'Mardi 6 Octobre',
    slots: ['10h', '12h', '16h', '18h'],
    fullSlot: '14h',
    defaultSlots: ['10h00', '12h00', '16h00'],
  },
  {
    day: 7,
    status: 'available',
    dateStr: 'Mercredi 7 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['10h00', '14h00', '18h00'],
  },
  { day: 8, status: 'full' },
  { day: 9, status: 'full' },
  {
    day: 10,
    status: 'available',
    dateStr: 'Samedi 10 Octobre',
    slots: ['10h', '12h', '16h', '18h'],
    fullSlot: '14h',
    defaultSlots: ['10h00', '16h00'],
  },
  { day: 11, status: 'off' },
  // Week 3: 12 Oct - 18 Oct
  {
    day: 12,
    status: 'available',
    dateStr: 'Lundi 12 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['12h00', '14h00', '18h00'],
  },
  {
    day: 13,
    status: 'available',
    dateStr: 'Mardi 13 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['10h00', '16h00'],
  },
  {
    day: 14,
    status: 'available',
    dateStr: 'Mercredi 14 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['10h00', '12h00'],
  },
  { day: 15, status: 'full' },
  { day: 16, status: 'full' },
  {
    day: 17,
    status: 'available',
    dateStr: 'Samedi 17 Octobre',
    slots: ['10h', '12h', '16h', '18h'],
    fullSlot: '14h',
    defaultSlots: ['10h00', '18h00'],
  },
  { day: 18, status: 'off' },
  // Week 4: 19 Oct - 25 Oct
  {
    day: 19,
    status: 'available',
    dateStr: 'Lundi 19 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['10h00', '12h00'],
  },
  {
    day: 20,
    status: 'available',
    dateStr: 'Mardi 20 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['14h00', '16h00'],
  },
  {
    day: 21,
    status: 'available',
    dateStr: 'Mercredi 21 Octobre',
    slots: ['10h', '12h', '16h', '18h'],
    fullSlot: '14h',
    defaultSlots: ['10h00', '12h00', '16h00'],
  },
  { day: 22, status: 'full' },
  { day: 23, status: 'full' },
  {
    day: 24,
    status: 'available',
    dateStr: 'Samedi 24 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['10h00', '12h00'],
  },
  { day: 25, status: 'off' },
  // Week 5: 26 Oct - 31 Oct
  {
    day: 26,
    status: 'available',
    dateStr: 'Lundi 26 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['10h00', '14h00'],
  },
  {
    day: 27,
    status: 'available',
    dateStr: 'Mardi 27 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['10h00', '16h00'],
  },
  {
    day: 28,
    status: 'available',
    dateStr: 'Mercredi 28 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['12h00', '18h00'],
  },
  { day: 29, status: 'full' },
  { day: 30, status: 'full' },
  {
    day: 31,
    status: 'available',
    dateStr: 'Samedi 31 Octobre',
    slots: ['10h', '12h', '14h', '16h', '18h'],
    defaultSlots: ['10h00', '12h00'],
  },
  { day: '1 Nov', status: 'adjacent' },
];

export const BookingLockerView: React.FC<BookingLockerViewProps> = ({
  onBackToCorkboard,
  onBackToScreensaver,
  onStartBookingSubmission,
  isLoading = false,
}) => {
  // Calendar & Slot selection states (defaults matching Stitch export)
  const [selectedDate, setSelectedDate] = useState('Mercredi 21 Octobre');
  const [selectedHour, setSelectedHour] = useState('16h00');
  const [currentSlots, setCurrentSlots] = useState(['10h', '12h', '16h', '18h']);
  const [currentFullSlot, setCurrentFullSlot] = useState<string | null>('14h');

  // Prestation & Options
  const [selectedPrestation, setSelectedPrestation] = useState('Gel-X Sur-Mesure (30€-50€)');
  const [hasDepose, setHasDepose] = useState(false);

  // Form Inputs
  const [instaHandle, setInstaHandle] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBPUvfOquh_ev3FUm1DlDCl1xjB70lk2gzrAfzT0xjbowvH2Lj2vLHtE7o6EZcJsGgHZ8qvBZNvfspsJKsi135YZNv90vvuxoPSiMWRFFbD9C5QsxjpMW_uoPhTmo5bJSGysRPtvDHx6pL7joAqp_6nJxdw3hFrkUkTtDHNpHDYQ3xgOf1eunJr9g1xHzxZNZbFLJ-1wfzpPKeUCUF39FD802AOVK0exea8uzuU2PtJCzNaCyYTACqz'
  );
  const [fileName, setFileName] = useState('inspiration_cherie.jpg');
  const [hasUploadedCustom, setHasUploadedCustom] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Day Selection
  const handleSelectDay = (dayData: CalendarDay) => {
    if (dayData.status !== 'available' || !dayData.dateStr) return;

    setSelectedDate(dayData.dateStr);
    const slots = dayData.slots || ['10h', '12h', '16h', '18h'];
    setCurrentSlots(slots);
    setCurrentFullSlot(dayData.fullSlot || null);

    // Pick first available slot or keep current if valid
    const defaultH = slots.includes('16h') ? '16h00' : slots[0] + '00';
    setSelectedHour(defaultH);
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setFileName(file.name);
      setHasUploadedCustom(true);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle Submit Booking
  const handleSubmitBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const handle = instaHandle.trim() || 'babe';

    await onStartBookingSubmission({
      prestation: selectedPrestation,
      depose: hasDepose,
      date: selectedDate,
      hour: selectedHour,
      slot: `${selectedDate} à ${selectedHour}`,
      instagram: handle,
      inspirationNote: fileName,
      hasInspirationPhoto: hasUploadedCustom,
    });
  };

  return (
    <main className="w-full min-h-screen relative overflow-hidden bg-[#f7a0b8] select-none">
      <div className="flex flex-col w-full relative">
        {/* Realistic Pink Locker Backdrop Section using IMAGE_5 */}
        <div className="relative w-full min-h-screen flex justify-center">
          {/* Outer Locker Frame & Metallic Edges */}
          <div className="relative w-full min-h-screen p-0 bg-transparent">
            {/* Authentic Pink Locker Door Container with IMAGE_5 texture backdrop */}
            <div
              className="relative overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.35),inset_0_-4px_12px_rgba(255,255,255,0.4)] bg-[#f7a0b8] min-h-screen"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBU9ujPJCbcze6p12uaoRgYokuaWRkMbUH9DUw-CNI5XpBUxMJyCNAcJy4twZ2uL-Bxr13YtcVPLcV5FUEjXemzFYOfCfx_N2d77ESbSD6_IqTQF-zfbDGOpbtbBEYY6Ab-lHIGFhwSiB1blHk9deSX_W9nY-hu9slRoYIsBK0ByhjqyMtB9EDH9mU40Y9WPLYu-_q7OeiXVWwGoqDt2As7Ho81DWvxL9rcthq8hcFTKYujveWsAYvE")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Overlay tinted gradient for readability while keeping realistic pink locker metal louvers and locker hardware visible */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#f9a8bd]/75 via-[#f28da5]/70 to-[#e07592]/80 backdrop-blur-[1.5px] pointer-events-none"></div>

              {/* Scattered Decorative Authentic Y2K Locker Stickers from Vision Board */}
              <div className="pointer-events-none absolute top-4 left-6 z-20 hidden md:flex items-center gap-1 bg-white/95 px-3 py-1 rounded-full border-2 border-white shadow-md rotate-[-6deg]">
                <span className="text-xs">🍀</span>
                <span className="font-display-lg text-xs font-bold text-[#b5179e]">Lucky Girl Era</span>
              </div>
              <div className="pointer-events-none absolute top-4 right-8 z-20 hidden md:block rotate-[8deg]">
                <div className="w-12 h-12 rounded-full bg-[#ffde59] border-2 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-[#2a2a2a]">
                  ☺
                </div>
              </div>
              <div className="pointer-events-none absolute top-16 right-36 z-20 hidden lg:block rotate-[-3deg]">
                <span className="font-display-lg text-lg text-white font-extrabold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] px-3 py-1 rounded-full bg-pink-400/80 border-2 border-white">
                  2026 ✨
                </span>
              </div>

              {/* Navigation Back Bar (Subtle & In-Style) */}
              <div className="relative z-30 pt-3 px-4 sm:px-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onBackToCorkboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-[#7a2043] font-label-sm text-xs border border-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer font-bold"
                  title="Revenir au tableau en liège Nails by Soa"
                >
                  <span>←</span>
                  <span>RETOUR AU MOODBOARD LIÈGE</span>
                </button>
                <button
                  type="button"
                  onClick={onBackToScreensaver}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 hover:bg-black text-[#ffb1c4] font-label-sm text-xs border border-pink-400/40 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer font-bold"
                  title="Afficher l'écran de veille DVD"
                >
                  <span>💿</span>
                  <span>ÉCRAN DE VEILLE DVD</span>
                </button>
              </div>

              {/* Content Container layered as stickers and cutouts */}
              <div className="relative z-10 p-space-sm sm:p-space-md md:p-space-xl flex flex-col gap-space-lg">
                {/* LOCKER HEADER: Realistic Slits / Louvers & Locker Combination Lock Badge */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-space-md pb-space-sm border-b-2 border-white/40">
                  {/* Realistic Locker Combo Lock & Number Plate */}
                  <div className="flex items-center gap-space-md">
                    {/* Cutout Combination Lock Sticker Badge */}
                    <div
                      className="relative group cursor-pointer"
                      onClick={onBackToCorkboard}
                      title="Cliquez pour revenir au tableau"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#ffe6ee] to-[#ffadc5] border-3 border-white p-1 shadow-[0_6px_16px_rgba(0,0,0,0.25)] flex items-center justify-center rotate-[-3deg] hover:rotate-0 transition-transform">
                        <div className="w-10 h-10 rounded-full bg-[#1e131d] border-2 border-[#f7a0b8] flex items-center justify-center shadow-inner">
                          <span
                            className="material-symbols-outlined text-[#ffb1c4] text-xl"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            lock
                          </span>
                        </div>
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#ff0066] border border-white flex items-center justify-center text-[9px] text-white font-bold">
                        ♥
                      </span>
                    </div>

                    {/* Die-cut Tape Title Badge */}
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border-2 border-white shadow-md rotate-[-1deg]">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#a80044] font-black block">
                        CASIER PRIVÉ N° 2000 • STUDIO PARIS
                      </span>
                      <span className="font-display-lg text-headline-sm md:text-headline-md text-[#360c17] uppercase tracking-tight flex items-center gap-2">
                        RÉSERVATION OCTOBRE
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-ping"></span>
                      </span>
                    </div>
                  </div>

                  {/* Locker Metal Louvers Representation */}
                  <div className="hidden sm:flex flex-col gap-1.5 opacity-80">
                    <div className="w-32 h-1.5 bg-[#8c3554]/40 rounded-full shadow-inner border-t border-[#ffffff]/60"></div>
                    <div className="w-32 h-1.5 bg-[#8c3554]/40 rounded-full shadow-inner border-t border-[#ffffff]/60"></div>
                    <div className="w-32 h-1.5 bg-[#8c3554]/40 rounded-full shadow-inner border-t border-[#ffffff]/60"></div>
                  </div>

                  {/* Puffy Badges & Stickers */}
                  <div className="flex items-center gap-space-xs flex-wrap justify-center">
                    <span className="sticker-edge inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fff0f5] text-[#b0004a] font-label-md text-label-md font-bold border-2 border-white rotate-[-3deg] hover:rotate-0 transition-transform">
                      <span className="material-symbols-outlined text-sm text-[#ff0066]">stars</span> 100% SANS ACOMPTE
                    </span>
                    <span className="sticker-edge inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff4a8d] to-[#ff2a7a] text-white font-label-md text-label-md font-bold border-2 border-white rotate-[2deg] shadow-lg hover:rotate-0 transition-transform">
                      <span className="material-symbols-outlined text-sm">bolt</span> SLOTS OCTOBRE DISPO
                    </span>
                  </div>
                </div>

                {/* MAIN LOCKER CANVAS: Left Planner / Right Sticky Notes & Die-Cut Booking Sheet */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                  {/* LEFT COLUMN (Cols 1-7): Clipboard Wall Planner with Tape & Magnetic Polaroids */}
                  <div className="lg:col-span-7 flex flex-col gap-space-lg">
                    {/* CLIPBOARD / WALL PLANNER TAPED TO LOCKER */}
                    <div className="relative rounded-2xl bg-[#ffffff] p-space-md sm:p-space-lg shadow-[0_15px_35px_rgba(0,0,0,0.25)] border-4 border-white rotate-[-0.5deg]">
                      {/* Washi Tape across top left & right corners */}
                      <div className="absolute -top-3.5 left-10 w-24 h-6 washi-tape rounded-sm rotate-[-4deg] opacity-90 border-t border-b border-white/50"></div>
                      <div className="absolute -top-3.5 right-12 w-24 h-6 washi-tape rounded-sm rotate-[3deg] opacity-90 border-t border-b border-white/50"></div>

                      {/* Magnetic Heart Pin Top Center */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff1493] to-[#ff85a2] border-2 border-white shadow-md flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-white text-xs"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          favorite
                        </span>
                      </div>

                      {/* Calendar Header */}
                      <div className="pt-space-xs flex flex-wrap items-start justify-between gap-space-sm border-b border-pink-100 pb-space-sm">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-[#ffe4ec] text-[#d81b60] font-label-sm text-[11px] font-bold tracking-wider uppercase border border-[#ffccd9]">
                              AGENDA OFFICIEL
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a8d]"></span>
                            <span className="font-label-sm text-label-sm text-[#735360] uppercase tracking-wider font-semibold">
                              PARIS STUDIO
                            </span>
                          </div>
                          <h2 className="font-display-lg text-headline-lg md:text-display-lg text-[#2a1322] leading-none mt-1 tracking-tighter">
                            OCTOBRE <span className="text-[#ff4a8d] italic font-light">2026</span>
                          </h2>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="px-space-sm py-1 rounded-full bg-[#fff0f5] text-[#b0004a] font-label-sm text-label-sm font-bold flex items-center gap-1 border border-[#ffb6c1] shadow-sm rotate-[-2deg]">
                            <span className="material-symbols-outlined text-sm text-[#ff4a8d]">calendar_today</span>
                            <span>Story Dispo Sync</span>
                          </div>
                          <span className="font-body-sm text-[11px] text-[#8e6b77] mt-1 font-semibold">
                            Clique sur un jour rose pour choisir
                          </span>
                        </div>
                      </div>

                      {/* Days of the week header */}
                      <div className="grid grid-cols-7 gap-1 mt-space-sm text-center">
                        <span className="font-label-sm text-label-sm uppercase text-[#885d6d] font-bold">LUN</span>
                        <span className="font-label-sm text-label-sm uppercase text-[#885d6d] font-bold">MAR</span>
                        <span className="font-label-sm text-label-sm uppercase text-[#885d6d] font-bold">MER</span>
                        <span className="font-label-sm text-label-sm uppercase text-[#885d6d] font-bold">JEU</span>
                        <span className="font-label-sm text-label-sm uppercase text-[#885d6d] font-bold">VEN</span>
                        <span className="font-label-sm text-label-sm uppercase text-[#885d6d] font-bold">SAM</span>
                        <span className="font-label-sm text-label-sm uppercase text-[#885d6d] font-bold">DIM</span>
                      </div>

                      {/* Calendar Interactive Grid */}
                      <div className="grid grid-cols-7 gap-1.5 mt-space-xs" id="calendar-grid">
                        {OCTOBER_DAYS.map((dayItem, idx) => {
                          const isSelected = dayItem.dateStr === selectedDate;

                          if (dayItem.status === 'adjacent') {
                            return (
                              <div
                                key={idx}
                                className="aspect-square p-1 rounded-sm bg-[#f9f3f6]/40 text-[#a5919a] flex flex-col justify-between opacity-40 border border-transparent"
                              >
                                <span className="font-label-sm text-[10px]">{dayItem.day}</span>
                              </div>
                            );
                          }

                          if (dayItem.status === 'full') {
                            return (
                              <div
                                key={idx}
                                className="aspect-square p-1 rounded-sm bg-[#f2ecf0] text-[#a5919a] flex flex-col justify-between border border-[#e5dce2] opacity-50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-label-sm text-[10px] font-bold text-[#8c6776]">
                                    {dayItem.day}
                                  </span>
                                </div>
                                <div className="my-auto text-center">
                                  <span className="px-1 py-0.5 rounded-sm bg-white/70 font-body-sm text-[9px] text-[#a5919a] font-bold block">
                                    Complet
                                  </span>
                                </div>
                              </div>
                            );
                          }

                          if (dayItem.status === 'off' || dayItem.status === 'closed') {
                            return (
                              <div
                                key={idx}
                                className="aspect-square p-1 rounded-sm bg-[#f2ecf0] text-[#a5919a] flex flex-col justify-between border border-[#e5dce2] opacity-50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-label-sm text-[10px] font-bold text-[#8c6776]">
                                    {dayItem.day}
                                  </span>
                                </div>
                                <div className="my-auto text-center">
                                  <span className="px-1 py-0.5 rounded-sm bg-white/70 font-body-sm text-[9px] text-[#a5919a] font-semibold block">
                                    {dayItem.status === 'closed' ? 'Fermé' : 'Off'}
                                  </span>
                                </div>
                              </div>
                            );
                          }

                          // Available Day
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectDay(dayItem)}
                              className={`cal-day-btn text-left aspect-square p-1 rounded-sm transition-all shadow-sm flex flex-col justify-between group cursor-pointer focus:outline-none ${
                                isSelected
                                  ? 'bg-[#ff4a8d] text-white shadow-md border-2 border-white ring-2 ring-[#ff4a8d]'
                                  : 'bg-[#ffe3ec] hover:bg-[#ff4a8d] hover:text-white border border-[#ffb9cd]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className={`font-label-sm text-[10px] font-bold ${
                                    isSelected ? 'text-white' : 'group-hover:text-white text-[#b0004a]'
                                  }`}
                                >
                                  {dayItem.day}
                                </span>
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isSelected
                                      ? 'bg-white animate-pulse'
                                      : 'bg-[#ff4a8d] group-hover:bg-white animate-ping'
                                  }`}
                                ></span>
                              </div>
                              <div className="flex flex-col gap-0.5 w-full mt-0.5">
                                {(dayItem.defaultSlots || ['10h00', '14h00']).slice(0, 3).map((slotStr, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className={`px-1 py-0.2 rounded-sm text-[9px] font-bold text-center border ${
                                      isSelected
                                        ? 'bg-white/30 text-white border-white/40'
                                        : 'bg-white/90 group-hover:bg-white/20 text-[#6b1e39] group-hover:text-white border-white/60'
                                    }`}
                                  >
                                    {slotStr}
                                  </span>
                                ))}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Interactive Slot Selector Strip */}
                      <div className="mt-space-md p-space-sm rounded-xl bg-[#fff0f5] border-2 border-white shadow-inner flex flex-col sm:flex-row items-center justify-between gap-space-sm">
                        <div>
                          <span className="font-label-sm text-[11px] text-[#7d3b52] uppercase tracking-wider block font-bold">
                            Date sélectionnée :
                          </span>
                          <span
                            className="font-headline-sm text-headline-sm text-[#ba005b] font-extrabold"
                            id="display-selected-date"
                          >
                            {selectedDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap" id="slot-pills-container">
                          <span className="font-label-sm text-[10px] text-[#7d3b52] uppercase font-bold tracking-wider mr-1">
                            Créneaux :
                          </span>
                          {currentSlots.map((slot) => {
                            const formatted = slot.endsWith('h') ? slot + '00' : slot;
                            const isActive = selectedHour === formatted;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedHour(formatted)}
                                className={`slot-pill px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-all font-bold cursor-pointer ${
                                  isActive
                                    ? 'bg-[#ff4a8d] text-white shadow-md ring-2 ring-white'
                                    : 'bg-white text-[#2a1322] shadow-sm hover:bg-[#ff4a8d] hover:text-white border border-[#ffccd9]'
                                }`}
                              >
                                {formatted}
                              </button>
                            );
                          })}
                          {currentFullSlot && (
                            <span className="px-2 py-1 rounded-full bg-[#f1e5ea] text-[#9c7886] line-through font-label-sm text-xs opacity-60">
                              {currentFullSlot} (Complet)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* POLAROID STICKERS & STUDIO RULES POST-IT (Arranged on locker) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md items-start">
                      {/* Sticky Note: Studio Rules */}
                      <div className="relative p-space-md rounded-xl bg-[#fff9a6] text-[#2c2202] shadow-[0_10px_20px_rgba(0,0,0,0.2)] rotate-[-2deg] hover:rotate-0 transition-transform border border-[#f4eb78]">
                        {/* Push Pin */}
                        <div className="absolute -top-2.5 right-4 w-5 h-5 rounded-full bg-[#ff0055] border-2 border-white shadow-md flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="material-symbols-outlined text-base text-[#b3003b]">push_pin</span>
                          <span className="font-label-sm text-[11px] uppercase tracking-wider font-black text-[#990033]">
                            Règles du Studio
                          </span>
                        </div>
                        <ul className="font-body-sm text-[11px] leading-snug space-y-1.5 text-[#3b3200] font-medium">
                          <li className="flex items-start gap-1">
                            <span className="text-[#d81b60] font-bold">♥</span>
                            <span>
                              <strong>Solo babe only :</strong> pas d'accompagnateur/trice.
                            </span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-[#d81b60] font-bold">♥</span>
                            <span>
                              <strong>0€ acompte :</strong> confiance mutuelle.
                            </span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-[#d81b60] font-bold">♥</span>
                            <span>
                              <strong>Dépose :</strong> +5€ si set extérieur.
                            </span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-[#d81b60] font-bold">♥</span>
                            <span>15 min retard max toléré.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Polaroid 2 with Red Ribbon Pin inspired by Image 5 (from screenshot) */}
                      <div className="relative bg-white p-3 pb-4 rounded-sm shadow-2xl border border-neutral-200 transform rotate-[2deg] hover:rotate-0 transition-transform max-w-[210px] mx-auto sm:mx-0">
                        {/* Pink Pin with Red Bow */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                          <div className="w-5 h-5 rounded-full bg-[#ff0066] border-2 border-white shadow-md flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          </div>
                          {/* Red Satin Ribbon Bow */}
                          <div className="text-[#e6004c] text-lg -mt-1 leading-none select-none drop-shadow">🎀</div>
                        </div>

                        {/* Polaroid Photo Image */}
                        <div className="overflow-hidden rounded bg-pink-100 aspect-[3/4] relative mt-2 border border-pink-200">
                          <img
                            alt="Jake Locker Polaroid"
                            className="w-full h-full object-cover select-none"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPUvfOquh_ev3FUm1DlDCl1xjB70lk2gzrAfzT0xjbowvH2Lj2vLHtE7o6EZcJsGgHZ8qvBZNvfspsJKsi135YZNv90vvuxoPSiMWRFFbD9C5QsxjpMW_uoPhTmo5bJSGysRPtvDHx6pL7joAqp_6nJxdw3hFrkUkTtDHNpHDYQ3xgOf1eunJr9g1xHzxZNZbFLJ-1wfzpPKeUCUF39FD802AOVK0exea8uzuU2PtJCzNaCyYTACqz"
                          />
                          <div className="absolute inset-0 bg-pink-500/10 pointer-events-none"></div>
                        </div>

                        {/* Handwritten Polaroid Bottom */}
                        <div className="mt-2 text-center">
                          <p className="font-marker text-xs text-[#2a1322]">Jake ♡</p>
                          <p className="font-mono text-[8px] text-[#ff0066] uppercase tracking-wider">
                            VIP INSPIRATION BOARD
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN (Cols 8-12): SCATTERED STICKER BOOKING CANVAS */}
                  <div className="lg:col-span-5 flex flex-col gap-space-md">
                    {/* Locker Magnetic Oval Mirror Badge with Soa's avatar */}
                    <div className="relative w-full rounded-2xl bg-white/95 p-3 shadow-lg border-2 border-white rotate-[1deg]">
                      {/* Washi Tape */}
                      <div className="absolute -top-2.5 left-1/3 w-20 h-5 washi-tape rounded opacity-90 border-t border-b border-white/50"></div>
                      <div className="flex items-center justify-between gap-space-sm">
                        <div className="flex items-center gap-space-sm">
                          <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff4a8d] to-[#ffb6c1] p-0.5 shadow-md">
                            <img
                              alt="Soa Nails Artist Avatar"
                              className="w-full h-full object-contain drop-shadow select-none"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeMKwLYnZQ4ko4cVpgrfTs1Dk_vfOsFd3M3q8XZCNqYQZl4FAtYXAecxq7HQJWpnpPKPi848tPmEzVxoLWgu1iNzeyQPsjBowXBAZ7qk6Uby5v6HkPL6roqUYKCFbn1PjwHn4-drMrxDWYPg3XupBgV5amzoEzxpdd0E7hDAFL4bqqO6S5SwSUGGJ7BzLfKQv7OhHHbetDr8Y0GOFdHJcDz3Ci-nz8AjSX_6Hr4WBDRnfK2J0xL_fz"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#ff0066] border border-white flex items-center justify-center text-[10px] text-white">
                              💖
                            </div>
                          </div>
                          <div>
                            <span className="font-headline-sm text-base text-[#360c17] leading-tight block uppercase font-bold tracking-wide">
                              Soa te répond 💬
                            </span>
                            <span className="font-body-sm text-[12px] text-[#8c3554] block font-medium">
                              "Coucou ma go ! On fait quoi aujourd'hui ?"
                            </span>
                          </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-end">
                          <span className="font-label-sm text-[9px] text-[#9c5970] uppercase font-bold">
                            Compte Officiel
                          </span>
                          <a
                            className="font-label-md text-label-md text-[#ff0066] hover:underline font-bold"
                            href="https://www.instagram.com/nailsbysoa"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            @nailsbysoa
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* STICKER SCATTERED RESERVATION FORM */}
                    <form className="flex flex-col gap-space-md" id="booking-form" onSubmit={handleSubmitBooking}>
                      {/* SECTION 1: PRESTATION DIE-CUT STICKERS */}
                      <div className="relative rounded-2xl bg-white/90 backdrop-blur-md p-space-md shadow-lg border-3 border-white rotate-[-0.8deg]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">✨</span>
                            <label className="font-label-sm text-xs uppercase tracking-wider text-[#7a2043] font-black">
                              1. Choix de la Prestation
                            </label>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#ffe4ec] text-[#d81b60] font-label-sm text-[10px] font-bold">
                            Étape 1/3
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* Die-Cut Prestation Sticker 1 */}
                          <label
                            className={`prestation-sticker group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-all hover:scale-[1.02] rotate-[-1deg] min-h-[92px] ${
                              selectedPrestation === 'Gel-X Sur-Mesure (30€-50€)'
                                ? 'bg-gradient-to-br from-[#ffe4ec] to-[#ffb6cb] border-[#ff4a8d] ring-2 ring-[#ff4a8d] shadow-[0_6px_16px_rgba(255,74,141,0.4)]'
                                : 'bg-gradient-to-br from-[#ffffff] to-[#fff0f5]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-headline-sm text-sm sm:text-base text-[#360c17] font-bold leading-snug">
                                Gel-X Complet
                              </span>
                              <input
                                checked={selectedPrestation === 'Gel-X Sur-Mesure (30€-50€)'}
                                onChange={() => setSelectedPrestation('Gel-X Sur-Mesure (30€-50€)')}
                                className="accent-[#ff4a8d] w-4 h-4 cursor-pointer shrink-0"
                                name="prestation"
                                type="radio"
                                value="Gel-X Sur-Mesure (30€-50€)"
                              />
                            </div>
                            <div className="mt-1.5 flex flex-col gap-0.5">
                              <span className="font-label-sm text-xs sm:text-sm text-[#d81b60] font-extrabold tracking-wide">
                                30€ — 50€
                              </span>
                              <span className="font-body-sm text-[11px] sm:text-xs text-[#735360] leading-tight">
                                Capsules américaines + nail art
                              </span>
                            </div>
                          </label>

                          {/* Die-Cut Prestation Sticker 2 */}
                          <label
                            className={`prestation-sticker group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-all hover:scale-[1.02] rotate-[1deg] min-h-[92px] ${
                              selectedPrestation === 'Gainage Ongles Naturels (25€-40€)'
                                ? 'bg-gradient-to-br from-[#ffe4ec] to-[#ffb6cb] border-[#ff4a8d] ring-2 ring-[#ff4a8d] shadow-[0_6px_16px_rgba(255,74,141,0.4)]'
                                : 'bg-gradient-to-br from-[#ffffff] to-[#fff0f5]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-headline-sm text-sm sm:text-base text-[#360c17] font-bold leading-snug">
                                Gainage Ongles
                              </span>
                              <input
                                checked={selectedPrestation === 'Gainage Ongles Naturels (25€-40€)'}
                                onChange={() => setSelectedPrestation('Gainage Ongles Naturels (25€-40€)')}
                                className="accent-[#ff4a8d] w-4 h-4 cursor-pointer shrink-0"
                                name="prestation"
                                type="radio"
                                value="Gainage Ongles Naturels (25€-40€)"
                              />
                            </div>
                            <div className="mt-1.5 flex flex-col gap-0.5">
                              <span className="font-label-sm text-xs sm:text-sm text-[#d81b60] font-extrabold tracking-wide">
                                25€ — 40€
                              </span>
                              <span className="font-body-sm text-[11px] sm:text-xs text-[#735360] leading-tight">
                                Renfort gel/rubber naturel
                              </span>
                            </div>
                          </label>

                          {/* Die-Cut Prestation Sticker 3 */}
                          <label
                            className={`prestation-sticker group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-all hover:scale-[1.02] rotate-[-0.8deg] min-h-[92px] ${
                              selectedPrestation === 'Pose Découverte (35€)'
                                ? 'bg-gradient-to-br from-[#ffe4ec] to-[#ffb6cb] border-[#ff4a8d] ring-2 ring-[#ff4a8d] shadow-[0_6px_16px_rgba(255,74,141,0.4)]'
                                : 'bg-gradient-to-br from-[#ffffff] to-[#fff0f5]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-headline-sm text-sm sm:text-base text-[#360c17] font-bold leading-snug">
                                Pose Découverte
                              </span>
                              <input
                                checked={selectedPrestation === 'Pose Découverte (35€)'}
                                onChange={() => setSelectedPrestation('Pose Découverte (35€)')}
                                className="accent-[#ff4a8d] w-4 h-4 cursor-pointer shrink-0"
                                name="prestation"
                                type="radio"
                                value="Pose Découverte (35€)"
                              />
                            </div>
                            <div className="mt-1.5 flex flex-col gap-0.5">
                              <span className="font-label-sm text-xs sm:text-sm text-[#d81b60] font-extrabold tracking-wide">
                                35€ Fixe
                              </span>
                              <span className="font-body-sm text-[11px] sm:text-xs text-[#735360] leading-tight">
                                Idéal 1er rendez-vous
                              </span>
                            </div>
                          </label>

                          {/* Die-Cut Prestation Sticker 4 (Dépose Option) */}
                          <label
                            className={`prestation-sticker group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] cursor-pointer transition-all hover:scale-[1.02] rotate-[1.2deg] min-h-[92px] ${
                              hasDepose
                                ? 'bg-gradient-to-br from-[#ffe4ec] to-[#ffb6cb] border-[#ff4a8d] ring-2 ring-[#ff4a8d] shadow-[0_6px_16px_rgba(255,74,141,0.4)]'
                                : 'bg-gradient-to-br from-[#ffffff] to-[#fff0f5]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-headline-sm text-sm sm:text-base text-[#360c17] font-bold leading-snug">
                                Option Dépose
                              </span>
                              <input
                                checked={hasDepose}
                                onChange={(e) => setHasDepose(e.target.checked)}
                                className="accent-[#ff4a8d] w-4 h-4 cursor-pointer shrink-0"
                                id="depose-checkbox"
                                name="depose"
                                type="checkbox"
                                value="Oui (+5€)"
                              />
                            </div>
                            <div className="mt-1.5 flex flex-col gap-0.5">
                              <span className="font-label-sm text-xs sm:text-sm text-[#b5179e] font-extrabold tracking-wide">
                                +5€
                              </span>
                              <span className="font-body-sm text-[11px] sm:text-xs text-[#735360] leading-tight">
                                Ancien set extérieur
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* SECTION 2: CRÉNEAU SÉLECTIONNÉ LABEL MAKER TAPE */}
                      <div className="relative rounded-2xl bg-white/90 backdrop-blur-md p-3.5 shadow-md border-3 border-white rotate-[1.2deg]">
                        <label className="font-label-sm text-xs uppercase tracking-wider text-[#7a2043] font-black block mb-1">
                          2. Créneau Sélectionné
                        </label>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#fff0f5] border border-[#ffb6cb]">
                          <span className="material-symbols-outlined text-[#ff4a8d] text-lg">alarm</span>
                          <input
                            className="bg-transparent text-[#2a1322] font-label-md text-sm focus:outline-none w-full cursor-default font-extrabold"
                            id="summary-slot-input"
                            readOnly
                            type="text"
                            value={`${selectedDate} à ${selectedHour}`}
                          />
                          <span className="font-label-sm text-[9px] text-[#b0004a] uppercase whitespace-nowrap bg-white px-2 py-0.5 rounded-full border border-pink-200">
                            Via Agenda
                          </span>
                        </div>
                      </div>

                      {/* SECTION 3: POLAROID INSPIRATION PHOTO UPLOAD */}
                      <div className="relative rounded-2xl bg-white/90 backdrop-blur-md p-space-md shadow-lg border-3 border-white rotate-[-1deg]">
                        {/* Washi tape at top */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5 washi-tape rounded opacity-90 border-t border-b border-white/50"></div>
                        <label className="font-label-sm text-xs uppercase tracking-wider text-[#7a2043] font-black block mb-2">
                          3. Inspiration Nail Art
                        </label>
                        <div
                          className="relative group rounded-xl bg-[#fff2f7] border-2 border-dashed border-[#ff85a2] p-4 text-center cursor-pointer hover:bg-[#ffe6ef] transition-colors"
                          id="drop-zone"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            id="photo-upload-input"
                            type="file"
                            onChange={handleFileChange}
                          />
                          {!hasUploadedCustom ? (
                            <div
                              className="flex flex-col items-center justify-center gap-1 pointer-events-none"
                              id="upload-placeholder"
                            >
                              <div className="w-10 h-10 rounded-full bg-white text-[#ff4a8d] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
                              </div>
                              <span className="font-label-md text-xs text-[#ba005b] font-bold">
                                Uploader mon modèle d'inspiration
                              </span>
                              <span className="font-body-sm text-[11px] text-[#735360]">
                                Polaroid, screenshot Pinterest, capture TikTok
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-3 pointer-events-none" id="upload-preview">
                              <div className="w-12 h-12 rounded-lg bg-white p-0.5 shadow border border-pink-200 overflow-hidden">
                                <img
                                  alt="Aperçu Inspiration Nail Art"
                                  className="w-full h-full object-cover"
                                  id="preview-img"
                                  src={previewUrl}
                                />
                              </div>
                              <div className="text-left">
                                <span className="font-label-sm text-xs text-[#2a1322] font-bold block" id="file-name-text">
                                  {fileName}
                                </span>
                                <span className="font-body-sm text-[11px] text-[#ff0066] font-semibold">
                                  Prêt à être envoyé en DM !
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* SECTION 4: PSEUDO INSTAGRAM MEMO STICKER & PUFFY CTA */}
                      <div className="relative rounded-2xl bg-white/95 p-space-md shadow-xl border-3 border-white rotate-[0.5deg]">
                        <label
                          className="font-label-sm text-xs uppercase tracking-wider text-[#7a2043] font-black block mb-1.5"
                          htmlFor="insta-input"
                        >
                          4. Ton Pseudo Instagram
                        </label>
                        <div className="relative flex items-center mb-2.5">
                          <span className="absolute left-3.5 font-label-md text-sm text-[#ff4a8d] font-bold">@</span>
                          <input
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#fff0f5] text-[#2a1322] font-label-md text-sm placeholder:text-[#a07484] focus:outline-none focus:ring-2 focus:ring-[#ff4a8d] border border-[#ffb6cb]"
                            id="insta-input"
                            placeholder="tonpseudo"
                            type="text"
                            value={instaHandle}
                            onChange={(e) => setInstaHandle(e.target.value)}
                          />
                        </div>

                        {/* Explanation Post-it strip */}
                        <div className="p-2.5 rounded-xl bg-[#ffeaf2] text-[#6b1e39] flex items-start gap-2 mb-3 border border-[#ffccd9]">
                          <span className="material-symbols-outlined text-[#ff0066] text-base mt-0.5">info</span>
                          <p className="font-body-sm text-[11px] leading-relaxed">
                            <strong className="text-[#ff0066]">Pourquoi Instagram DM ?</strong> Pour valider ta
                            longueur, ajuster tes strass sans stress et te laisser la liberté de modifier ton set
                            jusqu'au jour J !
                          </p>
                        </div>

                        {/* EMBOSSED PUFFY 3D BUTTON CTA */}
                        <button
                          className="puffy-btn w-full py-3.5 px-space-md rounded-full bg-gradient-to-r from-[#ff0077] via-[#ff4a8d] to-[#ff0077] text-white font-label-lg text-sm sm:text-base uppercase tracking-wider border-2 border-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer rotate-[-1deg]"
                          id="submit-booking-btn"
                          type="submit"
                          disabled={isLoading}
                        >
                          <span className="text-lg">💖</span>
                          <span className="font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                            {isLoading
                              ? 'RÉSERVATION EN COURS...'
                              : 'ENVOYER MA DEMANDE EN DM INSTAGRAM ✨'}
                          </span>
                        </button>

                        <a
                          className="mt-2 w-full py-2 rounded-full text-center text-[#ff0066] hover:bg-[#fff0f5] font-label-sm text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1 font-bold"
                          href="https://www.instagram.com/nailsbysoa"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          <span>Voir le profil @nailsbysoa en direct</span>
                        </a>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Locker Bottom Badge Bar */}
                <div className="mt-space-md pt-space-sm flex flex-wrap items-center justify-center gap-space-sm text-center">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-[#360c17] font-label-sm text-xs border border-white shadow-sm rotate-[1deg]">
                    <span className="material-symbols-outlined text-sm text-[#ff0066]">map</span>
                    <span>STUDIO SITUÉ À PARIS (FRANCE)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingLockerView;
