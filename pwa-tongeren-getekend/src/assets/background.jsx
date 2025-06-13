const createBackground = () => {
  const fullText = 'TONGERENGETEKEND';
  const subText = 'een getekend spoor door de stad';
  
  const createRandomLetters = (count) => {
    // Create array of indices for all letters
    const indices = Array.from({ length: fullText.length }, (_, i) => i);
    // Shuffle the indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // Take first 6 indices and sort them to maintain original order
    const selectedIndices = indices.slice(0, count).sort((a, b) => a - b);
    // Get the letters at those indices
    return selectedIndices.map(i => fullText[i]).join('');
  };

  const createRandomSubText = () => {
    // Get a random starting position that allows for 15 letters
    const maxStart = subText.length - 18;
    const startPos = Math.floor(Math.random() * maxStart);
    // Get 15 consecutive letters starting from the random position
    return subText.slice(startPos, startPos + 15);
  };

  const lines = Array.from({ length: 12 }, (_, index) => {
    const y = 150 + (index * 150); // Back to 150 pixel spacing
    const isSubText = index % 2 === 1; // Alternate between fullText and subText
    
    return `
      <text 
        font-family="Raleway, Arial, Helvetica, sans-serif" 
        x="400" 
        y="${y}"
        style="
          fill: transparent;
          stroke: black;
          stroke-width: 3;
          text-anchor: middle; 
          paint-order: stroke;
        " 
        font-size="${isSubText ? '100' : '200'}"
        font-weight="${isSubText ? '400' : '700'}"
      >
        ${isSubText ? createRandomSubText() : createRandomLetters(8)}
      </text>
    `;
  }).join('');

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800px" height="1200px">
      ${lines}
    </svg>
  `;
  
  return `data:image/svg+xml,${encodeURIComponent(svgString.trim())}`;
};

const background = createBackground();
export default background;