import React, { useEffect, useState } from "react";

const KEY = "fca_live_841JGeCfeqKjNcXXiILA0QyIffvo1wyopXN7sB6G";
export default function App() {
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [convertedValue, setConvertedValue] = useState(0);
  const [rates, setRates] = useState({});

  // Fetch exchange rates once
  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(
          `https://api.freecurrencyapi.com/v1/latest?apikey=${KEY}`
        );

        const data = await res.json();
        setRates(data.data); // store rates like { USD:1, INR:88, IDR:16000 }
      } catch (err) {
        console.error(err);
      }
    }

    fetchRates();
  }, []);

  function convert() {
    if (!rates[fromCurrency] || !rates[toCurrency]) return;

    // Formula: amount * (toRate / fromRate)
    const result = amount * (rates[toCurrency] / rates[fromCurrency]);

    setConvertedValue(result.toFixed(2));
  }

  return (
    <div className="app-box">
      <InputArea amount={amount} setAmount={setAmount} />
      <Currency
        toCurrency={toCurrency}
        fromCurrency={fromCurrency}
        setFromCurrency={setFromCurrency}
        setToCurrency={setToCurrency}
      />
      <Output onConvert={convert} convertedValue={convertedValue} />
    </div>
  );
}

function InputArea({ amount, setAmount }) {
  return (
    <div className="input-area">
      <h1 className="title-text">CURRENCY CONVERTER</h1>
      <input
        type="number"
        className="currency-input"
        placeholder="Enter Amount...."
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      ></input>
    </div>
  );
}

function Currency({
  fromCurrency,
  toCurrency,
  setFromCurrency,
  setToCurrency,
}) {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    async function fetchCurrencySymbols() {
      try {
        const res = await fetch(
          "https://api.freecurrencyapi.com/v1/currencies?apikey=fca_live_841JGeCfeqKjNcXXiILA0QyIffvo1wyopXN7sB6G"
        );

        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();

        // Extract keys: USD, INR, EUR etc.
        const currencyKeys = Object.keys(data.data);

        setSymbols(currencyKeys);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCurrencySymbols();
  }, []);

  return (
    <div className="currency-area">
      <span className="from-label">From</span>
      <span className="from-currency-select">
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {symbols.map((symbol) => (
            <option key={symbol}>{symbol}</option>
          ))}
        </select>
      </span>

      <span className="to-label">To</span>
      <span className="to-currency-select">
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {symbols.map((symbol) => (
            <option key={symbol}>{symbol}</option>
          ))}
        </select>
      </span>
    </div>
  );
}

function Output({ onConvert, convertedValue }) {
  return (
    <div className="output-area">
      <input
        type="text"
        className="currency-output"
        value={convertedValue}
      ></input>
      <button className="reset-button" onClick={onConvert}>
        Convert
      </button>
    </div>
  );
}
