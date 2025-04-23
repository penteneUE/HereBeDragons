PlayerEvents.tick(event => {
    const { player } = event;

    if (player.tickCount % 20 != 0) return

    playerTick_DragonState(event)
    playerTick_TaxCollect(event)
    
 })