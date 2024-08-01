/* src\Cloud.tsx: */

import React from 'react';
import './App.css';

interface WordData {
  word: string;
  size: number;
}

interface Props {
  words: WordData[];
}

interface WordPosition {
  word: string;
  size: number;
  x: number;
  y: number;
}

const WordCloud: React.FC<Props> = ({ words }) => {
  const containerSize = 650;                   
  const radius = containerSize / 2;           
  const positions: WordPosition[] = [];

  const doesOverlap = (newPos: WordPosition) => {
    return positions.some(pos => {
      const distance = Math.sqrt(Math.pow(pos.x - newPos.x, 2) + Math.pow(pos.y - newPos.y, 2));
      return distance < (pos.size + newPos.size) / 1.33;   //overlap threshold
    });
  };

  const placeWord = (wordData: WordData) => {
    let angle, distance, x, y, newPos;
    let attempts = 0;
    do {
      angle = Math.random() * 2 * Math.PI;      // Random angle
      distance = Math.random() * radius;        // Random distance from center
      x = radius + distance * Math.cos(angle);  // X positon
      y = radius + distance * Math.sin(angle);  // Y position
      newPos = { ...wordData, x, y };
      attempts++;
    } while (doesOverlap(newPos) && attempts < 100); // Max Words
    if (attempts < 100) positions.push(newPos);
    return newPos;
};


  return (
    <div className="word-cloud">
      {words.map((data) => {
        const pos = placeWord(data);
        return (
          <span key={data.word} style={{
            position: 'absolute',
            fontSize: `${data.size}px`,
            color: getColor(data.size, words.length),
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: 'translate(-50%, -50%)'
          }}>
            {data.word}
          </span>
        );
      })}
    </div>
  );
};

export default WordCloud;


function getColor(index: number, totalWords: number) {
  const ratio = index / totalWords;

  const colorStops = [
    { ratio: 0.1, hue: 0 },  
    { ratio: 0.2, hue: 218 },
    { ratio: 0.4, hue: 30 }, 
    { ratio: 0.6, hue: 0 },
    { ratio: 0.8, hue: 220 },
    { ratio: 1, hue: 270 }  
  ];

  let start = colorStops[0];
  let end = colorStops[1];

  for (let i = 1; i < colorStops.length; i++) {
    if (ratio <= colorStops[i].ratio) {
      end = colorStops[i];
      break;
    }
    start = colorStops[i];
  }

  const hueRatio = (ratio - start.ratio) / (end.ratio - start.ratio);
  const hue = start.hue + hueRatio * (end.hue - start.hue);

  return `hsl(${hue}, 100%, 50%)`;
}