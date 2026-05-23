# Fonts

This folder is **intentionally empty** in the design-system handoff.

The user's original brief uploaded `wanted-sans-main.zip` and
`Pretendard-1.3.9.zip` but they were not present in the project filesystem
at build time. To self-host:

1. Drop the unzipped `.woff2` files here.
2. In `../colors_and_type.css`, replace the two `@import` statements at
   the top with `@font-face` declarations that point at these files.
   Example:

   ```css
   @font-face {
     font-family: 'Pretendard Variable';
     src: url('fonts/PretendardVariable.woff2') format('woff2-variations');
     font-weight: 45 920;
     font-display: swap;
   }
   ```

Until then, Pretendard and Wanted Sans are pulled from public jsdelivr
CDNs — safe for prototypes, not ideal for production (latency, CDN risk).

## Recommended sources

- Pretendard 1.3.9 — `https://github.com/orioncactus/pretendard`
- Wanted Sans 1.0.3 — `https://github.com/wanted-sans/wanted-sans`
