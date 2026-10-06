/* Beyond the Leash - 3D hero dog (Three.js r128).
   A shaggy sitting dog in the logo's colours. Fur is rendered with layered
   "shell" geometry and procedural textures; the head and eyes follow the
   pointer. Falls back to the logo image when WebGL is unavailable. */
(function () {
  'use strict';
  const host = document.getElementById('hero-dog');
  if (!host || !window.THREE) return;
  const THREE = window.THREE;
  const D = window.BTL || {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.innerWidth < 760 || (window.devicePixelRatio || 1) > 2.5;
  const LAYERS = small ? 7 : 11;      // fur shell count
  const SEG = small ? 26 : 34;        // sphere segments

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    host.innerHTML = '<img src="assets/logo.png" alt="Beyond the Leash logo" width="332" height="332">';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0.3, 0.9, 8.6);
  camera.lookAt(0, 0.3, 0);

  /* ---------- Lights (soft studio) ---------- */
  scene.add(new THREE.HemisphereLight(0xfff4e6, 0xb9a6d6, 0.45));
  const key = new THREE.DirectionalLight(0xfff1e0, 0.95);
  key.position.set(3.5, 6.5, 4.5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1; key.shadow.camera.far = 20;
  key.shadow.camera.left = key.shadow.camera.bottom = -4;
  key.shadow.camera.right = key.shadow.camera.top = 4;
  key.shadow.radius = 6;
  key.shadow.bias = -0.0005;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd6c6ef, 0.35);
  fill.position.set(-5, 2, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.5);
  rim.position.set(-1, 4, -5);
  scene.add(rim);

  /* ---------- Procedural textures ---------- */
  function canvasTex(size, draw, repeat) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    draw(c.getContext('2d'), size);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (repeat) t.repeat.set(repeat, repeat);
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return t;
  }
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  // Strand alpha map: thousands of soft dots. Higher alphaTest on outer
  // shells leaves only the biggest dots, so strands taper toward the tips.
  const strandTex = canvasTex(384, (ctx, s) => {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 15000; i++) {
      const x = rnd() * s, y = rnd() * s, r = 1 + rnd() * 2.6;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const a = 0.55 + rnd() * 0.45;
      g.addColorStop(0, 'rgba(255,255,255,' + a + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
  });
  strandTex.encoding = THREE.LinearEncoding;

  // Streaky coat colour maps.
  function coatTex(base, light, dark) {
    return canvasTex(512, (ctx, s) => {
      ctx.fillStyle = base; ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 2600; i++) {
        ctx.strokeStyle = rnd() > 0.5 ? light : dark;
        ctx.globalAlpha = 0.08 + rnd() * 0.22;
        ctx.lineWidth = 0.6 + rnd() * 1.8;
        const x = rnd() * s, y = rnd() * s, len = 10 + rnd() * 40, ang = (rnd() - 0.5) * 0.8 + Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }, 3);
  }
  const darkCoat = coatTex('#211e1f', '#453f41', '#0c0b0b');
  const creamCoat = coatTex('#eae2d0', '#faf6ec', '#cfc4ab');
  [darkCoat, creamCoat].forEach(t => { t.encoding = THREE.sRGBEncoding; });

  // Eye: warm brown iris with black pupil and a soft limbal ring.
  const eyeTex = canvasTex(256, (ctx, s) => {
    ctx.fillStyle = '#efe8dc'; ctx.fillRect(0, 0, s, s);
    const cx = s / 2, cy = s / 2;
    let g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 64);
    g.addColorStop(0, '#6a4426'); g.addColorStop(0.55, '#3d2414'); g.addColorStop(1, '#1b0f08');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 64, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 160; i++) { // iris fibres
      const a = rnd() * Math.PI * 2, r1 = 28 + rnd() * 10, r2 = 58 + rnd() * 6;
      ctx.strokeStyle = 'rgba(140,90,50,' + (0.15 + rnd() * 0.25) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); ctx.stroke();
    }
    ctx.fillStyle = '#050303'; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fill();
  });
  eyeTex.encoding = THREE.sRGBEncoding; eyeTex.wrapS = eyeTex.wrapT = THREE.ClampToEdgeWrapping;

  // Nose: dark, pebbly.
  const noseBump = canvasTex(128, (ctx, s) => {
    ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 1400; i++) { ctx.fillStyle = rnd() > 0.5 ? '#a0a0a0' : '#606060'; ctx.beginPath(); ctx.arc(rnd() * s, rnd() * s, 1 + rnd() * 2, 0, Math.PI * 2); ctx.fill(); }
  }, 2);

  /* ---------- Materials ---------- */
  const darkBase = new THREE.MeshStandardMaterial({ map: darkCoat, color: 0x7a7a7a, roughness: 1 });
  const creamBase = new THREE.MeshStandardMaterial({ map: creamCoat, color: 0xc4c4c4, roughness: 1 });
  const pink = new THREE.MeshPhysicalMaterial({ color: 0xd9647f, roughness: 0.45, clearcoat: 0.7, clearcoatRoughness: 0.3 });
  const noseMat = new THREE.MeshPhysicalMaterial({ color: 0x151213, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.25, bumpMap: noseBump, bumpScale: 0.01 });
  const eyeMat = new THREE.MeshPhysicalMaterial({ map: eyeTex, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 });
  const purple = new THREE.MeshStandardMaterial({ color: 0x5b2d8e, roughness: 0.6 });
  const lavender = new THREE.MeshStandardMaterial({ color: 0xc9b6e4, roughness: 0.4, metalness: 0.15 });

  /* ---------- Noise and geometry helpers ---------- */
  function hash(x, y, z) { const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); }
  const sm = t => t * t * (3 - 2 * t);
  function noise(x, y, z) {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    const fx = sm(x - ix), fy = sm(y - iy), fz = sm(z - iz);
    let v = 0;
    for (let dz = 0; dz <= 1; dz++) for (let dy = 0; dy <= 1; dy++) for (let dx = 0; dx <= 1; dx++) {
      v += (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy) * (dz ? fz : 1 - fz) * hash(ix + dx, iy + dy, iz + dz);
    }
    return v * 2 - 1;
  }
  function lumpy(geo, amp, freq, s) {
    const p = geo.attributes.position, n = geo.attributes.normal;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const d = noise(x * freq + s, y * freq + s * 2, z * freq) * 0.6 + noise(x * freq * 2.4 + 9, y * freq * 2.4, z * freq * 2.4) * 0.4;
      p.setXYZ(i, x + n.getX(i) * d * amp, y + n.getY(i) * d * amp, z + n.getZ(i) * d * amp);
    }
    geo.computeVertexNormals();
    return geo;
  }
  function ellipsoid(rx, ry, rz, seg) {
    const g = new THREE.SphereGeometry(1, seg || SEG, seg || SEG);
    g.scale(rx, ry, rz);
    return g;
  }
  // Base mesh plus fur shells. `len` is fur length in scene units.
  function furred(geo, base, len, opts) {
    opts = opts || {};
    const group = new THREE.Group();
    const m = new THREE.Mesh(geo, base);
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    const p = geo.attributes.position, n = geo.attributes.normal;
    const isCream = base === creamBase;
    const layers = opts.layers || LAYERS;
    for (let i = 1; i <= layers; i++) {
      const f = i / layers;
      const g = geo.clone();
      const gp = g.attributes.position;
      for (let v = 0; v < gp.count; v++) {
        // slight droop with gravity so long fur hangs
        gp.setXYZ(v, p.getX(v) + n.getX(v) * len * f, p.getY(v) + n.getY(v) * len * f - len * f * f * 0.35, p.getZ(v) + n.getZ(v) * len * f);
      }
      const shade = 0.5 + 0.5 * f; // darker at the roots
      const mat = new THREE.MeshStandardMaterial({
        map: isCream ? creamCoat : darkCoat,
        color: new THREE.Color().setScalar(shade * (isCream ? 0.82 : 0.55)),
        alphaMap: strandTex, alphaTest: 0.12 + f * 0.72, roughness: 1, side: THREE.DoubleSide
      });
      // Surviving strand fragments must be fully opaque, otherwise the page
      // background bleeds through the transparent canvas and greys the coat.
      mat.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n\tgl_FragColor.a = 1.0;'); };
      const shell = new THREE.Mesh(g, mat);
      shell.receiveShadow = true;
      group.add(shell);
    }
    return group;
  }
  function at(obj, x, y, z, rx, ry, rz) {
    obj.position.set(x, y, z);
    if (rx !== undefined) obj.rotation.set(rx, ry || 0, rz || 0);
    return obj;
  }
  // give each mesh's UVs a different scale so strands don't align between parts
  function uvScale(geo, k) { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * k, uv.getY(i) * k); return geo; }

  /* ---------- Build the dog ---------- */
  const dog = new THREE.Group();
  scene.add(dog);

  // torso: chest up, rump down
  dog.add(at(furred(uvScale(lumpy(ellipsoid(0.98, 1.22, 1.05), 0.05, 2.6, 1), 7), darkBase, 0.16), 0, 0.05, -0.05, -0.28));
  // chest blaze
  dog.add(at(furred(uvScale(lumpy(ellipsoid(0.48, 0.66, 0.34), 0.06, 4, 5), 4), creamBase, 0.17), 0, -0.05, 0.86, -0.15));
  // haunches
  dog.add(at(furred(uvScale(lumpy(ellipsoid(0.66, 0.56, 0.82), 0.05, 3, 2), 5), darkBase, 0.14), -0.62, -0.95, 0.15));
  dog.add(at(furred(uvScale(lumpy(ellipsoid(0.66, 0.56, 0.82), 0.05, 3, 3), 5), darkBase, 0.14), 0.62, -0.95, 0.15));
  // paws with toes
  function paw(x, z, s) {
    const g = new THREE.Group();
    g.add(at(furred(uvScale(lumpy(ellipsoid(0.3, 0.17, 0.46, 24), 0.02, 6, s), 3), creamBase, 0.06, { layers: 5 }), 0, 0, 0));
    [-0.16, 0, 0.16].forEach((tx, i) => g.add(at(furred(lumpy(ellipsoid(0.1, 0.1, 0.14, 16), 0.01, 8, s + i), creamBase, 0.04, { layers: 4 }), tx, 0.02, 0.42)));
    return at(g, x, -1.42, z);
  }
  dog.add(paw(-0.64, 0.78, 9)); dog.add(paw(0.64, 0.78, 10));
  dog.add(paw(-0.42, 0.9, 11)); dog.add(paw(0.42, 0.9, 12));
  // front legs (upper and lower)
  [-0.42, 0.42].forEach((x, i) => {
    const up = new THREE.CylinderGeometry(0.2, 0.24, 0.8, 24, 10); up.translate(0, -0.4, 0);
    dog.add(at(furred(uvScale(lumpy(up, 0.03, 5, 13 + i), 3), darkBase, 0.13), x, 0.1, 0.55, 0.12));
    const lo = new THREE.CylinderGeometry(0.18, 0.2, 0.85, 24, 10); lo.translate(0, -0.42, 0);
    dog.add(at(furred(uvScale(lumpy(lo, 0.03, 5, 15 + i), 3), darkBase, 0.11), x, -0.62, 0.68, -0.03));
  });
  // tail, curled to the side (wags from its base)
  const tailPivot = at(new THREE.Group(), 0.25, -0.75, -0.8);
  const tailCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.25, -0.15, -0.5), new THREE.Vector3(0.6, 0.15, -0.75), new THREE.Vector3(0.75, 0.7, -0.5)]);
  const tailGeo = new THREE.TubeGeometry(tailCurve, 28, 0.12, 14, false);
  tailPivot.add(furred(uvScale(lumpy(tailGeo, 0.03, 5, 21), 2), darkBase, 0.17));
  dog.add(tailPivot);
  // neck
  const neckGeo = new THREE.CylinderGeometry(0.42, 0.55, 0.9, 28, 8);
  dog.add(at(furred(uvScale(lumpy(neckGeo, 0.04, 4, 31), 3), darkBase, 0.14), 0, 1.05, 0.3, 0.35));
  // collar with heart tag
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.075, 16, 56), purple);
  at(collar, 0, 0.78, 0.4, Math.PI / 2 - 0.3); collar.castShadow = true; dog.add(collar);
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, -0.12); heartShape.bezierCurveTo(-0.16, 0.02, -0.16, 0.16, 0, 0.1); heartShape.bezierCurveTo(0.16, 0.16, 0.16, 0.02, 0, -0.12);
  const tag = new THREE.Mesh(new THREE.ExtrudeGeometry(heartShape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.012, bevelSegments: 3 }), lavender);
  at(tag, 0, 0.48, 0.98, 0.2, 0, Math.PI); tag.castShadow = true; dog.add(tag);

  // head (follows the pointer)
  const head = at(new THREE.Group(), 0, 1.66, 0.42);
  dog.add(head);
  head.add(furred(uvScale(lumpy(ellipsoid(0.72, 0.68, 0.74), 0.05, 3, 41), 5), darkBase, 0.2));
  // brow fringe hanging over the eyes, and a top tuft
  head.add(at(furred(uvScale(lumpy(ellipsoid(0.66, 0.17, 0.4), 0.06, 4.5, 42), 3), creamBase, 0.15), 0, 0.42, 0.38, 0.45));
  head.add(at(furred(uvScale(lumpy(ellipsoid(0.3, 0.2, 0.3, 24), 0.06, 5, 47), 2), creamBase, 0.16), 0.16, 0.64, 0.14));
  // muzzle and beard
  head.add(at(furred(uvScale(lumpy(ellipsoid(0.42, 0.3, 0.56), 0.04, 4, 43), 3), creamBase, 0.1), 0, -0.3, 0.7));
  head.add(at(furred(uvScale(lumpy(ellipsoid(0.56, 0.4, 0.44), 0.06, 4.5, 44), 3), creamBase, 0.22), 0, -0.58, 0.42));
  // nose
  const nose = new THREE.Mesh(lumpy(ellipsoid(0.18, 0.15, 0.16, 32), 0.008, 30, 50), noseMat);
  at(nose, 0, -0.1, 1.22); nose.castShadow = true; head.add(nose);
  // eyes
  const eyes = new THREE.Group(); head.add(eyes);
  const eyeL = at(new THREE.Group(), -0.28, 0.12, 0.76), eyeR = at(new THREE.Group(), 0.28, 0.12, 0.76);
  [eyeL, eyeR].forEach(g => {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.145, 32, 32), eyeMat);
    ball.rotation.y = -Math.PI / 2;        // iris faces forward
    g.add(ball);
    eyes.add(g);
  });
  // ears
  head.add(at(furred(uvScale(lumpy(ellipsoid(0.24, 0.5, 0.14, 28), 0.05, 4, 45), 2), darkBase, 0.2), -0.74, -0.08, -0.08, 0.1, 0, 0.4));
  head.add(at(furred(uvScale(lumpy(ellipsoid(0.24, 0.5, 0.14, 28), 0.05, 4, 46), 2), darkBase, 0.2), 0.74, -0.08, -0.08, 0.1, 0, -0.4));
  // tongue
  const tongue = at(new THREE.Group(), 0, -0.62, 0.9);
  const tongueMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), pink);
  tongueMesh.scale.set(0.19, 0.06, 0.36); tongueMesh.position.set(0, 0, 0.1); tongueMesh.castShadow = true;
  tongue.add(tongueMesh); tongue.rotation.x = 0.4; head.add(tongue);

  // ground shadow
  const ground = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), new THREE.ShadowMaterial({ opacity: 0.22 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -1.58; ground.receiveShadow = true;
  scene.add(ground);

  dog.position.y = 0.05;
  dog.rotation.y = -0.32;
  host.__scene = scene; host.__renderer = renderer;

  /* ---------- Only render while the hero is on screen and the tab is visible ---------- */
  let visible = true, queued = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible && !queued) { queued = true; requestAnimationFrame(frame); } }, { threshold: 0.05 }).observe(host);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible && !queued) { queued = true; requestAnimationFrame(frame); } });

  /* ---------- Sizing ---------- */
  function resize() {
    const w = host.clientWidth || 320, h = host.clientHeight || 360;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host); else window.addEventListener('resize', resize);

  /* ---------- Pointer tracking ---------- */
  const target = { yaw: 0, pitch: 0 };
  let hasPointer = false, lastMove = 0;
  function track(cx, cy) {
    const r = renderer.domElement.getBoundingClientRect();
    const ox = r.left + r.width / 2, oy = r.top + r.height * 0.4;
    const dx = (cx - ox) / Math.max(r.width, 300), dy = (cy - oy) / Math.max(r.height, 300);
    target.yaw = THREE.MathUtils.clamp(dx * 1.1, -0.85, 0.85);
    target.pitch = THREE.MathUtils.clamp(dy * 0.8, -0.45, 0.5);
    hasPointer = true; lastMove = performance.now();
  }
  window.addEventListener('pointermove', e => { if (e.pointerType !== 'touch') track(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) track(t.clientX, t.clientY); }, { passive: true });
  window.addEventListener('touchstart', e => { const t = e.touches[0]; if (t) track(t.clientX, t.clientY); }, { passive: true });

  /* ---------- Pat easter egg ---------- */
  let pats = 0, patTimer, happyUntil = 0;
  renderer.domElement.addEventListener('click', e => {
    pats++; happyUntil = performance.now() + 1400;
    clearTimeout(patTimer); patTimer = setTimeout(() => { pats = 0; }, 2500);
    if (pats >= 5) { pats = 0; if (D.confetti) D.confetti(e.clientX, e.clientY, 36); if (D.toast) D.toast('Good dog! Lead with Love'); }
    else if (pats === 3 && D.toast) D.toast('Keep patting...');
  });

  /* ---------- Animation ---------- */
  const cur = { yaw: 0, pitch: 0 };
  let blinkAt = 2.5, blinking = 0;
  const clock = new THREE.Clock();
  function frame() {
    const t = clock.getElapsedTime();
    const now = performance.now();
    const happy = now < happyUntil;
    if (!reduced) {
      if (!hasPointer || now - lastMove > 4000) {
        target.yaw = Math.sin(t * 0.5) * 0.35;
        target.pitch = Math.sin(t * 0.9) * 0.08 + 0.05;
      }
      dog.scale.set(1, 1 + Math.sin(t * 2.2) * 0.008, 1 + Math.sin(t * 2.2) * 0.008);
      dog.rotation.z = Math.sin(t * 0.8) * 0.01;
      tailPivot.rotation.y = Math.sin(t * (happy ? 18 : 4.5)) * (happy ? 0.6 : 0.3);
      tailPivot.rotation.x = Math.sin(t * 2.5) * 0.05;
      tongue.rotation.x = 0.4 + Math.sin(t * 3) * 0.06;
      tongueMesh.scale.z = 0.36 + Math.sin(t * 3) * 0.02;
      dog.position.y = 0.05 + (happy ? Math.abs(Math.sin(t * 14)) * 0.12 : 0);
      head.position.y = 1.66 + Math.sin(t * 2.2) * 0.012;
      if (t > blinkAt) { blinking = 1; blinkAt = t + 2.5 + Math.random() * 3.5; }
      if (blinking > 0) { blinking -= 0.1; const s = Math.max(0.08, Math.abs(blinking - 0.5) * 2); eyeL.scale.y = s; eyeR.scale.y = s; }
      else { eyeL.scale.y = eyeR.scale.y = 1; }
    }
    cur.yaw += (target.yaw - cur.yaw) * 0.09;
    cur.pitch += (target.pitch - cur.pitch) * 0.09;
    head.rotation.set(cur.pitch, cur.yaw, cur.yaw * -0.1);
    // eyes lead the head a little
    const ey = (target.yaw - cur.yaw) * 0.6, ep = (target.pitch - cur.pitch) * 0.6;
    eyeL.rotation.set(ep, ey, 0); eyeR.rotation.set(ep, ey, 0);
    renderer.render(scene, camera);
    queued = false;
    if (!visible || document.hidden) return;        // resumes from the observers above
    queued = true;
    if (!reduced || hasPointer) requestAnimationFrame(frame);
    else setTimeout(() => requestAnimationFrame(frame), 120);
  }
  queued = true;
  frame();
})();
