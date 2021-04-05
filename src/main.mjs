import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { Pacratch } from './pacratch.mjs';
import { Trainer } from './trainer.mjs';
import { Arena } from './arena.mjs';

let camera, scene, renderer, controls;
let menu, canvas;
let player, arena;

init();

async function init(){
	menu = document.getElementById("menu");
	canvas = document.getElementById("canvas");
	player = [
		new Trainer(
			"Player",
			undefined,
			[await Pacratch.fromJSONFile('./res/pacratcher/handmann.json')]),
		new Trainer(
			"Enemy",
			undefined,
			[await Pacratch.fromJSONFile('./res/pacratcher/fdrosch.json')])
	]
	player[0].pacratcher.forEach( p => menu.appendChild(p.gameCard) )

	arena = new Arena(player);
	camera = new THREE.PerspectiveCamera( 70, canvas.clientWidth / canvas.clientHeight, 1, 1000 );
	camera.position.z = 400;

	scene = new THREE.Scene();

	scene.add(arena.mesh);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( canvas.clientWidth, canvas.clientHeight );
	canvas.appendChild( renderer.domElement );
	//
	controls = new OrbitControls( camera, renderer.domElement );
	window.addEventListener( 'resize', onWindowResize );
	//
	animate();
}

function onWindowResize() {
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( canvas.clientWidth, canvas.clientHeight );
}

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}
