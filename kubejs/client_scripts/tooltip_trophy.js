ItemEvents.modifyTooltips((event) => {
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
