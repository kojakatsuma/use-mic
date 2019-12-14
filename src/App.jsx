import React, { useRef, useEffect } from 'react';
import p5 from 'p5';


/**
 *
 * @param {p5} p
 */
const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
        p.noStroke()
        p.frameRate(24)
    }

    p.draw = () => {
        p.background(150)
        p.lights()
        p.rotateY(p.frameCount * 0.01)
        for (let x = -120; x <= 120; x += 60) {
            for (let y = -120; y <= 120; y += 60) {
                for (let z = -120; z <= 120; z += 60) {
                    const colorValue = p.random(100)
                    const r = 1 + p.random(0.1)
                    createBall(x * r, y * r, z * r, colorValue)
                }

            }
        }

    }

    const createBall = (x, y, z, color) => {
        p.push()
        p.translate(x, y, z).fill(p.color(color, color, color)).sphere(30)
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
