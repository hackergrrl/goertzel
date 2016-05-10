# goertzel

> Fast frequency detection using the Goertzel algorithm

## Background

The [Goertzel algorithm](https://en.wikipedia.org/wiki/Goertzel_algorithm) is a
fast alternative to the [Fast Fourier Transform]() that is optimized for
detecting the presence of a single frequency in a buffer of signal samples
(radio waves, sound, light).

## Usage

Let's detect a sine wave with a frequency of 2 kHz:

```js
var goertzel = require('goertzel')

var detect = goertzel({
  targetFrequency: 2000,  // 2 kHz
  sampleRate: 10000,      // 1000 samples per second
  samplesPerFrame: 100    // 100 samples per buffer
})

// Generates a sine wave at some Hz and time (ms)
function sin (hz, t) {
  return Math.sin(Math.PI * 2 * t * hz)
}

// Populate a buffer with a sine wave at 2 kHz for 100 samples
var sin2 = []
for (var i = 0; i < 100; i++) {
  var v = sin(2, i / 100)
  sin2.push(v)
}

// Populate a buffer with a sine wave at 19 kHz for 100 samples
var sin19 = []
for (var i = 0; i < 100; i++) {
  var v = sin(19, i / 100)
  sin19.push(v)
}

console.log(detect(sin19))
console.log(detect(sin2))
```

This will output

```
false
true
```

## API

```js
var goertzel = require('goertzel')
```

### var detect = goertzel(opts={})

Returns a function set to detect a single frequency.

`opts` is mandatory, and has some required and optional parameters:

- `opts.targetFrequency` (required) - the frequency, in Hertz, to detect.
- `opts.sampleRate` (required) - how many samples are taken per second. For best
  results, this should be at least twice the [Nyquist
  frequency](https://en.wikipedia.org/wiki/Nyquist_frequency). 2.5x works well.
- `opts.samplesPerFrame` (required) - how many samples will be included in each
  frame to be tested.
- `opts.threshold` (optional) - The Goertzel algorithm returns a relative
  magnitude of how well the samples match the `targetFrequency`. Set this to
  control the threshold. In general, the default value can be used safely.

## detect(data)

Given a buffer of floating point audio samples (-1..1), returns a `boolean`:
`true` if the `targetFrequency` is present in the samples, and `false`
otherwise.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install goertzel
```

## Acknowledgments

An understanding of the algorithm was gleaned from
https://en.wikipedia.org/wiki/Goertzel_algorithm and
http://www.embedded.com/design/configurable-systems/4024443/The-Goertzel-Algorithm.

## Works Great With

- [noffle/mic-stream](https://github.com/noffle/mic-stream)

## License

MIT
