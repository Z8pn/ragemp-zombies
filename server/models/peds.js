const vector = require("../libs/vector.js");
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
mp.events.add("zombie_new", (player, type) => {


    let new_pos = vector(player.position).findRot(0,2,player.heading);

    let dynamicPed = mp.peds.new(mp.joaat('mp_m_freemode_01'), new_pos, {
        dynamic: true,
        frozen: false,
        invincible: true
    });
    dynamicPed.setVariable("zombie", true);
    dynamicPed.setVariable("sync_id", dynamicPed.id);
    let max_hp = 40;
    if (type == "runner") max_hp = 20;;
    if (type == "sprinter") max_hp = 10;;
    dynamicPed.setVariable("HEALTH", max_hp);
    dynamicPed.setVariable("MAX_HEALTH", max_hp);
    dynamicPed.setVariable("DEAD", false);
    dynamicPed.setVariable("ZOMBIE_TYPE", type);
    dynamicPed.setVariable("WALKSTYLE", "move_m@drunk@verydrunk");
    if (type == "runner") dynamicPed.setVariable("WALKSTYLE", "move_m@drunk@moderatedrunk");
    if (type == "sprinter") dynamicPed.setVariable("WALKSTYLE", "move_m@generic");
    dynamicPed.controller = player;
    dynamicPed.dimension = player.dimension;
    console.log("dynamicPed.model", dynamicPed.model);
    console.log("dynamicPed.id", dynamicPed.id);
    player.call("acknowledgeSync", ["zombie", dynamicPed.id]);
});
mp.events.add("zombie:damage", (player, zombieId, weapon_hash, hitBone, fireFromVector, hitVector) => {
    console.log("zombie:damage", zombieId, weapon_hash, hitBone, fireFromVector, hitVector);
    let zombie = mp.peds.at(zombieId);
    if ((zombie) && (!zombie.getVariable('DEAD'))) {
        var syncingPlayer = mp.players.toArray().find(p => p == zombie.controller);
        if (!syncingPlayer) return console.log("no syncing player");
        zombie.setVariable("HEALTH", zombie.getVariable('HEALTH') - 5);
        console.log("acknowledgeHit")
        let ragdoll = false;
        let stumble = true;
        if (hitBone == "SKEL_Head") {
            ragdoll = true;
            stumble = false;
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
            zombie.setVariable("DEAD", true);
            if (syncingPlayer) {
                syncingPlayer.call("rejectSync", ["zombie", zombie.id, true]);
            }
            setTimeout(() => {
                zombie.controller = false;
                zombie.dynamic = false;
            }, 500);
            setTimeout(() => {
                if (zombie) {
                    zombie.destroy();
                }
            }, 5000);
        } else {
            player.call("client:hitmarker");
        }
    }
});