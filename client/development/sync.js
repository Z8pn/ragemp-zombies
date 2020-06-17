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
            mp.game.graphics.drawMarker(28, this.currentTargetPosition.x, this.currentTargetPosition.y, this.currentTargetPosition.z, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0, 255, 0, 255, false, false, 2, false, "", "", false);
            mp.game.graphics.drawLine(position.x, position.y, position.z+1, this.currentTargetPosition.x, this.currentTargetPosition.y, this.currentTargetPosition.z, 0, 255, 0, 255);
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
        this._ped.setRandomComponentVariation(false);
        this._ped.applyDamagePack("Explosion_Med", Math.floor(Math.random() * 100), 1);
        this._ped.setMaxHealth((100 + this._ped.getVariable('MAX_HEALTH')));
        this._ped.setHealth((100 + this._ped.getVariable('HEALTH')));
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
        this._ped.taskGoToCoordAnyMeans(position.x, position.y, position.z, 0.8, 0, false, 786603, 0);
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
            this._ped.taskGoStraightToCoord(position.x, position.y, position.z,12.4, -1, this._ped.getHeading(), 2);
        }
    }
    /*
       Meele target
       
    */
    meele(targetHandle) {
        if (!mp.peds.atRemoteId(this._remote_id)) return false;
        this._ped.taskPutDirectlyIntoMelee(targetHandle, 0.0, -1.0, 1.0, false);
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
