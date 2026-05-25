import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { VehicleController, SkidMarkManager } from './VehicleController.js';

export class TPSVehicleSystem {
    constructor(scene, camera, playerGroup, playerInputEnabledCallback) {
        this.scene = scene;
        this.camera = camera;
        this.playerGroup = playerGroup;
        this.setPlayerInput = playerInputEnabledCallback; // Callback to enable/disable player input

        this.world = null;
        this.vehicleController = null;
        this.groundBody = null;

        this.active = false; // Is vehicle mode active?
        this.vehicleMesh = null; // Container for vehicle meshes (chassis + wheels)

        this.cameraOffset = new THREE.Vector3(0, 5, -10);
        this.cameraLookAt = new THREE.Vector3(0, 0, 0);

        this.initPhysics();
        this.initVehicle();
        this.setupInput();

        // SkidMarkManager init (requires scene)
        if (SkidMarkManager && SkidMarkManager.init) {
            SkidMarkManager.init(scene);
        }
    }

    initPhysics() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -10, 0), // Standard earth gravity
        });
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);

        // Static Ground Plane (Infinite) - Matches visual ground at Y=0
        const groundShape = new CANNON.Plane();
        this.groundBody = new CANNON.Body({
            mass: 0, // Static
            type: CANNON.Body.STATIC,
            material: new CANNON.Material({ friction: 0.3, restitution: 0.3 })
        });
        this.groundBody.addShape(groundShape);
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to be horizontal
        this.world.addBody(this.groundBody);
    }

    initVehicle() {
        // Use the base VehicleController (it now has .enabled toggle)
        this.vehicleController = new VehicleController(this.scene, this.world, {
            wheelOffsetFrontZ: -0.2,
            wheelOffsetRearZ: 0.65
        });
        this.vehicleController.init();

        // Hide initially and disable input
        this.vehicleController.enabled = false;
        this.setVisible(false);
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'q') {
                this.toggleMode();
            }
        });
    }

    setVisible(visible) {
        // Hide/Show Chassis
        if (this.vehicleController.chassis) {
            this.vehicleController.chassis.visible = visible;
        }
        // Hide/Show Wheels
        if (this.vehicleController.wheels) {
            this.vehicleController.wheels.forEach(w => w.visible = visible);
        }

        // Hide/Show Skidmarks (Optional)
        if (SkidMarkManager && SkidMarkManager.mesh) {
            SkidMarkManager.mesh.visible = visible;
        }
    }

    toggleMode() {
        this.active = !this.active;

        if (this.active) {
            this.enterVehicleMode();
        } else {
            this.exitVehicleMode();
        }
    }

    enterVehicleMode() {
        console.log("🚗 Entering Vehicle Mode");

        // 1. Spawn Vehicle in front of player
        const spawnDist = 10;
        const pPos = this.playerGroup.position;
        const pRot = this.playerGroup.rotation.y;

        const spawnX = pPos.x + Math.sin(pRot) * spawnDist;
        const spawnZ = pPos.z + Math.cos(pRot) * spawnDist;
        const spawnY = pPos.y + 5; // Drop from sky

        // Reset Physics State
        const body = this.vehicleController.car.chassisBody;
        body.position.set(spawnX, spawnY, spawnZ);
        body.quaternion.setFromEuler(0, pRot, 0);
        body.velocity.set(0, 0, 0);
        body.angularVelocity.set(0, 0, 0);

        // 2. Enable Vehicle Control
        this.vehicleController.enabled = true;
        this.setVisible(true);

        // 3. Disable Player Control
        if (this.setPlayerInput) this.setPlayerInput(false);

        // 4. Hide Player
        this.playerGroup.visible = false;
    }

    exitVehicleMode() {
        console.log("🚶 Exiting Vehicle Mode");

        // 1. Disable Vehicle Control
        this.vehicleController.enabled = false;
        this.setVisible(false);

        // 2. Enable Player Control
        if (this.setPlayerInput) this.setPlayerInput(true);

        // 3. Show Player
        this.playerGroup.visible = true;
    }

    update(dt) {
        if (this.active) {
            this.world.step(1 / 60, dt, 3);

            // Reset if fell off
            if (this.vehicleController.car.chassisBody.position.y < -50) {
                const body = this.vehicleController.car.chassisBody;
                body.position.set(0, 10, 0);
                body.velocity.set(0, 0, 0);
            }
        }
    }

    // Returns the camera target position if in vehicle mode, otherwise null
    getCameraTarget() {
        if (!this.active) return null;
        if (this.vehicleController.car && this.vehicleController.car.chassisBody) {
            return this.vehicleController.car.chassisBody.position;
        }
        return null;
    }

    // Get camera offset for vehicle mode
    getCameraOffset() {
        if (!this.vehicleController.car || !this.vehicleController.car.chassisBody) return null;
        const chassis = this.vehicleController.car.chassisBody;
        return this.cameraOffset.clone().applyQuaternion(chassis.quaternion);
    }
}
