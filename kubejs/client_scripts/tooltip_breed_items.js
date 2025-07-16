ItemEvents.modifyTooltips((event) => {
    event.modify("iceandfire:dragon_horn", (builder) => {
        builder.dynamic("iceandfire:dragon_horn");
    });

    event.modify("#kubejs:dragon_eggs", (builder) => {
        builder.dynamic("#kubejs:dragon_eggs");
    });

    event.modify("kubejs:gene_holder", (builder) => {
        builder.dynamic("kubejs:gene_holder");
    });

    event.modify("#kubejs:gene_imbueable", (builder) => {
        builder.dynamic("#kubejs:gene_imbueable");
    });
});

const BREED_DATA_KEY = "breedData";

/**
 *
 * @param {$DynamicItemTooltipsKubeEvent_} event
 * @param {$CompoundTag_} breedData
 * @returns
 */
function showBreedAttributes(event, breedData) {
    event.add(
        Text.translate("kubejs.breed.tooltip.strength", [
            Text.darkAqua(breedData.getInt("strength")),
        ]).gray()
        // Text.gray({ translate: "kubejs.breed.tooltip.strength" }).append(
        //     Text.darkAqua(breedData.getInt("strength"))
        // )
    );
    event.add(
        Text.translate("kubejs.breed.tooltip.constitution", [
            Text.darkAqua(breedData.getInt("constitution")),
        ]).gray()
    );
    event.add(
        Text.translate("kubejs.breed.tooltip.dexterity", [
            Text.darkAqua(breedData.getInt("dexterity")),
        ]).gray()
    );
}

/**
 *
 * @param {$DynamicItemTooltipsKubeEvent_} event
 * @param {$CompoundTag_} breedData
 * @returns
 */
function showBreedData(event, breedData) {
    showBreedAttributes(event, breedData);
    /**
     * @type {$CompoundTag_}
     */
    let traits = breedData.get("traits");
    if (traits.empty) return;

    let count = traits.size();
    let activeCount = 0;
    traits.getAllKeys().forEach((key) => {
        if (traits.getInt(key) > 0) activeCount++;
    });

    if (activeCount <= 0) {
        event.add(
            Text.translate("kubejs.breed.tooltip.traits", [
                Text.darkAqua(count),
            ]).gray()
            // Text.gray({ translate: "kubejs.breed.tooltip.traits" }).append(
            //     Text.darkAqua(breedData.get("traits").size())
            // )
        );
        return;
    }

    event.add(
        Text.translate("kubejs.breed.tooltip.traits.active", [
            Text.darkAqua(count),
            Text.gold(Utils.parseInt(activeCount, 0)),
        ]).gray()
        // Text.gray({ translate: "kubejs.breed.tooltip.traits" }).append(
        //     Text.darkAqua(breedData.get("traits").size())
        // )
    );
}

/**
 *
 * @param {$DynamicItemTooltipsKubeEvent_} event
 * @param {$CompoundTag_} breedData
 * @returns
 */
function showBreedDataNTraits(event, breedData) {
    let $ArrayList = Java.loadClass("java.util.ArrayList");

    showBreedAttributes(event, breedData);
    /**
     * @type {$CompoundTag_}
     */
    let traits = breedData.get("traits");
    if (traits.empty) return;
    let array = new $ArrayList();
    array.addAll(traits.getAllKeys());
    for (let key of array) {
        let lvl = traits[key];

        let mapEntry = global.BREED_TRAIT_DATA[key];
        if (lvl <= 0) {
            event.add(
                Text.translate("kubejs.breed.tooltip.trait.full.recessive", [
                    Text.of({ translate: mapEntry.name }),
                ])
                    .hover(Text.of({ translate: mapEntry.fullDesc }))
                    .darkGray()
            );
        } else {
            let lvlKey = `enchantment.level.${lvl}`;
            event.add(
                mapEntry.color(
                    Text.translate("kubejs.breed.tooltip.trait.full.active", [
                        Text.of({ translate: mapEntry.name }),
                        Text.of({ translate: lvlKey }),
                    ]).hover(Text.of({ translate: mapEntry.fullDesc }))
                )
            );
        }
    }
}

ItemEvents.dynamicTooltips("#kubejs:dragon_eggs", (event) => {
    const { item } = event;

    let breedData = item.getCustomData();
    if (!breedData || breedData.empty) {
        event.add(Text.darkRed({ translate: "kubejs.breed.tooltip.empty" }));
        return;
    }
    // showBreedData(event, breedData);
});

ItemEvents.dynamicTooltips("#kubejs:gene_imbueable", (event) => {
    const { item } = event;

    let breedData = item.getCustomData();
    if (!breedData || breedData.empty) {
        event.add(Text.darkRed({ translate: "kubejs.breed.tooltip.empty" }));
        return;
    }
    showBreedDataNTraits(event, breedData);
});

ItemEvents.dynamicTooltips("iceandfire:dragon_horn", (event) => {
    const { item } = event;

    let comp = item.getComponentMap().get("iceandfire:dragon_horn");
    if (!comp) return;

    let breedData = comp
        .entityData()
        .get("KubeJSPersistentData")
        .get(BREED_DATA_KEY);

    showBreedData(event, breedData);
});

ItemEvents.dynamicTooltips("kubejs:gene_holder", (event) => {
    const { item } = event;

    /**
     * @type {"FIRE" | "ICE" | "LIGHTNING" | "NONE" | null | undefined}
     */
    let dragonType = item.getCustomData().getString("holding");
    if (!dragonType || dragonType == "NONE") {
        event.add(Text.gray({ translate: "kubejs.tooltips.gene_holder.1" }));
        return;
    }
    //let breedData = item.getCustomData();
    switch (dragonType) {
        case "iceandfire:fire_dragon":
            event.add(
                Text.darkRed({
                    translate: "entity.iceandfire.fire_dragon",
                })
            );
            break;
        case "iceandfire:ice_dragon":
            event.add(
                Text.darkAqua({
                    translate: "entity.iceandfire.ice_dragon",
                })
            );
            break;
        case "iceandfire:lightning_dragon":
            event.add(
                Text.darkPurple({
                    translate: "entity.iceandfire.lightning_dragon",
                })
            );
            break;
    }
    showBreedData(event, item.getCustomData().get(BREED_DATA_KEY));
});
