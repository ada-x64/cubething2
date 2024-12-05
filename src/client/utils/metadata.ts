/////////////////////////////// cubething.dev /////////////////////////////////

// From scripts/metadata.ts
export type Metadata = {
  url: string;
  lastCommitDate: Date;
  contentType: string;
  frontmatter: {
    title: string;
    snippet: string;
    publishedAt: string;
  } & { [x: string]: string };
};

export type MetadataMap = {
  [x: string]: Metadata | MetadataMap;
};

export type ParsedMetadata = {
  articles: {
    [x: string]: {
      [x: string]: Metadata;
    };
  };
} & MetadataMap;

export function findCurrentMetadata(
  metadata: ParsedMetadata,
  url: string,
): Metadata | null {
  // Helper function to recursively search through the metadata object
  function searchMetadata(obj: MetadataMap | Metadata): Metadata | null {
    // If the current object is a Metadata object (has 'url' property)
    if (obj && typeof obj === "object" && "url" in obj) {
      if (obj.url === url) {
        return obj as Metadata;
      }
      return null;
    }

    // If the current object is a map/dictionary, recursively search its values
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        // Recursively search if the value is an object
        if (typeof value === "object") {
          const result = searchMetadata(value);
          if (result) return result;
        }
      }
    }

    return null;
  }

  // Start the search from the top-level metadata object
  return searchMetadata(metadata);
}
