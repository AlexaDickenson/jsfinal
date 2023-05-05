let basecurrency = document.getElementById("base-currency");
let amountInput = document.getElementById("amount");
let targetCurrency = document.getElementById("target-currency");
let convertedAmount = document.getElementById("converted-amount");
let historicalRates = document.getElementById("historical-rates");
let historicalRatesContainer = document.getElementById("historical-rates-container");
let saveFavorite = document.getElementById("save-favorite");
let favoriteCurrencyPairs = document.getElementById("favorite-currency-pairs");

let date1 = document.getElementById("date1");
let date2 = document.getElementById("date2");
let historicalRatesFirst = document.getElementById("historical-rates-first");
let historicalRatesSecond = document.getElementById("historical-rates-second");


let favorites = [];

const myHeaders = new Headers();
myHeaders.append("apikey", "SJctYNLbKOBqALMuLvFNvkZniYtfq08R");

const requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

function fetchAvailableCurrencies() {
  fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
    .then(response => response.json())
    .then(result => {
      populateCurrencyDropdowns(result.symbols);
    })
    .catch(error => console.log('error', error));
}

function populateCurrencyDropdowns(symbols) {
  for (const currencyCode in symbols) {
    const option = document.createElement("option");
    option.value = currencyCode;
    option.text = `${currencyCode} - ${symbols[currencyCode]}`;

    basecurrency.add(option.cloneNode(true));
    targetCurrency.add(option);
  }
}

function convertCurrency() {
  const from = basecurrency.value;
  const to = targetCurrency.value;
  const amount = amountInput.value;

  const url = `https://api.apilayer.com/exchangerates_data/convert?from=${from}&to=${to}&amount=${amount}`;

  fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        convertedAmount.textContent = result.result.toFixed(2);
      } else {
        console.error('Conversion error', result.error);
      }
    })
    .catch(error => console.log('error', error));
}

function fetchHistoricalRates() {
  const from = basecurrency.value;
  const to = targetCurrency.value;

  const url1 = `https://api.apilayer.com/exchangerates_data/${date1.value}?symbols=${to}&base=${from}`;
  const url2 = `https://api.apilayer.com/exchangerates_data/${date2.value}?symbols=${to}&base=${from}`;

  fetch(url1, requestOptions)
    .then(response => response.json())
    .then(result1 => {
      if (result1.success) {
        return fetch(url2, requestOptions)
          .then(response => response.json())
          .then(result2 => {
            if (result2.success) {
              historicalRatesFirst.textContent = ` 1 ${from} = ${result1.rates[to]} ${to}`;
              historicalRatesSecond.textContent = `1 ${from} = ${result2.rates[to]} ${to}`;
            } else {
              console.error('Historical rates error', result2.error);
            }
          });
      } else {
        console.error('Historical rates error', result1.error);
      }
    })
    .catch(error => console.log('error', error));
}



function convertCurrency() {
  const from = basecurrency.value;
  const to = targetCurrency.value;
  const amount = amountInput.value;

  const url = `https://api.apilayer.com/exchangerates_data/convert?from=${from}&to=${to}&amount=${amount}`;

  fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        convertedAmount.textContent = result.result.toFixed(2);
      } else {
        console.error('Conversion error', result.error);
      }
    })
    .catch(error => console.log('error', error));
}





function saveFavoriteCurrencyPair() {
  const from = basecurrency.value;
  const to = targetCurrency.value;
  const favoritePair = `${from}/${to}`;

  
  if (favorites.includes(favoritePair)) {
    console.log('Favorite pair already saved');
    return;
  }

  favorites.push(favoritePair);

  updateFavoriteCurrencyPairs();
}

function updateFavoriteCurrencyPairs() {
  // Clear the existing list
  favoriteCurrencyPairs.innerHTML = '';

  favorites.forEach(pair => {
    const listItem = document.createElement('li');
    listItem.textContent = pair;
    favoriteCurrencyPairs.appendChild(listItem);
  });
}

function handleFavoriteCurrencyClick(event) {
  // Check if a favorite currency pair was clicked
  if (event.target.tagName === 'LI') {
    const pair = event.target.textContent;
    const [from, to] = pair.split('/');

    basecurrency.value = from;
    targetCurrency.value = to;
  }
}




document.addEventListener("DOMContentLoaded", function() {
  fetchAvailableCurrencies();
});

amount.addEventListener("input", convertCurrency);
basecurrency.addEventListener("change", convertCurrency);
targetCurrency.addEventListener("change", convertCurrency);
historicalRates.addEventListener("click", fetchHistoricalRates);
saveFavorite.addEventListener("click", saveFavoriteCurrencyPair);
favoriteCurrencyPairs.addEventListener("click", handleFavoriteCurrencyClick);
