# OriginChain Smart Contracts

Cargo workspace containing the four Stylus contracts.

## Toolchain Setup

- Rust 1.91+ (`rustup update`)
- `rustup target add wasm32-unknown-unknown`
- **stylus-sdk must be v0.9.2 or later** — v0.8.4 fails to compile on Windows 
  (and likely any non-Stylus host) because `stylus-proc`/`stylus-sdk` declared 
  `alloy-primitives`'s `native-keccak` feature unconditionally rather than 
  gated to `target_arch = "wasm32"`, causing a native-host linker error 
  (`native_keccak256` unresolved). Fixed upstream in 0.9.2. Stick to `0.9.x` 
  (not `0.10.x`, which jumps to `alloy-primitives` 1.x — a bigger, 
  untested-by-us change).
- **cargo-stylus CLI must be pinned to v0.5.0 on Windows** — v0.10.8 fails to 
  compile natively on Windows due to an unconditional Unix-socket import in 
  its debug hook feature: `debug_hook.rs` imports 
  `std::os::unix::net::{UnixListener, UnixStream}`, which doesn't exist on 
  Windows. Install the pinned version instead:
  ```
  cargo install --force cargo-stylus --version 0.5.0
  ```
- `cargo-stylus-check` installs fine at latest on all platforms.

Reference: [stylus-sdk-rs#49](https://github.com/OffchainLabs/stylus-sdk-rs/issues/49) — Windows isn't officially supported by the Stylus toolchain; native compilation works with the version pins above, but WSL2 remains the OffchainLabs-recommended fallback if further issues arise.

## Known Issues

- **`cargo build`/`cargo build --release` currently panics** with 
  `error[E0080]: evaluation panicked: BYTES must be equal to Self::BYTES` 
  in `stylus-sdk-0.9.2/src/storage/traits.rs:305`, calling `ruint`'s 
  `to_be_bytes::<32>()`. `cargo check` is unaffected (skips codegen). This 
  blocks real builds/deployment but not current skeleton-stage development. 
  Needs resolution before Phase 4 (Asset Registration implementation) — 
  either an upstream fix, or evaluating the `stylus-sdk` 0.10.x / 
  `alloy-primitives` 1.x jump.