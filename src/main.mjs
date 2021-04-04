import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { Pacratch } from './pacratch.mjs';
import { Trainer } from './trainer.mjs';
import { Arena } from './arena.mjs';

let camera, scene, renderer, controls, menu, canvas;
// let enemy = new Pacratch(
// 	"Fdrosch",
// 	"./../res/pacratcher/fdrosch.png",
// 	1007/4,
// 	678 /4,
// 	80,69);
let player, enemy, arena;

init();

async function init(){
	menu = document.getElementById("menu");
	canvas = document.getElementById("canvas");
	player = new Trainer(
		"Player",
		undefined,
		[await Pacratch.fromJSONFile('./res/pacratcher/handmann.json')])
	enemy = new Trainer(
		"Enemy",
		undefined,
		[await Pacratch.fromJSONFile('./res/pacratcher/fdrosch.json')])
	player.pacratcher.forEach( p => menu.appendChild(p.gameCard) )
	enemy.pacratcher.forEach( p => menu.appendChild(p.gameCard) )
	arena = new Arena([player,enemy]);
	camera = new THREE.PerspectiveCamera( 70, canvas.clientWidth / canvas.clientHeight, 1, 1000 );
	camera.position.z = 400;

	scene = new THREE.Scene();

	// scene.add( enemy.mesh );
	// enemy.mesh.position.set(90,0,-150)
	// scene.add( companion.mesh );
	// companion.mesh.position.set(-90,0,150)
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
