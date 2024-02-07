/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 *
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *    function app in Kudu
 */

const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
  const outputs = [];

  const data = yield context.df.callActivity("read-rss");
  const text = yield context.df.callActivity(
    "ExtractArticle",
    data.entry0.link
  );

  context.log(data);
  context.log(text);

  return outputs;
});
