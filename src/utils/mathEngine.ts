import { AnswerValidationResult, Exercise } from '../types/math';

/**
 * Normalizes an algebraic expression to a comparable standard string.
 * Handles superscripts, commutativity, spaces, multiplication signs, etc.
 */
export function normalizeExpression(expr: string): string {
  if (!expr) return '';

  let clean = expr.trim().toLowerCase();

  // Convert unicode superscripts to standard carats
  clean = clean
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁴/g, '^4')
    .replace(/⁵/g, '^5')
    .replace(/⁶/g, '^6');

  // Remove multiplication dots or asterisks between parentheses: )*( -> )(
  clean = clean.replace(/\)\s*[\*·•]\s*\(/g, ')(');
  clean = clean.replace(/([0-9a-z])\s*[\*·•]\s*([a-z\(])/g, '$1$2');

  // Remove spaces
  clean = clean.replace(/\s+/g, '');

  // Simplify double signs
  clean = clean.replace(/\+\+/g, '+');
  clean = clean.replace(/\+-/g, '-');
  clean = clean.replace(/-\+/g, '-');
  clean = clean.replace(/--/g, '+');

  // Handle leading plus
  if (clean.startsWith('+')) {
    clean = clean.substring(1);
  }

  return clean;
}

/**
 * Checks if a factored expression like "(x+3)(x-3)" matches "(x-3)(x+3)"
 * by extracting factor parentheses and comparing as a multi-set.
 */
function normalizeFactoredFactors(expr: string): string[] | null {
  const norm = normalizeExpression(expr);
  // Matches expressions strictly of form (f1)(f2)... or single factor like 3x(x+2)
  const factorRegex = /\(([^()]+)\)/g;
  const factors: string[] = [];
  let match;
  let matchLength = 0;

  while ((match = factorRegex.exec(norm)) !== null) {
    factors.push(normalizePolynomialTerms(match[1]));
    matchLength += match[0].length;
  }

  // If there are factors in parens
  if (factors.length >= 2 && matchLength === norm.length) {
    return factors.sort();
  }

  // Check if there is an outside factor like 3x(x+2) or 5(a-b)
  const outsideMatch = /^([0-9a-z\^]+)\(([^()]+)\)$/.exec(norm);
  if (outsideMatch) {
    return [outsideMatch[1], normalizePolynomialTerms(outsideMatch[2])].sort();
  }

  return null;
}

/**
 * Sorts terms in a polynomial: e.g. "9 + 6x + x^2" -> sorted by degree: "x^2 + 6x + 9"
 */
export function normalizePolynomialTerms(poly: string): string {
  const clean = normalizeExpression(poly);

  // If it contains parentheses or exponents on parens, don't split by + / -
  if (clean.includes('(') || clean.includes(')')) {
    return clean;
  }

  // Tokenize into terms with their sign
  const terms: string[] = [];
  let currentTerm = '';

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if ((char === '+' || char === '-') && i > 0 && clean[i - 1] !== '^') {
      terms.push(currentTerm);
      currentTerm = char;
    } else {
      currentTerm += char;
    }
  }
  if (currentTerm) {
    terms.push(currentTerm);
  }

  // Helper to extract degree of a term for standard descending canonical order
  const getDegree = (t: string): number => {
    if (t.includes('^3')) return 30;
    if (t.includes('^2')) return 20;
    if (/[a-z]/.test(t) && !t.includes('^')) return 10;
    return 0; // constant
  };

  // Canonical sort
  terms.sort((a, b) => {
    const degA = getDegree(a);
    const degB = getDegree(b);
    if (degA !== degB) return degB - degA;
    return a.localeCompare(b);
  });

  // Rebuild
  return terms.join('').replace(/^\+/, '');
}

/**
 * Compares user answer to exercise acceptable answers
 */
export function validateAnswer(userAnswer: string, exercise: Exercise): AnswerValidationResult {
  const userNorm = normalizeExpression(userAnswer);

  if (!userNorm) {
    return {
      isCorrect: false,
      userAnswerRaw: userAnswer,
      userAnswerNormalized: '',
      feedback: 'Ingresa o pronuncia una respuesta para validar.',
      correctAnswerFormatted: exercise.correctAnswerFormatted,
      stepByStep: exercise.stepByStep,
    };
  }

  // 1. Direct match with any acceptable answer
  for (const acc of exercise.acceptableAnswers) {
    if (userNorm === normalizeExpression(acc)) {
      return {
        isCorrect: true,
        userAnswerRaw: userAnswer,
        userAnswerNormalized: userNorm,
        feedback: '¡Excelente! Respuesta matemáticamente correcta.',
        correctAnswerFormatted: exercise.correctAnswerFormatted,
        stepByStep: exercise.stepByStep,
      };
    }
  }

  // 2. Factored form commutativity check (e.g. (x-3)(x+3) vs (x+3)(x-3))
  const userFactors = normalizeFactoredFactors(userNorm);
  if (userFactors) {
    for (const acc of exercise.acceptableAnswers) {
      const accFactors = normalizeFactoredFactors(acc);
      if (accFactors && userFactors.length === accFactors.length) {
        const matches = userFactors.every((f, idx) => f === accFactors[idx]);
        if (matches) {
          return {
            isCorrect: true,
            userAnswerRaw: userAnswer,
            userAnswerNormalized: userNorm,
            feedback: '¡Correcto! El orden de los factores no altera el producto.',
            correctAnswerFormatted: exercise.correctAnswerFormatted,
            stepByStep: exercise.stepByStep,
          };
        }
      }
    }
  }

  // 3. Polynomial term commutativity check (e.g. 9 + 6x + x^2 vs x^2 + 6x + 9)
  const userTermsNorm = normalizePolynomialTerms(userNorm);
  for (const acc of exercise.acceptableAnswers) {
    const accTermsNorm = normalizePolynomialTerms(acc);
    if (userTermsNorm === accTermsNorm) {
      return {
        isCorrect: true,
        userAnswerRaw: userAnswer,
        userAnswerNormalized: userNorm,
        feedback: '¡Muy bien! Términos correctos en orden válido.',
        correctAnswerFormatted: exercise.correctAnswerFormatted,
        stepByStep: exercise.stepByStep,
      };
    }
  }

  // Not correct
  return {
    isCorrect: false,
    userAnswerRaw: userAnswer,
    userAnswerNormalized: userNorm,
    feedback: 'Respuesta incorrecta. Revisa el procedimiento paso a paso a continuación.',
    correctAnswerFormatted: exercise.correctAnswerFormatted,
    stepByStep: exercise.stepByStep,
  };
}

export const validateMathAnswer = validateAnswer;

/**
 * Formats an expression to pretty math with superscripts for display
 */
export function formatMathForDisplay(expr: string): string {
  if (!expr) return '';
  return expr
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\^4/g, '⁴')
    .replace(/\^5/g, '⁵')
    .replace(/\*/g, '·')
    .replace(/\+/g, ' + ')
    .replace(/-(?![\^])/g, ' - ')
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\)\s*\(/g, ')(')
    .trim();
}
