var test = require('tape')
var goertzel = require('../index')

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
    samplesPerFrame: 100
  }

  var detect = goertzel(opts)

  // generate a sine wave at 1 Hz
  var data = []
  for (var i = 0; i < opts.samplesPerFrame; i++) {
    var v = sin(opts.targetFrequency, i / opts.sampleRate)
    data.push(v)
  }

  var match = detect(data)
  t.equals(match, true)
})

// test('failing: 5 kHz with low amplitude', function (t) {
//   t.plan(1)

//   var opts = {
//     // hz
//     targetFrequency: 5000,
//     // samples per second
//     sampleRate: 20000,
//     // samples per block
//     samplesPerFrame: 100
//   }

//   var detect = goertzel(opts)

//   // generate a sine wave at 5000 Hz
//   var data = []
//   for (var i = 0; i < opts.samplesPerFrame; i++) {
//     var v = sin(opts.targetFrequency, i / opts.sampleRate) * 0.1
//     data.push(v)
//   }

//   var match = detect(data)
//   t.equals(match, true)
// })

// test('failing: 5 kHz with noise in front', function (t) {
//   t.plan(1)

//   var opts = {
//     // hz
//     targetFrequency: 5000,
//     // samples per second
//     sampleRate: 20000,
//     // samples per block
//     samplesPerFrame: 100
//   }

//   var detect = goertzel(opts)

//   // generate a sine wave at 5000 Hz
//   var data = [-1, 0, 1]
//   for (var i = 0; i < opts.samplesPerFrame; i++) {
//     var v = sin(opts.targetFrequency, i / opts.sampleRate)
//     data.push(v)
//   }

//   var match = detect(data)
//   t.equals(match, true)
// })

test('5 kHz', function (t) {
  t.plan(1)

  var opts = {
    // hz
    targetFrequency: 5000,
    // samples per second
    sampleRate: 20000,
    // samples per block
    samplesPerFrame: 100
  }

  var detect = goertzel(opts)

  // generate a sine wave at 5000 Hz
  var data = []
  for (var i = 0; i < opts.samplesPerFrame; i++) {
    var v = sin(opts.targetFrequency, i / opts.sampleRate)
    data.push(v)
  }

  var match = detect(data)
  t.equals(match, true)
})

// 75% of the samples are at 25 Hz
// 25% of the samples are at 50 Hz
test('25 Hz and 50 Hz', function (t) {
  t.plan(3)

  var sampleRate = 200

  // detect 50 Hz
  var goertzel50 = goertzel({
    // hz
    targetFrequency: 50,
    // samples per second
    sampleRate: sampleRate,
    // samples per block
    samplesPerFrame: 1000,
    threshold: 0.06
  })
  // detect 25 Hz
  var goertzel25 = goertzel({
    // hz
    targetFrequency: 25,
    // samples per second
    sampleRate: sampleRate,
    // samples per block
    samplesPerFrame: 1000,
    threshold: 0.5
  })
  // detect 7 Hz
  var goertzel7 = goertzel({
    // hz
    targetFrequency: 7,
    // samples per second
    sampleRate: sampleRate,
    // samples per block
    samplesPerFrame: 1000
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
  var match = goertzel50(data)
  t.equals(match, true)

  // check for 25 Hz
  match = goertzel25(data)
  t.equals(match, true)

  // check for 7 Hz
  match = goertzel7(data)
  t.equals(match, false)
})

test('similar detectors at high sample rate', function (t) {
  t.plan(3)

  // var sampleRate = 8000
  // var samplesPerFrame = 70
  var sampleRate = 44100
  // 664 => fails
  // 663 => succeeds
  var samplesPerFrame = 664 // 420

  var g1336 = goertzel({
    targetFrequency: 1336,
    sampleRate: sampleRate,
    samplesPerFrame: samplesPerFrame
  })
  var g1477 = goertzel({
    targetFrequency: 1477,
    sampleRate: sampleRate,
    samplesPerFrame: samplesPerFrame
  })
  var g1633 = goertzel({
    targetFrequency: 1633,
    sampleRate: sampleRate,
    samplesPerFrame: samplesPerFrame
  })

  var data = new Array(samplesPerFrame)
  for (var i = 0; i < samplesPerFrame; i++) {
    data[i] = sin(1477, i / sampleRate)
  }

  t.equals(g1336(data), false)
  t.equals(g1477(data), true)
  t.equals(g1633(data), false)
})
