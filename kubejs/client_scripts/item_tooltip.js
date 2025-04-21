ItemEvents.modifyTooltips(event => {
    // Add tooltip to all of these items
    event.add("kubejs:felyne_recall", [Text.gray({ "translate": "kubejs.tooltips.felyne_recall.1" }), Text.white({ "translate": "kubejs.tooltips.felyne_recall.2" })])
    // event.add('kubejs:felyne_recall', (item, advanced, text) => {
    //     text.add([Text.gray({ "translate": "kubejs.tooltips.felyne_recall.1" })]);
    //     text.add([Text.white({ "translate": "kubejs.tooltips.felyne_recall.2" })]);
    // })
})