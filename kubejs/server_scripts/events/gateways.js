let $Vec3 = Java.loadClass("net.minecraft.world.phys.Vec3");
let $GatewayRegistry = Java.loadClass(
    "dev.shadowsoffire.gateways.gate.GatewayRegistry"
);

/**
 * @param {$GateEvent_} event
 * @param {(player: $Player_) => void | undefined} paperSuccess
 * @param {(player: $Player_, endless: string) => void | undefined} endlessSuccess
 * @param {(player: $Player_) => void | undefined} conquerSuccess
 */
function handleGateEnd(event, paperSuccess, endlessSuccess, conquerSuccess) {
    /** @type {$GatewayEntity_} */
    let entity = event.getEntity();

    let uuid = entity.uuid.toString();
    if (!gatewayMap.containsKey(uuid)) return;

    let player = entity.server.getPlayer(gatewayMap[uuid]);

    if (player.stages.has("paper_myth_challenger")) {
        //paper
        if (paperSuccess) paperSuccess(player);
        player.stages.remove("paper_myth_challenger");
    }

    let endless = player.persistentData.getString("endlessChallengeId");
    if (endless) {
        //endless
        if (endlessSuccess) endlessSuccess(player, endless);
        player.persistentData.remove("endlessChallengeId");
        return;
    }

    let currentId = player.persistentData.getString("dragonConquerCurrentId");
    if (currentId == undefined) return;

    if (conquerSuccess) conquerSuccess(player);
    else failDragonConquest(player);
    // console.log(entity.server.getPlayer(gatewayMap[uuid]));

    gatewayMap.remove(uuid);
}

/**@param {$GateEvent$Completed_} event */
global.MISC.gateCompleted = (event) => {
    handleGateEnd(
        event,
        (player) => {
            player.give(Item.of("4x kubejs:paper_dragon_fragment"));
            clearWorldEnder(player);
        },
        (player, endless) => {
            player.stages.add(endlessChallengeMap[endless].quest);
        },
        (player) => {
            finishDragonConquest(player);
        }
    );
};

/**@param {$GateEvent$Failed_} event */
global.MISC.gateFailed = (event) => {
    handleGateEnd(event);
};

PlayerEvents.loggedIn((event) => {
    let player = event.player;

    event.server.scheduleInTicks(6, (callback) => {
        if (player.stages.has("paper_myth_challenger")) {
            //paper
            player.stages.remove("paper_myth_challenger");
        }

        let endless = player.persistentData.getString("endlessChallengeId");
        if (endless) {
            //endless
            player.persistentData.remove("endlessChallengeId");
            return;
        }

        let currentId = player.persistentData.getString(
            "dragonConquerCurrentId"
        );
        if (currentId == undefined) return;

        failDragonConquest(player);
    });
});
