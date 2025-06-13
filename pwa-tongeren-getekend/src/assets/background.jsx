const createBackground = () => {
  const fullText = 'TONGERENGETEKEND';
  
  // Generate unique random spacings for each line (between 50 and 400 pixels)
  const letterSpacings = Array.from({ length: 8 }, () => Math.floor(Math.random() * 350) + 50);
  
  // Generate random x positions for each line (between 200 and 600 pixels)
  const xPositions = Array.from({ length: 8 }, () => Math.floor(Math.random() * 400) + 200);
  
  const lines = Array.from({ length: 8 }, (_, index) => {
    const y = 150 + (index * 150);
    const startPos = index * 2;
    const twoLetters = fullText.slice(startPos, startPos + 2);
    
    return `
      <text 
        font-family="Raleway, Arial, Helvetica, sans-serif" 
        x="${xPositions[index]}" 
        y="${y}"
        style="
          fill: transparent;
          stroke: black;
          stroke-width: 3;
          text-anchor: middle; 
          paint-order: stroke;
        " 
        font-size="200"
        font-weight="700"
      >
        ${twoLetters[0]}
        <tspan dx="${letterSpacings[index]}">${twoLetters[1]}</tspan>
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