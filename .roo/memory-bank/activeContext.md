# 当前工作上下文 (Active Context)

## 当前工作重点

当前的主要任务是对 KubeJS 脚本进行重构，以提高代码的模块化和可维护性。重点是将多个脚本中共享的通用函数提取到 `kubejs/server_scripts/lib/` 目录中，并使用 `//priority` 注释来确保它们被优先加载。

## 最近的更改

- **函数提取:**
    - 从 `kubejs/server_scripts/features/spell/ananta_remanta.js` 中提取了以下函数：
        - `randomUUID()` -> `kubejs/server_scripts/lib/random_uuid.js`
        - `lerpColor()` -> `kubejs/server_scripts/lib/color.js`
        - `sightReachedBlock()` 和 `sightReachedEntity()` -> `kubejs/server_scripts/lib/ray_trace.js`
    - 从 `kubejs/server_scripts/features/dragon/dragon_conquer.js` 中提取了以下函数：
        - `clearDragonConquerRecord()`, `clearDragonConquerStructure()`, `clearDragonConquerHere()`, `matchDragonConquerRecord_withBbox()`, `matchDragonConquerRecord()` -> `kubejs/server_scripts/lib/dragon_conquer_records.js`

## 下一步

- 继续审查 `kubejs/server_scripts`、`kubejs/client_scripts` 和 `kubejs/startup_scripts` 中的其余脚本，以识别更多可以提取的通用函数。
- 在完成所有函数提取后，对项目进行全面测试，以确保所有功能仍然正常工作。