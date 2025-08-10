const fs = require('fs');
const path = require('path');

/**
 * Post-processing script to enhance GitHub snake SVGs with:
 * - Gradient snake body
 * - Soft radial background panel
 * - Watermark
 */

function addGradientDefs(svgContent, theme = 'light') {
  const gradients = theme === 'dark' ? {
    snake: `
      <defs>
        <radialGradient id="snakeGradient" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" style="stop-color:#00ff41;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#00cc33;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#009925;stop-opacity:1" />
        </radialGradient>
        <radialGradient id="bgPanel" cx="0.5" cy="0.5" r="0.8">
          <stop offset="0%" style="stop-color:#0d1117;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#21262d;stop-opacity:0.3" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>`
  } : {
    snake: `
      <defs>
        <radialGradient id="snakeGradient" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" style="stop-color:#40c463;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#30a14e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#216e39;stop-opacity:1" />
        </radialGradient>
        <radialGradient id="bgPanel" cx="0.5" cy="0.5" r="0.8">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#f6f8fa;stop-opacity:0.3" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>`
  };

  // Insert defs after the opening svg tag
  return svgContent.replace(/<svg[^>]*>/, (match) => match + gradients.snake);
}

function addBackgroundPanel(svgContent) {
  // Add a subtle background panel
  const bgPanel = `
    <rect width="100%" height="100%" fill="url(#bgPanel)" rx="8" ry="8" opacity="0.3"/>`;
  
  // Insert background panel after defs or svg opening
  const defsEndIndex = svgContent.indexOf('</defs>');
  if (defsEndIndex !== -1) {
    return svgContent.slice(0, defsEndIndex + 7) + bgPanel + svgContent.slice(defsEndIndex + 7);
  } else {
    return svgContent.replace(/<svg[^>]*>/, (match) => match + bgPanel);
  }
}

function enhanceSnakeElements(svgContent) {
  // Apply gradient to snake body elements (contributions)
  // Target typical snake/contribution elements - this may need adjustment based on actual SVG structure
  svgContent = svgContent.replace(
    /(<rect[^>]*class="[^"]*contribution[^"]*"[^>]*)fill="[^"]*"/gi,
    '$1fill="url(#snakeGradient)"'
  );
  
  // Also target any green-colored rectangles that might be part of the snake
  svgContent = svgContent.replace(
    /(<rect[^>]*)fill="(#[0-9a-f]{3,6})"/gi,
    (match, prefix, color) => {
      // If it's a green-ish color, apply our gradient
      if (color.toLowerCase().includes('0f') || color.toLowerCase().includes('9be9a8') || color.toLowerCase().includes('40c463')) {
        return prefix + 'fill="url(#snakeGradient)" filter="url(#glow)"';
      }
      return match;
    }
  );

  return svgContent;
}

function addWatermark(svgContent, theme = 'light') {
  const textColor = theme === 'dark' ? '#8b949e' : '#656d76';
  const watermark = `
    <g opacity="0.6" transform="translate(10, 20)">
      <text x="0" y="0" font-family="monospace" font-size="10" fill="${textColor}">
        Enhanced by ritoban23
      </text>
    </g>`;

  // Insert watermark before closing svg tag
  return svgContent.replace('</svg>', watermark + '\n</svg>');
}

function decorateSvg(inputPath, outputPath, theme = 'light') {
  try {
    console.log(`Decorating ${inputPath} -> ${outputPath} (${theme} theme)`);
    
    if (!fs.existsSync(inputPath)) {
      console.warn(`Input file ${inputPath} does not exist, skipping...`);
      return;
    }

    let svgContent = fs.readFileSync(inputPath, 'utf8');
    
    // Apply decorations
    svgContent = addGradientDefs(svgContent, theme);
    svgContent = addBackgroundPanel(svgContent);
    svgContent = enhanceSnakeElements(svgContent);
    svgContent = addWatermark(svgContent, theme);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, svgContent, 'utf8');
    console.log(`Successfully created decorated ${theme} theme SVG: ${outputPath}`);
  } catch (error) {
    console.error(`Error decorating ${inputPath}:`, error.message);
  }
}

function main() {
  const distDir = path.join(__dirname, '..', 'dist');
  
  // Process both light and dark themes
  const files = [
    { input: 'github-snake.svg', output: 'github-snake-decorated.svg', theme: 'light' },
    { input: 'github-snake-dark.svg', output: 'github-snake-decorated-dark.svg', theme: 'dark' }
  ];
  
  files.forEach(({ input, output, theme }) => {
    const inputPath = path.join(distDir, input);
    const outputPath = path.join(distDir, output);
    decorateSvg(inputPath, outputPath, theme);
  });
  
  console.log('Snake decoration process completed!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { decorateSvg, main };