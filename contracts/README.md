# OriginChain Smart Contracts

Cargo workspace containing the four Stylus contracts.

## Toolchain Setup

- Rust 1.91+ (`rustup update`)
- `rustup target add wasm32-unknown-unknown`
- **stylus-sdk must be v0.9.2 or later** — v0.8.4 fails to compile on Windows 
  (and likely any non-Stylus host) because `stylus-proc`/`stylus-sdk` declared 
  `alloy-primitives`'s `native-keccak` feature unconditionally rather than 
  gated to `target_arch = "wasm32"`, causing a native-host linker error 
  (`native_keccak256` unresolved). Fixed upstream in 0.9.2.
- **stylus-sdk is now pinned to `0.10.8`** (bumped from `0.9.2` — see Known
  Issues below), which brings `alloy-primitives`/`alloy-sol-types` `1.x`
  (`1.6.1` as currently resolved) as a direct dependency requirement. If you
  add `sol_storage!`/`sol!` usage to a contract, declare `alloy-primitives`
  and `alloy-sol-types` as direct dependencies (version `"1.5.7"` or
  whatever `stylus-sdk`'s own `Cargo.toml` requires at the time) — they are
  not automatically available via `stylus_sdk::alloy_primitives` re-exports
  when used unqualified in contract source.
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

- **~~`cargo build`/`cargo test` const-eval panic (`error[E0080]: BYTES must
  be equal to Self::BYTES`) and a `stylus-test`/`trybuild` serde version
  deadlock blocking `cargo test`~~ — RESOLVED** by migrating from
  `stylus-sdk 0.9.2` to `0.10.8` (and `alloy-primitives`/`alloy-sol-types`
  from `0.8.20` to `1.x`, currently resolving to `1.6.1`) workspace-wide.
  Both bugs were specific to the `0.9.2`-era dependency tree (a `ruint`
  const-eval issue in `Storage::set_uint`, and an exact `serde = "=1.0.197"`
  pin in `stylus-test` conflicting with `stylus-proc`'s `trybuild`
  dependency) — neither reproduces on `0.10.8`. See git history on this file
  for the full 0.9.2 root-cause writeup if it's ever needed again (e.g. if a
  future downgrade is considered).
- Migrating to `0.10.x` is a real API break, not a drop-in bump: the
  `stylus_sdk::block`/`stylus_sdk::msg` free functions and the standalone
  `log(vm, event)` helper are gone, replaced by methods on `self.vm()`
  (`msg_sender()`, `block_timestamp()`, `.log(event)` — see
  `creator-registry/src/lib.rs`). `alloy-primitives`/`alloy-sol-types` must
  now be declared as direct dependencies of any contract using
  `sol_storage!`/`sol!` (previously only `stylus-sdk` was declared, relying
  on its re-exports, which doesn't actually resolve at the macro-expansion
  level).