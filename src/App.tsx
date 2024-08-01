/* src\App.tsx: */

import React, { useState } from 'react';
import WordCloud from './Cloud';
import './App.css';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [wordData, setWordData] = useState<{ word: string; size: number }[]>([]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const generateWordCloud = () => {
    const stopWords = new Set(["the", "and", "a", "it", "is", "of", "on", "in", "to", "as", "for", "than", "they", "which", "not", "etc", "eg", "ie", "are", "by", "from", "to", "were", "has", "with"]);
    const wordCounts: Record<string, number> = {};
    const words = inputText.split(/\s+/);
    
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord && !stopWords.has(cleanWord) && !/^\d+$/.test(cleanWord))  // REGEX FOR ISOLATED DIGITS
      {
        wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
      }
    });

    const sortedWords = Object.keys(wordCounts)
      .map(word => ({ word, count: wordCounts[word] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 100); // Max Words

    const maxFreq = sortedWords[0].count;
    const wordArray = sortedWords.map(({ word, count }) => ({
      word: word,
      size: 9 + (count / maxFreq) * 40, // Base: 10px | Max: 50px
    }));

    setWordData(wordArray);
  };

  return (
    <div className="App">

      <h1>Word Cloud Generator</h1>

      <div className="input-container">
        <textarea
          value={inputText}
          onChange={handleTextChange}
          rows={10}
          placeholder="Enter text here..."
          style={{
            width: '80%',
            marginBottom: '10px'
          }}
        />
        <button onClick={generateWordCloud}>Generate</button>
      </div>

      <div className="word-cloud-container">
        <WordCloud words={wordData} />
      </div>

    </div>
  );
};

export default App;

