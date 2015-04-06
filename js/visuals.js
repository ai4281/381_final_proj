var width = window.innerWidth,
	height = window.innerHeight;

// //delay to ensure viewport size correctness
// var t = setTimeout(function() {
// 	width = window.innerWidth,
// 	height = window.innerHeight;

// 	console.log(width + ":" + height);
// 	var node = document.createElement("p");
// 	var stringNode = document.createTextNode((width + ":" + height).toString());
// 	node.appendChild(stringNode);

// 	document.getElementById("console").appendChild(node);

// }, 500);

var container;
var camera, scene, renderer;
var cameraMoving = false;

var cubeArray1 = [];
var cubeArray2 = [];

var geometries = [];
var defaultMaterial;

var x = 100, y = 100, z = 100, shape, yAngle, zAngle = 100;

var grass, river, moutain;
var grassOrig = [], riverOrig = [], moutainOrig = [];

var sunMesh;
var skyAngle = 0;

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

var pos = new THREE.Vector3(0, 0, -30);



function init() {
	container = document.getElementById( 'cont' );

	camera = new THREE.PerspectiveCamera(70, (width) / height, 1, 1000);
	camera.position.set(0, 5, 50);

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0xffffff );
				renderer.setSize ( width, height );
				renderer.domElement.style.cssFloat = "left";

	container.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );

	var ambientLight = new THREE.AmbientLight( 0x303030 ); // soft white light
	scene.add( ambientLight );

	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0, 0.2, 0 );
	scene.add( directionalLight );
-
	initCubes(cubeArray1);
	initCubes(cubeArray2);

	//initGeometry();

	//sand
	//initTerrain(0x855C33, 25, 300, 150, -100, 0);
	// //grass
	initTerrain("grass", 0x78A95C, 50, 50, 1.5, 0, 0, 100);
	// //river
	initTerrain("river", 0x9BA6EE, 10, 10, 1.0, 0, 0, 100);
	// //mountain
	//initTerrain(0x66FF66, 10, 10, 20, -10, -50, 200);
	grass = scene.getObjectByName( "grass", true );
	river = scene.getObjectByName( "river", true );
	
	console.log(grass);

	initTerrainSalehen();

	initOrigZArray(grassOrig, grass);
	initOrigZArray(riverOrig, river);
	initOrigZArray(moutainOrig, terrain);


	initSky();

	//initFloor();

	//add mouse
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onMouseDown, false);
	document.addEventListener( 'mouseup', onMouseUp, false);

	document.addEventListener( 'touchmove', onDocumentTouchMove, false);
	document.addEventListener( 'touchend', onDocumentTouchEnd, false);


	draw();
}

function initSky() {

	var sunGeo = new THREE.SphereGeometry( 5, 7, 7 );
	var material = new THREE.MeshPhongMaterial( {color: 0xffff00, shininess: 0, shading: THREE.FlatShading} );
	sunMesh = new THREE.Mesh( sunGeo, material );
	sunMesh.scale.set(20, 15, 15);
	sunMesh.position.y = 400;
	sunMesh.position.z = -700;
	sunMesh.lookAt(camera.position);
	scene.add( sunMesh );

	var pointLight = new THREE.PointLight(0xffffff, 0.7);
	pointLight.position = new THREE.Vector3(0, 400, -650);
	scene.add(pointLight);

	
}

function initOrigZArray(origZArray, mesh)
{
	for (var i = 0; i < mesh.geometry.vertices.length; i++)
	{
		origZArray[i] = mesh.geometry.vertices[i].z;
	}
}

function initTerrain(planeName, color, detail, noiseDiv, height, yPos, zPos, size)
{

	var geometry = new THREE.PlaneGeometry(100, 100, detail, detail);

	geometry.verticesNeedUpdate = true;
	geometry.normalsNeedUpdate = true;
	geometry.dynamic = true;

	for (var i = 0; i < geometry.vertices.length; i++)
	{
		geometry.vertices[i].z = Math.random() * height;
	}

	var material = new THREE.MeshPhongMaterial( { color: color, shininess: 1.0, shading: THREE.FlatShading } );
	//var material = new THREE.MeshBasicMaterial({color: color, opacity: 0.5, wireframe: false});


	var plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = Math.PI/2;
	plane.rotation.y = Math.PI;

	plane.name = planeName;

	plane.position.y = yPos;
	plane.position.z = zPos;

	scene.add(plane);

}

function initMountain()
{
	
	
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
	for (var ix = 0; ix < xSize; ix++)
	{
		for (var iy = 0; iy < ySize; iy++)
		{
			for (var iz = 0; iz < zSize; iz++)
			{
				var geometry = new THREE.SphereGeometry( 2, 2, 2 );
				//opacity 0.6
				defaultMaterial = new THREE.MeshPhongMaterial({color: 0xff00ff * Math.random(), opacity: 0.6, transparent: true, wireframe: false, shading: THREE.FlatShading});
				cube = new THREE.Mesh( geometry, defaultMaterial );
				cube.position.set(ix * 5 - ix * 1, iy * 1.2, iz * 1.2);

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
				cubeArrayDef[i].position.set(a * xVal - xVal/2, b * yVal - yVal/2, c * zVal - zVal/2);

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

}

function onDocumentTouchMove( event ) {

	event.preventDefault();

	mouseX = event.targetTouches[0].pageX;
	mouseY = event.targetTouches[0].pageY;

	if (event.targetTouches.length == 2)
	{
		cameraMoving = true;
	}

}

function onDocumentTouchEnd(event) {
	cameraMoving = false;

}

function onMouseDown(event) {
	cameraMoving = true;
	
}

function onMouseUp(event) {
	cameraMoving = false;

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
	try {
		x = parseInt( document.getElementById('xScale').value );
		y = parseInt( document.getElementById('yScale').value );
		z = parseInt( document.getElementById('zScale').value );
		yAngle = parseInt( document.getElementById('yAngle').value );
		zAngle =  parseInt( document.getElementById('zAngle').value );
	}

	catch(err)
	{
		x = parseInt(data.red);
		y = parseInt(data.green);
		z = parseInt(data.blue);
		yAngle = 100;
		zAngle = parseInt(data.fov);
	}

	if (isNaN(x) || isNaN(y) || isNaN(z) || isNaN(yAngle) || isNaN(zAngle) )
	{
		x = parseInt(data.red);
		y = parseInt(data.green);
		z = parseInt(data.blue);
		yAngle = 100;
		zAngle = parseInt(data.fov);
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

function dancingTerrain(index, terrainName, musicArray, origZArray, movementAmount, threshold) {


	if (musicArray[index])
	{
		//console.log("1");

		for (var i = 0; i < terrainName.geometry.vertices.length; i+=1)
		{
			if ( Math.abs(origZArray[i] - terrainName.geometry.vertices[i].z) <= threshold )
			{
				terrainName.geometry.vertices[i].z += Math.random() * movementAmount;
			}
			else
			{
				terrainName.geometry.vertices[i].z = origZArray[i] + threshold;
			}
		}
	}

	else
	{
		//console.log("0");

		for (var i = 0; i < terrainName.geometry.vertices.length; i+=1)
		{
			if ( Math.abs(origZArray[i] - terrainName.geometry.vertices[i].z) <= threshold )
			{
				terrainName.geometry.vertices[i].z -= Math.random() * movementAmount;
			}
			else
			{
				terrainName.geometry.vertices[i].z = origZArray[i] - threshold;
			}
		}
	}

	// for (var i = 0; i < terrain.geometry.vertices.length; i+=1)
	// {
	// 	terrain.geometry.vertices[i].z -= 0.05;
	// }

	terrainName.geometry.verticesNeedUpdate = true;
	terrainName.geometry.normalsNeedUpdate = true;
}

function scaleCube(index, cube, musicArray) {

	if (musicArray[index] == 1)
	{
		if (cube.scale.x < 2)
		{
			cube.scale.x += incrementalVal;
		}

		if (cube.scale.y < 2)
		{
			cube.scale.y += incrementalVal;
		}

		if (cube.scale.z < 2)
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
		cubeArrayDef[i].rotation.y += z * (Math.PI/180) / 70;
		cubeArrayDef[i].rotation.z += z * (Math.PI/180) / 70;

		musicIndex++;

		if (musicIndex > 7)
		{
			musicIndex = 0;
		}
	}

}

function sunMove() {
	sunMesh.rotation.y += y/10000;

	sunMesh.position.x = Math.cos(skyAngle) * 400;
	sunMesh.position.y = Math.sin(skyAngle) * 300;

	skyAngle -= z / 25000;
}


function draw() {
	// ctx.clearRect(0, 0, width, height);

	// if (window.location.hash == "#/main")
	// {
	
	// }

	

	setVariables();

	positionCubes(cubeArray1, y/100, y/100,y/100);

	positionCubes(cubeArray2, y/100, y/100, y/100);

	sunMove();


	//dancingTerrain(index, terrain, musicArray, origZArray, movementAmount, threshold)
	dancingTerrain(4, grass, oneArray, grassOrig, 0.05, 0.5);
	dancingTerrain(4, terrain, threeArray, moutainOrig, 0.1, 1.0);

	// iterateCubeArray(cubeArray1, oneArray, 5, 5, -5);

	// iterateCubeArray(cubeArray2, threeArray, 2, 2, -2);


	window.requestAnimationFrame(draw);

	render();

	
}

function render() {

	// if ( cameraMoving )
	// {
	// 	camera.position.x = mouseX / 10;
	// 	camera.position.y = mouseY / 10;
	// }

	// if (camera.position.y < 0)
	// {
	// 	camera.position.y = 0;	
	// }

	//update fov
	camera.fov = zAngle;
	camera.updateProjectionMatrix();

	camera.lookAt( pos );

	var color = new THREE.Color( 0x000000 );
	color.r = x/800;
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

}