import { useState, useEffect, Fragment } from "react";

// ════════════════════════════════════════════════════════
//  버전 정보 — 여기서 관리
// ════════════════════════════════════════════════════════
const APP_VERSION  = "1.5.3";
const APP_DATE     = "2026-03-07";

// ════════════════════════════════════════════════════════
//  1. 테마 & 색상
// ════════════════════════════════════════════════════════

const THEME = {
  dark: {
    bg:          "#070d14",
    header:      "#0b1520",
    headerText:  "#e2edf7",   // 헤더 전용 텍스트
    headerMuted: "#7da6c8",   // 헤더 전용 보조 텍스트
    headerBorder:"#1e3550",   // 헤더 전용 구분선
    panel:       "#0f1e2e",
    panelAlt:    "#0b1520",
    border:      "#1e3550",
    accent:      "#38bdf8",   // 더 밝은 하늘색 → 강조 텍스트 선명
    green:       "#34d679",   // 더 밝고 선명한 초록
    red:         "#f87171",   // 부드러운 붉은색 (눈부심 감소)
    text:        "#e2edf7",   // 밝은 흰색 계열 → 본문 가독성 UP
    muted:       "#7da6c8",   // 기존보다 훨씬 밝아진 보조 텍스트
    yellow:      "#fbbf24",   // 선명한 노란색
    selected:    "#112840",
    scrollTrack: "#0f1923",
    scrollThumb: "#1e3a5a",
    inputBg:     "#0b1520",
    inputBorder: "#1e3a5a",
    shimmer1:    "#0f1e2e",
    shimmer2:    "#182e44",
    panelShadow: undefined,
  },
  light: {
    bg:          "#eef2f7",   // 따뜻한 청회색 배경 — 카드와 구분감
    header:      "#1e3a5f",   // 다크 네이비 헤더 — 로고·메뉴 고대비
    headerText:  "#e8f0fa",   // 헤더 전용 텍스트 (밝은 흰빛)
    headerMuted: "#8eb4d8",   // 헤더 전용 보조 텍스트
    headerBorder:"#2e5480",   // 헤더 전용 구분선
    panel:       "#ffffff",   // 순백 카드 — 배경과 명확히 분리
    panelAlt:    "#f0f5fb",   // 패널 내 보조 영역 (infoBox, 입력창)
    border:      "#b8cfe4",   // 선명한 테두리
    accent:      "#0057b8",   // 진한 로열블루 — 흰 배경 WCAG AA 충족
    green:       "#0a7c3e",   // 진한 에메랄드 — 충분한 대비
    red:         "#c0392b",   // 진한 레드 — 가독성 확보
    text:        "#0d1b2e",   // 거의 검정 — 본문 최고 대비
    muted:       "#3d5572",   // 중간 톤 — 보조 텍스트 충분한 대비
    yellow:      "#9a5a00",   // 진한 앰버 — 흰 배경 가독성
    selected:    "#cfe3f7",   // 선택 행 하이라이트
    scrollTrack: "#dde6ef",
    scrollThumb: "#8aaac8",
    inputBg:     "#f8fbff",   // 입력창 배경 (panel보다 살짝 밝게)
    inputBorder: "#9ab8d4",   // 입력창 테두리 — border보다 진하게
    shimmer1:    "#e4edf6",
    shimmer2:    "#f2f7fc",
    panelShadow: "0 1px 4px rgba(30,58,95,0.08), 0 0 0 1px rgba(30,58,95,0.04)",
  },
};

const FONTS = {
  mono:   "'Noto Sans KR', sans-serif",
  sans:   "'Noto Sans KR', sans-serif",
  header: "'IBM Plex Mono', monospace",
};

const TABS = [
  { id: "menu_dashboard", label: "대시보드" },
  { id: "menu_closing",   label: "⚡ 종가베팅" },
  { id: "menu_yw-pick",   label: "⭐ 영욱문" },
  { id: "menu_theme",     label: "🔥 주도/테마" },
  { id: "menu_auto",      label: "자동매매",    adminOnly: true },
  { id: "menu_portfolio", label: "포트폴리오",  adminOnly: true },
  { id: "menu_log",       label: "로그",        adminOnly: true },
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
  // ── 반도체·IT ──────────────────────────────────────
  { ticker: "005930.KS", name: "삼성전자" },
  { ticker: "000660.KS", name: "SK하이닉스" },
  { ticker: "009150.KS", name: "삼성전기" },
  { ticker: "066570.KS", name: "LG전자" },
  // ── 인터넷·플랫폼·게임 ────────────────────────────
  { ticker: "035420.KS", name: "NAVER" },
  { ticker: "035720.KS", name: "카카오" },
  { ticker: "259960.KS", name: "크래프톤" },
  { ticker: "036570.KS", name: "엔씨소프트" },
  { ticker: "251270.KS", name: "넷마블" },
  // ── 자동차·부품 ─────────────────────────────────────
  { ticker: "005380.KS", name: "현대차" },
  { ticker: "000270.KS", name: "기아" },
  { ticker: "012330.KS", name: "현대모비스" },
  // ── 2차전지·에너지 ──────────────────────────────────
  { ticker: "373220.KS", name: "LG에너지솔루션" },
  { ticker: "006400.KS", name: "삼성SDI" },
  { ticker: "051910.KS", name: "LG화학" },
  { ticker: "247540.KS", name: "에코프로비엠" },
  { ticker: "096770.KS", name: "SK이노베이션" },
  { ticker: "010950.KS", name: "S-Oil" },
  // ── 바이오·헬스케어 ─────────────────────────────────
  { ticker: "207940.KS", name: "삼성바이오로직스" },
  { ticker: "068270.KS", name: "셀트리온" },
  { ticker: "128940.KS", name: "한미약품" },
  { ticker: "000100.KS", name: "유한양행" },
  { ticker: "326030.KS", name: "SK바이오팜" },
  // ── 금융 ───────────────────────────────────────────
  { ticker: "105560.KS", name: "KB금융" },
  { ticker: "055550.KS", name: "신한지주" },
  { ticker: "086790.KS", name: "하나금융지주" },
  { ticker: "316140.KS", name: "우리금융지주" },
  { ticker: "000810.KS", name: "삼성화재" },
  // ── 철강·소재·화학 ──────────────────────────────────
  { ticker: "005490.KS", name: "POSCO홀딩스" },
  { ticker: "011170.KS", name: "롯데케미칼" },
  { ticker: "004020.KS", name: "현대제철" },
  // ── 건설·중공업·방산 ────────────────────────────────
  { ticker: "012450.KS", name: "한화에어로스페이스" },
  { ticker: "047810.KS", name: "한국항공우주" },
  { ticker: "034020.KS", name: "두산에너빌리티" },
  { ticker: "000720.KS", name: "현대건설" },
  // ── 유통·통신·운송 ──────────────────────────────────
  { ticker: "017670.KS", name: "SK텔레콤" },
  { ticker: "030200.KS", name: "KT" },
  { ticker: "003490.KS", name: "대한항공" },
  { ticker: "011200.KS", name: "HMM" },
  { ticker: "033780.KS", name: "KT&G" },
];

// YW's Pick 전용 스캔 종목 — WATCH_TICKERS + 추가 70종목 (코스피/코스닥 대형주)
const YW_PICK_TICKERS = [
  ...WATCH_TICKERS,
  // ── 추가: 반도체·디스플레이 ────────────────────────
  { ticker: "034730.KS", name: "SK스퀘어" },
  { ticker: "000990.KS", name: "DB하이텍" },
  { ticker: "336370.KS", name: "솔루스첨단소재" },
  { ticker: "078600.KS", name: "대주전자재료" },
  // ── 추가: 게임·엔터 ────────────────────────────────
  { ticker: "251270.KS", name: "넷마블" },
  { ticker: "041510.KS", name: "에스엠" },
  { ticker: "035900.KS", name: "JYP Ent." },
  { ticker: "122870.KS", name: "와이지엔터테인먼트" },
  // ── 추가: 자동차 부품·모빌리티 ─────────────────────
  { ticker: "011210.KS", name: "현대위아" },
  { ticker: "018880.KS", name: "한온시스템" },
  { ticker: "204320.KS", name: "HL만도" },
  // ── 추가: 2차전지 소재·장비 ────────────────────────
  { ticker: "006490.KS", name: "LS MnM" },
  { ticker: "382800.KS", name: "엔켐" },
  { ticker: "450080.KS", name: "에코프로" },
  { ticker: "272290.KS", name: "이노메트리" },
  // ── 추가: 바이오 ───────────────────────────────────
  { ticker: "145020.KS", name: "휴젤" },
  { ticker: "196170.KS", name: "알테오젠" },
  { ticker: "009420.KS", name: "한미사이언스" },
  { ticker: "056090.KS", name: "이노테라피" },
  // ── 추가: 금융·증권 ────────────────────────────────
  { ticker: "032830.KS", name: "삼성생명" },
  { ticker: "071050.KS", name: "한국금융지주" },
  { ticker: "030610.KS", name: "교보증권" },
  { ticker: "003540.KS", name: "대신증권" },
  // ── 추가: 철강·소재·화학 ───────────────────────────
  { ticker: "006260.KS", name: "LS" },
  { ticker: "010060.KS", name: "OCI홀딩스" },
  { ticker: "069260.KS", name: "휴켐스" },
  { ticker: "004000.KS", name: "롯데정밀화학" },
  // ── 추가: 건설·인프라 ──────────────────────────────
  { ticker: "000880.KS", name: "한화" },
  { ticker: "007070.KS", name: "GS리테일" },
  { ticker: "006360.KS", name: "GS건설" },
  // ── 추가: 유통·소비 ────────────────────────────────
  { ticker: "028260.KS", name: "삼성물산" },
  { ticker: "004170.KS", name: "신세계" },
  { ticker: "139480.KS", name: "이마트" },
  { ticker: "023530.KS", name: "롯데쇼핑" },
  { ticker: "069960.KS", name: "현대백화점" },
  // ── 추가: 통신·미디어 ──────────────────────────────
  { ticker: "032640.KS", name: "LG유플러스" },
  { ticker: "036460.KS", name: "한국가스공사" },
  { ticker: "015760.KS", name: "한국전력" },
  // ── 추가: 운송·물류 ────────────────────────────────
  { ticker: "086280.KS", name: "현대글로비스" },
  { ticker: "000120.KS", name: "CJ대한통운" },
  // ── 추가: 음식료·생활 ──────────────────────────────
  { ticker: "097950.KS", name: "CJ제일제당" },
  { ticker: "001040.KS", name: "CJ" },
  { ticker: "010130.KS", name: "고려아연" },
  { ticker: "008770.KS", name: "호텔신라" },
  // ── 코스닥 대형주 ───────────────────────────────────
  { ticker: "091990.KQ", name: "셀트리온헬스케어" },
  { ticker: "263750.KQ", name: "펄어비스" },
  { ticker: "293490.KQ", name: "카카오게임즈" },
  { ticker: "357780.KQ", name: "솔브레인" },
  { ticker: "140610.KQ", name: "에코프로에이치엔" },
  { ticker: "214150.KQ", name: "클래시스" },
  { ticker: "039030.KQ", name: "이오테크닉스" },
  { ticker: "089490.KQ", name: "세경하이테크" },
  // ── 추가: 엄마픽 ───────────────────────────────────
  { ticker: "042700.KS", name: "한미반도체" },
  { ticker: "277810.KQ", name: "레인보우로보틱스" },
  { ticker: "058470.KQ", name: "리노공업" },
  { ticker: "240810.KQ", name: "원익IPS" },
  { ticker: "000720.KS", name: "현대건설" },
  { ticker: "006400.KS", name: "삼성SDI" },
  { ticker: "034020.KS", name: "두산에너빌리티" },
  { ticker: "005380.KS", name: "현대차" },
  { ticker: "298380.KQ", name: "에이비엘바이오" },
  { ticker: "950160.KQ", name: "코오롱티슈진" },
  { ticker: "310210.KQ", name: "보로노이" },
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
//API 호출 사이의 대기 시간을 만드는 함수
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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
  /*
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3mo`;
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  
  const chart = JSON.parse((await (await fetch(proxy)).json()).contents).chart.result[0];
  */

  //로컬 백엔드 사용
  //const myProxyUrl = `http://localhost:3001/api/yahoo?ticker=${ticker}`;
  //무료 클라우드 render 사용
  const myProxyUrl = `https://trade-backend-3o2e.onrender.com/api/yahoo?ticker=${ticker}`;
  const response = await fetch(myProxyUrl);
  if (!response.ok) throw new Error("네트워크 응답이 좋지 않습니다.");
  const data = await response.json();
  const chart = data.chart.result[0];
  //로컬 백엔드 종료
  
  const closes = chart.indicators.quote[0].close.filter(Boolean);
  const volumes = chart.indicators.quote[0].volume.filter(Boolean);
  const prices = chart.indicators.quote[0].close.filter(Boolean); // closes와 동일
  const meta = chart.meta;

  const price = meta.regularMarketPrice;
  const prevClose = meta.previousClose || meta.chartPreviousClose;
  const changeRate = ((price - prevClose) / prevClose) * 100;

  // 거래량 통계 — 최근 n일 평균
  const avg = (arr, n) => arr.slice(-n).reduce((a, b) => a + b, 0) / Math.min(n, arr.length);
  const lastVol = volumes[volumes.length - 1];
  const vol3dAvg = Math.round(avg(volumes, 3));
  const vol5dAvg = Math.round(avg(volumes, 5));
  const vol20dAvg = Math.round(avg(volumes, 20));
  const volRate = Math.round((lastVol / (vol20dAvg || 1)) * 100);

  // 거래대금 통계 (원) — 최근 n일 종가 × 거래량 평균
  const tradingValues = closes.map((c, i) => (c || 0) * (volumes[i] || 0)).filter(Boolean);
  const tv3dAvg = Math.round(avg(tradingValues, 3));
  const tv5dAvg = Math.round(avg(tradingValues, 5));
  const tv20dAvg = Math.round(avg(tradingValues, 20));

  const rsi = calcRSI(closes);
  const bb = calcBB(closes);
  const env = calcEnvelope(closes);
  const score = calcScore(rsi, volRate, bb.pos);

  return {
    price, prevClose, changeRate,
    // 거래량
    volume: lastVol,
    vol3dAvg, vol5dAvg, vol20dAvg,
    volRate,
    // 거래대금
    tradingValue: Math.round(price * lastVol),
    tv3dAvg, tv5dAvg, tv20dAvg,
    // 지표
    rsi, bb: bb.label, bbPos: bb.pos,
    env,
    score, signal: getSignal(score),
    reason: buildReason(rsi, volRate, bb.label),
    closes,
  };
}

// ════════════════════════════════════════════════════════
//  6. 스타일 시스템 (테마 반응형)
// ════════════════════════════════════════════════════════

const makeCSS = (C, isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; font-family: 'Noto Sans KR', sans-serif; transition: background 0.3s; }
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
  html, body { overflow-x: hidden; max-width: 100vw; }
  .mobile-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 12px; }
  .mobile-scroll-x { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  @media (max-width: 600px) {
    .hide-mobile { display: none !important; }
    .hamburger-btn { display: flex !important; }
    .header-tabs   { display: none !important; }
    .stat-grid-4   { grid-template-columns: repeat(2, 1fr) !important; }
    .stat-grid-6   { grid-template-columns: repeat(2, 1fr) !important; }
    .market-grid   { grid-template-columns: repeat(2, 1fr) !important; }
    .stat-grid-3   { grid-template-columns: repeat(2, 1fr) !important; }
    .rank-grid-2   { grid-template-columns: 1fr !important; }
    .filter-grid   { grid-template-columns: 1fr !important; }
    .header-right  { gap: 6px !important; }
    .main-padding  { padding: 10px !important; }
  }
`;

const makeS = C => ({
  panel: { background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, boxShadow: C.panelShadow || 'none' },
  monoLabel: { fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, letterSpacing: 1 },
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
        borderRadius: 20, cursor: "pointer", fontSize: "0.846em", fontFamily: FONTS.mono,
        border: `1px solid ${C.headerBorder}`,
        background: isDark ? "#1a2d42" : "#e0f0ff",
        color: isDark ? C.yellow : C.accent,
        transition: "all 0.25s",
        whiteSpace: "nowrap",
      }}
    >
      {/* 트랙 */}
      <div style={{ position: "relative", width: 32, height: 16, borderRadius: 8, background: isDark ? "#0d1a27" : "#bae6fd", border: `1px solid ${C.headerBorder}`, flexShrink: 0, transition: "background 0.25s" }}>
        {/* 썸 */}
        <div style={{
          position: "absolute", top: 2,
          left: isDark ? 16 : 2,
          width: 10, height: 10, borderRadius: "50%",
          background: isDark ? C.yellow : C.accent,
          transition: "left 0.25s, background 0.25s",
          boxShadow: isDark ? `0 0 4px ${C.yellow}80` : `0 0 4px ${C.accent}80`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.462em",
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

// 진행률 바 + 미니 스피너 공용 컴포넌트
function ProgressBar({ current, total, accentColor, C }) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  const col = accentColor || C.accent;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {/* 미니 이중 스피너 */}
      <div style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
        <div className="spin" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: col }} />
        <div className="spin" style={{ position: "absolute", inset: 3, borderRadius: "50%", border: `1.5px solid ${C.border}`, borderTopColor: C.yellow, animationDirection: "reverse", animationDuration: "0.6s" }} />
      </div>
      {/* 바 + 퍼센트 */}
      <div style={{ flex: 1 }}>
        <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: `linear-gradient(to right, ${col}, ${C.green})`, transition: "width 0.35s ease" }} />
        </div>
      </div>
      <span style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, minWidth: 52, textAlign: "right" }}>
        {current} / {total}
      </span>
    </div>
  );
}

function LoadingOverlay({ message, C }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(7,13,20,0.82)", zIndex: 999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }}>
      <div style={{ position: "relative", width: 64, height: 64, marginBottom: 20 }}>
        <div className="spin" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.accent }} />
        <div className="spin" style={{ position: "absolute", inset: 8, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.yellow, animationDirection: "reverse", animationDuration: "0.7s" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONTS.mono, fontSize: "1.231em", color: C.accent }}>◈</div>
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: "1em", color: C.text, marginBottom: 6 }}>{message}</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: "0.846em", color: C.muted }}>Yahoo Finance API 호출 중...</div>
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

function MiniChart({ data, color, width = 80, height = 36 }) {
  const W = width, H = height;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const x = (i) => (i / (data.length - 1)) * W;
  const y = (v) => H - ((v - min) / range) * (H - 4) - 2;
  const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const fillPts = `0,${H} ` + pts + ` ${W},${H}`;
  return (
    <svg width={W} height={H} style={{ display: "block", width: "100%" }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`mg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#mg-${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
    <span style={{ fontSize: "0.846em", padding: "2px 8px", borderRadius: 10, background: `${col}20`, color: col, border: `1px solid ${col}40` }}>
      {signalIcon(signal)} {signal}
    </span>
  );
}

function PanelHeader({ label, right, C }) {
  const S = makeS(C);
  return (
    <div style={{ ...S.flex(0), justifyContent: "space-between", marginBottom: 12 }}>
      <span style={S.monoLabel}>{label}</span>
      {right && <span style={{ fontSize: "0.769em", color: C.muted }}>{right}</span>}
    </div>
  );
}

function StatCard({ label, value, color, unit = "", C, onClick }) {
  return (
    <div onClick={onClick} style={{ background: C.panel, border: `1px solid ${onClick ? color : C.border}`, borderRadius: 6, padding: 16, textAlign: "center", cursor: onClick ? "pointer" : "default", transition: "all 0.2s", boxShadow: onClick ? `0 0 0 0px ${color}` : "none" }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.boxShadow = `0 0 0 2px ${color}30`; }}}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.background = C.panel; e.currentTarget.style.boxShadow = "none"; }}}
    >
      <div style={{ fontSize: "0.846em", color: C.muted, marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        {label}
        {onClick && <span style={{ fontSize: "0.8em", color: color, opacity: 0.7 }}>↗</span>}
      </div>
      <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "1.538em", color }}>
        {value}<span style={{ fontSize: "0.846em", marginLeft: 2 }}>{unit}</span>
      </div>
    </div>
  );
}


// 섹터 분류용 ticker prefix 매핑 (간이)
const TICKER_SECTOR_HINT = t => {
  const g = [
    ["반도체·IT",       ["005930","000660","009150","066570","042700","034730","000990","039030","089490","277810","058470","240810"]],
    ["인터넷·게임·엔터", ["035420","035720","259960","036570","251270","041510","035900","122870","263750","293490"]],
    ["자동차·부품",     ["005380","000270","012330","011210","018880","204320","086280"]],
    ["2차전지·에너지",  ["373220","006400","051910","247540","096770","010950","006490","382800","450080","272290","140610"]],
    ["바이오·헬스",     ["207940","068270","128940","000100","326030","145020","196170","009420","056090","091990","298380","950160","310210","214150"]],
    ["금융·보험·증권",  ["105560","055550","086790","316140","000810","032830","071050","030610","003540"]],
    ["철강·소재·화학",  ["005490","011170","004020","006260","010060","069260","004000","010130"]],
    ["건설·중공업·방산",["012450","047810","034020","000720","000880","006360"]],
    ["유통·소비·식품",  ["028260","004170","139480","023530","069960","007070","097950","001040","008770"]],
    ["통신·미디어·운송",["017670","030200","003490","011200","033780","032640","036460","015760","000120"]],
  ];
  const code = t.ticker.split(".")[0];
  for (const [sector, codes] of g) {
    if (codes.includes(code)) return sector;
  }
  return "기타";
};

function TickerListModal({ tickers, title, accentColor, C, onClose, onAdd, onDelete }) {
  const [search,    setSearch]    = useState("");
  const [addName,   setAddName]   = useState("");
  const [addTicker, setAddTicker] = useState("");
  const [addMarket, setAddMarket] = useState("KS"); // KS=KOSPI, KQ=KOSDAQ
  const [addError,  setAddError]  = useState("");
  const [addOk,     setAddOk]     = useState(false);
  const [confirmDel, setConfirmDel] = useState(null); // ticker string

  const grouped = {};
  tickers.forEach(t => {
    const s = TICKER_SECTOR_HINT(t);
    if (!grouped[s]) grouped[s] = [];
    grouped[s].push(t);
  });

  const filtered = search.trim()
    ? tickers.filter(t => t.name.includes(search) || t.ticker.includes(search))
    : null;
  const displayGroups = filtered ? { "검색 결과": filtered } : grouped;

  const handleAdd = () => {
    const name   = addName.trim();
    const code   = addTicker.trim().replace(/\D/g, "");
    if (!name)  { setAddError("종목명을 입력하세요."); return; }
    if (code.length < 5 || code.length > 6) { setAddError("종목코드는 5~6자리 숫자입니다."); return; }
    const ticker = `${code}.${addMarket}`;
    if (tickers.find(t => t.ticker === ticker)) { setAddError("이미 등록된 종목입니다."); return; }
    onAdd({ name, ticker });
    setAddName(""); setAddTicker(""); setAddError("");
    setAddOk(true);
    setTimeout(() => setAddOk(false), 2000);
  };

  const handleDelete = (ticker) => {
    onDelete(ticker);
    setConfirmDel(null);
  };

  const inputStyle = (focus) => ({
    padding: "8px 11px", borderRadius: 5,
    border: `1px solid ${focus ? accentColor : C.border}`,
    background: C.panelAlt, color: C.text,
    fontFamily: FONTS.mono, fontSize: 14, outline: "none",
    boxSizing: "border-box",
  });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, width: "min(800px, 100%)", height: "82vh", display: "flex", flexDirection: "column", boxShadow: "0 16px 60px rgba(0,0,0,0.6)", fontSize: 16 }}>

        {/* ── 헤더 ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 22, borderRadius: 2, background: accentColor }} />
            <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 17, color: C.text }}>{title}</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: accentColor, background: `${accentColor}18`, border: `1px solid ${accentColor}35`, borderRadius: 10, padding: "3px 10px" }}>
              총 {tickers.length}종목
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20, lineHeight: 1, padding: "2px 8px", borderRadius: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}
          >✕</button>
        </div>

        {/* ── 종목 추가 폼 ── */}
        {onAdd && (
          <div style={{ padding: "14px 22px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: `${accentColor}06` }}>
            <div style={{ fontSize: 13, fontFamily: FONTS.mono, color: accentColor, marginBottom: 9, letterSpacing: 0.5 }}>+ 종목 추가</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
              <input placeholder="종목명 (예: 삼성전자)" value={addName}
                onChange={e => { setAddName(e.target.value); setAddError(""); }}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                style={{ ...inputStyle(false), flex: "2 1 140px" }} />
              <input placeholder="종목코드 (예: 005930)" value={addTicker}
                onChange={e => { setAddTicker(e.target.value.replace(/\D/g,"")); setAddError(""); }}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                maxLength={6}
                style={{ ...inputStyle(false), flex: "1 1 120px" }} />
              <div style={{ display: "flex", borderRadius: 5, overflow: "hidden", border: `1px solid ${C.border}`, flexShrink: 0 }}>
                {[["KS","KOSPI"],["KQ","KOSDAQ"]].map(([val, label]) => (
                  <button key={val} onClick={() => setAddMarket(val)}
                    style={{ padding: "8px 13px", border: "none", cursor: "pointer", fontSize: 13, fontFamily: FONTS.mono,
                      background: addMarket === val ? accentColor : "transparent",
                      color: addMarket === val ? "#fff" : C.muted, transition: "all 0.15s" }}>
                    {label}
                  </button>
                ))}
              </div>
              <button onClick={handleAdd}
                style={{ padding: "8px 20px", borderRadius: 5, border: `1px solid ${accentColor}`, background: `${accentColor}20`, color: accentColor, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.mono, flexShrink: 0, transition: "all 0.15s" }}>
                추가
              </button>
            </div>
            {addError && <div style={{ marginTop: 7, fontSize: 13, color: C.red }}>⚠ {addError}</div>}
            {addOk    && <div style={{ marginTop: 7, fontSize: 13, color: C.green }}>✓ 종목이 추가됐습니다.</div>}
          </div>
        )}

        {/* ── 검색 ── */}
        <div style={{ padding: "12px 22px", borderBottom: `1px solid ${C.border}20`, flexShrink: 0 }}>
          <input type="text" placeholder="종목명 또는 코드 검색..."
            value={search} onChange={e => setSearch(e.target.value)}
            autoFocus={!onAdd}
            style={{ width: "100%", padding: "9px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: C.panelAlt, color: C.text, fontFamily: FONTS.mono, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* ── 목록 ── */}
        <div style={{ overflowY: "auto", flex: 1, padding: "14px 22px", overscrollBehavior: "contain" }}>
          {Object.entries(displayGroups).map(([sector, list]) => !list.length ? null : (
            <div key={sector} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700, color: accentColor, letterSpacing: 1 }}>{sector}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.muted, background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1px 7px" }}>{list.length}</span>
                <div style={{ flex: 1, height: 1, background: C.border, opacity: 0.4 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: 7 }}>
                {list.map(t => {
                  const code   = t.ticker.split(".")[0];
                  const market = t.ticker.endsWith(".KQ") ? "KOSDAQ" : "KOSPI";
                  const isConfirm = confirmDel === t.ticker;
                  return (
                    <div key={t.ticker} style={{ background: isConfirm ? `${C.red}12` : C.panelAlt, border: `1px solid ${isConfirm ? C.red : C.border}`, borderRadius: 6, padding: "10px 12px", position: "relative", transition: "all 0.15s" }}>
                      {/* 삭제 버튼 */}
                      {onDelete && !isConfirm && (
                        <button onClick={() => setConfirmDel(t.ticker)}
                          title="종목 삭제"
                          style={{ position: "absolute", top: 5, right: 6, background: "none", border: "none", cursor: "pointer", color: C.border, fontSize: 14, lineHeight: 1, padding: 2, borderRadius: 3, transition: "color 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.color = C.red}
                          onMouseLeave={e => e.currentTarget.style.color = C.border}
                        >✕</button>
                      )}
                      {/* 삭제 확인 */}
                      {isConfirm ? (
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 12, color: C.red, marginBottom: 7, fontWeight: 600 }}>삭제할까요?</div>
                          <div style={{ fontSize: 13, color: C.text, marginBottom: 8 }}>{t.name}</div>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button onClick={() => handleDelete(t.ticker)}
                              style={{ flex: 1, padding: "5px 0", borderRadius: 4, border: `1px solid ${C.red}`, background: `${C.red}20`, color: C.red, fontSize: 12, cursor: "pointer", fontWeight: 700 }}>삭제</button>
                            <button onClick={() => setConfirmDel(null)}
                              style={{ flex: 1, padding: "5px 0", borderRadius: 4, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 12, cursor: "pointer" }}>취소</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontWeight: 600, fontSize: 15, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4, paddingRight: 16 }}>{t.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: C.muted }}>{code}</span>
                            <span style={{ fontSize: 11, color: market === "KOSDAQ" ? C.green : C.accent, background: market === "KOSDAQ" ? `${C.green}15` : `${C.accent}15`, border: `1px solid ${market === "KOSDAQ" ? C.green : C.accent}30`, borderRadius: 3, padding: "1px 5px" }}>{market}</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: C.muted, fontSize: 15 }}>
              "{search}" 검색 결과가 없습니다.
            </div>
          )}
        </div>

        {/* ── 푸터 ── */}
        <div style={{ padding: "12px 22px", borderTop: `1px solid ${C.border}`, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: C.muted }}>외부 영역 클릭 또는 ✕ 로 닫기</span>
          <button onClick={onClose} style={{ padding: "7px 20px", borderRadius: 5, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 14, cursor: "pointer", fontFamily: FONTS.mono }}>닫기</button>
        </div>
      </div>
    </div>
  );
}

function SliderField({ label, value, min, max, onChange, color, C }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: "0.923em", color: C.text }}>{label}</span>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.923em", color }}>{value}%</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)} style={{ width: "100%" }} />
    </div>
  );
}

function InputField({ label, C, ...props }) {
  return (
    <div>
      <div style={{ fontSize: "0.923em", color: C.muted, marginBottom: 6 }}>{label}</div>
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

// ════════════════════════════════════════════════════════
//  9-1. 시장 지수·환율 패널
// ════════════════════════════════════════════════════════

// Yahoo Finance 티커로 지수·환율 fetch
const MARKET_ITEMS = [
  { id: "kospi",  label: "KOSPI",   ticker: "^KS11",   type: "index",    flag: "🇰🇷" },
  { id: "kosdaq", label: "KOSDAQ",  ticker: "^KQ11",   type: "index",    flag: "🇰🇷" },
  { id: "nasdaq", label: "NASDAQ",  ticker: "^IXIC",   type: "index",    flag: "🇺🇸" },
  { id: "sp500",  label: "S&P 500", ticker: "^GSPC",   type: "index",    flag: "🇺🇸" },
  { id: "usdkrw", label: "USD/KRW", ticker: "KRW=X",   type: "fx",       flag: "💱" },
  { id: "usdjpy", label: "USD/JPY", ticker: "JPY=X",   type: "fx",       flag: "🇯🇵" },
];

async function fetchMarketItem(item) {
  const url   = `https://query1.finance.yahoo.com/v8/finance/chart/${item.ticker}?interval=1d&range=5d`;
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const chart = JSON.parse((await (await fetch(proxy)).json()).contents).chart.result[0];
  const meta  = chart.meta;
  const price      = meta.regularMarketPrice;
  const prevClose  = meta.previousClose || meta.chartPreviousClose;
  const changeRate = ((price - prevClose) / prevClose) * 100;
  const closes     = chart.indicators.quote[0].close.filter(Boolean);
  return { ...item, price, prevClose, changeRate, closes };
}

function MarketOverviewPanel({ C, items, loading, lastUpdated, onReload }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 20px" }}>
      {/* ── 헤더 ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 3, height: 16, borderRadius: 2, background: C.accent }} />
          <span style={{ fontFamily: FONTS.header, fontSize: "0.769em", fontWeight: 700, color: C.text, letterSpacing: 2 }}>MARKET OVERVIEW</span>
          {lastUpdated && !loading && (
            <span style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.muted }}>{fmtTime(lastUpdated)} 기준</span>
          )}
        </div>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div className="spin" style={{ width: 10, height: 10, borderRadius: "50%", border: `1.5px solid ${C.border}`, borderTopColor: C.accent }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.muted }}>로딩 중</span>
          </div>
        ) : (
          <button onClick={onReload} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 4, fontSize: "0.769em", cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontFamily: FONTS.mono }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            🔄 새로고침
          </button>
        )}
      </div>

      {/* ── 1줄 카드 그리드 ── */}
      <div className="market-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
        {items.map(item => {
          const isLoading = item.price === null && !item.apiError;
          const up  = (item.changeRate ?? 0) >= 0;
          const col = item.apiError ? C.red : isLoading ? C.muted : up ? C.green : C.red;
          const isFx = item.type === "fx";
          const diff = item.price && item.prevClose ? item.price - item.prevClose : null;
          return (
            <div key={item.id} style={{ background: C.panelAlt, borderRadius: 6, padding: "12px 14px", borderLeft: `3px solid ${item.apiError ? C.red : isLoading ? C.border : col}`, opacity: item.apiError ? 0.7 : 1, transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 2px 10px ${col}20`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>

              {/* 라벨 행 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: "0.923em" }}>{item.flag}</span>
                  <span style={{ fontFamily: FONTS.header, fontSize: "0.769em", color: C.muted, fontWeight: 700 }}>{item.label}</span>
                </div>
                {item.apiError && (
                  <span style={{ fontFamily: FONTS.mono, fontSize: "0.615em", color: C.red, background: `${C.red}18`, border: `1px solid ${C.red}35`, borderRadius: 3, padding: "1px 4px" }}>호출실패</span>
                )}
              </div>

              {/* 가격 */}
              {isLoading ? (
                <div className="shimmer" style={{ height: 22, width: "70%", borderRadius: 4, marginBottom: 5 }} />
              ) : item.apiError ? (
                <div style={{ fontFamily: FONTS.header, fontWeight: 700, fontSize: "1.308em", color: C.muted, marginBottom: 3 }}>—</div>
              ) : (
                <div style={{ fontFamily: FONTS.header, fontWeight: 700, fontSize: "1.308em", color: C.text, marginBottom: 3, letterSpacing: -0.3 }}>
                  {isFx ? item.price.toFixed(2) : item.price >= 1000 ? fmt(Math.round(item.price)) : item.price.toFixed(2)}
                </div>
              )}

              {/* 등락 + 전일대비 */}
              {isLoading ? (
                <div className="shimmer" style={{ height: 11, width: "50%", borderRadius: 4 }} />
              ) : item.apiError ? (
                <div style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.red }}>조회 불가</div>
              ) : (
                <div style={{ display: "flex", alignItems: "baseline", gap: 5, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: "0.846em", fontWeight: 700, color: col }}>
                    {up ? "▲" : "▼"} {Math.abs(item.changeRate ?? 0).toFixed(2)}%
                  </span>
                  {diff !== null && (
                    <span style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.muted }}>
                      ({diff >= 0 ? "+" : ""}{isFx ? diff.toFixed(2) : fmt(Math.round(diff))})
                    </span>
                  )}
                </div>
              )}

              {/* 미니차트 */}
              {!item.apiError && item.closes?.length > 1 && (
                <div style={{ marginTop: 8, height: 36 }}>
                  <MiniChart data={item.closes} color={col} height={36} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarketDetailPanel({ C }) {
  // KOSPI / KOSDAQ / S&P500 / 환율 상세 — 업종별 색 구분
  const sectors = [
    { label: "반도체",   change:  1.24, color: "#00d4ff" },
    { label: "2차전지",  change: -0.83, color: "#f0b429" },
    { label: "바이오",   change:  0.55, color: "#26c96f" },
    { label: "자동차",   change:  1.87, color: "#a78bfa" },
    { label: "금융",     change: -0.21, color: "#fb923c" },
    { label: "에너지",   change: -1.12, color: "#ef4444" },
    { label: "IT서비스", change:  0.34, color: "#22d3ee" },
    { label: "철강·소재",change: -0.67, color: "#94a3b8" },
  ];

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, letterSpacing: 2, marginBottom: 12 }}>KOSPI 업종별 등락</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
        {sectors.map(sec => {
          const up  = sec.change >= 0;
          const col = up ? C.green : C.red;
          const barW = Math.min(100, Math.abs(sec.change) / 2 * 100);
          return (
            <div key={sec.label} style={{ background: C.panelAlt, borderRadius: 5, padding: "8px 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: "0.846em", color: C.text, fontWeight: 500 }}>{sec.label}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: "0.846em", fontWeight: 700, color: col }}>
                  {up ? "+" : ""}{sec.change.toFixed(2)}%
                </span>
              </div>
              {/* 게이지 바 */}
              <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${barW}%`, background: col, borderRadius: 2, transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


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
  if (s.apiError) return (
    <div style={{ ...S.panel, borderLeft: `3px solid ${C.red}40`, opacity: 0.55, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: "1.077em", color: C.muted }}>{s.name}</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted }}>{s.ticker}</span>
        <span style={{ fontSize: "0.692em", color: C.red, background: `${C.red}15`, border: `1px solid ${C.red}30`, borderRadius: 3, padding: "1px 5px" }}>조회실패</span>
      </div>
      <div style={{ fontSize: "0.846em", color: C.muted }}>API 호출에 실패했습니다. 재스캔을 시도해주세요.</div>
    </div>
  );
  const sc = signalColor(s.signal, C);
  const col = scoreColor(s.score, C);
  return (
    <div style={{ ...S.panel, borderLeft: `3px solid ${sc}`, position: "relative" }}>
      <div style={{ position: "absolute", top: 12, right: 12, width: 46, height: 46, borderRadius: "50%", background: `${col}15`, border: `2px solid ${col}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "1.077em", color: col, lineHeight: 1 }}>{s.score}</span>
        <span style={{ fontSize: "0.615em", color: C.muted }}>점</span>
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <span style={{ fontWeight: 700, fontSize: "1.077em", color: C.text }}>{s.name}</span>
          <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.769em", color: C.muted }}>{s.ticker}</span>
        </div>
        <SignalBadge signal={s.signal} C={C} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "1.308em", color: C.text }}>{fmt(s.price)}</span>
        <ChangeText value={s.changeRate} C={C} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 6 }}>
        {[
          ["거래량비율", `${s.volRate}%`, s.volRate >= 300 ? C.green : s.volRate >= 150 ? C.yellow : C.muted],
          ["RSI", s.rsi, s.rsi <= 35 ? C.green : s.rsi >= 65 ? C.red : C.yellow],
          ["볼린저", s.bb, C.accent],
        ].map(([label, val, color]) => (
          <div key={label} style={S.infoBox}>
            <div style={{ fontSize: "0.692em", color: C.muted, marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.846em", color }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 10 }}>
        <div style={S.infoBox}>
          <div style={{ fontSize: "0.692em", color: C.muted, marginBottom: 2 }}>거래량</div>
          <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.846em", color: C.text }}>
            {s.volume ? `${(s.volume / 10000).toFixed(1)}만주` : "—"}
          </div>
        </div>
        <div style={S.infoBox}>
          <div style={{ fontSize: "0.692em", color: C.muted, marginBottom: 2 }}>거래대금</div>
          <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.846em", color: C.yellow }}>
            {fmtValue(s.tradingValue)}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.692em", color: C.muted, marginBottom: 3 }}>
          <span>하단</span><span>볼린저밴드 위치</span><span>상단</span>
        </div>
        <div style={{ height: 4, background: C.border, borderRadius: 2, position: "relative" }}>
          <div style={{ position: "absolute", left: `${Math.min(95, Math.max(2, s.bbPos ?? 50))}%`, top: -3, width: 10, height: 10, borderRadius: "50%", background: C.accent, transform: "translateX(-50%)", boxShadow: `0 0 6px ${C.accent}` }} />
        </div>
      </div>
      <div style={{ fontSize: "0.846em", color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>💡 {s.reason}</div>
    </div>
  );
}

function MedalCard({ s, rank, C }) {
  const medals = ["🥇", "🥈", "🥉"];
  const borderCols = [C.yellow, "#aaaaaa", "#cd7f32"];
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, borderTop: `3px solid ${borderCols[rank]}`, textAlign: "center" }}>
      <div style={{ fontSize: "1.692em", marginBottom: 4 }}>{medals[rank]}</div>
      <div style={{ fontWeight: 700, fontSize: "1.077em", marginBottom: 2, color: C.text }}>{s.name}</div>
      <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "1.692em", color: C.yellow, marginBottom: 4 }}>{fmtValue(s.tradingValue)}</div>
      <div style={{ fontSize: "0.846em", color: C.muted, marginBottom: 8 }}>거래량 {(s.volume / 10000).toFixed(0)}만주 · {fmt(s.price)}원</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
        <ChangeText value={s.changeRate} C={C} />
        <span style={{ color: C.muted }}>|</span>
        <span style={{ fontSize: "0.846em", color: s.volRate >= 200 ? C.green : C.muted }}>거래량비 {s.volRate}%</span>
      </div>
    </div>
  );
}

function RankRow({ s, idx, valueKey, C }) {
  if (s.apiError) return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: `1px solid ${C.border}20`, opacity: 0.45, background: `${C.red}05` }}>
      <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.923em", color: C.muted, minWidth: 20 }}>—</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: "1em", color: C.muted }}>{s.name}</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted }}>{s.ticker}</div>
      </div>
      <span style={{ fontSize: "0.692em", color: C.red, background: `${C.red}15`, border: `1px solid ${C.red}30`, borderRadius: 3, padding: "2px 6px" }}>조회실패</span>
    </div>
  );
  const display = {
    changeRate: { val: fmtPct(s.changeRate, true), sub: `${fmt(s.price)}원`, col: s.changeRate >= 0 ? C.green : C.red },
    volRate: { val: `${s.volRate}%`, sub: `거래대금 ${fmtValue(s.tradingValue)}`, col: s.volRate >= 300 ? C.green : C.yellow },
    tradingValue: { val: fmtValue(s.tradingValue), sub: `거래량 ${(s.volume / 10000).toFixed(0)}만주`, col: C.yellow },
  }[valueKey] ?? { val: fmt(s.volume), sub: `${fmt(s.price)}원`, col: C.accent };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: `1px solid ${C.border}20`, background: idx === 0 ? `${display.col}08` : "transparent" }}>
      <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.923em", color: idx < 3 ? C.yellow : C.muted, minWidth: 20 }}>#{idx + 1}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: "1em", color: C.text }}>{s.name}</div>
        <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.769em", color: C.muted }}>{s.ticker}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "1.077em", color: display.col }}>{display.val}</div>
        <div style={{ fontSize: "0.846em", color: C.muted }}>{display.sub}</div>
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
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.692em", color: C.muted, marginBottom: 3 }}>
        <span>하한 -{env.kPct}%</span><span>MA{env.period}</span><span>상한 +{env.kPct}%</span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 3, background: `linear-gradient(to right, ${C.green}30, ${C.muted}20, ${C.red}20)` }}>
        <div style={{ position: "absolute", left: "50%", top: -2, width: 1, height: 10, background: C.border }} />
        <div style={{ position: "absolute", left: `${pct}%`, top: -3, transform: "translateX(-50%)", width: 12, height: 12, borderRadius: "50%", background: dotColor, border: `2px solid ${C.panel}`, boxShadow: `0 0 6px ${dotColor}` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.692em", color: C.muted, marginTop: 5 }}>
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
  const medals = ["🥇", "🥈", "🥉", "🏅"];
  return (
    <div style={{ background: C.panel, border: `1px solid ${rank < 4 ? scoreCol : C.border}`, borderRadius: 8, padding: 16, position: "relative", boxShadow: rank < 4 ? `0 0 14px ${scoreCol}18` : "none" }}>
      {/* 순위 배지 */}
      <div style={{ position: "absolute", top: -10, left: 14, fontSize: rank < 4 ? 18 : 12, lineHeight: 1 }}>
        {rank < 4
          ? medals[rank]
          : <span style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1px 7px", fontSize: "0.769em", color: C.muted, fontFamily: FONTS.mono }}>#{rank + 1}</span>}
      </div>
      {/* 점수 원형 */}
      <div style={{ position: "absolute", top: 10, right: 12, width: 44, height: 44, borderRadius: "50%", background: `${scoreCol}12`, border: `2px solid ${scoreCol}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "1em", color: scoreCol, lineHeight: 1 }}>{pickScore}</span>
        <span style={{ fontSize: "0.615em", color: C.muted }}>점</span>
      </div>
      {/* 종목명 */}
      <div style={{ marginTop: 10, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: "1.154em", color: C.text }}>{s.name}</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted }}>{s.ticker}</span>
        </div>
        {lbl.color
          ? <span style={{ fontSize: "0.846em", padding: "2px 10px", borderRadius: 10, background: `${lbl.color}20`, color: lbl.color, border: `1px solid ${lbl.color}40`, fontWeight: 600 }}>{lbl.text}</span>
          : <span style={{ fontSize: "0.846em", color: C.muted }}>{lbl.text}</span>}
      </div>
      {/* 가격 */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "1.385em", color: C.text }}>{fmt(s.price)}</span>
        <span style={{ fontFamily: FONTS.mono, fontWeight: 600, color: s.changeRate >= 0 ? C.green : C.red }}>
          {s.changeRate >= 0 ? "▲" : "▼"} {Math.abs(s.changeRate).toFixed(2)}%
        </span>
      </div>
      {/* 엔벨로프 바 */}
      <div style={{ marginBottom: 12 }}><EnvelopeBar env={s.env} C={C} /></div>
      {/* 보조 지표 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 5, marginBottom: 10 }}>
        {[
          ["RSI", s.rsi, s.rsi < 30 ? C.red : s.rsi < 40 ? C.yellow : C.muted],
          ["하한까지", s.env ? `${Math.abs(s.env.distPct).toFixed(1)}%` : "—", scoreCol],
          ["5일거래량", s.vol5dAvg ? `${Math.round(s.vol5dAvg / 10000)}만주` : "—", C.muted],
          ["5일거래대금", s.tv5dAvg ? fmtValue(s.tv5dAvg) : "—", C.accent],
        ].map(([label, val, color]) => (
          <div key={label} style={{ background: C.panelAlt, borderRadius: 4, padding: "5px 8px", textAlign: "center" }}>
            <div style={{ fontSize: "0.692em", color: C.muted, marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.846em", color }}>{val}</div>
          </div>
        ))}
      </div>
      {/* 힌트 */}
      <div style={{ fontSize: "0.846em", color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 8, lineHeight: 1.5 }}>
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
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, height: "100%", boxSizing: "border-box" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, letterSpacing: 1, marginBottom: 14 }}>엔벨로프 파라미터</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: "0.923em", color: C.muted, marginBottom: 5 }}>이동평균 기간</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[10, 20, 30, 60].map(v => (
              <button key={v} onClick={() => setPeriod(v)} style={{ flex: 1, padding: "5px 0", borderRadius: 4, fontSize: "0.846em", cursor: "pointer", fontFamily: FONTS.mono, border: `1px solid ${period === v ? C.accent : C.border}`, background: period === v ? `${C.accent}18` : "transparent", color: period === v ? C.accent : C.muted }}>
                {v}일
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.923em", color: C.muted, marginBottom: 5 }}>밴드폭 (%)</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[3, 4, 5, 8, 10].map(v => (
              <button key={v} onClick={() => setKPct(v)} style={{ flex: 1, padding: "5px 0", borderRadius: 4, fontSize: "0.846em", cursor: "pointer", fontFamily: FONTS.mono, border: `1px solid ${kPct === v ? C.yellow : C.border}`, background: kPct === v ? `${C.yellow}18` : "transparent", color: kPct === v ? C.yellow : C.muted }}>
                ±{v}%
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ fontSize: "0.846em", color: C.muted, background: C.panelAlt, borderRadius: 4, padding: "8px 12px", lineHeight: 1.6 }}>
        <span style={{ color: C.accent, fontWeight: 600 }}>엔벨로프(Envelope)</span>란 이동평균(MA)을 중심으로
        상·하 일정 % 채널을 그려 <span style={{ color: C.green }}>하한 지지</span> / <span style={{ color: C.red }}>상한 저항</span>을 포착하는 추세 지표입니다.
      </div>
    </div>
  );
}

function YwPickTab({ C, stocks, loading, loadedCount, error, lastUpdated, onReload, ywPickTickers, onAddYwTicker, onDeleteYwTicker }) {
  const S = makeS(C);
  const [envPeriod, setEnvPeriod] = useState(20);
  const [envKPct, setEnvKPct] = useState(4);
  const [filterLabel, setFilterLabel] = useState("전체");
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const [tickerModalOpen, setTickerModalOpen] = useState(false);

  // ── 거래량·거래대금 필터 ────────────────────────────────
  const [volPeriod, setVolPeriod] = useState(5);
  const [minVolUnit, setMinVolUnit] = useState("만주");
  const [minVolVal, setMinVolVal] = useState(500);
  const [volFilterOn, setVolFilterOn] = useState(true);

  // envPeriod/kPct 변경 시 closes 원시 데이터로 재계산
  const apiFailedStocks = stocks.filter(s => s.apiError);
  const computed = stocks.filter(s => !s.apiError).map(s => ({
    ...s,
    env: s.closes?.length ? calcEnvelope(s.closes, envPeriod, envKPct) : s.env,
    // 선택된 기간의 평균 거래량·거래대금
    avgVol: volPeriod === 3 ? s.vol3dAvg : s.vol5dAvg,
    avgTv: volPeriod === 3 ? s.tv3dAvg : s.tv5dAvg,
  }));

  // ── 거래량/거래대금 필터 적용 ──────────────────────────
  const passVolFilter = s => {
    if (!volFilterOn) return true;
    if (minVolUnit === "만주") {
      const avgVol = (s.avgVol ?? 0) / 10000; // 주 → 만주
      return avgVol >= minVolVal;
    } else {
      const avgTv = (s.avgTv ?? 0) / 1e8;    // 원 → 억원
      return avgTv >= minVolVal;
    }
  };

  const FILTER_LABELS = ["전체", "하한 이탈", "하한 근접", "하한 접근"];
  const filtered = computed
    .filter(s => filterLabel === "전체" || s.env?.label === filterLabel)
    .filter(passVolFilter)
    .sort((a, b) => (a.env?.proximity ?? 999) - (b.env?.proximity ?? 999));
  const topPicks = filtered.slice(0, 4);
  const restPicks = filtered.slice(4);

  // 요약 카드 — 거래량 필터 통과한 종목 기준
  const passed = computed.filter(passVolFilter);
  const statItems = [
    { label: "스캔 종목", value: `${computed.length}개`, color: C.accent },
    { label: "필터 통과", value: `${passed.length}개`, color: C.yellow },
    { label: "하한 이탈", value: `${passed.filter(s => s.env?.label === "하한 이탈").length}개`, color: C.red },
    { label: "하한 근접/접근", value: `${passed.filter(s => ["하한 근접", "하한 접근"].includes(s.env?.label)).length}개`, color: C.green },
  ];

  // 아직 한 번도 조회하지 않은 상태
  if (!loading && stocks.length === 0 && !error) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:80, gap:20 }} className="slide-in">
        <div style={{ fontSize: "3.077em" }}>⭐</div>
        <div style={{ fontFamily:FONTS.mono, fontSize: "1.231em", fontWeight:700, color:C.yellow }}>영욱문</div>
        <div style={{ fontSize: "1em", color:C.muted, textAlign:"center", lineHeight:1.7 }}>
          엔벨로프 하한 근접 종목을 스캔합니다.<br/>
          <span style={{ fontFamily:FONTS.mono, color:C.muted, fontSize: "0.846em" }}>{(ywPickTickers||[]).length}개 종목 · MA20 ±4%</span>
        </div>
        <button onClick={onReload} style={{ padding:"10px 32px", borderRadius:6, fontSize: "1em", fontWeight:700, cursor:"pointer", border:`1px solid ${C.yellow}`, background:`${C.yellow}18`, color:C.yellow, fontFamily:FONTS.mono }}>
          🔍 스캔 시작
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="slide-in">

      {/* 헤더 배너 */}
      <div style={{ background: `linear-gradient(135deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: loading ? 12 : 0 }}>
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: "1.385em", fontWeight: 700, color: C.yellow, letterSpacing: 1, marginBottom: 4 }}>⭐ 영욱문</div>
            <div style={{ fontSize: "0.923em", color: C.muted }}>엔벨로프 하한선 기준 · 지지구간 근접 종목 자동 선별</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {lastUpdated && !loading && <span style={{ fontFamily: FONTS.mono, fontSize: "0.846em", color: C.muted }}>갱신: {fmtTime(lastUpdated)}</span>}
            {loading
              ? <span style={{ fontFamily: FONTS.mono, fontSize: "0.846em", color: C.yellow }}>{loadedCount} / {(ywPickTickers||[]).length} 완료</span>
              : <button onClick={onReload} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 4, fontSize: "0.846em", cursor: "pointer", border: `1px solid ${C.yellow}`, background: `${C.yellow}15`, color: C.yellow }}>
                🔍 재스캔
              </button>
            }
            {/* 필터 접기/펼치기 버튼 */}
            <button
              onClick={() => setFilterPanelOpen(v => !v)}
              title={filterPanelOpen ? "필터 접기" : "필터 펼치기"}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 4, fontSize: "0.846em", cursor: "pointer", border: `1px solid ${C.border}`, background: filterPanelOpen ? `${C.accent}12` : "transparent", color: filterPanelOpen ? C.accent : C.muted, fontFamily: FONTS.mono, transition: "all 0.2s" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: filterPanelOpen ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s ease" }}>
                <polyline points="18 15 12 9 6 15" />
              </svg>
              {filterPanelOpen ? "필터 접기" : "필터 펼치기"}
            </button>
          </div>
        </div>

        {/* 진행률 바 — 로딩 중에만 표시 */}
        {loading && (
          <ProgressBar current={loadedCount} total={(ywPickTickers||[]).length} accentColor={C.yellow} C={C} />
        )}
      </div>

      {/* 요약 카드 */}
      <div className="stat-grid-4" style={S.grid("repeat(4,1fr)")}>
        {statItems.map(({ label, value, color }) => (
          <StatCard key={label} label={label} value={value} color={color} C={C}
            onClick={label === "스캔 종목" ? () => setTickerModalOpen(true) : undefined}
          />
        ))}
      </div>

      {/* 스캔 종목 모달 */}
      {tickerModalOpen && (
        <TickerListModal
          tickers={ywPickTickers}
          title={"⭐ 영욱문 스캔 종목"}
          accentColor={C.yellow}
          C={C}
          onClose={() => setTickerModalOpen(false)}
          onAdd={onAddYwTicker}
          onDelete={onDeleteYwTicker}
        />
      )}

      {/* 설정 + 필터 — 접기/펼치기 */}
      <div style={{ overflow: "hidden", maxHeight: filterPanelOpen ? 600 : 0, opacity: filterPanelOpen ? 1 : 0, transition: "max-height 0.35s ease, opacity 0.25s ease", marginBottom: filterPanelOpen ? 0 : -14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 200px", gap: 12, alignItems: "stretch" }}
          className="filter-grid">

        {/* ── 엔벨로프 파라미터 ── */}
        <EnvelopeSettings period={envPeriod} kPct={envKPct} setPeriod={setEnvPeriod} setKPct={setEnvKPct} C={C} />

        {/* ── 거래량·거래대금 필터 패널 ── */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16 }}>
          {/* 헤더 + ON/OFF 토글 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: volFilterOn ? 14 : 0 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, letterSpacing: 1 }}>거래량·거래대금 필터</span>
            <div onClick={() => setVolFilterOn(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <span style={{ fontSize: "0.846em", color: volFilterOn ? C.green : C.muted }}>{volFilterOn ? "ON" : "OFF"}</span>
              <div style={{ width: 36, height: 18, borderRadius: 9, background: volFilterOn ? C.green : C.border, position: "relative", transition: "background 0.25s" }}>
                <div style={{ position: "absolute", top: 2, left: volFilterOn ? 18 : 2, width: 14, height: 14, borderRadius: "50%", background: "white", transition: "left 0.25s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
              </div>
            </div>
          </div>

          {/* 접힘/펼침 영역 */}
          <div style={{ overflow: "hidden", maxHeight: volFilterOn ? 400 : 0, opacity: volFilterOn ? 1 : 0, transition: "max-height 0.3s ease, opacity 0.2s ease" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* 기준 기간 선택 */}
              <div>
                <div style={{ fontSize: "0.846em", color: C.muted, marginBottom: 6 }}>기준 기간</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[["3", "최근 3일 평균"], ["5", "최근 5일 평균"]].map(([v, label]) => (
                    <button key={v} onClick={() => setVolPeriod(+v)} style={{ flex: 1, padding: "6px 0", borderRadius: 4, fontSize: "0.923em", cursor: "pointer", fontFamily: FONTS.mono, border: `1px solid ${volPeriod === +v ? C.accent : C.border}`, background: volPeriod === +v ? `${C.accent}18` : "transparent", color: volPeriod === +v ? C.accent : C.muted, fontWeight: volPeriod === +v ? 600 : 400 }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 기준 단위 선택 */}
              <div>
                <div style={{ fontSize: "0.846em", color: C.muted, marginBottom: 6 }}>필터 기준</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["만주", "억원"].map(unit => (
                    <button key={unit} onClick={() => { setMinVolUnit(unit); setMinVolVal(unit === "만주" ? 50 : 500); }} style={{ flex: 1, padding: "6px 0", borderRadius: 4, fontSize: "0.923em", cursor: "pointer", border: `1px solid ${minVolUnit === unit ? C.yellow : C.border}`, background: minVolUnit === unit ? `${C.yellow}18` : "transparent", color: minVolUnit === unit ? C.yellow : C.muted, fontWeight: minVolUnit === unit ? 600 : 400 }}>
                      거래{unit === "만주" ? "량" : "대금"} ({unit})
                    </button>
                  ))}
                </div>
              </div>

              {/* 최솟값 입력 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.846em", color: C.muted }}>
                    {minVolUnit === "만주" ? "최소 평균 거래량" : "최소 평균 거래대금"}
                  </span>
                  <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "1em", color: C.accent }}>
                    {minVolVal.toLocaleString()}{minVolUnit}
                  </span>
                </div>
                {minVolUnit === "만주" ? (
                  <input type="range" min={1} max={500} step={5} value={minVolVal}
                    onChange={e => setMinVolVal(+e.target.value)} style={{ width: "100%" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="number" min={1} step={10} value={minVolVal}
                      onChange={e => setMinVolVal(Math.max(1, +e.target.value || 1))}
                      style={{ flex: 1, padding: "5px 8px", borderRadius: 4, border: `1px solid ${C.border}`, background: C.panelAlt, color: C.text, fontFamily: FONTS.mono, fontSize: "1em", outline: "none" }} />
                    <span style={{ fontSize: "0.846em", color: C.muted, whiteSpace: "nowrap" }}>억원 이상</span>
                  </div>
                )}
                {/* 빠른 선택 프리셋 */}
                <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap" }}>
                  {(minVolUnit === "만주"
                    ? [[10, "10만주"], [50, "50만주"], [100, "100만주"], [200, "200만주"]]
                    : [[10, "10억"], [50, "50억"], [100, "100억"], [500, "500억"], [1000, "1000억"], [3000, "3000억"], [5000, "5000억"]]
                  ).map(([v, label]) => (
                    <button key={v} onClick={() => setMinVolVal(v)} style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.769em", cursor: "pointer", border: `1px solid ${minVolVal === v ? C.accent : C.border}`, background: minVolVal === v ? `${C.accent}15` : "transparent", color: minVolVal === v ? C.accent : C.muted }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 필터 적용 현황 */}
              <div style={{ background: C.panelAlt, borderRadius: 4, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.846em", color: C.muted }}>
                  {volPeriod}일 평균 {minVolUnit === "만주" ? "거래량" : "거래대금"} ≥ {minVolVal.toLocaleString()}{minVolUnit}
                </span>
                <span style={{ fontFamily: FONTS.mono, fontSize: "0.923em", fontWeight: 700, color: C.green }}>
                  {computed.filter(passVolFilter).length} / {computed.length} 통과
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, boxSizing: "border-box" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, letterSpacing: 1, marginBottom: 10 }}>필터</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {FILTER_LABELS.map(f => {
              const lbl = pickLabel({ label: f });
              const active = filterLabel === f;
              const col = lbl.color || C.accent;
              return (
                <button key={f} onClick={() => setFilterLabel(f)} style={{ padding: "6px 12px", borderRadius: 4, fontSize: "0.923em", cursor: "pointer", textAlign: "left", border: `1px solid ${active ? col : C.border}`, background: active ? `${col}15` : "transparent", color: active ? col : C.muted, fontWeight: active ? 600 : 400 }}>
                  {f === "전체" ? "◈ 전체" : lbl.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>{/* 필터 접기/펼치기 래퍼 끝 */}

      {error && (
        <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}40`, borderRadius: 6, padding: 12, fontSize: "0.923em", color: C.red }}>
          ⚠ {error} — Mock 데이터로 표시 중입니다.
        </div>
      )}

      {/* TOP 3 카드 — 도착한 순서대로 즉시 표시, 나머지 자리는 스켈레톤 */}
      <div>
        <div style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.yellow, letterSpacing: 2, marginBottom: 10 }}>▶ TOP PICKS — 하한 최근접 종목</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
          {topPicks.map((s, i) => <PickCard key={s.ticker} s={s} rank={i} C={C} />)}
          {/* 아직 안 도착한 TOP3 자리를 스켈레톤으로 채움 */}
          {loading && Array.from({ length: Math.max(0, 4 - topPicks.length) }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} C={C} />
          ))}
        </div>
      </div>

      {/* 나머지 테이블 — 도착 즉시 표시, 아직 안 온 행은 스켈레톤 */}
      {(restPicks.length > 0 || loading) && (
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, letterSpacing: 1 }}>전체 스캔 결과</span>
            <span style={{ fontSize: "0.769em", color: C.muted }}>— 하한 근접 순 정렬</span>
            {loading && (
              <div className="spin" style={{ marginLeft: "auto", width: 12, height: 12, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.yellow }} />
            )}
          </div>
          <div className="mobile-scroll-x">
          <div style={{ minWidth: 620, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 2fr 1fr", padding: "6px 16px", borderBottom: `1px solid ${C.border}`, background: C.panelAlt }}>
            {["종목", "현재가", "등락률", "RSI", `${volPeriod}일 거래량`, "엔벨로프 위치", "상태"].map(h => (
              <span key={h} style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted }}>{h}</span>
            ))}
          </div>
          {/* 도착한 행 */}
          {restPicks.map((s, i) => {
            const lbl = pickLabel(s.env);
            const ps = calcPickScore(s.env, s.rsi);
            const scoreCol = ps >= 90 ? C.red : ps >= 75 ? C.yellow : C.green;
            const avgVol = volPeriod === 3 ? s.vol3dAvg : s.vol5dAvg;
            const avgTv = volPeriod === 3 ? s.tv3dAvg : s.tv5dAvg;
            const volOk = !volFilterOn || passVolFilter(s);
            return (
              <div key={s.ticker} className="fade-in" style={{ minWidth: 620, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 2fr 1fr", padding: "10px 16px", borderBottom: `1px solid ${C.border}20`, alignItems: "center", background: s.apiError ? `${C.red}06` : i % 2 === 0 ? "transparent" : `${C.panelAlt}50`, opacity: s.apiError ? 0.55 : 1 }}>
                <div>
                  <div style={{ fontWeight: 600, color: s.apiError ? C.muted : C.text }}>{s.name}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted }}>{s.ticker}
                    {s.apiError && <span style={{ marginLeft: 5, fontSize: "0.692em", color: C.red, background: `${C.red}15`, border: `1px solid ${C.red}30`, borderRadius: 3, padding: "1px 4px" }}>조회실패</span>}
                  </div>
                </div>
                <div style={{ fontFamily: FONTS.mono, fontWeight: 600, color: C.muted }}>{s.apiError ? "—" : fmt(s.price)}</div>
                <div style={{ fontFamily: FONTS.mono, fontWeight: 600, color: s.apiError ? C.muted : s.changeRate >= 0 ? C.green : C.red }}>
                  {s.apiError ? "—" : `${s.changeRate >= 0 ? "▲" : "▼"} ${Math.abs(s.changeRate).toFixed(2)}%`}
                </div>
                <div style={{ fontFamily: FONTS.mono, fontWeight: 600, color: s.apiError ? C.muted : s.rsi < 30 ? C.red : s.rsi < 40 ? C.yellow : C.muted }}>{s.apiError ? "—" : s.rsi}</div>
                {/* 거래량 / 거래대금 */}
                <div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: "0.846em", fontWeight: 600, color: s.apiError ? C.muted : volOk ? C.text : C.red }}>
                    {s.apiError ? "—" : avgVol ? `${Math.round(avgVol / 10000)}만주` : "—"}
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.muted }}>
                    {s.apiError ? "" : avgTv ? fmtValue(avgTv) : "—"}
                  </div>
                </div>
                <div style={{ paddingRight: 8 }}>
                  {s.apiError ? <span style={{ fontSize: "0.769em", color: C.muted }}>—</span> : <>
                  <div style={{ position: "relative", height: 4, borderRadius: 2, background: `linear-gradient(to right,${C.green}30,${C.muted}15,${C.red}15)` }}>
                    <div style={{ position: "absolute", left: `${Math.max(1, Math.min(99, s.env?.proximity ?? 50))}%`, top: -3, width: 10, height: 10, transform: "translateX(-50%)", borderRadius: "50%", background: scoreCol, border: `2px solid ${C.panel}` }} />
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.muted, marginTop: 3 }}>
                    {s.env ? `${s.env.distPct >= 0 ? "+" : ""}${s.env.distPct.toFixed(2)}%` : "—"}
                  </div>
                  </>}
                </div>
                <div>
                  {s.apiError
                    ? <span style={{ fontSize: "0.769em", padding: "2px 8px", borderRadius: 10, background: `${C.red}15`, color: C.red, border: `1px solid ${C.red}30` }}>조회실패</span>
                    : lbl.color
                      ? <span style={{ fontSize: "0.769em", padding: "2px 8px", borderRadius: 10, background: `${lbl.color}20`, color: lbl.color, border: `1px solid ${lbl.color}40` }}>{lbl.text}</span>
                      : <span style={{ fontSize: "0.769em", color: C.muted }}>{lbl.text}</span>}
                </div>
              </div>
            );
          })}
          {/* 아직 도착 안 한 행 — 스켈레톤 */}
          {loading && Array.from({ length: Math.max(0, (ywPickTickers||[]).length - stocks.length) }).map((_, i) => (
            <SkeletonRow key={`skr-${i}`} />
          ))}
          {/* API 실패 종목 안내 행 */}
          {!loading && apiFailedStocks.length > 0 && apiFailedStocks.map(s => (
            <div key={s.ticker} className="fade-in" style={{ minWidth: 620, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 2fr 1fr", padding: "8px 16px", borderBottom: `1px solid ${C.border}20`, alignItems: "center", background: `${C.red}06`, opacity: 0.55 }}>
              <div>
                <div style={{ fontWeight: 600, color: C.muted }}>{s.name}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted }}>{s.ticker}</div>
              </div>
              <div style={{ fontFamily: FONTS.mono, color: C.muted }}>—</div>
              <div style={{ fontFamily: FONTS.mono, color: C.muted }}>—</div>
              <div style={{ fontFamily: FONTS.mono, color: C.muted }}>—</div>
              <div style={{ fontFamily: FONTS.mono, color: C.muted }}>—</div>
              <div style={{ color: C.muted }}>—</div>
              <span style={{ fontSize: "0.692em", color: C.red, background: `${C.red}15`, border: `1px solid ${C.red}30`, borderRadius: 3, padding: "2px 6px" }}>조회실패</span>
            </div>
          ))}
          </div>{/* mobile-scroll-x 닫기 */}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: C.muted, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6 }}>
          해당 조건의 종목이 없습니다.
        </div>
      )}

      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 14px", display: "flex", gap: 8, fontSize: "0.846em", color: C.muted }}>
        <span style={{ color: C.yellow }}>⚠</span>
        <span>엔벨로프 MA{envPeriod} ±{envKPct}% 기준 하한 근접 종목 자동 선별입니다. 하한 지지는 추세 하락 시 무의미할 수 있으므로 RSI·거래량을 병행 확인하세요. 투자 판단은 본인 책임입니다.</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  12. 주도/테마 탭
// ════════════════════════════════════════════════════════

// 섹터 분류 매핑 (ticker → 섹터)
const SECTOR_MAP = {
  "005930": "반도체", "000660": "반도체", "042700": "반도체", "086520": "반도체",
  "373220": "2차전지", "006400": "2차전지", "247540": "2차전지", "096770": "2차전지",
  "207940": "바이오", "068270": "바이오", "326030": "바이오", "009830": "바이오",
  "005380": "자동차", "012330": "자동차", "000270": "자동차", "011210": "자동차",
  "105560": "금융", "055550": "금융", "086790": "금융", "138040": "금융",
  "035420": "IT/플랫폼", "035720": "IT/플랫폼", "251270": "IT/플랫폼", "047050": "IT/플랫폼",
  "000720": "건설", "047040": "건설", "028260": "건설", "000880": "건설",
  "051910": "화학/소재", "010950": "화학/소재", "011790": "화학/소재", "002790": "화학/소재",
  "015760": "에너지", "010140": "에너지", "267250": "에너지", "009540": "에너지",
  "032830": "보험/증권", "030200": "보험/증권", "071050": "보험/증권", "039490": "보험/증권",
};

const SECTOR_COLORS = {
  "반도체":    "#38bdf8",
  "2차전지":   "#fbbf24",
  "바이오":    "#34d679",
  "자동차":    "#a78bfa",
  "금융":      "#fb923c",
  "IT/플랫폼": "#22d3ee",
  "건설":      "#94a3b8",
  "화학/소재": "#f472b6",
  "에너지":    "#f87171",
  "보험/증권": "#818cf8",
};

// 스캔 대상 종목 (코드 + 이름)
const THEME_TICKERS = [
  { ticker: "005930.KS", code: "005930", name: "삼성전자" },
  { ticker: "000660.KS", code: "000660", name: "SK하이닉스" },
  { ticker: "042700.KS", code: "042700", name: "한미반도체" },
  { ticker: "086520.KS", code: "086520", name: "에코프로" },
  { ticker: "373220.KS", code: "373220", name: "LG에너지솔루션" },
  { ticker: "006400.KS", code: "006400", name: "삼성SDI" },
  { ticker: "247540.KS", code: "247540", name: "에코프로비엠" },
  { ticker: "207940.KS", code: "207940", name: "삼성바이오로직스" },
  { ticker: "068270.KS", code: "068270", name: "셀트리온" },
  { ticker: "005380.KS", code: "005380", name: "현대차" },
  { ticker: "012330.KS", code: "012330", name: "현대모비스" },
  { ticker: "000270.KS", code: "000270", name: "기아" },
  { ticker: "105560.KS", code: "105560", name: "KB금융" },
  { ticker: "055550.KS", code: "055550", name: "신한지주" },
  { ticker: "035420.KS", code: "035420", name: "NAVER" },
  { ticker: "035720.KS", code: "035720", name: "카카오" },
  { ticker: "051910.KS", code: "051910", name: "LG화학" },
  { ticker: "010950.KS", code: "010950", name: "S-Oil" },
  { ticker: "015760.KS", code: "015760", name: "한국전력" },
  { ticker: "032830.KS", code: "032830", name: "삼성생명" },
];

const THEME_RENDER_URL = "https://trade-backend-3o2e.onrender.com";


// 거래대금 상위 종목 리스트 가져오기 (백엔드 프록시)
async function fetchTopVolumeList(limit = 50) {
  const res = await fetch(`${THEME_RENDER_URL}/api/top-volume?limit=${limit}`);
  if (!res.ok) throw new Error(`top-volume API 실패: ${res.status}`);
  const data = await res.json();
  // 백엔드 응답 형식: [{ code, name, market }] 또는 [{ ticker, name }]
  return data.map(item => {
    const code   = item.code || item.ticker?.split(".")[0] || "";
    const market = item.market === "KOSDAQ" ? "KQ" : "KS";
    const ticker = item.ticker || `${code}.${market}`;
    return { ticker, code, name: item.name };
  });
}

async function fetchThemeQuote(t) {
  const res  = await fetch(`${THEME_RENDER_URL}/api/yahoo?ticker=${t.ticker}`);
  if (!res.ok) throw new Error("fetch fail");
  const data = await res.json();
  const chart = data.chart.result[0];
  const meta  = chart.meta;
  const price      = meta.regularMarketPrice;
  const prevClose  = meta.previousClose || meta.chartPreviousClose;
  const changeRate = ((price - prevClose) / prevClose) * 100;
  const volumes    = chart.indicators.quote[0].volume.filter(Boolean);
  const closes     = chart.indicators.quote[0].close.filter(Boolean);
  const vol20avg   = volumes.slice(-20).reduce((a,b)=>a+b,0) / Math.min(20, volumes.length);
  const volRate    = Math.round((volumes[volumes.length-1] / (vol20avg||1)) * 100);
  const tradingValue = Math.round(price * (volumes[volumes.length-1]||0));
  const sector     = SECTOR_MAP[t.code] || "기타";
  return { ...t, price, prevClose, changeRate, volRate, tradingValue, closes, sector, apiError: false };
}

function ThemeTab({ C, stocks, loading, loadedCount, lastUpdated, onReload, scanLimit, onChangeScanLimit, scanMode, onChangeScanMode, topVolumeError }) {
  const S = makeS(C);
  const [view, setView] = useState("sector"); // "sector" | "rank" | "heatmap"

  const ok = stocks.filter(s => !s.apiError);

  // 섹터별 그룹핑
  const sectors = {};
  ok.forEach(s => {
    if (!sectors[s.sector]) sectors[s.sector] = [];
    sectors[s.sector].push(s);
  });

  // 섹터 평균 등락률
  const sectorStats = Object.entries(sectors).map(([name, list]) => {
    const avg = list.reduce((a,b) => a + b.changeRate, 0) / list.length;
    const totalTv = list.reduce((a,b) => a + (b.tradingValue||0), 0);
    const leader = [...list].sort((a,b) => b.changeRate - a.changeRate)[0];
    return { name, avg, totalTv, list, leader, color: SECTOR_COLORS[name] || C.muted };
  }).sort((a,b) => b.avg - a.avg);

  // 상승 TOP10
  const topRise = [...ok].sort((a,b) => b.changeRate - a.changeRate).slice(0, 10);
  // 거래대금 TOP10
  const topValue = [...ok].sort((a,b) => b.tradingValue - a.tradingValue).slice(0, 10);

  const notFetched = !loading && stocks.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="slide-in">

      {/* ── 헤더 배너 ── */}
      <div style={{ background: `linear-gradient(135deg, ${C.panel}, ${C.panelAlt})`, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: "1.385em", fontWeight: 700, color: C.red, letterSpacing: 1, marginBottom: 4 }}>🔥 주도/테마 분석</div>
            <div style={{ fontSize: "0.923em", color: C.muted }}>당일 섹터별 등락 · 주도주 · 거래대금 분석</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* 스캔 모드 선택 */}
            <div style={{ display: "flex", borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}` }}>
              {[["preset","고정 종목"], ["topvolume","거래대금 상위"]].map(([mode, label]) => (
                <button key={mode} onClick={() => onChangeScanMode(mode)} disabled={loading}
                  style={{ padding: "5px 12px", border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: "0.769em", fontFamily: FONTS.mono,
                    background: scanMode === mode ? C.red : "transparent",
                    color: scanMode === mode ? "#fff" : C.muted, transition: "all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>
            {/* 거래대금 상위 모드일 때 개수 선택 */}
            {scanMode === "topvolume" && (
              <div style={{ display: "flex", borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}` }}>
                {[50, 75, 100].map(n => (
                  <button key={n} onClick={() => onChangeScanLimit(n)} disabled={loading}
                    style={{ padding: "5px 10px", border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: "0.769em", fontFamily: FONTS.mono,
                      background: scanLimit === n ? `${C.red}30` : "transparent",
                      color: scanLimit === n ? C.red : C.muted, fontWeight: scanLimit === n ? 700 : 400, transition: "all 0.15s" }}>
                    {n}개
                  </button>
                ))}
              </div>
            )}
            {lastUpdated && !loading && <span style={{ fontFamily: FONTS.mono, fontSize: "0.846em", color: C.muted }}>갱신: {fmtTime(lastUpdated)}</span>}
            {loading
              ? <span style={{ fontFamily: FONTS.mono, fontSize: "0.846em", color: C.red }}>{loadedCount} / {scanMode === "topvolume" ? scanLimit : THEME_TICKERS.length} 완료</span>
              : <button onClick={onReload} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 4, fontSize: "0.846em", cursor: "pointer", border: `1px solid ${C.red}`, background: `${C.red}15`, color: C.red }}>
                  🔄 재분석
                </button>
            }
          </div>
        </div>
        {loading && <ProgressBar current={loadedCount} total={scanMode === "topvolume" ? scanLimit : THEME_TICKERS.length} accentColor={C.red} C={C} />}
        {/* 거래대금 상위 API 에러 안내 */}
        {topVolumeError && !loading && (
          <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 4, background: `${C.red}12`, border: `1px solid ${C.red}30`, fontSize: "0.846em", color: C.red }}>
            ⚠ 거래대금 상위 종목 조회 실패: {topVolumeError} — 백엔드에 /api/top-volume 엔드포인트가 필요합니다.
          </div>
        )}
      </div>

      {/* ── 미조회 안내 ── */}
      {notFetched && (
        <div style={{ ...S.panel, textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: "2.5em", marginBottom: 12 }}>📊</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: "1.077em", fontWeight: 700, color: C.text, marginBottom: 8 }}>주도/테마 분석</div>
          <div style={{ fontSize: "0.923em", color: C.muted, marginBottom: 20, lineHeight: 1.7 }}>
            당일 섹터별 자금 흐름과 주도주를 분석합니다.<br />
            {scanMode === "topvolume" ? `거래대금 상위 ${scanLimit}개 종목을 실시간 조회합니다.` : `${THEME_TICKERS.length}개 고정 종목을 조회합니다.`}
          </div>
          <button onClick={onReload} style={{ padding: "10px 28px", borderRadius: 6, fontSize: "0.923em", cursor: "pointer", border: `1px solid ${C.red}`, background: `${C.red}15`, color: C.red, fontFamily: FONTS.mono, fontWeight: 700 }}>
            🔥 분석 시작
          </button>
        </div>
      )}

      {/* ── 요약 카드 4개 ── */}
      {ok.length > 0 && (
        <div className="stat-grid-4" style={S.grid("repeat(4,1fr)")}>
          {[
            { label: "상승 섹터", value: sectorStats.filter(s=>s.avg>0).length + "개", color: C.green },
            { label: "하락 섹터", value: sectorStats.filter(s=>s.avg<0).length + "개", color: C.red },
            { label: "최강 섹터", value: sectorStats[0]?.name || "—", color: C.yellow },
            { label: "최강 주도주", value: topRise[0]?.name || "—", color: C.accent },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ ...S.panel, textAlign: "center" }}>
              <div style={{ fontSize: "0.769em", color: C.muted, marginBottom: 6, fontFamily: FONTS.mono }}>{label}</div>
              <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "1.077em", color }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── 뷰 전환 탭 ── */}
      {ok.length > 0 && (
        <div style={{ display: "flex", gap: 6 }}>
          {[["sector","📊 섹터 분석"], ["rank","🏆 주도주 랭킹"], ["heatmap","🌡 테마 히트맵"]].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} style={{ padding: "7px 16px", borderRadius: 4, fontSize: "0.846em", cursor: "pointer", fontFamily: FONTS.mono, border: `1px solid ${view===id ? C.red : C.border}`, background: view===id ? `${C.red}18` : "transparent", color: view===id ? C.red : C.muted, fontWeight: view===id ? 700 : 400, transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ────────────── 📊 섹터 분석 뷰 ────────────── */}
      {ok.length > 0 && view === "sector" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sectorStats.map(sec => (
            <div key={sec.name} style={{ ...S.panel, padding: 0, overflow: "hidden" }}>
              {/* 섹터 헤더 */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: `1px solid ${C.border}20`, background: `${sec.color}08` }}>
                <div style={{ width: 3, height: 36, borderRadius: 2, background: sec.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "1em", color: sec.color }}>{sec.name}</span>
                    <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "1.077em", color: sec.avg >= 0 ? C.green : C.red }}>
                      {sec.avg >= 0 ? "▲" : "▼"} {Math.abs(sec.avg).toFixed(2)}%
                    </span>
                    <span style={{ fontSize: "0.769em", color: C.muted }}>평균</span>
                  </div>
                  {/* 게이지 바 */}
                  <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden", maxWidth: 200 }}>
                    <div style={{ height: "100%", borderRadius: 2, background: sec.avg >= 0 ? C.green : C.red, width: `${Math.min(100, Math.abs(sec.avg) * 20)}%`, transition: "width 0.6s ease" }} />
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.769em", color: C.muted, marginBottom: 2 }}>섹터 거래대금</div>
                  <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.923em", color: C.yellow }}>{fmtValue(sec.totalTv)}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 80 }}>
                  <div style={{ fontSize: "0.769em", color: C.muted, marginBottom: 2 }}>리더</div>
                  <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.769em", color: C.text }}>{sec.leader?.name}</div>
                </div>
              </div>
              {/* 종목 행 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1, background: C.border }}>
                {sec.list.sort((a,b)=>b.changeRate-a.changeRate).map(s => (
                  <div key={s.code} style={{ padding: "8px 14px", background: C.panel, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.923em", color: C.text }}>{s.name}</div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.muted }}>{s.code}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "0.923em", color: s.changeRate >= 0 ? C.green : C.red }}>
                        {s.changeRate >= 0 ? "▲" : "▼"}{Math.abs(s.changeRate).toFixed(2)}%
                      </div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: s.volRate >= 200 ? C.yellow : C.muted }}>
                        거래량비 {s.volRate}%
                      </div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.yellow }}>
                        {fmtValue(s.tradingValue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ────────────── 🏆 주도주 랭킹 뷰 ────────────── */}
      {ok.length > 0 && view === "rank" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="rank-grid-2">
          {/* 상승률 TOP10 */}
          <div style={{ ...S.panel, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, letterSpacing: 1 }}>📈 상승률 TOP {topRise.length}</span>
            </div>
            {topRise.map((s, i) => (
              <div key={s.code} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: `1px solid ${C.border}15`, background: i === 0 ? `${C.green}08` : "transparent" }}>
                <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "0.923em", color: i < 3 ? C.yellow : C.muted, minWidth: 22 }}>#{i+1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.923em", color: C.text }}>{s.name}</div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                    <span style={{ fontSize: "0.692em", padding: "1px 6px", borderRadius: 10, background: `${(SECTOR_COLORS[s.sector]||C.muted)}20`, color: SECTOR_COLORS[s.sector]||C.muted, border: `1px solid ${(SECTOR_COLORS[s.sector]||C.muted)}40` }}>{s.sector}</span>
                    <span style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: s.volRate >= 200 ? C.yellow : C.muted }}>거래량비 {s.volRate}%</span>
                    <span style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.yellow }}>{fmtValue(s.tradingValue)}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "1em", color: C.green }}>▲{s.changeRate.toFixed(2)}%</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.muted }}>{fmt(s.price)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 거래대금 TOP10 */}
          <div style={{ ...S.panel, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, letterSpacing: 1 }}>💰 거래대금 TOP {topValue.length}</span>
            </div>
            {topValue.map((s, i) => (
              <div key={s.code} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: `1px solid ${C.border}15`, background: i === 0 ? `${C.yellow}08` : "transparent" }}>
                <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "0.923em", color: i < 3 ? C.yellow : C.muted, minWidth: 22 }}>#{i+1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.923em", color: C.text }}>{s.name}</div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                    <span style={{ fontSize: "0.692em", padding: "1px 6px", borderRadius: 10, background: `${(SECTOR_COLORS[s.sector]||C.muted)}20`, color: SECTOR_COLORS[s.sector]||C.muted, border: `1px solid ${(SECTOR_COLORS[s.sector]||C.muted)}40` }}>{s.sector}</span>
                    <span style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.muted }}>거래량비 {s.volRate}%</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "1em", color: C.yellow }}>{fmtValue(s.tradingValue)}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: s.changeRate >= 0 ? C.green : C.red }}>{s.changeRate >= 0 ? "▲" : "▼"}{Math.abs(s.changeRate).toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────── 🌡 테마 히트맵 뷰 ────────────── */}
      {ok.length > 0 && view === "heatmap" && (
        <div style={{ ...S.panel }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, letterSpacing: 1, marginBottom: 14 }}>🌡 섹터 히트맵 — 색상 강도 = 등락률</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            {sectorStats.map(sec => {
              const intensity = Math.min(0.9, Math.abs(sec.avg) / 5);
              const bg = sec.avg >= 0
                ? `rgba(52, 214, 121, ${0.1 + intensity * 0.5})`
                : `rgba(248, 113, 113, ${0.1 + intensity * 0.5})`;
              return (
                <div key={sec.name} style={{ borderRadius: 8, padding: "14px 12px", background: bg, border: `1px solid ${sec.avg >= 0 ? C.green : C.red}30`, textAlign: "center", transition: "all 0.3s" }}>
                  <div style={{ fontSize: "0.769em", color: C.muted, marginBottom: 4 }}>{sec.name}</div>
                  <div style={{ fontFamily: FONTS.mono, fontWeight: 800, fontSize: "1.385em", color: sec.avg >= 0 ? C.green : C.red, marginBottom: 4 }}>
                    {sec.avg >= 0 ? "+" : ""}{sec.avg.toFixed(2)}%
                  </div>
                  <div style={{ fontSize: "0.692em", color: C.muted }}>{sec.list.length}종목</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: "0.692em", color: C.yellow, marginTop: 4 }}>{fmtValue(sec.totalTv)}</div>
                </div>
              );
            })}
          </div>

          {/* 개별 종목 전체 히트맵 */}
          <div style={{ fontFamily: FONTS.mono, fontSize: "0.769em", color: C.muted, letterSpacing: 1, margin: "18px 0 10px" }}>개별 종목 히트맵</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 4 }}>
            {[...ok].sort((a,b)=>b.changeRate-a.changeRate).map(s => {
              const intensity = Math.min(0.9, Math.abs(s.changeRate) / 5);
              const bg = s.changeRate >= 0
                ? `rgba(52, 214, 121, ${0.1 + intensity * 0.5})`
                : `rgba(248, 113, 113, ${0.1 + intensity * 0.5})`;
              return (
                <div key={s.code} style={{ borderRadius: 6, padding: "8px 6px", background: bg, border: `1px solid ${s.changeRate >= 0 ? C.green : C.red}25`, textAlign: "center" }}>
                  <div style={{ fontSize: "0.769em", fontWeight: 600, color: C.text, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                  <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: "0.846em", color: s.changeRate >= 0 ? C.green : C.red }}>
                    {s.changeRate >= 0 ? "+" : ""}{s.changeRate.toFixed(2)}%
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: "0.615em", color: C.yellow, marginTop: 2 }}>{fmtValue(s.tradingValue)}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: "0.615em", color: s.volRate >= 200 ? C.yellow : C.muted }}>거래량비 {s.volRate}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 로딩 스켈레톤 */}
      {loading && stocks.length === 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ ...S.panel }}>
              <div className="shimmer" style={{ height: 12, width: "60%", borderRadius: 4, marginBottom: 8 }} />
              <div className="shimmer" style={{ height: 24, width: "80%", borderRadius: 4, marginBottom: 6 }} />
              <div className="shimmer" style={{ height: 10, width: "40%", borderRadius: 4 }} />
            </div>
          ))}
        </div>
      )}

      <div style={{ ...S.panel, display: "flex", alignItems: "center", gap: 8, fontSize: "0.846em", color: C.muted }}>
        <span style={{ color: C.yellow }}>⚠</span>
        <span>Yahoo Finance 일봉 기준 · 전일 종가 대비 등락률입니다. 장중 실시간 데이터가 아닐 수 있으며, 투자 판단은 본인 책임입니다.</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  13. 종가베팅 탭
// ════════════════════════════════════════════════════════

function ClosingTab({ C, stocks, loading, loadedCount, error, lastUpdated, onReload, watchTickersList, onAddWatchTicker, onDeleteWatchTicker }) {
  const S = makeS(C);
  const [filter, setFilter] = useState("전체");
  const [sortBy, setSortBy] = useState("score");
  const [section, setSection] = useState("recommend");
  const [tickerModalOpen, setTickerModalOpen] = useState(false);

  const SORT_FN = { score: (a, b) => b.score - a.score, volRate: (a, b) => b.volRate - a.volRate, changeRate: (a, b) => Math.abs(b.changeRate) - Math.abs(a.changeRate) };
  const filtered = stocks.filter(s => !s.apiError && (filter === "전체" || s.signal === filter)).sort(SORT_FN[sortBy]);
  const surgeList = [...stocks].filter(s => !s.apiError && s.changeRate >= 2).sort((a, b) => b.changeRate - a.changeRate);
  const dropList = [...stocks].filter(s => s.changeRate <= -2).sort((a, b) => a.changeRate - b.changeRate);
  const volList = [...stocks].sort((a, b) => b.volRate - a.volRate);
  const valueList = [...stocks].sort((a, b) => (b.tradingValue || 0) - (a.tradingValue || 0));
  const okStocks = stocks.filter(s => !s.apiError);
  const summary = { total: okStocks.length, strong: okStocks.filter(s => s.signal === "강력매수").length, buy: okStocks.filter(s => s.signal === "매수").length, other: okStocks.filter(s => ["관망", "주의"].includes(s.signal)).length, failed: stocks.filter(s => s.apiError).length };

  const btnStyle = (active, activeColor) => ({
    padding: "5px 14px", borderRadius: 4, fontSize: "0.923em", cursor: "pointer",
    border: `1px solid ${active ? activeColor : C.border}`,
    background: active ? `${activeColor}18` : "transparent",
    color: active ? activeColor : C.muted,
    fontWeight: active ? 600 : 400,
  });

  // 아직 한 번도 조회하지 않은 상태
  if (!loading && stocks.length === 0 && !error) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:80, gap:20 }} className="slide-in">
        <div style={{ fontSize: "3.077em" }}>⚡</div>
        <div style={{ fontFamily:FONTS.mono, fontSize: "1.231em", fontWeight:700, color:C.yellow }}>종가베팅</div>
        <div style={{ fontSize: "1em", color:C.muted, textAlign:"center", lineHeight:1.7 }}>
          RSI · 볼린저밴드 · 거래량을 복합 분석해 종가 매수 후보를 선별합니다.<br/>
          <span style={{ fontFamily:FONTS.mono, color:C.muted, fontSize: "0.846em" }}>{(watchTickersList||[]).length}개 종목 스캔</span>
        </div>
        <button onClick={onReload} style={{ padding:"10px 32px", borderRadius:6, fontSize: "1em", fontWeight:700, cursor:"pointer", border:`1px solid ${C.yellow}`, background:`${C.yellow}18`, color:C.yellow, fontFamily:FONTS.mono }}>
          ⚡ 조회 시작
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="slide-in">

      {/* 요약 — 도착하는 즉시 카운트 올라감 */}
      <div className="stat-grid-4" style={S.grid("repeat(4,1fr)")}>
        <StatCard label="스캔 종목" value={`${summary.total}개`} color={C.accent} C={C} onClick={() => setTickerModalOpen(true)} />
        <StatCard label="강력매수" value={`${summary.strong}개`} color={C.green} C={C} />
        <StatCard label="매수 신호" value={`${summary.buy}개`} color={C.yellow} C={C} />
        <StatCard label="관망/주의" value={`${summary.other}개`} color={C.muted} C={C} />
      </div>

      {/* 스캔 종목 모달 */}
      {tickerModalOpen && (
        <TickerListModal
          tickers={watchTickersList}
          title="⚡ 종가베팅 스캔 종목"
          accentColor={C.accent}
          C={C}
          onClose={() => setTickerModalOpen(false)}
          onAdd={onAddWatchTicker}
          onDelete={onDeleteWatchTicker}
        />
      )}

      {/* 섹션 탭 + 진행률 + 새로고침 */}
      <div style={{ ...S.panel, padding: "10px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {CLOSING_SECTIONS.map(t => (
              <button key={t.id} onClick={() => setSection(t.id)} style={btnStyle(section === t.id, C.yellow)}>{t.label}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {lastUpdated && !loading && <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.846em", color: C.muted }}>갱신: {fmtTime(lastUpdated)}</span>}
            {loading
              ? <span style={{ fontFamily: FONTS.mono, fontSize: "0.846em", color: C.accent }}>{loadedCount} / {(watchTickersList||[]).length} 로드</span>
              : <button onClick={onReload} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 4, fontSize: "0.846em", cursor: "pointer", border: `1px solid ${C.accent}`, background: `${C.accent}15`, color: C.accent }}>
                🔄 새로고침
              </button>
            }
          </div>
        </div>
        {/* 진행률 바 */}
        {loading && (
          <ProgressBar current={loadedCount} total={(watchTickersList||[]).length} accentColor={C.accent} C={C} />
        )}
      </div>

      {error && (
        <div style={{ ...S.panel, background: `${C.red}10`, border: `1px solid ${C.red}40`, fontSize: "0.923em", color: C.red }}>
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
              <span style={{ fontSize: "0.846em", color: C.muted }}>정렬</span>
              {[["score", "점수순"], ["volRate", "거래량순"], ["changeRate", "등락률순"]].map(([k, l]) => (
                <button key={k} onClick={() => setSortBy(k)} style={btnStyle(sortBy === k, C.accent)}>{l}</button>
              ))}
            </div>
          </div>
          {/* 도착한 카드 즉시 표시 + 아직 안 온 자리는 스켈레톤 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
            {filtered.map(s => <StockScoreCard key={s.ticker} s={s} C={C} />)}
            {loading && Array.from({ length: Math.max(0, (watchTickersList||[]).length - stocks.length) }).map((_, i) => (
              <SkeletonCard key={`sk-${i}`} C={C} />
            ))}
          </div>
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
          {/* 도착한 행 즉시 표시 */}
          {list.map((s, i) => <RankRow key={s.ticker} s={s} idx={i} valueKey={key} C={C} />)}
          {/* 아직 안 온 행 스켈레톤 */}
          {loading && Array.from({ length: Math.max(0, (watchTickersList||[]).length - stocks.length) }).map((_, i) => (
            <SkeletonRow key={`skr-${i}`} />
          ))}
          {!loading && list.length === 0 && (
            <div style={{ padding: 24, color: C.muted, textAlign: "center" }}>{empty}</div>
          )}
        </div>
      ))}

      {/* 거래대금 */}
      {section === "value" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* TOP3 메달 — 3개 도착할 때까지 스켈레톤 혼합 */}
          <div className="stat-grid-3" style={S.grid("repeat(3,1fr)")}>
            {valueList.slice(0, 3).map((s, i) => <MedalCard key={s.ticker} s={s} rank={i} C={C} />)}
            {loading && Array.from({ length: Math.max(0, 3 - valueList.length) }).map((_, i) => (
              <div key={`msk-${i}`} style={{ ...S.panel, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div className="shimmer" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                <div className="shimmer" style={{ height: 14, width: 80, borderRadius: 4 }} />
                <div className="shimmer" style={{ height: 24, width: 100, borderRadius: 4 }} />
              </div>
            ))}
          </div>
          <div style={{ ...S.panel, padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span>💰</span><span style={S.monoLabel}>거래대금 전체 순위</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {loading && <div className="spin" style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.yellow }} />}
                <span style={{ fontSize: "0.769em", color: C.muted }}>거래대금 = 주가 × 거래량</span>
              </div>
            </div>
            {/* 도착한 행 즉시 표시 */}
            {valueList.map((s, i) => <RankRow key={s.ticker} s={s} idx={i} valueKey="tradingValue" C={C} />)}
            {/* 아직 안 온 행 스켈레톤 */}
            {loading && Array.from({ length: Math.max(0, (watchTickersList||[]).length - stocks.length) }).map((_, i) => (
              <SkeletonRow key={`vsk-${i}`} />
            ))}
          </div>
        </div>
      )}

      <div style={{ ...S.panel, display: "flex", alignItems: "center", gap: 8, fontSize: "0.846em", color: C.muted }}>
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
      <div style={{ marginTop: 12, padding: 12, background: `${C.green}10`, border: `1px solid ${C.green}20`, borderRadius: 4, fontSize: "0.923em", color: C.muted }}>
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
  const [fontSize, setFontSize] = useState(15);
  const incFont   = () => setFontSize(v => Math.min(30, v + 1));
  const decFont   = () => setFontSize(v => Math.max(10, v - 1));
  const resetFont = () => setFontSize(15);

  // ── Render Cold Start 감지 ────────────────────────────
  const RENDER_URL     = "https://trade-backend-3o2e.onrender.com";
  const COLD_START_MS  = 3000; // 3초 이상 응답 없으면 안내
  const [coldStartVisible,  setColdStartVisible]  = useState(false);
  const [coldStartDone,     setColdStartDone]     = useState(false);
  const [coldStartElapsed,  setColdStartElapsed]  = useState(0);

  // viewport 메타태그 주입 (모바일 대응)
  useEffect(() => {
    if (!document.querySelector('meta[name="viewport"]')) {
      const m = document.createElement('meta');
      m.name = 'viewport';
      m.content = 'width=device-width, initial-scale=1, maximum-scale=1';
      document.head.appendChild(m);
    }
  }, []);

  useEffect(() => {
    let timer = null;
    let interval = null;
    const t0 = Date.now();

    // COLD_START_MS 후에도 응답 없으면 안내 모달 표시
    timer = setTimeout(() => {
      setColdStartVisible(true);
      // 경과 시간 카운터
      interval = setInterval(() => {
        setColdStartElapsed(Math.floor((Date.now() - t0) / 1000));
      }, 1000);
    }, COLD_START_MS);

    fetch(`${RENDER_URL}/api/health`, { signal: AbortSignal.timeout(30000) })
      .finally(() => {
        clearTimeout(timer);
        clearInterval(interval);
        setColdStartVisible(false);
        setColdStartDone(true);
      });

    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  // ── State ─────────────────────────────────────────────
  const [tab, setTab] = useState("menu_dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── 스캔 종목 리스트 (런타임 추가/삭제 가능) ─────────────
  const [watchTickers, setWatchTickers] = useState(WATCH_TICKERS);
  const [ywTickers,    setYwTickers]    = useState(YW_PICK_TICKERS);
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

  // ── 종가베팅 데이터 (탭 이동해도 유지) ─────────────────
  const [closingStocks,      setClosingStocks]      = useState([]);
  const [closingLoading,     setClosingLoading]     = useState(false);
  const [closingLoadedCount, setClosingLoadedCount] = useState(0);
  const [closingError,       setClosingError]       = useState(null);
  const [closingLastUpdated, setClosingLastUpdated] = useState(null);
  const [closingFetched,     setClosingFetched]     = useState(false); // 최초 1회 플래그

  const loadClosingData = async () => {
    setClosingLoading(true);
    setClosingError(null);
    setClosingStocks([]);
    setClosingLoadedCount(0);
    let anyOk = false;
    for (const t of watchTickers) {
      try {
        const d = await fetchYahooQuote(t.ticker);
        anyOk = true;
        setClosingStocks(prev => [...prev, { ...d, ...t, apiError: false }]);
      } catch (err) {
        console.warn(`${t.ticker} 실패:`, err);
        setClosingStocks(prev => [...prev, { ...t, apiError: true }]);
      } finally { setClosingLoadedCount(prev => prev + 1); }
      await delay(300);
    }
    if (!anyOk) { setClosingError("데이터를 불러올 수 없습니다"); setClosingStocks(MOCK_CLOSING); }
    setClosingLastUpdated(new Date());
    setClosingLoading(false);
    setClosingFetched(true);
  };

  // ── YW's Pick 데이터 (탭 이동해도 유지) ─────────────────
  const [ywStocks,      setYwStocks]      = useState([]);
  const [ywLoading,     setYwLoading]     = useState(false);
  const [ywLoadedCount, setYwLoadedCount] = useState(0);
  const [ywError,       setYwError]       = useState(null);
  const [ywLastUpdated, setYwLastUpdated] = useState(null);
  const [ywFetched,     setYwFetched]     = useState(false); // 최초 1회 플래그

  // ── 주도/테마 데이터 ──────────────────────────────────
  const [themeStocks,      setThemeStocks]      = useState([]);
  const [themeLoading,     setThemeLoading]     = useState(false);
  const [themeLoadedCount, setThemeLoadedCount] = useState(0);
  const [themeLastUpdated, setThemeLastUpdated] = useState(null);
  const [themeFetched,     setThemeFetched]     = useState(false);
  const [themeScanMode,    setThemeScanMode]    = useState("preset");   // "preset" | "topvolume"
  const [themeScanLimit,   setThemeScanLimit]   = useState(50);
  const [topVolumeError,   setTopVolumeError]   = useState(null);

  const loadThemeData = async () => {
    setThemeLoading(true);
    setThemeStocks([]);
    setThemeLoadedCount(0);
    setTopVolumeError(null);

    let targetList = THEME_TICKERS;

    // 거래대금 상위 모드: 백엔드에서 종목 리스트 먼저 조회
    if (themeScanMode === "topvolume") {
      try {
        targetList = await fetchTopVolumeList(themeScanLimit);
      } catch (err) {
        console.warn("top-volume 조회 실패:", err);
        setTopVolumeError(err.message);
        // 실패 시 고정 종목으로 폴백
        targetList = THEME_TICKERS;
      }
    }

    for (const t of targetList) {
      try {
        const d = await fetchThemeQuote(t);
        setThemeStocks(prev => [...prev, d]);
      } catch (err) {
        console.warn(`${t.ticker} 실패:`, err);
        setThemeStocks(prev => [...prev, { ...t, apiError: true, changeRate: 0, volRate: 0, tradingValue: 0, sector: SECTOR_MAP[t.code] || "기타" }]);
      } finally { setThemeLoadedCount(prev => prev + 1); }
      await delay(200);
    }
    setThemeLastUpdated(new Date());
    setThemeLoading(false);
    setThemeFetched(true);
  };

  const loadYwData = async () => {
    setYwLoading(true);
    setYwError(null);
    setYwStocks([]);
    setYwLoadedCount(0);
    let anyOk = false;
    for (const t of ywTickers) {
      try {
        const d = await fetchYahooQuote(t.ticker);
        anyOk = true;
        setYwStocks(prev => [...prev, { ...d, ...t, apiError: false }]);
      } catch (err) {
        console.warn(`${t.ticker} 실패:`, err);
        setYwStocks(prev => [...prev, { ...t, apiError: true }]);
      } finally { setYwLoadedCount(prev => prev + 1); }
      await delay(300);
    }
    if (!anyOk) { setYwError("모든 종목 데이터를 불러올 수 없습니다"); setYwStocks(MOCK_YW_PICKS); }
    setYwLastUpdated(new Date());
    setYwLoading(false);
    setYwFetched(true);
  };

  // ── 시장 지수·환율 데이터 (탭 이동해도 유지) ─────────────
  const [marketItems,       setMarketItems]       = useState(MARKET_ITEMS.map(m => ({ ...m, price: null, changeRate: null, closes: [] })));
  const [marketLoading,     setMarketLoading]     = useState(false);
  const [marketLastUpdated, setMarketLastUpdated] = useState(null);
  const [marketFetched,     setMarketFetched]     = useState(false); // 최초 1회 플래그

  const loadMarketData = async () => {
    setMarketLoading(true);
    setMarketItems(MARKET_ITEMS.map(m => ({ ...m, price: null, changeRate: null, closes: [], apiError: false }))); // 리셋
    for (const item of MARKET_ITEMS) {
      try {
        const d = await fetchMarketItem(item);
        setMarketItems(prev => prev.map(p => p.id === item.id ? { ...d, apiError: false } : p));
      } catch (e) {
        console.warn(`${item.ticker} 실패:`, e);
        setMarketItems(prev => prev.map(p => p.id === item.id ? { ...p, apiError: true, price: null, changeRate: null } : p));
      }
      await delay(200);
    }
    setMarketLastUpdated(new Date());
    setMarketLoading(false);
    setMarketFetched(true);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      setPrices(prev => prev.map(arr => [...arr.slice(-20), arr[arr.length - 1] + (Math.random() - 0.5) * 200]));
    }, 1500);
    return () => clearInterval(t);
  }, []);

  // 앱 최초 로드 시 대시보드 market 데이터 1회 자동 로드
  useEffect(() => { loadMarketData(); }, []);

  // ── 관리자 모드 ───────────────────────────────────────────
  // TODO: 보안코드는 추후 DB 연동 예정 — 현재는 상수로 관리
  const ADMIN_CODE = "yw2026";
  const [isAdmin,        setIsAdmin]        = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminInput,     setAdminInput]     = useState("");
  const [adminError,     setAdminError]     = useState("");
  const [adminShake,     setAdminShake]     = useState(false);

  const openAdminModal  = () => { setAdminModalOpen(true); setAdminInput(""); setAdminError(""); };
  const closeAdminModal = () => { setAdminModalOpen(false); setAdminInput(""); setAdminError(""); };
  const logoutAdmin     = () => {
    setIsAdmin(false);
    const adminTabs = TABS.filter(t => t.adminOnly).map(t => t.id);
    if (adminTabs.includes(tab)) setTab("menu_dashboard");
  };

  const submitAdmin = () => {
    if (adminInput === ADMIN_CODE) {
      setIsAdmin(true);
      closeAdminModal();
    } else {
      setAdminError("보안코드가 올바르지 않습니다.");
      setAdminShake(true);
      setTimeout(() => setAdminShake(false), 500);
    }
  };

  // 비관리자: 우클릭 · F12 · 개발자도구 단축키 차단
  useEffect(() => {
    const blockContext = e => { if (!isAdmin) e.preventDefault(); };
    const blockKeys = e => {
      if (isAdmin) return;
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I","J","C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) { e.preventDefault(); }
    };
    document.addEventListener("contextmenu", blockContext);
    document.addEventListener("keydown",     blockKeys);
    return () => {
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("keydown",     blockKeys);
    };
  }, [isAdmin]);

  const totalEval = holdings.reduce((s, h) => s + h.qty * h.currentPrice, 0);
  const totalProfit = holdings.reduce((s, h) => s + h.qty * (h.currentPrice - h.avgPrice), 0);
  const placeOrder = side => setLogs(prev => [{ time: fmtTime(new Date()), type: side, msg: `${selectedStock.name} ${orderQty}주 ${side === "buy" ? "매수" : "매도"} @ ${fmt(orderPrice)}` }, ...prev]);
  const tabAccent = t => t === "menu_closing" ? C.yellow : t === "menu_yw-pick" ? C.yellow : t === "menu_theme" ? C.red : C.accent;

  return (
    <div className="theme-transition" style={{ fontFamily: FONTS.sans, background: C.bg, minHeight: "100vh", color: C.text, overflowX: "hidden", maxWidth: "100vw" }}>
      <style>{makeCSS(C, isDark)}</style>

      {/* ── 헤더 ── */}
      <header style={{ background: C.header, borderBottom: `1px solid ${C.headerBorder}`, padding: "0 14px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", fontSize: 13, position: "relative" }}>
        {/* ── 헤더 메인 행 ── */}
        <div style={{ display: "flex", alignItems: "center", height: 46, gap: 0 }}>

          {/* 로고 */}
          <div style={{ fontFamily: FONTS.header, fontSize: 16, fontWeight: 600, color: C.accent, letterSpacing: 2, marginRight: 16, flexShrink: 0 }}>
            ◈ <span style={{ color: C.yellow }}>YW</span><span style={{ color: C.green }}>TRADE</span>
            <span style={{ fontSize: 9, fontWeight: 400, color: C.headerMuted, marginLeft: 6, letterSpacing: 0.5 }}>v{APP_VERSION}</span>
          </div>

          {/* PC 탭 — 로고 바로 옆, 왼쪽 정렬 */}
          <div className="header-tabs" style={{ display: "flex", alignItems: "stretch", height: "100%", gap: 0 }}>
            <div style={{ width: 1, background: C.headerBorder, margin: "8px 12px" }} />
            {TABS.filter(t => !t.adminOnly || isAdmin).map((t, i, arr) => (
              <Fragment key={t.id}>
                {t.adminOnly && (i === 0 || !arr[i - 1].adminOnly) && (
                  <div style={{ width: 1, background: C.headerBorder, opacity: 0.4, margin: "8px 8px" }} />
                )}
                <button onClick={() => {
                  setTab(t.id);
                  if (t.id === "menu_dashboard" && !marketFetched && !marketLoading) loadMarketData();
                  if (t.id === "menu_closing"   && !closingFetched && !closingLoading) loadClosingData();
                  if (t.id === "menu_yw-pick"   && !ywFetched && !ywLoading) loadYwData();
                  if (t.id === "menu_theme"     && !themeFetched && !themeLoading) loadThemeData();
                }} style={{ background: "none", border: "none", borderBottom: tab === t.id ? `2px solid ${tabAccent(t.id)}` : "2px solid transparent", borderTop: "2px solid transparent", cursor: "pointer", fontFamily: FONTS.header, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", padding: "0 10px", height: "100%", color: tab === t.id ? tabAccent(t.id) : t.adminOnly ? C.accent : C.headerMuted, opacity: t.adminOnly ? 0.85 : 1, whiteSpace: "nowrap" }}>
                  {t.label}
                </button>
              </Fragment>
            ))}
          </div>

          {/* spacer */}
          <div style={{ flex: 1 }} />

          {/* 우측 컨트롤 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className={autoEnabled ? "pulse" : ""} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className={autoEnabled ? "blink" : ""} style={{ width: 6, height: 6, borderRadius: "50%", background: autoEnabled ? C.green : C.headerMuted }} />
              <span style={{ fontFamily: FONTS.header, fontSize: 10, color: autoEnabled ? C.green : C.headerMuted }}>{autoEnabled ? "AUTO ON" : "AUTO OFF"}</span>
            </div>
            <span style={{ fontFamily: FONTS.header, fontSize: 11, color: C.headerMuted }}>{fmtTime(time)}</span>
            <div className="hide-mobile" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 4, padding: "4px 10px", fontSize: 11, color: C.yellow }}>
              KRW 12,845,320
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(v => !v)} C={C} />
            {/* 폰트 크기 */}
            <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 2, border: `1px solid ${C.headerBorder}`, borderRadius: 4, overflow: "hidden" }}>
              <button onClick={decFont} disabled={fontSize <= 10} style={{ padding: "3px 8px", background: "none", border: "none", cursor: fontSize <= 10 ? "not-allowed" : "pointer", color: fontSize <= 10 ? C.headerBorder : C.headerMuted, fontFamily: FONTS.header, fontSize: 14, lineHeight: 1, fontWeight: 700 }}>−</button>
              <span style={{ fontFamily: FONTS.header, fontSize: 10, color: C.headerMuted, minWidth: 24, textAlign: "center" }}>{fontSize}</span>
              <button onClick={incFont} disabled={fontSize >= 30} style={{ padding: "3px 8px", background: "none", border: "none", cursor: fontSize >= 30 ? "not-allowed" : "pointer", color: fontSize >= 30 ? C.headerBorder : C.headerMuted, fontFamily: FONTS.header, fontSize: 14, lineHeight: 1, fontWeight: 700 }}>+</button>
              <div style={{ width: 1, height: 14, background: C.headerBorder }} />
              <button onClick={resetFont} title="기본값(15)으로 초기화" style={{ padding: "3px 7px", background: "none", border: "none", cursor: fontSize === 15 ? "not-allowed" : "pointer", color: fontSize === 15 ? C.headerBorder : C.accent, lineHeight: 1, display: "flex", alignItems: "center" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </div>
            {/* 햄버거 버튼 — 모바일 전용 */}
            <button className="hamburger-btn" onClick={() => setMobileMenuOpen(v => !v)}
              style={{ display: "none", background: "none", border: `1px solid ${C.headerBorder}`, borderRadius: 4, padding: "5px 7px", cursor: "pointer", flexDirection: "column", gap: 4, alignItems: "center", justifyContent: "center" }}>
              <span style={{ display: "block", width: 18, height: 2, background: mobileMenuOpen ? C.accent : C.headerMuted, borderRadius: 1, transition: "transform 0.2s, opacity 0.2s", transform: mobileMenuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
              <span style={{ display: "block", width: 18, height: 2, background: mobileMenuOpen ? C.accent : C.headerMuted, borderRadius: 1, transition: "opacity 0.2s", opacity: mobileMenuOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: 18, height: 2, background: mobileMenuOpen ? C.accent : C.headerMuted, borderRadius: 1, transition: "transform 0.2s, opacity 0.2s", transform: mobileMenuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer" style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.header, borderBottom: `1px solid ${C.headerBorder}`, zIndex: 200, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}>
            {TABS.filter(t => !t.adminOnly || isAdmin).map((t, i, arr) => (
              <Fragment key={t.id}>
                {t.adminOnly && (i === 0 || !arr[i - 1].adminOnly) && (
                  <div style={{ height: 1, background: C.headerBorder, opacity: 0.4, margin: "0 16px" }} />
                )}
                <button onClick={() => {
                  setTab(t.id);
                  setMobileMenuOpen(false);
                  if (t.id === "menu_dashboard" && !marketFetched && !marketLoading) loadMarketData();
                  if (t.id === "menu_closing"   && !closingFetched && !closingLoading) loadClosingData();
                  if (t.id === "menu_yw-pick"   && !ywFetched && !ywLoading) loadYwData();
                  if (t.id === "menu_theme"     && !themeFetched && !themeLoading) loadThemeData();
                }} style={{ display: "flex", alignItems: "center", width: "100%", padding: "14px 20px", background: tab === t.id ? `${tabAccent(t.id)}12` : "none", border: "none", borderLeft: tab === t.id ? `3px solid ${tabAccent(t.id)}` : "3px solid transparent", cursor: "pointer", fontFamily: FONTS.header, fontSize: 13, letterSpacing: 1, color: tab === t.id ? tabAccent(t.id) : t.adminOnly ? C.accent : C.headerMuted, textAlign: "left" }}>
                  {t.label}
                </button>
              </Fragment>
            ))}
          </div>
        )}
      </header>

      {/* ── 컨텐츠 — fontSize state 상속 적용 ── */}
      <div style={{ fontSize }}>

      {/* ── 컨텐츠 ── */}
      <main className="main-padding" style={{ padding: 16, maxWidth: 1400, margin: "0 auto" }}>

        {/* ━━━ 대시보드 ━━━ */}
        {tab === "menu_dashboard" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }} className="slide-in">

            {/* ── 지수·환율 요약 바 ── */}
            <MarketOverviewPanel C={C} items={marketItems} loading={marketLoading} lastUpdated={marketLastUpdated} onReload={loadMarketData} />

            <div style={S.grid("320px 1fr")}>
              {/* 관심종목 */}
              <div style={{ ...S.panel, padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={S.monoLabel}>WATCHLIST</span>
                  <span style={{ fontSize: "0.769em", color: C.muted }}>실시간</span>
                </div>
                {MOCK_STOCKS.map((s, i) => (
                  <div key={s.code} onClick={() => setSelectedStock(s)} style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}20`, cursor: "pointer", transition: "background 0.2s", background: selectedStock.code === s.code ? C.selected : "transparent", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: "1em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.text }}>{s.name}</div>
                      <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.769em", color: C.muted }}>{s.code}</div>
                    </div>
                    <div style={{ flexShrink: 0, width: 80 }}>
                      <MiniChart data={prices[i]} color={s.change >= 0 ? C.green : C.red} width={80} height={28} />
                    </div>
                    <div style={{ textAlign: "right", minWidth: 80 }}>
                      <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "1em", color: C.text }}>{fmt(s.price)}</div>
                      <ChangeText value={s.changeRate} C={C} />
                    </div>
                  </div>
                ))}
              </div>

              {/* 차트 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ ...S.panel, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "1.385em", fontWeight: 700, color: C.text }}>
                      {selectedStock.name} <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.923em", color: C.muted }}>{selectedStock.code}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
                      <span style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "1.846em", color: selectedStock.change >= 0 ? C.green : C.red }}>{fmt(selectedStock.price)}</span>
                      <ChangeText value={selectedStock.changeRate} C={C} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {[["고가", selectedStock.high, C.green], ["저가", selectedStock.low, C.red], ["거래량", selectedStock.volume, C.yellow]].map(([label, val, col]) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "0.769em", color: C.muted }}>{label}</div>
                        <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "0.923em", color: col }}>{typeof val === "number" && val > 100000 ? `${(val / 10000).toFixed(0)}만` : fmt(val)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ ...S.panel, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={S.monoLabel}>CANDLE · 1MIN</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["1분", "5분", "1시간", "1일"].map(p => (
                        <button key={p} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 3, color: C.muted, fontSize: "0.769em", padding: "2px 8px", cursor: "pointer", fontFamily: FONTS.mono }}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <CandleChart candles={CANDLE_DATA} C={C} />
                </div>

                {/* ── 시장 상세 지수 카드 ── */}
                <MarketDetailPanel C={C} />
              </div>
            </div>
          </div>
        )}

        {/* ━━━ 자동매매 ━━━ */}
        {tab === "menu_auto" && (
          <div style={S.grid("280px 1fr")}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={S.panel}>
                <PanelHeader label="자동매매 제어" C={C} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: "1em", color: C.text }}>자동매매 활성화</span>
                  <div onClick={() => setAutoEnabled(v => !v)} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", position: "relative", transition: "background 0.3s", background: autoEnabled ? C.green : C.border }}>
                    <div style={{ position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)", left: autoEnabled ? 22 : 2 }} />
                  </div>
                </div>
                {autoEnabled && <div className="blink" style={{ fontSize: "0.846em", color: C.green, textAlign: "center", padding: 6, background: `${C.green}10`, borderRadius: 4, border: `1px solid ${C.green}30` }}>● 자동매매 실행 중</div>}
              </div>
              <div style={S.panel}>
                <PanelHeader label="전략 선택" C={C} />
                {AUTO_STRATEGIES.map(s => (
                  <div key={s.id} onClick={() => setSelectedStrategy(s.id)} style={{ padding: "10px 12px", borderRadius: 4, marginBottom: 6, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${selectedStrategy === s.id ? C.accent : C.border}`, background: selectedStrategy === s.id ? `${C.accent}12` : "transparent" }}>
                    <div style={{ fontWeight: 500, color: selectedStrategy === s.id ? C.accent : C.text }}>{s.name}</div>
                    <div style={{ fontSize: "0.846em", color: C.muted, marginTop: 2 }}>{s.desc}</div>
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
                  {MOCK_STOCKS.map(s => <div key={s.code} style={{ padding: "4px 10px", border: `1px solid ${C.border}`, borderRadius: 20, fontSize: "0.923em", cursor: "pointer", color: C.muted }}>{s.name}</div>)}
                  <div style={{ padding: "4px 10px", border: `1px dashed ${C.accent}`, borderRadius: 20, fontSize: "0.923em", cursor: "pointer", color: C.accent }}>+ 추가</div>
                </div>
              </div>
              <div style={S.panel}>
                <PanelHeader label="전략 성과 (시뮬레이션)" C={C} />
                <div className="stat-grid-4" style={S.grid("repeat(4,1fr)")}>
                  {[["총 수익률", "+12.4%", C.green], ["승률", "64%", C.accent], ["총 거래횟수", "128회", C.yellow], ["최대 낙폭", "-4.2%", C.red]].map(([label, val, col]) => (
                    <div key={label} style={{ textAlign: "center", padding: 12, background: C.panelAlt, borderRadius: 4, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: "0.846em", color: C.muted, marginBottom: 6 }}>{label}</div>
                      <div style={{ fontFamily: FONTS.mono, fontWeight: 600, fontSize: "1.231em", color: col }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 주문 유형 + 호가창 */}
              <div style={{ ...S.panel, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <PanelHeader label="주문 유형" C={C} />
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    {[["limit", "지정가"], ["market", "시장가"]].map(([val, label]) => (
                      <button key={val} onClick={() => setOrderType(val)} style={{ flex: 1, padding: 6, cursor: "pointer", borderRadius: 4, fontSize: "0.923em", border: `1px solid ${orderType === val ? C.accent : C.border}`, background: orderType === val ? `${C.accent}20` : "transparent", color: orderType === val ? C.accent : C.muted }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                    <InputField label="수량" type="number" value={orderQty} onChange={e => setOrderQty(+e.target.value)} C={C} />
                    <InputField label="가격" type="number" value={orderPrice} onChange={e => setOrderPrice(+e.target.value)} C={C} />
                  </div>
                  <div style={{ fontSize: "0.846em", color: C.muted, marginBottom: 10 }}>
                    총 주문금액: <span style={{ color: C.yellow, fontFamily: FONTS.mono, fontWeight: 600 }}>{fmt(orderQty * orderPrice)}원</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["buy", "매수", C.green], ["sell", "매도", C.red]].map(([side, label, col]) => (
                      <button key={side} onClick={() => placeOrder(side)} style={{ flex: 1, padding: 10, cursor: "pointer", fontWeight: 700, fontSize: "1em", borderRadius: 4, background: `${col}20`, border: `1px solid ${col}`, color: col }}>{label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <PanelHeader label="호가창" C={C} />
                  {[...Array(5)].map((_, i) => (
                    <div key={`ask-${i}`} style={{ display: "flex", justifyContent: "space-between", padding: "3px 6px", background: `${C.red}10`, marginBottom: 1, borderRadius: 2, fontSize: "0.846em" }}>
                      <span style={{ color: C.red, fontFamily: FONTS.mono, fontWeight: 600 }}>{fmt(selectedStock.price + (5 - i) * 100)}</span>
                      <span style={{ color: C.muted }}>{(Math.random() * 5000 | 0).toLocaleString()}</span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: C.accent, margin: "4px 0", opacity: 0.4 }} />
                  {[...Array(5)].map((_, i) => (
                    <div key={`bid-${i}`} style={{ display: "flex", justifyContent: "space-between", padding: "3px 6px", background: `${C.green}10`, marginBottom: 1, borderRadius: 2, fontSize: "0.846em" }}>
                      <span style={{ color: C.green, fontFamily: FONTS.mono, fontWeight: 600 }}>{fmt(selectedStock.price - i * 100)}</span>
                      <span style={{ color: C.muted }}>{(Math.random() * 5000 | 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ━━━ 종가베팅 ━━━ */}
        {tab === "menu_closing" && <ClosingTab C={C} stocks={closingStocks} loading={closingLoading} loadedCount={closingLoadedCount} error={closingError} lastUpdated={closingLastUpdated} onReload={loadClosingData} watchTickersList={watchTickers} onAddWatchTicker={isAdmin ? t => setWatchTickers(prev => [...prev, t]) : undefined} onDeleteWatchTicker={isAdmin ? ticker => setWatchTickers(prev => prev.filter(x => x.ticker !== ticker)) : undefined} />}

        {/* ━━━ YW's Pick ━━━ */}
        {tab === "menu_yw-pick" && <YwPickTab C={C} stocks={ywStocks} loading={ywLoading} loadedCount={ywLoadedCount} error={ywError} lastUpdated={ywLastUpdated} onReload={loadYwData} ywPickTickers={ywTickers} onAddYwTicker={isAdmin ? t => setYwTickers(prev => [...prev, t]) : undefined} onDeleteYwTicker={isAdmin ? ticker => setYwTickers(prev => prev.filter(x => x.ticker !== ticker)) : undefined} />}

        {/* ━━━ 주도/테마 ━━━ */}
        {tab === "menu_theme" && <ThemeTab C={C} stocks={themeStocks} loading={themeLoading} loadedCount={themeLoadedCount} lastUpdated={themeLastUpdated} onReload={loadThemeData} scanMode={themeScanMode} onChangeScanMode={mode => { setThemeScanMode(mode); setThemeFetched(false); setThemeStocks([]); }} scanLimit={themeScanLimit} onChangeScanLimit={n => { setThemeScanLimit(n); setThemeFetched(false); setThemeStocks([]); }} topVolumeError={topVolumeError} />}

        {/* ━━━ 포트폴리오 ━━━ */}
        {tab === "menu_portfolio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="slide-in">
            <div className="stat-grid-4" style={S.grid("repeat(4,1fr)")}>
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
                      <th key={h} style={{ padding: "8px 12px", textAlign: "right", fontSize: "0.846em", color: C.muted, fontWeight: 400, fontFamily: FONTS.mono, letterSpacing: 1 }}>{h}</th>
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
                        <td style={{ padding: 12, textAlign: "right", fontFamily: FONTS.mono, color: C.muted, fontSize: "0.846em" }}>{h.code}</td>
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
        {tab === "menu_log" && (
          <div style={S.panel} className="slide-in">
            <PanelHeader label="매매 로그" C={C} />
            <div style={{ fontFamily: FONTS.mono, fontSize: "0.923em", maxHeight: 500, overflowY: "auto" }}>
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

      {/* ── 푸터 ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: "0.846em", color: C.muted }}>
          © 2026 <span style={{ color: C.yellow }}>YW</span><span style={{ color: C.green }}>TRADE</span> Dashboard. Created by <span style={{ color: C.accent }}>조영욱</span>.
        </span>
        {/* 관리자 아이콘 — 우측 절대 위치 */}
        <div style={{ position: "absolute", right: 16, bottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          {isAdmin && (
            <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.green, background: `${C.green}18`, border: `1px solid ${C.green}35`, borderRadius: 3, padding: "2px 6px", letterSpacing: 1 }}>
              ADMIN
            </span>
          )}
          <button
            onClick={isAdmin ? logoutAdmin : openAdminModal}
            title={isAdmin ? "관리자 모드 해제" : "관리자 로그인"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: isAdmin ? C.green : C.border, display: "flex", alignItems: "center", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = isAdmin ? C.red : C.muted}
            onMouseLeave={e => e.currentTarget.style.color = isAdmin ? C.green : C.border}
          >
            {isAdmin ? (
              /* 잠금 해제 아이콘 */
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
              </svg>
            ) : (
              /* 자물쇠 아이콘 */
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            )}
          </button>
        </div>
      </footer>

      {/* ── Render Cold Start 안내 모달 ── */}
      {coldStartVisible && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998 }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 36px", width: 360, boxShadow: "0 12px 48px rgba(0,0,0,0.6)", textAlign: "center" }}>
            {/* 아이콘 — 잠자는 서버 */}
            <div style={{ fontSize: "2.5em", marginBottom: 14 }}>⭐</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: "1.077em", fontWeight: 700, color: C.text, marginBottom: 10, letterSpacing: 0.5 }}>
              서버 기동 중...
            </div>
            <div style={{ fontSize: "0.923em", color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
              서버가 <span style={{ color: C.yellow, fontWeight: 600 }}>Sleep 모드</span>에서 깨어나고 있습니다.<br />
              Cold Start 시간이 필요하니 잠시만 기다려 주세요.
            </div>
            {/* 스피너 + 경과 시간 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
              <div className="spin" style={{ width: 18, height: 18, borderRadius: "50%", border: `2.5px solid ${C.border}`, borderTopColor: C.accent, flexShrink: 0 }} />
              <span style={{ fontFamily: FONTS.mono, fontSize: "0.923em", color: C.accent }}>
                대기 중 {coldStartElapsed}초...
              </span>
            </div>
            {/* 진행 바 (30초 기준) */}
            <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(to right, ${C.accent}, ${C.green})`, width: `${Math.min(100, (coldStartElapsed / 30) * 100)}%`, transition: "width 1s linear" }} />
            </div>
            <div style={{ fontSize: "0.769em", color: C.muted, marginTop: 10 }}>
              보통 10 ~ 30초 이내 완료됩니다.
            </div>
          </div>
        </div>
      )}

      {/* ── 관리자 보안코드 모달 ── */}
      {adminModalOpen && (
        <div onClick={closeAdminModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "28px 32px", width: 320, boxShadow: `0 8px 40px rgba(0,0,0,0.5)`, animation: adminShake ? "shake 0.4s ease" : "none" }}>
            <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }`}</style>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: 1 }}>관리자 인증</span>
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>보안코드를 입력하세요.</div>
            <input
              type="password"
              value={adminInput}
              onChange={e => { setAdminInput(e.target.value); setAdminError(""); }}
              onKeyDown={e => e.key === "Enter" && submitAdmin()}
              placeholder="보안코드"
              autoFocus
              style={{ width: "100%", padding: "9px 12px", borderRadius: 5, border: `1px solid ${adminError ? C.red : C.border}`, background: C.panelAlt, color: C.text, fontFamily: FONTS.mono, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 6 }}
            />
            {adminError && (
              <div style={{ fontSize: 11, color: C.red, marginBottom: 10 }}>⚠ {adminError}</div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={closeAdminModal} style={{ flex: 1, padding: "8px 0", borderRadius: 5, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: FONTS.mono }}>취소</button>
              <button onClick={submitAdmin} style={{ flex: 1, padding: "8px 0", borderRadius: 5, border: `1px solid ${C.accent}`, background: `${C.accent}20`, color: C.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.mono }}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>{/* 컨텐츠 fontSize 래퍼 끝 */}
    </div>
  );
}