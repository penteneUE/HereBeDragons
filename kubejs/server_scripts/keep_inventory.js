const xpTable = {}

EntityEvents.death("minecraft:player", event => {
    let { player, player: { xp, xpLevel, uuid } } = event

    // player.inventory.getAllItems().forEach(item => {
    //     if (item.id == "kubejs:felyne_recall") item.setCount(0);
    //  })
    
    if (!player.stages.has("keepexp")) return;
    xpTable[uuid] = player.xp
    player.xp = 0
    
})

PlayerEvents.respawned(event => {
    let { player, player: { uuid } } = event;
    
    // if (player.stages.has("felynerecall_true")) player.inventory.add(1, Item.of("kubejs:felyne_recall"))

    if (!player.stages.has("keepexp")) return;
    player.xp = xpTable[uuid]
    xpTable[uuid] = undefined

    //console.log(typeof(player.inventory), player.inventory instanceof Array)
})