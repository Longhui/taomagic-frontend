# 前端部署到 VPS 标准流程

> 适用场景：将 Next.js 前端部署到全新 VPS（Debian 12），不依赖 Docker，直接运行。

---

## 1. 前提条件

- 一台 **Debian 12** VPS（本文以 Dedione KC-Special 为例，2核/2GB/40GB）
- 已购买域名并托管到 **Cloudflare**（橙色云代理）
- Medusa 后端已部署在另一台服务器上，有可访问的 URL

---

## 2. 初始环境安装

```bash
# 1. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get update
apt-get install -y nodejs nginx git

# 2. 安装 PM2 进程管理器
npm install -g pm2

# 3. 验证安装
node -v        # v20.x
npm -v         # 10.x
nginx -v       # 1.22+
```

---

## 3. 拉取代码

```bash
# 克隆仓库
cd /root
git clone https://github.com/Longhui/taomagic-frontend.git
cd taomagic-frontend
```

---

## 4. 配置环境变量

> **注意**：`NEXT_PUBLIC_*` 变量在构建时编译进 JS，修改后必须重新构建。

```bash
cat > .env << 'EOF'
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://medusa.example.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxx
AI_API_URL=https://api.deepseek.com/v1/chat/completions
AI_MODEL_NAME=deepseek-v4-flash
AI_API_KEY=sk-xxxxxxxxxxxx
EOF
```

### 环境变量清单

| 变量 | 是否 NEXT_PUBLIC | 说明 |
|------|:----------------:|------|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | ✅ | Medusa 后端地址 |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | ✅ | Medusa 公钥 |
| `AI_API_URL` | ❌ | DeepSeek API 地址 |
| `AI_MODEL_NAME` | ❌ | AI 模型名 |
| `AI_API_KEY` | ❌ | DeepSeek API 密钥 |

---

## 5. 构建

```bash
npm install
npm run build
```

> ⚠️ 常见构建失败：
> - **Google Fonts 连接超时**：重试一次即可
> - **内存不足**：至少需要 1GB 可用内存；可加 `NODE_OPTIONS="--max-old-space-size=1536"`
> - **TypeScript 类型错误**：本地先 `npx tsc --noEmit` 检查

---

## 6. 启动

```bash
# PM2 启动
pm2 delete tao-frontend 2>/dev/null
pm2 start npm --name tao-frontend -- start

# 保存进程列表（重启后自动恢复）
pm2 save
pm2 startup systemd -u root --hp /root

# 验证
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/shop
# 返回 200 即成功
```

### PM2 常用命令

```bash
pm2 status              # 查看状态
pm2 logs tao-frontend   # 查看日志
pm2 restart tao-frontend  # 重启
pm2 stop tao-frontend   # 停止
```

---

## 7. 配置 Nginx 反代

```bash
cat > /etc/nginx/sites-enabled/default << 'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name taomagic.net www.taomagic.net;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGXIN

nginx -t && systemctl reload nginx
```

---

## 8. Cloudflare 设置

### 8.1 DNS 记录

| 类型 | 名称 | 值 | 代理 |
|:---|:----|:----|:---:|
| A | `@` | VPS 公网 IP | ✅ 橙色云 |
| CNAME | `www` | `taomagic.net` | ✅ 橙色云 |

### 8.2 SSL/TLS 模式

Cloudflare → SSL/TLS → 选 **Flexible**：

```
Off → Flexible → Full → Full (Strict)
```

> 选 Flexible，Cloudflare → VPS 走 HTTP（80 端口），不需要在 VPS 上配证书。

### 8.3 图片缓存（可选）

Cloudflare → Rules → Cache Rules → 创建：

```
规则名：Medusa static cache
表达式：http.host eq "medusa.rao123.top" and http.request.uri contains "/static/"
```

| 设置 | 值 |
|:----|:----|
| Cache status | Eligible for cache ✅ |
| Edge TTL | Override → 7 days |
| Browser TTL | Override → 1 day |

---

## 9. 域名迁移到 Cloudflare

如果域名之前在其他 DNS 服务商：

1. Cloudflare → **Add a domain** → 输入域名
2. Cloudflare 自动扫描现有 DNS 记录
3. 删除旧的 A/AAAA/CNAME 记录（只保留必要的 MX 等）
4. 添加 A 记录指向 VPS IP
5. 去域名注册商（如 SiteGround、Tucows）改 nameserver 为 Cloudflare 分配的 NS
6. 等待 DNS 生效（通常 1-2 小时）

---

## 10. 版本更新发布流程

```bash
# 1. VPS 上操作
cd /root/taomagic-frontend

# 2. 拉取最新代码
git pull

# 3. 重新构建
npm run build

# 4. 重启服务
pm2 restart tao-frontend

# 5. 验证
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/shop
```

> 如果修改了 `NEXT_PUBLIC_*` 环境变量，记得同时更新 `.env` 文件，然后 `npm run build` 重新构建。

---

## 11. 故障排查

### 页面加载但商品拿不到

检查浏览器 Network → API 请求：

| 错误 | 原因 | 解决 |
|:----|:----|:-----|
| CORS error | Medusa 后端没允许当前域名 | 在 Medusa VPS 上改 `STORE_CORS` 或 Nginx 加 CORS 头 |
| 401/403 | publishable key 错误 | 检查 `.env` 中的 key，重新构建 |
| 503 | 应用挂了 | `pm2 logs tao-frontend` 看错误 |

### JS 文件 404

- 浏览器缓存了旧 HTML → 硬刷新 `Cmd + Shift + R`
- Cloudflare 缓存了旧页面 → **Purge Everything**

### 图片加载失败 502

- Next.js 图片优化服务无法拉取远程图片
- 解决方案：`next.config.js` 中加 `unoptimized: true`

```
images: {
  unoptimized: true,
  remotePatterns: [...]
}
```

---

## 12. 架构示意

```
浏览器 ──HTTPS──→ Cloudflare ──HTTP──→ Nginx(:80) ──→ Next.js(:3000)
                                                │
                                                └──→ Medusa API (另一台 VPS)
```

- Cloudflare 处理 SSL 和 CDN 缓存
- Nginx 只做反向代理
- PM2 管理 Node.js 进程
- Medusa 后端独立部署在另一台 VPS
