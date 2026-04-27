# video-site-backend

## Run
1. Copy `.env.example` to `.env`
2. Configure MySQL connection
3. Install deps:

```bash
npm install
```

4. Initialize super admin:

```bash
npm run seed:admin
```

5. Start API:

```bash
npm run start
```

## Main APIs
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/site-settings`
- `GET /api/videos`
- `POST /api/videos`
- `GET /api/favorites`
- `POST /api/favorites/:videoId`
- `DELETE /api/favorites/:videoId`
- `GET /api/history`
- `PUT /api/history/:videoId`
- `DELETE /api/history/:videoId`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/password`
- `PATCH /api/admin/videos/:id/review`
- `PUT /api/admin/site-settings`
