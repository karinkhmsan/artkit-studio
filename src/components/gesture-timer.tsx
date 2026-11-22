"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward, Volume2, VolumeX } from "lucide-react";
import { ReferencePicker } from "@/components/reference-picker";
import { ReferenceView } from "@/components/reference-view";
import { ChipGroup, isTyping } from "@/components/tool-ui";
import { playChime, primeAudio } from "@/lib/audio";
import type { Language } from "@/lib/content";
import type { RefImage } from "@/lib/reference";
import { getToolCopy } from "@/lib/tool-copy";

const LENGTHS = [30, 60, 120, 300, 600];
const POSE_COUNTS = [5, 10, 20, 30];
const RING = 2 * Math.PI * 90; // circle length for r = 90

function format(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function GestureTimer({ language, active }: { language: Language; active: boolean }) {
  const t = getToolCopy(language).timer;
  const [length, setLength] = useState(60);
  const [totalPoses, setTotalPoses] = useState(10);
  const [pose, setPose] = useState(1);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [custom, setCustom] = useState("");
  const [images, setImages] = useState<RefImage[]>([]); // reference pictures, one per pose
  const endAt = useRef(0); // time when the current pose ends
  const warned = useRef(false); // 5-second warning already played?

  const reset = useCallback((seconds = length) => {
    setRunning(false);
    setDone(false);
    setPose(1);
    setRemaining(seconds);
    warned.current = false;
  }, [length]);

  // Go to the next pose, or finish the session.
  const advance = useCallback(() => {
    warned.current = false;
    if (pose >= totalPoses) {
      setRunning(false);
      setDone(true);
      setRemaining(0);
      return;
    }
    setPose(pose + 1);
    setRemaining(length);
    endAt.current = Date.now() + length * 1000;
  }, [pose, totalPoses, length]);

  // The clock. It reads the real time, so it stays accurate in background tabs.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.ceil((endAt.current - Date.now()) / 1000);
      if (left > 0) {
        setRemaining(left);
        if (left <= 5 && length > 5 && !warned.current) {
          warned.current = true;
          if (!muted) playChime("warn");
        }
        return;
      }
      if (!muted) playChime("end");
      advance();
    }, 200);
    return () => clearInterval(id);
  }, [running, muted, length, advance]);

  function start() {
    primeAudio();
    const left = done ? length : remaining;
    if (done) reset();
    endAt.current = Date.now() + left * 1000;
    setRunning(true);
  }

  function toggle() {
    if (running) setRunning(false);
    else start();
  }

  function pickLength(seconds: number) {
    setLength(seconds);
    reset(seconds);
  }

  function applyCustom() {
    const n = Math.round(Number(custom));
    if (n >= 5 && n <= 3600) pickLength(n);
  }

  // Keyboard shortcuts (only while this tool is visible).
  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const onButton = (e.target as HTMLElement).tagName === "BUTTON";
      const key = e.key.toLowerCase();
      if (e.key === " " && !onButton) { e.preventDefault(); toggle(); }
      else if (key === "n" && !done) advance();
      else if (key === "r") reset();
      else if (key === "m") setMuted((m) => !m);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const image = images.length ? images[(pose - 1) % images.length] : null;
  const warning = running && remaining <= 5 && length > 5;
  const offset = RING * (1 - remaining / length);

  return (
    <div className={`timer-tool ${image ? "has-reference" : ""}`}>
      {image && <ReferenceView image={image} preload={images[pose % images.length]} language={language} />}
      <div className="timer-stage">
        <div className={`timer-dial ${warning ? "is-warning" : ""} ${running ? "is-running" : ""}`}>
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <circle className="dial-track" cx="100" cy="100" r="90" />
            <circle
              className="dial-progress" cx="100" cy="100" r="90"
              strokeDasharray={RING} strokeDashoffset={done ? RING : offset}
              style={{ transition: remaining === length ? "none" : undefined }}
            />
          </svg>
          <div className="dial-center" role="timer" aria-live="off">
            <strong>{done ? "0:00" : format(remaining)}</strong>
            <span>{done ? t.done : t.poseOf(pose, totalPoses)}</span>
          </div>
        </div>

        <div className="pose-dots" aria-hidden="true">
          {Array.from({ length: totalPoses }, (_, i) => (
            <span key={i} className={i + 1 < pose || done ? "is-done" : i + 1 === pose ? "is-current" : ""} />
          ))}
        </div>

        <div className="timer-controls">
          <button type="button" className="tool-btn primary" onClick={toggle}>
            {running ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
            {running ? t.pause : done ? t.again : remaining < length ? t.resume : t.start}
          </button>
          <button type="button" className="tool-btn icon" onClick={advance} disabled={done} title={t.next} aria-label={t.next}><SkipForward size={17} aria-hidden="true" /></button>
          <button type="button" className="tool-btn icon" onClick={() => reset()} title={t.reset} aria-label={t.reset}><RotateCcw size={17} aria-hidden="true" /></button>
          <button type="button" className="tool-btn icon" onClick={() => setMuted(!muted)} aria-pressed={muted} title={muted ? t.unmute : t.mute} aria-label={muted ? t.unmute : t.mute}>
            {muted ? <VolumeX size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="timer-settings">
        <ChipGroup
          label={t.length}
          value={String(length)}
          onChange={(id) => pickLength(Number(id))}
          options={LENGTHS.map((s) => ({ id: String(s), label: s < 60 ? `${s}${t.sec}` : `${s / 60}${t.min}` }))}
        />
        <div className="field">
          <label className="field-label" htmlFor="custom-length">{t.custom}</label>
          <div className="inline-field">
            <input
              id="custom-length" className="text-input" type="number" min={5} max={3600} inputMode="numeric"
              placeholder="90" value={custom} onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyCustom(); }}
            />
            <button type="button" className="tool-btn" onClick={applyCustom}>{t.apply}</button>
          </div>
        </div>
        <ChipGroup
          label={t.poses}
          value={String(totalPoses)}
          onChange={(id) => { setTotalPoses(Number(id)); reset(); }}
          options={POSE_COUNTS.map((n) => ({ id: String(n), label: String(n) }))}
        />
        <ReferencePicker language={language} onChange={setImages} />
        <p className="shortcut-hint">{t.shortcuts}</p>
      </div>
    </div>
  );
}
