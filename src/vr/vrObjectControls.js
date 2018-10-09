export class vrObjectControls {
    constructor(controller1, controller2, object) {
        this.controller1 = controller1;
        this.controller2 = controller2;
        this.object = object;

        this.trigger1Down = this.controller1.getButtonState('trigger');
        this.trigger2Down = this.controller2.getButtonState('trigger');

    }

    update() {
        const isTrigger1Down = this.controller1.getButtonState('trigger');
        const isTrigger2Down = this.controller2.getButtonState('trigger');
        const rotating = (isTrigger1Down && !isTrigger2Down) || (isTrigger2Down && !isTrigger1Down);
        const theController = isTrigger1Down ? this.controller1 : this.controller2;
        const zooming = isTrigger1Down && isTrigger2Down;

        if (rotating) {
            if ((!this.trigger1Down && isTrigger1Down) || (!this.trigger2Down && isTrigger2Down)) {
                this.VRrotate = true;
                this.VRrotateStartPos = new THREE.Vector3().setFromMatrixPosition(theController.matrix);
            }
        }
        if ((this.trigger1Down && !isTrigger1Down) || (this.trigger2Down && !isTrigger2Down))  {
            this.VRrotate = false;
        }    
        if (this.object && zooming) {
            this.VRzoom = true;
            const p1 = new THREE.Vector3().setFromMatrixPosition(this.controller1.matrix);
            const p2 = new THREE.Vector3().setFromMatrixPosition(this.controller2.matrix);
            const dist = p1.distanceTo(p2);
            if (!this.wasZooming) {
                this.VRzoomStart = 0;
                this.VRzoomdist = dist;
            }

            let zoomFactor = dist / this.VRzoomdist;

            const ZOOM_MAX = 2.0;
            const ZOOM_MIN = 0.25;
            this.object.scale.x = Math.min(ZOOM_MAX, Math.max( this.object.scale.x*zoomFactor, ZOOM_MIN));
            this.object.scale.y = Math.min(ZOOM_MAX, Math.max( this.object.scale.y*zoomFactor, ZOOM_MIN));
            this.object.scale.z = Math.min(ZOOM_MAX, Math.max( this.object.scale.z*zoomFactor, ZOOM_MIN));
        }
        else {
            this.VRzoom = false;
        }
        if (this.object && this.VRrotate) {
            // dist from last pose position in x and z.
            var pos = new THREE.Vector3().setFromMatrixPosition(theController.matrix);

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
        this.trigger1Down = isTrigger1Down;
        this.trigger2Down = isTrigger2Down;
        this.wasZooming = zooming;
    }

    resetObject() {
        if (this.object) {
            this.object.quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1), 0.0);
        }
    }
};

export default vrObjectControls;
