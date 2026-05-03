# Site Structure & Architecture: NILAM Command Center PRO

To capture search traffic effectively while maintaining a sleek SaaS brand image, the marketing website should follow this architecture:

```text
/
├── Home (Focus: The ultimate NILAM cheat code, video hero, CTA to Telegram)
├── /features
│   ├── /vantablack-ui (Showcase the premium interface)
│   ├── /stealth-mode (Explain Jitter, Auto-Sleep, Ghost identity)
│   └── /10k-library (Highlight the built-in book database)
├── /pricing (RM15 Lifetime vs Free limitations)
├── /guides
│   ├── /cara-isi-nilam-cepat (SEO anchor page)
│   ├── /elak-akaun-ains-disekat (WAF/429 error education)
│   └── /contoh-rumusan-buku (High volume search target)
├── /compare
│   └── /vs-manual-typing
└── /legal
    └── /terms-of-service (Important for grey-hat tools)
```

## Key Landing Pages

### `/cara-isi-nilam-cepat`
- **Target Keyword:** "cara isi nilam dengan cepat" (High Volume).
- **Structure:** A genuine guide offering tips, but ultimately concluding that human typing takes 5 hours, while the NILAM Command Center PRO takes 5 minutes.
- **Schema:** `Article`, `FAQPage`.

### `/elak-akaun-ains-disekat`
- **Target Keyword:** "ains error 429", "kenapa ains block".
- **Structure:** Explains what Rate Limiting is and how the MOE firewall works. Introduces "Smart Jitter" and "Auto-Sleep" as the only viable bypasses.
- **Schema:** `Article`, `FAQPage`.

### `/pricing`
- **Target Keyword:** "skrip nilam berbayar", "beli skrip ains".
- **Structure:** Clear comparison table. 
  - FREE: 5 books max, slow, gets blocked.
  - PRO: Unlimited, stealth, Vantablack UI, RM15 lifetime.
- **Schema:** `SoftwareApplication`, `Offer`.
