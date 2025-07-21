package icu.jesterromut.wheredragonswent.world;

import net.minecraft.core.HolderLookup;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.saveddata.SavedData;
import net.minecraft.world.level.storage.DimensionDataStorage;
import net.neoforged.fml.event.lifecycle.FMLCommonSetupEvent;
import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

public class DragonConquerSavedData  extends SavedData {
    public static final String NAME = "dragon_conquer";

    private final HashMap<UUID, List<UUID>> playerStructuresMap = new HashMap<>();

    public static DragonConquerSavedData create(){
        return  new DragonConquerSavedData();
    }

    public static DragonConquerSavedData load(CompoundTag tag, HolderLookup.Provider lookupProvider){
        DragonConquerSavedData data = DragonConquerSavedData.create();
        return  data;
    }

    @Override
    public @NotNull CompoundTag save(@NotNull CompoundTag tag, HolderLookup.@NotNull Provider registries) {
        return tag;
    }

    public  void add(){
        this.setDirty();
    }

    /**
     * 获取指定世界的ModLevelSaveData实例。通过这个方法获得对应的data
     *
     * @param worldIn 要获取数据的世界。
     * @return 与指定世界关联的ModLevelSaveData实例。
     * @throws RuntimeException 如果尝试从客户端世界获取数据，则抛出运行时异常。
     * **/
    public static DragonConquerSavedData get(Level worldIn) {
        if (!(worldIn instanceof ServerLevel)) {
            throw new RuntimeException("Attempted to get the data from a client world. This is wrong.");
        }
        ServerLevel world = worldIn.getServer().getLevel(ServerLevel.OVERWORLD);
        assert world != null;
        DimensionDataStorage dataStorage = world.getDataStorage();
        return dataStorage.computeIfAbsent(new Factory<DragonConquerSavedData>(DragonConquerSavedData::create, DragonConquerSavedData::load), DragonConquerSavedData.NAME);
    }
}
