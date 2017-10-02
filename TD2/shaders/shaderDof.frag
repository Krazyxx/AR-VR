uniform mat4 projectionMatrix2;
uniform mat4 inverseProjectionMatrix;

uniform float focusDistance;
uniform float pupilDiameter;
uniform float pixelPitch;

uniform vec2 gazePos;

uniform sampler2D colorMap;
uniform sampler2D depthMap;
uniform vec2 textureSize;

varying vec2 vUv;

// TODO: distance to camera computation
float distToFrag( float z_buffer ) {
    float z_ndc = 2.0 * z_buffer - 1.0; // On normalize entre [-1,1]
    vec4 view = inverseProjectionMatrix * vec4(1.0, 1.0, z_ndc, 1.0);
    return view.z;
}

// TODO: circle of confusion computation
float computeCoC( float fragDist, float focusDist ) {
    float coc = (17.0 / (focusDist - 17.0)) * pupilDiameter * (abs(fragDist - focusDist) / fragDist);
	return coc / pixelPitch;
}

// TODO: adaptive blur computation
vec4 computeBlur( float radius ) {
    float step_x = 1.0 / textureSize.x;
    float step_y = 1.0 / textureSize.y;
    float nb_step_x = radius / textureSize.x;
    float nb_step_y = radius / textureSize.y;

    vec4 rgb = vec4(0.0,0.0,0.0,0.0);
    float cpt = 0.0;

    float y = -radius;
    for (int tmpi = 0; tmpi <= 100; tmpi++) {
       if (y > radius) { break; }

       float x = -radius;
       for (int tmpj = 0; tmpj <= 100; tmpj++) {
          if (x > radius) { break; }
          if (y < 0.0 || y > 1.0 || x < 0.0 || x > 1.0) { continue ; }
          cpt++;
          rgb += texture2D(colorMap, vec2(vUv.x + x, vUv.y + y));

          x += step_x;
       }
       y += step_y;
    }
    rgb /= cpt;
    return rgb;
}

void main() {
	//gl_FragColor = texture2D( colorMap, vUv );
    float fragDist = distToFrag(gl_FragColor.z);
    float blurRadius = computeCoC(fragDist, focusDistance);
    gl_FragColor = computeBlur(blurRadius);
}
