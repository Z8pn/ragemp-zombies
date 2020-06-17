/*Register Attachments for Player Animatiuons etc TODO*/
var Bones = require("./libs/skeleton.js")
if (mp.attachmentMngr) {
    mp.attachmentMngr.register("mining", "prop_tool_pickaxe", Bones.SKEL_R_Hand, new mp.Vector3(0.085, -0.3, 0), new mp.Vector3(-90, 0, 0));
    mp.attachmentMngr.register("lumberjack", "w_me_hatchet", Bones.SKEL_R_Hand, new mp.Vector3(0.085, -0.05, 0), new mp.Vector3(-90, 0, 0));
    mp.attachmentMngr.register("drink_beer", "prop_cs_beer_bot_03", Bones.SKEL_L_Hand, new mp.Vector3(0.1, -0.03, 0.025), new mp.Vector3(-90, 30, 0));
    mp.attachmentMngr.register("eat_burger", "prop_cs_burger_01", Bones.SKEL_L_Hand, new mp.Vector3(0.15, 0.025, 0.025), new mp.Vector3(170, 40, 0));
    mp.attachmentMngr.register("knife_clavicle", "prop_knife", Bones.SKEL_L_Clavicle, new mp.Vector3(0, 0.05, 0.025), new mp.Vector3(170, 40, 0));
    mp.attachmentMngr.register("pot_head", "prop_kitch_pot_sm", Bones.SKEL_Head, new mp.Vector3(0.1, 0, 0), new mp.Vector3(0, 270, 0));
    mp.attachmentMngr.register("bucket_head", "prop_buck_spade_06", Bones.SKEL_Head, new mp.Vector3(0.1, 0, 0), new mp.Vector3(0, 270, 0));
}