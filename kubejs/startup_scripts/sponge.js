/**
 * @param {$ItemStack_} itemStack
 * @param {$ServerLevel_} level
 * @param {$LivingEntity_} entity
 */
function sponge_Used(itemStack, level, entity) {
    if (level.isClientSide()) return itemStack;
    let blockPos = entity.blockPosition();
    level.server.runCommandSilent(
        `/setblock ${blockPos.x} ${blockPos.y} ${blockPos.z} water[level=1] keep`
    );

    itemStack.shrink(1);

    if (entity.player) {
        /**
         * @type {$Player_} - 判断是否为玩家，通过后重申entity的类型
         */
        let player = entity;
        player.give("kubejs:dry_sponge");
        player.potionEffects.add(
            "dragonsurvival:sea_peace",
            30,
            1,
            false,
            true
        );
    }

    // try {
    //     entity.give("kubejs:dry_sponge")
    // } catch(e) {
    //     console.error(e)
    // }

    //level.setBlock(entity.blockPosition(), "minecraft:water[level=1]", 0)
    //console.log()
    return itemStack;
}
