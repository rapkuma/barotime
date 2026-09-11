# 바로타임 (BAROTIME)

> **오차 없이 바로 맞는 실시간 서버시간 · 티켓팅 & 수강신청**  
> **공식 서비스 URL**: [https://barotime-r9aw.vercel.app/](https://barotime-r9aw.vercel.app/)  
> **기술 레퍼런스 문서**: [docs/reference.md](docs/reference.md)

---

## 주요 기능

1. **0.001초 틱오버(Tick-Over) 초정밀 서버시간 동기화**
   - 대상 웹 서버(인터파크, 코레일, 멜론, 대학교 등)의 초 변경 순간을 1ms 단위로 포착하여 밀리초 오차 없이 표시합니다.
2. **5-4-3-2-1-0 카운트다운 알림 & 비주얼 글로우**
   - Web Audio API 기반 오실레이터 주파수 상승 비프음 (440Hz ~ 880Hz)
   - 정각 카운트다운 색상 변화 (Amber → Orange → Red → Rose → Emerald)
3. **전국 116+ 대학교 수강신청 서버시간**
   - 지역별 필터, 가나다순 / 인기순 정렬, 한글 초성 검색(`ㅅㅇㄷ`, `ㄱㄹㄷ`) 지원.
4. **네이비즘 스타일 실시간 커뮤니티**
   - 오늘 / 어제 / 누적 방문자수 카운터
   - 현재 접속자들이 가장 많이 확인 중인 실시간 인기 동시 접속처 집계
   - 실시간 티켓팅 & 올클 기원 응원 한마디 및 해시태그 피드

---

## 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS
- **Database / Backend**: Supabase (PostgreSQL, RLS)
- **Deployment**: Vercel Serverless & Edge Network
- **Icons**: Lucide React
