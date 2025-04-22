StartupEvents.registry('item', event => {
    event.create('felyne_recall').texture('kubejs:item/felyne_recall').maxStackSize(1)

    event.create('dragon_conquest_trophy').texture('kubejs:item/dragon_flag').fireResistant(true)
})