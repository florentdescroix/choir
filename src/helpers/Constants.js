/******
This file is part of Choir, a colaborative repository for choir lyrics.
Copyright (C) 2023 – Florent Descroix <florentdescroix@posteo.net>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>
*****/

export const Notes = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
]
const Whites = Notes.filter(el => !el.includes('#'))

class Voice {
  constructor(from, to) {
    this.from = from
    this.to = to
    this.length = Whites.length * (to.slice(-1) - from.slice(-1)) - Whites.indexOf(from.slice(0, -1)) + Whites.indexOf(to.slice(0, -1))
  }
}

export const Voices = {
  bass: new Voice('C2', 'E4'),
  baritone: new Voice('F2', 'G4'),
  tenor: new Voice('B2', 'C5'),
  alto: new Voice('E3', 'E5'),
  mezzo: new Voice('G3', 'G5'),
  soprano: new Voice('C4', 'C6')

}

export const Chords = {
  third: {
    none: false,
    sus2: 2,
    minor: 3,
    major: 4,
    sus4: 5
  },
  fifth: {
    none: false,
    diminished: 6,
    perfect: 7,
    augmented: 8
  },
  seventh: {
    none: false,
    minor: 10,
    major: 11,
    //add9: 14
  },
  nineth: {
    none: false,
    minor: 13,
    major: 14,
    augmented: 15
  }
}

export const Modes = {
  none: [0],
  major: [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0],
  minor_natural: [0, 2, 3, 5, 7, 8, 10, 12, 10, 8, 7, 5, 3, 2, 0],
  minor_melodique: [0, 2, 3, 5, 7, 9, 11, 12, 10, 8, 7, 5, 3, 2, 0],
  minor_harmonique: [0, 2, 3, 5, 7, 8, 11, 12, 11, 8, 7, 5, 3, 2, 0],
  major_pentatonic: [0, 2, 4, 7, 9, 12, 9, 7, 4, 2, 0],
  minor_pentatonic: [0, 3, 5, 7, 9, 12, 9, 7, 5, 3, 0],
  major_blues: [0, 2, 3, 4, 7, 9, 12, 9, 7, 4, 3, 2, 0],
  minor_blues: [0, 3, 5, 6, 7, 10, 12, 10, 7, 6, 5, 3, 0],
  // double2Aug1:      [0, 1, 4, 5, 7, 8, 11, 12, 11, 8, 7, 5, 4, 1, 0],
  // double2Aug2:      [0, 2, 3, 6, 7, 8, 11, 12, 11, 8, 7, 6, 3, 2, 0],
  // chromatic:        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  // tonus:            [0, 2, 4, 6, 8, 10, 12, 10, 8, 6, 4, 2, 0],
  // tonusSemiTonus:   [0, 2, 3, 5, 6, 8, 9, 11, 12, 11, 9, 8, 6, 5, 3, 2, 0],
  // semiTonusTonus:   [0, 1, 3, 4, 6, 7, 9, 10, 12, 10, 9, 7, 6, 4, 3, 1, 0],
  // dorien:           [0, 2, 3, 5, 7, 9, 10, 12, 10, 9, 7, 5, 3, 2, 0],
  // phrygien:         [0, 1, 3, 5, 7, 8, 10, 12, 10, 8, 7, 5, 3, 1, 0],
  // lydien:           [0, 2, 4, 6, 7, 9, 11, 12, 11, 9, 7, 6, 4, 2, 0],
  // mixolydien:       [0, 2, 4, 5, 7, 9, 10, 12, 10, 9, 7, 5, 4, 2, 0],
  // locrien:          [0, 1, 3, 5, 6, 8, 10, 12, 10, 8, 6, 5, 3, 1, 0],
}

export const AudioExt = {
  wav: "audio/wav",
  mp3: "audio/mpeg",
  mp4: "audio/mp4",
  adts: "audio/aac",
  ogg: "audio/ogg",
  webm: "audio/webm",
  caf: "audio/x-caf",
  flac: "audio/flac",
  includes(val) {
    return Object.hasOwn(this, val)
  }
}