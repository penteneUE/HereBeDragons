# 系统模式 (System Patterns)

## 核心玩法循环

项目包含三个主要且相互关联的原创玩法系统，共同构成了“扮演恶龙”的核心体验。

### 1. 结构征服 (Dragon Conquest)
- **描述:** 玩家可以通过仪式挑战并征服原版结构，将其变为自己的领地。
- **流程:**
    1. 在结构内放置 `kubejs:dragon_flag`。
    2. 在旗座上放置旗帜以激活仪式，召唤一个传送门（Gateway）。
    3. 成功完成传送门挑战后，结构被征服。
- **关键脚本:** `dragon_conquer.js`, `gateway.js`
- **数据结构:** 征服记录储存在 `player.persistentData.dragonConquerRecords`。

### 2. 税收系统 (Tax Collector)
- **描述:** 玩家从已征服的领地自动收取每日税收。
- **流程:**
    1. 放置 `kubejs:tax_collector` 方块以绑定玩家。
    2. 系统每日根据 `dragonConquerRecords` 和 `global.STRUCTURE_DATA` 计算并分发物品奖励。
    3. 玩家可以通过在税收官中放置物品来影响奖励产出。
- **关键脚本:** `tax_collector.js`

### 3. 魔法：生物捕获 (Ananta Remanta)
- **描述:** 一个允许玩家捕获和驯服生物的法术。
- **流程:**
    1. 对低生命值的生物持续施法。
    2. 成功后，目标生物被替换为一个驯服版本。
    3. 失败会导致爆炸。
- **关键脚本:** `dragon/magic/ananta_remanta.js`

## KubeJS 脚本组织

- **核心玩法脚本:** 位于 `kubejs/server_scripts/dragon/`。
- **传送门系统:** 由 `gateway.js` 和 `data/kubejs/gateways/` 下的JSON文件共同驱动，具有良好的扩展性。
- **全局数据:** `global.STRUCTURE_DATA` (定义于 `kubejs/startup_scripts/structure_data.js`) 等全局变量用于定义核心系统数据。
- **核心命令:** `kubejs/server_scripts/command.js` 中定义了 `/whredragonswent` 命令，用于管理游戏核心状态（如锁定人形、完成征服等）。

## 主线任务流程与叙事

整合包的玩法由FTB任务线驱动，与KubeJS脚本紧密结合，形成了一个完整的叙事弧光。

```mermaid
graph TD
    subgraph 序章：化身为龙
        A[开始游戏] --> B{找到龙穴};
        B --> C[执行 /dragon-altar 命令];
        C --> D[设置 'disablehuman' 游戏阶段, 锁定人形];
    end

    subgraph 第一章：龙之初
        D --> E[制作龙裔旗帜];
        E --> F{征服建筑};
        F --> G[获得战利品];
        G --> H[兑换税收官];
        H --> I[学习自定义法术];
    end

    subgraph 第二章：征服之路
        I --> J[挑战凋灵、监守者等Boss];
        J --> K[收集上古龙之心];
    end

    subgraph 第三章：巨龙终途
        K --> L[击败末影龙后返回主世界];
        L --> M{触发“世界终结”事件};
        M --> N[收集纸龙残片];
        N --> O{执行 /whredragonswent onlydragon false};
        O --> P[解锁人形];
        P --> Q[孵化冰与火龙蛋];
    end

    subgraph 终章
        Q --> R[鸣谢 & 游戏结束];
    end
```

- **核心机制:**
    - **强制化龙:** 游戏初期通过任务触发 `/dragon-altar` 命令，并设置 `disablehuman` 游戏阶段，强制玩家以龙的形态进行游戏。
    - **重获自由:** 在任务线末期，通过提交特定物品触发 `/whredragonswent onlydragon false` 命令，移除 `disablehuman` 游戏阶段，让玩家可以自由变回人形。
    - **阶段驱动:** 整个任务流程大量使用 GameStage API 来判断和推进玩家的进度。