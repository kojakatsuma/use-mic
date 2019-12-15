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


## なにはともあれ

やっていきます。

まず球体を表示している部分のコードです。`5 * 5 * 5 = 125個`の球体を四角形の配置で表示します。

```jsx
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Mic from './Mic';

const RADIUS = 30; //球体の半径を指定

/**
 * p5jsを使用してcanvasにアニメーションを描画する。
 * @param {p5} p
 */
const sketch = (p) => {
    const mic = new Mic()
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL) //ブラウザの画面いっぱいにcanvasを展開する & WEBGL使う。
        p.noStroke()
    }

    p.draw = () => {
        p.background(150) // 背景の色を指定。
        p.lights() // 球体に光を当てる
        p.rotateY(-0.3)
        for (let x = -RADIUS * 4; x <= RADIUS * 4; x += RADIUS * 2) {
            const colorValue = mic.getLevel()
            for (let y = -RADIUS * 4; y <= RADIUS * 4; y += RADIUS * 2) {
                for (let z = -RADIUS * 4; z <= RADIUS * 4; z += RADIUS * 2) {
                    const r = 1 +  mic.getLevel() * 0.005
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

}

export default () => {
    const target = useRef(null)
    useEffect(() => {
        new p5(sketch, target.current)
    }, [])
    return (
        <div ref={target} />
    )
}
```

