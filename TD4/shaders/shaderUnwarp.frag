uniform sampler2D colorMap;

// center of lens for un-distortion (in normalized coordinates between 0 and 1)
uniform vec2 centerCoordinate;

// lens distortion parameters
uniform vec2 K;

// texture coordinates
varying vec2 vUv;

void main() {
	float xd = vUv[0];
	float yd = vUv[1];

	float xc = centerCoordinate[0];
	float yc = centerCoordinate[1];

	float K1 = K[0];
	float K2 = K[1];

	float r = sqrt((xd - xc) * (xd - xc) + (yd - yc) * (yd - yc));

	float xu = xc + (xd - xc)/(1.0 + K1*r*r + K2*r*r*r*r);
	float yu = yc + (yd - yc)/(1.0 + K1*r*r + K2*r*r*r*r);

	if (0.0 < xu && xu < 1.0 && 0.0 < yu && yu < 1.0) {
		gl_FragColor = texture2D(colorMap, vec2(xu, yu));
	} else {
		gl_FragColor = vec4(0, 0, 0, 1.0);
	}
	//gl_FragColor = texture2D(colorMap, vUv);
}
