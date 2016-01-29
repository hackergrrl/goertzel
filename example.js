var Goertzel = require('./index')

var opts = {
  targetFrequency: 1000,
  // samples per second
  sampleRate: 10000,
  // samples per block
  blockSize: 100
}

var goertzel = Goertzel(opts)

// sine wave at some Hz and time offset (ms)
function sin (hz, t) {
  return Math.sin(Math.PI * 2 * t * hz)
}

// generate a sine wave at 1 kHz for 1 second
var data = []
for (var i = 0; i < opts.blockSize; i++) {
  var v = sin(1000, i / opts.sampleRate)
  console.log(v)
  data.push(v)
}

var magnitude = goertzel.detect(data)
console.log(magnitude)
