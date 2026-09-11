export interface University {
  name: string;
  url: string;
  region: "수도권" | "국공립/거점" | "충청/강원" | "영남권" | "호남/제주" | "특수/이공계";
  shortName?: string;
}

export const UNIVERSITIES: University[] = [
  // 수도권 주요 대학
  { name: "서울대학교", url: "sugang.snu.ac.kr", region: "수도권", shortName: "서울대" },
  { name: "연세대학교", url: "portal.yonsei.ac.kr", region: "수도권", shortName: "연세대" },
  { name: "고려대학교", url: "sugang.korea.ac.kr", region: "수도권", shortName: "고려대" },
  { name: "서강대학교", url: "sugang.sogang.ac.kr", region: "수도권", shortName: "서강대" },
  { name: "성균관대학교", url: "sugang.skku.edu", region: "수도권", shortName: "성균관대" },
  { name: "한양대학교", url: "sugang.hanyang.ac.kr", region: "수도권", shortName: "한양대" },
  { name: "중앙대학교", url: "sugang.cau.ac.kr", region: "수도권", shortName: "중앙대" },
  { name: "경희대학교", url: "sugang.khu.ac.kr", region: "수도권", shortName: "경희대" },
  { name: "한국외국어대학교", url: "sugang.hufs.ac.kr", region: "수도권", shortName: "한국외대" },
  { name: "서울시립대학교", url: "sugang.uos.ac.kr", region: "수도권", shortName: "시립대" },
  { name: "이화여자대학교", url: "sugang.ewha.ac.kr", region: "수도권", shortName: "이화여대" },
  { name: "건국대학교", url: "sugang.konkuk.ac.kr", region: "수도권", shortName: "건국대" },
  { name: "동국대학교", url: "sugang.dongguk.edu", region: "수도권", shortName: "동국대" },
  { name: "홍익대학교", url: "sugang.hongik.ac.kr", region: "수도권", shortName: "홍익대" },
  { name: "숙명여자대학교", url: "sugang.sookmyung.ac.kr", region: "수도권", shortName: "숙명여대" },
  { name: "국민대학교", url: "sugang.kookmin.ac.kr", region: "수도권", shortName: "국민대" },
  { name: "숭실대학교", url: "sugang.ssu.ac.kr", region: "수도권", shortName: "숭실대" },
  { name: "세종대학교", url: "sugang.sejong.ac.kr", region: "수도권", shortName: "세종대" },
  { name: "단국대학교", url: "sugang.dankook.ac.kr", region: "수도권", shortName: "단국대" },
  { name: "아주대학교", url: "sugang.ajou.ac.kr", region: "수도권", shortName: "아주대" },
  { name: "인하대학교", url: "sugang.inha.ac.kr", region: "수도권", shortName: "인하대" },
  { name: "인천대학교", url: "sugang.inu.ac.kr", region: "수도권", shortName: "인천대" },
  { name: "가천대학교", url: "sugang.gachon.ac.kr", region: "수도권", shortName: "가천대" },
  { name: "경기대학교", url: "sugang.kyonggi.ac.kr", region: "수도권", shortName: "경기대" },
  { name: "광운대학교", url: "info.kw.ac.kr", region: "수도권", shortName: "광운대" },
  { name: "명지대학교", url: "sugang.mju.ac.kr", region: "수도권", shortName: "명지대" },
  { name: "상명대학교", url: "sugang.smu.ac.kr", region: "수도권", shortName: "상명대" },
  { name: "가톨릭대학교", url: "sugang.catholic.ac.kr", region: "수도권", shortName: "가톨릭대" },
  { name: "서울과학기술대학교", url: "for-s.seoultech.ac.kr", region: "수도권", shortName: "서울과기대" },
  { name: "성신여자대학교", url: "sugang.sungshin.ac.kr", region: "수도권", shortName: "성신여대" },
  { name: "동덕여자대학교", url: "sugang.dongduk.ac.kr", region: "수도권", shortName: "동덕여대" },
  { name: "덕성여자대학교", url: "sugang.duksung.ac.kr", region: "수도권", shortName: "덕성여대" },
  { name: "서울여자대학교", url: "sugang.swu.ac.kr", region: "수도권", shortName: "서울여대" },
  { name: "삼육대학교", url: "sugang.syu.ac.kr", region: "수도권", shortName: "삼육대" },
  { name: "서경대학교", url: "sugang.skuniv.ac.kr", region: "수도권", shortName: "서경대" },
  { name: "한성대학교", url: "sugang.hansung.ac.kr", region: "수도권", shortName: "한성대" },
  { name: "한국항공대학교", url: "sugang.kau.ac.kr", region: "수도권", shortName: "항공대" },
  { name: "한국공학대학교", url: "sugang.tukorea.ac.kr", region: "수도권", shortName: "한국공대" },
  { name: "강남대학교", url: "sugang.kangnam.ac.kr", region: "수도권", shortName: "강남대" },
  { name: "수원대학교", url: "sugang.suwon.ac.kr", region: "수도권", shortName: "수원대" },
  { name: "용인대학교", url: "sugang.yongin.ac.kr", region: "수도권", shortName: "용인대" },
  { name: "을지대학교", url: "sugang.eulji.ac.kr", region: "수도권", shortName: "을지대" },
  { name: "성결대학교", url: "sugang.sungkyul.ac.kr", region: "수도권", shortName: "성결대" },
  { name: "안양대학교", url: "sugang.anyang.ac.kr", region: "수도권", shortName: "안양대" },
  { name: "한경국립대학교", url: "sugang.hknu.ac.kr", region: "수도권", shortName: "한경대" },
  { name: "평택대학교", url: "sugang.ptu.ac.kr", region: "수도권", shortName: "평택대" },
  { name: "대진대학교", url: "sugang.daejin.ac.kr", region: "수도권", shortName: "대진대" },
  { name: "신한대학교", url: "sugang.shinhan.ac.kr", region: "수도권", shortName: "신한대" },
  { name: "차의과학대학교", url: "sugang.cha.ac.kr", region: "수도권", shortName: "차의과학대" },
  { name: "한세대", url: "sugang.hansei.ac.kr", region: "수도권", shortName: "한세대" },

  // 거점 국립대 & 주요 국공립
  { name: "부산대학교", url: "sugang.pusan.ac.kr", region: "국공립/거점", shortName: "부산대" },
  { name: "경북대학교", url: "sugang.knu.ac.kr", region: "국공립/거점", shortName: "경북대" },
  { name: "전남대학교", url: "sugang.jnu.ac.kr", region: "국공립/거점", shortName: "전남대" },
  { name: "전북대학교", url: "sugang.jbnu.ac.kr", region: "국공립/거점", shortName: "전북대" },
  { name: "충남대학교", url: "sugang.cnu.ac.kr", region: "국공립/거점", shortName: "충남대" },
  { name: "충북대학교", url: "sugang.chungbuk.ac.kr", region: "국공립/거점", shortName: "충북대" },
  { name: "강원대학교", url: "sugang.kangwon.ac.kr", region: "국공립/거점", shortName: "강원대" },
  { name: "경상국립대학교", url: "sugang.gnu.ac.kr", region: "국공립/거점", shortName: "경상대" },
  { name: "제주대학교", url: "sugang.jejunu.ac.kr", region: "국공립/거점", shortName: "제주대" },
  { name: "부경대학교", url: "sugang.pknu.ac.kr", region: "국공립/거점", shortName: "부경대" },
  { name: "한국해양대학교", url: "sugang.kmou.ac.kr", region: "국공립/거점", shortName: "해양대" },
  { name: "공주대학교", url: "sugang.kongju.ac.kr", region: "국공립/거점", shortName: "공주대" },
  { name: "창원대학교", url: "sugang.changwon.ac.kr", region: "국공립/거점", shortName: "창원대" },
  { name: "금오공과대학교", url: "sugang.kumoh.ac.kr", region: "국공립/거점", shortName: "금오공대" },
  { name: "안동대학교", url: "sugang.andong.ac.kr", region: "국공립/거점", shortName: "안동대" },
  { name: "목포대학교", url: "sugang.mokpo.ac.kr", region: "국공립/거점", shortName: "목포대" },
  { name: "순천대학교", url: "sugang.scnu.ac.kr", region: "국공립/거점", shortName: "순천대" },
  { name: "군산대학교", url: "sugang.kunsan.ac.kr", region: "국공립/거점", shortName: "군산대" },
  { name: "강릉원주대학교", url: "sugang.gwnu.ac.kr", region: "국공립/거점", shortName: "강릉원주대" },
  { name: "한국교통대학교", url: "sugang.ut.ac.kr", region: "국공립/거점", shortName: "교통대" },
  { name: "한국교원대학교", url: "sugang.knue.ac.kr", region: "국공립/거점", shortName: "교원대" },

  // 충청 / 강원권 사립대
  { name: "한남대학교", url: "sugang.hannam.ac.kr", region: "충청/강원", shortName: "한남대" },
  { name: "대전대학교", url: "sugang.dju.ac.kr", region: "충청/강원", shortName: "대전대" },
  { name: "목원대학교", url: "sugang.mokwon.ac.kr", region: "충청/강원", shortName: "목원대" },
  { name: "배재대학교", url: "sugang.pcu.ac.kr", region: "충청/강원", shortName: "배재대" },
  { name: "우송대학교", url: "sugang.wsu.ac.kr", region: "충청/강원", shortName: "우송대" },
  { name: "순천향대학교", url: "sugang.sch.ac.kr", region: "충청/강원", shortName: "순천향대" },
  { name: "호서대학교", url: "sugang.hoseo.edu", region: "충청/강원", shortName: "호서대" },
  { name: "선문대학교", url: "sugang.sunmoon.ac.kr", region: "충청/강원", shortName: "선문대" },
  { name: "백석대학교", url: "sugang.bu.ac.kr", region: "충청/강원", shortName: "백석대" },
  { name: "한국기술교육대학교", url: "sugang.koreatech.ac.kr", region: "충청/강원", shortName: "한기대" },
  { name: "청주대학교", url: "sugang.cju.ac.kr", region: "충청/강원", shortName: "청주대" },
  { name: "서원대학교", url: "sugang.seowon.ac.kr", region: "충청/강원", shortName: "서원대" },
  { name: "세명대학교", url: "sugang.semyung.ac.kr", region: "충청/강원", shortName: "세명대" },
  { name: "한림대학교", url: "sugang.hallym.ac.kr", region: "충청/강원", shortName: "한림대" },
  { name: "상지대학교", url: "sugang.sangji.ac.kr", region: "충청/강원", shortName: "상지대" },
  { name: "가톨릭관동대학교", url: "sugang.cku.ac.kr", region: "충청/강원", shortName: "관동대" },

  // 영남권 사립대
  { name: "영남대학교", url: "sugang.yu.ac.kr", region: "영남권", shortName: "영남대" },
  { name: "계명대학교", url: "sugang.kmu.ac.kr", region: "영남권", shortName: "계명대" },
  { name: "대구대학교", url: "sugang.daegu.ac.kr", region: "영남권", shortName: "대구대" },
  { name: "대구가톨릭대학교", url: "sugang.cu.ac.kr", region: "영남권", shortName: "대가대" },
  { name: "동아대학교", url: "sugang.donga.ac.kr", region: "영남권", shortName: "동아대" },
  { name: "동의대학교", url: "sugang.deu.ac.kr", region: "영남권", shortName: "동의대" },
  { name: "경성대학교", url: "sugang.ks.ac.kr", region: "영남권", shortName: "경성대" },
  { name: "신라대학교", url: "sugang.silla.ac.kr", region: "영남권", shortName: "신라대" },
  { name: "인제대학교", url: "sugang.inje.ac.kr", region: "영남권", shortName: "인제대" },
  { name: "울산대학교", url: "sugang.ulsan.ac.kr", region: "영남권", shortName: "울산대" },
  { name: "한동대학교", url: "sugang.handong.edu", region: "영남권", shortName: "한동대" },
  { name: "동서대학교", url: "sugang.dongseo.ac.kr", region: "영남권", shortName: "동서대" },
  { name: "부산외국어대학교", url: "sugang.bufs.ac.kr", region: "영남권", shortName: "부산외대" },
  { name: "경남대학교", url: "sugang.kyungnam.ac.kr", region: "영남권", shortName: "경남대" },

  // 호남 / 제주권 사립대
  { name: "조선대학교", url: "sugang.chosun.ac.kr", region: "호남/제주", shortName: "조선대" },
  { name: "원광대학교", url: "sugang.wku.ac.kr", region: "호남/제주", shortName: "원광대" },
  { name: "전주대학교", url: "sugang.jj.ac.kr", region: "호남/제주", shortName: "전주대" },
  { name: "우석대학교", url: "portal.woosuk.ac.kr", region: "호남/제주", shortName: "우석대" },
  { name: "동신대학교", url: "sugang.dsu.ac.kr", region: "호남/제주", shortName: "동신대" },
  { name: "호남대학교", url: "sugang.honam.ac.kr", region: "호남/제주", shortName: "호남대" },
  { name: "광주대학교", url: "sugang.gwangju.ac.kr", region: "호남/제주", shortName: "광주대" },
  { name: "제주국제대학교", url: "sugang.jeju.ac.kr", region: "호남/제주", shortName: "제주국제대" },

  // 특수목적 / 이공계
  { name: "카이스트 (KAIST)", url: "portal.kaist.ac.kr", region: "특수/이공계", shortName: "KAIST" },
  { name: "포항공과대학교 (POSTECH)", url: "povis.postech.ac.kr", region: "특수/이공계", shortName: "POSTECH" },
  { name: "광주과학기술원 (GIST)", url: "portal.gist.ac.kr", region: "특수/이공계", shortName: "GIST" },
  { name: "대구경북과학기술원 (DGIST)", url: "portal.dgist.ac.kr", region: "특수/이공계", shortName: "DGIST" },
  { name: "울산과학기술원 (UNIST)", url: "portal.unist.ac.kr", region: "특수/이공계", shortName: "UNIST" },
  { name: "한국예술종합학교", url: "karts.ac.kr", region: "특수/이공계", shortName: "한예종" },
  { name: "한국전통문화대학교", url: "nuch.ac.kr", region: "특수/이공계", shortName: "전통문화대" },
];

// 초성 추출 함수
export function getChosung(str: string): string {
  const CHOSUNG = [
    'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
  ];
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 0xac00;
    if (code >= 0 && code <= 11171) {
      result += CHOSUNG[Math.floor(code / 588)];
    } else {
      result += str[i];
    }
  }
  return result;
}

// 검색 및 정렬 필터링 헬퍼 (완전일치, 부분일치, 초성일치, 가나다/인기순 지원)
export function filterUniversities(
  query: string,
  regionFilter?: string,
  sortBy: "popular" | "name" = "popular"
): University[] {
  const trimmed = query.trim().toLowerCase();
  const queryChosung = getChosung(trimmed);

  const list = UNIVERSITIES.filter((uni) => {
    if (regionFilter && regionFilter !== "전체" && uni.region !== regionFilter) {
      return false;
    }
    if (!trimmed) return true;

    const nameLower = uni.name.toLowerCase();
    const shortLower = uni.shortName?.toLowerCase() || "";
    const nameChosung = getChosung(uni.name);
    const shortChosung = getChosung(uni.shortName || "");
    const urlLower = uni.url.toLowerCase();

    return (
      nameLower.includes(trimmed) ||
      shortLower.includes(trimmed) ||
      urlLower.includes(trimmed) ||
      nameChosung.includes(queryChosung) ||
      shortChosung.includes(queryChosung)
    );
  });

  if (sortBy === "name") {
    return [...list].sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }

  return list;
}

export interface SiteItem {
  name: string;
  url: string;
  category?: string;
  shortName?: string;
}

export const POPULAR_SITES_FLAT: SiteItem[] = [
  { name: "인터파크 티켓", url: "ticket.interpark.com", shortName: "인터파크", category: "티켓팅" },
  { name: "멜론티켓", url: "ticket.melon.com", shortName: "멜론", category: "티켓팅" },
  { name: "YES24 티켓", url: "ticket.yes24.com", shortName: "예스24", category: "티켓팅" },
  { name: "티켓링크", url: "www.ticketlink.co.kr", shortName: "티켓링크", category: "티켓팅" },
  { name: "옥션 티켓", url: "www.auction.co.kr", shortName: "옥션", category: "티켓팅" },
  { name: "11번가 티켓", url: "ticket.11st.co.kr", shortName: "11번가", category: "티켓팅" },
  { name: "위메프 공연", url: "ticket.wemakeprice.com", shortName: "위메프", category: "티켓팅" },
  { name: "나이키 코리아", url: "www.nike.com", shortName: "나이키", category: "쇼핑" },
  { name: "무신사", url: "www.musinsa.com", shortName: "무신사", category: "쇼핑" },
  { name: "CGV", url: "www.cgv.co.kr", shortName: "CGV", category: "영화" },
  { name: "롯데시네마", url: "www.lottecinema.co.kr", shortName: "롯데시네마", category: "영화" },
  { name: "메가박스", url: "www.megabox.co.kr", shortName: "메가박스", category: "영화" },
  { name: "코레일 (KTX/명절)", url: "www.letskorail.com", shortName: "코레일", category: "교통" },
  { name: "SRT", url: "etk.srail.kr", shortName: "SRT", category: "교통" },
  { name: "대한항공", url: "www.koreanair.com", shortName: "대한항공", category: "항공" },
  { name: "아시아나항공", url: "flyasiana.com", shortName: "아시아나", category: "항공" },
  { name: "제주항공", url: "www.jejuair.net", shortName: "제주항공", category: "항공" },
  { name: "진에어", url: "www.jinair.com", shortName: "진에어", category: "항공" },
  { name: "네이버시계", url: "time.naver.com", shortName: "네이버", category: "포털" },
  { name: "큐넷 (Q-Net)", url: "www.q-net.or.kr", shortName: "큐넷", category: "자격증" },
  { name: "병무청", url: "mwpt.mma.go.kr", shortName: "병무청", category: "공공" },
  { name: "정부24", url: "www.gov.kr", shortName: "정부24", category: "공공" },
  { name: "대법원 전자가족관계", url: "efamily.scourt.go.kr", shortName: "가족관계", category: "공공" },
];

export const ALL_SITES: SiteItem[] = [
  ...POPULAR_SITES_FLAT,
  ...UNIVERSITIES.map((u) => ({
    name: u.name,
    url: u.url,
    shortName: u.shortName,
    category: "대학교 수강신청",
  })),
];

// 통합 검색 헬퍼 (티켓팅, 교통, 공공기관, 대학교 전수 포함)
export function searchAllSites(query: string): SiteItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const queryChosung = getChosung(trimmed);

  // 일치하는 항목 필터링
  const candidates = ALL_SITES.filter((site) => {
    const nameLower = site.name.toLowerCase();
    const shortLower = (site.shortName || "").toLowerCase();
    const nameChosung = getChosung(site.name);
    const shortChosung = getChosung(site.shortName || "");
    const urlLower = site.url.toLowerCase();

    return tokens.some((token) => {
      const tokenChosung = getChosung(token);
      return (
        nameLower.includes(token) ||
        shortLower.includes(token) ||
        urlLower.includes(token) ||
        (tokenChosung && nameChosung.includes(tokenChosung)) ||
        (tokenChosung && shortChosung.includes(tokenChosung))
      );
    });
  });

  // 정확도 및 우선순위 점수 계산 함수
  const calculateScore = (site: SiteItem): number => {
    const nameLower = site.name.toLowerCase();
    const shortLower = (site.shortName || "").toLowerCase();
    const nameChosung = getChosung(site.name);
    const shortChosung = getChosung(site.shortName || "");
    const urlLower = site.url.toLowerCase();

    let score = 0;

    // 1. 완전 일치 (이름 또는 줄임말)
    if (shortLower === trimmed || nameLower === trimmed) {
      score += 2000;
    }

    // 2. 초성 완전 일치 (예: 'ㅋㄹㅇ' === '코레일'의 초성 'ㅋㄹㅇ')
    if (shortChosung === queryChosung || nameChosung === queryChosung) {
      score += 1500;
    }

    // 3. 접두사 일치 (이름이나 줄임말이 검색어로 시작)
    if (shortLower.startsWith(trimmed) || nameLower.startsWith(trimmed)) {
      score += 1000;
    }

    // 4. 초성 접두사 일치 (예: 'ㅋㄹ' -> 'ㅋㄹㅇ' 시작)
    if (shortChosung.startsWith(queryChosung) || nameChosung.startsWith(queryChosung)) {
      score += 800;
    }

    // 5. 토큰 접두사 일치
    tokens.forEach((token) => {
      const tokenChosung = getChosung(token);
      if (shortLower.startsWith(token) || nameLower.startsWith(token)) score += 400;
      if (tokenChosung && (shortChosung.startsWith(tokenChosung) || nameChosung.startsWith(tokenChosung))) {
        score += 300;
      }
    });

    // 6. 단순 포함
    if (shortLower.includes(trimmed) || nameLower.includes(trimmed)) {
      score += 200;
    }
    if (shortChosung.includes(queryChosung) || nameChosung.includes(queryChosung)) {
      score += 100;
    }

    // 7. 메이저 핵심 사이트 가중치 (이용 빈도가 압도적으로 높은 서비스)
    const CORE_SITES = ["코레일", "인터파크", "멜론", "YES24", "SRT", "서울대", "네이버", "티켓링크"];
    if (CORE_SITES.some((core) => site.name.includes(core) || (site.shortName && site.shortName.includes(core)))) {
      score += 150;
    }

    // 8. 이름 길이가 검색어와 가까울수록 가산점 (불필요하게 긴 이름 감점)
    score -= site.name.length * 2;

    return score;
  };

  // 점수가 높은 순으로 정렬
  return candidates.sort((a, b) => calculateScore(b) - calculateScore(a));
}
