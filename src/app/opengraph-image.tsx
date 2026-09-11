import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const alt = '바로타임 (BAROTIME) - 초정밀 실시간 서버시간';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          padding: '40px',
        }}
      >
        {/* Glow circles */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.25)',
            filter: 'blur(90px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.25)',
            filter: 'blur(90px)',
          }}
        />

        {/* Top Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(51, 65, 85, 0.8)',
            borderRadius: '9999px',
            padding: '10px 28px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              marginRight: '12px',
            }}
          />
          <span style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 600, letterSpacing: '0.05em' }}>
            0.001초 틱오버 초정밀 실시간 동기화
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              fontSize: '84px',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginRight: '20px',
            }}
          >
            바로타임
          </span>
          <span
            style={{
              fontSize: '60px',
              fontWeight: 800,
              color: '#818cf8',
              letterSpacing: '0.08em',
              fontFamily: 'monospace',
            }}
          >
            BAROTIME
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            color: '#94a3b8',
            fontSize: '28px',
            fontWeight: 500,
            marginBottom: '36px',
            textAlign: 'center',
          }}
        >
          오차 없이 바로 맞는 실시간 서버시간 · 티켓팅 &amp; 수강신청
        </p>

        {/* Digital Clock Visual Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(99, 102, 241, 0.5)',
            borderRadius: '24px',
            padding: '20px 50px',
            boxShadow: '0 0 50px -10px rgba(99, 102, 241, 0.4)',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 800,
              fontFamily: 'monospace',
              color: '#ffffff',
            }}
          >
            11:59:59
          </span>
          <span
            style={{
              fontSize: '44px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#34d399',
              marginLeft: '10px',
            }}
          >
            .999
          </span>
        </div>

        {/* Bottom tags */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '30px',
          }}
        >
          {['인터파크 티켓', '코레일/SRT', '멜론티켓', '전국 116+ 대학교 수강신청', '정각 카운트다운'].map(
            (tag, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(71, 85, 105, 0.6)',
                  color: '#cbd5e1',
                  borderRadius: '12px',
                  padding: '6px 16px',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
