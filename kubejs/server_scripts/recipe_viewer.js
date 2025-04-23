RecipeViewerEvents.addInformation('item', event => {
    /** @type {$Map_<string, {gateway: string, name: string, description: string, product: {item: $Map_<string, number>, count: number}}}>} */
    const { STRUCTURE_DATA } = global

    const itemsToStructureGateways = new Map()

    STRUCTURE_DATA.forEach((structure, data) => {
        const { product, product: { item } } = data
        
        if (!product) return;
        if (!item) return;
        item.items.forEach((weight, thing) => {
            if (!itemsToStructureGateways.has(thing)) {
                itemsToStructureGateways.set(thing, [data.name])
                return;
            }
            itemsToStructureGateways[thing].push(data.name)
        })
    });
    
    // event.add('minecraft:apple', [
	// 	'An apple a day keeps the doctor away.'
    // ]);
    
    itemsToStructureGateways.forEach((structures, thing) => { //这牛魔的连环嵌套真是令人作呕看见就想死
        let texts = [
            Text.translate("kubejs.recipeinfo.conquest").gold()
        ]
        structures.forEach((value) => {
            texts.push(Text.translate(value).darkAqua())
        })
        event.add(thing, texts);
    })
})
        


