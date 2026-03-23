import type { ContentResource } from "@/types";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const MAX_RESULTS_LIMIT = 25;

// Simple in-memory cache for YouTube results
const searchCache = new Map<string, { data: ContentResource[]; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const CACHE_MAX_SIZE = 1000;

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

  // Bound maxResults
  const boundedMax = Math.max(1, Math.min(MAX_RESULTS_LIMIT, maxResults));

  // Check cache
  const cacheKey = `${query}:${language}:${boundedMax}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const relevanceLanguage = language === "en" ? "en" : language;

  // Search for videos
  const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("q", `${query} tutorial lecture`);
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("maxResults", String(boundedMax));
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
  if (!detailsRes.ok) {
    // Return search results without details rather than failing
    return items.map((item): ContentResource => ({
      id: item.id.videoId,
      title: item.snippet.title,
      source: "youtube",
      type: "video",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails?.medium?.url,
    }));
  }

  const detailsData = await detailsRes.json();
  const details: YouTubeVideoDetails[] = detailsData.items || [];

  const detailsMap = new Map(details.map((d) => [d.id, d]));

  const results = items.map((item): ContentResource => {
    const detail = detailsMap.get(item.id.videoId);
    const likeCount = detail ? parseInt(detail.statistics.likeCount || "0") : 0;
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      source: "youtube",
      type: "video",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails?.medium?.url,
      duration: detail ? parseDuration(detail.contentDetails.duration) : undefined,
      viewCount: detail ? parseInt(detail.statistics.viewCount) || 0 : undefined,
      rating: detail && likeCount > 0
        ? Math.min(5, likeCount / 1000)
        : undefined,
    };
  });

  // Cache results — evict stale entries if cache is full
  if (searchCache.size >= CACHE_MAX_SIZE) {
    const now = Date.now();
    for (const [key, val] of searchCache) {
      if (now > val.expiresAt) searchCache.delete(key);
    }
    // If still full after evicting stale, delete oldest entry
    if (searchCache.size >= CACHE_MAX_SIZE) {
      const firstKey = searchCache.keys().next().value;
      if (firstKey) searchCache.delete(firstKey);
    }
  }
  searchCache.set(cacheKey, { data: results, expiresAt: Date.now() + CACHE_TTL_MS });

  return results;
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

// Keywords that map to each NPTEL course — only match if the course is relevant
const NPTEL_KEYWORDS: Record<string, string[]> = {
  "nptel-dsa": ["data structure", "algorithm", "sorting", "linked list", "binary tree", "graph", "dsa"],
};

export function searchNPTEL(query: string): ContentResource[] {
  const q = query.toLowerCase();
  return NPTEL_COURSES.filter((c) => {
    // Direct title match
    if (c.title.toLowerCase().includes(q) || q.includes(c.title.toLowerCase())) {
      return true;
    }
    // Keyword match — course must have relevant keywords
    if (!c.id) return false;
    const keywords = NPTEL_KEYWORDS[c.id];
    return keywords ? keywords.some((kw: string) => q.includes(kw)) : false;
  }).slice(0, 3);
}
