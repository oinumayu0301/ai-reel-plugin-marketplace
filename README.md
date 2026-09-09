# AI Reel Plugin Marketplace

Codex用の「AIリール再現仕様書」プラグインです。公開されているInstagram Reels、TikTok、YouTube ShortsのアカウントURLを分析し、伸びる機構を抽出したうえで、コピーではないオリジナルの再現仕様書を作成します。

## インストール

Codexのターミナルで、次を順番に実行します。

```powershell
codex plugin marketplace add oinumayu0301/ai-reel-plugin-marketplace --ref main
codex plugin add ai-reel-reproduction-spec@ai-reel-tools
```

インストールを確認します。

```powershell
codex plugin list --marketplace ai-reel-tools
```

新しいCodexタスクを開いてから、次のように実行してください。

```text
$reconstruct-ai-reel-spec

次の公開アカウントを分析し、AIショート動画の再現仕様書を作成してください。
URL：https://www.instagram.com/example/
```

## 出力される内容

- 証拠範囲と分析信頼度
- 伸びた投稿と伸びなかった投稿の比較
- フック、台本、映像、音声、字幕、CTAの構造
- マーケットイン／プロダクトアウト分析
- 転用可能な成長機構とコピーしてはいけない要素
- オリジナル企画10本
- 最優先企画の台本、映像・音声・編集仕様
- 低位／基準／高位の再生、反応、フォロー予測
- 検証計画と追加で必要なデータ

## 追加データで精度を上げる方法

URLだけでも実行できます。投稿動画、投稿別の再生数・いいね・コメント数、投稿日、Instagram Insights（保持率、シェア、保存、プロフィール遷移、フォロー）を添えると、比較と予測の信頼度が上がります。

取得できない非公開指標は推測で断定せず、欠損として扱います。

## 更新方法

```powershell
codex plugin marketplace upgrade ai-reel-tools
codex plugin add ai-reel-reproduction-spec@ai-reel-tools
```

更新後は、新しいCodexタスクで利用してください。

## 利用上の注意

このプラグインは、公開情報から再利用可能な成長機構を抽出します。実在クリエイターの人格・声・キャラクター・台本・映像・音楽・ジョーク・ショット順の複製、またはプラットフォームのアクセス制限回避を目的としません。

## License

[MIT](LICENSE)

