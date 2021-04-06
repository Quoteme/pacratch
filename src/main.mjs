import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { Pacratch } from './pacratch.mjs';
import { Trainer } from './trainer.mjs';
import { Arena } from './arena.mjs';
import * as UI from './ui.mjs'

let camera, scene, renderer, controls;
let menu, canvas;
let player, arena;

init();

async function init(){
	menu = document.getElementById("menu");
	canvas = document.getElementById("canvas");
	UI.init();
	player = [
		new Trainer(
			"Player",
			[await Pacratch.fromJSONFile('./res/pacratcher/oni_warrior.json')],
			[],
			[await Pacratch.fromJSONFile('./res/pacratcher/oni_warrior.json')]
		),
		new Trainer(
			"Enemy",
			[],
			[],
			[await Pacratch.fromJSONFile('./res/pacratcher/zitrusmann.json')
			,await Pacratch.fromJSONFile('./res/pacratcher/fdrosch.json')
			,await Pacratch.fromJSONFile('./res/pacratcher/handmann.json')]
		)
	]
	player[1].active[0].x = -100
	player[1].active[0].z = -50
	player[1].active[1].x = 100
	player[1].active[1].z = -100
	player[1].active[2].x = -250
	player[1].active[2].z = -200
	player[0].active[0].x = 50
	player[0].active[0].z = 50

	arena = new Arena(player);
	camera = new THREE.PerspectiveCamera( 70, canvas.clientWidth / canvas.clientHeight, 1, 5000 );
	camera.position.set(-50,100,400);
	camera.lookAt(0,0,0)

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
