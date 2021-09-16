const rp = require("request-promise");
const cheerio = require("cheerio");
const app = require("express")();

const url = "https://www.worldometers.info/coronavirus/country/viet-nam/";
const { PORT = 3000 } = process.env;

app.get("/", (req, res, next) => {
  rp(url)
    .then((html) => {
      const $ = cheerio.load(html);

      const covidData = {};
      $("div .maincounter-number > span", html).each((i, el) => {
        const value = Number($(el).text().replace(",", ""));

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
    });
});

app.listen(PORT, () => {
  console.log("On " + PORT);
});
