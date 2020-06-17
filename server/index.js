require("./models/debug.js")
require("./libs/attachments.js")
var PlayerAccount = require("./models/player.js")

var tickRate = 1000 / 5;
setInterval(function() {
    mp.events.call("server:Tick");
}, tickRate);






var Peds = require("./models/peds.js")
mp.events.add("playerDeath", (player) => {
    player.data.isCrouched = false;
});
mp.events.add("toggleCrouch", (player) => {
    console.log("player.packetLoss",player.packetLoss);
    if (player.data.isCrouched === undefined) {
        player.data.isCrouched = true;
    } else {
        player.data.isCrouched = !player.data.isCrouched;
    }
});


/*
    creates account class and sets basic stuff
*/
mp.events.add("playerJoin", (player) => {
    //player.dimension = player.id + 1;
    player.name = player.socialClub;
    console.log("Player has been connected. (IP: " + player.ip + ") " + player.serial + " SC: " + player.socialClub);
    player.health = 100;
    player.model = mp.joaat("mp_m_freemode_01");
    player.setVariable("movementNoise", 0);
    player.account = new PlayerAccount(player);
});
