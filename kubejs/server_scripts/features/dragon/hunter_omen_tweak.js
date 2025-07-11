//const checkList = new Set(["minecraft:villager", "minecraft:iron_golem", "guardvillagers:guard"])

const commonVillageMob = {
    "minecraft:villager": true,
    "minecraft:iron_golem": true,
    "guardvillagers:guard": true,
};

EntityEvents.afterHurt((event) => {
    if (!event.source.player) return;
    if (!event.source.actual.isPlayer()) return;

    const {
        source: { player },
        entity,
    } = event;

    if (!commonVillageMob[entity.type]) return;

    const { structure, structure_id } = whichStructureAmI(
        entity.blockPosition(),
        event.getLevel()
    );
    if (!structure || !structure_id) return;

    if (
        !matchDragonConquerRecord_withBbox(
            player,
            structure.getBoundingBox(),
            structure_id
        )
    )
        return;

    if (!player.hasEffect("dragonsurvival:hunter_omen")) return;
    if (player.potionEffects.getDuration("dragonsurvival:hunter_omen") > 601)
        return; //大于三十秒的不准撤消了

    player.removeEffect("dragonsurvival:hunter_omen");
    // const { dragonConquerRecords } = player.persistentData

    // if (!dragonConquerRecords) return;
    // if (!dragonConquerRecords[structure_id]) return;
});
