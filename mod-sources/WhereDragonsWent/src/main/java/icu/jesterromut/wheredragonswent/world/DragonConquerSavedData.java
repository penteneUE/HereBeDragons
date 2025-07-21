package icu.jesterromut.wheredragonswent;

import net.minecraft.core.HolderLookup;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.world.level.saveddata.SavedData;

public class DragonConquerSavedData  extends SavedData {

    public static DragonConquerSavedData create(){
        return  new DragonConquerSavedData();
    }

    public static DragonConquerSavedData load(CompoundTag tag, HolderLookup.Provider lookupProvider){
        DragonConquerSavedData data = DragonConquerSavedData.create();
        return  data;
    }

    @Override
    public CompoundTag save(CompoundTag tag, HolderLookup.Provider registries) {
        return tag;
    }

    public  void add(){
        this.setDirty();
    }
}
