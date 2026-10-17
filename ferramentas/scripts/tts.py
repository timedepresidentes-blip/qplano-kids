import sys, wave
import numpy as np
import sherpa_onnx

model_dir, text, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0

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
audio = tts.generate(text, sid=0, speed=speed)
pcm = (np.clip(np.array(audio.samples), -1, 1) * 32767).astype(np.int16)
with wave.open(out_path, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(audio.sample_rate)
    w.writeframes(pcm.tobytes())
print("ok", audio.sample_rate, round(len(pcm) / audio.sample_rate, 2), "s")
