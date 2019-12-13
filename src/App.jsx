import React, { useRef, useEffect } from 'react';
import p5 from 'p5';


const ballCountInRow = 5

/**
 *
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
        p.rotateY(-0.3)
        for (let x = 0; x < ballCountInRow; x++) {
            for (let y = 0; y < ballCountInRow; y++) {
                for (let index = 0; index < ballCountInRow; index++) {
                    const colorValue = p.random(100)
                    createBall(x * 60, y * 60, index * - 60, colorValue)
                }

            }
        }

    }

    const createBall = (x, y, z,color) => {
        p.push()
        p.translate(x - 150, y - 100, z).fill(p.color(color, color, color)).sphere(30)
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
