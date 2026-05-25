w// =========================
//      Web_Home.js
// =========================

import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

/* =========================
        THREE BACKGROUND
========================= */

const scene = new THREE.Scene();

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

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);

Object.assign(renderer.domElement.style, {

    position: 'fixed',
    top: '0',
    left: '0',

    width: '100%',
    height: '100%',

    zIndex: '-1',

    pointerEvents: 'none'
});

document.body.appendChild(renderer.domElement);

/* =========================
        PARTICLES
========================= */

const particlesGeo = new THREE.BufferGeometry();

const count = 250;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {

    positions[i] = (Math.random() - 0.5) * 20;
}

particlesGeo.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
);

const particlesMat = new THREE.PointsMaterial({

    size: 0.08,

    color: 0xffffff,

    transparent: true,

    opacity: 0.8
});

const particles = new THREE.Points(
    particlesGeo,
    particlesMat
);

scene.add(particles);

/* =========================
        PARTICLE LOOP
========================= */

function animateParticles() {

    requestAnimationFrame(animateParticles);

    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    renderer.render(scene, camera);
}

animateParticles();

/* =========================
        RESIZE
========================= */

window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

/* =========================
        PARALLAX
========================= */

const banners = [

    document.getElementById('box_1'),
    document.getElementById('box_2'),
    document.getElementById('box_3'),
    document.getElementById('box_4')
];

const hiText = document.querySelector('.Hi');
const wellText = document.querySelector('.Well');

const depthArray = [120, 220, -220, 255];

const rotateArray = [10, 40, -10, -8];

let targetX = 0;
let targetY = 0;
let targetFactor = 1;

let currentX = 0;
let currentY = 0;
let currentFactor = 1;

/* =========================
        MOUSE
========================= */

document.addEventListener('mousemove', (e) => {

    const w = window.innerWidth;
    const h = window.innerHeight;

    const centerX = w * 0.5;
    const centerY = h * 0.5;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const distance = Math.hypot(dx, dy);

    const clearRadius =
        Math.min(w, h) / 3;

    const distanceToEdge = Math.min(

        e.clientX,
        w - e.clientX,

        e.clientY,
        h - e.clientY
    );

    const edgeDeadZone =
        Math.min(w, h) * 0.1;

    if (distanceToEdge <= edgeDeadZone) {

        targetFactor = 0;
    }

    else if (distance <= clearRadius) {

        targetFactor = 1;
    }

    else {

        const scaleX =
            dx === 0
                ? Infinity
                : Math.abs(centerX / dx);

        const scaleY =
            dy === 0
                ? Infinity
                : Math.abs(centerY / dy);

        const edgeScale =
            Math.min(scaleX, scaleY);

        const edgeDistance =
            distance * edgeScale;

        const vanishDistance =
            edgeDistance - edgeDeadZone;

        let fadeProgress =
            (distance - clearRadius) /
            (vanishDistance - clearRadius);

        fadeProgress =
            Math.max(0, Math.min(1, fadeProgress));

        targetFactor =
            1 - fadeProgress;
    }

    targetX = dx / centerX;
    targetY = dy / centerY;
});

/* =========================
        RENDER LOOP
========================= */

function renderParallax() {

    requestAnimationFrame(renderParallax);

    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    currentFactor +=
        (targetFactor - currentFactor) * 0.08;

    if (currentFactor < 0.05)
        currentFactor = 0;

    if (currentFactor > 0.95)
        currentFactor = 1;

    const visibleFactor =
        Math.max(0, Math.min(1, currentFactor));

    const blur =
        (1 - visibleFactor) * 1.2;

    /* =========================
            BANNERS
    ========================== */

    banners.forEach((el, i) => {

        const moveX =
            currentX * depthArray[i];

        const moveY =
            currentY * depthArray[i];

        el.style.opacity =
            visibleFactor;

        el.style.filter =
            `blur(${blur}rem)`;

        el.style.transform = `
            translate3d(${moveX}px, ${moveY}px, 0)
            rotate(${rotateArray[i]}deg)
        `;
    });

    /* =========================
            TEXT
    ========================== */

    const textFactor =
        1 - visibleFactor;

    const textBlur =
        (1 - textFactor) * 0.8;

    hiText.style.opacity =
        textFactor;

    wellText.style.opacity =
        textFactor;

    hiText.style.filter =
        `blur(${textBlur}rem)`;

    wellText.style.filter =
        `blur(${textBlur}rem)`;
}

renderParallax();