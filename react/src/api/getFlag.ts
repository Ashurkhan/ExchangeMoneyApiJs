/** Код валюты -> код страны для флага (alpha-2). Не у всех валют есть страна. */
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "us", EUR: "de", GBP: "gb", JPY: "jp", CHF: "ch", CAD: "ca", AUD: "au",
  CNY: "cn", RUB: "ru", INR: "in", BRL: "br", KRW: "kr", MXN: "mx",
};

export function getFlagUrl(currencyCode: string): string {
  const code = (currencyCode || "").toUpperCase().slice(0, 2);
  const country = CURRENCY_TO_COUNTRY[code] || code.toLowerCase();
  return `https://flagcdn.com/w40/${country}.png`;
}
