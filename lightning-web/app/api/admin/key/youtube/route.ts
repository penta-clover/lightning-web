export function GET() {
  const apiKeys = process.env.YOUTUBE_API_KEYS?.split(",").map((key, index) => {
    return { name: `${index + 1}번 키`, value: key };
  });

  return new Response(JSON.stringify(apiKeys), { status: 200 });
}
