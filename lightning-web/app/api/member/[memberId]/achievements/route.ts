import {
  addAchievementLog,
  findAchievementByMemberIdAndName,
} from "@/repository/AchievementRepository";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const achievementName = searchParams.get("name");

    if (!achievementName) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    // params 안에서 memberId 추출
    const { memberId } = await params;

    const achievement = await findAchievementByMemberIdAndName(
      memberId,
      achievementName
    );

    return NextResponse.json({ hasAchieved: !!achievement });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const body = await request.json();
    const achievementName = body.name;

    if (!achievementName) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    // params 안에서 memberId 추출
    const { memberId } = await params;

    const achievement = await addAchievementLog(memberId, achievementName);

    return NextResponse.json({ hasAchieved: !!achievement });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
