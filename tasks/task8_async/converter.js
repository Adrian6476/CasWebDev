import fetch from 'node-fetch';

async function getExchangeRate(fromCurrency, toCurrency) {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    if (!response.ok) {
        throw new Error(`unable to get exchange rate for ${fromCurrency}`);
    }
    const data = await response.json();
    const rate = data.rates[toCurrency];
    if (!rate) {
        throw new Error(`unable to get currency ${toCurrency}`);
    }
    return rate;
}

async function convertCurrency(fromCurrency, toCurrency, amount) {
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;
    return convertedAmount;
}

(async () => {
    try {
        const result = await convertCurrency('GBP', 'CNY', 1);
        console.log(`1 GBP = ${result} CNY`);
    } catch (error) {
        console.error(error.message);
    }
})();
