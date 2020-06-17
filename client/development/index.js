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