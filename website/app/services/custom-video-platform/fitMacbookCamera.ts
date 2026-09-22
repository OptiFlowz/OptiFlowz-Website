import type { Vector3 } from "three";
import { ConvexHull } from "three/addons/math/ConvexHull.js";

type CameraFitOptions = {
  /** Vertical field of view in degrees. */
  fov: number;
  cameraHeight: number;
  /** Maximum pointer pitch in radians. */
  maxPitch: number;
  near?: number;
  far?: number;
};

/**
 * Create once after collecting the model's fit points and camera target.
 * Reuse across viewport resizes; this does not mutate the camera or model.
 */
export function createMacbookCameraFitter(
  points: Vector3[],
  target: Vector3,
  { fov, cameraHeight, maxPitch, near = 0.1, far = 1000 }: CameraFitOptions,
) {
  // A perspective frustum is convex. Interior mesh-box corners add no fit
  // constraints, so only the hull vertices need checking at each camera pose.
  let supportPoints = points;
  if (points.length >= 4) {
    const hull = new ConvexHull().setFromPoints(points);
    const vertices = new Set<Vector3>();
    for (const face of hull.faces) {
      let edge = face.edge;
      do {
        vertices.add(edge.head().point);
        edge = edge.next;
      } while (edge !== face.edge);
    }
    if (vertices.size >= 4) supportPoints = [...vertices];
  }

  const centered = new Float64Array(supportPoints.length * 3);
  supportPoints.forEach((point, index) => {
    centered[index * 3] = point.x - target.x;
    centered[index * 3 + 1] = point.y - target.y;
    centered[index * 3 + 2] = point.z - target.z;
  });
  const yawCache = new Map<number, Float64Array>();
  const verticalTangent = Math.tan(fov * Math.PI / 360);
  const heightOffset = cameraHeight - target.y;
  const pitchSines = [Math.sin(-maxPitch), Math.sin(maxPitch)];

  function pointsAtYaw(yaw: number) {
    const cached = yawCache.get(yaw);
    if (cached) return cached;
    const cosine = Math.cos(yaw);
    const sine = Math.sin(yaw);
    const rotated = new Float64Array(centered.length);
    for (let index = 0; index < centered.length; index += 3) {
      const x = centered[index];
      const z = centered[index + 2];
      rotated[index] = x * cosine - z * sine;
      rotated[index + 1] = centered[index + 1];
      rotated[index + 2] = x * sine + z * cosine;
    }
    yawCache.set(yaw, rotated);
    return rotated;
  }

  function findDistance(yaws: readonly number[], horizontalLimit: number, aspect: number) {
    const poses = yaws.map(pointsAtYaw);
    const horizontalTangent = horizontalLimit * verticalTangent * aspect;
    const verticalLimit = 0.92 * verticalTangent;

    function fits(distance: number) {
      for (const pose of poses) {
        for (const pitchSine of pitchSines) {
          const height = heightOffset + pitchSine * distance;
          const lengthSquared = distance * distance + height * height;
          const length = Math.sqrt(lengthSquared);
          const nearDepth = near * length;
          const farDepth = far * length;
          for (let index = 0; index < pose.length; index += 3) {
            const x = pose[index];
            const y = pose[index + 1];
            const z = pose[index + 2];
            // Exact camera-space projection for the existing lookAt pose:
            // eye = target + (sin(yaw)*d, heightOffset + sin(pitch)*d, cos(yaw)*d).
            // Multiplying through by positive depth avoids two matrix products
            // and perspective divisions for every point and binary-search step.
            const depth = lengthSquared - distance * z - height * y;
            if (depth < nearDepth || depth > farDepth
              || Math.abs(x) * length > horizontalTangent * depth
              || Math.abs(distance * y - height * z) > verticalLimit * depth) return false;
          }
        }
      }
      return true;
    }

    // Preserve the original bracket and precision, including its rounding.
    let minimum = 8;
    let maximum = 24;
    while (!fits(maximum) && maximum < 600) maximum *= 1.5;
    for (let step = 0; step < 16; step++) {
      const distance = (minimum + maximum) / 2;
      if (fits(distance)) maximum = distance;
      else minimum = distance;
    }
    return maximum;
  }

  return { findDistance };
}
