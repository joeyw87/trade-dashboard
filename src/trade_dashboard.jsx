import { useState, useEffect } from "react";

// ════════════════════════════════════════════════════════
//  1. 테마 & 색상
// ════════════════════════════════════════════════════════

const THEME = {
  dark: {
    bg: "#070d14",
    header: "#0a1622",
    panel: "#0d1a27",
    panelAlt: "#0a1018",
    border: "#1a2d42",
    accent: "#00d4ff",
    green: "#26c96f",
    red: "#ef4444",
    text: "#c8e0f0",
    muted: "#4a7a9b",
    yellow: "#f0b429",
    selected: "#112030",
    scrollTrack: "#0f1923",
    scrollThumb: "#1e3a5a",
    inputBg: "#0a1622",
    inputBorder: "#1e3a5a",
    shimmer1: "#0d1a27",
    shimmer2: "#162436",
  },
  light: {
    bg: "#f0f4f8",
    header: "#ffffff",
    panel: "#ffffff",
    panelAlt: "#f8fafc",
    border: "#d1dce8",
    accent: "#0284c7",
    green: "#16a34a",
    red: "#dc2626",
    text: "#1e293b",
    muted: "#64748b",
    yellow: "#d97706",
    selected: "#e0f0ff",
    scrollTrack: "#e2e8f0",
    scrollThumb: "#94a3b8",
    inputBg: "#f8fafc",
    inputBorder: "#cbd5e1",
    shimmer1: "#e2e8f0",
    shimmer2: "#f1f5f9",
  },
};

const FONTS = {
  mono: "'IBM Plex Mono', monospace",
  sans: "'Noto Sans KR', sans-serif",
};

const TABS = [
  { id: "dashboard", label: "대시보드" },
  { id: "auto", label: "자동매매" },
  { id: "closing", label: "⚡ 종가베팅" },
  { id: "yw-pick", label: "⭐ YW's Pick" },
  { id: "portfolio", label: "포트폴리오" },
  { id: "log", label: "로그" },
];

const CLOSING_SECTIONS = [
  { id: "recommend", label: "⚡ 종가베팅 추천" },
  { id: "surge", label: "🔴 급등 종목" },
  { id: "drop", label: "🔵 급락 종목" },
  { id: "volume", label: "📊 거래량 급증" },
  { id: "value", label: "💰 거래대금 순위" },
];

const AUTO_STRATEGIES = [
  { id: "rsi", name: "RSI 전략", desc: "RSI 과매도/과매수 기반" },
  { id: "ma", name: "이동평균 전략", desc: "골든크로스/데드크로스" },
  { id: "bb", name: "볼린저밴드 전략", desc: "밴드 터치시 매매" },
  { id: "custom", name: "커스텀 전략", desc: "조건 직접 설정" },
];

const WATCH_TICKERS = [
  { ticker: "005930.KS", name: "삼성전자" },
  { ticker: "000660.KS", name: "SK하이닉스" },
  { ticker: "035420.KS", name: "NAVER" },
  { ticker: "035720.KS", name: "카카오" },
  { ticker: "051910.KS", name: "LG화학" },
  { ticker: "006400.KS", name: "삼성SDI" },
  { ticker: "247540.KS", name: "에코프로비엠" },
  { ticker: "373220.KS", name: "LG에너지솔루션" },
  { ticker: "068270.KS", name: "셀트리온" },
  { ticker: "207940.KS", name: "삼성바이오로직스" },
];

// YW's Pick 전용 스캔 종목 (더 넓은 유니버스)
const YW_PICK_TICKERS = [
  ...WATCH_TICKERS,
  { ticker: "035720.KS", name: "카카오" },
  { ticker: "000270.KS", name: "기아" },
  { ticker: "005380.KS", name: "현대차" },
  { ticker: "066570.KS", name: "LG전자" },
  { ticker: "055550.KS", name: "신한지주" },
  { ticker: "105560.KS", name: "KB금융" },
  { ticker: "028260.KS", name: "삼성물산" },
  { ticker: "096770.KS", name: "SK이노베이션" },
  { ticker: "011170.KS", name: "롯데케미칼" },
  { ticker: "009150.KS", name: "삼성전기" },
].filter((v, i, a) => a.findIndex(t => t.ticker === v.ticker) === i); // 중복 제거

// ════════════════════════════════════════════════════════
//  2. Mock 데이터
// ════════════════════════════════════════════════════════

const MOCK_STOCKS = [
  { code: "005930", name: "삼성전자", price: 74800, change: 1200, changeRate: 1.63, volume: 18432100, high: 75200, low: 73900 },
  { code: "000660", name: "SK하이닉스", price: 189500, change: -2500, changeRate: -1.30, volume: 5821300, high: 192000, low: 188000 },
  { code: "035420", name: "NAVER", price: 198000, change: 3500, changeRate: 1.80, volume: 1243800, high: 199500, low: 195000 },
  { code: "035720", name: "카카오", price: 42150, change: -350, changeRate: -0.82, volume: 3928400, high: 43000, low: 41800 },
  { code: "051910", name: "LG화학", price: 312500, change: 5500, changeRate: 1.79, volume: 892100, high: 314000, low: 308000 },
  { code: "006400", name: "삼성SDI", price: 285000, change: -8000, changeRate: -2.73, volume: 1034200, high: 293000, low: 283000 },
];

const MOCK_CLOSING = [
  { ticker: "005930.KS", name: "삼성전자", price: 74800, changeRate: 1.63, volume: 18432100, volRate: 312, tradingValue: 74800 * 18432100, rsi: 42, bb: "하단근접", bbPos: 22, score: 88, signal: "강력매수", reason: "거래량 급증 · RSI 저점 · 볼린저 하단" },
  { ticker: "000660.KS", name: "SK하이닉스", price: 189500, changeRate: -1.30, volume: 5821300, volRate: 185, tradingValue: 189500 * 5821300, rsi: 34, bb: "하단이탈", bbPos: 10, score: 76, signal: "매수", reason: "RSI 과매도 · 볼린저 하단 이탈" },
  { ticker: "035420.KS", name: "NAVER", price: 198000, changeRate: 1.80, volume: 1243800, volRate: 224, tradingValue: 198000 * 1243800, rsi: 58, bb: "중립", bbPos: 55, score: 65, signal: "관망", reason: "거래량 증가 but RSI 중립" },
  { ticker: "247540.KS", name: "에코프로비엠", price: 98200, changeRate: 4.21, volume: 9823400, volRate: 541, tradingValue: 98200 * 9823400, rsi: 71, bb: "상단돌파", bbPos: 97, score: 55, signal: "주의", reason: "거래량 폭증 but RSI 과매수" },
  { ticker: "373220.KS", name: "LG에너지솔루션", price: 312000, changeRate: 2.10, volume: 2341200, volRate: 198, tradingValue: 312000 * 2341200, rsi: 52, bb: "중립", bbPos: 48, score: 70, signal: "매수", reason: "거래량 증가 · 중기 지지선 근접" },
  { ticker: "207940.KS", name: "삼성바이오로직스", price: 782000, changeRate: -0.51, volume: 412300, volRate: 143, tradingValue: 782000 * 412300, rsi: 48, bb: "중립", bbPos: 40, score: 60, signal: "관망", reason: "특이 신호 없음" },
  { ticker: "068270.KS", name: "셀트리온", price: 158500, changeRate: 3.45, volume: 7234100, volRate: 389, tradingValue: 158500 * 7234100, rsi: 63, bb: "상단근접", bbPos: 78, score: 82, signal: "매수", reason: "거래량 급증 · 강한 상승 모멘텀" },
];

// ════════════════════════════════════════════════════════
//  3. 유틸리티 함수
// ════════════════════════════════════════════════════════

const fmt = n => Math.round(n).toLocaleString("ko-KR");
const fmtPct = (n, sign = false) => `${sign && n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
const fmtTime = d => d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
const fmtValue = v => {
  if (!v) return "-";
  if (v >= 1e12) return `${(v / 1e12).toFixed(1)}조`;
  if (v >= 1e8) return `${(v / 1e8).toFixed(0)}억`;
  if (v >= 1e4) return `${(v / 1e4).toFixed(0)}만`;
  return fmt(v);
};

const signalColor = (signal, C) => ({ 강력매수: C.green, 매수: C.green, 관망: C.muted, 주의: C.red }[signal] ?? C.muted);
const signalIcon = signal => ({ 강력매수: "⚡", 매수: "▲", 관망: "◆", 주의: "⚠" }[signal] ?? "");
const scoreColor = (score, C) => score >= 80 ? C.green : score >= 65 ? C.yellow : C.muted;

// ════════════════════════════════════════════════════════
//  4. 기술적 지표 계산
// ════════════════════════════════════════════════════════

function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff; else losses -= diff;
  }
  return Math.round(100 - 100 / (1 + gains / (losses || 1)));
}

function calcBB(closes, period = 20) {
  if (closes.length < period) return { label: "데이터부족", pos: 50 };
  const slice = closes.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const std = Math.sqrt(slice.reduce((s, v) => s + (v - mean) ** 2, 0) / period);
  const pos = (closes[closes.length - 1] - (mean - 2 * std)) / (4 * std);
  const label = pos > 0.95 ? "상단돌파" : pos > 0.75 ? "상단근접" : pos < 0.05 ? "하단이탈" : pos < 0.25 ? "하단근접" : "중립";
  return { label, pos: Math.round(pos * 100) };
}

function calcScore(rsi, volRate, bbPos) {
  let score = 50;
  if (rsi < 30) score += 20; else if (rsi < 40) score += 12;
  else if (rsi > 70) score -= 15; else if (rsi > 60) score -= 5;
  if (volRate > 400) score += 20; else if (volRate > 200) score += 12; else if (volRate > 130) score += 5;
  if (bbPos < 15) score += 15; else if (bbPos < 30) score += 8; else if (bbPos > 85) score -= 10;
  return Math.max(0, Math.min(100, score));
}

const getSignal = score => score >= 82 ? "강력매수" : score >= 68 ? "매수" : score >= 50 ? "관망" : "주의";
const buildReason = (rsi, volRate, bbLabel) => {
  const parts = [];
  if (rsi < 30) parts.push("RSI 과매도");
  else if (rsi < 40) parts.push("RSI 저점권");
  else if (rsi > 70) parts.push("RSI 과매수 주의");
  if (volRate > 300) parts.push("거래량 폭증");
  else if (volRate > 150) parts.push("거래량 증가");
  if (bbLabel.includes("하단")) parts.push("볼린저 하단 지지");
  else if (bbLabel.includes("상단")) parts.push("볼린저 상단 저항");
  return parts.join(" · ") || "특이 신호 없음";
};

// ────────────────────────────────────────────────────────
//  엔벨로프 계산
//  · MA(period) 기준으로 상한(+k%) / 하한(-k%) 밴드 산출
//  · proximity: 현재가가 하한선에서 얼마나 가까운지 (0=하한 이탈, 100=상한 도달)
//  · distPct  : 현재가 vs 하한선 이격률 (음수일수록 하한 아래)
// ────────────────────────────────────────────────────────
function calcEnvelope(closes, period = 20, kPct = 5) {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  const ma = slice.reduce((a, b) => a + b, 0) / period;
  const upper = ma * (1 + kPct / 100);
  const lower = ma * (1 - kPct / 100);
  const last = closes[closes.length - 1];

  // 밴드 전체 폭 대비 현재가 위치 (0~100)
  const proximity = Math.round(((last - lower) / (upper - lower)) * 100);
  // 현재가가 하한선 대비 몇 % 위/아래인지
  const distPct = ((last - lower) / lower) * 100;

  const label =
    distPct < -1 ? "하한 이탈" :
      distPct < 1 ? "하한 근접" :
        distPct < 3 ? "하한 접근" :
          proximity > 90 ? "상한 근접" : "중립";

  return { ma, upper, lower, proximity: Math.max(0, Math.min(100, proximity)), distPct, label, kPct, period };
}

// ════════════════════════════════════════════════════════
//  5. Yahoo Finance API
// ════════════════════════════════════════════════════════

async function fetchYahooQuote(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3mo`;
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const chart = JSON.parse((await (await fetch(proxy)).json()).contents).chart.result[0];
  const closes = chart.indicators.quote[0].close.filter(Boolean);
  const volumes = chart.indicators.quote[0].volume.filter(Boolean);
  const meta = chart.meta;
  const price = meta.regularMarketPrice;
  const prevClose = meta.previousClose || meta.chartPreviousClose;
  const changeRate = ((price - prevClose) / prevClose) * 100;
  const lastVol = volumes[volumes.length - 1];
  const volRate = Math.round((lastVol / (volumes.slice(-20).reduce((a, b) => a + b, 0) / 20)) * 100);
  const rsi = calcRSI(closes);
  const bb = calcBB(closes);
  const env = calcEnvelope(closes);          // 엔벨로프 추가
  const score = calcScore(rsi, volRate, bb.pos);
  return {
    price, prevClose, changeRate,
    volume: lastVol, volRate,
    tradingValue: Math.round(price * lastVol),
    rsi, bb: bb.label, bbPos: bb.pos,
    env,                                      // 엔벨로프 데이터
    score, signal: getSignal(score),
    reason: buildReason(rsi, volRate, bb.label),
    closes,                                   // 차트용 원시 데이터
  };
}

// ════════════════════════════════════════════════════════
//  6. 스타일 시스템 (테마 반응형)
// ════════════════════════════════════════════════════════

const makeCSS = (C, isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; transition: background 0.3s; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.scrollTrack}; }
  ::-webkit-scrollbar-thumb { background: ${C.scrollThumb}; border-radius: 2px; }
  .blink  { animation: blink 1.2s steps(1) infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .pulse  { animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.97)} }
  .slide-in { animation: slideIn 0.3s ease; }
  @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .spin   { animation: spin 1s linear infinite; }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .shimmer { animation: shimmer 1.6s ease-in-out infinite; background: linear-gradient(90deg, ${C.shimmer1} 25%, ${C.shimmer2} 50%, ${C.shimmer1} 75%); background-size: 400% 100%; }
  @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
  .fade-in { animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .theme-transition * { transition: background 0.25s, border-color 0.25s, color 0.25s, box-shadow 0.25s !important; }
  input[type=range] { -webkit-appearance:none; height:3px; background:${C.inputBorder}; border-radius:2px; outline:none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:12px; height:12px; background:${C.accent}; border-radius:50%; cursor:pointer; }
  input[type=number], input[type=text] { background:${C.inputBg}; border:1px solid ${C.inputBorder}; color:${C.text}; padding:6px 10px; border-radius:4px; font-family:${FONTS.mono}; font-size:13px; width:100%; outline:none; }
  input[type=number]:focus, input[type=text]:focus { border-color:${C.accent}; }
`;

const makeS = C => ({
  panel: { background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16 },
  monoLabel: { fontFamily: FONTS.mono, fontSize: 10, color: C.muted, letterSpacing: 1 },
  monoVal: { fontFamily: FONTS.mono, fontWeight: 600 },
  infoBox: { background: C.panelAlt, borderRadius: 4, padding: "6px 8px", textAlign: "center" },
  flex: (gap = 8) => ({ display: "flex", alignItems: "center", gap }),
  grid: (cols, gap = 12) => ({ display: "grid", gridTemplateColumns: cols, gap }),
});

// ════════════════════════════════════════════════════════
//  7. 다크/라이트 모드 토글 버튼
// ════════════════════════════════════════════════════════

function ThemeToggle({ isDark, onToggle, C }) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      style={{
        display: "flex", alignItems: "center", gap: 6, padding: "4px 12px",
        borderRadius: 20, cursor: "pointer", fontSize: 11, fontFamily: FONTS.mono,
        border: `1px solid ${C.border}`,
        background: isDark ? "#1a2d42" : "#e0f0ff",
        color: isDark ? C.yellow : C.accent,
        transition: "all 0.25s",
        whiteSpace: "nowrap",
      }}
    >
      {/* 트랙 */}
      <div style={{ position: "relative", width: 32, height: 16, borderRadius: 8, background: isDark ? "#0d1a27" : "#bae6fd", border: `1px solid ${C.border}`, flexShrink: 0, transition: "background 0.25s" }}>
        {/* 썸 */}
        <div style={{
          position: "absolute", top: 2,
          left: isDark ? 16 : 2,
          width: 10, height: 10, borderRadius: "50%",
          background: isDark ? C.yellow : C.accent,
          transition: "left 0.25s, background 0.25s",
          boxShadow: isDark ? `0 0 4px ${C.yellow}80` : `0 0 4px ${C.accent}80`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 6,
        }}>
          {isDark ? "☾" : "☀"}
        </div>
      </div>
      <span>{isDark ? "다크" : "라이트"}</span>
    </button>
  );
}

// ════════════════════════════════════════════════════════
//  8. 공용 소형 컴포넌트
// ════════════════════════════════════════════════════════

function LoadingOverlay({ message, C }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(7,13,20,0.82)", zIndex: 999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }}>
      <div style={{ position: "relative", width: 64, height: 64, marginBottom: 20 }}>
        <div className="spin" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.accent }} />
        <div className="spin" style={{ position: "absolute", inset: 8, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.yellow, animationDirection: "reverse", animationDuration: "0.7s" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONTS.mono, fontSize: 16, color: C.accent }}>◈</div>
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: C.text, marginBottom: 6 }}>{message}</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.muted }}>Yahoo Finance API 호출 중...</div>
      <div style={{ marginTop: 20, width: 200, height: 2, background: C.border, borderRadius: 2, overflow: "hidden" }}>
        <div className="shimmer" style={{ height: "100%", width: "60%", borderRadius: 2 }} />
      </div>
    </div>
  );
}

function SkeletonCard({ C }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <div className="shimmer" style={{ height: 14, width: 80, borderRadius: 4 }} />
        <div className="shimmer" style={{ height: 10, width: 50, borderRadius: 4 }} />
      </div>
      <div className="shimmer" style={{ height: 10, width: 60, borderRadius: 10 }} />
      <div className="shimmer" style={{ height: 22, width: 120, borderRadius: 4 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
        {[0, 1, 2].map(i => <div key={i} className="shimmer" style={{ height: 40, borderRadius: 4 }} />)}
      </div>
      <div className="shimmer" style={{ height: 4, borderRadius: 2 }} />
      <div className="shimmer" style={{ height: 12, width: "80%", borderRadius: 4 }} />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px" }}>
      <div className="shimmer" style={{ width: 20, height: 12, borderRadius: 4 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <div className="shimmer" style={{ height: 13, width: 80, borderRadius: 4 }} />
        <div className="shimmer" style={{ height: 10, width: 55, borderRadius: 4 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
        <div className="shimmer" style={{ height: 14, width: 60, borderRadius: 4 }} />
        <div className="shimmer" style={{ height: 10, width: 45, borderRadius: 4 }} />
      </div>
      <div className="shimmer" style={{ height: 20, width: 55, borderRadius: 10 }} />
    </div>
  );
}

function MiniChart({ data, color }) {
  const W = 80, H = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / (max - min + 1)) * H}`).join(" ");
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChangeText({ value, C }) {
  return (
    <span style={{ color: value >= 0 ? C.green : C.red, fontFamily: FONTS.mono, fontWeight: 600 }}>
      {value >= 0 ? "▲" : "▼"} {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function SignalBadge({ signal, C }) {
  const col = signalColor(signal, C);
  return (
    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: `${col}20`, color: col, border: `1px solid ${col}40` }}>
      {signalIcon(signal)} {signal}
    </span>
  );
}

function PanelHeader({ label, right, C }) {
  const S = makeS(C);
  return (
    <div style={{ ...S.flex(0), justifyContent: "space-between", marginBottom: 12 }}>
      <span style={S.monoLabel}>{label}</span>
      {right && <span style={{ fontSize: 10, color: C.muted }}>{right}</span>}
    </div>
  );
}

function StatCard({ label, value, color, unit = "", C }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, textAlign: "center" }}>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 20, color }}>
        {value}<span style={{ fontSize: 11, marginLeft: 2 }}>{unit}</span>
      </div>
    </div>
  );
}

function SliderField({ label, value, min, max, onChange, color, C }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: C.text }}>{label}</span>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 12, color }}>{value}%</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)} style={{ width: "100%" }} />
    </div>
  );
}

function InputField({ label, C, ...props }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{label}</div>
      <input {...props} />
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  9. 차트 컴포넌트
// ════════════════════════════════════════════════════════

function generateCandles() {
  let price = 74000;
  return Array.from({ length: 61 }, (_, idx) => {
    const open = price;
    const close = Math.max(65000, Math.min(85000, open + (Math.random() - 0.48) * 1200));
    price = close;
    return { open, close, high: Math.max(open, close) + Math.random() * 400, low: Math.min(open, close) - Math.random() * 400, time: 60 - idx };
  });
}
const CANDLE_DATA = generateCandles();

function CandleChart({ candles, C }) {
  const W = 620, H = 200, PAD = { l: 10, r: 50, t: 10, b: 20 };
  const cw = W - PAD.l - PAD.r, ch = H - PAD.t - PAD.b;
  const allP = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...allP), maxP = Math.max(...allP), range = maxP - minP;
  const toY = v => PAD.t + ch - ((v - minP) / range) * ch;
  const barW = (cw / candles.length) * 0.7;
  const toX = i => PAD.l + (i / candles.length) * cw + barW / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", borderRadius: 4 }}>
      <rect width={W} height={H} fill={C.panelAlt} rx="4" />
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = PAD.t + t * ch;
        return (
          <g key={t}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke={C.border} strokeWidth="0.5" strokeDasharray="3,3" />
            <text x={W - PAD.r + 4} y={y + 4} fill={C.muted} fontSize="8" fontFamily="monospace">
              {Math.round(maxP - t * range).toLocaleString()}
            </text>
          </g>
        );
      })}
      {candles.map((c, i) => {
        const col = c.close >= c.open ? C.green : C.red;
        const bodyTop = toY(Math.max(c.open, c.close));
        const bodyH = Math.max(1, toY(Math.min(c.open, c.close)) - bodyTop);
        return (
          <g key={i}>
            <line x1={toX(i)} y1={toY(c.high)} x2={toX(i)} y2={toY(c.low)} stroke={col} strokeWidth="0.8" opacity="0.8" />
            <rect x={toX(i) - barW / 2} y={bodyTop} width={barW} height={bodyH} fill={col} opacity="0.9" rx="0.5" />
          </g>
        );
      })}
    </svg>
  );
}

// ════════════════════════════════════════════════════════
//  10. 종가베팅 서브 컴포넌트
// ════════════════════════════════════════════════════════

function StockScoreCard({ s, C }) {
  const S = makeS(C);
  const sc = signalColor(s.signal, C);
  const col = scoreColor(s.score, C);
  return (
    <div style={{ ...S.panel, borderLeft: `3px solid ${sc}`, position: "relative" }}>
      <div style={{ position: "absolute", top: 12, right: 12, width: 46, height: 46, borderRadius: "50%", background: `${col}15`, border: `2px solid ${col}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 14, color: col, lineHeight: 1 }}>{s.score}</span>
        <span style={{ fontSize: 8, color: C.muted }}>점</span>
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{s.name}</span>
          <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 10, color: C.muted }}>{s.ticker}</span>
        </div>
        <SignalBadge signal={s.signal} C={C} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 17, color: C.text }}>{fmt(s.price)}</span>
        <ChangeText value={s.changeRate} C={C} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 10 }}>
        {[
          ["거래량비율", `${s.volRate}%`, s.volRate >= 300 ? C.green : s.volRate >= 150 ? C.yellow : C.muted],
          ["RSI", s.rsi, s.rsi <= 35 ? C.green : s.rsi >= 65 ? C.red : C.yellow],
          ["볼린저", s.bb, C.accent],
        ].map(([label, val, color]) => (
          <div key={label} style={S.infoBox}>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 11, color }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted, marginBottom: 3 }}>
          <span>하단</span><span>볼린저밴드 위치</span><span>상단</span>
        </div>
        <div style={{ height: 4, background: C.border, borderRadius: 2, position: "relative" }}>
          <div style={{ position: "absolute", left: `${Math.min(95, Math.max(2, s.bbPos ?? 50))}%`, top: -3, width: 10, height: 10, borderRadius: "50%", background: C.accent, transform: "translateX(-50%)", boxShadow: `0 0 6px ${C.accent}` }} />
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>💡 {s.reason}</div>
    </div>
  );
}

function MedalCard({ s, rank, C }) {
  const medals = ["🥇", "🥈", "🥉"];
  const borderCols = [C.yellow, "#aaaaaa", "#cd7f32"];
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, borderTop: `3px solid ${borderCols[rank]}`, textAlign: "center" }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{medals[rank]}</div>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: C.text }}>{s.name}</div>
      <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 22, color: C.yellow, marginBottom: 4 }}>{fmtValue(s.tradingValue)}</div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>거래량 {(s.volume / 10000).toFixed(0)}만주 · {fmt(s.price)}원</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
        <ChangeText value={s.changeRate} C={C} />
        <span style={{ color: C.muted }}>|</span>
        <span style={{ fontSize: 11, color: s.volRate >= 200 ? C.green : C.muted }}>거래량비 {s.volRate}%</span>
      </div>
    </div>
  );
}

function RankRow({ s, idx, valueKey, C }) {
  const display = {
    changeRate: { val: fmtPct(s.changeRate, true), sub: `${fmt(s.price)}원`, col: s.changeRate >= 0 ? C.green : C.red },
    volRate: { val: `${s.volRate}%`, sub: `거래대금 ${fmtValue(s.tradingValue)}`, col: s.volRate >= 300 ? C.green : C.yellow },
    tradingValue: { val: fmtValue(s.tradingValue), sub: `거래량 ${(s.volume / 10000).toFixed(0)}만주`, col: C.yellow },
  }[valueKey] ?? { val: fmt(s.volume), sub: `${fmt(s.price)}원`, col: C.accent };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: `1px solid ${C.border}20`, background: idx === 0 ? `${display.col}08` : "transparent" }}>
      <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 12, color: idx < 3 ? C.yellow : C.muted, minWidth: 20 }}>#{idx + 1}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{s.name}</div>
        <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 10, color: C.muted }}>{s.ticker}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 14, color: display.col }}>{display.val}</div>
        <div style={{ fontSize: 11, color: C.muted }}>{display.sub}</div>
      </div>
      <SignalBadge signal={s.signal} C={C} />
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  11. YW's Pick 탭  — 엔벨로프 하한 근접 종목 스캐너
// ════════════════════════════════════════════════════════

// Mock fallback (API 실패 시)
const MOCK_YW_PICKS = [
  { ticker: "005930.KS", name: "삼성전자", price: 74800, changeRate: 1.63, rsi: 42, closes: [], env: { ma: 77200, upper: 81060, lower: 73340, proximity: 20, distPct: 1.98, label: "하한 접근", kPct: 5, period: 20 } },
  { ticker: "000660.KS", name: "SK하이닉스", price: 189500, changeRate: -1.30, rsi: 34, closes: [], env: { ma: 198000, upper: 207900, lower: 188100, proximity: 8, distPct: 0.74, label: "하한 근접", kPct: 5, period: 20 } },
  { ticker: "006400.KS", name: "삼성SDI", price: 283000, changeRate: -2.73, rsi: 31, closes: [], env: { ma: 298000, upper: 312900, lower: 283100, proximity: 1, distPct: -0.04, label: "하한 이탈", kPct: 5, period: 20 } },
  { ticker: "051910.KS", name: "LG화학", price: 312500, changeRate: 1.79, rsi: 48, closes: [], env: { ma: 318000, upper: 333900, lower: 302100, proximity: 31, distPct: 3.44, label: "하한 접근", kPct: 5, period: 20 } },
  { ticker: "066570.KS", name: "LG전자", price: 98200, changeRate: -0.61, rsi: 38, closes: [], env: { ma: 103000, upper: 108150, lower: 97850, proximity: 12, distPct: 0.36, label: "하한 근접", kPct: 5, period: 20 } },
  { ticker: "011170.KS", name: "롯데케미칼", price: 91400, changeRate: -1.82, rsi: 29, closes: [], env: { ma: 97000, upper: 101850, lower: 92150, proximity: 4, distPct: -0.81, label: "하한 이탈", kPct: 5, period: 20 } },
];

// 엔벨로프 하한 근접 점수 (proximity 낮을수록 고점수)
function calcPickScore(env, rsi) {
  if (!env) return 0;
  let score = 100 - env.proximity;
  if (env.distPct < 0) score += 15;
  else if (env.distPct < 1) score += 8;
  if (rsi < 30) score += 15;
  else if (rsi < 40) score += 8;
  return Math.min(100, Math.round(score));
}

function pickLabel(env) {
  if (!env) return { text: "—", color: null };
  return ({
    "하한 이탈": { text: "🔥 하한 이탈", color: "#ef4444" },
    "하한 근접": { text: "⚡ 하한 근접", color: "#f0b429" },
    "하한 접근": { text: "▼ 하한 접근", color: "#26c96f" },
    "상한 근접": { text: "▲ 상한 근접", color: "#4a7a9b" },
    "중립": { text: "◆ 중립", color: null },
  }[env.label] ?? { text: env.label, color: null });
}

function EnvelopeBar({ env, C }) {
  if (!env) return null;
  const pct = Math.max(1, Math.min(99, env.proximity));
  const dotColor = env.distPct < 0 ? C.red : env.distPct < 1 ? C.yellow : env.distPct < 3 ? C.green : C.muted;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted, marginBottom: 3 }}>
        <span>하한 -{env.kPct}%</span><span>MA{env.period}</span><span>상한 +{env.kPct}%</span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 3, background: `linear-gradient(to right, ${C.green}30, ${C.muted}20, ${C.red}20)` }}>
        <div style={{ position: "absolute", left: "50%", top: -2, width: 1, height: 10, background: C.border }} />
        <div style={{ position: "absolute", left: `${pct}%`, top: -3, transform: "translateX(-50%)", width: 12, height: 12, borderRadius: "50%", background: dotColor, border: `2px solid ${C.panel}`, boxShadow: `0 0 6px ${dotColor}` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted, marginTop: 5 }}>
        <span style={{ color: dotColor, fontFamily: FONTS.mono, fontWeight: 600 }}>
          {env.distPct >= 0 ? "+" : ""}{env.distPct.toFixed(2)}% (하한 대비)
        </span>
        <span>MA {fmt(Math.round(env.ma))}</span>
      </div>
    </div>
  );
}

function PickCard({ s, rank, C }) {
  const pickScore = calcPickScore(s.env, s.rsi);
  const lbl = pickLabel(s.env);
  const scoreCol = pickScore >= 90 ? C.red : pickScore >= 75 ? C.yellow : C.green;
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div style={{ background: C.panel, border: `1px solid ${rank < 3 ? scoreCol : C.border}`, borderRadius: 8, padding: 16, position: "relative", boxShadow: rank < 3 ? `0 0 14px ${scoreCol}18` : "none" }}>
      {/* 순위 배지 */}
      <div style={{ position: "absolute", top: -10, left: 14, fontSize: rank < 3 ? 18 : 12, lineHeight: 1 }}>
        {rank < 3
          ? medals[rank]
          : <span style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1px 7px", fontSize: 10, color: C.muted, fontFamily: FONTS.mono }}>#{rank + 1}</span>}
      </div>
      {/* 점수 원형 */}
      <div style={{ position: "absolute", top: 10, right: 12, width: 44, height: 44, borderRadius: "50%", background: `${scoreCol}12`, border: `2px solid ${scoreCol}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 13, color: scoreCol, lineHeight: 1 }}>{pickScore}</span>
        <span style={{ fontSize: 8, color: C.muted }}>점</span>
      </div>
      {/* 종목명 */}
      <div style={{ marginTop: 10, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{s.name}</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted }}>{s.ticker}</span>
        </div>
        {lbl.color
          ? <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 10, background: `${lbl.color}20`, color: lbl.color, border: `1px solid ${lbl.color}40`, fontWeight: 600 }}>{lbl.text}</span>
          : <span style={{ fontSize: 11, color: C.muted }}>{lbl.text}</span>}
      </div>
      {/* 가격 */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 18, color: C.text }}>{fmt(s.price)}</span>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 600, color: s.changeRate >= 0 ? C.green : C.red }}>
          {s.changeRate >= 0 ? "▲" : "▼"} {Math.abs(s.changeRate).toFixed(2)}%
        </span>
      </div>
      {/* 엔벨로프 바 */}
      <div style={{ marginBottom: 12 }}><EnvelopeBar env={s.env} C={C} /></div>
      {/* 보조 지표 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 10 }}>
        {[
          ["RSI", s.rsi, s.rsi < 30 ? C.red : s.rsi < 40 ? C.yellow : C.muted],
          ["하한까지", s.env ? `${Math.abs(s.env.distPct).toFixed(1)}%` : "—", scoreCol],
          ["MA", s.env ? fmt(Math.round(s.env.ma)) : "—", C.accent],
        ].map(([label, val, color]) => (
          <div key={label} style={{ background: C.panelAlt, borderRadius: 4, padding: "5px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 11, color }}>{val}</div>
          </div>
        ))}
      </div>
      {/* 힌트 */}
      <div style={{ fontSize: 11, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 8, lineHeight: 1.5 }}>
        {s.env?.distPct < 0 ? "💡 하한선 이탈 — 반등 가능성, 추세 확인 필수"
          : s.env?.distPct < 1 ? "💡 하한선 터치 — 분할 매수 진입 고려 구간"
            : s.env?.distPct < 3 ? "💡 하한선 접근 중 — 관심 등록 & 추이 관찰"
              : "💡 밴드 중립 구간 — 대기"}
      </div>
    </div>
  );
}

function EnvelopeSettings({ period, kPct, setPeriod, setKPct, C }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16 }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted, letterSpacing: 1, marginBottom: 14 }}>엔벨로프 파라미터</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>이동평균 기간</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[10, 20, 30, 60].map(v => (
              <button key={v} onClick={() => setPeriod(v)} style={{ flex: 1, padding: "5px 0", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: FONTS.mono, border: `1px solid ${period === v ? C.accent : C.border}`, background: period === v ? `${C.accent}18` : "transparent", color: period === v ? C.accent : C.muted }}>
                {v}일
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>밴드폭 (%)</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[3, 5, 8, 10].map(v => (
              <button key={v} onClick={() => setKPct(v)} style={{ flex: 1, padding: "5px 0", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: FONTS.mono, border: `1px solid ${kPct === v ? C.yellow : C.border}`, background: kPct === v ? `${C.yellow}18` : "transparent", color: kPct === v ? C.yellow : C.muted }}>
                ±{v}%
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.muted, background: C.panelAlt, borderRadius: 4, padding: "8px 12px", lineHeight: 1.6 }}>
        <span style={{ color: C.accent, fontWeight: 600 }}>엔벨로프(Envelope)</span>란 이동평균(MA)을 중심으로
        상·하 일정 % 채널을 그려 <span style={{ color: C.green }}>하한 지지</span> / <span style={{ color: C.red }}>상한 저항</span>을 포착하는 추세 지표입니다.
      </div>
    </div>
  );
}

function YwPickTab({ C }) {
  const S = makeS(C);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [envPeriod, setEnvPeriod] = useState(20);
  const [envKPct, setEnvKPct] = useState(5);
  const [filterLabel, setFilterLabel] = useState("전체");

  const loadData = async () => {
    setLoading(true); setError(null);
    try {
      const results = await Promise.allSettled(
        YW_PICK_TICKERS.map(t => fetchYahooQuote(t.ticker).then(d => ({ ...d, ...t })))
      );
      const ok = results.filter(r => r.status === "fulfilled").map(r => r.value);
      if (!ok.length) throw new Error("데이터를 불러올 수 없습니다");
      setStocks(ok); setLastUpdated(new Date());
    } catch (e) {
      setError(e.message); setStocks(MOCK_YW_PICKS);
    } finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  // envPeriod/kPct 변경 시 closes 원시 데이터로 재계산 (API 재호출 없이)
  const computed = stocks.map(s => ({
    ...s,
    env: s.closes?.length ? calcEnvelope(s.closes, envPeriod, envKPct) : s.env,
  }));

  const FILTER_LABELS = ["전체", "하한 이탈", "하한 근접", "하한 접근"];
  const filtered = computed
    .filter(s => filterLabel === "전체" || s.env?.label === filterLabel)
    .sort((a, b) => (a.env?.proximity ?? 999) - (b.env?.proximity ?? 999));
  const topPicks = filtered.slice(0, 3);
  const restPicks = filtered.slice(3);

  const statItems = [
    { label: "스캔 종목", value: loading ? "…" : `${computed.length}개`, color: C.accent },
    { label: "하한 이탈", value: loading ? "…" : `${computed.filter(s => s.env?.label === "하한 이탈").length}개`, color: C.red },
    { label: "하한 근접", value: loading ? "…" : `${computed.filter(s => s.env?.label === "하한 근접").length}개`, color: C.yellow },
    { label: "하한 접근", value: loading ? "…" : `${computed.filter(s => s.env?.label === "하한 접근").length}개`, color: C.green },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="slide-in">
      {loading && stocks.length === 0 && <LoadingOverlay message={`${YW_PICK_TICKERS.length}개 종목 엔벨로프 스캔 중…`} C={C} />}

      {/* 헤더 배너 */}
      <div style={{ background: `linear-gradient(135deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 18, fontWeight: 700, color: C.yellow, letterSpacing: 1, marginBottom: 4 }}>⭐ YW's Pick</div>
          <div style={{ fontSize: 12, color: C.muted }}>엔벨로프 하한선 기준 · 지지구간 근접 종목 자동 선별</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {lastUpdated && <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.muted }}>갱신: {fmtTime(lastUpdated)}</span>}
          <button onClick={loadData} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 4, fontSize: 11, cursor: loading ? "not-allowed" : "pointer", border: `1px solid ${loading ? C.border : C.yellow}`, background: loading ? "transparent" : `${C.yellow}15`, color: loading ? C.muted : C.yellow, opacity: loading ? 0.6 : 1 }}>
            {loading ? <><div className="spin" style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.yellow, flexShrink: 0 }} />스캔 중…</> : "🔍 재스캔"}
          </button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div style={S.grid("repeat(4,1fr)")}>
        {statItems.map(({ label, value, color }) => <StatCard key={label} label={label} value={value} color={color} C={C} />)}
      </div>

      {/* 설정 + 필터 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 12, alignItems: "start" }}>
        <EnvelopeSettings period={envPeriod} kPct={envKPct} setPeriod={setEnvPeriod} setKPct={setEnvKPct} C={C} />
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16 }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted, letterSpacing: 1, marginBottom: 10 }}>필터</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {FILTER_LABELS.map(f => {
              const lbl = pickLabel({ label: f });
              const active = filterLabel === f;
              const col = lbl.color || C.accent;
              return (
                <button key={f} onClick={() => setFilterLabel(f)} style={{ padding: "6px 12px", borderRadius: 4, fontSize: 12, cursor: "pointer", textAlign: "left", border: `1px solid ${active ? col : C.border}`, background: active ? `${col}15` : "transparent", color: active ? col : C.muted, fontWeight: active ? 600 : 400 }}>
                  {f === "전체" ? "◈ 전체" : lbl.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}40`, borderRadius: 6, padding: 12, fontSize: 12, color: C.red }}>
          ⚠ {error} — Mock 데이터로 표시 중입니다.
        </div>
      )}

      {/* TOP 3 카드 */}
      {loading
        ? <div style={S.grid("repeat(3,1fr)")}>{[0, 1, 2].map(i => <SkeletonCard key={i} C={C} />)}</div>
        : topPicks.length > 0 && (
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.yellow, letterSpacing: 2, marginBottom: 10 }}>▶ TOP PICKS — 하한 최근접 종목</div>
            <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {topPicks.map((s, i) => <PickCard key={s.ticker} s={s} rank={i} C={C} />)}
            </div>
          </div>
        )
      }

      {/* 나머지 테이블 */}
      {!loading && restPicks.length > 0 && (
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted, letterSpacing: 1 }}>전체 스캔 결과</span>
            <span style={{ fontSize: 10, color: C.muted }}>— 하한 근접 순 정렬</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr 1fr", padding: "6px 16px", borderBottom: `1px solid ${C.border}`, background: C.panelAlt }}>
            {["종목", "현재가", "등락률", "RSI", "엔벨로프 위치", "상태"].map(h => (
              <span key={h} style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted }}>{h}</span>
            ))}
          </div>
          <div className="fade-in">
            {restPicks.map((s, i) => {
              const lbl = pickLabel(s.env);
              const ps = calcPickScore(s.env, s.rsi);
              const scoreCol = ps >= 90 ? C.red : ps >= 75 ? C.yellow : C.green;
              return (
                <div key={s.ticker} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr 1fr", padding: "10px 16px", borderBottom: `1px solid ${C.border}20`, alignItems: "center", background: i % 2 === 0 ? "transparent" : `${C.panelAlt}50` }}>
                  <div>
                    <div style={{ fontWeight: 600, color: C.text }}>{s.name}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted }}>{s.ticker}</div>
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontWeight: 600, color: C.text }}>{fmt(s.price)}</div>
                  <div style={{ fontFamily: FONTS.mono, fontWeight: 600, color: s.changeRate >= 0 ? C.green : C.red }}>
                    {s.changeRate >= 0 ? "▲" : "▼"} {Math.abs(s.changeRate).toFixed(2)}%
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontWeight: 600, color: s.rsi < 30 ? C.red : s.rsi < 40 ? C.yellow : C.muted }}>{s.rsi}</div>
                  <div style={{ paddingRight: 8 }}>
                    <div style={{ position: "relative", height: 4, borderRadius: 2, background: `linear-gradient(to right,${C.green}30,${C.muted}15,${C.red}15)` }}>
                      <div style={{ position: "absolute", left: `${Math.max(1, Math.min(99, s.env?.proximity ?? 50))}%`, top: -3, width: 10, height: 10, transform: "translateX(-50%)", borderRadius: "50%", background: scoreCol, border: `2px solid ${C.panel}` }} />
                    </div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.muted, marginTop: 3 }}>
                      {s.env ? `${s.env.distPct >= 0 ? "+" : ""}${s.env.distPct.toFixed(2)}%` : "—"}
                    </div>
                  </div>
                  <div>
                    {lbl.color
                      ? <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: `${lbl.color}20`, color: lbl.color, border: `1px solid ${lbl.color}40` }}>{lbl.text}</span>
                      : <span style={{ fontSize: 10, color: C.muted }}>{lbl.text}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: C.muted, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6 }}>
          해당 조건의 종목이 없습니다.
        </div>
      )}

      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 14px", display: "flex", gap: 8, fontSize: 11, color: C.muted }}>
        <span style={{ color: C.yellow }}>⚠</span>
        <span>엔벨로프 MA{envPeriod} ±{envKPct}% 기준 하한 근접 종목 자동 선별입니다. 하한 지지는 추세 하락 시 무의미할 수 있으므로 RSI·거래량을 병행 확인하세요. 투자 판단은 본인 책임입니다.</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  12. 종가베팅 탭
// ════════════════════════════════════════════════════════

function ClosingTab({ C }) {
  const S = makeS(C);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("전체");
  const [sortBy, setSortBy] = useState("score");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [section, setSection] = useState("recommend");

  const loadData = async () => {
    setLoading(true); setError(null);
    try {
      const results = await Promise.allSettled(WATCH_TICKERS.map(t => fetchYahooQuote(t.ticker).then(d => ({ ...d, ...t }))));
      const ok = results.filter(r => r.status === "fulfilled").map(r => r.value);
      if (!ok.length) throw new Error("데이터를 불러올 수 없습니다");
      setStocks(ok); setLastUpdated(new Date());
    } catch (e) {
      setError(e.message); setStocks(MOCK_CLOSING);
    } finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const SORT_FN = { score: (a, b) => b.score - a.score, volRate: (a, b) => b.volRate - a.volRate, changeRate: (a, b) => Math.abs(b.changeRate) - Math.abs(a.changeRate) };
  const filtered = stocks.filter(s => filter === "전체" || s.signal === filter).sort(SORT_FN[sortBy]);
  const surgeList = [...stocks].filter(s => s.changeRate >= 2).sort((a, b) => b.changeRate - a.changeRate);
  const dropList = [...stocks].filter(s => s.changeRate <= -2).sort((a, b) => a.changeRate - b.changeRate);
  const volList = [...stocks].sort((a, b) => b.volRate - a.volRate);
  const valueList = [...stocks].sort((a, b) => (b.tradingValue || 0) - (a.tradingValue || 0));
  const summary = { total: stocks.length, strong: stocks.filter(s => s.signal === "강력매수").length, buy: stocks.filter(s => s.signal === "매수").length, other: stocks.filter(s => ["관망", "주의"].includes(s.signal)).length };

  const btnStyle = (active, activeColor) => ({
    padding: "5px 14px", borderRadius: 4, fontSize: 12, cursor: "pointer",
    border: `1px solid ${active ? activeColor : C.border}`,
    background: active ? `${activeColor}18` : "transparent",
    color: active ? activeColor : C.muted,
    fontWeight: active ? 600 : 400,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="slide-in">
      {loading && stocks.length === 0 && <LoadingOverlay message={`${WATCH_TICKERS.length}개 종목 데이터 수신 중…`} C={C} />}

      {/* 요약 */}
      <div style={S.grid("repeat(4,1fr)")}>
        <StatCard label="스캔 종목" value={loading ? "…" : `${summary.total}개`} color={C.accent} C={C} />
        <StatCard label="강력매수" value={loading ? "…" : `${summary.strong}개`} color={C.green} C={C} />
        <StatCard label="매수 신호" value={loading ? "…" : `${summary.buy}개`} color={C.yellow} C={C} />
        <StatCard label="관망/주의" value={loading ? "…" : `${summary.other}개`} color={C.muted} C={C} />
      </div>

      {/* 섹션 탭 + 새로고침 */}
      <div style={{ ...S.panel, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {CLOSING_SECTIONS.map(t => (
            <button key={t.id} onClick={() => setSection(t.id)} style={btnStyle(section === t.id, C.yellow)}>{t.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {lastUpdated && <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 11, color: C.muted }}>갱신: {fmtTime(lastUpdated)}</span>}
          <button onClick={loadData} disabled={loading} style={{ ...btnStyle(false, C.accent), display: "flex", alignItems: "center", gap: 6, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer", border: `1px solid ${loading ? C.border : C.accent}`, color: loading ? C.muted : C.accent }}>
            {loading ? <><div className="spin" style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.accent, flexShrink: 0 }} />로딩 중…</> : "🔄 새로고침"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ ...S.panel, background: `${C.red}10`, border: `1px solid ${C.red}40`, fontSize: 12, color: C.red }}>
          ⚠ {error} — Mock 데이터로 표시 중입니다. (CORS 제한 → Spring Boot 백엔드 프록시 권장)
        </div>
      )}

      {/* 추천 섹션 */}
      {section === "recommend" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={S.monoLabel}>신호</span>
            {["전체", "강력매수", "매수", "관망", "주의"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={btnStyle(filter === f, C.yellow)}>{f}</button>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: C.muted }}>정렬</span>
              {[["score", "점수순"], ["volRate", "거래량순"], ["changeRate", "등락률순"]].map(([k, l]) => (
                <button key={k} onClick={() => setSortBy(k)} style={btnStyle(sortBy === k, C.accent)}>{l}</button>
              ))}
            </div>
          </div>
          {loading
            ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} C={C} />)}</div>
            : <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>{filtered.map(s => <StockScoreCard key={s.ticker} s={s} C={C} />)}</div>
          }
        </div>
      )}

      {/* 급등/급락/거래량 */}
      {[
        { id: "surge", icon: "🔴", label: "당일 급등 종목 (등락률 +2% 이상)", list: surgeList, key: "changeRate", empty: "급등 종목 없음" },
        { id: "drop", icon: "🔵", label: "당일 급락 종목 (등락률 -2% 이하)", list: dropList, key: "changeRate", empty: "급락 종목 없음" },
        { id: "volume", icon: "📊", label: "거래량 급증 (20일 평균 대비)", list: volList, key: "volRate", empty: "" },
      ].map(({ id, icon, label, list, key, empty }) => section === id && (
        <div key={id} style={{ ...S.panel, padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}>
            <span>{icon}</span>
            <span style={S.monoLabel}>{label}</span>
            {loading && <div className="spin" style={{ marginLeft: "auto", width: 12, height: 12, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.accent }} />}
          </div>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : list.length === 0
              ? <div style={{ padding: 24, color: C.muted, textAlign: "center" }}>{empty}</div>
              : <div className="fade-in">{list.map((s, i) => <RankRow key={s.ticker} s={s} idx={i} valueKey={key} C={C} />)}</div>
          }
        </div>
      ))}

      {/* 거래대금 */}
      {section === "value" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loading
            ? <div style={S.grid("repeat(3,1fr)")}>{[0, 1, 2].map(i => (
              <div key={i} style={{ ...S.panel, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div className="shimmer" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                <div className="shimmer" style={{ height: 14, width: 80, borderRadius: 4 }} />
                <div className="shimmer" style={{ height: 24, width: 100, borderRadius: 4 }} />
              </div>))}</div>
            : <div className="fade-in" style={S.grid("repeat(3,1fr)")}>{valueList.slice(0, 3).map((s, i) => <MedalCard key={s.ticker} s={s} rank={i} C={C} />)}</div>
          }
          <div style={{ ...S.panel, padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span>💰</span><span style={S.monoLabel}>거래대금 전체 순위</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {loading && <div className="spin" style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.yellow }} />}
                <span style={{ fontSize: 10, color: C.muted }}>거래대금 = 주가 × 거래량</span>
              </div>
            </div>
            {loading
              ? Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
              : <div className="fade-in">{valueList.map((s, i) => <RankRow key={s.ticker} s={s} idx={i} valueKey="tradingValue" C={C} />)}</div>
            }
          </div>
        </div>
      )}

      <div style={{ ...S.panel, display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: C.muted }}>
        <span style={{ color: C.yellow }}>⚠</span>
        <span>Yahoo Finance 일봉 기반 · RSI(14) · 볼린저밴드(20,2) · 거래량(20일 평균 대비) 복합 점수입니다. 실제 매매는 본인 판단하에 진행하세요.</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  12. 전략 설정 패널
// ════════════════════════════════════════════════════════

function StrategyPanel({ strategy, rsiPeriod, rsiBuy, rsiSell, setRsiPeriod, setRsiBuy, setRsiSell, C }) {
  const S = makeS(C);
  if (strategy === "rsi") return (
    <div style={S.panel} className="slide-in">
      <PanelHeader label="RSI 전략 설정" C={C} />
      <div style={{ ...S.grid("1fr 1fr 1fr"), marginBottom: 16 }}>
        <InputField label="RSI 기간" type="number" value={rsiPeriod} min={1} max={100} onChange={e => setRsiPeriod(+e.target.value)} C={C} />
        <InputField label="매수 기준 (RSI <)" type="number" value={rsiBuy} min={10} max={50} onChange={e => setRsiBuy(+e.target.value)} C={C} />
        <InputField label="매도 기준 (RSI >)" type="number" value={rsiSell} min={50} max={90} onChange={e => setRsiSell(+e.target.value)} C={C} />
      </div>
      <div style={{ background: C.panelAlt, borderRadius: 6, padding: 16, border: `1px solid ${C.border}` }}>
        <div style={{ ...S.monoLabel, marginBottom: 8 }}>RSI 시뮬레이션</div>
        <svg width="100%" viewBox="0 0 500 80">
          <rect width="500" height="80" fill={C.panelAlt} />
          <line x1="0" y1={80 - rsiSell * 0.8} x2="500" y2={80 - rsiSell * 0.8} stroke={C.red} strokeWidth="0.8" strokeDasharray="4,4" opacity="0.6" />
          <line x1="0" y1={80 - rsiBuy * 0.8} x2="500" y2={80 - rsiBuy * 0.8} stroke={C.green} strokeWidth="0.8" strokeDasharray="4,4" opacity="0.6" />
          <polyline points={Array.from({ length: 50 }, (_, i) => `${i * 10},${80 - (30 + Math.sin(i * 0.5) * 25 + Math.sin(i * 0.2) * 15) * 0.8}`).join(" ")} fill="none" stroke={C.accent} strokeWidth="1.5" />
          <text x="4" y={80 - rsiSell * 0.8 - 3} fill={C.red} fontSize="8" fontFamily="monospace">매도 {rsiSell}</text>
          <text x="4" y={80 - rsiBuy * 0.8 + 10} fill={C.green} fontSize="8" fontFamily="monospace">매수 {rsiBuy}</text>
        </svg>
      </div>
    </div>
  );
  if (strategy === "ma") return (
    <div style={S.panel} className="slide-in">
      <PanelHeader label="이동평균 전략 설정" C={C} />
      <div style={S.grid("1fr 1fr")}>
        <InputField label="단기 이동평균" type="number" defaultValue={5} C={C} />
        <InputField label="장기 이동평균" type="number" defaultValue={20} C={C} />
      </div>
      <div style={{ marginTop: 12, padding: 12, background: `${C.green}10`, border: `1px solid ${C.green}20`, borderRadius: 4, fontSize: 12, color: C.muted }}>
        💡 단기선 상향 돌파 → 매수 (골든크로스) / 하향 돌파 → 매도 (데드크로스)
      </div>
    </div>
  );
  if (strategy === "bb") return (
    <div style={S.panel} className="slide-in">
      <PanelHeader label="볼린저밴드 전략 설정" C={C} />
      <div style={S.grid("1fr 1fr")}>
        <InputField label="기간" type="number" defaultValue={20} C={C} />
        <InputField label="표준편차 배수" type="number" defaultValue={2} step={0.1} C={C} />
      </div>
    </div>
  );
  if (strategy === "custom") return (
    <div style={S.panel} className="slide-in">
      <PanelHeader label="커스텀 조건 설정" C={C} />
      <div style={S.grid("1fr 1fr")}>
        {["매수 조건 1", "매수 조건 2", "매도 조건 1", "매도 조건 2"].map(label => (
          <InputField key={label} label={label} type="text" placeholder="예: RSI < 30" C={C} />
        ))}
      </div>
    </div>
  );
  return null;
}

// ════════════════════════════════════════════════════════
//  13. 메인 컴포넌트
// ════════════════════════════════════════════════════════

export default function StockDashboard() {

  // ── 테마 ──────────────────────────────────────────────
  const [isDark, setIsDark] = useState(true);
  const C = THEME[isDark ? "dark" : "light"];
  const S = makeS(C);

  // ── State ─────────────────────────────────────────────
  const [tab, setTab] = useState("dashboard");
  const [selectedStock, setSelectedStock] = useState(MOCK_STOCKS[0]);
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("rsi");
  const [orderType, setOrderType] = useState("limit");
  const [orderQty, setOrderQty] = useState(10);
  const [orderPrice, setOrderPrice] = useState(74800);
  const [stopLoss, setStopLoss] = useState(3);
  const [takeProfit, setTakeProfit] = useState(5);
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [rsiBuy, setRsiBuy] = useState(30);
  const [rsiSell, setRsiSell] = useState(70);
  const [logs, setLogs] = useState([
    { time: "09:01:32", type: "info", msg: "자동매매 시스템 시작" },
    { time: "09:15:44", type: "buy", msg: "삼성전자 10주 매수 @ 73,600" },
    { time: "10:23:11", type: "info", msg: "RSI 신호 감지 중..." },
    { time: "11:45:02", type: "sell", msg: "삼성전자 10주 매도 @ 74,800 (+1,200)" },
  ]);
  const [holdings] = useState([
    { code: "005930", name: "삼성전자", qty: 20, avgPrice: 73200, currentPrice: 74800 },
    { code: "035420", name: "NAVER", qty: 5, avgPrice: 194500, currentPrice: 198000 },
  ]);
  const [time, setTime] = useState(new Date());
  const [prices, setPrices] = useState(MOCK_STOCKS.map(s => [s.price]));

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      setPrices(prev => prev.map(arr => [...arr.slice(-20), arr[arr.length - 1] + (Math.random() - 0.5) * 200]));
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const totalEval = holdings.reduce((s, h) => s + h.qty * h.currentPrice, 0);
  const totalProfit = holdings.reduce((s, h) => s + h.qty * (h.currentPrice - h.avgPrice), 0);
  const placeOrder = side => setLogs(prev => [{ time: fmtTime(new Date()), type: side, msg: `${selectedStock.name} ${orderQty}주 ${side === "buy" ? "매수" : "매도"} @ ${fmt(orderPrice)}` }, ...prev]);
  const tabAccent = t => t === "closing" ? C.yellow : t === "yw-pick" ? C.yellow : C.accent;

  return (
    <div className="theme-transition" style={{ fontFamily: FONTS.sans, background: C.bg, minHeight: "100vh", color: C.text, fontSize: 13 }}>
      <style>{makeCSS(C, isDark)}</style>

      {/* ── 헤더 ── */}
      <header style={{ background: C.header, borderBottom: `1px solid ${C.border}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: isDark ? "none" : "0 1px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 16, fontWeight: 600, color: C.accent, letterSpacing: 2 }}>
            ◈ <span style={{ color: C.yellow }}>YW</span><span style={{ color: C.green }}>TRADE</span>
          </div>
          <div style={{ width: 1, height: 20, background: C.border }} />
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", padding: "4px 8px", color: tab === t.id ? tabAccent(t.id) : C.muted, borderBottom: tab === t.id ? `2px solid ${tabAccent(t.id)}` : "2px solid transparent" }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* 자동매매 상태 */}
          <div className={autoEnabled ? "pulse" : ""} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className={autoEnabled ? "blink" : ""} style={{ width: 6, height: 6, borderRadius: "50%", background: autoEnabled ? C.green : C.muted }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: autoEnabled ? C.green : C.muted }}>{autoEnabled ? "AUTO ON" : "AUTO OFF"}</span>
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.muted }}>{fmtTime(time)}</span>
          <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px 10px", fontSize: 11, color: C.yellow }}>
            KRW 12,845,320
          </div>
          {/* 다크/라이트 토글 */}
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(v => !v)} C={C} />
        </div>
      </header>

      {/* ── 컨텐츠 ── */}
      <main style={{ padding: 16, maxWidth: 1400, margin: "0 auto" }}>

        {/* ━━━ 대시보드 ━━━ */}
        {tab === "dashboard" && (
          <div style={S.grid("320px 1fr")}>
            {/* 관심종목 */}
            <div style={{ ...S.panel, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={S.monoLabel}>WATCHLIST</span>
                <span style={{ fontSize: 10, color: C.muted }}>실시간</span>
              </div>
              {MOCK_STOCKS.map((s, i) => (
                <div key={s.code} onClick={() => setSelectedStock(s)} style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}20`, cursor: "pointer", transition: "background 0.2s", background: selectedStock.code === s.code ? C.selected : "transparent", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.text }}>{s.name}</div>
                    <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 10, color: C.muted }}>{s.code}</div>
                  </div>
                  <MiniChart data={prices[i]} color={s.change >= 0 ? C.green : C.red} />
                  <div style={{ textAlign: "right", minWidth: 80 }}>
                    <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 13, color: C.text }}>{fmt(s.price)}</div>
                    <ChangeText value={s.changeRate} C={C} />
                  </div>
                </div>
              ))}
            </div>

            {/* 차트 + 주문 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ ...S.panel, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
                    {selectedStock.name} <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 12, color: C.muted }}>{selectedStock.code}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
                    <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 24, color: selectedStock.change >= 0 ? C.green : C.red }}>{fmt(selectedStock.price)}</span>
                    <ChangeText value={selectedStock.changeRate} C={C} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[["고가", selectedStock.high, C.green], ["저가", selectedStock.low, C.red], ["거래량", selectedStock.volume, C.yellow]].map(([label, val, col]) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: C.muted }}>{label}</div>
                      <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 12, color: col }}>{typeof val === "number" && val > 100000 ? `${(val / 10000).toFixed(0)}만` : fmt(val)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...S.panel, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={S.monoLabel}>CANDLE · 1MIN</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["1분", "5분", "1시간", "1일"].map(p => (
                      <button key={p} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 3, color: C.muted, fontSize: 10, padding: "2px 8px", cursor: "pointer", fontFamily: FONTS.mono }}>{p}</button>
                    ))}
                  </div>
                </div>
                <CandleChart candles={CANDLE_DATA} C={C} />
              </div>

              <div style={{ ...S.panel, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <PanelHeader label="주문 유형" C={C} />
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    {[["limit", "지정가"], ["market", "시장가"]].map(([val, label]) => (
                      <button key={val} onClick={() => setOrderType(val)} style={{ flex: 1, padding: 6, cursor: "pointer", borderRadius: 4, fontSize: 12, border: `1px solid ${orderType === val ? C.accent : C.border}`, background: orderType === val ? `${C.accent}20` : "transparent", color: orderType === val ? C.accent : C.muted }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                    <InputField label="수량" type="number" value={orderQty} onChange={e => setOrderQty(+e.target.value)} C={C} />
                    <InputField label="가격" type="number" value={orderPrice} onChange={e => setOrderPrice(+e.target.value)} C={C} />
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>
                    총 주문금액: <span style={{ color: C.yellow, fontFamily: FONTS.mono, fontWeight: 600 }}>{fmt(orderQty * orderPrice)}원</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["buy", "매수", C.green], ["sell", "매도", C.red]].map(([side, label, col]) => (
                      <button key={side} onClick={() => placeOrder(side)} style={{ flex: 1, padding: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, borderRadius: 4, background: `${col}20`, border: `1px solid ${col}`, color: col }}>{label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <PanelHeader label="호가창" C={C} />
                  {[...Array(5)].map((_, i) => (
                    <div key={`ask-${i}`} style={{ display: "flex", justifyContent: "space-between", padding: "3px 6px", background: `${C.red}10`, marginBottom: 1, borderRadius: 2, fontSize: 11 }}>
                      <span style={{ color: C.red, fontFamily: FONTS.mono, fontWeight: 600 }}>{fmt(selectedStock.price + (5 - i) * 100)}</span>
                      <span style={{ color: C.muted }}>{(Math.random() * 5000 | 0).toLocaleString()}</span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: C.accent, margin: "4px 0", opacity: 0.4 }} />
                  {[...Array(5)].map((_, i) => (
                    <div key={`bid-${i}`} style={{ display: "flex", justifyContent: "space-between", padding: "3px 6px", background: `${C.green}10`, marginBottom: 1, borderRadius: 2, fontSize: 11 }}>
                      <span style={{ color: C.green, fontFamily: FONTS.mono, fontWeight: 600 }}>{fmt(selectedStock.price - i * 100)}</span>
                      <span style={{ color: C.muted }}>{(Math.random() * 5000 | 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ━━━ 자동매매 ━━━ */}
        {tab === "auto" && (
          <div style={S.grid("280px 1fr")}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={S.panel}>
                <PanelHeader label="자동매매 제어" C={C} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 13, color: C.text }}>자동매매 활성화</span>
                  <div onClick={() => setAutoEnabled(v => !v)} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", position: "relative", transition: "background 0.3s", background: autoEnabled ? C.green : C.border }}>
                    <div style={{ position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)", left: autoEnabled ? 22 : 2 }} />
                  </div>
                </div>
                {autoEnabled && <div className="blink" style={{ fontSize: 11, color: C.green, textAlign: "center", padding: 6, background: `${C.green}10`, borderRadius: 4, border: `1px solid ${C.green}30` }}>● 자동매매 실행 중</div>}
              </div>
              <div style={S.panel}>
                <PanelHeader label="전략 선택" C={C} />
                {AUTO_STRATEGIES.map(s => (
                  <div key={s.id} onClick={() => setSelectedStrategy(s.id)} style={{ padding: "10px 12px", borderRadius: 4, marginBottom: 6, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${selectedStrategy === s.id ? C.accent : C.border}`, background: selectedStrategy === s.id ? `${C.accent}12` : "transparent" }}>
                    <div style={{ fontWeight: 500, color: selectedStrategy === s.id ? C.accent : C.text }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={S.panel}>
                <PanelHeader label="리스크 관리" C={C} />
                <SliderField label="손절 비율" value={stopLoss} min={1} max={20} onChange={setStopLoss} color={C.red} C={C} />
                <SliderField label="익절 비율" value={takeProfit} min={1} max={30} onChange={setTakeProfit} color={C.green} C={C} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <StrategyPanel strategy={selectedStrategy} rsiPeriod={rsiPeriod} rsiBuy={rsiBuy} rsiSell={rsiSell} setRsiPeriod={setRsiPeriod} setRsiBuy={setRsiBuy} setRsiSell={setRsiSell} C={C} />
              <div style={S.panel}>
                <PanelHeader label="매매 대상 종목" C={C} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {MOCK_STOCKS.map(s => <div key={s.code} style={{ padding: "4px 10px", border: `1px solid ${C.border}`, borderRadius: 20, fontSize: 12, cursor: "pointer", color: C.muted }}>{s.name}</div>)}
                  <div style={{ padding: "4px 10px", border: `1px dashed ${C.accent}`, borderRadius: 20, fontSize: 12, cursor: "pointer", color: C.accent }}>+ 추가</div>
                </div>
              </div>
              <div style={S.panel}>
                <PanelHeader label="전략 성과 (시뮬레이션)" C={C} />
                <div style={S.grid("repeat(4,1fr)")}>
                  {[["총 수익률", "+12.4%", C.green], ["승률", "64%", C.accent], ["총 거래횟수", "128회", C.yellow], ["최대 낙폭", "-4.2%", C.red]].map(([label, val, col]) => (
                    <div key={label} style={{ textAlign: "center", padding: 12, background: C.panelAlt, borderRadius: 4, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{label}</div>
                      <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: 16, color: col }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ━━━ 종가베팅 ━━━ */}
        {tab === "closing" && <ClosingTab C={C} />}

        {/* ━━━ YW's Pick ━━━ */}
        {tab === "yw-pick" && <YwPickTab C={C} />}

        {/* ━━━ 포트폴리오 ━━━ */}
        {tab === "portfolio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="slide-in">
            <div style={S.grid("repeat(4,1fr)")}>
              <StatCard label="예수금" value="12,845,320" color={C.yellow} unit="원" C={C} />
              <StatCard label="평가금액" value={fmt(totalEval)} color={C.accent} unit="원" C={C} />
              <StatCard label="평가손익" value={fmt(totalProfit)} color={totalProfit >= 0 ? C.green : C.red} unit="원" C={C} />
              <StatCard label="수익률" value="+3.2%" color={C.green} C={C} />
            </div>
            <div style={S.panel}>
              <PanelHeader label="보유 종목" C={C} />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["종목명", "코드", "보유수량", "평균단가", "현재가", "평가손익", "수익률"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, color: C.muted, fontWeight: 400, fontFamily: FONTS.mono, letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holdings.map(h => {
                    const pl = (h.currentPrice - h.avgPrice) * h.qty;
                    const plr = ((h.currentPrice - h.avgPrice) / h.avgPrice * 100).toFixed(2);
                    const color = pl >= 0 ? C.green : C.red;
                    return (
                      <tr key={h.code} style={{ borderBottom: `1px solid ${C.border}20` }}>
                        <td style={{ padding: 12, fontWeight: 500, color: C.text }}>{h.name}</td>
                        <td style={{ padding: 12, textAlign: "right", fontFamily: FONTS.mono, color: C.muted, fontSize: 11 }}>{h.code}</td>
                        <td style={{ padding: 12, textAlign: "right", fontFamily: FONTS.mono, color: C.text }}>{h.qty}</td>
                        <td style={{ padding: 12, textAlign: "right", fontFamily: FONTS.mono, color: C.text }}>{fmt(h.avgPrice)}</td>
                        <td style={{ padding: 12, textAlign: "right", fontFamily: FONTS.mono, color: C.text }}>{fmt(h.currentPrice)}</td>
                        <td style={{ padding: 12, textAlign: "right", fontFamily: FONTS.mono, color }}>{pl >= 0 ? "+" : ""}{fmt(pl)}</td>
                        <td style={{ padding: 12, textAlign: "right", fontFamily: FONTS.mono, color }}>{+plr >= 0 ? "+" : ""}{plr}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ━━━ 로그 ━━━ */}
        {tab === "log" && (
          <div style={S.panel} className="slide-in">
            <PanelHeader label="매매 로그" C={C} />
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, maxHeight: 500, overflowY: "auto" }}>
              {logs.map((log, i) => {
                const col = log.type === "buy" ? C.green : log.type === "sell" ? C.red : C.border;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "6px 10px", marginBottom: 2, borderRadius: 3, background: log.type === "buy" ? `${C.green}10` : log.type === "sell" ? `${C.red}10` : C.panelAlt, borderLeft: `2px solid ${col}` }}>
                    <span style={{ color: C.muted, minWidth: 70 }}>{log.time}</span>
                    <span style={{ color: col, minWidth: 40 }}>[{log.type.toUpperCase()}]</span>
                    <span style={{ color: C.text }}>{log.msg}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}