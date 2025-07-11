//priority: 2
/**
 *
 * @param {$Entity_} entity
 * @returns {boolean}
 */
function isIAFDragon(entity) {
    return (
        entity.type == "iceandfire:ice_dragon" ||
        entity.type == "iceandfire:fire_dragon" ||
        entity.type == "iceandfire:lightning_dragon"
    );
}

/**
 *
 * @param {$Player_} player
 * @returns {boolean}
 */
function isDragon(player) {
    return global.UTILS.isDragon(player);
}

/**
 *
 * @param {$Player_} player
 * @returns {integer} 当前龙成长值或者-1（如果不是龙）
 */
function dragonGrowth(player) {
    return global.UTILS.dragonGrowth(player);
}
