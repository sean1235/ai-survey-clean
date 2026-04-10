# ✅ 部署检查清单 Deployment Checklist

使用这个清单确保部署顺利完成！

---

## 📋 部署前准备

### 账号注册
- [ ] 注册MongoDB Atlas账号 (https://www.mongodb.com/cloud/atlas/register)
- [ ] 注册GitHub账号 (https://github.com)
- [ ] 注册Vercel账号 (https://vercel.com - 用GitHub登录)

### 本地准备
- [ ] 确认所有文件都在项目文件夹中
- [ ] 安装Git (https://git-scm.com)
- [ ] 安装Node.js (可选，用于本地测试)

---

## 🗄️ MongoDB配置

### 创建集群
- [ ] 登录MongoDB Atlas
- [ ] 创建新集群（选择免费套餐Shared）
- [ ] 选择区域：Singapore (ap-southeast-1)
- [ ] 等待集群创建完成（3-5分钟）

### 配置访问
- [ ] 创建数据库用户
  - [ ] 用户名：surveyuser（或自定义）
  - [ ] 密码：自动生成并保存
  - [ ] 权限：Atlas admin
- [ ] 设置网络访问
  - [ ] 添加IP地址：0.0.0.0/0（允许所有）
  - [ ] 确认保存

### 获取连接字符串
- [ ] 点击集群的"Connect"按钮
- [ ] 选择"Connect your application"
- [ ] 复制连接字符串
- [ ] 替换`<password>`为实际密码
- [ ] 保存完整连接字符串

**示例格式：**
```
mongodb+srv://surveyuser:你的密码@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 📤 GitHub上传

### 初始化仓库
- [ ] 打开终端/命令行
- [ ] 进入项目文件夹
- [ ] 执行以下命令：

```bash
git init
git add .
git commit -m "Initial commit: Survey system"
```

### 创建GitHub仓库
- [ ] 访问 https://github.com/new
- [ ] 仓库名称：survey-system
- [ ] 选择Public（公开）
- [ ] 不要勾选任何初始化选项
- [ ] 点击"Create repository"

### 推送代码
- [ ] 复制GitHub提供的命令
- [ ] 在终端执行：

```bash
git remote add origin https://github.com/你的用户名/survey-system.git
git branch -M main
git push -u origin main
```

- [ ] 刷新GitHub页面，确认代码已上传

---

## 🚀 Vercel部署

### 导入项目
- [ ] 访问 https://vercel.com
- [ ] 用GitHub账号登录
- [ ] 点击"Add New..." → "Project"
- [ ] 找到survey-system仓库
- [ ] 点击"Import"

### 配置环境变量
- [ ] 在配置页面找到"Environment Variables"
- [ ] 添加变量：
  - Name: `MONGODB_URI`
  - Value: 粘贴你的MongoDB连接字符串
- [ ] 点击"Add"
- [ ] 确认变量已添加

### 开始部署
- [ ] 点击"Deploy"按钮
- [ ] 等待部署完成（1-2分钟）
- [ ] 看到"Congratulations!"表示成功

### 获取访问地址
- [ ] 复制Vercel提供的域名
- [ ] 格式：https://survey-system-xxxx.vercel.app
- [ ] 保存这个地址

---

## 🧪 功能测试

### 测试首页
- [ ] 访问首页：https://你的域名.vercel.app
- [ ] 确认页面正常显示
- [ ] 确认两个问卷卡片可以点击

### 测试学生问卷
- [ ] 访问学生问卷页面
- [ ] 填写第1题，点击"下一题"
- [ ] 填写第2题，点击"下一题"
- [ ] 填写第3题：
  - [ ] 选择D，确认跳转到第4题
  - [ ] 返回，选择A/B/C，确认跳转到第5题
- [ ] 完成所有题目
- [ ] 点击"提交"
- [ ] 确认显示感谢页面

### 测试教师问卷
- [ ] 访问教师问卷页面
- [ ] 测试跳转逻辑（同学生问卷）
- [ ] 完成并提交
- [ ] 确认显示感谢页面

### 测试数据管理后台
- [ ] 访问管理后台：https://你的域名.vercel.app/admin.html
- [ ] 确认统计数字正确显示
- [ ] 确认图表正常显示
- [ ] 确认数据列表显示提交的问卷
- [ ] 测试筛选功能
- [ ] 测试导出Excel功能
- [ ] 测试查看详情功能

---

## 🔒 安全配置（推荐）

### 添加管理后台密码保护
- [ ] 选择保护方式：
  - 方法1：在admin.html添加简单密码
  - 方法2：使用Vercel密码保护功能
- [ ] 实施密码保护
- [ ] 测试密码保护是否生效

### 数据备份
- [ ] 导出一份初始数据作为测试
- [ ] 确认导出的Excel可以正常打开
- [ ] 设置定期备份提醒

---

## 📱 分享和使用

### 准备分享链接
- [ ] 学生问卷链接：https://你的域名.vercel.app/student-survey.html
- [ ] 教师问卷链接：https://你的域名.vercel.app/teacher-survey.html
- [ ] 测试链接在手机上是否正常打开
- [ ] 测试链接在不同浏览器是否正常

### 开始收集数据
- [ ] 分享问卷链接给受访者
- [ ] 定期查看管理后台
- [ ] 定期导出数据备份

---

## 🎯 可选优化

### 自定义域名
- [ ] 购买域名（可选）
- [ ] 在Vercel添加自定义域名
- [ ] 配置DNS记录
- [ ] 等待DNS生效

### 性能监控
- [ ] 在Vercel Dashboard查看访问统计
- [ ] 在MongoDB Atlas查看数据库使用情况
- [ ] 确认在免费额度范围内

### 问卷优化
- [ ] 根据实际需求调整问题
- [ ] 优化跳转逻辑
- [ ] 调整样式和颜色

---

## ✅ 最终确认

- [ ] 所有功能测试通过
- [ ] 数据正常保存到MongoDB
- [ ] 管理后台可以查看数据
- [ ] 可以正常导出数据
- [ ] 已添加密码保护
- [ ] 已设置数据备份计划
- [ ] 问卷链接已分享

---

## 🎉 部署完成！

恭喜！你的问卷系统已经成功上线！

**记得保存：**
- ✅ MongoDB连接字符串
- ✅ Vercel项目地址
- ✅ 管理后台密码
- ✅ 问卷分享链接

**下一步：**
1. 开始收集数据
2. 定期查看统计
3. 定期导出备份

**需要帮助？**
查看 DEPLOYMENT_GUIDE.md 的常见问题部分

---

祝使用顺利！🚀
