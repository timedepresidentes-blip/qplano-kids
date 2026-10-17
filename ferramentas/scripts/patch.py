import sys
path = sys.argv[1]
s = open(path, encoding="utf-8").read()

def once(old, new):
    global s
    assert s.count(old) == 1, ("trecho nao encontrado ou repetido", old[:60], s.count(old))
    s = s.replace(old, new)

NEW_VOICE = r'''/* ---------- Voz do Quasar: falas gravadas (voz brasileira com efeito de robô), embutidas na página ---------- */
  var AUDIO = /*AUDIO_JSON*/{};
  var TTS = { token: 0 };
  var Talk = { on: false };
  var VOICE = { cache: {}, src: null, gain: null, an: null, buf: null };
  function setTalk(on) { Talk.on = on; var s = document.querySelector(".say"); if (s) { if (on) s.classList.add("talk"); else s.classList.remove("talk"); } }
  function b64buf(b64) { var bin = atob(b64), n = bin.length, u = new Uint8Array(n), i; for (i = 0; i < n; i++) u[i] = bin.charCodeAt(i); return u.buffer; }
  function loadClip(a, text) {
    if (VOICE.cache[text]) return VOICE.cache[text];
    var b64 = AUDIO[text];
    if (!b64) return Promise.resolve(null);
    var p = new Promise(function (res) {
      try {
        var ret = a.decodeAudioData(b64buf(b64), function (b) { res(b); }, function () { res(null); });
        if (ret && ret.catch) ret.catch(function () { res(null); });
      } catch (e) { res(null); }
    });
    VOICE.cache[text] = p;
    return p;
  }
  function playBuf(a, buf, token) {
    return new Promise(function (res) {
      if (token !== TTS.token) return res();
      if (!VOICE.gain) {
        VOICE.gain = a.createGain(); VOICE.gain.gain.value = 1;
        VOICE.an = a.createAnalyser(); VOICE.an.fftSize = 512; VOICE.buf = new Uint8Array(512);
        VOICE.gain.connect(VOICE.an); VOICE.an.connect(a.destination);
      }
      var s = a.createBufferSource(); s.buffer = buf; s.connect(VOICE.gain);
      VOICE.src = s; s.onended = function () { res(); };
      s.start();
    });
  }
  function stopSay() {
    TTS.token++;
    try { if (VOICE.src) { VOICE.src.onended = null; VOICE.src.stop(); } } catch (e) {}
    VOICE.src = null;
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    setTalk(false); duck(false);
  }
  function fallbackSpeak(t, token, done) {
    try {
      var ss = window.speechSynthesis; if (!ss) return done();
      var u = new SpeechSynthesisUtterance(t); u.lang = "pt-BR";
      u.onend = function () { if (token === TTS.token) done(); };
      u.onerror = function () { if (token === TTS.token) done(); };
      ss.speak(u);
    } catch (e) { done(); }
  }
  function say(segs) {
    if (!S.settings.voice) return;
    if (typeof segs === "string") segs = [segs];
    stopSay();
    var token = TTS.token, a = getAC(), i = 0;
    if (!a) return;
    setTalk(true); duck(true);
    (function next() {
      if (token !== TTS.token) return;
      if (i >= segs.length) { setTalk(false); duck(false); return; }
      var t = segs[i++];
      loadClip(a, t).then(function (buf) {
        if (token !== TTS.token) return;
        if (!buf) { fallbackSpeak(t, token, next); return; }
        playBuf(a, buf, token).then(function () { setTimeout(next, 140); });
      });
    })();
  }
  function lessonLine(l) { return "Nível " + l + ". " + LESSONS[l]; }

  '''

a = s.index("/* ---------- Voz do Quasar ---------- */")
b = s.index("/* ---------- Utilidades ---------- */")
s = s[:a] + NEW_VOICE + s[b:]

once('say("Nível " + S.level + ". " + LESSONS[S.level]);', 'say(lessonLine(S.level));')
once('say("Nível " + V.round.startLevel + ". " + LESSONS[V.round.startLevel]);', 'say(lessonLine(V.round.startLevel));')
once('''    var R = V.round, q = R.q, t = q[1] + " ";
    R.order.forEach(function (oi, k) { t += "Letra " + "ABCD".charAt(k) + ": " + q[2][oi] + ". "; });
    say(t);''', '''    var R = V.round, q = R.q, segs = [q[1]];
    R.order.forEach(function (oi, k) { segs.push("Letra " + "ABCD".charAt(k) + "."); segs.push(q[2][oi]); });
    say(segs);''')
once('say(R.head + " " + q[4] + (R.note ? " " + R.note : ""));', 'var segs = [R.head, q[4]]; if (R.note) segs.push(R.note);\n    say(segs);')
once('say(R.msg + (R.newMedals.length ? " Você ganhou medalha nova!" : ""));', 'var segs = [R.msg]; if (R.newMedals.length) segs.push("Você ganhou medalha nova!");\n    say(segs);')
once('var open = Talk.on ? 0.5 + 0.5 * Math.sin(t * 16 + Math.sin(t * 5) * 2) : 0;',
     'var open = 0;\n          if (Talk.on && VOICE.an) { VOICE.an.getByteTimeDomainData(VOICE.buf); var sum = 0, j, vv; for (j = 0; j < VOICE.buf.length; j++) { vv = (VOICE.buf[j] - 128) / 128; sum += vv * vv; } open = Math.min(1, Math.sqrt(sum / VOICE.buf.length) * 7); }')

open(path, "w", encoding="utf-8").write(s)
print("patch ok")
