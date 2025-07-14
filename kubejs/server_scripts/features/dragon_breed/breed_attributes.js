const BREED_ATTR_UUID = "f6e10a4f-552b-42cc-8c32-823155873eb5";

/**
 *
 * @param {$LivingEntity_} entity
 * @param {DragonBreedData} breedData
 */
function updateBreedAttributes(entity, breedData) {
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
