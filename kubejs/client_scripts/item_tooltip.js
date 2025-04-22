ItemEvents.modifyTooltips(event => {
    // Add tooltip to all of these items
    event.add("kubejs:dragon_flag", [Text.gray({ "translate": "kubejs.tooltips.dragon_flag.1" })])
    // event.
    // event.modify('kubejs:dragon_conquest_trophy', tooltip => {
    //     tooltip.dynamic()
    // })
    event.modify('kubejs:dragon_conquest_trophy', (builder) => {
      builder.dynamic('kubejs:dragon_conquest_trophy');
    });
})

ItemEvents.dynamicTooltips("kubejs:dragon_conquest_trophy", event => {
    const { item } = event;
    event.add(Text.gray({ "translate": "kubejs.tooltips.dragon_conquest_trophy.1" }))
    event.add(Text.translate("kubejs.tooltips.dragon_conquest_trophy.structure", [`${item.getCustomData().getString("structure_id")}`]).darkAqua());
})