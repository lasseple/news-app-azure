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
  const uri = process.env["MONGO_URL"];
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
