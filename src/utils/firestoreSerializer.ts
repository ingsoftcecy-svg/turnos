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
