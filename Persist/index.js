/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */
const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  pubDate: {
    type: Date,
    required: true,
  },
  resort: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = async function (context) {
  const uri =
    "mongodb+srv://dhsh:lhR6RFrbzcbgrfvEdNCS@shortent.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    context.log(`Connected with MongoDB on ${conn.connection.host}`);
  } catch (error) {
    context.log(`Error: ${error.message}`);
    context.log(`Error: ${error}`);
  }
  for (const article of context.bindings.name) {
    try {
      const newArticle = new Article({
        title: article.title,
        link: article.link,
        pubDate: Date.parse(article.pubDate),
        resort: article.resort,
        text: article.text,
        summary: article.summary,
        imageUrl: article.imageUrl,
      });
      await newArticle.save();
    } catch (error) {
      context.log(`Error: ${error.message}`);
      context.log(`Error: ${error}`);
    }
  }
};
