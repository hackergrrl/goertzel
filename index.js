var Goertzel = function (opts) {
  if (!(this instanceof Goertzel)) return new Goertzel(opts)
  if (!opts) opts = {}

  if (!opts.blockSize) {
    throw new Error('must specify opts.blockSize')
  }
  if (!opts.targetFrequency) {
    throw new Error('must specify opts.targetFrequency')
  }
  if (!opts.sampleRate) {
    throw new Error('must specify opts.sampleRate')
  }

  if (opts.sampleRate < opts.targetFrequency * 2.5) {
    throw new Error('sampleRate should be at least ~2.5 times larger than targetFrequency')
  }

  // references:
  //   https://en.wikipedia.org/wiki/Goertzel_algorithm
  //   http://www.embedded.com/design/configurable-systems/4024443/The-Goertzel-Algorithm
  var k = Math.floor(0.5 + (opts.blockSize * opts.targetFrequency) / opts.sampleRate)
  var w = (2 * Math.PI / opts.blockSize) * k
  var c = Math.cos(w)
  var s = Math.sin(w)
  var coeff = 2 * c

  var q0 = 0
  var q1 = 0
  var q2 = 0

  this.detect = function (samples) {
    // TODO: assert 'samples.length' === opts.blockSize
    q1 = q2 = 0

    for (var i = 0; i < samples.length; i++) {
      q0 = coeff * q1 - q2 + samples[i]
      q2 = q1
      q1 = q0
    }

    var real = q1 - q2 * c
    var imaginary = q2 * s
    var magSquared = real * real + imaginary * imaginary

    console.log(magSquared)
    return magSquared > 1
  }
}

module.exports = Goertzel
