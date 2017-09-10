var container, stats;
var scene, camera, renderer;
var cube;

function init()
{

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // stats

    stats = new Stats();
    container.appendChild( stats.dom );

    // ======

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    camera.position.z = 5;
}


function animate()
{
    stats.update();
    
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
    //cube.rotation.x += 0.1;
    //cube.rotation.y += 0.1;
}
