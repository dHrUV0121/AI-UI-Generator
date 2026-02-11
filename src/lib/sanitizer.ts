// Input sanitizer for prompt injection protection

const SUSPICIOUS_PATTERNS = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /system\s*prompt/i,
    /you\s+are\s+now/i,
    /pretend\s+you\s+are/i,
    /forget\s+(all\s+)?(your\s+)?instructions/i,
    /override\s+(system|prompt)/i,
    /<script[\s>]/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /document\.(cookie|location|write)/i,
    /window\.(location|open)/i,
];

export function sanitizeInput(input: string): { sanitized: string; warnings: string[] } {
    const warnings: string[] = [];
    let sanitized = input;

    // Check for suspicious patterns
    for (const pattern of SUSPICIOUS_PATTERNS) {
        if (pattern.test(sanitized)) {
            warnings.push(`Suspicious pattern detected: ${pattern.source}`);
        }
    }

    // Strip HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, "");

    // Limit input length
    if (sanitized.length > 2000) {
        sanitized = sanitized.slice(0, 2000);
        warnings.push("Input truncated to 2000 characters");
    }

    // Log warnings
    if (warnings.length > 0) {
        console.warn("[Sanitizer] Warnings:", warnings);
    }

    return { sanitized, warnings };
}
