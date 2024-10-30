
CREATE DOMAIN UUID AS VARCHAR(36);

CREATE DOMAIN SHA512 AS CHAR(88);

CREATE DOMAIN SHA256 AS CHAR(44);

CREATE DOMAIN URL AS VARCHAR(255);

CREATE DOMAIN RGB AS CHAR(11); -- 0~255,0~255,0~255

CREATE FUNCTION "random_rgb"(min INT DEFAULT 0, max INT DEFAULT 255) RETURNS RGB AS $$
DECLARE
    r INT;
    g INT;
    b INT;
BEGIN
    r := floor(random() * (max - min + 1) + min);
    g := floor(random() * (max - min + 1) + min);
    b := floor(random() * (max - min + 1) + min);
    RETURN r || ',' || g || ',' || b;
END;
$$ LANGUAGE PLPGSQL;

CREATE TABLE "User"(
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP,
    "deletedAt" TIMESTAMP,
    "displayName" VARCHAR(64),
    "alias" VARCHAR(128) NOT NULL UNIQUE,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" SHA512,
    "passwordSalt" SHA256
);

CREATE INDEX "indexAlias" ON "User"("alias");

CREATE INDEX "indexEmail" ON "User"("email");

CREATE INDEX "indexCreatedAt" ON "User"("createdAt");

CREATE TABLE "UserDetails"(
    "id" UUID NOT NULL,
    "bookmarkedIcons" JSON NOT NULL DEFAULT '[]',
    "downloadedIcons" JSON NOT NULL DEFAULT '[]',
    "profileColor" RGB NOT NULL DEFAULT random_rgb(100, 255),
    "profileImage" URL,
    FOREIGN KEY("id") REFERENCES "User"("id") ON DELETE CASCADE
);

INSERT INTO "UserDetails"("id") VALUES('91138b80-e996-41e0-a6f4-79b391537fa6');