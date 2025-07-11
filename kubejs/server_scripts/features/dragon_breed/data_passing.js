NativeEvents.onEvent(
    "net.neoforged.neoforge.event.entity.EntityEvent$EntityConstructing",
    (
        /**@type {import("net.neoforged.neoforge.event.entity.EntityEvent$EntityConstructing").$EntityEvent$EntityConstructing} */ event
    ) => {
        let { entity } = event;
        if (!isIAFDragon(entity)) return;
        console.log(entity);

        //let k = 1;
        let oAABB = entity.getBoundingBox();
        //.inflate(k);

        entity.server.scheduleInTicks(2, () => {
            /** @type {$Entity_ | null} */
            let egg = null;
            console.log(entity.level);
            entity.level.getEntitiesWithin(oAABB).forEach((e) => {
                if (egg) return;
                if (e.type == "iceandfire:dragon_egg") egg = e;
            });
            console.log(egg);
        });
    }
);
