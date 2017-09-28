var displayParameters = {


    // parameters for stereo rendering
    // physical screen diagonal -- in mm
    screenDiagonal: 685.8,
    screenResolutionWidth: 2560,
    aspectRatio: 16 / 9,

    // inter pupillar distance -- in mm
    ipd: 64,

    // distance bewteen the viewer and the screen -- in mm
    distanceScreenViewer: 500,

    // TODO: amount of distance in mm between adjacent pixels
    pixelPitch: function() {
        var screenResolutionHeight = this.screenResolutionWidth / this.aspectRatio;
        var screenResolutionDiagonal = Math.sqrt(this.screenResolutionWidth * this.screenResolutionWidth + screenResolutionHeight * screenResolutionHeight);
        return screenResolutionDiagonal / this.screenDiagonal;
    },

    //TODO: physical display width and height -- in mm
    screenSize: function() {
        var pixelPitch = this.pixelPitch();
        var screenResolutionHeight =  this.screenResolutionWidth / this.aspectRatio;
        return new THREE.Vector2(this.screenResolutionWidth / pixelPitch, screenResolutionHeight / pixelPitch);
    }

};
