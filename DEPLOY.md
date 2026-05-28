# TaoInsight - Medusa 后端部署指南

## 快速启动（本地开发）

### 1. 启动 Medusa 后端

```bash
cd medusa-backend

# 安装依赖
npm install

# 设置环境变量
cp .env.template .env
# 编辑 .env 填入你的配置

# 启动数据库（需要PostgreSQL）
# macOS: brew services start postgresql
# Ubuntu: sudo service postgresql start

# 创建数据库
createdb medusa_tao

# 运行迁移
npm run db:migrate

# 导入种子数据
npm run seed

# 启动开发服务器
npm run dev
```

后端将在 `http://localhost:9000` 运行

### 2. 启动 Next.js 前端

```bash
cd ..

# 安装依赖
npm install

# 设置环境变量
echo "NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000" > .env.local

# 启动开发服务器
npm run dev
```

前端将在 `http://localhost:3000` 运行

---

## 生产部署

### 方案A: Railway（推荐，最简单）

1. 注册 [Railway.app](https://railway.app)
2. 连接 GitHub 仓库
3. 添加 PostgreSQL 和 Redis 插件
4. 设置环境变量
5. 自动部署

### 方案B: Render

1. 注册 [Render.com](https://render.com)
2. 创建 PostgreSQL 数据库
3. 创建 Web Service，选择 Node.js
4. 设置环境变量
5. 部署

### 方案C: DigitalOcean + Docker

```bash
# 使用 Docker Compose 一键部署
docker-compose up -d
```

---

## 环境变量说明

| 变量 | 说明 | 示例 |
|------|------|------|
| DATABASE_URL | PostgreSQL 连接字符串 | postgres://user:pass@localhost:5432/medusa_tao |
| REDIS_URL | Redis 连接字符串 | redis://localhost:6379 |
| STORE_CORS | 允许的前端域名 | http://localhost:3000 |
| STRIPE_API_KEY | Stripe 支付密钥 | sk_test_... |
| JWT_SECRET | JWT 签名密钥 | 随机字符串 |
| COOKIE_SECRET | Cookie 签名密钥 | 随机字符串 |

---

## 目录结构

```
tao-insight/
├── app/                    # Next.js 前端
│   ├── page.tsx            # 主页
│   ├── shop/page.tsx       # 商城页
│   ├── divination/page.tsx # 算卦页
│   └── lib/medusa.ts       # Medusa API hooks
├── medusa-backend/         # Medusa 后端
│   ├── medusa-config.js    # 后端配置
│   ├── data/seed.json      # 产品种子数据
│   └── package.json
└── README.md
```

---

## API 端点

启动后可通过以下端点访问：

- `GET /store/products` - 产品列表
- `GET /store/products/:id` - 产品详情
- `GET /store/collections` - 分类列表
- `POST /store/carts` - 创建购物车
- `POST /store/carts/:id/line-items` - 添加商品
- `POST /store/carts/:id/payment-sessions` - 创建支付

完整 API 文档：`http://localhost:9000/store/api`

---

## 下一步

1. [ ] 替换产品图片为真实照片
2. [ ] 配置 Stripe 支付
3. [ ] 设置邮件通知（SendGrid/Resend）
4. [ ] 添加运费计算
5. [ ] 配置库存管理
6. [ ] 设置管理员后台
