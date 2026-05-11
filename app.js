const API_ENDPOINT = "https://latest.currency-api.pages.dev/v1/currencies";

// Selecting important DOM elements

const currencySelectors = document.querySelectorAll(".dropdown select");
const convertButton = document.querySelector("form button");
const sourceCurrency = document.querySelector(".from select");
const targetCurrency = document.querySelector(".to select");
const exchangeMessage = document.querySelector(".msg");

 // Dynamically Populating Currency Dropdowns

for (let currencyDropdown of currencySelectors) {
  for (let currencyKey in countryList) {
    let currencyOption = document.createElement("option");
    currencyOption.innerText = currencyKey;
    currencyOption.value = currencyKey;

    // Setting default currencies

    if (currencyDropdown.name === "from" && currencyKey === "USD") {
      currencyOption.selected = "selected";
    }
    else if (currencyDropdown.name === "to" && currencyKey === "INR") {
      currencyOption.selected = "selected";
    }
    currencyDropdown.append(currencyOption);
  }

  // Updating flags dynamically

  currencyDropdown.addEventListener("change", (eventObject) => {
    updateCountryFlag(eventObject.target);
  });
}

  // Function to Fetch Exchange Rate

const refreshExchangeRate = async () => {
  // Selecting amount input
  let amountInput = document.querySelector(".amount input");
  let enteredAmount = amountInput.value;
  // Preventing invalid amount
  if (enteredAmount === "" || enteredAmount < 1) {
    enteredAmount = 1;
    amountInput.value = "1";
  }
  // Dynamic API URL
  const requestURL = `${API_ENDPOINT}/${sourceCurrency.value.toLowerCase()}.json`;
  // Fetching API data
  let apiResponse = await fetch(requestURL);
  let currencyData = await apiResponse.json();
  // Extracting conversion rate
  let conversionRate = currencyData[sourceCurrency.value.toLowerCase()][targetCurrency.value.toLowerCase()];
  // Final converted amount
  let convertedValue = enteredAmount * conversionRate;
  // Showing result
  exchangeMessage.innerText = `${enteredAmount} ${sourceCurrency.value} = ${convertedValue.toFixed(2)} ${targetCurrency.value}`;
};

  // Function to Update Country Flags

const updateCountryFlag = (selectedElement) => {
  let selectedCurrency = selectedElement.value;
  let selectedCountryCode = countryList[selectedCurrency];
  // Dynamic flag URL
  let updatedFlagURL = `https://flagsapi.com/${selectedCountryCode}/flat/64.png`;
  // Selecting related image
  let flagImage = selectedElement.parentElement.querySelector("img");
  // Updating flag
  flagImage.src = updatedFlagURL;
};

  // Convert Button Event

convertButton.addEventListener("click", (eventObject) => {
  // Preventing form refresh
  eventObject.preventDefault();
  refreshExchangeRate();
});

// Auto Update on Page Load

window.addEventListener("load", () => {
  refreshExchangeRate();
});