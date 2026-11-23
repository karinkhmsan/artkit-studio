"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Brush, Heart, Moon, Sun } from "lucide-react";
import { DonateDialog } from "@/components/donate-dialog";
import { getCopy, infoIds, infoLabelKey, toolIds, type Language, type ToolId } from "@/lib/content";

type StudioContextValue = {
  language: Language;
  activeTool: ToolId;
  setActiveTool: (tool: ToolId) => void;
};

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) throw new Error("useStudio must be used within StudioShell");
  return context;
}

export function StudioShell({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTool, setActiveTool] = useState<ToolId>("timer");
  const [donateOpen, setDonateOpen] = useState(false);
  const donateOpener = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const copy = getCopy(language);

  // Remember which button opened the dialog so focus can return to it.
  function openDonate(event: React.MouseEvent<HTMLElement>) {
    donateOpener.current = event.currentTarget;
    setDonateOpen(true);
  }

  useEffect(() => {
    try {
      if (localStorage.getItem("artkit-language") === "th") setLanguage("th");
      if (localStorage.getItem("artkit-theme") === "light") setTheme("light");
    } catch { /* Storage can be unavailable in private browsing. */ }
  }, []);

  function updateLanguage(next: Language) {
    setLanguage(next);
    document.documentElement.lang = next;
    try { localStorage.setItem("artkit-language", next); } catch { /* Storage is optional. */ }
  }

  function updateTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("artkit-theme", next); } catch { /* Storage is optional. */ }
  }

  function selectTool(tool: ToolId) {
    setActiveTool(tool);
    if (pathname !== "/") router.push("/");
  }

  return (
    <StudioContext.Provider value={{ language, activeTool, setActiveTool: selectTool }}>
      <div className="site-shell">
        <header className="site-header">
          <div className="header-inner page-width">
            <Link href="/" className="brand" aria-label="ArtKit Studio home">
              <span className="brand-mark"><Brush size={19} strokeWidth={2.3} aria-hidden="true" /></span>
              <span>artkit<span className="brand-dot">.</span><span className="brand-studio">studio</span></span>
            </Link>

            <nav className="top-nav" aria-label={copy.navLabel}>
              {toolIds.map((tool) => (
                <button key={tool} type="button" onClick={() => selectTool(tool)}
                  className={`nav-tab ${pathname === "/" && activeTool === tool ? "is-active" : ""}`}
                  aria-current={pathname === "/" && activeTool === tool ? "page" : undefined}
                  title={copy[`${tool}Full`]}
                >{copy[tool]}</button>
              ))}
            </nav>

            <div className="header-actions">
              <div className="language-switch" role="group" aria-label={copy.languageLabel}>
                <button type="button" onClick={() => updateLanguage("en")} className={language === "en" ? "chosen" : ""} aria-pressed={language === "en"}>EN</button>
                <span aria-hidden="true">/</span>
                <button type="button" onClick={() => updateLanguage("th")} className={language === "th" ? "chosen" : ""} aria-pressed={language === "th"}>TH</button>
              </div>
              <button type="button" className="support-button" onClick={openDonate} aria-label={copy.donate.buttonLabel} title={copy.donate.buttonLabel}>
                <Heart size={18} aria-hidden="true" /><span>{copy.donate.button}</span>
              </button>
              <span className="header-divider" aria-hidden="true" />
              <button type="button" className="theme-button" onClick={updateTheme} aria-label={theme === "dark" ? copy.lightMode : copy.darkMode} title={theme === "dark" ? copy.lightMode : copy.darkMode}>
                {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </header>

        <main id="main-content">{children}</main>

        <footer className="site-footer">
          <div className="page-width footer-grid">
            <div className="footer-brand-block">
              <Link href="/" className="brand footer-brand"><span className="brand-mark"><Brush size={18} strokeWidth={2.3} aria-hidden="true" /></span><span>artkit<span className="brand-dot">.</span><span className="brand-studio">studio</span></span></Link>
              <p>{copy.footerDescription}</p>
            </div>
            <div className="footer-links"><h2>{copy.footerNav}</h2>{toolIds.map((tool) => <button key={tool} type="button" onClick={() => selectTool(tool)}>{copy[`${tool}Full`]}</button>)}</div>
            <div className="footer-links"><h2>{copy.footerLegal}</h2>{infoIds.map((id) => <Link key={id} href={`/${id}`}>{copy[infoLabelKey[id]]} <ArrowUpRight size={13} aria-hidden="true" /></Link>)}<button type="button" onClick={openDonate}><Heart size={15} aria-hidden="true" />{copy.donate.footerLink}</button></div>
          </div>
          <div className="page-width footer-bottom"><span>© {new Date().getFullYear()} ArtKit Studio. {copy.copyright}</span><span>{copy.footerNote} ✳</span></div>
        </footer>
        <DonateDialog copy={copy.donate} open={donateOpen} onClose={() => setDonateOpen(false)} returnFocusRef={donateOpener} />
      </div>
    </StudioContext.Provider>
  );
}