/**
 * Serializes a JavaScript object into a Firestore document format.
 * @param entry The object to serialize
 * @returns An object with a `fields` property containing the serialized data
 */
export function serializeToFirestore(entry: any) {
  const fields: any = {};
  for (const key in entry) {
    if (key === 'id') continue;
    
    const val = entry[key];
    if (typeof val === 'string') {
        fields[key] = { stringValue: val };
    } else if (typeof val === 'number') {
        fields[key] = { doubleValue: val };
    } else if (typeof val === 'boolean') {
        fields[key] = { booleanValue: val };
    } else if (Array.isArray(val)) {
        fields[key] = {
            arrayValue: {
                values: val.map(item => ({
                    mapValue: {
                        fields: serializeToFirestore(item).fields
                    }
                }))
            }
        };
    }
  }
  return { fields };
}

/**
 * Helper to extract values from Firestore format (stringValue, integerValue, etc)
 * @param val The Firestore value object
 * @returns The primitive value or object
 */
export const parseFirestoreValue = (val: any): any => {
  if (!val) return "";
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return val.integerValue;
  if (val.doubleValue !== undefined) return val.doubleValue;
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.arrayValue !== undefined) {
      return (val.arrayValue.values || []).map(parseFirestoreValue);
  }
  if (val.mapValue !== undefined) {
      const result: any = {};
      for (const k in val.mapValue.fields) {
          result[k] = parseFirestoreValue(val.mapValue.fields[k]);
      }
      return result;
  }
  return "";
};

/**
 * Converts Excel dates like "25-sep" to "YYYY-MM-DD" for the input type="date"
 * @param raw The raw date string from Excel
 * @returns A formatted YYYY-MM-DD string
 */
export const parseExcelDate = (raw: string): string => {
  if (!raw) return "";
  raw = raw.trim();
  
  if (raw.match(/^\d{4}-\d{2}-\d{2}$/)) return raw;
  
  if (/^\d+$/.test(raw)) {
      const serial = parseInt(raw, 10);
      const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
      if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
      }
  }
  
  const match = raw.match(/^(\d{1,2})[-/ ]+([a-zA-Z]+)/);
  if (match) {
      const day = match[1].padStart(2, '0');
      const monthStr = match[2].toLowerCase();
      const months: Record<string, string> = {
          'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
          'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12'
      };
      const month = months[monthStr.substring(0,3)] || '01';
      return `2026-${month}-${day}`; 
  }
  
  const matchSlash = raw.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (matchSlash) {
      const day = matchSlash[1].padStart(2, '0');
      const month = matchSlash[2].padStart(2, '0');
      let year = matchSlash[3] || '2026';
      if (year.length === 2) year = `20${year}`;
      return `${year}-${month}-${day}`;
  }

  return raw; 
};
