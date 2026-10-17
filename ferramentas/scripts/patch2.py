import sys
path = sys.argv[1]
s = open(path, encoding="utf-8").read()

def once(old, new):
    global s
    assert s.count(old) == 1, ("trecho nao encontrado ou repetido", old[:70], s.count(old))
    s = s.replace(old, new)

# ---- falas de parabéns mais variadas
once('var CHEERS = ["Isso aí, Miguel!", "Mandou bem!", "Acertou em cheio!", "Missão cumprida!", "Que explorador!"];',
     'var CHEERS = ["Isso aí, Miguel!", "Mandou bem!", "Acertou em cheio!", "Show de bola!", "Que explorador!", "Genial, Miguel!", "Uau, acertou!", "Que cérebro!"];')
once('var OOPS = ["Quase!", "Boa tentativa!", "Vamos aprender juntos!"];',
     'var OOPS = ["Quase!", "Boa tentativa!", "Vamos aprender juntos!", "Quase lá!", "Errar faz parte de aprender!"];')

# ---- CSS
CSS = r'''/* celebration */
#fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 30; pointer-events: none; }
.banner { position: fixed; left: 50%; top: 30%; transform: translate(-50%, -50%) scale(.3); z-index: 31; text-align: center; pointer-events: none; opacity: 0; width: min(92vw, 520px); }
.banner.on { animation: pop 2.6s cubic-bezier(.2, 1.3, .4, 1) forwards; }
.banner h2 { font-size: clamp(36px, 11vw, 62px); color: var(--sun-hi); text-shadow: 0 0 24px rgba(255, 197, 49, .9), 0 4px 0 #b95f00, 0 10px 30px rgba(0, 0, 10, .55); letter-spacing: .5px; }
.banner p { font-family: var(--display); font-size: 22px; font-weight: 700; text-shadow: 0 2px 12px rgba(0, 0, 10, .7); margin-top: 4px; }
.banner svg { width: 100%; height: auto; filter: drop-shadow(0 6px 18px rgba(255, 197, 49, .85)); }
@keyframes pop {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(.3) rotate(-6deg); }
  14% { opacity: 1; transform: translate(-50%, -50%) scale(1.14) rotate(2deg); }
  24% { transform: translate(-50%, -50%) scale(1) rotate(0); }
  80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -62%) scale(1.05); }
}
.float { position: fixed; z-index: 31; pointer-events: none; font-family: var(--display); font-weight: 800; font-size: 30px; white-space: nowrap; color: var(--sun-hi); text-shadow: 0 0 14px rgba(255, 197, 49, .9), 0 3px 0 #b95f00; animation: floatup 1.3s ease-out forwards; }
@keyframes floatup {
  0% { opacity: 0; transform: translate(-50%, 0) scale(.6); }
  15% { opacity: 1; transform: translate(-50%, -12px) scale(1.2); }
  100% { opacity: 0; transform: translate(-50%, -90px) scale(1); }
}
.stars3 { display: flex; justify-content: center; gap: 12px; }
.stars3 svg { width: 68px; height: 68px; opacity: .2; transform: scale(.6); }
.stars3 svg.on { animation: starin .6s cubic-bezier(.2, 1.6, .4, 1) forwards; }
@keyframes starin { to { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 14px rgba(255, 197, 49, .9)); } }

/* parents */'''
once('/* parents */', CSS)

# ---- HTML
once('<div id="toast" role="status"></div>', '<div id="toast" role="status"></div>\n<canvas id="fx" aria-hidden="true"></canvas>\n<div class="banner" id="banner" aria-live="assertive"></div>')

# ---- motor de comemoração
CELEB = r'''/* ---------- Comemoração: confete, fogos, faixas, combos e estrelas ---------- */
  var FX = { c: null, x: null, parts: [], run: false, reduce: !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) };
  var COLORS = ["#ffc531", "#ff8a3d", "#46e0a4", "#7aa7ff", "#ff7ab8", "#ffffff", "#b58cff"];
  var COMBO_LINES = ["Dois seguidos!", "Três seguidos! Você está voando!", "Quatro seguidos! Que máquina!", "Cinco seguidos! Perfeito!"];
  var COMBO_TXT = ["DOIS SEGUIDOS!", "TRÊS SEGUIDOS!", "QUATRO SEGUIDOS!", "PERFEITO!"];
  function medalById(id) { return MEDALS.filter(function (m) { return m.id === id; })[0]; }
  function fxInit() {
    if (FX.c) return;
    FX.c = document.getElementById("fx"); FX.x = FX.c.getContext("2d");
    function rs() { var d = Math.min(window.devicePixelRatio || 1, 2); FX.c.width = window.innerWidth * d; FX.c.height = window.innerHeight * d; FX.x.setTransform(d, 0, 0, d, 0, 0); }
    rs(); window.addEventListener("resize", rs);
  }
  function addP(p) { if (FX.parts.length < 700) FX.parts.push(p); }
  function confetti(x, y, n, spread, power) {
    fxInit(); if (FX.reduce) n = Math.ceil(n / 4);
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * spread, v = power * (0.5 + Math.random() * 0.7);
      addP({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 520, life: 1.6 + Math.random() * 1.2, age: 0, w: 6 + Math.random() * 6, h: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 14, col: COLORS[(Math.random() * COLORS.length) | 0], kind: 0 });
    }
    fxRun();
  }
  function firework(x, y) {
    fxInit(); var n = FX.reduce ? 14 : 46, col = COLORS[(Math.random() * 5) | 0], i;
    for (i = 0; i < n; i++) { var a = (i / n) * Math.PI * 2 + Math.random() * 0.2, v = 120 + Math.random() * 190; addP({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 160, life: 0.9 + Math.random() * 0.6, age: 0, w: 3, h: 3, col: i % 3 ? col : "#ffffff", kind: 1 }); }
    fxRun();
  }
  function fireworks(count) {
    var i;
    for (i = 0; i < count; i++) (function (k) {
      setTimeout(function () { firework(window.innerWidth * (0.15 + Math.random() * 0.7), window.innerHeight * (0.12 + Math.random() * 0.4)); tone(180 + Math.random() * 120, 0, 0.25, "triangle", 0.08); }, k * 320);
    })(i);
  }
  function fxRun() {
    if (FX.run) return; FX.run = true; var last = performance.now();
    (function step(now) {
      var dt = Math.min(0.05, (now - last) / 1000), x = FX.x, W = window.innerWidth, H = window.innerHeight, i, p; last = now;
      x.clearRect(0, 0, W, H);
      for (i = FX.parts.length - 1; i >= 0; i--) {
        p = FX.parts[i]; p.age += dt;
        if (p.age > p.life || p.y > H + 40) { FX.parts.splice(i, 1); continue; }
        p.vy += p.g * dt; p.vx *= (p.kind ? 0.985 : 0.995); p.x += p.vx * dt; p.y += p.vy * dt;
        x.globalAlpha = Math.max(0, Math.min(1, (p.life - p.age) / 0.5)); x.fillStyle = p.col;
        if (p.kind) { x.beginPath(); x.arc(p.x, p.y, p.w * (1 - p.age / p.life * 0.5), 0, 6.3); x.fill(); }
        else { p.r += p.vr * dt; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore(); }
      }
      x.globalAlpha = 1;
      if (FX.parts.length) requestAnimationFrame(step); else { FX.run = false; x.clearRect(0, 0, W, H); }
    })(last);
  }
  var bannerT = 0;
  function banner(title, sub, medalHtml) {
    var b = document.getElementById("banner");
    b.className = "banner"; void b.offsetWidth;
    b.innerHTML = (medalHtml ? '<div style="width:112px;margin:0 auto 6px">' + medalHtml + "</div>" : "") + "<h2>" + esc(title) + "</h2>" + (sub ? "<p>" + esc(sub) + "</p>" : "");
    b.className = "banner on"; clearTimeout(bannerT); bannerT = setTimeout(function () { b.className = "banner"; }, 2700);
  }
  function floatText(txt, x, y) {
    var d = document.createElement("div"); d.className = "float"; d.textContent = txt; d.style.left = x + "px"; d.style.top = y + "px";
    document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1400);
  }
  function comboSfx(n) { var base = 523 * Math.pow(1.122, Math.min(n, 6)); [0, 4, 7, 12].forEach(function (st, i) { tone(base * Math.pow(2, st / 12), i * 0.07, 0.2, "triangle", 0.16); }); }
  function fanfare() {
    [[523, 0], [659, 0.12], [784, 0.24], [1047, 0.36], [784, 0.52], [1047, 0.64], [1319, 0.78]].forEach(function (n) { tone(n[0], n[1], 0.3, "triangle", 0.2); tone(n[0] / 2, n[1], 0.3, "sine", 0.12); });
    tone(1568, 0.95, 0.6, "triangle", 0.16);
  }
  function starSfx(i) { tone(660 * Math.pow(1.26, i), 0, 0.3, "triangle", 0.2); tone(1320 * Math.pow(1.26, i), 0.05, 0.3, "sine", 0.1); }

  function celebrateAnswer() {
    var R = V.round; if (!R || !R.answered) return;
    var btn = app.querySelectorAll(".opt")[R.picked], r = btn ? btn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2, W = window.innerWidth, H = window.innerHeight;
    if (R.lastOk) {
      var c = R.combo || 1;
      confetti(cx, cy, 34 + c * 14, 2.4, 620 + c * 60);
      floatText("+10", cx, cy);
      if (c >= 2) {
        comboSfx(c); banner(COMBO_TXT[Math.min(c, 5) - 2], "Combo x" + c);
        confetti(W * 0.15, H * 0.85, 30, 1.2, 820); confetti(W * 0.85, H * 0.85, 30, 1.2, 820);
      }
      if (R.up) {
        setTimeout(function () { if (V.view !== "quiz") return; fanfare(); fireworks(4); Face.cheer = performance.now(); banner("NÍVEL " + S.level + "!", "Você subiu de nível!"); }, 900);
        setTimeout(function () { Face.cheer = performance.now(); }, 2000);
      }
    } else {
      confetti(cx, cy, 10, 2.8, 260);
      floatText("+2 coragem", cx, cy);
    }
  }

  function celebrateResult() {
    var R = V.round, W = window.innerWidth, H = window.innerHeight, t, i;
    R.starsDone = 0;
    for (i = 0; i < R.stars; i++) (function (k) {
      setTimeout(function () {
        if (V.view !== "result") return;
        R.starsDone = k + 1;
        var el = document.querySelectorAll("#stars3 svg")[k]; if (el) el.classList.add("on");
        starSfx(k);
        var r = el ? el.getBoundingClientRect() : { left: W / 2, top: H / 3, width: 0, height: 0 };
        confetti(r.left + r.width / 2, r.top + r.height / 2, 26, 3.4, 420);
      }, 500 + k * 650);
    })(i);
    t = 500 + R.stars * 650 + 200;
    setTimeout(function () {
      if (V.view !== "result") return;
      fanfare(); fireworks(R.correct >= 3 ? 6 : 3); Face.cheer = performance.now();
      if (R.correct >= 5) banner("MISSÃO PERFEITA!", "5 de 5 acertos"); else banner("MISSÃO CUMPRIDA!", "+" + R.points + " pontos");
    }, t);
    t += 2800;
    R.newMedals.forEach(function (id) {
      var m = medalById(id);
      setTimeout(function () { if (V.view !== "result") return; fanfare(); confetti(W / 2, H * 0.45, 70, 6.28, 720); Face.cheer = performance.now(); banner(m.name, "Medalha nova!", medalSvg(true)); }, t);
      t += 3000;
    });
    if (R.streakUp && S.streak >= 2) {
      setTimeout(function () { if (V.view !== "result") return; comboSfx(4); confetti(W / 2, H * 0.5, 50, 6.28, 600); banner(S.streak + " DIAS SEGUIDOS!", "Você é demais!"); }, t);
    }
  }

  /* ---------- Eventos ---------- */'''
once('/* ---------- Eventos ---------- */', CELEB)

# ---- nextQuestion reset
once('R.answered = false; R.picked = -1; R.lastOk = false; R.head = ""; R.note = ""; R.hint = ""; R.listening = false;',
     'R.answered = false; R.picked = -1; R.lastOk = false; R.head = ""; R.note = ""; R.hint = ""; R.listening = false; R.up = false;')

# ---- answer()
once('S.points += 10; R.cRun++; R.wRun = 0;', 'S.points += 10; R.cRun++; R.wRun = 0; R.combo = (R.combo || 0) + 1;')
once('R.wRun++; R.cRun = 0; R.head = pick(OOPS);', 'R.wRun++; R.cRun = 0; R.combo = 0; R.points += 2; S.points += 2; R.head = pick(OOPS);')
once('R.note = "Você subiu para o nível " + S.level + "!"; setTimeout(function () { sfx("up"); }, 450);', 'R.note = "Você subiu para o nível " + S.level + "!"; R.up = true;')
once('''save(); render();
    var segs = [R.head, q[4]]; if (R.note) segs.push(R.note);
    say(segs);''', '''save(); render(); celebrateAnswer();
    var lead = (R.lastOk && R.combo >= 2) ? COMBO_LINES[Math.min(R.combo, 5) - 2] : R.head, segs;
    if (R.up) segs = [lead, R.note, q[4]]; else { segs = [lead, q[4]]; if (R.note) segs.push(R.note); }
    say(segs);''')

# ---- combo no topo do desafio
once('''<span class="chip">Nível ' + q[0] + '</span></div>' +''', '''<span class="chip">Nível ' + q[0] + '</span>' + (R.combo >= 2 ? '<span class="chip">' + flameSvg() + 'x' + R.combo + '</span>' : '') + '</div>' +''')

# ---- estrelas na tela de resultado
once('''\'<div class="row wrap"><div class="stat"><b>' + R.correct + '/' + R.total + '</b>''',
     '''\'<div class="stars3" id="stars3" aria-label="' + R.stars + ' de 3 estrelas">' + [0, 1, 2].map(function (i) { return starSvg("#ffc531").replace("<svg ", "<svg " + (i < (R.starsDone || 0) ? 'class="on" ' : "")); }).join("") + '</div>' +
      '<div class="row wrap"><div class="stat"><b>' + R.correct + '/' + R.total + '</b>''')

# ---- finish()
once('if (S.last !== t) { S.streak = S.last === yesterday() ? S.streak + 1 : 1; S.last = t; }',
     'if (S.last !== t) { R.streakUp = S.last === yesterday(); S.streak = R.streakUp ? S.streak + 1 : 1; S.last = t; }')
once('R.msg = R.correct >= 4 ? "Uau, Miguel! Que missão incrível!"',
     'R.stars = R.correct >= 5 ? 3 : R.correct >= 3 ? 2 : 1;\n    R.msg = R.correct >= 5 ? "Cinco de cinco! Missão perfeita, Miguel!" : R.correct >= 4 ? "Uau, Miguel! Que missão incrível!"')
once('''save(); V.view = "result"; render(); Face.cheer = performance.now();
    if (R.newMedals.length) sfx("medal");
    var segs = [R.msg]; if (R.newMedals.length) segs.push("Você ganhou medalha nova!");
    say(segs);''', '''save(); V.view = "result"; render(); celebrateResult();
    var segs = [R.msg];
    R.newMedals.forEach(function (id) { segs.push("Nova medalha: " + medalById(id).name + "!"); });
    if (R.streakUp && S.streak >= 2) segs.push("Mais um dia seguido! Você é demais!");
    say(segs);''')

open(path, "w", encoding="utf-8").write(s)
print("patch2 ok")
