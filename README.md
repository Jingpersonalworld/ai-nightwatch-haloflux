# NIGHTWATCH × HALOFLUX

AI 守夜人的浏览器攻防作战室。V2 以红蓝双球显示攻击、告警和处置过程，并提供 V1 八栏视图。可以使用内置演练，也可以接入已部署的守夜人实验机。

> **AI 守夜人（Nightwatch）** 是一个 24 小时驻守校园网站与服务器的防御侧安全 Agent：先验真、再处置、全程留痕。AI 不在裁决链路上，封禁结论由确定性规则给出，每个处置都带证据事件号并写入哈希链账本。本仓库是它的可视化作战室，守夜人本体见 [29ArtLife/ai-nightwatch](https://github.com/29ArtLife/ai-nightwatch)。

## 界面

- **左蓝右红**：左侧是防守方（守夜人），右侧是攻击方（Kali 红队）。
- **攻击效果**：红色弹道表示攻击命中或被拦，蓝色护盾弧表示 nftables 封禁，紫色弧表示 AI 推理，蓝色光束是反制。
- **两侧操作面板**：左侧实时操作记录、右侧红方执行操作，大小与位置对称。
- **视觉风格**：冷白新拟物（neumorphism），字体为 Manrope（界面）与 JetBrains Mono（IP、命令、计数），均自托管并内嵌进单文件版，离线可用。
- **快捷键**：`C` 控制台、`M` 背景音乐、`S` 音效、`H` 影院模式、`F` 全屏。
- **两种数据源**：默认是内置演练（DEMO REPLAY）；连接桥接服务后切换为 LIVE，读取守夜人事件账本。

页面里出现的 IP（`192.0.2.10`、`198.51.100.23`、`203.0.113.2`）是文档保留地址，仅作示例，可在页面右上角「双方电脑接入」里改成你自己的实验网地址。


## 离线预览

下载或克隆仓库后，在 Chrome 或 Edge 中打开仓库根目录的 `双击直接打开-红蓝双球攻防大屏V2.html`。这个页面自带演练数据，无需启动 Node.js 服务。
`docs/haloflux/nightwatch-halo.html` 是同一份 V2 页面，`docs/haloflux/nightwatch-halo-v1.html` 是独立 V1 页面。

## 启动开发环境

安装 Node.js 和 npm，在仓库根目录运行以下命令，然后访问 `http://localhost:3000/`。

```bash
npm install
npm run dev
```

Windows 也可以双击仓库根目录的 `Windows一键启动.bat`。修改前端后可运行 `npm run build` 生成 `dist/`。

重建两个单文件 HTML：

```bash
npm run build:single
```

## 连接守夜人实验机

桥接脚本按守夜人部署目录定位 `data/nightwatch.db`，以只读方式查询账本并通过 SSE 推送事件。网页上的解封操作由桥接服务调用守夜人 CLI。
在已部署守夜人的实验机上，在守夜人部署目录里运行以下命令，把本仓库的桥接脚本和页面复制到对应位置（下面以 `HALOFLUX` 指本仓库的克隆路径）。若守夜人部署在其他目录，将命令中的目标路径改为实际部署路径，并在该目录启动桥接。

```bash
mkdir -p docs/haloflux
cp HALOFLUX/scripts/web_bridge.py scripts/web_bridge.py
cp HALOFLUX/docs/haloflux/nightwatch-halo*.html docs/haloflux/
.venv/bin/python scripts/web_bridge.py --host 127.0.0.1 --port 8765
```

从另一台电脑访问时，将 `user@nightwatch-host` 替换为实验机的 SSH 登录地址，在本机运行下面的命令，然后打开 `http://127.0.0.1:8765/`。

```bash
ssh -N -L 8765:127.0.0.1:8765 user@nightwatch-host
```

### 桥接安全

- 默认只监听 `127.0.0.1`，不要改成 `0.0.0.0` 直接暴露到局域网；
- `POST /api/unban` 只接受同源、`application/json` 请求，并有 1 次/秒限流；
- 如需额外鉴权，启动时设置 token：

```bash
NW_BRIDGE_TOKEN='随机字符串' .venv/bin/python scripts/web_bridge.py --host 127.0.0.1 --port 8765
```

前端通过 `?token=` 或 `Authorization: Bearer` 访问 `/api/*` 与 `/events`。

### 许可证

本仓库的 HALOFLUX 视觉素材按 **PolyForm Noncommercial 1.0.0** 授权，仅非商业使用。
完整许可证与 Required Notice 见 [`LICENSE`](LICENSE)。守夜人主项目的其他部分不因本仓库而改变许可。

## 第三方署名

光环视觉基于 HALOFLUX by Ryder191，原始作品按 PolyForm Noncommercial License 1.0.0 授权。[原始许可及版权声明](https://github.com/Ryder191/haloflux/blob/02174503d0f391b1bb2537b8cad75e8e5f9997f2/LICENSE)

```text
Required Notice: Copyright (c) 2026 Ryder191 (RYDER CODE / Ms MAIKEBAIs CAT) - https://github.com/Ryder191/haloflux
Required Notice: Noncommercial use only. Any commercial use is strictly prohibited. No commercial licenses are offered.
```

## 项目结构

```text
.
├── 双击直接打开-红蓝双球攻防大屏V2.html   # 免安装单文件版（含内嵌字体）
├── index.html · vite.config.ts · tsconfig.json
├── server.ts                              # 本地开发服务器（Express + Vite）
├── src/
│   ├── App.tsx                            # 页面与 canvas 绘制引擎
│   ├── components/                        # 控制台抽屉、桥接导出、双方主机接入弹窗
│   ├── utils/                             # 事件引擎、参数、主题色
│   └── styles/                            # 字体声明、设计令牌、弹窗样式
├── scripts/
│   ├── web_bridge.py                      # 只读 SQLite → SSE 桥接（仅标准库）
│   └── build-singlefile.mjs               # 构建单文件 HTML，并内嵌字体
└── docs/haloflux/                         # V2 / V1 单文件页面
```

## 开发与检查

```bash
npm run lint                                           # tsc --noEmit 类型检查
npx tsx --test src/utils/nightwatchEngine.test.ts      # 引擎单元测试（11 个）
npm run build:single                                   # 重建两个单文件 HTML
```

## 安全与隐私

- 仓库不含任何密钥、令牌或私钥。模型密钥只存在守夜人部署机的 `data/agent.env`，本仓库不读取它。
- 桥接服务默认只监听 `127.0.0.1`，请通过 SSH 端口转发访问；需要额外鉴权时设置 `NW_BRIDGE_TOKEN`。
- 本工具只用于**自有或明确授权**的实验环境，不做反击，不扫描第三方。
- 提交前请确认没有把本机路径、真实内网地址、登录名或密钥写进代码与截图。`.gitignore` 已排除 `.env`、私钥、`data/` 与数据库文件。
