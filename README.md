# goertzel

> Implements [the Goertzel
algorithm](https://en.wikipedia.org/wiki/Goertzel_algorithm) for efficient
frequency detection.

# example

```js
var goertzel = require('goertzel')

var opts = {
  // 1 kHz
  targetFrequency: 1000,
  // samples per second
  sampleRate: 10000,
  // samples per frame
  samplesPerFrame: 100
}

var detect = goertzel(opts)

// generate sine wave at some Hz and time (ms)
function sin (hz, t) {
  return Math.sin(Math.PI * 2 * t * hz)
}

// sine at 1 kHz for 100 samples
var data = []
for (var i = 0; i < opts.samplesPerFrame; i++) {
  var v = sin(opts.targetFrequency, i / opts.sampleRate)
  data.push(v)
}

console.log(detect(data))
```

```
true
```

# methods

## var detect = goertzel(opts={})

Returns a function set to detect a single frequency.

`opts` is mandatory, and has some required and optional parameters:

- `opts.targetFrequency` (required) - the frequency, in Hertz, to detect the
  presence of
- `opts.sampleRate` (required) - how many samples are taken per second. For best
  results, this should be at least twice the [Nyquist
  frequency](https://en.wikipedia.org/wiki/Nyquist_frequency). 2.5x works well.
- `opts.samplesPerFrame` (required) - how many samples will be included in each
  frame to be tested.
- `opts.threshold` (optional) - The Goertzel algorithm returns a relative
  magnitude of how well the samples match the `targetFrequency`. Set this to
  control the threshold. In general, the default value can be used safely.

## detect(data)

Returns a `boolean`: `true` if the `targetFrequency` is present in the samples,
and `false` otherwise.

`data` is expected to be compatible with a `Float32Array`.

# install

With [npm](https://npmjs.org/) installed, run

```
$ npm install goertzel
```

# license

MIT
