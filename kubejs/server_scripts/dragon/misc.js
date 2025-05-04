/**
 *
 * @param {$SimplePlayerKubeEvent_} event
 * @returns
 */
function playerTick_Sponge(event) {
    let {
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

const dragonEggs = global.UTILS.weightedRandom();
dragonEggs.add("iceandfire:dragonegg_amethyst", 1);
dragonEggs.add("iceandfire:dragonegg_black", 1);
dragonEggs.add("iceandfire:dragonegg_blue", 1);
dragonEggs.add("iceandfire:dragonegg_bronze", 1);
dragonEggs.add("iceandfire:dragonegg_copper", 1);
dragonEggs.add("iceandfire:dragonegg_electric", 1);
dragonEggs.add("iceandfire:dragonegg_gray", 1);
dragonEggs.add("iceandfire:dragonegg_green", 1);
dragonEggs.add("iceandfire:dragonegg_red", 1);
dragonEggs.add("iceandfire:dragonegg_sapphire", 1);
dragonEggs.add("iceandfire:dragonegg_silver", 1);
dragonEggs.add("iceandfire:dragonegg_white", 1);

/**
 *
 * @param {$SimplePlayerKubeEvent_} event
 * @returns
 */
function playerTick_PaperDragonEgg(event) {
    let { player } = event;

    let hasPaperEgg = false;
    let offHand = false;
    if (
        player.mainHandItem &&
        player.mainHandItem.id == "kubejs:paper_dragon_egg"
    ) {
        hasPaperEgg = true;
    }
    if (
        player.offHandItem &&
        player.offHandItem.id == "kubejs:paper_dragon_egg"
    ) {
        hasPaperEgg = true;
        offHand = true;
    }

    if (!hasPaperEgg) return;

    let replacePaperEgg = false;

    //if (false) {
    // if (!player.stages.has("endless_challenger")) return;
    if (player.stages.has("endless_challenger")) {
        replacePaperEgg = true;
    } else {
        let k = 30;
        let oAABB = player.getBoundingBox().inflate(k);

        event.level.getEntitiesWithin(oAABB).forEach((entity) => {
            if (replacePaperEgg) return;
            if (entity.type == "gateways:endless_gateway")
                replacePaperEgg = true;
        });
    }
    if (!replacePaperEgg) return;

    let newItem = Item.of(dragonEggs.getItem());
    if (offHand) {
        player.offHandItem = newItem;
    } else {
        player.mainHandItem = newItem;
    }
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
    //let location = Utils.newList();
    for (let i = boundingBox.minX; i < boundingBox.maxX; i += 0.5) {
        for (let j = boundingBox.minY; j < boundingBox.maxY; j += 0.5) {
            for (let k = boundingBox.minZ; k < boundingBox.maxZ; k += 0.5) {
                event.level.spawnParticles(
                    "minecraft:heart",
                    true,
                    i,
                    j,
                    k,
                    0,
                    0.3,
                    0,
                    1,
                    0.1
                );
            }
        }
    }

    let k = 1;
    let oAABB = player.getBoundingBox().inflate(k);

    /** @type {$LivingEntity_} */
    let matingDragon = null;
    event.level.getEntitiesWithin(oAABB).forEach((entity) => {
        if (matingDragon) return;
        if (
            entity.type == "iceandfire:ice_dragon" ||
            entity.type == "iceandfire:fire_dragon" ||
            entity.type == "iceandfire:lightning_dragon"
        )
            matingDragon = entity;
    });
    //console.log(matingDragon);

    if (!matingDragon) return;

    let inLove = matingDragon.nbt.getInt("InLove");
    if (inLove == 0) return;
    //console.log(inLove);
    if (Math.floor(Math.random() * 50) != 0) return;

    let male = matingDragon.nbt.getBoolean("Gender");
    let variant = matingDragon.nbt.getString("Variant");
    let eggTag = new $CompoundTag();
    eggTag.putString("Color", variant);

    let egg = event.level.createEntity("iceandfire:dragon_egg");
    egg.mergeNbt(eggTag);
    //console.log(egg);

    if (male) {
        egg.x = player.x;
        egg.y = player.y;
        egg.z = player.z;
    } else {
        egg.x = matingDragon.x;
        egg.y = matingDragon.y;
        egg.z = matingDragon.z;
    }
    egg.spawn();

    event.server.runCommandSilent(
        `/playsound minecraft:entity.chicken.egg player ${player.username.toString()} ${
            egg.x
        } ${egg.y} ${egg.z}`
    );
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
            60,
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
