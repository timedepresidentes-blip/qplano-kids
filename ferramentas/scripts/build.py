import re, sys
sp = "/tmp/claude-0/-home-claude/2d692df0-5e5f-50d7-b56e-c33574ad6090/scratchpad"
t = open(sp + "/src/qplano-template.html", encoding="utf-8").read()
j = open(sp + "/src/audio.json", encoding="utf-8").read()
assert t.count("/*AUDIO_JSON*/{}") == 1
out = t.replace("/*AUDIO_JSON*/{}", j)
open(sp + "/qplano-kids.html", "w", encoding="utf-8").write(out)
code = re.findall(r"<script>(.*?)</script>", out, re.S)[-1]
open(sp + "/chk/app.js", "w", encoding="utf-8").write(code)
print("build ok", round(len(out) / 1e6, 2), "MB")
