// Utility to generate deterministic SVG data URIs for music covers
// Guarantees gorgeous, editorial-grade cover artwork with zero network dependencies

const PALETTES = [
  { bg1: '#0B132B', bg2: '#1C2541', accent: '#D4FF00', motif: 'circle' },
  { bg1: '#1A0B2E', bg2: '#2D1B4E', accent: '#A3E635', motif: 'waves' },
  { bg1: '#0F172A', bg2: '#1E293B', accent: '#4ADE80', motif: 'grid' },
  { bg1: '#18181B', bg2: '#27272A', accent: '#FACC15', motif: 'bars' },
  { bg1: '#09090B', bg2: '#18181B', accent: '#D4FF00', motif: 'orbit' },
  { bg1: '#1C1917', bg2: '#292524', accent: '#E2E8F0', motif: 'dots' },
  { bg1: '#030712', bg2: '#111827', accent: '#22D3EE', motif: 'sine' },
  { bg1: '#0C0A09', bg2: '#1C1917', accent: '#F43F5E', motif: 'prism' },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateArtworkFallback(title: string, artistName: string, id: string): string {
  const hash = hashString(id + title);
  const palette = PALETTES[hash % PALETTES.length];
  const initials = (title.slice(0, 2) || 'SO').toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="g_${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.bg1}" />
        <stop offset="100%" stop-color="${palette.bg2}" />
      </linearGradient>
      <radialGradient id="r_${hash}" cx="70%" cy="30%" r="60%">
        <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#g_${hash})" />
    <circle cx="280" cy="120" r="160" fill="url(#r_${hash})" />
    
    <!-- Sound wave / geometric motif -->
    <g opacity="0.35">
      <line x1="60" y1="200" x2="60" y2="240" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
      <line x1="80" y1="170" x2="80" y2="270" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
      <line x1="100" y1="140" x2="100" y2="300" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
      <line x1="120" y1="180" x2="120" y2="260" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
      <line x1="140" y1="120" x2="140" y2="320" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
      <line x1="160" y1="160" x2="160" y2="280" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
      <line x1="180" y1="130" x2="180" y2="310" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
      <line x1="200" y1="190" x2="200" y2="250" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
    </g>

    <!-- Editorial typography -->
    <text x="48" y="80" font-family="'Space Grotesk', monospace, sans-serif" font-size="28" font-weight="700" fill="${palette.accent}" letter-spacing="2">${initials}</text>
    <text x="48" y="340" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" letter-spacing="-0.5">${escapeXml(title.slice(0, 22))}</text>
    <text x="48" y="365" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="500" fill="rgba(255,255,255,0.6)">${escapeXml(artistName.slice(0, 26))}</text>
    <text x="320" y="80" font-family="'Space Grotesk', monospace, sans-serif" font-size="11" font-weight="600" fill="rgba(255,255,255,0.4)" letter-spacing="1">SONORA</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
