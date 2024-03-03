const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
  try {
    const data = yield context.df.callActivity("read-rss");
    if (data.length > 0) {
      const text = yield context.df.callActivity("ExtractArticle", data);
      const summary = yield context.df.callActivity("Summarizer", text);
      const persist = yield context.df.callActivity("Persist", summary);
    }
  } catch (error) {
    context.log(error);
  }
});
