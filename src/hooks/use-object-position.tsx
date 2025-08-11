export interface ObjectPosition {
  camera: {
    x: number;
    y: number;
    z: number;
    lookAtX: number;
    lookAtY: number;
    lookAtZ: number;
  };
  syringe: {
    x: number;
    y: number;
    z: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    scale: number;
  };
  lighting: {
    ambientIntensity: number;
    directionalIntensity: number;
    purpleSpotIntensity: number;
    pinkPointIntensity: number;
    whitePointIntensity: number;
    frontLightIntensity: number;
  };
}

export function useObjectPosition(): ObjectPosition {
  return {
    camera: {
      x: 0,
      y: 0,
      z: 40,
      lookAtX: 20,
      lookAtY: 0,
      lookAtZ: 0,
    },
    syringe: {
      x: 60,
      y: 0,
      z: 0,
      rotationX: -Math.PI / 8,
      rotationY: 0,
      rotationZ: Math.PI / 6,
      scale: 2.2,
    },
    lighting: {
      ambientIntensity: 0.8,
      directionalIntensity: 2.0,
      purpleSpotIntensity: 6.0,
      pinkPointIntensity: 4.0,
      whitePointIntensity: 3.0,
      frontLightIntensity: 1.5,
    },
  };
}