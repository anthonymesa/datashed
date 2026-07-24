#include "../include/datashed_persist.h"

#include <sqlite3.h>
#include <stdlib.h>

typedef struct stream_index_entry {
        DataId id;
        DataStream *stream;
} StreamIndexEntry;

typedef struct droplet_index_entry {
        DataId id;
        DataDroplet *droplet;
} DropletIndexEntry;

typedef struct droplet_attach_entry {
        DataDroplet *droplet;
        DataId stream_id;
        DataId parent_id;
} DropletAttachEntry;

static int exec_sql(sqlite3 *db, const char *sql) {
        return sqlite3_exec(db, sql, NULL, NULL, NULL) == SQLITE_OK ? 0 : -1;
}

static int bind_text_or_null(sqlite3_stmt *stmt, int idx, const char *text) {
        if (text == NULL) {
                return sqlite3_bind_null(stmt, idx) == SQLITE_OK ? 0 : -1;
        }

        return sqlite3_bind_text(stmt, idx, text, -1, SQLITE_TRANSIENT) == SQLITE_OK ? 0 : -1;
}

static int append_stream_index(StreamIndexEntry **items, size_t *len, size_t *cap, DataId id, DataStream *stream) {
        if (datashed_reserve_items((void **)items, cap, *len + 1, sizeof(StreamIndexEntry)) != 0) {
                return -1;
        }

        (*items)[*len].id = id;
        (*items)[*len].stream = stream;
        *len += 1;
        return 0;
}

static int append_droplet_index(DropletIndexEntry **items, size_t *len, size_t *cap, DataId id, DataDroplet *droplet) {
        if (datashed_reserve_items((void **)items, cap, *len + 1, sizeof(DropletIndexEntry)) != 0) {
                return -1;
        }

        (*items)[*len].id = id;
        (*items)[*len].droplet = droplet;
        *len += 1;
        return 0;
}

static int append_droplet_attach(
        DropletAttachEntry **items,
        size_t *len,
        size_t *cap,
        DataDroplet *droplet,
        DataId stream_id,
        DataId parent_id
) {
        if (datashed_reserve_items((void **)items, cap, *len + 1, sizeof(DropletAttachEntry)) != 0) {
                return -1;
        }

        (*items)[*len].droplet = droplet;
        (*items)[*len].stream_id = stream_id;
        (*items)[*len].parent_id = parent_id;
        *len += 1;
        return 0;
}

static DataStream *find_stream_by_id(const StreamIndexEntry *items, size_t len, DataId id) {
        size_t i;

        for (i = 0; i < len; ++i) {
                if (items[i].id == id) {
                        return items[i].stream;
                }
        }

        return NULL;
}

static DataDroplet *find_droplet_by_id(const DropletIndexEntry *items, size_t len, DataId id) {
        size_t i;

        for (i = 0; i < len; ++i) {
                if (items[i].id == id) {
                        return items[i].droplet;
                }
        }

        return NULL;
}

static int insert_file_row(sqlite3_stmt *stmt, DataId droplet_id, const DataFile *file) {
        sqlite3_reset(stmt);
        sqlite3_clear_bindings(stmt);

        if (sqlite3_bind_int64(stmt, 1, (sqlite3_int64)file->id) != SQLITE_OK ||
            sqlite3_bind_int64(stmt, 2, (sqlite3_int64)droplet_id) != SQLITE_OK ||
            bind_text_or_null(stmt, 3, file->name) != 0 ||
            bind_text_or_null(stmt, 4, file->description) != 0 ||
            bind_text_or_null(stmt, 5, file->path) != 0) {
                return -1;
        }

        return sqlite3_step(stmt) == SQLITE_DONE ? 0 : -1;
}

static int save_droplet_tree(sqlite3_stmt *droplet_stmt, sqlite3_stmt *file_stmt, const DataDroplet *droplet) {
        size_t i;

        sqlite3_reset(droplet_stmt);
        sqlite3_clear_bindings(droplet_stmt);

        if (sqlite3_bind_int64(droplet_stmt, 1, (sqlite3_int64)droplet->id) != SQLITE_OK ||
            sqlite3_bind_int64(droplet_stmt, 2, (sqlite3_int64)droplet->stream_id) != SQLITE_OK ||
            sqlite3_bind_int64(droplet_stmt, 3, (sqlite3_int64)droplet->parent_id) != SQLITE_OK ||
            sqlite3_bind_int(droplet_stmt, 4, (int)droplet->type) != SQLITE_OK ||
            bind_text_or_null(droplet_stmt, 5, droplet->title) != 0 ||
            bind_text_or_null(droplet_stmt, 6, droplet->description) != 0 ||
            sqlite3_bind_int(droplet_stmt, 7, droplet->completion_status) != SQLITE_OK ||
            sqlite3_bind_int64(droplet_stmt, 8, (sqlite3_int64)droplet->link_target_id) != SQLITE_OK) {
                return -1;
        }

        if (sqlite3_step(droplet_stmt) != SQLITE_DONE) {
                return -1;
        }

        for (i = 0; i < droplet->attached_files.len; ++i) {
                if (insert_file_row(file_stmt, droplet->id, droplet->attached_files.items[i]) != 0) {
                        return -1;
                }
        }

        for (i = 0; i < droplet->children.len; ++i) {
                if (save_droplet_tree(droplet_stmt, file_stmt, droplet->children.items[i]) != 0) {
                        return -1;
                }
        }

        return 0;
}

int datashed_persist_ensure_schema(sqlite3 *db) {
        static const char *schema_sql =
                "PRAGMA foreign_keys = ON;"
                "CREATE TABLE IF NOT EXISTS streams ("
                "  id INTEGER PRIMARY KEY,"
                "  title TEXT,"
                "  description TEXT"
                ");"
                "CREATE TABLE IF NOT EXISTS droplets ("
                "  id INTEGER PRIMARY KEY,"
                "  stream_id INTEGER NOT NULL,"
                "  parent_id INTEGER NOT NULL DEFAULT 0,"
                "  type INTEGER NOT NULL,"
                "  title TEXT,"
                "  description TEXT,"
                "  completion_status INTEGER NOT NULL DEFAULT 0,"
                "  link_target_id INTEGER NOT NULL DEFAULT 0,"
                "  FOREIGN KEY(stream_id) REFERENCES streams(id) ON DELETE CASCADE"
                ");"
                "CREATE INDEX IF NOT EXISTS idx_droplets_stream_id ON droplets(stream_id);"
                "CREATE INDEX IF NOT EXISTS idx_droplets_parent_id ON droplets(parent_id);"
                "CREATE TABLE IF NOT EXISTS files ("
                "  id INTEGER PRIMARY KEY,"
                "  droplet_id INTEGER NOT NULL,"
                "  name TEXT,"
                "  description TEXT,"
                "  path TEXT,"
                "  FOREIGN KEY(droplet_id) REFERENCES droplets(id) ON DELETE CASCADE"
                ");"
                "CREATE INDEX IF NOT EXISTS idx_files_droplet_id ON files(droplet_id);";

        return exec_sql(db, schema_sql);
}

int datashed_persist_save(sqlite3 *db, const DataShed *shed) {
        sqlite3_stmt *stream_stmt = NULL;
        sqlite3_stmt *droplet_stmt = NULL;
        sqlite3_stmt *file_stmt = NULL;
        size_t i;
        int rc = -1;

        if (db == NULL || shed == NULL) {
                return -1;
        }

        if (datashed_persist_ensure_schema(db) != 0 ||
            exec_sql(db, "BEGIN IMMEDIATE TRANSACTION;") != 0 ||
            exec_sql(db, "DELETE FROM files;") != 0 ||
            exec_sql(db, "DELETE FROM droplets;") != 0 ||
            exec_sql(db, "DELETE FROM streams;") != 0) {
                goto cleanup;
        }

        if (sqlite3_prepare_v2(
                    db,
                    "INSERT INTO streams(id, title, description) VALUES(?, ?, ?);",
                    -1,
                    &stream_stmt,
                    NULL
            ) != SQLITE_OK ||
            sqlite3_prepare_v2(
                    db,
                    "INSERT INTO droplets(id, stream_id, parent_id, type, title, description, completion_status, link_target_id) "
                    "VALUES(?, ?, ?, ?, ?, ?, ?, ?);",
                    -1,
                    &droplet_stmt,
                    NULL
            ) != SQLITE_OK ||
            sqlite3_prepare_v2(
                    db,
                    "INSERT INTO files(id, droplet_id, name, description, path) VALUES(?, ?, ?, ?, ?);",
                    -1,
                    &file_stmt,
                    NULL
            ) != SQLITE_OK) {
                goto cleanup;
        }

        for (i = 0; i < shed->streams.len; ++i) {
                DataStream *stream = shed->streams.items[i];
                size_t j;

                sqlite3_reset(stream_stmt);
                sqlite3_clear_bindings(stream_stmt);

                if (sqlite3_bind_int64(stream_stmt, 1, (sqlite3_int64)stream->id) != SQLITE_OK ||
                    bind_text_or_null(stream_stmt, 2, stream->title) != 0 ||
                    bind_text_or_null(stream_stmt, 3, stream->description) != 0 ||
                    sqlite3_step(stream_stmt) != SQLITE_DONE) {
                        goto cleanup;
                }

                for (j = 0; j < stream->droplets.len; ++j) {
                        if (save_droplet_tree(droplet_stmt, file_stmt, stream->droplets.items[j]) != 0) {
                                goto cleanup;
                        }
                }
        }

        if (exec_sql(db, "COMMIT;") != 0) {
                goto cleanup;
        }

        rc = 0;

cleanup:
        sqlite3_finalize(file_stmt);
        sqlite3_finalize(droplet_stmt);
        sqlite3_finalize(stream_stmt);

        if (rc != 0) {
                exec_sql(db, "ROLLBACK;");
        }

        return rc;
}

int datashed_persist_load(sqlite3 *db, DataShed *shed) {
        sqlite3_stmt *stmt = NULL;
        StreamIndexEntry *stream_idx = NULL;
        DropletIndexEntry *droplet_idx = NULL;
        DropletAttachEntry *attach_idx = NULL;
        size_t stream_len = 0, stream_cap = 0;
        size_t droplet_len = 0, droplet_cap = 0;
        size_t attach_len = 0, attach_cap = 0;
        DataShed loaded;
        int rc = -1;
        size_t i;

        if (db == NULL || shed == NULL) {
                return -1;
        }

        data_shed_init(&loaded);

        if (datashed_persist_ensure_schema(db) != 0 ||
            sqlite3_prepare_v2(db, "SELECT id, title, description FROM streams ORDER BY id;", -1, &stmt, NULL) != SQLITE_OK) {
                goto cleanup;
        }

        while (sqlite3_step(stmt) == SQLITE_ROW) {
                DataId id = (DataId)sqlite3_column_int64(stmt, 0);
                const char *title = (const char *)sqlite3_column_text(stmt, 1);
                const char *description = (const char *)sqlite3_column_text(stmt, 2);
                DataStream *stream = data_stream_create(id, title, description);

                if (stream == NULL) {
                        goto cleanup;
                }

                if (data_stream_vec_push(&loaded.streams, stream) != 0) {
                        data_stream_destroy(stream);
                        goto cleanup;
                }

                if (append_stream_index(&stream_idx, &stream_len, &stream_cap, id, stream) != 0) {
                        goto cleanup;
                }
        }

        sqlite3_finalize(stmt);
        stmt = NULL;

        if (sqlite3_prepare_v2(
                    db,
                    "SELECT id, stream_id, parent_id, type, title, description, completion_status, link_target_id "
                    "FROM droplets ORDER BY id;",
                    -1,
                    &stmt,
                    NULL
            ) != SQLITE_OK) {
                goto cleanup;
        }

        while (sqlite3_step(stmt) == SQLITE_ROW) {
                DataId id = (DataId)sqlite3_column_int64(stmt, 0);
                DataId stream_id = (DataId)sqlite3_column_int64(stmt, 1);
                DataId parent_id = (DataId)sqlite3_column_int64(stmt, 2);
                DataDropletType type = (DataDropletType)sqlite3_column_int(stmt, 3);
                const char *title = (const char *)sqlite3_column_text(stmt, 4);
                const char *description = (const char *)sqlite3_column_text(stmt, 5);
                int completion_status = sqlite3_column_int(stmt, 6);
                DataId link_target_id = (DataId)sqlite3_column_int64(stmt, 7);
                DataDroplet *droplet = data_droplet_create(id, stream_id, parent_id, type, title, description);

                if (droplet == NULL) {
                        goto cleanup;
                }

                droplet->completion_status = completion_status;
                droplet->link_target_id = link_target_id;

                if (append_droplet_index(&droplet_idx, &droplet_len, &droplet_cap, id, droplet) != 0 ||
                    append_droplet_attach(&attach_idx, &attach_len, &attach_cap, droplet, stream_id, parent_id) != 0) {
                        data_droplet_destroy(droplet);
                        goto cleanup;
                }
        }

        sqlite3_finalize(stmt);
        stmt = NULL;

        for (i = 0; i < attach_len; ++i) {
                DataDroplet *droplet = attach_idx[i].droplet;

                if (attach_idx[i].parent_id != 0) {
                        DataDroplet *parent = find_droplet_by_id(droplet_idx, droplet_len, attach_idx[i].parent_id);
                        if (parent == NULL || data_droplet_vec_push(&parent->children, droplet) != 0) {
                                goto cleanup;
                        }
                } else {
                        DataStream *stream = find_stream_by_id(stream_idx, stream_len, attach_idx[i].stream_id);
                        if (stream == NULL || data_droplet_vec_push(&stream->droplets, droplet) != 0) {
                                goto cleanup;
                        }
                }
        }

        for (i = 0; i < droplet_len; ++i) {
                DataDroplet *droplet = droplet_idx[i].droplet;
                if (droplet->link_target_id != 0) {
                        droplet->link_target = find_droplet_by_id(droplet_idx, droplet_len, droplet->link_target_id);
                }
        }

        if (sqlite3_prepare_v2(
                    db,
                    "SELECT id, droplet_id, name, description, path FROM files ORDER BY id;",
                    -1,
                    &stmt,
                    NULL
            ) != SQLITE_OK) {
                goto cleanup;
        }

        while (sqlite3_step(stmt) == SQLITE_ROW) {
                DataId file_id = (DataId)sqlite3_column_int64(stmt, 0);
                DataId droplet_id = (DataId)sqlite3_column_int64(stmt, 1);
                const char *name = (const char *)sqlite3_column_text(stmt, 2);
                const char *description = (const char *)sqlite3_column_text(stmt, 3);
                const char *path = (const char *)sqlite3_column_text(stmt, 4);
                DataDroplet *owner = find_droplet_by_id(droplet_idx, droplet_len, droplet_id);
                DataFile *file;

                if (owner == NULL) {
                        goto cleanup;
                }

                file = data_file_create(file_id, name, description, path);
                if (file == NULL || data_file_vec_push(&owner->attached_files, file) != 0) {
                        data_file_destroy(file);
                        goto cleanup;
                }
        }

        data_shed_destroy(shed);
        *shed = loaded;
        rc = 0;

cleanup:
        sqlite3_finalize(stmt);

        if (rc != 0) {
                data_shed_destroy(&loaded);
        }

        free(attach_idx);
        free(droplet_idx);
        free(stream_idx);
        return rc;
}