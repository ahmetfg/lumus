import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// ============= SKID MARK MANAGER =============
export const SkidMarkManager = {
    maxMarks: 500,
    currentIdx: 0,
    activeMarks: [],
    mesh: null,
    dummy: null,
    scene: null,

    init: function (scene) {
        this.scene = scene;

        // Temel Geometri (1x1 Plane)
        const geometry = new THREE.PlaneGeometry(1, 1);

        // Materyal
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        // Instanced Mesh
        this.mesh = new THREE.InstancedMesh(geometry, material, this.maxMarks);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.mesh.frustumCulled = false;

        // Başlangıçta hepsini gizle
        const dummy = new THREE.Object3D();
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        for (let i = 0; i < this.maxMarks; i++) {
            this.mesh.setMatrixAt(i, dummy.matrix);
            this.mesh.setColorAt(i, new THREE.Color(0xeeeeee));
        }

        this.mesh.instanceMatrix.needsUpdate = true;
        if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;

        this.scene.add(this.mesh);

        this.dummy = new THREE.Object3D();
        this.activeMarks = [];
    },

    addSegment: function (p1, p2) {
        if (!this.mesh) return;
        const dist = p1.distanceTo(p2);
        if (dist < 0.1) return;

        const idx = this.currentIdx;
        this.currentIdx = (this.currentIdx + 1) % this.maxMarks;

        const center = p1.clone().add(p2).multiplyScalar(0.5);

        this.dummy.position.copy(center);
        this.dummy.lookAt(p2);

        const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
        const angle = Math.atan2(direction.x, direction.z);

        this.dummy.rotation.set(-Math.PI / 2, 0, angle);
        this.dummy.scale.set(0.3, dist, 1);

        this.dummy.updateMatrix();

        this.mesh.setMatrixAt(idx, this.dummy.matrix);
        this.mesh.instanceMatrix.needsUpdate = true;

        const existing = this.activeMarks.find(m => m.index === idx);
        if (existing) {
            existing.life = 1.0;
            existing.matrix = this.dummy.matrix.clone();
            existing.initialScale = new THREE.Vector3(0.3, dist, 1);
        } else {
            this.activeMarks.push({
                index: idx,
                life: 1.0,
                matrix: this.dummy.matrix.clone(),
                initialScale: new THREE.Vector3(0.3, dist, 1)
            });
        }
    },

    update: function () {
        if (!this.mesh) return;
        let needsUpdate = false;

        for (let i = this.activeMarks.length - 1; i >= 0; i--) {
            const m = this.activeMarks[i];
            m.life -= 0.015;

            if (m.life <= 0) {
                this.dummy.scale.set(0, 0, 0);
                this.dummy.updateMatrix();
                this.mesh.setMatrixAt(m.index, this.dummy.matrix);
                needsUpdate = true;
                this.activeMarks.splice(i, 1);
            } else {
                const mat = m.matrix;
                this.dummy.matrix.copy(mat);
                this.dummy.matrix.decompose(this.dummy.position, this.dummy.quaternion, this.dummy.scale);

                this.dummy.scale.set(
                    m.initialScale.x * m.life,
                    m.initialScale.y,
                    1
                );
                this.dummy.updateMatrix();

                this.mesh.setMatrixAt(m.index, this.dummy.matrix);
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            this.mesh.instanceMatrix.needsUpdate = true;
        }
    }
};

// ============= VEHICLE CONTROLLER CLASS =============
export class VehicleController {
    constructor(scene, world, options = {}) {
        this.scene = scene;
        this.world = world;
        this.car = {};
        this.chassis = {};
        this.wheels = [];

        // Options with defaults
        this.chassisModelPos = options.chassisModelPos || { x: 0, y: -1.17, z: 0 };
        this.chassisModelRot = options.chassisModelRot || { x: 0, y: 0, z: 0 };
        this.wheelOffsetFrontZ = options.wheelOffsetFrontZ !== undefined ? options.wheelOffsetFrontZ : 0;
        this.wheelOffsetRearZ = options.wheelOffsetRearZ !== undefined ? options.wheelOffsetRearZ : 1;
        this.mass = options.mass || 150;
        this.currentSteer = 0;

        this.enabled = true; // For toggling input
        this.keys = [];      // For tracking keys

        this.params = {
            maxForce: 2000,
            maxSteer: 0.5,
            gripMinSpeed_Rear: 2,
            gripMinSpeed_Front: 3,
            gripMaxSpeed_Rear: 0.5,
            gripMaxSpeed_Front: 1.3,
            rearGrip: 5,
            frontGrip: 10,
            ...options.params
        };
    }

    init() {
        this.setupGUI();
        this.loadModels();
        this.setChassis();
        this.setWheels();
        this.controls();
        this.world.addEventListener('postStep', () => this.updateVisuals());
    }

    setupGUI() {
        if (typeof dat === 'undefined') return;

        const gui = new dat.GUI({ width: 300 });
        gui.domElement.parentNode.style.zIndex = '9999';

        const folder = gui.addFolder('Car Physics');
        folder.open();

        folder.add(this.params, 'maxForce', 1000, 8000).name('Power');
        folder.add(this.params, 'maxSteer', 0.1, 1.0).step(0.05).name('Steering');

        const gripSettings = folder.addFolder('Grip Settings');
        gripSettings.open();

        gripSettings.add(this.params, 'gripMinSpeed_Rear', 1, 20).name('Low Speed Rear');
        gripSettings.add(this.params, 'gripMinSpeed_Front', 1, 20).name('Low Speed Front');
        gripSettings.add(this.params, 'gripMaxSpeed_Rear', 0.1, 10).name('High Speed Rear');
        gripSettings.add(this.params, 'gripMaxSpeed_Front', 0.1, 10).name('High Speed Front');

        const visualFolder = gui.addFolder('Visual Offset');
        visualFolder.add(this.chassisModelPos, 'x', -2, 2).name('Chassis X');
        visualFolder.add(this.chassisModelPos, 'y', -2, 2).name('Chassis Y');
        visualFolder.add(this.chassisModelPos, 'z', -2, 2).name('Chassis Z');
        visualFolder.add(this.chassisModelRot, 'x', 0, 6.28).name('Rot X');
        visualFolder.add(this.chassisModelRot, 'y', 0, 6.28).name('Rot Y');
        visualFolder.add(this.chassisModelRot, 'z', 0, 6.28).name('Rot Z');

        visualFolder.add(this, 'wheelOffsetFrontZ', -3, 3).name('Front Wheel Z');
        visualFolder.add(this, 'wheelOffsetRearZ', -3, 3).name('Rear Wheel Z');

        visualFolder.open();

        const debugFolder = gui.addFolder('Debug');
        const debugParams = { showColliders: false };
        debugFolder.add(debugParams, 'showColliders').name('Show Road Colliders').onChange((val) => {
            if (typeof window.RoadManager !== 'undefined' && window.RoadManager.segments) {
                window.RoadManager.segments.forEach(seg => {
                    if (seg.mesh && seg.mesh.material) {
                        seg.mesh.material.wireframe = val;
                    }
                });
            }
        });

        folder.add(this.params, 'rearGrip').name('Current Rear').listen();
        folder.add(this.params, 'frontGrip').name('Current Front').listen();
    }

    loadModels() {
        this.chassis = new THREE.Group();
        this.scene.add(this.chassis);

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        const fallbackGeo = new THREE.BoxGeometry(1.8, 0.8, 3.6);
        const fallbackMat = new THREE.MeshToonMaterial({ color: 0xFF55BB });
        this.fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
        this.fallbackMesh.castShadow = true;
        this.chassis.add(this.fallbackMesh);

        loader.load('carOne.glb', (gltf) => {
            console.log("🚗 Car Loaded!");
            if (this.fallbackMesh) {
                this.chassis.remove(this.fallbackMesh);
                this.fallbackMesh.geometry.dispose();
                this.fallbackMesh = null;
            }

            const model = gltf.scene;
            model.traverse(c => {
                if (c.isMesh) {
                    c.castShadow = true;
                    c.receiveShadow = true;
                }
            });

            model.scale.set(5, 5, 5);
            this.chassisModel = model;
            this.chassis.add(model);
        });

        this.wheels = [];
        const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 24);
        wheelGeo.rotateZ(Math.PI / 2);
        const wheelMat = new THREE.MeshToonMaterial({ color: 0x333333 });

        for (let i = 0; i < 4; i++) {
            const wheelGroup = new THREE.Group();
            const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat);
            wheelMesh.castShadow = true;
            wheelGroup.add(wheelMesh);

            this.scene.add(wheelGroup);
            this.wheels[i] = wheelGroup;
        }

        loader.load('steerOne.glb', (gltf) => {
            console.log("🛞 Wheel Model Loaded!");
            const wheelTemplate = gltf.scene;

            for (let i = 0; i < 4; i++) {
                const group = this.wheels[i];

                while (group.children.length > 0) {
                    const child = group.children[0];
                    group.remove(child);
                    if (child.geometry) child.geometry.dispose();
                }

                const wheelModel = wheelTemplate.clone();
                wheelModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                wheelModel.scale.set(5, 5, 5);

                // Sağ taraf (0 ve 2) yerine Sol taraftaki (1 ve 3) tekerlekleri çevirerek jantların dışa bakmasını sağla
                if (i === 1 || i === 3) {
                    wheelModel.rotation.y = Math.PI;
                }

                group.add(wheelModel);
            }
        });
    }

    setChassis() {
        const chassisShape = new CANNON.Box(new CANNON.Vec3(0.9, 0.4, 1.8));
        const chassisBody = new CANNON.Body({
            mass: this.mass,
            material: new CANNON.Material({ friction: 0 }),
            angularDamping: 0.3,
            linearDamping: 0.01
        });
        chassisBody.addShape(chassisShape, new CANNON.Vec3(0, 0.8, 0));

        chassisBody.position.set(0, 4, 0);

        this.car = new CANNON.RaycastVehicle({
            chassisBody,
            indexRightAxis: 0,
            indexUpAxis: 1,
            indexForwardAxis: 2
        });
        this.car.addToWorld(this.world);
    }

    setWheels() {
        const baseOptions = {
            radius: 0.35,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 35,
            suspensionRestLength: 0.7,
            dampingRelaxation: 2.5,
            dampingCompression: 4.5,
            maxSuspensionForce: 50000,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            maxSuspensionTravel: 1.0,
            customSlidingRotationalSpeed: 30,
            useCustomSlidingRotationalSpeed: true
        };

        this.car.addWheel({ ...baseOptions, frictionSlip: this.params.rearGrip, chassisConnectionPointLocal: new CANNON.Vec3(0.75, 0.1, -1.3) });
        this.car.addWheel({ ...baseOptions, frictionSlip: this.params.rearGrip, chassisConnectionPointLocal: new CANNON.Vec3(-0.75, 0.1, -1.3) });
        this.car.addWheel({ ...baseOptions, frictionSlip: this.params.frontGrip, chassisConnectionPointLocal: new CANNON.Vec3(0.75, 0.1, 1.25) });
        this.car.addWheel({ ...baseOptions, frictionSlip: this.params.frontGrip, chassisConnectionPointLocal: new CANNON.Vec3(-0.75, 0.1, 1.25) });
    }

    controls() {
        window.addEventListener('keydown', e => {
            const key = e.key.toLowerCase();
            if (!this.keys.includes(key)) this.keys.push(key);
        });
        window.addEventListener('keyup', e => {
            const key = e.key.toLowerCase();
            const idx = this.keys.indexOf(key);
            if (idx > -1) this.keys.splice(idx, 1);
        });

        this.world.addEventListener('preStep', () => this.updateVehiclePhysics());
    }

    updateVehiclePhysics() {
        if (!this.car || !this.car.chassisBody) return;

        const brakeForce = 30;
        const chassisBody = this.car.chassisBody;
        const velocity = chassisBody.velocity;
        const speed = velocity.length();
        const keys = this.keys;

        if (this.enabled && keys.includes('r')) {
            chassisBody.position.set(0, 4, 0);
            chassisBody.quaternion.set(0, 0, 0, 1);
            chassisBody.velocity.set(0, 0, 0);
            chassisBody.angularVelocity.set(0, 0, 0);
        }

        const forward = new CANNON.Vec3(0, 0, 1);
        chassisBody.quaternion.vmult(forward, forward);

        let steerInput = 0;
        if (this.enabled) {
            if (keys.includes('a') || keys.includes('arrowleft')) steerInput = 1;
            else if (keys.includes('d') || keys.includes('arrowright')) steerInput = -1;
        }

        this.car.setSteeringValue(steerInput * this.params.maxSteer, 2);
        this.car.setSteeringValue(steerInput * this.params.maxSteer, 3);

        const minSpeed = 5;
        const maxSpeed = 30;
        const t = Math.min(1, Math.max(0, (speed - minSpeed) / (maxSpeed - minSpeed)));

        const startRear = this.params.gripMinSpeed_Rear;
        const endRear = this.params.gripMaxSpeed_Rear;
        const currentRearGrip = startRear * (1 - t) + endRear * t;

        const startFront = this.params.gripMinSpeed_Front;
        const endFront = this.params.gripMaxSpeed_Front;
        const currentFrontGrip = startFront * (1 - t) + endFront * t;

        this.params.rearGrip = currentRearGrip;
        this.params.frontGrip = currentFrontGrip;

        if (this.car.wheelInfos) {
            this.car.wheelInfos[0].frictionSlip = currentRearGrip;
            this.car.wheelInfos[1].frictionSlip = currentRearGrip;
            this.car.wheelInfos[2].frictionSlip = currentFrontGrip;
            this.car.wheelInfos[3].frictionSlip = currentFrontGrip;
        }

        const forwardSpeed = velocity.dot(forward);

        if (forwardSpeed > 1.0) {
            const turnStrength = 3.0;
            const targetAngularY = steerInput * turnStrength * Math.min(1, speed / 10);
            chassisBody.angularVelocity.y += (targetAngularY - chassisBody.angularVelocity.y) * 0.12;
        }

        chassisBody.angularVelocity.x *= 0.9;
        chassisBody.angularVelocity.z *= 0.9;

        if (this.enabled && (keys.includes('w') || keys.includes('arrowup'))) {
            this.car.applyEngineForce(-this.params.maxForce, 2);
            this.car.applyEngineForce(-this.params.maxForce, 3);
        } else if (this.enabled && (keys.includes('s') || keys.includes('arrowdown'))) {
            const reverseForce = this.params.maxForce * 0.5;
            this.car.applyEngineForce(reverseForce, 2);
            this.car.applyEngineForce(reverseForce, 3);
        } else {
            this.car.applyEngineForce(0, 2);
            this.car.applyEngineForce(0, 3);
        }

        if (this.enabled && keys.includes(' ')) {
            this.car.setBrake(brakeForce, 0);
            this.car.setBrake(brakeForce, 1);
        } else {
            this.car.setBrake(this.enabled ? 0 : 10, 0);
            this.car.setBrake(this.enabled ? 0 : 10, 1);
        }
    }

    updateVisuals() {
        if (!this.chassis) return;

        this.chassis.position.copy(this.car.chassisBody.position);
        this.chassis.quaternion.copy(this.car.chassisBody.quaternion);

        const applyOffsets = (obj) => {
            obj.position.set(
                this.chassisModelPos.x,
                this.chassisModelPos.y,
                this.chassisModelPos.z
            );
            obj.rotation.set(
                this.chassisModelRot.x,
                this.chassisModelRot.y,
                this.chassisModelRot.z
            );
        };

        if (this.chassisModel) {
            applyOffsets(this.chassisModel);
        } else if (this.fallbackMesh) {
            applyOffsets(this.fallbackMesh);
        }

        const velocity = this.car.chassisBody.velocity;
        const forward = new CANNON.Vec3(0, 0, 1);
        this.car.chassisBody.quaternion.vmult(forward, forward);
        const forwardSpeed = velocity.dot(forward);

        const right = new CANNON.Vec3(1, 0, 0);
        this.car.chassisBody.quaternion.vmult(right, right);
        const sideSpeed = velocity.dot(right);
        const isDrifting = Math.abs(sideSpeed) > 1.5;

        const wheelRadius = 0.35;
        const spinAmount = forwardSpeed / wheelRadius * 0.016;

        if (!this.lastSkidPos) this.lastSkidPos = [null, null, null, null];

        for (let i = 0; i < 4; i++) {
            if (this.wheels[i] && this.car.wheelInfos[i]) {
                this.car.updateWheelTransform(i);
                const t = this.car.wheelInfos[i].worldTransform;

                this.wheels[i].position.copy(t.position);
                this.wheels[i].quaternion.copy(t.quaternion);

                const offsetZ = (i < 2) ? this.wheelOffsetRearZ : this.wheelOffsetFrontZ;

                if (offsetZ !== 0) {
                    const forward = new CANNON.Vec3(0, 0, 1);
                    this.car.chassisBody.quaternion.vmult(forward, forward);

                    this.wheels[i].position.x += forward.x * offsetZ;
                    this.wheels[i].position.y += forward.y * offsetZ;
                    this.wheels[i].position.z += forward.z * offsetZ;
                }

                const tire = this.wheels[i].children[0];
                if (tire) tire.rotation.x += spinAmount;

                const isTouchingGround = this.car.wheelInfos[i].raycastResult.hitNormalWorld.dot(new CANNON.Vec3(0, 1, 0)) > 0;

                if (isDrifting && isTouchingGround) {
                    const currentPos = this.wheels[i].position.clone();
                    currentPos.y -= 0.35;
                    currentPos.y += 0.02;

                    if (this.lastSkidPos[i]) {
                        SkidMarkManager.addSegment(this.lastSkidPos[i], currentPos);
                    }

                    this.lastSkidPos[i] = currentPos;
                } else {
                    this.lastSkidPos[i] = null;
                }
            }
        }

        SkidMarkManager.update();
    }
}
