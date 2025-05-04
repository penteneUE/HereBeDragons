let $Vec3 = Java.loadClass("net.minecraft.world.phys.Vec3");
let $GatewayRegistry = Java.loadClass(
    "dev.shadowsoffire.gateways.gate.GatewayRegistry"
);

const gatewayMap = Utils.newMap();

/**
 *
 * @param {$Player_} player
 * @param {$BlockPos_ | $Vec3_} pos
 * @param {$ResourceLocation_} type
 * @param {$ServerLevel_} level
 *
 * @returns {integer}
 */
function summonGateway(player, pos, type, level) {
    let { entity, code } = _summonGateway(player, pos, type, level);
    if (!entity) return -1;
    if (code == -1) return code;

    let entityUUID = entity.uuid.toString();
    if (gatewayMap.containsKey(entityUUID)) return -1;
    gatewayMap.put(entityUUID, player.uuid.toString());

    return code;
}

/**
 *
 * @param {$Player_} player
 * @param {$BlockPos_ | $Vec3_} pos
 * @param {$ResourceLocation_} type
 * @param {$ServerLevel_} level
 *
 * @returns {{entity: $Entity_ | null, code: integer}}
 */
function _summonGateway(player, pos, type, level) {
    try {
        let vec = pos;
        if (pos instanceof $BlockPos)
            vec = new $Vec3(pos.x + 0.5, pos.y + 1.5, pos.z + 0.5);
        let gate = $GatewayRegistry.INSTANCE.holder(type);

        if (!gate.isBound()) {
            console.log("Unknown Gateway");
            return { entity: null, code: -1 };
        }

        /** @type {$GatewayEntity_} */
        let entity = gate.get().createEntity(level, player);

        entity.moveTo(vec);

        entity.setUUID(randomUUID());

        level.addFreshEntity(entity);

        entity.onGateCreated();

        //console.log(`Summoned Gateway: ${type}`);
        return { entity: entity, code: 1 };
    } catch (e) {
        console.log(e);
        return { entity: null, code: -1 };
    }
}

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
