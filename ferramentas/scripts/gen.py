import sys, json, wave, subprocess, hashlib, base64, os, time
import numpy as np
import sherpa_onnx

manifest, model_dir, clip_dir, out_json = sys.argv[1:5]
texts = json.load(open(manifest, encoding="utf-8"))

cfg = sherpa_onnx.OfflineTtsConfig(
    model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(
            model=f"{model_dir}/pt_BR-faber-medium.onnx",
            tokens=f"{model_dir}/tokens.txt",
            data_dir=f"{model_dir}/espeak-ng-data",
        ),
        num_threads=2,
        provider="cpu",
    )
)
tts = sherpa_onnx.OfflineTts(cfg)

# voz de robô: mais aguda, brilho metálico leve e eco curto; sai em mp3 mono pequeno
FX = ("asetrate=22050*1.18,aresample=44100,atempo=0.8475,"
      "tremolo=f=38:d=0.28,aecho=0.8:0.6:18:0.28,highpass=f=120,alimiter=limit=0.95")

audio_map, total_s, t0 = {}, 0.0, time.time()
for i, text in enumerate(texts):
    h = hashlib.sha1(text.encode("utf-8")).hexdigest()[:12]
    mp3 = f"{clip_dir}/{h}.mp3"
    if not os.path.exists(mp3):
        a = tts.generate(text, sid=0, speed=1.0)
        x = np.array(a.samples, dtype=np.float32)
        pk = float(np.max(np.abs(x))) or 1e-4
        keep = np.where(np.abs(x) > 0.02 * pk)[0]
        if len(keep):
            pad = int(0.06 * a.sample_rate)
            x = x[max(0, keep[0] - pad): keep[-1] + pad]
        rms = float(np.sqrt(np.mean(x ** 2))) or 1e-4
        g = min(0.07 / rms, 0.95 / (float(np.max(np.abs(x))) or 1e-4))
        pcm = (np.clip(x * g, -1, 1) * 32767).astype(np.int16)
        wav = f"{clip_dir}/{h}.wav"
        with wave.open(wav, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(a.sample_rate)
            w.writeframes(pcm.tobytes())
        r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", FX,
                            "-ar", "24000", "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "32k", mp3],
                           capture_output=True, text=True)
        if r.returncode != 0:
            print("ffmpeg falhou:", text[:40], r.stderr[:200]); sys.exit(1)
        os.remove(wav)
    data = open(mp3, "rb").read()
    audio_map[text] = base64.b64encode(data).decode("ascii")
    if (i + 1) % 25 == 0:
        print(f"{i + 1}/{len(texts)} em {time.time() - t0:.0f}s", flush=True)

json.dump(audio_map, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
mb = os.path.getsize(out_json) / 1e6
print(f"pronto: {len(audio_map)} falas, {mb:.2f} MB em base64, {time.time() - t0:.0f}s")
