const df = require("durable-functions");

module.exports = async function (context, myTimer) {
  var timeStamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log("JavaScript is running late!");
  }
  context.log("JavaScript timer trigger function ran!", timeStamp);
  const client = df.getClient(context);
  const functionName = "summarize-news";
  const instanceId = await client.startNew(functionName, undefined, undefined);

  context.log(`Started orchestration with ID = "${instanceId}".`);
};
