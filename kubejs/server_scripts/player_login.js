PlayerEvents.loggedIn(event => {
    let player = event.player

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