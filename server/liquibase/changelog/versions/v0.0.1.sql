
CREATE DOMAIN UUID AS VARCHAR(36);

CREATE DOMAIN SHA512 AS CHAR(88);

CREATE DOMAIN sha256 AS CHAR(44);

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