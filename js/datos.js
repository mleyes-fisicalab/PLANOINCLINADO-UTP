/* ============================================================================
   DATOS.JS — Contenido académico de la práctica
   Universidad Tecnológica de Pereira · Facultad de Ciencias Básicas
   Departamento de Física · Laboratorio de Física I
   Práctica 6 · Plano inclinado
   Fuente: «Informe. Plano inclinado»
   ========================================================================== */

const META = {
  universidad:  "Universidad Tecnológica de Pereira",
  facultad:     "Facultad de Ciencias Básicas",
  departamento: "Departamento de Física",
  asignatura:   "Laboratorio de Física I",
  practica:     "Práctica 6",
  titulo:       "Plano inclinado"
};

/* ------------------------------------------------------- Constantes físicas */
const G_REF      = 9.80;     // valor de referencia del curso, m/s²
const G_PEREIRA  = 9.776;    // valor local estimado para Pereira
const CORRECCION = 0.0024;   // se resta al ancho medido de la bandera, en metros
const N_MASAS    = 5;        // cinco masas por inclinación
const N_MED      = 3;        // tres lanzamientos por masa

/* --------------------------------------------------------------------------
   CONJUNTO DE DATOS DE REFERENCIA

   El grupo mide su propio carril, su propia bandera y sus propias masas, de
   modo que las casillas de las Tablas 1 a 3 no tienen una «respuesta
   correcta»: son datos suyos. Lo que sí tiene el cuaderno es un conjunto de
   datos de referencia, coherente y reproducible, que carga el botón
   «Autocompletar».

   Se construye a partir de un montaje verosímil: carril de 1,200 m, fotoceldas
   separadas 0,500 m, bandera de 52,4 mm y dos inclinaciones. Para cada una se
   calcula la aceleración teórica a = g·senθ con g = 9,776 m/s², el valor local
   estimado para Pereira, y de ahí los tiempos que marcarían las dos fotoceldas
   suponiendo que el carro se suelta 0,300 m antes de la primera. A esos tiempos
   se les aplica una desviación fija de unas pocas milésimas, del orden de la
   dispersión real de un cronómetro de fotocelda. Las desviaciones están
   escritas una a una y no se sortean al azar, para que el cuaderno entregue
   siempre el mismo ejemplo.
   -------------------------------------------------------------------------- */
const G_MODELO  = 9.776;     // gravedad con la que se generan los datos
const L_MEDIDO  = 0.0524;    // ancho medido de la bandera, en metros
const D_CARRIL  = 1.200;     // longitud total del carril, en metros
const H0_MODELO = 0.0150;    // altura del carril horizontal, en metros
const D_CELDAS  = 0.500;     // separación entre fotoceldas, en metros
const S0_MODELO = 0.300;     // recorrido antes de la primera fotocelda

/* Las dos inclinaciones: altura del borde elevado, en metros */
const INCLINACIONES = [
  { n:1, tabla:2, analisis:4, hf:0.0450, color:"#0C2B52", nombre:"Primera inclinación",
    detalle:"un bloque de aluminio bajo el extremo del carril" },
  { n:2, tabla:3, analisis:5, hf:0.0750, color:"#C87020", nombre:"Segunda inclinación",
    detalle:"los dos bloques de aluminio, uno encima del otro" }
];

/* Masas del carro con las arandelas que se le van añadiendo, en kilogramos */
const MASAS_MODELO = [
  [0.2050, 0.2250, 0.2450, 0.2650, 0.2850],
  [0.2050, 0.2350, 0.2650, 0.2950, 0.3250]
];

/* Desviación relativa de cada lectura de tiempo */
const DESV_T1 = [
  [[1.004,0.997,1.001],[0.998,1.003,1.000],[1.002,0.999,1.004],[0.997,1.002,0.999],[1.001,1.000,0.996]],
  [[0.999,1.003,0.998],[1.002,0.997,1.001],[0.998,1.001,1.003],[1.003,0.999,0.997],[1.000,1.002,0.998]]
];
const DESV_T2 = [
  [[0.998,1.002,1.000],[1.003,0.999,0.997],[0.999,1.002,1.001],[1.001,0.998,1.003],[0.997,1.001,1.000]],
  [[1.002,0.998,1.001],[0.997,1.002,0.999],[1.001,0.999,1.002],[0.998,1.003,1.000],[1.002,0.997,1.001]]
];

const L_MODELO = L_MEDIDO - CORRECCION;                       // 0,0500 m

function senModelo(k){ return (INCLINACIONES[k].hf - H0_MODELO) / D_CARRIL; }

/* Tiempos de referencia de la inclinación k, masa i, lanzamiento j */
function t1Modelo(k, i, j){
  const a  = G_MODELO * senModelo(k);
  const v1 = Math.sqrt(2 * a * S0_MODELO);
  return L_MODELO / v1 * DESV_T1[k][i][j];
}
function t2Modelo(k, i, j){
  const a  = G_MODELO * senModelo(k);
  const v1 = Math.sqrt(2 * a * S0_MODELO);
  const v2 = Math.sqrt(v1 * v1 + 2 * a * D_CELDAS);
  return L_MODELO / v2 * DESV_T2[k][i][j];
}

/* Formato español: coma decimal */
function f2(x){ return Number(x).toFixed(2).replace('.', ','); }
function f3(x){ return Number(x).toFixed(3).replace('.', ','); }
function f4(x){ return Number(x).toFixed(4).replace('.', ','); }
function f5(x){ return Number(x).toFixed(5).replace('.', ','); }

/* ------------------------------------------------------- Índice de secciones */
const SECCIONES = [
  { t: "Portada",                           d: "Identificación del cuaderno" },
  { t: "Índice",                            d: "Navegación por secciones" },
  { t: "Presentación de la práctica",       d: "Qué se mide y para qué" },
  { t: "Objetivos",                         d: "Metas de la sesión" },
  { t: "Materiales e instrumentos",         d: "Carril de aire, fotoceldas y carro" },
  { t: "Fundamento físico",                 d: "Segunda ley de Newton en el plano" },
  { t: "Montaje experimental",              d: "Figuras del informe y esquema interactivo" },
  { t: "Procedimiento",                     d: "Los siete pasos de la toma de datos" },
  { t: "Encabezado del informe",            d: "Resumen, nota y grupo de trabajo" },
  { t: "Marco teórico",                     d: "Redacción propia del grupo" },
  { t: "Preinforme · Predicciones",         d: "Cinco cálculos previos" },
  { t: "Tabla 1 · Medidas del montaje",     d: "L, d, h₀ y D" },
  { t: "Tabla 2 · Primera inclinación",     d: "Cinco masas y tres lanzamientos" },
  { t: "Tabla 3 · Segunda inclinación",     d: "Cinco masas y tres lanzamientos" },
  { t: "Tablas 4 y 5 · Análisis",           d: "Velocidades, aceleración, F_g y g" },
  { t: "Gráficas F_g frente a m",           d: "Ajuste lineal y Tabla 6" },
  { t: "La gravedad obtenida",              d: "Comparación con el valor conocido" },
  { t: "Simulador del plano inclinado",     d: "El carro bajando por el carril" },
  { t: "Preguntas",                         d: "Cuatro preguntas para justificar" },
  { t: "Conclusiones",                      d: "Tres cierres propios" },
  { t: "Glosario",                          d: "Términos clave de la práctica" },
  { t: "Referencias",                       d: "Fuentes consultadas" }
];

/* ----------------------------------------- Materiales e instrumentos */
const MATERIALES = [
  { n:"Carril de aire", f:"Riel por cuyos orificios sale aire a presión, de modo que el carro flota sobre una película delgada y el rozamiento se vuelve despreciable. Es lo que permite estudiar el plano inclinado en condiciones casi ideales: sin él, parte del peso se perdería venciendo la fricción y la gravedad obtenida saldría sistemáticamente baja." },
  { n:"Carro dinámico con bandera", f:"El cuerpo que desliza. La bandera es una placa de ancho conocido montada sobre él; al cruzar cada fotocelda interrumpe el haz durante un tiempo que el cronómetro registra. De ese tiempo y de ese ancho sale la velocidad." },
  { n:"Cronómetro con dos fotosensores", f:"Mide, con resolución de décimas de milisegundo, cuánto dura la interrupción del haz en cada fotocelda. No mide velocidades: mide tiempos, y la velocidad se calcula después." },
  { n:"Balanza", f:"Determina la masa del carro y la de cada conjunto de arandelas que se le añade. La masa es la variable que se hace cambiar entre una fila y otra de las tablas." },
  { n:"Pie de rey", f:"Calibrador con el que se mide el ancho de la bandera. Hace falta un instrumento de esa precisión porque ese ancho entra directamente en las dos velocidades y cualquier error suyo se traslada entero al resultado." },
  { n:"Bloques de aluminio", f:"Se colocan bajo un extremo del carril para inclinarlo. Uno solo da la inclinación de la Tabla 2; los dos apilados, la de la Tabla 3." },
  { n:"Arandelas", f:"Masas pequeñas que se añaden al carro para recorrer las cinco filas de cada tabla sin cambiar de carro." }
];

/* ------------------------------------------------- Procedimiento (guía) */
const PASOS = [
  { t:"Mide el montaje con el carril horizontal",
    d:"Con el carril perfectamente horizontal, mide el ancho de la bandera con el pie de rey, la longitud total del carril <b>d</b> y la altura <b>h₀</b> entre el borde de la mesa y el carril. Regístralos en la <b>Tabla 1</b>.", clave:true },
  { t:"Corrige el ancho de la bandera",
    d:`Al ancho medido hay que <b>restarle ${f4(CORRECCION)} m</b> por la construcción del fotosensor: el haz se corta un poco antes de que llegue el borde de la bandera. El valor corregido es la <b>L</b> que se usa en todos los cálculos; el cuaderno hace esa resta.`, clave:true },
  { t:"Inclina el carril y mide D y h_f",
    d:"Coloca un bloque de aluminio bajo un extremo. Mide la distancia <b>D</b> entre las dos fotoceldas y la altura <b>h_f</b> del borde de la mesa al carril ya inclinado.", clave:true },
  { t:"Mide la masa del carro",
    d:"Pesa el carro en la balanza y anota su valor en la casilla <b>m¹</b> de la Tabla 2. Péselo con la bandera puesta: también forma parte de lo que se acelera.", clave:true },
  { t:"Suelta el carro y mide los dos tiempos",
    d:"Suéltalo desde la parte más alta del plano, <b>sin empujarlo</b>, y anota los tiempos <b>t¹</b> y <b>t²</b> que tarda la bandera en cruzar cada fotocelda.", clave:true },
  { t:"Repite dos veces más y luego cambia la masa",
    d:"Repite el lanzamiento otras dos veces con la misma masa, y después añade arandelas para completar las <b>cinco masas</b> de la Tabla 2. Suelta siempre desde el mismo punto.", clave:true },
  { t:"Cambia la inclinación y repite todo",
    d:"Coloca el segundo bloque encima del primero, vuelve a medir <b>h_f</b> y repite el procedimiento completo para llenar la <b>Tabla 3</b>. No hace falta que las masas sean las mismas que en la Tabla 2.", clave:true }
];

/* ---------------------------- Partes del montaje (esquema interactivo) */
const PARTES = [
  { id:"car", n:"Carril de aire",
    d:"Riel hueco con orificios por los que sale aire a presión. El carro flota sobre esa película y el rozamiento se vuelve despreciable, de modo que la única fuerza que lo acelera es la componente del peso a lo largo del plano. Si el soplador no está encendido o algún orificio está obstruido, la aceleración medida sale menor que la real y la gravedad obtenida, baja." },
  { id:"cro", n:"Carro dinámico y bandera",
    d:"El cuerpo cuyo movimiento se estudia. La bandera es una placa de ancho conocido L montada sobre el carro: al cruzar una fotocelda interrumpe el haz durante un tiempo que depende de lo deprisa que vaya. Dividir el ancho entre ese tiempo da la velocidad media de la bandera al pasar, que se toma como la velocidad del carro en ese punto." },
  { id:"fot", n:"Fotoceldas",
    d:"Dos sensores ópticos separados una distancia D. Cada uno mide cuánto dura la interrupción del haz, no la velocidad. El experimento compara las velocidades en dos puntos distintos de la bajada: si el carro acelera, el segundo tiempo es menor que el primero, y de esa diferencia sale la aceleración." },
  { id:"dis", n:"Distancia D entre fotoceldas",
    d:"La distancia que recorre el carro entre un sensor y el otro. Es el tramo sobre el que se aplica la ecuación v₂² − v₁² = 2·a·D, de modo que un error al medirla se traslada directamente a la aceleración. Conviene medirla entre los mismos puntos de referencia de ambos sensores." },
  { id:"blo", n:"Bloques de aluminio",
    d:"Son los que producen la inclinación. Un bloque da el ángulo de la Tabla 2; los dos apilados, el de la Tabla 3, que es aproximadamente el doble. Esa duplicación es lo que permite responder a la pregunta de cómo varía la aceleración con la inclinación." },
  { id:"alt", n:"Alturas h₀ y h_f",
    d:"h₀ es la altura del carril respecto del borde de la mesa cuando está horizontal; h_f, la misma altura con el carril ya inclinado. La diferencia h_f − h₀ es cuánto se ha levantado el extremo, y dividida entre la longitud d del carril da directamente el seno del ángulo. Medir la diferencia, y no cada altura por separado, evita que importe dónde esté el cero de la regla." },
  { id:"ang", n:"Ángulo θ y su seno",
    d:"El ángulo que forma el carril con la horizontal. En esta práctica no se mide con un transportador sino a través de su seno, sen θ = (h_f − h₀)/d, que es lo que realmente aparece en las fórmulas. Son ángulos pequeños, de uno o dos grados: con más inclinación el carro bajaría demasiado deprisa para que las fotoceldas lo midan bien." },
  { id:"pes", n:"Peso y su componente a lo largo del plano",
    d:"El peso m·g apunta verticalmente hacia abajo y se descompone en dos: una perpendicular al plano, que la superficie compensa, y otra paralela al plano, de magnitud m·g·sen θ, que es la única que mueve al carro. De ahí sale a = g·sen θ, y despejando, g = a/sen θ." }
];

/* ----------------------------------------------- Resumen y marco teórico */
const RESUMEN_MODELO =
  "En esta práctica se estudió la segunda ley de Newton aplicada a un cuerpo que desliza por un " +
  "plano inclinado y se determinó a partir de ella el valor de la aceleración de la gravedad. Se " +
  "empleó un carril de aire, que reduce el rozamiento hasta hacerlo despreciable, inclinado " +
  "mediante bloques de aluminio en dos ángulos distintos. Un carro dinámico provisto de una " +
  "bandera de ancho conocido se soltó desde el extremo superior y dos fotoceldas registraron el " +
  "tiempo que la bandera tardaba en cruzar cada una de ellas; el procedimiento se repitió tres " +
  "veces para cada una de cinco masas y para cada inclinación. A partir de los tiempos promedio " +
  "se calcularon las velocidades en los dos puntos, y de ellas la aceleración mediante " +
  "v₂² − v₁² = 2·a·D. Como la componente del peso paralela al plano es la única fuerza apreciable " +
  "sobre el carro, la fuerza gravitacional se obtuvo como F_g = m·a/sen θ, y la gravedad como su " +
  "cociente con la masa. Al representar F_g frente a m se obtuvieron, para las dos inclinaciones, " +
  "rectas que pasan por el origen cuya pendiente es precisamente la aceleración de la gravedad. " +
  "Los valores obtenidos resultaron del orden de 9,75 m/s², con errores inferiores al uno por " +
  "ciento respecto del valor de referencia, lo que confirma tanto la validez del modelo como la " +
  "independencia de la aceleración respecto de la masa del carro.";

const MARCO_MODELO =
  "La segunda ley de Newton establece que la aceleración de un cuerpo es directamente " +
  "proporcional a la fuerza neta que actúa sobre él e inversamente proporcional a su masa, de " +
  "modo que F = m·a. El plano inclinado es, desde Galileo, el montaje clásico para ponerla a " +
  "prueba en el caso de la gravedad, porque permite «diluir» la caída libre: sobre un plano de " +
  "ángulo pequeño el cuerpo se acelera mucho menos que cayendo verticalmente y los tiempos se " +
  "vuelven medibles con instrumentos modestos.\n\n" +
  "Sobre un carro que desliza por un plano inclinado sin rozamiento actúan únicamente dos " +
  "fuerzas: su peso, m·g, dirigido verticalmente hacia abajo, y la fuerza normal que el plano " +
  "ejerce sobre él, perpendicular a la superficie. Conviene descomponer el peso en dos " +
  "direcciones, una paralela al plano y otra perpendicular a él. La componente perpendicular, de " +
  "magnitud m·g·cos θ, queda exactamente compensada por la normal, de manera que no hay " +
  "movimiento en esa dirección. La componente paralela, de magnitud m·g·sen θ, no está compensada " +
  "por nada: es la fuerza neta, y es la que acelera el carro plano abajo.\n\n" +
  "Aplicando la segunda ley a esa dirección se obtiene m·g·sen θ = m·a, y al simplificar la masa " +
  "queda a = g·sen θ. El resultado tiene una consecuencia que conviene subrayar: la aceleración " +
  "no depende de la masa del cuerpo. Un carro cargado y otro vacío bajan exactamente igual, " +
  "siempre que el rozamiento siga siendo despreciable. Es el mismo hecho que en la caída libre, " +
  "visto a cámara lenta. Lo que sí depende de la inclinación es la aceleración misma: con ángulo " +
  "nulo vale cero y con noventa grados vale g, es decir, se recupera la caída libre.\n\n" +
  "El carril de aire es lo que hace posible despreciar el rozamiento. El aire que sale por sus " +
  "orificios sostiene al carro sobre una película delgada, de modo que no hay contacto sólido " +
  "entre las superficies. Sin él habría que restar la fuerza de rozamiento, que se opone al " +
  "movimiento, y la aceleración resultaría menor que g·sen θ.\n\n" +
  "La medida de las velocidades se hace de forma indirecta. Las fotoceldas no miden velocidad " +
  "sino el tiempo durante el cual la bandera del carro interrumpe el haz luminoso. Como el ancho " +
  "L de la bandera es conocido, el cociente v = L/t da la velocidad media de la bandera mientras " +
  "pasa; y puesto que ese paso dura apenas unas centésimas de segundo, esa velocidad media se " +
  "confunde con la velocidad instantánea del carro en ese punto. Al ancho medido hay que " +
  "restarle una pequeña corrección, del orden de dos milímetros, porque el haz se interrumpe " +
  "ligeramente antes de que llegue el borde físico de la bandera.\n\n" +
  "Conocidas las velocidades en dos puntos separados una distancia D, la cinemática del " +
  "movimiento uniformemente acelerado proporciona la aceleración sin necesidad de medir ningún " +
  "tiempo adicional: v₂² − v₁² = 2·a·D, de donde a = (v₂² − v₁²)/(2D). Y conocida la aceleración " +
  "se invierte la relación a = g·sen θ para obtener la gravedad. El ángulo tampoco se mide " +
  "directamente: su seno se obtiene de la geometría del montaje, como el cociente entre la altura " +
  "que se ha levantado el extremo del carril y la longitud total del carril, sen θ = (h_f − h₀)/d.";

/* ---------------------------------------------------------- Preguntas */
const PREGUNTAS = [
  { id:"q1",
    texto:"De acuerdo con las gráficas obtenidas en el numeral 2 del Análisis, explique la relación que existe entre la fuerza gravitacional F_g y la masa m.",
    guia:"Fíjate en si los puntos se alinean, en si la recta pasa por el origen y en qué ocurre al duplicar la masa.",
    modelo:"La fuerza gravitacional es directamente proporcional a la masa. En las dos gráficas los puntos se alinean sobre una recta que pasa por el origen, con coeficientes de determinación muy próximos a la unidad, de modo que al aumentar la masa del carro la fuerza gravitacional aumenta en la misma proporción: si la masa se duplica, F_g se duplica. Era de esperar, porque F_g no es otra cosa que el peso del carro: la relación F_g = m·g es la definición misma del peso, y lo que la gráfica comprueba es que el factor de proporcionalidad entre ambos es el mismo para las cinco masas. Que la recta pase por el origen también tiene sentido físico y no es casualidad: un cuerpo de masa nula no pesaría nada. Conviene no confundir este resultado con la aceleración: la fuerza sí depende de la masa, pero la aceleración no, y de hecho los tiempos medidos en las fotoceldas resultaron prácticamente iguales para las cinco masas de una misma inclinación." },
  { id:"q2",
    texto:"Especifique qué representa la pendiente de las rectas obtenidas en el numeral 2 del Análisis y determine si su valor se aproxima al de la gravedad.",
    guia:"Compara la ecuación de tu recta con F_g = m·g, término a término, y mira las unidades.",
    modelo:"La pendiente de cada recta es la aceleración de la gravedad. Se ve comparando la ecuación obtenida con la expresión teórica F_g = m·g: el coeficiente que multiplica a la masa es g. Sus unidades son newtons por kilogramo, que equivalen exactamente a metros por segundo al cuadrado, puesto que 1 N = 1 kg·m/s². Los valores obtenidos en las dos inclinaciones fueron del orden de 9,75 m/s², con errores inferiores al uno por ciento respecto del valor de referencia de 9,80 m/s² utilizado en el curso. La aproximación es por tanto muy buena, y resulta notable si se tiene en cuenta que la gravedad se ha obtenido midiendo únicamente longitudes, masas y tiempos de unas centésimas de segundo. Vale la pena añadir que el valor local estimado para Pereira, a 4,8° de latitud norte y 1411 m de altitud, es de unos 9,776 m/s², algo menor que el valor convencional: los resultados experimentales quedan de hecho más cerca de él." },
  { id:"q3",
    texto:"Explique cómo varía la aceleración a con respecto a la inclinación del plano.",
    guia:"Compara las aceleraciones de las dos tablas y mira cuánto cambió el seno del ángulo entre ellas.",
    modelo:"La aceleración es directamente proporcional al seno del ángulo de inclinación, según a = g·sen θ. Los datos lo confirman con claridad: al pasar de un bloque a dos, la altura levantada se duplicó y con ella el seno del ángulo, y la aceleración medida pasó de unos 0,244 m/s² a unos 0,488 m/s², es decir, también se duplicó. La relación no es con el ángulo sino con su seno, aunque para ángulos tan pequeños como los de esta práctica, de uno o dos grados, ambos son casi proporcionales entre sí y la diferencia no se aprecia. Los dos casos extremos ayudan a entenderla: con el plano horizontal el seno vale cero y el carro no acelera, y con el plano vertical el seno vale uno y la aceleración es la de la caída libre. El plano inclinado es, en ese sentido, una caída libre atenuada por un factor sen θ, que es precisamente lo que permite cronometrarla con comodidad." },
  { id:"q4",
    texto:"Realice un diagrama de cuerpo libre para la masa m y determine cuál es la fuerza neta que actúa sobre ella.",
    guia:"Dibuja solo las fuerzas que actúan sobre el carro y descompón el peso en las direcciones paralela y perpendicular al plano.",
    modelo:"Sobre el carro actúan únicamente dos fuerzas, porque el carril de aire elimina el rozamiento: su peso, de magnitud m·g y dirigido verticalmente hacia abajo, y la fuerza normal N que el plano ejerce sobre él, perpendicular a la superficie del carril. Conviene elegir unos ejes paralelo y perpendicular al plano en lugar de los habituales horizontal y vertical, porque así el movimiento ocurre a lo largo de un solo eje. Descompuesto en esas direcciones, el peso da una componente perpendicular de magnitud m·g·cos θ y una componente paralela de magnitud m·g·sen θ. En la dirección perpendicular no hay movimiento, de modo que la normal y la componente perpendicular del peso se equilibran: N = m·g·cos θ. En la dirección paralela, en cambio, no hay nada que compense a la componente del peso, y por tanto la fuerza neta es F_neta = m·g·sen θ, dirigida plano abajo. Aplicando la segunda ley de Newton a esa dirección resulta m·a = m·g·sen θ y, simplificando la masa, a = g·sen θ, que es la expresión sobre la que se apoya toda la práctica." }
];

/* -------------------------------------------------------- Conclusiones */
const CONCLUSIONES = [
  { id:"c1",
    guia:"Sobre la segunda ley de Newton: qué relación quedó verificada y con qué calidad.",
    modelo:"La práctica verifica la segunda ley de Newton aplicada a un cuerpo sobre un plano inclinado sin rozamiento. Al descomponer el peso en las direcciones paralela y perpendicular al plano, la fuerza neta resulta ser m·g·sen θ, y la aceleración medida experimentalmente coincidió con g·sen θ en las dos inclinaciones ensayadas. La representación de la fuerza gravitacional frente a la masa dio, en ambos casos, rectas que pasan por el origen con coeficientes de determinación superiores a 0,999, lo que confirma la proporcionalidad directa entre ambas magnitudes y, con ella, la validez del modelo empleado." },
  { id:"c2",
    guia:"Sobre el valor de la gravedad obtenido y su comparación con el de referencia.",
    modelo:"La pendiente de cada recta proporcionó el valor experimental de la aceleración de la gravedad, obtenido sin medir ninguna caída vertical y sin más instrumentos que una regla, un pie de rey, una balanza y un cronómetro de fotocelda. Los valores resultaron del orden de 9,75 m/s² en las dos inclinaciones, con errores inferiores al uno por ciento frente al valor de referencia de 9,80 m/s² y aún más próximos al valor local estimado para Pereira. La coincidencia entre las dos inclinaciones, obtenidas con ángulos que difieren en un factor dos, refuerza la confianza en el resultado: no se trata de un ajuste afortunado de una sola serie de medidas." },
  { id:"c3",
    guia:"Sobre la independencia de la aceleración respecto de la masa y las fuentes de error.",
    modelo:"Los datos muestran que la aceleración del carro no depende de su masa: los tiempos registrados por las fotoceldas resultaron prácticamente iguales para las cinco masas de una misma inclinación, como predice la expresión a = g·sen θ, en la que la masa se simplifica. Lo que sí depende de la inclinación es la aceleración, que se duplicó al duplicar la altura levantada. Las pequeñas discrepancias observadas se explican por la resolución del cronómetro frente a tiempos de centésimas de segundo, por la precisión con que se mide el ancho de la bandera —que entra en las dos velocidades— y por la medida de las alturas, de las que depende el seno del ángulo. Un rozamiento residual, por un flujo de aire insuficiente, daría una aceleración algo menor y una gravedad sistemáticamente baja." }
];

/* ------------------------------------------------------------- Glosario */
const GLOSARIO = [
  { t:"Plano inclinado", d:"Superficie plana que forma un ángulo con la horizontal. Permite estudiar la caída de los cuerpos de forma atenuada, con aceleraciones mucho menores que la de la caída libre.", f:"" },
  { t:"Segunda ley de Newton", d:"La aceleración de un cuerpo es directamente proporcional a la fuerza neta que actúa sobre él e inversamente proporcional a su masa: F = m·a.", f:"" },
  { t:"Fuerza neta", d:"Suma vectorial de todas las fuerzas que actúan sobre un cuerpo. Aquí, la componente del peso paralela al plano, m·g·sen θ.", f:"" },
  { t:"Diagrama de cuerpo libre", d:"Esquema en el que se dibujan únicamente las fuerzas que actúan sobre el cuerpo estudiado, con su dirección y su sentido, aislado de todo lo demás.", f:"" },
  { t:"Peso", d:"Fuerza con que la Tierra atrae a un cuerpo, de magnitud m·g y dirigida verticalmente hacia abajo. Se mide en newtons.", f:"" },
  { t:"Fuerza normal", d:"Fuerza que una superficie ejerce sobre el cuerpo apoyado en ella, siempre perpendicular a la superficie. En el plano inclinado vale m·g·cos θ.", f:"" },
  { t:"Componente de una fuerza", d:"Proyección de un vector fuerza sobre una dirección determinada. Descomponer el peso en direcciones paralela y perpendicular al plano es lo que simplifica el problema.", f:"" },
  { t:"Carril de aire", d:"Riel por cuyos orificios sale aire a presión, de modo que el carro flota y el rozamiento se vuelve despreciable.", f:"" },
  { t:"Fotocelda", d:"Sensor óptico que detecta la interrupción de un haz luminoso y mide su duración. No mide velocidades: mide tiempos.", f:"" },
  { t:"Bandera", d:"Placa de ancho conocido montada sobre el carro. Al cruzar la fotocelda interrumpe el haz, y del ancho y la duración sale la velocidad.", f:"" },
  { t:"Velocidad instantánea", d:"Velocidad de un cuerpo en un instante concreto. Aquí se aproxima por la velocidad media durante el breve paso de la bandera por el sensor.", f:"" },
  { t:"Movimiento uniformemente acelerado", d:"Movimiento con aceleración constante. En él se cumple v₂² − v₁² = 2·a·d entre dos puntos separados una distancia d.", f:"" },
  { t:"Aceleración", d:"Rapidez con la que cambia la velocidad de un cuerpo. Se mide en metros por segundo cada segundo (m/s²).", f:"" },
  { t:"Gravedad (g)", d:"Aceleración que la Tierra imprime a los cuerpos cercanos a su superficie. Vale unos 9,8 m/s², con variaciones según la latitud y la altitud.", f:"" },
  { t:"Seno del ángulo", d:"En esta práctica, el cociente entre la altura que se ha levantado el extremo del carril y su longitud total: sen θ = (h_f − h₀)/d.", f:"" },
  { t:"Rozamiento", d:"Fuerza que se opone al deslizamiento entre dos superficies en contacto. El carril de aire lo elimina casi por completo.", f:"" },
  { t:"Masa", d:"Cantidad de materia de un cuerpo, medida en kilogramos con la balanza. A diferencia del peso, no depende del lugar.", f:"" },
  { t:"Pie de rey", d:"Calibrador con nonio, capaz de medir longitudes con una precisión de centésimas de milímetro. Se usa para el ancho de la bandera.", f:"" },
  { t:"Ajuste por mínimos cuadrados", d:"Procedimiento que busca la recta que pasa lo más cerca posible de un conjunto de puntos, haciendo mínima la suma de los cuadrados de las separaciones.", f:"" },
  { t:"Coeficiente de determinación (R²)", d:"Número entre 0 y 1 que indica qué fracción de la variación de los datos explica la recta ajustada. Cuanto más próximo a 1, mejor describe el modelo a los datos.", f:"" },
  { t:"Error relativo", d:"Diferencia entre el valor experimental y el de referencia, dividida por el de referencia y expresada en porcentaje.", f:"" },
  { t:"Resolución", d:"Menor variación de la magnitud medida que produce un cambio perceptible en la indicación del instrumento.", f:"VIM 4.14" }
];

/* ----------------------------------------------------------- Referencias */
const REFERENCIAS = [
  "Serway, R. A., & Jewett, J. W. (2019). <i>Física para ciencias e ingeniería con física moderna</i> (10.ª ed., Vol. 1). Cengage Learning. Capítulo 5: Las leyes del movimiento — aplicaciones de las leyes de Newton.",
  "Young, H. D., & Freedman, R. A. (2018). <i>Sears y Zemansky. Física universitaria con física moderna</i> (14.ª ed., Vol. 1). Pearson. Capítulo 5: Aplicación de las leyes de Newton.",
  "Tipler, P. A., & Mosca, G. (2010). <i>Física para la ciencia y la tecnología</i> (6.ª ed., Vol. 1). Reverté.",
  "Taylor, J. R. (2014). <i>Introducción al análisis de errores. El estudio de las incertidumbres en las mediciones físicas</i> (2.ª ed.). Reverté.",
  "Moritz, H. (2000). Geodetic Reference System 1980. <i>Journal of Geodesy, 74</i>(1), 128–133. (Fórmula de la gravedad normal empleada para estimar el valor local.)",
  "Departamento de Física, Universidad Tecnológica de Pereira. <i>Informe. Plano inclinado</i>. Laboratorio de Física I, Facultad de Ciencias Básicas."
];
