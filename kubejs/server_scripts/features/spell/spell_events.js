ISSEvents.spellOnCast((event) => {
    switch (event.spellId) {
        case "kubejs:taotie_fabel":
            taotieFabel_onCast(event);
            break;
        case "kubejs:ananta_remanta":
            anantaRemanta_onCast(event);
            break;
    }
});

ISSEvents.spellPreCast((event) => {
    switch (event.spellId) {
        case "kubejs:ananta_remanta":
            anantaRemanta_preCast(event);
            break;
    }
});

ISSEvents.spellPostCast((event) => {
    switch (event.spell.spellId) {
        case "kubejs:ananta_remanta":
            anantaRemanta_postCast(event);
            break;
    }
});

// /**
//  * @param {$Player_} ctx
//  * @returns
//  */
// global.DRAGON_MAGIC.crafting = (player) => {
//     return isDragon(player);
// };

// console.log("-- @" + event.entity.scriptType);
// console.log("--- ON-CAST ---");
// console.log(event.entity ?? undefined);
// console.log(event.spellId ?? undefined);
// console.log(event.schoolType ?? undefined);
// console.log("Old Spell Level: " + event.originalSpellLevel ?? undefined);

// event.setSpellLevel(event.originalSpellLevel + 1);

// console.log("New Spell Level: " + event.spellLevel ?? undefined);
// console.log(event.castSource ?? undefined);

// console.log("Old Mana Cost: " + event.manaCost ?? undefined);
// event.setManaCost(event.manaCost + 1);
// console.log("New Mana Cost: " + event.manaCost ?? undefined);

//	console.log(event.entity.magicData ?? undefined)

// /**
//  * @param {$CustomSpell$CastContext_} ctx
//  * @returns
//  */
// global.DRAGON_MAGIC.taotieFabel_casted = (ctx) => {
//     let entity = ctx.getEntity?.toString();
//     console.log(ctx);
//     console.log(entity);
//     if (!entity) return;
//     console.log(entity);
//     if (!entity.isPlayer()) return;

//     entity.tell("i love you");
//     console.log(111);
//     //  event.server.getPlayers().forEach((player) => {
//     //      let oAABB = player.getBoundingBox().inflate(k);
//     //      event.server
//     //          .getLevel()
//     //          .getEntitiesWithin(oAABB)
//     //          .forEach((entity) => {
//     //              if (entity.type === "minecraft:skeleton") {
//     //                  player.playSound("kubejs:music.calm4", 1.0, 1.0); // With fixed volume and pitch
//     //              }
//     //          });
//     //  });
// };
