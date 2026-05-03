# K2310 カレンダーアプリ

月次カレンダーに日付ごとの名前を書き込めるアプリケーション。

## アーキテクチャ

```
frontend/   React + TypeScript (Vite)
backend/    AWS Lambda + API Gateway + DynamoDB (SAM)
```

## ローカル開発

### 1. バックエンド起動（インメモリ、DynamoDB不要）

```bash
cd backend
npm install
npm run dev
# http://localhost:3001 で起動
```

### 2. フロントエンド起動

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173 で起動
```

`.env.development` で `VITE_API_URL=http://localhost:3001` が設定済み。

## AWS へのデプロイ

### 事前準備

- AWS CLI 設定済み
- AWS SAM CLI インストール済み

### バックエンドデプロイ

```bash
cd backend
npm run build          # TypeScript → dist/
sam deploy --guided    # 初回は --guided でパラメータ設定
```

デプロイ後、Outputs に表示される `ApiUrl` をコピー。

### フロントエンドデプロイ

```bash
cd frontend
# .env.production を編集して VITE_API_URL=<ApiUrl> を設定
npm run build
# dist/ フォルダを S3 + CloudFront 等にデプロイ
```

## API エンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/entries?month=YYYY-MM` | 指定月のエントリ一覧 |
| PUT | `/entries/{date}` | 日付に名前を保存 |
| DELETE | `/entries/{date}` | 日付のエントリを削除 |

## DynamoDB テーブル設計

- テーブル名: `K2310CalendarEntries`
- PK: `date` (YYYY-MM-DD)
- 属性: `names` (string[]), `updatedAt` (ISO 8601)
