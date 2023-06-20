import React, { useState } from 'react';
import { PlusIcon, XIcon } from '@heroicons/react/solid';

function Filter() {
  const [showInput, setShowInput] = useState(false);
  const [filterWords, setFilterWords] = useState([]);
  const [newWord, setNewWord] = useState('');

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (event) => {
    setNewWord(event.target.value);
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      setFilterWords((prevWords) => [...prevWords, newWord]);
      setNewWord('');
      setShowInput(false); // Hide the input after adding the word
    }
  };

  const handleRemoveWord = (word) => {
    setFilterWords((prevWords) => prevWords.filter((w) => w !== word));
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-4">
      {filterWords.length > 0 && (
        <div className="flex items-center">
          {filterWords.map((word) => (
            <div key={word} className="flex items-center p-2 border border-black rounded-md mr-2">
              <span>{word}</span>
              <button className="ml-2" onClick={() => handleRemoveWord(word)}>
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showInput ? (
        <div className="flex items-center">
          <input
            type="text"
            className="p-2 border border-black rounded-md"
            value={newWord}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
          />
        </div>
      ) : (
        <button
          className="flex items-center p-2 border border-black rounded-md"
          onClick={handleButtonClick}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          <span>Filter</span>
        </button>
      )}
    </div>
  );
}

export default Filter;
