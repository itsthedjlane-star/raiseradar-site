# RaiseRadar — Go-To-Market Strategy

*Companion to [`COMMERCIAL_AUDIT.md`](./COMMERCIAL_AUDIT.md). That document establishes where the value is; this one is the plan to capture it.*

---

## 1. Positioning

**Category:** funding-signal lead feed (not a sales-intelligence platform — don't fight ZoomInfo/Apollo; don't out-feature Fundz).

**Positioning statement:**

> For B2B teams that sell to startups, RaiseRadar delivers a weekly, compliance-clean list of US companies that just raised — filtered to your niche, with a named, reachable executive — the week the money lands, weeks before the press covers it.

**Three pillars, in order:**

1. **Timing** — Form D hits EDGAR 30–90 days before TechCrunch. "Reach them the week the money lands" stays the hero line.
2. **Provenance / compliance** — every row links to an official SEC filing. No scraping, no grey-area data. This is the line enterprise-adjacent buyers (banks, insurers, wealth managers) need to hear, and cheap competitors don't lead with it.
3. **Signal, not noise** — funds, SPVs, shell filings, and $100 raises are filtered out; only operating companies with real raises and a reachable exec. (This pillar is only honest once the fix-list in the audit ships — it is *the* differentiation against raw-data substitutes.)

**Against Fundz (the $29/mo incumbent):** don't compete as "cheaper data." Compete as (a) CSV/Sheet-native — drops straight into the buyer's existing outbound stack with zero platform to learn; (b) verticalized — a niche feed, not a firehose; (c) white-label/API — Fundz doesn't lead with resale rights.

## 2. ICP — who to sell to, in order

| Priority | ICP | Why they pay | Deal math |
|---|---|---|---|
| 1 | **Recruiting & staffing firms** (tech/exec search) | Funded company = imminent hiring; one placement = $20–50K fee | $299/mo is a rounding error |
| 2 | **B2B agencies & lead-gen shops** | Sell outbound *for* clients; natural white-label buyers | One agency = many end users; $499+ tier |
| 3 | **Fractional CFO / accounting / finance firms** | Post-raise companies immediately need finance ops | Retainers $3–10K/mo |
| 4 | **Commercial insurance & benefits brokers** | New capital → new hires → new policies | Multi-year commissions |
| 5 | **Wealth managers / private banks** | Founders and execs just got liquid or soon will | AUM economics |
| 6 | **MSPs / IT services, CRE & office brokers** | Funded startups buy infrastructure and space | Secondary; serve via filters, don't market to first |

Start with ICPs 1–3 only. Each maps cleanly to an industry/size filter of the existing feed, which means marketing pages and filtered sample CSVs per ICP are nearly free to produce.

## 3. Pricing (restructured)

Current $99 Starter sells an unfiltered CSV against Fundz's $29 platform — unwinnable. Restructure so the free tier does acquisition and paid tiers sell *filtering + enrichment*, which cheap substitutes don't have:

| Tier | Price | What it is |
|---|---|---|
| **Radar Free** | $0 | Weekly email, top 25 raises, no contacts. Builds the list; every send is a product demo. |
| **Feed** | $79/mo | Full filtered weekly CSV (junk removed), named exec + **verified email**, filing links. |
| **Feed Pro** | $199/mo | Everything above + custom niche/geo filters, Google Sheet sync, historical backfill. |
| **API / White-label** | $499+/mo | Resell under your brand, API access, custom sources. Sales-assisted. |

Rules: verified email is included in *every* paid tier (it is the product); annual = 2 months free; keep "first week free, no card" — it's the right offer and already on the page. If keeping current $99/$299 price points instead, they must include enrichment to survive.

## 4. Channels, ranked by expected ROI

1. **Dogfood cold email (do this first).** The target list for selling RaiseRadar *is* the RaiseRadar feed's buyer universe: recruiters, agencies, fractional CFO firms. Run 50–100 personalized emails/week: "Here are 5 companies in your niche that raised this week — want the full list every Monday?" The pitch *is* the product working. Cost ≈ $0; also generates testimonials and case-study material.
2. **Free weekly newsletter.** The single compounding asset. Move the site's primary CTA to the free tier (it already half-does this). Top 25 raises + one insight line. Upsell path: "your niche + exec emails → Feed." Later: sponsorships.
3. **LinkedIn founder-led content.** 2–3 posts/week: "Who raised this week" carousels, biggest under-the-radar raise, "this filing hit EDGAR 6 weeks before the press." Screenshots of the actual feed. This is where recruiters and agency owners live.
4. **Programmatic SEO.** Auto-generate weekly pages per state and industry from the same pipeline: `/raises/texas/`, `/raises/healthcare/`. Long-tail queries ("companies that raised money in Texas this week") have commercial intent and weak competition. Each page CTAs into the free newsletter.
5. **Marketplaces & communities.** Apify's marketplace proves demand for Form D data; list a limited free feed there and on Product Hunt / relevant Reddit & Slack communities (sales, recruiting, agency ops) with the free tier as the hook.
6. **Partnerships (month 3+).** Outbound-tools ecosystems (Clay templates, Instantly/Smartlead communities, Apollo marketplace): "RaiseRadar feed → Clay enrichment → sequenced outreach" tutorial content converts practitioners who already spend on outbound.

Explicitly *not* doing: paid ads (margin can't carry it pre-PMF), cold LinkedIn automation (undercuts the compliance positioning), and platform feature-race with Fundz.

## 5. Funnel

```
Programmatic SEO / LinkedIn / communities
        │
        ▼
Free weekly newsletter  (site CTA, real current-week sample on signup)
        │   every issue demos the product; niche-teaser rows with blurred emails
        ▼
Feed $79  ──────────────► Feed Pro $199  (filter/geo upsell after week 2)
        │
        ▼
API / White-label $499+  (sales-assisted; triggered by agency-domain signups)
```

Conversion assumptions to validate (instrument before spending on traffic): visitor→free signup ≥ 8%; free→paid ≥ 3–5% within 60 days; monthly churn ≤ 7% (churn is the metric to fear — leads products churn when reply rates disappoint, which is why enrichment and filtering are existential, not features).

## 6. 30 / 60 / 90-day plan

**Days 1–30 — turn the cash register on.**
- Ship the audit fix-list: Stripe links live, junk-filtered feed, verified-email enrichment, current-week lead magnet, domain email, privacy/terms/unsubscribe, analytics.
- Launch free newsletter tier; move site CTA to it.
- Start dogfood outbound: 50 emails/week to recruiters (ICP #1).
- **Goal: first 3 paying customers, 150 free subscribers.**

**Days 31–60 — prove one ICP.**
- Double down on whichever of ICP 1–3 converted; build one filtered landing page + sample CSV for it ("RaiseRadar for Recruiters").
- LinkedIn cadence 3×/week; publish first case study ("agency booked 4 meetings from one week's feed").
- Ship programmatic SEO pages (state × industry).
- **Goal: 10 paying customers (~$1–1.5K MRR), 500 free subscribers, churn measured.**

**Days 61–90 — scale what worked.**
- Second ICP page; Feed Pro upsell campaign to existing customers; first white-label conversation with an agency subscriber.
- Community/marketplace launches (Product Hunt, Apify).
- Decision gate: if free→paid < 2% or churn > 10%/mo, the problem is product (reply rates / data quality), not marketing — fix the feed before adding channels.
- **Goal: 20–25 paying customers (~$3K MRR), 1,500 free subscribers, one $499 white-label deal in pipeline.**

## 7. KPIs

| Metric | Target | Why it's the one to watch |
|---|---|---|
| Free subscribers | +300/mo by day 90 | Top of the entire funnel |
| Free → paid conversion | ≥ 3% / 60 days | Proves the feed's demo value |
| Monthly revenue churn | ≤ 7% | The kill-signal for data products |
| Customer reply rate on feed leads | anecdotal → surveyed | Leading indicator of churn |
| MRR | $1.5K (60d) → $3K (90d) | The scoreboard |
| Sellable-row yield of weekly feed | ≥ 85% | Product quality gate (audit found ~40–50% today) |

## 8. Biggest risks & mitigations

1. **Fundz undercuts on price with more features.** → Never sell raw data; sell niche + enrichment + workflow fit + resale rights. Stay CSV-native and simple.
2. **Contact enrichment quality disappoints → churn.** → Verify emails before shipping (bounce-checked); publish an accuracy promise ("<5% bounce or credit back").
3. **Single-person pipeline risk.** → Version the ETL in-repo; automate the Monday run end-to-end.
4. **Free EDGAR data invites DIY.** → The buyer isn't paying for data, they're paying to not spend Monday cleaning XML. Lean into "zero work for you" (already on the site).
5. **Deliverability/compliance blowback from customers spamming the leads.** → Ship a one-page "how to outreach compliantly" guide with every feed; it reinforces the compliance brand and reduces churn from burned lists.
