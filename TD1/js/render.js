var container, stats;
var scene, camera, renderer;
var cube;
var controls, clock;

function init()
{

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

    // scene, camera & renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // controls
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    clock = new THREE.Clock();

    
    // Load textures
    var textureLoader = new THREE.TextureLoader();

    var mat1 = new THREE.MeshBasicMaterial(
	{map: textureLoader.load("textures/tnt1.png")});
    var mat2 = new THREE.MeshBasicMaterial(
	{map: textureLoader.load("textures/tnt2.png")});
    var mat3 = new THREE.MeshBasicMaterial(
	{map: textureLoader.load("textures/stonebrick.png")});
    var mat4 = new THREE.MeshBasicMaterial(
	{map: textureLoader.load("textures/stonebrick_mossy.png")});
    var mat5 = new THREE.MeshBasicMaterial(
	{map: textureLoader.load("textures/sand.png")});
    
    // Create map
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    
    var mat_tnt = [mat1, mat1, mat2, mat2, mat1, mat1];
    var tnt = new THREE.Mesh(geometry, mat_tnt);
    tnt.position.set(0, 2, 0);
    scene.add(tnt);

    for (var x = -10; x <= 10; x++) {
	for (var z = -10; z <= 10; z++) {
	    var sand = new THREE.Mesh(geometry, mat5);
	    sand.position.set(x, 0, z);
	    scene.add(sand);
	    
	    var stone;
	    if (Math.floor(Math.random() * 2)) {
		stone = new THREE.Mesh(geometry, mat3);
	    } else {
		stone = new THREE.Mesh(geometry, mat4);
	    }
	    stone.position.set(x, 1, z);
	    scene.add(stone);
	}
    }
    
    // Place camera
    camera.position.z = 20;
    camera.position.y = 10;
}


function animate()
{
    stats.update();
    
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
    controls.update(clock.getDelta());
}
