import * as THREE from "three";

const AUTHORED_OPENING_DEGREES = 109.90801211958671;
const OPENING_DEGREES = 100;
const UPRIGHT_OPENING_DEGREES = 90;
const CLOSED_OPENING_DEGREES = 0;

/**
 * Prepare appleyss's actual 14-inch MacBook Pro, retaining its detailed geometry/maps.
 * The raw chassis measures 31.45 × 22.03 cm; its 27.47 cm keyboard occupies 87.3%
 * of that width. These are the original 14-inch proportions, not a scaled 16-inch.
 *
 * The source's two outer coordinate conversions cancel to a 0.01 unit scale.
 * Extracting their child gives centimetres, Y up and the front facing +Z.
 */
export function prepareMacbook14(source: THREE.Object3D): {
  model: THREE.Group;
  hinge: THREE.Group;
  screen: THREE.Mesh;
  openHingeAngle: number;
  uprightHingeAngle: number;
  closedHingeAngle: number;
  flipY: boolean;
} {
  const rawModel = source.getObjectByName("tracking_node_placeholder");
  const lid = source.getObjectByName("tRoQVfCRKIxkvRe");
  const base = source.getObjectByName("vJAkPjXsAjvkmIf");
  const screen = source.getObjectByName("YiWuQCuMkJrzWVL");
  if (!rawModel || !lid || !base || !(screen instanceof THREE.Mesh)) {
    throw new Error("The 14-inch MacBook asset is missing its body, lid or display.");
  }

  rawModel.removeFromParent();
  rawModel.updateMatrixWorld(true);
  const bodyBounds = new THREE.Box3().setFromObject(base);
  const bodySize = bodyBounds.getSize(new THREE.Vector3());
  const bodyCenter = bodyBounds.getCenter(new THREE.Vector3());
  const scale = 10 / bodySize.x;

  // Fit to the circular fixed hinge axle in vQDYksryGvORsKb. Rotating the lid
  // fully closed puts its display at Y=0.0508 cm, above the keys at 0.0252 cm.
  // Using the shell's bounding-box corner would make the screen cut into them.
  const hinge = new THREE.Group();
  hinge.name = "MacBook14LidHinge";
  hinge.position.set(0, -0.42048042840559474, -11.326999408368877);
  rawModel.add(hinge);
  rawModel.updateMatrixWorld(true);
  hinge.attach(lid);

  const openHingeAngle = THREE.MathUtils.degToRad(
    AUTHORED_OPENING_DEGREES - OPENING_DEGREES,
  );
  const uprightHingeAngle = THREE.MathUtils.degToRad(
    AUTHORED_OPENING_DEGREES - UPRIGHT_OPENING_DEGREES,
  );
  const closedHingeAngle = THREE.MathUtils.degToRad(
    AUTHORED_OPENING_DEGREES - CLOSED_OPENING_DEGREES,
  );
  hinge.rotation.x = openHingeAngle;

  rawModel.scale.setScalar(scale);
  rawModel.position.set(-bodyCenter.x * scale, -bodyBounds.min.y * scale, 0);
  const model = new THREE.Group();
  model.name = "MacBookPro14";
  model.add(rawModel);
  model.updateMatrixWorld(true);

  // Keep the ABS keyboard dark at the grazing viewing angle. Its original
  // dielectric reflections otherwise turn the black keys grey in the studio.
  const replacements = new Map<THREE.Material, THREE.Material>();
  const finishMaterial = (material: THREE.Material): THREE.Material => {
    if (!(material instanceof THREE.MeshStandardMaterial)) return material;
    if (replacements.has(material)) return replacements.get(material)!;
    const keycaps = material.name === "YucMHaShviXFrcl";
    const keyboardWell = material.name === "PsYmkIyfPbYVudA";
    if (keycaps || keyboardWell) {
      const finish = new THREE.MeshPhysicalMaterial({
        name: material.name,
        color: new THREE.Color().setRGB(...(keycaps ? [0.0035, 0.0038, 0.0042] : [0.002, 0.0022, 0.0025]) as [number, number, number]),
        map: material.map,
        normalMap: material.normalMap,
        normalMapType: material.normalMapType,
        normalScale: material.normalScale.clone(),
        roughnessMap: material.roughnessMap,
        aoMap: material.aoMap,
        aoMapIntensity: material.aoMapIntensity,
        alphaMap: material.alphaMap,
        side: material.side,
        transparent: material.transparent,
        opacity: material.opacity,
        metalness: 0,
        roughness: keycaps ? 0.82 : 0.94,
        specularIntensity: keycaps ? 0.22 : 0.15,
      });
      replacements.set(material, finish);
      return finish;
    }
    // OHboFzwQQTqraew is the front glass around the display, including the
    // notch. Its authored metalness .8 / roughness .1 turns the studio light
    // into a silver reflection head-on. Keep a faint dielectric glint over
    // the black backing; the display and aluminium perimeter use other materials.
    if (material.name === "BuKNPlQuYneaTQO") {
      const glass = new THREE.MeshPhysicalMaterial({
        name: material.name,
        color: new THREE.Color().setRGB(0.0006, 0.0007, 0.0009),
        map: material.map,
        normalMap: material.normalMap,
        normalMapType: material.normalMapType,
        normalScale: material.normalScale.clone(),
        alphaMap: material.alphaMap,
        side: material.side,
        transparent: material.transparent,
        opacity: material.opacity,
        metalness: 0,
        roughness: 0.48,
        ior: 1.45,
        // Keep reflections restrained so the backing stays black head-on.
        specularIntensity: 0.012,
      });
      replacements.set(material, glass);
      return glass;
    }
    // These materials belong only to the 2.8 mm webcam ring and its 0.8 mm
    // lens inside the notch (nhYJliRYhaClTje / IYvPJqELfeoInOY). The authored
    // ring is pure white, which reads as a light rather than a recessed camera.
    if (material.name === "WUyVPFlwIiHdQrd") {
      material.color.setRGB(0.006, 0.007, 0.009);
      material.metalness = 0;
      material.roughness = 0.8;
      return material;
    }
    if (material.name === "McbgKGZzzdlgTqk") {
      material.color.setRGB(0.003, 0.006, 0.011);
      material.metalness = 0;
      material.roughness = 0.24;
      return material;
    }
    // Space Black anodized aluminium. Keep its metallic response and normal
    // maps, with a subtly brighter machined edge to describe the thin chassis.
    // Connector contacts, lettering and the black display assembly stay distinct.
    if (["pyxByBhgryqTziz", "gPVMcKJcwynpvtE"].includes(material.name)) {
      material.color.setRGB(0.028, 0.03, 0.034);
      material.metalness = 1;
      material.roughness = 0.48;
    } else if (material.name === "HylIYANqfZjsTVY") {
      material.color.setRGB(0.022, 0.024, 0.028);
      material.metalness = 1;
      material.roughness = 0.5;
    } else if (material.name === "FoqWjdWmOdsVSRo") {
      material.color.setRGB(0.038, 0.041, 0.046);
      material.metalness = 1;
      material.roughness = 0.34;
    } else if (material.name === "lNjtuzBkCkROeMF") {
      material.color.setRGB(0.022, 0.024, 0.028);
      material.metalness = 1;
      material.roughness = 0.56;
    } else if (material.name === "DtSnZKlYodVKhfH") {
      // Exposed hinge metal and port rims were pure silver in the source asset.
      material.color.setRGB(0.032, 0.035, 0.04);
      material.metalness = 1;
      material.roughness = 0.42;
    } else if (material.name === "IZBMZmnNPrEisGk") {
      material.color.setRGB(0.021, 0.023, 0.027);
      material.metalness = 1;
      material.roughness = 0.52;
    }
    return material;
  };
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = Array.isArray(child.material)
        ? child.material.map(finishMaterial)
        : finishMaterial(child.material);
    }
  });

  // The chin below the glass shares its original material with a side port.
  // Replace only this mesh so the port and thin aluminium rim keep their finish.
  const chin = model.getObjectByName("QWbGSlMXFFjjYaK");
  if (chin instanceof THREE.Mesh && chin.material instanceof THREE.MeshStandardMaterial) {
    const original = chin.material;
    chin.material = new THREE.MeshPhysicalMaterial({
      name: `${original.name}_DisplayChin`,
      color: new THREE.Color().setRGB(0.001, 0.0012, 0.0015),
      map: original.map,
      normalMap: original.normalMap,
      normalMapType: original.normalMapType,
      normalScale: original.normalScale.clone(),
      alphaMap: original.alphaMap,
      side: original.side,
      transparent: original.transparent,
      opacity: original.opacity,
      metalness: 0,
      roughness: 0.78,
      ior: 1.45,
      specularIntensity: 0.025,
    });
  }

  // Authored display UVs rise from the bottom edge to the top edge.
  return { model, hinge, screen, openHingeAngle, uprightHingeAngle, closedHingeAngle, flipY: true };
}
