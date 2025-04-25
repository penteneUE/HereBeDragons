ItemEvents.foodEaten((event) => {
    const { item, player } = event;
    if (!player) return;

    console.log(item.id);
});
