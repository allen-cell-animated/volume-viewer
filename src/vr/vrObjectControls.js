export class vrObjectControls {
    constructor(controller, object) {
        this.controller = controller;
        this.object = object;

        this.triggerDown = this.controller.getButtonState('trigger');
    }

    update() {
        // const gp = this.controller.getGamepad();
        // if (gp) {
        //     console.log(gp.axes);
        // }
        const isTriggerDown = this.controller.getButtonState('trigger');
        if (!this.triggerDown && isTriggerDown) {
            this.VRrotate = true;
            this.VRrotateStartPos = new THREE.Vector3().setFromMatrixPosition(this.controller.matrix);
        }
        if (this.triggerDown && !isTriggerDown) {
            this.VRrotate = false;
        }
        if (this.object && this.VRrotate) {
            // dist from last pose position in x and z.
            var pos = new THREE.Vector3().setFromMatrixPosition(this.controller.matrix);

            var origin = this.object.position;

            var v0 = new THREE.Vector3().subVectors(this.VRrotateStartPos, origin);
            v0 = v0.normalize();
            var v1 = new THREE.Vector3().subVectors(pos, origin);
            v1 = v1.normalize();

            var mio = new THREE.Matrix4();
            mio.getInverse(this.object.matrixWorld);

            v0 = v0.transformDirection(mio);
            v0 = v0.normalize();
            v1 = v1.transformDirection(mio);
            v1 = v1.normalize();

            var q = new THREE.Quaternion();
            q.setFromUnitVectors(v0, v1);

            this.object.quaternion.multiply(q);

            this.VRrotateStartPos.set(pos.x, pos.y, pos.z);
        }
        this.triggerDown = isTriggerDown;
    }

    resetObject() {
        if (this.object) {
            this.object.quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1), 0.0);
        }
    }
};

export default vrObjectControls;
