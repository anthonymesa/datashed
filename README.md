# datashed

In-memory tree model for streams, droplets, and attached files with SQLite snapshot sync.

## Build Tooling

This repo uses:
- Nix flake for a reproducible development shell
- xmake for build and run targets

## Stress and Round-Trip Test (Step 3)

Test file: `src/datashed_test.c`

What it verifies:
- vector-like auto-growth beyond initial capacity
- large nested tree creation
- nullable text fields
- LINK droplet target rehydration after save/load
- aggregate droplet/file counts preserved after SQLite round trip

Run from repository root:

```sh
nix develop path:$PWD -c xmake f -m release
nix develop path:$PWD -c xmake -v
nix develop path:$PWD -c xmake run datashed_test
```

Expected output:

```text
PASS: stress fixture round-trip complete
PASS: streams=3 droplets=<count> files=<count>
```
