function weightedRandom() {
    let builder = {
        items: new Map(),
        /**
         * @param {any} item
         * @param {number} weight
         */
        add: function(item, weight) {
            builder.items.set(item, weight)
            return builder;
        },
        getItem: function() {
            const items = Array.from(this.items);
            //var pmf = [0.8, 0.1, 0.1];
            //var pmf = Array.from(items.values())
            //var cdf = pmf.map((sum => value => sum += value)(0));
            let total = 0.0;
            items.forEach((record) => {
                total += record[1];
            })

            let max = items[0][1]
            let random = Math.random() * total
            
            for (let index = 0; index < items.length; index++){
                if (random < max) {
                    return items[index][0]
                } else if (index == items.length - 1) {
                    return items[items.length -1][0]
                }
                max += items[index+1][1]
            }

            return -1
        }
    }

    return builder;
}


const structureData = Utils.newMap();

structureData.put("skyvillages:skyvillage", {
    gateway: "kubejs:village/sky_village",
    name: "kubejs.recipeinfo.conquest.sky_village",
    description: "kubejs.recipeinfo.conquest.sky_village.description",
    product: { //每日结算
        item: weightedRandom()
            .add("minecraft:emerald", 2)
            .add("minecraft:iron_ingot", 1)
            .add("minecraft:gold_ingot", 2)
            .add("dragonsurvival:elder_dragon_dust", 1),
        count: 3
    }
})
    
// new Map([
//     ["skyvillages:skyvillage", {
//         gateway: "kubejs:village/sky_village",
//         name: "kubejs.recipeinfo.conquest.sky_village",
//         description: "kubejs.recipeinfo.conquest.sky_village.description",
//         product: { //每日结算
//             item: weightedRandom()
//                 .add("minecraft:emerald", 2)
//                 .add("minecraft:iron_ingot", 1)
//                 .add("minecraft:gold_ingot", 2)
//                 .add("dragonsurvival:elder_dragon_dust", 1),
//             count: 3
//         }
//     }]
// ])

global.STRUCTURE_DATA = structureData;
    //.get().product.item.items.