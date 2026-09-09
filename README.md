# AI Reel Plugin Marketplace

Codex用の「AIリール再現仕様書」プラグインです。公開されているInstagram Reels、TikTok、YouTube ShortsのアカウントURLを分析し、伸びる機構を抽出したうえで、コピーではないオリジナルの再現仕様書を作成します。分析するたびに、フック・台本・映像・音声・字幕・CTAの証拠をワークスペースへ蓄積し、次回の企画判断へ反映できます。

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

同じアカウント専用の再現精度を高める場合は、そのアカウントだけを追加できます：

```text
$learn-ai-reel-market

この公開アカウントを取り込み、このアカウント専用の再現モデルを更新してください。
URL：...
```

別アカウントにも応用できる市場知見を作る場合は、複数の独立アカウントを追加します：

```text
$learn-ai-reel-market

次の公開アカウントを市場知能へ追加し、6要素の勝ちパターンと失敗パターンを更新してください。
URL：...
URL：...
```

学習データは、実行したワークスペースの`.ai-reel-intelligence`に保存されます。1アカウントから作ったモデルは、その同じアカウントの再現にだけ利用します。別アカウントへの応用や共通ルール化は、最低3つの独立アカウントで確認された候補だけが対象です。Codexの基盤モデルを再学習する仕組みではなく、検証可能な外部知識として次回以降の分析で利用します。

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
- 6要素別の学習済み候補、反証、信頼度、カバレッジ

## 追加データで精度を上げる方法

URLだけでも実行できます。投稿動画、投稿別の再生数・いいね・コメント数、投稿日、Instagram Insights（保持率、シェア、保存、プロフィール遷移、フォロー）を添えると、比較と予測の信頼度が上がります。

取得できない非公開指標は推測で断定せず、欠損として扱います。

## 継続学習で作成されるファイル

- `.ai-reel-intelligence/account-models/*.json`：各アカウント専用の再現モデル
- `.ai-reel-intelligence/intelligence.json`：複数アカウントで検証する市場事前分布
- `.ai-reel-intelligence/learning-report.md`：人が確認する学習レポート
- `.ai-reel-intelligence/promotion-queue.json`：複数アカウントで再現した横展開・ルール候補
- `.ai-reel-intelligence/manifest.json`：取り込んだデータと更新履歴

同一アカウントの再現モデルは1アカウントから作成できますが、そのURL以外には転用しません。横展開モデルでは、少数のバズ投稿が判断基準を歪めないよう、アカウント単位の影響上限、時間減衰、少数標本の縮小、重複排除を行います。

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
