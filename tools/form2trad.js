// run : node tools/form2trad.js 

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const context = {};
vm.createContext(context);

const filePath = path.resolve(__dirname, '../config/formElements.js');
let code = fs.readFileSync(filePath, 'utf8');

// Convertir tous les `export const xxx =` en `globalThis.xxx =`
code = code.replace(/export\s+const\s+(\w+)\s*=/g, 'globalThis.$1 =');

vm.runInContext(code, context);

const result = {};
const keyCounts = {};

for (const key in context) {
  const value = context[key];

  // On ne garde que les tableaux contenant des objets avec "section"
  if (!Array.isArray(value)) continue;
  if (!value.some(e => typeof e === 'object' && e.section)) continue;

  value.forEach(group => {
    if (!group.section) return;

    group.section.forEach(field => {
      let baseKey = field.trad || field.name;
      if (!baseKey) return;

      if (result.hasOwnProperty(baseKey)) {
        keyCounts[baseKey] = (keyCounts[baseKey] || 1) + 1;
        baseKey = `${baseKey}_${keyCounts[baseKey]}`;
      } else {
        keyCounts[baseKey] = 0;
      }

      if (field.label) result[baseKey] = field.label;
      if (field.placeholder) result[`${baseKey}_ph`] = field.placeholder;
    });
  });
}

const outputPath = path.resolve(__dirname, './trad.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`✅ Fichier écrit : ${outputPath}`);
