/* ============================================================================
   INSTRUMENTOS.JS — Componentes interactivos de la práctica
   1. Dcl        : diagrama de cuerpo libre del carro sobre el plano
   2. Montaje    : carril de aire con puntos sensibles
   3. Simulador  : el carro bajando por el carril, con las dos fotoceldas
   4. Analisis   : promedios, velocidades, Tablas 4 a 6, gráficas y gravedad
   ========================================================================== */

const SIN_MOVIMIENTO = window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fmt(x, d){ return Number(x).toFixed(d).replace('.', ','); }

function leerNum(id){
  const el = document.getElementById(id);
  if (!el) return null;
  const n = parseFloat(String(el.value).replace(/\s/g, '').replace(',', '.'));
  return isFinite(n) ? n : null;
}

/* ==========================================================================
   1. DIAGRAMA DE CUERPO LIBRE
   ========================================================================== */
const Dcl = (() => {
  const ANG = 26;                                   // grados, exagerado para que se vea
  const rad = ANG * Math.PI / 180;
  const VX = 96, VY = 302, LARGO = 456;             // vértice del ángulo y longitud de la base

  function flecha(x1, y1, x2, y2, color, ancho){
    const a = Math.atan2(y2 - y1, x2 - x1), p = 10;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
              stroke="${color}" stroke-width="${ancho}"/>
            <path d="M ${(x2 - p*Math.cos(a-0.38)).toFixed(1)} ${(y2 - p*Math.sin(a-0.38)).toFixed(1)}
                     L ${x2.toFixed(1)} ${y2.toFixed(1)}
                     L ${(x2 - p*Math.cos(a+0.38)).toFixed(1)} ${(y2 - p*Math.sin(a+0.38)).toFixed(1)}"
              fill="none" stroke="${color}" stroke-width="${ancho}"
              stroke-linejoin="round" stroke-linecap="round"/>`;
  }

  function montar(id){
    const host = document.getElementById(id);
    if (!host) return;

    /* El plano sube hacia la derecha: la cuesta abajo apunta a la izquierda. */
    const ux = -Math.cos(rad), uy =  Math.sin(rad);   // versor cuesta abajo
    const nx =  Math.sin(rad), ny =  Math.cos(rad);   // versor hacia dentro del plano

    const xCarro = VX + 248;
    const ySup   = VY - (xCarro - VX) * Math.tan(rad);
    const cx = xCarro - nx * 17, cy = ySup - ny * 17; // centro del carro, apoyado encima

    const PESO = 118;                                 // longitud del vector peso
    const par  = PESO * Math.sin(rad);                // componente paralela
    const per  = PESO * Math.cos(rad);                // componente perpendicular

    const pT = { x: cx,            y: cy + PESO };            // punta del peso
    const aT = { x: cx + par * ux, y: cy + par * uy };        // punta de la paralela
    const bT = { x: cx + per * nx, y: cy + per * ny };        // punta de la perpendicular
    const nT = { x: cx - per * nx, y: cy - per * ny };        // punta de la normal

    host.innerHTML = `
    <svg viewBox="46 48 594 282" role="img"
         aria-label="Diagrama de cuerpo libre: peso, normal y las dos componentes del peso sobre el plano inclinado">

      <!-- plano -->
      <path d="M ${VX} ${VY} L ${VX + LARGO} ${VY} L ${VX + LARGO} ${(VY - LARGO*Math.tan(rad)).toFixed(1)} Z"
            fill="#E5DBC1" stroke="#1F1C17" stroke-width="2.4" stroke-linejoin="round"/>

      <!-- ángulo -->
      <path d="M ${VX + 86} ${VY} A 86 86 0 0 0 ${(VX + 86*Math.cos(rad)).toFixed(1)} ${(VY - 86*Math.sin(rad)).toFixed(1)}"
            fill="none" stroke="#C87020" stroke-width="2"/>
      <text x="${VX + 96}" y="${VY - 12}" class="m-et" fill="#C87020">θ</text>

      <!-- carro apoyado sobre el plano -->
      <g transform="rotate(${-ANG} ${cx.toFixed(1)} ${cy.toFixed(1)})">
        <rect x="${(cx-34).toFixed(1)}" y="${(cy-13).toFixed(1)}" width="68" height="26" rx="4"
              fill="#D6DEE9" stroke="#0C2B52" stroke-width="2.4"/>
        <rect x="${(cx-4).toFixed(1)}" y="${(cy-31).toFixed(1)}" width="8" height="18" fill="#1F1C17"/>
      </g>

      <!-- construcción de la descomposición -->
      <line x1="${aT.x.toFixed(1)}" y1="${aT.y.toFixed(1)}" x2="${pT.x.toFixed(1)}" y2="${pT.y.toFixed(1)}"
            stroke="#8A8171" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="${bT.x.toFixed(1)}" y1="${bT.y.toFixed(1)}" x2="${pT.x.toFixed(1)}" y2="${pT.y.toFixed(1)}"
            stroke="#8A8171" stroke-width="1" stroke-dasharray="4 3"/>

      <!-- vectores -->
      ${flecha(cx, cy, pT.x, pT.y, '#A62F26', 3.2)}
      <text x="${(pT.x + 10).toFixed(1)}" y="${(pT.y + 4).toFixed(1)}" class="m-et" fill="#A62F26">m·g</text>

      ${flecha(cx, cy, aT.x, aT.y, '#C87020', 3)}
      <text x="${(aT.x - 10).toFixed(1)}" y="${(aT.y + 18).toFixed(1)}" class="m-et" fill="#C87020"
            text-anchor="end">m·g·sen θ</text>

      ${flecha(cx, cy, bT.x, bT.y, '#8A8171', 2.4)}
      <text x="${(bT.x + 10).toFixed(1)}" y="${(bT.y + 14).toFixed(1)}" class="m-lab">m·g·cos θ</text>

      ${flecha(cx, cy, nT.x, nT.y, '#0C2B52', 3.2)}
      <text x="${(nT.x + 8).toFixed(1)}" y="${(nT.y - 6).toFixed(1)}" class="m-et">N</text>

      <!-- resumen -->
      <rect x="392" y="60" width="234" height="80" rx="6" fill="#D6DEE9" stroke="#0C2B52" stroke-width="1.6"/>
      <text x="509" y="84" class="m-lab" text-anchor="middle">fuerza neta sobre el carro</text>
      <text x="509" y="108" class="m-et" text-anchor="middle">F = m·g·sen θ</text>
      <text x="509" y="130" class="m-lab" text-anchor="middle">⟹   a = g·sen θ</text>
    </svg>
    <div class="montaje__leyenda">
      <b>Solo dos fuerzas.</b> El peso, vertical, y la normal, perpendicular al plano. Al
      descomponer el peso en las direcciones paralela y perpendicular, la componente perpendicular
      queda equilibrada por la normal y la paralela no queda compensada por nada: esa es la fuerza
      neta, y apunta plano abajo. El ángulo del dibujo está exagerado; en el carril real es de uno
      o dos grados.
    </div>`;
  }
  return { montar };
})();

/* ==========================================================================
   2. CARRIL DE AIRE CON PUNTOS SENSIBLES
   ========================================================================== */
const Montaje = (() => {
  const ANG = 14, rad = ANG * Math.PI / 180;
  const X0 = 110, X1 = 578, YBASE = 322;             // extremo bajo (izq.) y alto (der.)
  const Y0 = YBASE, Y1 = YBASE - (X1 - X0) * Math.tan(rad);

  const sobre = f => ({ x: X0 + (X1 - X0) * f, y: Y0 + (Y1 - Y0) * f });
  const nx = Math.sin(rad), ny = -Math.cos(rad);     // normal al carril, hacia fuera

  function montar(id){
    const host = document.getElementById(id);
    if (!host) return;

    /* El carro parte del extremo alto (derecha) y baja hacia la izquierda, de modo
       que la primera fotocelda que cruza es la que está más arriba. */
    const carro = sobre(0.88), g1 = sobre(0.66), g2 = sobre(0.34);

    const celda = (p, n) => `
      <g>
        <rect x="${(p.x + nx*9 - 7).toFixed(1)}" y="${(p.y + ny*9 - 30).toFixed(1)}" width="14" height="30"
              rx="2" fill="#5A5346" stroke="#1F1C17" stroke-width="1.6"/>
        <circle cx="${(p.x + nx*9).toFixed(1)}" cy="${(p.y + ny*9 - 24).toFixed(1)}" r="3.4" fill="#C0272D"/>
        <text x="${(p.x - 4).toFixed(1)}" y="${(p.y + ny*9 - 38).toFixed(1)}" class="m-lab"
              text-anchor="middle">fotocelda ${n}</text>
      </g>`;

    host.innerHTML = `
    <svg viewBox="18 36 672 396" role="img"
         aria-label="Carril de aire inclinado con el carro, las dos fotoceldas, los bloques y las alturas">

      <!-- mesa -->
      <rect x="46" y="380" width="580" height="15" fill="#8F8C80" stroke="#1F1C17" stroke-width="2"/>
      <text x="300" y="414" class="m-lab" text-anchor="middle">mesa</text>

      <!-- soportes -->
      <rect x="${X0 + 4}" y="${(Y0 + 5).toFixed(1)}" width="9" height="${(380 - Y0 - 5).toFixed(1)}"
            fill="#A8A497" stroke="#1F1C17" stroke-width="1.6"/>
      <rect x="${X1 - 24}" y="${(Y1 + 5).toFixed(1)}" width="9" height="${(352 - Y1 - 5).toFixed(1)}"
            fill="#A8A497" stroke="#1F1C17" stroke-width="1.6"/>

      <!-- bloques de aluminio -->
      <rect x="${X1 - 48}" y="352" width="56" height="14" fill="#BFBBAE" stroke="#1F1C17" stroke-width="1.6"/>
      <rect x="${X1 - 48}" y="366" width="56" height="14" fill="#BFBBAE" stroke="#1F1C17" stroke-width="1.6"/>
      <text x="${X1 - 58}" y="373" class="m-lab" text-anchor="end">bloques</text>

      <!-- carril -->
      <line x1="${X0}" y1="${Y0.toFixed(1)}" x2="${X1}" y2="${Y1.toFixed(1)}"
            stroke="#1F1C17" stroke-width="15" stroke-linecap="round"/>
      <line x1="${X0}" y1="${Y0.toFixed(1)}" x2="${X1}" y2="${Y1.toFixed(1)}"
            stroke="#CFCABB" stroke-width="10" stroke-linecap="round"/>
      <text x="${(sobre(0.10).x - nx*18).toFixed(1)}" y="${(sobre(0.10).y - ny*18).toFixed(1)}"
            class="m-lab" text-anchor="start"
            transform="rotate(${-ANG} ${(sobre(0.10).x - nx*18).toFixed(1)} ${(sobre(0.10).y - ny*18).toFixed(1)})">carril de aire</text>

      <!-- carro con bandera -->
      <g transform="rotate(${-ANG} ${carro.x.toFixed(1)} ${carro.y.toFixed(1)})">
        <rect x="${(carro.x - 24).toFixed(1)}" y="${(carro.y - 21).toFixed(1)}" width="48" height="16" rx="3"
              fill="#D6DEE9" stroke="#0C2B52" stroke-width="2.2"/>
        <rect x="${(carro.x - 3).toFixed(1)}" y="${(carro.y - 39).toFixed(1)}" width="6" height="18" fill="#1F1C17"/>
      </g>
      <text x="${(carro.x + 6).toFixed(1)}" y="${(carro.y - 52).toFixed(1)}" class="m-lab" text-anchor="middle">carro y bandera</text>
      <path d="M ${(carro.x - 54).toFixed(1)} ${(carro.y + 22).toFixed(1)} l -26 7 l 9 -12"
            fill="none" stroke="#C87020" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      <text x="${(carro.x - 60).toFixed(1)}" y="${(carro.y + 42).toFixed(1)}" class="m-lab" text-anchor="middle">baja</text>

      <!-- peso -->
      <line x1="${carro.x.toFixed(1)}" y1="${(carro.y + 8).toFixed(1)}"
            x2="${carro.x.toFixed(1)}" y2="${(carro.y + 52).toFixed(1)}" stroke="#A62F26" stroke-width="2.6"/>
      <path d="M ${(carro.x - 6).toFixed(1)} ${(carro.y + 44).toFixed(1)} L ${carro.x.toFixed(1)} ${(carro.y + 56).toFixed(1)} L ${(carro.x + 6).toFixed(1)} ${(carro.y + 44).toFixed(1)}"
            fill="none" stroke="#A62F26" stroke-width="2.4" stroke-linejoin="round"/>
      <text x="${(carro.x + 24).toFixed(1)}" y="${(carro.y + 50).toFixed(1)}" class="m-et"
            text-anchor="start" fill="#A62F26">m·g</text>

      <!-- fotoceldas -->
      ${celda(g1, 1)}
      ${celda(g2, 2)}

      <!-- distancia D -->
      <line x1="${(g1.x + nx*88).toFixed(1)}" y1="${(g1.y + ny*88).toFixed(1)}"
            x2="${(g2.x + nx*88).toFixed(1)}" y2="${(g2.y + ny*88).toFixed(1)}"
            stroke="#C87020" stroke-width="2.4"/>
      <line x1="${g1.x.toFixed(1)}" y1="${g1.y.toFixed(1)}" x2="${(g1.x + nx*94).toFixed(1)}" y2="${(g1.y + ny*94).toFixed(1)}"
            stroke="#C87020" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="${g2.x.toFixed(1)}" y1="${g2.y.toFixed(1)}" x2="${(g2.x + nx*94).toFixed(1)}" y2="${(g2.y + ny*94).toFixed(1)}"
            stroke="#C87020" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="${((g1.x + g2.x)/2 + nx*100).toFixed(1)}" y="${((g1.y + g2.y)/2 + ny*100).toFixed(1)}"
            class="m-et" fill="#C87020" text-anchor="middle">D</text>

      <!-- altura h_f -->
      <line x1="${X1 + 48}" y1="380" x2="${X1 + 48}" y2="${Y1.toFixed(1)}" stroke="#0C2B52" stroke-width="2.2"/>
      <path d="M ${X1 + 43} ${(Y1 + 10).toFixed(1)} L ${X1 + 48} ${Y1.toFixed(1)} L ${X1 + 53} ${(Y1 + 10).toFixed(1)}"
            fill="none" stroke="#0C2B52" stroke-width="2" stroke-linejoin="round"/>
      <path d="M ${X1 + 43} 370 L ${X1 + 48} 380 L ${X1 + 53} 370"
            fill="none" stroke="#0C2B52" stroke-width="2" stroke-linejoin="round"/>
      <line x1="${X1}" y1="${Y1.toFixed(1)}" x2="${X1 + 54}" y2="${Y1.toFixed(1)}"
            stroke="#8A8171" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="${X1 + 70}" y="${((Y1 + 380)/2 + 5).toFixed(1)}" class="m-et" text-anchor="start">h<tspan dy="5" font-size="11">f</tspan></text>

      <!-- altura h0 -->
      <line x1="${X0 - 40}" y1="380" x2="${X0 - 40}" y2="${(Y0 - 2).toFixed(1)}" stroke="#8A8171" stroke-width="2"/>
      <line x1="${X0 - 46}" y1="${(Y0 - 2).toFixed(1)}" x2="${X0}" y2="${(Y0 - 2).toFixed(1)}"
            stroke="#8A8171" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="${X0 - 48}" y="${((Y0 + 380)/2 + 5).toFixed(1)}" class="m-lab" text-anchor="end">h<tspan dy="4" font-size="10">0</tspan></text>

      <!-- ángulo -->
      <line x1="${X0}" y1="${Y0.toFixed(1)}" x2="${X1 - 10}" y2="${Y0.toFixed(1)}"
            stroke="#8A8171" stroke-width="1.1" stroke-dasharray="5 4"/>
      <path d="M ${X0 + 118} ${Y0.toFixed(1)} A 118 118 0 0 0 ${(X0 + 118*Math.cos(rad)).toFixed(1)} ${(Y0 - 118*Math.sin(rad)).toFixed(1)}"
            fill="none" stroke="#C87020" stroke-width="1.8"/>
      <text x="${X0 + 126}" y="${(Y0 - 11).toFixed(1)}" class="m-et" fill="#C87020">θ</text>

      <!-- puntos sensibles -->
      <g class="punto-caliente" data-parte="car" tabindex="0" role="button" aria-label="Carril de aire">
        <circle cx="${sobre(0.14).x.toFixed(1)}" cy="${sobre(0.14).y.toFixed(1)}" r="16" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="cro" tabindex="0" role="button" aria-label="Carro dinámico y bandera">
        <circle cx="${carro.x.toFixed(1)}" cy="${(carro.y - 14).toFixed(1)}" r="17" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="fot" tabindex="0" role="button" aria-label="Fotoceldas">
        <circle cx="${(g1.x + nx*9).toFixed(1)}" cy="${(g1.y + ny*9 - 16).toFixed(1)}" r="15" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="dis" tabindex="0" role="button" aria-label="Distancia entre fotoceldas">
        <circle cx="${((g1.x + g2.x)/2 + nx*94).toFixed(1)}" cy="${((g1.y + g2.y)/2 + ny*94).toFixed(1)}" r="16" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="blo" tabindex="0" role="button" aria-label="Bloques de aluminio">
        <circle cx="${X1 - 20}" cy="366" r="15" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="alt" tabindex="0" role="button" aria-label="Alturas h cero y h f">
        <circle cx="${X1 + 48}" cy="${((Y1 + 380)/2).toFixed(1)}" r="16" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="ang" tabindex="0" role="button" aria-label="Ángulo de inclinación">
        <circle cx="${X0 + 128}" cy="${(Y0 - 17).toFixed(1)}" r="15" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="pes" tabindex="0" role="button" aria-label="Peso y su componente">
        <circle cx="${carro.x.toFixed(1)}" cy="${(carro.y + 46).toFixed(1)}" r="15" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
    </svg>
    <div class="montaje__leyenda" id="montaje-leyenda" role="status" aria-live="polite">
      <b>Toca un punto naranja</b> para leer qué función cumple cada parte del montaje. El carro
      parte del extremo alto, de modo que cruza primero la fotocelda 1. El ángulo del dibujo está
      exagerado: en el carril real es de uno o dos grados.
    </div>`;

    const leyenda = host.querySelector('#montaje-leyenda');
    const mostrar = clave => {
      const p = PARTES.find(x => x.id === clave);
      if (p) leyenda.innerHTML = `<b>${esc(p.n)}.</b> ${esc(p.d)}`;
    };
    host.querySelectorAll('.punto-caliente').forEach(g => {
      g.addEventListener('click', () => mostrar(g.dataset.parte));
      g.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' '){ mostrar(g.dataset.parte); e.preventDefault(); }
      });
    });
  }
  return { montar };
})();

/* ==========================================================================
   3. SIMULADOR DEL PLANO INCLINADO
   ========================================================================== */
const Simulador = (() => {
  const VW = 660, VH = 502;
  const X0 = 70, X1 = 600, YPIV = 216;      // extremo bajo (izquierda) y alto (derecha)
  const YMESA = 286;
  const G = { l: 92, r: 30, t: 332, b: 48 };

  /* geometría física fija del simulador */
  const d = D_CARRIL, h0 = H0_MODELO, D = D_CELDAS, L = L_MODELO, s0 = S0_MODELO;

  let host, svg, hf = 0.0450, masa = 0.2050;
  let t = 0, estado = 'listo', anim = null, ultimo = 0;
  let marca1 = null, marca2 = null;

  const sen   = () => Math.max(0, (hf - h0) / d);
  const acel  = () => G_PEREIRA * sen();
  const angGr = () => Math.asin(Math.min(1, sen())) * 180 / Math.PI;
  const v     = s => Math.sqrt(2 * acel() * Math.max(0, s));
  const tCelda = s => (v(s) > 0 ? L / v(s) : 0);
  const sDe   = tt => 0.5 * acel() * tt * tt;              // recorrido desde la suelta
  const sFin  = s0 + D + 0.18;
  const tFin  = () => Math.sqrt(2 * sFin / Math.max(acel(), 1e-6));

  /* ángulo del dibujo: exagerado para que la inclinación se aprecie */
  const angDib = () => Math.min(16, 16 * sen() / 0.085) * Math.PI / 180;

  function dibujar(){
    const a = angDib();
    const yAlto = YPIV - (X1 - X0) * Math.tan(a);
    const sobre = f => ({ x: X0 + (X1 - X0) * f, y: YPIV + (yAlto - YPIV) * f });
    const nx = Math.sin(a), ny = -Math.cos(a);

    /* el carro parte del extremo alto y baja: f = 1 en la suelta */
    const sRec = Math.min(sDe(t), sFin);
    const fCarro = 1 - sRec / d;
    const fG1 = 1 - s0 / d, fG2 = 1 - (s0 + D) / d;
    const c = sobre(Math.max(0.02, fCarro)), p1 = sobre(fG1), p2 = sobre(fG2);

    const celda = (p, n, marca) => `
      <rect x="${(p.x + nx*9 - 6).toFixed(1)}" y="${(p.y + ny*9 - 26).toFixed(1)}" width="12" height="26"
            rx="2" fill="${marca !== null ? '#2F6B4A' : '#5A5346'}" stroke="#1F1C17" stroke-width="1.5"/>
      <circle cx="${(p.x + nx*9).toFixed(1)}" cy="${(p.y + ny*9 - 21).toFixed(1)}" r="3" fill="#C0272D"/>
      <text x="${p.x.toFixed(1)}" y="${(p.y + ny*9 - 32).toFixed(1)}" class="m-lab" text-anchor="middle">${n}</text>
      ${marca !== null ? `<text x="${p.x.toFixed(1)}" y="${(p.y + ny*9 - 46).toFixed(1)}" class="m-et"
            text-anchor="middle" fill="#2F6B4A">${fmt(marca,4)} s</text>` : ''}`;

    /* gráfica a frente a sen θ */
    const anchoG = VW - G.r - G.l, altoG = VH - G.b - G.t;
    const senMax = 0.085, aMax = G_PEREIRA * senMax;
    const pxG = s => G.l + s / senMax * anchoG;
    const pyG = aa => (VH - G.b) - aa / aMax * altoG;
    let rej = '';
    for (let i = 0; i <= 4; i++){
      const s = senMax * i / 4;
      rej += `<line class="g-rejilla" x1="${pxG(s).toFixed(1)}" y1="${G.t}" x2="${pxG(s).toFixed(1)}" y2="${VH - G.b}"/>
              <text class="g-num" x="${pxG(s).toFixed(1)}" y="${VH - G.b + 15}" text-anchor="middle">${fmt(s,3)}</text>`;
      const aa = aMax * i / 4;
      rej += `<line class="g-rejilla" x1="${G.l}" y1="${pyG(aa).toFixed(1)}" x2="${VW - G.r}" y2="${pyG(aa).toFixed(1)}"/>
              <text class="g-num" x="${G.l - 6}" y="${(pyG(aa) + 4).toFixed(1)}" text-anchor="end">${fmt(aa,2)}</text>`;
    }

    svg.innerHTML = `
      <!-- mesa -->
      <rect x="${X0 - 24}" y="${YMESA}" width="${X1 - X0 + 70}" height="12" fill="#8F8C80"
            stroke="#1F1C17" stroke-width="1.8"/>
      <rect x="${X0 + 2}" y="${YPIV + 4}" width="8" height="${YMESA - YPIV - 4}" fill="#A8A497"
            stroke="#1F1C17" stroke-width="1.4"/>
      <rect x="${X1 - 14}" y="${yAlto.toFixed(1)}" width="8" height="${(YMESA - yAlto).toFixed(1)}"
            fill="#A8A497" stroke="#1F1C17" stroke-width="1.4"/>

      <!-- carril -->
      <line x1="${X0}" y1="${YPIV}" x2="${X1}" y2="${yAlto.toFixed(1)}"
            stroke="#1F1C17" stroke-width="13" stroke-linecap="round"/>
      <line x1="${X0}" y1="${YPIV}" x2="${X1}" y2="${yAlto.toFixed(1)}"
            stroke="#CFCABB" stroke-width="8" stroke-linecap="round"/>

      <!-- horizontal de referencia y ángulo -->
      <line x1="${X0}" y1="${YPIV}" x2="${X1}" y2="${YPIV}" stroke="#8A8171"
            stroke-width="1.1" stroke-dasharray="5 4"/>
      <text x="${X0 + 86}" y="${YPIV + 22}" class="m-et" fill="#C87020" text-anchor="start">θ = ${fmt(angGr(),2)}°</text>

      <!-- fotoceldas -->
      ${celda(p1, '1', marca1)}
      ${celda(p2, '2', marca2)}

      <!-- carro -->
      <g transform="rotate(${(-angDib() * 180 / Math.PI).toFixed(2)} ${c.x.toFixed(1)} ${c.y.toFixed(1)})">
        <rect x="${(c.x - 21).toFixed(1)}" y="${(c.y - 18).toFixed(1)}" width="42" height="15" rx="3"
              fill="#D6DEE9" stroke="#0C2B52" stroke-width="2.2"/>
        <rect x="${(c.x - 2.5).toFixed(1)}" y="${(c.y - 34).toFixed(1)}" width="5" height="16" fill="#1F1C17"/>
      </g>

      <!-- gráfica a frente a sen θ -->
      ${rej}
      <line class="g-eje" x1="${G.l}" y1="${VH - G.b}" x2="${VW - G.r}" y2="${VH - G.b}"/>
      <line class="g-eje" x1="${G.l}" y1="${G.t}" x2="${G.l}" y2="${VH - G.b}"/>
      <text class="g-tit" x="${((VW - G.r + G.l)/2).toFixed(1)}" y="${VH - 6}" text-anchor="middle">sen θ</text>
      <text class="g-tit" x="${(-(VH - G.b + G.t)/2).toFixed(1)}" y="${G.l - 56}" text-anchor="middle"
            transform="rotate(-90)">aceleración a (m/s²)</text>
      <text class="g-tit" x="${G.l}" y="${G.t - 12}" text-anchor="start">a = g · sen θ</text>
      <path d="M ${pxG(0).toFixed(1)} ${pyG(0).toFixed(1)} L ${pxG(senMax).toFixed(1)} ${pyG(aMax).toFixed(1)}"
            fill="none" stroke="#0C2B52" stroke-width="2.6"/>
      <line x1="${pxG(sen()).toFixed(1)}" y1="${pyG(acel()).toFixed(1)}"
            x2="${pxG(sen()).toFixed(1)}" y2="${(VH - G.b).toFixed(1)}"
            stroke="#C87020" stroke-width="1" stroke-dasharray="3 3"/>
      <circle cx="${pxG(sen()).toFixed(1)}" cy="${pyG(acel()).toFixed(1)}" r="6"
              fill="#C87020" stroke="#F3ECD9" stroke-width="2"/>`;

    svg.setAttribute('aria-valuetext',
      `inclinación ${fmt(angGr(),2)} grados, aceleración ${fmt(acel(),4)} metros por segundo al cuadrado`);
  }

  function refrescar(){
    dibujar();
    host.querySelector('#sim-lecturas').innerHTML = `
      <div class="visor"><div class="visor__et">sen θ</div>
        <div class="visor__v">${fmt(sen(),4)}</div></div>
      <div class="visor"><div class="visor__et">Aceleración</div>
        <div class="visor__v" style="color:#8FE3A8">${fmt(acel(),4)}<small> m/s²</small></div></div>
      <div class="visor"><div class="visor__et">t¹ en la fotocelda 1</div>
        <div class="visor__v" style="color:#FF9E85">${fmt(tCelda(s0),4)}<small> s</small></div></div>
      <div class="visor"><div class="visor__et">t² en la fotocelda 2</div>
        <div class="visor__v" style="color:#FF9E85">${fmt(tCelda(s0 + D),4)}<small> s</small></div></div>`;
    host.querySelector('#sim-cuenta').innerHTML =
      `sen θ = (${fmt(hf,4)} − ${fmt(h0,4)}) / ${fmt(d,3)} = <b>${fmt(sen(),4)}</b> · ` +
      `a = g·sen θ = <b>${fmt(acel(),4)} m/s²</b> · ` +
      `v₁ = <b>${fmt(v(s0),4)} m/s</b> · v₂ = <b>${fmt(v(s0 + D),4)} m/s</b>`;
    host.querySelector('#out-hf').textContent = fmt(hf,4) + ' m';
    host.querySelector('#out-m').textContent  = fmt(masa,4) + ' kg';
    host.querySelector('#sim-hf').value = hf.toFixed(4);
    host.querySelector('#sim-m').value  = masa.toFixed(4);
    host.querySelector('#sim-soltar').textContent =
      estado === 'cayendo' ? '■ Detener' : '▶ Soltar carro';
  }

  function bucle(ahora){
    if (!ultimo) ultimo = ahora;
    t += Math.min((ahora - ultimo) / 1000, 0.05);
    ultimo = ahora;
    const s = sDe(t);
    if (marca1 === null && s >= s0) marca1 = tCelda(s0);
    if (marca2 === null && s >= s0 + D) marca2 = tCelda(s0 + D);
    if (t >= tFin()){ t = tFin(); estado = 'fin'; anim = null; ultimo = 0; refrescar(); return; }
    refrescar();
    anim = requestAnimationFrame(bucle);
  }

  function soltar(){
    if (estado === 'cayendo'){ cancelAnimationFrame(anim); anim = null; ultimo = 0; estado = 'listo'; refrescar(); return; }
    t = 0; marca1 = null; marca2 = null; estado = 'cayendo'; ultimo = 0;
    if (SIN_MOVIMIENTO){
      t = tFin(); marca1 = tCelda(s0); marca2 = tCelda(s0 + D); estado = 'fin'; refrescar(); return;
    }
    cancelAnimationFrame(anim);
    refrescar();
    anim = requestAnimationFrame(bucle);
  }

  function reiniciar(){
    cancelAnimationFrame(anim); anim = null; ultimo = 0;
    t = 0; marca1 = null; marca2 = null; estado = 'listo';
    refrescar();
  }

  function montar(id){
    host = document.getElementById(id);
    if (!host) return;
    host.innerHTML = `
      <svg class="plano-svg" viewBox="0 0 ${VW} ${VH}" role="img"
           aria-label="Carro bajando por el carril inclinado junto a la gráfica de la aceleración frente al seno del ángulo"></svg>
      <div class="lectura-caja" id="sim-lecturas" style="margin-top:13px"></div>
      <p id="sim-cuenta" class="instr__ayuda"
         style="margin:12px 0 0;font-family:var(--mono);font-size:.84rem;color:var(--azul)"></p>
      <div class="controles">
        <div class="control">
          <label for="sim-hf">Altura h<sub>f</sub> · <output id="out-hf"></output></label>
          <input type="range" id="sim-hf" min="${(h0 + 0.004).toFixed(4)}" max="0.1150" step="0.0025" value="${hf}">
        </div>
        <div class="control">
          <label for="sim-m">Masa del carro · <output id="out-m"></output></label>
          <input type="range" id="sim-m" min="0.15" max="0.60" step="0.005" value="${masa}">
        </div>
      </div>
      <div class="materiales" role="group" aria-label="Control de la simulación">
        <button class="chip" id="sim-soltar">▶ Soltar carro</button>
        <button class="chip" id="sim-reiniciar">↺ Reiniciar</button>
      </div>`;

    svg = host.querySelector('.plano-svg');
    host.querySelector('#sim-hf').addEventListener('input', e => { hf = parseFloat(e.target.value); reiniciar(); });
    host.querySelector('#sim-m').addEventListener('input', e => { masa = parseFloat(e.target.value); refrescar(); });
    host.querySelector('#sim-soltar').addEventListener('click', soltar);
    host.querySelector('#sim-reiniciar').addEventListener('click', reiniciar);
    refrescar();
  }

  return { montar };
})();

/* ==========================================================================
   4. ANÁLISIS: PROMEDIOS, TABLAS 4 A 6, GRÁFICAS Y GRAVEDAD
   ========================================================================== */
const Analisis = (() => {

  /* -------------------------------------------- Geometría del montaje */
  function geometria(){
    const Lm = leerNum('L-med');
    return {
      Lm,
      L:  (Lm !== null) ? Lm - CORRECCION : null,
      d:  leerNum('d-carril'),
      h0: leerNum('h0'),
      D:  leerNum('D-celdas')
    };
  }

  function senTheta(k){
    const G = geometria();
    const hf = leerNum('hf-' + (k + 1));
    if (hf === null || G.h0 === null || G.d === null || G.d <= 0) return null;
    const s = (hf - G.h0) / G.d;
    return s > 0 ? s : null;
  }

  /* ---------------------------------------- Lectura de una masa */
  function datosMasa(k, i){
    const G  = geometria();
    const m  = leerNum(`m-${k+1}-${i+1}`);
    const t1 = [0,1,2].map(j => leerNum(`t1-${k+1}-${i+1}-${j}`));
    const t2 = [0,1,2].map(j => leerNum(`t2-${k+1}-${i+1}-${j}`));
    const okT = t1.every(x => x !== null && x > 0) && t2.every(x => x !== null && x > 0);
    const okM = m !== null && m > 0;
    const tb1 = okT ? (t1[0] + t1[1] + t1[2]) / 3 : null;
    const tb2 = okT ? (t2[0] + t2[1] + t2[2]) / 3 : null;
    const L = G.L, D = G.D, s = senTheta(k);
    const v1 = (okT && L !== null && L > 0) ? L / tb1 : null;
    const v2 = (okT && L !== null && L > 0) ? L / tb2 : null;
    const a  = (v1 !== null && D !== null && D > 0) ? (v2*v2 - v1*v1) / (2 * D) : null;
    const Fg = (a !== null && okM && s !== null) ? m * a / s : null;
    const g  = (Fg !== null) ? Fg / m : null;
    return { k, i, m, t1, t2, tb1, tb2, v1, v2, a, Fg, g, okT, okM,
             completa: okT && okM && a !== null && Fg !== null };
  }

  function pares(k){
    const p = [];
    for (let i = 0; i < N_MASAS; i++){
      const d = datosMasa(k, i);
      if (d.completa) p.push({ i, m: d.m, Fg: d.Fg, a: d.a, g: d.g });
    }
    return p;
  }

  /* --------------------------------------------- Geometría en pantalla */
  function pintarGeometria(){
    const G = geometria();
    const corr = document.getElementById('L-corr');
    if (corr) corr.textContent = (G.L !== null) ? fmt(G.L, 4) : '—';

    const host = document.getElementById('resumen-geometria');
    if (host){
      const falta = [];
      if (G.Lm === null) falta.push('el ancho de la bandera');
      if (G.d === null || G.d <= 0) falta.push('la longitud d');
      if (G.h0 === null) falta.push('la altura h₀');
      if (G.D === null || G.D <= 0) falta.push('la distancia D');
      host.innerHTML = falta.length
        ? `<div class="nota"><strong>Falta por medir:</strong> ${falta.join(', ')}. Sin esos
             valores el cuaderno no puede calcular ninguna velocidad.</div>`
        : `<div class="nota">
             <strong>Con estas medidas el cuaderno ya puede trabajar.</strong><br>
             L corregida = ${fmt(G.Lm,4)} − ${fmt(CORRECCION,4)} =
             <span class="dato">${fmt(G.L,4)} m</span>, que es la que entra en v = L/t̄.<br>
             Con d = ${fmt(G.d,3)} m y h₀ = ${fmt(G.h0,4)} m, cada inclinación tendrá su propio
             sen θ = (h<sub>f</sub> − h₀)/d.<br>
             Las fotoceldas están separadas D = ${fmt(G.D,3)} m, el tramo sobre el que se calcula
             la aceleración.
           </div>`;
    }

    INCLINACIONES.forEach((INC, k) => {
      const caja = document.getElementById('geom-' + (k + 1));
      if (!caja) return;
      const s = senTheta(k), G2 = geometria(), hf = leerNum('hf-' + (k + 1));
      if (s === null){
        caja.innerHTML = '<span class="tabla-mini__pendiente">Escribe h_f, y comprueba que la ' +
          'Tabla 1 tenga la longitud d y la altura h₀.</span>';
        return;
      }
      const ang = Math.asin(Math.min(1, s)) * 180 / Math.PI;
      caja.innerHTML =
        `sen θ = (${fmt(hf,4)} − ${fmt(G2.h0,4)}) / ${fmt(G2.d,3)} = <b class="nw">${fmt(s,5)}</b>` +
        ` &nbsp;·&nbsp; θ = <b class="nw">${fmt(ang,2)}°</b><br>` +
        `Aceleración esperada: a = g·sen θ ≈ <b class="nw">${fmt(G_REF * s,4)} m/s²</b> ` +
        `si g vale ${fmt(G_REF,2)} m/s².`;
    });
  }

  /* ------------------------------- Cuadro de cálculo bajo cada masa */
  function pintarPromedios(){
    INCLINACIONES.forEach((INC, k) => {
      for (let i = 0; i < N_MASAS; i++){
        const caja = document.getElementById(`prom-${k+1}-${i+1}`);
        if (!caja) continue;
        const d = datosMasa(k, i);
        if (!d.okT){
          caja.innerHTML = '<span class="tabla-mini__pendiente">Faltan tiempos: escribe los tres ' +
            'lanzamientos completos para calcular las velocidades.</span>';
          continue;
        }
        let html =
          `t̄₁ = <b class="nw">${fmt(d.tb1,5)} s</b> &nbsp;·&nbsp; t̄₂ = <b class="nw">${fmt(d.tb2,5)} s</b>`;
        if (d.v1 !== null){
          html += `<br>v₁ = L/t̄₁ = <b class="nw">${fmt(d.v1,4)} m/s</b> &nbsp;·&nbsp; ` +
                  `v₂ = <b class="nw">${fmt(d.v2,4)} m/s</b>`;
        } else {
          html += `<br><b style="color:var(--err)">Falta L:</b> complétala en la Tabla 1.`;
        }
        if (d.a !== null) html += `<br>a = (v₂² − v₁²)/2D = <b class="nw">${fmt(d.a,4)} m/s²</b>`;
        if (d.Fg !== null) html += ` &nbsp;·&nbsp; F<sub>g</sub> = <b class="nw">${fmt(d.Fg,4)} N</b>` +
                                   ` &nbsp;·&nbsp; g = <b class="nw">${fmt(d.g,3)} m/s²</b>`;
        else if (!d.okM) html += `<br><b style="color:var(--err)">Falta la masa</b> para obtener F<sub>g</sub>.`;
        caja.innerHTML = html;
      }
    });
  }

  /* --------------------------------------------------- Tablas 4 y 5 */
  function pintarTablas45(){
    INCLINACIONES.forEach((INC, k) => {
      const host = document.getElementById('tabla-' + INC.analisis);
      if (!host) return;
      const ds = [0,1,2,3,4].map(i => datosMasa(k, i));
      const s  = senTheta(k);
      const vacio = '<span style="color:var(--tinta-3);font-style:italic">—</span>';
      const cel = (v, dec) => (v === null || v === undefined) ? vacio : `<span class="dato">${fmt(v,dec)}</span>`;

      const fila = (rot, uni, sel, dec, resalta) => `
        <tr>
          <td class="col-fija">${rot}</td>
          <td class="td-centro"><span class="dato">${uni}</span></td>
          ${ds.map(d => `<td class="td-centro"${resalta ? ' style="background:rgba(12,43,82,.06)"' : ''}>${cel(sel(d), dec)}</td>`).join('')}
        </tr>`;

      host.innerHTML = `<div class="tabla-caja" style="margin-top:16px">
        <table class="tabla" style="min-width:720px">
          <thead>
            <tr><th colspan="7" class="th-grupo">Tabla ${INC.analisis} · ${esc(INC.nombre)} ·
              h<sub>f</sub> = ${leerNum('hf-'+(k+1)) !== null ? fmt(leerNum('hf-'+(k+1)),4) : '—'} m ·
              sen θ = ${s !== null ? fmt(s,5) : '—'}</th></tr>
            <tr>
              <th style="width:20%">Magnitud</th><th style="width:12%">Unidad</th>
              ${ds.map((d,i) => `<th class="th-sub">m${['¹','²','³','⁴','⁵'][i]} = ${d.okM ? fmt(d.m,4) : '—'} kg</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${fila('t̄₁', 's',     d => d.tb1, 5, false)}
            ${fila('t̄₂', 's',     d => d.tb2, 5, false)}
            ${fila('v₁', 'm/s',   d => d.v1,  4, false)}
            ${fila('v₂', 'm/s',   d => d.v2,  4, false)}
            ${fila('a',  'm/s²',  d => d.a,   4, true)}
            ${fila('F<sub>g</sub>', 'N', d => d.Fg, 4, false)}
            ${fila('g',  'm/s²',  d => d.g,   3, true)}
          </tbody>
        </table>
        <caption>Tabla ${INC.analisis}. Se completa sola con los tiempos de la Tabla ${INC.tabla} y
        las medidas de la Tabla 1. Las dos filas sombreadas son las que deberían salir
        aproximadamente constantes a lo largo de la fila.</caption>
      </div>`;
    });
  }

  function pintarLecturaAnalisis(){
    const host = document.getElementById('lectura-analisis');
    if (!host) return;
    const bloques = INCLINACIONES.map((INC, k) => {
      const P = pares(k);
      if (P.length < 2) return `<div class="nota"><strong>${esc(INC.nombre)}:</strong> faltan
        filas completas para poder comentar nada todavía.</div>`;
      const as = P.map(p => p.a), gs = P.map(p => p.g);
      const aMed = as.reduce((s,x) => s+x, 0) / as.length;
      const gMed = gs.reduce((s,x) => s+x, 0) / gs.length;
      const disp = (Math.max(...as) - Math.min(...as)) / aMed * 100;
      return `<div class="nota">
        <strong>${esc(INC.nombre)}</strong><br>
        La aceleración vale en promedio <span class="dato">${fmt(aMed,4)} m/s²</span> y las
        ${P.length} columnas se apartan entre sí un <span class="dato">${fmt(disp,1)} %</span>:
        ${disp <= 4
          ? 'prácticamente nada, como corresponde a una magnitud que no depende de la masa.'
          : 'más de lo esperable. Revisa si algún lanzamiento recibió un empujón o si una masa está mal anotada.'}<br>
        La gravedad calculada columna a columna promedia
        <span class="dato">${fmt(gMed,3)} m/s²</span>.
      </div>`;
    }).join('');
    host.innerHTML = bloques;
  }

  /* ------------------------------------------------------- Ajustes */
  function fitOrigen(P){
    let s1 = 0, s2 = 0;
    P.forEach(p => { s1 += p.Fg * p.m; s2 += p.m * p.m; });
    if (s2 === 0) return null;
    const g = s1 / s2;
    return { tipo:'origen', g, b:0, f: m => g * m };
  }

  function fitGeneral(P){
    const n = P.length;
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    P.forEach(p => { sx += p.m; sy += p.Fg; sxx += p.m * p.m; sxy += p.m * p.Fg; });
    const den = n * sxx - sx * sx;
    if (Math.abs(den) < 1e-18) return null;
    const g = (n * sxy - sx * sy) / den;
    const b = (sy - g * sx) / n;
    return { tipo:'general', g, b, f: m => g * m + b };
  }

  function coefR2(P, f){
    const ym = P.reduce((s,p) => s + p.Fg, 0) / P.length;
    let ssr = 0, sst = 0;
    P.forEach(p => { ssr += (p.Fg - f(p.m)) ** 2; sst += (p.Fg - ym) ** 2; });
    return sst > 0 ? 1 - ssr / sst : 1;
  }

  function tipoAjuste(){
    const el = document.getElementById('tipo-ajuste');
    return (el && el.value) ? el.value : 'general';
  }

  function ajuste(P){
    if (P.length < 2) return null;
    const a = tipoAjuste() === 'origen' ? fitOrigen(P) : fitGeneral(P);
    if (a) a.R2 = coefR2(P, a.f);
    return a;
  }

  function ecuacion(a){
    if (!a) return '—';
    if (a.tipo === 'origen') return `F = ${fmt(a.g,3)} · m`;
    const s = a.b >= 0 ? '+ ' : '− ';
    return `F = ${fmt(a.g,3)} · m ${s}${fmt(Math.abs(a.b),4)}`;
  }

  /* ------------------------------------------------------- Gráfica */
  function pintarGrafica(datos){
    const host = document.getElementById('graf-fm');
    if (!host) return;
    const W = 660, H = 370, M = { l: 62, r: 20, t: 18, b: 50 };
    const todos = [].concat(...datos.map(d => d.P));
    const mMax = todos.length ? Math.max(...todos.map(p => p.m)) * 1.15 : 0.35;
    const fMax = todos.length ? Math.max(...todos.map(p => p.Fg)) * 1.15 : 3.5;
    const px = m => M.l + m / mMax * (W - M.l - M.r);
    const py = f => (H - M.b) - f / fMax * (H - M.b - M.t);

    let g = '';
    for (let i = 0; i <= 5; i++){
      const m = mMax * i / 5;
      g += `<line class="g-rejilla" x1="${px(m).toFixed(1)}" y1="${M.t}" x2="${px(m).toFixed(1)}" y2="${H - M.b}"/>
            <text class="g-num" x="${px(m).toFixed(1)}" y="${H - M.b + 16}" text-anchor="middle">${fmt(m,3)}</text>`;
      const f = fMax * i / 5;
      g += `<line class="g-rejilla" x1="${M.l}" y1="${py(f).toFixed(1)}" x2="${W - M.r}" y2="${py(f).toFixed(1)}"/>
            <text class="g-num" x="${M.l - 7}" y="${(py(f) + 4).toFixed(1)}" text-anchor="end">${fmt(f,2)}</text>`;
    }
    g += `<line class="g-eje" x1="${M.l}" y1="${H - M.b}" x2="${W - M.r}" y2="${H - M.b}"/>
          <line class="g-eje" x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${H - M.b}"/>
          <text class="g-tit" x="${((W + M.l)/2).toFixed(1)}" y="${H - 8}" text-anchor="middle">masa m (kg)</text>
          <text class="g-tit" x="${(-((H - M.b + M.t)/2)).toFixed(1)}" y="14" text-anchor="middle"
                transform="rotate(-90)">fuerza gravitacional F_g (N)</text>`;

    datos.forEach((d, k) => {
      const color = INCLINACIONES[k].color;
      if (d.a){
        /* la recta se recorta donde sale del recuadro, sin deformar la pendiente */
        let xA = 0, xB = mMax;
        if (d.a.g > 1e-12){
          xA = Math.max(0, Math.min(mMax, -d.a.b / d.a.g));
          xB = Math.max(xA, Math.min(mMax, (fMax - d.a.b) / d.a.g));
        }
        if (xB > xA){
          g += `<path d="M ${px(xA).toFixed(1)} ${py(d.a.f(xA)).toFixed(1)} ` +
               `L ${px(xB).toFixed(1)} ${py(d.a.f(xB)).toFixed(1)}" ` +
               `fill="none" stroke="${color}" stroke-width="2.2" stroke-dasharray="7 5" opacity=".9"/>`;
        }
      }
      d.P.forEach(p => {
        g += `<circle cx="${px(p.m).toFixed(1)}" cy="${py(p.Fg).toFixed(1)}" r="5"
                fill="${color}" stroke="#1F1C17" stroke-width="1.4">
                <title>m = ${fmt(p.m,4)} kg, F_g = ${fmt(p.Fg,4)} N</title></circle>`;
      });
    });

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img"
        aria-label="Gráfica de la fuerza gravitacional frente a la masa, para las dos inclinaciones">${g}</svg>
      <div class="leyenda">
        ${INCLINACIONES.map(I => `<span><i class="punto" style="background:${I.color}"></i>Tabla ${I.analisis} · ${esc(I.nombre.toLowerCase())}</span>`).join('')}
      </div>` +
      (todos.length ? '' : '<p class="instr__ayuda" style="margin:10px 0 0">Completa las Tablas 1, 2 y 3 para que aparezcan los puntos.</p>');
  }

  function pintarResultado(datos){
    const host = document.getElementById('resultado-ajuste');
    if (!host) return;
    if (datos.every(d => !d.a)){
      host.innerHTML = `<div class="nota nota--aviso"><strong>Faltan datos.</strong> El ajuste
        necesita al menos <b>dos</b> columnas completas por inclinación, y la Tabla 1 entera.</div>`;
      return;
    }
    host.innerHTML = datos.map((d, k) => {
      if (!d.a) return `<div class="nota nota--aviso"><strong>Tabla ${INCLINACIONES[k].analisis}:</strong>
        aún no hay suficientes columnas completas para ajustar la recta.</div>`;
      const bueno = d.a.R2 >= 0.99;
      return `<div class="formula" style="max-width:none">
          <div class="formula__n" style="color:${INCLINACIONES[k].color}">Tabla ${INCLINACIONES[k].analisis} · ${esc(INCLINACIONES[k].nombre)}</div>
          <div class="formula__ec" style="font-size:1.3rem">${ecuacion(d.a)}</div>
          <div class="formula__pie">Ajuste sobre ${d.P.length} columnas ·
            R² = <b style="color:${bueno ? 'var(--ok)' : 'var(--err)'}">${fmt(d.a.R2,5)}</b> ·
            con F<sub>g</sub> en newtons y m en kilogramos, de modo que la pendiente queda en N/kg,
            que es lo mismo que m/s².</div>
        </div>`;
    }).join('');
  }

  /* ------------------------------------------------- La gravedad */
  function pintarGravedad(datos){
    const host = document.getElementById('gravedad-host');
    if (!host) return;
    const gref = leerNum('g-ref') ?? G_REF;
    const gs = datos.map(d => d.a ? d.a.g : null);

    const tarjetas = `
      <div class="vs">
        <div class="vs__caja">
          <div class="vs__et">Tabla ${INCLINACIONES[0].analisis} · ${esc(INCLINACIONES[0].nombre.toLowerCase())}</div>
          <div class="vs__v">${gs[0] !== null ? fmt(gs[0],3) : '—'}</div>
          <div class="vs__u">m/s²</div>
        </div>
        <div class="vs__sep" aria-hidden="true">y</div>
        <div class="vs__caja vs__caja--ref">
          <div class="vs__et">Tabla ${INCLINACIONES[1].analisis} · ${esc(INCLINACIONES[1].nombre.toLowerCase())}</div>
          <div class="vs__v">${gs[1] !== null ? fmt(gs[1],3) : '—'}</div>
          <div class="vs__u">m/s²</div>
        </div>
      </div>`;

    let texto;
    if (gs[0] === null || gs[1] === null){
      texto = `<div class="nota"><strong>Faltan resultados.</strong> Completa las dos
        inclinaciones para que el cuaderno pueda comparar los dos valores de g.</div>`;
    } else if (!(gref > 0)){
      texto = `<div class="nota nota--aviso"><strong>Escribe un valor de referencia válido</strong>
        para g, mayor que cero.</div>`;
    } else {
      const prom = (gs[0] + gs[1]) / 2;
      const e0 = Math.abs(gs[0] - gref) / gref * 100;
      const e1 = Math.abs(gs[1] - gref) / gref * 100;
      const ep = Math.abs(prom - gref) / gref * 100;
      const bien = ep <= 3;
      texto = `<div class="nota${bien ? '' : ' nota--aviso'}">
        <strong>Comparación con el valor de referencia</strong><br>
        Tabla ${INCLINACIONES[0].analisis}: ${fmt(gs[0],3)} m/s², error
        <span class="dato">${fmt(e0,2)} %</span>.<br>
        Tabla ${INCLINACIONES[1].analisis}: ${fmt(gs[1],3)} m/s², error
        <span class="dato">${fmt(e1,2)} %</span>.<br>
        Promedio de las dos: <span class="dato" style="font-size:1.12em">${fmt(prom,3)} m/s²</span>,
        error <span class="dato" style="color:${bien ? 'var(--ok)' : 'var(--err)'}">${fmt(ep,2)} %</span>
        frente a los ${fmt(gref,2)} m/s² de referencia.<br>
        ${bien
          ? 'Los dos valores coinciden entre sí y con el de referencia dentro de lo razonable para este montaje. Que dos inclinaciones distintas den el mismo resultado es la mejor señal de que el método funciona.'
          : 'La diferencia es mayor de lo habitual. Si los dos valores salen bajos, sospecha de un rozamiento residual por flujo de aire insuficiente; si difieren mucho entre sí, revisa la medida de las alturas, que es lo único que distingue a las dos inclinaciones.'}
      </div>`;
      const dif = Math.abs(gs[0] - gs[1]) / prom * 100;
      texto += `<div class="nota">
        <strong>¿Coinciden las dos inclinaciones?</strong> Se diferencian en
        <span class="dato">${fmt(dif,2)} %</span>.
        ${dif <= 3
          ? 'Prácticamente coinciden, y deben hacerlo: la gravedad es la misma, por mucho que cambie el ángulo. Es una comprobación interna de la práctica que no depende de ningún valor tabulado.'
          : 'Se apartan más de lo esperable. Como la gravedad es la misma en los dos casos, la discrepancia apunta a la medida de h_f de alguna de las dos inclinaciones.'}
      </div>`;
    }
    host.innerHTML = tarjetas + texto;
  }

  /* ------------------------------------------------------------ Refresco */
  function refrescar(){
    pintarGeometria();
    pintarPromedios();
    const datos = INCLINACIONES.map((INC, k) => { const P = pares(k); return { P, a: ajuste(P) }; });
    pintarTablas45();
    pintarLecturaAnalisis();
    pintarGrafica(datos);
    pintarResultado(datos);
    pintarGravedad(datos);

    /* Modelos de las casillas que el estudiante transcribe */
    const poner = (id, v) => { if (CLAVES[id]) CLAVES[id].modelo = v; };
    const gref = leerNum('g-ref') ?? G_REF;
    const gs = [];
    datos.forEach((d, k) => {
      const n = INCLINACIONES[k].n;
      poner('ec-'  + n, d.a ? ecuacion(d.a) : '');
      poner('g-'   + n, d.a ? fmt(d.a.g, 3) : '');
      poner('r2-'  + n, d.a ? fmt(d.a.R2, 5) : '');
      poner('err-' + n, (d.a && gref > 0) ? fmt(Math.abs(d.a.g - gref) / gref * 100, 2) : '');
      gs.push(d.a ? d.a.g : null);
    });
    poner('g-prom', (gs[0] !== null && gs[1] !== null) ? fmt((gs[0] + gs[1]) / 2, 3) : '');
  }

  return { refrescar, geometria, senTheta, datosMasa, pares, ajuste, ecuacion };
})();

/* Estilos de los textos dentro de los SVG */
(function estilosSVG(){
  const s = document.createElement('style');
  s.textContent = `
    .m-lab{ font-family:var(--texto); font-size:12px; fill:#5A5346; }
    .m-et{ font-family:var(--mono); font-size:15px; font-weight:700; fill:#0C2B52; }
    .g-eje{ stroke:#4A4234; stroke-width:1.3; }
    .g-rejilla{ stroke:rgba(120,100,66,.18); stroke-width:1; }
    .g-num{ font-family:var(--mono); font-size:10px; fill:#5A5346; }
    .g-tit{ font-family:var(--texto); font-size:11px; fill:#4A4234; }
  `;
  document.head.appendChild(s);
})();
