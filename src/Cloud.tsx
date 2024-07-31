/* src\Cloud.tsx: */

import React from 'react';

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
  const containerSize = 700; // Width and Height of the word cloud container
  const radius = containerSize / 2; // Maximum radius for word placement
  const positions: WordPosition[] = [];

  const doesOverlap = (newPos: WordPosition) => {
    return positions.some(pos => {
      const distance = Math.sqrt(Math.pow(pos.x - newPos.x, 2) + Math.pow(pos.y - newPos.y, 2));
      return distance < (pos.size + newPos.size) / 2; // Simple overlap check
    });
  };

  const placeWord = (wordData: WordData) => {
    let angle, distance, x, y, newPos;
    let attempts = 0;
    do {
      angle = Math.random() * 2 * Math.PI; // Random angle
      distance = Math.random() * radius; // Random distance from the center
      x = radius + distance * Math.cos(angle); // Calculate x position
      y = radius + distance * Math.sin(angle); // Calculate y position
      newPos = { ...wordData, x, y };
      attempts++;
    } while (doesOverlap(newPos) && attempts < 100); // Attempt placement 100 times
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
            color: getColor(data.size),
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: 'translate(-50%, -50%)' // Center the words
          }}>
            {data.word}
          </span>
        );
      })}
    </div>
  );
};


export default WordCloud;

function getColor(size: number) {
  const hue = 360 - (size - 10) * 270 / 40; // Adjust hue from 360 (violet) to 90 (red)
  return `hsl(${hue}, 100%, 50%)`;
}
