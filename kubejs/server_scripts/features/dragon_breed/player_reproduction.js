/**
 *
 * @param {$SimplePlayerKubeEvent_} event
 * @returns
 */
function playerTick_RepFrenzy(event) {
    const { player } = event;
    const REPRODUCTION_FRENZY = "kubejs:reproduction_frenzy";
    if (!player.hasEffect(REPRODUCTION_FRENZY)) return;

    let superFrenzy = player.getEffect(REPRODUCTION_FRENZY).amplifier > 0;

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
        if (isIAFDragon(entity)) matingDragon = entity;
    });
    //console.log(matingDragon);

    if (!matingDragon) return;

    let inLove = matingDragon.nbt.getInt("InLove");
    if (inLove == 0) return;
    //console.log(inLove);
    if (player.getRandom().nextInt(100) < 80) return;

    let male = matingDragon.nbt.getBoolean("Gender");

    //console.log(egg);
    let egg = bornChild(player, matingDragon);

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

    if (!superFrenzy) {
        let newTag = new $CompoundTag();
        newTag.putInt("InLove", 0);

        matingDragon.mergeNbt(newTag);

        player.removeEffect(REPRODUCTION_FRENZY);
    }

    event.server.runCommandSilent(
        `/playsound minecraft:entity.chicken.egg player ${player.username.toString()} ${
            egg.x
        } ${egg.y} ${egg.z}`
    );
}

/**
 * @returns {"AMPHITHERE" | "HYDRA" | "COCKATRICE" | "SEA_SERPENT"}
 */
function rollCurse() {
    let rand = global.UTILS.weightedRandom()
        .add("AMPHITHERE", 4)
        .add("HYDRA", 1)
        .add("COCKATRICE", 4)
        .add("SEA_SERPENT", 2);
    return rand.getItem();
}

/**
 * @param {$Player_} player
 * @param {$LivingEntity_} matingDragon
 * @returns {$Entity_}
 */
function bornChild(player, matingDragon) {
    if (player.hasEffect("kubejs:prion_curse")) {
        let curse = rollCurse();
        /**
         * @type {$Entity_}
         */ let child;
        switch (curse) {
            case "AMPHITHERE":
                child = player.level.createEntity("iceandfire:amphithere");
                break;
            case "COCKATRICE":
                child = player.level.createEntity("iceandfire:cockatrice");

                break;
            case "HYDRA":
                child = player.level.createEntity("iceandfire:hydra");
                break;
            case "SEA_SERPENT":
                child = player.level.createEntity("iceandfire:sea_serpent");
                break;
        }
        let childTag = new $CompoundTag();
        childTag.putInt("Age", -23470);

        child.mergeNbt(childTag);

        if (child instanceof $TamableAnimal) {
            child.tame(player);
        }
        return child;
    }
    let variant = matingDragon.nbt.getString("Variant");
    let eggTag = new $CompoundTag();
    eggTag.putString("Color", variant);
    eggTag.putString("OwnerUUID", player.getUuid().toString());

    let egg = player.level.createEntity("iceandfire:dragon_egg");
    egg.mergeNbt(eggTag);
    return egg;
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
        if (!isDragon(player)) return;
        if (global.UTILS.dragonGrowth(player) < 40) return;
        player.potionEffects.add("kubejs:reproduction_frenzy", 600);
        player.stages.add("quest/wait_what");
        return;
    }

    if (
        item.hasTag("kubejs:dragon_flesh") ||
        item.hasTag("kubejs:newgen_dragon_hearts")
    ) {
        if (!isDragon(player)) return;
        player.potionEffects.add("kubejs:prion_curse", 6000);
        return;
    }

    if (item.hasTag("kubejs:dragon_stews")) {
        if (!isDragon(player)) return;
        player.potionEffects.add("kubejs:prion_curse", 12000);

        if (global.UTILS.dragonGrowth(player) < 40) return;
        player.potionEffects.add("kubejs:reproduction_frenzy", 6000, 1);
        player.stages.add("quest/wait_what");
        return;
    }
});
