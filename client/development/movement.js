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