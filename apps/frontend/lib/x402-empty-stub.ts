/**
 * Stub for the optional @x402/* peer deps of @coinbase/cdp-sdk (pulled in
 * transitively via wagmi's baseAccount connector). We never call the x402
 * payment-signing functions these back, so these stand-ins only need to
 * exist as named exports to satisfy module resolution/evaluation.
 * https://github.com/wevm/wagmi/issues/4906
 */
export class x402Client {}
export class UptoEvmScheme {}
export class ExactSvmScheme {}
export function toClientEvmSigner() {}
export function registerExactEvmScheme() {}
export function registerExactSvmScheme() {}

export default {};
