const vector = require("../libs/vector.js");
const ZombieManager = require("./pedmanager.js").zombiemgr;
const PedManager = require("./pedmanager.js").pedmgr;
//move_m@drunk@verydrunk
//let style = "move_heist_lester";
//let style = "move_ped_crouched"; // crouched
//let style = "move_m@drunk@verydrunk";
//var walkstyle_to_set = "move_m@generic";
var walkstyle_to_set = "move_m@drunk@moderatedrunk";
mp.events.addCommand("w", (player, cmd, walkstyle) => {
    console.log("Walkstyle Set To", walkstyle);
    walkstyle_to_set = walkstyle;
});
class SyncPed {
    constructor(model, position, dynamic = true, invincible = true) {
        this._ped = mp.peds.new(mp.joaat(model), position, {
            dynamic: dynamic,
            frozen: false,
            invincible: invincible
        });
        this.id = this._ped.id;
        this.controllerId = 0;
        this._type = "syncPed";
        this.canDelete = false;
        this._ped.setVariable("sync_id", this._ped.id);
        this._ped.setVariable("syncPed", true);
        this._ped.setVariable("DEAD", false);
        this.deathtime = 0;
        this.manager = PedManager;
        this._corpseTime = 15 * 60 * 1000;
    }
    get ped() {
        if (!mp.peds.at(this.id)) return false
        if (!this._ped) return false;
        return this._ped;
    }
    get deletable() {
        if (!mp.peds.at(this.id)) return false
        return this.ped.getVariable("DEAD") && (this.deathtime + this._corpseTime < Date.now());
    }
    kill() {
        this.deathtime = Date.now();
        this._ped.setVariable("DEAD", true);
    }
    clearController() {
        if (!mp.peds.at(this.id)) return false
        if (!this._ped) return false;
        let player = mp.players.at(this.controllerId);
        if (!player) return;
        this._ped.controller = null;
        this.controllerId = -1;
        player.call("rejectSync", [this._type, this.id, this.ped.getVariable("DEAD")]);
    }
    get controller() {
        if (!mp.peds.at(this.id)) return false
        if (!this._ped) return false;
        if (!this._ped.controller) return false;
        return this._ped.controller;
    }
    setController(controllerId) {
        this.controllerId = controllerId;
        let player = mp.players.at(this.controllerId);
        if (!player) return;
        this._ped.controller = player;
        player.call("acknowledgeSync", [this._type, this.id]);
    }
    get position() {
        if (!mp.peds.at(this.id)) return new mp.Vector3(0, 0, 0);
        if (!this._ped) return new mp.Vector3(0, 0, 0);
        if (this._ped.getVariable("DEAD")) return new mp.Vector3(0, 0, 0);
        return vector(this._ped.position);
    }
    damage() {}
}
class Zombie extends SyncPed {
    constructor(model, position, zombieType, dim = 0) {
        super(model, position);
        console.log("new Zombie", this.id);
        this.dim = dim;
        this.zombieType = zombieType;
        this.init();
        this._type = "zombie";
    }
    init() {
        this.manager = ZombieManager;
        if (!this._ped) return;
        this._ped.dimension = this.dim;
        this._ped.setVariable("zombie", true);
        this._ped.setVariable("DEAD", false);
        this._ped.setVariable("ZOMBIE_TYPE", this.zombieType);
        mp.events.call("ped:create", this._ped);
        let max_hp = 70;
        if (this.zombieType == "runner") max_hp = 50;;
        if (this.zombieType == "sprinter") max_hp = 40;
        this._ped.setVariable("HEALTH", max_hp);
        this._ped.setVariable("MAX_HEALTH", max_hp);
        this._ped.setVariable("NOISE_ALERTNESS", 2);
        if (this.zombieType == "runner") this._ped.setVariable("NOISE_ALERTNESS", 3);
        if (this.zombieType == "sprinter") this._ped.setVariable("NOISE_ALERTNESS", 3.6);
        this._ped.setVariable("WALKSTYLE", "move_m@drunk@verydrunk");
        if (this.zombieType == "runner") this._ped.setVariable("WALKSTYLE", "move_m@drunk@moderatedrunk");
        if (this.zombieType == "sprinter") this._ped.setVariable("WALKSTYLE", "move_m@generic");
        this._ped.setVariable("VIEW_DISTANCE", 50);
        if (this.zombieType == "runner") this._ped.setVariable("VIEW_DISTANCE", 70);
        if (this.zombieType == "sprinter") this._ped.setVariable("VIEW_DISTANCE", 100);
        if (!this.manager) return;
        this.manager.addPed(this);
    }
}
mp.events.add("zombie_new", (player, type) => {
    let new_pos = vector(player.position).findRot(0, 2, player.heading);
    new Zombie("mp_m_freemode_01", new_pos, type);
});
/*
mp.events.add("zombie_new", (player, type) => {
    let new_pos = vector(player.position).findRot(0, 2, player.heading);
    let dynamicPed = mp.peds.new(mp.joaat('mp_m_freemode_01'), new_pos, {
        dynamic: true,
        frozen: false,
        invincible: true
    });
    dynamicPed.setVariable("zombie", true);
    dynamicPed.setVariable("sync_id", dynamicPed.id);
    let max_hp = 70;
    if (type == "runner") max_hp = 50;;
    if (type == "sprinter") max_hp = 40;
    dynamicPed.setVariable("NOISE_ALERTNESS", 2);
    if (type == "runner") dynamicPed.setVariable("NOISE_ALERTNESS", 3);
    if (type == "sprinter") dynamicPed.setVariable("NOISE_ALERTNESS", 3.6);
    dynamicPed.setVariable("HEALTH", max_hp);
    dynamicPed.setVariable("MAX_HEALTH", max_hp);
    dynamicPed.setVariable("DEAD", false);
    dynamicPed.setVariable("ZOMBIE_TYPE", type);
    dynamicPed.setVariable("CAN_STUMBLE", true);
    dynamicPed.setVariable("WALKSTYLE", "move_m@drunk@verydrunk");
    if (type == "runner") dynamicPed.setVariable("WALKSTYLE", "move_m@drunk@moderatedrunk");
    if (type == "sprinter") dynamicPed.setVariable("WALKSTYLE", "move_m@generic");
    dynamicPed.controller = player;
    dynamicPed.dimension = player.dimension;
    console.log("dynamicPed.model", dynamicPed.model);
    console.log("dynamicPed.id", dynamicPed.id);
    player.call("acknowledgeSync", ["zombie", dynamicPed.id]);
    mp.events.call("ped:create", dynamicPed);
    let r = Math.floor(Math.random() * 100) + 1;
    if (r > 50) {
        dynamicPed.setVariable("CAN_STUMBLE", false);
        if (r > 75) dynamicPed.addAttachment("pot_head", true);
        if (r <= 75) dynamicPed.addAttachment("bucket_head", true);
    }
    //dynamicPed.addAttachment("pot_head", true);
    //dynamicPed.addAttachment("knife_clavicle", true);
});*/
mp.events.add("zombie:damage", (player, zombieId, weapon_hash, hitBone, fireFromVector, hitVector) => {
    let zombie = mp.peds.at(zombieId);
    console.log("zombie:damage", zombieId, weapon_hash, hitBone);
    if (zombie) {
        if (!zombie.getVariable("DEAD")) {
            var syncingPlayer = mp.players.toArray().find(p => p == zombie.controller);
            if (!syncingPlayer) return console.log("no syncing player");
            zombie.setVariable("HEALTH", zombie.getVariable('HEALTH') - 5);
            console.log("acknowledgeHit")
            let ragdoll = false;
            let stumble = false;
            if (hitBone == "SKEL_Head") {
                ragdoll = true;
            }
            if (!zombie.getVariable('CAN_STUMBLE')) ragdoll = false;
            if (!zombie.getVariable('CAN_STUMBLE')) stumble = false;
            if (
                (hitBone == "SKEL_L_Thigh") || (hitBone == "SKEL_R_Thigh") || (hitBone == "SKEL_L_Foot") || (hitBone == "SKEL_R_Foot") || (hitBone == "SKEL_L_Calf") || (hitBone == "SKEL_R_Calf")) {
                stumble = true;
            }
            syncingPlayer.call("acknowledgeHit", [zombieId, {
                wepaon: weapon_hash,
                bone: hitBone,
                entry: fireFromVector,
                exit: hitVector,
                ragdoll: ragdoll,
                stumble: stumble
            }]);
            if (zombie.getVariable('HEALTH') <= 0) {
                player.call("client:killmarker");
                let p = ZombieManager.find(zombieId);
                if (p) {
                    p.kill();        
                }
            } else {
                player.call("client:hitmarker");
            }
        }
    }
});