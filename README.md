# Spotify Extend

Spotify APIとAI技術を組み合わせた拡張機能で、あなたの音楽体験をさらに豊かにします。

## 機能

- **AIを活用した音楽レコメンデーション**: OpenAI APIを使用してあなたの好みや気分に合わせた曲を提案
- **カスタムプレイリスト作成**: フィルター機能を使って条件に合った曲を選び、プレイリストを自動生成
- **ユーザープロファイル表示**: Spotifyアカウントの情報やお気に入りのアーティスト、ジャンルを表示
- **チャットインターフェース**: 自然言語で会話しながら音楽を探索

## 始め方

### 前提条件

- Node.js (v14以上)
- Spotify開発者アカウント
- OpenAIのAPIキー

### インストール

1. リポジトリをクローン:
```
git clone https://github.com/ryojiroakiyama/spotify_extend.git
cd spotify_extend
```

2. 依存関係のインストール:
```
npm install
```

3. 環境変数の設定:
`.env`ファイルを作成し、以下の変数を設定:
```
REACT_APP_SPOTIFY_CLIENT_ID=あなたのSpotifyクライアントID
REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000
REACT_APP_OPENAI_API_KEY=あなたのOpenAI APIキー
```

4. アプリケーションの起動:
```
npm start
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションにアクセスします。

## 使い方

1. Spotifyアカウントでログイン
2. テキスト入力または既存のプレイリストから開始
3. AIによるレコメンデーションを取得または特定の条件でフィルタリング
4. 気に入ったプレイリストを保存してSpotifyアカウントと同期

## 技術スタック

- React
- TypeScript
- Spotify Web API
- OpenAI API

## 開発者向け情報

このプロジェクトはCreate React Appで構築されています。開発環境での作業方法は以下の通りです：

### 開発モードでの実行

```
npm start
```

### テストの実行

```
npm test
```

### ビルドの作成

```
npm run build
```

## ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

## 謝辞

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [OpenAI API](https://openai.com/blog/openai-api)
- [React](https://reactjs.org/)