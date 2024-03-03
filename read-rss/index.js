const axios = require("axios");
const { parseString } = require("xml2js");

module.exports = async function (context) {
  const tagesschauUrl = process.env["TAGESSCHAU_RSS_URL"];
  try {
    const response = await axios.get(tagesschauUrl);
    const xmlData = response.data;

    // Konvertiere XML in JSON
    return new Promise((resolve, reject) => {
      parseString(xmlData, (err, result) => {
        if (err) {
          console.error("Fehler beim Konvertieren von XML in JSON:", err);
          reject(err);
        }
        var data = [];

        const currentDate = Date.parse(new Date());

        const items = result.rss.channel[0].item;
        items.forEach((item, index) => {
          entryDate = Date.parse(item.pubDate);
          if (currentDate - entryDate < 300000) {
            const entry = {
              title: item.title[0],
              link: item.link[0],
              pubDate: item.pubDate[0],
              resort: JSON.stringify(item.link[0]).split("/")[3],
            };

            data.push(entry);
          }
        });
        resolve(data);
      });
    });
  } catch (error) {
    console.error("Fehler beim Herunterladen des RSS-Feeds:", error.message);
  }
};
