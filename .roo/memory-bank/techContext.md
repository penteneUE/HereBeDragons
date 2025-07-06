# 技术背景 (Tech Context)

## 核心技术栈

- **Minecraft 版本:** 1.21
- **主要 Mod:**
    - **KubeJS:** 用于实现原创玩法和魔改的核心工具。相关文件位于整个 `kubejs/` 目录下，包括但不限于 `server_scripts`, `client_scripts`, `startup_scripts`, `assets` 和 `data`。
    - **FTB Quests:** 用于创建整合包的任务线。配置文件位于 `config/ftbquests/`。
    - **冰与火 (Ice and Fire: Dragons):** 提供环境中的 NPC 龙和其他神话生物。
    - **龙之生存 (Dragon Survival):** 提供玩家扮演龙的核心机制。
    - **铁魔法 (Iron's Spells 'n Spellbooks):** 提供魔法系统。

## 文件结构与开发模式

- **原创内容开发:** 主要通过 KubeJS 脚本和配置文件进行。
- **任务系统:** 通过 FTB Quests 的图形化界面或直接编辑其配置文件来设计任务。
- **许可证:** 整合包遵循 GPLv3 协议，同时要求遵守 Minecraft EULA。