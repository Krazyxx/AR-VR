var container, stats;
var scene, camera, renderer;
var controls, clock;
var mat0, mat1, mat2, mat3, mat4, mat5;

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
    //controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls = new THREE.PointerLockControls(camera, renderer.domElement);
    controls.enabled = true;
    scene.add(controls.getObject());
    
    clock = new THREE.Clock();

    
    // Load textures
    var textureLoader = new THREE.TextureLoader();

    mat0 = new THREE.MeshBasicMaterial(
	{color: 0x00ff00});
    mat1 = new THREE.MeshBasicMaterial(
	{map: textureLoader.load("textures/tnt1.png")});
    mat2 = new THREE.MeshBasicMaterial(
	{map: textureLoader.load("textures/tnt2.png")});
    mat3 = new THREE.MeshBasicMaterial(
	{map: textureLoader.load("textures/stonebrick.png")});
    mat4 = new THREE.MeshBasicMaterial(
	{map: textureLoader.load("textures/stonebrick_mossy.png")});
    mat5 = new THREE.MeshBasicMaterial(
	{map: textureLoader.load("textures/sand.png")});
    
    // Create scene
    //load_scene_1();
    //load_scene_2();
    load_scene_3();

}

function animate()
{
    stats.update();
    
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    //controls.update(clock.getDelta());
}
    
document.addEventListener("keydown", function(event){
    if      (event.keyCode == KEY_Z) { move_up();    }
    else if (event.keyCode == KEY_S) { move_down();  }
    else if (event.keyCode == KEY_Q) { move_right(); }
    else if (event.keyCode == KEY_D) { move_left();  }
});


KEY_Z		= 90;
KEY_Q		= 81;
KEY_S		= 83;
KEY_D		= 68;

function move_up()    { controls.getObject().position.z -= 0.1; }
function move_down()  { controls.getObject().position.z += 0.1; }
function move_right() { controls.getObject().position.x -= 0.1; }
function move_left()  { controls.getObject().position.x += 0.1; }


function load_scene_1()
{
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var cube = new THREE.Mesh(geometry, mat0);

    scene.add(cube);
    
    cube.rotation.x += 0.5;
    cube.rotation.y += 0.5;
    
    camera.position.z = 5;
}

function load_scene_2()
{
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    
    var mat_tnt = [mat1, mat1, mat2, mat2, mat1, mat1];
    var tnt = new THREE.Mesh(geometry, mat_tnt);
    scene.add(tnt);

    var mat_stone = [mat3, mat4];
    for (var x = -10; x <= 10; x++) {
	for (var z = -10; z <= 10; z++) {
	    var sand = new THREE.Mesh(geometry, mat5);
	    sand.position.set(x, -2, z);
	    scene.add(sand);
	    
	    var rand = Math.floor(Math.random() * mat_stone.length);
	    var stone = new THREE.Mesh(geometry, mat_stone[rand]);
	    stone.position.set(x, -1, z);
	    scene.add(stone);
	}
    }
    
    // Place camera
    camera.position.z = 30;
    camera.position.y = 10;
}

function load_scene_3()
{
    load_scene_2();
    
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    mat_stone = [mat3, mat4];
    
    // walls
    create_wall(-10,0,-10,21,4, 1,mat_stone);
    create_wall(-10,0,-10, 1,4,21,mat_stone);
    create_wall( 10,0,-10, 1,4,21,mat_stone);

    // door
    create_wall(  2,0, 10, 9,4, 1,mat_stone);
    create_wall(-10,0, 10, 9,4, 1,mat_stone);
    create_wall( -2,3, 10, 9,1, 1,mat_stone);

    // tower
    create_wall( -2,0,-2, 5,8,1,mat_stone);
    create_wall(  2,0,-2, 1,8,5,mat_stone);
    create_wall( -2,0, 2, 5,8,1,mat_stone);
    create_wall( -2,0,-2, 1,8,5,mat_stone);

    // drawbridge
    create_wall( -2,-1,11, 1,1,5,mat_stone);
    create_wall(  2,-1,11, 1,1,5,mat_stone);
    create_wall( -2,-2,11, 1,0,5,mat_stone);
    create_wall(  2,-2,11, 1,0,5,mat_stone);
    
    for (var x = -1; x <= 1; x++) {
	for (var z = 11; z < 16; z++) {
	    var rand = Math.floor(Math.random() * mat_stone.length);
	    var stone = new THREE.Mesh(geometry, mat_stone[rand]);
	    stone.position.set(x, -1, z);
	    scene.add(stone);
	}
    }
    
}

function create_wall(pos_x, pos_y, pos_z,lenght,height,width, mat)
{
    var geometry = new THREE.BoxGeometry(1, 1, 1);

    for (var x = 0; x < lenght; x++) {
	for (var y = 0; y < height; y++) {
	    for (var z = 0; z < width; z++) {
		var rand = Math.floor(Math.random() * mat.length);
		var stone = new THREE.Mesh(geometry, mat[rand]);
		stone.position.set(pos_x+x, pos_y+y, pos_z+z);
		scene.add(stone);
	    }
	}
    }

    for (var x = 0; x < lenght; x+=2) {
	var rand = Math.floor(Math.random() * mat.length);
	var stone = new THREE.Mesh(geometry, mat[rand]);
	stone.position.set(pos_x+x, pos_y+height, pos_z+width-1);
	scene.add(stone);
    }
    
    for (var z = 0; z < width; z+=2) {
	var rand = Math.floor(Math.random() * mat.length);
	var stone = new THREE.Mesh(geometry, mat[rand]);
	stone.position.set(pos_x+lenght-1, pos_y+height, pos_z+z);
	scene.add(stone);
    }
}
