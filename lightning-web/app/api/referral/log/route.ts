import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/auth-options"
import { findReferrerIdByCode, saveReferralLog } from "@/repository/RefererRepository";

export async function POST(req: Request) {
  const validate = async (req: Request, body: any) => {
    if (!body.referralCode || !body.event) {
      return new Response(JSON.stringify({ message: "invalid body" }), {
        status: 400,
      });
    }

    return false;
  }

  const process = async (req: Request, body: any) => {
    const session = await getServerSession(authOptions);
    const memberId = session?.id ?? null;

    const { referralCode, event } = body;

    const referrerId = await findReferrerIdByCode(referralCode);

    if (!referrerId) {
      return new Response(JSON.stringify({ message: "Invalid referral code" }), {
        status: 400,
      });
    }

    await saveReferralLog(referrerId, memberId, event);

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  }

  try {
    const body = await req.json();
    const isInvalid = await validate(req, body);

    if (isInvalid) { return isInvalid; }
    else { return await process(req, body); }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}