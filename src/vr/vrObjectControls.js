export class vrObjectControls {
    constructor(controller, object) {
        this.controller = controller;
        this.object = object;

        this.triggerDown = this.controller.triggerIsPressed;
    }

    update() {
        if (!this.triggerDown && this.controller.triggerIsPressed) {
            this.VRrotate = true;
            this.VRrotateStart = new THREE.Vector3().copy(this.controller.position);
        }
        if (this.triggerDown && !this.controller.triggerIsPressed) {
            this.VRrotate = false;
        }
        if (this.object && this.VRrotate) {
            // dist from last pose position in x and z.
            var pos = this.controller.position;

            // while still in world space, get a distance measure.
            var v0 = new THREE.Vector3().subVectors(this.VRrotateStart, this.object.position);
            v0 = v0.normalize();
            var v1 = new THREE.Vector3().subVectors(pos, this.object.position);
            v1 = v1.normalize();

            var q = new THREE.Quaternion();
            q.setFromUnitVectors(v0, v1);

            // var mio = new THREE.Matrix4();
            // mio.getInverse(this.object.matrixWorld);

            // v0 = v0.transformDirection(mio);
            // v0 = v0.normalize();
            // v1 = v1.transformDirection(mio);
            // v1 = v1.normalize();

            // var q = new THREE.Quaternion();
            // q.setFromUnitVectors(v0, v1);

            this.object.quaternion.multiply(q);

            this.VRrotateStart.set(pos.x, pos.y, pos.z);
        }
        this.triggerDown = this.controller.triggerIsPressed;
    }

    resetObject() {
        if (this.object) {
            this.object.quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1), 0.0);
        }
    }
};

export default vrObjectControls;
