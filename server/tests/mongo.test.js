import test from "node:test";
import assert from "node:assert/strict";
import { resolveMongoUri } from "../utils/mongo.js";

test("resolveMongoUri uses the configured dbUrl when present", () => {
    const previousDbUrl = process.env.dbUrl;
    process.env.dbUrl = "mongodb+srv://example-user:example-pass@cluster.example.mongodb.net/test";

    try {
        assert.equal(resolveMongoUri(), "mongodb+srv://example-user:example-pass@cluster.example.mongodb.net/test");
    } finally {
        if (previousDbUrl === undefined) {
            delete process.env.dbUrl;
        } else {
            process.env.dbUrl = previousDbUrl;
        }
    }
});

test("resolveMongoUri falls back to local MongoDB when no dbUrl is configured", () => {
    const previousDbUrl = process.env.dbUrl;
    delete process.env.dbUrl;

    try {
        assert.equal(resolveMongoUri(), "mongodb://127.0.0.1:27017/shopkart");
    } finally {
        if (previousDbUrl === undefined) {
            delete process.env.dbUrl;
        } else {
            process.env.dbUrl = previousDbUrl;
        }
    }
});
