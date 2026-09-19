const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

const detectPlatform = (url) => {
    try {
        const parsedUrl = new URL(url);

        const hostname = parsedUrl.hostname.toLowerCase();

        if (
            hostname === "leetcode.com" ||
            hostname === "www.leetcode.com"
        ) {
            return "leetcode";
        }

        return null;
    } catch (error) {
        return null;
    }
};

const extractLeetCodeSlug = (url) => {
    try {
        const parsedUrl = new URL(url);

        const hostname = parsedUrl.hostname.toLowerCase();

        if (
            hostname !== "leetcode.com" &&
            hostname !== "www.leetcode.com"
        ) {
            return null;
        }

        const parts = parsedUrl.pathname
            .split("/")
            .filter(Boolean);

        if (parts[0] !== "problems" || !parts[1]) {
            return null;
        }

        return parts[1];
    } catch (error) {
        return null;
    }
};
module.exports = {
        isValidUrl,
    detectPlatform,
    extractLeetCodeSlug
};