const API_URL = "https://open.er-api.com/v6/latest";

export type RatesResponse = {
  base_code: string;
  rates: Record<string, number>;
};

/** Загрузить курс валюты относительно базы (например USD) и вернуть список кодов и курсы */
export async function fetchRates(base: string): Promise<RatesResponse> {
  const res = await fetch(`${API_URL}/${base}`);
  if (!res.ok) throw new Error("Не удалось загрузить курсы");
  return res.json();
}

/** Получить список кодов валют (на основе курсов от USD) */
export async function loadCurrencyCodes(): Promise<string[]> {
  const data = await fetchRates("USD");
  return Object.keys(data.rates).sort();
}

/** Конвертировать: запрос курса from -> to и вернуть курс и сумму */
export async function convert(
  from: string,
  to: string,
  amount: number
): Promise<{ rate: number; result: number }> {
  const data = await fetchRates(from);
  const rate = data.rates[to];
  if (rate == null) throw new Error(`Курс для ${to} не найден`);
  return { rate, result: amount * rate };
}
