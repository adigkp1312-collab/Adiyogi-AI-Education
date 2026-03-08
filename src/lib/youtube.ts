import type { ContentResource } from "@/types";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

interface YouTubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string };
      high: { url: string };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

interface YouTubeVideoDetails {
  id: string;
  contentDetails: { duration: string };
  statistics: { viewCount: string; likeCount: string };
}

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const h = match[1] ? `${match[1]}h ` : "";
  const m = match[2] ? `${match[2]}m ` : "";
  const s = match[3] ? `${match[3]}s` : "";
  return `${h}${m}${s}`.trim();
}

export async function searchYouTube(
  query: string,
  language: string = "en",
  maxResults: number = 5
): Promise<ContentResource[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YouTube API key not configured");

  const relevanceLanguage = language === "en" ? "en" : language;

  // Search for videos
  const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("q", `${query} tutorial lecture`);
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("maxResults", String(maxResults));
  searchUrl.searchParams.set("relevanceLanguage", relevanceLanguage);
  searchUrl.searchParams.set("videoDuration", "medium");
  searchUrl.searchParams.set("videoEmbeddable", "true");
  searchUrl.searchParams.set("order", "relevance");
  searchUrl.searchParams.set("key", apiKey);

  const searchRes = await fetch(searchUrl.toString());
  if (!searchRes.ok) {
    throw new Error(`YouTube search failed: ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  const items: YouTubeSearchResult[] = searchData.items || [];

  if (items.length === 0) return [];

  // Get video details (duration, view count)
  const videoIds = items.map((i) => i.id.videoId).join(",");
  const detailsUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
  detailsUrl.searchParams.set("part", "contentDetails,statistics");
  detailsUrl.searchParams.set("id", videoIds);
  detailsUrl.searchParams.set("key", apiKey);

  const detailsRes = await fetch(detailsUrl.toString());
  const detailsData = await detailsRes.json();
  const details: YouTubeVideoDetails[] = detailsData.items || [];

  const detailsMap = new Map(details.map((d) => [d.id, d]));

  return items.map((item): ContentResource => {
    const detail = detailsMap.get(item.id.videoId);
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      source: "youtube",
      type: "video",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.medium.url,
      duration: detail ? parseDuration(detail.contentDetails.duration) : undefined,
      viewCount: detail ? parseInt(detail.statistics.viewCount) : undefined,
      rating: detail
        ? Math.min(5, parseInt(detail.statistics.likeCount || "0") / 1000)
        : undefined,
    };
  });
}

// Static NPTEL course metadata for common CS/engineering topics
const NPTEL_COURSES: ContentResource[] = [
  {
    id: "nptel-dsa",
    title: "Data Structures and Algorithms - NPTEL",
    source: "nptel",
    type: "video",
    url: "https://nptel.ac.in/courses/106106127",
    rating: 4.1,
  },
];

export function searchNPTEL(query: string): ContentResource[] {
  const q = query.toLowerCase();
  return NPTEL_COURSES.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      q.includes("data structure") ||
      q.includes("algorithm") ||
      q.includes("machine learning") ||
      q.includes("python") ||
      q.includes("database") ||
      q.includes("network") ||
      q.includes("operating system") ||
      q.includes("deep learning") ||
      q.includes("web")
  ).slice(0, 3);
}
