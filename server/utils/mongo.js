import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import Product from "../models/product.model.js";
import { sampleProducts } from "../seedProducts.js";

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/shopkart";

export function resolveMongoUri() {
    const configuredUri = process.env.dbUrl?.trim();

    if (configuredUri) {
        return configuredUri;
    }

    return DEFAULT_LOCAL_URI;
}

export async function connectDatabase() {
    const configuredUri = process.env.dbUrl?.trim();

    if (configuredUri) {
        try {
            await mongoose.connect(configuredUri, { serverSelectionTimeoutMS: 5000 });
            console.log("Db Connected");
            return { type: "configured", uri: configuredUri };
        } catch (error) {
            console.warn(`Configured MongoDB connection failed: ${error.message}`);
            console.warn("Falling back to local in-memory MongoDB; data will not persist after shutdown.");
        }
    }

    const tempDirectory = path.join(process.cwd(), "node_modules", ".cache", "mongodb-memory-server", "tmp");
    await mkdir(tempDirectory, { recursive: true });

    const tempVariables = ["TMPDIR", "TMP", "TEMP"];
    const previousTempValues = Object.fromEntries(tempVariables.map((name) => [name, process.env[name]]));
    for (const name of tempVariables) {
        process.env[name] = tempDirectory;
    }

    let memoryServer;
    try {
        memoryServer = await MongoMemoryServer.create();
    } finally {
        for (const name of tempVariables) {
            if (previousTempValues[name] === undefined) {
                delete process.env[name];
            } else {
                process.env[name] = previousTempValues[name];
            }
        }
    }

    const uri = memoryServer.getUri();

    await mongoose.connect(uri);
    await Product.insertMany(sampleProducts);
    console.log("Db Connected to in-memory MongoDB");

    return { type: "memory", uri, memoryServer };
}
