# 技术背景 (Tech Context)

## 核心技术栈

- **Minecraft 版本:** 1.21
- **主要 Mod:**
    - **KubeJS:** 用于实现原创玩法和魔改的核心工具。相关文件位于整个 `kubejs/` 目录下，包括但不限于 `server_scripts`, `client_scripts`, `startup_scripts`, `assets` 和 `data`。
    - **FTB Quests:** 用于创建整合包的任务线。配置文件位于 `config/ftbquests/`。
    - **冰与火 (Ice and Fire):** 提供环境中的 NPC 龙和其他神话生物。
    - **龙之生存 (Dragon Survival):** 提供玩家扮演龙的核心机制。
    - **铁魔法 (Iron's Spells 'n Spellbooks):** 提供魔法系统，提升玩家的战斗力，允许整合包原创自定义法术。
    - **GameStage API:** 通过KubeJS集成，用于管理玩家进度和解锁条件，是任务系统和玩法限制的核心。
    
    ## 文件结构与开发模式
    
    - **原创内容开发:** 主要通过 KubeJS 脚本和配置文件进行。
    - **任务系统:** 通过 FTB Quests 的图形化界面或直接编辑其配置文件来设计任务。
    - **许可证:** 整合包遵循 GPLv3 协议，同时要求遵守 Minecraft EULA。SCP基金会相关内容遵守CC-BY-SA 3.0协议。
    
    ### 脚本执行环境
    
    - **`startup_scripts` vs. `server_scripts`:**
        - **`startup_scripts`:** 这些脚本在游戏启动时加载，并且是**双端通用**的（即在客户端和服务端都会执行）。因此，它们非常适合用于注册物品、方块、流体等需要在两端都存在的对象。
        - **`server_scripts`:** 这些脚本只在**服务端**加载和执行。它们用于处理游戏逻辑、事件、命令等仅在服务端运行的功能。
    - **重要规则：禁止混用脚本内容**
        - **绝对不要**将 `startup_scripts` 中定义的变量或函数移动到 `server_scripts/lib` 中，反之亦然。
        - `startup_scripts` 中定义的 `global` 变量（如 `global.UTILS`）通常是作为**占位符**存在的，目的是为了让客户端能够访问而不会报错。这些占位符的实际功能会在 `server_scripts` 中被**覆盖 (override)** 以提供完整的功能。
        - 错误地移动这些脚本会破坏这种设计模式，并可能导致客户端或服务端出现严重的功能性问题。
    
    ### 代码风格与规范 (Code Style & Conventions)
    
    - **JSDoc 类型标注**: 在为 KubeJS 脚本编写 JSDoc 时，对于 KubeJS 提供的 Java 类型包装器，应使用 `$` 前缀和 `_` 后缀的格式。
      - **正确示例**: `/** @param {$Player_} player */`
      - **错误示例**: `/** @param {Internal.Player} player */`
    - **控制台输出 (Console Output)**: KubeJS 的 `console` 对象仅支持 `console.log()` 方法。**严禁使用** `console.error()`, `console.warn()`, `console.info()` 等其他方法，否则会导致KubeJS使用的Rhino引擎崩溃、游戏崩溃。
    - **变量声明 (Variable Declaration)**: 由于 KubeJS (Rhino) 的作用域和变量提升机制，**必须优先使用 `let` 进行变量声明**。避免使用 `const`，以防止在事件监听器或循环等复杂作用域中出现 `redeclaration` 错误。