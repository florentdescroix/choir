<!-- 
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
-->

<template>
  <div id="chordMaker">
    <h2 class="title">
      {{ $t(`chord`) }}
      <span v-if="valid" id="chordName">
        <template v-if="note">
          {{ $t(`note.${note}`) + ' ' }}
        </template>
        <template v-for="is, qualifier in qualifiers" :key="qualifier">
          <template v-if="is">
            {{ (qualifier == 'add9' && qualifiers.minor ? ' ' : '') + $t(`short.${qualifier}`) }}
          </template>
        </template>
      </span>
    </h2>

    <div id="chordOptions">
      <div v-for="intervals, name of chords" :key="name">
        <h3>{{ $t(name) }}</h3>
        <label v-for="interval, qualifier of intervals" :key="interval" :class="qualifier">
          <input type="radio" :name="name" :value="{ ...chord, [name]: interval }" v-model="chord"
            @change="$emit('change')" />
          <span>{{ $t(qualifier) }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { Chords } from '@/helpers/Constants';
import { deepVModel } from '@/plugins/utils';

export default {
  name: "ChordMaker",
  mixins: [deepVModel('intervals', {})],
  emits: ['change'],
  props: {
    note: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      chords: Chords,
    }
  },
  computed: {
    chord: {
      get() {
        const chord = {}
        for (const name in Chords) {
          const intersection = this.intervals.filter(val => Object.values(Chords[name]).includes(val))
          chord[name] = intersection.length == 1 ? intersection[0] : false
        }
        return chord
      },
      set(value) {
        this.intervals = [0, ...Object.values(value).filter(e => e !== false)]
      }
    },
    size() {
      return !!this.chord.third + !!this.chord.fifth + !!this.chord.seventh + !!this.chord.nineth
    },
    qualifiers() {
      const { third, fifth, seventh, nineth } = this.chord
      return {
        diminished: fifth == Chords.fifth.diminished,
        augmented: fifth == Chords.fifth.augmented,
        minor: third == Chords.third.minor,
        major: third == Chords.third.major,
        sus2: third == Chords.third.sus2,
        sus4: third == Chords.third.sus4,
        minor7: seventh == Chords.seventh.minor && nineth != Chords.nineth.major,
        major7: seventh == Chords.seventh.major,
        add9: !seventh && nineth == Chords.nineth.major,
        major9: nineth == Chords.nineth.major,
        minor9: nineth == Chords.nineth.minor,
        augmented9: nineth == Chords.nineth.augmented
      }
    },
    valid() {
      return this.chord.third && this.chord.fifth
    }
  }
}
</script>

<style lang="scss">
#chordMaker {
  text-align: center;

  #chordName {
    text-transform: none;
    font-weight: normal;
    font-size: 0.8em;
  }

  #chordOptions {
    white-space: pre;

    >div {
      display: inline-block;
      width: 25%;
      padding: 0 5px;
      min-width: fit-content;
      vertical-align: text-top;

      h3 {
        margin: 0;
      }

      label {
        display: block;
        font-weight: normal;
        line-height: 1.2em;

        &.perfect {
          line-height: 2.4em;
        }

        &.minor:nth-child(3) {
          margin-top: 1.2em;
        }
      }
    }
  }
}</style>