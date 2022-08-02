const cheerio = require("cheerio");
const express = require("express");
const bent = require("bent");
const app = express();

const url = "https://www.worldometers.info/coronavirus/country/viet-nam/";
const { PORT = 3000 } = process.env;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/en.html");
});

app.get("/vn", (req, res) => {
  res.sendFile(__dirname + "/public/vn.html");
});

app.use(express.static("public"));

app.get("/api/data", async (req, res, next) => {
  const getStream = bent(url);
  const stream = await getStream();

  stream
    .text()
    .then((html) => {
      const $ = cheerio.load(html);

      const covidData = {};

      //Scrape last updated date
      const scrapedDate = $(".label-counter").next().text();
      covidData.lastUpdated = new Date(scrapedDate.split("Last updated: ")[1]);

      //Scrape covid cases number
      $("div .maincounter-number > span", html).each((i, el) => {
        const value = Number($(el).text().split(",").join(""));

        switch (i) {
          case 0:
            covidData.cases = value;
            break;
          case 1:
            covidData.deaths = value;
            break;
          default:
            covidData.recovered = value;
        }
      });

      res.send(covidData);
    })
    .catch((err) => {
      console.error(err);
      next();
    });
});

app.listen(PORT, () => {
  console.log("On http://localhost:" + PORT);
});
