

export default class Mic {
    constructor() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
            this.context = new AudioContext();
            this.analayzer = this.context.createAnalyser()
            // this.analayzer.fftSize = 1024
            this.processor = this.context.createScriptProcessor(1024 * 2, 1, 1)
            this.input = this.context.createMediaStreamSource(stream)
            this.input.connect(this.analayzer)
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
}





// navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
//     const context = new AudioContext();
//     const analayzer = context.createAnalyser()
//     analayzer.smoothingTimeConstant = 0.2;
//     analayzer.fftSize = 1024
//     const processor = context.createScriptProcessor(1024 * 2, 1, 1)
//     const input = context.createMediaStreamSource(stream)
//     input.connect(analayzer)
//     analayzer.connect(processor)
//     processor.connect(context.destination)
//     let spectrum = []
//     let res = 0
//     processor.onaudioprocess = () => {
//         spectrum = new Uint8Array(analayzer.frequencyBinCount)
//         analayzer.getByteFrequencyData(spectrum)
//         res = spectrum.reduce((a, b) => Math.max(a, b))
//     }
//     return res
// })