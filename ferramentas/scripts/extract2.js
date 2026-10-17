const fs = require("fs"), vm = require("vm");
const html = fs.readFileSync(process.argv[2], "utf8");
const a = html.indexOf("var QS = ["), b = html.indexOf("/* ---------- Estado e armazenamento");
const D = vm.runInNewContext(html.slice(a, b) + "; ({QS, LESSONS, CHEERS, OOPS, MEDALS})");
const out = [], seen = new Set();
function add(t) { if (!seen.has(t)) { seen.add(t); out.push(t); } }
add("Voz ligada. Oi, Miguel!");
for (let l = 1; l <= 10; l++) add("Nível " + l + ". " + D.LESSONS[l]);
["A", "B", "C", "D"].forEach(x => add("Letra " + x + "."));
D.CHEERS.forEach(add); D.OOPS.forEach(add);
["Dois seguidos!", "Três seguidos! Você está voando!", "Quatro seguidos! Que máquina!", "Cinco seguidos! Perfeito!"].forEach(add);
for (let l = 2; l <= 10; l++) add("Você subiu para o nível " + l + "!");
for (let l = 1; l <= 9; l++) add("Vamos treinar o nível " + l + " mais um pouco.");
["Cinco de cinco! Missão perfeita, Miguel!", "Uau, Miguel! Que missão incrível!", "Boa missão! Cada pergunta nos deixa mais espertos.", "Missão feita! Amanhã a gente voa mais alto.", "Mais um dia seguido! Você é demais!"].forEach(add);
D.MEDALS.forEach(m => add("Nova medalha: " + m.name + "!"));
D.QS.forEach(q => { add(q[1]); q[2].forEach(add); add(q[4]); });
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
console.log("frases:", out.length);
