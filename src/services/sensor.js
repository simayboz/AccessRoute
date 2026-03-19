export function degreeToSlopePercent(degree) {
  const radian = (degree * Math.PI) / 180;
  return Math.round(Math.tan(radian) * 100);
}

export function classifySlope(slopePercent, limitPercent = 8) {
  if (slopePercent == null || Number.isNaN(slopePercent)) {
    return "bilinmiyor";
  }
  return slopePercent > limitPercent ? "riskli" : "guvenli";
}

export function getProfileSlopeLimit(profile) {
  if (profile === "bedensel") {
    return 8;
  }
  if (profile === "gorme") {
    return 10;
  }
  return 8;
}

export async function readSlopeFromDevice() {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
    throw new Error("Cihaz bu sensori desteklemiyor.");
  }

  const iOSNeedsPermission =
    typeof DeviceOrientationEvent.requestPermission === "function";

  if (iOSNeedsPermission) {
    const permission = await DeviceOrientationEvent.requestPermission();
    if (permission !== "granted") {
      const error = new Error("Hareket sensori izni reddedildi.");
      error.code = "MOTION_PERMISSION_DENIED";
      throw error;
    }
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      window.removeEventListener("deviceorientation", onOrientation);
      reject(new Error("Sensor verisi zaman asimina ugradi."));
    }, 4000);

    function onOrientation(event) {
      const beta = event.beta;
      if (beta == null) {
        return;
      }

      window.removeEventListener("deviceorientation", onOrientation);
      clearTimeout(timeout);

      const slopeDegree = Number(Math.abs(beta).toFixed(1));
      const slopePercent = Number(degreeToSlopePercent(slopeDegree).toFixed(1));

      resolve({
        slopeDegree,
        slopePercent
      });
    }

    window.addEventListener("deviceorientation", onOrientation, { once: true });
  });
}
