/**
 *
 * @param {number} x0
 * @param {number} x1
 * @param {number} y0
 * @param {number} y1
 * @param {number} x
 * @returns
 */
function lerp(x0, x1, y0, y1, x) {
    return y0 + ((y1 - y0) / (x1 - x0)) * (x - x0);
}

/**
 *
 * @param {$Player_} player
 * @param {$LivingEntity_} entity
 * @param {DragonBreedData} breedData
 */
function tellBreedData(player, entity, breedData) {
    player.tell(
        Text.translate("kubejs.breed.info.title", [
            Text.darkAqua(entity.displayName),
        ]).gray()
    );

    let { strength, constitution, dexterity, traits } = breedData;

    player.tell(
        Text.translate("kubejs.breed.info.attributes", [
            Text.darkAqua(strength),
            Text.darkAqua(constitution),
            Text.darkAqua(dexterity),
        ]).gray()
    );

    if (!traits.empty) {
        for (const key in traits) {
            let lvl = traits.getInt(key);
            let mapEntry = breedTraitMap[key];
            if (lvl <= 0) {
                player.tell(
                    Text.translate("kubejs.breed.info.trait.recessive", [
                        Text.of({ translate: mapEntry.name }),
                        Text.of({ translate: mapEntry.desc }),
                    ])
                        .hover(Text.of({ translate: mapEntry.fullDesc }))
                        .darkGray()
                );
            } else {
                let lvlKey = `enchantment.level.${lvl}`;
                player.tell(
                    mapEntry.color(
                        Text.translate("kubejs.breed.info.trait.active", [
                            Text.of({ translate: mapEntry.name }),
                            Text.of({ translate: lvlKey }),
                            Text.of({ translate: mapEntry.desc }),
                        ]).hover(Text.of({ translate: mapEntry.fullDesc }))
                    )
                );
            }
            // player.tell(key);
            // player.tell(
            //     Text.gold({
            //         translate: `enchantment.level.${traits.getInt(key)}`,
            //     })
            // );
            // if (Object.prototype.hasOwnProperty.call(object, key)) {
            //     const element = object[key];

            // }
        }
    }

    player.tell(Text.empty());
}

/**
 *
 * @param {$Player_} player
 * @param {$LivingEntity_} entity
 */
function geneSplicerLogic(player, entity) {
    if (!isIAFDragon(entity)) return;
    //player.tell(entity.displayName);
    //player.tell(entity.persistentData);
    /**
     * @type {DragonBreedData}
     */
    let breedData = getBreedDataFromEntity(entity);
    if (!breedData) {
        player.tell(Text.darkRed({ translate: "kubejs.breed.tooltip.empty" }));
        return;
    }
    breedData = deserializeBreedData(breedData);

    tellBreedData(player, entity, breedData);

    let avgAttr =
        (breedData.strength + breedData.constitution + breedData.dexterity) / 3;
    if (avgAttr > 256) avgAttr = 256;

    let commonSound = "minecraft:block.note_block.pling";
    player.server.runCommandSilent(
        `/playsound ${commonSound} player ${player.username.toString()} ${
            player.x
        } ${player.y} ${player.z} 10 ${lerp(0, 255, 0, 2, avgAttr)}`
    );

    //player.tell(entity.nbt);
}

// ItemEvents.entityInteracted((event) => {
//     const { target: entity, player, hand } = event;
//     if (
//         !(
//             hand == "main_hand" &&
//             player.getMainHandItem().id === "kubejs:gene_splicer"
//         )
//     )
//         return;
//     let reachedEntity = sightReachedEntity(player, event.level, 20);
//     if (!reachedEntity) return;

//     geneSplicerLogic(player, reachedEntity);
//     event.cancel();
// });

ItemEvents.rightClicked((event) => {
    const { player, hand } = event;
    if (
        !(
            hand == "main_hand" &&
            player.getMainHandItem().id === "kubejs:gene_splicer"
        )
    )
        return;

    let reachedEntity = sightReachedEntity(player, event.level, 20);
    if (!reachedEntity) return;

    geneSplicerLogic(player, reachedEntity);
    event.cancel();
});

ItemEvents.entityInteracted((event) => {
    const { player, hand, target } = event;
    if (
        !(
            hand == "main_hand" &&
            player.getMainHandItem().id === "kubejs:gene_splicer"
        )
    )
        return;

    //geneSplicerLogic(player, target);
    //event.exit();
    event.cancel();
});

/**
 * @param {$ItemStack_} itemStack
 * @param {$ServerLevel_} level
 * @param {$LivingEntity_} entity
 */
function geneSplicerUsed(itemStack, level, entity) {
    //console.log("Hello Gene Splicer");
    let reachedEntity = sightReachedEntity(entity, level, 20);
    if (!reachedEntity) return itemStack;

    if (!entity.player) return itemStack;

    geneSplicerLogic(entity, reachedEntity);

    entity.addItemCooldown(itemStack, 20);
    return itemStack;
}
/**
 * @param {$ItemStack_} itemStack
 * @param {$ServerLevel_} level
 * @param {$LivingEntity_} entity
 */
global.MISC.geneSplicerUsed = geneSplicerUsed;
