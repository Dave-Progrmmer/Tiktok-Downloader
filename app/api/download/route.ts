import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

interface TikTokApiResponse {
  data?: {
    play?: string;
  };
  status?: string;
  msg?: string;
}

export async function POST(req: Request) {
  try {
    const { url }: { url: string } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "TikTok URL is required" }, { status: 400 });
    }

    const options = {
      method: "GET",
      url: "https://tiktok-video-no-watermark2.p.rapidapi.com/",
      params: { url },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY as string,
        "x-rapidapi-host": "tiktok-video-no-watermark2.p.rapidapi.com",
      },
    };

    const response = await axios.request<TikTokApiResponse>(options);

    // Log response for debugging
    console.log("API response:", response.data);

    const videoUrl = response.data?.data?.play;

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Could not fetch video", details: response.data },
        { status: 400 }
      );
    }

    return NextResponse.json({ downloadUrl: videoUrl });
  } catch (error: unknown) {
    let message = "Unknown error";

    if (axios.isAxiosError(error)) {
      message = `Axios error: ${error.response?.status} ${error.response?.statusText}`;
      console.error("Axios error:", error.response?.data);
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: "Server error", details: message }, { status: 500 });
  }
}
