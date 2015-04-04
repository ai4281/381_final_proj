var width = window.innerWidth,
	height = window.innerHeight;

var sideBarWidth = document.getElementById('sideBar').offsetWidth;

var container;
var camera, scene, renderer;
var cameraMoving = false;

var cubeArray1 = [];
var cubeArray2 = [];

var geometries = [];
var defaultMaterial;

var x, y, z, shape, yAngle, zAngle;

var sunMesh;

var directionalLight;

//floor
var SEPARATION = 10;
var AMOUNTX = 40;
var AMOUNTY = 40;
var particleArray = [];

//mouse val
var mouseX = 0, mouseY = 0;

var incrementalVal = 0.1;

var xSize = 4,
	ySize = 4,
	zSize = 4;

//tempo change
var oldTempo, newTempo;


init();
draw();

var cube;

function init() {
	container = document.getElementById( 'cont' );

	oldTempo = timbre.bpm;
	newTempo = oldTempo;

	camera = new THREE.PerspectiveCamera(70, (width) / height, 1, 1000);
	camera.position.set(0, 20, 50);

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0xADEBEC );
				renderer.setSize ( width, height );
				renderer.domElement.style.cssFloat = "left";

	container.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );


	

	initCubes(cubeArray1);
	initCubes(cubeArray2);

	initGeometry();

	//sand
	initTerrain(0x855C33, 25, 300, 20, 0, 0);
	//grass
	initTerrain(0x2E9C53, 25, 10, 10, 0, 0);
	//river
	initTerrain(0x9BE6E6, 50, 150, 2, 0, 0);
	//mountain
	initTerrain(0x66FF66, 5, 1000, 200, -10, -580);


	initSky();

	//initFloor();

	//add mouse
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false);
	document.addEventListener( 'touchmove', onDocumentTouchMove, false);
	document.addEventListener( 'touchend', onDocumentTouchEnd, false);

	document.addEventListener( 'mousedown', onMouseDown, false);
	document.addEventListener( 'mouseup', onMouseUp, false);
}

function initSky() {

	var sunGeo = new THREE.SphereGeometry( 5, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00, shading: THREE.FlatShading} );
	sunMesh = new THREE.Mesh( sunGeo, material );
	sunMesh.scale.set(5, 5, 5);
	sunMesh.position.y = 150;
	sunMesh.position.z = -500;
	scene.add( sunMesh );

	directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
	directionalLight.position.set( 0, 150, 0 );
	scene.add( directionalLight );
}

function initTerrain(color, detail, noiseDiv, height, yPos, zPos)
{
	noise.seed(Math.random());

	var geometry = new THREE.PlaneGeometry(1000, 1000, detail, detail);

	console.log(geometry.vertices.length);

	for (var i = 0; i < geometry.vertices.length; i++)
	{
		geometry.vertices[i].z = noise.simplex2(i, i / noiseDiv) * height;
		//geometry.vertices[i].z = Math.random() * height;
	}

	var material = new THREE.MeshPhongMaterial( { color: color, specular: 0x009900, shininess: 0, shading: THREE.FlatShading } );

	//var material = new THREE.MeshBasicMaterial({color: color, opacity: 0.5, wireframe: false});

	var plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = Math.PI/2;
	plane.rotation.y = Math.PI;

	plane.position.y = yPos;
	plane.position.z = zPos;

	scene.add(plane);

}

function initFloor()
{
	var material = new THREE.SpriteMaterial({color: 0xff0000});

	for ( var ix = 0; ix < AMOUNTX; ix++ ) {

		for ( var iy = 0; iy < AMOUNTY; iy++ ) {

			particle = new THREE.Sprite( material );
			particle.scale.y = 20;
			particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
			particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
			scene.add( particle );
			particleArray.push(particle);
		}

	}

}

function initCubes(cubeArray)
{
	for (var x = 0; x < xSize; x++)
	{
		for (var y = 0; y < ySize; y++)
		{
			for (var z = 0; z < zSize; z++)
			{
				var geometry = new THREE.BoxGeometry( 2, 2, 2 );
				//opacity 0.6
				defaultMaterial = new THREE.MeshNormalMaterial({color: 0xff0000, opacity: 0.6, transparent: true, wireframe: false});
				cube = new THREE.Mesh( geometry, defaultMaterial );
				//cube.position.set(x * 1.3, y * 1.3, z * 1.3);

				cubeArray.push(cube);
				scene.add(cube);

			}

		}
	}
}

function positionCubes(cubeArrayDef, xVal, yVal, zVal)
{
	var i = 0;

	for (var a = 0; a < xSize; a++)
	{
		for (var b = 0; b < ySize; b++)
		{
			for (var c = 0; c < zSize; c++)
			{
				cubeArrayDef[i].position.set(a * xVal - xVal/2 - 50, b * yVal - yVal/2, c * zVal - zVal/2);

				i++;
			}

		}
	}
}

//make geometries
function initGeometry() {
	
	var cubeGeo = new THREE.BoxGeometry( 1, 1, 1 );
	var cylGeo = new THREE.CylinderGeometry( 1, 1, 1, 3 );
	var torusGeo = new THREE.TorusGeometry( 0.5, 0.25, 16, 50 );
	var sphereGeo = new THREE.SphereGeometry( 1, 32, 32 );

	geometries.push(cubeGeo, cylGeo, torusGeo, sphereGeo);
}

//mouse update
function onDocumentMouseMove( event ) {

	mouseX = event.clientX - width/2;
	mouseY = event.clientY - height/2;

	newTempo = z;
}

function onDocumentTouchMove( event ) {

	//event.preventDefault();

	mouseX = event.targetTouches[0].pageX;
	mouseY = event.targetTouches[0].pageY;

	if (event.targetTouches.length == 2)
	{
		cameraMoving = true;
	}

	newTempo = z;

}

function onDocumentTouchEnd(event) {
	cameraMoving = false;

	if (oldTempo != newTempo)
	{
		setBPM(newTempo);
		oldTempo = timbre.bpm;
	}

}

function onMouseDown(event) {
	cameraMoving = true;
	
}

function onMouseUp(event) {
	cameraMoving = false;

	newTempo = z;

	if (oldTempo != newTempo)
	{
		setBPM(newTempo);
		oldTempo = timbre.bpm;
	}

	console.log(timbre.bpm);

}

function onKeyDown (event) {
	console.log(event.which);

	if (event.which == 32)
	{
		if (z > 300)
		{
			setBPM (300);
		}

		else
		{
			setBPM(z);
		}
	}

	if (event.which == 67)
	{
		cameraMoving = !cameraMoving;
	}

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

	for (var i = 0; i < cubeArray1.length; i++)
	{
		swapGeo(cubeArray1[i]);
	}

	for (var i = 0; i < cubeArray2.length; i++)
	{
		swapGeo(cubeArray2[i]);
	}
	
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


function scaleCube(index, cube, musicArray) {

	if (musicArray[index] == 1)
	{
		if (cube.scale.x < x/100)
		{
			cube.scale.x += incrementalVal;
		}

		if (cube.scale.y < y/100)
		{
			cube.scale.y += incrementalVal;
		}

		if (cube.scale.z < z/100)
		{
			cube.scale.z += incrementalVal;
		}
	}

	else
	{
		if (cube.scale.x > 0.5)
		{
			cube.scale.x -= incrementalVal;
		}
		
		if (cube.scale.y > 0.5)
		{
			cube.scale.y -= incrementalVal;
		}

		if (cube.scale.z > 0.5)
		{
			cube.scale.z -= incrementalVal;
		}
	}

}

function iterateCubeArray(cubeArrayDef, musicArrayDef, num1, num2, num3)
{
	var musicIndex = 0;

	for (var i = 0; i < cubeArrayDef.length; i++)
	{
		scaleCube(musicIndex, cubeArrayDef[i], musicArrayDef);
		cubeArrayDef[i].rotation.y += yAngle * (Math.PI/180) / 70;
		cubeArrayDef[i].rotation.z += zAngle * (Math.PI/180) / 70;

		if (!isNaN(x))
		{
			//console.log(x);
			positionCubes(cubeArrayDef, x / num1, y / num2, z / num3);
		}

		musicIndex++;

		if (musicIndex > 7)
		{
			musicIndex = 0;
		}
	}

}


function draw() {
	// ctx.clearRect(0, 0, width, height);

	setVariables();

	iterateCubeArray(cubeArray1, oneArray, 5, 5, -5);

	iterateCubeArray(cubeArray2, threeArray, 2, 2, -2);

	window.requestAnimationFrame(draw);

	render();
}

function render() {

	if ( cameraMoving )
	{
		camera.position.x = mouseX / 10;
		camera.position.y = mouseY / 10;
	}

	if (camera.position.y < 0)
	{
		camera.position.y = 0;	
	}

	//update fov
	camera.fov = zAngle;
	camera.updateProjectionMatrix();
	

	var pos = new THREE.Vector3(0, 150, -1000);

	camera.lookAt( pos );

	var color = new THREE.Color( 0x000000 );
	color.r = x/500;
	color.g = y/500;
	color.b = z/500;

	renderer.setClearColor( color );

	renderer.render( scene, camera );
}

function onWindowResize() {

	width = window.innerWidth,
	height = window.innerHeight;

	camera.aspect = (width) / height;
	camera.updateProjectionMatrix();

	renderer.setSize ( width, height );

	console.log(sideBarWidth);
}