# RaiseRadar — Commercial Audit

*Audit date: July 2026. Scope: everything in this repository (`index.html`, `sample.csv`, `README.md`) plus the competitive landscape for SEC Form D–sourced lead products.*

---

## 1. What the business is

RaiseRadar sells a **weekly list of US companies that just closed a private funding round**, sourced from SEC EDGAR Form D filings. Each record: company, city/state, industry, amount raised, a named executive, and the filing URL. Offered at three tiers — Starter $99/mo (full weekly CSV), Pro $299/mo (niche/geo filtering + Sheets delivery), API/White-label $499+/mo.

The underlying insight is commercially sound and well-established: **a Form D filing is a buying signal.** The company just took in capital and is about to spend it on hiring, tools, and services — and the filing often lands 30–90 days before any press coverage. The compliance story (100% official public records, provenance link on every row, no scraping) is genuinely differentiated messaging.

## 2. Asset inventory — what actually exists

| Asset | State |
|---|---|
| Landing page (`index.html`) | Complete, well-designed, static single page. Strong copy and visual identity. |
| Email capture | Live via Formspree (`formspree.io/f/mnjreqkb`). |
| Lead magnet | `sample.csv` auto-downloads on signup — but it is a **static file**, not the actual current week's feed. |
| Payments | **Not live.** All three `STRIPE_LINKS` values are empty strings; every pricing button falls back to email capture. The business cannot take a dollar of revenue today. |
| Data pipeline | **Not in the repo.** Whatever produces the weekly CSV is unversioned and invisible — a single-person dependency and the actual core asset of the business. |
| Domain / brand email | Contact is a personal Gmail address (`app.foremanharry@gmail.com`) — a trust problem at a $299/mo price point. |
| Legal | No privacy policy, no terms, no unsubscribe mechanism described. Required for CAN-SPAM compliance on a commercial email product, and by Stripe/Formspree norms. |
| Analytics | None (no GA/Plausible/anything). The funnel is unmeasurable. |

**Bottom line: this is a well-executed storefront with the cash register unplugged.** The gap between "site live" and "business live" is Stripe links, a real weekly delivery loop, and legal boilerplate — days of work, not months.

## 3. Data quality audit (the product itself)

The sample CSV (25 rows) is the product on display, and it reveals the core product problem. Row-by-row:

- **~10 rows are genuinely sellable leads** — operating companies with a named exec and a meaningful raise (Star Catcher $65M, Piston Technologies $15M, Dynamic Creatures $6M, Rely Intelligence $4.5M, etc.).
- **~10 rows are noise a buyer would churn over:** investment funds and SPVs (Heirloom UK Legal Funding SPV, Kydra Capital Fund I, Institutional Drilling Fund III, VALKYRIE III series LLC), single-asset real-estate LLCs, and filings of **$100** (two rows), $14.5K, and $50K. Nobody selling B2B services wants "D & H Fire Protection raised $100."
- **Data hygiene issues:** two rows have `N/A <entity name>` in the exec field, one has an LLC name where a person should be ("Praxis Racquet Group, LLC ."), casing is inconsistent (MARC THEERMANN), and one row is a **Cayman Islands entity** (state "E9") on a product marketed as "US companies."
- **The biggest gap: "exec contact" is a name, not a contact.** The hero promises "Reach them the week the money lands," but there is no email, phone, or LinkedIn URL. Competitors at lower price points include verified contact info. This is the #1 value gap and the #1 fix.

Estimated sellable yield of the raw feed: **40–50%**. Filtering and enrichment are where all the margin lives.

## 4. Competitive landscape

The raw data is free (EDGAR publishes Form Ds publicly, with RSS). The moat can never be the data — only curation, enrichment, filtering, and workflow. The field is already occupied:

| Competitor | Offer | Price | Threat |
|---|---|---|---|
| **Fundz** | Real-time Form D signals, alerts, contact info, AI lead scoring, buyer-intent scores | **from $29/mo** (Pro $99/mo) | **High** — more product for less money than RaiseRadar Starter |
| Form D Tracker | Form D filings as sales triggers, real-time alerts | comparable | Medium |
| FlareSight | 120,000+ funded-startup Form D database, ingests filings within hours | n/a | Medium |
| Apify scrapers | DIY Form D scrapers on a marketplace | ~$ pennies/run | Medium — caps the price of *unenriched* data |
| Growth List | Curated funded-SaaS lists **with verified contacts** | list pricing | Medium — proves buyers pay for enrichment |
| Crunchbase / Harmonic / ZoomInfo / Apollo | Full sales-intelligence platforms; Apollo from $49/mo | $49–enterprise | Low-medium — different weight class, but anchors price expectations |

**Implication:** a $99/mo *unfiltered, unenriched* CSV is not viable against Fundz at $29. The current Starter tier as described is priced ~3x above a stronger substitute. But a **filtered, enriched, verticalized** feed — "funded healthcare companies in Texas, with verified exec email, every Monday" — has no direct cheap substitute, and the $99–299 range becomes defensible there.

## 5. Where the commercial value actually is

Ranked by realism:

1. **Verticalized, enriched lead feeds (core).** Value scales with the buyer's deal size. Best-fit buyers are sellers whose contract value justifies $99–299/mo for even 1–2 conversations: recruiting/staffing firms, B2B marketing agencies, fractional CFO/finance firms, commercial banks, commercial insurance & benefits brokers, wealth managers (founders/execs post-raise), office/CRE brokers, MSPs/IT services.
2. **White-label / API resell ($499+ tier).** Genuinely differentiated — none of the cheap competitors lead with "resell under your brand." Agencies and lead-gen shops are natural buyers and each one is worth many end-customers.
3. **Free newsletter as an audience asset.** A free weekly "top 25 raises" email is a compounding asset (sponsorships, upsell pool) and the cheapest acquisition channel available.
4. **Programmatic SEO surface.** Every week × every state × every industry is a page ("companies that raised money in Florida this week"). Nearly free to generate from data already in hand; competitors are not doing this well.

**Unit economics:** input data is free, marginal cost per subscriber ≈ $0 (plus pennies for email enrichment API calls). Gross margin 90%+. The business dogfoods its own product for customer acquisition — the target list for selling RaiseRadar *is* RaiseRadar's own feed. This is a genuinely attractive micro-SaaS / data-product profile: modest TAM, but fast path to $5–15K MRR with near-zero fixed costs.

**Realistic revenue framing** (not a hockey stick): 10 paying customers ≈ $1–1.5K MRR is achievable within ~90 days of the fix-list below; 50–75 customers across tiers ≈ $8–15K MRR within 12 months *if* contact enrichment ships. Without enrichment, expect Fundz-driven churn and a ceiling near $1–2K MRR.

## 6. Critical fix list (blocking revenue, in order)

1. **Wire Stripe payment links** — the business literally cannot transact.
2. **Ship contact enrichment** (email pattern inference + verification API, LinkedIn URL). This is the promise the hero already makes.
3. **Filter the feed**: exclude funds/SPVs/pooled vehicles, raises under a floor (e.g. $500K), non-US entities; normalize name casing; drop `N/A` exec rows from the paid feed.
4. **Make the lead magnet real** — the auto-downloaded CSV must be *this week's* list, or the first touch proves the product is stale.
5. **Trust package**: custom-domain email, privacy policy, terms, unsubscribe footer (CAN-SPAM).
6. **Analytics** (Plausible or GA4) so signup→paid conversion is measurable.
7. **Version the pipeline** — get the scraper/ETL into this repo (or a sibling); it is the company.
8. Copy consistency: hero says "1,300+ raises/week," table says "+1,000 more" — pick one number and use it everywhere.

## 7. Verdict

**The concept is commercially valid, the storefront is good, and the economics are attractive — but the product on display is undifferentiated against a $29/mo incumbent, and the checkout is off.** The path to real commercial value is narrow and specific: *filter + enrich + verticalize, wire payments, and dogfood the feed for acquisition.* The full go-to-market plan is in [`GTM_STRATEGY.md`](./GTM_STRATEGY.md).
