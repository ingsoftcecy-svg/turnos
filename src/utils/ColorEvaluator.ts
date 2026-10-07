export class ColorEvaluator {
  private static readonly COLOR_SPECS: Record<string, [number, number]> = {
    'BUD LIGHT': [6.02, 6.6],
    'CLSH': [7.13, 7.54],
    'CORONA': [5.44, 5.78],
    'CORONA E-P': [5.44, 5.78],
    'ESTRELLA': [7.43, 7.75],
    'MICHELOB ULTRA': [4.82, 5.25],
    'MODELO': [9.15, 9.48],
    'NEGRA MODELO': [25.84, 28.35],
    'PACIFICO': [6.10, 6.43],
    'VICTORIA': [16.12, 18.64],
    'MODELO PURA MALTA': [6.60, 7.40],
    'BUDWEISER': [4.66, 4.95],
    'GOLDEN LIGHT': [5.35, 6.35],
    'FLYING FISH': [4.85, 5.65],
    'NEGRA CHOCOLATE': [27.4, 35.59],
    'PACIFICO LIGHT': [6.7, 8.2],
    'PACIFICO SUAVE': [7.5, 11.5]
  };

  private static readonly P_SPECS: Record<string, [number, number]> = {
    'BUD LIGHT': [17.75, 18.25],
    'CLSH': [17.75, 18.25],
    'CORONA': [17.75, 18.25],
    'CORONA E-P': [17.75, 18.25],
    'ESTRELLA': [17.75, 18.25],
    'MICHELOB ULTRA': [15.55, 16.05],
    'MODELO': [17.75, 18.25],
    'NEGRA MODELO': [16.05, 16.55],
    'PACIFICO': [17.75, 18.25],
    'VICTORIA': [17.75, 18.25],
    'MODELO PURA MALTA': [13.25, 13.75],
    'BUDWEISER': [15.50, 16.50],
    'GOLDEN LIGHT': [16.05, 16.55],
    'FLYING FISH': [14.0, 14.0],
    'NEGRA CHOCOLATE': [17.75, 18.25],
    'PACIFICO LIGHT': [13.75, 14.25],
    'PACIFICO SUAVE': [16.65, 17.25]
  };

  /**
   * Normalizes the brand name to match the keys in our specification dictionaries.
   * @param brand - The raw brand name entered by the user.
   * @returns The normalized brand name in uppercase.
   */
  public static normalizeBrand(brand: string): string {
    const b = brand.toLowerCase().trim();
    
    // Abreviaciones comunes de los operadores
    if (b === 'bl' || b.includes('bud light')) return 'BUD LIGHT';
    if (b === 'mu' || b.includes('michelob')) return 'MICHELOB ULTRA';
    if (b === 'nm' || b.includes('negra mod') || b.includes('nrgra mod')) return 'NEGRA MODELO';
    if (b.includes('chocolate')) return 'NEGRA CHOCOLATE';
    if (b.includes('pura malta')) return 'MODELO PURA MALTA';
    
    // Variantes de Modelo
    if (b === 'mod e' || b === 'mode' || b.includes('modelo es') || b === 'modelo' || b === 'modelo e' || b === 'mod') return 'MODELO';
    
    // Variantes de Corona
    if (b === 'cor e' || b === 'core' || b.includes('corona e-p')) return 'CORONA E-P';
    if (b === 'cor' || b.includes('corona')) return 'CORONA';
    
    if (b.includes('budweiser')) return 'BUDWEISER';
    
    // Variantes de Pacifico
    if (b === 'pac s' || b === 'pac suave' || b.includes('pacifico sl') || b.includes('pacifico suave')) return 'PACIFICO SUAVE';
    if (b === 'pac l' || b === 'pac light' || b.includes('pacifico l')) return 'PACIFICO LIGHT';
    if (b === 'pac' || b.includes('pacifico')) return 'PACIFICO';
    
    // Otras marcas
    if (b === 'vic' || b.includes('victoria')) return 'VICTORIA';
    if (b.includes('estrella')) return 'ESTRELLA';
    if (b.includes('golden')) return 'GOLDEN LIGHT';
    if (b.includes('flying')) return 'FLYING FISH';
    if (b.includes('clsh')) return 'CLSH';
    
    // Marcas nuevas detectadas
    if (b === 'barr' || b.includes('barrilito')) return 'BARRILITO'; // Note: if missing from specs, it will default to black, which is safe.
    
    return b.toUpperCase();
  }

  /**
   * Evaluates if a given value is within the specifications for standard colors.
   * @param brand - The brand name.
   * @param valueStr - The measured value as a string.
   * @returns A hex color string.
   */
  public static getColorForSpec(brand: string, valueStr: string): string {
    return this.evaluateSpec(brand, valueStr, this.COLOR_SPECS);
  }

  /**
   * Evaluates if a given value is within the specifications for EMO.
   * @param brand - The brand name.
   * @param valueStr - The measured value as a string.
   * @returns A hex color string.
   */
  public static getColorForSpecP(brand: string, valueStr: string): string {
    return this.evaluateSpec(brand, valueStr, this.P_SPECS);
  }

  /**
   * Core evaluation logic used by specific evaluators.
   */
  private static evaluateSpec(brand: string, valueStr: string, specDictionary: Record<string, [number, number]>): string {
    if (!valueStr || valueStr.trim() === '') return '#000';
    const val = parseFloat(valueStr.replace(',', '.'));
    if (isNaN(val)) return '#000';
    if (!brand || brand.trim() === '') return '#000';
    
    const normBrand = this.normalizeBrand(brand);
    const spec = specDictionary[normBrand];
    
    if (!spec) return '#000'; 
    
    if (val >= spec[0] && val <= spec[1]) {
      return '#00a651'; // Verde (en rango)
    } else {
      return '#ed1c24'; // Rojo (fuera de rango)
    }
  }
}
