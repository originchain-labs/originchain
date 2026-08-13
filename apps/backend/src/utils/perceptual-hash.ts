import sharp from "sharp";

/**
 * Computes a 64-bit Difference Hash (dHash) for an image buffer.
 * dHash resizes the image to 9x8 grayscale and compares adjacent horizontal pixels.
 * Highly robust against image resizing, compression, cropping, and minor edits.
 */
export async function computePerceptualHash(imageBuffer: Buffer): Promise<string | null> {
    try {
        const { data } = await sharp(imageBuffer)
            .resize(9, 8, { fit: "fill" })
            .grayscale()
            .raw()
            .toBuffer({ resolveWithObject: true });

        let hashBits = "";
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const left = data[row * 9 + col];
                const right = data[row * 9 + col + 1];
                hashBits += left > right ? "1" : "0";
            }
        }

        // Convert 64 binary bits to 16 hex characters
        let hexHash = "";
        for (let i = 0; i < 64; i += 4) {
            const nibble = hashBits.slice(i, i + 4);
            hexHash += parseInt(nibble, 2).toString(16);
        }

        return hexHash;
    } catch {
        // If not a valid/supported image format (e.g. text file, PDF, binary), degrade gracefully
        return null;
    }
}

/**
 * Computes the Hamming distance (number of differing bits) between two 64-bit hex dHashes.
 * Distance <= 10 indicates high visual similarity (~85%+ visual match).
 */
export function hammingDistance(hash1: string, hash2: string): number {
    if (hash1.length !== hash2.length) return 64;
    let dist = 0;
    for (let i = 0; i < hash1.length; i++) {
        const val1 = parseInt(hash1[i], 16);
        const val2 = parseInt(hash2[i], 16);
        let xor = val1 ^ val2;
        while (xor > 0) {
            dist += xor & 1;
            xor >>= 1;
        }
    }
    return dist;
}
