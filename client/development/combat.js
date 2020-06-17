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