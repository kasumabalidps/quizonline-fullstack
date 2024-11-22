CREATE TABLE IF NOT EXISTS "migrations"(
  "id" integer primary key autoincrement not null,
  "migration" varchar not null,
  "batch" integer not null
);
CREATE TABLE IF NOT EXISTS "admin"(
  "id" integer primary key autoincrement not null,
  "nama" varchar not null,
  "email" varchar not null,
  "password" varchar not null,
  "remember_token" varchar,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE UNIQUE INDEX "admin_email_unique" on "admin"("email");
CREATE TABLE IF NOT EXISTS "mahasiswa"(
  "id" integer primary key autoincrement not null,
  "nim" varchar not null,
  "nama" varchar not null,
  "email" varchar not null,
  "password" varchar not null,
  "id_kelas" integer not null,
  "remember_token" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("id_kelas") references "kelas"("id") on delete cascade on update cascade
);
CREATE UNIQUE INDEX "mahasiswa_email_unique" on "mahasiswa"("email");
CREATE TABLE IF NOT EXISTS "dosen"(
  "id" integer primary key autoincrement not null,
  "nidn" varchar not null,
  "nama" varchar not null,
  "email" varchar not null,
  "password" varchar not null,
  "id_jurusan" integer not null,
  "remember_token" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("id_jurusan") references "jurusan"("id") on delete cascade on update cascade
);
CREATE UNIQUE INDEX "dosen_email_unique" on "dosen"("email");
CREATE TABLE IF NOT EXISTS "password_reset_tokens"(
  "email" varchar not null,
  "token" varchar not null,
  "created_at" datetime,
  primary key("email")
);
CREATE TABLE IF NOT EXISTS "sessions"(
  "id" varchar not null,
  "user_id" integer,
  "ip_address" varchar,
  "user_agent" text,
  "payload" text not null,
  "last_activity" integer not null,
  primary key("id")
);
CREATE INDEX "sessions_user_id_index" on "sessions"("user_id");
CREATE INDEX "sessions_last_activity_index" on "sessions"("last_activity");
CREATE TABLE IF NOT EXISTS "cache"(
  "key" varchar not null,
  "value" text not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE TABLE IF NOT EXISTS "cache_locks"(
  "key" varchar not null,
  "owner" varchar not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE TABLE IF NOT EXISTS "personal_access_tokens"(
  "id" integer primary key autoincrement not null,
  "tokenable_type" varchar not null,
  "tokenable_id" integer not null,
  "name" varchar not null,
  "token" varchar not null,
  "abilities" text,
  "last_used_at" datetime,
  "expires_at" datetime,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" on "personal_access_tokens"(
  "tokenable_type",
  "tokenable_id"
);
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" on "personal_access_tokens"(
  "token"
);
CREATE TABLE IF NOT EXISTS "jurusan"(
  "id" integer primary key autoincrement not null,
  "code_jurusan" varchar not null,
  "nama_jurusan" varchar not null,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE UNIQUE INDEX "jurusan_code_jurusan_unique" on "jurusan"("code_jurusan");
CREATE TABLE IF NOT EXISTS "prodi"(
  "id" integer primary key autoincrement not null,
  "code_prodi" varchar not null,
  "nama_prodi" varchar not null,
  "id_jurusan" integer not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("id_jurusan") references "jurusan"("id") on delete cascade on update cascade
);
CREATE TABLE IF NOT EXISTS "kelas"(
  "id" integer primary key autoincrement not null,
  "code_kelas" varchar not null,
  "nama_kelas" varchar not null,
  "id_prodi" integer not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("id_prodi") references "prodi"("id") on delete cascade on update cascade
);

INSERT INTO migrations VALUES(1,'0001_01_01_000000_create_users_table',1);
INSERT INTO migrations VALUES(2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO migrations VALUES(3,'2024_11_20_021030_create_personal_access_tokens_table',1);
INSERT INTO migrations VALUES(4,'2024_11_21_015531_create_kampus_table',1);
