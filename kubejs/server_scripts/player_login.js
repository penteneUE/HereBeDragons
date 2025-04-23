PlayerEvents.loggedIn(event => {
    let player = event.player

    const { activeTaxCollector } = player.persistentData;

    if (activeTaxCollector) {
        let taxCollector = event.server.getLevel(activeTaxCollector.getString("dimension")).getBlock(
            activeTaxCollector.getInt("x"),
            activeTaxCollector.getInt("y"),
            activeTaxCollector.getInt("z"))
        if (taxCollector.id == "kubejs:tax_collector") return;
        if (taxCollector.getEntityData().getString("ownerID") == player.getUuid().toString()) return;
        console.log(player.getUuid().toString())

        player.persistentData.remove("activeTaxCollector")
        player.tell(Text.translate("kubejs.taxcollector.broken").color(0xd77a61))
        
    }

    event.server.scheduleInTicks(20, (callback) => {
        

        if (!player.stages.has("firstjoined")) {
            //player.inventory.clear()

            player.give(Item.of('ftbquests:book'))


            const plrname = player.name.getString()
            event.server.runCommandSilent(`/effect give ${plrname} minecraft:slowness infinite 255 true`)
            event.server.runCommandSilent(`/effect give ${plrname} minecraft:blindness infinite 255 true`)
            event.server.runCommandSilent(`/title ${plrname} subtitle {"text":"§f这本书……"}`)
            event.server.runCommandSilent(`/title ${plrname} title {"text":"§f打开……"}`)

            player.stages.add('firstjoined')
        }
    })
})