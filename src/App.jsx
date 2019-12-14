import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Mic from './Mic';

const RADIUS = 30;

/**
 *
 * @param {p5} p
 */
const sketch = (p) => {
    const mic = new Mic()
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
        p.noStroke()
    }

    p.draw = () => {
        p.background(150)
        p.lights()
        p.rotateY(-0.3)
        for (let x = -RADIUS * 4; x <= RADIUS * 4; x += RADIUS * 2) {
            const colorValue = mic.getLevel()
            for (let y = -RADIUS * 4; y <= RADIUS * 4; y += RADIUS * 2) {
                for (let z = -RADIUS * 4; z <= RADIUS * 4; z += RADIUS * 2) {
                    const r = 1 +  mic.getLevel() * 0.008
                    createBall(x * r, y * r, z * r, colorValue)
                }

            }
        }

    }

    const createBall = (x, y, z, color) => {
        p.push()
        p.translate(x, y, z).fill(p.color(color, color, color)).sphere(RADIUS)
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
