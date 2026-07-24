# datashed

In-memory tree model for streams, droplets, and attached files with SQLite snapshot sync.

## Build Tooling

This repo uses:
- Nix flake for a reproducible development shell
- xmake for build and run targets

Generic reusable vector helpers are in `include/cvec.h`.
Datashed compatibility wrapper remains in `include/datashed_vec.h`.

## Generic cvec.h Example

Minimal example for reuse in unrelated C projects:

```c
#include "cvec.h"

#include <stdio.h>

typedef struct int_vec {
	int *items;
	size_t len;
	size_t cap;
} IntVec;

int main(void) {
	IntVec v = {0};
	size_t i;

	for (i = 0; i < 100; ++i) {
		int x = (int)i;
		if (cvec_push_copy((void **)&v.items, &v.len, &v.cap, sizeof(v.items[0]), &x) != 0) {
			cvec_release((void **)&v.items, &v.len, &v.cap);
			return 1;
		}
	}

	printf("len=%zu cap=%zu last=%d\n", v.len, v.cap, v.items[v.len - 1]);
	cvec_release((void **)&v.items, &v.len, &v.cap);
	return 0;
}
```

Pointer-vector pattern (stores pointers, does not deep-free pointed objects):

```c
#include "cvec.h"

#include <stdlib.h>

typedef struct node {
	int id;
} Node;

typedef struct node_ptr_vec {
	Node **items;
	size_t len;
	size_t cap;
} NodePtrVec;

int main(void) {
	NodePtrVec v = {0};
	size_t i;

	for (i = 0; i < 16; ++i) {
		Node *n = malloc(sizeof(*n));
		if (n == NULL) {
			return 1;
		}

		n->id = (int)i;
		if (cvec_reserve_ptrs((void ***)&v.items, &v.cap, v.len + 1) != 0) {
			free(n);
			return 1;
		}

		v.items[v.len++] = n;
	}

	for (i = 0; i < v.len; ++i) {
		free(v.items[i]);
	}

	cvec_release((void **)&v.items, &v.len, &v.cap);
	return 0;
}
```

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
