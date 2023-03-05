import * as THREE from "three";

let scene, camera, renderer;

function init(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(500, 500, 500);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer( {antialias: true} );
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  loop();
}

function loop() {
  
  // render the scene
  renderer.render(scene, camera);

  // rinse and repeat
  window.requestAnimationFrame(loop);
}

init();