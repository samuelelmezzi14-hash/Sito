/* =========================================================
   Coccole di Neve — illustrazioni originali in SVG
   Ogni peluche è disegnato a mano in codice: forme morbide,
   occhietti ricamati, gambette in velluto a coste e un filtro
   "pelo" che sfuma i contorni come un tessuto soffice.
   ========================================================= */

const Illustrazioni = (() => {
  const INK = '#2b211d';
  const CHEEK = '#f3a0a0';
  const CORD = '#a9784f';
  const CORD_D = '#8a5d3d';
  const RED = '#d6464e';
  const RED_D = '#b5343c';
  const GREEN = '#4f9a73';
  const GREEN_D = '#3b7c5a';
  const GOLD = '#f0bf4c';
  const GOLD_D = '#d9a232';
  const CREAM = '#fffaf1';

  /* ---------- definizioni globali (filtro pelo + luci) ---------- */
  const defs = () => `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
      <defs>
        <filter id="pelo" filterUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <radialGradient id="luce" cx="35%" cy="30%" r="65%">
          <stop offset="0" stop-color="#fff" stop-opacity=".45"/>
          <stop offset=".55" stop-color="#fff" stop-opacity=".08"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="ombra-int" cx="50%" cy="20%" r="85%">
          <stop offset=".6" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".12"/>
        </radialGradient>
      </defs>
    </svg>`;

  /* ---------- pezzi riutilizzabili ---------- */
  const ombra = (cx = 100, w = 60) =>
    `<ellipse cx="${cx}" cy="184" rx="${w}" ry="7" fill="#3b2a20" opacity=".1"/>`;

  const occhi = (cx, cy, s = 1, gap = 12) => {
    const r = 3.3 * s, dx = gap * s;
    return `
      <ellipse cx="${cx - dx}" cy="${cy}" rx="${r}" ry="${r * 1.18}" fill="${INK}"/>
      <ellipse cx="${cx + dx}" cy="${cy}" rx="${r}" ry="${r * 1.18}" fill="${INK}"/>
      <circle cx="${cx - dx + r * .35}" cy="${cy - r * .45}" r="${r * .32}" fill="#fff" opacity=".9"/>
      <circle cx="${cx + dx + r * .35}" cy="${cy - r * .45}" r="${r * .32}" fill="#fff" opacity=".9"/>`;
  };

  const guance = (cx, cy, s = 1, gap = 12) => `
      <ellipse cx="${cx - (gap + 7) * s}" cy="${cy + 7 * s}" rx="${5.5 * s}" ry="${3.4 * s}" fill="${CHEEK}" opacity=".6"/>
      <ellipse cx="${cx + (gap + 7) * s}" cy="${cy + 7 * s}" rx="${5.5 * s}" ry="${3.4 * s}" fill="${CHEEK}" opacity=".6"/>`;

  const sorriso = (cx, cy, s = 1, col = INK) =>
    `<path d="M${cx - 5 * s} ${cy + 6 * s} Q${cx} ${cy + 11.5 * s} ${cx + 5 * s} ${cy + 6 * s}" stroke="${col}" stroke-width="${1.9 * s}" fill="none" stroke-linecap="round"/>`;

  const faccina = (cx, cy, s = 1, o = {}) =>
    occhi(cx, cy, s, o.gap || 12) + (o.guance === false ? '' : guance(cx, cy, s, o.gap || 12)) + (o.bocca === false ? '' : sorriso(cx, cy, s, o.colBocca));

  // Gambette in velluto a coste, tipiche degli "Amuseables"
  const gambette = (cx, y, gap = 16, len = 28, w = 13) => {
    const one = (x, rot) => {
      const coste = [0.25, 0.5, 0.75].map(f =>
        `<line x1="${x - w / 2 + w * f}" y1="${y + 3}" x2="${x - w / 2 + w * f}" y2="${y + len - 3}" stroke="${CORD_D}" stroke-width="1.2" opacity=".55"/>`).join('');
      return `<g transform="rotate(${rot} ${x} ${y})">
        <rect x="${x - w / 2}" y="${y}" width="${w}" height="${len}" rx="${w / 2}" fill="${CORD}"/>
        ${coste}
        <ellipse cx="${x}" cy="${y + len - 4}" rx="${w / 2 + 1.5}" ry="5.5" fill="${CORD_D}"/>
      </g>`;
    };
    return one(cx - gap, 6) + one(cx + gap, -6);
  };

  const luce = (cx, cy, rx, ry) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#luce)"/>`;

  const stellina = (cx, cy, r, col = GOLD) => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const rr = i % 2 ? r * .48 : r;
      d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
    }
    return `<path d="${d}Z" fill="${col}" stroke="${col}" stroke-width="${r * .28}" stroke-linejoin="round"/>`;
  };

  const sciarpa = (cx, y, w, c1, c2) => `
    <g>
      <rect x="${cx - w / 2}" y="${y}" width="${w}" height="13" rx="6.5" fill="${c1}"/>
      <path d="M${cx + w * .18} ${y + 8} q4 22 -2 32 l14 2 q2 -18 -2 -32z" fill="${c1}"/>
      <path d="M${cx + w * .18 + 1} ${y + 22} l13 1 M${cx + w * .18 + 0} ${y + 31} l13 1.5" stroke="${c2}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M${cx - w / 2 + 12} ${y + 2} v9 M${cx - w / 2 + 26} ${y + 2} v9 M${cx + w / 2 - 12} ${y + 2} v9 M${cx + w / 2 - 26} ${y + 2} v9" stroke="${c2}" stroke-width="4" stroke-linecap="round"/>
    </g>`;

  const cappelloBabbo = (cx, y, w) => `
    <g>
      <path d="M${cx - w / 2} ${y} C${cx - w / 3} ${y - 34} ${cx + w * .1} ${y - 50} ${cx + w * .62} ${y - 30} C${cx + w * .38} ${y - 26} ${cx + w * .3} ${y - 14} ${cx + w / 2} ${y} Z" fill="${RED}"/>
      <circle cx="${cx + w * .64}" cy="${y - 28}" r="${w * .12}" fill="${CREAM}"/>
      <rect x="${cx - w / 2 - 4}" y="${y - 6}" width="${w + 8}" height="13" rx="6.5" fill="${CREAM}"/>
    </g>`;

  /* =========================================================
     I PELUCHE
     ========================================================= */
  const tipi = {};

  tipi.tree = () => {
    const tier = (top, bot, hw, col) => `<path d="M100 ${top} C108 ${top} ${100 + hw} ${bot - 16} ${100 + hw} ${bot - 4} Q${100 + hw} ${bot + 5} ${100 + hw - 12} ${bot + 2} Q100 ${bot + 12} ${100 - hw + 12} ${bot + 2} Q${100 - hw} ${bot + 5} ${100 - hw} ${bot - 4} C${100 - hw} ${bot - 16} 92 ${top} 100 ${top}Z" fill="${col}"/>`;
    return `${ombra(100, 56)}
      ${gambette(100, 150, 18, 30)}
      <g filter="url(#pelo)">
        ${tier(78, 160, 60, '#3f8a62')}
        ${tier(50, 118, 46, '#4f9a73')}
        ${tier(28, 80, 32, '#5fae84')}
        ${luce(84, 70, 40, 50)}
      </g>
      <circle cx="74" cy="104" r="6" fill="${RED}"/><circle cx="128" cy="96" r="6" fill="${GOLD}"/>
      <circle cx="62" cy="146" r="6.5" fill="${GOLD}"/><circle cx="140" cy="146" r="6.5" fill="${RED}"/>
      <circle cx="100" cy="64" r="5" fill="${RED}"/><circle cx="116" cy="112" r="4.5" fill="#8fc3e8"/>
      <path d="M60 116 Q100 132 142 112" stroke="${CREAM}" stroke-width="2.5" fill="none" stroke-dasharray="1 6" stroke-linecap="round"/>
      ${stellina(100, 24, 15)}
      ${faccina(100, 132, 1.05)}`;
  };

  tipi.pudding = () => `${ombra(100, 58)}
      ${gambette(100, 140, 20, 32)}
      <g filter="url(#pelo)">
        <path d="M38 140 C38 70 162 70 162 140 Q162 160 100 160 Q38 160 38 140Z" fill="#7b4a31"/>
        <path d="M47 108 C52 72 148 72 153 108 Q147 118 141 110 Q134 126 125 112 Q117 121 110 111 Q101 130 92 112 Q83 123 76 110 Q67 126 60 111 Q52 119 47 108Z" fill="${CREAM}"/>
        ${luce(80, 92, 40, 30)}
      </g>
      <g fill="#4a2a1b" opacity=".8">
        <ellipse cx="62" cy="140" rx="3" ry="2"/><ellipse cx="140" cy="136" rx="3" ry="2"/><ellipse cx="128" cy="150" rx="2.6" ry="1.8"/><ellipse cx="74" cy="152" rx="2.6" ry="1.8"/><ellipse cx="148" cy="124" rx="2.4" ry="1.7"/><ellipse cx="54" cy="126" rx="2.4" ry="1.7"/>
      </g>
      <path d="M100 74 C88 58 70 64 66 54 C78 54 80 46 92 52 C92 44 102 44 100 74Z" fill="${GREEN}"/>
      <path d="M100 74 C112 58 130 64 134 54 C122 54 120 46 108 52 C108 44 98 44 100 74Z" fill="${GREEN_D}"/>
      <circle cx="94" cy="72" r="6" fill="${RED}"/><circle cx="106" cy="71" r="6" fill="${RED}"/><circle cx="100" cy="64" r="6" fill="${RED_D}"/>
      ${faccina(100, 128, .95)}`;

  tipi.sprout = () => `${ombra(100, 50)}
      ${gambette(100, 140, 16, 32)}
      <g filter="url(#pelo)">
        <ellipse cx="72" cy="112" rx="28" ry="46" transform="rotate(-28 72 112)" fill="#6aa64f"/>
        <ellipse cx="128" cy="112" rx="28" ry="46" transform="rotate(28 128 112)" fill="#6aa64f"/>
        <circle cx="100" cy="108" r="50" fill="#9ccb74"/>
        <path d="M100 60 C76 72 66 104 76 152" stroke="#7fb35d" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M100 60 C124 72 134 104 124 152" stroke="#7fb35d" stroke-width="5" fill="none" stroke-linecap="round"/>
        ${luce(84, 88, 30, 30)}
      </g>
      <path d="M96 58 Q100 46 106 56" stroke="#5c8f42" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${faccina(100, 110, 1)}`;

  tipi.candycane = () => {
    const d = 'M120 150 L120 74 C120 30 66 30 66 66';
    return `${ombra(112, 40)}
      ${gambette(120, 150, 12, 30, 12)}
      <g filter="url(#pelo)">
        <path d="${d}" stroke="${CREAM}" stroke-width="36" fill="none" stroke-linecap="round"/>
        <path d="M120 152 L120 128" stroke="${RED}" stroke-width="36" fill="none" stroke-dasharray="10 12" stroke-linecap="butt"/>
        <path d="M120 94 L120 74 C120 30 66 30 66 66" stroke="${RED}" stroke-width="36" fill="none" stroke-dasharray="13 15" stroke-linecap="butt"/>
        <path d="M108 140 L108 80 C108 54 92 46 82 54" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".35"/>
      </g>
      ${faccina(120, 106, .8, { gap: 9 })}`;
  };

  tipi.cocoa = () => `${ombra(100, 56)}
      ${gambette(96, 150, 20, 30)}
      <path d="M78 56 q-8 -12 2 -22 q8 -10 0 -20" stroke="#cfc5bc" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M112 54 q-8 -12 2 -22 q8 -10 0 -20" stroke="#cfc5bc" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
      <g filter="url(#pelo)">
        <path d="M140 92 C176 92 176 144 140 144" stroke="#f3eadc" stroke-width="14" fill="none" stroke-linecap="round"/>
        <rect x="46" y="72" width="100" height="90" rx="22" fill="#f6eee2"/>
        <rect x="46" y="134" width="100" height="14" fill="${RED}"/>
        <ellipse cx="96" cy="76" rx="46" ry="11" fill="#7b4a31"/>
        <rect x="66" y="62" width="18" height="16" rx="5" fill="#fff" transform="rotate(-12 75 70)"/>
        <rect x="90" y="60" width="18" height="16" rx="5" fill="#f8c9d2" transform="rotate(8 99 68)"/>
        <rect x="110" y="64" width="17" height="15" rx="5" fill="#fff" transform="rotate(-4 118 71)"/>
        ${luce(74, 100, 26, 34)}
      </g>
      <g fill="#fff"><circle cx="60" cy="141" r="2.2"/><circle cx="80" cy="141" r="2.2"/><circle cx="100" cy="141" r="2.2"/><circle cx="120" cy="141" r="2.2"/><circle cx="138" cy="141" r="2.2"/></g>
      ${faccina(96, 108, 1)}`;

  tipi.bauble = (c = {}) => {
    const corpo = c.corpo || RED, scuro = c.scuro || RED_D;
    return `${ombra(100, 50)}
      ${gambette(100, 156, 18, 26)}
      <circle cx="100" cy="34" r="9" stroke="${GOLD_D}" stroke-width="4" fill="none"/>
      <g filter="url(#pelo)">
        <circle cx="100" cy="112" r="58" fill="${corpo}"/>
        <path d="M44 118 Q58 104 72 118 T100 118 T128 118 T156 118 L156 132 Q142 118 128 132 T100 132 T72 132 T44 132Z" fill="${scuro}" opacity=".55"/>
        ${luce(80, 88, 38, 34)}
      </g>
      <rect x="84" y="42" width="32" height="18" rx="5" fill="${GOLD}"/>
      <path d="M90 44 v14 M100 44 v14 M110 44 v14" stroke="${GOLD_D}" stroke-width="2"/>
      <g fill="${CREAM}" opacity=".9"><circle cx="66" cy="150" r="2.5"/><circle cx="134" cy="150" r="2.5"/><circle cx="100" cy="164" r="2.5"/><circle cx="148" cy="96" r="2.5"/></g>
      ${faccina(100, 98, 1.05, { colBocca: INK })}`;
  };

  tipi.snowman = () => `${ombra(100, 50)}
      <path d="M58 132 L30 112 M38 118 l-8 2 M140 132 L170 114 M162 119 l9 0" stroke="#8a5d3d" stroke-width="4.5" stroke-linecap="round"/>
      <g filter="url(#pelo)">
        <circle cx="100" cy="140" r="44" fill="#fbfbf8"/>
        <circle cx="100" cy="140" r="44" fill="url(#ombra-int)"/>
        <circle cx="100" cy="80" r="34" fill="#fdfdfb"/>
        <circle cx="100" cy="80" r="34" fill="url(#ombra-int)"/>
        <path d="M68 70 Q70 30 100 30 Q130 30 132 70Z" fill="${GREEN}"/>
        <rect x="64" y="62" width="72" height="14" rx="7" fill="${CREAM}"/>
        <circle cx="100" cy="28" r="10" fill="${CREAM}"/>
      </g>
      ${sciarpa(100, 106, 66, RED, CREAM)}
      <g fill="${INK}"><circle cx="100" cy="134" r="3.6"/><circle cx="100" cy="150" r="3.6"/><circle cx="100" cy="166" r="3.6"/></g>
      ${occhi(100, 84, .95)}${guance(100, 84, .95)}
      <path d="M100 92 L120 96 L100 99Z" fill="#f08c3a" stroke="#f08c3a" stroke-width="2" stroke-linejoin="round"/>`;

  tipi.star = () => `${ombra(100, 50)}
      ${gambette(100, 150, 16, 30)}
      <g filter="url(#pelo)">
        ${stellina(100, 102, 72, GOLD)}
        ${luce(84, 84, 36, 34)}
      </g>
      <g fill="#fff6d6"><circle cx="72" cy="94" r="2"/><circle cx="130" cy="88" r="2"/><circle cx="118" cy="132" r="2"/><circle cx="84" cy="128" r="1.6"/><circle cx="100" cy="60" r="1.8"/></g>
      ${faccina(100, 104, 1)}`;

  tipi.gingerbread = () => `${ombra(100, 50)}
      <g filter="url(#pelo)" stroke="#c8834e" stroke-linecap="round" fill="#c8834e">
        <line x1="56" y1="96" x2="144" y2="96" stroke-width="30"/>
        <line x1="88" y1="134" x2="74" y2="170" stroke-width="30"/>
        <line x1="112" y1="134" x2="126" y2="170" stroke-width="30"/>
        <rect x="72" y="72" width="56" height="74" rx="24" stroke="none"/>
        <circle cx="100" cy="54" r="30" stroke="none"/>
      </g>
      ${luce(88, 50, 22, 20)}
      <g stroke="${CREAM}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 88 l5 8 l-5 8"/><path d="M152 88 l-5 8 l5 8"/>
        <path d="M62 170 q12 6 24 0"/><path d="M114 170 q12 6 24 0"/>
      </g>
      <circle cx="100" cy="98" r="5" fill="${RED}"/><circle cx="100" cy="114" r="5" fill="${GREEN}"/><circle cx="100" cy="130" r="5" fill="${CREAM}"/>
      ${occhi(100, 50, .95)}
      <path d="M90 60 Q100 70 110 60" stroke="${CREAM}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="80" cy="60" rx="5" ry="3.2" fill="#e8807a" opacity=".7"/><ellipse cx="120" cy="60" rx="5" ry="3.2" fill="#e8807a" opacity=".7"/>`;

  // Corpo seduto generico per gli animali
  const corpoSeduto = (col, pancia, zampe = col) => `
      <ellipse cx="78" cy="172" rx="17" ry="11" fill="${zampe}"/>
      <ellipse cx="122" cy="172" rx="17" ry="11" fill="${zampe}"/>
      <ellipse cx="100" cy="138" rx="44" ry="40" fill="${col}"/>
      ${pancia ? `<ellipse cx="100" cy="146" rx="26" ry="24" fill="${pancia}"/>` : ''}
      <ellipse cx="64" cy="134" rx="11" ry="23" transform="rotate(18 64 134)" fill="${col}"/>
      <ellipse cx="136" cy="134" rx="11" ry="23" transform="rotate(-18 136 134)" fill="${col}"/>`;

  tipi.reindeer = () => `${ombra(100, 58)}
      <g stroke="#e5cfaa" stroke-width="8" stroke-linecap="round" fill="none" filter="url(#pelo)">
        <path d="M80 54 C72 34 62 26 52 14"/><path d="M68 34 L54 36"/><path d="M60 24 L64 10"/>
        <path d="M120 54 C128 34 138 26 148 14"/><path d="M132 34 L146 36"/><path d="M140 24 L136 10"/>
      </g>
      <g filter="url(#pelo)">
        ${corpoSeduto('#a7744c', '#ead5b6', '#8e603d')}
        <ellipse cx="58" cy="70" rx="20" ry="9" transform="rotate(-24 58 70)" fill="#a7744c"/>
        <ellipse cx="142" cy="70" rx="20" ry="9" transform="rotate(24 142 70)" fill="#a7744c"/>
        <ellipse cx="58" cy="70" rx="12" ry="4.5" transform="rotate(-24 58 70)" fill="#ead5b6"/>
        <ellipse cx="142" cy="70" rx="12" ry="4.5" transform="rotate(24 142 70)" fill="#ead5b6"/>
        <circle cx="100" cy="84" r="38" fill="#b07d54"/>
        <ellipse cx="100" cy="100" rx="22" ry="16" fill="#ead5b6"/>
        ${luce(88, 70, 26, 22)}
      </g>
      ${sciarpa(100, 112, 62, GREEN, CREAM)}
      ${occhi(100, 80, 1, 14)}
      <circle cx="100" cy="96" r="8.5" fill="${RED}"/><circle cx="97" cy="93" r="2.4" fill="#fff" opacity=".7"/>
      <path d="M95 106 Q100 110 105 106" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;

  tipi.polarbear = () => `${ombra(100, 60)}
      <g filter="url(#pelo)">
        ${corpoSeduto('#f6f2ea', null, '#efe8dc')}
        <ellipse cx="78" cy="174" rx="8" ry="5" fill="#e3d7c6"/><ellipse cx="122" cy="174" rx="8" ry="5" fill="#e3d7c6"/>
        <circle cx="68" cy="54" r="14" fill="#f6f2ea"/><circle cx="132" cy="54" r="14" fill="#f6f2ea"/>
        <circle cx="68" cy="54" r="7" fill="#e9dccb"/><circle cx="132" cy="54" r="7" fill="#e9dccb"/>
        <circle cx="100" cy="84" r="40" fill="#f8f5ef"/>
        <circle cx="100" cy="84" r="40" fill="url(#ombra-int)"/>
        <ellipse cx="100" cy="100" rx="19" ry="14" fill="#fffdf8"/>
      </g>
      ${sciarpa(100, 116, 70, GREEN, CREAM)}
      ${occhi(100, 80, 1, 15)}${guance(100, 82, 1, 15)}
      <ellipse cx="100" cy="94" rx="6.5" ry="4.8" fill="${INK}"/>
      <path d="M100 98 v4 M94 104 Q100 108 106 104" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;

  tipi.penguin = () => `${ombra(100, 52)}
      <ellipse cx="82" cy="176" rx="15" ry="7" fill="#f2a65a"/><ellipse cx="118" cy="176" rx="15" ry="7" fill="#f2a65a"/>
      <g filter="url(#pelo)">
        <ellipse cx="50" cy="122" rx="12" ry="32" transform="rotate(22 50 122)" fill="#4b5668"/>
        <ellipse cx="150" cy="122" rx="12" ry="32" transform="rotate(-22 150 122)" fill="#4b5668"/>
        <ellipse cx="100" cy="110" rx="52" ry="66" fill="#56627a"/>
        <path d="M100 58 C70 58 62 84 64 116 C66 152 80 170 100 170 C120 170 134 152 136 116 C138 84 130 58 100 58Z" fill="#fbf8f2"/>
        ${luce(80, 76, 30, 30)}
      </g>
      ${occhi(100, 86, 1, 14)}${guance(100, 88, 1, 14)}
      <path d="M92 96 L108 96 L100 106Z" fill="#f2a65a" stroke="#f2a65a" stroke-width="3" stroke-linejoin="round"/>
      ${sciarpa(100, 114, 78, RED, CREAM)}
      <path d="M70 44 Q100 18 130 44Z" fill="${RED}"/><rect x="66" y="40" width="68" height="10" rx="5" fill="${CREAM}"/><circle cx="100" cy="24" r="8" fill="${CREAM}"/>`;

  tipi.fox = () => `${ombra(100, 64)}
      <g filter="url(#pelo)">
        <path d="M128 168 C176 172 184 120 162 96 C150 84 140 96 150 110 C162 128 150 152 126 150Z" fill="#e9dfd1"/>
        <path d="M162 96 C150 84 140 96 150 110 C146 100 152 92 162 96Z" fill="#fffdf9"/>
        ${corpoSeduto('#f8f4ee', '#fffdf9', '#ece4d8')}
        <path d="M62 66 L56 22 L90 52Z" fill="#f4eee6"/><path d="M138 66 L144 22 L110 52Z" fill="#f4eee6"/>
        <path d="M66 58 L62 32 L82 52Z" fill="#f6c6c9"/><path d="M134 58 L138 32 L118 52Z" fill="#f6c6c9"/>
        <path d="M58 76 C58 50 80 44 100 44 C120 44 142 50 142 76 C142 96 120 116 100 120 C80 116 58 96 58 76Z" fill="#faf7f2"/>
        <path d="M70 92 C84 96 92 104 100 120 C108 104 116 96 130 92 C126 108 114 118 100 120 C86 118 74 108 70 92Z" fill="#fffefb"/>
        ${luce(86, 66, 26, 20)}
      </g>
      ${occhi(100, 80, 1, 15)}${guance(100, 82, 1, 15)}
      <ellipse cx="100" cy="104" rx="5.5" ry="4" fill="${INK}"/>
      <path d="M95 110 Q100 114 105 110" stroke="${INK}" stroke-width="1.7" fill="none" stroke-linecap="round"/>
      <path d="M78 128 L100 140 L122 128" stroke="${RED}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="100" cy="142" r="5" fill="${GOLD}"/>`;

  tipi.owl = () => `${ombra(100, 50)}
      <ellipse cx="86" cy="174" rx="9" ry="6" fill="#e8a45a"/><ellipse cx="114" cy="174" rx="9" ry="6" fill="#e8a45a"/>
      <g filter="url(#pelo)">
        <path d="M58 52 L66 30 L80 46Z" fill="#f1ece4"/><path d="M142 52 L134 30 L120 46Z" fill="#f1ece4"/>
        <ellipse cx="100" cy="108" rx="60" ry="66" fill="#faf7f1"/>
        <ellipse cx="46" cy="118" rx="14" ry="36" transform="rotate(12 46 118)" fill="#ebe4d8"/>
        <ellipse cx="154" cy="118" rx="14" ry="36" transform="rotate(-12 154 118)" fill="#ebe4d8"/>
        ${luce(82, 82, 34, 30)}
      </g>
      <g stroke="#a9a196" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8">
        <path d="M78 128 l4 4 l4 -4"/><path d="M98 138 l4 4 l4 -4"/><path d="M118 128 l4 4 l4 -4"/><path d="M86 152 l4 4 l4 -4"/><path d="M110 152 l4 4 l4 -4"/><path d="M68 148 l4 4 l4 -4"/><path d="M126 148 l4 4 l4 -4"/>
      </g>
      <circle cx="80" cy="88" r="17" fill="#efe8dd"/><circle cx="120" cy="88" r="17" fill="#efe8dd"/>
      ${occhi(100, 88, 1.5, 13.4)}
      <path d="M94 100 L106 100 L100 112Z" fill="#e8a45a" stroke="#e8a45a" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="68" cy="106" rx="6" ry="3.5" fill="${CHEEK}" opacity=".55"/><ellipse cx="132" cy="106" rx="6" ry="3.5" fill="${CHEEK}" opacity=".55"/>`;

  tipi.bunny = () => `${ombra(100, 50)}
      <g filter="url(#pelo)">
        <ellipse cx="80" cy="44" rx="14" ry="38" transform="rotate(-14 80 44)" fill="#efe1cf"/>
        <ellipse cx="120" cy="44" rx="14" ry="38" transform="rotate(14 120 44)" fill="#efe1cf"/>
        <ellipse cx="80" cy="46" rx="7" ry="28" transform="rotate(-14 80 46)" fill="#f6c7c4"/>
        <ellipse cx="120" cy="46" rx="7" ry="28" transform="rotate(14 120 46)" fill="#f6c7c4"/>
        <rect x="70" y="148" width="20" height="34" rx="10" transform="rotate(14 80 148)" fill="#e9d9c4"/>
        <rect x="110" y="148" width="20" height="34" rx="10" transform="rotate(-14 120 148)" fill="#e9d9c4"/>
        <ellipse cx="100" cy="146" rx="34" ry="32" fill="#efe1cf"/>
        <rect x="58" y="118" width="16" height="44" rx="8" transform="rotate(16 66 118)" fill="#e9d9c4"/>
        <rect x="126" y="118" width="16" height="44" rx="8" transform="rotate(-16 134 118)" fill="#e9d9c4"/>
        <circle cx="100" cy="94" r="36" fill="#f2e6d6"/>
        ${luce(88, 82, 24, 22)}
      </g>
      ${faccina(100, 94, 1, { gap: 13 })}
      <path d="M97 98 L103 98 L100 101Z" fill="#e79a9a"/>
      <path d="M100 128 C84 116 74 124 78 134 C82 142 94 134 100 128Z" fill="${RED}"/>
      <path d="M100 128 C116 116 126 124 122 134 C118 142 106 134 100 128Z" fill="${RED}"/>
      <path d="M98 130 L88 150 L96 148Z M102 130 L112 150 L104 148Z" fill="${RED_D}"/>
      <circle cx="100" cy="129" r="6" fill="${RED_D}"/>`;

  tipi.bear = () => `${ombra(100, 60)}
      <g filter="url(#pelo)">
        <ellipse cx="78" cy="172" rx="17" ry="11" fill="#9a6944"/><ellipse cx="122" cy="172" rx="17" ry="11" fill="#9a6944"/>
        <ellipse cx="78" cy="174" rx="8" ry="5" fill="#d9b48f"/><ellipse cx="122" cy="174" rx="8" ry="5" fill="#d9b48f"/>
        <ellipse cx="100" cy="138" rx="45" ry="40" fill="${RED}"/>
        <ellipse cx="62" cy="134" rx="12" ry="24" transform="rotate(18 62 134)" fill="${RED}"/>
        <ellipse cx="138" cy="134" rx="12" ry="24" transform="rotate(-18 138 134)" fill="${RED}"/>
        <circle cx="56" cy="152" r="10" fill="#9a6944"/><circle cx="144" cy="152" r="10" fill="#9a6944"/>
        <circle cx="66" cy="52" r="15" fill="#a3714b"/><circle cx="134" cy="52" r="15" fill="#a3714b"/>
        <circle cx="66" cy="52" r="7.5" fill="#d9b48f"/><circle cx="134" cy="52" r="7.5" fill="#d9b48f"/>
        <circle cx="100" cy="84" r="40" fill="#a8774f"/>
        <ellipse cx="100" cy="100" rx="20" ry="15" fill="#dcb893"/>
        ${luce(86, 70, 26, 22)}
      </g>
      <rect x="62" y="114" width="76" height="11" rx="5.5" fill="${RED_D}"/>
      <g stroke="${CREAM}" stroke-width="2.4" stroke-linecap="round">
        <path d="M70 140 l8 8 m0 -8 l-8 8 M74 138 v12 M68 144 h12"/>
        <path d="M95 148 l10 10 m0 -10 l-10 10 M100 146 v14 M93 153 h14"/>
        <path d="M122 140 l8 8 m0 -8 l-8 8 M126 138 v12 M120 144 h12"/>
      </g>
      <path d="M62 166 h76" stroke="${CREAM}" stroke-width="3" stroke-dasharray="4 5" stroke-linecap="round"/>
      ${occhi(100, 80, 1, 15)}${guance(100, 82, 1, 15)}
      <ellipse cx="100" cy="95" rx="7" ry="5" fill="${INK}"/>
      <path d="M100 100 v4 M94 105 Q100 109 106 105" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;

  tipi.mouse = () => `${ombra(100, 52)}
      <path d="M140 166 C176 168 180 136 160 130 C148 126 146 142 158 144" stroke="#f0b3b9" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g filter="url(#pelo)">
        ${corpoSeduto('#d9d2cb', '#ece7e1', '#cfc7bf')}
        <circle cx="62" cy="64" r="26" fill="#d9d2cb"/><circle cx="138" cy="64" r="26" fill="#d9d2cb"/>
        <circle cx="62" cy="64" r="17" fill="#f5b9c0"/><circle cx="138" cy="64" r="17" fill="#f5b9c0"/>
        <ellipse cx="100" cy="94" rx="34" ry="32" fill="#dfd9d2"/>
        ${luce(88, 84, 22, 18)}
      </g>
      ${cappelloBabbo(100, 72, 52)}
      ${occhi(100, 92, .95, 13)}${guance(100, 94, .95, 13)}
      <ellipse cx="100" cy="104" rx="4.5" ry="3.4" fill="#e98c99"/>
      <path d="M96 109 Q100 112 104 109" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <g stroke="#a39a91" stroke-width="1.3" stroke-linecap="round"><path d="M86 104 l-16 -3 M86 108 l-16 3 M114 104 l16 -3 M114 108 l16 3"/></g>`;

  /* ---------- wrapper pubblico ---------- */
  const peluche = (tipo, colori, extra = '') => {
    const fn = tipi[tipo] || tipi.bauble;
    return `<svg class="plush-svg" viewBox="0 0 200 200" ${extra} aria-hidden="true" focusable="false">${fn(colori || {})}</svg>`;
  };

  // Peluche annidato in un'altra scena (x, y, dimensione)
  const inScena = (tipo, x, y, size, colori) =>
    `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 200 200">${(tipi[tipo] || tipi.bauble)(colori || {})}</svg>`;

  const pacchetto = (x, y, w, h, col, nastro) => `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${col}"/>
      <rect x="${x - 4}" y="${y - 10}" width="${w + 8}" height="16" rx="5" fill="${col}"/>
      <rect x="${x + w / 2 - 6}" y="${y - 10}" width="12" height="${h + 10}" fill="${nastro}"/>
      <path d="M${x + w / 2} ${y - 10} C${x + w / 2 - 26} ${y - 34} ${x + w / 2 - 30} ${y - 8} ${x + w / 2} ${y - 10} C${x + w / 2 + 26} ${y - 34} ${x + w / 2 + 30} ${y - 8} ${x + w / 2} ${y - 10}Z" fill="${nastro}"/>
    </g>`;

  /* ---------- peluche accanto a un pacchetto regalo ---------- */
  const confezioneRegalo = (tipo, colori) => `
    <svg class="plush-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="184" rx="84" ry="8" fill="#3b2a20" opacity=".1"/>
      ${pacchetto(108, 126, 72, 56, RED, GOLD)}
      <path d="M118 150 l10 0 M150 150 l12 0" stroke="#fff" stroke-width="2" opacity=".4" stroke-linecap="round"/>
      <rect x="22" y="156" width="40" height="26" rx="4" fill="${GREEN}"/><rect x="38" y="156" width="8" height="26" fill="${CREAM}"/>
      ${inScena(tipo, 14, 34, 128, colori)}
      ${stellina(170, 40, 8)}${stellina(30, 30, 6, '#8fc3e8')}
    </svg>`;

  /* ---------- scena principale (hero) ---------- */
  const scenaHero = () => {
    let lucine = '';
    const colori = [RED, GOLD, '#8fc3e8', GREEN, '#f6a6c1'];
    const punti = [[248, 130], [276, 150], [306, 160], [336, 156], [362, 140], [226, 218], [256, 240], [292, 252], [330, 254], [366, 244], [394, 226], [206, 312], [240, 334], [282, 346], [326, 348], [370, 340], [410, 322]];
    punti.forEach(([x, y], i) => { lucine += `<circle cx="${x}" cy="${y}" r="7" fill="${colori[i % colori.length]}"/><circle cx="${x - 2}" cy="${y - 2}" r="2.2" fill="#fff" opacity=".7"/>`; });
    let neve = '';
    for (let i = 0; i < 46; i++) {
      const x = (i * 137.5) % 600, y = (i * 61.3) % 300, r = 1.5 + (i % 4);
      neve += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="#fff" opacity="${.5 + (i % 3) * .15}"/>`;
    }
    return `<svg class="hero-scene" viewBox="0 0 600 480" role="img" aria-label="Illustrazione: peluche natalizi attorno a un grande albero di Natale innevato">
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe2f1"/><stop offset="1" stop-color="#eef5fb"/></linearGradient>
      </defs>
      <rect x="0" y="0" width="600" height="480" rx="36" fill="url(#cielo)"/>
      <circle cx="500" cy="80" r="38" fill="#fff8e1"/><circle cx="500" cy="80" r="56" fill="#fff8e1" opacity=".35"/>
      ${stellina(90, 70, 9, '#fff')}${stellina(420, 46, 7, '#fff')}${stellina(560, 170, 6, '#fff')}${stellina(40, 190, 6, '#fff')}
      <path d="M0 330 C120 290 220 320 320 300 C420 280 500 300 600 280 L600 480 L0 480Z" fill="#f7fbff"/>
      <path d="M0 380 C140 350 260 380 380 360 C470 346 540 352 600 340 L600 480 L0 480Z" fill="#ffffff"/>
      <!-- grande abete -->
      <rect x="296" y="360" width="28" height="40" rx="6" fill="#8a5d3d"/>
      <path d="M310 70 L410 370 Q310 392 210 370Z" fill="#3f8a62"/>
      <path d="M310 70 L380 250 Q310 266 240 250Z" fill="#4f9a73"/>
      <path d="M310 70 L352 160 Q310 172 268 160Z" fill="#5fae84"/>
      <path d="M232 228 Q310 270 392 222 M216 310 Q310 360 410 300" stroke="${CREAM}" stroke-width="4" fill="none" stroke-dasharray="2 10" stroke-linecap="round"/>
      ${lucine}
      ${stellina(310, 66, 24)}
      <!-- regali -->
      ${pacchetto(150, 380, 56, 44, RED, GOLD)}
      ${pacchetto(408, 386, 48, 38, '#8fc3e8', CREAM)}
      ${pacchetto(462, 398, 40, 28, GOLD, RED)}
      <!-- peluche -->
      ${inScena('reindeer', 20, 270, 170)}
      ${inScena('polarbear', 400, 280, 160)}
      ${inScena('pudding', 210, 360, 100)}
      ${inScena('penguin', 318, 372, 96)}
      ${inScena('bauble', 520, 380, 80)}
      ${neve}
    </svg>`;
  };

  /* ---------- piccole illustrazioni e icone ---------- */
  const fiocco = (size = 24, col = 'currentColor') => `
    <svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round">
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7"/>
      <path d="M9.5 3.5L12 6l2.5-2.5M9.5 20.5L12 18l2.5 2.5M3.6 10.2l3.4-.9-.9-3.4M20.4 13.8l-3.4.9.9 3.4M6.1 18.1l.9-3.4-3.4-.9M17.9 5.9l-.9 3.4 3.4.9"/>
    </svg>`;

  const icone = {
    slitta: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 32h28c4 0 7-3 7-7v-3" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M4 38h30c5 0 8-2 10-6" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><rect x="10" y="14" width="18" height="14" rx="3" fill="${RED}"/><path d="M19 14v14M10 21h18" stroke="${GOLD}" stroke-width="2.4"/><path d="M19 14c-4-6-8-2-4 0M19 14c4-6 8-2 4 0" fill="none" stroke="${GOLD}" stroke-width="2.2"/></svg>`,
    regalo: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="20" width="30" height="20" rx="3" fill="${GREEN}"/><rect x="7" y="14" width="34" height="8" rx="3" fill="#5fae84"/><path d="M24 14v26" stroke="${RED}" stroke-width="4"/><path d="M24 14c-7-10-15-3-6 0M24 14c7-10 15-3 6 0" fill="none" stroke="${RED}" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    cuore: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 40S7 30 7 18c0-6 4-10 9-10 4 0 6.5 2.5 8 5 1.5-2.5 4-5 8-5 5 0 9 4 9 10 0 12-17 22-17 22z" fill="#f3a0a0"/><path d="M14 17c0-3 2-5 4-5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/></svg>`,
    stella: `<svg viewBox="0 0 48 48" aria-hidden="true">${stellina(24, 25, 17, GOLD)}</svg>`,
    reso: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 20a13 13 0 1 1 1 13" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M8 12v9h9" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="25" cy="24" r="5" fill="${RED}"/></svg>`
  };

  const letteraBabbo = () => `
    <svg viewBox="0 0 240 180" class="lettera" aria-hidden="true">
      <g transform="rotate(-6 120 90)">
        <rect x="30" y="40" width="180" height="116" rx="10" fill="${CREAM}" stroke="#e8dccb" stroke-width="2"/>
        <path d="M30 50 L120 110 L210 50" fill="none" stroke="#e8dccb" stroke-width="2.5"/>
        <rect x="166" y="52" width="32" height="38" rx="3" fill="#fff" stroke="${RED}" stroke-width="2" stroke-dasharray="3 3"/>
        ${stellina(182, 71, 9)}
        <path d="M120 112 C104 98 92 112 104 122 L120 134 L136 122 C148 112 136 98 120 112Z" fill="${RED}"/>
        <path d="M52 132 h50 M52 142 h36" stroke="#cbbba5" stroke-width="3" stroke-linecap="round"/>
      </g>
      ${stellina(28, 30, 8)}${stellina(222, 150, 7, '#8fc3e8')}
    </svg>`;

  const ghirlandaSvg = () => {
    const c = [RED, GOLD, GREEN, '#8fc3e8'];
    let g = '';
    const ys = [14.5, 14.5, 5.5, 5.5];
    for (let i = 0; i < 4; i++) {
      const x = 15 + i * 30, y = ys[i];
      g += `<rect x="${x - 2.5}" y="${y}" width="5" height="5" rx="1" fill="#5c6b5f"/><ellipse cx="${x}" cy="${y + 13}" rx="6" ry="9" fill="${c[i]}"/>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="44" viewBox="0 0 120 44"><path d="M0 10 Q30 22 60 10 T120 10" stroke="#3b5c48" stroke-width="2" fill="none"/>${g}</svg>`;
  };

  return { defs, peluche, confezioneRegalo, scenaHero, fiocco, icone, letteraBabbo, ghirlandaSvg, pacchetto, stellina, tipi };
})();
