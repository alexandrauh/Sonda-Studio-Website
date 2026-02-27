export const MANAGEMENT_BASE = `https://mapi.storyblok.com/v1/spaces/290135578248163`;
export const CDN_BASE = 'https://api.storyblok.com/v2/cdn';
export const MANAGEMENT_TOKEN = "QaQFtIIOTBHc0ZnZi1QIVgtt-138569498116790-kstd2bdSsBh2c9XHGosu";
export const PUBLIC_TOKEN = "Yexn5T5O42nspXazkIspoQtt";
export const SPACES_BASE = 'https://mapi.storyblok.com/v1/spaces';

export function getHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
}

export function buildURL(base: string, path: string) {
  return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

export function toQuery(params: Record<string, any>) {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join("&");
  return q ? `?${q}` : "";
}