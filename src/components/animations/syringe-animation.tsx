import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useObjectPosition } from '../../hooks/use-object-position';

export default function SyringeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const position = useObjectPosition();
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    plungerGroup?: THREE.Group;
    liquid?: THREE.Mesh;
    syringeGroup?: THREE.Group;
    animationId?: number;
  }>({});

  useEffect(() => {
    if (!mountRef.current) return;

    const { current: mount } = mountRef;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(position.camera.x, position.camera.y, position.camera.z);
    camera.lookAt(position.camera.lookAtX, position.camera.lookAtY, position.camera.lookAtZ);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, position.lighting.ambientIntensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, position.lighting.directionalIntensity);
    directionalLight.position.set(20, 20, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const purpleSpotLight = new THREE.SpotLight(0xa855f7, position.lighting.purpleSpotIntensity, 100, Math.PI / 3, 0.1);
    purpleSpotLight.position.set(15, 15, 20);
    purpleSpotLight.target.position.set(20, 0, 0);
    scene.add(purpleSpotLight);
    scene.add(purpleSpotLight.target);

    const pinkPointLight = new THREE.PointLight(0xec4899, position.lighting.pinkPointIntensity, 100);
    pinkPointLight.position.set(25, -10, 15);
    scene.add(pinkPointLight);

    const whitePointLight = new THREE.PointLight(0xffffff, position.lighting.whitePointIntensity, 100);
    whitePointLight.position.set(15, 25, 10);
    scene.add(whitePointLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, position.lighting.frontLightIntensity);
    frontLight.position.set(0, 0, 30);
    scene.add(frontLight);

    const createSyringe = () => {
      const syringeGroup = new THREE.Group();

      const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        roughness: 0,
        metalness: 0.1,
        envMapIntensity: 1
      });

      const plasticMaterial = new THREE.MeshStandardMaterial({
        color: 0x6a6a6a,
        roughness: 0.3,
        metalness: 0.1
      });

      const rubberMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a4a4a,
        roughness: 0.7,
        metalness: 0.0
      });

      const liquidMaterial = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        roughness: 0.05,
        metalness: 0.1,
        emissive: 0xa855f7,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
      });

      const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 1.0
      });

      const barrelGeometry = new THREE.CylinderGeometry(1.5, 1.5, 15, 32);
      const barrel = new THREE.Mesh(barrelGeometry, glassMaterial);
      barrel.castShadow = true;
      barrel.receiveShadow = true;
      syringeGroup.add(barrel);

      const flangeGeometry = new THREE.CylinderGeometry(2.2, 2.2, 0.5, 32);
      const flange = new THREE.Mesh(flangeGeometry, plasticMaterial);
      flange.position.y = 7.25;
      flange.castShadow = true;
      flange.receiveShadow = true;
      syringeGroup.add(flange);

      const plungerGroup = new THREE.Group();

      const stemGeometry = new THREE.CylinderGeometry(0.3, 0.3, 15, 16);
      const stem = new THREE.Mesh(stemGeometry, plasticMaterial);
      stem.castShadow = true;
      stem.receiveShadow = true;
      plungerGroup.add(stem);

      const thumbPressGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
      const thumbPress = new THREE.Mesh(thumbPressGeometry, plasticMaterial);
      thumbPress.position.y = 7.5;
      thumbPress.castShadow = true;
      thumbPress.receiveShadow = true;
      plungerGroup.add(thumbPress);

      const stopperGeometry = new THREE.CylinderGeometry(1.4, 1.4, 1.2, 32);
      const stopper = new THREE.Mesh(stopperGeometry, rubberMaterial);
      stopper.position.y = -7.5;
      stopper.castShadow = true;
      stopper.receiveShadow = true;
      plungerGroup.add(stopper);

      syringeGroup.add(plungerGroup);

      const liquidGeometry = new THREE.CylinderGeometry(1.35, 1.35, 8, 32);
      const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
      liquid.castShadow = true;
      liquid.receiveShadow = true;
      syringeGroup.add(liquid);

      const needleGroup = new THREE.Group();

      const hubGeometry = new THREE.CylinderGeometry(0.6, 1.5, 1.5, 32);
      const hub = new THREE.Mesh(hubGeometry, plasticMaterial);
      hub.castShadow = true;
      hub.receiveShadow = true;
      needleGroup.add(hub);

      const needleGeometry = new THREE.CylinderGeometry(0.12, 0.12, 6, 16);
      const needle = new THREE.Mesh(needleGeometry, metalMaterial);
      needle.position.y = -3.75;
      needle.castShadow = true;
      needle.receiveShadow = true;
      needleGroup.add(needle);

      needleGroup.position.y = -8.25;
      syringeGroup.add(needleGroup);

      sceneRef.current.plungerGroup = plungerGroup;
      sceneRef.current.liquid = liquid;
      sceneRef.current.syringeGroup = syringeGroup;

      return syringeGroup;
    };

    const syringe = createSyringe();
    scene.add(syringe);

    syringe.position.set(position.syringe.x, position.syringe.y, position.syringe.z);
    syringe.rotation.x = position.syringe.rotationX;
    syringe.rotation.y = position.syringe.rotationY;
    syringe.rotation.z = position.syringe.rotationZ;
    syringe.scale.setScalar(position.syringe.scale);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      sceneRef.current.animationId = animationId;

      const time = Date.now() * 0.0004;

      if (sceneRef.current.plungerGroup && sceneRef.current.liquid) {
        const plungerPosition = Math.sin(time) * 1.0 + 1.5;
        sceneRef.current.plungerGroup.position.y = plungerPosition;

        const stopperInfo = sceneRef.current.plungerGroup.children[2] as THREE.Mesh;
        const stopperBottomY = plungerPosition + stopperInfo.position.y - ((stopperInfo.geometry as THREE.CylinderGeometry).parameters.height / 2);
        const barrelBottomY = -7.5;

        const newLiquidHeight = Math.max(0, stopperBottomY - barrelBottomY);

        sceneRef.current.liquid.scale.y = newLiquidHeight / 8;
        sceneRef.current.liquid.position.y = barrelBottomY + (newLiquidHeight / 2);
      }

      if (sceneRef.current.syringeGroup) {
        if (isHovered) {
          sceneRef.current.syringeGroup.rotation.y += 0.008;
        } else {
          sceneRef.current.syringeGroup.rotation.y += 0.003;
        }
      }

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    sceneRef.current = { scene, camera, renderer, animationId: 0 };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isHovered]);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
}
