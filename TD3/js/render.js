
var canvas, context, imageData, imageDst;
var renderer;
var tobi = false;

var focal = {x: 743.89066776986397, y: 743.89066776986397};
var optical_center = {x: 319.50000000000000, y: 239.50000000000000};
var size_postit = 77; // 7.7cm

var Menu = function() {
  this.threshold = true;
  this.threshold_value = 30;

  this.colorRGB = [ 125, 125, 125 ,255 ];

  this.hsv = false;
  this.minSV = 0.0;
  this.maxSV = 1.0;
};

var menu, stats, gui;

function init() {

  canvas = document.getElementById("canvas");
  canvas.width = parseInt(canvas.style.width);
  canvas.height = parseInt(canvas.style.height);

  context = canvas.getContext("2d");

  imageDst = new ImageData( canvas.width, canvas.height)

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor(0xffffff, 1);
  document.getElementById("container").appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5);
  scene.add(camera);
  texture = createTexture();
  scene.add(texture);

  // GUI
  menu = new Menu();
  gui = new dat.GUI();
  gui.add(menu, 'threshold');
  gui.add(menu, 'threshold_value', 0, 255);
  gui.addColor(menu, 'colorRGB').listen();
  gui.add(menu, 'hsv');
  gui.add(menu, 'minSV', 0, 1, 0.05);
  gui.add(menu, 'maxSV', 0, 1, 0.05);

  // stats
  stats = new Stats();
  document.getElementById("container").appendChild(stats.dom);

  // Events
  document.addEventListener("click", mouseClick);
  document.addEventListener( 'keydown', onKeyDown, false);
  document.addEventListener( 'keyup', onKeyUp, false);

  animate();
}

function createTexture() {
  var texture = new THREE.Texture(imageDst),
      object = new THREE.Object3D(),
      geometry = new THREE.PlaneGeometry(1.0, 1.0, 0.0),
      material = new THREE.MeshBasicMaterial( {map: texture, depthTest: false, depthWrite: false} ),
      mesh = new THREE.Mesh(geometry, material);

  texture.minFilter = THREE.NearestFilter;

  object.position.z = -1;

  object.add(mesh);

  return object;
}

function animate() {

  requestAnimationFrame( animate );
  if (video.readyState === video.HAVE_ENOUGH_DATA){
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    if(menu.threshold) {
        imageBinary = new CV.Image(canvas.width, canvas.height);

        // Fill imageDst & imageBinary
        if (menu.hsv) {
            thresholdHSV(imageData, imageDst, imageBinary, menu.colorRGB, menu.threshold_value, [menu.minSV, menu.maxSV]);
        } else {
            thresholdRGB(imageData, imageDst, imageBinary, menu.colorRGB, menu.threshold_value);
        }

        var binary = new CV.Image(imageData.width, imageData.height);
        var contours = CV.findContours(imageBinary, binary);
        extractInterestZone(contours);
    } else {
        imageDst.data.set(imageData.data);
    }

    texture.children[0].material.map.needsUpdate = true;
    render();
  }
}

function render() {

  renderer.clear();
  renderer.render(scene, camera);

  stats.update();
}

function extractInterestZone(contours) {
    // Find biggest Contour
    var biggestPerimeter = -1;
    var biggestContour = -1;
    for (var i = 0; i < contours.length; i++) {
        var perimeter = CV.perimeter(contours[i]);
        if (biggestPerimeter < perimeter) {
            biggestPerimeter = CV.perimeter(contours[i]);
            biggestContour = contours[i];
        }
    }

    if (biggestPerimeter == -1) { return; }

    // Find bounding box
    var maxX = 0, minX = canvas.width,
        maxY = 0, minY = canvas.height;
    for (var j = 0; j < biggestContour.length; j++) {
        if (biggestContour[j].x < minX) { minX = biggestContour[j].x }
        if (biggestContour[j].x > maxX) { maxX = biggestContour[j].x }
        if (biggestContour[j].y < minY) { minY = biggestContour[j].y }
        if (biggestContour[j].y > maxY) { maxY = biggestContour[j].y }
    }

    var x1 = minX, y1 = minY,
        x2 = maxX, y2 = maxY;
    radius = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)) / 2;
    centerX = x1 + (x2 - x1) / 2;
    centerY = y1 + (y2 - y1) / 2;

    if (!tobi) {
        // Center
        context.fillStyle = "#ff0000";
        context.fillRect(centerX-2, centerY-2, 4, 4);

        // Corners
        context.fillStyle = "#0000ff";
        context.fillRect(x1-2, y1-2, 4, 4);
        context.fillRect(x2-2, y1-2, 4, 4);
        context.fillRect(x1-2, y2-2, 4, 4);
        context.fillRect(x2-2, y2-2, 4, 4);

        // 2D Bounding box
        context.strokeStyle = "#ff00ff";
        context.beginPath();
        context.rect(x1, y1, x2-x1, y2-y1);
        context.stroke();
        context.closePath();

        // Circle
        context.strokeStyle = "#00ff00";
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.stroke();
        context.closePath();
    } else {
		var radiusBall = 20;
		context.beginPath();
		context.fillStyle = "#FEC3AC";
		context.arc(centerX-radiusBall, centerY, radiusBall, 0 , 2 * Math.PI);
		context.fill();
		context.closePath();

		context.beginPath();
		context.fillStyle = "#FEC3AC";
		context.arc(centerX+radiusBall, centerY, radiusBall, 0 , 2 * Math.PI);
		context.fill();
		context.closePath();

		context.beginPath();
		context.fillStyle = "#ff1e9a"
		context.arc(centerX, centerY+radiusBall*3.5, radiusBall, 0,  2 * Math.PI);
		context.fill();
		context.closePath();

		context.beginPath();
		context.fillStyle = "#FEC3AC";
		context.fillRect(centerX-(radiusBall*1.5)/2, centerY, radiusBall*1.5, radiusBall*3);
		context.closePath();
    }
}

function thresholdRGB(imageSrc, imageDst, imageBinary, threshold, tolerance) {
	var src = imageSrc.data;
	var dst = imageDst.data;
	var binary = imageBinary.data;

    var color;
    var i_bin = 0;
	for (i = 0; i < src.length; i += 4){
		if (Math.abs(src[i+0] - threshold[0]) <= tolerance &&
            Math.abs(src[i+1] - threshold[1]) <= tolerance &&
		    Math.abs(src[i+2] - threshold[2]) <= tolerance &&
		    Math.abs(src[i+3] - threshold[3]) <= tolerance){
            color = 255;
        } else {
            color = 0;
        }

		for(j = 0 ; j < 4 ; j++) { dst[i+j] = color; }
		binary[i_bin++] = color;
	}
}

function thresholdHSV(imageSrc, imageDst, imageBinary, threshold, toleranceH, toleranceSV) {
	var src = imageSrc.data;
	var dst = imageDst.data;
	var binary = imageBinary.data;

	[thresholdH, thresholdS, thresholdV] = rgb2hsv(threshold[0], threshold[1], threshold[2]);
	[minSV, maxSV] = [toleranceSV[0], toleranceSV[1]];

    var color;
    var i_bin = 0;
	for(var i = 0; i < src.length; i += 4) {
		[h, s, v] = rgb2hsv(src[i], src[i+1], src[i+2]);

		if (Math.abs(h - thresholdH) <= toleranceH &&
			minSV < s && s < maxSV &&
			minSV < v && v < maxSV) {
            color = 255;
        } else {
            color = 0;
        }

		for(j = 0 ; j < 4 ; j++) { dst[i+j] = color; }
		binary[i_bin++] = color;
	}
}


function rgb2hsv (r,g,b) {
	var computedH = 0;
	var computedS = 0;
	var computedV = 0;

	r = r/255; g = g/255; b = b/255;
	var minRGB = Math.min(r, Math.min(g,b));
	var maxRGB = Math.max(r, Math.max(g,b));

	// Black-gray-white
	if (minRGB == maxRGB) {
		computedV = minRGB;
		return [0,0,computedV];
	}

	// Colors other than black-gray-white:
	var d = (r == minRGB) ? g-b : ((b == minRGB) ? r-g : b-r);
	var h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
	computedH = 60*(h - d/(maxRGB - minRGB));
	computedS = (maxRGB - minRGB)/maxRGB;
	computedV = maxRGB;
	return [computedH,computedS,computedV];
}

function mouseClick(event) {
    switch (event.button) {
        case 0:
            if(event.clientX <= canvas.width && event.clientY <= canvas.height) {
                var color = context.getImageData(event.clientX, event.clientY, 1, 1).data;
                menu.colorRGB = Array.from(color);
                break;
            }
        default:
            break;
    }
}

function onKeyDown(event) {
    switch (event.keyCode) {
        case 66: // b
            tobi = true;
            break;
        default:
            break;
    }
}

function onKeyUp(event) {
    switch (event.keyCode) {
        case 66: // b
            tobi = false;
            break;
        default:
            break;
    }
}
