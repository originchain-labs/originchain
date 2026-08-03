This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Known Issues / Pinned Versions

- **wagmi must stay on v2.x** — RainbowKit 2.x only supports wagmi ^2.9.0. 
  wagmi v3 causes wallet connection to hang indefinitely on "Opening 
  MetaMask... Confirm connection in the extension" with no popup and no 
  error thrown — a silent failure that's easy to lose hours to. See 
  [rainbow-me/rainbowkit#2575](https://github.com/rainbow-me/rainbowkit/discussions/2575).
- **Turbopack requires a `resolveAlias` workaround** (see `next.config.ts`) 
  for optional `@x402/*` peer dependencies pulled in transitively by 
  wagmi's Base Account connector — Turbopack tries to statically resolve 
  them even though they're correctly not installed. See `lib/x402-empty-stub.ts` 
  and [wevm/wagmi#4906](https://github.com/wevm/wagmi/issues/4906).