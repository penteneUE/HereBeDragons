StartupEvents.registry('item', event => {
    event.create('felyne_recall').texture('kubejs:item/felyne_recall').maxStackSize(1)

    event.create('dragon_conquest_trophy').texture('kubejs:item/dragon_flag').fireResistant(true)

    event.create('wet_sponge').texture('kubejs:item/wet_sponge')
        .useAnimation('bow')
        .useDuration(itemStack => 20)
        .use((level, player, hand) => {
            return true;
        })
        .finishUsing(sponge_Used)
        .fireResistant(true)
    event.create('dry_sponge').texture('kubejs:item/dry_sponge')

})