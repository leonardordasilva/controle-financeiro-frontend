import { useState, useEffect } from 'react';

export default function InputMoeda({ value, onChange, ...props }) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused && value && value > 0) {
      setDisplayValue(value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      }));
    } else if (!isFocused && (!value || value === 0)) {
      setDisplayValue('');
    }
  }, [value, isFocused]);

  const parseValue = (str) => {
    if (!str) return 0;

    // Remove R$ e espaços
    const cleaned = str.replace(/[R$\s]/g, '');

    if (cleaned.includes(',')) {
      // Formato com vírgula: 10.520,22
      const parts = cleaned.split(',');
      const integerPart = parts[0].replace(/\./g, ''); // Remove pontos (separadores de milhares)
      const decimalPart = parts[1] ? parts[1].substring(0, 2) : '0'; // Máximo 2 casas decimais
      return parseFloat(`${integerPart}.${decimalPart}`) || 0;
    } else {
      // Apenas números inteiros: 10520
      return parseFloat(cleaned.replace(/\./g, '')) || 0;
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Permite apenas números, vírgula, ponto, R$ e espaço
    const filteredValue = inputValue.replace(/[^\d.,R$\s]/g, '');

    setDisplayValue(filteredValue);

    // Converte para número e passa para o onChange
    const numericValue = parseValue(filteredValue);
    onChange(numericValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Remove formatação ao focar, mantendo apenas o valor "cru"
    if (displayValue) {
      const rawValue = displayValue.replace(/[R$\s]/g, '');
      if (rawValue !== '0,00') {
        setDisplayValue(rawValue);
      } else {
        setDisplayValue('');
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    // Aplica formatação completa ao perder o foco
    const numericValue = parseValue(displayValue);

    if (numericValue > 0) {
      const formatted = numericValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      });
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  };

  return (
      <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Digite o valor..."
          className="border px-3 py-2 rounded w-full"
          {...props}
      />
  );
}