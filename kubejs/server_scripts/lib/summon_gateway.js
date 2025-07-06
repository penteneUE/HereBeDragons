//priority: 3
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
