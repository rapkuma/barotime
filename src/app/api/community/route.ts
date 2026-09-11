import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper to get Korean Date string YYYY-MM-DD
function getKSTDateString(date = new Date()) {
  const kstOffset = 9 * 60; // UTC+9 in minutes
  const kstDate = new Date(date.getTime() + (kstOffset + date.getTimezoneOffset()) * 60000);
  return kstDate.toISOString().split("T")[0];
}

function getYesterdayKSTDateString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getKSTDateString(yesterday);
}

export async function GET(request: NextRequest) {
  try {
    const todayStr = getKSTDateString();
    const yesterdayStr = getYesterdayKSTDateString();

    // 1. Fetch Visitors (Today & Yesterday & Total)
    const { data: statsData } = await supabase
      .from("site_stats")
      .select("id, visit_count")
      .in("id", [`daily_${todayStr}`, `daily_${yesterdayStr}`, "total_visitors"]);

    let todayVisitors = 0;
    let yesterdayVisitors = 0;
    let totalVisitors = 0;

    statsData?.forEach((row) => {
      if (row.id === `daily_${todayStr}`) todayVisitors = Number(row.visit_count);
      if (row.id === `daily_${yesterdayStr}`) yesterdayVisitors = Number(row.visit_count);
      if (row.id === "total_visitors") totalVisitors = Number(row.visit_count);
    });

    // 2. Fetch Latest Cheers
    const { data: cheersData } = await supabase
      .from("cheers")
      .select("id, nickname, content, target_name, created_at")
      .order("id", { ascending: false })
      .limit(25);

    // 3. Fetch Active Sessions in the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: activeData } = await supabase
      .from("active_sessions")
      .select("target_name, target_url")
      .gte("last_active", fifteenMinutesAgo);

    // Group active counts by target_name
    const activeMap: Record<string, { count: number; url: string }> = {};
    let totalOnline = 0;

    activeData?.forEach((item) => {
      totalOnline++;
      if (!activeMap[item.target_name]) {
        activeMap[item.target_name] = { count: 0, url: item.target_url };
      }
      activeMap[item.target_name].count++;
    });

    const activeList = Object.entries(activeMap)
      .map(([name, info]) => ({
        name,
        count: info.count,
        url: info.url,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      stats: {
        today: todayVisitors,
        yesterday: yesterdayVisitors,
        total: totalVisitors,
        date: todayStr,
      },
      cheers: cheersData || [],
      active: {
        totalOnline: Math.max(totalOnline, 1),
        list: activeList,
      },
    });
  } catch (error: any) {
    console.error("Community GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. Visit Count Action
    if (action === "visit") {
      const todayStr = getKSTDateString();

      // Increment today's count
      const { data: todayRow } = await supabase
        .from("site_stats")
        .select("visit_count")
        .eq("id", `daily_${todayStr}`)
        .single();

      const newTodayCount = (Number(todayRow?.visit_count) || 0) + 1;
      await supabase.from("site_stats").upsert({
        id: `daily_${todayStr}`,
        visit_count: newTodayCount,
        updated_at: new Date().toISOString(),
      });

      // Increment total count
      const { data: totalRow } = await supabase
        .from("site_stats")
        .select("visit_count")
        .eq("id", "total_visitors")
        .single();

      const newTotalCount = (Number(totalRow?.visit_count) || 0) + 1;
      await supabase.from("site_stats").upsert({
        id: "total_visitors",
        visit_count: newTotalCount,
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, today: newTodayCount, total: newTotalCount });
    }

    // 2. Cheer Comment Action
    if (action === "cheer") {
      const { nickname, content, target_name } = body;
      if (!content || !content.trim()) {
        return NextResponse.json({ error: "내용을 입력해 주세요." }, { status: 400 });
      }

      const { data, error } = await supabase
        .from("cheers")
        .insert({
          nickname: (nickname || "익명").trim().slice(0, 20),
          content: content.trim().slice(0, 100),
          target_name: (target_name || "전체").trim().slice(0, 30),
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, cheer: data });
    }

    // 3. Ping Active Session Action
    if (action === "ping_active") {
      const { sessionId, targetName, targetUrl } = body;
      if (!sessionId) return NextResponse.json({ error: "No sessionId" }, { status: 400 });

      await supabase.from("active_sessions").upsert({
        id: sessionId,
        target_name: targetName || "바로 (BARO)",
        target_url: targetUrl || "https://barotime.com",
        last_active: new Date().toISOString(),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Community POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
