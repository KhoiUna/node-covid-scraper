const fetchCovidData = async () => await (await fetch("/api/data")).json();

const displayData = async (e) => {
  const { lastUpdated, cases, deaths, recovered } = await fetchCovidData();

  document.querySelector("#last-updated").innerText = new Date(
    lastUpdated
  ).toLocaleString();
  document.querySelector("#total").innerText = cases.toLocaleString();
  document.querySelector("#death").innerText = deaths.toLocaleString();
  document.querySelector("#recover").innerText = recovered.toLocaleString();
};
