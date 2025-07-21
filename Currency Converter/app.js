const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let opt = document.createElement("option");
    opt.innerText = currCode;
    opt.value = currCode;
    if (select.name === "from" && currCode === "USD") opt.selected = true;
    if (select.name === "to" && currCode === "INR") opt.selected = true;
    select.append(opt);
  }
  select.addEventListener("change", evt => updateFlag(evt.target));
}

const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amt = amountInput.value;
  if (amt === "" || amt < 1) {
    amt = 1;
    amountInput.value = "1";
  }

  const base = fromCurr.value.toLowerCase();
  const target = toCurr.value.toLowerCase();
  const url = `${BASE_URL}/${base}.json`;

  try {
    let res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    let data = await res.json();

    const rate = data[base][target];
    const converted = (amt * rate).toFixed(2);
    msg.innerText = `${amt} ${fromCurr.value} = ${converted} ${toCurr.value}`;
  } catch (e) {
    msg.innerText = `Failed to fetch rate for ${fromCurr.value}/${toCurr.value}`;
    console.error("Fetch error:", e);
  }
};

const updateFlag = element => {
  const code = element.value;
  const country = countryList[code];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${country}/flat/64.png`;
};

btn.addEventListener("click", e => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", updateExchangeRate);
