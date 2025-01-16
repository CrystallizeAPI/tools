// Workaround to compile properly the yoga.wasm...
const bin = Bun.file('crystallize.js');
let content = await new Response(bin).text();
const pattern = /var Yoga = await initYoga\(await E\(_\(import\.meta\.url\)\.resolve\("\.\/yoga\.wasm"\)\)\);/g;
const replacement = `import initYogaAsm from 'yoga-wasm-web/asm'; const Yoga = initYogaAsm();`;
content = content.replace(pattern, replacement);
await Bun.write('crystallize.js', content);