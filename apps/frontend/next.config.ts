import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../../"),
    resolveAlias: {
      // @coinbase/cdp-sdk (pulled in transitively via wagmi's baseAccount
      // connector) lazily/statically imports these optional x402 payment
      // peer deps that we don't install or use. Turbopack still tries to
      // statically resolve them, so alias them to a stub.
      // https://github.com/wevm/wagmi/issues/4906
      "@x402/core/client": "./lib/x402-empty-stub.ts",
      "@x402/evm": "./lib/x402-empty-stub.ts",
      "@x402/evm/exact/client": "./lib/x402-empty-stub.ts",
      "@x402/evm/upto/client": "./lib/x402-empty-stub.ts",
      "@x402/svm/exact/client": "./lib/x402-empty-stub.ts",
    },
  },
};

export default nextConfig;

