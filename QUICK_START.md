# ⚡ 5分钟快速启动指南

## 🎯 目标
5分钟内让你的问卷系统上线运行！

---

## 📝 准备工作（1分钟）

需要注册两个免费账号：
1. **MongoDB Atlas**（数据库）：https://www.mongodb.com/cloud/atlas/register
2. **Vercel**（托管平台）：https://vercel.com （用GitHub账号登录）

---

## 🚀 三步部署

### 第1步：获取MongoDB连接字符串（2分钟）

```
1. 登录 MongoDB Atlas
2. 创建免费集群（选择新加坡区域）
3. 创建数据库用户（记住密码！）
4. 设置网络访问：0.0.0.0/0
5. 获取连接字符串：
   mongodb+srv://用户名:密码@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 第2步：上传到GitHub（1分钟）

```bash
# 在项目文件夹执行：
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/survey-system.git
git push -u origin main
```

### 第3步：部署到Vercel（2分钟）

```
1. 访问 https://vercel.com
2. 用GitHub登录
3. Import你的仓库
4. 添加环境变量：
   - Name: MONGODB_URI
   - Value: 你的MongoDB连接字符串
5. 点击Deploy
6. 完成！🎉
```

---

## 🎊 访问你的系统

部署成功后，你会得到一个网址：
```
https://your-project.vercel.app
```

### 四个页面：

1. **首页**：`/`
2. **学生问卷**：`/student-survey.html`
3. **教师问卷**：`/teacher-survey.html`
4. **数据管理**：`/admin.html`

---

## 📱 开始使用

1. 分享问卷链接给受访者
2. 在管理后台查看数据和图表
3. 导出Excel分析数据

---

## 🆘 遇到问题？

查看完整部署指南：`DEPLOYMENT_GUIDE.md`

---

## ✅ 系统功能

- ✅ 两份中英文问卷（学生+教师）
- ✅ 智能跳转逻辑
- ✅ 自动数据收集
- ✅ 可视化图表分析
- ✅ Excel/CSV导出
- ✅ 完全免费
- ✅ 国内可访问

**开始使用吧！** 🚀
