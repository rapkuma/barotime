import { NextRequest, NextResponse } from "next/server";
import https from "https";
import http from "http";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50 });

function doHeadRequest(urlStr: string): Promise<{ serverTime: number; latency: number; adjustedTime: number }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(urlStr);
    const client = urlObj.protocol === "https:" ? https : http;
    const agent = urlObj.protocol === "https:" ? httpsAgent : httpAgent;
    const start = Date.now();

    const req = client.request(
      urlStr,
      {
        method: "HEAD",
        agent,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Cache-Control": "no-cache",
        },
        timeout: 4000,
      },
      (res) => {
        const end = Date.now();
        const dateHeader = res.headers.date;

        if (!dateHeader) {
          return reject(new Error("No Date header found"));
        }

        const serverTime = new Date(dateHeader).getTime();
        resolve({
          serverTime,
          latency: end - start,
          adjustedTime: serverTime,
        });
      }
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = "https://" + targetUrl;
  }

  // Generate fallback candidates in case the subdomain DNS has changed/retired
  const candidates: string[] = [targetUrl];
  try {
    const parsed = new URL(targetUrl);
    const hostParts = parsed.hostname.split(".");
    if (hostParts.length > 2) {
      const parentDomain = hostParts.slice(1).join(".");
      candidates.push(`${parsed.protocol}//www.${parentDomain}`);
      candidates.push(`${parsed.protocol}//${parentDomain}`);
      if (parsed.protocol === "https:") {
        candidates.push(`http://${parsed.hostname}`);
        candidates.push(`http://www.${parentDomain}`);
      }
    }
  } catch {
    // URL parsing fallback
  }

  let lastError: any = null;
  for (const candidate of candidates) {
    try {
      const result = await doHeadRequest(candidate);
      return NextResponse.json({
        ...result,
        targetUrl: candidate,
        requestedUrl: targetUrl,
      });
    } catch (err: any) {
      lastError = err;
    }
  }

  console.error("All fetch candidates failed for:", targetUrl, "Last error:", lastError?.message);
  return NextResponse.json(
    { error: lastError?.message === "No Date header found" ? "서버에서 시간 헤더를 제공하지 않습니다." : "해당 서버에 연결할 수 없습니다. (도메인 주소를 확인해 주세요)" },
    { status: 500 }
  );
}
