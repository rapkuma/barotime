"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  Search, Clock, Server, Activity, Globe, GraduationCap, 
  Ticket, Volume2, VolumeX, Star, Sparkles, Building2, Check,
  ChevronDown, ChevronUp, Users, MessageSquare, Flame, Send, 
  TrendingUp, RefreshCw, Heart
} from "lucide-react";
import { UNIVERSITIES, filterUniversities, University, searchAllSites, SiteItem } from "@/data/universities";

const POPULAR_SITES = [
  {
    category: "티켓팅 & 쇼핑",
    icon: <Ticket className="w-4 h-4 mr-2 text-pink-400" />,
    sites: [
      { name: "인터파크 티켓", url: "ticket.interpark.com" },
      { name: "멜론티켓", url: "ticket.melon.com" },
      { name: "YES24 티켓", url: "ticket.yes24.com" },
      { name: "티켓링크", url: "www.ticketlink.co.kr" },
      { name: "옥션 티켓", url: "www.auction.co.kr" },
      { name: "11번가 티켓", url: "ticket.11st.co.kr" },
      { name: "위메프 공연", url: "ticket.wemakeprice.com" },
      { name: "나이키 코리아", url: "www.nike.com" },
      { name: "무신사", url: "www.musinsa.com" },
      { name: "CGV", url: "www.cgv.co.kr" },
      { name: "롯데시네마", url: "www.lottecinema.co.kr" },
      { name: "메가박스", url: "www.megabox.co.kr" },
    ]
  },
  {
    category: "교통 & 항공",
    icon: <Globe className="w-4 h-4 mr-2 text-cyan-400" />,
    sites: [
      { name: "코레일 (KTX/명절)", url: "www.letskorail.com" },
      { name: "SRT", url: "etk.srail.kr" },
      { name: "대한항공", url: "www.koreanair.com" },
      { name: "아시아나항공", url: "flyasiana.com" },
      { name: "제주항공", url: "www.jejuair.net" },
      { name: "진에어", url: "www.jinair.com" },
    ]
  },
  {
    category: "공공기관 & 자격증",
    icon: <Building2 className="w-4 h-4 mr-2 text-emerald-400" />,
    sites: [
      { name: "네이버시계", url: "time.naver.com" },
      { name: "큐넷 (Q-Net)", url: "www.q-net.or.kr" },
      { name: "병무청", url: "mwpt.mma.go.kr" },
      { name: "정부24", url: "www.gov.kr" },
      { name: "대법원 전자가족관계", url: "efamily.scourt.go.kr" },
    ]
  }
];

const REGIONS = ["전체", "수도권", "국공립/거점", "충청/강원", "영남권", "호남/제주", "특수/이공계"] as const;

export default function ServerTimePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [url, setUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [serverTimeOffset, setServerTimeOffset] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [alarmSettings, setAlarmSettings] = useState({
    everyMinute: false, // 기본은 정각 알림만 활성화
    onTheHour: true,
    min1Before: false,
    min2Before: false,
    min3Before: false,
  });

  // University search and filter states
  const [uniSearch, setUniSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("전체");
  const [uniSortBy, setUniSortBy] = useState<"popular" | "name">("name");
  const [isUniListOpen, setIsUniListOpen] = useState(false);
  const [recentUnis, setRecentUnis] = useState<University[]>([]);
  const [isMainFocused, setIsMainFocused] = useState(false);

  // Community & Visitor States (Navyism style)
  const [sessionId, setSessionId] = useState("");
  const [stats, setStats] = useState<{ today: number; yesterday: number; total: number; date: string } | null>(null);
  const [cheers, setCheers] = useState<Array<{ id: number; nickname: string; content: string; target_name: string; created_at: string }>>([]);
  const [activeList, setActiveList] = useState<Array<{ name: string; count: number; url: string }>>([]);
  const [totalOnline, setTotalOnline] = useState(1);
  const [nickname, setNickname] = useState("");
  const [cheerContent, setCheerContent] = useState("");
  const [isSubmittingCheer, setIsSubmittingCheer] = useState(false);
  const [currentTargetName, setCurrentTargetName] = useState("바로타임 (BAROTIME)");

  const mainSuggestions = useMemo(() => {
    if (!url.trim()) return [];
    const hasKoreanOrSpace = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\s]/.test(url);
    if (!hasKoreanOrSpace && url.includes(".")) return [];
    return searchAllSites(url).slice(0, 5);
  }, [url]);

  const requestRef = useRef<number>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastBeepSecondRef = useRef<number | null>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  // Initialize Session and Community Data
  useEffect(() => {
    setIsMounted(true);

    // 1. Session ID
    let sid = sessionStorage.getItem("baro_session_id");
    if (!sid) {
      sid = "user_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
      sessionStorage.setItem("baro_session_id", sid);
    }
    setSessionId(sid);

    // 2. Saved Nickname
    try {
      const savedNick = localStorage.getItem("baro_nickname");
      if (savedNick) setNickname(savedNick);

      const saved = localStorage.getItem("recent_universities");
      if (saved) {
        setRecentUnis(JSON.parse(saved));
      }
    } catch {
      // LocalStorage error fallback
    }

    // 3. Record visit (once per session) and load community data
    const recordVisitAndLoad = async () => {
      try {
        const hasVisited = sessionStorage.getItem("baro_visited");
        if (!hasVisited) {
          sessionStorage.setItem("baro_visited", "true");
          await fetch("/api/community", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "visit" }),
          });
        }
      } catch (err) {
        console.error("Visit recording failed:", err);
      }

      loadCommunityData();
    };

    recordVisitAndLoad();

    // 4. Periodic polling for community updates & heartbeat (every 10s)
    const interval = setInterval(() => {
      loadCommunityData();
      if (sid) {
        pingActiveSession(sid, currentTargetName, targetUrl || "https://barotime.com");
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const loadCommunityData = async () => {
    try {
      const res = await fetch("/api/community");
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
        if (data.cheers) setCheers(data.cheers);
        if (data.active) {
          setActiveList(data.active.list || []);
          setTotalOnline(data.active.totalOnline || 1);
        }
      }
    } catch (err) {
      console.error("Failed to load community data:", err);
    }
  };

  const pingActiveSession = async (sId: string, siteName: string, siteUrl: string) => {
    try {
      await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ping_active",
          sessionId: sId,
          targetName: siteName,
          targetUrl: siteUrl,
        }),
      });
    } catch {}
  };

  const handleCheerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cheerContent.trim() || isSubmittingCheer) return;

    setIsSubmittingCheer(true);
    const nick = (nickname.trim() || "익명").slice(0, 15);
    try {
      localStorage.setItem("baro_nickname", nick);
    } catch {}

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cheer",
          nickname: nick,
          content: cheerContent.trim(),
          target_name: currentTargetName,
        }),
      });

      if (res.ok) {
        setCheerContent("");
        await loadCommunityData();
      }
    } catch (err) {
      console.error("Failed to submit cheer:", err);
    } finally {
      setIsSubmittingCheer(false);
    }
  };

  const addHashtag = (tag: string) => {
    setCheerContent((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  const saveRecentUni = (uni: University) => {
    setRecentUnis((prev) => {
      const filtered = prev.filter((item) => item.url !== uni.url);
      const updated = [uni, ...filtered].slice(0, 6);
      try {
        localStorage.setItem("recent_universities", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const filteredUniversities = useMemo(() => {
    return filterUniversities(uniSearch, selectedRegion, uniSortBy);
  }, [uniSearch, selectedRegion, uniSortBy]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const toggleSound = () => {
    if (!soundEnabled) {
      initAudio();
    }
    setSoundEnabled(!soundEnabled);
  };

  const playCountdownBeep = useCallback((step: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Rising countdown pitch: 5 -> 440Hz, 4 -> 494Hz, 3 -> 554Hz, 2 -> 659Hz, 1 -> 740Hz, 0 -> 880Hz
    const freqs: Record<number, number> = {
      5: 440,
      4: 494,
      3: 554,
      2: 659,
      1: 740,
      0: 880,
    };

    const freq = freqs[step] ?? 440;
    const isZero = step === 0;

    osc.type = isZero ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const duration = isZero ? 0.6 : 0.15;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }, []);

  const fetchServerTime = async (e?: React.FormEvent, directUrl?: string, uniObj?: University) => {
    if (e) e.preventDefault();
    const rawTarget = (directUrl || url).trim();
    if (!rawTarget) return;

    setIsMainFocused(false);

    // Check if rawTarget is already a direct domain
    const hasKoreanOrSpace = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣\s]/.test(rawTarget);
    const isDirectDomain = !hasKoreanOrSpace && rawTarget.includes(".");

    let target = rawTarget;

    if (!isDirectDomain) {
      const matches = searchAllSites(rawTarget);
      if (matches.length > 0) {
        target = matches[0].url;
        setUrl(matches[0].name);
        if (matches[0].category === "대학교 수강신청") {
          saveRecentUni({
            name: matches[0].name,
            url: matches[0].url,
            region: "수도권",
            shortName: matches[0].shortName,
          });
        }
      } else {
        setError(`'${rawTarget}'에 일치하는 사이트나 대학교를 찾을 수 없습니다. 정확한 이름이나 도메인(예: ticket.interpark.com)을 입력해 주세요.`);
        return;
      }
    } else if (directUrl) {
      setUrl(directUrl);
    }
    if (uniObj) {
      saveRecentUni(uniObj);
    }

    // Immediately scroll to the clock so user sees it right away
    setTimeout(() => {
      clockRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);

    setIsLoading(true);
    setError("");

    try {
      let initialServerSecond: number | null = null;
      let tickOverOffset: number | null = null;
      let finalTargetUrl = "";
      let foundTick = false;
      let minLatency = Infinity;

      for (let i = 0; i < 15; i++) {
        const reqStart = Date.now();
        const response = await fetch(`/api/time?url=${encodeURIComponent(target)}&_t=${reqStart}`);
        const data = await response.json();
        const reqEnd = Date.now();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch server time");
        }

        const roundtrip = reqEnd - reqStart;
        const serverSecond = data.adjustedTime; 
        
        if (roundtrip < minLatency) {
          minLatency = roundtrip;
          finalTargetUrl = data.targetUrl;
        }

        if (initialServerSecond === null) {
          initialServerSecond = serverSecond;
        } else if (serverSecond > initialServerSecond) {
          const estimatedTickTimeLocal = reqEnd - (roundtrip / 2);
          tickOverOffset = serverSecond - estimatedTickTimeLocal;
          foundTick = true;
          setLatency(data.latency || roundtrip);
          finalTargetUrl = data.targetUrl;
          break;
        }

        await new Promise((r) => setTimeout(r, 100));
      }

      if (foundTick && tickOverOffset !== null) {
        setTargetUrl(finalTargetUrl);
        setServerTimeOffset(tickOverOffset);
      } else {
        const reqStart = Date.now();
        const response = await fetch(`/api/time?url=${encodeURIComponent(target)}&_t=${reqStart}`);
        const data = await response.json();
        const reqEnd = Date.now();
        
        const roundtrip = reqEnd - reqStart;
        const estimatedServerTime = data.adjustedTime + 500 + (roundtrip / 2);
        setTargetUrl(data.targetUrl);
        setLatency(data.latency || roundtrip);
        setServerTimeOffset(estimatedServerTime - reqEnd);
      }

      // Track active session site
      const siteDisplay = uniObj ? uniObj.name : url.trim() || finalTargetUrl;
      setCurrentTargetName(siteDisplay);
      if (sessionId) {
        pingActiveSession(sessionId, siteDisplay, finalTargetUrl || target);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);

      if (serverTimeOffset !== null && soundEnabled) {
        const syncedTime = new Date(now.getTime() + serverTimeOffset);
        const m = syncedTime.getMinutes();
        const s = syncedTime.getSeconds();
        const ms = syncedTime.getMilliseconds();
        
        if (ms >= 900 || ms < 100) {
          let currentTargetSec = ms >= 900 ? (s + 1) % 60 : s;
          let currentTargetMin = ms >= 900 && s === 59 ? (m + 1) % 60 : m;
          
          if (lastBeepSecondRef.current !== currentTargetSec) {
            lastBeepSecondRef.current = currentTargetSec;

            // 5, 4, 3, 2, 1, 0 step countdown
            const step = currentTargetSec === 0 ? 0 : 60 - currentTargetSec;
            
            if (step >= 0 && step <= 5) {
              let shouldBeep = false;

              if (alarmSettings.everyMinute) {
                shouldBeep = true;
              } else if (alarmSettings.onTheHour && ((m === 59 && currentTargetSec >= 55) || (m === 0 && currentTargetSec === 0))) {
                shouldBeep = true;
              } else if (alarmSettings.min1Before && ((m === 58 && currentTargetSec >= 55) || (m === 59 && currentTargetSec === 0))) {
                shouldBeep = true;
              } else if (alarmSettings.min2Before && ((m === 57 && currentTargetSec >= 55) || (m === 58 && currentTargetSec === 0))) {
                shouldBeep = true;
              } else if (alarmSettings.min3Before && ((m === 56 && currentTargetSec >= 55) || (m === 57 && currentTargetSec === 0))) {
                shouldBeep = true;
              }

              if (shouldBeep) {
                playCountdownBeep(step);
              }
            }
          }
        }
      }

      requestRef.current = requestAnimationFrame(updateTime);
    };
    
    requestRef.current = requestAnimationFrame(updateTime);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [serverTimeOffset, soundEnabled, alarmSettings, playCountdownBeep]);

  const displayTime = serverTimeOffset !== null 
    ? new Date(currentTime.getTime() + serverTimeOffset) 
    : currentTime;

  const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');

  const hours = pad(displayTime.getHours());
  const minutes = pad(displayTime.getMinutes());
  const seconds = pad(displayTime.getSeconds());
  const milliseconds = pad(displayTime.getMilliseconds(), 3);

  const isTicking = serverTimeOffset !== null;

  // 5, 4, 3, 2, 1, 0 Countdown Color & Badge Alert Configurations (기본: 정각 직전 5초~정각)
  const minNum = displayTime.getMinutes();
  const secNum = displayTime.getSeconds();
  const isCountdownSec = secNum >= 55 || secNum === 0;
  const countdownStep = secNum === 0 ? 0 : 60 - secNum;

  let isAlertTime = false;
  if (alarmSettings.everyMinute) {
    isAlertTime = true;
  } else if (alarmSettings.onTheHour && ((minNum === 59 && secNum >= 55) || (minNum === 0 && secNum === 0))) {
    isAlertTime = true;
  } else if (alarmSettings.min1Before && ((minNum === 58 && secNum >= 55) || (minNum === 59 && secNum === 0))) {
    isAlertTime = true;
  } else if (alarmSettings.min2Before && ((minNum === 57 && secNum >= 55) || (minNum === 58 && secNum === 0))) {
    isAlertTime = true;
  } else if (alarmSettings.min3Before && ((minNum === 56 && secNum >= 55) || (minNum === 57 && secNum === 0))) {
    isAlertTime = true;
  }

  const isCountdown = isTicking && isAlertTime && isCountdownSec;

  const countdownConfigs: Record<number, { label: string; textClass: string; borderClass: string; bgClass: string; glowClass: string }> = {
    5: {
      label: "⚡ 5초 전! 집중",
      textClass: "text-amber-400",
      borderClass: "border-amber-500/50",
      bgClass: "bg-amber-950/30",
      glowClass: "shadow-[0_0_50px_-10px_rgba(245,158,11,0.3)]",
    },
    4: {
      label: "⚡ 4초 전! 손가락 준비",
      textClass: "text-amber-300",
      borderClass: "border-amber-500/60",
      bgClass: "bg-amber-950/40",
      glowClass: "shadow-[0_0_55px_-10px_rgba(245,158,11,0.4)]",
    },
    3: {
      label: "🔥 3초 전! 예매창 주시",
      textClass: "text-orange-400",
      borderClass: "border-orange-500/70",
      bgClass: "bg-orange-950/50",
      glowClass: "shadow-[0_0_60px_-10px_rgba(249,115,22,0.4)] animate-pulse",
    },
    2: {
      label: "🚨 2초 전! 클릭 대기!",
      textClass: "text-red-400",
      borderClass: "border-red-500/80",
      bgClass: "bg-red-950/50",
      glowClass: "shadow-[0_0_70px_-10px_rgba(239,68,68,0.5)] animate-pulse",
    },
    1: {
      label: "🚨 1초 전! 정각 직전!",
      textClass: "text-rose-400 font-black",
      borderClass: "border-rose-500",
      bgClass: "bg-rose-950/60",
      glowClass: "shadow-[0_0_90px_-5px_rgba(244,63,94,0.7)] animate-pulse",
    },
    0: {
      label: "🎉 정각 OPEN! 지금 클릭!",
      textClass: "text-emerald-400 font-black",
      borderClass: "border-emerald-400",
      bgClass: "bg-emerald-950/50",
      glowClass: "shadow-[0_0_90px_-5px_rgba(52,211,153,0.7)]",
    },
  };

  const activeAlert = isCountdown ? countdownConfigs[countdownStep] : null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-12 px-4 sm:px-8 font-sans selection:bg-indigo-500/30">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center space-y-12">
        
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center justify-center space-x-2 bg-slate-900/60 border border-slate-800 rounded-full px-4 py-1.5 backdrop-blur-md">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs sm:text-sm font-medium tracking-wide">0.001초 틱오버 초정밀 동기화</span>
            </div>

            {/* Visitors Counter Badge (Navyism style) */}
            {stats && (
              <div className="inline-flex items-center space-x-2.5 bg-slate-900/60 border border-slate-800 rounded-full px-4 py-1.5 backdrop-blur-md text-xs sm:text-sm">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400">오늘</span>
                <span className="font-mono font-bold text-emerald-400">{stats.today.toLocaleString()}명</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">어제</span>
                <span className="font-mono text-slate-300">{stats.yesterday.toLocaleString()}명</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">누적</span>
                <span className="font-mono text-slate-300">{stats.total.toLocaleString()}명</span>
              </div>
            )}
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <span>바로타임</span>
            <span className="text-3xl sm:text-5xl font-mono font-semibold text-indigo-400 tracking-wider">BAROTIME</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-lg">
            오차 없이 바로 맞는 실시간 서버시간 · 티켓팅 & 수강신청
          </p>
        </div>

        {/* URL Input Form */}
        <form onSubmit={(e) => fetchServerTime(e)} className="relative w-full max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          <div className="relative flex items-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-2xl blur-xl transition-all duration-500 group-hover:opacity-100 opacity-50" />
            <div className="relative flex w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl transition-all duration-300 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <div className="pl-4 pr-3 flex items-center justify-center text-slate-400">
                <Globe className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsMainFocused(true)}
                onBlur={() => setTimeout(() => setIsMainFocused(false), 250)}
                placeholder="예: 서울대, ㅅㅇㄷ, 코레일, 인터파크 또는 도메인"
                className="w-full bg-transparent border-none outline-none text-xl sm:text-2xl py-3 text-white placeholder-slate-600 focus:ring-0"
              />
              <button
                type="submit"
                disabled={isLoading || !url}
                className="ml-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sync</span>
                    <Search className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-time Autocomplete Dropdown */}
          {isMainFocused && mainSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-2">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 flex items-center justify-between border-b border-slate-800/80 mb-1">
                <span>추천 바로가기 (클릭 시 즉시 동기화)</span>
                <span className="text-indigo-400">Enter 키로 바로 시작</span>
              </div>
              <div className="space-y-1">
                {mainSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={() => {
                      setUrl(item.name);
                      fetchServerTime(undefined, item.url);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-600/80 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={`https://s2.googleusercontent.com/s2/favicons?domain=${item.url}&sz=32`}
                        alt=""
                        className="w-4 h-4 rounded-sm bg-white/80 p-0.5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                        {item.name}
                      </span>
                      {item.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 group-hover:bg-indigo-700 group-hover:text-indigo-100">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-slate-500 group-hover:text-indigo-200">
                      {item.url}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-center text-red-400 bg-red-400/10 py-2 rounded-lg text-sm border border-red-400/20">
              {error}
            </p>
          )}
        </form>

        {/* Main Clock Card */}
        <div 
          ref={clockRef} 
          id="main-clock"
          className={`w-full max-w-4xl flex flex-col items-center p-8 sm:p-12 rounded-3xl backdrop-blur-2xl border transition-all duration-200 ${
            activeAlert
              ? `${activeAlert.borderClass} ${activeAlert.bgClass} ${activeAlert.glowClass}`
              : isTicking
              ? "bg-slate-900/60 border-indigo-500/30 shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]"
              : "bg-slate-900/30 border-slate-800 shadow-xl"
          } animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300`}
        >
          
          <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 px-4 gap-4">
            {isTicking && targetUrl ? (
              <div className="flex items-center space-x-2 text-indigo-400 bg-indigo-400/10 px-4 py-2 rounded-full border border-indigo-400/20">
                <Server className="w-4 h-4" />
                <span className="font-mono text-sm">{targetUrl}</span>
              </div>
            ) : <div />}
            
            <div className="flex flex-col items-end space-y-3">
              <button 
                onClick={toggleSound}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full border transition-all cursor-pointer ${soundEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50'}`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="text-sm font-semibold">{soundEnabled ? '알림 켜짐' : '알림 꺼짐'}</span>
              </button>

              {soundEnabled && (
                <div className="flex flex-wrap justify-end gap-3 text-xs sm:text-sm text-slate-300 bg-slate-900/80 p-3 rounded-2xl border border-slate-700/50 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
                  <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/20 bg-slate-800" 
                      checked={alarmSettings.everyMinute} onChange={(e) => setAlarmSettings({...alarmSettings, everyMinute: e.target.checked})} />
                    <span>매분마다</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/20 bg-slate-800" 
                      checked={alarmSettings.onTheHour} onChange={(e) => setAlarmSettings({...alarmSettings, onTheHour: e.target.checked})} />
                    <span>정각 (00분)</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/20 bg-slate-800" 
                      checked={alarmSettings.min1Before} onChange={(e) => setAlarmSettings({...alarmSettings, min1Before: e.target.checked})} />
                    <span>1분 전</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/20 bg-slate-800" 
                      checked={alarmSettings.min2Before} onChange={(e) => setAlarmSettings({...alarmSettings, min2Before: e.target.checked})} />
                    <span>2분 전</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/20 bg-slate-800" 
                      checked={alarmSettings.min3Before} onChange={(e) => setAlarmSettings({...alarmSettings, min3Before: e.target.checked})} />
                    <span>3분 전</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 5, 4, 3, 2, 1, 0 Dynamic Countdown Alert Badge */}
          {activeAlert && (
            <div className={`mb-4 px-5 py-2 rounded-full border ${activeAlert.borderClass} ${activeAlert.bgClass} ${activeAlert.textClass} text-base sm:text-lg font-extrabold tracking-wide flex items-center space-x-2 animate-in zoom-in-95 duration-150`}>
              <span>{activeAlert.label}</span>
            </div>
          )}

          <div className="flex items-baseline justify-center font-mono tabular-nums tracking-tighter">
            {isMounted ? (
              <>
                <span className={`text-7xl sm:text-9xl font-bold transition-colors duration-150 ${activeAlert ? activeAlert.textClass : "text-white"}`}>
                  {hours}:{minutes}:{seconds}
                </span>
                <span className={`text-3xl sm:text-5xl font-medium ml-2 transition-colors duration-150 ${activeAlert ? activeAlert.textClass : isTicking ? "text-emerald-400" : "text-slate-500"}`}>
                  .{milliseconds}
                </span>
              </>
            ) : (
              <>
                <span className="text-7xl sm:text-9xl font-bold text-transparent opacity-0">
                  00:00:00
                </span>
                <span className="text-3xl sm:text-5xl font-medium ml-2 text-transparent opacity-0">
                  .000
                </span>
              </>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isTicking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-slate-400">
                {isTicking ? 'Synchronized' : 'Local Time'}
              </span>
            </div>
            {isTicking && latency !== null && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">Latency: <span className="text-slate-300 font-mono">{latency}ms</span></span>
              </div>
            )}
          </div>
        </div>

        {/* 👥 실시간 커뮤니티 & 실시간 동시 접속처 현황 (Navyism 스타일) */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-9 duration-700 delay-350">
          
          {/* 좌측: 🔥 현재 접속자들이 확인 중인 곳 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">실시간 인기 동시 접속처</h3>
                    <p className="text-xs text-slate-400">현재 이용자들이 가장 많이 확인 중인 곳</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{totalOnline}명 확인 중</span>
                </div>
              </div>

              <div className="space-y-2 mt-3">
                {activeList.length > 0 ? (
                  activeList.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => fetchServerTime(undefined, item.url)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-indigo-600/80 border border-slate-800/80 hover:border-indigo-500 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-5 text-center font-mono font-bold text-xs ${idx < 3 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {idx + 1}
                        </span>
                        <img
                          src={`https://s2.googleusercontent.com/s2/favicons?domain=${item.url}&sz=32`}
                          alt=""
                          className="w-4 h-4 rounded-sm bg-white/80 p-0.5"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-mono font-bold text-indigo-400 group-hover:text-white bg-indigo-500/10 group-hover:bg-indigo-500/30 px-2 py-0.5 rounded-md">
                          {item.count}명
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    현재 활성 접속처를 집계하고 있습니다...
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>💡 항목을 클릭하면 해당 사이트 시계로 즉시 전환됩니다.</span>
              <span className="text-indigo-400 font-mono">15분 기준</span>
            </div>
          </div>

          {/* 우측: 💬 실시간 티켓팅 & 수강신청 응원 한마디 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-400">
                    <Heart className="w-5 h-5 fill-pink-400/20" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">실시간 응원 & 올클 기원</h3>
                    <p className="text-xs text-slate-400">티켓팅 · 수강신청 대박을 기원합니다!</p>
                  </div>
                </div>
                <button
                  onClick={loadCommunityData}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  title="새로고침"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Hashtags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["#올클기원", "#티켓팅성공", "#포도알잡자", "#수강신청성공", "#화이팅"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addHashtag(tag)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-pink-600 hover:text-white text-slate-300 border border-slate-700/60 transition-all cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Live Cheers Rolling Feed */}
              <div className="h-44 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {cheers.length > 0 ? (
                  cheers.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-200">{c.nickname}</span>
                          {c.target_name && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 rounded">
                              {c.target_name}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(c.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-slate-300 break-all">{c.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    첫 번째 응원 메시지를 남겨보세요! ✨
                  </div>
                )}
              </div>
            </div>

            {/* Cheer Input Form */}
            <form onSubmit={handleCheerSubmit} className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임 (익명)"
                  maxLength={15}
                  className="w-24 bg-slate-950/80 border border-slate-700/70 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <div className="relative flex-1 flex">
                  <input
                    type="text"
                    value={cheerContent}
                    onChange={(e) => setCheerContent(e.target.value)}
                    placeholder="응원 메시지 (최대 100자)"
                    maxLength={100}
                    className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl pl-3 pr-9 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!cheerContent.trim() || isSubmittingCheer}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-white disabled:text-slate-600 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>

        {/* Other Popular Categories */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-9 duration-700 delay-400">
          {POPULAR_SITES.map((category, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center text-slate-300 font-semibold mb-4 text-sm">
                {category.icon}
                {category.category}
              </div>
              <div className="flex flex-wrap gap-2">
                {category.sites.map((site, siteIdx) => (
                  <button
                    key={siteIdx}
                    onClick={() => fetchServerTime(undefined, site.url)}
                    className="px-2.5 py-1.5 text-xs bg-slate-800/50 hover:bg-indigo-600/80 text-slate-300 hover:text-white rounded-lg border border-slate-700/50 hover:border-indigo-500 transition-all text-left flex items-center space-x-2 cursor-pointer"
                  >
                    <img 
                      src={`https://s2.googleusercontent.com/s2/favicons?domain=${site.url}&sz=32`} 
                      alt="" 
                      className="w-3.5 h-3.5 rounded-sm bg-white/80 p-0.5"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="font-medium">{site.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 🎓 Nationwide Universities Section (Moved to bottom & Collapsible) */}
        <div className="w-full max-w-4xl bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-xl animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  전국 대학교 수강신청 서버시간
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  초성 검색(예: ㅅㅇㄷ, ㄱㄹㄷ) 및 빠른 바로가기를 지원합니다.
                </p>
              </div>
            </div>

            {/* University Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={uniSearch}
                onChange={(e) => setUniSearch(e.target.value)}
                placeholder="대학명 / 초성 검색 (ㅅㅇㄷ)"
                className="w-full bg-slate-950/70 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              {uniSearch && (
                <button
                  onClick={() => setUniSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  지우기
                </button>
              )}
            </div>
          </div>

          {/* Recent Selected Universities (Bookmarks) */}
          {recentUnis.length > 0 && (
            <div className="mt-5 p-3 bg-slate-950/40 rounded-2xl border border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs text-amber-400 flex items-center font-medium pl-1 mr-1">
                <Star className="w-3.5 h-3.5 mr-1 fill-amber-400/20" />
                최근 선택:
              </span>
              {recentUnis.map((uni, idx) => (
                <button
                  key={idx}
                  onClick={() => fetchServerTime(undefined, uni.url, uni)}
                  className="px-2.5 py-1 text-xs bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg border border-slate-700/60 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <img
                    src={`https://s2.googleusercontent.com/s2/favicons?domain=${uni.url}&sz=32`}
                    alt=""
                    className="w-3.5 h-3.5 rounded-sm bg-white/80 p-0.5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span>{uni.shortName || uni.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Toggle Button for Full List */}
          <div className="flex justify-center mt-5">
            <button
              onClick={() => setIsUniListOpen(!isUniListOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white rounded-xl border border-slate-700/50 transition-all cursor-pointer"
            >
              <span>{isUniListOpen || uniSearch.trim().length > 0 ? "대학교 목록 접기" : "전체 대학교 목록 펼치기"}</span>
              {isUniListOpen || uniSearch.trim().length > 0 ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>

          {/* Collapsible Content: Region Tabs, Sort Toggle, University List Grid */}
          {(isUniListOpen || uniSearch.trim().length > 0) && (
            <div className="mt-6 pt-5 border-t border-slate-800/80 animate-in fade-in slide-in-from-top-3 duration-300">
              {/* Region Tabs & Sort Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
                <div className="flex flex-wrap gap-1.5">
                  {REGIONS.map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        selectedRegion === region
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>

                {/* Sort Toggle (가나다순 / 인기순) */}
                <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    onClick={() => setUniSortBy("name")}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      uniSortBy === "name"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>🔤 가나다순</span>
                  </button>
                  <button
                    onClick={() => setUniSortBy("popular")}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      uniSortBy === "popular"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>🔥 인기순</span>
                  </button>
                </div>
              </div>

              {/* University List Grid with Scroll */}
              <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {filteredUniversities.length > 0 ? (
                  filteredUniversities.map((uni, idx) => (
                    <button
                      key={idx}
                      onClick={() => fetchServerTime(undefined, uni.url, uni)}
                      className="px-3 py-2 text-xs bg-slate-800/40 hover:bg-indigo-600/80 text-slate-300 hover:text-white rounded-xl border border-slate-800 hover:border-indigo-500 transition-all text-left flex items-center space-x-2 group cursor-pointer"
                    >
                      <img
                        src={`https://s2.googleusercontent.com/s2/favicons?domain=${uni.url}&sz=32`}
                        alt=""
                        className="w-4 h-4 rounded-sm bg-white/80 p-0.5 flex-shrink-0"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate group-hover:text-white">{uni.name}</div>
                        <div className="text-[10px] text-slate-500 group-hover:text-indigo-200 truncate">{uni.url}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-slate-500 text-sm">
                    "{uniSearch}"에 일치하는 대학교가 없습니다. 상단 주소창에 직접 도메인을 입력해 확인하실 수 있습니다.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
