import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  positions[i*3] = (Math.random() - 0.5) * 20;
  positions[i*3+1] = (Math.random() - 0.5) * 20;
  positions[i*3+2] = (Math.random() - 0.5) * 20;
  
  colors[i*3] = Math.random();
  colors[i*3+1] = Math.random();
  colors[i*3+2] = Math.random();
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMat = new THREE.PointsMaterial({ 
  size: 0.1,
  color: 0xffffff, 
  transparent: true,
  opacity: 0.8
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001;
  particles.rotation.x += 0.0005;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

scene.background = new THREE.Color(0x101010);


// zoomin

const images = document.querySelectorAll(".pics_1 img");
const lightbox = document.getElementById("zoomin");
const lightboxImg = document.getElementById("zoomin-img");

images.forEach(img => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
  });
});

lightbox.addEventListener("click", () => {
  lightbox.style.display = "none";
});