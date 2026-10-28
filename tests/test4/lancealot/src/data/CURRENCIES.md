# Currency metadata

Codes/names/current or historical status: SIX ISO 4217 List One (2026-09-17) and List Three (2026-01-01), retrieved 2026-10-28. Current precision uses SIX minor units. List Three omits precision; historical precision uses Unicode CLDR currency fractions including its explicitly published DEFAULT rule, not a blanket guessed two-decimal rule. This is an explicit implementation policy; no exchange rates, cash rounding or conversion. Precious metals, testing/no-currency codes and entries without monetary precision are excluded. Preserve stored precision snapshots on existing invoices.

Sources:
- https://www.six-group.com/en/products-services/financial-information/market-reference-data/data-standards.html
- https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/supplemental/currencyData.json
- https://unicode.org/reports/tr35/tr35-numbers.html#Supplemental_Currency_Data

Currency updates require a reviewed migration and matching JSON changes; no live currency API is called by the app.
