
/*
    Basic player Account class, inherited by every player (player.account)
*/

var PlayerAccount = class {
    constructor(player) {
        this._player = player;
        this._skin = 'mp_m_freemode_01';
        this._gender = "Male";
        this._position = {
            x: 0,
            y: 0,
            z: 0
        }
        this._tickEvent = new mp.Event("Server:Tick", () => {
            this.tick();
        });
    }
    tick() {}
}
//self._player.addAttachment(e.hash, false);
/*
    Syncs Noise over to other clients so the syncer of NPCs can calculate"
*/
mp.events.add("client:noise", (player, noise) => {

    player.setVariable("movementNoise",noise);
    //console.log("Set movementNoise to",noise,player.name)


});
module.exports = PlayerAccount;