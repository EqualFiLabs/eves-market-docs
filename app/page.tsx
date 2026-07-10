import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { TestnetBanner } from "@/components/testnet-banner";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
};

const surfaces = [
  {
    title: "Orderbook markets",
    body: "Binary and multi-outcome CTF markets with YES and NO positions traded against the market collateral.",
    href: "/docs/markets/orderbook-markets",
  },
  {
    title: "Curve CLOB",
    body: "Maker liquidity as flat orders or time-aware price schedules, with slippage-protected fills.",
    href: "/docs/markets/curve-clob",
  },
  {
    title: "Combinatorial positions",
    body: "Native binary and combo positions that express multi-leg scenarios as one decomposable asset.",
    href: "/docs/markets/combinatorial-positions",
  },
  {
    title: "Parimutuel markets",
    body: "Pooled YES/NO markets with weighted shares and early-conviction epoch multipliers.",
    href: "/docs/markets/parimutuel",
  },
  {
    title: "Spot books",
    body: "Standalone ERC20 base and quote books for an onchain DEX-style trading surface.",
    href: "/docs/markets/spot-books",
  },
  {
    title: "Optimistic resolution",
    body: "Creator settlement, bonded disputes, resolver jury escalation, and final redemption paths.",
    href: "/docs/resolution/optimistic-resolution",
  },
  {
    title: "Collateral layer",
    body: "eveUSDC as base collateral, plus the optional EtUSD pairing pool and senior capital routing.",
    href: "/docs/collateral/eveusdc",
  },
  {
    title: "Builder reference",
    body: "The diamond's ABI surfaces, integration rules, and read models for apps and indexers.",
    href: "/docs/reference/builder-reference",
  },
];

const personas = [
  {
    title: "Traders",
    body: "Start with orderbook and parimutuel markets, eveUSDC collateral, portal funding, and settlement.",
    links: [
      { label: "Orderbook markets", href: "/docs/markets/orderbook-markets" },
      { label: "Parimutuel", href: "/docs/markets/parimutuel" },
      { label: "Portal funding", href: "/docs/reference/portal-funding" },
    ],
  },
  {
    title: "Market makers",
    body: "Read the Curve CLOB, combinatorial positions, spot books, delayed orders, and fee configuration.",
    links: [
      { label: "Curve CLOB", href: "/docs/markets/curve-clob" },
      { label: "Combo positions", href: "/docs/markets/combinatorial-positions" },
      { label: "Settlement and fees", href: "/docs/resolution/settlement-and-fees" },
    ],
  },
  {
    title: "Creators",
    body: "Read market creation, market groups, collateral profiles, scheduling, and optimistic resolution.",
    links: [
      { label: "Market creation", href: "/docs/markets/creation" },
      { label: "Collateral profiles", href: "/docs/collateral/collateral-profiles" },
      { label: "Resolution", href: "/docs/resolution/optimistic-resolution" },
    ],
  },
  {
    title: "Builders & indexers",
    body: "Read the builder reference, indexing guide, deployment snapshot, and the position token model.",
    links: [
      { label: "Builder reference", href: "/docs/reference/builder-reference" },
      { label: "Indexing", href: "/docs/reference/indexing" },
      { label: "Deployment", href: "/docs/reference/base-sepolia-deployment" },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="docs-app">
      <a className="skip-link" href="#landing-content">
        Skip to content
      </a>
      <TestnetBanner />
      <SiteHeader />

      <main className="landing" id="landing-content">
        <section className="landing-hero">
          <div className="crumbs">
            <span className="crumb-here">protocol docs</span>
          </div>
          <h1>Onchain prediction markets, several trading surfaces, one diamond.</h1>
          <p className="lede">
            Eves Market is a prediction market protocol built around curve order books, native and CTF combo
            positions, parimutuel pools, parlay tickets, optimistic resolution, and configurable collateral.
          </p>
          <div className="landing-actions">
            <Link className="cta" href="/docs/introduction">
              Read the introduction
            </Link>
            <Link className="cta-secondary" href="/docs/reference/builder-reference">
              Builder reference
            </Link>
          </div>
        </section>

        <section className="landing-section">
          <h2>Trading surfaces</h2>
          <div className="card-grid">
            {surfaces.map((surface) => (
              <Link className="landing-card" href={surface.href} key={surface.href}>
                <div className="landing-card-title">{surface.title}</div>
                <p>{surface.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <h2>Choose your path</h2>
          <div className="card-grid persona-grid">
            {personas.map((persona) => (
              <div className="landing-card persona-card" key={persona.title}>
                <div className="landing-card-title">{persona.title}</div>
                <p>{persona.body}</p>
                <div className="persona-links">
                  {persona.links.map((link) => (
                    <Link href={link.href} key={link.href}>
                      {link.label} →
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="docs-footer">
        <div className="docs-footer-inner">© EqualFi Labs. All rights reserved.</div>
      </footer>
    </div>
  );
}
