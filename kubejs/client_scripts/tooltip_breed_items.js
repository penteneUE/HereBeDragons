ItemEvents.modifyTooltips((event) => {
    event.modify("iceandfire:dragon_horn", (builder) => {
        builder.dynamic("iceandfire:dragon_horn");
    });

    event.modify("iceandfire:gene_holder", (builder) => {
        builder.dynamic("iceandfire:gene_holder");
    });
});

const BREED_DATA_KEY = "breedData";

/**
 *
 * @param {$DynamicItemTooltipsKubeEvent_} event
 * @param {$CompoundTag_} breedData
 * @returns
 */
function showBreedData(event, breedData) {
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
    /**
     * @type {$CompoundTag_}
     */
    let traits = breedData.get("traits");
    if (traits.empty) return;

    let count = traits.size();
    let activeCount = 0;
    traits.getAllKeys().forEach((key) => {
        if (traits.getInt(key) > 1) activeCount++;
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
            Text.gold(activeCount),
        ]).gray()
        // Text.gray({ translate: "kubejs.breed.tooltip.traits" }).append(
        //     Text.darkAqua(breedData.get("traits").size())
        // )
    );
}

// ItemEvents.dynamicTooltips("#kubejs:dragon_eggs", (event) => {
//     const { item } = event;

//     let breedData = item.getCustomData();
//     showBreedData(event, breedData);
//     // traits.size()
// });

ItemEvents.dynamicTooltips("iceandfire:dragon_horn", (event) => {
    const { item } = event;

    let comp = item.getComponentMap().get("iceandfire:dragon_horn");

    let breedData = comp
        .entityData()
        .get("KubeJSPersistentData")
        .get(BREED_DATA_KEY);

    showBreedData(event, breedData);
});

ItemEvents.dynamicTooltips("kubejs:gene_holder", (event) => {
    const { item } = event;

    event.add(Text.darkGray({ translate: "kubejs.tooltips.gene_holder.1" }));
    //let breedData = item.getCustomData();

    //showBreedData(event, breedData);
});
