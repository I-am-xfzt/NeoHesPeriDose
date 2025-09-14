# NeoHesPeriDose

![Vue3](https://img.shields.io/badge/Vue3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Koa](https://img.shields.io/badge/Koa-33333D?style=flat-square&logo=koa&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFC226?style=flat-square&logo=pinia&logoColor=white)
## 系统部分截图
<img src="https://img.cdn1.vip/i/68c53026734be_1757753382.webp" width="512" height="254" />
<img src="https://img.cdn1.vip/i/68c5304e6b9e6_1757753422.webp" width="512" height="254" />
<img src="https://img.cdn1.vip/i/68c53053b75f2_1757753427.webp" width="512" height="288" />

## 📖 项目介绍

NeoHesPeriDose 是一个现代化的前后端分离 Web 应用项目，专为作者集成工具库设计。项目采用 Vue3 + TypeScript 前端技术栈，配合 Koa.js 后端服务，引入了智谱AI聊天服务。

### ✨ 核心特性

- 🗂️ **文件浏览服务**: 提供安全的静态文件访问和 JSON 数据处理
- 📊 **数据可视化**: 集成 ECharts 图表展示，支持多种数据图表
- 🔐 **权限管理**: 基于菜单和按钮级别的精细化权限控制
- 🌍 **多语言支持**: 国际化支持，满足不同地区用户需求
- 📱 **响应式设计**: 适配各种设备屏幕，提供最佳用户体验
- 🎨 **动态特效**: 现代化 UI 设计，包含流动边框、发光效果等动态交互
- 🚀 **高性能**: 使用 Vite 构建工具，提供极速的开发和构建体验
- 🔄 **状态管理**: 基于 Pinia 的现代化状态管理解决方案

### 🎯 主要功能

#### 文件浏览服务 (koa-file-explorer)
- 静态文件访问和下载
- JSON 数据的 CRUD 操作
- 支持 3D 模型文件(.gltf, .glb, .splat)访问
- 纹理文件(.png, .jpg, .bin)服务
- 无需 token 的安全文件访问接口
- 支持子目录文件访问
- URL 编码文件名处理

#### 前端界面 (web-ui)
- 用户登录和认证
- 权限控制和菜单管理
- 数据统计和图表展示
- 文件上传和管理
- 响应式布局和主题切换
- 3D 模型预览和渲染

## 🏗️ 技术架构

### 前端技术栈
- **框架**: Vue 3 + Composition API
- **构建工具**: Vite 3+
- **语言**: TypeScript
- **状态管理**: Pinia
- **HTTP 客户端**: Axios
- **图表库**: ECharts
- **样式**: Sass/SCSS
- **路由**: Vue Router 4
- **事件总线**: mitt

### 后端技术栈
- **框架**: Koa.js
- **运行时**: Node.js >= 14.x
- **数据存储**: JSON 文件 (可扩展至数据库)

### 架构特点
- 前后端分离架构
- 模块化设计模式
- RESTful API 设计
- 组件化开发
- 响应式状态管理

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 14.x
- **npm**: >= 9.8.1  
- **pnpm**: >= 10.11.0 (用于前端依赖管理)
- **Git**: 用于代码版本控制

### 安装步骤

```bash
# 1. 克隆项目
git clone https://gitee.com/xfhhh/neohes-peridose.git
cd neohes-peridose

# 2. 安装依赖
# 后端依赖
cd koa-file-explorer
npm install

# 前端依赖 
cd ../web-ui
pnpm install

# 或者使用项目根目录的快捷命令
npm run i:all
```

### 启动开发环境

```bash
# 方法一：使用项目根目录的快捷命令
npm run dev

# 方法二：分别启动前后端
# 启动后端服务 (端口: 4000)
cd koa-file-explorer
npm run start

# 启动前端服务 (端口: 8848)
cd web-ui
pnpm dev
```

### 构建生产环境

```bash
# 构建前端项目
cd web-ui
pnpm build

# 构建产物位于 web-ui/dist 目录
```

## 📖 使用指南

### 系统登录

- **访问地址**: http://localhost:8848
- **默认账号**: admin
- **默认密码**: 123456

### API 接口

#### 认证接口
```bash
# 用户登录
POST /api/login-module/login
# Body: { "username": "admin", "password": "123456" }

# 用户登出
POST /api/login-module/logout
# Headers: Authorization: Bearer <token>
```

#### 文件服务接口
```bash
# 获取目录内容 (需要token)
GET /api/files?path=<directory_path>
# Headers: Authorization: Bearer <token>

# 获取3D模型文件 (无需token)
GET /api/models/:category/:filepath
# 示例: /api/models/THREE/scene.gltf
# 支持的分类: BabyLon, THREE
# 支持的格式: .gltf, .glb, .splat, .png, .jpg, .jpeg, .bin

# JSON文件操作 (需要token)
POST /api/json/:operation?path=<file_path>
# Headers: Authorization: Bearer <token>
# Operations: add, update, delete, replace
# 尚未验证
```

### 文件组织结构

```
koa-file-explorer/GLBS/
├── json/                 # JSON数据文件
│   ├── dict/            # 字典数据
│   ├── account.json     # 账户信息
│   ├── authMenuList.json # 菜单权限
│   └── ...              # 其他业务数据
└── models/              # 3D模型文件
    ├── BabyLon/         # BabyLon.js 模型
    └── THREE/           # Three.js 模型
        ├── *.gltf       # glTF JSON格式
        ├── *.glb        # glTF二进制格式
        ├── *.bin        # 二进制数据
        ├── *.png        # 纹理贴图
        └── ...          # 其他资源文件
```

### 功能特性详解

#### 🔐 权限系统
- 基于 JWT Token 的身份认证
- 菜单级权限控制
- 按钮级权限控制
- 动态路由生成

#### 🎨 UI/UX 特性
- 现代化的登录界面，支持动态特效
- 流动边框、发光效果、3D浮起等交互动画
- 输入框与按钮统一设计规范(320px宽度，小屏280px)
- 暗色主题支持
- 移动端适配（尚未全部实现）

#### 📊 数据可视化
- ECharts 图表集成
- 响应式图表设计
- 多种图表类型支持
- 数据实时更新

#### 🗂️ 文件管理
- 安全的文件访问机制
- 支持大文件流式传输
- URL编码文件名处理
- 路径遍历攻击防护
- 文件类型白名单过滤

## 🔧 开发指南

### 代码规范

- **前端**: 使用 TypeScript + Vue3 Composition API
- **样式**: SCSS 模块化样式，优先使用公共样式类
- **状态管理**: Pinia 响应式状态管理
- **注释**: JSDoc 文档注释规范
- **类型检查**: 严格的 TypeScript 类型检查

### 项目结构

```
neohes-peridose/
├── koa-file-explorer/          # 后端服务
│   ├── GLBS/                  # 数据文件目录
│   ├── handleJson.js          # 主服务器文件
│   ├── handleAI.js            # AI服务处理
│   └── package.json           # 后端依赖
├── web-ui/                    # 前端项目
│   ├── src/
│   │   ├── api/              # API接口层
│   │   ├── components/       # 公共组件
│   │   ├── views/            # 页面组件
│   │   │   ├── home/         # 🏠 首页模块
│   │   │   │   └── index.vue # 系统首页
│   │   │   ├── login/        # 🔐 登录模块
│   │   │   │   ├── index.vue      # 登录页面容器
│   │   │   │   ├── loginForm.vue  # 登录表单组件
│   │   │   │   └── components/    # 登录相关组件
│   │   │   ├── system/       # ⚙️ 系统管理模块
│   │   │   │   ├── accountManage/    # 账号管理
│   │   │   │   ├── roleManage/       # 角色管理
│   │   │   │   ├── menuMange/        # 菜单管理
│   │   │   │   ├── departmentManage/ # 部门管理
│   │   │   │   ├── dictManage/       # 字典管理
│   │   │   │   ├── timingTask/       # 定时任务
│   │   │   │   └── systemLog/        # 系统日志
│   │   │   ├── auth/         # 🔑 权限管理模块
│   │   │   │   ├── menu/     # 菜单权限管理
│   │   │   │   └── button/   # 按钮权限管理
│   │   │   ├── windElectricity/ # 🌪️ 智能风电模块
│   │   │   │   ├── valley/            # 风电峡谷 (Three.js)
│   │   │   │   ├── OperationAndMaintenance/ # 风电运维
│   │   │   │   ├── Device/            # 风电设备
│   │   │   │   └── components/        # 风电公共组件
│   │   │   ├── babylon-example/ # 🚗 智能停车/汽车大屏
│   │   │   │   ├── index.vue     # 汽车大屏主页 (BabyLon.js)
│   │   │   │   ├── utils/        # 停车相关工具
│   │   │   │   └── components/   # 停车场组件
│   │   │   ├── assembly/     # 🧩 功能组件模块
│   │   │   │   ├── chatAI/           # 🤖 AI聊天组件
│   │   │   │   ├── guide/            # 📖 引导页
│   │   │   │   ├── qrcode/           # 📱 二维码生成
│   │   │   │   ├── scss-particle/   # ✨ Sass粒子效果
│   │   │   │   ├── print/            # 🖨️ 页面打印
│   │   │   │   ├── cropperImage/     # ✂️ 图片裁剪
│   │   │   │   ├── compressImage/    # 📦 图片压缩
│   │   │   │   ├── svgIcon/          # 🎨 SVG图标
│   │   │   │   ├── uploadFile/       # 📤 文件上传
│   │   │   │   ├── lazyImage/        # 🖼️ 图片懒加载
│   │   │   │   ├── wangEditor/       # 📝 富文本编辑器
│   │   │   │   ├── draggable/        # 🔄 拖拽组件
│   │   │   │   ├── workflow/         # 📊 流程图
│   │   │   │   ├── coordinateTransition/ # 🌍 坐标转换
│   │   │   │   └── casual-game/      # 🎮 休闲游戏
│   │   │   ├── amap-example/ # 🗺️ 高德地图示例
│   │   │   │   └── render/ # 高德地图渲染
│   │   │   ├── smartCampus/  # 🏫 智慧校园 (扩展模块)
│   │   │   ├── demos/        # 🧪 演示页面
│   │   │   ├── example/      # 📚 示例页面
│   │   │   └── manage/       # 📋 管理页面
│   │   ├── stores/           # Pinia状态管理
│   │   ├── router/           # 路由配置
│   │   ├── styles/           # 全局样式
│   │   └── utils/            # 工具函数
│   ├── public/               # 静态资源
│   └── package.json          # 前端依赖
├── README.md                  # 项目文档
└── package.json              # 根项目配置
```

### 页面模块详细说明

#### 🏠 **核心模块**
- **首页 (home)**: 系统仪表盘，数据统计概览
- **登录 (login)**: 用户认证，支持动态特效的现代化登录界面

#### ⚙️ **系统管理模块**
基于 RBAC 权限模型的完整后台管理系统：
- **账号管理**: 用户账户的增删改查
- **角色管理**: 角色权限分配和管理
- **菜单管理**: 动态菜单配置
- **部门管理**: 组织架构管理
- **字典管理**: 系统数据字典维护
- **定时任务**: 后台任务调度
- **系统日志**: 操作日志审计

#### 🔑 **权限管理模块**
- **菜单权限**: 细粒度的菜单访问控制
- **按钮权限**: 页面内按钮级别的权限控制

#### 🌪️ **智能风电模块 (Three.js)**
基于 Three.js 的 3D 可视化风电管理系统：
- **风电峡谷**: 3D 风电场景展示
- **风电运维**: 设备运维监控
- **风电设备**: 设备状态管理

#### 🚗 **智能停车/汽车大屏 (BabyLon.js)**
基于 BabyLon.js 的 3D 汽车和停车场可视化：
- **汽车大屏**: 全屏 3D 汽车展示
- **停车场管理**: 智能停车位监控

#### 🧩 **功能组件模块**
丰富的功能组件库，展示各种前端技术实现：
- **AI聊天**: 集成 AI 对话功能
- **引导页**: 用户操作引导
- **二维码生成**: 动态二维码创建
- **Sass粒子**: CSS3 粒子动画效果
- **页面打印**: 网页内容打印功能
- **图片裁剪**: 在线图片编辑
- **图片压缩**: 客户端图片压缩
- **SVG图标**: 矢量图标管理
- **文件上传**: 多种文件上传方式
- **图片懒加载**: 性能优化的图片加载
- **富文本编辑器**: 所见即所得编辑器
- **拖拽组件**: 拖拽排序功能
- **流程图**: 可视化工作流程
- **坐标转换**: 地理坐标系统转换
- **休闲游戏**: 娱乐小游戏

#### 🗺️ **高德地图模块**
- **地图集成**: 高德地图 API 集成示例
- **位置服务**: 定位和地图标注功能

### 添加新功能

1. **后端API**: 在 `koa-file-explorer/handleJson.js` 中添加新的路由
2. **前端页面**: 在 `web-ui/src/views/` 中创建新的页面组件
3. **状态管理**: 在 `web-ui/src/stores/` 中添加相应的状态模块
4. **路由配置**: 在 `web-ui/src/router/` 中配置新的路由

## 🤝 参与贡献

欢迎参与 NeoHesPeriDose 项目的开发！请遵循以下步骤：

1. **Fork 本仓库**: 点击页面右上角的 Fork 按钮
2. **克隆仓库**: `git clone https://github.com/your-username/neohes-peridose.git`
3. **创建分支**: `git checkout -b feature/your-feature-name`
4. **提交修改**: `git commit -m "Add: your feature description"`
5. **推送分支**: `git push origin feature/your-feature-name`
6. **提交 PR**: 在 GitHub 上创建 Pull Request

### 提交信息规范

- `Add: 新增功能`
- `Fix: 修复问题`
- `Update: 更新功能`
- `Docs: 文档更新`
- `Style: 样式调整`
- `Refactor: 代码重构`

## 🛠️ 常见问题

### Q: 服务启动失败？
**A**: 请检查：
- Node.js 版本是否符合要求 (>= 14.x)
- 端口 4000 和 5173 是否被占用
- 依赖是否正确安装

### Q: 前端打包失败？
**A**: 请检查：
- pnpm 版本是否最新
- 清理 node_modules：`rm -rf node_modules && pnpm install`
- TypeScript 类型错误是否修复

### Q: 3D模型无法加载？
**A**: 请确认：
- 文件路径是否正确
- 文件格式是否支持 (.gltf, .glb, .splat)
- 服务器是否正常运行

### Q: 登录失败？
**A**: 默认账号密码：
- 用户名：`admin`
- 密码：`123456`

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✨ 初始版本发布
- ✨ 完成前后端基础架构
- ✨ 实现用户登录和权限管理
- ✨ 支持 3D 模型文件访问
- ✨ 集成 ECharts 数据可视化
- ✨ 响应式 UI 设计
- ✨ 动态交互特效

## 📎 路线规划

- [ ] 数据库集成 (MySQL/PostgreSQL/MongoDB)
- [ ] 用户管理系统
- [ ] 文件上传功能增强
- [ ] 实时通信 (WebSocket)
- [ ] 数据导入导出
- [ ] API 文档生成
- [ ] Docker 容器化部署
- [ ] 单元测试覆盖
- [ ] 性能监控和优化
- [ ] 国际化支持增强

## 📚 相关资源

### 技术文档
- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 构建工具](https://vitejs.dev/)
- [Pinia 状态管理](https://pinia.vuejs.org/)
- [Koa.js 框架](https://koajs.com/)
- [ECharts 图表库](https://echarts.apache.org/)
- [TypeScript 语言](https://www.typescriptlang.org/)

### 开发工具
- [VSCode](https://code.visualstudio.com/) - 推荐的代码编辑器
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 语言服务
- [TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter) - TS 导入助手

## 🔗 链接

- **项目主页**: [GitHub Repository](https://github.com/neohes/neohes-peridose)
- **问题反馈**: [Issues](https://github.com/neohes/neohes-peridose/issues)
- **讨论区**: [Discussions](https://github.com/neohes/neohes-peridose/discussions)

## 📜 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🚀 支持项目

如果您觉得这个项目对您有帮助，请考虑：

- ⭐ 给项目点个 Star
- 🐛 反馈 Bug 或提出建议
- 📝 完善文档
- 💻 参与代码贡献

---

<div align="center">

**由 ❤️ 和 Vue3 + Koa.js 构建**

[⬆ 返回顶部](#neoheperidose)

</div>
