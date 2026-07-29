import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, ChevronRight, ArrowRight, Star, Printer,
  Smartphone, Monitor, Package, Mail, Phone, MapPin,
  Instagram, Send, ShoppingCart, Eye, Layers, Cpu,
  Zap, Shield, Award, ChevronDown, Facebook, MessageCircle
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/Nexo_Desk_logo.png";
import brandImg from "@/imports/Nexo_Desk.png";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "home" | "loja" | "portfolio" | "sobre" | "contato";
type FilterCat = "todos" | "celulares" | "tablets" | "organizadores" | "home-office";

// ─── Custom Hook: Scroll Reveal ───────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const products = [
  { id: 1, name: "Suporte Vertical Celular", price: 29.90, category: "celulares", material: "PLA+", badge: "Mais Vendido", rating: 5, img: "https://images.unsplash.com/photo-1512499617640-c2f999ca3bde?w=500&h=500&fit=crop&auto=format" },
  { id: 2, name: "Holder Fone de Ouvido", price: 24.90, category: "celulares", material: "PETG", badge: null, rating: 5, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format" },
  { id: 3, name: "Suporte Carregador USB-C", price: 19.90, category: "celulares", material: "PLA+", badge: "Novo", rating: 4, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format" },
  { id: 4, name: "Suporte Tablet 10\"", price: 49.90, category: "tablets", material: "PETG", badge: "Destaque", rating: 5, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&auto=format" },
  { id: 5, name: "Suporte Tablet Ajustável", price: 59.90, category: "tablets", material: "ABS", badge: null, rating: 5, img: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&auto=format" },
  { id: 6, name: "Mesa Portátil de Leitura", price: 79.90, category: "tablets", material: "PLA+", badge: "Novo", rating: 4, img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=500&fit=crop&auto=format" },
  { id: 7, name: "Porta-Canetas Modular", price: 34.90, category: "organizadores", material: "PLA+", badge: null, rating: 5, img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&h=500&fit=crop&auto=format" },
  { id: 8, name: "Organizador de Cabos", price: 14.90, category: "organizadores", material: "TPU", badge: "Top 10", rating: 5, img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=500&fit=crop&auto=format" },
  { id: 9, name: "Bandeja Modular de Mesa", price: 44.90, category: "organizadores", material: "PETG", badge: null, rating: 4, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop&auto=format" },
  { id: 10, name: "Porta-Headset Lateral", price: 39.90, category: "home-office", material: "PLA+", badge: "Destaque", rating: 5, img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop&auto=format" },
  { id: 11, name: "Suporte Monitor Elevado", price: 89.90, category: "home-office", material: "ABS", badge: "Premium", rating: 5, img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=500&fit=crop&auto=format" },
  { id: 12, name: "Clipe Organizador de Webcam", price: 22.90, category: "home-office", material: "TPU", badge: "Novo", rating: 4, img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=500&fit=crop&auto=format" },
];

const portfolioItems = [
  { id: 1, title: "Suporte Minimalista iPhone", cat: "Celulares", img: "https://images.unsplash.com/photo-1512499617640-c2f999ca3bde?w=600&h=600&fit=crop&auto=format", tall: true },
  { id: 2, title: "Dock Station Completa", cat: "Home Office", img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop&auto=format", tall: false },
  { id: 3, title: "Organizador Hexagonal", cat: "Organizadores", img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop&auto=format", tall: false },
  { id: 4, title: "Stand Duplo para Tablets", cat: "Tablets", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop&auto=format", tall: true },
  { id: 5, title: "Sistema Porta-Cabos", cat: "Organizadores", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format", tall: false },
  { id: 6, title: "Suporte Headset Gamer", cat: "Home Office", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=400&fit=crop&auto=format", tall: false },
  { id: 7, title: "Painel Organização Total", cat: "Home Office", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=600&fit=crop&auto=format", tall: true },
  { id: 8, title: "Kit Suporte Celular Auto", cat: "Celulares", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format", tall: false },
];

const stats = [
  { value: "500+", label: "Produtos Entregues" },
  { value: "300+", label: "Clientes Satisfeitos" },
  { value: "4.9★", label: "Avaliação Média" },
  { value: "3", label: "Materiais Premium" },
];

const categories = [
  { key: "celulares", label: "Celulares", icon: Smartphone, desc: "Suportes, holders e acessórios para smartphones" },
  { key: "tablets", label: "Tablets", icon: Monitor, desc: "Stands ajustáveis e mesas portáteis" },
  { key: "organizadores", label: "Organizadores", icon: Package, desc: "Módulos e bandejas para mesa" },
  { key: "home-office", label: "Home Office", icon: Cpu, desc: "Suportes e acessórios para trabalho em casa" },
];

// ─── Shared Components ────────────────────────────────────────────────────────
function NeonButton({ children, onClick, variant = "primary", className = "" }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm tracking-widest uppercase
        transition-all duration-300 cursor-pointer
        ${variant === "primary"
          ? "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(255,106,0,0.6),0_0_40px_rgba(255,106,0,0.3)]"
          : "border border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_16px_rgba(255,106,0,0.4)]"
        }
        ${className}
      `}
      style={{ fontFamily: "'Orbitron', sans-serif" }}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px w-8 bg-primary" />
      <span
        className="text-primary text-xs tracking-[0.3em] uppercase"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {children}
      </span>
      <div className="h-px w-8 bg-primary" />
    </div>
  );
}

function SectionTitle({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <h2
      className={`text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight ${centered ? "text-center" : ""}`}
      style={{ fontFamily: "'Orbitron', sans-serif" }}
    >
      {children}
    </h2>
  );
}

// ─── Hero Background Grid ─────────────────────────────────────────────────────
function TechGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,106,0,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,106,0,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial fade */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, #080808 80%)",
        }}
      />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      {/* Scan line animation */}
      <div
        className="absolute left-0 right-0 h-px opacity-30"
        style={{
          background: "linear-gradient(90deg, transparent, #FF6A00 50%, transparent)",
          animation: "scanline 4s linear infinite",
        }}
      />
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary opacity-30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-primary opacity-30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-primary opacity-30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary opacity-30" />

      <style>{`
        @keyframes scanline {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(255,106,0,0.3); }
          50% { box-shadow: 0 0 25px rgba(255,106,0,0.7), 0 0 50px rgba(255,106,0,0.3); }
        }
        @keyframes neon-flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.8; }
          94% { opacity: 1; }
          96% { opacity: 0.9; }
          97% { opacity: 1; }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .neon-text {
          text-shadow: 0 0 10px rgba(255,106,0,0.8), 0 0 20px rgba(255,106,0,0.4), 0 0 40px rgba(255,106,0,0.2);
          animation: neon-flicker 8s infinite;
        }
        .neon-border {
          box-shadow: 0 0 0 1px rgba(255,106,0,0.3), 0 0 15px rgba(255,106,0,0.15);
        }
        .neon-border:hover {
          box-shadow: 0 0 0 1px rgba(255,106,0,0.7), 0 0 25px rgba(255,106,0,0.35), 0 0 50px rgba(255,106,0,0.15);
          transition: box-shadow 0.3s ease;
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(255,106,0,0.2), 0 0 0 1px rgba(255,106,0,0.3);
        }
        .floating {
          animation: float 4s ease-in-out infinite;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: rgba(255,106,0,0.4); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,106,0,0.7); }
      `}</style>
    </div>
  );
}

// ─── Reveal Wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks: { key: Page; label: string }[] = [
    { key: "home", label: "Início" },
    { key: "loja", label: "Loja" },
    { key: "portfolio", label: "Portfólio" },
    { key: "sobre", label: "Sobre" },
    { key: "contato", label: "Contato" },
  ];

  const goto = (p: Page) => {
    setPage(p);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => goto("home")} className="flex items-center gap-3 group">
            <img src={logoImg} alt="Nexo Desk" className="h-10 w-10 object-contain" />
            <span
              className="text-foreground font-bold text-lg tracking-widest group-hover:text-primary transition-colors"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              NEXO<span className="text-primary">DESK</span>
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button
                key={l.key}
                onClick={() => goto(l.key)}
                className={`relative px-4 py-2 text-sm tracking-wider uppercase transition-colors cursor-pointer ${page === l.key ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
              >
                {l.label}
                {page === l.key && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                    style={{ boxShadow: "0 0 8px rgba(255,106,0,0.8)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Escondido no mobile via container div */}
            <div className="hidden md:block">
              <NeonButton onClick={() => goto("loja")} className="text-xs py-2 px-4">
                <ShoppingCart size={14} /> Loja
              </NeonButton>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-foreground p-2"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/98 backdrop-blur-xl border-b border-border"
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((l) => (
                <button
                  key={l.key}
                  onClick={() => goto(l.key)}
                  className={`text-left px-4 py-3 text-sm tracking-wider uppercase transition-colors border-b border-border/50 cursor-pointer ${page === l.key ? "text-primary" : "text-muted-foreground"
                    }`}
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const goto = (p: Page) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <TechGrid />

        {/* Glow orb */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,106,0,0.08) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel>Impressão 3D Premium</SectionLabel>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] mb-6"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Objetos do{" "}
              <span className="neon-text" style={{ color: "#FF6A00" }}>
                Futuro
              </span>{" "}
              <br />
              para o seu{" "}
              <span className="text-foreground/60">Presente</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 400 }}
            >
              Suportes, organizadores e acessórios impressos em 3D com precisão milimétrica.
              Desenvolvidos para celulares, tablets e home office.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <NeonButton onClick={() => goto("loja")} variant="primary">
                Ver Loja <ArrowRight size={16} />
              </NeonButton>
              <NeonButton onClick={() => goto("portfolio")} variant="outline">
                Portfólio <Eye size={16} />
              </NeonButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((s, i) => (
                <div key={i} className="text-left">
                  <div
                    className="text-2xl font-bold text-primary neon-text"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-xs text-muted-foreground tracking-wide mt-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div
              className="absolute inset-0 rounded-lg"
              style={{ background: "radial-gradient(circle at center, rgba(255,106,0,0.15) 0%, transparent 70%)" }}
            />
            <div className="relative floating neon-border rounded-lg overflow-hidden">
              <img
                src={brandImg}
                alt="Nexo Desk — setup premium com produtos impressos em 3D"
                className="w-full rounded-lg"
                style={{ filter: "brightness(0.9) contrast(1.05)" }}
              />
              {/* Corner tags */}
              <div
                className="absolute top-4 left-4 px-3 py-1 text-xs text-primary border border-primary/50 bg-background/80 backdrop-blur-sm"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                PLA+ / PETG / ABS
              </div>
              <div
                className="absolute bottom-4 right-4 px-3 py-1 text-xs text-primary border border-primary/50 bg-background/80 backdrop-blur-sm"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                0.2mm Layer
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={16} className="text-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <Reveal>
          <SectionLabel>Categorias</SectionLabel>
          <SectionTitle>O que fabricamos</SectionTitle>
          <p className="text-muted-foreground mt-4 mb-12 max-w-xl" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.1rem" }}>
            Cada peça é projetada digitalmente e impressa com alta precisão para encaixar perfeitamente no seu setup.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Reveal key={cat.key} delay={i * 0.1}>
              <button
                onClick={() => goto("loja")}
                className="group w-full text-left p-6 bg-card neon-border rounded-sm card-hover cursor-pointer"
              >
                <div
                  className="w-12 h-12 border border-primary/40 flex items-center justify-center mb-4 group-hover:border-primary transition-colors"
                  style={{ boxShadow: "0 0 10px rgba(255,106,0,0.1)" }}
                >
                  <cat.icon size={22} className="text-primary" />
                </div>
                <h3
                  className="text-foreground font-bold text-lg mb-2 group-hover:text-primary transition-colors"
                  style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem" }}
                >
                  {cat.label}
                </h3>
                <p
                  className="text-muted-foreground text-sm leading-relaxed"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {cat.desc}
                </p>
                <div className="mt-4 flex items-center gap-2 text-primary text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Ver produtos <ChevronRight size={12} />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <SectionLabel>Loja</SectionLabel>
              <SectionTitle>Mais Vendidos</SectionTitle>
            </div>
            <NeonButton onClick={() => goto("loja")} variant="outline">
              Ver Todos <ChevronRight size={14} />
            </NeonButton>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => p.badge).slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <ProductCard product={p} onBuy={() => goto("loja")} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <SectionLabel>Processo</SectionLabel>
          <SectionTitle centered>Como Funciona</SectionTitle>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Escolha o Produto", desc: "Selecione o item desejado da nossa loja ou entre em contato para um pedido personalizado.", icon: Package },
            { step: "02", title: "Impressão Precisa", desc: "Cada peça é impressa em 3D com materiais PLA+, PETG ou ABS com precisão de 0.2mm.", icon: Printer },
            { step: "03", title: "Entrega Garantida", desc: "Enviamos para todo o Brasil com embalagem segura e rastreamento em tempo real.", icon: Zap },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="relative p-8 bg-card neon-border rounded-sm">
                <div
                  className="text-5xl font-black mb-6 leading-none"
                  style={{ fontFamily: "'Orbitron', sans-serif", color: "rgba(255,106,0,0.12)" }}
                >
                  {s.step}
                </div>
                <s.icon size={28} className="text-primary mb-4" />
                <h3
                  className="text-foreground font-bold text-lg mb-3"
                  style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem" }}
                >
                  {s.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,106,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,106,0,1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <SectionLabel>Personalizado</SectionLabel>
            <h2
              className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Tem uma ideia?{" "}
              <span className="neon-text" style={{ color: "#FF6A00" }}>
                Fabricamos para você.
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Envie seu modelo 3D ou descreva o que precisa. Nossa equipe cuida de tudo, do design à entrega.
            </p>
            <NeonButton onClick={() => { setPage("contato"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              Fale Conosco <Send size={16} />
            </NeonButton>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onBuy }: { product: typeof products[0]; onBuy: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group bg-card rounded-sm overflow-hidden card-hover cursor-pointer neon-border"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onBuy}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.badge && (
          <div
            className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase text-primary-foreground bg-primary"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {product.badge}
          </div>
        )}
        <div
          className={`absolute inset-0 bg-primary/10 flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="border border-primary text-primary px-4 py-2 text-xs tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Ver Produto
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {Array(product.rating).fill(0).map((_, i) => (
            <Star key={i} size={10} fill="#FF6A00" className="text-primary" />
          ))}
        </div>
        <h3
          className="text-foreground text-sm font-semibold mb-1 leading-tight"
          style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
        >
          {product.name}
        </h3>
        <div
          className="text-[10px] text-muted-foreground mb-3 tracking-wide"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {product.material}
        </div>
        <div className="flex items-center justify-between">
          <span
            className="text-primary font-bold text-lg neon-text"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1rem" }}
          >
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          <button
            className="p-2 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={(e) => { e.stopPropagation(); onBuy(); }}
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LOJA PAGE ────────────────────────────────────────────────────────────────
function LojaPage({ setPage }: { setPage: (p: Page) => void }) {
  const [filter, setFilter] = useState<FilterCat>("todos");

  const filtered = filter === "todos" ? products : products.filter(p => p.category === filter);

  const filters: { key: FilterCat; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "celulares", label: "Celulares" },
    { key: "tablets", label: "Tablets" },
    { key: "organizadores", label: "Organizadores" },
    { key: "home-office", label: "Home Office" },
  ];

  return (
    <div className="pt-24 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        <TechGrid />
        <div className="relative z-10">
          <SectionLabel>Catálogo</SectionLabel>
          <SectionTitle>Nossa Loja</SectionTitle>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {products.length} produtos impressos em 3D com alta qualidade e precisão milimétrica.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap gap-3">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 text-sm tracking-widest uppercase transition-all cursor-pointer ${filter === f.key
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={p} onBuy={() => { setPage("contato"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <div className="mt-16 text-center border border-border p-10 neon-border">
          <p
            className="text-foreground text-xl font-bold mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1rem" }}
          >
            Não encontrou o que procura?
          </p>
          <p className="text-muted-foreground mb-6" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Fabricamos peças personalizadas. Envie sua ideia e receba um orçamento grátis.
          </p>
          <NeonButton onClick={() => { setPage("contato"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            Pedir Personalizado <Send size={14} />
          </NeonButton>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}

// ─── PORTFOLIO PAGE ───────────────────────────────────────────────────────────
function PortfolioPage({ setPage }: { setPage: (p: Page) => void }) {
  const [selected, setSelected] = useState<typeof portfolioItems[0] | null>(null);

  return (
    <div className="pt-24 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative overflow-hidden">
        <TechGrid />
        <div className="relative z-10">
          <SectionLabel>Trabalhos</SectionLabel>
          <SectionTitle>Portfólio</SectionTitle>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Uma seleção dos nossos projetos mais recentes. Cada peça conta uma história de precisão e design.
          </p>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {portfolioItems.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.07}>
              <div
                className="break-inside-avoid group relative overflow-hidden neon-border rounded-sm cursor-pointer card-hover"
                onClick={() => setSelected(item)}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div
                      className="text-[10px] text-primary tracking-widest uppercase mb-1"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {item.cat}
                    </div>
                    <h3
                      className="text-foreground font-bold"
                      style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem" }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="border border-primary text-primary p-2">
                      <Eye size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full neon-border rounded-sm overflow-hidden bg-card"
              onClick={e => e.stopPropagation()}
            >
              <img src={selected.img} alt={selected.title} className="w-full max-h-[70vh] object-cover" />
              <div className="p-6 flex items-start justify-between">
                <div>
                  <div className="text-xs text-primary tracking-widest uppercase mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {selected.cat}
                  </div>
                  <h3 className="text-foreground text-xl font-bold" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1rem" }}>
                    {selected.title}
                  </h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-1">
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="border border-border p-10 text-center neon-border">
          <SectionLabel>Personalizado</SectionLabel>
          <p className="text-foreground text-xl font-bold mb-3" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1rem" }}>
            Quer ver o seu projeto aqui?
          </p>
          <p className="text-muted-foreground mb-6" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Trabalhamos com projetos personalizados. Entre em contato e tire sua ideia do papel.
          </p>
          <NeonButton onClick={() => { setPage("contato"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            Solicitar Orçamento <ArrowRight size={14} />
          </NeonButton>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}

// ─── SOBRE PAGE ───────────────────────────────────────────────────────────────
function SobrePage({ setPage }: { setPage: (p: Page) => void }) {
  const specs = [
    { label: "Resolução de Camada", value: "0.05 – 0.3mm" },
    { label: "Materiais", value: "PLA+, PETG, ABS, TPU" },
    { label: "Volume Máx. Impressão", value: "300 × 300 × 400mm" },
    { label: "Tolerância Dimensional", value: "±0.1mm" },
    { label: "Acabamento", value: "Lixado, pintado, polido" },
    { label: "Prazo de Entrega", value: "3 – 7 dias úteis" },
  ];

  const values = [
    { icon: Zap, title: "Precisão", desc: "Tecnologia FDM de alta resolução para encaixes perfeitos." },
    { icon: Shield, title: "Qualidade", desc: "Filamentos certificados e controle rigoroso de qualidade." },
    { icon: Award, title: "Design", desc: "Modelos projetados por designers industriais especializados." },
    { icon: Layers, title: "Variedade", desc: "Mais de 10 materiais e dezenas de cores disponíveis." },
  ];

  return (
    <div className="pt-24 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <TechGrid />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>Nossa História</SectionLabel>
              <SectionTitle>Sobre a Nexo Desk</SectionTitle>
              <p className="text-muted-foreground mt-6 leading-relaxed text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                A Nexo Desk nasceu da paixão por tecnologia e design funcional. Fundada por entusiastas de fabricação digital,
                surgimos para preencher uma lacuna no mercado: acessórios para home office que combinam estética futurista com
                funcionalidade real.
              </p>
              <p className="text-muted-foreground mt-4 leading-relaxed text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Cada produto é cuidadosamente modelado em software 3D e impresso com equipamentos de última geração,
                garantindo peças que se encaixam perfeitamente no seu dia a dia.
              </p>
            </div>
            <div className="floating neon-border rounded-sm overflow-hidden">
              <img
                src={brandImg}
                alt="Ambiente Nexo Desk com produtos 3D"
                className="w-full object-cover"
                style={{ filter: "brightness(0.85)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Reveal className="text-center mb-12">
          <SectionLabel>Valores</SectionLabel>
          <SectionTitle centered>Por que nos escolher</SectionTitle>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-6 bg-card neon-border rounded-sm text-center">
                <div className="w-14 h-14 border border-primary/40 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-foreground font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem" }}>
                  {v.title}
                </h3>
                <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  {v.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Technical specs */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Reveal className="mb-12">
          <SectionLabel>Tecnologia</SectionLabel>
          <SectionTitle>Especificações Técnicas</SectionTitle>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {specs.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="flex items-center justify-between p-6 bg-card gap-6">
                <span
                  className="text-muted-foreground text-sm tracking-wide"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {s.label}
                </span>
                <span
                  className="text-primary font-bold text-sm"
                  style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.8rem" }}
                >
                  {s.value}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Stats banner */}
      <div className="bg-secondary/30 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.1} className="text-center">
                <div
                  className="text-4xl font-black neon-text mb-2"
                  style={{ fontFamily: "'Orbitron', sans-serif", color: "#FF6A00" }}
                >
                  {s.value}
                </div>
                <div className="text-muted-foreground text-sm tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {s.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}

// ─── CONTATO PAGE ─────────────────────────────────────────────────────────────
function ContatoPage({ setPage }: { setPage: (p: Page) => void }) {
  const [form, setForm] = useState({ nome: "", email: "", tipo: "produto", mensagem: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-24 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <TechGrid />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <SectionLabel>Contato</SectionLabel>
            <SectionTitle centered>Fale com a Nexo Desk</SectionTitle>
            <p className="text-muted-foreground mt-4 text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Tem um projeto em mente? Quer tirar dúvidas ou fazer um pedido personalizado? Estamos aqui para ajudar.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12">
        {/* Form */}
        <Reveal>
          <div className="bg-card p-8 neon-border rounded-sm">
            <h3
              className="text-foreground font-bold text-lg mb-6"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem" }}
            >
              Enviar Mensagem
            </h3>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div
                  className="w-16 h-16 border-2 border-primary flex items-center justify-center mx-auto mb-4"
                  style={{ boxShadow: "0 0 20px rgba(255,106,0,0.4)" }}
                >
                  <Send size={28} className="text-primary" />
                </div>
                <h3 className="text-foreground font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem" }}>
                  Mensagem Enviada!
                </h3>
                <p className="text-muted-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Retornaremos em até 24 horas úteis.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-primary text-sm hover:underline"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Enviar nova mensagem
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs text-muted-foreground tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nome}
                    onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                    className="w-full bg-input-background border border-border text-foreground px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-input-background border border-border text-foreground px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Assunto
                  </label>
                  <select
                    value={form.tipo}
                    onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                    className="w-full bg-input-background border border-border text-foreground px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    <option value="produto">Compra de produto</option>
                    <option value="personalizado">Pedido personalizado</option>
                    <option value="orcamento">Orçamento</option>
                    <option value="duvida">Dúvida técnica</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Mensagem
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.mensagem}
                    onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
                    className="w-full bg-input-background border border-border text-foreground px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors resize-none"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    placeholder="Descreva o que você precisa..."
                  />
                </div>
                <NeonButton className="w-full justify-center">
                  Enviar Mensagem <Send size={14} />
                </NeonButton>
              </form>
            )}
          </div>
        </Reveal>

        {/* Info */}
        <Reveal delay={0.15}>
          <div className="space-y-6">
            <div>
              <img src={logoImg} alt="Nexo Desk" className="h-16 object-contain mb-6" />
              <p className="text-muted-foreground text-lg leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Somos especializados em impressão 3D para acessórios de produtividade. Atendemos todo o Brasil
                com entrega expressa e qualidade garantida.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "E-mail", value: "contato@nexodesk.com.br" },
                { icon: Phone, label: "WhatsApp", value: "(79) 9 8136-7115" },
                { icon: MapPin, label: "Localização", value: "Aracaju — SE, Brasil" },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-card neon-border rounded-sm">
                  <div className="w-10 h-10 border border-primary/40 flex items-center justify-center flex-shrink-0">
                    <c.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground tracking-widest uppercase mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {c.label}
                    </div>
                    <div className="text-foreground text-sm" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                      {c.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Redes Sociais
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, label: "@nexodesk", href: "https://www.instagram.com/nexo.desk/" },
                  { icon: Facebook, label: "Nexo Desk", href: "https://www.facebook.com/nexodesk" },
                  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/5579981367115" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all text-sm"
                    style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
                  >
                    <s.icon size={15} />
                    <span className="hidden sm:block">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Horário */}
            <div className="p-5 bg-card neon-border rounded-sm">
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Horário de Atendimento
              </p>
              <div className="space-y-1">
                {[
                  ["Seg – Sex", "07:30 – 17:30"],
                  ["Sab – Dom", "Fechado"],

                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{day}</span>
                    <span className="text-foreground font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }: { setPage: (p: Page) => void }) {
  const goto = (p: Page) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logoImg} alt="Nexo Desk" className="h-10 w-10 object-contain" />
            <span
              className="text-foreground font-bold tracking-widest"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.9rem" }}
            >
              NEXO<span className="text-primary">DESK</span>
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Impressão 3D de alta precisão para celulares, tablets, organizadores e home office.
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Páginas
          </p>
          <div className="flex flex-col gap-2">
            {(["home", "loja", "portfolio", "sobre", "contato"] as Page[]).map(p => (
              <button
                key={p}
                onClick={() => goto(p)}
                className="text-left text-sm text-muted-foreground hover:text-primary transition-colors capitalize cursor-pointer"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
              >
                {p === "home" ? "Início" : p === "loja" ? "Loja" : p === "portfolio" ? "Portfólio" : p === "sobre" ? "Sobre" : "Contato"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Materiais
          </p>
          <div className="flex flex-col gap-2">
            {["PLA+", "PETG", "ABS", "TPU", "Resin"].map(m => (
              <span key={m} className="text-sm text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                — {m}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border px-6 py-5 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          © 2026 Nexo Desk — Todos os direitos reservados
        </span>
        <span className="text-xs text-muted-foreground/50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Impressão 3D · FDM · SE, Brasil
        </span>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      <Nav page={page} setPage={setPage} />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {page === "home" && <HomePage setPage={setPage} />}
          {page === "loja" && <LojaPage setPage={setPage} />}
          {page === "portfolio" && <PortfolioPage setPage={setPage} />}
          {page === "sobre" && <SobrePage setPage={setPage} />}
          {page === "contato" && <ContatoPage setPage={setPage} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
