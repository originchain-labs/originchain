export interface ProfileMetadataV1 {
  version: 1;
  schema: "originchain.profile.v1";
  displayName: string;
  bio: string;
  avatarCid: string;
}

export interface AssetMetadataV1 {
  version: 1;
  schema: "originchain.asset.v1";
  title: string;
  description: string;
  tags: string[];
}

export type ParsedMetadata =
  | { type: "profile"; data: ProfileMetadataV1 }
  | { type: "asset"; data: AssetMetadataV1 };

export function parseMetadata(rawJson: unknown): ParsedMetadata {
  if (typeof rawJson !== "object" || rawJson === null) {
    throw new Error("UNSUPPORTED_METADATA_VERSION");
  }

  const obj = rawJson as Record<string, unknown>;
  const version = obj.version;
  const schema = obj.schema;

  if (schema === "originchain.profile.v1" && version === 1) {
    return {
      type: "profile",
      data: {
        version: 1,
        schema: "originchain.profile.v1",
        displayName: String(obj.displayName || ""),
        bio: String(obj.bio || ""),
        avatarCid: String(obj.avatarCid || ""),
      },
    };
  }

  if (schema === "originchain.asset.v1" && version === 1) {
    return {
      type: "asset",
      data: {
        version: 1,
        schema: "originchain.asset.v1",
        title: String(obj.title || ""),
        description: String(obj.description || ""),
        tags: Array.isArray(obj.tags) ? obj.tags.map(String) : [],
      },
    };
  }

  throw new Error("UNSUPPORTED_METADATA_VERSION");
}
