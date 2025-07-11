/**
 *
 * @param {$Player_} player
 * @param {$LivingEntity_} entity
 */
function geneSplicerLogic(player, entity) {
    player.tell(entity.displayName);
    player.tell(entity.persistentData);
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
