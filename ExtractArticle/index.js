module.exports = async function (context) {
  const data = context.bindings.name;

  return new Promise(async (resolve, reject) => {
    try {
      const articles = [];
      for (const entry of data) {
        const { default: fetch } = await import("node-fetch");
        const response = await fetch(entry.link);
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const html = await response.text();

        const cheerio = require("cheerio");
        const $ = cheerio.load(html);
        const paragraphs = $(".textabsatz")
          .map((_, el) => $(el).text().trim())
          .get();
        const paragraphsString = paragraphs.join(" ");
        const imageUrl = $(".ts-picture--topbanner > img").attr("src");

        const article = {
          title: entry.title,
          link: entry.link,
          pubDate: entry.pubDate,
          resort: entry.resort,
          text: paragraphsString,
          imageUrl: imageUrl,
        };
        articles.push(article);
      }
      resolve(articles);
    } catch (error) {
      console.error("Fehler beim Herunterladen der Seite:", error.message);
      reject(error);
    }
  });
};
