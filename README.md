# p5jsとWeb Audio API でインタラクティブアート的なことをしてみる

Ubiregi Advent Calendar 2019 12日目です。フロントエンドエンジニアのコジャが担当します。

めちゃくちゃ遅刻しました。理由は、忘年会と送別会のシーズンだからです。すいません。

## インタラクティブアート?

美術手帖のartwikiってとこに記載があったので引用します。

[インタラクティブ・アート｜美術手帖](https://bijutsutecho.com/artwiki/93)
> 観客を巻き込むことで表現を成立させるアート。「インタラクティブ」という概念には、「対話的」「双方向的」「相互作用的」などという意味があり、それぞれニュアンスがあるが、表現方法としてはどれにも該当する。またこれらは情報技術の概念としてとらえられている（しかし意味的には、古代の文物やオールドメディアにも広げることができる）。

要は`観客とともにやるアート`だよってことですね。へぇ〜。思いつくものありますか？私はないです。

今日はこれをやっていきます。

## 使用する技術

使用するのは以下、Reactは必須じゃないです。react-scriptsをつかって簡単に動かしたいだけなのと、私がなれてるだけです。

- p5js v0.10.2
- Web Audio API
- React (必須じゃない)

## p5js?

https://p5js.org/

p5jsはProcessingのjs移植版で、アニメーションとかを簡単に実装できます。

現vは0.10.2なんですが、そろそろv1.0がでるんじゃないかってtwitterで見ました。

## Web Audio API?

MDNが詳しい

[Web Audio API - MDN - Mozilla](https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API)
> Web Audio APIはWeb上で音声を扱うための強力で多機能なシステムを提供します。

実はp5jsには[p5.sound.js](https://p5js.org/reference/#/libraries/p5.sound)というWeb Audio APIのwrapperみたいなのがいるんですが、なぜかまともに動かない。[公式のExample](https://p5js.org/examples/sound-mic-input.html)も一度だけ動いてあとは動かなかったので、Web Audio APIをそのまま使うことにしました。

## 何をつくるの？

PCのマイクから音声を拾い、音量に応じて動くようなアニメーションを作ります。



