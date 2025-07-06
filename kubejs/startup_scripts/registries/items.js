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
});
