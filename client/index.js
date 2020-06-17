(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var player_bones = {
    "SKEL_L_UpperArm": {
        bone_id: 45509,
        threshold: 0.4
    },
    "SKEL_R_UpperArm": {
        bone_id: 40269,
        threshold: 0.4
    },
    "SKEL_L_Forearm": {
        bone_id: 61163,
        threshold: 0.4
    },
    "SKEL_R_Forearm": {
        bone_id: 28252,
        threshold: 0.4
    },
    "SKEL_Head": {
        bone_id: 31086,
        threshold: 0.2
    },
    "SKEL_R_Hand": {
        bone_id: 57005,
        threshold: 0.4
    },
    "SKEL_L_Hand": {
        bone_id: 18905,
        threshold: 0.4
    },
    "SKEL_R_Clavicle": {
        bone_id: 10706,
        threshold: 0.3
    },
    "SKEL_L_Clavicle": {
        bone_id: 64729,
        threshold: 0.3
    },
    "SKEL_Spine0": {
        bone_id: 23553,
        threshold: 0.5
    },
    "SKEL_Spine1": {
        bone_id: 24816,
        threshold: 0.5
    },
    "SKEL_Spine2": {
        bone_id: 24817,
        threshold: 0.5
    },
    "SKEL_Spine3": {
        bone_id: 24818,
        threshold: 0.5
    },
    "SKEL_R_Calf": {
        bone_id: 36864,
        threshold: 0.3
    },
    "SKEL_L_Calf": {
        bone_id: 63931,
        threshold: 0.3
    },
    "SKEL_L_Thigh": {
        bone_id: 58271,
        threshold: 0.3
    },
    "SKEL_R_Thigh": {
        bone_id: 51826,
        threshold: 0.3
    },
    "SKEL_R_Foot": {
        bone_id: 52301,
        threshold: 0.3
    },
    "SKEL_L_Foot": {
        bone_id: 14201,
        threshold: 0.3
    }
}

function getIsHitOnBone(hitPosition, target) {
    let nearest_bone = "";
    let nearest_bone_dist = 99;
    if (target != null) {
        for (let bone in player_bones) {
            let bone_id = player_bones[bone].bone_id;
            let threshold = player_bones[bone].threshold;
            let headPos = mp.players.local.getBoneCoords(12844, 0, 0, 0);
            let pos = target.getBoneCoords(bone_id, 0, 0, 0);
            let raycast = mp.raycasting.testPointToPoint(hitPosition, pos, mp.players.local, (2));
            let hit_dist = mp.game.system.vdist(hitPosition.x, hitPosition.y, hitPosition.z, pos.x, pos.y, pos.z);
            if (hit_dist < 1.6) {
                let vector = new mp.Vector3(hitPosition.x - headPos.x, hitPosition.y - headPos.y, hitPosition.z - headPos.z);
                let dist_aim = mp.game.system.vdist(hitPosition.x, hitPosition.y, hitPosition.z, headPos.x, headPos.y, headPos.z);
                let vectorNear = vector.normalize(dist_aim);
                //....
                let dist = mp.game.system.vdist(pos.x, pos.y, pos.z, headPos.x, headPos.y, headPos.z);
                let vectorAtPos = vectorNear.multiply(dist);
                let aimdist = mp.game.system.vdist(pos.x, pos.y, pos.z, headPos.x + vectorAtPos.x, headPos.y + vectorAtPos.y, headPos.z + vectorAtPos.z)
                if (nearest_bone_dist > aimdist) {
                    if (aimdist <= threshold) {
                        nearest_bone = bone;
                        nearest_bone_dist = aimdist;
                    }
                }
            }
        }
    }
    return {
        hit: (nearest_bone != "" ? true : false),
        bone: nearest_bone,
        dist: nearest_bone_dist
    };
}
var impactVectors = [];
mp.events.add("render", () => {
    impactVectors.forEach((e) => {
        let localPed = mp.peds.atRemoteId(e.index)
        if (localPed) {
            let position = localPed.getCoords(true);
            mp.game.graphics.drawLine(position.x + e.hitVector.x, position.y + e.hitVector.y, position.z + e.hitVector.z, position.x + e.hitVector.x - e.x, position.y + e.hitVector.y - e.y, position.z + e.hitVector.z - e.z, 255, 9, 9, 255);
            let entry = new mp.Vector3(position.x + e.hitVector.x - e.x, position.y + e.hitVector.y - e.y, position.z + e.hitVector.z - e.z);
            let targetPosition = new mp.Vector3(position.x + e.hitVector.x, position.y + e.hitVector.y, position.z + e.hitVector.z);
            let dirVector = new mp.Vector3(targetPosition.x - entry.x, targetPosition.y - entry.y, targetPosition.z - entry.z).normalize();
            // Function.Call(Hash.DRAW_SPOT_LIGHT, pos.X, pos.Y, pos.Z, dirVector.X, dirVector.Y, dirVector.Z, 255, 255, 255, 100.0f, 1f, 0.0f, 13.0f, 1f); 
            mp.game.graphics.drawSpotLight(entry.x, entry.y, entry.z, dirVector.x, dirVector.y, dirVector.z, 255, 0, 0, 50, 100, 0, 5, 0);
            // localPed.applyForceTo(0, entry.x, entry.y, entry.z, dirVector.x, dirVector.y, dirVector.z, 0, true, true, true, false, false);
        }
    })
});
/*
void AddDecal(Vector3 pos, DecalTypes decalType, float width = 1.0f, float height = 1.0f, float rCoef = 0.1f, float gCoef = 0.1f, float bCoef = 0.1f, float opacity = 1.0f, float timeout = 20.0f)     
   {            Function.Call<int>(Hash.ADD_DECAL, (int)decalType, pos.X, pos.Y, pos.Z, 0, 0, -1.0, 0, 1.0, 0, width, height, rCoef, gCoef, bCoef, opacity, timeout, 0, 0, 0);    
       }
1110
*/
//mp.game.graphics.addDecal(decaltype, x, y, z, dirX, dirY, dirZ, p8,p9, p10, width, height, rCoef, gCoef, bCoef, opacity, timeout, 0, 0, 0);
//mp.game.graphics.addDecal(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19);
mp.events.add('playerWeaponShot', (targetPosition, targetEntity) => {
    let weapon_hash = mp.players.local.weapon;
    if (!targetEntity) {
        let hand_pos = mp.players.local.getBoneCoords(57005, 0, 0, 0);
        // let raycast = mp.raycasting.testPointToPoint(hand_pos, targetPosition, mp.players.local, (4 | 8));
        let raycast = mp.raycasting.testCapsule(hand_pos, targetPosition, 0.3, mp.players.local, (4 | 8 | 1 | 2 | 16))
        // if (raycast && raycast.surfaceNormal) mp.game.graphics.addDecal(1110 /*splatters_blood2 */ , targetPosition.x, targetPosition.y, targetPosition.z, 0 /*dirX*/ , 0 /*dirY*/ , -1 /*dirZ*/ , 0, /*rot*/1, 0, 4 /*width*/ , 4 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
        // if (raycast && raycast.surfaceNormal) mp.game.graphics.addDecal(1110 /*splatters_blood2 */ , raycast.position.x, raycast.position.y, raycast.position.z, 0 /*dirX*/ , 0 /*dirY*/ , -1 /*dirZ*/ , 0, /*rot*/1, 0, 4 /*width*/ , 4 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
        if (raycast && raycast.entity) {
            //console.log("raycast", raycast)
            console.log("typeof raycast.entity", typeof raycast.entity)
            if (typeof raycast.entity == "number") {
                let localPed = mp.peds.atHandle(raycast.entity)
                if (localPed) {
                    console.log("zombie", localPed.getVariable('zombie'))
                    if (localPed.getVariable('zombie')) {
                        if (localPed.getVariable('DEAD')) return;
                        let hitData = getIsHitOnBone(targetPosition, localPed);
                        console.log("hitData", hitData);
                        let vector = new mp.Vector3(targetPosition.x - hand_pos.x, targetPosition.y - hand_pos.y, targetPosition.z - hand_pos.z);
                        let hitVector = localPed.getOffsetFromGivenWorldCoords(targetPosition.x, targetPosition.y, targetPosition.z);
                        /*impactVectors.push({
                            index: localPed.getVariable('sync_id'),
                            x: vector.x,
                            y: vector.y,
                            z: vector.z,
                            hitVector: hitVector
                        })*/
                        mp.events.callRemote("zombie:damage", localPed.getVariable('sync_id'), weapon_hash, hitData.hit ? hitData.bone : false, vector, hitVector);
                    }
                }
            }
        }
    } else {
        console.log("PLAYER", targetEntity.id)
        console.log("targetEntity.id", targetEntity.id)
        console.log("targetEntity.remoteid", targetEntity.remoteid)
    }
});
var timerHitmarker = 0;
var timerHitmarkerKill = 0;
var timerEnterDisable = 0;
mp.events.add("render", () => {
    if (!mp.game.graphics.hasStreamedTextureDictLoaded("hud_reticle")) {
        mp.game.graphics.requestStreamedTextureDict("hud_reticle", true);
    }
    if (mp.game.graphics.hasStreamedTextureDictLoaded("hud_reticle")) {
        if ((Date.now() / 1000 - timerHitmarker) <= 0.1) {
            mp.game.graphics.drawSprite("hud_reticle", "reticle_ar", 0.5, 0.5, 0.025, 0.040, 45, 255, 255, 255, 150);
        }
        if ((Date.now() / 1000 - timerHitmarkerKill) <= 0.1) {
            mp.game.graphics.drawSprite("hud_reticle", "reticle_ar", 0.5, 0.5, 0.025, 0.040, 45, 200, 0, 0, 150);
        }
    }
});
mp.events.add("client:hitmarker", () => {
    timerHitmarker = Date.now() / 1000;
});
mp.events.add("client:killmarker", () => {
    timerHitmarkerKill = Date.now() / 1000;
});
},{}],2:[function(require,module,exports){
(function (global){
mp.game.audio.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE");
console.log = function(...a) {
    a = a.map(function(e) {
        return JSON.stringify(e);
    })
    mp.gui.chat.push("DeBuG:" + a.join(" "))
};
mp.nametags.enabled = true;
var tickRate = 1000 / 5;
setInterval(function() {
    mp.events.call("client:Tick");
}, tickRate);
let flags_count = 0;
var flags = {
    WALKING: flags_count++,
    SPRINT: flags_count++,
    RUNNING: flags_count++,
    IDLE: flags_count++,
    COMBAT: flags_count++,
    RAGDOLL: flags_count++,
    STUMBLE: flags_count++,
    DEAD: flags_count++,
    DEATH: flags_count++,
}
mp.lerp = (a, b, n) => {
    return (1 - n) * a + n * b;
}
global["Flags"] = [];
Object.keys(flags).forEach(function(key, value) {
    console.log("enums-> Flags." + key, "=", flags[key])
    global["Flags"][key] = flags[key];
})
mp.gui.chat.activate(true)
mp.isCrouched = false;
require("./vector.js")
require("./sync.js")
require("./combat.js")
require("./movement.js")
var stats = ["SP0_STAMINA", "SP0_SHOOTING_ABILITY", "SP0_STRENGTH", "SP0_STEALTH_ABILITY", "SP0_LUNG_CAPACITY"]
stats.forEach((element) => {
    mp.game.stats.statSetInt(mp.game.joaat(element), 100, false);
});
let oldNoise = 0;
mp.events.add("client:Tick", () => {
    let mul = mp.players.local.getVariable("isCrouched");
    let localNoise = mul ? mp.game.player.getCurrentStealthNoise() * 0.8 : mp.game.player.getCurrentStealthNoise();
    if (mp.players.local.isInAnyVehicle(false)) {
        localNoise *= 2;
        if (mp.players.local.vehicle.getIsEngineRunning()) {
            localNoise += 15;
        }
    }
    if (oldNoise != localNoise) {
        oldNoise = localNoise;
        mp.events.callRemote('client:noise', localNoise.toFixed(2));
    }
});
var localPlayerBlip = mp.blips.new(9, new mp.Vector3(0, 0, 0), {
    color: 3,
    scale: 0.2,
    alpha: 100,
    drawDistance: 0
});
mp.events.add("render", () => {
    let mul = mp.players.local.getVariable("isCrouched");
    let localNoise = mul ? mp.game.player.getCurrentStealthNoise() * 0.8 : mp.game.player.getCurrentStealthNoise();
    if (mp.players.local.isInAnyVehicle(false)) {
        localNoise *= 2;
        if (mp.players.local.vehicle.getIsEngineRunning()) {
            localNoise += 15;
        }
    }
    localPlayerBlip.setCoords(mp.players.local.position);
    localPlayerBlip.setScale(localNoise / 10);
    mp.game.player.restoreStamina(100);
    mp.game.graphics.drawText(`Noise:${localNoise.toFixed(2)}`, [0.5, 0.9], {
        font: 4,
        color: [255, 255, 255, 255],
        scale: [0.4, 0.4],
        outline: true,
        centre: true
    });
    /* This block represents if a player is taken damage by something */
    if (mp.players.local.hasBeenDamagedByAnyObject() || mp.players.local.hasBeenDamagedByAnyPed() || mp.players.local.hasBeenDamagedByAnyVehicle()) {
        //if (States.LAST_DAMAGE > getTimeInSeconds())
        //     return false;
        // States.LAST_DAMAGE = getTimeInSeconds() + 1;
        // mp.events.callRemote("server:PlayerReceivedDamage");
        // States.HEALTH = mp.players.local.getHealth();
        // mp.players.local.clearLastDamage();
    }
});
mp.keys.bind(0x71, true, function() {
    mp.events.callRemote('zombie_new', "walker");
});
mp.keys.bind(0x72, true, function() {
    mp.events.callRemote('zombie_new', "runner");
});
mp.keys.bind(0x73, true, function() {
    mp.events.callRemote('zombie_new', "sprinter");
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./combat.js":1,"./movement.js":3,"./sync.js":6,"./vector.js":7}],3:[function(require,module,exports){
//mp.canCrouch = true;

const movementClipSet = "move_ped_crouched";
const strafeClipSet = "move_ped_crouched_strafing";
const clipSetSwitchTime = 0.25;
const loadClipSet = (clipSetName) => {
    mp.game.streaming.requestClipSet(clipSetName);
    while (!mp.game.streaming.hasClipSetLoaded(clipSetName)) mp.game.wait(0);
};
loadClipSet(movementClipSet);
loadClipSet(strafeClipSet);
mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "player" && entity.getVariable("isCrouched")) {
        entity.setMovementClipset(movementClipSet, clipSetSwitchTime);
        entity.setStrafeClipset(strafeClipSet);
    }
});
mp.events.addDataHandler("isCrouched", (entity, value) => {
    if (entity.type !== "player") return;
    if (value) {
        entity.setMovementClipset(movementClipSet, clipSetSwitchTime);
        entity.setStrafeClipset(strafeClipSet);
    } else {
        entity.resetMovementClipset(clipSetSwitchTime);
        entity.resetStrafeClipset();
    }
});
mp.events.add("render", () => {
    mp.game.player.setRunSprintMultiplierFor(1);
    mp.game.controls.disableControlAction(2, 36, true);
    if (mp.game.controls.isDisabledControlJustPressed(2, 36)) {
       // if ((mp.gui.chat.enabled == false)) {
            mp.events.callRemote("toggleCrouch");
        //}
    }
})
},{}],4:[function(require,module,exports){
var natives = {};
mp.game.graphics.clearDrawOrigin = () => mp.game.invoke('0xFF0B610F6BE0D7AF'); // 26.07.2018 // GTA 1.44 
natives.START_PLAYER_TELEPORT = (player, x, y, z, heading, p5, p6, p7) => mp.game.invoke("0xAD15F075A4DA0FDE", player, x, y, z, heading, p5, p6, p7);
natives.CHANGE_PLAYER_PED = (ped, p1, p2) => mp.game.invoke("0x048189FAC643DEEE", ped, p1, p2);
natives.SET_PED_CURRENT_WEAPON_VISIBLE = (ped, visible, deselectWeapon, p3, p4) => mp.game.invoke("0x0725A4CCFDED9A70", ped, visible, deselectWeapon, p3, p4);
natives.SET_BLIP_SPRITE = (blip, sprite) => mp.game.invoke("0xDF735600A4696DAF", blip, sprite); // SET_BLIP_SPRITE
natives.SET_BLIP_ALPHA = (blip, a) => mp.game.invoke("0x45FF974EEE1C8734", blip, a); // SET_BLIP_ALPHA
natives.SET_BLIP_COLOUR = (blip, c) => mp.game.invoke("0x03D7FB09E75D6B7E", blip, c); // SET_BLIP_COLOUR
natives.SET_BLIP_ROTATION = (blip, r) => mp.game.invoke("0xF87683CDF73C3F6E", blip, r); // SET_BLIP_ROTATION
natives.SET_BLIP_FLASHES = (blip, f) => mp.game.invoke("0xB14552383D39CE3E", blip, f); // SET_BLIP_FLASHES
natives.SET_BLIP_FLASH_TIMER = (blip, t) => mp.game.invoke("0xD3CD6FD297AE87CC", blip, t); // SET_BLIP_FLASH_TIMER
natives.SET_BLIP_COORDS = (blip, x, y, z) => mp.game.invoke("0xAE2AF67E9D9AF65D", blip, x, y, z); // SET_BLIP_COORDS
natives.SET_CURSOR_LOCATION = (x, y) => mp.game.invoke("0xFC695459D4D0E219", x, y); // SET_CURSOR_LOCATION 
natives.SET_THIS_SCRIPT_CAN_REMOVE_BLIPS_CREATED_BY_ANY_SCRIPT = (toggle) => mp.game.invoke("0xB98236CAAECEF897", toggle); // SET_THIS_SCRIPT_CAN_REMOVE_BLIPS_CREATED_BY_ANY_SCRIPT
natives.GET_FIRST_BLIP_INFO_ID = (i) => mp.game.invoke("0x1BEDE233E6CD2A1F", i); // GET_FIRST_BLIP_INFO_ID
natives.GET_NEXT_BLIP_INFO_ID = (i) => mp.game.invoke("0x14F96AA50D6FBEA7", i); // GET_NEXT_BLIP_INFO_ID
natives.DOES_BLIP_EXIST = (blip) => mp.game.invoke("0xA6DB27D19ECBB7DA", blip); // DOES_BLIP_EXIST
natives.GET_NUMBER_OF_ACTIVE_BLIPS = () => mp.game.invoke("0x9A3FF3DE163034E8"); // GET_NUMBER_OF_ACTIVE_BLIPS
natives.SET_BLIP_SCALE = (blip, scale) => mp.game.invoke("0xD38744167B2FA257", blip, scale); // SET_BLIP_SCALE
natives.SET_ENTITY_NO_COLLISION_ENTITY = (entity1, entity2, collision) => mp.game.invoke("0xA53ED5520C07654A", entity1.handle, entity2.handle, collision); // SET_ENTITY_NO_COLLISION_ENTITY
natives.SET_RUN_SPRINT_MULTIPLIER_FOR_PLAYER = (target, mul) => mp.game.invoke("0x6DB47AA77FD94E09", target.handle, mul); // SET_RUN_SPRINT_MULTIPLIER_FOR_PLAYER
module.exports = natives;
},{}],5:[function(require,module,exports){
class Wall {
    constructor(points) {
        this.points = points;
        this.material = 0;
    }
    removeDuplicates() {
        this.points = [...new Set(this.points)];
    }
    isPart(position) {
        return this.points.findIndex(e => {
            return e.x == position.x && e.y == position.y && e.z == position.z;
        })
    }
    get type() {
        return "wall";
    }
}
class Node {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.material = 0;
        this.material = 0;
        this.data = undefined,
            this.target_x = 0;
        this.target_y = 0;
        this.target_z = 0;
    }
    get target_pos() {
        return new mp.Vector3(this.target_x, this.target_y, this.target_z);
    }
    get pos() {
        return new mp.Vector3(this.x, this.y, this.z);
    }
}
var Pathfinder = class {
    constructor(fov, viewDistance, noiseAlertness, zombieType) {
        this.fov = fov;
        this.viewDistance = viewDistance;
        this.noiseAlertness = noiseAlertness;
        this.vision = [];
        this.zombieType = zombieType || "walker";
        this.tempNodes = [];
        this.updateDistance = 5;
        this._updateCounter = 0;
        this.maxIdleTicks = 5;
        this.IdleTicks = 0;
        this.position = new mp.Vector3(0, 0, 0);
        this.nextAction = {
            flag: Flags.IDLE,
            position: new mp.Vector3(0, 0, 0)
        };
        if (this.zombieType == "walker") this.maxIdleTicks = 3;
        if (this.zombieType == "runner") this.maxIdleTicks = 6;
        if (this.zombieType == "sprinter") this.maxIdleTicks = 10;
    }
    render() {
        /*if (this.position) {
            mp.game.graphics.drawText(`position\n${JSON.stringify(this.nextAction)}`, [this.position.x, this.position.y, this.position.z], {
                font: 4,
                color: [255, 255, 255, 255],
                scale: [0.4, 0.4],
                outline: true,
                centre: true
            });
        }*/
    }
    isValid(from, to) {
        return mp.raycasting.testCapsule(from, to, 0.5, null, (1 | 2 | 16 | 256)) ? false : true;
    }
    getNearest(from, to) {
        let rc = mp.raycasting.testCapsule(from, to, 0.2, null, (1 | 2 | 16 | 256));
        return rc ? rc.position : false;
    }
    getNearestAttention() {
        let targetPosition = false;
        var attentionPlayers = [];
        mp.players.forEachInStreamRange((player) => {
            if (this.position.dist(player.position) > this.viewDistance) return;
            if ((player.getVariable("movementNoise") >= (this.noiseAlertness * this.position.dist(player.position)))) {
                attentionPlayers.push(player);
            }
        })
        if (attentionPlayers.length > 0) {
            let loudest = attentionPlayers.sort((a, b) => {
                let noise_a = a.getVariable("movementNoise") || 0;
                let noise_b = b.getVariable("movementNoise") || 0;
                if (noise_b > noise_b) {
                    return -1;
                }
                if (noise_b < noise_b) {
                    return 1;
                }
                // a muss gleich b sein
                return 0;
            })
            if (loudest[0]) {
                targetPosition = this.getNearest(this.position, loudest[0].position)
            }
        }
        return targetPosition;
    };
    getBestTarget() {
        var visiblePlayers = [];
        mp.players.forEachInStreamRange((player) => {
            if (this.position.dist(player.position) > this.viewDistance) return;
            if (
                (!mp.raycasting.testCapsule(this.position, player.position, 0.2, null, (1 | 16 | 256)))) {
                visiblePlayers.push(player);
            }
        })
        if (visiblePlayers) {
            let targets = visiblePlayers.filter(player => {
                let dist = this.position.dist(player.position);
                return player.getVariable("movementNoise") >= (this.noiseAlertness * dist);
            })
            if (targets.length > 1) {
                targets = targets.sort((a, b) => {
                    if (a.getHealth() > b.getHealth()) {
                        return -1;
                    }
                    if (a.getHealth() < b.getHealth()) {
                        return 1;
                    }
                    // a muss gleich b sein
                    return 0;
                })
            }
            return targets[0];
        }
        return false;
    }
    getRandomPosition() {
        if (!this.position) return false;
        if (!this.failedLastRandomPos) this.failedLastRandomPos = 1;
        let dist = 2;
        if ((this.zombieType == "runner") && (this.failedLastRandomPos == 1)) dist = 5;
        if ((this.zombieType == "sprinter") && (this.failedLastRandomPos == 1)) dist = 5;
        var randomHeading = this.heading + ((Math.random() * 1.0) - 0.5);
        var headingX = Math.cos(randomHeading) * dist;
        var headingY = Math.sin(randomHeading) * dist;
        let newPos = new mp.Vector3(this.position.x + headingX, this.position.y + headingY, this.position.z + 0.4);
        let valid = this.isValid(this.position, newPos);
        if (valid) {
            this.failedLastRandomPos = 1;
            return newPos;
        }
        this.failedLastRandomPos = 2;
        return false;
    }
    evaluate() {
        if (this._updateCounter < 2) return;
        this._updateCounter = 0;
        let temp_action = {
            flag: Flags.IDLE,
            position: new mp.Vector3(0, 0, 0),
            targetID: false,
            targetType: "player"
        };
        let bestTarget = this.getBestTarget();
        if (!bestTarget) {
            let attention = this.getNearestAttention();
            if (!attention) {
                if (this.IdleTicks > this.maxIdleTicks) {
                    let new_position = this.getRandomPosition();
                    if (new_position) {
                        this.IdleTicks = 0;
                        temp_action.flag = Flags.WALKING;
                        temp_action.position = new_position;
                    }
                }
            } else {
                this.IdleTicks = 0;
                temp_action.flag = Flags.WALKING;
                if (this.zombieType != "walker") temp_action.flag = Flags.RUNNING;
                temp_action.position = attention;
            }
        } else {
            this.IdleTicks = 0;
            temp_action.flag = Flags.COMBAT;
            if (bestTarget.isInAnyVehicle(false)) {
                bestTarget = bestTarget.vehicle;
                temp_action.targetType = "vehicle";
            }
            temp_action.targetID = bestTarget.remoteId;
        }
        if (this.flag == Flags.RAGDOLL) {
            temp_action.flag = Flags.RAGDOLL;
        }
        this.nextAction = temp_action;
    }
    update(flag, position, heading) {
        this._updateCounter += 1;
        this.position = position;
        this.flag = flag;
        this.heading = heading += 90;
        //  this.cleanup(position);
        //  this.evaluate();
        if (this.flag == Flags.IDLE) {
            this.IdleTicks += 1;
        }
        this.evaluate();
    }
    next() {
        return this.nextAction;
    }
}
module.exports = Pathfinder;
},{}],6:[function(require,module,exports){
var debug = true
var Pathfinder = require("./path.js");
var natives = require("./natives.js");
const loadClipSet = (clipSetName) => {
    mp.game.streaming.requestClipSet(clipSetName);
    while (!mp.game.streaming.hasClipSetLoaded(clipSetName)) mp.game.wait(0);
};
loadClipSet("move_m@drunk@verydrunk");
var SyncWorld = new class {
    constructor() {
        this._syncedPeds = [];
    }
    acknowledge(type, remoteId) {
        console.log("acknowledgeSync", type, remoteId);
        if (type == "ped") {
            this._syncedPeds.push(new SyncPed(remoteId));
        }
        if (type == "zombie") {
            this._syncedPeds.push(new Zombie(remoteId));
        }
    }
    getByID(remote_id) {
        return this._syncedPeds.find(e => {
            return e._remote_id == remote_id;
        })
    }
    reject(type, remoteId, killIt) {
        let pIndex = this._syncedPeds.findIndex(e => {
            return remoteId == e._remote_id;
        });
        if (pIndex > -1) {
            if (killIt) this._syncedPeds[pIndex].kill();
            this._syncedPeds[pIndex].destroy();
            this._syncedPeds[pIndex] = undefined;
            this._syncedPeds.splice(pIndex, 1);
        }
    }
}
class SyncPed {
    constructor(remote_id) {
        this._remote_id = remote_id;
        this._ped = mp.peds.atRemoteId(this._remote_id);
        console.log("got SyncPed", this._remote_id, this._ped)
        console.log("sync_id", this._ped.getVariable('sync_id'))
        this.ticker = setInterval(() => {
            this.tick();
        }, 500);
    }
    destroy() {
        clearInterval(this.ticker);
        if (this._renderEvent) {
            this._renderEvent.destroy();
        }
    }
    tick() {
        console.log("default tick");
    }
}
class Zombie extends SyncPed {
    constructor(remoteId) {
        super(remoteId);
        this.noiseAlertness = 2 / 3; // Noise level 4 on 3 meter distance
        this.fieldOfView = 160;
        this.viewDistance = 50;
        this.meeleDistance = 1;
        this.zombieType = this._ped.getVariable('ZOMBIE_TYPE')
        this.walkStyle = this._ped.getVariable('WALKSTYLE')
        this.pathfinder = new Pathfinder(this.fieldOfView, this.viewDistance, this.noiseAlertness, this.zombieType);
        if (debug) {
            this.blip = mp.blips.new(9, new mp.Vector3(this._ped.position.x, this._ped.position.y, this._ped.position.z), {
                color: 3,
                scale: 0.1,
                alpha: 100,
                drawDistance: 0
            });
        }
        this.combatTarget = undefined;
        this.flag = Flags.WALKING;
        this.init();
        this._renderEvent = new mp.Event("render", () => {
            this.render();
        });
    }
    status() {
        if (this._ped.getVariable('DEAD')) this.flag = Flags.DEAD;
        if (this._ped.isRagdoll()) this.flag = Flags.RAGDOLL;
        if ((this.flag == Flags.RAGDOLL) && (!this._ped.isRagdoll())) {
            this.flag = Flags.IDLE
        }
        //if (this._ped.isDeadOrDying(true)) this.flag = Flags.DEAD;
    }
    render() {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        this.pathfinder.render();
        //this._ped.setHealth(200);
        let position = mp.vector(this._ped.getCoords(true)).ground();
        let dist = mp.vector(position).dist(mp.players.local.position);
        let threshold = this.noiseAlertness * dist
        /*mp.game.graphics.drawText(`Zombie\nFlag:${this.flag}\nIdleTicks:${this.pathfinder.IdleTicks}\nDead:${this._ped.getVariable('DEAD') }\nTYPE:${this.zombieType}\nHEALTH:${this._ped.getVariable('HEALTH')}\nThreshold:${threshold.toFixed(2)}`, [position.x, position.y, position.z - 1], {
            font: 4,
            color: [255, 255, 255, 255],
            scale: [0.2, 0.2],
            outline: true,
            centre: true
        });*/
        let r = mp.lerp(200, 0, 1 / this._ped.getMaxHealth() * this._ped.getHealth());
        mp.game.graphics.drawMarker(25, position.x, position.y, position.z + 0.04, 0, 0, 0, 0, 0, 0, 1, 1, 1, r, 0, 0, 150, false, false, 2, false, "", "", false);
        if (this.currentTargetPosition) {
            mp.game.graphics.drawMarker(28, this.currentTargetPosition.x, this.currentTargetPosition.y, this.currentTargetPosition.z, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0, 255, 0, 255, false, false, 2, false, "", "", false);
            mp.game.graphics.drawLine(position.x, position.y, position.z+1, this.currentTargetPosition.x, this.currentTargetPosition.y, this.currentTargetPosition.z, 0, 255, 0, 255);
        }
    }
    loadPedAttributes() {
        this._ped.setMaxHealth(200);
        this._ped.setHealth(200);
        this._ped.setSweat(100);
        this._ped.setSuffersCriticalHits(false);
        this._ped.freezePosition(false);
        this._ped.setCombatAbility(100);
        this._ped.setCombatMovement(3);
        for (var i = 1; i < 64; i += 2) {
            this._ped.setFleeAttributes(i, false);
        }
        this._ped.setFleeAttributes(0, false);
        this._ped.setCombatAttributes(17, true);
        this._ped.setCombatAttributes(16, true);
        this._ped.setBlockingOfNonTemporaryEvents(true);
        this._ped.setProofs(false, false, false, true, false, false, false, false);
        this._ped.setCanBeDamaged(true);
        this._ped.setInvincible(true);
        this._ped.setOnlyDamagedByPlayer(true);
        this._ped.setCanRagdoll(true);
        this._ped.setCanRagdollFromPlayerImpact(false);
        this._ped.setRagdollFlag(0);
        this._ped.setRandomComponentVariation(false);
        this._ped.applyDamagePack("Explosion_Med", Math.floor(Math.random() * 100), 1);
        this._ped.setMaxHealth((100 + this._ped.getVariable('MAX_HEALTH')));
        this._ped.setHealth((100 + this._ped.getVariable('HEALTH')));
    }
    applyHit(hitData) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        this._ped.setMaxHealth((100 + this._ped.getVariable('MAX_HEALTH')));
        this._ped.setHealth((100 + this._ped.getVariable('HEALTH')));
        if (this.flag != Flags.RAGDOLL) {
            console.log("applyHit", hitData);
            let time = 1000;
            if (hitData.stumble) {
                this._ped.setToRagdoll(time, time, 3, false, false, false);
            } else if (hitData.ragdoll == true) {
                this._ped.setToRagdoll(time, time, 2, false, false, false);
            }
            let position = this._ped.getCoords(true);
            //mp.game.graphics.drawLine(position.x + hitData.hitVector.x, position.y + hitData.hitVector.y, position.z + hitData.hitVector.z, position.x + hitData.hitVector.x - hitData.x, position.y + hitData.hitVector.y - hitData.y, position.z + hitData.hitVector.z - hitData.z, 255, 9, 9, 255);
            let entry = new mp.Vector3(position.x + hitData.exit.x + hitData.entry.x, position.y + hitData.exit.y + hitData.entry.y, position.z + hitData.exit.z + hitData.entry.z);
            let targetPosition = new mp.Vector3(position.x + hitData.exit.x, position.y + hitData.exit.y, position.z + hitData.exit.z);
            let dirVector = new mp.Vector3(targetPosition.x - entry.x, targetPosition.y - entry.y, targetPosition.z - entry.z).normalize();
            // if (hitData.ragdoll == true) {
            // this._ped.applyForceTo(3, entry.x, entry.y, entry.z, dirVector.x, dirVector.y, dirVector.z, 0, true, false, false, false, false);
            //this._ped.applyForceTo(5, entry.x, entry.y, entry.z, dirVector.x, dirVector.y, dirVector.z, 0, true, false, false, false, false);
            // }
            //this._ped.applyForceTo(2, entry.x, entry.y, entry.z, dirVector.x, dirVector.y, dirVector.z, 0, true, false, false, false, false);
            //this._ped.setVelocity(dirVector.x, dirVector.y, dirVector.z)
            //mp.game.invoke("0x8E04FEDD28D42462", this._ped.handle, "GENERIC_CURSE_HIGH", "SPEECH_PARAMS_SHOUTED", 0);
            mp.game.invoke("0x8E04FEDD28D42462", this._ped.handle, "GENERIC_CURSE_MED", "SPEECH_PARAMS_SHOUTED", 0);
        }
    }
    kill() {
        this._ped.setHealth(0);
        this._ped.setToRagdoll(1000, 1000, 3, false, false, false);
        this.flag = Flags.DEAD;
    }
    init() {
        if (!mp.game.streaming.hasClipSetLoaded(this.walkStyle)) {
            mp.game.streaming.requestClipSet(this.walkStyle);
            while (!mp.game.streaming.hasClipSetLoaded(this.walkStyle)) mp.game.wait(0);
        }
        this._ped.setMovementClipset(this.walkStyle, 0.0);
        this.loadPedAttributes();
    }
    idle() {
        //this.flag = Flags.IDLE;
        //console.log("PED", this.flag);
    }
    walk(position) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        this._ped.taskGoToCoordAnyMeans(position.x, position.y, position.z, 0.8, 0, false, 786603, 0);
        //this._ped.taskGoStraightToCoord(position.x, position.y, position.z, 0.4, 15000, this.newHeading, 0);
    }
    run(position) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        if (!position) return false;
        if (!this.position) return false;
        this._ped.taskGoToCoordAnyMeans(position.x, position.y, position.z, 6.2, 0, false, 786603, 0);
        if (this.position.z > position.z + 2) {
            this._ped.taskGoStraightToCoord(position.x, position.y, position.z, 6.2, -1, this._ped.getHeading(), 2);
        }
    }
    sprint(position) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        if (!position) return false;
        if (!this.position) return false;
        this._ped.taskGoToCoordAnyMeans(position.x, position.y, position.z, 12.4, 0, false, 786603, 0);
        if (this.position.z > position.z + 1) {
            this._ped.taskGoStraightToCoord(position.x, position.y, position.z,12.4, -1, this._ped.getHeading(), 2);
        }
    }
    meele(targetHandle) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        this._ped.taskPutDirectlyIntoMelee(targetHandle, 0.0, -1.0, 1.0, false);
    }
    combat(targetType, remoteId) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        var tagetEntity = false;
        if (targetType == "player") {
            tagetEntity = mp.players.toArray().find(element => element.remoteId == remoteId);
        } else {
            tagetEntity = mp.vehicles.toArray().find(element => element.remoteId == remoteId);
        }
        if (tagetEntity) {
            let tEntityPos = new mp.Vector3(tagetEntity.position.x, tagetEntity.position.y, tagetEntity.position.z);
            if (tEntityPos.dist(this._ped.getCoords(false)) > this.viewDistance) {
                this.combatTarget = undefined;
                this.flag = Flags.WALKING;
                return false;
            } else if (tEntityPos.dist(this._ped.getCoords(false)) < this.meeleDistance) {
                this.meele(tagetEntity.handle);
                return true;
            }

            if (this.zombieType == "runner") this.run(tEntityPos);
            if (this.zombieType == "walker") this.walk(tEntityPos);
            if (this.zombieType == "sprinter") this.sprint(tEntityPos);
        }
    }
    tick() {
        if (!mp.peds.atRemoteId(this._remote_id)) return console.log("no remote", this._remote_id);
        this.status();
        if (this.flag != Flags.DEAD) {
            this.position = this._ped.getCoords(false);
            if (debug) {
                this.blip.setCoords(this.position);
            }
            this.pathfinder.update(this.flag, new mp.Vector3(this.position.x, this.position.y, this.position.z), this._ped.getHeading());
            //console.log("tick");
            //this._ped.resetRagdollTimer();
            //this._ped.clearTasksImmediately();
            let next = this.pathfinder.next();
            this.flag = next.flag;
            this.currentTargetPosition = mp.vector(next.position).ground();
            switch (next.flag) {
                case Flags.WALKING:
                    {
                        this.walk(next.position);
                        break;
                    }
                case Flags.RUNNING:
                    {
                        this.run(next.position);
                        break;
                    }
                case Flags.SPRINT:
                    {
                        this.sprint(next.position);
                        break;
                    }
                case Flags.COMBAT:
                    {
                        this.combat(next.targetType, next.targetID);
                        break;
                    }
                case Flags.IDLE:
                    {
                        this.idle();
                        break;
                    }
                case Flags.RAGDOLL:
                    {
                        this.idle();
                        break;
                    }
                default:
                    {
                        this.idle();
                        break;
                    }
            }
        } else {
            this._ped.setHealth(0);
            this._ped.setToRagdoll(1000, 1000, 3, false, false, false);
        }
        //this._ped.taskWanderStandard(10.00, 10);
    }
}
mp.events.add('acknowledgeSync', (type, remote_id) => {
    console.log("acknowledgeSync", type, remote_id);
    SyncWorld.acknowledge(type, remote_id);
});
mp.events.add('rejectSync', (type, remote_id, kill) => {
    console.log("rejectSync", type, remote_id);
    SyncWorld.reject(type, remote_id, kill);
});
mp.events.add('acknowledgeHit', (remote_id, hitData) => {
    console.log("acknowledgeHit", remote_id, hitData);
    let SyncedPed = SyncWorld.getByID(remote_id);
    if (SyncedPed) {
        SyncedPed.applyHit(hitData);
    }
});
mp.events.add('OutgoingDamage', (sourceEntity, targetEntity, targetPlayer, weapon, boneIndex, damage) => {
    console.log("OutgoingDamage", sourceEntity, targetEntity, targetPlayer, weapon, boneIndex, damage);
});
mp.events.add('IncomingDamage', (sourceEntity, targetEntity, targetPlayer, weapon, boneIndex, damage) => {
    console.log("IncomingDamage", sourceEntity, targetEntity, targetPlayer, weapon, boneIndex, damage);
});
},{"./natives.js":4,"./path.js":5}],7:[function(require,module,exports){
mp.Vector3.prototype.findRot = function(rz, dist, rot) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let degrees = (rz + rot) * (Math.PI / 180);
    nVector.x = this.x + dist * Math.cos(degrees);
    nVector.y = this.y + dist * Math.sin(degrees);
    return nVector;
}
mp.Vector3.prototype.rotPoint = function(pos) {
    let temp = new mp.Vector3(this.x, this.y, this.z);
    let temp1 = new mp.Vector3(pos.x, pos.y, pos.z);
    let gegenkathete = temp1.z - temp.z
    let a = temp.x - temp1.x;
    let b = temp.y - temp1.y;
    let ankathete = Math.sqrt(a * a + b * b);
    let winkel = Math.atan2(gegenkathete, ankathete) * 180 / Math.PI
    return winkel;
}
mp.Vector3.prototype.toPixels = function() {
    let clientScreen = mp.game.graphics.getScreenActiveResolution(0, 0);
    let toScreen = mp.game.graphics.world3dToScreen2d(new mp.Vector3(pos.x, pos.y, pos.z)) || {
        x: 0,
        y: 0
    };
    return {
        x: Math.floor(clientScreen.x * toScreen.x) + "px",
        y: Math.floor(clientScreen.y * toScreen.y) + "px"
    };
}

mp.Vector3.prototype.lerp = function(vector2, deltaTime) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = this.x + (vector2.x - this.x) * deltaTime
    nVector.y = this.y + (vector2.y - this.y) * deltaTime
    nVector.z = this.z + (vector2.z - this.z) * deltaTime
    return nVector;
}
mp.Vector3.prototype.multiply = function(n) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = this.x * n;
    nVector.y = this.y * n;
    nVector.z = this.z * n;
    return nVector;
}
mp.Vector3.prototype.dist = function(to) {
    let a = this.x - to.x;
    let b = this.y - to.y;
    let c = this.z - to.z;
    return Math.sqrt(a * a + b * b + c * c);
}
mp.Vector3.prototype.dist2d = function(to) {
    let a = this.x - to.x;
    let b = this.y - to.y;
    return Math.sqrt(a * a + b * b);
}
mp.Vector3.prototype.getOffset = function(to) {
    let x = this.x - to.x;
    let y = this.y - to.y;
    let z = this.z - to.z;
    return new mp.Vector3(x, y, z);
}
mp.Vector3.prototype.cross = function(to) {
    let vector = new mp.Vector3(0, 0, 0);
    vector.x = this.y * to.z - this.z * to.y;
    vector.y = this.z * to.x - this.x * to.z;
    vector.z = this.x * to.y - this.y * to.x;
    return vector;
}
mp.Vector3.prototype.normalize = function() {
    let vector = new mp.Vector3(0, 0, 0);
    let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    vector.x = this.x / mag;
    vector.y = this.y / mag;
    vector.z = this.z / mag;
    return vector;
}
mp.Vector3.prototype.dot = function(to) {
    return this.x * to.x + this.y * to.y + this.z * to.z;
}
mp.Vector3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}
mp.Vector3.prototype.angle = function(to) {
    return Math.acos(this.normalize().dot(to.normalize()));
}
mp.Vector3.prototype.ground = function() {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let z = mp.game.gameplay.getGroundZFor3dCoord(nVector.x, nVector.y, nVector.z, 0, false)
    let z1 = mp.game.gameplay.getGroundZFor3dCoord(nVector.x + 0.01, nVector.y + 0.01, nVector.z, 0, false)
    let z2 = mp.game.gameplay.getGroundZFor3dCoord(nVector.x - 0.01, nVector.y - 0.01, nVector.z, 0, false)
    nVector.z = z;
    if ((z + 0.1 < z1) || (z + 0.1 < z2)) {
        if (z1 < z2) {
            nVector.z = z2;
        } else {
            nVector.z = z1;
        }
    }
    return nVector;
}
mp.Vector3.prototype.ground2 = function(ignore) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let r = mp.raycasting.testPointToPoint(nVector.add(0, 0, 1), nVector.sub(0, 0, 100), ignore, (1 | 16));
    if ((r) && (r.position)) {
        nVector = mp.vector(r.position);
    }
    return nVector;
}
mp.Vector3.prototype.sub = function(x, y, z) {
    return new mp.Vector3(this.x - x, this.y - y, this.z - z);
};
mp.Vector3.prototype.add = function(x, y, z) {
    return new mp.Vector3(this.x + x, this.y + y, this.z + z);
};
mp.Vector3.prototype.insidePolygon = function(polygon) {
    let x = this.x,
        y = this.y; 
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0],
            yi = polygon[i][1];
        let xj = polygon[j][0],
            yj = polygon[j][1];
        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};
mp.vector = function(vec) {
    return new mp.Vector3(vec.x, vec.y, vec.z);
}
Array.prototype.shuffle = function() {
    let i = this.length;
    while (i) {
        let j = Math.floor(Math.random() * i);
        let t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}
},{}]},{},[2]);
