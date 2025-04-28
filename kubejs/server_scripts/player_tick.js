PlayerEvents.tick((event) => {
    const { player } = event;

    if (player.tickCount % 20 != 0) return;

    playerTick_DragonState(event);
    playerTick_TaxCollect(event);
    playerTick_Sponge(event);
    playerTick_RepFrenzy(event);
    playerTick_PaperDragonEgg(event);
});
