function AnaglyphRenderer ( renderer ) {

    // left and right cameras
    this.cameraLeft  = new THREE.Camera();
    this.cameraLeft.matrixAutoUpdate = false;
    this.cameraRight = new THREE.Camera();
    this.cameraRight.matrixAutoUpdate = false;


    this.update = function ( camera ) {
        // TODO
        camera.updateMatrixWorld();
        this.cameraRight.matrixWorld = camera.matrixWorld.clone();
        this.cameraLeft.matrixWorld = camera.matrixWorld.clone();

        var znear = camera.near;
        var zfar = camera.far;

        var d = displayParameters.distanceScreenViewer;
        var h = displayParameters.screenSize().x; // height
        var w = displayParameters.screenSize().y; // width
        var ipd = displayParameters.ipd;

        var top = znear * (h / (2.0 * d));
        var bottom = - znear * (h / (2.0 * d));

        // left eye
        var L_right = znear * ((w + ipd) / (2.0 * d));
        var L_left = - znear * ((w - ipd) / (2.0 * d));

        // right eye
        var R_right = znear * ((w - ipd) / (2.0 * d));
        var R_left = -znear * ((w + ipd) / (2.0 * d));


//        var translateLeft = new THREE.Matrix4();
//        translateLeft.makeTranslation(-displayParameters.ipd/2, 0, 0);
//        this.cameraLeft.matrixWorld.multiplyMatrices(this.cameraLeft.matrixWorld, translateLeft);
        this.cameraLeft.projectionMatrix.makePerspective(L_left, L_right, top, bottom, znear, zfar);

//        var translateRight = new THREE.Matrix4();
//        translateRight.makeTranslation(displayParameters.ipd/2, 0, 0);
//        this.cameraRight.matrixWorld.multiplyMatrices(this.cameraRight.matrixWorld, translateLeft);
        this.cameraRight.projectionMatrix.makePerspective(R_left, R_right, top, bottom, znear, zfar);
    }

    this.cpt = 0;

    this.render = function ( scene, camera ) {
        this.update(camera);

        if (this.cpt == 0) {
            this.cpt = 1;
            renderer.render(scene,  this.cameraRight);
        } else {
            this.cpt = 0;
            renderer.render(scene,  this.cameraLeft);
        }
    }
}
