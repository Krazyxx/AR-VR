var container, stats;
var scenePers, cameraPers, sceneOrth, cameraOrth;
var renderer, renderTarget;
var controls, clock;
var mat0, mat1, mat2, mat3, mat4, mat5;
var up_down, left_right, speed = 1;
var KEY_Z = 90, KEY_Q = 81, KEY_S = 83, KEY_D = 68;

function init()
{
    container = document.createElement('div');
    document.body.appendChild(container);

    // stats
    stats = new Stats();
    container.appendChild(stats.dom);

    // scene & camera Perspective
    scenePers = new THREE.Scene();
    cameraPers = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    scenePers.add(cameraPers);

    // scene & cameraOrthographic
    sceneOrth = new THREE.Scene();
    cameraOrth = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    sceneOrth.add(cameraOrth);

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);

    renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

    // Controls
    controls = new THREE.TrackballControls(cameraPers, renderer.domElement);
    clock = new THREE.Clock();

    //controls = new THREE.PointerLockControls(cameraPers, renderer.domElement);
    //controls.enabled = true;
    //scenePers.add(controls.getObject());


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

    load_orth_cross();
}

function load_orth_cross()
{
  var material = new THREE.LineBasicMaterial({ color: 0xffffff });

  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(10, 0, -1));
  geometry.vertices.push(new THREE.Vector3(-10, 0, -1));
  var line = new THREE.Line(geometry, material);
  sceneOrth.add(line);

  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, -10, -1));
  geometry.vertices.push(new THREE.Vector3(0,  10, -1));
  line = new THREE.Line(geometry, material);

  sceneOrth.add(line);
}

function animate()
{
  stats.update();

  requestAnimationFrame(animate);

  renderer.clear();
  renderer.render(scenePers, cameraPers);
  renderer.clearDepth();
  renderer.render(sceneOrth, cameraOrth);

  if      (up_down == 1)  { move_up(); }
  else if (up_down == -1) { move_down(); }

  if      (left_right == 1)  { move_left(); }
  else if (left_right == -1) { move_right(); }

  controls.update(clock.getDelta());
}

document.addEventListener("click", function(event) {
  scenePers.overrideMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });
  renderer.render(scenePers, cameraPers, renderTarget);

  var pixelBuffer = new Uint8Array(4);
  renderer.readRenderTargetPixels(renderTarget, event.clientX, renderTarget.height - event.clientY, 1, 1, pixelBuffer);
  var id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
  var obj = scenePers.getObjectById(id);
  scenePers.remove(obj);

  scenePers.overrideMaterial = null;
});

document.addEventListener("keydown", function(event){
  if      (event.keyCode == KEY_Z) { up_down = 1;    }
  else if (event.keyCode == KEY_S) { up_down = -1;   }
  else if (event.keyCode == KEY_Q) { left_right = 1; }
  else if (event.keyCode == KEY_D) { left_right = -1; }
});

document.addEventListener("keyup", function(event){
  if      (event.keyCode == KEY_Z || event.keyCode == KEY_S) { up_down = 0;    }
  else if (event.keyCode == KEY_Q || event.keyCode == KEY_D) { left_right = 0; }
});

function move_up()    { controls.getObject().position.z -= speed * clock.getDelta(); }
function move_down()  { controls.getObject().position.z += speed * clock.getDelta(); }
function move_left()  { controls.getObject().position.x -= speed * clock.getDelta(); }
function move_right() { controls.getObject().position.x += speed * clock.getDelta(); }

function applyFaceColor(geom, color) {
  geom.faces.forEach(function(f) {
    f.color.setHex(color);
  });
}

function load_scene_1()
{
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var cube = new THREE.Mesh(geometry, mat0);
  applyFaceColor(geometry, cube.id);
  scenePers.add(cube);

  cube.rotation.x += 0.5;
  cube.rotation.y += 0.5;

  cameraPers.position.z = 5;
}

function load_scene_2()
{
  var geometry = new THREE.BoxGeometry(1, 1, 1);

  var mat_tnt = [mat1, mat1, mat2, mat2, mat1, mat1];
  var tnt = new THREE.Mesh(geometry, mat_tnt);
  applyFaceColor(geometry, tnt.id);
  scenePers.add(tnt);

  var mat_stone = [mat3, mat4];
  for (var x = -10; x <= 10; x++) {
    for (var z = -10; z <= 10; z++) {
      var geometry_sand = geometry.clone();
      var sand = new THREE.Mesh(geometry_sand, mat5);
      sand.position.set(x, -2, z);
      applyFaceColor(geometry_sand, sand.id);
      scenePers.add(sand);

      var rand = Math.floor(Math.random() * mat_stone.length);
      var geometry_stone = geometry.clone();
      var stone = new THREE.Mesh(geometry_stone, mat_stone[rand]);
      stone.position.set(x, -1, z);
      applyFaceColor(geometry_stone, stone.id);
      scenePers.add(stone);
    }
  }

  // Place camera perspective
  cameraPers.position.set(0, 10, 35);
  cameraPers.rotation.x = -0.5;
}

function load_scene_3()
{
  load_scene_2();

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  mat_stone = [mat3, mat4];

  // walls
  create_wall(-10,0,-10,21,4, 1,mat_stone);
  create_wall(-10,0,-10, 1,4,21,mat_stone);
  create_wall(10,0,-10, 1,4,21,mat_stone);

  // door
  create_wall( 2,0, 10, 9,4, 1,mat_stone);
  create_wall(-10,0, 10, 9,4, 1,mat_stone);
  create_wall(-2,3, 10, 9,1, 1,mat_stone);

  // tower
  create_wall(-2,0,-2, 5,8,1,mat_stone);
  create_wall( 2,0,-2, 1,8,5,mat_stone);
  create_wall(-2,0, 2, 5,8,1,mat_stone);
  create_wall(-2,0,-2, 1,8,5,mat_stone);

  // drawbridge
  create_wall(-2,-1,11, 1,1,5,mat_stone);
  create_wall( 2,-1,11, 1,1,5,mat_stone);
  create_wall(-2,-2,11, 1,0,5,mat_stone);
  create_wall( 2,-2,11, 1,0,5,mat_stone);

  for (var x = -1; x <= 1; x++) {
    for (var z = 11; z < 16; z++) {
      var geometry_stone = geometry.clone();
      var rand = Math.floor(Math.random() * mat_stone.length);
      var stone = new THREE.Mesh(geometry_stone, mat_stone[rand]);
      stone.position.set(x, -1, z);
      applyFaceColor(geometry_stone, stone.id);
      scenePers.add(stone);
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
        var geometry_stone = geometry.clone();
        var stone = new THREE.Mesh(geometry_stone, mat[rand]);
        stone.position.set(pos_x+x, pos_y+y, pos_z+z);
        applyFaceColor(geometry_stone, stone.id);
        scenePers.add(stone);
      }
    }
  }

  for (var x = 0; x < lenght; x+=2) {
    var rand = Math.floor(Math.random() * mat.length);
    var geometry_stone = geometry.clone();
    var stone = new THREE.Mesh(geometry_stone, mat[rand]);
    stone.position.set(pos_x+x, pos_y+height, pos_z+width-1);
    applyFaceColor(geometry_stone, stone.id);
    scenePers.add(stone);
  }

  for (var z = 0; z < width; z+=2) {
    var rand = Math.floor(Math.random() * mat.length);
    var geometry_stone = geometry.clone();
    var stone = new THREE.Mesh(geometry_stone, mat[rand]);
    stone.position.set(pos_x+lenght-1, pos_y+height, pos_z+z);
    applyFaceColor(geometry_stone, stone.id);
    scenePers.add(stone);
  }
}
