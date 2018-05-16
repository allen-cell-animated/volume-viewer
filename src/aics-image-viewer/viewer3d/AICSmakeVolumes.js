// rasterize a signed distance function into a volume of vx*vy*vz dimensions. 
// f < 0 will be the interior of the volume, and f>=0 will be outside.
const AICSmakeVolumes = {};

AICSmakeVolumes.createVolume = function (vx, vy, vz, sdFunc) {
    var data = new Uint8Array(vx * vy * vz).fill(0);
    var cx = vx / 2;
    var cy = vy / 2;
    var cz = vz / 2;
    var offset, px, py, pz;
    for (var i = 0; i < vz; ++i) {
        for (var j = 0; j < vy; ++j) {
            for (var k = 0; k < vx; ++k) {
                offset = i * (vx * vy) + j * vx + k;
                px = k - cx;
                py = j - cy;
                pz = i - cz;
                if (sdFunc(px, py, pz) < 0) {
                    data[offset] = 255;
                } else {
                    data[offset] = 0;
                }
            }
        }
    }
    return data;
};

AICSmakeVolumes.createSphere = function (vx, vy, vz, radius) {
    return AICSmakeVolumes.createVolume(vx, vy, vz, (px, py, pz) => {
        return Math.sqrt(px * px + py * py + pz * pz) - radius;
    });
};

AICSmakeVolumes.createCylinder = function (vx, vy, vz, hx, hy) {
    var dx, dy, mdx, mdy;
    return AICSmakeVolumes.createVolume(vx, vy, vz, (px, py, pz) => {
        dx = Math.abs(Math.sqrt(px * px + pz * pz)) - hx;
        dy = Math.abs(py) - hy;
        mdx = Math.max(dx, 0.0);
        mdy = Math.max(dy, 0.0);
        return Math.min(Math.max(dx, dy), 0.0) + Math.sqrt(mdx * mdx + mdy * mdy);
    });
};

AICSmakeVolumes.createTorus = function (vx, vy, vz, tx, ty) {
    var qx, qy;
    return AICSmakeVolumes.createVolume(vx, vy, vz, (px, py, pz) => {
        qx = Math.sqrt(px * px + pz * pz) - tx;
        qy = py;
        return Math.sqrt(qx * qx + qy * qy) - ty;
    });
};

// cx, cy must be a 2d normalized pair...?
AICSmakeVolumes.createCone = function (vx, vy, vz, cx, cy) {
    var q;
    return AICSmakeVolumes.createVolume(vx, vy, vz, (px, py, pz) => {
        q = Math.sqrt(px * px + py * py);
        return cx * q + cy * pz;
    });
};


export default AICSmakeVolumes;
