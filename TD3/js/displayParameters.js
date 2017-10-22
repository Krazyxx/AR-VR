var displayParameters = {

    // parameters for stereo rendering
    // physical screen diagonal -- in mm
    screenDiagonal: 390,//550, //685.8,
    screenResolutionWidth: 1280,// 1920, //2560,
    aspectRatio: 1280 / 960, // 16 / 9,

    // inter pupillar distance -- in mm
    ipd: 64,

    // distance bewteen the viewer and the screen -- in mm
    distanceScreenViewer: 500,

    // amount of distance in mm between adjacent pixels
    pixelPitch: function() {
        var screenResolutionHeight = this.screenResolutionWidth / this.aspectRatio;
        var screenResolutionDiagonal = Math.sqrt(this.screenResolutionWidth * this.screenResolutionWidth + screenResolutionHeight * screenResolutionHeight);
        return this.screenDiagonal / screenResolutionDiagonal;
    },

    // physical display width and height -- in mm
    screenSize: function() {
        var pixelPitch = this.pixelPitch();
        var screenResolutionHeight =  this.screenResolutionWidth / this.aspectRatio;
        return new THREE.Vector2(this.screenResolutionWidth * pixelPitch, screenResolutionHeight * pixelPitch);
    }
};
