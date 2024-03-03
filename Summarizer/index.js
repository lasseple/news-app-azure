const {
  AzureKeyCredential,
  TextAnalysisClient,
} = require("@azure/ai-language-text");

// This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
const endpoint = process.env["LANGUAGE_ENDPOINT"];
const apiKey = process.env["LANGUAGE_KEY"];

module.exports = async function (context) {
  const articles = context.bindings.name;

  context.log("== Extractive Summarization ==");

  const client = new TextAnalysisClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );
  const actions = [
    {
      kind: "ExtractiveSummarization",
      maxSentenceCount: 5,
    },
  ];

  return new Promise(async (resolve, reject) => {
    try {
      const summarizedArticles = [];
      for (const article of articles) {
        const text = [];
        text.push(article.text);
        const poller = await client.beginAnalyzeBatch(actions, text, "de");

        poller.onProgress(() => {
          context.log(
            `Last time the operation was updated was on: ${
              poller.getOperationState().modifiedOn
            }`
          );
        });
        context.log(
          `The operation was created on ${poller.getOperationState().createdOn}`
        );
        context.log(
          `The operation results will expire on ${
            poller.getOperationState().expiresOn
          }`
        );

        const results = await poller.pollUntilDone();

        for await (const actionResult of results) {
          if (actionResult.kind !== "ExtractiveSummarization") {
            throw new Error(
              `Expected extractive summarization results but got: ${actionResult.kind}`
            );
          }
          if (actionResult.error) {
            const { code, message } = actionResult.error;
            throw new Error(`Unexpected error (${code}): ${message}`);
          }
          for (const result of actionResult.results) {
            context.log(`- Document ${result.id}`);
            if (result.error) {
              const { code, message } = result.error;
              throw new Error(`Unexpected error (${code}): ${message}`);
            }
            const summaryString = result.sentences
              .map((sentence) => sentence.text)
              .join(" ");
            summarizedArticle = {
              title: article.title,
              link: article.link,
              pubDate: article.pubDate,
              resort: article.resort,
              text: article.text,
              summary: summaryString,
              imageUrl: article.imageUrl,
            };
            context.log(summarizedArticle);
            summarizedArticles.push(summarizedArticle);
          }
        }
      }
      resolve(summarizedArticles);
    } catch (error) {
      console.error("Fehler beim Zusammenfassen der Artikel:", error.message);
      reject(error);
    }
  });
};
