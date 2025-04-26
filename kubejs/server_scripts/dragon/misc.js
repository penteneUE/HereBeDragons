/**
 *
 * @param {$SimplePlayerKubeEvent_} event
 * @returns
 */
function playerTick_Sponge(event) {
    const {
        player,
        player: { inventory },
    } = event;

    if (!inventory.hasAnyOf("kubejs:dry_sponge")) return;

    //if (!player.isInWater()) return;
    if (!player.isUnderWater()) return;

    let slot = inventory.find("kubejs:dry_sponge");
    let count = inventory.getStackInSlot(slot).getCount();
    inventory.setStackInSlot(
        slot,
        Item.of("kubejs:wet_sponge").withCount(count)
    );
}

/**
 *
 * @param {$SimplePlayerKubeEvent_} event
 * @returns
 */
function playerTick_RepFrenzy(event) {
    const { player } = event;
    if (!player.hasEffect("kubejs:reproduction_frenzy")) return;

    const { boundingBox } = player;
    //spawnParticles(ParticleOptions options, boolean overrideLimiter, double x, double y, double z, double vx, double vy, double vz, int count, double speed)
    let location = Utils.newList();
    for (let i = boundingBox.minX; i < boundingBox.maxX; i += 0.5) {
        for (let j = boundingBox.minY; j < boundingBox.maxY; j += 0.5) {
            for (let k = boundingBox.minZ; k < boundingBox.maxZ; k += 0.5) {
                event.level.spawnParticles(
                    "minecraft:heart",
                    true,
                    i,
                    j,
                    player.z,
                    0,
                    0.3,
                    0,
                    1,
                    0.1
                );
            }
        }
    }
}

/**
 * @param {$ItemStack_} itemStack
 * @param {$ServerLevel_} level
 * @param {$LivingEntity_} entity
 */
global.MISC.spongeUsed = (itemStack, level, entity) => {
    let blockPos = entity.blockPosition();
    level.server.runCommandSilent(
        `/setblock ${blockPos.x} ${blockPos.y} ${blockPos.z} water[level=1] keep`
    );
    //itemStack.count--;
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
    //console.log(111);
    //level.setBlock(entity.blockPosition(), "minecraft:water[level=1]", 0)
    //console.log()
    return itemStack;
};

// /**
//  * @param {$Entity_} entity
//  */
// global.MISC.reproductionFrenzyTick = (entity, lvl) => {
//     //spawnParticles(ParticleOptions options, boolean overrideLimiter, double x, double y, double z, double vx, double vy, double vz, int count, double speed)
//     console.log(111);
//     entity.level.spawnParticles(
//         "minecraft:heart",
//         true,
//         entity.x + 0.5,
//         entity.y + 1.05,
//         entity.z + 0.5,
//         0,
//         0.3,
//         0,
//         lvl * 2,
//         0.1
//     );
//     console.log(lvl);
//     //entity.heal(1 * lvl);
// };

//console.log(global);
