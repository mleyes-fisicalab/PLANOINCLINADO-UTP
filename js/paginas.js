/* ============================================================================
   PAGINAS.JS — Construcción del contenido de cada página del cuaderno
   ========================================================================== */

const CLAVES = {};

function esc(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function campo(o){
  CLAVES[o.id] = { resp:o.resp || [], modo:o.modo || 'texto', nota:o.nota || '',
                   modelo:o.modelo || '', tol:o.tol };
  const cls = 'campo' + (o.modo === 'simbolo' || o.modo === 'numero' ? '' : ' campo--texto')
            + (o.clase ? ' ' + o.clase : '');
  return `<input type="text" class="${cls}" id="${o.id}" data-campo="${o.id}"
            inputmode="${o.modo === 'numero' ? 'decimal' : 'text'}"
            placeholder="${esc(o.ph || '')}" autocomplete="off" spellcheck="false"
            aria-label="${esc(o.et || o.ph || o.id)}">
          <span class="pista" id="pista-${o.id}"></span>`;
}

function area(o){
  CLAVES[o.id] = { resp:[], modo:'libre', nota:o.guia || '', modelo:o.modelo || '' };
  /* El «eco» es una copia del texto que solo aparece al imprimir: un textarea
     conserva su altura en papel y recortaría las respuestas largas. */
  return `<textarea class="campo" id="${o.id}" data-campo="${o.id}" rows="${o.filas || 5}"
            placeholder="${esc(o.ph || 'Escribe aquí tu respuesta…')}"
            aria-label="${esc(o.et || o.id)}"></textarea>
          <div class="eco" id="eco-${o.id}" aria-hidden="true"></div>`;
}

function num(o){
  o.modo = 'numero'; o.clase = (o.clase || '') + ' campo--num'; o.ph = o.ph || '0,00';
  return campo(o);
}

/* Dato del estudiante: no se verifica, pero el autocompletado lo rellena con el
   valor del conjunto de datos de referencia. */
function dato(o){
  CLAVES[o.id] = { resp:[], modo:'libre', nota:'', modelo:o.modelo || '' };
  return `<input type="text" class="campo campo--num${o.clase ? ' ' + o.clase : ''}"
            id="${o.id}" data-campo="${o.id}" inputmode="decimal"
            placeholder="${esc(o.ph || '0,0000')}" autocomplete="off" spellcheck="false"
            aria-label="${esc(o.et || o.id)}">`;
}

function accionesPagina(){
  return `<div class="acciones-pag">
      <button class="btn-papel btn-papel--clave" data-accion="autopag">Autocompletar esta página</button>
      <button class="btn-papel" data-accion="verificarpag">Verificar</button>
      <button class="btn-papel btn-papel--fantasma" data-accion="limpiarpag">Limpiar</button>
    </div>`;
}

function enunciado(n, texto){
  return `<div class="punto">
      <div class="punto__num" aria-hidden="true">${n}</div>
      <div class="punto__texto"><p>${texto}</p></div>
    </div>`;
}

/* ==========================================================================
   PÁGINAS
   ========================================================================== */
const PAGINAS = [];

/* --- 0 · Portada -------------------------------------------------------- */
PAGINAS.push(() => `
  <div class="portada">
    <img class="portada__img" src="imagenesUTP/portada.png"
         alt="Portada del cuaderno interactivo: Práctica 6, Plano Inclinado. Universidad Tecnológica de Pereira, Facultad de Ciencias Básicas.">
    <div>
      <span class="portada__sello">${esc(META.universidad)}</span>
      <h1>Cuaderno<br>interactivo<em>${esc(META.asignatura)}</em></h1>
      <p class="portada__practica">${esc(META.practica)} · ${esc(META.titulo)}</p>
      <div class="si-fila" aria-label="Magnitudes de la práctica">
        <span class="si-chip">θ</span><span class="si-chip">a</span><span class="si-chip">F</span>
        <span class="si-chip">g</span><span class="si-chip">m/s²</span>
      </div>
      <ul class="portada__meta">
        <li><b>Facultad</b><span>Ciencias Básicas · ${esc(META.departamento)}</span></li>
        <li><b>Asignatura</b><span>${esc(META.asignatura)}</span></li>
        <li><b>Docente</b><span>${campo({id:'docente', modo:'libre', ph:'Escribe el nombre de tu docente', et:'Docente', clase:'campo--ancho'})}</span></li>
        <li><b>Grupo</b><span>${campo({id:'grupo', modo:'libre', ph:'Número o código del grupo', et:'Grupo', clase:'campo--ancho'})}</span></li>
        <li><b>Fecha</b><span>${campo({id:'fecha', modo:'libre', ph:'dd / mm / aaaa', et:'Fecha', clase:'campo--ancho'})}</span></li>
      </ul>
      <button class="btn-grande" data-ir="1">Abrir el cuaderno →</button>
    </div>
  </div>
`);

/* --- 1 · Índice --------------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Navegación</span>
  <h1 class="titulo">Índice del cuaderno</h1>
  <p class="plomo">Veintidós secciones: el fundamento y el procedimiento, el preinforme, las
  medidas del montaje, las dos tablas de tiempos, el análisis completo, las gráficas, el valor de
  la gravedad, el simulador, las preguntas y los anexos. Tu trabajo se guarda solo en este
  navegador cada vez que escribes.</p>
  <ol class="indice">
    ${SECCIONES.map((s,i) => `
      <li><button class="indice__btn" data-ir="${i}">
        <span class="indice__n">${String(i).padStart(2,'0')}</span>
        <span class="indice__t">${esc(s.t)}<br><span class="indice__d">${esc(s.d)}</span></span>
        <span class="indice__p">pág. ${i+1}</span>
      </button></li>`).join('')}
  </ol>
`);

/* --- 2 · Presentación --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe de laboratorio</span>
  <h1 class="titulo">Presentación de la práctica</h1>
  <p class="plomo">Galileo no podía cronometrar una caída libre: era demasiado rápida para los
  relojes de su época. Su solución fue inclinar un plano y dejar caer la bola despacio. Esta
  práctica repite esa idea con un carril de aire y dos fotoceldas.</p>

  <p>Vas a estudiar la <b>segunda ley de Newton</b> aplicada a un carro que desliza por un plano
  inclinado, y a usarla para <b>calcular la aceleración de la gravedad</b>. El montaje es un carril
  de aire, que elimina prácticamente el rozamiento, inclinado con bloques de aluminio en
  <b>dos ángulos distintos</b>.</p>

  <p>El carro lleva una <b>bandera</b> de ancho conocido. Al bajar, esa bandera cruza dos
  <b>fotoceldas</b> separadas una distancia D, y el cronómetro mide cuánto dura cada interrupción
  del haz. De ahí salen las dos velocidades, y de las dos velocidades, la aceleración. El
  procedimiento se repite tres veces para cada una de <b>cinco masas</b> y para cada inclinación:
  sesenta lanzamientos en total.</p>

  <p>Lo interesante llega al comparar las filas. Como la componente del peso que mueve al carro es
  <span class="dato">m·g·sen θ</span> y la masa se simplifica al aplicar F = m·a, la aceleración
  <b>no debería depender de la masa</b>. Y sin embargo la fuerza sí: al representar
  <span class="dato">F_g frente a m</span> aparece una recta cuya pendiente es, directamente,
  <b>el valor de g</b>.</p>

  <div class="tarjetas">
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Lo que necesitas</h3>
      <p>El carril de aire con su soplador, el carro con bandera, el cronómetro de dos
      fotoceldas, la balanza, el pie de rey, los bloques y las arandelas.</p>
    </div>
    <div class="tarjeta tarjeta--azul">
      <h3 class="tarjeta__tit">Lo que entregas</h3>
      <p>El informe completo: resumen, marco teórico, Tablas 1 a 6, las dos gráficas con sus
      ecuaciones, el valor de g, las cuatro preguntas y tres conclusiones propias.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Cómo se evalúa</h3>
      <p>Coherencia de los datos, correcta obtención de las ecuaciones y justificación física de
      cada respuesta, en particular del diagrama de cuerpo libre.</p>
    </div>
  </div>

  <div class="nota">
    <strong>Toda la cadena de cálculo va incluida.</strong> El informe pide calcular promedios,
    velocidades, aceleraciones, fuerzas y gravedades para diez columnas, y después graficar. Este
    cuaderno hace esa cadena entera a partir de los tiempos que escribas: las Tablas 4 y 5 se
    llenan solas, las gráficas se trazan solas y el ajuste por mínimos cuadrados te entrega la
    pendiente. Puedes usarlo para comprobar tu hoja de cálculo.
  </div>
`);

/* --- 3 · Objetivos ------------------------------------------------------ */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 2</span>
  <h1 class="titulo">Objetivos</h1>

  <div class="tarjetas">
    <div class="tarjeta tarjeta--azul">
      <h3 class="tarjeta__tit">Objetivo general</h3>
      <p>Estudiar la segunda ley de Newton para determinar la aceleración de un cuerpo que se
      desliza por medio de un plano inclinado.</p>
    </div>
    <div class="tarjeta tarjeta--azul">
      <h3 class="tarjeta__tit">Objetivo específico</h3>
      <p>Calcular la gravedad <i>g</i> por medio de un plano inclinado.</p>
    </div>
  </div>

  <h2 class="sub">Lo que hay que conseguir por el camino</h2>
  <div class="tarjetas">
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Medir</h3>
      <p>Registrar los tiempos de paso por las dos fotoceldas para cinco masas y dos
      inclinaciones, repitiendo tres veces cada lanzamiento.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Calcular</h3>
      <p>Obtener las velocidades a partir del ancho de la bandera, la aceleración a partir de las
      velocidades y la fuerza gravitacional a partir de la aceleración.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Graficar</h3>
      <p>Representar F<sub>g</sub> frente a la masa y obtener la ecuación de la recta de ajuste
      para cada inclinación.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Interpretar</h3>
      <p>Reconocer la pendiente como el valor de g y comprobar que la aceleración depende de la
      inclinación pero no de la masa.</p>
    </div>
  </div>

  <div class="nota">
    <strong>Al terminar deberías poder responder sin dudar:</strong> ¿qué relación hay entre
    F<sub>g</sub> y la masa?, ¿qué representa la pendiente de la recta?, ¿cómo cambia la
    aceleración al inclinar más el plano? y ¿cuál es la fuerza neta sobre el carro?
  </div>
`);

/* --- 4 · Materiales ----------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 3</span>
  <h1 class="titulo">Materiales e instrumentos</h1>
  <p class="plomo">El equipo más delicado de las prácticas de mecánica. Dos piezas hacen todo el
  trabajo fino: el carril de aire, que quita el rozamiento, y las fotoceldas, que miden tiempos de
  centésimas de segundo.</p>

  <div class="tarjetas">
    ${MATERIALES.map((m,i) => `
      <div class="tarjeta${i < 3 ? ' tarjeta--azul' : ''}">
        <h3 class="tarjeta__tit">${esc(m.n)}</h3>
        <p>${esc(m.f)}</p>
      </div>`).join('')}
  </div>

  <h2 class="sub">Qué se mide directamente y qué no</h2>
  <div class="tabla-caja">
    <table class="tabla" style="min-width:600px">
      <thead><tr><th style="width:26%">Magnitud</th><th style="width:19%">¿Se mide?</th><th>De dónde sale</th></tr></thead>
      <tbody>
        <tr><td class="col-fija">L, d, h₀, h<sub>f</sub>, D</td>
            <td class="td-centro"><span class="dato">directas</span></td>
            <td>Pie de rey para el ancho de la bandera, regla o cinta para el resto.</td></tr>
        <tr><td class="col-fija">Masa m</td><td class="td-centro"><span class="dato">directa</span></td>
            <td>La da la balanza: carro con bandera, más las arandelas añadidas.</td></tr>
        <tr><td class="col-fija">Tiempos t₁, t₂</td><td class="td-centro"><span class="dato">directos</span></td>
            <td>Los entrega el cronómetro de fotocelda, en segundos con cuatro decimales.</td></tr>
        <tr><td class="col-fija">Velocidades v₁, v₂</td><td class="td-centro"><span class="dato">calculadas</span></td>
            <td>v = L / t̄, con los tiempos promediados sobre los tres lanzamientos.</td></tr>
        <tr><td class="col-fija">Aceleración a</td><td class="td-centro"><span class="dato">calculada</span></td>
            <td>a = (v₂² − v₁²) / (2D), de la cinemática del movimiento acelerado.</td></tr>
        <tr><td class="col-fija">Gravedad g</td><td class="td-centro"><span class="dato">indirecta</span></td>
            <td>No se mide: es la pendiente de la recta F<sub>g</sub> frente a m.</td></tr>
      </tbody>
    </table>
    <caption>Tabla de apoyo. Seis magnitudes medidas sostienen una cadena de cálculo que termina en la gravedad.</caption>
  </div>

  <div class="nota nota--aviso">
    <strong>Comprueba el flujo de aire antes de empezar.</strong> Si el soplador no está a plena
    potencia o algún orificio está obstruido, queda rozamiento residual: la aceleración sale menor
    que g·sen θ y la gravedad obtenida, sistemáticamente baja. Un carro que, con el carril
    horizontal y un empujón suave, recorre el riel sin frenarse apreciablemente, indica que el
    rozamiento es despreciable.
  </div>
`);

/* --- 5 · Fundamento físico ---------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 4</span>
  <h1 class="titulo">Fundamento físico</h1>
  <p class="plomo">Descomponer el peso en dos direcciones y aplicar F = m·a. De ahí sale todo lo
  demás, incluido el hecho de que la masa no influya.</p>

  <h2 class="sub">El diagrama de cuerpo libre</h2>
  <p>Sobre el carro actúan solo dos fuerzas, porque el carril de aire elimina el rozamiento: el
  <b>peso</b>, vertical y hacia abajo, y la <b>fuerza normal</b>, perpendicular a la superficie del
  carril. Conviene tomar los ejes paralelo y perpendicular al plano, y no los horizontales y
  verticales de siempre: así todo el movimiento ocurre a lo largo de un único eje.</p>

  <div class="instr">
    <h3 class="instr__tit">Diagrama de cuerpo libre <span>carro sobre el plano</span></h3>
    <div class="montaje" id="dcl-host"></div>
  </div>

  <h2 class="sub">La fuerza neta</h2>
  <p>En la dirección perpendicular no hay movimiento, de modo que la normal equilibra a la
  componente perpendicular del peso. En la dirección paralela, en cambio, nada compensa a la
  componente paralela: esa es la fuerza neta.</p>

  <div class="formulario">
    <div class="f-carta">
      <div class="f-carta__n">Perpendicular</div>
      <div class="f-carta__ec">N = m·g·cos θ</div>
      <div class="f-carta__p">Se equilibran: no hay movimiento en esa dirección.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Paralela · fuerza neta</div>
      <div class="f-carta__ec">F = m·g·sen θ</div>
      <div class="f-carta__p">Nada la compensa: es la que acelera al carro.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Segunda ley</div>
      <div class="f-carta__ec">a = g·sen θ</div>
      <div class="f-carta__p">La masa se simplifica y desaparece del resultado.</div>
    </div>
  </div>

  <div class="nota">
    <strong>La masa se simplifica, y eso es el resultado.</strong> De m·g·sen θ = m·a sale
    a = g·sen θ sin rastro de la masa. Un carro cargado y otro vacío bajan exactamente igual. Es el
    mismo hecho que en la caída libre, visto a cámara lenta: el plano inclinado solo lo atenúa por
    un factor sen θ, que es lo que permite cronometrarlo con comodidad.
  </div>

  <h2 class="sub">Cómo se mide cada cosa</h2>
  <p>Ninguna de las magnitudes del resultado se lee directamente en un instrumento. Esta es la
  cadena completa, y es la que recorren las Tablas 4 y 5:</p>

  <div class="formulario">
    <div class="f-carta">
      <div class="f-carta__n">1 · El seno del ángulo</div>
      <div class="f-carta__ec">sen θ = (h<sub>f</sub> − h₀) / d</div>
      <div class="f-carta__p">De la geometría del montaje, sin transportador.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">2 · Las velocidades</div>
      <div class="f-carta__ec">v = L / t̄</div>
      <div class="f-carta__p">Ancho de la bandera entre el tiempo de interrupción.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">3 · La aceleración</div>
      <div class="f-carta__ec">a = (v₂² − v₁²) / 2D</div>
      <div class="f-carta__p">Cinemática del movimiento uniformemente acelerado.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">4 · La fuerza</div>
      <div class="f-carta__ec">F<sub>g</sub> = m·a / sen θ</div>
      <div class="f-carta__p">Despejada de la segunda ley en el plano.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">5 · La gravedad</div>
      <div class="f-carta__ec">g = F<sub>g</sub> / m</div>
      <div class="f-carta__p">O, equivalentemente, la pendiente de F<sub>g</sub> frente a m.</div>
    </div>
  </div>

  <div class="nota nota--aviso">
    <strong>Por qué hay que corregir el ancho de la bandera.</strong> El haz de la fotocelda no es
    infinitamente fino y se interrumpe un poco antes de que llegue el borde físico de la bandera.
    Por eso al ancho medido con el pie de rey hay que <b>restarle ${f4(CORRECCION)} m</b>. Ese
    ancho corregido entra en las <b>dos</b> velocidades, de modo que un error suyo se traslada
    entero al resultado final.
  </div>

  <div class="nota">
    <strong>g no es una constante universal.</strong> Depende de la latitud, porque la Tierra no
    es exactamente esférica y además rota, y disminuye con la altitud. En Pereira, a unos 4,8° de
    latitud norte y 1411 m sobre el nivel del mar, el valor local estimado es de
    <span class="dato">${f3(G_PEREIRA)} m/s²</span>, algo menor que los
    <span class="dato">${f2(G_REF)} m/s²</span> que se usan como referencia en el curso.
  </div>
`);

/* --- 6 · Montaje experimental -------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 5</span>
  <h1 class="titulo">Montaje experimental</h1>
  <p class="plomo">Primero las dos figuras de la guía, que definen qué significa cada letra;
  después un esquema con puntos sensibles para repasar el papel de cada pieza.</p>

  <h2 class="sub">Las medidas que define la guía</h2>
  <div class="fotos fotos--dos">
    <figure class="foto">
      <img src="imagenesUTP/figura_horizontal.png"
           alt="Carril de aire horizontal con el carro, el ancho L de la bandera, la longitud d del carril y la altura h cero">
      <figcaption><b>Figura 1.</b> Plano horizontal. Aquí se miden el ancho <b>L</b> de la
      bandera, la longitud total <b>d</b> del carril y la altura <b>h₀</b> entre la mesa y el
      carril sin inclinar.</figcaption>
    </figure>
    <figure class="foto">
      <img src="imagenesUTP/figura_inclinado.png"
           alt="Carril de aire inclinado mostrando la distancia D entre fotoceldas, la altura h f y el ángulo theta">
      <figcaption><b>Figura 2.</b> Plano inclinado. Aquí se miden la distancia <b>D</b> entre las
      fotoceldas y la altura <b>h<sub>f</sub></b> del carril ya inclinado. El ángulo <b>θ</b> no se
      mide: se deduce de las alturas.</figcaption>
    </figure>
  </div>

  <h2 class="sub">Esquema interactivo</h2>
  <p>Toca o haz clic sobre cada punto naranja para leer qué función cumple esa parte y por qué
  importa.</p>

  <div class="instr">
    <h3 class="instr__tit">Carril, carro y fotoceldas <span>interactivo</span></h3>
    <div class="montaje" id="montaje-host"></div>
  </div>

  <div class="nota">
    <strong>Mide la diferencia, no las alturas por separado.</strong> En sen θ = (h_f − h₀)/d solo
    interviene cuánto se ha levantado el extremo. Si mides las dos alturas desde el mismo punto de
    referencia —el borde de la mesa—, da igual dónde esté el cero de la regla: el error común se
    cancela en la resta. Lo que no se cancela es cambiar de referencia entre una medida y otra.
  </div>
`);

/* --- 7 · Procedimiento --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 6</span>
  <h1 class="titulo">Procedimiento</h1>
  <p class="plomo">Los siete pasos de la guía. Todos están marcados en naranja: en esta práctica
  casi cada paso deja un dato en el cuaderno.</p>

  <div class="pasos">
    ${PASOS.map((p,i) => `
      <div class="paso${p.clave ? ' paso--clave' : ''}">
        <div class="paso__n" aria-hidden="true">${i+1}</div>
        <div class="paso__t">
          <h3 class="sub3" style="margin:0 0 4px">${esc(p.t)}</h3>
          <p>${p.d}</p>
        </div>
      </div>`).join('')}
  </div>

  <div class="nota nota--aviso">
    <strong>Sesenta lanzamientos en total.</strong> Tres por masa, cinco masas por inclinación y
    dos inclinaciones. Conviene completar una masa entera antes de añadir la siguiente arandela, y
    revisar el promedio de cada fila sobre la marcha: si uno de los tres tiempos se aparta mucho
    de los otros dos, casi siempre es que el carro se empujó al soltarlo.
  </div>

  <div class="nota">
    <strong>Suelta siempre desde el mismo punto.</strong> La fórmula a = (v₂² − v₁²)/(2D) no
    necesita saber desde dónde se soltó el carro, de modo que un cambio de punto de partida no
    invalida la medida. Pero sí cambia las dos velocidades, y mantener el punto fijo hace que los
    tres lanzamientos de una fila sean comparables entre sí y que el promedio tenga sentido.
  </div>
`);

/* --- 8 · Encabezado del informe ------------------------------------------ */
PAGINAS.push(() => `
  <div class="cab-informe">
    <div class="cab-informe__txt">
      <span class="eyebrow">Informe · Encabezado</span>
      <h1 class="titulo" style="margin-bottom:0">Resumen y grupo de trabajo</h1>
    </div>
    <div class="casilla-nota">
      <span class="casilla-nota__et">Nota</span>
      ${campo({id:'nota', modo:'libre', ph:'—', et:'Nota asignada por el docente', clase:'campo--num'})}
      <span class="casilla-nota__pie">Espacio reservado para el docente</span>
    </div>
  </div>

  <h2 class="sub">Resumen</h2>
  <p style="font-size:.86rem;color:var(--tinta-3);margin:0 0 7px">
    Un párrafo que diga qué se hizo, cómo se hizo y qué se obtuvo. Se escribe al final, cuando ya
    conoces los resultados, aunque aparezca al principio del informe.</p>
  ${area({id:'resumen', filas:9, modelo:RESUMEN_MODELO, et:'Resumen del informe'})}

  <h2 class="sub">Estudiantes</h2>
  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr><th class="col-num">#</th><th style="width:58%">Nombre completo</th><th style="width:34%">Código</th></tr></thead>
      <tbody>
        ${[0,1,2].map(i => `
          <tr>
            <td class="col-num">${i+1}</td>
            <td>${campo({id:'est'+i, modo:'libre', ph:'nombre y apellidos', et:'Estudiante '+(i+1)})}</td>
            <td>${campo({id:'cod'+i, modo:'libre', ph:'código', et:'Código '+(i+1), clase:'campo--num'})}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <caption>Integrantes del grupo de laboratorio.</caption>
  </div>

  <div class="nota">
    <strong>Estos campos son tuyos.</strong> El autocompletado no inventa nombres, códigos ni
    calificaciones: la casilla de nota, la tabla de estudiantes y el docente quedan siempre en
    blanco. El resumen sí trae un modelo de redacción.
  </div>
  ${accionesPagina()}
`);

/* --- 9 · Marco teórico --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Punto 1</span>
  <h1 class="titulo">Marco teórico</h1>
  ${enunciado(1, 'Redacte el marco teórico de la práctica.')}

  <p>Debe cubrir, con tus propias palabras y citando las fuentes que consultes: qué afirma la
  segunda ley de Newton; qué fuerzas actúan sobre un cuerpo en un plano inclinado sin rozamiento y
  cómo se descompone el peso; por qué la aceleración resulta a = g·sen θ y por qué la masa
  desaparece; qué papel cumple el carril de aire; cómo se obtienen las velocidades a partir de los
  tiempos de las fotoceldas y por qué hay que corregir el ancho de la bandera; y cómo se llega
  desde ahí hasta el valor de la gravedad.</p>

  ${area({id:'marco', filas:17, modelo:MARCO_MODELO, et:'Marco teórico',
          ph:'Desarrolla aquí el marco teórico…'})}

  <div class="nota">
    <strong>El autocompletado carga un texto de referencia.</strong> Sirve para que veas la
    profundidad y la estructura esperadas, no para copiarlo: el marco teórico se califica por la
    comprensión que demuestra, y esa tiene que ser tuya.
  </div>
  ${accionesPagina()}
`);

/* --- 10 · Preinforme ----------------------------------------------------- */
PAGINAS.push(() => {
  const sen  = (0.0450 - 0.0150) / 1.200;
  const ang  = Math.asin(sen) * 180 / Math.PI;
  const Lc   = 0.0524 - CORRECCION;
  const v1   = Lc / 0.1300;
  const acel = (0.6253 * 0.6253 - 0.3829 * 0.3829) / (2 * 0.500);
  return `
  <span class="eyebrow">Preinforme</span>
  <h1 class="titulo">Predicciones antes de medir</h1>
  <p class="plomo">Cinco cálculos que puedes hacer con la teoría, antes de encender el soplador.
  Recorren la cadena entera: del seno del ángulo a la aceleración. Estos sí tienen respuesta
  correcta: el botón <em>Verificar</em> la contrasta.</p>

  <div class="datos-ejer">
    <span>sen θ = (h<sub>f</sub> − h₀)/d</span>
    <span>v = L/t̄</span>
    <span>a = (v₂² − v₁²)/2D</span>
    <span>g = ${f2(G_REF)} m/s²</span>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>1.</b> Un carril de <b>1,200 m</b> está a <b>0,0150 m</b> de la mesa
    cuando está horizontal y a <b>0,0450 m</b> una vez inclinado. ¿Cuánto vale <b>sen θ</b>?</p>
    <div class="ejer__r">
      <label for="pre-sen">sen θ</label>
      ${num({id:'pre-sen', resp:[f4(sen)], tol:0.0012, ph:'0,0000',
             et:'Seno del ángulo de inclinación',
             nota:`sen θ = (h_f − h₀)/d = (0,0450 − 0,0150)/1,200 = 0,0300/1,200 = ${f4(sen)}. Es un número sin unidades.`})}
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>2.</b> ¿A cuántos <b>grados</b> corresponde ese seno?</p>
    <div class="ejer__r">
      <label for="pre-ang">ángulo θ</label>
      ${num({id:'pre-ang', resp:[f2(ang)], tol:0.06, ph:'0,00',
             et:'Ángulo de inclinación en grados',
             nota:`θ = arcsen(${f4(sen)}) = ${f2(ang)}°. Son inclinaciones muy pequeñas: con más pendiente el carro bajaría demasiado deprisa para las fotoceldas.`})}
      <span class="ejer__u">°</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>3.</b> El pie de rey indica que la bandera mide <b>0,0524 m</b>.
    ¿Qué valor de <b>L</b> hay que usar en los cálculos?</p>
    <div class="ejer__r">
      <label for="pre-L">L corregida</label>
      ${num({id:'pre-L', resp:[f4(Lc)], tol:0.0006, ph:'0,0000',
             et:'Ancho corregido de la bandera',
             nota:`L = 0,0524 − ${f4(CORRECCION)} = ${f4(Lc)} m. El haz se interrumpe algo antes de que llegue el borde de la bandera, y esa corrección entra en las dos velocidades.`})}
      <span class="ejer__u">m</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>4.</b> Con esa bandera, la primera fotocelda marca <b>0,1300 s</b>.
    ¿Cuál es la velocidad <b>v₁</b>?</p>
    <div class="ejer__r">
      <label for="pre-v">velocidad v₁</label>
      ${num({id:'pre-v', resp:[f4(v1)], tol:0.006, ph:'0,0000',
             et:'Velocidad en la primera fotocelda',
             nota:`v₁ = L/t̄₁ = ${f4(Lc)}/0,1300 = ${f4(v1)} m/s. La fotocelda no mide velocidad: mide el tiempo que dura la interrupción.`})}
      <span class="ejer__u">m/s</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>5.</b> Si v₁ = <b>0,3829 m/s</b>, v₂ = <b>0,6253 m/s</b> y las fotoceldas
    están separadas <b>D = 0,500 m</b>, ¿cuál es la <b>aceleración</b>?</p>
    <div class="ejer__r">
      <label for="pre-a">aceleración a</label>
      ${num({id:'pre-a', resp:[f4(acel)], tol:0.006, ph:'0,0000',
             et:'Aceleración del carro',
             nota:`a = (v₂² − v₁²)/(2D) = (${f4(0.6253**2)} − ${f4(0.3829**2)})/1,000 = ${f4(acel)} m/s². Compárala con g·sen θ = ${f2(G_REF)} × ${f4(sen)} = ${f4(G_REF*sen)} m/s².`})}
      <span class="ejer__u">m/s²</span>
    </div>
  </div>

  <div class="nota">
    <strong>Compara las preguntas 1 y 5.</strong> El seno vale ${f4(sen)} y la aceleración sale
    ${f4(acel)} m/s². Su cociente es, precisamente, la gravedad: ${f2(acel/sen)} m/s². Toda la
    práctica consiste en hacer ese cociente con datos reales y comprobar que da lo que debe.
  </div>
  ${accionesPagina()}
`;
});

/* --- 11 · Tabla 1 · Medidas del montaje ---------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Punto 1 · Datos experimentales</span>
  <h1 class="titulo">Tabla 1 · Medidas del montaje</h1>
  ${enunciado(1, 'Tome las medidas indicadas en las Figuras 1 y 2 y complete la Tabla 1.')}

  <p class="plomo">Estas cuatro medidas se toman una sola vez y valen para las dos inclinaciones y
  para las diez columnas del análisis. Un error aquí se arrastra hasta el final, así que conviene
  tomarlas con calma.</p>

  <div class="tabla-caja">
    <table class="tabla" style="min-width:620px">
      <thead>
        <tr><th colspan="4" class="th-grupo">Tabla 1 · geometría del carril y de la bandera</th></tr>
        <tr><th style="width:24%">Magnitud</th><th style="width:22%">Valor</th>
            <th style="width:10%">Unidad</th><th>Qué es y dónde se mide</th></tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-fija">Ancho medido de la bandera</td>
          <td class="td-centro">${dato({id:'L-med', modelo:f4(L_MEDIDO), ph:'0,0000', et:'Ancho medido de la bandera'})}</td>
          <td class="td-centro"><span class="dato">m</span></td>
          <td>Con el pie de rey, de borde a borde de la placa.</td>
        </tr>
        <tr>
          <td class="col-fija">L corregida</td>
          <td class="td-centro"><span class="dato" id="L-corr">—</span></td>
          <td class="td-centro"><span class="dato">m</span></td>
          <td>El ancho medido menos ${f4(CORRECCION)} m. Es la que se usa en los cálculos; la calcula el cuaderno.</td>
        </tr>
        <tr>
          <td class="col-fija">d · longitud del carril</td>
          <td class="td-centro">${dato({id:'d-carril', modelo:f3(D_CARRIL), ph:'0,000', et:'Longitud total del carril'})}</td>
          <td class="td-centro"><span class="dato">m</span></td>
          <td>Longitud total del carril de aire, según la Figura 1.</td>
        </tr>
        <tr>
          <td class="col-fija">h₀ · altura en horizontal</td>
          <td class="td-centro">${dato({id:'h0', modelo:f4(H0_MODELO), ph:'0,0000', et:'Altura del carril horizontal'})}</td>
          <td class="td-centro"><span class="dato">m</span></td>
          <td>Del borde de la mesa al carril, con el carril sin inclinar.</td>
        </tr>
        <tr>
          <td class="col-fija">D · separación de fotoceldas</td>
          <td class="td-centro">${dato({id:'D-celdas', modelo:f3(D_CELDAS), ph:'0,000', et:'Distancia entre fotoceldas'})}</td>
          <td class="td-centro"><span class="dato">m</span></td>
          <td>Entre las dos fotoceldas, según la Figura 2.</td>
        </tr>
      </tbody>
    </table>
    <caption>Tabla 1. La guía pide L, d y h₀; se añaden la corrección de la bandera y la distancia D, que la guía recoge junto a la Figura 2.</caption>
  </div>

  <div id="resumen-geometria"></div>

  <div class="nota nota--aviso">
    <strong>El ancho de la bandera es la medida más delicada.</strong> Entra en v₁ y en v₂, y las
    velocidades entran al cuadrado en la aceleración: un error relativo del 1 % en L se convierte
    en un 2 % en la aceleración y, por tanto, en la gravedad. Por eso se mide con pie de rey y no
    con regla, y por eso hay que acordarse de la corrección de ${f4(CORRECCION)} m.
  </div>
  ${accionesPagina()}
`);

/* --- 12 y 13 · Tablas 2 y 3 · tiempos de cada inclinación ---------------- */
function tablaMasa(k, i){
  const filas = [0,1,2].map(j => `
    <tr>
      <td class="col-mag">${j+1}</td>
      <td class="td-centro">${dato({ id:`t1-${k+1}-${i+1}-${j}`, modelo:f4(t1Modelo(k,i,j)), ph:'0,0000',
            et:`Tiempo en la primera fotocelda, masa ${i+1}, lanzamiento ${j+1}` })}</td>
      <td class="td-centro">${dato({ id:`t2-${k+1}-${i+1}-${j}`, modelo:f4(t2Modelo(k,i,j)), ph:'0,0000',
            et:`Tiempo en la segunda fotocelda, masa ${i+1}, lanzamiento ${j+1}` })}</td>
    </tr>`).join('');

  return `
    <div class="tabla-mini">
      <h3 class="tabla-mini__tit">Masa ${i+1} de ${N_MASAS}</h3>
      <p class="tabla-mini__m">
        <label for="m-${k+1}-${i+1}">m${['¹','²','³','⁴','⁵'][i]} =</label>
        ${dato({ id:`m-${k+1}-${i+1}`, modelo:f4(MASAS_MODELO[k][i]), ph:'0,0000',
                 et:`Masa ${i+1} de la inclinación ${k+1}` })}
        <span class="ejer__u">kg</span>
      </p>
      <div class="tabla-caja">
        <table class="tabla">
          <thead>
            <tr><th style="width:18%">No.</th>
                <th class="th-sub">t¹ (s)</th>
                <th class="th-sub">t² (s)</th></tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
      <div class="tabla-mini__prom" id="prom-${k+1}-${i+1}">—</div>
    </div>`;
}

INCLINACIONES.forEach((INC, k) => {
  PAGINAS.push(() => `
    <span class="eyebrow">Informe · Punto 2 · Datos experimentales</span>
    <h1 class="titulo">Tabla ${INC.tabla} · ${esc(INC.nombre)}</h1>
    ${enunciado(2, `Suelte el carro desde la parte más alta del plano y registre los tiempos de paso por las dos fotoceldas, para cinco masas y tres lanzamientos cada una. Esta tabla corresponde a <b>${esc(INC.detalle)}</b>.`)}

    <div class="ejer">
      <p class="ejer__q"><b>Altura del carril inclinado.</b> Mide la distancia del borde de la
      mesa al carril con esta inclinación y anótala aquí: de ella sale el seno del ángulo.</p>
      <div class="ejer__r">
        <label for="hf-${k+1}">h<sub>f</sub> =</label>
        ${dato({ id:`hf-${k+1}`, modelo:f4(INC.hf), ph:'0,0000',
                 et:`Altura del carril inclinado, tabla ${INC.tabla}` })}
        <span class="ejer__u">m</span>
      </div>
      <div class="tabla-mini__prom" id="geom-${k+1}" style="margin-top:11px">—</div>
    </div>

    <div class="datos-ejer">
      <span>${N_MASAS} masas</span>
      <span>${N_MED} lanzamientos por masa</span>
      <span>v = L / t̄</span>
      <span>a = (v₂² − v₁²) / 2D</span>
    </div>

    <p>Las velocidades, la aceleración y la fuerza las calcula el cuaderno bajo cada tabla: tú
    solo escribes la masa y los seis tiempos que entrega el cronómetro.</p>

    <div class="rejilla-tablas">
      ${[0,1,2,3,4].map(i => tablaMasa(k, i)).join('')}
    </div>

    <div class="nota nota--aviso">
      <strong>Escribe los tiempos con cuatro decimales.</strong> El cronómetro de fotocelda
      resuelve décimas de milisegundo, y los tiempos son de centésimas de segundo: redondear a dos
      decimales dejaría los datos sin información. Usa coma o punto decimal, como prefieras.
    </div>

    <div class="nota">
      <strong>t² debe salir menor que t¹.</strong> El carro va más deprisa al llegar a la segunda
      fotocelda, de modo que tarda menos en cruzarla. Si en alguna fila ocurre lo contrario, revisa
      si no has intercambiado las columnas o si el carro recibió un empujón al soltarlo.
    </div>
    ${accionesPagina()}
  `);
});

/* --- 14 · Tablas 4 y 5 · análisis ---------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Análisis · Punto 1</span>
  <h1 class="titulo">Tablas 4 y 5 · Análisis</h1>
  ${enunciado(1, 'Utilizando los datos de las Tablas 2 y 3, calcule el promedio de los tiempos t¹ y t², las velocidades v¹ y v², la aceleración a, la fuerza gravitacional F<sub>g</sub> y la gravedad g, y complete las Tablas 4 y 5.')}

  <p class="plomo">Estas dos tablas se completan <b>solas</b> con lo que escribiste en las Tablas
  1, 2 y 3. Si corriges un tiempo y vuelves aquí, toda la cadena se recalcula.</p>

  <div class="formulario">
    <div class="f-carta">
      <div class="f-carta__n">Velocidades</div>
      <div class="f-carta__ec">v₁ = L/t̄₁ &nbsp; v₂ = L/t̄₂</div>
      <div class="f-carta__p">Con L ya corregida y los tiempos promediados.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Aceleración</div>
      <div class="f-carta__ec">a = (v₂² − v₁²)/2D</div>
      <div class="f-carta__p">Sobre el tramo entre las dos fotoceldas.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Fuerza y gravedad</div>
      <div class="f-carta__ec">F<sub>g</sub> = m·a/sen θ &nbsp; g = F<sub>g</sub>/m</div>
      <div class="f-carta__p">Despejadas de la segunda ley en el plano.</div>
    </div>
  </div>

  <div id="tabla-4"></div>
  <div id="tabla-5"></div>

  <h2 class="sub">Lo que hay que mirar en estas tablas</h2>
  <div id="lectura-analisis"></div>

  <div class="nota">
    <strong>Dos comprobaciones rápidas.</strong> La fila de la aceleración debería salir
    <b>casi igual en las cinco columnas</b> de una misma tabla: la masa no influye. Y la fila de la
    gravedad debería salir parecida en las <b>dos</b> tablas, aunque los ángulos sean distintos: es
    la misma gravedad medida dos veces.
  </div>
  ${accionesPagina()}
`);

/* --- 15 · Gráficas y Tabla 6 --------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Análisis · Punto 2</span>
  <h1 class="titulo">Gráficas F<sub>g</sub> frente a m</h1>
  ${enunciado(2, 'Utilizando los datos de las Tablas 4 y 5, construya una gráfica de F<sub>g</sub> contra m y anote las ecuaciones en la Tabla 6.')}

  <p class="plomo">Fuerza gravitacional en el eje vertical, masa en el horizontal, las dos
  inclinaciones en unos mismos ejes. La gráfica y el ajuste se recalculan solos cada vez que
  cambias un dato.</p>

  <div class="grafica" id="graf-fm"></div>

  <h2 class="sub">Modelo de ajuste</h2>
  <p>La recta general es la que entrega la línea de tendencia de una hoja de cálculo y es la que
  pide la guía. La recta por el origen impone que un cuerpo sin masa no pese; compara las dos y
  fíjate en cuánto cambia la pendiente.</p>

  <div class="ejer__r" style="margin:12px 0 4px">
    <label for="tipo-ajuste">Ajuste de los datos</label>
    <select class="campo campo--texto" id="tipo-ajuste" data-campo="tipo-ajuste"
            aria-label="Tipo de ajuste de los datos" style="min-width:300px">
      <option value="general">F = g·m + b  ·  recta general</option>
      <option value="origen">F = g·m  ·  recta por el origen</option>
    </select>
  </div>

  <div id="resultado-ajuste"></div>

  <h2 class="sub">Tabla 6 · Ecuaciones obtenidas</h2>
  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr><th style="width:26%">Tabla</th><th>Ecuación</th></tr></thead>
      <tbody>
        ${INCLINACIONES.map(INC => `
          <tr>
            <td class="col-mag">${INC.analisis}</td>
            <td>${campo({id:'ec-'+INC.n, modo:'libre', ph:'F = g·m', et:'Ecuación de la tabla '+INC.analisis})}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <caption>Tabla 6. Ecuaciones de las dos rectas. Se autocompletan con lo que el cuaderno acaba de calcular.</caption>
  </div>

  <div class="nota">
    <strong>Las dos rectas deberían salir casi superpuestas.</strong> Aunque los ángulos sean
    distintos y las aceleraciones también, la pendiente de ambas es la misma magnitud: la gravedad.
    Si una se desvía notablemente de la otra, el problema está en la medida de las alturas de esa
    inclinación, que es lo único que las distingue.
  </div>
  ${accionesPagina()}
`);

/* --- 16 · La gravedad obtenida ------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Análisis · Punto 3</span>
  <h1 class="titulo">La gravedad obtenida</h1>
  ${enunciado(3, 'Determine si el valor de la pendiente se aproxima al de la aceleración de la gravedad.')}

  <p class="plomo">La pendiente de cada recta es el valor experimental de g. Aquí están los dos,
  con su coeficiente de determinación y su error frente al valor de referencia.</p>

  <div class="ejer">
    <p class="ejer__q"><b>Valor de referencia.</b> El que se usa en el curso es
    ${f2(G_REF)} m/s². Puedes cambiarlo por el valor local estimado para Pereira,
    ${f3(G_PEREIRA)} m/s², y ver cómo varía el error.</p>
    <div class="ejer__r">
      <label for="g-ref">g de referencia</label>
      ${campo({id:'g-ref', modo:'libre', clase:'campo--num', ph:f2(G_REF),
               modelo:f2(G_REF), et:'Valor de referencia de la gravedad'})}
      <span class="ejer__u">m/s²</span>
    </div>
  </div>

  <div id="gravedad-host"></div>

  <div class="formula">
    <div class="formula__ec">E<sub>r</sub> (%) = |g<sub>exp</sub> − g| / g × 100</div>
    <div class="formula__pie">Error relativo del valor experimental respecto al de referencia.</div>
  </div>

  <h2 class="sub">Transcribe los resultados para tu informe</h2>
  <div class="tabla-caja">
    <table class="tabla" style="min-width:620px">
      <thead><tr>
        <th style="width:22%">Tabla</th>
        <th style="width:26%">g experimental (m/s²)</th>
        <th style="width:26%">R²</th>
        <th style="width:26%">Error relativo (%)</th>
      </tr></thead>
      <tbody>
        ${INCLINACIONES.map(INC => `
          <tr>
            <td class="col-mag">${INC.analisis}</td>
            <td class="td-centro">${campo({id:'g-'+INC.n, modo:'libre', clase:'campo--num', ph:'0,00', et:'Gravedad experimental de la tabla '+INC.analisis})}</td>
            <td class="td-centro">${campo({id:'r2-'+INC.n, modo:'libre', clase:'campo--num', ph:'0,0000', et:'Coeficiente de determinación de la tabla '+INC.analisis})}</td>
            <td class="td-centro">${campo({id:'err-'+INC.n, modo:'libre', clase:'campo--num', ph:'0,00', et:'Error relativo de la tabla '+INC.analisis})}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <caption>Resultados finales de la práctica. Las casillas se autocompletan con lo que el cuaderno calculó.</caption>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>Valor final.</b> Promedia los dos resultados y escríbelo aquí: es la
    gravedad que mediste en esta práctica.</p>
    <div class="ejer__r">
      <label for="g-prom">g promedio</label>
      ${campo({id:'g-prom', modo:'libre', clase:'campo--num', ph:'0,00', et:'Gravedad promedio de las dos inclinaciones'})}
      <span class="ejer__u">m/s²</span>
    </div>
  </div>

  <div class="nota">
    <strong>No se trata de «acertar» 9,8.</strong> El objetivo es medir y después comparar. Si tu
    resultado queda por debajo del valor de referencia, la causa más probable es un rozamiento
    residual —flujo de aire insuficiente— que resta aceleración; si queda por encima, conviene
    revisar la medida del ancho de la bandera y la de las alturas. Un informe que explica bien una
    diferencia del 2 % vale más que uno que la esconde.
  </div>
  ${accionesPagina()}
`);

/* --- 17 · Simulador ------------------------------------------------------ */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 7</span>
  <h1 class="titulo">Simulador del plano inclinado</h1>
  <p class="plomo">El mismo carril, dentro del cuaderno. Sirve para anticipar los tiempos que vas
  a leer y, sobre todo, para ver de un vistazo que la masa no cambia nada y la inclinación sí.</p>

  <div class="instr">
    <h3 class="instr__tit">Carro sobre el carril de aire <span>en vivo</span></h3>
    <p class="instr__ayuda">Mueve el deslizador de <b>altura h<sub>f</sub></b> para inclinar más o
    menos el carril, y el de <b>masa</b> para cargar el carro. Pulsa <b>Soltar carro</b> y observa
    los tiempos que marcan las dos fotoceldas. La gráfica de la derecha muestra cómo depende la
    aceleración del seno del ángulo.</p>
    <div id="simulador-host"></div>
  </div>

  <div class="nota">
    <strong>Prueba esto.</strong> Suelta el carro y anota los dos tiempos. Ahora <b>duplica la
    masa</b> y vuelve a soltarlo: los tiempos no cambian. Después vuelve a la masa inicial y
    <b>duplica la altura</b> h<sub>f</sub> − h₀: la aceleración se duplica y los tiempos se acortan.
    Esas dos observaciones son las respuestas a las preguntas 1 y 3 del informe.
  </div>

  <div class="nota nota--aviso">
    <strong>El simulador no tiene rozamiento alguno.</strong> Aquí la aceleración vale exactamente
    g·sen θ. En el laboratorio, si el flujo de aire no es suficiente, queda un rozamiento residual
    que resta aceleración y hace que la gravedad obtenida salga algo baja: es la fuente de error
    más característica de esta práctica.
  </div>
`);

/* --- 18 · Preguntas ------------------------------------------------------ */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Preguntas</span>
  <h1 class="titulo">Preguntas</h1>
  ${enunciado(4, 'Responda y justifique cada pregunta con los datos, las gráficas y las ecuaciones que obtuvo.')}

  ${PREGUNTAS.map((q,i) => `
    <h3 class="sub3">${i+1}. ${esc(q.texto)}</h3>
    <p style="font-size:.86rem;color:var(--tinta-3);margin:0 0 7px">${esc(q.guia)}</p>
    ${area({id:q.id, guia:q.guia, modelo:q.modelo, et:'Respuesta '+(i+1), filas:7})}
  `).join('')}

  <div class="nota">
    <strong>La pregunta 4 pide un dibujo.</strong> Hazlo a mano sobre el informe impreso o
    insértalo en tu documento: el diagrama de cuerpo libre de la página del fundamento te sirve de
    modelo. En la casilla de arriba escribe el razonamiento, que es lo que se califica: qué fuerzas
    hay, cómo se descomponen y cuál queda sin compensar.
  </div>
  ${accionesPagina()}
`);

/* --- 19 · Conclusiones --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Conclusiones</span>
  <h1 class="titulo">Conclusiones</h1>
  ${enunciado(5, 'Escriba 3 conclusiones con respecto a la práctica.')}
  <p class="plomo">Cada conclusión debe apoyarse en algo que mediste: una fila de las Tablas 4 o
  5, una ecuación de la Tabla 6 o la comparación entre las dos inclinaciones.</p>

  <div class="datos-ejer">
    <span>segunda ley de Newton</span><span>valor de g obtenido</span>
    <span>independencia de la masa</span><span>fuentes de error</span>
  </div>

  ${CONCLUSIONES.map((c,i) => `
    <h3 class="sub3">Conclusión ${i+1}</h3>
    <p style="font-size:.86rem;color:var(--tinta-3);margin:0 0 7px">${esc(c.guia)}</p>
    ${area({id:c.id, guia:c.guia, modelo:c.modelo, et:'Conclusión '+(i+1), filas:6})}
  `).join('')}
  ${accionesPagina()}
`);

/* --- 20 · Glosario ------------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Anexo</span>
  <h1 class="titulo">Glosario</h1>
  <p class="plomo">Toca cada término para desplegar su definición.</p>

  <div class="glosario">
    ${GLOSARIO.map((g,i) => `
      <div class="glos-item">
        <button class="glos-btn" data-glos="${i}" aria-expanded="false" aria-controls="glos-${i}">
          <span class="glos-term">${esc(g.t)}</span>
          <span class="glos-mas" aria-hidden="true">+</span>
        </button>
        <div class="glos-def" id="glos-${i}" hidden>
          ${esc(g.d)} ${g.f ? `<em>(${esc(g.f)})</em>` : ''}
        </div>
      </div>`).join('')}
  </div>
`);

/* --- 21 · Referencias ---------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Anexo</span>
  <h1 class="titulo">Referencias</h1>
  <p class="plomo">Fuentes que sustentan el marco teórico y el procedimiento. Formato APA,
  7.ª edición.</p>

  <div style="margin-top:18px">
    ${REFERENCIAS.map(r => `
      <p style="padding-left:2.2em;text-indent:-2.2em;margin-bottom:14px;font-size:.95rem">${r}</p>
    `).join('')}
  </div>

  <div class="nota">
    <strong>Cómo citar este cuaderno.</strong> Departamento de Física, Universidad Tecnológica de
    Pereira. <i>Cuaderno interactivo de Laboratorio de Física I: plano inclinado</i>
    [Recurso educativo digital].
  </div>

  <h2 class="sub">Tu trabajo</h2>
  <p>Todo lo que escribiste se guarda únicamente en este navegador y en este dispositivo. Usa
  <em>Imprimir</em> en la barra superior para generar el PDF de entrega con todas las páginas, o
  <em>Reiniciar</em> para vaciar el cuaderno y empezar de nuevo.</p>
`);
