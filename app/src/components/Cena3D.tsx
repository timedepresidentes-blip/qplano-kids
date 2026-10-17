/**
 * Cena 3D — portada do protótipo qplano-kids.html
 * Canvas fixo atrás de todo conteúdo (z-index:-1).
 * Renderiza: estrelas, Terra+Lua, Saturno+anéis, Quasar 3D.
 * O Quasar 3D segue qualquer elemento com classe CSS "q-slot" na tela atual.
 * Quando has3d é adicionado ao body, os SVGs dentro de .q-slot ficam ocultos.
 */
import { useEffect } from 'react'
import type * as THREE from 'three'

export function Cena3D() {
  useEffect(() => {
    let cancelled = false
    let animId = 0
    let canvas: HTMLCanvasElement | null = null

    async function setup() {
      // Importação dinâmica — Three.js fica em chunk separado
      const T = await import('three')
      if (cancelled) return

      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

      canvas = document.createElement('canvas')
      canvas.setAttribute('aria-hidden', 'true')
      canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none'

      let renderer: InstanceType<typeof T.WebGLRenderer>
      try {
        renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
      } catch { return }

      document.body.insertBefore(canvas, document.body.firstChild)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setClearColor(0x000000, 0)
      document.body.classList.add('has3d')

      const scene = new T.Scene()
      const camera = new T.PerspectiveCamera(50, 1, 0.1, 400)

      // Iluminação
      scene.add(new T.AmbientLight(0x8aa0ff, 0.55))
      const sunL = new T.DirectionalLight(0xfff0d0, 1.5); sunL.position.set(6, 8, 6); scene.add(sunL)
      const rim  = new T.DirectionalLight(0x6ab4ff, 0.8);  rim.position.set(-6, 2, -4); scene.add(rim)

      // Estrelas
      const N = 900, pos = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        const rad = 60 + Math.random() * 90
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        pos[i*3]   = rad * Math.sin(ph) * Math.cos(th)
        pos[i*3+1] = rad * Math.sin(ph) * Math.sin(th)
        pos[i*3+2] = -Math.abs(rad * Math.cos(ph)) - 10
      }
      const sg = new T.BufferGeometry()
      sg.setAttribute('position', new T.BufferAttribute(pos, 3))
      const stars = new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: 0.9, sizeAttenuation: true, transparent: true, opacity: 0.9 }))
      scene.add(stars)

      // Terra com textura desenhada em canvas
      function earthTex() {
        const c = document.createElement('canvas'); c.width = 512; c.height = 256
        const x = c.getContext('2d')!
        const g = x.createLinearGradient(0, 0, 0, 256)
        g.addColorStop(0, '#1b4fd1'); g.addColorStop(.5, '#2a74f0'); g.addColorStop(1, '#1b4fd1')
        x.fillStyle = g; x.fillRect(0, 0, 512, 256)
        x.fillStyle = '#2fa862'
        for (let k = 0; k < 26; k++) {
          const cx = Math.random() * 512, cy = 40 + Math.random() * 176
          for (let j = 0; j < 7; j++) { x.beginPath(); x.arc(cx + (Math.random()-.5)*60, cy + (Math.random()-.5)*30, 8 + Math.random()*22, 0, 6.3); x.fill() }
        }
        x.fillStyle = '#8f7a45'
        for (let k = 0; k < 14; k++) { x.beginPath(); x.arc(Math.random()*512, 60 + Math.random()*140, 5 + Math.random()*12, 0, 6.3); x.fill() }
        x.fillStyle = 'rgba(255,255,255,.75)'
        for (let k = 0; k < 40; k++) { x.beginPath(); x.ellipse(Math.random()*512, Math.random()*256, 14 + Math.random()*40, 4 + Math.random()*8, 0, 0, 6.3); x.fill() }
        x.fillStyle = 'rgba(255,255,255,.9)'; x.fillRect(0, 0, 512, 14); x.fillRect(0, 242, 512, 14)
        return new T.CanvasTexture(c)
      }
      const earth = new T.Mesh(new T.SphereGeometry(1, 48, 48), new T.MeshStandardMaterial({ map: earthTex(), roughness: 0.8, metalness: 0 }))
      const atmo  = new T.Mesh(new T.SphereGeometry(1.08, 48, 48), new T.MeshBasicMaterial({ color: 0x5fb0ff, transparent: true, opacity: 0.22, side: T.BackSide, blending: T.AdditiveBlending, depthWrite: false }))
      const earthG = new T.Group(); earthG.add(earth); earthG.add(atmo); scene.add(earthG)
      const moonG  = new T.Group()
      const moon   = new T.Mesh(new T.SphereGeometry(0.22, 24, 24), new T.MeshStandardMaterial({ color: 0xc9cbd6, roughness: 1 }))
      moon.position.set(1.9, 0.3, 0); moonG.add(moon); earthG.add(moonG)

      // Saturno com anéis
      function bandTex() {
        const c = document.createElement('canvas'); c.width = 256; c.height = 128
        const x = c.getContext('2d')!
        const cols = ['#f5b76b','#e08b3a','#f7d29a','#c96a2a','#f0c07f']
        for (let y = 0; y < 128; y += 6) { x.fillStyle = cols[Math.floor(Math.random()*cols.length)]; x.fillRect(0, y, 256, 6 + Math.random()*4) }
        return new T.CanvasTexture(c)
      }
      const ringP   = new T.Group()
      const satBody = new T.Mesh(new T.SphereGeometry(1, 40, 40), new T.MeshStandardMaterial({ map: bandTex(), roughness: 0.9 }))
      const satRing = new T.Mesh(new T.RingGeometry(1.4, 2.2, 64), new T.MeshBasicMaterial({ color: 0xf3d9a6, side: T.DoubleSide, transparent: true, opacity: 0.7 }))
      satRing.rotation.x = Math.PI / 2.3; ringP.add(satBody); ringP.add(satRing); ringP.rotation.z = -0.35; scene.add(ringP)

      // Quasar 3D — cabeça com rosto desenhado em canvas
      const faceC = document.createElement('canvas'); faceC.width = 512; faceC.height = 256
      const faceX = faceC.getContext('2d')!
      const faceTex = new T.CanvasTexture(faceC)

      function rr(x: CanvasRenderingContext2D, a: number, b: number, w: number, h: number, rd: number) {
        x.beginPath(); x.moveTo(a+rd,b); x.arcTo(a+w,b,a+w,b+h,rd); x.arcTo(a+w,b+h,a,b+h,rd); x.arcTo(a,b+h,a,b,rd); x.arcTo(a,b,a+w,b,rd); x.closePath()
      }
      let lastBlink = -1
      function drawFace(blink: number) {
        if (blink === lastBlink) return; lastBlink = blink
        const x = faceX; x.clearRect(0, 0, 512, 256)
        const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#16296c'); g.addColorStop(1, '#060b26')
        rr(x, 8, 8, 496, 240, 100); x.fillStyle = g; x.fill()
        x.lineWidth = 6; x.strokeStyle = 'rgba(143,211,255,.55)'; x.stroke()
        x.shadowColor = '#8fd3ff'; x.shadowBlur = 22; x.fillStyle = '#8fd3ff'; x.lineCap = 'round'
        const ery = blink ? 4 : 32
        x.beginPath(); x.ellipse(170, 100, 32, ery, 0, 0, 6.3); x.fill()
        x.beginPath(); x.ellipse(342, 100, 32, ery, 0, 0, 6.3); x.fill()
        x.lineWidth = 9; x.strokeStyle = '#8fd3ff'
        x.beginPath(); x.moveTo(200, 168); x.quadraticCurveTo(256, 214, 312, 168); x.stroke()
        faceTex.needsUpdate = true
      }

      const q = new T.Group()
      const white = new T.MeshStandardMaterial({ color: 0xf4f7ff, roughness: 0.35, metalness: 0.1 })
      const grey  = new T.MeshStandardMaterial({ color: 0xc7d3fa, roughness: 0.5 })
      const glowY = new T.MeshBasicMaterial({ color: 0xffc531 })

      function addMesh(geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) {
        const m = new T.Mesh(geo, mat); m.position.set(x, y, z); q.add(m); return m
      }
      const torso = addMesh(new T.SphereGeometry(0.95, 32, 24), white, 0, -0.95, 0)
      torso.scale.set(1, 1.08, 0.85)
      addMesh(new T.SphereGeometry(0.2, 20, 16), glowY, 0, -0.85, 0.74)

      const head = new T.Group(); head.position.set(0, 0.7, 0); q.add(head)
      head.add(new T.Mesh(new T.SphereGeometry(1.2, 40, 32), white))
      head.add(new T.Mesh(new T.SphereGeometry(1.215, 40, 24, Math.PI/2 - 0.95, 1.9, Math.PI/2 - 0.62, 1.15), new T.MeshBasicMaterial({ map: faceTex, transparent: true })))
      const ant = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.55, 8), grey); ant.position.set(0, 1.45, 0); head.add(ant)
      const tip = new T.Mesh(new T.SphereGeometry(0.14, 16, 12), glowY); tip.position.set(0, 1.78, 0); head.add(tip)

      const armL = new T.Group(), armR = new T.Group()
      ;[armL, armR].forEach((arm, k) => {
        const s = k ? 1 : -1; arm.position.set(s * 1.0, -0.55, 0)
        const u = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.9, 16), grey); u.position.set(s * 0.12, -0.4, 0); u.rotation.z = s * 0.3; arm.add(u)
        const h = new T.Mesh(new T.SphereGeometry(0.24, 16, 12), white); h.position.set(s * 0.3, -0.88, 0); arm.add(h); q.add(arm)
      })
      addMesh(new T.CylinderGeometry(0.26, 0.3, 0.7, 16), grey, -0.4, -2.0, 0)
      addMesh(new T.CylinderGeometry(0.26, 0.3, 0.7, 16), grey,  0.4, -2.0, 0)
      addMesh(new T.SphereGeometry(0.34, 16, 12), white, -0.4, -2.38, 0.08).scale.set(1, .6, 1.3)
      addMesh(new T.SphereGeometry(0.34, 16, 12), white,  0.4, -2.38, 0.08).scale.set(1, .6, 1.3)

      const jet = new T.Group(); jet.position.set(0, -0.8, -0.85)
      ;[-0.45, 0.45].forEach(x => {
        const c = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 1.2, 16), new T.MeshStandardMaterial({ color: 0x6c7bc4, roughness: .4, metalness: .3 }))
        c.position.x = x; jet.add(c)
        const f = new T.Mesh(new T.ConeGeometry(0.22, 0.9, 12), new T.MeshBasicMaterial({ color: 0xff8a3d }))
        f.position.set(x, -1.0, 0); f.rotation.x = Math.PI; jet.add(f)
      })
      q.add(jet)
      const MODEL_H = 5.0; scene.add(q); q.visible = false

      // Redimensionamento e layout
      function resize() {
        const w = window.innerWidth, h = window.innerHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h; camera.updateProjectionMatrix()
        layout()
      }
      function layout() {
        const d = 30, hh = Math.tan(camera.fov * Math.PI / 360) * d, hw = hh * camera.aspect
        earthG.position.set(-hw * 0.5, -hh * 0.78, -d); earthG.scale.setScalar(hh * 0.5)
        const d2 = 55, hh2 = Math.tan(camera.fov * Math.PI / 360) * d2, hw2 = hh2 * camera.aspect
        ringP.position.set(hw2 * 0.6, hh2 * 0.66, -d2); ringP.scale.setScalar(hh2 * 0.13)
      }
      resize(); window.addEventListener('resize', resize)

      let px = 0, py = 0
      const onPointer = (e: PointerEvent) => { px = (e.clientX / window.innerWidth) * 2 - 1; py = (e.clientY / window.innerHeight) * 2 - 1 }
      window.addEventListener('pointermove', onPointer)

      const vec = new T.Vector3()
      const t0  = performance.now()

      function loop() {
        if (cancelled) return
        const t = (performance.now() - t0) / 1000, k = reduce ? 0.2 : 1

        earth.rotation.y  = t * 0.05 * k
        moonG.rotation.y  = t * 0.25 * k
        ringP.rotation.y  = t * 0.03 * k
        stars.rotation.y  = t * 0.004 * k

        camera.position.set(px * 0.6, -py * 0.4 - window.scrollY * 0.002, 0)
        camera.lookAt(0, 0, -30); camera.updateMatrixWorld()

        const sl = document.querySelector<HTMLElement>('.q-slot')
        if (sl) {
          const b = sl.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight
          if (b.bottom > 0 && b.top < H) {
            const depth = 12
            const nx = ((b.left + b.width / 2) / W) * 2 - 1
            const ny = -(((b.top  + b.height / 2) / H) * 2 - 1)
            vec.set(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize()
            const tt = depth / -vec.z
            q.position.copy(camera.position).addScaledVector(vec, tt)
            const worldH = 2 * depth * Math.tan(camera.fov * Math.PI / 360)
            const sc = (b.height / H) * worldH / MODEL_H
            q.scale.setScalar(sc)
            q.position.y += Math.sin(t * 1.8) * 0.05 * sc * MODEL_H
            q.rotation.y   = px * 0.35 + Math.sin(t * 0.6) * 0.12
            head.rotation.y = px * 0.25; head.rotation.x = py * 0.12
            armL.rotation.z = Math.sin(t * 2) * 0.12
            armR.rotation.z = -Math.sin(t * 2 + 1) * 0.12
            drawFace((t % 4) < 0.12 ? 1 : 0)
            tip.scale.setScalar(1 + Math.sin(t * 4) * 0.2)
            q.visible = true
          } else { q.visible = false }
        } else { q.visible = false }

        renderer.render(scene, camera)
        animId = requestAnimationFrame(loop)
      }
      loop()

      // Cleanup registrado para quando o componente desmontar
      return () => {
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', onPointer)
        renderer.dispose()
        canvas?.remove()
        document.body.classList.remove('has3d')
      }
    }

    setup().then(cleanup => {
      if (cancelled && cleanup) cleanup()
      else if (cleanup) {
        // guarda cleanup para quando cancelled virar true
        const id = setInterval(() => {
          if (cancelled) { cleanup(); clearInterval(id) }
        }, 500)
      }
    }).catch(() => {})

    return () => {
      cancelled = true
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  return null
}
