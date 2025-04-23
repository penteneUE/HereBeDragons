ItemEvents.modifyTooltips(event => {
    // Add tooltip to all of these items
  event.add("kubejs:dragon_flag", [Text.gray({ "translate": "kubejs.tooltips.dragon_flag.1" })])
  event.add("kubejs:tax_collector", [
    Text.gray({ "translate": "kubejs.tooltips.tax_collector.1" }),
    Text.gray({ "translate": "kubejs.tooltips.tax_collector.2" }),
    Text.gray({ "translate": "kubejs.tooltips.tax_collector.3" }),
  Text.darkGray({ "translate": "kubejs.tooltips.tax_collector.comment" })])
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