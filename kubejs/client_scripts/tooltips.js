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

    event.add("#kubejs:oldgen_dragon_hearts", [
        Text.gray({ translate: "kubejs.tooltips.oldgen_dragon_hearts.1" }),
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
    // event.
    // event.modify('kubejs:dragon_conquest_trophy', tooltip => {
    //     tooltip.dynamic()
    // })
    event.modify("kubejs:dragon_conquest_trophy", (builder) => {
        builder.dynamic("kubejs:dragon_conquest_trophy");
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
