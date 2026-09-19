const normalizeLeetCodeProblem = (metadata, url) => {
    return {
        platform: "leetcode",
        problemId: metadata.questionId,
        title: metadata.title,
        url,
        difficulty: metadata.difficulty,
        topics: metadata.topicTags.map((tag) => tag.name),
    };
};

module.exports = {
    normalizeLeetCodeProblem,
};