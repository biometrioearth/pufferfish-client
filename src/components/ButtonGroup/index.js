import React from 'react'

const ButtonGroup = ({ options, selectedOption, onChange }) => {
  return (
    <div className="flex space-x-2">
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-3 py-1 rounded-md ${selectedOption === option.value
            ? 'bg-black text-bodydark2 border-black'
            : 'bg-bodydark2 text-black border-bodydark2'
            }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup
