# toki pona rate analysis

Analyse the rate at which tokiponists speak toki pona using recordings and transcripts.

## use

To use this, you need these on your computer:

-   node.js with pnpm installed
-   ffmpeg

To install the dependencies, run `pnpm install`.

You also need data. Put recordings and transcripts in the `data` folder. In `src/index.ts`, adjust `CORPORA`, `RECORDINGS`, and `TRANSCRIPTS` to match the names of your data files.

To run the program, run `pnpm start`.

## configure

In `src/information.ts`, you can change `MORA` from `true` to `false` to use syllables instead of morae.

## output

Your output will be in the terminal and look something like this:

```
Information content (bits):
[
  [ 'ju', 12.93682194449238 ],
  [ 'ne', 11.614893849605018 ],
  [ 'no', 9.93682194449238 ],
  (... many more items)
  [ 'na', 4.1936705503798795 ],
  [ 'li', 3.3584492531315746 ],
  [ 'n', 3.087416843544621 ]
]

Weighted average information per syllable: 4.92 bits

Theoretical speech rate to achieve 39 bits/second: 7.93 syllables/second

Total syllable count: 9100
Total duration: 1680.17 seconds
Total pause duration: 303.52 seconds
Effective speech duration: 1376.65 seconds

Actual speech rate: 6.61 syllables/second
Actual information rate: 32.51 bits/second
```
