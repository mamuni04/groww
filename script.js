const traded = [
  {logo:"C", cls:"red", name:"Cupid", price:"&#8377;212.24", change:"+2.23 (1.06%)"},
  {logo:"K", cls:"orange", name:"Kalyan Jewellers", price:"&#8377;476.15", change:"+33.15 (7.48%)"},
  {logo:"Z", cls:"", name:"Zensar Technologies", price:"&#8377;508.25", change:"+60.85 (13.60%)"},
  {logo:"G", cls:"blue", name:"Greaves Cotton", price:"&#8377;263.60", change:"+26.37 (11.12%)"}
];

const stocks = [
  {logo:"S", cls:"red", name:"Solar Industries Ind", price:"&#8377;18,236.00", change:"+856.00 (4.93%)", volume:"2,18,676", line:[3,9,8,15,17,16,18,18,17,19,20]},
  {logo:"L", cls:"blue", name:"LTIMindtree", price:"&#8377;4,037.20", change:"+182.80 (4.74%)", volume:"10,24,019", line:[15,13,14,12,12,10,11,9,14,16,20]},
  {logo:"U", cls:"", name:"Union Bank of India", price:"&#8377;164.51", change:"+7.25 (4.61%)", volume:"2,45,98,550", line:[4,6,5,7,8,8,15,11,16,15,17]},
  {logo:"D", cls:"", name:"DLF", price:"&#8377;685.75", change:"+26.15 (3.96%)", volume:"1,13,38,298", line:[3,12,10,14,13,15,14,13,14,14,15]}
];

const tools = [
  ["IPO","IPO","6 open"],
  ["BND","Bonds",""],
  ["ETF","ETFs",""],
  ["SCR","Intraday Screener",""],
  ["SIP","Stocks SIP",""],
  ["MTF","MTF stocks",""]
];

const indices = [
  ["NIFTY","24,206.90","+244.10 (1.02%)"],
  ["SENSEX","77,569.39","+827.57 (1.08%)"],
  ["BANKNIFTY","58,045.90","+793.45 (1.39%)"]
];

const gainers = [
  {logo:"S",cls:"red",name:"Solar Industries Ind",price:"&#8377;18,236.00",change:"+856.00 (4.93%)"},
  {logo:"L",cls:"blue",name:"LTIMindtree",price:"&#8377;4,037.20",change:"+182.80 (4.74%)"},
  {logo:"U",cls:"",name:"Union Bank of India",price:"&#8377;164.51",change:"+7.25 (4.61%)"}
];

const news = [
  {logo:"M",cls:"yellow",name:"Mazagon Dock Shipbuilders",price:"&#8377;2,420.10",change:"+47.30 (1.99%)"},
  {logo:"E",cls:"navy",name:"Exide Industries",price:"&#8377;424.40",change:"-0.80 (0.19%)",negative:true},
  {logo:"JD",cls:"",name:"Just Dial",price:"&#8377;564.05",change:"+17.45 (3.19%)"}
];

function logo(item){
  return `<div class="logo-box ${item.cls || ""}">${item.logo}</div>`;
}

function sparkline(points){
  const w = 100;
  const h = 30;
  const pad = 2;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const coords = points.map((v,i) => {
    const x = pad + i * (w - pad * 2) / (points.length - 1);
    const y = h - pad - (v - min) * (h - pad * 2) / (max - min || 1);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return `<svg class="sparkline" viewBox="0 0 100 30" aria-hidden="true"><polyline points="${coords}" fill="none" stroke="#00b386" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

document.getElementById("tradedGrid").innerHTML = traded.map(item => `
  <article class="trade-card">
    ${logo(item)}
    <h3>${item.name}</h3>
    <p>${item.price}</p>
    <strong>${item.change}</strong>
  </article>
`).join("");

document.getElementById("stockRows").innerHTML = stocks.map(item => `
  <div class="stock-row">
    <div class="company-cell">
      ${logo(item)}
      <span class="company-name">${item.name}</span>
      ${sparkline(item.line)}
    </div>
    <div class="price-cell">${item.price}<strong>${item.change}</strong></div>
    <div class="volume-cell">${item.volume}</div>
  </div>
`).join("");

document.getElementById("toolsList").innerHTML = tools.map(item => `
  <div class="tool-row">
    <div class="tool-icon">${item[0]}</div>
    <span>${item[1]}</span>
    ${item[2] ? `<small>${item[2]}</small>` : ""}
  </div>
`).join("");

document.getElementById("indicesRow").innerHTML = indices.map(item => `
  <article class="index-card">
    <h3>${item[0]}</h3>
    <p>${item[1]}</p>
    <strong>${item[2]}</strong>
  </article>
`).join("");

function mobileCards(list){
  return list.map(item => `
    <article class="mobile-stock-card">
      ${logo(item)}
      <h3>${item.name}</h3>
      <p>${item.price}</p>
      <strong class="${item.negative ? "negative" : ""}">${item.change}</strong>
    </article>
  `).join("");
}

document.getElementById("gainersRow").innerHTML = mobileCards(gainers);
document.getElementById("newsRow").innerHTML = mobileCards(news);

document.querySelectorAll(".filter-row button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-row button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}

let deferredPrompt;
const banner = document.getElementById("installBanner");
const installBtn = document.getElementById("installBtn");
const dismissBtn = document.getElementById("dismissInstall");

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
  banner.hidden = false;
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  banner.hidden = true;
});

dismissBtn.addEventListener("click", () => {
  banner.hidden = true;
});
