function AnaglyphRenderer ( renderer ) {

    // left and right cameras
    this.cameraLeft  = new THREE.Camera();
    this.cameraLeft.matrixAutoUpdate = false;
    this.cameraRight = new THREE.Camera();
    this.cameraRight.matrixAutoUpdate = false;

    this.update = function (camera) {
        camera.updateMatrixWorld();
        this.cameraRight.matrixWorld = camera.matrixWorld.clone();
        this.cameraLeft.matrixWorld = camera.matrixWorld.clone();

        var znear = camera.near;
        var zfar = camera.far;

        var d = displayParameters.distanceScreenViewer;
        var w = displayParameters.screenSize().x; // width
        var h = displayParameters.screenSize().y; // height
        var ipd = displayParameters.ipd;

        var top = znear * (h / (2.0 * d));
        var bottom = - top;

        // left eye
        var L_right = znear * ((w + ipd) / (2.0 * d));
        var L_left = - znear * ((w - ipd) / (2.0 * d));
        var translateLeft = new THREE.Matrix4();
        translateLeft.makeTranslation(-displayParameters.ipd/2, 0, 0);
        this.cameraLeft.matrixWorld.multiplyMatrices(this.cameraLeft.matrixWorld, translateLeft);
        this.cameraLeft.projectionMatrix.makePerspective(L_left, L_right, top, bottom, znear, zfar);

        // right eye
        var R_right = - L_left;
        var R_left = - L_right;
        var translateRight = new THREE.Matrix4();
        translateRight.makeTranslation(displayParameters.ipd/2, 0, 0);
        this.cameraRight.matrixWorld.multiplyMatrices(this.cameraRight.matrixWorld, translateRight);
        this.cameraRight.projectionMatrix.makePerspective(R_left, R_right, top, bottom, znear, zfar);
    }

    this.render = function (scene, camera) {
        this.update(camera);

        var gl = renderer.domElement.getContext('webgl');

        renderer.clearDepth();
        gl.colorMask(true, false, false, true); // red
        renderer.render(scene, this.cameraLeft);

        renderer.clearDepth();
        gl.colorMask(false, true, true, true); // cyan
        renderer.render(scene, this.cameraRight);

        gl.colorMask(true, true, true, true);
    }
}
