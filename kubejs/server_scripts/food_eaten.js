ItemEvents.foodEaten((event) => {
    const { item, player } = event;
    if (!player) return;
    if (item.id == "iceandfire:ambrosia") {
        if (!global.UTILS.isDragon(player)) return;

        //player.potionEffects.add("minecraft:wither", 120);
        player.potionEffects.add("minecraft:instant_damage", 10, 1);
        return;
    }
    if (item.hasTag("kubejs:dragon_reproduction_item")) {
        if (!global.UTILS.isDragon(player)) return;
        //console.log(dragonGrowth(player));
        if (global.UTILS.dragonGrowth(player) < 40) return;
        player.potionEffects.add("kubejs:reproduction_frenzy", 600);
        player.stages.add("quest/wait_what");
        return;
    }
});
