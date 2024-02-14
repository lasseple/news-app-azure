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

        const article = {
          title: entry.title,
          link: entry.link,
          pubDate: entry.pubDate,
          resort: entry.resort,
          text: paragraphsString,
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
