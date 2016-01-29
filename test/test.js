var test = require('tape')
var Goertzel = require('../index')

// sine wave at some Hz and time offset (ms)
function sin (hz, t) {
  return Math.sin(Math.PI * 2 * t * hz)
}

test('1 Hz', function (t) {
  t.plan(1)

  var opts = {
    // hz
    targetFrequency: 1,
    // samples per second
    sampleRate: 100,
    // samples per block
    numSamples: 100
  }

  var goertzel = Goertzel(opts)

  // generate a sine wave at 1 Hz
  var data = []
  for (var i = 0; i < opts.numSamples; i++) {
    var v = sin(opts.targetFrequency, i / opts.sampleRate)
    data.push(v)
  }

  var match = goertzel.detect(data)
  t.equals(match, true)
})

test('5 kHz', function (t) {
  t.plan(1)

  var opts = {
    // hz
    targetFrequency: 5000,
    // samples per second
    sampleRate: 20000,
    // samples per block
    numSamples: 100
  }

  var goertzel = Goertzel(opts)

  // generate a sine wave at 5000 Hz
  var data = []
  for (var i = 0; i < opts.numSamples; i++) {
    var v = sin(opts.targetFrequency, i / opts.sampleRate)
    data.push(v)
  }

  var match = goertzel.detect(data)
  t.equals(match, true)
})

// 75% of the samples are at 25 Hz
// 25% of the samples are at 50 Hz
test('25 Hz and 50 Hz', function (t) {
  t.plan(3)

  var sampleRate = 200

  // detect 50 Hz
  var goertzel50 = Goertzel({
    // hz
    targetFrequency: 50,
    // samples per second
    sampleRate: sampleRate,
    // samples per block
    numSamples: 1000
  })
  // detect 25 Hz
  var goertzel25 = Goertzel({
    // hz
    targetFrequency: 25,
    // samples per second
    sampleRate: sampleRate,
    // samples per block
    numSamples: 1000
  })
  // detect 7 Hz
  var goertzel7 = Goertzel({
    // hz
    targetFrequency: 7,
    // samples per second
    sampleRate: sampleRate,
    // samples per block
    numSamples: 1000
  })

  var data = []

  // generate 750 samples at 25 Hz
  for (var i = 0; i < 750; i++) {
    var v = sin(25, i / sampleRate)
    data.push(v)
  }

  // generate 250 samples at 50 Hz
  for (i = 0; i < 250; i++) {
    v = sin(50, i / sampleRate)
    data.push(v)
  }

  // check for 50 Hz
  var match = goertzel50.detect(data)
  t.equals(match, true)

  // check for 25 Hz
  match = goertzel25.detect(data)
  t.equals(match, true)

  // check for 7 Hz
  match = goertzel7.detect(data)
  t.equals(match, false)
})
