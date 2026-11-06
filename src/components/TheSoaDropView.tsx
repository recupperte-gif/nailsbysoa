import React, { useState } from 'react';

interface TheSoaDropViewProps {
  onNavigate: (view: 'screensaver' | 'corkboard' | 'booking' | 'the-soa-drop') => void;
  onOpenConsultation?: (conceptPreset?: string) => void;
}

export const TheSoaDropView: React.FC<TheSoaDropViewProps> = ({
  onNavigate,
}) => {
  // VIP Pass Interactive State
  const [clientPseudo, setClientPseudo] = useState('CHLOÉ MCBLING');
  const [clientEmail, setClientEmail] = useState('chloe@studio-liege.com');
  const [gdprConsent, setGdprConsent] = useState(true);
  const [liveSerial, setLiveSerial] = useState('#SOA-8829-VIP');
  const [isGeneratingPass, setIsGeneratingPass] = useState(false);
  const [statusToast, setStatusToast] = useState<{
    show: boolean;
    message: string;
    aiNote?: string;
  }>({
    show: false,
    message: 'Pass Digital activé avec succès pour le Drop 001 !',
  });

  // Handle Pass Generation with Backend & Gemini
  const handleGeneratePass = async () => {
    setIsGeneratingPass(true);
    try {
      const res = await fetch('/api/vip-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudo: clientPseudo,
          email: clientEmail,
        }),
      });

      const data = await res.json();
      if (res.ok && data.serial) {
        setLiveSerial(data.serial);
        setStatusToast({
          show: true,
          message: `Pass VIP ${data.serial} activé avec succès !`,
          aiNote: data.aiWelcomeNote,
        });
      } else {
        const fallbackSerial = `#SOA-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
        setLiveSerial(fallbackSerial);
        setStatusToast({
          show: true,
          message: `Pass VIP ${fallbackSerial} activé avec succès !`,
        });
      }
    } catch {
      const fallbackSerial = `#SOA-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
      setLiveSerial(fallbackSerial);
      setStatusToast({
        show: true,
        message: `Pass VIP ${fallbackSerial} activé !`,
      });
    } finally {
      setIsGeneratingPass(false);
      setTimeout(() => {
        setStatusToast((prev) => ({ ...prev, show: false }));
      }, 6000);
    }
  };

  // Reset Pass Simulator
  const handleResetPass = () => {
    setClientPseudo('CHLOÉ MCBLING');
    setClientEmail('chloe@studio-liege.com');
    setLiveSerial('#SOA-8829-VIP');
    setStatusToast({ show: false, message: '' });
  };

  const displayName = clientPseudo.trim().length > 0 ? clientPseudo.toUpperCase() : 'SOA VIP QUEEN';

  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary selection:text-white min-h-screen">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant/60 shadow-[0_4px_20px_rgba(255,0,127,0.05)]">
        <div className="h-20 w-full px-margin md:px-margin-lg flex items-center justify-between gap-space-md max-w-7xl mx-auto">
          <div className="flex items-center gap-space-md">
            <div
              className="flex items-center gap-space-xs cursor-pointer group"
              onClick={() => onNavigate('screensaver')}
              title="Afficher l'écran de veille DVD"
            >
              <span className="material-symbols-outlined text-primary-container text-2xl drop-shadow-[0_2px_8px_rgba(255,0,127,0.4)] group-hover:scale-110 transition-transform">
                auto_awesome
              </span>
              <div className="flex flex-col">
                <span className="font-headline-sm text-lg font-bold text-on-surface uppercase tracking-tight">
                  NBS NAILS
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
                  Nails By Soa // The Soa Drop
                </span>
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant">
              <span className="font-label-sm text-[11px] text-primary font-bold tracking-wider uppercase">
                MCBLING VIP CLUB
              </span>
              <span
                className="material-symbols-outlined text-primary text-xs"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-2 bg-surface-container-low px-2 py-1.5 rounded-full border border-outline-variant/50">
            <button
              type="button"
              onClick={() => onNavigate('corkboard')}
              className="font-label-md text-xs text-on-surface-variant hover:text-primary transition-colors px-4 py-2 rounded-full uppercase font-bold cursor-pointer"
            >
              Accueil / Liège
            </button>
            <button
              type="button"
              aria-current="page"
              className="transition-all uppercase bg-primary-container text-white font-label-md text-xs rounded-full px-4 py-2 shadow-[0_4px_16px_rgba(255,0,127,0.35)] font-bold flex items-center gap-1 cursor-default"
            >
              <span className="material-symbols-outlined text-xs">sparkles</span>
              The SOA Drop
            </button>
            <a
              className="font-label-md text-xs text-on-surface-variant hover:text-primary transition-colors px-4 py-2 rounded-full uppercase font-bold cursor-pointer"
              href="#passForm"
            >
              Carte VIP
            </a>
            <button
              type="button"
              onClick={() => onNavigate('corkboard')}
              className="font-label-md text-xs text-on-surface-variant hover:text-primary transition-colors px-4 py-2 rounded-full uppercase font-bold cursor-pointer"
            >
              Prestations
            </button>
            <button
              type="button"
              onClick={() => onNavigate('booking')}
              className="font-label-md text-xs text-on-surface-variant hover:text-primary transition-colors px-4 py-2 rounded-full uppercase font-bold cursor-pointer"
            >
              Réservation
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-space-md">
            {/* Mobile quick navigation buttons */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={() => onNavigate('corkboard')}
                className="font-label-md text-[11px] px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant text-on-surface font-bold uppercase cursor-pointer hover:text-primary transition"
              >
                Liège
              </button>
              <button
                type="button"
                onClick={() => onNavigate('booking')}
                className="font-label-md text-[11px] px-2.5 py-1 rounded-full bg-primary-container text-white font-bold uppercase cursor-pointer shadow-sm hover:opacity-90 transition"
              >
                Réserver
              </button>
            </div>

            <a
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container hover:bg-primary-container hover:text-white transition-all shadow-sm font-bold text-xs uppercase cursor-pointer"
              href="https://instagram.com/nailsbysoa"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              <span>@nailsbysoa</span>
            </a>
            <div className="flex items-center gap-2 pl-1">
              <img
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-container/30 shadow-md select-none"
                src="https://lh3.googleusercontent.com/aida/ALJJyrBCQC-vffueuQdJPIz828oIdB29oHTfofwDiQ1hOXWBCXgPMCzw9R6-zc_5e0LFrqmyU_LlVk0JP3kZCBmIlZwxFMLLcASkNCP_TkOO7vkRFyavKU_eOLdOyWNe8u7DtfhgFryK1P2gKJgYvXPk0iQEtuQpEAkmUIs0OlsgR8yMGNq1G1UhOISSYP0eK-PisJHPd5lxdQv1GKDgPbcX_xwutyJzoDhzZSfdXN0gdJg88LiUTCG4vwEL--4"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="w-full pt-20 bg-background overflow-hidden">
        {/* SUBHEADER TICKER */}
        <div className="w-full bg-surface-container-low border-b border-outline-variant/60 px-margin py-2 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-label-md tracking-wider">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-container text-white text-[11px] font-bold">
                <span className="material-symbols-outlined text-xs">auto_awesome</span> DROP 001 LIVE
              </span>
              <span className="text-on-surface-variant font-medium hidden sm:inline">
                CAPSULE PRESS-ON NAILS // LIÈGE &amp; PARIS STUDIO
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span className="text-on-surface-variant text-[11px] font-normal ml-1">Édition Limitée</span>
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="relative w-full px-margin md:px-margin-lg py-16 md:py-24 bg-gradient-to-b from-white via-surface-container-low to-background overflow-hidden">
          {/* Glow Gradients */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-surface-container-highest/60 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
            {/* Cute Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-outline-variant shadow-[0_4px_16px_rgba(255,0,127,0.12)] mb-6">
              <span className="material-symbols-outlined text-primary-container text-sm">sparkles</span>
              <span className="font-label-md text-xs text-primary font-bold tracking-widest uppercase">
                MCBLING VIP EXPERIENCE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              <span className="font-body-sm text-xs text-on-surface-variant font-semibold">Liège Studio</span>
            </div>

            <h1 className="font-headline-lg text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-on-surface uppercase drop-shadow-sm">
              THE SOA{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary to-pink-500">
                DROP
              </span>{' '}
              ✦
            </h1>

            <p className="font-headline-sm text-lg md:text-2xl text-on-surface font-bold mt-4 max-w-2xl leading-snug">
              L'expérience exclusive : du feed Instagram aux ongles d'exception
            </p>

            <p className="font-body-md text-base md:text-lg text-on-surface-variant max-w-2xl mt-3 leading-relaxed">
              Quand la haute onglerie McBling Y2K fusionne avec la collection digitale VIP. Accédez en avant-première aux
              capsules de press-on nails les plus exclusives du studio.
            </p>

            {/* Stats Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mt-10">
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-outline-variant/60 shadow-sm">
                <span className="font-headline-md text-2xl font-bold text-primary-container">06</span>
                <span className="font-label-sm text-xs text-on-surface-variant font-semibold uppercase mt-0.5">
                  Étapes Fluides
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-outline-variant/60 shadow-sm">
                <span className="font-headline-md text-2xl font-bold text-primary">100%</span>
                <span className="font-label-sm text-xs text-on-surface-variant font-semibold uppercase mt-0.5">
                  RGPD &amp; Privé
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-outline-variant/60 shadow-sm">
                <span className="font-headline-md text-2xl font-bold text-primary-container">#01</span>
                <span className="font-label-sm text-xs text-on-surface-variant font-semibold uppercase mt-0.5">
                  Pass Digital VIP
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-outline-variant/60 shadow-sm">
                <span className="font-headline-md text-2xl font-bold text-primary">FLASH</span>
                <span className="font-label-sm text-xs text-on-surface-variant font-semibold uppercase mt-0.5">
                  Accès Prioritaire
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: THE 6-STEP CUSTOMER JOURNEY */}
        <section className="w-full px-margin md:px-margin-lg py-16 bg-white border-y border-outline-variant/50 relative">
          <div className="max-w-6xl mx-auto flex flex-col gap-12">
            {/* Section Header */}
            <div className="text-center flex flex-col items-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-xs font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-sm">favorite</span> LE PARCOURS DIGITAL SOA
              </div>
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface uppercase font-bold tracking-tight">
                COMMENT ÇA FONCTIONNE ?
              </h2>
              <p className="font-body-md text-sm md:text-base text-on-surface-variant mt-2">
                Une expérience ultra-simple en 6 étapes pour rejoindre le club privé, débloquer votre badge et obtenir
                vos capsules personnalisées.
              </p>
            </div>

            {/* 6 Clean Y2K Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Étape 01 */}
              <div className="flex flex-col rounded-3xl bg-surface-container-low p-6 border border-outline-variant hover:border-primary-container hover:shadow-[0_8px_28px_rgba(255,0,127,0.12)] transition-all relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-primary-container font-headline-sm font-bold text-sm shadow-sm border border-outline-variant/60">
                    01
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white text-primary-container text-[11px] font-bold uppercase tracking-wider border border-outline-variant/40">
                    Teaser Instagram
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface uppercase font-bold mb-2">
                  DISCOVER THE DROP
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  Elle découvre l'annonce de la nouvelle collection capsule ultra-limitée directement sur Instagram (
                  <strong className="text-primary font-bold">@nailsbysoa</strong>).
                </p>
                <div className="mt-5 pt-4 border-t border-outline-variant/50 flex items-center gap-2 text-xs font-semibold text-primary">
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                  <span>Reels &amp; Story Swipe-Up direct</span>
                </div>
              </div>

              {/* Étape 02 */}
              <div className="flex flex-col rounded-3xl bg-surface-container-low p-6 border border-outline-variant hover:border-primary-container hover:shadow-[0_8px_28px_rgba(255,0,127,0.12)] transition-all relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-primary-container font-headline-sm font-bold text-sm shadow-sm border border-outline-variant/60">
                    02
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white text-primary text-[11px] font-bold uppercase tracking-wider border border-outline-variant/40">
                    1 Clic Rapide
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface uppercase font-bold mb-2">
                  SIGN UP &amp; CLUB SOA
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  Elle s'inscrit au club VIP de la communauté Nails By Soa simplement avec son e-mail ou pseudo, sans
                  aucun mot de passe complexe ni portefeuille.
                </p>
                <div className="mt-5 pt-4 border-t border-outline-variant/50 flex items-center gap-2 text-xs font-semibold text-primary">
                  <span className="material-symbols-outlined text-base">mail</span>
                  <span>Inscription instantanée en 15s</span>
                </div>
              </div>

              {/* Étape 03 */}
              <div className="flex flex-col rounded-3xl bg-surface-container-low p-6 border border-outline-variant hover:border-primary-container hover:shadow-[0_8px_28px_rgba(255,0,127,0.12)] transition-all relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-primary-container font-headline-sm font-bold text-sm shadow-sm border border-outline-variant/60">
                    03
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white text-secondary text-[11px] font-bold uppercase tracking-wider border border-outline-variant/40">
                    Transparence
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface uppercase font-bold mb-2">
                  GIVE GDPR CONSENT
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  Elle valide son consentement en toute sécurité. Vos données restent strictement confidentielles et ne
                  sont jamais revendues.
                </p>
                <div className="mt-5 pt-4 border-t border-outline-variant/50 flex items-center gap-2 text-xs font-semibold text-primary">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span>100% conforme RGPD &amp; chiffré</span>
                </div>
              </div>

              {/* Étape 04 */}
              <div className="flex flex-col rounded-3xl bg-surface-container-low p-6 border border-primary-container/40 bg-gradient-to-b from-surface-container-low to-secondary-container/40 shadow-sm hover:shadow-[0_8px_28px_rgba(255,0,127,0.15)] transition-all relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-primary-container text-white font-headline-sm font-bold text-sm shadow-md">
                    04
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary-container text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    Pass Membre VIP
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface uppercase font-bold mb-2">
                  UNLOCK YOUR PASS
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  Sa carte de membre virtuelle rose chromée est générée immédiatement : prête pour son Apple Wallet ou
                  Google Wallet avec matricule VIP exclusif.
                </p>
                <div className="mt-5 pt-4 border-t border-outline-variant/50 flex items-center gap-2 text-xs font-semibold text-primary-container">
                  <span className="material-symbols-outlined text-base">contactless</span>
                  <span>Badge VIP digital nominatif</span>
                </div>
              </div>

              {/* Étape 05 */}
              <div className="flex flex-col rounded-3xl bg-surface-container-low p-6 border border-outline-variant hover:border-primary-container hover:shadow-[0_8px_28px_rgba(255,0,127,0.12)] transition-all relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-primary-container font-headline-sm font-bold text-sm shadow-sm border border-outline-variant/60">
                    05
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white text-primary text-[11px] font-bold uppercase tracking-wider border border-outline-variant/40">
                    Avantages VIP
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface uppercase font-bold mb-2">
                  ENJOY THE BENEFITS
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  Accès prioritaire avant tout le monde aux créneaux de pose, prix réservés aux membres, et participation
                  au vote pour les futurs coloris et capsules.
                </p>
                <div className="mt-5 pt-4 border-t border-outline-variant/50 flex items-center gap-2 text-xs font-semibold text-primary">
                  <span className="material-symbols-outlined text-base">stars</span>
                  <span>Créneaux flash &amp; drops privés</span>
                </div>
              </div>

              {/* Étape 06 */}
              <div className="flex flex-col rounded-3xl bg-surface-container-low p-6 border border-outline-variant hover:border-primary-container hover:shadow-[0_8px_28px_rgba(255,0,127,0.12)] transition-all relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-primary-container font-headline-sm font-bold text-sm shadow-sm border border-outline-variant/60">
                    06
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white text-primary-container text-[11px] font-bold uppercase tracking-wider border border-outline-variant/40">
                    Souvenir Digital
                  </span>
                </div>
                <h3 className="font-headline-md text-lg text-on-surface uppercase font-bold mb-2">
                  RECEIVE A COLLECTIBLE
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  Après son rendez-vous au studio ou la réception de son set, elle reçoit sa carte à collectionner
                  virtuelle holographique dédiée au drop.
                </p>
                <div className="mt-5 pt-4 border-t border-outline-variant/50 flex items-center gap-2 text-xs font-semibold text-primary">
                  <span className="material-symbols-outlined text-base">loyalty</span>
                  <span>3 drops collectionnés = kit offert</span>
                </div>
              </div>
            </div>

            {/* 3 Collectibles Mini Showcase */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-surface-container via-surface-container-low to-secondary-container border border-outline-variant/80 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col max-w-md">
                <span className="font-label-md text-xs text-primary font-bold uppercase tracking-wider">
                  COLLECTION PREVIEW
                </span>
                <h4 className="font-headline-sm text-xl text-on-surface uppercase font-bold mt-1">
                  Exemples de Collectibles Débloqués
                </h4>
                <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Chaque drop est associé à un design iconique de Soa. Collectionnez-les pour gravir les échelons du club
                  VIP.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md relative group">
                  <img
                    alt="Collectible 01"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform select-none"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxh92NHoNH3ujtk4DuSJFmVyBJoToAUyYXigLqTKLeDLPXAp6rYMXvlKVV5FSoiWskvb70FK-f5eCc6qioeF9try5Ws-iZ2lUP0VQETNaBCDGZ7Q-qE33UDsT3A99Kjey4wG1CfyIPnykMjRyzdG6W9N6ETRor9Mv-yuiRa-Myw0SNZYwoMkgeZ7p9HY9ZyF1VAvzb4PqurS6GgtDWHUyPBC0ibe6knnDyc1tCYjLJN_zIceaR_wq6"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-primary-container/90 text-white text-[9px] font-bold text-center py-0.5">
                    CHROME
                  </span>
                </div>
                <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-primary-container shadow-lg relative group -translate-y-1">
                  <img
                    alt="Collectible 02"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform select-none"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuABzQhA0VtLj8vMjDvldOUUFRWTJ0fen4rihElsTJ-xGnzY8cE4JDQtrRuEv1YNxmJsG2xDjzkaqum7oCCbAxiMug2okiGG972TaGUZ-miLmn1NtrgT1jmY3YV9ZhbomiZvqzWReFwLZemxj8DgdZ0yh-Deumx5yQekdTHLdiwZcQHbpYYE-6R9j56TaX-CLET0PLF3mKYN_sDbYxNmZjGY8rMgNHglyAPlb3q7wTNWvCUkX3of3gnQ"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-primary-container text-white text-[10px] font-bold text-center py-0.5">
                    RHINESTONE
                  </span>
                </div>
                <div className="w-20 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md relative group">
                  <img
                    alt="Collectible 03"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform select-none"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk7wZCUpWauj1KdJC-mGoXCNYlAjxiZtwnPCnEn8oBfKV-F9NVpOojgel66s2G-TK_gL6S1Y5oFA1hHR3ok4XF7ZSpzQbvcyFHNTxLqr-Ia8K433z3nMOSV06vks0ZuuL58moHJx599kwo6pvRubkp_NvAzgehjQ_A_IDMdhCZzymV5A6tXrHpBUZoucKbafgYcJCIUW_AJdvARUHGqQKpLfBHDdV2MXwH5CwkeHb_GV4aAdniW4vQ"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-primary-container/90 text-white text-[9px] font-bold text-center py-0.5">
                    STARRY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: VIP PASS SHOWCASE & QUICK SIGN-UP */}
        <section className="w-full px-margin md:px-margin-lg py-16 md:py-24 bg-surface-container-low/60 relative" id="passForm">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
            {/* Left: Quick Sign-up Form */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-outline-variant w-fit shadow-sm">
                <span className="material-symbols-outlined text-primary-container text-sm">flash_on</span>
                <span className="font-label-md text-xs text-primary font-bold uppercase tracking-wider">
                  ACTIVATION IMMÉDIATE
                </span>
              </div>
              <div>
                <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface uppercase font-bold tracking-tight">
                  OBTENEZ VOTRE CARTE VIP SOA
                </h2>
                <p className="font-body-md text-on-surface-variant text-base mt-2 leading-relaxed">
                  Inscrivez-vous en quelques secondes pour débloquer votre Pass nominatif et réserver vos créations avant
                  l'ouverture publique.
                </p>
              </div>

              <form
                className="flex flex-col gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-[0_8px_30px_rgba(255,0,127,0.06)]"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGeneratePass();
                }}
              >
                {/* Name Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-xs text-on-surface uppercase font-bold" htmlFor="clientPseudo">
                    Nom complet ou pseudo Instagram
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-3 pl-11 rounded-2xl bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                      id="clientPseudo"
                      placeholder="ex: @chloe_mcbling"
                      type="text"
                      value={clientPseudo}
                      onChange={(e) => setClientPseudo(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant text-lg">
                      person
                    </span>
                  </div>
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-xs text-on-surface uppercase font-bold" htmlFor="clientEmail">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-3 pl-11 rounded-2xl bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                      id="clientEmail"
                      placeholder="votre.email@domain.com"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant text-lg">
                      mail
                    </span>
                  </div>
                </div>

                {/* GDPR Checkbox */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/40 mt-1">
                  <input
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-primary-container focus:ring-primary-container accent-primary-container cursor-pointer"
                    id="gdprConsent"
                    type="checkbox"
                  />
                  <label
                    className="font-body-sm text-xs text-on-surface-variant cursor-pointer leading-normal"
                    htmlFor="gdprConsent"
                  >
                    <strong className="text-on-surface font-semibold">Respect RGPD :</strong> J'accepte de recevoir mon
                    Pass Digital et les invitations drops exclusifs Nails By Soa.
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    className="flex-1 py-3.5 px-6 rounded-full bg-primary-container hover:bg-pink-600 text-white font-label-md text-xs uppercase tracking-wider font-bold shadow-[0_4px_20px_rgba(255,0,127,0.35)] hover:shadow-[0_6px_24px_rgba(255,0,127,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    id="generatePassBtn"
                    type="submit"
                    disabled={isGeneratingPass}
                  >
                    <span className="material-symbols-outlined text-sm">sparkles</span>
                    <span>{isGeneratingPass ? 'ACTIVATION...' : 'DÉBLOQUER MON PASS VIP'}</span>
                  </button>
                  <button
                    className="py-3 px-5 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface-variant font-label-md text-xs uppercase font-bold transition-all cursor-pointer"
                    id="resetPassBtn"
                    type="button"
                    onClick={handleResetPass}
                  >
                    Réinitialiser
                  </button>
                </div>

                {/* Status Toast */}
                {statusToast.show && (
                  <div
                    className="p-3 rounded-2xl bg-secondary-container text-on-secondary-container font-label-sm text-xs flex flex-col gap-1 border border-primary-container/30 transition-all"
                    id="statusToast"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-container text-base">check_circle</span>
                      <span className="font-bold">{statusToast.message}</span>
                    </div>
                    {statusToast.aiNote && (
                      <p className="font-sans text-[11px] text-[#522643] italic pl-6 leading-relaxed">
                        "{statusToast.aiNote}"
                      </p>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Right: VIP Card Mockup */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              {/* Metallic Glossy Y2K Pink Card */}
              <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-tr from-[#ff007f] via-[#ff479a] to-[#ffb0c9] p-7 shadow-[0_16px_40px_rgba(255,0,127,0.28)] border-2 border-white/60 overflow-hidden aspect-[16/10] flex flex-col justify-between text-white transition-all duration-300 hover:scale-[1.02]">
                {/* Glass Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none"></div>
                <div className="absolute -right-8 -top-8 w-44 h-44 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute top-3 right-6 text-3xl font-display-hero opacity-50 select-none">✦ ✦</div>

                {/* Top Row */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="font-label-sm text-[11px] tracking-widest uppercase opacity-90 font-bold">
                      STUDIO LIÈGE x PARIS
                    </span>
                    <h3 className="font-headline-sm text-base font-extrabold tracking-wider">NAILS BY SOA</h3>
                  </div>
                  {/* Gold Chip */}
                  <div className="w-11 h-8 rounded-lg bg-amber-100 border border-amber-300 shadow-inner flex flex-col justify-center gap-1 p-1">
                    <div className="w-full h-1 bg-amber-500/50 rounded-full"></div>
                    <div className="w-3/4 h-1 bg-amber-500/50 rounded-full"></div>
                  </div>
                </div>

                {/* Center Logo */}
                <div className="my-auto z-10 flex flex-col items-center py-2">
                  <span className="font-headline-lg text-4xl italic tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] font-black">
                    SOA✦
                  </span>
                  <span className="font-label-md text-[11px] tracking-widest uppercase text-white/95 font-bold mt-0.5">
                    VIP MEMBERSHIP PASS
                  </span>
                </div>

                {/* Bottom Row */}
                <div className="flex justify-between items-end z-10 pt-1">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] uppercase opacity-85 font-medium">MEMBRE PRIVILÈGE</span>
                    <span
                      className="font-label-md text-sm font-black uppercase tracking-wider text-white truncate max-w-[200px]"
                      id="liveCardHolder"
                    >
                      {displayName}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-label-sm text-[10px] text-white/90 font-mono font-bold" id="liveSerial">
                      {liveSerial}
                    </span>
                    {/* Barcode */}
                    <div className="flex items-center gap-0.5 h-5 bg-white/90 px-1.5 py-0.5 rounded mt-1">
                      <span className="w-0.5 h-full bg-black"></span>
                      <span className="w-1 h-full bg-black"></span>
                      <span className="w-0.5 h-full bg-black"></span>
                      <span className="w-1.5 h-full bg-black"></span>
                      <span className="w-0.5 h-full bg-black"></span>
                      <span className="w-1 h-full bg-black"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Bullets Under Card */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-on-surface-variant font-label-sm text-xs">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-primary-container text-sm">check_circle</span>
                  Accès prioritaire 24h avant
                </span>
                <span className="text-outline">•</span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-primary-container text-sm">phone_iphone</span>
                  Compatible Apple Wallet
                </span>
                <span className="text-outline">•</span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-primary-container text-sm">qr_code_2</span>
                  Scan Desk au salon
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: CALL TO ACTION */}
        <section className="w-full px-margin md:px-margin-lg py-16 bg-white border-t border-outline-variant/60 flex flex-col items-center text-center">
          <div className="max-w-3xl flex flex-col items-center gap-4">
            <span className="px-4 py-1.5 rounded-full bg-surface-container-high text-primary font-label-md text-xs uppercase font-bold tracking-widest">
              PROCHAIN DROP TRÈS BIENTÔT
            </span>
            <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface uppercase font-bold tracking-tight">
              PRÊTE POUR LA PROCHAINE CAPSULE ?
            </h2>
            <p className="font-body-md text-base text-on-surface-variant max-w-xl">
              Rejoignez la communauté exclusive de Liège et recevez vos alertes privées pour ne manquer aucun drop de
              faux ongles de luxe.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => onNavigate('booking')}
                className="px-8 py-3.5 rounded-full bg-primary-container hover:bg-pink-600 text-white font-label-md text-xs uppercase tracking-wider font-bold shadow-[0_4px_20px_rgba(255,0,127,0.35)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>RÉSERVER MON CRÉNEAU VIP</span>
              </button>
              <a
                className="px-6 py-3.5 rounded-full bg-white border border-outline-variant hover:border-primary-container text-on-surface font-label-md text-xs uppercase font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                href="https://instagram.com/nailsbysoa"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-sm text-primary">favorite</span>
                <span>SUIVRE @NAILSBYSOA</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/60 py-10">
        <div className="max-w-7xl mx-auto px-margin md:px-margin-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-base text-primary font-extrabold uppercase">NAILS BY SOA</span>
              <span className="text-xs text-on-surface-variant font-medium">✦ Liège, Belgique</span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Haute Onglerie, Press-on Nails &amp; Expérience VIP McBling
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('corkboard')}
              className="font-label-md text-xs px-3 py-1 rounded-full bg-white border border-outline-variant text-on-surface font-semibold hover:border-primary transition cursor-pointer"
            >
              VELOUR MCBLING 2000s
            </button>
            <span className="font-label-md text-xs px-3 py-1 rounded-full bg-primary-container text-white font-bold">
              THE SOA DROP
            </span>
          </div>
          <div className="font-body-sm text-xs text-on-surface-variant text-center md:text-right">
            © 2024 Nails By Soa. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TheSoaDropView;
