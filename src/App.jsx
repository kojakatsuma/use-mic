import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const RADIUS = 30;

/**
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
    }, [])
    return (
        <div ref={target} />
    )
}
