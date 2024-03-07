import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

﻿

const hdrTextureURL = new URL('/free_1975_porsche_911_930_turbo/evening_road.hdr', import.meta.url);

const renderer = new THREE.WebGLRenderer({ antialias: true }); 
renderer.outputColorSpace = THREE.SRGBColorSpace;


renderer.setSize(window.innerWidth, window.innerHeight); 
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

const Hloader = new RGBELoader();
Hloader.load(hdrTextureURL, function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
});

const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Base color (white)
    metalness: 1, // Reflectivity of the metal (1 for full reflectivity)
    roughness: 0, // Surface roughness (0 to 1, lower values are smoother)
    envMapIntensity: .3, // Intensity of environment map reflection
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

/*const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32)
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);*/

/*const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias= -0.0001;
scene.add(spotLight);*/

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./free_1975_porsche_911_930_turbo/textures/wood_1.png'); //diffuse texture
const normalMapTexture = textureLoader.load('./free_1975_porsche_911_930_turbo/textures/wood_1_normal.png'); // normal map

const loader = new GLTFLoader().setPath('./free_1975_porsche_911_930_turbo/');
loader.load('metal.gltf', (gltf) => {
    const mesh = gltf.scene;

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = metalMaterial;
        }
    });
    mesh.position.set(0, .001, -1);
    scene.add(mesh);
});

const loader2 = new GLTFLoader().setPath('./free_1975_porsche_911_930_turbo/');
loader2.load('wood_1.gltf', (gltf) => {
    const mesh = gltf.scene;

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = texture;
            child.material.normalMap = normalMapTexture;
        }
    });
    mesh.position.set(0, .001, -1);
    scene.add(mesh);
});

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();