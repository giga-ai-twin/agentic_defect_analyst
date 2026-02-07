export const generateSemImage = (type: 'scratch' | 'particle'): string => {
    const width = 800;
    const height = 600;

    // Base gray noise background (simulated with simple rects for SVG file size efficiency)
    let svgContent = `
    <rect width="${width}" height="${height}" fill="#808080"/>
    <rect width="${width}" height="${height}" filter="url(#noise)"/>
    <defs>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
      </filter>
    </defs>
  `;

    if (type === 'scratch') {
        // Add a diagonal scratch line
        svgContent += `
      <path d="M 200 500 Q 400 300 600 100" stroke="#f0f0f0" stroke-width="4" fill="none" opacity="0.8"/>
      <path d="M 195 505 Q 395 305 595 105" stroke="#404040" stroke-width="6" fill="none" opacity="0.6"/>
    `;
    } else if (type === 'particle') {
        // Add a particle circle
        svgContent += `
      <circle cx="400" cy="300" r="50" fill="#e0e0e0" opacity="0.9"/>
      <circle cx="400" cy="300" r="50" stroke="#404040" stroke-width="2" fill="none" opacity="0.5"/>
      <path d="M 400 300 L 450 350" stroke="#000" stroke-width="10" opacity="0.2" transform="rotate(45, 400, 300)"/>
    `;
    }

    // Text label for clarity
    svgContent += `
    <text x="20" y="580" font-family="monospace" font-size="14" fill="white" opacity="0.5">SEM-MAG: 50kx | ${type.toUpperCase()}_MODE</text>
  `;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${svgContent}</svg>`)}`;
};
