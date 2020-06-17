class helperCamera {
    constructor(name, cam) {
        this.name = name;
        this.cam = cam;
    }
}
class helperGarbage {
    constructor(oldCamera, currentCamera) {
        this.oldCamera = oldCamera;
        this.currentCamera = currentCamera;
    }
}
class Camera {
    constructor() {
        this.helperCamera = [];
        this.helperGarbage = [];
        this.garbage = [];
        this.collectInterpolationGarbage();
    }
    createCamera(name, position) {
        var camera = this.list.find(element => element.name == name);
        if (camera) {
            if (mp.cameras.exists(camera.cam)) camera.cam.destroy();
            camera.cam = mp.cameras.new(name, position, new mp.Vector3(0, 0, 0), 50);
            camera.name = name;
        } else {
            this.list.push(new helperCamera(name, mp.cameras.new(name, position, new mp.Vector3(0, 0, 0), 50)));
        }
    }
    setCameraActive(name) {
        var camera = this.list.find(element => element.name == name);
        if (camera) {
            if (!mp.cameras.exists(camera.cam)) return false;
            camera.cam.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 0, false, false);
        }
    }
    setCameraEntity(name, entity) {
        if (entity == undefined) return false;
        if (!mp.players.exists(entity)) return false;
        var camera = this.list.find(element => element.name == name);
        if (camera) {
            if (mp.cameras.exists(camera.cam)) camera.cam.pointAt(entity.handle, 0.0, 0.0, 0.0, true);
        }
    }
    setCameraLookAtBone(name, entity, boneIndex) {
        if (entity == undefined) return false;
        var camera = this.list.find(element => element.name == name);
        if (camera)
            if (mp.cameras.exists(camera.cam)) camera.cam.pointAtPedBone(entity, boneIndex, 0, 0, 0, true);
    }
    setCameraPosition(name, position) {
        var camera = this.list.find(element => element.name == name);
        if (camera)
            if (mp.cameras.exists(camera.cam)) camera.cam.setCoord(position.x, position.y, position.z);
    }
    setCameraLookAt(name, position) {
        var camera = this.list.find(element => element.name == name);
        if (camera)
            if (mp.cameras.exists(camera.cam)) camera.cam.pointAtCoord(position.x, position.y, position.z);
    }
    getCameraFov(name) {
        var camera = this.list.find(element => element.name == name);
        if (camera)
            if (mp.cameras.exists(camera.cam)) return camera.cam.getFov();
    }
    setCameraFov(name, fov) {
        var camera = this.list.find(element => element.name == name);
        if (camera)
            if (mp.cameras.exists(camera.cam)) return camera.cam.setFov(fov);
    }
    setCameraInterpolate(name, position, pointAt, duration) {
        var camera = this.list.find(element => element.name == name);
        if (camera) {
            var tempCamera = mp.cameras.new("InterpolateCamera", position, new mp.Vector3(0, 0, 0), camera.cam.getFov());
            tempCamera.pointAtCoord(pointAt.x, pointAt.y, pointAt.z);
            tempCamera.setActiveWithInterp(camera.cam.handle, duration, 0, 0);
            mp.game.cam.renderScriptCams(true, false, 0, false, false);
            this.addInterpolationGargabe(camera.cam, tempCamera);
            camera.cam = tempCamera;
        }
    }
    destroyCamera(name) {
        var camera = this.list.find(element => element.name == name);
        if (camera) {
            this.deleteAllInterpolations();
            if (!mp.cameras.exists(camera.cam)) return false;
            camera.cam.setActive(false);
            camera.cam.destroy();
            mp.game.cam.renderScriptCams(false, false, 0, false, false);
        }
    }
    collectInterpolationGarbage() {
        mp.events.add("render", () => {
            this.garbage.forEach((element) => {
                if (!mp.cameras.exists(element.oldCamera)) return false;
                if (element.oldCamera.isInterpolating()) return false;
                if (mp.cameras.exists(element.oldCamera)) element.oldCamera.destroy();
                var index = this.garbage.findIndex(element => element.currentCamera == element.currentCamera);
                this.garbage.splice(index, 1);
            });
        });
    }
    addInterpolationGargabe(oldCamera, currentCamera) {
        this.garbage.push(new helperGarbage(oldCamera, currentCamera));
    }
    deleteAllInterpolations() {
        this.garbage.forEach((element) => {
            if (!mp.cameras.exists(element.oldCamera)) return false;
            element.oldCamera.destroy();
            var index = this.garbage.findIndex(element => element.currentCamera == element.currentCamera);
            this.garbage.splice(index, 1);
        });
    }
}
module.exports = new Camera();