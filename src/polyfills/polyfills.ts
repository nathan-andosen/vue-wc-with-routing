// Polyfill for Object.values
const valuesPolyfill = (obj: Object) => {
  const res: any[] = [];
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) res.push((obj as any)[i]);
  }
  return res;
}
if(!(Object as any).values) (Object as any).values = valuesPolyfill;