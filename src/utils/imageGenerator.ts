export const generateSemImage = (type: 'scratch' | 'particle'): string => {
  const width = 800;
  const height = 600;

  // Advanced SEM Simulation
  // 1. Base Grain: Uses fractal noise to simulate the silicon crystal grain/electron noise at high mag.
  // 2. Defect Geometry: Drawn as white (high electron emission) on black/gray.
  // 3. Lighting: Uses feSpecularLighting to simulate the electron beam edge effect.

  let svgContent = `
    <defs>
      <!-- Fine Grain Noise for SEM Texture -->
      <filter id="sem-grain" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" in="noise" result="grayNoise"/>
        <feComponentTransfer>
           <feFuncA type="linear" slope="0.1"/> 
        </feComponentTransfer>
        <feBlend mode="multiply" in2="SourceGraphic"/>
      </filter>

      <!-- Edge Glow / Electron Charging Effect -->
      <filter id="electron-glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <!-- Emboss Effect for 3D topology -->
      <filter id="emboss">
        <feGaussianBlur stdDeviation="1" in="SourceAlpha" result="blur"/>
        <feSpecularLighting surfaceScale="2" specularConstant="1" specularExponent="20" lighting-color="#ffffff" in="blur" result="specular">
            <fePointLight x="200" y="200" z="200"/>
        </feSpecularLighting>
        <feComposite in="specular" in2="SourceAlpha" operator="in" result="specular"/>
        <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
      </filter>
    </defs>
    
    <!-- Background: Dark Gray Silicon Wafer -->
    <rect width="${width}" height="${height}" fill="#2b2b2b"/>
    <rect width="${width}" height="${height}" fill="#2b2b2b" filter="url(#sem-grain)" opacity="0.5"/>
  `;

  if (type === 'scratch') {
    // Scratch: A gouge usually has bright edges (electron accumulation) and dark center
    svgContent += `
      <g filter="url(#electron-glow)">
        <!-- Main Scratch Path -->
        <path d="M 180 520 Q 400 300 620 80" stroke="#e0e0e0" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Ragged Edges -->
        <path d="M 185 525 Q 405 305 615 85" stroke="#ffffff" stroke-width="1" fill="none" stroke-dasharray="2,4" opacity="0.8"/>
        <!-- Debris around scratch -->
        <circle cx="300" cy="350" r="2" fill="white" opacity="0.8"/>
        <circle cx="450" cy="200" r="3" fill="white" opacity="0.9"/>
      </g>
    `;
  } else if (type === 'particle') {
    // Particle: Organic/Dust particle. 
    // SEM Characteristic: High charging (bright white) on edges and peaks. Irregular shape.
    svgContent += `
      <!-- Particle Body: Irregular blob -->
      <path d="M 380 280 C 420 250, 460 270, 450 310 C 440 350, 400 360, 360 330 C 340 300, 360 290, 380 280 Z" 
            fill="#e0e0e0" stroke="white" stroke-width="2" filter="url(#electron-glow)"/>
      
      <!-- Highlights / Charging peaks -->
      <path d="M 390 290 Q 410 280 430 300" stroke="white" stroke-width="3" fill="none" opacity="0.9" filter="url(#electron-glow)"/>
      <circle cx="440" cy="310" r="4" fill="white" filter="url(#electron-glow)"/>
      
      <!-- Texture on particle -->
      <path d="M 380 310 Q 400 330 420 320" stroke="#999" stroke-width="1" fill="none" opacity="0.5"/>
    `;
  }

  // Scale Bar (Crucial for SEM look)
  svgContent += `
    <rect x="20" y="550" width="100" height="4" fill="white"/>
    <text x="20" y="540" font-family="Arial, sans-serif" font-size="12" fill="white">200nm</text>
    <text x="130" y="540" font-family="Arial, sans-serif" font-size="12" fill="#aaaaaa">HV: 15.00 kV</text>
    <text x="130" y="555" font-family="Arial, sans-serif" font-size="12" fill="#aaaaaa">WD: 5.2 mm</text>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${svgContent}</svg>`)}`;
};
