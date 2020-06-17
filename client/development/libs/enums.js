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
    FALLING: flags_count++,
    RAGDOLL: flags_count++,
    STUMBLE: flags_count++,
    DEAD: flags_count++
}
global["Flags"] = [];
Object.keys(flags).forEach(function(key, value) {
    console.log("enums-> Flags." + key, "=", flags[key])
    global["Flags"][key] = flags[key];
})