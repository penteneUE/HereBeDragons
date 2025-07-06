RecipeViewerEvents.addInformation("item", (event) => {
    /** @type {$Map_<string, {gateway: string, name: string, description: string, product: {item: $Map_<string, number>, count: number}}}>} */
    const { STRUCTURE_DATA } = global;

    const itemsToStructureGateways = Utils.newMap();

    STRUCTURE_DATA.forEach((structure, data) => {
        const {
            product,
            product: { item },
        } = data;

        if (!product) return;
        if (!item) return;

        let totalWeight = item.sum();

        item.items.forEach((weight, thing) => {
            // let object = {
            //     structure: data.name,
            //     chance: weight / totalWeight,
            // };
            if (!itemsToStructureGateways.containsKey(thing)) {
                itemsToStructureGateways[thing] = Utils.newMap();
            }
            if (itemsToStructureGateways[thing].containsKey(data.name)) return;
            //console.log(STRUCTURE_DATA);
            itemsToStructureGateways[thing][data.name] =
                (weight / totalWeight) * 100;
        });
    });

    // event.add('minecraft:apple', [
    // 	'An apple a day keeps the doctor away.'
    // ]);

    itemsToStructureGateways.forEach((thing, structures) => {
        //这牛魔的连环嵌套真是令人作呕看见就想死
        let texts = [Text.translate("kubejs.recipeinfo.conquest").gold()];
        structures.forEach((key, value) => {
            texts.push(
                Text.translate(key)
                    .darkAqua()
                    .append(Text.gold(` (${value.toFixed(2)}%)`))
            );
        });
        event.add(thing, texts);
    });

    itemsToStructureGateways.clear();
});
