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
    float z_view = projectionMatrix2[3][2] / (z_ndc + projectionMatrix2[2][2]);
    return z_view;
}

// TODO: circle of confusion computation
float computeCoC( float fragDist, float focusDist ) {
    float M = 17.0 / (focusDist - 17.0);
    float coc = M * pupilDiameter * (abs(fragDist - focusDist) / fragDist);
	return coc / pixelPitch;
}

// TODO: adaptive blur computation
vec4 computeBlur( float radius ) {
    int radius_pixels = int(radius / pixelPitch);
    vec4 color = vec4(0);
    int cpt = 0;

    int i = -radius_pixels;
    for (int loop1 = 0; loop1 <= 30; loop1++) {
       if (i > radius_pixels) { break; }

       int j = -radius_pixels;
       for (int loop2 = 0; loop2 <= 30; loop2++) {
          if (j > radius_pixels) { break; }

          if (i*i + j*j <= radius_pixels*radius_pixels) {
              vec2 coorUv = vUv + vec2(float(i), float(j)) / textureSize;
              color.rgb += texture2D(colorMap, coorUv).rgb;
              cpt++;
          }
          j++;
       }
       i++;
    }

    color.rgb /= float(cpt);
    return color;
}

void main() {
    float fragDist = distToFrag(texture2D(depthMap, vUv).r);
    float blurRadius = computeCoC(fragDist, focusDistance);

    //gl_FragColor = vec4(fragDist/1000.0, 0.0, 0.0, 1.0);
    //gl_FragColor = vec4(blurRadius * pixelPitch, 0.0, 0.0, 1.0);
    gl_FragColor = computeBlur(blurRadius);
}
