/* Beyond the Leash - 3D hero dog (Three.js). A shaggy, sitting dog in the
   spirit of the logo whose head and eyes follow the pointer. */
(function () {
  'use strict';
  const host = document.getElementById('hero-dog');
  if (!host || !window.THREE) return;
  const THREE = window.THREE;
  const D = window.BTL || {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    host.innerHTML = '<img src="assets/logo.png" alt="Beyond the Leash logo" width="332" height="332">';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.9, 8.2);
  camera.lookAt(0, 0.35, 0);

  /* ---------- Lights ---------- */
  scene.add(new THREE.HemisphereLight(0xfff6e8, 0xc9b6e4, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 0.95);
  key.position.set(3.5, 6, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1; key.shadow.camera.far = 20;
  key.shadow.camera.left = key.shadow.camera.bottom = -4;
  key.shadow.camera.right = key.shadow.camera.top = 4;
  key.shadow.radius = 4;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd9c8f0, 0.45);
  fill.position.set(-4, 2, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.35);
  rim.position.set(0, 3, -5);
  scene.add(rim);

  /* ---------- Materials ---------- */
  const fur = new THREE.MeshStandardMaterial({ color: 0x2c2a2b, roughness: 1, metalness: 0 });
  const cream = new THREE.MeshStandardMaterial({ color: 0xefe8d8, roughness: 1, metalness: 0 });
  const pink = new THREE.MeshStandardMaterial({ color: 0xe5748f, roughness: 0.6 });
  const black = new THREE.MeshStandardMaterial({ color: 0x141214, roughness: 0.35 });
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const purple = new THREE.MeshStandardMaterial({ color: 0x5b2d8e, roughness: 0.55 });
  const lavender = new THREE.MeshStandardMaterial({ color: 0xc9b6e4, roughness: 0.5 });

  /* ---------- Cheap 3D value noise for shaggy fur ---------- */
  function hash(x, y, z) {
    let h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
    return h - Math.floor(h);
  }
  const sm = t => t * t * (3 - 2 * t);
  function noise(x, y, z) {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    const fx = sm(x - ix), fy = sm(y - iy), fz = sm(z - iz);
    let v = 0;
    for (let dz = 0; dz <= 1; dz++) for (let dy = 0; dy <= 1; dy++) for (let dx = 0; dx <= 1; dx++) {
      const w = (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy) * (dz ? fz : 1 - fz);
      v += w * hash(ix + dx, iy + dy, iz + dz);
    }
    return v * 2 - 1;
  }
  function shaggy(geo, amp, freq, seed) {
    const p = geo.attributes.position, n = geo.attributes.normal;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const d = noise(x * freq + seed, y * freq + seed * 2, z * freq) * 0.65 + noise(x * freq * 2.3 + 7, y * freq * 2.3, z * freq * 2.3) * 0.35;
      p.setXYZ(i, x + n.getX(i) * d * amp, y + n.getY(i) * d * amp, z + n.getZ(i) * d * amp);
    }
    geo.computeVertexNormals();
    return geo;
  }
  function blob(rx, ry, rz, mat, amp, freq, seed, seg) {
    const g = new THREE.SphereGeometry(1, seg || 48, seg || 48);
    g.scale(rx, ry, rz);
    if (amp) shaggy(g, amp, freq, seed);
    const m = new THREE.Mesh(g, mat);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  }
  function at(mesh, x, y, z, rx, ry, rz) {
    mesh.position.set(x, y, z);
    if (rx !== undefined) mesh.rotation.set(rx, ry || 0, rz || 0);
    return mesh;
  }

  /* ---------- Dog ---------- */
  const dog = new THREE.Group();
  scene.add(dog);

  // body (sitting: chest up, rump down)
  const torso = at(blob(0.92, 1.25, 0.95, fur, 0.09, 3.1, 1), 0, 0.05, 0, -0.18);
  dog.add(torso);
  // chest patch
  dog.add(at(blob(0.5, 0.62, 0.32, cream, 0.1, 4, 5), 0, -0.05, 0.82, -0.1));
  // haunches
  dog.add(at(blob(0.62, 0.5, 0.72, fur, 0.09, 3.3, 2), -0.6, -0.95, 0.15));
  dog.add(at(blob(0.62, 0.5, 0.72, fur, 0.09, 3.3, 3), 0.6, -0.95, 0.15));
  // hind feet (cream socks)
  dog.add(at(blob(0.3, 0.17, 0.5, cream, 0.03, 5, 9), -0.62, -1.4, 0.78));
  dog.add(at(blob(0.3, 0.17, 0.5, cream, 0.03, 5, 10), 0.62, -1.4, 0.78));
  // front legs
  [-0.4, 0.4].forEach((x, i) => {
    const g = new THREE.CylinderGeometry(0.19, 0.22, 1.35, 24, 12);
    shaggy(g, 0.05, 4, 11 + i);
    const leg = new THREE.Mesh(g, fur);
    leg.castShadow = true; leg.receiveShadow = true;
    at(leg, x, -0.75, 0.6, 0.08);
    dog.add(leg);
    dog.add(at(blob(0.26, 0.16, 0.4, cream, 0.03, 5, 13 + i), x, -1.45, 0.82));
  });
  // tail (wags from its base)
  const tailPivot = new THREE.Group();
  tailPivot.position.set(0.2, -0.7, -0.75);
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.15, -0.1, -0.45), new THREE.Vector3(0.35, 0.25, -0.75), new THREE.Vector3(0.3, 0.8, -0.7)
  ]);
  const tailGeo = new THREE.TubeGeometry(tailCurve, 24, 0.13, 12, false);
  shaggy(tailGeo, 0.06, 5, 21);
  const tail = new THREE.Mesh(tailGeo, fur);
  tail.castShadow = true;
  tailPivot.add(tail);
  dog.add(tailPivot);
  // neck
  dog.add(at(blob(0.5, 0.5, 0.5, fur, 0.08, 3.5, 31), 0, 0.95, 0.3));

  // collar with heart tag
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.085, 14, 48), purple);
  at(collar, 0, 0.8, 0.36, Math.PI / 2 - 0.25);
  collar.castShadow = true;
  dog.add(collar);
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, -0.12);
  heartShape.bezierCurveTo(-0.16, 0.02, -0.16, 0.16, 0, 0.1);
  heartShape.bezierCurveTo(0.16, 0.16, 0.16, 0.02, 0, -0.12);
  const tag = new THREE.Mesh(new THREE.ExtrudeGeometry(heartShape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 3 }), lavender);
  at(tag, 0, 0.52, 0.95, 0.15, 0, Math.PI);
  tag.castShadow = true;
  dog.add(tag);

  // head group (this is what follows the cursor)
  const head = new THREE.Group();
  head.position.set(0, 1.62, 0.4);
  dog.add(head);
  head.add(at(blob(0.74, 0.7, 0.72, fur, 0.11, 3, 41), 0, 0, 0));
  // shaggy cream brow fringe hanging over the eyes
  head.add(at(blob(0.72, 0.2, 0.46, cream, 0.12, 4.5, 42), 0, 0.34, 0.44, 0.3));
  head.add(at(blob(0.3, 0.22, 0.3, cream, 0.12, 5, 47), 0.18, 0.62, 0.2));
  // muzzle and beard
  head.add(at(blob(0.5, 0.38, 0.5, cream, 0.09, 4, 43), 0, -0.24, 0.66));
  head.add(at(blob(0.62, 0.42, 0.44, cream, 0.13, 4.5, 44), 0, -0.52, 0.42));
  // nose
  head.add(at(blob(0.18, 0.15, 0.16, black, 0, 0, 0, 24), 0, -0.06, 1.12));
  // eyes
  const eyes = new THREE.Group();
  head.add(eyes);
  const eyeL = new THREE.Group(), eyeR = new THREE.Group();
  [[-0.27, eyeL], [0.27, eyeR]].forEach(([x, g]) => {
    g.position.set(x, 0.1, 0.72);
    g.add(blob(0.125, 0.125, 0.125, black, 0, 0, 0, 20));
    g.add(at(blob(0.035, 0.035, 0.035, white, 0, 0, 0, 10), 0.035, 0.04, 0.09));
    eyes.add(g);
  });
  // ears
  head.add(at(blob(0.26, 0.55, 0.2, fur, 0.1, 4, 45), -0.76, -0.05, -0.05, 0, 0, 0.35));
  head.add(at(blob(0.26, 0.55, 0.2, fur, 0.1, 4, 46), 0.76, -0.05, -0.05, 0, 0, -0.35));
  // tongue
  const tongue = new THREE.Group();
  tongue.position.set(0, -0.6, 0.82);
  const tongueMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), pink);
  tongueMesh.scale.set(0.2, 0.07, 0.36);
  tongueMesh.position.set(0, 0, 0.1);
  tongueMesh.castShadow = true;
  tongue.add(tongueMesh);
  tongue.rotation.x = 0.35;
  head.add(tongue);

  // ground shadow
  const ground = new THREE.Mesh(new THREE.CircleGeometry(2.4, 48), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.58;
  ground.receiveShadow = true;
  scene.add(ground);

  dog.position.y = 0.05;
  dog.rotation.y = -0.3;

  /* ---------- Sizing ---------- */
  function resize() {
    const w = host.clientWidth || 320, h = host.clientHeight || 360;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host); else window.addEventListener('resize', resize);

  /* ---------- Pointer tracking ---------- */
  const target = { yaw: 0, pitch: 0 };
  let hasPointer = false, lastMove = 0;
  function track(cx, cy) {
    const r = renderer.domElement.getBoundingClientRect();
    const ox = r.left + r.width / 2, oy = r.top + r.height * 0.42;
    const dx = (cx - ox) / Math.max(r.width, 300), dy = (cy - oy) / Math.max(r.height, 300);
    target.yaw = THREE.MathUtils.clamp(dx * 1.1, -0.8, 0.8);
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
      // idle wander when the pointer has been still for a while
      if (!hasPointer || now - lastMove > 4000) {
        target.yaw = Math.sin(t * 0.5) * 0.35;
        target.pitch = Math.sin(t * 0.9) * 0.08 + 0.05;
      }
      // breathing and a gentle sway
      torso.scale.set(1, 1 + Math.sin(t * 2.2) * 0.012, 1 + Math.sin(t * 2.2) * 0.012);
      dog.rotation.z = Math.sin(t * 0.8) * 0.012;
      // tail wag, faster when happy
      tailPivot.rotation.y = Math.sin(t * (happy ? 18 : 5)) * (happy ? 0.55 : 0.32);
      tailPivot.rotation.x = Math.sin(t * 2.5) * 0.06;
      // tongue bob
      tongue.rotation.x = 0.35 + Math.sin(t * 3) * 0.06;
      tongueMesh.scale.z = 0.36 + Math.sin(t * 3) * 0.02;
      // head bob and happy bounce
      const bounce = happy ? Math.abs(Math.sin(t * 14)) * 0.12 : 0;
      dog.position.y = 0.05 + bounce;
      head.position.y = 1.62 + Math.sin(t * 2.2) * 0.012;
      // blink
      if (t > blinkAt) { blinking = 1; blinkAt = t + 2.5 + Math.random() * 3.5; }
      if (blinking > 0) { blinking -= 0.08; const s = Math.max(0.1, Math.abs(blinking - 0.5) * 2); eyeL.scale.y = s; eyeR.scale.y = s; }
      else { eyeL.scale.y = eyeR.scale.y = 1; }
    }
    // smooth head follow
    cur.yaw += (target.yaw - cur.yaw) * 0.09;
    cur.pitch += (target.pitch - cur.pitch) * 0.09;
    head.rotation.set(cur.pitch, cur.yaw, cur.yaw * -0.12);
    eyes.position.set(cur.yaw * 0.06, -cur.pitch * 0.04, 0);
    tailPivot.rotation.y += 0; // keep
    renderer.render(scene, camera);
    if (!reduced || hasPointer) requestAnimationFrame(frame);
    else setTimeout(() => requestAnimationFrame(frame), 120);
  }
  frame();
})();
