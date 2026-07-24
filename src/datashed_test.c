#include "../include/datashed.h"

#include <sqlite3.h>

#include <stdint.h>
#include <stdio.h>

#define CHECK(expr, msg)                  \
        do {                              \
                if (!(expr)) {            \
                        fprintf(stderr, "FAIL: %s\n", msg); \
                        goto fail;        \
                }                         \
        } while (0)

typedef struct tree_stats {
        size_t droplets;
        size_t files;
} TreeStats;

static DataId next_id = 1;

static DataId alloc_id(void) {
        return next_id++;
}

static void collect_droplet_stats(const DataDroplet *droplet, TreeStats *stats) {
        size_t i;

        stats->droplets += 1;
        stats->files += droplet->attached_files.len;

        for (i = 0; i < droplet->children.len; ++i) {
                collect_droplet_stats(droplet->children.items[i], stats);
        }
}

static TreeStats collect_shed_stats(const DataShed *shed) {
        TreeStats stats = {0, 0};
        size_t i;

        for (i = 0; i < shed->streams.len; ++i) {
                DataStream *stream = shed->streams.items[i];
                size_t j;
                for (j = 0; j < stream->droplets.len; ++j) {
                        collect_droplet_stats(stream->droplets.items[j], &stats);
                }
        }

        return stats;
}

static DataDroplet *find_droplet_recursive(DataDroplet *droplet, DataId id) {
        size_t i;

        if (droplet->id == id) {
                return droplet;
        }

        for (i = 0; i < droplet->children.len; ++i) {
                DataDroplet *found = find_droplet_recursive(droplet->children.items[i], id);
                if (found != NULL) {
                        return found;
                }
        }

        return NULL;
}

static DataDroplet *find_droplet_in_shed(DataShed *shed, DataId id) {
        size_t i;

        for (i = 0; i < shed->streams.len; ++i) {
                DataStream *stream = shed->streams.items[i];
                size_t j;
                for (j = 0; j < stream->droplets.len; ++j) {
                        DataDroplet *found = find_droplet_recursive(stream->droplets.items[j], id);
                        if (found != NULL) {
                                return found;
                        }
                }
        }

        return NULL;
}

static int attach_file(DataDroplet *owner, const char *name, const char *description, const char *path) {
        DataFile *file = data_file_create(alloc_id(), name, description, path);
        if (file == NULL) {
                return -1;
        }

        if (data_file_vec_push(&owner->attached_files, file) != 0) {
                data_file_destroy(file);
                return -1;
        }

        return 0;
}

static int attach_child(DataDroplet *parent, DataDroplet *child) {
        child->parent_id = parent->id;
        child->stream_id = parent->stream_id;
        if (data_droplet_vec_push(&parent->children, child) != 0) {
                return -1;
        }

        return 0;
}

static int attach_root(DataStream *stream, DataDroplet *root) {
        root->parent_id = 0;
        root->stream_id = stream->id;
        if (data_droplet_vec_push(&stream->droplets, root) != 0) {
                return -1;
        }

        return 0;
}

static int build_stress_fixture(DataShed *shed, DataId *out_link_id, DataId *out_target_id) {
        const size_t stream_count = 3;
        const size_t roots_per_stream = 40;
        const size_t children_per_root = 12;
        const size_t files_per_root = 4;
        size_t s;

        for (s = 0; s < stream_count; ++s) {
                char stream_title[64];
                DataStream *stream;
                size_t r;

                snprintf(stream_title, sizeof(stream_title), "stream-%zu", s);
                stream = data_stream_create(alloc_id(), stream_title, s == 1 ? NULL : "fixture stream");
                if (stream == NULL) {
                        return -1;
                }

                if (data_stream_vec_push(&shed->streams, stream) != 0) {
                        data_stream_destroy(stream);
                        return -1;
                }

                for (r = 0; r < roots_per_stream; ++r) {
                        char root_title[64];
                        DataDroplet *root;
                        size_t c;
                        size_t f;

                        snprintf(root_title, sizeof(root_title), "root-%zu-%zu", s, r);
                        root = data_droplet_create(alloc_id(), stream->id, 0, DATA, root_title, r % 3 == 0 ? NULL : "root");
                        if (root == NULL) {
                                return -1;
                        }

                        if (attach_root(stream, root) != 0) {
                                data_droplet_destroy(root);
                                return -1;
                        }

                        for (f = 0; f < files_per_root; ++f) {
                                char file_name[64];
                                char file_path[128];
                                snprintf(file_name, sizeof(file_name), "file-%zu-%zu-%zu", s, r, f);
                                snprintf(file_path, sizeof(file_path), "/tmp/%s.bin", file_name);
                                if (attach_file(root, file_name, f % 2 == 0 ? NULL : "payload", file_path) != 0) {
                                        return -1;
                                }
                        }

                        if (s == 0 && r == 0) {
                                for (f = 0; f < 32; ++f) {
                                        char file_name[64];
                                        snprintf(file_name, sizeof(file_name), "burst-file-%zu", f);
                                        if (attach_file(root, file_name, NULL, NULL) != 0) {
                                                return -1;
                                        }
                                }
                        }

                        for (c = 0; c < children_per_root; ++c) {
                                char child_title[64];
                                DataDroplet *child;
                                snprintf(child_title, sizeof(child_title), "child-%zu-%zu-%zu", s, r, c);
                                child = data_droplet_create(alloc_id(), stream->id, root->id, DATA, child_title, "child");
                                if (child == NULL) {
                                        return -1;
                                }

                                if (attach_child(root, child) != 0) {
                                        data_droplet_destroy(child);
                                        return -1;
                                }

                                if (c < 2 && attach_file(child, "child-file", NULL, "/tmp/child.bin") != 0) {
                                        return -1;
                                }
                        }
                }
        }

        {
                DataStream *stream0 = shed->streams.items[0];
                DataDroplet *target = data_droplet_create(alloc_id(), stream0->id, 0, DATA, "link-target", "target");
                DataDroplet *link = data_droplet_create(alloc_id(), stream0->id, 0, LINK, "link-node", "link");

                if (target == NULL || link == NULL) {
                        data_droplet_destroy(target);
                        data_droplet_destroy(link);
                        return -1;
                }

                if (attach_root(stream0, target) != 0 || attach_root(stream0, link) != 0) {
                        data_droplet_destroy(target);
                        data_droplet_destroy(link);
                        return -1;
                }

                link->link_target_id = target->id;
                link->link_target = target;

                *out_link_id = link->id;
                *out_target_id = target->id;
        }

        return 0;
}

int main(void) {
        DataShed original;
        DataShed loaded;
        TreeStats a;
        TreeStats b;
        DataId link_id = 0;
        DataId target_id = 0;
        sqlite3 *db = NULL;
        DataDroplet *loaded_link;
        DataDroplet *loaded_target;

        data_shed_init(&original);
        data_shed_init(&loaded);

        CHECK(build_stress_fixture(&original, &link_id, &target_id) == 0, "build fixture");
        CHECK(original.streams.len == 3, "stream count in fixture");
        CHECK(original.streams.items[0]->droplets.len > 8, "root droplet vector grew beyond initial capacity");
        CHECK(original.streams.items[0]->droplets.cap >= original.streams.items[0]->droplets.len, "droplet vector capacity valid");

        CHECK(sqlite3_open(":memory:", &db) == SQLITE_OK, "open sqlite memory db");
        CHECK(data_shed_sqlite_ensure_schema(db) == 0, "ensure schema");
        CHECK(data_shed_sqlite_save(db, &original) == 0, "save snapshot");
        CHECK(data_shed_sqlite_load(db, &loaded) == 0, "load snapshot");

        a = collect_shed_stats(&original);
        b = collect_shed_stats(&loaded);

        CHECK(a.droplets == b.droplets, "droplet counts match after round trip");
        CHECK(a.files == b.files, "file counts match after round trip");
        CHECK(loaded.streams.len == original.streams.len, "stream counts match after round trip");

        loaded_link = find_droplet_in_shed(&loaded, link_id);
        loaded_target = find_droplet_in_shed(&loaded, target_id);
        CHECK(loaded_link != NULL, "loaded link droplet exists");
        CHECK(loaded_target != NULL, "loaded target droplet exists");
        CHECK(loaded_link->type == LINK, "link droplet type retained");
        CHECK(loaded_link->link_target != NULL, "link target pointer resolved");
        CHECK(loaded_link->link_target->id == loaded_target->id, "link target id matches");

        printf("PASS: stress fixture round-trip complete\n");
        printf("PASS: streams=%zu droplets=%zu files=%zu\n", loaded.streams.len, b.droplets, b.files);

        sqlite3_close(db);
        data_shed_destroy(&loaded);
        data_shed_destroy(&original);
        return 0;

fail:
        if (db != NULL) {
                sqlite3_close(db);
        }

        data_shed_destroy(&loaded);
        data_shed_destroy(&original);
        return 1;
}
