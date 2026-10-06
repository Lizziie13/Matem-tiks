/**
 * Intelligent Spanish Speech to Algebraic Math Parser
 * Converts spoken phrases in Spanish like:
 * "equis al cuadrado más cuatro equis más cuatro" -> "x^2 + 4x + 4"
 * "paréntesis equis más tres cierra paréntesis al cuadrado" -> "(x+3)^2"
 * "abre paréntesis x menos 5 cierra paréntesis abre paréntesis x más 5" -> "(x-5)(x+5)"
 */

export function parseSpanishSpeechToMath(spokenText: string): string {
  if (!spokenText) return '';

  let text = spokenText.toLowerCase().trim();

  // Replace common spoken word numbers
  const wordToNum: Record<string, string> = {
    'cero': '0',
    'uno': '1',
    'un': '1',
    'una': '1',
    'dos': '2',
    'tres': '3',
    'cuatro': '4',
    'cinco': '5',
    'seis': '6',
    'siete': '7',
    'ocho': '8',
    'nueve': '9',
    'diez': '10',
    'once': '11',
    'doce': '12',
    'trece': '13',
    'catorce': '14',
    'quince': '15',
    'dieciséis': '16',
    'dieciseis': '16',
    'diecisiete': '17',
    'dieciocho': '18',
    'diecinueve': '19',
    'veinte': '20',
    'veintiuno': '21',
    'veintidós': '22',
    'veintidos': '22',
    'veintitrés': '23',
    'veintitres': '23',
    'veinticuatro': '24',
    'veinticinco': '25',
    'veintiséis': '26',
    'veintisiete': '27',
    'veintiocho': '28',
    'veintinueve': '29',
    'treinta': '30',
    'treinta y seis': '36',
    'cuarenta': '40',
    'cuarenta y nueve': '49',
    'cincuenta': '50',
    'sesenta': '60',
    'sesenta y cuatro': '64',
    'setenta': '70',
    'ochenta': '80',
    'ochenta y uno': '81',
    'noventa': '90',
    'cien': '100',
  };

  // Replace variable names
  text = text.replace(/\bequis\b/gi, 'x');
  text = text.replace(/\by griega\b/gi, 'y');
  text = text.replace(/\bi griega\b/gi, 'y');
  text = text.replace(/\bzeta\b/gi, 'z');

  // Replace parenthesis
  text = text.replace(/\b(abre paréntesis|abrir paréntesis|paréntesis abierto|abre parentesis)\b/gi, ' ( ');
  text = text.replace(/\b(cierra paréntesis|cerrar paréntesis|paréntesis cerrado|cierra parentesis)\b/gi, ' ) ');
  // Sometimes speech recognizes just "paréntesis"
  // Let's replace "por paréntesis" with " ) ( " or " ( "
  text = text.replace(/\b(paréntesis|parentesis)\b/gi, ' ( ');

  // Replace signs & operations
  text = text.replace(/\bmás\b/gi, ' + ');
  text = text.replace(/\bmas\b/gi, ' + ');
  text = text.replace(/\bpositivo\b/gi, ' + ');
  text = text.replace(/\bmenos\b/gi, ' - ');
  text = text.replace(/\bnegativo\b/gi, ' - ');
  text = text.replace(/\bpor\b/gi, ' * ');
  text = text.replace(/\bmultiplicado por\b/gi, ' * ');
  text = text.replace(/\bentre\b/gi, ' / ');
  text = text.replace(/\bdividido entre\b/gi, ' / ');

  // Exponents
  text = text.replace(/\b(al cuadrado|al cuadro|cuadrada|cuadrado|a la dos|elevado a la dos|elevado al cuadrado|a la segunda potencia)\b/gi, '^2');
  text = text.replace(/\b(al cubo|cúbico|cubica|a la tres|elevado a la tres|elevado al cubo|a la tercera potencia)\b/gi, '^3');
  text = text.replace(/\b(a la cuatro|elevado a la cuatro|a la cuarta)\b/gi, '^4');
  text = text.replace(/\b(a la cinco|elevado a la cinco|a la quinta)\b/gi, '^5');
  text = text.replace(/\b(elevado a la|elevado a)\s*(\d+)/gi, '^$2');

  // Multi-word numbers
  for (const [word, num] of Object.entries(wordToNum)) {
    const reg = new RegExp(`\\b${word}\\b`, 'gi');
    text = text.replace(reg, num);
  }

  // Clean double spaces
  text = text.replace(/\s+/g, ' ').trim();

  // If there are adjacent parenthesis like "( x + 3 ) ( x - 3 )", simplify spaces
  // Fix cases like "x 2" -> "x^2" if spoken as "x 2"
  text = text.replace(/\b([a-z])\s+(\d+)\b/gi, (match, v, n) => {
    // If it's a coefficient after variable like "x 4", it could be x^4 or x*4. But usually "4x" was meant if "4 x"
    return `${v}^${n}`;
  });

  // Fix coefficient before variable like "4 x" -> "4x"
  text = text.replace(/(\d+)\s+([a-z])/gi, '$1$2');

  // Fix parentheses spaces
  text = text.replace(/\(\s+/g, '(');
  text = text.replace(/\s+\)/g, ')');
  text = text.replace(/\)\s*\(/g, ')(');
  text = text.replace(/\*\s*\(/g, '(');
  text = text.replace(/\)\s*\*/g, ')');

  // Balance parentheses if an opening exists without closing
  const opens = (text.match(/\(/g) || []).length;
  const closes = (text.match(/\)/g) || []).length;
  if (opens > closes) {
    text = text + ')'.repeat(opens - closes);
  } else if (closes > opens) {
    text = '('.repeat(closes - opens) + text;
  }

  // Remove unnecessary spaces around operators
  text = text.replace(/\s*\+\s*/g, ' + ');
  text = text.replace(/\s*-\s*/g, ' - ');
  text = text.replace(/\s*\^\s*/g, '^');

  return text.trim();
}
