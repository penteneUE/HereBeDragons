EntityEvents.beforeHurt("minecraft:player", (event) => {
    let { player, source } = event;
    if (!global.UTILS.isDragon(player)) return;

    //console.log(source.getType());
    let type = source.getType();
    if (
        !(
            type == "dragon_fire" ||
            type == "dragon_ice" ||
            type == "dragon_lightning"
        )
    )
        return;
    event.setDamage(Math.floor(event.damage / 3));
});
