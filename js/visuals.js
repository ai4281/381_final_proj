var width = window.innerWidth,
	height = window.innerHeight;

var sideBarWidth = document.getElementById('sideBar').offsetWidth;

var container;
var camera, scene, renderer;

var geometries = [];
var defaultMaterial;

var x, y, z, shape, yAngle, zAngle;


init();
draw();

var cube;

function init() {
	container = document.getElementById( 'cont' );

	sideBarWidth = document.getElementById('sideBar').offsetWidth;

	camera = new THREE.PerspectiveCamera(50, (width - sideBarWidth) / height, 1, 1000);
	camera.position.set(0, 0, 10);

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0xffffff );
				renderer.setSize ( width - sideBarWidth, height );
				renderer.domElement.style.cssFloat = "right";

	container.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );


	var directionalLight = new THREE.DirectionalLight( 0xdd33333, 0.3 );
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	defaultMaterial = new THREE.MeshNormalMaterial({color: 0xff0000, opacity: 0.6, transparent: true});
	cube = new THREE.Mesh( geometry, defaultMaterial );

	scene.add(cube);

	initGeometry();
}

//make geometries
function initGeometry() {
	
	var cubeGeo = new THREE.BoxGeometry( 1, 1, 1 );
	var cylGeo = new THREE.CylinderGeometry( 1, 1, 1, 3 );
	var torusGeo = new THREE.TorusGeometry( 0.5, 0.25, 16, 50 );
	var sphereGeo = new THREE.SphereGeometry( 1, 32, 32 );

	geometries.push(cubeGeo, cylGeo, torusGeo, sphereGeo);
}

function swapGeo(cube) {

	scene.remove(cube);

	switch (shape) {

		case "Cube":
			cube.geometry = geometries[0];
			break;
		case "Cylinder":
			cube.geometry = geometries[1];
			break;
		case "Torus":
			cube.geometry = geometries[2];
			break;
		case "Sphere":
			cube.geometry = geometries[3];
			break;
	}

	scene.add(cube);

}


function setVariables(){
	//slider values
	x = parseInt( document.getElementById('xScale').value );
	y = parseInt( document.getElementById('yScale').value );
	z = parseInt( document.getElementById('zScale').value );
	yAngle = parseInt( document.getElementById('yAngle').value );
	zAngle =  parseInt( document.getElementById('zAngle').value );

	if (isNaN(yAngle) || isNaN(zAngle))
	{
		yAngle = 100;
		zAngle = 100;
	}
	
}

var test = document.getElementById("selector");

function whatClicked(evt) {
	try {
		shape = document.getElementById("select_label_001").getElementsByTagName("span")[0].innerHTML;
		//console.log(shape);
	}
	catch(err) {
		console.log("shape is null");
		shape = "Cube";
	}

	swapGeo(cube);
}

test.addEventListener("click", whatClicked, false);

var sideNavReset = document.getElementById("closeButton");

function resetRes(evt) {

	width = window.innerWidth,
	height = window.innerHeight;

	sideBarWidth = 0;

	camera.aspect = (width - sideBarWidth) / height;
	camera.updateProjectionMatrix();

	renderer.setSize ( width - sideBarWidth, height );

}


sideNavReset.addEventListener("click", resetRes, false);


function draw() {
	// ctx.clearRect(0, 0, width, height);

	setVariables();

	cube.scale.x = x/100;
	cube.scale.y = y/100;
	cube.scale.z = z/100;

	// cube.rotation.y = yAngle * (Math.PI/180);
	// cube.rotation.z = zAngle * (Math.PI/180);

	cube.rotation.y += yAngle * (Math.PI/180) / 50;
	cube.rotation.z += zAngle * (Math.PI/180) / 50;

	// ctx.fillStyle="#FF0000";
	// ctx.fillRect(width/2, height/2, x, y);

	window.requestAnimationFrame(draw);

	render();
}

function render() {

	renderer.render( scene, camera );
}

function onWindowResize() {

	width = window.innerWidth,
	height = window.innerHeight;

	sideBarWidth = document.getElementById('sideBar').offsetWidth;

	camera.aspect = (width - sideBarWidth) / height;
	camera.updateProjectionMatrix();

	renderer.setSize ( width - sideBarWidth, height );

	console.log(sideBarWidth);
}