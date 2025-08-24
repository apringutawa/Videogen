
import React from 'react';

interface SelectButtonProps<T> {
  label: string;
  value: T;
  currentValue: T;
  onClick: (value: T) => void;
  disabled: boolean;
}

export const SelectButton = <T,>(
  { label, value, currentValue, onClick, disabled }: SelectButtonProps<T>
) => {
  const isSelected = value === currentValue;

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      disabled={disabled}
      className={`
        w-full py-2 px-3 rounded-md text-sm font-semibold transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500
        ${
          isSelected
            ? 'bg-cyan-600 text-white'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }
      `}
    >
      {label}
    </button>
  );
};
