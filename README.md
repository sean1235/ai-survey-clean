# 问卷调查系统 Survey System

AI工具（DeepSeek、ChatGPT）使用情况调查问卷系统

## 功能特点 Features

✅ **两份问卷**
- 学生问卷（13题，含跳转逻辑）
- 教师问卷（13题，含跳转逻辑）

✅ **智能跳转**
- 根据答案自动跳转到相应题目
- 流畅的用户体验

✅ **数据管理**
- 实时数据统计
- 数据可视化图表
- 导出Excel/CSV
- 数据筛选和删除

✅ **完全免费**
- Vercel免费托管
- MongoDB Atlas免费数据库
- 国内可访问，不被墙

## 部署步骤 Deployment Steps

### 1. 注册MongoDB Atlas（免费数据库）

1. 访问 https://www.mongodb.com/cloud/atlas/register
2. 注册账号（可用Google账号登录）
3. 创建免费集群（选择离中国最近的区域，如新加坡）
4. 创建数据库用户和密码
5. 设置网络访问：允许所有IP（0.0.0.0/0）
6. 获取连接字符串，格式如：
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/survey_db?retryWrites=true&w=majority
   ```

### 2. 部署到Vercel（免费托管）

#### 方法A：通过GitHub部署（推荐）

1. 将代码上传到GitHub仓库
2. 访问 https://vercel.com
3. 用GitHub账号登录
4. 点击"Import Project"
5. 选择你的GitHub仓库
6. 在环境变量中添加：
   - Key: `MONGODB_URI`
   - Value: 你的MongoDB连接字符串
7. 点击Deploy

#### 方法B：通过Vercel CLI部署

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录Vercel
vercel login

# 部署
vercel

# 添加环境变量
vercel env add MONGODB_URI

# 生产环境部署
vercel --prod
```

### 3. 访问系统

部署成功后，你会获得一个域名，如：
- https://your-project.vercel.app

访问地址：
- 首页：https://your-project.vercel.app
- 学生问卷：https://your-project.vercel.app/student-survey.html
- 教师问卷：https://your-project.vercel.app/teacher-survey.html
- 数据管理：https://your-project.vercel.app/admin.html

## 文件结构 File Structure

```
├── index.html              # 首页
├── student-survey.html     # 学生问卷
├── student-survey.js       # 学生问卷逻辑
├── teacher-survey.html     # 教师问卷
├── teacher-survey.js       # 教师问卷逻辑
├── admin.html             # 数据管理后台
├── admin.js               # 后台逻辑
├── styles.css             # 样式文件
├── api/
│   ├── submit.js          # 提交数据API
│   ├── data.js            # 获取数据API
│   ├── delete.js          # 删除数据API
│   └── clear.js           # 清空数据API
├── package.json           # 依赖配置
├── vercel.json            # Vercel配置
└── README.md              # 说明文档
```

## 跳转逻辑 Jump Logic

### 学生问卷
- Q3选D → Q4（其他选项 → Q5）
- Q4选D → 结束（其他选项 → Q5）
- Q6选D → Q9（其他选项 → Q7）

### 教师问卷
- Q3选D → Q4（其他选项 → Q5）
- Q4选D → 结束（其他选项 → Q5）
- Q6选C → Q8（其他选项 → Q7）

## 数据可视化 Data Visualization

后台管理页面提供：
- 📊 学生中文水平分布（饼图）
- 📊 DeepSeek使用频率对比（柱状图）
- 📊 教师教龄分布（环形图）
- 📊 每日提交趋势（折线图）

## 数据导出 Data Export

支持导出格式：
- Excel (.csv)
- CSV (.csv)

## 技术栈 Tech Stack

- **前端**: HTML5, CSS3, JavaScript (原生)
- **图表**: Chart.js
- **后端**: Vercel Serverless Functions (Node.js)
- **数据库**: MongoDB Atlas
- **部署**: Vercel

## 注意事项 Notes

1. **数据安全**：建议为admin.html添加密码保护
2. **数据备份**：定期导出数据备份
3. **免费额度**：
   - Vercel: 每月100GB带宽
   - MongoDB Atlas: 512MB存储空间
4. **国内访问**：Vercel在国内访问速度较快，无需翻墙

## 自定义域名 Custom Domain

在Vercel项目设置中可以添加自定义域名：
1. 进入项目设置
2. 点击"Domains"
3. 添加你的域名
4. 按提示配置DNS

## 支持 Support

如有问题，请查看：
- Vercel文档: https://vercel.com/docs
- MongoDB文档: https://docs.mongodb.com/

## 许可 License

MIT License
