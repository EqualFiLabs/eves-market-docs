// Set NEXT_PUBLIC_SITE_URL at build time once the production domain is final;
// the default only affects absolute URLs in sitemap/OpenGraph output.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://docs.eves.market";

export const SITE_NAME = "Eves Market Protocol Docs";

export const SITE_DESCRIPTION =
  "Public documentation for Eves Market prediction markets, collateral, resolution, settlement, and integrations.";

// Set NEXT_PUBLIC_APP_URL at build time once the app domain is final.
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://eves.market";
