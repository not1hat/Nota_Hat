import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

// ==========================================================================
// 1. Three.js 背景粒子动画
// ==========================================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101010);

const camera = new THREE.PerspectiveCamera(
  85,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.zIndex = '-1';
renderer.domElement.style.pointerEvents = 'none';

document.body.appendChild(renderer.domElement);

const particlesGeo = new THREE.BufferGeometry();
const count = 500;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
}

particlesGeo.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

const particlesMat = new THREE.PointsMaterial({
  size: 0.1,
  color: 0xffffff,
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

function animateParticles() {
  requestAnimationFrame(animateParticles);

  particles.rotation.y += 0.001;
  particles.rotation.x += 0.0005;

  renderer.render(scene, camera);
}

animateParticles();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});


// ==========================================================================
// 2. 鼠标控制：中心圆内清晰，圆外渐隐
// ==========================================================================
const targetElements = document.querySelectorAll(
  '#box_1, #box_2'
);

targetElements.forEach((el) => {
  el.style.transition = 'none';
  el.style.willChange = 'transform, opacity, filter';
  el.style.setProperty('--move-x', '0rem');
  el.style.setProperty('--move-y', '0rem');
});

const depthArray = [120, 220];

let targetX = 0;
let targetY = 0;
let targetFactor = 1;

let currentX = 0;
let currentY = 0;
let currentFactor = 1;

document.addEventListener('mousemove', (event) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const centerX = width / 2;
  const centerY = height / 2;

  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const clearRadius = Math.min(width, height) / 3;

  const distanceToEdge = Math.min(
    event.clientX,
    width - event.clientX,
    event.clientY,
    height - event.clientY
  );

  const edgeDeadZone = Math.min(width, height) * 0.1;

  if (distanceToEdge <= edgeDeadZone) {
    targetFactor = 0;
  } else if (distance <= clearRadius) {
    targetFactor = 1;
  } else {
    const scaleX = dx === 0 ? Infinity : Math.abs(centerX / dx);
    const scaleY = dy === 0 ? Infinity : Math.abs(centerY / dy);

    const edgeScale = Math.min(scaleX, scaleY);
    const edgeDistance = distance * edgeScale;
    const vanishDistance = edgeDistance - edgeDeadZone;

    let fadeProgress =
      (distance - clearRadius) /
      (vanishDistance - clearRadius);

    fadeProgress = Math.max(0, Math.min(1, fadeProgress));

    targetFactor = 1 - fadeProgress;
  }

  targetX = dx / centerX;
  targetY = dy / centerY;
});

function renderParallax() {
  currentX += (targetX - currentX) * 0.08;
  currentY += (targetY - currentY) * 0.08;
  currentFactor += (targetFactor - currentFactor) * 0.08;

  if (currentFactor < 0.05) {
    currentFactor = 0;
  }

  const visibleFactor = Math.max(0, Math.min(1, currentFactor));
  const blurAmountRem = (1 - visibleFactor) * 3;

  targetElements.forEach((el, index) => {
    el.style.setProperty('opacity', visibleFactor, 'important');
    el.style.setProperty('filter', `blur(${blurAmountRem}rem)`, 'important');

    el.style.setProperty(
      '--move-x',
      `${currentX * depthArray[index]}px`
    );

    el.style.setProperty(
      '--move-y',
      `${currentY * depthArray[index]}px`
    );
  });

  requestAnimationFrame(renderParallax);
}

renderParallax();