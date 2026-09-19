const {
    isValidUrl,
    detectPlatform,
} = require("../src/utils/urlParser");

const urls = [
    "https://leetcode.com/problems/two-sum/",
    "https://www.leetcode.com/problems/two-sum/",
    "https://google.com",
    "hello",
];

urls.forEach((url) => {
    console.log("\nURL:", url);
    console.log("Valid:", isValidUrl(url));
    console.log("Platform:", detectPlatform(url));
});