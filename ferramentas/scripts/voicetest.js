const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const file = process.argv[2];
(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 400, height: 800 } });
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
  await page.addInitScript(() => {
    window.__starts = 0; window.__durs = [];
    const orig = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function () { window.__starts++; if (this.buffer) window.__durs.push(+this.buffer.duration.toFixed(2)); return orig.apply(this, arguments); };
  });
  await page.goto("file://" + file, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-act=start]");
  await page.click("[data-act=start]", { force: true });
  await page.waitForTimeout(6000);
  const afterLesson = await page.evaluate(() => ({ starts: window.__starts, durs: window.__durs.slice() }));
  await page.click("[data-act=quiz]", { force: true });
  await page.waitForTimeout(9000);
  const afterQ = await page.evaluate(() => ({ starts: window.__starts, durs: window.__durs.slice(), talk: !!document.querySelector(".say.talk") }));
  await page.click("[data-act=ans][data-k='0']", { force: true });
  await page.waitForTimeout(7000);
  const afterA = await page.evaluate(() => ({ starts: window.__starts, durs: window.__durs.slice() }));
  console.log(JSON.stringify({ afterLesson, afterQ, afterA, errors }, null, 1));
  await browser.close();
})().catch(e => { console.log("FALHA", e.message); process.exit(1); });
