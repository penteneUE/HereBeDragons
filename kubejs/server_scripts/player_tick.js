PlayerEvents.tick(event => {
    const { player } = event;

    if (player.tickCount % 20 != 0) return

    handleDragonStateStuff(event)
    handleTaxCollectingStuff(event)
    
 })