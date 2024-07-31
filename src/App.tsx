/* src\App.tsx: */

import React, { useState } from 'react';
import WordCloud from './Cloud';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [wordData, setWordData] = useState<{ word: string; size: number }[]>([]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const generateWordCloud = () => {
    const stopWords = new Set(["the", "and", "a", "it", "is", "of", "on", "in", "to", "as"]); // Extend this list as needed
    const wordCounts: Record<string, number> = {};
    const words = inputText.split(/\s+/);
    
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord && !stopWords.has(cleanWord)) {
        wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
      }
    });

    const sortedWords = Object.keys(wordCounts)
      .map(word => ({ word, count: wordCounts[word] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 100); // Limit to the top 100 words

    const maxFreq = sortedWords[0].count;
    const wordArray = sortedWords.map(({ word, count }) => ({
      word: word,
      size: 10 + (count / maxFreq) * 40, // Base size of 10px, scales up to 50px
    }));

    setWordData(wordArray);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      maxWidth: '700px',
      margin: '0 auto'
    }}>
      <h1>Word Cloud Generator</h1>
      <textarea
        value={inputText}
        onChange={handleTextChange}
        rows={10}
        placeholder="Enter text here..."
        style={{
          width: '100%',
          marginBottom: '10px'
        }}
      />
      <button onClick={generateWordCloud}>Generate</button>
      <div style={{ width: '100%', marginTop: '20px' }}>
        <WordCloud words={wordData} />
      </div>
    </div>
  );
};

export default App;

