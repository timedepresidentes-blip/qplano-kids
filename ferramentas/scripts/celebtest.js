const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs"), vm = require("vm");
const file = process.argv[2], outDir = process.argv[3];
const html = fs.readFileSync(file, "utf8");
const a = html.indexOf("var QS = ["), b = html.indexOf("/* ---------- Estado e armazenamento");
const D = vm.runInNewContext(html.slice(a, b) + "; ({QS})");
(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 400, height: 820 } });
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  await page.goto("file://" + file, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-act=start]");
  await page.click("[data-act=start]", { force: true });
  await page.waitForTimeout(800);
  await page.click("[data-act=quiz]", { force: true });
  const log = [];
  for (let n = 0; n < 5; n++) {
    await page.waitForSelector(".bubble.q");
    const qtext = await page.textContent(".bubble.q");
    const q = D.QS.find(x => x[1] === qtext.trim());
    if (!q) { log.push("pergunta nao achada: " + qtext); break; }
    const want = q[2][q[3]];
    const idx = await page.evaluate(w => Array.from(document.querySelectorAll(".opt")).findIndex(o => o.lastElementChild.textContent === w), want);
    await page.click(`[data-act=ans][data-k='${idx}']`, { force: true });
    await page.waitForTimeout(n === 1 ? 1500 : 700);
    if (n === 2 || n === 1) await page.screenshot({ path: `${outDir}/shot_q${n + 1}.png` });
    log.push(`q${n + 1} ok, combo chip: ${await page.evaluate(() => (document.body.innerText.match(/x\d/) || [""])[0])}`);
    await page.click("[data-act=next]", { force: true });
    await page.waitForTimeout(300);
  }
  await page.waitForSelector("#stars3");
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${outDir}/shot_result1.png` });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${outDir}/shot_result2.png` });
  console.log(JSON.stringify({ log, errors }, null, 1));
  await browser.close();
})().catch(e => { console.log("FALHA", e.message); process.exit(1); });
