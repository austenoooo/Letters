import * as THREE from "three";

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let displacementScale = 10;

let scene, camera, renderer;

let line;

let allLines = [];

let allUniforms = [];

let cameraYDefault = 100;

let letters = ["M", "A", "N", "I", "F", "E", "S", "T", "O"];

let defaultTextParameter = {
  size: 80,
  height: 10,
  curSegments: 20,
  bevelThickness: 4,
  bevelSize: 3,
  bevelEnabled: true,
  bevelSegments: 20
}

let curveTextParameter = {
  size: 80,
  height: 1,
  curSegments: 10,
  bevelThickness: 4,
  bevelSize: 3,
  bevelEnabled: true,
  bevelSegments: 1
}

const loader = new FontLoader();
//'fonts/Lexend_Deca_ExtraBold_Regular.json' or 'fonts/helvetiker_bold.typeface.json'
loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {

  //"Lexend_Deca_ExtraBold_Regular.json"
  init( font );

} );

function init( font ){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // the x value and the z value of the camera doesn't change, only the y value change as scroll
  camera.position.set(40, cameraYDefault, 100);
  camera.lookAt(40, cameraYDefault, 0);

  renderer = new THREE.WebGLRenderer( {antialias: true} );
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("letters").appendChild(renderer.domElement);

  // change background color
  let backgroundColor = new THREE.Color(0xf5f5f5); // create a color representation from a hex code
  renderer.setClearColor(backgroundColor);

  // add orbit control
  // let controls = new OrbitControls(camera, renderer.domElement);

  // helper functions
  const axesHelper = new THREE.AxesHelper(50);
  // scene.add(axesHelper);
  const gridHelper = new THREE.GridHelper(100, 100);
  // scene.add(gridHelper);


  for (let i = 0; i < letters.length; i++){

    let uniforms = {
      amplitude: {value: displacementScale},
      opacity: {value: 0.1},
      color: {value: new THREE.Color(0x087500)}
    };

    allUniforms.push(uniforms);

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById('vertexshader').textContent,
      fragmentShader: document.getElementById('fragmentshader').textContent,
      // blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    let geometry;

    if (letters[i] != 'S' && letters[i] != 'O'){
      geometry = new TextGeometry(letters[i], {
        font: font,
        
        size: defaultTextParameter.size,
        height: defaultTextParameter.height,
        curSegments: defaultTextParameter.curSegments,
  
        bevelThickness: defaultTextParameter.bevelThickness,
        bevelSize: defaultTextParameter.bevelSize,
        bevelEnabled: defaultTextParameter.bevelEnabled,
        bevelSegments: defaultTextParameter.bevelSegments
      });
    }
    else{
      geometry = new TextGeometry(letters[i], {
        font: font,
        
        size: curveTextParameter.size,
        height: curveTextParameter.height,
        curSegments: curveTextParameter.curSegments,
  
        bevelThickness: curveTextParameter.bevelThickness,
        bevelSize: curveTextParameter.bevelSize,
        bevelEnabled: curveTextParameter.bevelEnabled,
        bevelSegments: curveTextParameter.bevelSegments
      });
    }
    

    // geometry.center();

      const count = geometry.attributes.position.count; 

      const displacement = new THREE.Float32BufferAttribute(count * 3, 3);
      geometry.setAttribute('displacement', displacement);

      const array = displacement.array;

      for ( let i = 0, l = array.length; i < l; i += 3 ) {

        array[ i ] += 3 * ( 0.5 - Math.random());
        array[ i + 1 ] += 3 * ( 0.5 - Math.random());
        array[ i + 2 ] += 3 * ( 0.5 - Math.random());

      }
      
      line = new THREE.Line(geometry, shaderMaterial);
      // line.rotation.x = 0.2;
      scene.add(line);
      line.position.set(0, cameraYDefault - 100 - 120 * i, 0);


      allLines.push(line);
  }
  


  loop();
}

function loop() {
  
  // render the scene
  renderer.render(scene, camera);

  // rinse and repeat
  window.requestAnimationFrame(loop);
}

document.addEventListener("scroll", (event) => {
  
  let cameraY = cameraYDefault - window.scrollY / 3;

  // update cameraY
  camera.position.set(40, cameraY, 100);
  camera.lookAt(40, cameraY, 0);

  
  for (let i = 0; i < letters.length; i++){

    // update shader
    allUniforms[i].amplitude.value = (- Math.sin(cameraY / 25)) * displacementScale;

    // roatate the letters subtly
    let rotate = -(Math.PI / 8) * Math.sin((cameraY + 120 * i) / 25);
    allLines[i].rotation.set(0, rotate, 0);
  }
  
  
});