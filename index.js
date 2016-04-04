module.exports = function (opts) {
  // if (!(this instanceof Goertzel)) return new Goertzel(opts)
  if (!opts) opts = {}

  if (!opts.threshold) opts.threshold = 0.9

  if (!opts.targetFrequency) {
    throw new Error('must specify opts.targetFrequency')
  }
  if (!opts.sampleRate) {
    throw new Error('must specify opts.sampleRate')
  }
  if (!opts.samplesPerFrame) {
    throw new Error('must specify opts.samplesPerFrame')
  }
  opts.samplesPerFrame = Math.floor(opts.samplesPerFrame)

  if (opts.sampleRate < opts.targetFrequency * 2) {
    throw new Error('sampleRate should be at least 2 times larger than targetFrequency')
  }

  var targetMagnitude = precalcMagnitude(opts.targetFrequency, opts.samplesPerFrame, opts.sampleRate)

  return function (samples) {
    // references:
    //   https://en.wikipedia.org/wiki/Goertzel_algorithm
    //   http://www.embedded.com/design/configurable-systems/4024443/The-Goertzel-Algorithm
    var k = Math.floor(0.5 + (samples.length * opts.targetFrequency) / opts.sampleRate)
    var w = (2 * Math.PI / samples.length) * k
    var c = Math.cos(w)
    var s = Math.sin(w)
    var coeff = 2 * c

    var q0 = 0
    var q1 = 0
    var q2 = 0

    q1 = q2 = 0

    for (var i = 0; i < samples.length; i++) {
      q0 = coeff * q1 - q2 + samples[i]
      q2 = q1
      q1 = q0
    }

    var real = q1 - q2 * c
    var imaginary = q2 * s
    var magSquared = real * real + imaginary * imaginary

    // console.log('real', real, 'imaginary', imaginary)
    // console.log('samples', samples.length)
    // console.log('rate', opts.sampleRate)
    // console.log('magSquared', magSquared)
    // console.log(new Array(80).join('-'))

    var per = magSquared / targetMagnitude
    return per > opts.threshold
  }

  function precalcMagnitude (freq, numSamples, rate) {
    var t = 0
    var tstep = 1 / rate
    var samples = new Array(numSamples).fill().map(function () {
      var res = Math.sin(Math.PI * 2 * freq * t)
      t += tstep
      return res
    })

    var k = Math.floor(0.5 + (numSamples * freq) / rate)
    var w = (2 * Math.PI / samples.length) * k
    var c = Math.cos(w)
    var s = Math.sin(w)
    var coeff = 2 * c

    var q0 = 0
    var q1 = 0
    var q2 = 0

    q1 = q2 = 0

    for (var i = 0; i < samples.length; i++) {
      q0 = coeff * q1 - q2 + samples[i]
      q2 = q1
      q1 = q0
    }

    var real = q1 - q2 * c
    var imaginary = q2 * s
    var magSquared = real * real + imaginary * imaginary

    return magSquared
  }
}
