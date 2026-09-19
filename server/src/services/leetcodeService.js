const axios = require("axios");

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const getProblemMetadata = async (slug) => {
    const query = `
        query getQuestion($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                questionId
                title
                titleSlug
                difficulty
                topicTags {
                    name
                    slug
                }
            }
        }
    `;

    const response = await axios.post(
        LEETCODE_GRAPHQL_URL,
        {
            query,
            variables: {
                titleSlug: slug,
            },
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return response.data.data.question;
};

module.exports = {
    getProblemMetadata,
};