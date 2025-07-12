ItemEvents.modifyTooltips((event) => {
    event.add("iceandfire:ambrosia", [
        Text.gray({ translate: "kubejs.tooltips.ambrosia.1" }),
    ]);

    event.add("#kubejs:dragon_eggs", [
        Text.gray({ translate: "kubejs.tooltips.dragon_eggs.1" }),
    ]);

    event.add("iceandfire:dragon_meal", [
        Text.gray({ translate: "kubejs.tooltips.dragon_meal.1" }),
    ]);

    event.add("iceandfire:sickly_dragon_meal", [
        Text.gray({ translate: "kubejs.tooltips.sickly_dragon_meal.1" }),
    ]);

    event.add("#kubejs:dragon_summoning_crystals", [
        Text.gray({ translate: "kubejs.tooltips.dragon_summoning_crystals.1" }),
    ]);

    event.add("#kubejs:dragon_taming_items", [
        Text.gray({ translate: "kubejs.tooltips.dragon_taming_items.1" }),
    ]);

    event.add("#kubejs:dragon_reproduction_item", [
        Text.gray({ translate: "kubejs.tooltips.dragon_reproduction_item.1" }),
    ]);

    event.add("#iceandfire:dragon_armors", [
        Text.gray({ translate: "kubejs.tooltips.dragon_armors.1" }),
    ]);

    event.add("#kubejs:dragon_flesh", [
        Text.gray({ translate: "kubejs.tooltips.dragon_flesh.1" }),
    ]);

    event.add("#kubejs:newgen_dragon_hearts", [
        Text.gray({ translate: "kubejs.tooltips.dragon_flesh.1" }),
    ]);

    event.add("#kubejs:oldgen_dragon_hearts", [
        Text.gray({ translate: "kubejs.tooltips.oldgen_dragon_hearts.1" }),
    ]);

    event.add("#kubejs:dragon_stews", [
        Text.gray({ translate: "kubejs.tooltips.dragon_stews.1" }),
        Text.darkGray({ translate: "kubejs.tooltips.dragon_stews.comment" }),
    ]);

    // Add tooltip to all of these items
    event.add("kubejs:dragon_flag", [
        Text.gray({ translate: "kubejs.tooltips.dragon_flag.1" }),
    ]);
    event.add("kubejs:endless_undead_flag", [
        Text.gray({ translate: "kubejs.tooltips.endless_undead_flag.1" }),
    ]);
    event.add("kubejs:endless_myth_flag", [
        Text.gray({ translate: "kubejs.tooltips.endless_myth_flag.1" }),
    ]);
    event.add("kubejs:endless_titan_flag", [
        Text.gray({ translate: "kubejs.tooltips.endless_titan_flag.1" }),
    ]);
    event.add("kubejs:endless_dragon_flag", [
        Text.gray({ translate: "kubejs.tooltips.endless_dragon_flag.1" }),
    ]);

    event.add("kubejs:tax_collector", [
        Text.gray({ translate: "kubejs.tooltips.tax_collector.1" }),
        Text.gray({ translate: "kubejs.tooltips.tax_collector.2" }),
        Text.gray({ translate: "kubejs.tooltips.tax_collector.3" }),
        Text.darkGray({ translate: "kubejs.tooltips.tax_collector.comment" }),
    ]);

    event.add("kubejs:wet_sponge", [
        Text.gray({ translate: "kubejs.tooltips.wet_sponge.1" }),
    ]);
    event.add("kubejs:dry_sponge", [
        Text.gray({ translate: "kubejs.tooltips.dry_sponge.1" }),
    ]);

    event.add("kubejs:paper_dragon_fragment", [
        Text.gray({ translate: "kubejs.tooltips.paper_dragon_fragment.1" }),
    ]);

    event.add("kubejs:paper_dragon_egg", [
        Text.gray({ translate: "kubejs.tooltips.paper_dragon_egg.1" }),
    ]);

    event.add("kubejs:gene_splicer", [
        Text.gray({ translate: "kubejs.tooltips.gene_splicer.1" }),
    ]);

    // event.
    // event.modify('kubejs:dragon_conquest_trophy', tooltip => {
    //     tooltip.dynamic()
    // })
    event.modify("kubejs:dragon_conquest_trophy", (builder) => {
        builder.dynamic("kubejs:dragon_conquest_trophy");
    });

    // event.modify("#kubejs:dragon_eggs", (builder) => {
    //     builder.dynamic("#kubejs:dragon_eggs");
    // });

    event.modify("iceandfire:dragon_horn", (builder) => {
        builder.dynamic("iceandfire:dragon_horn");
    });
});

ItemEvents.dynamicTooltips("kubejs:dragon_conquest_trophy", (event) => {
    const { item } = event;
    event.add(
        Text.gray({ translate: "kubejs.tooltips.dragon_conquest_trophy.1" })
    );
    event.add(
        Text.translate("kubejs.tooltips.dragon_conquest_trophy.structure", [
            Text.translate(
                `kubejs.${item.getCustomData().getString("gateway")}`
            ),
        ]).darkAqua()
    );
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
    // event.add(
    //     Text.of(
    //         `${comp
    //             .entityData()
    //             .get("KubeJSPersistentData")
    //             .get(BREED_DATA_KEY)}`
    //     )
    // );
    //console.log(comp.entityData);
    //event.add(Text.of(comp.entityData()));
    //let breedData = item.getCustomData();
    //showBreedData(event, breedData);
    // traits.size()
});
