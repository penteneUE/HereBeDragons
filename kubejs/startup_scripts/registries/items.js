// let $GrowthItem = Java.loadClass(
//     "by.dragonsurvivalteam.dragonsurvival.common.codecs.GrowthItem"
// );

StartupEvents.registry("item", (event) => {
    event
        .create("felyne_recall")
        .texture("kubejs:item/felyne_recall")
        .maxStackSize(1);

    event
        .create("dragon_conquest_trophy")
        .texture("kubejs:item/dragon_flag")
        .fireResistant(true);

    event
        .create("wet_sponge")
        .texture("kubejs:item/wet_sponge")
        .useAnimation("bow")
        .useDuration((itemStack) => 20)
        .use((level, player, hand) => {
            return true;
        })
        .finishUsing((itemStack, level, entity) => {
            if (level.isClientSide()) return itemStack;
            return global.MISC.spongeUsed(itemStack, level, entity);
        })
        .fireResistant(true);
    event.create("dry_sponge").texture("kubejs:item/dry_sponge");

    event
        .create("paper_dragon_fragment")
        .texture("kubejs:item/paper_dragon_fragment")
        .fireResistant(true)
        .maxStackSize(1);
    event
        .create("paper_dragon_egg")
        .texture("kubejs:item/paper_dragon_egg")
        .fireResistant(true)
        .maxStackSize(1);

    event
        .create("kubejs:magic_disc")
        .texture("kubejs:item/magic_disc")
        .jukeboxPlayable("kubejs:music.scrybe_of_magicks", true)
        .maxStackSize(1)
        .fireResistant(true);

    event
        .create("kubejs:cave_dragon_heart")
        .texture("kubejs:item/cave_dragon_heart")
        .tag("kubejs:oldgen_dragon_hearts");
    event
        .create("kubejs:forest_dragon_heart")
        .texture("kubejs:item/forest_dragon_heart")
        .tag("kubejs:oldgen_dragon_hearts");
    event
        .create("kubejs:sea_dragon_heart")
        .texture("kubejs:item/sea_dragon_heart")
        .tag("kubejs:oldgen_dragon_hearts");

    event
        .create("kubejs:fire_dragon_stew")
        .tag("kubejs:dragon_stews")
        .food((food) => {
            food.nutrition(24).saturation(32);
        });

    event
        .create("kubejs:ice_dragon_stew")
        .tag("kubejs:dragon_stews")
        .food((food) => {
            food.nutrition(24).saturation(32);
        });

    event
        .create("kubejs:lightning_dragon_stew")
        .tag("kubejs:dragon_stews")
        .food((food) => {
            food.nutrition(24).saturation(32);
        });

    event
        .create("kubejs:gene_splicer")
        .useAnimation("bow")
        .useDuration((itemStack) => 10)
        .use((level, player, hand) => {
            return true;
        })
        .finishUsing((itemStack, level, entity) => {
            if (level.isClientSide()) return itemStack;
            return global.MISC.geneSplicerUsed(itemStack, level, entity);
        })
        .fireResistant(true)
        .maxStackSize(1)
        .unstackable();

    event.create("kubejs:gene_holder");
    //.maxStackSize(1).unstackable();

    // $GrowthItem.create(12000, caveHeart.get());
    // $GrowthItem.create(12000, "kubejs:forest_dragon_heart");
    // $GrowthItem.create(12000, "kubejs:sea_dragon_heart");
});
