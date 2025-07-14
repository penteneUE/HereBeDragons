const BREED_ATTR_UUID = "f6e10a4f-552b-42cc-8c32-823155873eb5";

/**
 *
 * @param {$LivingEntity_} entity
 * @param {DragonBreedData} breedData
 */
function updateBreedAttributes(entity, breedData) {
    if (!breedData) {
        return;
    }

    // /**
    //  * @type {$HashMap_<$Attribute_, number>}
    //  */
    /**
     * @type {Map<$Attribute_, number>}
     */
    let attrMap = new Map();
    attrMap.set(
        "generic.attack_damage",
        Utils.parseDouble(breedData.strength, 1) / 256 / 3
    );

    attrMap.set(
        "dragonsurvival:dragon_ability_damage",
        Utils.parseDouble(breedData.strength, 1) / 256 / 3
    );

    attrMap.set(
        "dragonsurvival:dragon_breath_range",
        Utils.parseDouble(breedData.strength, 1) / 256 / 3
    );

    attrMap.set(
        "generic.max_health",
        Utils.parseDouble(breedData.constitution, 1) / 256 / 3
    );

    attrMap.set(
        "generic.movement_speed",
        Utils.parseDouble(breedData.dexterity, 1) / 256 / 4
    );

    attrMap.set(
        "generic.jump_strength",
        Utils.parseDouble(breedData.dexterity, 1) / 256 / 5
    );

    attrMap.set(
        "dragonsurvival:flight_speed",
        Utils.parseDouble(breedData.dexterity, 1) / 256 / 4
    );

    attrMap.set(
        "dragonsurvival:flight_stamina",
        Utils.parseDouble(breedData.dexterity, 1) / 256 / 4
    );

    attrMap.forEach((power, school) => {
        entity.modifyAttribute(
            school, //Select max_health attribute
            BREED_ATTR_UUID, //Identifier (UUID)
            power,
            "add_multiplied_base"
        ); //Operation
    });
}

/**
 *
 * @param {$LivingEntity_} entity
 */
function removeBreedAttributes(entity) {
    for (const key of [
        "generic.attack_damage", //哎呀
        "dragonsurvival:dragon_ability_damage",
        "dragonsurvival:dragon_breath_range",
        "generic.max_health",
        "generic.movement_speed",
        "generic.jump_strength",
        "dragonsurvival:flight_speed",
        "dragonsurvival:flight_stamina",
    ]) {
        entity.modifyAttribute(
            key, //Select max_health attribute
            BREED_ATTR_UUID, //Identifier (UUID)
            0,
            "add_multiplied_base"
        );
    }
}
