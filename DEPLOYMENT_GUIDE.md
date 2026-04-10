# 🚀 完整部署指南 Complete Deployment Guide

## 📋 系统概述

这是一个完整的问卷调查系统，包含：
- ✅ 两份中英文对照问卷（学生版 + 教师版）
- ✅ 智能跳转逻辑
- ✅ 数据自动收集
- ✅ 可视化数据分析后台
- ✅ 数据导出功能（Excel/CSV）
- ✅ 完全免费，国内可访问

---

## 🎯 第一步：准备MongoDB数据库（5分钟）

### 1.1 注册MongoDB Atlas

1. 打开浏览器，访问：https://www.mongodb.com/cloud/atlas/register
2. 点击"Sign Up"注册（可以用Google账号快速登录）
3. 选择免费套餐"Shared"（永久免费）

### 1.2 创建集群

1. 选择云服务商：**AWS** 或 **Google Cloud**
2. 选择区域：**Singapore (ap-southeast-1)** （离中国最近，速度快）
3. 集群名称：保持默认或改为 `survey-cluster`
4. 点击"Create Cluster"（需要等待3-5分钟）

### 1.3 创建数据库用户

1. 左侧菜单点击"Database Access"
2. 点击"Add New Database User"
3. 选择"Password"认证方式
4. 用户名：`surveyuser`（可自定义）
5. 密码：点击"Autogenerate Secure Password"生成密码
6. **重要：复制并保存这个密码！**
7. 权限选择："Atlas admin"
8. 点击"Add User"

### 1.4 设置网络访问

1. 左侧菜单点击"Network Access"
2. 点击"Add IP Address"
3. 点击"Allow Access from Anywhere"（会自动填入 0.0.0.0/0）
4. 点击"Confirm"

### 1.5 获取连接字符串

1. 左侧菜单点击"Database"
2. 点击你的集群的"Connect"按钮
3. 选择"Connect your application"
4. 复制连接字符串，格式类似：
   ```
   mongodb+srv://surveyuser:<password>@survey-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **重要：将 `<password>` 替换为你刚才保存的密码**
6. 保存这个完整的连接字符串，后面会用到

---

## 🚀 第二步：部署到Vercel（5分钟）

### 方案A：通过GitHub部署（推荐，最简单）

#### 2A.1 上传代码到GitHub

1. 访问 https://github.com
2. 登录你的GitHub账号（没有就注册一个）
3. 点击右上角"+"，选择"New repository"
4. 仓库名称：`survey-system`
5. 选择"Public"（公开）
6. 点击"Create repository"
7. 按照页面提示，将本地代码上传：

```bash
# 在你的项目文件夹中打开终端，执行：
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/survey-system.git
git push -u origin main
```

#### 2A.2 部署到Vercel

1. 访问 https://vercel.com
2. 点击"Sign Up"，选择"Continue with GitHub"（用GitHub账号登录）
3. 授权Vercel访问你的GitHub
4. 点击"Import Project"
5. 找到并选择你刚创建的`survey-system`仓库
6. 点击"Import"
7. **重要：配置环境变量**
   - 点击"Environment Variables"
   - Name: `MONGODB_URI`
   - Value: 粘贴你的MongoDB连接字符串
   - 点击"Add"
8. 点击"Deploy"
9. 等待1-2分钟，部署完成！

#### 2A.3 获取访问地址

部署成功后，你会看到：
- 🎉 Congratulations!
- 你的网站地址：`https://survey-system-xxxx.vercel.app`

点击"Visit"即可访问你的问卷系统！

---

### 方案B：通过Vercel CLI部署（适合技术用户）

#### 2B.1 安装Node.js

如果还没安装Node.js：
1. 访问 https://nodejs.org
2. 下载并安装LTS版本

#### 2B.2 安装Vercel CLI

打开终端，执行：
```bash
npm install -g vercel
```

#### 2B.3 登录Vercel

```bash
vercel login
```
按提示完成登录

#### 2B.4 部署项目

在项目文件夹中执行：
```bash
# 首次部署
vercel

# 按提示操作：
# - Set up and deploy? Y
# - Which scope? 选择你的账号
# - Link to existing project? N
# - What's your project's name? survey-system
# - In which directory is your code located? ./
```

#### 2B.5 添加环境变量

```bash
vercel env add MONGODB_URI
```
粘贴你的MongoDB连接字符串，按回车

#### 2B.6 生产环境部署

```bash
vercel --prod
```

部署完成后会显示你的网站地址！

---

## 📱 第三步：访问和使用

### 3.1 访问地址

假设你的域名是 `https://survey-system-xxxx.vercel.app`

- **首页**：https://survey-system-xxxx.vercel.app
- **学生问卷**：https://survey-system-xxxx.vercel.app/student-survey.html
- **教师问卷**：https://survey-system-xxxx.vercel.app/teacher-survey.html
- **数据管理后台**：https://survey-system-xxxx.vercel.app/admin.html

### 3.2 分享问卷

将学生问卷和教师问卷的链接分享给受访者即可！

### 3.3 查看数据

访问数据管理后台，可以：
- 📊 查看实时统计
- 📈 查看可视化图表
- 📥 导出Excel/CSV
- 🗑️ 管理数据

---

## 🔒 第四步：保护管理后台（可选但推荐）

为了防止他人访问你的数据后台，建议添加密码保护：

### 方法1：简单密码保护

在 `admin.html` 的 `<script>` 标签开头添加：

```javascript
// 在 admin.html 的 <script src="admin.js"></script> 之前添加
<script>
const password = prompt('请输入管理密码 / Enter admin password:');
if (password !== '你的密码') {
    alert('密码错误 / Wrong password');
    window.location.href = 'index.html';
}
</script>
```

### 方法2：使用Vercel密码保护（推荐）

1. 在Vercel项目设置中
2. 找到"Password Protection"
3. 启用并设置密码
4. 只有输入正确密码才能访问整个网站

---

## 🎨 第五步：自定义域名（可选）

### 5.1 购买域名

在阿里云、腾讯云等平台购买域名（约50元/年）

### 5.2 在Vercel添加域名

1. 进入Vercel项目设置
2. 点击"Domains"
3. 输入你的域名，如：`survey.yourdomain.com`
4. 按提示配置DNS记录
5. 等待DNS生效（通常5-30分钟）

---

## 📊 数据说明

### 数据存储位置

- **主存储**：MongoDB Atlas云数据库
- **备份存储**：浏览器LocalStorage（如果API失败）

### 数据导出

在管理后台可以导出：
- **Excel格式**：适合用Excel打开分析
- **CSV格式**：适合导入SPSS等统计软件

### 数据安全

- MongoDB数据加密传输
- Vercel HTTPS加密
- 建议定期导出备份

---

## 🆓 免费额度说明

### Vercel免费套餐

- ✅ 无限网站
- ✅ 100GB带宽/月
- ✅ 无限请求
- ✅ 自动HTTPS
- ✅ 全球CDN加速

**足够支持：**
- 每月10,000+次问卷提交
- 每月100,000+次页面访问

### MongoDB Atlas免费套餐

- ✅ 512MB存储空间
- ✅ 无限连接
- ✅ 自动备份

**足够存储：**
- 约50,000份问卷数据

---

## ❓ 常见问题

### Q1: 部署后访问显示404？

**A:** 等待1-2分钟，Vercel需要时间部署。刷新页面试试。

### Q2: 提交问卷后数据没有保存？

**A:** 检查：
1. MongoDB连接字符串是否正确
2. 密码是否替换了`<password>`
3. 网络访问是否设置为0.0.0.0/0

### Q3: 管理后台看不到数据？

**A:** 
1. 打开浏览器开发者工具（F12）
2. 查看Console是否有错误
3. 检查Network标签，API请求是否成功

### Q4: 国内访问速度慢？

**A:** 
1. MongoDB选择新加坡区域
2. Vercel自动使用全球CDN，国内访问速度已经很快
3. 如果还是慢，可以考虑使用国内的云服务（但需要备案）

### Q5: 如何修改问卷内容？

**A:** 
1. 修改对应的HTML文件（student-survey.html 或 teacher-survey.html）
2. 重新部署到Vercel（GitHub方式会自动部署）

### Q6: 如何添加更多问题？

**A:** 
1. 在HTML中添加新的问题块
2. 在对应的JS文件中更新跳转逻辑
3. 更新totalQuestions变量

---

## 🛠️ 技术支持

### 官方文档

- Vercel文档：https://vercel.com/docs
- MongoDB文档：https://docs.mongodb.com/
- Chart.js文档：https://www.chartjs.org/docs/

### 检查部署状态

1. Vercel Dashboard：https://vercel.com/dashboard
2. MongoDB Atlas：https://cloud.mongodb.com

---

## 🎉 完成！

恭喜你！现在你拥有了一个：
- ✅ 完全免费的问卷系统
- ✅ 自动收集和存储数据
- ✅ 可视化数据分析
- ✅ 国内可访问，不被墙
- ✅ 永久使用，无需续费

开始分享你的问卷链接吧！📝
