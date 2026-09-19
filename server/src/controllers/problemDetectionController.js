const {
  isValidUrl,
  detectPlatform,
  extractLeetCodeSlug,
} = require("../utils/urlParser");

const { successResponse, errorResponse } = require("../utils/apiResponse");

const { getProblemMetadata } = require("../services/leetcodeService");
const {
    normalizeLeetCodeProblem,
} = require("../services/problemMetadataService");

const detectProblem = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return errorResponse(res, "URL is required", 400);
    }

    if (!isValidUrl(url)) {
      return errorResponse(res, "Invalid URL", 400);
    }

    const platform = detectPlatform(url);

    if (!platform) {
      return errorResponse(res, "Unsupported platform", 400);
    }

    const slug = extractLeetCodeSlug(url);

    if (!slug) {
      return errorResponse(res, "Invalid LeetCode problem URL", 400);
    }
    const metadata = await getProblemMetadata(slug);
    if (!metadata) {
      return errorResponse(res, "LeetCode problem not found", 404);
    }

    const problem = normalizeLeetCodeProblem(
    metadata,
    url
);

    successResponse(res, "Problem metadata fetched successfully", {
      platform,
      slug,
      problem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  detectProblem,
};
