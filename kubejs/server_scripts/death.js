//let $Death = Java.loadClass("de.maxhenkel.gravestone.corelib.death.Death");
// let $DeathManager = Java.loadClass(
//     "de.maxhenkel.gravestone.corelib.death.DeathManager"
// );

let $DeathManager = Java.loadClass(
    "de.maxhenkel.gravestone.corelib.death.DeathManager"
);

const xpTable = {};

EntityEvents.death("minecraft:player", (event) => {
    let {
        player,
        player: { xp, xpLevel, uuid },
    } = event;

    // player.inventory.getAllItems().forEach(item => {
    //     if (item.id == "kubejs:felyne_recall") item.setCount(0);
    //  })

    if (!player.stages.has("keepexp")) return;
    xpTable[uuid] = player.xp;
    player.xp = 0;
});

PlayerEvents.respawned((event) => {
    let {
        player,
        player: { uuid },
    } = event;

    // if (player.stages.has("felynerecall_true")) player.inventory.add(1, Item.of("kubejs:felyne_recall"))

    if (!player.stages.has("keepexp")) return;
    if (!xpTable[uuid]) return;
    player.xp = xpTable[uuid];
    xpTable[uuid] = undefined;

    //console.log(typeof(player.inventory), player.inventory instanceof Array)
});

ItemEvents.rightClicked("gravestone:obituary", (event) => {
    let { player, item, level } = event;
    if (!player) return;
    let deathData = item.get("gravestone:death");
    if (!deathData) return;
    /**@type {$UUID_} */
    let playerId = deathData.getPlayerId();

    if (player.getUuid().toString() != playerId.toString()) {
        return;
    }
    //console.log(player);

    if (!player.stages.has("deathteleport")) return;
    //console.log(player);
    if (!player.shiftKeyDown) return;
    //console.log(player);

    let deathId = deathData.getDeathId();
    /**@type {$Death_} */
    let death = $DeathManager.getDeath(level, playerId, deathId);
    let { x, y, z } = death.getBlockPos();

    player.teleportTo(
        death.dimension,
        x + 0.5,
        y + 0.5,
        z + 0.5,
        player.yaw,
        player.pitch
    );

    let { center } = player.getBoundingBox();

    event.server.runCommandSilent(
        `/playsound minecraft:entity.ghast.shoot player ${player.username.toString()} ${
            player.x
        } ${player.y} ${player.z}`
    );

    event.level.spawnParticles(
        "minecraft:explosion",
        true,
        center.x(),
        center.y(),
        center.z(),
        0,
        0.3,
        0,
        2,
        0.1
    );
});
