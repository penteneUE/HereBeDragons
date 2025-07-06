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

PlayerEvents.tick((event) => {
    if (event.player.tickCount % 20 != 0) return;
    // playerTick_Sponge(event);
    // playerTick_PaperDragonEgg(event);
    playerTick_RepFrenzy(event);
});

ItemEvents.foodEaten((event) => {
    const { item, player } = event;
    if (!player) return;

    if (item.hasTag("kubejs:dragon_reproduction_item")) {
        if (!global.UTILS.isDragon(player)) return;
        //console.log(dragonGrowth(player));
        if (global.UTILS.dragonGrowth(player) < 40) return;
        player.potionEffects.add("kubejs:reproduction_frenzy", 600);
        player.stages.add("quest/wait_what");
        return;
    }
});
