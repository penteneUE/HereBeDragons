ServerEvents.registry("jukebox_song", (event) => {
    //event.create("scrybe_of_magicks").song("scrybe_of_magicks", time);

    // 例子
    event
        .create("kubejs:music.scrybe_of_magicks")
        .song("kubejs:music.scrybe_of_magicks", 140);
});
