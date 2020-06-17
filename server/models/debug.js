var fs = require("fs")
var meshTable = [];
var isDebug = false;
mp.events.add("client:generateMap", (player, mapData) => {
    console.log("mapData", mapData);
    isDebug = true;
    meshTable = meshTable.concat(JSON.parse(mapData))
});
setInterval(function() {
    if (!isDebug) return;
    meshTable = meshTable.map(function(a, i) {
        a.id = i;
        return a;
    })
    fs.writeFile("./mesh.json", JSON.stringify(meshTable), function(err) {
        if (!err) {
            console.log("Saving all Spawns");
        }
    });
}, 60 * 1000)