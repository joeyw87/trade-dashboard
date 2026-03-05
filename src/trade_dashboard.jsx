import { useState, useEffect, useRef } from "react";

const mockStocks = [
  { code: "005930", name: "삼성전자", price: 74800, change: 1200, changeRate: 1.63, volume: 18432100, high: 75200, low: 73900 },
  { code: "000660", name: "SK하이닉스", price: 189500, change: -2500, changeRate: -1.30, volume: 5821300, high: 192000, low: 188000 },
  { code: "035420", name: "NAVER", price: 198000, change: 3500, changeRate: 1.80, volume: 1243800, high: 199500, low: 195000 },
  { code: "035720", name: "카카오", price: 42150, change: -350, changeRate: -0.82, volume: 3928400, high: 43000, low: 41800 },
  { code: "051910", name: "LG화학", price: 312500, change: 5500, changeRate: 1.79, volume: 892100, high: 314000, low: 308000 },
  { code: "006400", name: "삼성SDI", price: 285000, change: -8000, changeRate: -2.73, volume: 1034200, high: 293000, low: 283000 },
];

const generateCandles = () => {
  const candles = [];
  let price = 74000;
  for (let i = 60; i >= 0; i--) {
    const open = price;
    const change = (Math.random() - 0.48) * 1200;
    const close = Math.max(65000, Math.min(85000, open + change));
    const high = Math.max(open, close) + Math.random() * 400;
    const low = Math.min(open, close) - Math.random() * 400;
    candles.push({ open, close, high, low, time: i });
    price = close;
  }
  return candles;
};

const candleData = generateCandles();

const closingCandidates = [
  { code: "005930", name: "삼성전자", price: 74800, changeRate: 1.63, volume: 18432100, volRate: 312, rsi: 42, bb: "하단근접", score: 88, signal: "강력매수", reason: "거래량 급증 + RSI 저점 + 볼린저 하단" },
  { code: "000660", name: "SK하이닉스", price: 189500, changeRate: -1.30, volume: 5821300, volRate: 185, rsi: 34, bb: "하단이탈", score: 76, signal: "매수", reason: "RSI 과매도 + 볼린저 하단 이탈" },
  { code: "035420", name: "NAVER", price: 198000, changeRate: 1.80, volume: 1243800, volRate: 224, rsi: 58, bb: "중단위", score: 65, signal: "관망", reason: "거래량 증가 but RSI 중립" },
  { code: "247540", name: "에코프로비엠", price: 98200, changeRate: 4.21, volume: 9823400, volRate: 541, rsi: 71, bb: "상단돌파", score: 55, signal: "주의", reason: "거래량 폭증 but RSI 과매수" },
  { code: "373220", name: "LG에너지솔루션", price: 312000, changeRate: 2.10, volume: 2341200, volRate: 198, rsi: 52, bb: "중단", score: 70, signal: "매수", reason: "거래량 증가 + 중기 지지선 근접" },
  { code: "207940", name: "삼성바이오로직스", price: 782000, changeRate: -0.51, volume: 412300, volRate: 143, rsi: 48, bb: "중단하", score: 60, signal: "관망", reason: "큰 변화 없음, 추가 확인 필요" },
  { code: "068270", name: "셀트리온", price: 158500, changeRate: 3.45, volume: 7234100, volRate: 389, rsi: 63, bb: "중단위", score: 82, signal: "매수", reason: "거래량 급증 + 강한 상승 모멘텀" },
];

// ─── Yahoo Finance proxy via allorigins ───────────────────────────────────────
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

function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff; else losses -= diff;
  }
  const rs = gains / (losses || 1);
  return Math.round(100 - 100 / (1 + rs));
}

function calcBB(closes, period = 20) {
  if (closes.length < period) return { label: "데이터부족", pos: 0.5 };
  const slice = closes.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const std = Math.sqrt(slice.reduce((s, v) => s + (v - mean) ** 2, 0) / period);
  const upper = mean + 2 * std, lower = mean - 2 * std;
  const last = closes[closes.length - 1];
  const pos = (last - lower) / (upper - lower);
  const label = pos > 0.95 ? "상단돌파" : pos > 0.75 ? "상단근접" : pos < 0.05 ? "하단이탈" : pos < 0.25 ? "하단근접" : "중립";
  return { label, pos: Math.round(pos * 100) };
}

function calcScore(rsi, volRate, bbPos) {
  let score = 50;
  if (rsi < 30) score += 20; else if (rsi < 40) score += 12; else if (rsi > 70) score -= 15; else if (rsi > 60) score -= 5;
  if (volRate > 400) score += 20; else if (volRate > 200) score += 12; else if (volRate > 130) score += 5;
  if (bbPos < 15) score += 15; else if (bbPos < 30) score += 8; else if (bbPos > 85) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function getSignal(score) {
  if (score >= 82) return "강력매수";
  if (score >= 68) return "매수";
  if (score >= 50) return "관망";
  return "주의";
}

function buildReason(rsi, volRate, bbLabel) {
  const parts = [];
  if (rsi < 30) parts.push("RSI 과매도");
  else if (rsi < 40) parts.push("RSI 저점권");
  else if (rsi > 70) parts.push("RSI 과매수 주의");
  if (volRate > 300) parts.push("거래량 폭증");
  else if (volRate > 150) parts.push("거래량 증가");
  if (bbLabel.includes("하단")) parts.push("볼린저 하단 지지");
  else if (bbLabel.includes("상단")) parts.push("볼린저 상단 저항");
  return parts.length ? parts.join(" · ") : "특이 신호 없음";
}

// Yahoo Finance via allorigins CORS proxy
async function fetchYahooQuote(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3mo`;
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxy);
  const json = await res.json();
  const data = JSON.parse(json.contents);
  const result = data.chart.result[0];
  const closes = result.indicators.quote[0].close.filter(Boolean);
  const volumes = result.indicators.quote[0].volume.filter(Boolean);
  const meta = result.meta;
  const price = meta.regularMarketPrice;
  const prevClose = meta.previousClose || meta.chartPreviousClose;
  const changeRate = ((price - prevClose) / prevClose) * 100;
  const lastVol = volumes[volumes.length - 1];
  const avgVol = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const volRate = Math.round((lastVol / avgVol) * 100);
  const rsi = calcRSI(closes);
  const bb = calcBB(closes);
  const score = calcScore(rsi, volRate, bb.pos);
  const signal = getSignal(score);
  const tradingValue = Math.round(price * lastVol); // 거래대금 (원)
  return { price, prevClose, changeRate, volume: lastVol, volRate, tradingValue, rsi, bb: bb.label, bbPos: bb.pos, score, signal, reason: buildReason(rsi, volRate, bb.label) };
}

function ClosingTab({ panelStyle, colors }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("전체");
  const [sortBy, setSortBy] = useState("score");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeSection, setActiveSection] = useState("recommend"); // recommend | surge | drop | volume

  const loadData = async () => {
    setLoading(true); setError(null);
    try {
      const results = await Promise.allSettled(WATCH_TICKERS.map(t => fetchYahooQuote(t.ticker).then(d => ({ ...d, ...t }))));
      const ok = results.filter(r => r.status === "fulfilled").map(r => r.value);
      if (!ok.length) throw new Error("데이터를 불러올 수 없습니다");
      setStocks(ok);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
      // fallback to mock
      setStocks(closingCandidates.map(s => ({ ...s, ticker: s.code + ".KS", bbPos: 25 })));
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const fmt = n => Math.round(n).toLocaleString("ko-KR");

  const filtered = stocks
    .filter(s => filter === "전체" || s.signal === filter)
    .sort((a, b) => sortBy === "score" ? b.score - a.score : sortBy === "volRate" ? b.volRate - a.volRate : Math.abs(b.changeRate) - Math.abs(a.changeRate));

  const surgeList = [...stocks].filter(s => s.changeRate >= 2).sort((a, b) => b.changeRate - a.changeRate);
  const dropList = [...stocks].filter(s => s.changeRate <= -2).sort((a, b) => a.changeRate - b.changeRate);
  const volList = [...stocks].sort((a, b) => b.volRate - a.volRate);
  const valueList = [...stocks].sort((a, b) => (b.tradingValue || 0) - (a.tradingValue || 0));

  const summary = {
    total: stocks.length,
    strong: stocks.filter(s => s.signal === "강력매수").length,
    buy: stocks.filter(s => s.signal === "매수").length,
    other: stocks.filter(s => s.signal === "관망" || s.signal === "주의").length,
  };

  const sectionTabs = [
    { id: "recommend", label: "⚡ 종가베팅 추천" },
    { id: "surge", label: "🔴 급등 종목" },
    { id: "drop", label: "🔵 급락 종목" },
    { id: "volume", label: "📊 거래량 급증" },
    { id: "value", label: "💰 거래대금 순위" },
  ];

  const SignalBadge = ({ signal }) => {
    const col = signal === "강력매수" ? colors.green : signal === "매수" ? "#7ee8a2" : signal === "관망" ? colors.muted : colors.red;
    const icon = signal === "강력매수" ? "⚡" : signal === "매수" ? "▲" : signal === "관망" ? "◆" : "⚠";
    return <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: `${col}20`, color: col, border: `1px solid ${col}40` }}>{icon} {signal}</span>;
  };

  const StockCard = ({ s }) => {
    const scoreBg = s.score >= 80 ? colors.green : s.score >= 65 ? colors.yellow : colors.muted;
    const signalColor = s.signal === "강력매수" ? colors.green : s.signal === "매수" ? "#7ee8a2" : s.signal === "관망" ? colors.muted : colors.red;
    return (
      <div style={{ ...panelStyle, borderLeft: `3px solid ${signalColor}`, position: "relative" }}>
        <div style={{ position: "absolute", top: 12, right: 12, width: 46, height: 46, borderRadius: "50%", background: `${scoreBg}15`, border: `2px solid ${scoreBg}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 700, color: scoreBg, lineHeight: 1 }}>{s.score}</span>
          <span style={{ fontSize: 8, color: colors.muted }}>점</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted }}>{s.ticker || s.code}</span>
          </div>
          <SignalBadge signal={s.signal} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 17, fontWeight: 600 }}>{fmt(s.price)}</span>
          <span style={{ fontSize: 12, color: s.changeRate >= 0 ? colors.green : colors.red }}>
            {s.changeRate >= 0 ? "▲" : "▼"} {Math.abs(s.changeRate).toFixed(2)}%
          </span>
        </div>
        {/* 지표 3개 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 10 }}>
          {[
            ["거래량비율", `${s.volRate}%`, s.volRate >= 300 ? colors.green : s.volRate >= 150 ? colors.yellow : colors.muted],
            ["RSI", s.rsi, s.rsi <= 35 ? colors.green : s.rsi >= 65 ? colors.red : colors.yellow],
            ["볼린저", s.bb, colors.accent],
          ].map(([label, val, col]) => (
            <div key={label} style={{ background: "#0a1018", borderRadius: 4, padding: "5px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: colors.muted, marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: col, fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>
        {/* BB 바 */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: colors.muted, marginBottom: 3 }}>
            <span>하단</span><span>볼린저밴드 위치</span><span>상단</span>
          </div>
          <div style={{ height: 4, background: "#1a2d42", borderRadius: 2, position: "relative" }}>
            <div style={{ position: "absolute", left: `${Math.min(95, Math.max(2, s.bbPos ?? 50))}%`, top: -3, width: 10, height: 10, borderRadius: "50%", background: colors.accent, transform: "translateX(-50%)", boxShadow: `0 0 6px ${colors.accent}` }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: colors.muted, borderTop: `1px solid ${colors.border}`, paddingTop: 8 }}>
          💡 {s.reason}
        </div>
      </div>
    );
  };

  const fmtValue = v => {
    if (!v) return "-";
    if (v >= 1e12) return (v / 1e12).toFixed(1) + "조";
    if (v >= 1e8) return (v / 1e8).toFixed(0) + "억";
    if (v >= 1e4) return (v / 1e4).toFixed(0) + "만";
    return fmt(v);
  };

  const RankRow = ({ s, idx, valueKey }) => {
    const val = valueKey === "changeRate" ? `${s.changeRate >= 0 ? "+" : ""}${s.changeRate.toFixed(2)}%`
      : valueKey === "volRate" ? `${s.volRate}%`
        : valueKey === "tradingValue" ? fmtValue(s.tradingValue)
          : fmt(s.volume);
    const sub = valueKey === "tradingValue"
      ? `거래량 ${(s.volume / 10000).toFixed(0)}만주`
      : valueKey === "volRate"
        ? `거래대금 ${fmtValue(s.tradingValue)}`
        : `${fmt(s.price)}원`;
    const col = valueKey === "changeRate" ? (s.changeRate >= 0 ? colors.green : colors.red)
      : valueKey === "volRate" ? (s.volRate >= 300 ? colors.green : colors.yellow)
        : valueKey === "tradingValue" ? colors.yellow
          : colors.accent;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: `1px solid ${colors.border}20`, background: idx === 0 ? `${col}08` : "transparent" }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: idx < 3 ? colors.yellow : colors.muted, minWidth: 20 }}>#{idx + 1}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
          <div style={{ fontSize: 10, color: colors.muted, fontFamily: "'IBM Plex Mono',monospace" }}>{s.ticker || s.code}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 700, color: col }}>{val}</div>
          <div style={{ fontSize: 11, color: colors.muted }}>{sub}</div>
        </div>
        <SignalBadge signal={s.signal} />
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="slide-in">
      {/* 요약 카드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          ["스캔 종목", `${summary.total}개`, colors.accent],
          ["강력매수", `${summary.strong}개`, colors.green],
          ["매수 신호", `${summary.buy}개`, colors.yellow],
          ["관망/주의", `${summary.other}개`, colors.muted],
        ].map(([label, val, col]) => (
          <div key={label} style={{ ...panelStyle, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: colors.muted, marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 22, fontWeight: 700, color: col }}>{loading ? "…" : val}</div>
          </div>
        ))}
      </div>

      {/* 섹션 탭 + 새로고침 */}
      <div style={{ ...panelStyle, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {sectionTabs.map(t => (
            <button key={t.id} onClick={() => setActiveSection(t.id)} style={{ padding: "5px 14px", borderRadius: 4, border: `1px solid ${activeSection === t.id ? colors.yellow : colors.border}`, background: activeSection === t.id ? `${colors.yellow}18` : "transparent", color: activeSection === t.id ? colors.yellow : colors.muted, fontSize: 12, cursor: "pointer", fontWeight: activeSection === t.id ? 600 : 400 }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {lastUpdated && <span style={{ fontSize: 11, color: colors.muted, fontFamily: "'IBM Plex Mono',monospace" }}>갱신: {lastUpdated.toLocaleTimeString("ko-KR")}</span>}
          <button onClick={loadData} disabled={loading} style={{ padding: "5px 14px", borderRadius: 4, border: `1px solid ${colors.accent}`, background: `${colors.accent}15`, color: colors.accent, fontSize: 11, cursor: "pointer" }}>
            {loading ? "로딩 중…" : "🔄 새로고침"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ ...panelStyle, background: `${colors.red}10`, border: `1px solid ${colors.red}40`, fontSize: 12, color: colors.red }}>
          ⚠ {error} — Mock 데이터로 표시 중입니다. (CORS 제한으로 백엔드 프록시 필요)
        </div>
      )}

      {/* 종가베팅 추천 섹션 */}
      {activeSection === "recommend" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* 필터 + 정렬 */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted }}>신호</span>
            {["전체", "강력매수", "매수", "관망", "주의"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "3px 12px", borderRadius: 20, border: `1px solid ${filter === f ? colors.yellow : colors.border}`, background: filter === f ? `${colors.yellow}20` : "transparent", color: filter === f ? colors.yellow : colors.muted, fontSize: 11, cursor: "pointer" }}>{f}</button>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: colors.muted }}>정렬</span>
              {[["score", "점수순"], ["volRate", "거래량순"], ["changeRate", "등락률순"]].map(([k, l]) => (
                <button key={k} onClick={() => setSortBy(k)} style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${sortBy === k ? colors.accent : colors.border}`, background: sortBy === k ? `${colors.accent}15` : "transparent", color: sortBy === k ? colors.accent : colors.muted, fontSize: 11, cursor: "pointer" }}>{l}</button>
              ))}
            </div>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: colors.muted }}>
              <div className="blink" style={{ fontSize: 24, marginBottom: 8 }}>◈</div>
              Yahoo Finance에서 데이터 로딩 중…
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
              {filtered.map(s => <StockCard key={s.ticker || s.code} s={s} />)}
            </div>
          )}
        </div>
      )}

      {/* 급등 종목 */}
      {activeSection === "surge" && (
        <div style={{ ...panelStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: colors.red, fontSize: 14 }}>🔴</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, letterSpacing: 1 }}>당일 급등 종목 (등락률 +2% 이상)</span>
          </div>
          {surgeList.length === 0 ? <div style={{ padding: 24, color: colors.muted, textAlign: "center", fontSize: 13 }}>급등 종목 없음</div>
            : surgeList.map((s, i) => <RankRow key={s.ticker} s={s} idx={i} valueKey="changeRate" />)}
        </div>
      )}

      {/* 급락 종목 */}
      {activeSection === "drop" && (
        <div style={{ ...panelStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 14 }}>🔵</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, letterSpacing: 1 }}>당일 급락 종목 (등락률 -2% 이하)</span>
          </div>
          {dropList.length === 0 ? <div style={{ padding: 24, color: colors.muted, textAlign: "center", fontSize: 13 }}>급락 종목 없음</div>
            : dropList.map((s, i) => <RankRow key={s.ticker} s={s} idx={i} valueKey="changeRate" />)}
        </div>
      )}

      {/* 거래량 급증 */}
      {activeSection === "volume" && (
        <div style={{ ...panelStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 14 }}>📊</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, letterSpacing: 1 }}>거래량 급증 종목 (20일 평균 대비) · 부제: 거래대금도 함께 표시</span>
          </div>
          {volList.map((s, i) => <RankRow key={s.ticker} s={s} idx={i} valueKey="volRate" />)}
        </div>
      )}

      {/* 거래대금 순위 */}
      {activeSection === "value" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* 상위 3개 강조 카드 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {valueList.slice(0, 3).map((s, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              const borderCols = [colors.yellow, "#aaa", "#cd7f32"];
              return (
                <div key={s.ticker || s.code} style={{ ...panelStyle, borderTop: `3px solid ${borderCols[i]}`, textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{medals[i]}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 22, fontWeight: 700, color: colors.yellow, marginBottom: 4 }}>
                    {fmtValue(s.tradingValue)}
                  </div>
                  <div style={{ fontSize: 11, color: colors.muted, marginBottom: 8 }}>
                    거래량 {(s.volume / 10000).toFixed(0)}만주 · {fmt(s.price)}원
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: s.changeRate >= 0 ? colors.green : colors.red }}>
                      {s.changeRate >= 0 ? "▲" : "▼"} {Math.abs(s.changeRate).toFixed(2)}%
                    </span>
                    <span style={{ fontSize: 11, color: colors.muted }}>|</span>
                    <span style={{ fontSize: 11, color: s.volRate >= 200 ? colors.green : colors.muted }}>거래량비 {s.volRate}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 전체 순위 리스트 */}
          <div style={{ ...panelStyle, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 14 }}>💰</span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, letterSpacing: 1 }}>거래대금 순위 (당일 기준)</span>
              </div>
              <span style={{ fontSize: 10, color: colors.muted }}>거래대금 = 주가 × 거래량</span>
            </div>
            {valueList.map((s, i) => <RankRow key={s.ticker || s.code} s={s} idx={i} valueKey="tradingValue" />)}
          </div>
        </div>
      )}

      {/* 하단 안내 */}
      <div style={{ ...panelStyle, fontSize: 11, color: colors.muted, display: "flex", gap: 8 }}>
        <span style={{ color: colors.yellow }}>⚠</span>
        <span>Yahoo Finance 일봉 데이터 기반 · RSI(14) · 볼린저밴드(20,2) · 거래량(20일 평균 대비) 복합 점수입니다. 실제 매매는 본인 판단하에 진행하세요. 백엔드(Spring Boot) 연동 시 CORS 없이 실시간 데이터 사용 가능합니다.</span>
      </div>
    </div>
  );
}

const autoStrategies = [
  { id: "rsi", name: "RSI 전략", desc: "RSI 과매도/과매수 기반" },
  { id: "ma", name: "이동평균 전략", desc: "골든크로스/데드크로스" },
  { id: "bb", name: "볼린저밴드 전략", desc: "밴드 터치시 매매" },
  { id: "custom", name: "커스텀 전략", desc: "조건 직접 설정" },
];

const MiniChart = ({ data, color }) => {
  const w = 80, h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const CandleChart = ({ candles }) => {
  const svgRef = useRef(null);
  const w = 620, h = 200;
  const pad = { l: 10, r: 50, t: 10, b: 20 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const prices = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP;
  const toY = v => pad.t + ch - ((v - minP) / range) * ch;
  const barW = (cw / candles.length) * 0.7;
  const toX = i => pad.l + (i / candles.length) * cw + barW / 2;

  return (
    <svg ref={svgRef} width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f1923" />
          <stop offset="100%" stopColor="#0a1018" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#bgGrad)" rx="4" />
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = pad.t + t * ch;
        const price = maxP - t * range;
        return (
          <g key={t}>
            <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#1e2d3d" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x={w - pad.r + 4} y={y + 4} fill="#4a6a8a" fontSize="8" fontFamily="monospace">{Math.round(price).toLocaleString()}</text>
          </g>
        );
      })}
      {candles.map((c, i) => {
        const x = toX(i);
        const isUp = c.close >= c.open;
        const col = isUp ? "#26c96f" : "#ef4444";
        const bodyTop = toY(Math.max(c.open, c.close));
        const bodyBot = toY(Math.min(c.open, c.close));
        const bodyH = Math.max(1, bodyBot - bodyTop);
        return (
          <g key={i}>
            <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)} stroke={col} strokeWidth="0.8" opacity="0.8" />
            <rect x={x - barW / 2} y={bodyTop} width={barW} height={bodyH} fill={col} opacity="0.9" rx="0.5" />
          </g>
        );
      })}
    </svg>
  );
};

export default function StockDashboard() {
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);
  const [tab, setTab] = useState("dashboard");
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("rsi");
  const [orderType, setOrderType] = useState("limit");
  const [orderSide, setOrderSide] = useState("buy");
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
  const [holdings, setHoldings] = useState([
    { code: "005930", name: "삼성전자", qty: 20, avgPrice: 73200, currentPrice: 74800 },
    { code: "035420", name: "NAVER", qty: 5, avgPrice: 194500, currentPrice: 198000 },
  ]);
  const [time, setTime] = useState(new Date());
  const [prices, setPrices] = useState(mockStocks.map(s => [s.price]));

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      setPrices(prev => prev.map((arr, i) => {
        const last = arr[arr.length - 1];
        const next = last + (Math.random() - 0.5) * 200;
        return [...arr.slice(-20), next];
      }));
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const totalEval = holdings.reduce((s, h) => s + h.qty * h.currentPrice, 0);
  const totalProfit = holdings.reduce((s, h) => s + h.qty * (h.currentPrice - h.avgPrice), 0);

  const formatNum = n => n.toLocaleString("ko-KR");
  const fmtTime = d => d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const placeOrder = () => {
    const now = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const entry = { time: now, type: orderSide, msg: `${selectedStock.name} ${orderQty}주 ${orderSide === "buy" ? "매수" : "매도"} @ ${formatNum(orderPrice)}` };
    setLogs(prev => [entry, ...prev]);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #070d14; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0f1923; }
    ::-webkit-scrollbar-thumb { background: #1e3a5a; border-radius: 2px; }
    .blink { animation: blink 1.2s steps(1) infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .pulse { animation: pulse 2s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.97)} }
    .slide-in { animation: slideIn 0.3s ease; }
    @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    input[type=range] { -webkit-appearance:none; height:3px; background:#1e3a5a; border-radius:2px; outline:none; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:12px; height:12px; background:#00d4ff; border-radius:50%; cursor:pointer; }
    input[type=number],input[type=text] { background:#0a1622; border:1px solid #1e3a5a; color:#c8e0f0; padding:6px 10px; border-radius:4px; font-family:'IBM Plex Mono',monospace; font-size:13px; width:100%; outline:none; }
    input[type=number]:focus,input[type=text]:focus { border-color:#00d4ff; }
  `;

  const colors = { bg: "#070d14", panel: "#0d1a27", border: "#1a2d42", accent: "#00d4ff", green: "#26c96f", red: "#ef4444", text: "#c8e0f0", muted: "#4a7a9b", yellow: "#f0b429" };

  const panelStyle = { background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 6, padding: 16 };

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", background: colors.bg, minHeight: "100vh", color: colors.text, fontSize: 13 }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ background: "#0a1622", borderBottom: `1px solid ${colors.border}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, fontWeight: 600, color: colors.accent, letterSpacing: 2 }}>
            ◈ <span style={{ color: colors.yellow }}>YW</span><span style={{ color: colors.green }}>TRADE</span>
          </div>
          <div style={{ width: 1, height: 20, background: colors.border }} />
          {["dashboard", "auto", "closing", "portfolio", "log"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", cursor: "pointer", color: tab === t ? (t === "closing" ? colors.yellow : colors.accent) : colors.muted, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", padding: "4px 8px", borderBottom: tab === t ? `2px solid ${t === "closing" ? colors.yellow : colors.accent}` : "2px solid transparent" }}>
              {t === "dashboard" ? "대시보드" : t === "auto" ? "자동매매" : t === "closing" ? "⚡ 종가베팅" : t === "portfolio" ? "포트폴리오" : "로그"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className={autoEnabled ? "pulse" : ""} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: autoEnabled ? colors.green : colors.muted }} className={autoEnabled ? "blink" : ""} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: autoEnabled ? colors.green : colors.muted }}>{autoEnabled ? "AUTO ON" : "AUTO OFF"}</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: colors.muted }}>{fmtTime(time)}</div>
          <div style={{ background: "#0f1923", border: `1px solid ${colors.border}`, borderRadius: 4, padding: "4px 10px", fontSize: 11, color: colors.yellow }}>
            KRW 12,845,320
          </div>
        </div>
      </div>

      <div style={{ padding: 16, maxWidth: 1400, margin: "0 auto" }}>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 12 }}>
            {/* Stock List */}
            <div style={{ ...panelStyle, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: colors.muted, letterSpacing: 1 }}>WATCHLIST</span>
                <span style={{ fontSize: 10, color: colors.muted }}>실시간</span>
              </div>
              {mockStocks.map((s, i) => (
                <div key={s.code} onClick={() => setSelectedStock(s)} className="slide-in" style={{ padding: "10px 16px", borderBottom: `1px solid ${colors.border}20`, cursor: "pointer", background: selectedStock.code === s.code ? "#112030" : "transparent", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, transition: "background 0.2s" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: colors.muted, fontFamily: "'IBM Plex Mono',monospace" }}>{s.code}</div>
                  </div>
                  <MiniChart data={prices[i]} color={s.change >= 0 ? colors.green : colors.red} />
                  <div style={{ textAlign: "right", minWidth: 80 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, fontSize: 13 }}>{formatNum(s.price)}</div>
                    <div style={{ fontSize: 11, color: s.change >= 0 ? colors.green : colors.red, fontFamily: "'IBM Plex Mono',monospace" }}>
                      {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.changeRate).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart & Detail */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Stock Header */}
              <div style={{ ...panelStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedStock.name} <span style={{ fontSize: 12, color: colors.muted, fontFamily: "'IBM Plex Mono',monospace" }}>{selectedStock.code}</span></div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 24, fontWeight: 600, color: selectedStock.change >= 0 ? colors.green : colors.red }}>{formatNum(selectedStock.price)}</span>
                    <span style={{ fontSize: 12, color: selectedStock.change >= 0 ? colors.green : colors.red }}>{selectedStock.change >= 0 ? "▲" : "▼"} {formatNum(Math.abs(selectedStock.change))} ({Math.abs(selectedStock.changeRate).toFixed(2)}%)</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[["고가", selectedStock.high, colors.green], ["저가", selectedStock.low, colors.red], ["거래량", selectedStock.volume, colors.yellow]].map(([label, val, col]) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: colors.muted }}>{label}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: col }}>{typeof val === "number" && val > 100000 ? (val / 10000).toFixed(0) + "만" : formatNum(val)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Candle Chart */}
              <div style={{ ...panelStyle, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, letterSpacing: 1 }}>CANDLE · 1MIN</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["1분", "5분", "1시간", "1일"].map(p => (
                      <button key={p} style={{ background: "none", border: `1px solid ${colors.border}`, borderRadius: 3, color: colors.muted, fontSize: 10, padding: "2px 8px", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace" }}>{p}</button>
                    ))}
                  </div>
                </div>
                <CandleChart candles={candleData} />
              </div>

              {/* Quick Order */}
              <div style={{ ...panelStyle, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 10, letterSpacing: 1 }}>주문 유형</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    {["limit", "market"].map(t => (
                      <button key={t} onClick={() => setOrderType(t)} style={{ flex: 1, padding: "6px", border: `1px solid ${orderType === t ? colors.accent : colors.border}`, borderRadius: 4, background: orderType === t ? `${colors.accent}20` : "transparent", color: orderType === t ? colors.accent : colors.muted, cursor: "pointer", fontSize: 12 }}>
                        {t === "limit" ? "지정가" : "시장가"}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: colors.muted, marginBottom: 4 }}>수량</div>
                    <input type="number" value={orderQty} onChange={e => setOrderQty(+e.target.value)} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: colors.muted, marginBottom: 4 }}>가격</div>
                    <input type="number" value={orderPrice} onChange={e => setOrderPrice(+e.target.value)} />
                  </div>
                  <div style={{ fontSize: 11, color: colors.muted, marginBottom: 6 }}>총 주문금액: <span style={{ color: colors.yellow, fontFamily: "'IBM Plex Mono',monospace" }}>{formatNum(orderQty * orderPrice)}원</span></div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setOrderSide("buy"); placeOrder(); }} style={{ flex: 1, padding: "10px", background: `${colors.green}20`, border: `1px solid ${colors.green}`, borderRadius: 4, color: colors.green, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>매수</button>
                    <button onClick={() => { setOrderSide("sell"); placeOrder(); }} style={{ flex: 1, padding: "10px", background: `${colors.red}20`, border: `1px solid ${colors.red}`, borderRadius: 4, color: colors.red, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>매도</button>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 10, letterSpacing: 1 }}>호가창</div>
                  {[...Array(5)].map((_, i) => {
                    const p = selectedStock.price + (5 - i) * 100;
                    return <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 6px", background: `${colors.red}10`, marginBottom: 1, borderRadius: 2, fontSize: 11 }}>
                      <span style={{ color: colors.red, fontFamily: "'IBM Plex Mono',monospace" }}>{formatNum(p)}</span>
                      <span style={{ color: colors.muted }}>{(Math.random() * 5000 | 0).toLocaleString()}</span>
                    </div>;
                  })}
                  <div style={{ height: 1, background: colors.accent, margin: "4px 0", opacity: 0.4 }} />
                  {[...Array(5)].map((_, i) => {
                    const p = selectedStock.price - i * 100;
                    return <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 6px", background: `${colors.green}10`, marginBottom: 1, borderRadius: 2, fontSize: 11 }}>
                      <span style={{ color: colors.green, fontFamily: "'IBM Plex Mono',monospace" }}>{formatNum(p)}</span>
                      <span style={{ color: colors.muted }}>{(Math.random() * 5000 | 0).toLocaleString()}</span>
                    </div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AUTO TRADING TAB */}
        {tab === "auto" && (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 12 }}>
            {/* Strategy Select */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ ...panelStyle }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 12, letterSpacing: 1 }}>자동매매 제어</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 13 }}>자동매매 활성화</span>
                  <div onClick={() => setAutoEnabled(v => !v)} style={{ width: 44, height: 24, borderRadius: 12, background: autoEnabled ? colors.green : colors.border, cursor: "pointer", position: "relative", transition: "background 0.3s" }}>
                    <div style={{ position: "absolute", top: 3, left: autoEnabled ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.5)" }} />
                  </div>
                </div>
                {autoEnabled && <div className="blink" style={{ fontSize: 11, color: colors.green, textAlign: "center", padding: "6px", background: `${colors.green}10`, borderRadius: 4, border: `1px solid ${colors.green}30` }}>● 자동매매 실행 중</div>}
              </div>
              <div style={{ ...panelStyle }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 12, letterSpacing: 1 }}>전략 선택</div>
                {autoStrategies.map(s => (
                  <div key={s.id} onClick={() => setSelectedStrategy(s.id)} style={{ padding: "10px 12px", borderRadius: 4, marginBottom: 6, cursor: "pointer", border: `1px solid ${selectedStrategy === s.id ? colors.accent : colors.border}`, background: selectedStrategy === s.id ? `${colors.accent}12` : "transparent", transition: "all 0.2s" }}>
                    <div style={{ fontWeight: 500, color: selectedStrategy === s.id ? colors.accent : colors.text }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...panelStyle }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 12, letterSpacing: 1 }}>리스크 관리</div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12 }}>손절 비율</span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: colors.red, fontSize: 12 }}>-{stopLoss}%</span>
                  </div>
                  <input type="range" min={1} max={20} value={stopLoss} onChange={e => setStopLoss(+e.target.value)} style={{ width: "100%" }} />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12 }}>익절 비율</span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: colors.green, fontSize: 12 }}>+{takeProfit}%</span>
                  </div>
                  <input type="range" min={1} max={30} value={takeProfit} onChange={e => setTakeProfit(+e.target.value)} style={{ width: "100%" }} />
                </div>
              </div>
            </div>

            {/* Strategy Config */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {selectedStrategy === "rsi" && (
                <div style={{ ...panelStyle }} className="slide-in">
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 16, letterSpacing: 1 }}>RSI 전략 설정</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                    {[["RSI 기간", rsiPeriod, setRsiPeriod, 1, 100], ["매수 기준 (RSI <)", rsiBuy, setRsiBuy, 10, 50], ["매도 기준 (RSI >)", rsiSell, setRsiSell, 50, 90]].map(([label, val, setter, min, max]) => (
                      <div key={label}>
                        <div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>{label}</div>
                        <input type="number" value={val} min={min} max={max} onChange={e => setter(+e.target.value)} />
                        <input type="range" min={min} max={max} value={val} onChange={e => setter(+e.target.value)} style={{ width: "100%", marginTop: 8 }} />
                      </div>
                    ))}
                  </div>
                  {/* RSI Viz */}
                  <div style={{ background: "#0a1018", borderRadius: 6, padding: 16, border: `1px solid ${colors.border}` }}>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 8 }}>RSI 시뮬레이션</div>
                    <svg width="100%" viewBox="0 0 500 80">
                      <defs><linearGradient id="rsiGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" /><stop offset="100%" stopColor="#00d4ff" stopOpacity="0" /></linearGradient></defs>
                      <line x1="0" y1={80 - rsiSell * 0.8} x2="500" y2={80 - rsiSell * 0.8} stroke={colors.red} strokeWidth="0.8" strokeDasharray="4,4" opacity="0.6" />
                      <line x1="0" y1={80 - rsiBuy * 0.8} x2="500" y2={80 - rsiBuy * 0.8} stroke={colors.green} strokeWidth="0.8" strokeDasharray="4,4" opacity="0.6" />
                      <polyline points={Array.from({ length: 50 }, (_, i) => { const x = i * 10; const y = 80 - (30 + Math.sin(i * 0.5) * 25 + Math.sin(i * 0.2) * 15) * 0.8; return `${x},${y}`; }).join(" ")} fill="none" stroke={colors.accent} strokeWidth="1.5" />
                      <text x="4" y={80 - rsiSell * 0.8 - 3} fill={colors.red} fontSize="8" fontFamily="monospace">매도 {rsiSell}</text>
                      <text x="4" y={80 - rsiBuy * 0.8 + 10} fill={colors.green} fontSize="8" fontFamily="monospace">매수 {rsiBuy}</text>
                    </svg>
                  </div>
                </div>
              )}

              {selectedStrategy === "ma" && (
                <div style={{ ...panelStyle }} className="slide-in">
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 16, letterSpacing: 1 }}>이동평균 전략 설정</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[["단기 이동평균", 5], ["장기 이동평균", 20]].map(([label, def]) => (
                      <div key={label}>
                        <div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>{label}</div>
                        <input type="number" defaultValue={def} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, padding: 12, background: `${colors.green}10`, border: `1px solid ${colors.green}20`, borderRadius: 4, fontSize: 12, color: colors.muted }}>
                    💡 단기선이 장기선을 상향 돌파시 매수 (골든크로스), 하향 돌파시 매도 (데드크로스)
                  </div>
                </div>
              )}

              {selectedStrategy === "bb" && (
                <div style={{ ...panelStyle }} className="slide-in">
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 16, letterSpacing: 1 }}>볼린저밴드 전략 설정</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div><div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>기간</div><input type="number" defaultValue={20} /></div>
                    <div><div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>표준편차 배수</div><input type="number" defaultValue={2} step={0.1} /></div>
                  </div>
                </div>
              )}

              {selectedStrategy === "custom" && (
                <div style={{ ...panelStyle }} className="slide-in">
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 16, letterSpacing: 1 }}>커스텀 조건 설정</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {["매수 조건 1", "매수 조건 2", "매도 조건 1", "매도 조건 2"].map(label => (
                      <div key={label}>
                        <div style={{ fontSize: 12, color: colors.muted, marginBottom: 6 }}>{label}</div>
                        <input type="text" placeholder="예: RSI < 30" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target stocks */}
              <div style={{ ...panelStyle }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 12, letterSpacing: 1 }}>매매 대상 종목</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {mockStocks.map(s => (
                    <div key={s.code} style={{ padding: "4px 10px", border: `1px solid ${colors.border}`, borderRadius: 20, fontSize: 12, cursor: "pointer", color: colors.muted }}>
                      {s.name}
                    </div>
                  ))}
                  <div style={{ padding: "4px 10px", border: `1px dashed ${colors.accent}`, borderRadius: 20, fontSize: 12, cursor: "pointer", color: colors.accent }}>+ 추가</div>
                </div>
              </div>

              {/* Performance Stats */}
              <div style={{ ...panelStyle }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 12, letterSpacing: 1 }}>전략 성과 (시뮬레이션)</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[["총 수익률", "+12.4%", colors.green], ["승률", "64%", colors.accent], ["총 거래횟수", "128회", colors.yellow], ["최대 낙폭", "-4.2%", colors.red]].map(([label, val, col]) => (
                    <div key={label} style={{ textAlign: "center", padding: 12, background: "#0a1018", borderRadius: 4, border: `1px solid ${colors.border}` }}>
                      <div style={{ fontSize: 11, color: colors.muted, marginBottom: 6 }}>{label}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, fontWeight: 600, color: col }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLOSING BET TAB */}
        {tab === "closing" && <ClosingTab panelStyle={panelStyle} colors={colors} />}

        {/* PORTFOLIO TAB */}
        {tab === "portfolio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="slide-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[["예수금", "12,845,320", "원", colors.yellow], ["평가금액", formatNum(totalEval), "원", colors.accent], ["평가손익", formatNum(totalProfit), "원", totalProfit >= 0 ? colors.green : colors.red], ["수익률", "+3.2%", "", colors.green]].map(([label, val, unit, col]) => (
                <div key={label} style={{ ...panelStyle, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: colors.muted, marginBottom: 8 }}>{label}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 20, fontWeight: 700, color: col }}>{val}<span style={{ fontSize: 11, marginLeft: 2 }}>{unit}</span></div>
                </div>
              ))}
            </div>
            <div style={{ ...panelStyle }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 12, letterSpacing: 1 }}>보유 종목</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                    {["종목명", "코드", "보유수량", "평균단가", "현재가", "평가손익", "수익률"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, color: colors.muted, fontWeight: 400, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holdings.map(h => {
                    const pl = (h.currentPrice - h.avgPrice) * h.qty;
                    const plr = ((h.currentPrice - h.avgPrice) / h.avgPrice * 100).toFixed(2);
                    return (
                      <tr key={h.code} style={{ borderBottom: `1px solid ${colors.border}20` }}>
                        <td style={{ padding: "12px", fontWeight: 500 }}>{h.name}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontFamily: "'IBM Plex Mono',monospace", color: colors.muted, fontSize: 11 }}>{h.code}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontFamily: "'IBM Plex Mono',monospace" }}>{h.qty}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontFamily: "'IBM Plex Mono',monospace" }}>{formatNum(h.avgPrice)}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontFamily: "'IBM Plex Mono',monospace" }}>{formatNum(h.currentPrice)}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontFamily: "'IBM Plex Mono',monospace", color: pl >= 0 ? colors.green : colors.red }}>{pl >= 0 ? "+" : ""}{formatNum(pl)}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontFamily: "'IBM Plex Mono',monospace", color: +plr >= 0 ? colors.green : colors.red }}>{+plr >= 0 ? "+" : ""}{plr}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOG TAB */}
        {tab === "log" && (
          <div style={{ ...panelStyle }} className="slide-in">
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: colors.muted, marginBottom: 12, letterSpacing: 1 }}>매매 로그</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, maxHeight: 500, overflowY: "auto" }}>
              {logs.map((log, i) => (
                <div key={i} style={{ padding: "6px 10px", marginBottom: 2, borderRadius: 3, background: log.type === "buy" ? `${colors.green}10` : log.type === "sell" ? `${colors.red}10` : "#0a1018", display: "flex", gap: 16, borderLeft: `2px solid ${log.type === "buy" ? colors.green : log.type === "sell" ? colors.red : colors.border}` }}>
                  <span style={{ color: colors.muted, minWidth: 70 }}>{log.time}</span>
                  <span style={{ color: log.type === "buy" ? colors.green : log.type === "sell" ? colors.red : colors.muted, minWidth: 40 }}>[{log.type.toUpperCase()}]</span>
                  <span style={{ color: colors.text }}>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}