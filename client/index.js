(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*Register Attachments for Player Animatiuons etc TODO*/
var Bones = require("./libs/skeleton.js")
if (mp.attachmentMngr) {
    mp.attachmentMngr.register("mining", "prop_tool_pickaxe", Bones.SKEL_R_Hand, new mp.Vector3(0.085, -0.3, 0), new mp.Vector3(-90, 0, 0));
    mp.attachmentMngr.register("lumberjack", "w_me_hatchet", Bones.SKEL_R_Hand, new mp.Vector3(0.085, -0.05, 0), new mp.Vector3(-90, 0, 0));
    mp.attachmentMngr.register("drink_beer", "prop_cs_beer_bot_03", Bones.SKEL_L_Hand, new mp.Vector3(0.1, -0.03, 0.025), new mp.Vector3(-90, 30, 0));
    mp.attachmentMngr.register("eat_burger", "prop_cs_burger_01", Bones.SKEL_L_Hand, new mp.Vector3(0.15, 0.025, 0.025), new mp.Vector3(170, 40, 0));
    mp.attachmentMngr.register("knife_clavicle", "prop_knife", Bones.SKEL_L_Clavicle, new mp.Vector3(0, 0.05, 0.025), new mp.Vector3(170, 40, 0));
    mp.attachmentMngr.register("pot_head", "prop_kitch_pot_sm", Bones.SKEL_Head, new mp.Vector3(0.1, 0, 0), new mp.Vector3(0, 270, 0));
    mp.attachmentMngr.register("bucket_head", "prop_buck_spade_06", Bones.SKEL_Head, new mp.Vector3(0.1, 0, 0), new mp.Vector3(0, 270, 0));
}
},{"./libs/skeleton.js":5}],2:[function(require,module,exports){
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
/*
    Calculate if a hit was on bone (regardless of in vehicle or not)
    @returns object(hit,bone,dist)
*/
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
/*
    Draw Debug stuff
*/
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
/*
    sorta shot sync, because you cant set peds attackable and have serverside synced hp

*/
mp.events.add('playerWeaponShot', (targetPosition, targetEntity) => {
    let weapon_hash = mp.players.local.weapon;
    if (!targetEntity) {
        let hand_pos = mp.players.local.getBoneCoords(57005, 0, 0, 0);
        // let raycast = mp.raycasting.testPointToPoint(hand_pos, targetPosition, mp.players.local, (4 | 8));
        let raycast = mp.raycasting.testCapsule(hand_pos, targetPosition, 0.3, mp.players.local, (4 | 8 | 1 | 2 | 16))
        if (raycast && raycast.surfaceNormal) {
            //mp.game.graphics.addDecal(1110 /*splatters_blood2 */ , targetPosition.x, targetPosition.y, targetPosition.z, 0 /*dirX*/ , 0 /*dirY*/ , -1 /*dirZ*/ , 0, /*rot*/ 1, 0, 4 /*width*/ , 4 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
            mp.game.graphics.addDecal(1110, raycast.position.x, raycast.position.y, raycast.position.z, 0 /*dirX*/ , 0 /*dirY*/ , 0 /*dirZ*/ , 0, /*rot*/ 1, 0, 1 /*width*/ ,1 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
            mp.game.graphics.addDecal(1110, raycast.position.x, raycast.position.y, raycast.position.z, 0 /*dirX*/ , 0 /*dirY*/ , -1 /*dirZ*/ , 0, /*rot*/ 1, 0, 1 /*width*/ ,1 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
            mp.game.graphics.addDecal(1110, raycast.position.x, raycast.position.y, raycast.position.z, 0 /*dirX*/ , 0 /*dirY*/ , 1 /*dirZ*/ , 0, /*rot*/ 1, 0, 1 /*width*/ , 1 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
            mp.game.graphics.addDecal(1110, raycast.position.x, raycast.position.y, raycast.position.z, 0 /*dirX*/ , 0 /*dirY*/ , 0 /*dirZ*/ , 0, /*rot*/ 1, 0, 1 /*width*/ , 1 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
            mp.game.graphics.addDecal(1110, raycast.position.x, raycast.position.y, raycast.position.z, 0 /*dirX*/ , -1 /*dirY*/ , 0 /*dirZ*/ , 0, /*rot*/ 1, 0, 1 /*width*/ , 1 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
            mp.game.graphics.addDecal(1110, raycast.position.x, raycast.position.y, raycast.position.z, 0 /*dirX*/ , 1 /*dirY*/ ,0 /*dirZ*/ , 0, /*rot*/ 1, 0, 1 /*width*/ , 1 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
            mp.game.graphics.addDecal(1110, raycast.position.x, raycast.position.y, raycast.position.z, 0 /*dirX*/ , 0 /*dirY*/ , 0 /*dirZ*/ , 0, /*rot*/ 1, 0, 1 /*width*/ , 1 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
            mp.game.graphics.addDecal(1110, raycast.position.x, raycast.position.y, raycast.position.z, -1 /*dirX*/ , 0 /*dirY*/ , 0 /*dirZ*/ , 0, /*rot*/ 1, 0, 1 /*width*/ , 1 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
            mp.game.graphics.addDecal(1110, raycast.position.x, raycast.position.y, raycast.position.z, 1 /*dirX*/ , 0 /*dirY*/ , 0 /*dirZ*/ , 0, /*rot*/ 1, 0, 1 /*width*/ , 1 /*height*/ , 255, 0.1, 0.1, 1.0, 150.0, false, false, false);
        }
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
/*
    Hitmarker 
*/
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
},{}],3:[function(require,module,exports){
(function (global){
require("./libs/attachmentSync.js")
require("./libs/weapon_attachments.js")
var Bones = require("./libs/skeleton.js")
require("./attachments.js")
console.log = function(...a) {
    a = a.map(function(e) {
        return JSON.stringify(e);
    })
    mp.gui.chat.push("DeBuG:" + a.join(" "))
};
mp.nametags.enabled = true;

/*
    Client Tickrate
*/
var tickRate = 1000 / 5;
setInterval(function() {
    mp.events.call("client:Tick");
}, tickRate);
/*
    enum Flags 
*/
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
global["Flags"] = [];
Object.keys(flags).forEach(function(key, value) {
    console.log("enums-> Flags." + key, "=", flags[key])
    global["Flags"][key] = flags[key];
})
/*
    mp.lerp for lerping numbers
*/
mp.lerp = (a, b, n) => {
    return (1 - n) * a + n * b;
}
/*
    shortcut for validating
*/
mp.isValid = function(val) {
    return val != null && val != undefined && val != "";
}
mp.gui.chat.activate(true)
mp.isCrouched = false;
require("./vector.js")
require("./sync.js")
require("./combat.js")
require("./movement.js")
require("./weather.js")


/*
    Max out all stats
*/
var stats = ["SP0_STAMINA", "SP0_SHOOTING_ABILITY", "SP0_STRENGTH", "SP0_STEALTH_ABILITY", "SP0_LUNG_CAPACITY"]
stats.forEach((element) => {
    mp.game.stats.statSetInt(mp.game.joaat(element), 100, false);
});
/*
    Update player Noise
*/
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
    //if (!mp.players.local.isPlayingAnim("move_crawl", "onfront_fwd", 3)) {
    //    mp.players.local.taskPlayAnim("move_crawl", "onfront_fwd", 8.0, 1.0, -1, 9, 0.0, false, false, false);
    //    mp.players.local.taskPlayAnim("move_crawl", "onfront_fwd", 8.0, 1.0, -1, 43, 0.0, false, false, false);
    //}


    //mp.players.local.taskAimGunScripted(mp.game.gameplay.getHashKey("SCRIPTED_GUN_TASK_PLANE_WING"), true, true);






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
/*
    test zombie spawning
*/
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
},{"./attachments.js":1,"./combat.js":2,"./libs/attachmentSync.js":4,"./libs/skeleton.js":5,"./libs/weapon_attachments.js":7,"./movement.js":8,"./sync.js":11,"./vector.js":12,"./weather.js":13}],4:[function(require,module,exports){
mp.attachmentMngr = {
    attachments: {},
    addFor: function(entity, id) {
        if (this.attachments.hasOwnProperty(id)) {
            if (!entity.__attachmentObjects.hasOwnProperty(id)) {
                let attInfo = this.attachments[id];
                let object = mp.objects.new(attInfo.model, entity.position);
                object.attachTo(entity.handle, (typeof(attInfo.boneName) === 'string') ? entity.getBoneIndexByName(attInfo.boneName) : entity.getBoneIndex(attInfo.boneName), attInfo.offset.x, attInfo.offset.y, attInfo.offset.z, attInfo.rotation.x, attInfo.rotation.y, attInfo.rotation.z, false, false, false, false, 2, true);
                entity.__attachmentObjects[id] = object;
            }
        } else {
            mp.game.graphics.notify(`Static Attachments Error: ~r~Unknown Attachment Used: ~w~0x${id.toString(16)}`);
        }
    },
    removeFor: function(entity, id) {
        if (entity.__attachmentObjects.hasOwnProperty(id)) {
            let obj = entity.__attachmentObjects[id];
            delete entity.__attachmentObjects[id];
            if (mp.objects.exists(obj)) {
                obj.destroy();
            }
        }
    },
    initFor: function(entity) {
        for (let attachment of entity.__attachments) {
            mp.attachmentMngr.addFor(entity, attachment);
        }
    },
    shutdownFor: function(entity) {
        for (let attachment in entity.__attachmentObjects) {
            mp.attachmentMngr.removeFor(entity, attachment);
        }
    },
    register: function(id, model, boneName, offset, rotation) {
        if (typeof(id) === 'string') {
            id = mp.game.joaat(id);
        }
        //console.log("register attachment id",id);
        if (typeof(model) === 'string') {
            model = mp.game.joaat(model);
        }
        if (!this.attachments.hasOwnProperty(id)) {
            if (mp.game.streaming.isModelInCdimage(model)) {
                this.attachments[id] = {
                    id: id,
                    model: model,
                    offset: offset,
                    rotation: rotation,
                    boneName: boneName
                };
            } else {
                mp.game.graphics.notify(`Static Attachments Error: ~r~Invalid Model (0x${model.toString(16)})`);
            }
        } else {
            mp.game.graphics.notify("Static Attachments Error: ~r~Duplicate Entry");
        }
    },
    unregister: function(id) {
        if (typeof(id) === 'string') {
            id = mp.game.joaat(id);
        }
        if (this.attachments.hasOwnProperty(id)) {
            this.attachments[id] = undefined;
        }
    },
    addLocal: function(attachmentName) {
        if (typeof(attachmentName) === 'string') {
            attachmentName = mp.game.joaat(attachmentName);
        }
        let entity = mp.players.local;
        if (!entity.__attachments || entity.__attachments.indexOf(attachmentName) === -1) {
            mp.events.callRemote("staticAttachments.Add", attachmentName.toString(36));
        }
    },
    removeLocal: function(attachmentName) {
        if (typeof(attachmentName) === 'string') {
            attachmentName = mp.game.joaat(attachmentName);
        }
        let entity = mp.players.local;
        if (entity.__attachments && entity.__attachments.indexOf(attachmentName) !== -1) {
            mp.events.callRemote("staticAttachments.Remove", attachmentName.toString(36));
        }
    },
    getAttachments: function() {
        return Object.assign({}, this.attachments);
    }
};
mp.events.add("entityStreamIn", (entity) => {
    if (entity.__attachments) {
        mp.attachmentMngr.initFor(entity);
    }
});
mp.events.add("entityStreamOut", (entity) => {
    if (entity.__attachmentObjects) {
        mp.attachmentMngr.shutdownFor(entity);
    }
});
mp.events.addDataHandler("attachmentsData", (entity, data) => {
    let newAttachments = (data.length > 0) ? data.split('|').map(att => parseInt(att, 36)) : [];
    console.log("attachmentsData",JSON.stringify(newAttachments));
    if (entity.handle !== 0) {
        let oldAttachments = entity.__attachments;
        if (!oldAttachments) {
            oldAttachments = [];
            entity.__attachmentObjects = {};
        }
        // process outdated first
        for (let attachment of oldAttachments) {
            if (newAttachments.indexOf(attachment) === -1) {
                mp.attachmentMngr.removeFor(entity, attachment);
            }
        }
        // then new attachments
        for (let attachment of newAttachments) {
            if (oldAttachments.indexOf(attachment) === -1) {
                mp.attachmentMngr.addFor(entity, attachment);
            }
        }
    }
    entity.__attachments = newAttachments;
});

function InitAttachmentsOnJoin() {
    mp.players.forEach(_player => {
        let data = _player.getVariable("attachmentsData");
        if (data && data.length > 0) {
            let atts = data.split('|').map(att => parseInt(att, 36));
            _player.__attachments = atts;
            _player.__attachmentObjects = {};
        }
    });
    mp.peds.forEach(_ped => {
        let data = _ped.getVariable("attachmentsData");
        if (data && data.length > 0) {
            let atts = data.split('|').map(att => parseInt(att, 36));
            _ped.__attachments = atts;
            _ped.__attachmentObjects = {};
        }
    });
}
InitAttachmentsOnJoin();
},{}],5:[function(require,module,exports){
var Skeleton = [];
Skeleton.SKEL_ROOT = 0;
Skeleton.FB_R_Brow_Out_000 = 1356;
Skeleton.SKEL_L_Toe0 = 2108;
Skeleton.MH_R_Elbow = 2992;
Skeleton.SKEL_L_Finger01 = 4089;
Skeleton.SKEL_L_Finger02 = 4090;
Skeleton.SKEL_L_Finger31 = 4137;
Skeleton.SKEL_L_Finger32 = 4138;
Skeleton.SKEL_L_Finger41 = 4153;
Skeleton.SKEL_L_Finger42 = 4154;
Skeleton.SKEL_L_Finger11 = 4169;
Skeleton.SKEL_L_Finger12 = 4170;
Skeleton.SKEL_L_Finger21 = 4185;
Skeleton.SKEL_L_Finger22 = 4186;
Skeleton.RB_L_ArmRoll = 5232;
Skeleton.IK_R_Hand = 6286;
Skeleton.RB_R_ThighRoll = 6442;
Skeleton.SKEL_R_Clavicle = 10706;
Skeleton.FB_R_Lip_Corner_000 = 11174;
Skeleton.SKEL_Pelvis = 11816;
Skeleton.IK_Head = 12844;
Skeleton.SKEL_L_Foot = 14201;
Skeleton.MH_R_Knee = 16335;
Skeleton.FB_LowerLipRoot_000 = 17188;
Skeleton.FB_R_Lip_Top_000 = 17719;
Skeleton.SKEL_L_Hand = 18905;
Skeleton.FB_R_CheekBone_000 = 19336;
Skeleton.FB_UpperLipRoot_000 = 20178;
Skeleton.FB_L_Lip_Top_000 = 20279;
Skeleton.FB_LowerLip_000 = 20623;
Skeleton.SKEL_R_Toe0 = 20781;
Skeleton.FB_L_CheekBone_000 = 21550;
Skeleton.MH_L_Elbow = 22711;
Skeleton.SKEL_Spine0 = 23553;
Skeleton.RB_L_ThighRoll = 23639;
Skeleton.PH_R_Foot = 24806;
Skeleton.SKEL_Spine1 = 24816;
Skeleton.SKEL_Spine2 = 24817;
Skeleton.SKEL_Spine3 = 24818;
Skeleton.FB_L_Eye_000 = 25260;
Skeleton.SKEL_L_Finger00 = 26610;
Skeleton.SKEL_L_Finger10 = 26611;
Skeleton.SKEL_L_Finger20 = 26612;
Skeleton.SKEL_L_Finger30 = 26613;
Skeleton.SKEL_L_Finger40 = 26614;
Skeleton.FB_R_Eye_000 = 27474;
Skeleton.SKEL_R_Forearm = 28252;
Skeleton.PH_R_Hand = 28422;
Skeleton.FB_L_Lip_Corner_000 = 29868;
Skeleton.SKEL_Head = 31086;
Skeleton.IK_R_Foot = 35502;
Skeleton.RB_Neck_1 = 35731;
Skeleton.IK_L_Hand = 36029;
Skeleton.SKEL_R_Calf = 36864;
Skeleton.RB_R_ArmRoll = 37119;
Skeleton.FB_Brow_Centre_000 = 37193;
Skeleton.SKEL_Neck_1 = 39317;
Skeleton.SKEL_R_UpperArm = 40269;
Skeleton.FB_R_Lid_Upper_000 = 43536;
Skeleton.RB_R_ForeArmRoll = 43810;
Skeleton.SKEL_L_UpperArm = 45509;
Skeleton.FB_L_Lid_Upper_000 = 45750;
Skeleton.MH_L_Knee = 46078;
Skeleton.FB_Jaw_000 = 46240;
Skeleton.FB_L_Lip_Bot_000 = 47419;
Skeleton.FB_Tongue_000 = 47495;
Skeleton.FB_R_Lip_Bot_000 = 49979;
Skeleton.SKEL_R_Thigh = 51826;
Skeleton.SKEL_R_Foot = 52301;
Skeleton.IK_Root = 56604;
Skeleton.SKEL_R_Hand = 57005;
Skeleton.SKEL_Spine_Root = 57597;
Skeleton.PH_L_Foot = 57717;
Skeleton.SKEL_L_Thigh = 58271;
Skeleton.FB_L_Brow_Out_000 = 58331;
Skeleton.SKEL_R_Finger00 = 58866;
Skeleton.SKEL_R_Finger10 = 58867;
Skeleton.SKEL_R_Finger20 = 58868;
Skeleton.SKEL_R_Finger30 = 58869;
Skeleton.SKEL_R_Finger40 = 58870;
Skeleton.PH_L_Hand = 60309;
Skeleton.RB_L_ForeArmRoll = 61007;
Skeleton.SKEL_L_Forearm = 61163;
Skeleton.FB_UpperLip_000 = 61839;
Skeleton.SKEL_L_Calf = 63931;
Skeleton.SKEL_R_Finger01 = 64016;
Skeleton.SKEL_R_Finger02 = 64017;
Skeleton.SKEL_R_Finger31 = 64064;
Skeleton.SKEL_R_Finger32 = 64065;
Skeleton.SKEL_R_Finger41 = 64080;
Skeleton.SKEL_R_Finger42 = 64081;
Skeleton.SKEL_R_Finger11 = 64096;
Skeleton.SKEL_R_Finger12 = 64097;
Skeleton.SKEL_R_Finger21 = 64112;
Skeleton.SKEL_R_Finger22 = 64113;
Skeleton.SKEL_L_Clavicle = 64729;
Skeleton.FACIAL_facialRoot = 65068;
Skeleton.IK_L_Foot = 65245;
module.exports = Skeleton;
},{}],6:[function(require,module,exports){
module.exports={
  "2725352035": {
    "HashKey": "WEAPON_UNARMED",
    "NameGXT": "WT_UNARMED",
    "DescriptionGXT": "WTD_UNARMED",
    "Name": "Unarmed",
    "Description": "",
    "Group": "GROUP_UNARMED",
    "ModelHashKey": "",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "2578778090": {
    "HashKey": "WEAPON_KNIFE",
    "NameGXT": "WT_KNIFE",
    "DescriptionGXT": "WTD_KNIFE",
    "Name": "Knife",
    "Description": "This carbon steel 7\" bladed knife is dual edged with a serrated spine to provide improved stabbing and thrusting capabilities.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_knife_01",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "1737195953": {
    "HashKey": "WEAPON_NIGHTSTICK",
    "NameGXT": "WT_NGTSTK",
    "DescriptionGXT": "WTD_NGTSTK",
    "Name": "Nightstick",
    "Description": "24\" polycarbonate side-handled nightstick.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_nightstick",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "1317494643": {
    "HashKey": "WEAPON_HAMMER",
    "NameGXT": "WT_HAMMER",
    "DescriptionGXT": "WTD_HAMMER",
    "Name": "Hammer",
    "Description": "A robust, multi-purpose hammer with wooden handle and curved claw, this old classic still nails the competition.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_hammer",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "2508868239": {
    "HashKey": "WEAPON_BAT",
    "NameGXT": "WT_BAT",
    "DescriptionGXT": "WTD_BAT",
    "Name": "Baseball Bat",
    "Description": "Aluminum baseball bat with leather grip. Lightweight yet powerful for all you big hitters out there.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_bat",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "1141786504": {
    "HashKey": "WEAPON_GOLFCLUB",
    "NameGXT": "WT_GOLFCLUB",
    "DescriptionGXT": "WTD_GOLFCLUB",
    "Name": "Golf Club",
    "Description": "Standard length, mid iron golf club with rubber grip for a lethal short game.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_gclub",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "2227010557": {
    "HashKey": "WEAPON_CROWBAR",
    "NameGXT": "WT_CROWBAR",
    "DescriptionGXT": "WTD_CROWBAR",
    "Name": "Crowbar",
    "Description": "Heavy-duty crowbar forged from high quality, tempered steel for that extra leverage you need to get the job done.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_crowbar",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "453432689": {
    "HashKey": "WEAPON_PISTOL",
    "NameGXT": "WT_PIST",
    "DescriptionGXT": "WT_PIST_DESC",
    "Name": "Pistol",
    "Description": "Standard handgun. A .45 caliber pistol with a magazine capacity of 12 rounds that can be extended to 16.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "W_PI_PISTOL",
    "DefaultClipSize": 12,
    "Components": {
      "4275109233": {
        "HashKey": "COMPONENT_PISTOL_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_P_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Pistol.",
        "ModelHashKey": "w_pi_pistol_mag1",
        "IsDefault": true
      },
      "3978713628": {
        "HashKey": "COMPONENT_PISTOL_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_P_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Pistol.",
        "ModelHashKey": "w_pi_pistol_mag2",
        "IsDefault": false
      },
      "899381934": {
        "HashKey": "COMPONENT_AT_PI_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_pi_flsh",
        "IsDefault": false
      },
      "1709866683": {
        "HashKey": "COMPONENT_AT_PI_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_PI_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_pi_supp_2",
        "IsDefault": false
      },
      "3610841222": {
        "HashKey": "COMPONENT_PISTOL_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_GOLD",
        "DescriptionGXT": "WCD_VAR_P",
        "Name": "Yusuf Amir Luxury Finish",
        "Description": "",
        "ModelHashKey": "W_PI_Pistol_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "1593441988": {
    "HashKey": "WEAPON_COMBATPISTOL",
    "NameGXT": "WT_PIST_CBT",
    "DescriptionGXT": "WTD_PIST_CBT",
    "Name": "Combat Pistol",
    "Description": "A compact, lightweight, semi-automatic pistol designed for law enforcement and personal defense. 12-round magazine with option to extend to 16 rounds.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "W_PI_COMBATPISTOL",
    "DefaultClipSize": 12,
    "Components": {
      "119648377": {
        "HashKey": "COMPONENT_COMBATPISTOL_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CP_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Combat Pistol.",
        "ModelHashKey": "w_pi_combatpistol_mag1",
        "IsDefault": true
      },
      "3598405421": {
        "HashKey": "COMPONENT_COMBATPISTOL_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CP_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Combat Pistol.",
        "ModelHashKey": "w_pi_combatpistol_mag2",
        "IsDefault": false
      },
      "899381934": {
        "HashKey": "COMPONENT_AT_PI_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_pi_flsh",
        "IsDefault": false
      },
      "3271853210": {
        "HashKey": "COMPONENT_AT_PI_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_PI_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_pi_supp",
        "IsDefault": false
      },
      "3328527730": {
        "HashKey": "COMPONENT_COMBATPISTOL_VARMOD_LOWRIDER",
        "NameGXT": "WCT_VAR_GOLD",
        "DescriptionGXT": "WCD_VAR_CBP",
        "Name": "Yusuf Amir Luxury Finish",
        "Description": "",
        "ModelHashKey": "w_pi_combatpistol_luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "584646201": {
    "HashKey": "WEAPON_APPISTOL",
    "NameGXT": "WT_PIST_AP",
    "DescriptionGXT": "WTD_PIST_AP",
    "Name": "AP Pistol",
    "Description": "High-penetration, fully-automatic pistol. Holds 18 rounds in magazine with option to extend to 36 rounds.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "W_PI_APPISTOL",
    "DefaultClipSize": 18,
    "Components": {
      "834974250": {
        "HashKey": "COMPONENT_APPISTOL_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_AP_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for AP Pistol.",
        "ModelHashKey": "w_pi_appistol_mag1",
        "IsDefault": true
      },
      "614078421": {
        "HashKey": "COMPONENT_APPISTOL_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_AP_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for AP Pistol.",
        "ModelHashKey": "w_pi_appistol_mag2",
        "IsDefault": false
      },
      "899381934": {
        "HashKey": "COMPONENT_AT_PI_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_pi_flsh",
        "IsDefault": false
      },
      "3271853210": {
        "HashKey": "COMPONENT_AT_PI_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_PI_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_pi_supp",
        "IsDefault": false
      },
      "2608252716": {
        "HashKey": "COMPONENT_APPISTOL_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_METAL",
        "DescriptionGXT": "WCD_VAR_AP",
        "Name": "Gilded Gun Metal Finish",
        "Description": "",
        "ModelHashKey": "W_PI_APPistol_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "2578377531": {
    "HashKey": "WEAPON_PISTOL50",
    "NameGXT": "WT_PIST_50",
    "DescriptionGXT": "WTD_PIST_50",
    "Name": "Pistol .50",
    "Description": "High-impact pistol that delivers immense power but with extremely strong recoil. Holds 9 rounds in magazine.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "W_PI_PISTOL50",
    "DefaultClipSize": 9,
    "Components": {
      "580369945": {
        "HashKey": "COMPONENT_PISTOL50_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_P50_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Pistol .50.",
        "ModelHashKey": "W_PI_PISTOL50_Mag1",
        "IsDefault": true
      },
      "3654528146": {
        "HashKey": "COMPONENT_PISTOL50_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_P50_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Pistol .50.",
        "ModelHashKey": "W_PI_PISTOL50_Mag2",
        "IsDefault": false
      },
      "899381934": {
        "HashKey": "COMPONENT_AT_PI_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_pi_flsh",
        "IsDefault": false
      },
      "2805810788": {
        "HashKey": "COMPONENT_AT_AR_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP2",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp_02",
        "IsDefault": false
      },
      "2008591151": {
        "HashKey": "COMPONENT_PISTOL50_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_SIL",
        "DescriptionGXT": "WCD_VAR_P50",
        "Name": "Platinum Pearl Deluxe Finish",
        "Description": "",
        "ModelHashKey": "W_PI_Pistol50_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "324215364": {
    "HashKey": "WEAPON_MICROSMG",
    "NameGXT": "WT_SMG_MCR",
    "DescriptionGXT": "WTD_SMG_MCR",
    "Name": "Micro SMG",
    "Description": "Combines compact design with a high rate of fire at approximately 700-900 rounds per minute.",
    "Group": "GROUP_SMG",
    "ModelHashKey": "w_sb_microsmg",
    "DefaultClipSize": 16,
    "Components": {
      "3410538224": {
        "HashKey": "COMPONENT_MICROSMG_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCDMSMG_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Micro SMG.",
        "ModelHashKey": "w_sb_microsmg_mag1",
        "IsDefault": true
      },
      "283556395": {
        "HashKey": "COMPONENT_MICROSMG_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCDMSMG_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Micro SMG.",
        "ModelHashKey": "w_sb_microsmg_mag2",
        "IsDefault": false
      },
      "899381934": {
        "HashKey": "COMPONENT_AT_PI_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_pi_flsh",
        "IsDefault": false
      },
      "2637152041": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO",
        "NameGXT": "WCT_SCOPE_MAC",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro",
        "IsDefault": false
      },
      "2805810788": {
        "HashKey": "COMPONENT_AT_AR_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP2",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp_02",
        "IsDefault": false
      },
      "1215999497": {
        "HashKey": "COMPONENT_MICROSMG_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_GOLD",
        "DescriptionGXT": "WCD_VAR_MSMG",
        "Name": "Yusuf Amir Luxury Finish",
        "Description": "",
        "ModelHashKey": "W_SB_MicroSMG_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "736523883": {
    "HashKey": "WEAPON_SMG",
    "NameGXT": "WT_SMG",
    "DescriptionGXT": "WTD_SMG",
    "Name": "SMG",
    "Description": "This is known as a good all-round submachine gun. Lightweight with an accurate sight and 30-round magazine capacity.",
    "Group": "GROUP_SMG",
    "ModelHashKey": "w_sb_smg",
    "DefaultClipSize": 30,
    "Components": {
      "643254679": {
        "HashKey": "COMPONENT_SMG_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_SMG_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for SMG.",
        "ModelHashKey": "w_sb_smg_mag1",
        "IsDefault": true
      },
      "889808635": {
        "HashKey": "COMPONENT_SMG_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_SMG_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for SMG.",
        "ModelHashKey": "w_sb_smg_mag2",
        "IsDefault": false
      },
      "2043113590": {
        "HashKey": "COMPONENT_SMG_CLIP_03",
        "NameGXT": "WCT_CLIP_DRM",
        "DescriptionGXT": "WCD_CLIP3",
        "Name": "Drum Magazine",
        "Description": "Expanded capacity and slower reload.",
        "ModelHashKey": "w_sb_smg_boxmag",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "1019656791": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO_02",
        "NameGXT": "WCT_SCOPE_MAC",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro_2",
        "IsDefault": false
      },
      "3271853210": {
        "HashKey": "COMPONENT_AT_PI_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_PI_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_pi_supp",
        "IsDefault": false
      },
      "663170192": {
        "HashKey": "COMPONENT_SMG_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_GOLD",
        "DescriptionGXT": "WCD_VAR_SMG",
        "Name": "Yusuf Amir Luxury Finish",
        "Description": "",
        "ModelHashKey": "W_SB_SMG_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "4024951519": {
    "HashKey": "WEAPON_ASSAULTSMG",
    "NameGXT": "WT_SMG_ASL",
    "DescriptionGXT": "WTD_SMG_ASL",
    "Name": "Assault SMG",
    "Description": "A high-capacity submachine gun that is both compact and lightweight. Holds up to 30 bullets in one magazine.",
    "Group": "GROUP_SMG",
    "ModelHashKey": "w_sb_assaultsmg",
    "DefaultClipSize": 30,
    "Components": {
      "2366834608": {
        "HashKey": "COMPONENT_ASSAULTSMG_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Default Clip",
        "Description": "",
        "ModelHashKey": "W_SB_ASSAULTSMG_Mag1",
        "IsDefault": true
      },
      "3141985303": {
        "HashKey": "COMPONENT_ASSAULTSMG_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Extended Clip",
        "Description": "",
        "ModelHashKey": "W_SB_ASSAULTSMG_Mag2",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2637152041": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO",
        "NameGXT": "WCT_SCOPE_MAC",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro",
        "IsDefault": false
      },
      "2805810788": {
        "HashKey": "COMPONENT_AT_AR_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP2",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp_02",
        "IsDefault": false
      },
      "663517359": {
        "HashKey": "COMPONENT_ASSAULTSMG_VARMOD_LOWRIDER",
        "NameGXT": "WCT_VAR_GOLD",
        "DescriptionGXT": "WCD_VAR_ASMG",
        "Name": "Yusuf Amir Luxury Finish",
        "Description": "",
        "ModelHashKey": "w_sb_assaultsmg_luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "3220176749": {
    "HashKey": "WEAPON_ASSAULTRIFLE",
    "NameGXT": "WT_RIFLE_ASL",
    "DescriptionGXT": "WTD_RIFLE_ASL",
    "Name": "Assault Rifle",
    "Description": "This standard assault rifle boasts a large capacity magazine and long distance accuracy.",
    "Group": "GROUP_RIFLE",
    "ModelHashKey": "W_AR_ASSAULTRIFLE",
    "DefaultClipSize": 30,
    "Components": {
      "3193891350": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_AR_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Assault Rifle.",
        "ModelHashKey": "w_ar_assaultrifle_mag1",
        "IsDefault": true
      },
      "2971750299": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_AR_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Assault Rifle.",
        "ModelHashKey": "w_ar_assaultrifle_mag2",
        "IsDefault": false
      },
      "3689981245": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_CLIP_03",
        "NameGXT": "WCT_CLIP_DRM",
        "DescriptionGXT": "WCD_CLIP3",
        "Name": "Drum Magazine",
        "Description": "Expanded capacity and slower reload.",
        "ModelHashKey": "w_ar_assaultrifle_boxmag",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2637152041": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO",
        "NameGXT": "WCT_SCOPE_MAC",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro",
        "IsDefault": false
      },
      "2805810788": {
        "HashKey": "COMPONENT_AT_AR_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP2",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp_02",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      },
      "1319990579": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_GOLD",
        "DescriptionGXT": "WCD_VAR_AR",
        "Name": "Yusuf Amir Luxury Finish",
        "Description": "",
        "ModelHashKey": "W_AR_AssaultRifle_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "2210333304": {
    "HashKey": "WEAPON_CARBINERIFLE",
    "NameGXT": "WT_RIFLE_CBN",
    "DescriptionGXT": "WTD_RIFLE_CBN",
    "Name": "Carbine Rifle",
    "Description": "Combining long distance accuracy with a high-capacity magazine, the carbine rifle can be relied on to make the hit.",
    "Group": "GROUP_RIFLE",
    "ModelHashKey": "W_AR_CARBINERIFLE",
    "DefaultClipSize": 30,
    "Components": {
      "2680042476": {
        "HashKey": "COMPONENT_CARBINERIFLE_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CR_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Carbine Rifle.",
        "ModelHashKey": "w_ar_carbinerifle_mag1",
        "IsDefault": true
      },
      "2433783441": {
        "HashKey": "COMPONENT_CARBINERIFLE_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CR_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Carbine Rifle.",
        "ModelHashKey": "w_ar_carbinerifle_mag2",
        "IsDefault": false
      },
      "3127044405": {
        "HashKey": "COMPONENT_CARBINERIFLE_CLIP_03",
        "NameGXT": "WCT_CLIP_BOX",
        "DescriptionGXT": "WCD_CLIP3",
        "Name": "Box Magazine",
        "Description": "Expanded capacity and slower reload.",
        "ModelHashKey": "w_ar_carbinerifle_boxmag",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "1967214384": {
        "HashKey": "COMPONENT_AT_RAILCOVER_01",
        "NameGXT": "WCT_RAIL",
        "DescriptionGXT": "WCD_AT_RAIL",
        "Name": "",
        "Description": "",
        "ModelHashKey": "w_at_railcover_01",
        "IsDefault": false
      },
      "2698550338": {
        "HashKey": "COMPONENT_AT_SCOPE_MEDIUM",
        "NameGXT": "WCT_SCOPE_MED",
        "DescriptionGXT": "WCD_SCOPE_MED",
        "Name": "Scope",
        "Description": "Extended-range zoom functionality.",
        "ModelHashKey": "w_at_scope_medium",
        "IsDefault": false
      },
      "2205435306": {
        "HashKey": "COMPONENT_AT_AR_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      },
      "3634075224": {
        "HashKey": "COMPONENT_CARBINERIFLE_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_GOLD",
        "DescriptionGXT": "WCD_VAR_CR",
        "Name": "Yusuf Amir Luxury Finish",
        "Description": "",
        "ModelHashKey": "W_AR_CarbineRifle_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "2937143193": {
    "HashKey": "WEAPON_ADVANCEDRIFLE",
    "NameGXT": "WT_RIFLE_ADV",
    "DescriptionGXT": "WTD_RIFLE_ADV",
    "Name": "Advanced Rifle",
    "Description": "The most lightweight and compact of all assault rifles, without compromising accuracy and rate of fire.",
    "Group": "GROUP_RIFLE",
    "ModelHashKey": "W_AR_ADVANCEDRIFLE",
    "DefaultClipSize": 30,
    "Components": {
      "4203716879": {
        "HashKey": "COMPONENT_ADVANCEDRIFLE_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_AR_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Assault Rifle.",
        "ModelHashKey": "w_ar_advancedrifle_mag1",
        "IsDefault": true
      },
      "2395064697": {
        "HashKey": "COMPONENT_ADVANCEDRIFLE_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_AR_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Assault Rifle.",
        "ModelHashKey": "w_ar_advancedrifle_mag2",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2855028148": {
        "HashKey": "COMPONENT_AT_SCOPE_SMALL",
        "NameGXT": "WCT_SCOPE_SML",
        "DescriptionGXT": "WCD_SCOPE_SML",
        "Name": "Scope",
        "Description": "Medium-range zoom functionality.",
        "ModelHashKey": "w_at_scope_small",
        "IsDefault": false
      },
      "2205435306": {
        "HashKey": "COMPONENT_AT_AR_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp",
        "IsDefault": false
      },
      "930927479": {
        "HashKey": "COMPONENT_ADVANCEDRIFLE_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_METAL",
        "DescriptionGXT": "WCD_VAR_ADR",
        "Name": "Gilded Gun Metal Finish",
        "Description": "",
        "ModelHashKey": "W_AR_AdvancedRifle_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "2634544996": {
    "HashKey": "WEAPON_MG",
    "NameGXT": "WT_MG",
    "DescriptionGXT": "WTD_MG",
    "Name": "MG",
    "Description": "General purpose machine gun that combines rugged design with dependable performance. Long range penetrative power. Very effective against large groups.",
    "Group": "GROUP_MG",
    "ModelHashKey": "w_mg_mg",
    "DefaultClipSize": 54,
    "Components": {
      "4097109892": {
        "HashKey": "COMPONENT_MG_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_MG_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for MG.",
        "ModelHashKey": "w_mg_mg_mag1",
        "IsDefault": true
      },
      "2182449991": {
        "HashKey": "COMPONENT_MG_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_MG_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for MG.",
        "ModelHashKey": "w_mg_mg_mag2",
        "IsDefault": false
      },
      "1006677997": {
        "HashKey": "COMPONENT_AT_SCOPE_SMALL_02",
        "NameGXT": "WCT_SCOPE_SML",
        "DescriptionGXT": "WCD_SCOPE_SML",
        "Name": "Scope",
        "Description": "Medium-range zoom functionality.",
        "ModelHashKey": "w_at_scope_small_2",
        "IsDefault": false
      },
      "3604658878": {
        "HashKey": "COMPONENT_MG_VARMOD_LOWRIDER",
        "NameGXT": "WCT_VAR_GOLD",
        "DescriptionGXT": "WCD_VAR_MG",
        "Name": "Yusuf Amir Luxury Finish",
        "Description": "",
        "ModelHashKey": "w_mg_mg_luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "2144741730": {
    "HashKey": "WEAPON_COMBATMG",
    "NameGXT": "WT_MG_CBT",
    "DescriptionGXT": "WTD_MG_CBT",
    "Name": "Combat MG",
    "Description": "Lightweight, compact machine gun that combines excellent maneuverability with a high rate of fire to devastating effect.",
    "Group": "GROUP_MG",
    "ModelHashKey": "w_mg_combatmg",
    "DefaultClipSize": 100,
    "Components": {
      "3791631178": {
        "HashKey": "COMPONENT_COMBATMG_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCDCMG_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Combat MG.",
        "ModelHashKey": "w_mg_combatmg_mag1",
        "IsDefault": true
      },
      "3603274966": {
        "HashKey": "COMPONENT_COMBATMG_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCDCMG_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Combat MG.",
        "ModelHashKey": "w_mg_combatmg_mag2",
        "IsDefault": false
      },
      "2698550338": {
        "HashKey": "COMPONENT_AT_SCOPE_MEDIUM",
        "NameGXT": "WCT_SCOPE_MED",
        "DescriptionGXT": "WCD_SCOPE_MED",
        "Name": "Scope",
        "Description": "Extended-range zoom functionality.",
        "ModelHashKey": "w_at_scope_medium",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      },
      "2466172125": {
        "HashKey": "COMPONENT_COMBATMG_VARMOD_LOWRIDER",
        "NameGXT": "WCT_VAR_ETCHM",
        "DescriptionGXT": "WCD_VAR_CBMG",
        "Name": "Etched Gun Metal Finish",
        "Description": "",
        "ModelHashKey": "w_mg_combatmg_luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "487013001": {
    "HashKey": "WEAPON_PUMPSHOTGUN",
    "NameGXT": "WT_SG_PMP",
    "DescriptionGXT": "WTD_SG_PMP",
    "Name": "Pump Shotgun",
    "Description": "Standard shotgun ideal for short-range combat. A high-projectile spread makes up for its lower accuracy at long range.",
    "Group": "GROUP_SHOTGUN",
    "ModelHashKey": "w_sg_pumpshotgun",
    "DefaultClipSize": 8,
    "Components": {
      "3513717816": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_CLIP_01",
        "NameGXT": "WCT_INVALID",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "",
        "Description": "",
        "ModelHashKey": "",
        "IsDefault": true
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "3859329886": {
        "HashKey": "COMPONENT_AT_SR_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_SR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_sr_supp_2",
        "IsDefault": false
      },
      "2732039643": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_VARMOD_LOWRIDER",
        "NameGXT": "WCT_VAR_GOLD",
        "DescriptionGXT": "WCD_VAR_PSHT",
        "Name": "Yusuf Amir Luxury Finish",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgun_luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "2017895192": {
    "HashKey": "WEAPON_SAWNOFFSHOTGUN",
    "NameGXT": "WT_SG_SOF",
    "DescriptionGXT": "WTD_SG_SOF",
    "Name": "Sawed-Off Shotgun",
    "Description": "This single-barrel, sawed-off shotgun compensates for its low range and ammo capacity with devastating efficiency in close combat.",
    "Group": "GROUP_SHOTGUN",
    "ModelHashKey": "w_sg_sawnoff",
    "DefaultClipSize": 8,
    "Components": {
      "3352699429": {
        "HashKey": "COMPONENT_SAWNOFFSHOTGUN_CLIP_01",
        "NameGXT": "WCT_INVALID",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "",
        "Description": "",
        "ModelHashKey": "",
        "IsDefault": true
      },
      "2242268665": {
        "HashKey": "COMPONENT_SAWNOFFSHOTGUN_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_METAL",
        "DescriptionGXT": "WCD_VAR_SOF",
        "Name": "Gilded Gun Metal Finish",
        "Description": "",
        "ModelHashKey": "W_SG_Sawnoff_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "3800352039": {
    "HashKey": "WEAPON_ASSAULTSHOTGUN",
    "NameGXT": "WT_SG_ASL",
    "DescriptionGXT": "WTD_SG_ASL",
    "Name": "Assault Shotgun",
    "Description": "Fully automatic shotgun with 8 round magazine and high rate of fire.",
    "Group": "GROUP_SHOTGUN",
    "ModelHashKey": "w_sg_assaultshotgun",
    "DefaultClipSize": 8,
    "Components": {
      "2498239431": {
        "HashKey": "COMPONENT_ASSAULTSHOTGUN_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_AS_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Assault Shotgun.",
        "ModelHashKey": "w_sg_assaultshotgun_mag1",
        "IsDefault": true
      },
      "2260565874": {
        "HashKey": "COMPONENT_ASSAULTSHOTGUN_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_AS_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Assault Shotgun.",
        "ModelHashKey": "w_sg_assaultshotgun_mag2",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2205435306": {
        "HashKey": "COMPONENT_AT_AR_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "2640438543": {
    "HashKey": "WEAPON_BULLPUPSHOTGUN",
    "NameGXT": "WT_SG_BLP",
    "DescriptionGXT": "WTD_SG_BLP",
    "Name": "Bullpup Shotgun",
    "Description": "More than makes up for its slow, pump-action rate of fire with its range and spread.  Decimates anything in its projectile path.",
    "Group": "GROUP_SHOTGUN",
    "ModelHashKey": "w_sg_bullpupshotgun",
    "DefaultClipSize": 14,
    "Components": {
      "3377353998": {
        "HashKey": "COMPONENT_BULLPUPSHOTGUN_CLIP_01",
        "NameGXT": "WCT_INVALID",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "",
        "Description": "",
        "ModelHashKey": "",
        "IsDefault": true
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2805810788": {
        "HashKey": "COMPONENT_AT_AR_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP2",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp_02",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "911657153": {
    "HashKey": "WEAPON_STUNGUN",
    "NameGXT": "WT_STUN",
    "DescriptionGXT": "WTD_STUN",
    "Name": "Stun Gun",
    "Description": "Fires a projectile that administers a voltage capable of temporarily stunning an assailant. Takes approximately 4 seconds to recharge after firing.",
    "Group": "GROUP_STUNGUN",
    "ModelHashKey": "w_pi_stungun",
    "DefaultClipSize": 2104529083,
    "Components": {},
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "100416529": {
    "HashKey": "WEAPON_SNIPERRIFLE",
    "NameGXT": "WT_SNIP_RIF",
    "DescriptionGXT": "WTD_SNIP_RIF",
    "Name": "Sniper Rifle",
    "Description": "Standard sniper rifle. Ideal for situations that require accuracy at long range. Limitations include slow reload speed and very low rate of fire.",
    "Group": "GROUP_SNIPER",
    "ModelHashKey": "w_sr_sniperrifle",
    "DefaultClipSize": 10,
    "Components": {
      "2613461129": {
        "HashKey": "COMPONENT_SNIPERRIFLE_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_SR_CLIP1",
        "Name": "Default Clip",
        "Description": "",
        "ModelHashKey": "w_sr_sniperrifle_mag1",
        "IsDefault": true
      },
      "2805810788": {
        "HashKey": "COMPONENT_AT_AR_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP2",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp_02",
        "IsDefault": false
      },
      "3527687644": {
        "HashKey": "COMPONENT_AT_SCOPE_LARGE",
        "NameGXT": "WCT_SCOPE_LRG",
        "DescriptionGXT": "WCD_SCOPE_LRG",
        "Name": "Scope",
        "Description": "Long-range zoom functionality.",
        "ModelHashKey": "w_at_scope_large",
        "IsDefault": true
      },
      "3159677559": {
        "HashKey": "COMPONENT_AT_SCOPE_MAX",
        "NameGXT": "WCT_SCOPE_MAX",
        "DescriptionGXT": "WCD_SCOPE_MAX",
        "Name": "Advanced Scope",
        "Description": "Maximum zoom functionality.",
        "ModelHashKey": "w_at_scope_max",
        "IsDefault": true
      },
      "1077065191": {
        "HashKey": "COMPONENT_SNIPERRIFLE_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_WOOD",
        "DescriptionGXT": "WCD_VAR_SNP",
        "Name": "Etched Wood Grip Finish",
        "Description": "",
        "ModelHashKey": "W_SR_SniperRifle_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "205991906": {
    "HashKey": "WEAPON_HEAVYSNIPER",
    "NameGXT": "WT_SNIP_HVY",
    "DescriptionGXT": "WTD_SNIP_HVY",
    "Name": "Heavy Sniper",
    "Description": "Features armor-piercing rounds for heavy damage. Comes with laser scope as standard.",
    "Group": "GROUP_SNIPER",
    "ModelHashKey": "w_sr_heavysniper",
    "DefaultClipSize": 6,
    "Components": {
      "1198478068": {
        "HashKey": "COMPONENT_HEAVYSNIPER_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_HS_CLIP1",
        "Name": "Default Clip",
        "Description": "",
        "ModelHashKey": "w_sr_heavysniper_mag1",
        "IsDefault": true
      },
      "3527687644": {
        "HashKey": "COMPONENT_AT_SCOPE_LARGE",
        "NameGXT": "WCT_SCOPE_LRG",
        "DescriptionGXT": "WCD_SCOPE_LRG",
        "Name": "Scope",
        "Description": "Long-range zoom functionality.",
        "ModelHashKey": "w_at_scope_large",
        "IsDefault": true
      },
      "3159677559": {
        "HashKey": "COMPONENT_AT_SCOPE_MAX",
        "NameGXT": "WCT_SCOPE_MAX",
        "DescriptionGXT": "WCD_SCOPE_MAX",
        "Name": "Advanced Scope",
        "Description": "Maximum zoom functionality.",
        "ModelHashKey": "w_at_scope_max",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "2726580491": {
    "HashKey": "WEAPON_GRENADELAUNCHER",
    "NameGXT": "WT_GL",
    "DescriptionGXT": "WTD_GL",
    "Name": "Grenade Launcher",
    "Description": "A compact, lightweight grenade launcher with semi-automatic functionality. Holds up to 10 rounds.",
    "Group": "GROUP_HEAVY",
    "ModelHashKey": "w_lr_grenadelauncher",
    "DefaultClipSize": 10,
    "Components": {
      "296639639": {
        "HashKey": "COMPONENT_GRENADELAUNCHER_CLIP_01",
        "NameGXT": "WCT_INVALID",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "",
        "Description": "",
        "ModelHashKey": "w_lr_40mm",
        "IsDefault": true
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      },
      "2855028148": {
        "HashKey": "COMPONENT_AT_SCOPE_SMALL",
        "NameGXT": "WCT_SCOPE_SML",
        "DescriptionGXT": "WCD_SCOPE_SML",
        "Name": "Scope",
        "Description": "Medium-range zoom functionality.",
        "ModelHashKey": "w_at_scope_small",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "2982836145": {
    "HashKey": "WEAPON_RPG",
    "NameGXT": "WT_RPG",
    "DescriptionGXT": "WTD_RPG",
    "Name": "RPG",
    "Description": "A portable, shoulder-launched, anti-tank weapon that fires explosive warheads. Very effective for taking down vehicles or large groups of assailants.",
    "Group": "GROUP_HEAVY",
    "ModelHashKey": "w_lr_rpg",
    "DefaultClipSize": 1,
    "Components": {
      "1319465907": {
        "HashKey": "COMPONENT_RPG_CLIP_01",
        "NameGXT": "WCT_INVALID",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "",
        "Description": "",
        "ModelHashKey": "",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "1119849093": {
    "HashKey": "WEAPON_MINIGUN",
    "NameGXT": "WT_MINIGUN",
    "DescriptionGXT": "WTD_MINIGUN",
    "Name": "Minigun",
    "Description": "A devastating 6-barrel machine gun that features Gatling-style rotating barrels. Very high rate of fire (2000 to 6000 rounds per minute).",
    "Group": "GROUP_HEAVY",
    "ModelHashKey": "w_mg_minigun",
    "DefaultClipSize": 15000,
    "Components": {
      "3370020614": {
        "HashKey": "COMPONENT_MINIGUN_CLIP_01",
        "NameGXT": "WCT_INVALID",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "",
        "Description": "",
        "ModelHashKey": "",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "2481070269": {
    "HashKey": "WEAPON_GRENADE",
    "NameGXT": "WT_GNADE",
    "DescriptionGXT": "WTD_GNADE",
    "Name": "Grenade",
    "Description": "Standard fragmentation grenade. Pull pin, throw, then find cover. Ideal for eliminating clustered assailants.",
    "Group": "GROUP_THROWN",
    "ModelHashKey": "w_ex_grenadefrag",
    "DefaultClipSize": 1,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "741814745": {
    "HashKey": "WEAPON_STICKYBOMB",
    "NameGXT": "WT_GNADE_STK",
    "DescriptionGXT": "WTD_GNADE_STK",
    "Name": "Sticky Bomb",
    "Description": "A plastic explosive charge fitted with a remote detonator. Can be thrown and then detonated or attached to a vehicle then detonated.",
    "Group": "GROUP_THROWN",
    "ModelHashKey": "w_ex_pe",
    "DefaultClipSize": 1,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "4256991824": {
    "HashKey": "WEAPON_SMOKEGRENADE",
    "NameGXT": "WT_GNADE_SMK",
    "DescriptionGXT": "WTD_GNADE_SMK",
    "Name": "Tear Gas",
    "Description": "Tear gas grenade, particularly effective at incapacitating multiple assailants. Sustained exposure can be lethal.",
    "Group": "GROUP_THROWN",
    "ModelHashKey": "w_ex_grenadesmoke",
    "DefaultClipSize": 1,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "2694266206": {
    "HashKey": "WEAPON_BZGAS",
    "NameGXT": "WT_BZGAS",
    "DescriptionGXT": "WTD_BZGAS",
    "Name": "BZ Gas",
    "Description": "",
    "Group": "GROUP_THROWN",
    "ModelHashKey": "w_ex_grenadesmoke",
    "DefaultClipSize": 1,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "615608432": {
    "HashKey": "WEAPON_MOLOTOV",
    "NameGXT": "WT_MOLOTOV",
    "DescriptionGXT": "WTD_MOLOTOV",
    "Name": "Molotov",
    "Description": "Crude yet highly effective incendiary weapon. No happy hour with this cocktail.",
    "Group": "GROUP_THROWN",
    "ModelHashKey": "w_ex_molotov",
    "DefaultClipSize": 1,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "101631238": {
    "HashKey": "WEAPON_FIREEXTINGUISHER",
    "NameGXT": "WT_FIRE",
    "DescriptionGXT": "WTD_FIRE",
    "Name": "Fire Extinguisher",
    "Description": "",
    "Group": "GROUP_FIREEXTINGUISHER",
    "ModelHashKey": "w_am_fire_exting",
    "DefaultClipSize": 2000,
    "Components": {},
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "883325847": {
    "HashKey": "WEAPON_PETROLCAN",
    "NameGXT": "WT_PETROL",
    "DescriptionGXT": "WTD_PETROL",
    "Name": "Jerry Can",
    "Description": "Leaves a trail of gasoline that can be ignited.",
    "Group": "GROUP_PETROLCAN",
    "ModelHashKey": "w_am_jerrycan",
    "DefaultClipSize": 4500,
    "Components": {},
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "core"
  },
  "600439132": {
    "HashKey": "WEAPON_BALL",
    "NameGXT": "WT_BALL",
    "DescriptionGXT": "WTD_BALL",
    "Name": "Ball",
    "Description": "",
    "Group": "GROUP_THROWN",
    "ModelHashKey": "w_am_baseball",
    "DefaultClipSize": 1,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "1233104067": {
    "HashKey": "WEAPON_FLARE",
    "NameGXT": "WT_FLARE",
    "DescriptionGXT": "WTD_FLARE",
    "Name": "Flare",
    "Description": "",
    "Group": "GROUP_THROWN",
    "ModelHashKey": "w_am_flare",
    "DefaultClipSize": 1,
    "Components": {},
    "Tints": [],
    "DLC": "core"
  },
  "3249783761": {
    "HashKey": "WEAPON_REVOLVER",
    "NameGXT": "WT_REVOLVER",
    "DescriptionGXT": "WTD_REVOLVER",
    "Name": "Heavy Revolver",
    "Description": "A handgun with enough stopping power to drop a crazed rhino, and heavy enough to beat it to death if you're out of ammo. Part of Executives and Other Criminals.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "w_pi_revolver",
    "DefaultClipSize": 6,
    "Components": {
      "384708672": {
        "HashKey": "COMPONENT_REVOLVER_VARMOD_BOSS",
        "NameGXT": "WCT_REV_VARB",
        "DescriptionGXT": "WCD_REV_VARB",
        "Name": "VIP Variant",
        "Description": "",
        "ModelHashKey": "w_pi_revolver_b",
        "IsDefault": false
      },
      "2492708877": {
        "HashKey": "COMPONENT_REVOLVER_VARMOD_GOON",
        "NameGXT": "WCT_REV_VARG",
        "DescriptionGXT": "WCD_REV_VARG",
        "Name": "Bodyguard Variant",
        "Description": "",
        "ModelHashKey": "w_pi_revolver_g",
        "IsDefault": false
      },
      "3917905123": {
        "HashKey": "COMPONENT_REVOLVER_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_REV_CLIP1",
        "Name": "Default Clip",
        "Description": "",
        "ModelHashKey": "w_pi_revolver_Mag1",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpapartment"
  },
  "3756226112": {
    "HashKey": "WEAPON_SWITCHBLADE",
    "NameGXT": "WT_SWBLADE",
    "DescriptionGXT": "WTD_SWBLADE",
    "Name": "Switchblade",
    "Description": "From your pocket to hilt-deep in the other guy's ribs in under a second: folding knives will never go out of style. Part of Executives and Other Criminals.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_switchblade",
    "DefaultClipSize": 0,
    "Components": {
      "2436343040": {
        "HashKey": "COMPONENT_SWITCHBLADE_VARMOD_BASE",
        "NameGXT": "WCT_SB_BASE",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "Default Handle",
        "Description": "",
        "ModelHashKey": "w_me_switchblade",
        "IsDefault": false
      },
      "1530822070": {
        "HashKey": "COMPONENT_SWITCHBLADE_VARMOD_VAR1",
        "NameGXT": "WCT_SB_VAR1",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "VIP Variant",
        "Description": "",
        "ModelHashKey": "w_me_switchblade_b",
        "IsDefault": false
      },
      "3885209186": {
        "HashKey": "COMPONENT_SWITCHBLADE_VARMOD_VAR2",
        "NameGXT": "WCT_SB_VAR2",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "Bodyguard Variant",
        "Description": "",
        "ModelHashKey": "w_me_switchblade_g",
        "IsDefault": false
      }
    },
    "Tints": [],
    "DLC": "mpapartment"
  },
  "940833800": {
    "HashKey": "WEAPON_STONE_HATCHET",
    "NameGXT": "WT_SHATCHET",
    "DescriptionGXT": "WTD_SHATCHET",
    "Name": "Stone Hatchet",
    "Description": "There's retro, there's vintage, and there's this. After 500 years of technological development and spiritual apocalypse, pre-Colombian chic is back.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_stonehatchet",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "mpbattle"
  },
  "4192643659": {
    "HashKey": "WEAPON_BOTTLE",
    "NameGXT": "WT_BOTTLE",
    "DescriptionGXT": "WTD_BOTTLE",
    "Name": "Bottle",
    "Description": "It's not clever and it's not pretty but, most of the time, neither is the guy coming at you with a knife. When all else fails, this gets the job done. Part of the Beach Bum Pack.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_bottle",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "mpbeach"
  },
  "3218215474": {
    "HashKey": "WEAPON_SNSPISTOL",
    "NameGXT": "WT_SNSPISTOL",
    "DescriptionGXT": "WTD_SNSPISTOL",
    "Name": "SNS Pistol",
    "Description": "Like condoms or hairspray, this fits in your pocket for a night out in a Vinewood club. It's half as accurate as a champagne cork but twice as deadly. Part of the Beach Bum Pack.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "w_pi_sns_pistol",
    "DefaultClipSize": 6,
    "Components": {
      "4169150169": {
        "HashKey": "COMPONENT_SNSPISTOL_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_SNSP_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for SNS Pistol.",
        "ModelHashKey": "w_pi_sns_pistol_mag1",
        "IsDefault": true
      },
      "2063610803": {
        "HashKey": "COMPONENT_SNSPISTOL_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_SNSP_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for SNS Pistol.",
        "ModelHashKey": "w_pi_sns_pistol_mag2",
        "IsDefault": false
      },
      "2150886575": {
        "HashKey": "COMPONENT_SNSPISTOL_VARMOD_LOWRIDER",
        "NameGXT": "WCT_VAR_WOOD",
        "DescriptionGXT": "WCD_VAR_SNS",
        "Name": "Etched Wood Grip Finish",
        "Description": "",
        "ModelHashKey": "w_pi_sns_pistol_luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpbeach"
  },
  "317205821": {
    "HashKey": "WEAPON_AUTOSHOTGUN",
    "NameGXT": "WT_AUTOSHGN",
    "DescriptionGXT": "WTD_AUTOSHGN",
    "Name": "Sweeper Shotgun",
    "Description": "How many effective tools for riot control can you tuck into your pants? OK, two. But this is the other one. Part of Bikers.",
    "Group": "GROUP_SHOTGUN",
    "ModelHashKey": "w_sg_sweeper",
    "DefaultClipSize": 10,
    "Components": {
      "169463950": {
        "HashKey": "COMPONENT_AUTOSHOTGUN_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "",
        "Name": "Default Clip",
        "Description": "",
        "ModelHashKey": "w_sg_sweeper_mag1",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpbiker"
  },
  "3441901897": {
    "HashKey": "WEAPON_BATTLEAXE",
    "NameGXT": "WT_BATTLEAXE",
    "DescriptionGXT": "WTD_BATTLEAXE",
    "Name": "Battle Axe",
    "Description": "If it's good enough for medieval foot soldiers, modern border guards and pushy soccer moms, it's good enough for you. Part of Bikers.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_battleaxe",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "mpbiker"
  },
  "125959754": {
    "HashKey": "WEAPON_COMPACTLAUNCHER",
    "NameGXT": "WT_CMPGL",
    "DescriptionGXT": "WTD_CMPGL",
    "Name": "Compact Grenade Launcher",
    "Description": "Focus groups using the regular model suggested it was too accurate and found it awkward to use with one hand on the throttle. Easy fix. Part of Bikers.",
    "Group": "GROUP_HEAVY",
    "ModelHashKey": "w_lr_compactgl",
    "DefaultClipSize": 1,
    "Components": {
      "1235472140": {
        "HashKey": "COMPONENT_COMPACTLAUNCHER_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "",
        "Name": "Default Clip",
        "Description": "",
        "ModelHashKey": "w_lr_compactgl_mag1",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpbiker"
  },
  "3173288789": {
    "HashKey": "WEAPON_MINISMG",
    "NameGXT": "WT_MINISMG",
    "DescriptionGXT": "WTD_MINISMG",
    "Name": "Mini SMG",
    "Description": "Increasingly popular since the marketing team looked beyond spec ops units and started caring about the little guys in low income areas. Part of Bikers.",
    "Group": "GROUP_SMG",
    "ModelHashKey": "w_sb_minismg",
    "DefaultClipSize": 20,
    "Components": {
      "2227745491": {
        "HashKey": "COMPONENT_MINISMG_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_MIMG_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Mini SMG.",
        "ModelHashKey": "w_sb_minismg_mag1",
        "IsDefault": true
      },
      "2474561719": {
        "HashKey": "COMPONENT_MINISMG_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_MIMG_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Mini SMG.",
        "ModelHashKey": "w_sb_minismg_mag2",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpbiker"
  },
  "3125143736": {
    "HashKey": "WEAPON_PIPEBOMB",
    "NameGXT": "WT_PIPEBOMB",
    "DescriptionGXT": "WTD_PIPEBOMB",
    "Name": "Pipe Bomb",
    "Description": "Remember, it doesn't count as an IED when you buy it in a store and use it in a first world country. Part of Bikers.",
    "Group": "GROUP_THROWN",
    "ModelHashKey": "w_ex_pipebomb",
    "DefaultClipSize": 1,
    "Components": {},
    "Tints": [],
    "DLC": "mpbiker"
  },
  "2484171525": {
    "HashKey": "WEAPON_POOLCUE",
    "NameGXT": "WT_POOLCUE",
    "DescriptionGXT": "WTD_POOLCUE",
    "Name": "Pool Cue",
    "Description": "Ah, there's no sound as satisfying as the crack of a perfect break, especially when it's the other guy's spine. Part of Bikers.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_poolcue",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "mpbiker"
  },
  "419712736": {
    "HashKey": "WEAPON_WRENCH",
    "NameGXT": "WT_WRENCH",
    "DescriptionGXT": "WTD_WRENCH",
    "Name": "Pipe Wrench",
    "Description": "Perennial favourite of apocalyptic survivalists and violent fathers the world over, apparently it also doubles as some kind of tool. Part of Bikers.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_wrench",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "mpbiker"
  },
  "3523564046": {
    "HashKey": "WEAPON_HEAVYPISTOL",
    "NameGXT": "WT_HVYPISTOL",
    "DescriptionGXT": "WTD_HVYPISTOL",
    "Name": "Heavy Pistol",
    "Description": "The heavyweight champion of the magazine fed, semi-automatic handgun world. Delivers a serious forearm workout every time. Part of The Business Update.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "w_pi_heavypistol",
    "DefaultClipSize": 18,
    "Components": {
      "222992026": {
        "HashKey": "COMPONENT_HEAVYPISTOL_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_HPST_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Heavy Pistol.",
        "ModelHashKey": "w_pi_heavypistol_mag1",
        "IsDefault": true
      },
      "1694090795": {
        "HashKey": "COMPONENT_HEAVYPISTOL_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_HPST_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Heavy Pistol.",
        "ModelHashKey": "w_pi_heavypistol_mag2",
        "IsDefault": false
      },
      "899381934": {
        "HashKey": "COMPONENT_AT_PI_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_pi_flsh",
        "IsDefault": false
      },
      "3271853210": {
        "HashKey": "COMPONENT_AT_PI_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_PI_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_pi_supp",
        "IsDefault": false
      },
      "2053798779": {
        "HashKey": "COMPONENT_HEAVYPISTOL_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_WOOD",
        "DescriptionGXT": "WCD_VAR_HPST",
        "Name": "Etched Wood Grip Finish",
        "Description": "",
        "ModelHashKey": "W_PI_HeavyPistol_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpbusiness"
  },
  "3231910285": {
    "HashKey": "WEAPON_SPECIALCARBINE",
    "NameGXT": "WT_SPCARBINE",
    "DescriptionGXT": "WTD_SPCARBINE",
    "Name": "Special Carbine",
    "Description": "Combining accuracy, maneuverability and low recoil, this is an extremely versatile assault rifle for any combat situation. Part of The Business Update.",
    "Group": "GROUP_RIFLE",
    "ModelHashKey": "w_ar_specialcarbine",
    "DefaultClipSize": 30,
    "Components": {
      "3334989185": {
        "HashKey": "COMPONENT_SPECIALCARBINE_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_SCRB_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Special Carbine.",
        "ModelHashKey": "w_ar_specialcarbine_mag1",
        "IsDefault": true
      },
      "2089537806": {
        "HashKey": "COMPONENT_SPECIALCARBINE_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_SCRB_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Special Carbine.",
        "ModelHashKey": "w_ar_specialcarbine_mag2",
        "IsDefault": false
      },
      "1801039530": {
        "HashKey": "COMPONENT_SPECIALCARBINE_CLIP_03",
        "NameGXT": "WCT_CLIP_DRM",
        "DescriptionGXT": "WCD_CLIP3",
        "Name": "Drum Magazine",
        "Description": "Expanded capacity and slower reload.",
        "ModelHashKey": "w_ar_specialcarbine_boxmag",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2698550338": {
        "HashKey": "COMPONENT_AT_SCOPE_MEDIUM",
        "NameGXT": "WCT_SCOPE_MED",
        "DescriptionGXT": "WCD_SCOPE_MED",
        "Name": "Scope",
        "Description": "Extended-range zoom functionality.",
        "ModelHashKey": "w_at_scope_medium",
        "IsDefault": false
      },
      "2805810788": {
        "HashKey": "COMPONENT_AT_AR_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP2",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp_02",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      },
      "1929467122": {
        "HashKey": "COMPONENT_SPECIALCARBINE_VARMOD_LOWRIDER",
        "NameGXT": "WCT_VAR_ETCHM",
        "DescriptionGXT": "WCD_VAR_SCAR",
        "Name": "Etched Gun Metal Finish",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbine_luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpbusiness"
  },
  "2132975508": {
    "HashKey": "WEAPON_BULLPUPRIFLE",
    "NameGXT": "WT_BULLRIFLE",
    "DescriptionGXT": "WTD_BULLRIFLE",
    "Name": "Bullpup Rifle",
    "Description": "The latest Chinese import taking America by storm, this rifle is known for its balanced handling. Lightweight and very controllable in automatic fire. Part of The High Life Update.",
    "Group": "GROUP_RIFLE",
    "ModelHashKey": "w_ar_bullpuprifle",
    "DefaultClipSize": 30,
    "Components": {
      "3315675008": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_BRIF_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Bullpup Rifle.",
        "ModelHashKey": "w_ar_bullpuprifle_mag1",
        "IsDefault": true
      },
      "3009973007": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_BRIF_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Bullpup Rifle.",
        "ModelHashKey": "w_ar_bullpuprifle_mag2",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2855028148": {
        "HashKey": "COMPONENT_AT_SCOPE_SMALL",
        "NameGXT": "WCT_SCOPE_SML",
        "DescriptionGXT": "WCD_SCOPE_SML",
        "Name": "Scope",
        "Description": "Medium-range zoom functionality.",
        "ModelHashKey": "w_at_scope_small",
        "IsDefault": false
      },
      "2205435306": {
        "HashKey": "COMPONENT_AT_AR_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      },
      "2824322168": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_VARMOD_LOW",
        "NameGXT": "WCT_VAR_METAL",
        "DescriptionGXT": "WCD_VAR_BPR",
        "Name": "Gilded Gun Metal Finish",
        "Description": "",
        "ModelHashKey": "w_ar_bullpuprifle_luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpbusiness2"
  },
  "1672152130": {
    "HashKey": "WEAPON_HOMINGLAUNCHER",
    "NameGXT": "WT_HOMLNCH",
    "DescriptionGXT": "WTD_HOMLNCH",
    "Name": "Homing Launcher",
    "Description": "Infrared guided fire-and-forget missile launcher. For all your moving target needs. Part of the Festive Surprise.",
    "Group": "GROUP_HEAVY",
    "ModelHashKey": "w_lr_homing",
    "DefaultClipSize": 1,
    "Components": {
      "4162006335": {
        "HashKey": "COMPONENT_HOMINGLAUNCHER_CLIP_01",
        "NameGXT": "WCT_INVALID",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "",
        "Description": "",
        "ModelHashKey": "",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpchristmas2"
  },
  "2874559379": {
    "HashKey": "WEAPON_PROXMINE",
    "NameGXT": "WT_PRXMINE",
    "DescriptionGXT": "WTD_PRXMINE",
    "Name": "Proximity Mine",
    "Description": "Leave a present for your friends with these motion sensor landmines. Short delay after activation. Part of the Festive Surprise.",
    "Group": "GROUP_THROWN",
    "ModelHashKey": "w_ex_apmine",
    "DefaultClipSize": 1,
    "Components": {},
    "Tints": [],
    "DLC": "mpchristmas2"
  },
  "126349499": {
    "HashKey": "WEAPON_SNOWBALL",
    "NameGXT": "WT_SNWBALL",
    "DescriptionGXT": "WTD_SNWBALL",
    "Name": "Snowball",
    "Description": "",
    "Group": "GROUP_THROWN",
    "ModelHashKey": "w_ex_snowball",
    "DefaultClipSize": 1,
    "Components": {},
    "Tints": [],
    "DLC": "mpchristmas2"
  },
  "2228681469": {
    "HashKey": "WEAPON_BULLPUPRIFLE_MK2",
    "NameGXT": "WT_BULLRIFLE2",
    "DescriptionGXT": "WTD_BULLRIFLE2",
    "Name": "Bullpup Rifle Mk II",
    "Description": "So precise, so exquisite, it's not so much a hail of bullets as a symphony.",
    "Group": "GROUP_RIFLE",
    "ModelHashKey": "w_ar_bullpupriflemk2",
    "DefaultClipSize": 30,
    "Components": {
      "25766362": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for regular ammo.",
        "ModelHashKey": "w_ar_bullpupriflemk2_mag1",
        "IsDefault": true
      },
      "4021290536": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for regular ammo.",
        "ModelHashKey": "w_ar_bullpupriflemk2_mag2",
        "IsDefault": false
      },
      "2183159977": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CLIP_TRACER",
        "NameGXT": "WCT_CLIP_TR",
        "DescriptionGXT": "WCD_CLIP_TR",
        "Name": "Tracer Rounds",
        "Description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity.",
        "ModelHashKey": "W_AR_BullpupRifleMK2_Mag_TR",
        "IsDefault": false
      },
      "2845636954": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity.",
        "ModelHashKey": "W_AR_BullpupRifleMK2_Mag_INC",
        "IsDefault": false
      },
      "4205311469": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CLIP_ARMORPIERCING",
        "NameGXT": "WCT_CLIP_AP",
        "DescriptionGXT": "WCD_CLIP_AP",
        "Name": "Armor Piercing Rounds",
        "Description": "Increased penetration of Body Armor. Reduced capacity.",
        "ModelHashKey": "W_AR_BullpupRifleMK2_Mag_AP",
        "IsDefault": false
      },
      "1130501904": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity.",
        "ModelHashKey": "W_AR_BullpupRifleMK2_Mag_FMJ",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "1108334355": {
        "HashKey": "COMPONENT_AT_SIGHTS",
        "NameGXT": "WCT_HOLO",
        "DescriptionGXT": "WCD_HOLO",
        "Name": "Holographic Sight",
        "Description": "Accurate sight for close quarters combat.",
        "ModelHashKey": "w_at_sights_1",
        "IsDefault": false
      },
      "3350057221": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO_02_MK2",
        "NameGXT": "WCT_SCOPE_MAC2",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Small Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro_2",
        "IsDefault": false
      },
      "1060929921": {
        "HashKey": "COMPONENT_AT_SCOPE_SMALL_MK2",
        "NameGXT": "WCT_SCOPE_SML2",
        "DescriptionGXT": "WCD_SCOPE_SML",
        "Name": "Medium Scope",
        "Description": "Medium-range zoom functionality.",
        "ModelHashKey": "w_at_scope_small",
        "IsDefault": false
      },
      "1704640795": {
        "HashKey": "COMPONENT_AT_BP_BARREL_01",
        "NameGXT": "WCT_BARR",
        "DescriptionGXT": "WCD_BARR",
        "Name": "Default Barrel",
        "Description": "Stock barrel attachment.",
        "ModelHashKey": "W_AR_BP_MK2_Barrel1",
        "IsDefault": true
      },
      "1005743559": {
        "HashKey": "COMPONENT_AT_BP_BARREL_02",
        "NameGXT": "WCT_BARR2",
        "DescriptionGXT": "WCD_BARR2",
        "Name": "Heavy Barrel",
        "Description": "Increases damage dealt to long-range targets.",
        "ModelHashKey": "W_AR_BP_MK2_Barrel2",
        "IsDefault": false
      },
      "2205435306": {
        "HashKey": "COMPONENT_AT_AR_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp",
        "IsDefault": false
      },
      "3113485012": {
        "HashKey": "COMPONENT_AT_MUZZLE_01",
        "NameGXT": "WCT_MUZZ1",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Flat Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_1",
        "IsDefault": false
      },
      "3362234491": {
        "HashKey": "COMPONENT_AT_MUZZLE_02",
        "NameGXT": "WCT_MUZZ2",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Tactical Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_2",
        "IsDefault": false
      },
      "3725708239": {
        "HashKey": "COMPONENT_AT_MUZZLE_03",
        "NameGXT": "WCT_MUZZ3",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Fat-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_3",
        "IsDefault": false
      },
      "3968886988": {
        "HashKey": "COMPONENT_AT_MUZZLE_04",
        "NameGXT": "WCT_MUZZ4",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Precision Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_4",
        "IsDefault": false
      },
      "48731514": {
        "HashKey": "COMPONENT_AT_MUZZLE_05",
        "NameGXT": "WCT_MUZZ5",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Heavy Duty Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_5",
        "IsDefault": false
      },
      "880736428": {
        "HashKey": "COMPONENT_AT_MUZZLE_06",
        "NameGXT": "WCT_MUZZ6",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Slanted Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_6",
        "IsDefault": false
      },
      "1303784126": {
        "HashKey": "COMPONENT_AT_MUZZLE_07",
        "NameGXT": "WCT_MUZZ7",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Split-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_7",
        "IsDefault": false
      },
      "2640679034": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP_02",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_afgrip_2",
        "IsDefault": false
      },
      "2923451831": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo1",
        "IsDefault": false
      },
      "3104173419": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo2",
        "IsDefault": false
      },
      "2797881576": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo3",
        "IsDefault": false
      },
      "2491819116": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo4",
        "IsDefault": false
      },
      "2318995410": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo5",
        "IsDefault": false
      },
      "36929477": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo6",
        "IsDefault": false
      },
      "4026522462": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo7",
        "IsDefault": false
      },
      "3720197850": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo8",
        "IsDefault": false
      },
      "3412267557": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo9",
        "IsDefault": false
      },
      "2826785822": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo10",
        "IsDefault": false
      },
      "3320426066": {
        "HashKey": "COMPONENT_BULLPUPRIFLE_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "w_ar_bullpupriflemk2_camo_ind1",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpchristmas2017"
  },
  "2548703416": {
    "HashKey": "WEAPON_DOUBLEACTION",
    "NameGXT": "WT_REV_DA",
    "DescriptionGXT": "WTD_REV_DA",
    "Name": "Double-Action Revolver",
    "Description": "Because sometimes revenge is a dish best served six times, in quick succession, right between the eyes. Part of The Doomsday Heist.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "w_pi_wep1_gun",
    "DefaultClipSize": 6,
    "Components": {
      "1328622785": {
        "HashKey": "COMPONENT_DOUBLEACTION_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_REV_DA_CLIP",
        "Name": "Default Clip",
        "Description": "Standard ammo capacity.",
        "ModelHashKey": "w_pi_wep1_mag1",
        "IsDefault": true
      }
    },
    "Tints": [],
    "DLC": "mpchristmas2017"
  },
  "1785463520": {
    "HashKey": "WEAPON_MARKSMANRIFLE_MK2",
    "NameGXT": "WT_MKRIFLE2",
    "DescriptionGXT": "WTD_MKRIFLE2",
    "Name": "Marksman Rifle Mk II",
    "Description": "Known in military circles as The Dislocator, this mod set will destroy both the target and your shoulder, in that order.",
    "Group": "GROUP_SNIPER",
    "ModelHashKey": "w_sr_marksmanriflemk2",
    "DefaultClipSize": 8,
    "Components": {
      "2497785294": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for regular ammo.",
        "ModelHashKey": "w_sr_marksmanriflemk2_mag1",
        "IsDefault": true
      },
      "3872379306": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for regular ammo.",
        "ModelHashKey": "w_sr_marksmanriflemk2_mag2",
        "IsDefault": false
      },
      "3615105746": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CLIP_TRACER",
        "NameGXT": "WCT_CLIP_TR",
        "DescriptionGXT": "WCD_CLIP_TR",
        "Name": "Tracer Rounds",
        "Description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity.",
        "ModelHashKey": "w_sr_marksmanriflemk2_mag_tr",
        "IsDefault": false
      },
      "1842849902": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity.",
        "ModelHashKey": "w_sr_marksmanriflemk2_mag_inc",
        "IsDefault": false
      },
      "4100968569": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CLIP_ARMORPIERCING",
        "NameGXT": "WCT_CLIP_AP",
        "DescriptionGXT": "WCD_CLIP_AP",
        "Name": "Armor Piercing Rounds",
        "Description": "Increased penetration of Body Armor. Reduced capacity.",
        "ModelHashKey": "w_sr_marksmanriflemk2_mag_ap",
        "IsDefault": false
      },
      "3779763923": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity.",
        "ModelHashKey": "w_sr_marksmanriflemk2_mag_fmj",
        "IsDefault": false
      },
      "1108334355": {
        "HashKey": "COMPONENT_AT_SIGHTS",
        "NameGXT": "WCT_HOLO",
        "DescriptionGXT": "WCD_HOLO",
        "Name": "Holographic Sight",
        "Description": "Accurate sight for close quarters combat.",
        "ModelHashKey": "w_at_sights_1",
        "IsDefault": false
      },
      "3328927042": {
        "HashKey": "COMPONENT_AT_SCOPE_MEDIUM_MK2",
        "NameGXT": "WCT_SCOPE_MED2",
        "DescriptionGXT": "WCD_SCOPE_MED",
        "Name": "Large Scope",
        "Description": "Extended-range zoom functionality.",
        "ModelHashKey": "w_at_scope_medium_2",
        "IsDefault": false
      },
      "1528590652": {
        "HashKey": "COMPONENT_AT_SCOPE_LARGE_FIXED_ZOOM_MK2",
        "NameGXT": "WCT_SCOPE_LRG2",
        "DescriptionGXT": "WCD_SCOPE_LRF",
        "Name": "Zoom Scope",
        "Description": "Long-range fixed zoom functionality.",
        "ModelHashKey": "w_at_scope_large",
        "IsDefault": true
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2205435306": {
        "HashKey": "COMPONENT_AT_AR_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp",
        "IsDefault": false
      },
      "3113485012": {
        "HashKey": "COMPONENT_AT_MUZZLE_01",
        "NameGXT": "WCT_MUZZ1",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Flat Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_1",
        "IsDefault": false
      },
      "3362234491": {
        "HashKey": "COMPONENT_AT_MUZZLE_02",
        "NameGXT": "WCT_MUZZ2",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Tactical Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_2",
        "IsDefault": false
      },
      "3725708239": {
        "HashKey": "COMPONENT_AT_MUZZLE_03",
        "NameGXT": "WCT_MUZZ3",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Fat-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_3",
        "IsDefault": false
      },
      "3968886988": {
        "HashKey": "COMPONENT_AT_MUZZLE_04",
        "NameGXT": "WCT_MUZZ4",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Precision Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_4",
        "IsDefault": false
      },
      "48731514": {
        "HashKey": "COMPONENT_AT_MUZZLE_05",
        "NameGXT": "WCT_MUZZ5",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Heavy Duty Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_5",
        "IsDefault": false
      },
      "880736428": {
        "HashKey": "COMPONENT_AT_MUZZLE_06",
        "NameGXT": "WCT_MUZZ6",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Slanted Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_6",
        "IsDefault": false
      },
      "1303784126": {
        "HashKey": "COMPONENT_AT_MUZZLE_07",
        "NameGXT": "WCT_MUZZ7",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Split-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_7",
        "IsDefault": false
      },
      "941317513": {
        "HashKey": "COMPONENT_AT_MRFL_BARREL_01",
        "NameGXT": "WCT_BARR",
        "DescriptionGXT": "WCD_BARR",
        "Name": "Default Barrel",
        "Description": "Stock barrel attachment.",
        "ModelHashKey": "w_sr_mr_mk2_barrel_1",
        "IsDefault": true
      },
      "1748450780": {
        "HashKey": "COMPONENT_AT_MRFL_BARREL_02",
        "NameGXT": "WCT_BARR2",
        "DescriptionGXT": "WCD_BARR2",
        "Name": "Heavy Barrel",
        "Description": "Increases damage dealt to long-range targets.",
        "ModelHashKey": "w_sr_mr_mk2_barrel_2",
        "IsDefault": false
      },
      "2640679034": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP_02",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_afgrip_2",
        "IsDefault": false
      },
      "2425682848": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo1",
        "IsDefault": false
      },
      "1931539634": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo2",
        "IsDefault": false
      },
      "1624199183": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo3",
        "IsDefault": false
      },
      "4268133183": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo4",
        "IsDefault": false
      },
      "4084561241": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo5",
        "IsDefault": false
      },
      "423313640": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo6",
        "IsDefault": false
      },
      "276639596": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo7",
        "IsDefault": false
      },
      "3303610433": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo8",
        "IsDefault": false
      },
      "2612118995": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo9",
        "IsDefault": false
      },
      "996213771": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo10",
        "IsDefault": false
      },
      "3080918746": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_sr_marksmanriflemk2_camo_ind",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpchristmas2017"
  },
  "1432025498": {
    "HashKey": "WEAPON_PUMPSHOTGUN_MK2",
    "NameGXT": "WT_SG_PMP2",
    "DescriptionGXT": "WTD_SG_PMP2",
    "Name": "Pump Shotgun Mk II",
    "Description": "Only one thing pumps more action than a pump action: watch out, the recoil is almost as deadly as the shot.",
    "Group": "GROUP_SHOTGUN",
    "ModelHashKey": "w_sg_pumpshotgunmk2",
    "DefaultClipSize": 8,
    "Components": {
      "3449028929": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CLIP_01",
        "NameGXT": "WCT_SHELL",
        "DescriptionGXT": "WCD_SHELL",
        "Name": "Default Shells",
        "Description": "Standard shotgun ammunition.",
        "ModelHashKey": "w_sg_pumpshotgunmk2_mag1",
        "IsDefault": true
      },
      "2676628469": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_SHELL_INC",
        "DescriptionGXT": "WCD_SHELL_INC",
        "Name": "Dragon's Breath Shells",
        "Description": "Has a chance to set targets on fire when shot.",
        "ModelHashKey": "w_sg_pumpshotgunmk2_mag_inc",
        "IsDefault": false
      },
      "1315288101": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CLIP_ARMORPIERCING",
        "NameGXT": "WCT_SHELL_AP",
        "DescriptionGXT": "WCD_SHELL_AP",
        "Name": "Steel Buckshot Shells",
        "Description": "Increased penetration of Body Armor.",
        "ModelHashKey": "w_sg_pumpshotgunmk2_mag_ap",
        "IsDefault": false
      },
      "3914869031": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CLIP_HOLLOWPOINT",
        "NameGXT": "WCT_SHELL_HP",
        "DescriptionGXT": "WCD_SHELL_HP",
        "Name": "Flechette Shells",
        "Description": "Increased damage to targets without Body Armor.",
        "ModelHashKey": "w_sg_pumpshotgunmk2_mag_hp",
        "IsDefault": false
      },
      "1004815965": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CLIP_EXPLOSIVE",
        "NameGXT": "WCT_SHELL_EX",
        "DescriptionGXT": "WCD_SHELL_EX",
        "Name": "Explosive Slugs",
        "Description": "Projectile which explodes on impact.",
        "ModelHashKey": "w_sg_pumpshotgunmk2_mag_exp",
        "IsDefault": false
      },
      "1108334355": {
        "HashKey": "COMPONENT_AT_SIGHTS",
        "NameGXT": "WCT_HOLO",
        "DescriptionGXT": "WCD_HOLO",
        "Name": "Holographic Sight",
        "Description": "Accurate sight for close quarters combat.",
        "ModelHashKey": "w_at_sights_1",
        "IsDefault": false
      },
      "77277509": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO_MK2",
        "NameGXT": "WCT_SCOPE_MAC2",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Small Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro",
        "IsDefault": false
      },
      "1060929921": {
        "HashKey": "COMPONENT_AT_SCOPE_SMALL_MK2",
        "NameGXT": "WCT_SCOPE_SML2",
        "DescriptionGXT": "WCD_SCOPE_SML",
        "Name": "Medium Scope",
        "Description": "Medium-range zoom functionality.",
        "ModelHashKey": "w_at_scope_small",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2890063729": {
        "HashKey": "COMPONENT_AT_SR_SUPP_03",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_SR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_sr_supp3",
        "IsDefault": false
      },
      "1602080333": {
        "HashKey": "COMPONENT_AT_MUZZLE_08",
        "NameGXT": "WCT_MUZZ8",
        "DescriptionGXT": "WCD_MUZZ_SR",
        "Name": "Squared Muzzle Brake",
        "Description": "Reduces recoil when firing.",
        "ModelHashKey": "w_at_muzzle_8_xm17",
        "IsDefault": false
      },
      "3820854852": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo1",
        "IsDefault": false
      },
      "387223451": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo2",
        "IsDefault": false
      },
      "617753366": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo3",
        "IsDefault": false
      },
      "4072589040": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo4",
        "IsDefault": false
      },
      "8741501": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo5",
        "IsDefault": false
      },
      "3693681093": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo6",
        "IsDefault": false
      },
      "3783533691": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo7",
        "IsDefault": false
      },
      "3639579478": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo8",
        "IsDefault": false
      },
      "4012490698": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo9",
        "IsDefault": false
      },
      "1739501925": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo10",
        "IsDefault": false
      },
      "1178671645": {
        "HashKey": "COMPONENT_PUMPSHOTGUN_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "w_sg_pumpshotgunmk2_camo_ind1",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpchristmas2017"
  },
  "3415619887": {
    "HashKey": "WEAPON_REVOLVER_MK2",
    "NameGXT": "WT_REVOLVER2",
    "DescriptionGXT": "WTD_REVOLVER2",
    "Name": "Heavy Revolver Mk II",
    "Description": "If you can lift it, this is the closest you'll get to shooting someone with a freight train.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "w_pi_revolvermk2",
    "DefaultClipSize": 6,
    "Components": {
      "3122911422": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1_RV",
        "DescriptionGXT": "WCD_CLIP1_RV",
        "Name": "Default Rounds",
        "Description": "Standard revolver ammunition.",
        "ModelHashKey": "w_pi_revolvermk2_mag1",
        "IsDefault": true
      },
      "3336103030": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CLIP_TRACER",
        "NameGXT": "WCT_CLIP_TR",
        "DescriptionGXT": "WCD_CLIP_TR_RV",
        "Name": "Tracer Rounds",
        "Description": "Bullets with bright visible markers that match the tint of the gun.",
        "ModelHashKey": "w_pi_revolvermk2_mag4",
        "IsDefault": false
      },
      "15712037": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC_RV",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which set targets on fire when shot.",
        "ModelHashKey": "w_pi_revolvermk2_mag3",
        "IsDefault": false
      },
      "284438159": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CLIP_HOLLOWPOINT",
        "NameGXT": "WCT_CLIP_HP",
        "DescriptionGXT": "WCD_CLIP_HP_RV",
        "Name": "Hollow Point Rounds",
        "Description": "Increased damage to targets without Body Armor.",
        "ModelHashKey": "w_pi_revolvermk2_mag2",
        "IsDefault": false
      },
      "231258687": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ_RV",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass.",
        "ModelHashKey": "w_pi_revolvermk2_mag5",
        "IsDefault": false
      },
      "1108334355": {
        "HashKey": "COMPONENT_AT_SIGHTS",
        "NameGXT": "WCT_HOLO",
        "DescriptionGXT": "WCD_HOLO",
        "Name": "Holographic Sight",
        "Description": "Accurate sight for close quarters combat.",
        "ModelHashKey": "w_at_sights_1",
        "IsDefault": false
      },
      "77277509": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO_MK2",
        "NameGXT": "WCT_SCOPE_MAC2",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Small Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro",
        "IsDefault": false
      },
      "899381934": {
        "HashKey": "COMPONENT_AT_PI_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_pi_flsh",
        "IsDefault": false
      },
      "654802123": {
        "HashKey": "COMPONENT_AT_PI_COMP_03",
        "NameGXT": "WCT_COMP",
        "DescriptionGXT": "WCD_COMP",
        "Name": "Compensator",
        "Description": "Reduces recoil for rapid fire.",
        "ModelHashKey": "w_at_pi_comp_3",
        "IsDefault": false
      },
      "3225415071": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo1",
        "IsDefault": false
      },
      "11918884": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo2",
        "IsDefault": false
      },
      "176157112": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo3",
        "IsDefault": false
      },
      "4074914441": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo4",
        "IsDefault": false
      },
      "288456487": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo5",
        "IsDefault": false
      },
      "398658626": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo6",
        "IsDefault": false
      },
      "628697006": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo7",
        "IsDefault": false
      },
      "925911836": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo8",
        "IsDefault": false
      },
      "1222307441": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo9",
        "IsDefault": false
      },
      "552442715": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo10",
        "IsDefault": false
      },
      "3646023783": {
        "HashKey": "COMPONENT_REVOLVER_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "w_pi_revolvermk2_camo_ind",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpchristmas2017"
  },
  "2285322324": {
    "HashKey": "WEAPON_SNSPISTOL_MK2",
    "NameGXT": "WT_SNSPISTOL2",
    "DescriptionGXT": "WTD_SNSPISTOL2",
    "Name": "SNS Pistol Mk II",
    "Description": "The ultimate purse-filler: if you want to make Saturday Night really special, this is your ticket.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "w_pi_sns_pistolmk2",
    "DefaultClipSize": 6,
    "Components": {
      "21392614": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for regular ammo.",
        "ModelHashKey": "w_pi_sns_pistolmk2_mag1",
        "IsDefault": true
      },
      "3465283442": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for regular ammo.",
        "ModelHashKey": "w_pi_sns_pistolmk2_mag2",
        "IsDefault": false
      },
      "2418909806": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CLIP_TRACER",
        "NameGXT": "WCT_CLIP_TR",
        "DescriptionGXT": "WCD_CLIP_TR_RV",
        "Name": "Tracer Rounds",
        "Description": "Bullets with bright visible markers that match the tint of the gun.",
        "ModelHashKey": "W_PI_SNS_PistolMK2_Mag_TR",
        "IsDefault": false
      },
      "3870121849": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC_NS",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which include a chance to set targets on fire when shot.",
        "ModelHashKey": "W_PI_SNS_PistolMK2_Mag_INC",
        "IsDefault": false
      },
      "2366665730": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CLIP_HOLLOWPOINT",
        "NameGXT": "WCT_CLIP_HP",
        "DescriptionGXT": "WCD_CLIP_HP_RV",
        "Name": "Hollow Point Rounds",
        "Description": "Increased damage to targets without Body Armor.",
        "ModelHashKey": "W_PI_SNS_PistolMK2_Mag_HP",
        "IsDefault": false
      },
      "3239176998": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ_RV",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass.",
        "ModelHashKey": "W_PI_SNS_PistolMK2_Mag_FMJ",
        "IsDefault": false
      },
      "1246324211": {
        "HashKey": "COMPONENT_AT_PI_FLSH_03",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_pi_snsmk2_flsh_1",
        "IsDefault": false
      },
      "1205768792": {
        "HashKey": "COMPONENT_AT_PI_RAIL_02",
        "NameGXT": "WCT_SCOPE_PI",
        "DescriptionGXT": "WCD_SCOPE_PI",
        "Name": "Mounted Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_pi_rail_2",
        "IsDefault": false
      },
      "1709866683": {
        "HashKey": "COMPONENT_AT_PI_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_PI_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_pi_supp_2",
        "IsDefault": false
      },
      "2860680127": {
        "HashKey": "COMPONENT_AT_PI_COMP_02",
        "NameGXT": "WCT_COMP",
        "DescriptionGXT": "WCD_COMP",
        "Name": "Compensator",
        "Description": "Reduces recoil for rapid fire.",
        "ModelHashKey": "w_at_pi_comp_2",
        "IsDefault": false
      },
      "259780317": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_Camo1",
        "IsDefault": false
      },
      "2321624822": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_Camo2",
        "IsDefault": false
      },
      "1996130345": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_Camo3",
        "IsDefault": false
      },
      "2839309484": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_Camo4",
        "IsDefault": false
      },
      "2626704212": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_Camo5",
        "IsDefault": false
      },
      "1308243489": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_Camo6",
        "IsDefault": false
      },
      "1122574335": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_Camo7",
        "IsDefault": false
      },
      "1420313469": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_Camo8",
        "IsDefault": false
      },
      "109848390": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_Camo9",
        "IsDefault": false
      },
      "593945703": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_Camo10",
        "IsDefault": false
      },
      "1142457062": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_pi_sns_pistolmk2_camo_ind1",
        "IsDefault": false
      },
      "3891161322": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_SL_Camo1",
        "IsDefault": false
      },
      "691432737": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_02_SLIDE",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_SL_Camo2",
        "IsDefault": false
      },
      "987648331": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_03_SLIDE",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_SL_Camo3",
        "IsDefault": false
      },
      "3863286761": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_04_SLIDE",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_SL_Camo4",
        "IsDefault": false
      },
      "3447384986": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_05_SLIDE",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_SL_Camo5",
        "IsDefault": false
      },
      "4202375078": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_06_SLIDE",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_SL_Camo6",
        "IsDefault": false
      },
      "3800418970": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_07_SLIDE",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_SL_Camo7",
        "IsDefault": false
      },
      "730876697": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_08_SLIDE",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_SL_Camo8",
        "IsDefault": false
      },
      "583159708": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_09_SLIDE",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_SL_Camo9",
        "IsDefault": false
      },
      "2366463693": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_10_SLIDE",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMk2_SL_Camo10",
        "IsDefault": false
      },
      "520557834": {
        "HashKey": "COMPONENT_SNSPISTOL_MK2_CAMO_IND_01_SLIDE",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "W_PI_SNS_PistolMK2_SL_Camo_Ind1",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpchristmas2017"
  },
  "2526821735": {
    "HashKey": "WEAPON_SPECIALCARBINE_MK2",
    "NameGXT": "WT_SPCARBINE2",
    "DescriptionGXT": "WTD_SPCARBINE2",
    "Name": "Special Carbine Mk II",
    "Description": "The jack of all trades just got a serious upgrade: bow to the master.",
    "Group": "GROUP_RIFLE",
    "ModelHashKey": "w_ar_specialcarbinemk2",
    "DefaultClipSize": 30,
    "Components": {
      "382112385": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for regular ammo.",
        "ModelHashKey": "w_ar_specialcarbinemk2_mag1",
        "IsDefault": true
      },
      "3726614828": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for regular ammo.",
        "ModelHashKey": "w_ar_specialcarbinemk2_mag2",
        "IsDefault": false
      },
      "2271594122": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CLIP_TRACER",
        "NameGXT": "WCT_CLIP_TR",
        "DescriptionGXT": "WCD_CLIP_TR",
        "Name": "Tracer Rounds",
        "Description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity.",
        "ModelHashKey": "w_ar_specialcarbinemk2_mag_tr",
        "IsDefault": false
      },
      "3724612230": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity.",
        "ModelHashKey": "w_ar_specialcarbinemk2_mag_inc",
        "IsDefault": false
      },
      "1362433589": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CLIP_ARMORPIERCING",
        "NameGXT": "WCT_CLIP_AP",
        "DescriptionGXT": "WCD_CLIP_AP",
        "Name": "Armor Piercing Rounds",
        "Description": "Increased penetration of Body Armor. Reduced capacity.",
        "ModelHashKey": "w_ar_specialcarbinemk2_mag_ap",
        "IsDefault": false
      },
      "1346235024": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity.",
        "ModelHashKey": "w_ar_specialcarbinemk2_mag_fmj",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "1108334355": {
        "HashKey": "COMPONENT_AT_SIGHTS",
        "NameGXT": "WCT_HOLO",
        "DescriptionGXT": "WCD_HOLO",
        "Name": "Holographic Sight",
        "Description": "Accurate sight for close quarters combat.",
        "ModelHashKey": "w_at_sights_1",
        "IsDefault": false
      },
      "77277509": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO_MK2",
        "NameGXT": "WCT_SCOPE_MAC2",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Small Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro",
        "IsDefault": false
      },
      "3328927042": {
        "HashKey": "COMPONENT_AT_SCOPE_MEDIUM_MK2",
        "NameGXT": "WCT_SCOPE_MED2",
        "DescriptionGXT": "WCD_SCOPE_MED",
        "Name": "Large Scope",
        "Description": "Extended-range zoom functionality.",
        "ModelHashKey": "w_at_scope_medium_2",
        "IsDefault": false
      },
      "2805810788": {
        "HashKey": "COMPONENT_AT_AR_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP2",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp_02",
        "IsDefault": false
      },
      "3113485012": {
        "HashKey": "COMPONENT_AT_MUZZLE_01",
        "NameGXT": "WCT_MUZZ1",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Flat Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_1",
        "IsDefault": false
      },
      "3362234491": {
        "HashKey": "COMPONENT_AT_MUZZLE_02",
        "NameGXT": "WCT_MUZZ2",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Tactical Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_2",
        "IsDefault": false
      },
      "3725708239": {
        "HashKey": "COMPONENT_AT_MUZZLE_03",
        "NameGXT": "WCT_MUZZ3",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Fat-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_3",
        "IsDefault": false
      },
      "3968886988": {
        "HashKey": "COMPONENT_AT_MUZZLE_04",
        "NameGXT": "WCT_MUZZ4",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Precision Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_4",
        "IsDefault": false
      },
      "48731514": {
        "HashKey": "COMPONENT_AT_MUZZLE_05",
        "NameGXT": "WCT_MUZZ5",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Heavy Duty Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_5",
        "IsDefault": false
      },
      "880736428": {
        "HashKey": "COMPONENT_AT_MUZZLE_06",
        "NameGXT": "WCT_MUZZ6",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Slanted Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_6",
        "IsDefault": false
      },
      "1303784126": {
        "HashKey": "COMPONENT_AT_MUZZLE_07",
        "NameGXT": "WCT_MUZZ7",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Split-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_7",
        "IsDefault": false
      },
      "2640679034": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP_02",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_afgrip_2",
        "IsDefault": false
      },
      "3879097257": {
        "HashKey": "COMPONENT_AT_SC_BARREL_01",
        "NameGXT": "WCT_BARR",
        "DescriptionGXT": "WCD_BARR",
        "Name": "Default Barrel",
        "Description": "Stock barrel attachment.",
        "ModelHashKey": "w_ar_sc_barrel_1",
        "IsDefault": true
      },
      "4185880635": {
        "HashKey": "COMPONENT_AT_SC_BARREL_02",
        "NameGXT": "WCT_BARR2",
        "DescriptionGXT": "WCD_BARR2",
        "Name": "Heavy Barrel",
        "Description": "Increases damage dealt to long-range targets.",
        "ModelHashKey": "w_ar_sc_barrel_2",
        "IsDefault": false
      },
      "3557537083": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo1",
        "IsDefault": false
      },
      "1125852043": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo2",
        "IsDefault": false
      },
      "886015732": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo3",
        "IsDefault": false
      },
      "3032680157": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo4",
        "IsDefault": false
      },
      "3999758885": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo5",
        "IsDefault": false
      },
      "3750812792": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo6",
        "IsDefault": false
      },
      "172765678": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo7",
        "IsDefault": false
      },
      "2312089847": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo8",
        "IsDefault": false
      },
      "2072122460": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo9",
        "IsDefault": false
      },
      "2308747125": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo10",
        "IsDefault": false
      },
      "1377355801": {
        "HashKey": "COMPONENT_SPECIALCARBINE_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "w_ar_specialcarbinemk2_camo_ind",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpchristmas2017"
  },
  "2939590305": {
    "HashKey": "WEAPON_RAYPISTOL",
    "NameGXT": "WT_RAYPISTOL",
    "DescriptionGXT": "WTD_RAYPISTOL",
    "Name": "Up-n-Atomizer",
    "Description": "Republican Space Ranger Special, fresh from the galactic war on socialism: no ammo, no mag, just one brutal energy pulse after another.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "w_pi_raygun",
    "DefaultClipSize": 1,
    "Components": {
      "3621517063": {
        "HashKey": "COMPONENT_RAYPISTOL_VARMOD_XMAS18",
        "NameGXT": "WCT_VAR_RAY18",
        "DescriptionGXT": "WCD_VAR_RAY18",
        "Name": "Festive tint",
        "Description": "The Festive tint for the Up-n-Atomizer.",
        "ModelHashKey": "w_pi_raygun_ev",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "RWT_TINT0",
        "Name": "Blue tint"
      },
      {
        "NameGXT": "RWT_TINT1",
        "Name": "Purple tint"
      },
      {
        "NameGXT": "RWT_TINT2",
        "Name": "Green tint"
      },
      {
        "NameGXT": "RWT_TINT3",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "RWT_TINT4",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "RWT_TINT5",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "RWT_TINT6",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpchristmas2018"
  },
  "1198256469": {
    "HashKey": "WEAPON_RAYCARBINE",
    "NameGXT": "WT_RAYCARBINE",
    "DescriptionGXT": "WTD_RAYCARBINE",
    "Name": "Unholy Hellbringer",
    "Description": "Republican Space Ranger Special. If you want to turn a little green man into little green goo, this is the only American way to do it.",
    "Group": "GROUP_MG",
    "ModelHashKey": "w_ar_srifle",
    "DefaultClipSize": 9999,
    "Components": {},
    "Tints": [
      {
        "NameGXT": "RWT_TINT7",
        "Name": "Space Ranger tint"
      },
      {
        "NameGXT": "RWT_TINT1",
        "Name": "Purple tint"
      },
      {
        "NameGXT": "RWT_TINT2",
        "Name": "Green tint"
      },
      {
        "NameGXT": "RWT_TINT3",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "RWT_TINT4",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "RWT_TINT5",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "RWT_TINT6",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpchristmas2018"
  },
  "3056410471": {
    "HashKey": "WEAPON_RAYMINIGUN",
    "NameGXT": "WT_RAYMINIGUN",
    "DescriptionGXT": "WTD_RAYMINIGUN",
    "Name": "Widowmaker",
    "Description": "Republican Space Ranger Special. GO AHEAD, SAY I'M COMPENSATING FOR SOMETHING. I DARE YOU.",
    "Group": "GROUP_HEAVY",
    "ModelHashKey": "w_mg_sminigun",
    "DefaultClipSize": 15000,
    "Components": {
      "3370020614": {
        "HashKey": "COMPONENT_MINIGUN_CLIP_01",
        "NameGXT": "WCT_INVALID",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "",
        "Description": "",
        "ModelHashKey": "",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "RWT_TINT7",
        "Name": "Space Ranger tint"
      },
      {
        "NameGXT": "RWT_TINT1",
        "Name": "Purple tint"
      },
      {
        "NameGXT": "RWT_TINT2",
        "Name": "Green tint"
      },
      {
        "NameGXT": "RWT_TINT3",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "RWT_TINT4",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "RWT_TINT5",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "RWT_TINT6",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpchristmas2018"
  },
  "961495388": {
    "HashKey": "WEAPON_ASSAULTRIFLE_MK2",
    "NameGXT": "WT_RIFLE_ASL2",
    "DescriptionGXT": "WTD_RIFLE_ASL2",
    "Name": "Assault Rifle Mk II",
    "Description": "The definitive revision of an all-time classic: all it takes is a little work, and looks can kill after all.",
    "Group": "GROUP_RIFLE",
    "ModelHashKey": "w_ar_assaultriflemk2",
    "DefaultClipSize": 30,
    "Components": {
      "2249208895": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for regular ammo.",
        "ModelHashKey": "w_ar_assaultriflemk2_mag1",
        "IsDefault": true
      },
      "3509242479": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for regular ammo.",
        "ModelHashKey": "w_ar_assaultriflemk2_mag2",
        "IsDefault": false
      },
      "4012669121": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CLIP_TRACER",
        "NameGXT": "WCT_CLIP_TR",
        "DescriptionGXT": "WCD_CLIP_TR",
        "Name": "Tracer Rounds",
        "Description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity.",
        "ModelHashKey": "w_ar_assaultriflemk2_mag_tr",
        "IsDefault": false
      },
      "4218476627": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity.",
        "ModelHashKey": "w_ar_assaultriflemk2_mag_inc",
        "IsDefault": false
      },
      "2816286296": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CLIP_ARMORPIERCING",
        "NameGXT": "WCT_CLIP_AP",
        "DescriptionGXT": "WCD_CLIP_AP",
        "Name": "Armor Piercing Rounds",
        "Description": "Increased penetration of Body Armor. Reduced capacity.",
        "ModelHashKey": "w_ar_assaultriflemk2_mag_ap",
        "IsDefault": false
      },
      "1675665560": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity.",
        "ModelHashKey": "w_ar_assaultriflemk2_mag_fmj",
        "IsDefault": false
      },
      "2640679034": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP_02",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_afgrip_2",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "1108334355": {
        "HashKey": "COMPONENT_AT_SIGHTS",
        "NameGXT": "WCT_HOLO",
        "DescriptionGXT": "WCD_HOLO",
        "Name": "Holographic Sight",
        "Description": "Accurate sight for close quarters combat.",
        "ModelHashKey": "w_at_sights_1",
        "IsDefault": false
      },
      "77277509": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO_MK2",
        "NameGXT": "WCT_SCOPE_MAC2",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Small Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro",
        "IsDefault": false
      },
      "3328927042": {
        "HashKey": "COMPONENT_AT_SCOPE_MEDIUM_MK2",
        "NameGXT": "WCT_SCOPE_MED2",
        "DescriptionGXT": "WCD_SCOPE_MED",
        "Name": "Large Scope",
        "Description": "Extended-range zoom functionality.",
        "ModelHashKey": "w_at_scope_medium_2",
        "IsDefault": false
      },
      "2805810788": {
        "HashKey": "COMPONENT_AT_AR_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP2",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp_02",
        "IsDefault": false
      },
      "3113485012": {
        "HashKey": "COMPONENT_AT_MUZZLE_01",
        "NameGXT": "WCT_MUZZ1",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Flat Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_1",
        "IsDefault": false
      },
      "3362234491": {
        "HashKey": "COMPONENT_AT_MUZZLE_02",
        "NameGXT": "WCT_MUZZ2",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Tactical Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_2",
        "IsDefault": false
      },
      "3725708239": {
        "HashKey": "COMPONENT_AT_MUZZLE_03",
        "NameGXT": "WCT_MUZZ3",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Fat-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_3",
        "IsDefault": false
      },
      "3968886988": {
        "HashKey": "COMPONENT_AT_MUZZLE_04",
        "NameGXT": "WCT_MUZZ4",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Precision Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_4",
        "IsDefault": false
      },
      "48731514": {
        "HashKey": "COMPONENT_AT_MUZZLE_05",
        "NameGXT": "WCT_MUZZ5",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Heavy Duty Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_5",
        "IsDefault": false
      },
      "880736428": {
        "HashKey": "COMPONENT_AT_MUZZLE_06",
        "NameGXT": "WCT_MUZZ6",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Slanted Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_6",
        "IsDefault": false
      },
      "1303784126": {
        "HashKey": "COMPONENT_AT_MUZZLE_07",
        "NameGXT": "WCT_MUZZ7",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Split-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_7",
        "IsDefault": false
      },
      "1134861606": {
        "HashKey": "COMPONENT_AT_AR_BARREL_01",
        "NameGXT": "WCT_BARR",
        "DescriptionGXT": "WCD_BARR",
        "Name": "Default Barrel",
        "Description": "Stock barrel attachment.",
        "ModelHashKey": "w_at_ar_barrel_1",
        "IsDefault": true
      },
      "1447477866": {
        "HashKey": "COMPONENT_AT_AR_BARREL_02",
        "NameGXT": "WCT_BARR2",
        "DescriptionGXT": "WCD_BARR2",
        "Name": "Heavy Barrel",
        "Description": "Increases damage dealt to long-range targets.",
        "ModelHashKey": "w_at_ar_barrel_2",
        "IsDefault": false
      },
      "2434475183": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo1",
        "IsDefault": false
      },
      "937772107": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo2",
        "IsDefault": false
      },
      "1401650071": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo3",
        "IsDefault": false
      },
      "628662130": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo4",
        "IsDefault": false
      },
      "3309920045": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo5",
        "IsDefault": false
      },
      "3482022833": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo6",
        "IsDefault": false
      },
      "2847614993": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo7",
        "IsDefault": false
      },
      "4234628436": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo8",
        "IsDefault": false
      },
      "2088750491": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo9",
        "IsDefault": false
      },
      "2781053842": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo10",
        "IsDefault": false
      },
      "3115408816": {
        "HashKey": "COMPONENT_ASSAULTRIFLE_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "w_at_armk2_camo_ind1",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpgunrunning"
  },
  "4208062921": {
    "HashKey": "WEAPON_CARBINERIFLE_MK2",
    "NameGXT": "WT_RIFLE_CBN2",
    "DescriptionGXT": "WTD_RIFLE_CBN2",
    "Name": "Carbine Rifle Mk II",
    "Description": "This is bespoke, artisan firepower: you couldn't deliver a hail of bullets with more love and care if you inserted them by hand.",
    "Group": "GROUP_RIFLE",
    "ModelHashKey": "w_ar_carbineriflemk2",
    "DefaultClipSize": 30,
    "Components": {
      "1283078430": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for regular ammo.",
        "ModelHashKey": "w_ar_carbineriflemk2_mag1",
        "IsDefault": true
      },
      "1574296533": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for regular ammo.",
        "ModelHashKey": "w_ar_carbineriflemk2_mag2",
        "IsDefault": false
      },
      "391640422": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CLIP_TRACER",
        "NameGXT": "WCT_CLIP_TR",
        "DescriptionGXT": "WCD_CLIP_TR",
        "Name": "Tracer Rounds",
        "Description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity.",
        "ModelHashKey": "w_ar_carbineriflemk2_mag_tr",
        "IsDefault": false
      },
      "1025884839": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity.",
        "ModelHashKey": "w_ar_carbineriflemk2_mag_inc",
        "IsDefault": false
      },
      "626875735": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CLIP_ARMORPIERCING",
        "NameGXT": "WCT_CLIP_AP",
        "DescriptionGXT": "WCD_CLIP_AP",
        "Name": "Armor Piercing Rounds",
        "Description": "Increased penetration of Body Armor. Reduced capacity.",
        "ModelHashKey": "w_ar_carbineriflemk2_mag_ap",
        "IsDefault": false
      },
      "1141059345": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity.",
        "ModelHashKey": "w_ar_carbineriflemk2_mag_fmj",
        "IsDefault": false
      },
      "2640679034": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP_02",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_afgrip_2",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "1108334355": {
        "HashKey": "COMPONENT_AT_SIGHTS",
        "NameGXT": "WCT_HOLO",
        "DescriptionGXT": "WCD_HOLO",
        "Name": "Holographic Sight",
        "Description": "Accurate sight for close quarters combat.",
        "ModelHashKey": "w_at_sights_1",
        "IsDefault": false
      },
      "77277509": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO_MK2",
        "NameGXT": "WCT_SCOPE_MAC2",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Small Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro",
        "IsDefault": false
      },
      "3328927042": {
        "HashKey": "COMPONENT_AT_SCOPE_MEDIUM_MK2",
        "NameGXT": "WCT_SCOPE_MED2",
        "DescriptionGXT": "WCD_SCOPE_MED",
        "Name": "Large Scope",
        "Description": "Extended-range zoom functionality.",
        "ModelHashKey": "w_at_scope_medium_2",
        "IsDefault": false
      },
      "2205435306": {
        "HashKey": "COMPONENT_AT_AR_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp",
        "IsDefault": false
      },
      "3113485012": {
        "HashKey": "COMPONENT_AT_MUZZLE_01",
        "NameGXT": "WCT_MUZZ1",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Flat Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_1",
        "IsDefault": false
      },
      "3362234491": {
        "HashKey": "COMPONENT_AT_MUZZLE_02",
        "NameGXT": "WCT_MUZZ2",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Tactical Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_2",
        "IsDefault": false
      },
      "3725708239": {
        "HashKey": "COMPONENT_AT_MUZZLE_03",
        "NameGXT": "WCT_MUZZ3",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Fat-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_3",
        "IsDefault": false
      },
      "3968886988": {
        "HashKey": "COMPONENT_AT_MUZZLE_04",
        "NameGXT": "WCT_MUZZ4",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Precision Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_4",
        "IsDefault": false
      },
      "48731514": {
        "HashKey": "COMPONENT_AT_MUZZLE_05",
        "NameGXT": "WCT_MUZZ5",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Heavy Duty Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_5",
        "IsDefault": false
      },
      "880736428": {
        "HashKey": "COMPONENT_AT_MUZZLE_06",
        "NameGXT": "WCT_MUZZ6",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Slanted Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_6",
        "IsDefault": false
      },
      "1303784126": {
        "HashKey": "COMPONENT_AT_MUZZLE_07",
        "NameGXT": "WCT_MUZZ7",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Split-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_7",
        "IsDefault": false
      },
      "2201368575": {
        "HashKey": "COMPONENT_AT_CR_BARREL_01",
        "NameGXT": "WCT_BARR",
        "DescriptionGXT": "WCD_BARR",
        "Name": "Default Barrel",
        "Description": "Stock barrel attachment.",
        "ModelHashKey": "w_at_cr_barrel_1",
        "IsDefault": true
      },
      "2335983627": {
        "HashKey": "COMPONENT_AT_CR_BARREL_02",
        "NameGXT": "WCT_BARR2",
        "DescriptionGXT": "WCD_BARR2",
        "Name": "Heavy Barrel",
        "Description": "Increases damage dealt to long-range targets.",
        "ModelHashKey": "w_at_cr_barrel_2",
        "IsDefault": false
      },
      "1272803094": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo1",
        "IsDefault": false
      },
      "1080719624": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo2",
        "IsDefault": false
      },
      "792221348": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo3",
        "IsDefault": false
      },
      "3842785869": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo4",
        "IsDefault": false
      },
      "3548192559": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo5",
        "IsDefault": false
      },
      "2250671235": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo6",
        "IsDefault": false
      },
      "4095795318": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo7",
        "IsDefault": false
      },
      "2866892280": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo8",
        "IsDefault": false
      },
      "2559813981": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo9",
        "IsDefault": false
      },
      "1796459838": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo10",
        "IsDefault": false
      },
      "3663056191": {
        "HashKey": "COMPONENT_CARBINERIFLE_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "w_ar_carbineriflemk2_camo_ind1",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpgunrunning"
  },
  "3686625920": {
    "HashKey": "WEAPON_COMBATMG_MK2",
    "NameGXT": "WT_MG_CBT2",
    "DescriptionGXT": "WTD_MG_CBT2",
    "Name": "Combat MG Mk II",
    "Description": "You can never have too much of a good thing: after all, if the first shot counts, then the next hundred or so must count for double.",
    "Group": "GROUP_MG",
    "ModelHashKey": "w_mg_combatmgmk2",
    "DefaultClipSize": 100,
    "Components": {
      "1227564412": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for regular ammo.",
        "ModelHashKey": "w_mg_combatmgmk2_mag1",
        "IsDefault": true
      },
      "400507625": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for regular ammo.",
        "ModelHashKey": "w_mg_combatmgmk2_mag2",
        "IsDefault": false
      },
      "4133787461": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CLIP_TRACER",
        "NameGXT": "WCT_CLIP_TR",
        "DescriptionGXT": "WCD_CLIP_TR",
        "Name": "Tracer Rounds",
        "Description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity.",
        "ModelHashKey": "w_mg_combatmgmk2_mag_tr",
        "IsDefault": false
      },
      "3274096058": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity.",
        "ModelHashKey": "w_mg_combatmgmk2_mag_inc",
        "IsDefault": false
      },
      "696788003": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CLIP_ARMORPIERCING",
        "NameGXT": "WCT_CLIP_AP",
        "DescriptionGXT": "WCD_CLIP_AP",
        "Name": "Armor Piercing Rounds",
        "Description": "Increased penetration of Body Armor. Reduced capacity.",
        "ModelHashKey": "w_mg_combatmgmk2_mag_ap",
        "IsDefault": false
      },
      "1475288264": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity.",
        "ModelHashKey": "w_mg_combatmgmk2_mag_fmj",
        "IsDefault": false
      },
      "2640679034": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP_02",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_afgrip_2",
        "IsDefault": false
      },
      "1108334355": {
        "HashKey": "COMPONENT_AT_SIGHTS",
        "NameGXT": "WCT_HOLO",
        "DescriptionGXT": "WCD_HOLO",
        "Name": "Holographic Sight",
        "Description": "Accurate sight for close quarters combat.",
        "ModelHashKey": "w_at_sights_1",
        "IsDefault": false
      },
      "1060929921": {
        "HashKey": "COMPONENT_AT_SCOPE_SMALL_MK2",
        "NameGXT": "WCT_SCOPE_SML2",
        "DescriptionGXT": "WCD_SCOPE_SML",
        "Name": "Medium Scope",
        "Description": "Medium-range zoom functionality.",
        "ModelHashKey": "w_at_scope_small",
        "IsDefault": false
      },
      "3328927042": {
        "HashKey": "COMPONENT_AT_SCOPE_MEDIUM_MK2",
        "NameGXT": "WCT_SCOPE_MED2",
        "DescriptionGXT": "WCD_SCOPE_MED",
        "Name": "Large Scope",
        "Description": "Extended-range zoom functionality.",
        "ModelHashKey": "w_at_scope_medium_2",
        "IsDefault": false
      },
      "3113485012": {
        "HashKey": "COMPONENT_AT_MUZZLE_01",
        "NameGXT": "WCT_MUZZ1",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Flat Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_1",
        "IsDefault": false
      },
      "3362234491": {
        "HashKey": "COMPONENT_AT_MUZZLE_02",
        "NameGXT": "WCT_MUZZ2",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Tactical Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_2",
        "IsDefault": false
      },
      "3725708239": {
        "HashKey": "COMPONENT_AT_MUZZLE_03",
        "NameGXT": "WCT_MUZZ3",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Fat-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_3",
        "IsDefault": false
      },
      "3968886988": {
        "HashKey": "COMPONENT_AT_MUZZLE_04",
        "NameGXT": "WCT_MUZZ4",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Precision Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_4",
        "IsDefault": false
      },
      "48731514": {
        "HashKey": "COMPONENT_AT_MUZZLE_05",
        "NameGXT": "WCT_MUZZ5",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Heavy Duty Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_5",
        "IsDefault": false
      },
      "880736428": {
        "HashKey": "COMPONENT_AT_MUZZLE_06",
        "NameGXT": "WCT_MUZZ6",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Slanted Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_6",
        "IsDefault": false
      },
      "1303784126": {
        "HashKey": "COMPONENT_AT_MUZZLE_07",
        "NameGXT": "WCT_MUZZ7",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Split-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_7",
        "IsDefault": false
      },
      "3276730932": {
        "HashKey": "COMPONENT_AT_MG_BARREL_01",
        "NameGXT": "WCT_BARR",
        "DescriptionGXT": "WCD_BARR",
        "Name": "Default Barrel",
        "Description": "Stock barrel attachment.",
        "ModelHashKey": "w_at_mg_barrel_1",
        "IsDefault": true
      },
      "3051509595": {
        "HashKey": "COMPONENT_AT_MG_BARREL_02",
        "NameGXT": "WCT_BARR2",
        "DescriptionGXT": "WCD_BARR2",
        "Name": "Heavy Barrel",
        "Description": "Increases damage dealt to long-range targets.",
        "ModelHashKey": "w_at_mg_barrel_2",
        "IsDefault": false
      },
      "1249283253": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo1",
        "IsDefault": false
      },
      "3437259709": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo2",
        "IsDefault": false
      },
      "3197423398": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo3",
        "IsDefault": false
      },
      "1980349969": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo4",
        "IsDefault": false
      },
      "1219453777": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo5",
        "IsDefault": false
      },
      "2441508106": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo6",
        "IsDefault": false
      },
      "2220186280": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo7",
        "IsDefault": false
      },
      "457967755": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo8",
        "IsDefault": false
      },
      "235171324": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo9",
        "IsDefault": false
      },
      "42685294": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo10",
        "IsDefault": false
      },
      "3607349581": {
        "HashKey": "COMPONENT_COMBATMG_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "w_mg_combatmgmk2_camo_ind1",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpgunrunning"
  },
  "177293209": {
    "HashKey": "WEAPON_HEAVYSNIPER_MK2",
    "NameGXT": "WT_SNIP_HVY2",
    "DescriptionGXT": "WTD_SNIP_HVY2",
    "Name": "Heavy Sniper Mk II",
    "Description": "Far away, yet always intimate: if you're looking for a secure foundation for that long-distance relationship, this is it.",
    "Group": "GROUP_SNIPER",
    "ModelHashKey": "w_sr_heavysnipermk2",
    "DefaultClipSize": 6,
    "Components": {
      "4196276776": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for regular ammo.",
        "ModelHashKey": "w_sr_heavysnipermk2_mag1",
        "IsDefault": true
      },
      "752418717": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for regular ammo.",
        "ModelHashKey": "w_sr_heavysnipermk2_mag2",
        "IsDefault": false
      },
      "247526935": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC_SN",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which set targets on fire when shot. Reduced capacity.",
        "ModelHashKey": "w_sr_heavysnipermk2_mag_inc",
        "IsDefault": false
      },
      "4164277972": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CLIP_ARMORPIERCING",
        "NameGXT": "WCT_CLIP_AP",
        "DescriptionGXT": "WCD_CLIP_AP",
        "Name": "Armor Piercing Rounds",
        "Description": "Increased penetration of Body Armor. Reduced capacity.",
        "ModelHashKey": "w_sr_heavysnipermk2_mag_ap",
        "IsDefault": false
      },
      "1005144310": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity.",
        "ModelHashKey": "w_sr_heavysnipermk2_mag_fmj",
        "IsDefault": false
      },
      "2313935527": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CLIP_EXPLOSIVE",
        "NameGXT": "WCT_CLIP_EX",
        "DescriptionGXT": "WCD_CLIP_EX",
        "Name": "Explosive Rounds",
        "Description": "Bullets which explode on impact. Reduced capacity.",
        "ModelHashKey": "w_sr_heavysnipermk2_mag_ap2",
        "IsDefault": false
      },
      "2193687427": {
        "HashKey": "COMPONENT_AT_SCOPE_LARGE_MK2",
        "NameGXT": "WCT_SCOPE_LRG2",
        "DescriptionGXT": "WCD_SCOPE_LRG",
        "Name": "Zoom Scope",
        "Description": "Long-range zoom functionality.",
        "ModelHashKey": "w_at_scope_large",
        "IsDefault": false
      },
      "3159677559": {
        "HashKey": "COMPONENT_AT_SCOPE_MAX",
        "NameGXT": "WCT_SCOPE_MAX",
        "DescriptionGXT": "WCD_SCOPE_MAX",
        "Name": "Advanced Scope",
        "Description": "Maximum zoom functionality.",
        "ModelHashKey": "w_at_scope_max",
        "IsDefault": true
      },
      "3061846192": {
        "HashKey": "COMPONENT_AT_SCOPE_NV",
        "NameGXT": "WCT_SCOPE_NV",
        "DescriptionGXT": "WCD_SCOPE_NV",
        "Name": "Night Vision Scope",
        "Description": "Long-range zoom with toggleable night vision.",
        "ModelHashKey": "w_at_scope_nv",
        "IsDefault": false
      },
      "776198721": {
        "HashKey": "COMPONENT_AT_SCOPE_THERMAL",
        "NameGXT": "WCT_SCOPE_TH",
        "DescriptionGXT": "WCD_SCOPE_TH",
        "Name": "Thermal Scope",
        "Description": "Long-range zoom with toggleable thermal vision.",
        "ModelHashKey": "w_at_scope_nv",
        "IsDefault": false
      },
      "2890063729": {
        "HashKey": "COMPONENT_AT_SR_SUPP_03",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_SR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_sr_supp3",
        "IsDefault": false
      },
      "1602080333": {
        "HashKey": "COMPONENT_AT_MUZZLE_08",
        "NameGXT": "WCT_MUZZ8",
        "DescriptionGXT": "WCD_MUZZ_SR",
        "Name": "Squared Muzzle Brake",
        "Description": "Reduces recoil when firing.",
        "ModelHashKey": "w_at_muzzle_8_xm17",
        "IsDefault": false
      },
      "1764221345": {
        "HashKey": "COMPONENT_AT_MUZZLE_09",
        "NameGXT": "WCT_MUZZ9",
        "DescriptionGXT": "WCD_MUZZ_SR",
        "Name": "Bell-End Muzzle Brake",
        "Description": "Reduces recoil when firing.",
        "ModelHashKey": "w_at_muzzle_9",
        "IsDefault": false
      },
      "2425761975": {
        "HashKey": "COMPONENT_AT_SR_BARREL_01",
        "NameGXT": "WCT_BARR",
        "DescriptionGXT": "WCD_BARR",
        "Name": "Default Barrel",
        "Description": "Stock barrel attachment.",
        "ModelHashKey": "w_at_sr_barrel_1",
        "IsDefault": true
      },
      "277524638": {
        "HashKey": "COMPONENT_AT_SR_BARREL_02",
        "NameGXT": "WCT_BARR2",
        "DescriptionGXT": "WCD_BARR2",
        "Name": "Heavy Barrel",
        "Description": "Increases damage dealt to long-range targets.",
        "ModelHashKey": "w_at_sr_barrel_2",
        "IsDefault": false
      },
      "4164123906": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo1",
        "IsDefault": false
      },
      "3317620069": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo2",
        "IsDefault": false
      },
      "3916506229": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo3",
        "IsDefault": false
      },
      "329939175": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo4",
        "IsDefault": false
      },
      "643374672": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo5",
        "IsDefault": false
      },
      "807875052": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo6",
        "IsDefault": false
      },
      "2893163128": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo7",
        "IsDefault": false
      },
      "3198471901": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo8",
        "IsDefault": false
      },
      "3447155842": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo9",
        "IsDefault": false
      },
      "2881858759": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo10",
        "IsDefault": false
      },
      "1815270123": {
        "HashKey": "COMPONENT_HEAVYSNIPER_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "w_at_heavysnipermk2_camo_ind1",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpgunrunning"
  },
  "3219281620": {
    "HashKey": "WEAPON_PISTOL_MK2",
    "NameGXT": "WT_PIST2",
    "DescriptionGXT": "WTD_PIST2",
    "Name": "Pistol Mk II",
    "Description": "Balance, simplicity, precision: nothing keeps the peace like an extended barrel in the other guy's mouth.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "w_pi_pistolmk2",
    "DefaultClipSize": 12,
    "Components": {
      "2499030370": {
        "HashKey": "COMPONENT_PISTOL_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for regular ammo.",
        "ModelHashKey": "w_pi_pistolmk2_mag1",
        "IsDefault": true
      },
      "1591132456": {
        "HashKey": "COMPONENT_PISTOL_MK2_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for regular ammo.",
        "ModelHashKey": "w_pi_pistolmk2_mag2",
        "IsDefault": false
      },
      "634039983": {
        "HashKey": "COMPONENT_PISTOL_MK2_CLIP_TRACER",
        "NameGXT": "WCT_CLIP_TR",
        "DescriptionGXT": "WCD_CLIP_TR",
        "Name": "Tracer Rounds",
        "Description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity.",
        "ModelHashKey": "w_pi_pistolmk2_mag_tr",
        "IsDefault": false
      },
      "733837882": {
        "HashKey": "COMPONENT_PISTOL_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity.",
        "ModelHashKey": "w_pi_pistolmk2_mag_inc",
        "IsDefault": false
      },
      "2248057097": {
        "HashKey": "COMPONENT_PISTOL_MK2_CLIP_HOLLOWPOINT",
        "NameGXT": "WCT_CLIP_HP",
        "DescriptionGXT": "WCD_CLIP_HP",
        "Name": "Hollow Point Rounds",
        "Description": "Increased damage to targets without Body Armor. Reduced capacity.",
        "ModelHashKey": "w_pi_pistolmk2_mag_hp",
        "IsDefault": false
      },
      "1329061674": {
        "HashKey": "COMPONENT_PISTOL_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity.",
        "ModelHashKey": "w_pi_pistolmk2_mag_fmj",
        "IsDefault": false
      },
      "2396306288": {
        "HashKey": "COMPONENT_AT_PI_RAIL",
        "NameGXT": "WCT_SCOPE_PI",
        "DescriptionGXT": "WCD_SCOPE_PI",
        "Name": "Mounted Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_pi_rail_1",
        "IsDefault": false
      },
      "1140676955": {
        "HashKey": "COMPONENT_AT_PI_FLSH_02",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_pi_flsh_2",
        "IsDefault": false
      },
      "1709866683": {
        "HashKey": "COMPONENT_AT_PI_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_PI_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_pi_supp_2",
        "IsDefault": false
      },
      "568543123": {
        "HashKey": "COMPONENT_AT_PI_COMP",
        "NameGXT": "WCT_COMP",
        "DescriptionGXT": "WCD_COMP",
        "Name": "Compensator",
        "Description": "Reduces recoil for rapid fire.",
        "ModelHashKey": "w_at_pi_comp_1",
        "IsDefault": false
      },
      "1550611612": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo1",
        "IsDefault": false
      },
      "368550800": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo2",
        "IsDefault": false
      },
      "2525897947": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo3",
        "IsDefault": false
      },
      "24902297": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo4",
        "IsDefault": false
      },
      "4066925682": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo5",
        "IsDefault": false
      },
      "3710005734": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo6",
        "IsDefault": false
      },
      "3141791350": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo7",
        "IsDefault": false
      },
      "1301287696": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo8",
        "IsDefault": false
      },
      "1597093459": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo9",
        "IsDefault": false
      },
      "1769871776": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo10",
        "IsDefault": false
      },
      "2467084625": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "w_pi_pistolmk2_camo_ind1",
        "IsDefault": false
      },
      "3036451504": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Slide_Camo1",
        "IsDefault": false
      },
      "438243936": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_02_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Slide_Camo2",
        "IsDefault": false
      },
      "3839888240": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_03_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Slide_Camo3",
        "IsDefault": false
      },
      "740920107": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_04_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Slide_Camo4",
        "IsDefault": false
      },
      "3753350949": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_05_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Slide_Camo5",
        "IsDefault": false
      },
      "1809261196": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_06_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Slide_Camo6",
        "IsDefault": false
      },
      "2648428428": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_07_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Slide_Camo7",
        "IsDefault": false
      },
      "3004802348": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_08_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Slide_Camo8",
        "IsDefault": false
      },
      "3330502162": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_09_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Slide_Camo9",
        "IsDefault": false
      },
      "1135718771": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_10_SLIDE",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Slide_Camo10",
        "IsDefault": false
      },
      "1253942266": {
        "HashKey": "COMPONENT_PISTOL_MK2_CAMO_IND_01_SLIDE",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "W_PI_PistolMK2_Camo_Sl_Ind1",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpgunrunning"
  },
  "2024373456": {
    "HashKey": "WEAPON_SMG_MK2",
    "NameGXT": "WT_SMG2",
    "DescriptionGXT": "WTD_SMG2",
    "Name": "SMG Mk II",
    "Description": "Lightweight, compact, with a rate of fire to die very messily for: turn any confined space into a kill box at the click of a well-oiled trigger.",
    "Group": "GROUP_SMG",
    "ModelHashKey": "w_sb_smgmk2",
    "DefaultClipSize": 30,
    "Components": {
      "1277460590": {
        "HashKey": "COMPONENT_SMG_MK2_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for regular ammo.",
        "ModelHashKey": "w_sb_smgmk2_mag1",
        "IsDefault": true
      },
      "3112393518": {
        "HashKey": "COMPONENT_SMG_MK2_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for regular ammo.",
        "ModelHashKey": "w_sb_smgmk2_mag2",
        "IsDefault": false
      },
      "2146055916": {
        "HashKey": "COMPONENT_SMG_MK2_CLIP_TRACER",
        "NameGXT": "WCT_CLIP_TR",
        "DescriptionGXT": "WCD_CLIP_TR",
        "Name": "Tracer Rounds",
        "Description": "Bullets with bright visible markers that match the tint of the gun. Standard capacity.",
        "ModelHashKey": "w_sb_smgmk2_mag_tr",
        "IsDefault": false
      },
      "3650233061": {
        "HashKey": "COMPONENT_SMG_MK2_CLIP_INCENDIARY",
        "NameGXT": "WCT_CLIP_INC",
        "DescriptionGXT": "WCD_CLIP_INC",
        "Name": "Incendiary Rounds",
        "Description": "Bullets which include a chance to set targets on fire when shot. Reduced capacity.",
        "ModelHashKey": "w_sb_smgmk2_mag_inc",
        "IsDefault": false
      },
      "974903034": {
        "HashKey": "COMPONENT_SMG_MK2_CLIP_HOLLOWPOINT",
        "NameGXT": "WCT_CLIP_HP",
        "DescriptionGXT": "WCD_CLIP_HP",
        "Name": "Hollow Point Rounds",
        "Description": "Increased damage to targets without Body Armor. Reduced capacity.",
        "ModelHashKey": "w_sb_smgmk2_mag_hp",
        "IsDefault": false
      },
      "190476639": {
        "HashKey": "COMPONENT_SMG_MK2_CLIP_FMJ",
        "NameGXT": "WCT_CLIP_FMJ",
        "DescriptionGXT": "WCD_CLIP_FMJ",
        "Name": "Full Metal Jacket Rounds",
        "Description": "Increased damage to vehicles. Also penetrates bullet resistant and bulletproof vehicle glass. Reduced capacity.",
        "ModelHashKey": "w_sb_smgmk2_mag_fmj",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2681951826": {
        "HashKey": "COMPONENT_AT_SIGHTS_SMG",
        "NameGXT": "WCT_HOLO",
        "DescriptionGXT": "WCD_HOLO",
        "Name": "Holographic Sight",
        "Description": "Accurate sight for close quarters combat.",
        "ModelHashKey": "w_at_sights_smg",
        "IsDefault": false
      },
      "3842157419": {
        "HashKey": "COMPONENT_AT_SCOPE_MACRO_02_SMG_MK2",
        "NameGXT": "WCT_SCOPE_MAC2",
        "DescriptionGXT": "WCD_SCOPE_MAC",
        "Name": "Small Scope",
        "Description": "Standard-range zoom functionality.",
        "ModelHashKey": "w_at_scope_macro_2_mk2",
        "IsDefault": false
      },
      "1038927834": {
        "HashKey": "COMPONENT_AT_SCOPE_SMALL_SMG_MK2",
        "NameGXT": "WCT_SCOPE_SML2",
        "DescriptionGXT": "WCD_SCOPE_SML",
        "Name": "Medium Scope",
        "Description": "Medium-range zoom functionality.",
        "ModelHashKey": "w_at_scope_small_mk2",
        "IsDefault": false
      },
      "3271853210": {
        "HashKey": "COMPONENT_AT_PI_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_PI_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_pi_supp",
        "IsDefault": false
      },
      "3113485012": {
        "HashKey": "COMPONENT_AT_MUZZLE_01",
        "NameGXT": "WCT_MUZZ1",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Flat Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_1",
        "IsDefault": false
      },
      "3362234491": {
        "HashKey": "COMPONENT_AT_MUZZLE_02",
        "NameGXT": "WCT_MUZZ2",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Tactical Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_2",
        "IsDefault": false
      },
      "3725708239": {
        "HashKey": "COMPONENT_AT_MUZZLE_03",
        "NameGXT": "WCT_MUZZ3",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Fat-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_3",
        "IsDefault": false
      },
      "3968886988": {
        "HashKey": "COMPONENT_AT_MUZZLE_04",
        "NameGXT": "WCT_MUZZ4",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Precision Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_4",
        "IsDefault": false
      },
      "48731514": {
        "HashKey": "COMPONENT_AT_MUZZLE_05",
        "NameGXT": "WCT_MUZZ5",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Heavy Duty Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_5",
        "IsDefault": false
      },
      "880736428": {
        "HashKey": "COMPONENT_AT_MUZZLE_06",
        "NameGXT": "WCT_MUZZ6",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Slanted Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_6",
        "IsDefault": false
      },
      "1303784126": {
        "HashKey": "COMPONENT_AT_MUZZLE_07",
        "NameGXT": "WCT_MUZZ7",
        "DescriptionGXT": "WCD_MUZZ",
        "Name": "Split-End Muzzle Brake",
        "Description": "Reduces recoil during rapid fire.",
        "ModelHashKey": "w_at_muzzle_7",
        "IsDefault": false
      },
      "3641720545": {
        "HashKey": "COMPONENT_AT_SB_BARREL_01",
        "NameGXT": "WCT_BARR",
        "DescriptionGXT": "WCD_BARR",
        "Name": "Default Barrel",
        "Description": "Stock barrel attachment.",
        "ModelHashKey": "w_at_sb_barrel_1",
        "IsDefault": true
      },
      "2774849419": {
        "HashKey": "COMPONENT_AT_SB_BARREL_02",
        "NameGXT": "WCT_BARR2",
        "DescriptionGXT": "WCD_BARR2",
        "Name": "Heavy Barrel",
        "Description": "Increases damage dealt to long-range targets.",
        "ModelHashKey": "w_at_sb_barrel_2",
        "IsDefault": false
      },
      "3298267239": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO",
        "NameGXT": "WCT_CAMO_1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Digital Camo",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo1",
        "IsDefault": false
      },
      "940943685": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO_02",
        "NameGXT": "WCT_CAMO_2",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Brushstroke Camo",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo2",
        "IsDefault": false
      },
      "1263226800": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO_03",
        "NameGXT": "WCT_CAMO_3",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Woodland Camo",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo3",
        "IsDefault": false
      },
      "3966931456": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO_04",
        "NameGXT": "WCT_CAMO_4",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Skull",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo4",
        "IsDefault": false
      },
      "1224100642": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO_05",
        "NameGXT": "WCT_CAMO_5",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Sessanta Nove",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo5",
        "IsDefault": false
      },
      "899228776": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO_06",
        "NameGXT": "WCT_CAMO_6",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Perseus",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo6",
        "IsDefault": false
      },
      "616006309": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO_07",
        "NameGXT": "WCT_CAMO_7",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Leopard",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo7",
        "IsDefault": false
      },
      "2733014785": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO_08",
        "NameGXT": "WCT_CAMO_8",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Zebra",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo8",
        "IsDefault": false
      },
      "572063080": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO_09",
        "NameGXT": "WCT_CAMO_9",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Geometric",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo9",
        "IsDefault": false
      },
      "1170588613": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO_10",
        "NameGXT": "WCT_CAMO_10",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Boom!",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo10",
        "IsDefault": false
      },
      "966612367": {
        "HashKey": "COMPONENT_SMG_MK2_CAMO_IND_01",
        "NameGXT": "WCT_CAMO_IND",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Patriotic",
        "Description": "",
        "ModelHashKey": "w_at_smgmk2_camo_ind1",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WCT_TINT_0",
        "Name": "Classic Black"
      },
      {
        "NameGXT": "WCT_TINT_1",
        "Name": "Classic Gray"
      },
      {
        "NameGXT": "WCT_TINT_2",
        "Name": "Classic Two-Tone"
      },
      {
        "NameGXT": "WCT_TINT_3",
        "Name": "Classic White"
      },
      {
        "NameGXT": "WCT_TINT_4",
        "Name": "Classic Beige"
      },
      {
        "NameGXT": "WCT_TINT_5",
        "Name": "Classic Green"
      },
      {
        "NameGXT": "WCT_TINT_6",
        "Name": "Classic Blue"
      },
      {
        "NameGXT": "WCT_TINT_7",
        "Name": "Classic Earth"
      },
      {
        "NameGXT": "WCT_TINT_8",
        "Name": "Classic Brown & Black"
      },
      {
        "NameGXT": "WCT_TINT_9",
        "Name": "Red Contrast"
      },
      {
        "NameGXT": "WCT_TINT_10",
        "Name": "Blue Contrast"
      },
      {
        "NameGXT": "WCT_TINT_11",
        "Name": "Yellow Contrast"
      },
      {
        "NameGXT": "WCT_TINT_12",
        "Name": "Orange Contrast"
      },
      {
        "NameGXT": "WCT_TINT_13",
        "Name": "Bold Pink"
      },
      {
        "NameGXT": "WCT_TINT_14",
        "Name": "Bold Purple & Yellow"
      },
      {
        "NameGXT": "WCT_TINT_15",
        "Name": "Bold Orange"
      },
      {
        "NameGXT": "WCT_TINT_16",
        "Name": "Bold Green & Purple"
      },
      {
        "NameGXT": "WCT_TINT_17",
        "Name": "Bold Red Features"
      },
      {
        "NameGXT": "WCT_TINT_18",
        "Name": "Bold Green Features"
      },
      {
        "NameGXT": "WCT_TINT_19",
        "Name": "Bold Cyan Features"
      },
      {
        "NameGXT": "WCT_TINT_20",
        "Name": "Bold Yellow Features"
      },
      {
        "NameGXT": "WCT_TINT_21",
        "Name": "Bold Red & White"
      },
      {
        "NameGXT": "WCT_TINT_22",
        "Name": "Bold Blue & White"
      },
      {
        "NameGXT": "WCT_TINT_23",
        "Name": "Metallic Gold"
      },
      {
        "NameGXT": "WCT_TINT_24",
        "Name": "Metallic Platinum"
      },
      {
        "NameGXT": "WCT_TINT_25",
        "Name": "Metallic Gray & Lilac"
      },
      {
        "NameGXT": "WCT_TINT_26",
        "Name": "Metallic Purple & Lime"
      },
      {
        "NameGXT": "WCT_TINT_27",
        "Name": "Metallic Red"
      },
      {
        "NameGXT": "WCT_TINT_28",
        "Name": "Metallic Green"
      },
      {
        "NameGXT": "WCT_TINT_29",
        "Name": "Metallic Blue"
      },
      {
        "NameGXT": "WCT_TINT_30",
        "Name": "Metallic White & Aqua"
      },
      {
        "NameGXT": "WCT_TINT_31",
        "Name": "Metallic Red & Yellow"
      }
    ],
    "DLC": "mpgunrunning"
  },
  "2343591895": {
    "HashKey": "WEAPON_FLASHLIGHT",
    "NameGXT": "WT_FLASHLIGHT",
    "DescriptionGXT": "WTD_FLASHLIGHT",
    "Name": "Flashlight",
    "Description": "Intensify your fear of the dark with this short range, battery-powered light source. Handy for blunt force trauma. Part of The Halloween Surprise.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_flashlight",
    "DefaultClipSize": 0,
    "Components": {
      "3719772431": {
        "HashKey": "COMPONENT_FLASHLIGHT_LIGHT",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_me_flashlight_flash",
        "IsDefault": true
      }
    },
    "Tints": [],
    "DLC": "mphalloween"
  },
  "1198879012": {
    "HashKey": "WEAPON_FLAREGUN",
    "NameGXT": "WT_FLAREGUN",
    "DescriptionGXT": "WTD_FLAREGUN",
    "Name": "Flare Gun",
    "Description": "Use to signal distress or drunken excitement. Warning: pointing directly at individuals may cause spontaneous combustion. Part of The Heists Update.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "w_pi_flaregun",
    "DefaultClipSize": 1,
    "Components": {
      "2481569177": {
        "HashKey": "COMPONENT_FLAREGUN_CLIP_01",
        "NameGXT": "WCT_INVALID",
        "DescriptionGXT": "WCT_INVALID",
        "Name": "",
        "Description": "",
        "ModelHashKey": "w_pi_flaregun_mag1",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINTDF",
        "Name": "Default tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpheist"
  },
  "2460120199": {
    "HashKey": "WEAPON_DAGGER",
    "NameGXT": "WT_DAGGER",
    "DescriptionGXT": "WTD_DAGGER",
    "Name": "Antique Cavalry Dagger",
    "Description": "You've been rocking the pirate-chic look for a while, but no vicious weapon to complete the look? Get this dagger with guarded hilt. Part of The \"I'm Not a Hipster\" Update.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_dagger",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "mphipster"
  },
  "137902532": {
    "HashKey": "WEAPON_VINTAGEPISTOL",
    "NameGXT": "WT_VPISTOL",
    "DescriptionGXT": "WTD_VPISTOL",
    "Name": "Vintage Pistol",
    "Description": "What you really need is a more recognizable gun. Stand out from the crowd at an armed robbery with this engraved pistol. Part of The \"I'm Not a Hipster\" Update.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "w_pi_vintage_pistol",
    "DefaultClipSize": 7,
    "Components": {
      "1168357051": {
        "HashKey": "COMPONENT_VINTAGEPISTOL_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_VPST_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Vintage Pistol.",
        "ModelHashKey": "w_pi_vintage_pistol_mag1",
        "IsDefault": true
      },
      "867832552": {
        "HashKey": "COMPONENT_VINTAGEPISTOL_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_VPST_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Vintage Pistol.",
        "ModelHashKey": "w_pi_vintage_pistol_mag2",
        "IsDefault": false
      },
      "3271853210": {
        "HashKey": "COMPONENT_AT_PI_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_PI_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_pi_supp",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mphipster"
  },
  "2138347493": {
    "HashKey": "WEAPON_FIREWORK",
    "NameGXT": "WT_FIREWRK",
    "DescriptionGXT": "WTD_FIREWRK",
    "Name": "Firework Launcher",
    "Description": "Put the flair back in flare with this firework launcher, guaranteed to raise some oohs and aahs from the crowd. Part of the Independence Day Special.",
    "Group": "GROUP_HEAVY",
    "ModelHashKey": "w_lr_firework",
    "DefaultClipSize": 1,
    "Components": {
      "3840197261": {
        "HashKey": "COMPONENT_FIREWORK_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_FWRK_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Firework Launcher.",
        "ModelHashKey": "",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINTDF",
        "Name": "Default tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpindependence"
  },
  "2828843422": {
    "HashKey": "WEAPON_MUSKET",
    "NameGXT": "WT_MUSKET",
    "DescriptionGXT": "WTD_MUSKET",
    "Name": "Musket",
    "Description": "Armed with nothing but muskets and a superiority complex, the Brits took over half the world. Own the gun that built an empire. Part of the Independence Day Special.",
    "Group": "GROUP_SNIPER",
    "ModelHashKey": "w_ar_musket",
    "DefaultClipSize": 1,
    "Components": {
      "1322387263": {
        "HashKey": "COMPONENT_MUSKET_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_MSKT_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Musket.",
        "ModelHashKey": "p_w_ar_musket_chrg",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINTDF",
        "Name": "Default tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpindependence"
  },
  "3713923289": {
    "HashKey": "WEAPON_MACHETE",
    "NameGXT": "WT_MACHETE",
    "DescriptionGXT": "WTD_MACHETE",
    "Name": "Machete",
    "Description": "America's West African arms trade isn't just about giving. Rediscover the simple life with this rusty cleaver. Part of Lowriders.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_machette_lr",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "mplowrider"
  },
  "3675956304": {
    "HashKey": "WEAPON_MACHINEPISTOL",
    "NameGXT": "WT_MCHPIST",
    "DescriptionGXT": "WTD_MCHPIST",
    "Name": "Machine Pistol",
    "Description": "This fully automatic is the snare drum to your twin-engine V8 bass: no drive-by sounds quite right without it. Part of Lowriders.",
    "Group": "GROUP_SMG",
    "ModelHashKey": "w_sb_compactsmg",
    "DefaultClipSize": 12,
    "Components": {
      "1198425599": {
        "HashKey": "COMPONENT_MACHINEPISTOL_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_MCHP_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Machine Pistol.",
        "ModelHashKey": "w_sb_compactsmg_mag1",
        "IsDefault": true
      },
      "3106695545": {
        "HashKey": "COMPONENT_MACHINEPISTOL_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_MCHP_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Machine Pistol.",
        "ModelHashKey": "w_sb_compactsmg_mag2",
        "IsDefault": false
      },
      "2850671348": {
        "HashKey": "COMPONENT_MACHINEPISTOL_CLIP_03",
        "NameGXT": "WCT_CLIP_DRM",
        "DescriptionGXT": "WCD_CLIP3",
        "Name": "Drum Magazine",
        "Description": "Expanded capacity and slower reload.",
        "ModelHashKey": "w_sb_compactsmg_boxmag",
        "IsDefault": false
      },
      "3271853210": {
        "HashKey": "COMPONENT_AT_PI_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_PI_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_pi_supp",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mplowrider"
  },
  "1649403952": {
    "HashKey": "WEAPON_COMPACTRIFLE",
    "NameGXT": "WT_CMPRIFLE",
    "DescriptionGXT": "WTD_CMPRIFLE",
    "Name": "Compact Rifle",
    "Description": "Half the size, all the power, double the recoil: there's no riskier way to say \"I'm compensating for something\". Part of Lowriders: Custom Classics.",
    "Group": "GROUP_RIFLE",
    "ModelHashKey": "w_ar_assaultrifle_smg",
    "DefaultClipSize": 30,
    "Components": {
      "1363085923": {
        "HashKey": "COMPONENT_COMPACTRIFLE_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_CMPR_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Compact Rifle.",
        "ModelHashKey": "w_ar_assaultrifle_smg_mag1",
        "IsDefault": true
      },
      "1509923832": {
        "HashKey": "COMPONENT_COMPACTRIFLE_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_CMPR_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Compact Rifle.",
        "ModelHashKey": "w_ar_assaultrifle_smg_mag2",
        "IsDefault": false
      },
      "3322377230": {
        "HashKey": "COMPONENT_COMPACTRIFLE_CLIP_03",
        "NameGXT": "WCT_CLIP_DRM",
        "DescriptionGXT": "WCD_CLIP3",
        "Name": "Drum Magazine",
        "Description": "Expanded capacity and slower reload.",
        "ModelHashKey": "w_ar_assaultrifle_boxmag",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mplowrider2"
  },
  "4019527611": {
    "HashKey": "WEAPON_DBSHOTGUN",
    "NameGXT": "WT_DBSHGN",
    "DescriptionGXT": "WTD_DBSHGN",
    "Name": "Double Barrel Shotgun",
    "Description": "Do one thing, do it well. Who needs a high rate of fire when your first shot turns the other guy into a fine mist? Part of Lowriders: Custom Classics.",
    "Group": "GROUP_SHOTGUN",
    "ModelHashKey": "w_sg_doublebarrel",
    "DefaultClipSize": 2,
    "Components": {
      "703231006": {
        "HashKey": "COMPONENT_DBSHOTGUN_CLIP_01",
        "NameGXT": "WCT_INVALID",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "",
        "Description": "",
        "ModelHashKey": "w_sg_doublebarrel_mag1",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINTDF",
        "Name": "Default tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mplowrider2"
  },
  "984333226": {
    "HashKey": "WEAPON_HEAVYSHOTGUN",
    "NameGXT": "WT_HVYSHGN",
    "DescriptionGXT": "WTD_HVYSHGN",
    "Name": "Heavy Shotgun",
    "Description": "The weapon to reach for when you absolutely need to make a horrible mess of the room. Best used near easy-wipe surfaces only. Part of the Last Team Standing Update.",
    "Group": "GROUP_SHOTGUN",
    "ModelHashKey": "w_sg_heavyshotgun",
    "DefaultClipSize": 6,
    "Components": {
      "844049759": {
        "HashKey": "COMPONENT_HEAVYSHOTGUN_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_HVSG_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Heavy Shotgun.",
        "ModelHashKey": "w_sg_heavyshotgun_mag1",
        "IsDefault": true
      },
      "2535257853": {
        "HashKey": "COMPONENT_HEAVYSHOTGUN_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_HVSG_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Heavy Shotgun.",
        "ModelHashKey": "w_sg_heavyshotgun_mag2",
        "IsDefault": false
      },
      "2294798931": {
        "HashKey": "COMPONENT_HEAVYSHOTGUN_CLIP_03",
        "NameGXT": "WCT_CLIP_DRM",
        "DescriptionGXT": "WCD_CLIP3",
        "Name": "Drum Magazine",
        "Description": "Expanded capacity and slower reload.",
        "ModelHashKey": "w_sg_heavyshotgun_boxmag",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2805810788": {
        "HashKey": "COMPONENT_AT_AR_SUPP_02",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP2",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp_02",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mplts"
  },
  "3342088282": {
    "HashKey": "WEAPON_MARKSMANRIFLE",
    "NameGXT": "WT_MKRIFLE",
    "DescriptionGXT": "WTD_MKRIFLE",
    "Name": "Marksman Rifle",
    "Description": "Whether you're up close or a disconcertingly long way away, this weapon will get the job done. A multi-range tool for tools. Part of the Last Team Standing Update.",
    "Group": "GROUP_SNIPER",
    "ModelHashKey": "w_sr_marksmanrifle",
    "DefaultClipSize": 8,
    "Components": {
      "3627761985": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_MKRF_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Marksman Rifle.",
        "ModelHashKey": "w_sr_marksmanrifle_mag1",
        "IsDefault": true
      },
      "3439143621": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_MKRF_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Marksman Rifle.",
        "ModelHashKey": "w_sr_marksmanrifle_mag2",
        "IsDefault": false
      },
      "471997210": {
        "HashKey": "COMPONENT_AT_SCOPE_LARGE_FIXED_ZOOM",
        "NameGXT": "WCT_SCOPE_LRG",
        "DescriptionGXT": "WCD_SCOPE_LRF",
        "Name": "Scope",
        "Description": "Long-range fixed zoom functionality.",
        "ModelHashKey": "w_at_scope_large",
        "IsDefault": true
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "2205435306": {
        "HashKey": "COMPONENT_AT_AR_SUPP",
        "NameGXT": "WCT_SUPP",
        "DescriptionGXT": "WCD_AR_SUPP",
        "Name": "Suppressor",
        "Description": "Reduces noise and muzzle flash.",
        "ModelHashKey": "w_at_ar_supp",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      },
      "371102273": {
        "HashKey": "COMPONENT_MARKSMANRIFLE_VARMOD_LUXE",
        "NameGXT": "WCT_VAR_GOLD",
        "DescriptionGXT": "WCD_VAR_MKRF",
        "Name": "Yusuf Amir Luxury Finish",
        "Description": "",
        "ModelHashKey": "W_SR_MarksmanRifle_Luxe",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mplts"
  },
  "171789620": {
    "HashKey": "WEAPON_COMBATPDW",
    "NameGXT": "WT_COMBATPDW",
    "DescriptionGXT": "WTD_COMBATPDW",
    "Name": "Combat PDW",
    "Description": "Who said personal weaponry couldn't be worthy of military personnel? Thanks to our lobbyists, not Congress. Integral suppressor. Part of the Ill-Gotten Gains Update Part 1.",
    "Group": "GROUP_SMG",
    "ModelHashKey": "W_SB_PDW",
    "DefaultClipSize": 30,
    "Components": {
      "1125642654": {
        "HashKey": "COMPONENT_COMBATPDW_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_PDW_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Combat PDW.",
        "ModelHashKey": "W_SB_PDW_Mag1",
        "IsDefault": true
      },
      "860508675": {
        "HashKey": "COMPONENT_COMBATPDW_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_PDW_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Combat PDW.",
        "ModelHashKey": "W_SB_PDW_Mag2",
        "IsDefault": false
      },
      "1857603803": {
        "HashKey": "COMPONENT_COMBATPDW_CLIP_03",
        "NameGXT": "WCT_CLIP_DRM",
        "DescriptionGXT": "WCD_CLIP3",
        "Name": "Drum Magazine",
        "Description": "Expanded capacity and slower reload.",
        "ModelHashKey": "w_sb_pdw_boxmag",
        "IsDefault": false
      },
      "2076495324": {
        "HashKey": "COMPONENT_AT_AR_FLSH",
        "NameGXT": "WCT_FLASH",
        "DescriptionGXT": "WCD_FLASH",
        "Name": "Flashlight",
        "Description": "Aids low light target acquisition.",
        "ModelHashKey": "w_at_ar_flsh",
        "IsDefault": false
      },
      "202788691": {
        "HashKey": "COMPONENT_AT_AR_AFGRIP",
        "NameGXT": "WCT_GRIP",
        "DescriptionGXT": "WCD_GRIP",
        "Name": "Grip",
        "Description": "Improves weapon accuracy.",
        "ModelHashKey": "w_at_ar_afgrip",
        "IsDefault": false
      },
      "2855028148": {
        "HashKey": "COMPONENT_AT_SCOPE_SMALL",
        "NameGXT": "WCT_SCOPE_SML",
        "DescriptionGXT": "WCD_SCOPE_SML",
        "Name": "Scope",
        "Description": "Medium-range zoom functionality.",
        "ModelHashKey": "w_at_scope_small",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpluxe"
  },
  "3638508604": {
    "HashKey": "WEAPON_KNUCKLE",
    "NameGXT": "WT_KNUCKLE",
    "DescriptionGXT": "WTD_KNUCKLE",
    "Name": "Knuckle Duster",
    "Description": "Perfect for knocking out gold teeth, or as a gift to the trophy partner who has everything. Part of The Ill-Gotten Gains Update Part 2.",
    "Group": "GROUP_UNARMED",
    "ModelHashKey": "W_ME_Knuckle",
    "DefaultClipSize": 0,
    "Components": {
      "4081463091": {
        "HashKey": "COMPONENT_KNUCKLE_VARMOD_BASE",
        "NameGXT": "WCT_KNUCK_01",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "Base Model",
        "Description": "",
        "ModelHashKey": "W_ME_Knuckle",
        "IsDefault": false
      },
      "3323197061": {
        "HashKey": "COMPONENT_KNUCKLE_VARMOD_PIMP",
        "NameGXT": "WCT_KNUCK_02",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "The Pimp",
        "Description": "",
        "ModelHashKey": "W_ME_Knuckle_02",
        "IsDefault": false
      },
      "4007263587": {
        "HashKey": "COMPONENT_KNUCKLE_VARMOD_BALLAS",
        "NameGXT": "WCT_KNUCK_BG",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "The Ballas",
        "Description": "",
        "ModelHashKey": "W_ME_Knuckle_BG",
        "IsDefault": false
      },
      "1351683121": {
        "HashKey": "COMPONENT_KNUCKLE_VARMOD_DOLLAR",
        "NameGXT": "WCT_KNUCK_DLR",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "The Hustler",
        "Description": "",
        "ModelHashKey": "W_ME_Knuckle_DLR",
        "IsDefault": false
      },
      "2539772380": {
        "HashKey": "COMPONENT_KNUCKLE_VARMOD_DIAMOND",
        "NameGXT": "WCT_KNUCK_DMD",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "The Rock",
        "Description": "",
        "ModelHashKey": "W_ME_Knuckle_DMD",
        "IsDefault": false
      },
      "2112683568": {
        "HashKey": "COMPONENT_KNUCKLE_VARMOD_HATE",
        "NameGXT": "WCT_KNUCK_HT",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "The Hater",
        "Description": "",
        "ModelHashKey": "W_ME_Knuckle_HT",
        "IsDefault": false
      },
      "1062111910": {
        "HashKey": "COMPONENT_KNUCKLE_VARMOD_LOVE",
        "NameGXT": "WCT_KNUCK_LV",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "The Lover",
        "Description": "",
        "ModelHashKey": "W_ME_Knuckle_LV",
        "IsDefault": false
      },
      "146278587": {
        "HashKey": "COMPONENT_KNUCKLE_VARMOD_PLAYER",
        "NameGXT": "WCT_KNUCK_PC",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "The Player",
        "Description": "",
        "ModelHashKey": "W_ME_Knuckle_PC",
        "IsDefault": false
      },
      "3800804335": {
        "HashKey": "COMPONENT_KNUCKLE_VARMOD_KING",
        "NameGXT": "WCT_KNUCK_SLG",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "The King",
        "Description": "",
        "ModelHashKey": "W_ME_Knuckle_SLG",
        "IsDefault": false
      },
      "2062808965": {
        "HashKey": "COMPONENT_KNUCKLE_VARMOD_VAGOS",
        "NameGXT": "WCT_KNUCK_VG",
        "DescriptionGXT": "WCD_VAR_DESC",
        "Name": "The Vagos",
        "Description": "",
        "ModelHashKey": "W_ME_Knuckle_VG",
        "IsDefault": false
      }
    },
    "Tints": [],
    "DLC": "mpluxe2"
  },
  "3696079510": {
    "HashKey": "WEAPON_MARKSMANPISTOL",
    "NameGXT": "WT_MKPISTOL",
    "DescriptionGXT": "WTD_MKPISTOL",
    "Name": "Marksman Pistol",
    "Description": "Not for the risk averse. Make it count as you'll be reloading as much as you shoot. Part of The Ill-Gotten Gains Update Part 2.",
    "Group": "GROUP_PISTOL",
    "ModelHashKey": "W_PI_SingleShot",
    "DefaultClipSize": 1,
    "Components": {
      "3416146413": {
        "HashKey": "COMPONENT_MARKSMANPISTOL_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_INVALID",
        "Name": "Default Clip",
        "Description": "",
        "ModelHashKey": "W_PI_SingleShot_Shell",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINTDF",
        "Name": "Default tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpluxe2"
  },
  "1627465347": {
    "HashKey": "WEAPON_GUSENBERG",
    "NameGXT": "WT_GUSNBRG",
    "DescriptionGXT": "WTD_GUSNBRG",
    "Name": "Gusenberg Sweeper",
    "Description": "Complete your look with a Prohibition gun. Looks great being fired from an Albany Roosevelt or paired with a pinstripe suit. Part of the Valentine's Day Massacre Special.",
    "Group": "GROUP_MG",
    "ModelHashKey": "w_sb_gusenberg",
    "DefaultClipSize": 30,
    "Components": {
      "484812453": {
        "HashKey": "COMPONENT_GUSENBERG_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_GSNB_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Gusenberg Sweeper.",
        "ModelHashKey": "w_sb_gusenberg_mag1",
        "IsDefault": true
      },
      "3939025520": {
        "HashKey": "COMPONENT_GUSENBERG_CLIP_02",
        "NameGXT": "WCT_CLIP2",
        "DescriptionGXT": "WCD_GSNB_CLIP2",
        "Name": "Extended Clip",
        "Description": "Extended capacity for Gusenberg Sweeper.",
        "ModelHashKey": "w_sb_gusenberg_mag2",
        "IsDefault": false
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "mpvalentines"
  },
  "4191993645": {
    "HashKey": "WEAPON_HATCHET",
    "NameGXT": "WT_HATCHET",
    "DescriptionGXT": "WTD_HATCHET",
    "Name": "Hatchet",
    "Description": "Make kindling... of your pals with this easy to wield, easy to hide hatchet. Exclusive content for returning players.",
    "Group": "GROUP_MELEE",
    "ModelHashKey": "w_me_hatchet",
    "DefaultClipSize": 0,
    "Components": {},
    "Tints": [],
    "DLC": "spupgrade"
  },
  "1834241177": {
    "HashKey": "WEAPON_RAILGUN",
    "NameGXT": "WT_RAILGUN",
    "DescriptionGXT": "WTD_RAILGUN",
    "Name": "Railgun",
    "Description": "All you need to know is - magnets, and it does horrible things to the things it's pointed at. Exclusive content for returning players.",
    "Group": "GROUP_HEAVY",
    "ModelHashKey": "w_ar_railgun",
    "DefaultClipSize": 1,
    "Components": {
      "59044840": {
        "HashKey": "COMPONENT_RAILGUN_CLIP_01",
        "NameGXT": "WCT_CLIP1",
        "DescriptionGXT": "WCD_RLGN_CLIP1",
        "Name": "Default Clip",
        "Description": "Standard capacity for Railgun.",
        "ModelHashKey": "w_ar_railgun_mag1",
        "IsDefault": true
      }
    },
    "Tints": [
      {
        "NameGXT": "WM_TINT0",
        "Name": "Black tint"
      },
      {
        "NameGXT": "WM_TINT1",
        "Name": "Green tint"
      },
      {
        "NameGXT": "WM_TINT2",
        "Name": "Gold tint"
      },
      {
        "NameGXT": "WM_TINT3",
        "Name": "Pink tint"
      },
      {
        "NameGXT": "WM_TINT4",
        "Name": "Army tint"
      },
      {
        "NameGXT": "WM_TINT5",
        "Name": "LSPD tint"
      },
      {
        "NameGXT": "WM_TINT6",
        "Name": "Orange tint"
      },
      {
        "NameGXT": "WM_TINT7",
        "Name": "Platinum tint"
      }
    ],
    "DLC": "spupgrade"
  }
}
},{}],7:[function(require,module,exports){
const weaponData = require("./weaponData");

const PistolAttachmentPos = new mp.Vector3(0.02, 0.06, 0.1);
const PistolAttachmentRot = new mp.Vector3(-100.0, 0.0, 0.0);

const SMGAttachmentPos = new mp.Vector3(0.08, 0.03, -0.1);
const SMGAttachmentRot = new mp.Vector3(-80.77, 0.0, 0.0);

const ShotgunAttachmentPos = new mp.Vector3(-0.1, -0.12, 0.11);
const ShotgunAttachmentRot = new mp.Vector3(-180.0, 0.0, 0.0);

const RifleAttachmentPos = new mp.Vector3(-0.1, -0.15, -0.13);
const RifleAttachmentRot = new mp.Vector3(0.0, 0.0, 3.5);

/*
    Weapon names have to be uppercase!
    You can get attachment bone IDs from https://wiki.rage.mp/index.php?title=Bones
 */
const weaponAttachmentData = {
    // Pistols
    "weapon_hatchet": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: new mp.Vector3(-100.0, 110.0, 0.0) },

    "WEAPON_PISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_PISTOL_MK2": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_COMBATPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_APPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_STUNGUN": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_PISTOL50": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_SNSPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_SNSPISTOL_MK2": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_HEAVYPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_VINTAGEPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_REVOLVER": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_REVOLVER_MK2": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_DOUBLEACTION": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_RAYPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },

    // Submachine Guns
    "WEAPON_MICROSMG": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_SMG": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_SMG_MK2": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_ASSAULTSMG": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_COMBATPDW": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_MACHINEPISTOL": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_MINISMG": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },

    // Shotguns
    "WEAPON_PUMPSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_PUMPSHOTGUN_MK2": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_SAWNOFFSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_ASSAULTSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_BULLPUPSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_HEAVYSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },

    // Rifles
    "WEAPON_ASSAULTRIFLE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_ASSAULTRIFLE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_CARBINERIFLE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_CARBINERIFLE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_SPECIALCARBINE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_SPECIALCARBINE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_MARKSMANRIFLE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_MARKSMANRIFLE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot }
};

// Update weaponAttachmentData with attachment name and model
for (let weapon in weaponAttachmentData) {
    let hash = mp.game.joaat(weapon);

    if (weaponData[hash]) {
        weaponAttachmentData[weapon].AttachName = weaponData[hash].HashKey;
        weaponAttachmentData[weapon].AttachModel = weaponData[hash].ModelHashKey;
    } else {
        console.log(`[!] ${weapon} not found in weapon data file and will cause issues, remove it from weaponAttachmentData.`);
    }
}



for (let weapon in weaponAttachmentData) {
    mp.attachmentMngr.register(weaponAttachmentData[weapon].AttachName, weaponAttachmentData[weapon].AttachModel, weaponAttachmentData[weapon].AttachBone, weaponAttachmentData[weapon].AttachPosition, weaponAttachmentData[weapon].AttachRotation);
}


},{"./weaponData":6}],8:[function(require,module,exports){
//mp.canCrouch = true;
const loadAnimDict = (AnimDictName) => {
    if (!mp.game.streaming.hasAnimDictLoaded(AnimDictName)) {
        mp.game.streaming.requestAnimDict(AnimDictName);
        while (mp.game.streaming.hasAnimDictLoaded(AnimDictName)) mp.game.wait(1);
    }
};



loadAnimDict("move_crawl");
//loadAnimDict("move_crawlprone2crawlfront");



const movementClipSet = "move_ped_crouched";
const strafeClipSet = "move_ped_crouched_strafing";
const clipSetSwitchTime = 0.5;
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){

/*
    Previous attempt to generate Navmesh for zombies
*/
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
/*
    Previous attempt to generate Navmesh for zombies
*/
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


/*
    Pathfinder class for Zombies
*/
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
    /*
        Render Pathfinder logic

    */
    render() {

    }
    /*
        Is from-to LOS Clear
    */
    isValid(from, to) {
        return mp.raycasting.testCapsule(from, to, 0.5, null, (1 | 2 | 16 | 256)) ? false : true;
    }
    /*
        Get Position in LOS to vector
    */
    getNearest(from, to) {
        let rc = mp.raycasting.testCapsule(from, to, 0.2, null, (1 | 2 | 16 | 256));
        return rc ? rc.position : false;
    }
    /*
        get nearest noise location without LOS
    */
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
                targetPosition = this.getNearest(this.position.add(0,0,1), loudest[0].position)
            }
        }
        return targetPosition;
    };
    /*
        get best target in LoS
    */
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
    }/*
        get random location for idle walk
    */
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
    }/*
        update next move
    */
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
    /*
        insert info
    */
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
    /*
        get next move
    */
    next() {
        return this.nextAction;
    }
}
module.exports = Pathfinder;
},{}],11:[function(require,module,exports){
var Bones = require("./libs/skeleton.js")
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
/*
    Basic Ped Sync Class (extended for other modules)
    includes basic tick event and destroy class.
*/
class SyncPed {
    constructor(remote_id) {
        this._remote_id = remote_id;
        this._ped = mp.peds.atRemoteId(this._remote_id);
        console.log("got SyncPed", this._remote_id, this._ped)
        console.log("sync_id", this._ped.getVariable('sync_id'))
        this.ticker = new mp.Event("client:Tick", () => {
            this.tick();
        });
    }
    /*
        Destroys a Synced Ped clientside (drop syncer)
    */
    destroy() {
        if (this.ticker) {
            this.ticker.destroy();
        }
        if (this._renderEvent) {
            this._renderEvent.destroy();
        }
    }
    tick() {
        console.log("default tick");
    }
}
/*
    Extended SyncPed class for Zombie AI
    @TODO add arguments for noiseAlertness, viewDistance for different zombieTypes
*/
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
    /*
        Check if ped has abnormal status
    */
    status() {
        if (this._ped.getVariable('DEAD')) this.flag = Flags.DEAD;
        if (this._ped.isRagdoll()) this.flag = Flags.RAGDOLL;
        if ((this.flag == Flags.RAGDOLL) && (!this._ped.isRagdoll())) {
            this.flag = Flags.IDLE
            mp.peds.forEachInStreamRange((ped) => {
                if (!ped.getVariable('zombie')) return;
                ped.setNoCollision(this._ped.handle, true);
            })
        }
        if ((this.flag == Flags.RAGDOLL)) {
            mp.peds.forEachInStreamRange((ped) => {
                if (!ped.getVariable('zombie')) return;
                ped.setNoCollision(this._ped.handle, false);
            })
        }
        //if (this._ped.isDeadOrDying(true)) this.flag = Flags.DEAD;
    }
    /*
        Debug render info
    */
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
            mp.game.graphics.drawMarker(28, this.currentTargetPosition.x, this.currentTargetPosition.y, this.currentTargetPosition.z - 0.25, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0, 255, 0, 255, false, false, 2, false, "", "", false);
            mp.game.graphics.drawLine(position.x, position.y, position.z + 1, this.currentTargetPosition.x, this.currentTargetPosition.y, this.currentTargetPosition.z, 0, 255, 0, 255);
        }
    }
    /*
        Set ped attributes so it doesnt flee and cower
    */
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
        //this._ped.setRandomComponentVariation(false);
        this._ped.applyDamagePack("BigHitByVehicle", 100, 1);
        this._ped.applyDamagePack("Explosion_Med", 100, 1);
        this._ped.applyDamagePack("Explosion_Large", 100, 1);
        this._ped.applyDamagePack("SCR_Torture", 100, 1);
        this._ped.applyDamagePack("SCR_Shark", 100, 1);
        this._ped.applyDamagePack("BigRunOverByVehicle", 100, 1);
        this._ped.setMaxHealth((100 + this._ped.getVariable('MAX_HEALTH')));
        this._ped.setHealth((100 + this._ped.getVariable('HEALTH')));
        let position = mp.vector(this._ped.getCoords(true))
        this._ped.taskPlantBomb(position.x, position.y, position.z, this._ped.getHeading());
    }
    /*
        Apply hit to player (make it stumble and so on)
    */
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
    /*
        Kill Ped
    */
    kill() {
        this._ped.setHealth(0);
        this._ped.setToRagdoll(1000, 1000, 3, false, false, false);
        this.flag = Flags.DEAD;
    }
    /*
        On Init (load walkstyle etc)
    */
    init() {
        if (!mp.game.streaming.hasClipSetLoaded(this.walkStyle)) {
            mp.game.streaming.requestClipSet(this.walkStyle);
            while (!mp.game.streaming.hasClipSetLoaded(this.walkStyle)) mp.game.wait(0);
        }
        this._ped.setMovementClipset(this.walkStyle, 0.0);
        this.loadPedAttributes();
    }
    /*
       on IDLE
       TODO
    */
    idle() {
        //this.flag = Flags.IDLE;
        //console.log("PED", this.flag);
    }
    /*
       Walk to position
       
    */
    walk(position) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        this._ped.taskGoToCoordAnyMeans(position.x, position.y, position.z, 1, 0, false, 786603, 0);
        //this._ped.taskGoStraightToCoord(position.x, position.y, position.z, 0.4, 15000, this.newHeading, 0);
    }
    /*
       Run to position
       
    */
    run(position) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        if (!position) return false;
        if (!this.position) return false;
        this._ped.taskGoToCoordAnyMeans(position.x, position.y, position.z, 6.2, 0, false, 786603, 0);
        if (this.position.z > position.z + 2) {
            this._ped.taskGoStraightToCoord(position.x, position.y, position.z, 6.2, -1, this._ped.getHeading(), 2);
        }
    }
    /*
       Sprint to position
       
    */
    sprint(position) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        if (!position) return false;
        if (!this.position) return false;
        this._ped.taskGoToCoordAnyMeans(position.x, position.y, position.z, 12.4, 0, false, 786603, 0);
        if (this.position.z > position.z + 1) {
            this._ped.taskGoStraightToCoord(position.x, position.y, position.z, 12.4, -1, this._ped.getHeading(), 2);
        }
    }
    /*
       Meele target
       
    */
    meele(targetHandle) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        this._ped.taskPutDirectlyIntoMelee(targetHandle, 0.0, -1.0, 1.0, false);
        //this._ped.taskPlayAnim("melee@unarmed@streamed_core", "running_punch_no_target", 8.0, 1.0, -1, 1, 1.0, false, false, false);
        //this._ped.taskPlayAnim("melee@unarmed@streamed_core", "walking_punch_no_target", 32.0, 1.0, -1, 1, 1.0, false, false, false);
        //this._ped.taskPlayAnim("melee@unarmed@streamed_core", "running_punch_no_target", 8.0, 1.0, -1, 1, 1.0, false, false, false);
    }
    /*
       Initiate Combat
       
    */
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
            this.currentTargetPosition = tEntityPos;
            if (this.zombieType == "runner") this.run(tEntityPos);
            if (this.zombieType == "walker") this.walk(tEntityPos);
            if (this.zombieType == "sprinter") this.sprint(tEntityPos);
        }
    }
    /*
       Find new position, pathfinding etc
       
    */
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
            if (this._ped.hasBeenDamagedByAnyObject() || this._ped.hasBeenDamagedByAnyPed() || this._ped.hasBeenDamagedByAnyVehicle()) {
                console.log("hit")
            }
        } else {
            this._ped.setHealth(0);
            this._ped.setToRagdoll(1000, 1000, 3, false, false, false);
        }
        //this._ped.taskWanderStandard(10.00, 10);
    }
}
/*
    Called when a players gets the job to sync a Server-NPC
*/
mp.events.add('acknowledgeSync', (type, remote_id) => {
    console.log("acknowledgeSync", type, remote_id);
    SyncWorld.acknowledge(type, remote_id);
});
/*
    Called when a players loses the job to sync a Server-NPC
*/
mp.events.add('rejectSync', (type, remote_id, kill) => {
    console.log("rejectSync", type, remote_id);
    SyncWorld.reject(type, remote_id, kill);
});
/*
    Called when a player shot a Server-NPC (to call .applyHit() and simulate ai)
*/
mp.events.add('acknowledgeHit', (remote_id, hitData) => {
    console.log("acknowledgeHit", remote_id, hitData);
    let SyncedPed = SyncWorld.getByID(remote_id);
    if (SyncedPed) {
        SyncedPed.applyHit(hitData);
    }
});
/*
    Test Decals
*/
mp.events.add("playerCommand", (command) => {
    const args = command.split(/[ ]+/);
    const commandName = args[0];
    args.shift();
    if (commandName === "d") {
        mp.gui.chat.push(`Applying Damagepack [${args.join(",")}]`);
        mp.players.local.applyDamagePack(args[0], 100, 1);
    }
    if (commandName === "c") {
        mp.gui.chat.push(`Clearing Damagepacks`);
        mp.players.local.clearBloodDamage();
    }
});
},{"./libs/skeleton.js":5,"./natives.js":9,"./path.js":10}],12:[function(require,module,exports){


/*
    gets point from rotation, distance and rotation offset
    @returns vector
*/
mp.Vector3.prototype.findRot = function(rz, dist, rot) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let degrees = (rz + rot) * (Math.PI / 180);
    nVector.x = this.x + dist * Math.cos(degrees);
    nVector.y = this.y + dist * Math.sin(degrees);
    return nVector;
}

/*
    get rotation to point
    @returns float
*/
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
/*
    vector to screen
    @returns object(x,y)
*/
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
/*
    lerp vector
    @returns vector
*/
mp.Vector3.prototype.lerp = function(vector2, deltaTime) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = this.x + (vector2.x - this.x) * deltaTime
    nVector.y = this.y + (vector2.y - this.y) * deltaTime
    nVector.z = this.z + (vector2.z - this.z) * deltaTime
    return nVector;
}

/*
    multiply vector by n
    @returns vector
*/
mp.Vector3.prototype.multiply = function(n) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = this.x * n;
    nVector.y = this.y * n;
    nVector.z = this.z * n;
    return nVector;
}
/*
    calc 3d(x,y,z) dist to vector
    @returns float
*/
mp.Vector3.prototype.dist = function(to) {
    let a = this.x - to.x;
    let b = this.y - to.y;
    let c = this.z - to.z;
    return Math.sqrt(a * a + b * b + c * c);
}

/*
    calc 2d(x,y) dist to vector
    @returns float
*/
mp.Vector3.prototype.dist2d = function(to) {
    let a = this.x - to.x;
    let b = this.y - to.y;
    return Math.sqrt(a * a + b * b);
}
/*
    get offset from Vector
    @returns vector
*/
mp.Vector3.prototype.getOffset = function(to) {
    let x = this.x - to.x;
    let y = this.y - to.y;
    let z = this.z - to.z;
    return new mp.Vector3(x, y, z);
}

/*
   return crossproduct of vector
    @returns vector
*/
mp.Vector3.prototype.cross = function(to) {
    let vector = new mp.Vector3(0, 0, 0);
    vector.x = this.y * to.z - this.z * to.y;
    vector.y = this.z * to.x - this.x * to.z;
    vector.z = this.x * to.y - this.y * to.x;
    return vector;
}
/*
    normalize vector
    @returns vector
*/
mp.Vector3.prototype.normalize = function() {
    let vector = new mp.Vector3(0, 0, 0);
    let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    vector.x = this.x / mag;
    vector.y = this.y / mag;
    vector.z = this.z / mag;
    return vector;
}
/*
    returns vector dot
    @returns float
*/
mp.Vector3.prototype.dot = function(to) {
    return this.x * to.x + this.y * to.y + this.z * to.z;
}
/*
    returns vector length
    @returns float
*/
mp.Vector3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}

/*
    calculate angel from this vector to other vector
    @returns float
*/
mp.Vector3.prototype.angle = function(to) {
    return Math.acos(this.normalize().dot(to.normalize()));
}

/*
    gets ground vector for position (GTA Native)
    @returns vector
*/
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

/*
    gets ground vector for position (raycast)
    @returns vector
*/
mp.Vector3.prototype.ground2 = function(ignore) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let r = mp.raycasting.testPointToPoint(nVector.add(0, 0, 1), nVector.sub(0, 0, 100), ignore, (1 | 16));
    if ((r) && (r.position)) {
        nVector = mp.vector(r.position);
    }
    return nVector;
}
/*
    sub x,y,z from vector
    @returns vector
*/
mp.Vector3.prototype.sub = function(x, y, z) {
    return new mp.Vector3(this.x - x, this.y - y, this.z - z);
};
/*
    add x,y,z to vector
    @returns vector
*/
mp.Vector3.prototype.add = function(x, y, z) {
    return new mp.Vector3(this.x + x, this.y + y, this.z + z);
};
/*
    check if point is inside array of points
    @returns bool
*/
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

/*
    converts vector to new vector (with vector class support, as ragemp is kindla ugly with prototyping)
    @returns vector
*/
mp.vector = function(vec) {
    return new mp.Vector3(vec.x, vec.y, vec.z);
}
/*
    shuffle array
    @returns array
*/
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
},{}],13:[function(require,module,exports){
require("./vector.js");
mp.game.audio.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE");
mp.game.audio.startAudioScene("MIC1_RADIO_DISABLE");
var Weather = new class {
    constructor() {
        this._areas = [];
        this._inside = undefined;
        mp.events.add("Weather:LoadAreas", (weathers) => {
            this.loadWeather(JSON.parse(weathers));
        });
        mp.events.add("Weather:SetWeather", (weather) => {
            this.setWeather(JSON.parse(weather));
        });





        this.ticker = new mp.Event("client:Tick", () => {
            this._check();
        });
    }
    setWeather(weather_data) {
        if(this._inside == undefined) {

            mp.game.gameplay.setWind(weather_data.wind.speed);
            mp.game.gameplay.setWindDirection(weather_data.wind.dir);
            mp.game.gameplay.setWeatherTypeOverTime(weather_data.name, 1);
            mp.game.gameplay.setRainFxIntensity(weather_data.rain);
        }
    }
    loadWeather(arr) {
        let self = this;
        self._areas = arr;
        self._areas.forEach(function(area, index) {
            area.polygon.forEach(function(coords, index1) {
                self._areas[index].polygon[index1] = [coords.x, coords.y];
            })
        });
    }
    enter(key) {
        this._inside = key;
        let weather = this._areas[key];
        mp.game.gameplay.setWind(weather.wind.speed);
        mp.game.gameplay.setWindDirection(weather.wind.dir);
        mp.game.gameplay.setWeatherTypeOverTime(weather.name, 1);
        mp.game.gameplay.setRainFxIntensity(weather.rain);
        mp.events.callRemote("Weather:TransitionTo", this._inside);
    }
    exit() {
        this._inside = undefined;
        mp.events.callRemote("Weather:Exit");
        mp.game.gameplay.setWeatherTypeOverTime("CLEAR", 1);
        mp.game.gameplay.setWind(0);
        mp.game.gameplay.setWindDirection(0);
        mp.game.gameplay.setRainFxIntensity(0);
    }
    _check() {
        let self = this;
        if (self._areas.length > 0) {
            let lp = mp.vector(mp.players.local.position);
            let inside = self._areas.findIndex(function(area, key) {
                let inside1 = lp.insidePolygon(area.polygon);
                return (inside1 == true)
            })
            if (self._inside != inside) {
                if (inside > -1) {
                    self.enter(inside);
                } else {
                    self.exit();
                }
            }
        }
    }
}
module.exports = Weather;
},{"./vector.js":12}]},{},[3]);
