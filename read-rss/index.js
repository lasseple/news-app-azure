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
const axios = require("axios");
const { parseString } = require("xml2js");

module.exports = async function (context) {
  try {
    const response = await axios.get(
      "https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml"
    );
    const xmlData = response.data;

    // Konvertiere XML in JSON
    return new Promise((resolve, reject) => {
      parseString(xmlData, (err, result) => {
        if (err) {
          console.error("Fehler beim Konvertieren von XML in JSON:", err);
          return;
        }
        var data = {};

        const currentDate = Date.parse(new Date());

        const items = result.rss.channel[0].item;
        items.forEach((item, index) => {
          entryDate = Date.parse(item.pubDate);
          if (currentDate - entryDate < 7200000)
            data["entry" + index] = {
              title: item.title[0],
              link: item.link[0],
              pubDate: item.pubDate[0],
              resort: JSON.stringify(item.link[0]).split("/")[3],
            };
        });
        //context.log(data);
        const jsonData = JSON.stringify(data, null, 2);
        //context.log(jsonData);
        resolve(data);
      });
    });
  } catch (error) {
    console.error("Fehler beim Herunterladen des RSS-Feeds:", error.message);
  }
};
