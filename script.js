const API_URL = "https://open.er-api.com/v6/latest";
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const amountInput = document.getElementById("amount");
const resultInput = document.getElementById("result");
const rateText = document.getElementById("rate-text");
const convertBtn = document.getElementById("convert");

// Функция для получения флага по коду валюты
function getFlagUrl(currency) {
  // Берём первые две буквы валюты как страну (USD -> US, EUR -> EU)
  let code = currency.substring(0, 2);
  return `https://countryflagsapi.com/png/${code}`;
}

async function loadCurrencies() {
  const res = await fetch(API_URL + "/USD");
  const data = await res.json();
  const currencies = Object.keys(data.rates);

  currencies.forEach(cur => {
    const option1 = document.createElement("option");
    option1.value = cur;
    option1.textContent = `${cur}`; // Можно позже добавить сумму
    option1.style.backgroundImage = `url(${getFlagUrl(cur)})`;

    const option2 = option1.cloneNode(true);
    fromSelect.appendChild(option1);
    toSelect.appendChild(option2);
  });

  fromSelect.value = "USD";
  toSelect.value = "EUR";
}

async function convertCurrency() {
  const from = fromSelect.value;
  const to = toSelect.value;
  const amount = parseFloat(amountInput.value) || 0;

  const res = await fetch(`${API_URL}/${from}`);
  const data = await res.json();
  const rate = data.rates[to];
  const result = amount * rate;

  resultInput.value = result.toFixed(2);
  rateText.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
}

convertBtn.addEventListener("click", convertCurrency);

loadCurrencies();
