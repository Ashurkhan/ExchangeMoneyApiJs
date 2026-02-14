import { useState, useEffect } from 'react'
import { loadCurrencyCodes, convert } from './api/exchange'
import { getFlagUrl } from './api/getFlag'
import './App.css'

function App() {
  const [amount, setAmount] = useState<string>('100')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('EUR')
  const [currencies, setCurrencies] = useState<string[]>([])
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCurrencyCodes()
      .then((codes) => {
        setCurrencies(codes)
        if (!codes.includes(fromCurrency)) setFromCurrency(codes[0] ?? 'USD')
        if (!codes.includes(toCurrency)) setToCurrency(codes[1] ?? 'EUR')
      })
      .catch(() => setError('Не удалось загрузить список валют'))
  }, [])

  async function handleConvert() {
    const num = parseFloat(amount.replace(',', '.'))
    if (!Number.isFinite(num) || num < 0) {
      setError('Введите корректную сумму')
      return
    }
    setError(null)
    setLoading(true)
    setExchangeRate(null)
    setConvertedAmount(null)
    try {
      const { rate, result } = await convert(fromCurrency, toCurrency, num)
      setExchangeRate(rate)
      setConvertedAmount(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка конвертации')
    } finally {
      setLoading(false)
    }
  }

  function swapCurrencies() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setExchangeRate(null)
    setConvertedAmount(null)
  }

  return (
    <div className="exchanger">
      <h1>Обменник валют</h1>

      <div className="card inputs">
        <div className="row">
          <label>
            <span>Сумма</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </label>
        </div>

        <div className="row selects">
          <label>
            <span>Из</span>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            {fromCurrency && (
              <img
                src={getFlagUrl(fromCurrency)}
                alt=""
                className="flag"
                width={24}
                height={18}
              />
            )}
          </label>

          <button
            type="button"
            className="swap"
            onClick={swapCurrencies}
            title="Поменять валюты"
            aria-label="Поменять валюты"
          >
            ⇄
          </button>

          <label>
            <span>В</span>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {currencies.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            {toCurrency && (
              <img
                src={getFlagUrl(toCurrency)}
                alt=""
                className="flag"
                width={24}
                height={18}
              />
            )}
          </label>
        </div>

        <button
          type="button"
          className="convert-btn"
          onClick={handleConvert}
          disabled={loading}
        >
          {loading ? 'Считаем…' : 'Конвертировать'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {(exchangeRate != null && convertedAmount != null) && (
        <div className="card result">
          <p className="rate">
            1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
          </p>
          <p className="total">
            = <strong>{convertedAmount.toFixed(2)} {toCurrency}</strong>
          </p>
        </div>
      )}
    </div>
  )
}

export default App
