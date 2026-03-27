# Moodify - 心情调解社交 App

🎉 线上Demo: https://aiweisoft.github.io/Moodify/

一款帮助你记录情绪、倾诉心声的社交应用

## 功能特性

- 📝 **情绪日记** - 每日心情记录，5种情绪可选，配上文字说明
- 📊 **7天趋势** - 可视化展示最近7天的情绪变化
- 💬 **匿名社区** - 匿名分享心情，获得他人支持与共鸣
- 💾 **数据持久化** - 本地保存你的心情记录

## 情绪标签

| 表情 | 标签 |
|------|------|
| 😢 | 难过 |
| 😔 | 低落 |
| 😐 | 一般 |
| 🙂 | 愉快 |
| 😄 | 开心 |

## 技术栈

- React Native + Expo
- TypeScript
- React Navigation
- AsyncStorage

## 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npx expo start

# 运行 Web 版本
npx expo start --web

# 运行 Android
npx expo start --android

# 运行 iOS (需要 macOS)
npx expo start --ios
```

## 项目结构

```
├── App.tsx                 # 主应用入口
├── src/
│   ├── constants.ts        # 常量定义
│   ├── context/
│   │   └── AppContext.tsx # 状态管理
│   └── screens/
│       ├── HomeScreen.tsx  # 首页
│       ├── DiaryScreen.tsx # 日记页
│       └── CommunityScreen.tsx # 社区页
└── package.json
```

## 截图

- 首页展示今日心情和7天趋势
- 日记页支持选择情绪并记录文字
- 社区页可匿名发布帖子并获赞

## License

MIT
