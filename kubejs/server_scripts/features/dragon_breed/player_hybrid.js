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

    if (!isDragon(player)) return;

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
    let egg = bornChild(player, matingDragon, male);

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
    let rand = weightedRandom()
        .add("AMPHITHERE", 4)
        .add("HYDRA", 1)
        .add("COCKATRICE", 4)
        .add("SEA_SERPENT", 2);
    return rand.getItem();
}

/**
 *
 * @param {$RandomSource_} random
 * @returns {DragonBreedData}
 */
function randomHybridData(random) {
    let hybridTraits = new $CompoundTag();

    /**
     * @type {import("java.util.Set").$Set<string>}
     */
    let gotTraits = new $HashSet();
    let traitCount = random.nextIntBetweenInclusive(2, 4);
    for (let i = 0; i < traitCount; i++) {
        let selectedTrait = hybridRandomTraits.getItem();
        hybridTraits.putInt(selectedTrait, 0);
        gotTraits.add(selectedTrait);
    }
    //gotTraits.addAll(hybridTraits.getAllKeys());
    hybridTraits.putInt(
        gotTraits.toArray()[random.nextInt(gotTraits.size())],
        1
    );

    /**
     * @type {DragonBreedData}
     */
    let playerBreedData = {
        strength: random.nextIntBetweenInclusive(10, 20),
        constitution: random.nextIntBetweenInclusive(10, 20),
        dexterity: random.nextIntBetweenInclusive(10, 20),
        traits: hybridTraits,
    };

    return playerBreedData;
}

// ItemEvents.rightClicked((event) => {
//     let { player } = event;
//     player.tell(randomHybridData(player.random));
// });

/**
 * @param {$Player_} player
 * @param {$LivingEntity_} matingDragon
 * @param {boolean} isMaleDragon
 * @returns {$Entity_}
 */
function bornChild(player, matingDragon, isMaleDragon) {
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
    //let variant = matingDragon.nbt.getString("Variant");
    let eggTag = new $CompoundTag();

    let handler = $DragonStateProvider.getData(player);
    let availableVariants = hybridEggVariants(
        handler.speciesId(),
        matingDragon.type
    );

    eggTag.putString(
        "Color",
        availableVariants[player.random.nextInt(availableVariants.length)]
    );
    eggTag.putString("OwnerUUID", player.getUuid().toString());

    let egg = player.level.createEntity("iceandfire:dragon_egg");

    egg.mergeNbt(eggTag);

    let parentBreedData = deserializeBreedData(
        getBreedDataFromEntity(matingDragon)
    );
    // BREED DATA
    if (!player.persistentData[BREED_DATA_KEY]) {
        let playerBreedData = randomHybridData(player.random);
        egg.persistentData.put(
            BREED_DATA_KEY,
            serializeBreedData(
                isMaleDragon
                    ? getChildBreedData(
                          player.random,
                          parentBreedData,
                          playerBreedData
                      )
                    : getChildBreedData(
                          player.random,
                          playerBreedData,
                          parentBreedData
                      )
            )
        );

        return egg;
    }

    let playerBreedData = deserializeBreedData(
        player.persistentData.get(BREED_DATA_KEY)
    );
    egg.persistentData.put(
        BREED_DATA_KEY,
        serializeBreedData(
            isMaleDragon
                ? getChildBreedData(
                      player.random,
                      parentBreedData,
                      playerBreedData
                  )
                : getChildBreedData(
                      player.random,
                      playerBreedData,
                      parentBreedData
                  )
        )
    );
    return egg;
}

/**
 *
 * @param {"dragonsurvival:forest_dragon" | "dragonsurvival:cave_dragon" | "dragonsurvival:sea_dragon"} dsDragonType
 * @param {"iceandfire:fire_dragon" | "iceandfire:ice_dragon" | "iceandfire:lightning_dragon"} iafDragonType
 */
function hybridEggVariants(dsDragonType, iafDragonType) {
    switch (dsDragonType) {
        case "dragonsurvival:forest_dragon":
            switch (iafDragonType) {
                case "iceandfire:fire_dragon":
                    return ["bronze", "green", "copper", "gray"];
                case "iceandfire:ice_dragon":
                    return ["silver", "green", "sapphire", "white"];
                case "iceandfire:lightning_dragon":
                    return ["black", "green", "bronze", "blue"];
            }
        case "dragonsurvival:cave_dragon":
            switch (iafDragonType) {
                case "iceandfire:fire_dragon":
                    return ["red", "bronze", "copper", "gray"];
                case "iceandfire:ice_dragon":
                    return ["silver", "sapphire", "copper", "amethyst"];
                case "iceandfire:lightning_dragon":
                    return ["amethyst", "copper", "gray", "black"];
            }
        case "dragonsurvival:sea_dragon":
            switch (iafDragonType) {
                case "iceandfire:fire_dragon":
                    return ["amethyst", "green", "gray", "silver"];
                case "iceandfire:ice_dragon":
                    return ["electric", "white", "blue", "sapphire"];
                case "iceandfire:lightning_dragon":
                    return ["electric", "blue", "amethyst", "white"];
            }
    }
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
