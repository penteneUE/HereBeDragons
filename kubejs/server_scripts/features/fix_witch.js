EntityEvents.spawned(
    "minecraft:witch",
    (
        /** @type {$EntitySpawnedKubeEvent_ & {entity: $LivingEntity_}} */ event
    ) => {
        let { entity } = event;
        entity.potionEffects.add(
            "irons_spellbooks:blight",
            2147463647,
            255,
            true,
            true
        );
    }
);
