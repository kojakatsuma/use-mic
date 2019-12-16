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

PCのマイクから音声を拾い、音量に応じて動く&色が変わるアニメーションを作ります。

先にできたものをお見せするとこれです。マイクの使用許可をONにすると表示されます。ちょっとした物音にも反応するので、もうちょっと調整が必要かも。

(iosやandroid端末での検証はしていません。)

https://kojakatsuma.github.io/use-mic/


## 球体を描画する

やっていきます。

まず球体を表示している部分のコードです。`5 * 5 * 5 = 125個`の球体を四角形の配置で表示します。
draw関数はframe単位で実行されるので、draw関数の中にアニメーションの処理を書いていきます。

```jsx
import p5 from 'p5';

const RADIUS = 30; // 球体の半径

/**
 * p5jsを使用してcanvasにアニメーションを描画する。
 * @param {p5} p
 */
const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL) //windowいっぱいにcanvasを展開させる。& WEBGLを使用するよう指定。
        p.noStroke()
    }

    p.draw = () => {
        p.background(150) // 背景の色を指定
        p.lights()        // canvasにライトを当てる。
        p.rotateY(45)     // canvasを45度回転させる。
        for (let x = -RADIUS * 4; x <= RADIUS * 4; x += RADIUS * 2) {
            const colorValue = 50 
            for (let y = -RADIUS * 4; y <= RADIUS * 4; y += RADIUS * 2) {
                for (let z = -RADIUS * 4; z <= RADIUS * 4; z += RADIUS * 2) {
                    createBall(x, y, z, colorValue)
                }

            }
        }

    }
/**
 * 球体を指定の座標に作成する。
 *
 * @param {number} x x座標
 * @param {number} y y座標
 * @param {number} z z座標
 * @param {number} color 色の濃淡
 */
const createBall = (x, y, z, color) => {
        p.push()
        p.translate(x, y, z).fill(p.color(color)).sphere(RADIUS)
        p.pop()
    }

}
```

## マイクを使って声を拾う

めっちゃむずい。なんだこれ。

```js
export default class Mic {
    constructor() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
            this.context = new AudioContext();
            this.input = this.context.createMediaStreamSource(stream)
            this.input.connect(this.analayzer)
            this.analayzer = this.context.createAnalyser()
            this.processor = this.context.createScriptProcessor(1024 * 2, 1, 1)
            this.analayzer.connect(this.processor)
            this.processor.connect(this.context.destination)
            this.spectrum = []
            this.res = 0
            this.processor.onaudioprocess = () => {
                this.spectrum = new Uint8Array(this.analayzer.frequencyBinCount)
                this.analayzer.getByteFrequencyData(this.spectrum)
                this.res = this.spectrum.reduce((a, b) => Math.max(a, b))
            }
        })
    }

    getLevel() {
        return this.res
    }

    close() {
        this.context.close()
    }
}
```

Web Audio APIはめちゃくちゃむずいです。わけわからんくらいむずい。

細かく説明していきます。

### マイクの使用を指定する

使用例はこちらが詳しい。これはWebRTCのAPIらしい。
[ユーザーから音声データを取得する | Web | Google Developers](https://developers.google.com/web/fundamentals/media/recording-audio?hl=ja)

こちらはそこまで難しいこともありません。使用するデバイスを指定 `audio: true` して、streamを流すって感じになります。 

```js

    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
        /** 取ってきたstreamでなんやかんやする **/
    })

```

### 拾った音声から音量を取ってくる

これが本当にむずい。というかまだ理解が浅いかもしれません。

該当コードはこちらです。

```js
      this.context = new AudioContext();
      this.input = this.context.createMediaStreamSource(stream)
      this.analyser = this.context.createAnalyser()
      this.input.connect(this.analyser)
      this.analyser.connect(this.context.destination)
```

登場人物を整理します。

```js
      // AudioContextを作成
      this.context = new AudioContext();
      // MediaStreamAudioSourceNodeを作成
      this.input = this.context.createMediaStreamSource(stream)
      // AnalyserNodeを作成
      this.analyser = this.context.createAnalyser()

```

### それぞれの役割

ざっくりはじめに書いておくと、AudioContextが音声データの管理を担い、MediaStreamAudioSourceNode,AnalyserNode,ScriptProcessorNodeなどのAudioNodeの実装が中間処理を担っています。多分。

| 名前                       | 役割                                                            |
| -------------------------- | --------------------------------------------------------------- |
| AudioContext               | 音声データの管理                                                |
| MediaStreamAudioSourceNode | WebRTCによって取得した入力ストリーム(MediaStream)をWebAudioAPIで扱えるストリーム(AudioBuffer)に変換 |
| AnalyserNode               | 音声データを分析した情報を取得する(音量はここで取得する)        |


なので以下の処理はこれをやっています。

1. マイクで拾った音声データ(MediaStream)Web Auidoに扱えるストリームに変換して、次のAnalyserNodeに渡す
2. ストリームを分析して分析情報を持っておく。AudioContextのインスタンスにstreamをそのまま流す


```js
      this.input.connect(this.analyser)
      this.analyser.connect(this.context.destination)
```

## 最終形態

```jsx
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Mic from './Mic';

const RADIUS = 30;

const mic = new Mic() // マイクからのニュリョクストリームが作成される。

/**
 * p5jsを使用してcanvasにアニメーションを描画する。
 * @param {p5} p
 */
const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
        p.noStroke()
    }

    p.draw = () => {
        p.background(150)
        p.lights()
        p.rotateY(45)
        for (let x = -RADIUS * 4; x <= RADIUS * 4; x += RADIUS * 2) {
            const colorValue = mic.getLevel() // 音量を取得
            for (let y = -RADIUS * 4; y <= RADIUS * 4; y += RADIUS * 2) {
                for (let z = -RADIUS * 4; z <= RADIUS * 4; z += RADIUS * 2) {
                    const r = 1 + mic.getLevel() * 0.005　// 音量を取得して、値が大きすぎるのでいい感じに小さくする。
                    createBall(x * r, y * r, z * r, colorValue)
                }

            }
        }

    }
    /**
     * 球体を指定の座標に作成する。
     *
     * @param {number} x x座標
     * @param {number} y y座標
     * @param {number} z z座標
     * @param {number} color 色
     */
    const createBall = (x, y, z, color) => {
        p.push()
        p.translate(x, y, z).fill(p.color(color)).sphere(RADIUS)
        p.pop()
    }

}

export default () => {
    const target = useRef(null)
    useEffect(() => {
        new p5(sketch, target.current)
        return () => {
            mic.close()
        }
    }, [])
    return (
        <div ref={target} />
    )
}

```

## 最後に

色々説明を端折ったのですが。気になる方はコードを読んでいただければ幸いです。

https://github.com/kojakatsuma/use-mic

Web Audio APIは激ムズ。これだけでもう1記事かける。
