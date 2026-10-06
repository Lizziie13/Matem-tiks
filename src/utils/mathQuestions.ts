import { Exercise, TopicId, TopicInfo } from '../types/math';

export const TOPICS: TopicInfo[] = [
  {
    id: 'binomio-cuadrado',
    title: 'Binomio al Cuadrado',
    shortTitle: 'Binomio al Cuadrado',
    description: 'Cuadrado del primero ± doble producto + cuadrado del segundo.',
    formula: '(a ± b)² = a² ± 2ab + b²',
    level: 1,
    badgeIcon: '²',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'diferencia-cuadrados',
    title: 'Binomios Conjugados / Dif. de Cuadrados',
    shortTitle: 'Dif. de Cuadrados',
    description: 'Producto de la suma por la diferencia es la diferencia de los cuadrados.',
    formula: '(a + b)(a - b) = a² - b²',
    level: 2,
    badgeIcon: '⚡',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'binomio-termino-comun',
    title: 'Binomios con Término Común',
    shortTitle: 'Término Común',
    description: 'Cuadrado del común + (suma de no comunes)x + producto de no comunes.',
    formula: '(x + a)(x + b) = x² + (a+b)x + ab',
    level: 3,
    badgeIcon: '🔗',
    color: 'from-amber-600 to-orange-600',
  },
  {
    id: 'factor-comun',
    title: 'Factor Común (Monomio y Polinomio)',
    shortTitle: 'Factor Común',
    description: 'Extraer el máximo factor que divide a todos los términos.',
    formula: 'ab + ac = a(b + c)',
    level: 4,
    badgeIcon: '🔍',
    color: 'from-violet-600 to-purple-600',
  },
  {
    id: 'trinomio-simple',
    title: 'Trinomio de la Forma x² + bx + c',
    shortTitle: 'Trinomio x²+bx+c',
    description: 'Dos números que multiplicados den c y sumados den b.',
    formula: 'x² + (m+n)x + mn = (x + m)(x + n)',
    level: 5,
    badgeIcon: '🎯',
    color: 'from-rose-600 to-pink-600',
  },
  {
    id: 'trinomio-compuesto',
    title: 'Trinomio de la Forma ax² + bx + c',
    shortTitle: 'Trinomio ax²+bx+c',
    description: 'Factorización de trinomios con coeficiente principal distinto de 1.',
    formula: 'ax² + bx + c = (px + q)(rx + s)',
    level: 6,
    badgeIcon: '⚔️',
    color: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'cubos-notables',
    title: 'Binomio al Cubo y Suma/Dif. de Cubos',
    shortTitle: 'Cubos Notables',
    description: 'Desarrollo cúbico y factorización de suma o diferencia de cubos.',
    formula: 'a³ ± b³ = (a ± b)(a² ∓ ab + b²)',
    level: 7,
    badgeIcon: '👑',
    color: 'from-yellow-500 to-amber-700',
  },
];

export const STATIC_EXERCISES: Exercise[] = [
  // 1. Binomio al cuadrado
  {
    id: 'bc-1',
    topicId: 'binomio-cuadrado',
    type: 'expand',
    level: 1,
    prompt: 'Desarrolla el siguiente binomio al cuadrado:',
    expression: '(x + 3)^2',
    displayExpression: '(x + 3)²',
    acceptableAnswers: ['x^2+6x+9', 'x²+6x+9', '9+6x+x^2', 'x^2+9+6x'],
    correctAnswerFormatted: 'x² + 6x + 9',
    stepByStep: [
      '1. Cuadrado del primer término: (x)² = x²',
      '2. Doble producto del primero por el segundo: 2 · (x) · (3) = 6x',
      '3. Cuadrado del segundo término: (3)² = 9',
      'Resultado final: x² + 6x + 9',
    ],
    hint: 'Aplica la fórmula: (a + b)² = a² + 2ab + b²',
  },
  {
    id: 'bc-2',
    topicId: 'binomio-cuadrado',
    type: 'expand',
    level: 1,
    prompt: 'Desarrolla el siguiente binomio al cuadrado:',
    expression: '(x - 5)^2',
    displayExpression: '(x - 5)²',
    acceptableAnswers: ['x^2-10x+25', 'x²-10x+25', '25-10x+x^2', 'x^2+25-10x'],
    correctAnswerFormatted: 'x² - 10x + 25',
    stepByStep: [
      '1. Cuadrado del primer término: (x)² = x²',
      '2. Doble producto con signo negativo: -2 · (x) · (5) = -10x',
      '3. Cuadrado del segundo término: (-5)² = +25',
      'Resultado final: x² - 10x + 25',
    ],
    hint: 'Recuerda que (a - b)² = a² - 2ab + b²',
  },
  {
    id: 'bc-3',
    topicId: 'binomio-cuadrado',
    type: 'expand',
    level: 2,
    prompt: 'Desarrolla el siguiente binomio al cuadrado:',
    expression: '(2x + 4)^2',
    displayExpression: '(2x + 4)²',
    acceptableAnswers: ['4x^2+16x+16', '4x²+16x+16', '16+16x+4x^2'],
    correctAnswerFormatted: '4x² + 16x + 16',
    stepByStep: [
      '1. Cuadrado del primer término: (2x)² = 4x²',
      '2. Doble producto: 2 · (2x) · (4) = 16x',
      '3. Cuadrado del segundo término: (4)² = 16',
      'Resultado final: 4x² + 16x + 16',
    ],
    hint: 'No olvides elevar al cuadrado tanto el 2 como la x: (2x)² = 4x²',
  },
  {
    id: 'bc-4',
    topicId: 'binomio-cuadrado',
    type: 'factor',
    level: 2,
    prompt: 'Factoriza el siguiente Trinomio Cuadrado Perfecto:',
    expression: 'x^2 + 8x + 16',
    displayExpression: 'x² + 8x + 16',
    acceptableAnswers: ['(x+4)^2', '(x+4)²', '(x+4)(x+4)'],
    correctAnswerFormatted: '(x + 4)²',
    stepByStep: [
      '1. Raíz cuadrada de x² = x',
      '2. Raíz cuadrada de 16 = 4',
      '3. Verificamos el término medio: 2 · (x) · (4) = 8x (cumple)',
      'Resultado: (x + 4)²',
    ],
    hint: 'Extrae la raíz cuadrada del primer y tercer término, y verifica el doble producto.',
  },

  // 2. Diferencia de cuadrados / Binomios conjugados
  {
    id: 'dc-1',
    topicId: 'diferencia-cuadrados',
    type: 'expand',
    level: 1,
    prompt: 'Calcula el producto de los siguientes binomios conjugados:',
    expression: '(x + 6)(x - 6)',
    displayExpression: '(x + 6)(x - 6)',
    acceptableAnswers: ['x^2-36', 'x²-36', '-36+x^2', '-36+x²'],
    correctAnswerFormatted: 'x² - 36',
    stepByStep: [
      '1. Cuadrado del término que no cambia de signo: (x)² = x²',
      '2. Menos el cuadrado del término simétrico: -(6)² = -36',
      'Resultado final: x² - 36',
    ],
    hint: 'Fórmula de binomios conjugados: (a + b)(a - b) = a² - b²',
  },
  {
    id: 'dc-2',
    topicId: 'diferencia-cuadrados',
    type: 'expand',
    level: 2,
    prompt: 'Calcula el producto notable:',
    expression: '(3x + 5)(3x - 5)',
    displayExpression: '(3x + 5)(3x - 5)',
    acceptableAnswers: ['9x^2-25', '9x²-25', '-25+9x^2'],
    correctAnswerFormatted: '9x² - 25',
    stepByStep: [
      '1. Cuadrado del primer término: (3x)² = 9x²',
      '2. Menos el cuadrado del segundo término: -(5)² = -25',
      'Resultado final: 9x² - 25',
    ],
    hint: 'Eleva 3x al cuadrado: 3² · x² = 9x²',
  },
  {
    id: 'dc-3',
    topicId: 'diferencia-cuadrados',
    type: 'factor',
    level: 2,
    prompt: 'Factoriza la siguiente diferencia de cuadrados:',
    expression: 'x^2 - 49',
    displayExpression: 'x² - 49',
    acceptableAnswers: ['(x+7)(x-7)', '(x-7)(x+7)'],
    correctAnswerFormatted: '(x + 7)(x - 7)',
    stepByStep: [
      '1. Raíz cuadrada de x² = x',
      '2. Raíz cuadrada de 49 = 7',
      '3. Formamos los binomios conjugados: (x + 7)(x - 7)',
    ],
    hint: 'La diferencia de cuadrados a² - b² se factoriza como (a + b)(a - b).',
  },
  {
    id: 'dc-4',
    topicId: 'diferencia-cuadrados',
    type: 'factor',
    level: 3,
    prompt: 'Factoriza completamente la diferencia de cuadrados:',
    expression: '4x^2 - 81',
    displayExpression: '4x² - 81',
    acceptableAnswers: ['(2x+9)(2x-9)', '(2x-9)(2x+9)'],
    correctAnswerFormatted: '(2x + 9)(2x - 9)',
    stepByStep: [
      '1. Raíz cuadrada de 4x² = 2x',
      '2. Raíz cuadrada de 81 = 9',
      '3. Expresamos en factores conjugados: (2x + 9)(2x - 9)',
    ],
    hint: 'Halla la raíz cuadrada de cada término.',
  },

  // 3. Binomios con término común
  {
    id: 'tc-1',
    topicId: 'binomio-termino-comun',
    type: 'expand',
    level: 2,
    prompt: 'Multiplica los siguientes binomios con término común:',
    expression: '(x + 3)(x + 5)',
    displayExpression: '(x + 3)(x + 5)',
    acceptableAnswers: ['x^2+8x+15', 'x²+8x+15', '15+8x+x^2'],
    correctAnswerFormatted: 'x² + 8x + 15',
    stepByStep: [
      '1. Cuadrado del término común: x²',
      '2. Suma de no comunes por el común: (3 + 5)x = 8x',
      '3. Producto de los no comunes: (3)(5) = 15',
      'Resultado final: x² + 8x + 15',
    ],
    hint: '(x + a)(x + b) = x² + (a + b)x + ab',
  },
  {
    id: 'tc-2',
    topicId: 'binomio-termino-comun',
    type: 'expand',
    level: 2,
    prompt: 'Multiplica los siguientes binomios con término común:',
    expression: '(x + 7)(x - 2)',
    displayExpression: '(x + 7)(x - 2)',
    acceptableAnswers: ['x^2+5x-14', 'x²+5x-14'],
    correctAnswerFormatted: 'x² + 5x - 14',
    stepByStep: [
      '1. Cuadrado del común: x²',
      '2. Suma de los no comunes: (+7 - 2)x = +5x',
      '3. Multiplicación de los no comunes: (+7)(-2) = -14',
      'Resultado: x² + 5x - 14',
    ],
    hint: 'Cuidado con la ley de signos al sumar y multiplicar.',
  },
  {
    id: 'tc-3',
    topicId: 'binomio-termino-comun',
    type: 'expand',
    level: 3,
    prompt: 'Desarrolla el producto:',
    expression: '(x - 4)(x - 6)',
    displayExpression: '(x - 4)(x - 6)',
    acceptableAnswers: ['x^2-10x+24', 'x²-10x+24'],
    correctAnswerFormatted: 'x² - 10x + 24',
    stepByStep: [
      '1. Cuadrado del común: x²',
      '2. Suma algebraica de no comunes: (-4 - 6)x = -10x',
      '3. Producto de no comunes: (-4)(-6) = +24',
      'Resultado final: x² - 10x + 24',
    ],
    hint: 'Menos por menos da más en el término independiente: (-4)(-6) = +24.',
  },

  // 4. Factor Común
  {
    id: 'fc-1',
    topicId: 'factor-comun',
    type: 'factor',
    level: 2,
    prompt: 'Factoriza extrayendo el máximo factor común:',
    expression: '3x^2 + 6x',
    displayExpression: '3x² + 6x',
    acceptableAnswers: ['3x(x+2)', '(x+2)3x', '3x*(x+2)'],
    correctAnswerFormatted: '3x(x + 2)',
    stepByStep: [
      '1. Máximo común divisor de 3 y 6 es 3.',
      '2. La variable repetida con menor exponente es x.',
      '3. Factor común: 3x.',
      '4. Dividimos: (3x² / 3x) + (6x / 3x) = x + 2',
      'Resultado: 3x(x + 2)',
    ],
    hint: 'Extrae el MCD de los coeficientes y las letras comunes con menor exponente.',
  },
  {
    id: 'fc-2',
    topicId: 'factor-comun',
    type: 'factor',
    level: 3,
    prompt: 'Factoriza por factor común monomio:',
    expression: '5x^3 - 15x^2',
    displayExpression: '5x³ - 15x²',
    acceptableAnswers: ['5x^2(x-3)', '5x²(x-3)', '(x-3)5x^2'],
    correctAnswerFormatted: '5x²(x - 3)',
    stepByStep: [
      '1. Coeficientes: MCD(5, 15) = 5',
      '2. Variables comunes: x con exponente menor x²',
      '3. Dividimos cada término entre 5x²: 5x³/5x² = x, -15x²/5x² = -3',
      'Resultado: 5x²(x - 3)',
    ],
    hint: 'El factor común contiene 5 y x².',
  },
  {
    id: 'fc-3',
    topicId: 'factor-comun',
    type: 'factor',
    level: 3,
    prompt: 'Factoriza la siguiente expresión:',
    expression: '2a(x + 1) + 3b(x + 1)',
    displayExpression: '2a(x + 1) + 3b(x + 1)',
    acceptableAnswers: ['(x+1)(2a+3b)', '(2a+3b)(x+1)'],
    correctAnswerFormatted: '(x + 1)(2a + 3b)',
    stepByStep: [
      '1. Observamos que el binomio (x + 1) se repite en ambos términos.',
      '2. Extraemos el factor común polinomio: (x + 1)',
      '3. Agrupamos los coeficientes restantes: (2a + 3b)',
      'Resultado: (x + 1)(2a + 3b)',
    ],
    hint: 'Factor común polinomio: el paréntesis repetido se saca como factor.',
  },

  // 5. Trinomio simple x^2 + bx + c
  {
    id: 'ts-1',
    topicId: 'trinomio-simple',
    type: 'factor',
    level: 3,
    prompt: 'Factoriza el siguiente trinomio:',
    expression: 'x^2 + 7x + 10',
    displayExpression: 'x² + 7x + 10',
    acceptableAnswers: ['(x+2)(x+5)', '(x+5)(x+2)'],
    correctAnswerFormatted: '(x + 2)(x + 5)',
    stepByStep: [
      '1. Buscamos dos números m y n que multiplicados den 10 y sumados den 7.',
      '2. Probamos factores de 10: 2 y 5 (2 · 5 = 10; 2 + 5 = 7). Cumple.',
      '3. Escribimos los dos binomios: (x + 2)(x + 5)',
    ],
    hint: 'Busca dos números que multiplicados den 10 y sumados den 7.',
  },
  {
    id: 'ts-2',
    topicId: 'trinomio-simple',
    type: 'factor',
    level: 3,
    prompt: 'Factoriza el trinomio cuadrático:',
    expression: 'x^2 - 5x + 6',
    displayExpression: 'x² - 5x + 6',
    acceptableAnswers: ['(x-2)(x-3)', '(x-3)(x-2)'],
    correctAnswerFormatted: '(x - 2)(x - 3)',
    stepByStep: [
      '1. Dos números multiplicados dan +6 y sumados dan -5.',
      '2. Como el producto es positivo y la suma negativa, ambos deben ser negativos: -2 y -3.',
      '3. Verificamos: (-2) · (-3) = 6 y (-2) + (-3) = -5.',
      'Resultado: (x - 2)(x - 3)',
    ],
    hint: 'Como el término del medio es negativo y el independiente positivo, ambos factores llevan signo menos.',
  },
  {
    id: 'ts-3',
    topicId: 'trinomio-simple',
    type: 'factor',
    level: 4,
    prompt: 'Factoriza el trinomio:',
    expression: 'x^2 + 3x - 18',
    displayExpression: 'x² + 3x - 18',
    acceptableAnswers: ['(x+6)(x-3)', '(x-3)(x+6)'],
    correctAnswerFormatted: '(x + 6)(x - 3)',
    stepByStep: [
      '1. Dos números que multiplicados den -18 y sumados den +3.',
      '2. Probamos factores: +6 y -3 -> (+6)(-3) = -18 y (+6) + (-3) = +3.',
      'Resultado: (x + 6)(x - 3)',
    ],
    hint: 'Tienen signos diferentes porque el producto es negativo (-18).',
  },

  // 6. Trinomio compuesto ax^2 + bx + c
  {
    id: 'tc-comp-1',
    topicId: 'trinomio-compuesto',
    type: 'factor',
    level: 4,
    prompt: 'Factoriza el siguiente trinomio:',
    expression: '2x^2 + 7x + 3',
    displayExpression: '2x² + 7x + 3',
    acceptableAnswers: ['(2x+1)(x+3)', '(x+3)(2x+1)'],
    correctAnswerFormatted: '(2x + 1)(x + 3)',
    stepByStep: [
      '1. Método del aspa simple o descomposición:',
      '2. Factores de 2x²: 2x y x. Factores de 3: 1 y 3.',
      '3. Multiplicamos cruzado: (2x)(3) + (x)(1) = 6x + x = 7x (coincide con el término central).',
      'Resultado: (2x + 1)(x + 3)',
    ],
    hint: 'Usa el método del aspa simple: descompón 2x² en 2x y x, y 3 en 1 y 3.',
  },
  {
    id: 'tc-comp-2',
    topicId: 'trinomio-compuesto',
    type: 'factor',
    level: 5,
    prompt: 'Factoriza el trinomio compuesto:',
    expression: '3x^2 - 5x - 2',
    displayExpression: '3x² - 5x - 2',
    acceptableAnswers: ['(3x+1)(x-2)', '(x-2)(3x+1)'],
    correctAnswerFormatted: '(3x + 1)(x - 2)',
    stepByStep: [
      '1. Factores de 3x²: 3x y x.',
      '2. Factores de -2: +1 y -2.',
      '3. Multiplicamos cruzado: (3x)(-2) + (x)(1) = -6x + x = -5x.',
      'Resultado final: (3x + 1)(x - 2)',
    ],
    hint: 'Busca factores cruzados que al sumar den -5x.',
  },

  // 7. Cubos Notables
  {
    id: 'cn-1',
    topicId: 'cubos-notables',
    type: 'expand',
    level: 5,
    prompt: 'Desarrolla el binomio al cubo:',
    expression: '(x + 2)^3',
    displayExpression: '(x + 2)³',
    acceptableAnswers: ['x^3+6x^2+12x+8', 'x³+6x²+12x+8', '8+12x+6x^2+x^3'],
    correctAnswerFormatted: 'x³ + 6x² + 12x + 8',
    stepByStep: [
      '1. Cubo del primero: x³',
      '2. Triple del cuadrado del primero por el segundo: 3 · (x)² · (2) = 6x²',
      '3. Triple del primero por el cuadrado del segundo: 3 · (x) · (2)² = 12x',
      '4. Cubo del segundo: (2)³ = 8',
      'Resultado: x³ + 6x² + 12x + 8',
    ],
    hint: '(a + b)³ = a³ + 3a²b + 3ab² + b³',
  },
  {
    id: 'cn-2',
    topicId: 'cubos-notables',
    type: 'factor',
    level: 5,
    prompt: 'Factoriza la diferencia de cubos:',
    expression: 'x^3 - 8',
    displayExpression: 'x³ - 8',
    acceptableAnswers: ['(x-2)(x^2+2x+4)', '(x-2)(x²+2x+4)', '(x^2+2x+4)(x-2)'],
    correctAnswerFormatted: '(x - 2)(x² + 2x + 4)',
    stepByStep: [
      '1. Raíz cúbica de x³ = x',
      '2. Raíz cúbica de 8 = 2',
      '3. Binomio de raíces con signo menos: (x - 2)',
      '4. Trinomio asociado: (x)² + (x)(2) + (2)² = x² + 2x + 4',
      'Resultado: (x - 2)(x² + 2x + 4)',
    ],
    hint: 'a³ - b³ = (a - b)(a² + ab + b²)',
  },
];

/**
 * Procedural Dynamic Exercise Generator for infinite practice
 */
export function generateDynamicExercise(topicId: TopicId, level: number = 1): Exercise {
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const id = `dyn-${topicId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  switch (topicId) {
    case 'binomio-cuadrado': {
      const a = randInt(1, level > 2 ? 3 : 1);
      const b = randInt(1, 9);
      const isMinus = Math.random() > 0.5;
      const sign = isMinus ? '-' : '+';
      const aTerm = a === 1 ? 'x' : `${a}x`;
      const expr = `(${aTerm} ${sign} ${b})^2`;
      const displayExpr = `(${aTerm} ${sign} ${b})²`;

      const firstTermCoeff = a * a;
      const firstTerm = firstTermCoeff === 1 ? 'x^2' : `${firstTermCoeff}x^2`;
      const middleCoeff = 2 * a * b;
      const midTerm = isMinus ? ` - ${middleCoeff}x` : ` + ${middleCoeff}x`;
      const lastTerm = ` + ${b * b}`;
      const correctAns = `${firstTerm}${midTerm}${lastTerm}`;
      const correctDisp = correctAns.replace(/\^2/g, '²');

      return {
        id,
        topicId,
        type: 'expand',
        level,
        prompt: 'Desarrolla el siguiente binomio al cuadrado:',
        expression: expr,
        displayExpression: displayExpr,
        acceptableAnswers: [
          correctAns.replace(/\s+/g, ''),
          correctDisp.replace(/\s+/g, ''),
        ],
        correctAnswerFormatted: correctDisp,
        stepByStep: [
          `1. Cuadrado del primero: (${aTerm})² = ${firstTerm.replace(/\^2/g, '²')}`,
          `2. Doble producto: 2 · (${aTerm}) · (${isMinus ? '-' : ''}${b}) = ${isMinus ? '-' : '+'}${middleCoeff}x`,
          `3. Cuadrado del segundo: (${isMinus ? '-' : ''}${b})² = ${b * b}`,
          `Resultado: ${correctDisp}`,
        ],
        hint: `Aplica la regla: (${aTerm} ${sign} ${b})² = a² ${sign} 2ab + b²`,
      };
    }

    case 'diferencia-cuadrados': {
      const b = randInt(2, 10);
      const bSq = b * b;
      if (Math.random() > 0.5) {
        // Expand
        return {
          id,
          topicId,
          type: 'expand',
          level,
          prompt: 'Desarrolla el producto de binomios conjugados:',
          expression: `(x + ${b})(x - ${b})`,
          displayExpression: `(x + ${b})(x - ${b})`,
          acceptableAnswers: [`x^2-${bSq}`, `x²-${bSq}`, `-${bSq}+x^2`],
          correctAnswerFormatted: `x² - ${bSq}`,
          stepByStep: [
            `1. Cuadrado del término común: (x)² = x²`,
            `2. Menos cuadrado del simétrico: -(${b})² = -${bSq}`,
            `Resultado: x² - ${bSq}`,
          ],
          hint: '(a + b)(a - b) = a² - b²',
        };
      } else {
        // Factor
        return {
          id,
          topicId,
          type: 'factor',
          level,
          prompt: 'Factoriza la siguiente diferencia de cuadrados:',
          expression: `x^2 - ${bSq}`,
          displayExpression: `x² - ${bSq}`,
          acceptableAnswers: [`(x+${b})(x-${b})`, `(x-${b})(x+${b})`],
          correctAnswerFormatted: `(x + ${b})(x - ${b})`,
          stepByStep: [
            `1. Raíz cuadrada de x² = x`,
            `2. Raíz cuadrada de ${bSq} = ${b}`,
            `Resultado: (x + ${b})(x - ${b})`,
          ],
          hint: 'Extrae la raíz cuadrada de cada término y escribe la suma por la diferencia.',
        };
      }
    }

    case 'binomio-termino-comun': {
      const a = randInt(1, 8) * (Math.random() > 0.5 ? 1 : -1);
      let b = randInt(1, 8) * (Math.random() > 0.5 ? 1 : -1);
      if (a === -b) b += 1; // avoid diff of squares

      const sum = a + b;
      const prod = a * b;
      const sumSign = sum >= 0 ? `+ ${sum}` : `- ${Math.abs(sum)}`;
      const prodSign = prod >= 0 ? `+ ${prod}` : `- ${Math.abs(prod)}`;

      const aSignStr = a >= 0 ? `+ ${a}` : `- ${Math.abs(a)}`;
      const bSignStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

      return {
        id,
        topicId,
        type: 'expand',
        level,
        prompt: 'Calcula el producto con término común:',
        expression: `(x ${aSignStr})(x ${bSignStr})`,
        displayExpression: `(x ${aSignStr})(x ${bSignStr})`,
        acceptableAnswers: [
          `x^2${sum >= 0 ? '+' + sum : sum}x${prod >= 0 ? '+' + prod : prod}`,
          `x²${sum >= 0 ? '+' + sum : sum}x${prod >= 0 ? '+' + prod : prod}`,
        ],
        correctAnswerFormatted: `x² ${sumSign}x ${prodSign}`,
        stepByStep: [
          `1. Cuadrado del común: x²`,
          `2. Suma algebraica de no comunes: (${a} + ${b})x = ${sum}x`,
          `3. Multiplicación de no comunes: (${a}) · (${b}) = ${prod}`,
          `Resultado: x² ${sumSign}x ${prodSign}`,
        ],
        hint: '(x + a)(x + b) = x² + (a+b)x + ab',
      };
    }

    case 'trinomio-simple': {
      const m = randInt(1, 7) * (Math.random() > 0.4 ? 1 : -1);
      const n = randInt(1, 7) * (Math.random() > 0.4 ? 1 : -1);
      const sum = m + n;
      const prod = m * n;

      const sumStr = sum === 0 ? '' : sum > 0 ? `+ ${sum}x` : `- ${Math.abs(sum)}x`;
      const prodStr = prod > 0 ? `+ ${prod}` : `- ${Math.abs(prod)}`;

      const mSignStr = m >= 0 ? `+${m}` : `${m}`;
      const nSignStr = n >= 0 ? `+${n}` : `${n}`;

      return {
        id,
        topicId,
        type: 'factor',
        level,
        prompt: 'Factoriza el siguiente trinomio de la forma x² + bx + c:',
        expression: `x^2 ${sumStr} ${prodStr}`,
        displayExpression: `x² ${sumStr} ${prodStr}`,
        acceptableAnswers: [
          `(x${mSignStr})(x${nSignStr})`,
          `(x${nSignStr})(x${mSignStr})`,
        ],
        correctAnswerFormatted: `(x ${m >= 0 ? '+' : '-'} ${Math.abs(m)})(x ${n >= 0 ? '+' : '-'} ${Math.abs(n)})`,
        stepByStep: [
          `1. Buscamos dos números que multiplicados den ${prod} y sumados den ${sum}.`,
          `2. Esos números son ${m} y ${n}.`,
          `3. Factores: (x ${m >= 0 ? '+' : '-'} ${Math.abs(m)})(x ${n >= 0 ? '+' : '-'} ${Math.abs(n)})`,
        ],
        hint: `Halla dos números cuyo producto sea ${prod} y cuya suma sea ${sum}.`,
      };
    }

    default: {
      // Fallback from static bank matching topic or random
      const filtered = STATIC_EXERCISES.filter((e) => e.topicId === topicId);
      if (filtered.length > 0) {
        const choice = filtered[Math.floor(Math.random() * filtered.length)];
        return { ...choice, id };
      }
      return { ...STATIC_EXERCISES[0], id };
    }
  }
}

/**
 * Gets a set of exercises for practice or exam
 */
export function getExerciseSet(topicId: TopicId | 'mixed', count: number = 5): Exercise[] {
  const result: Exercise[] = [];

  if (topicId === 'mixed') {
    const topics = TOPICS.map((t) => t.id);
    for (let i = 0; i < count; i++) {
      const tid = topics[i % topics.length];
      result.push(generateDynamicExercise(tid, 2));
    }
  } else {
    // Take static first then dynamic
    const staticForTopic = STATIC_EXERCISES.filter((e) => e.topicId === topicId);
    for (const ex of staticForTopic) {
      if (result.length < count) result.push(ex);
    }
    while (result.length < count) {
      result.push(generateDynamicExercise(topicId, 2));
    }
  }

  // Shuffle
  return result.sort(() => Math.random() - 0.5);
}
