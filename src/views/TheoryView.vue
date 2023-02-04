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
  <Teleport to="#pageTitle">
    {{ $t('theory') }}
  </Teleport>

  <label>{{ $t('speed') }} : <input type="number" min="0" step="0.25" style="width:4em" v-model="speed" /></label>

  <Keyboard ref="piano" :keys="keys" :highlight="selectedIntervals" :speed="speed" @hover="hoverKey = $event"
    @click="play($event)" />

  <div class="sticky-main">
    <ChordMaker ref="chord" v-model="selectedIntervals" :note="hoverKey ? hoverKey.note : ''" />

    <div id="modes">
      <h2 class="title">{{ $t('modes') }}</h2>
      <div>
        <div v-for="intervals, name of modes" :key="name"
          :class="{ possible: name == 'none' || selectedIntervals.every(i => intervals.includes(i)) }">
          <label>
            <input type="radio" name="mode" :value="intervals" v-model="selectedIntervals" />
            <span>{{ $t(name) }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="#aside">
    <h2 class="title">{{ $t('intervals') }}</h2>
    <div>
      <label>
        <input disabled type="checkbox" :value="0" v-model="selectedIntervals" />
        {{ $t('interval.0') }}
      </label>
    </div>
    <div v-for="interval of 21" :key="interval">
      <label>
        <input type="checkbox" :value="interval" v-model="selectedIntervals" @mouseup="disableMode"
          @change="selectedIntervals.sort((a, b) => a * 1 - b * 1)" />
        {{ $t('interval.'+ interval) }}
      </label>
      <hr v-if="interval == 11" />
    </div>
  </Teleport>
</template>

<script>
import ChordMaker from "@/components/ChordMaker.vue"
import Keyboard from "@/components/KeyBoard.vue"
import { Notes, Voices, Modes } from "@/helpers/Constants.js"

export default {
  name: "TheoryView",
  components: { ChordMaker, Keyboard },
  data() {
    return {
      voices: Voices,
      modes: Modes,
      selectedIntervals: [0],
      mode: [],
      speed: 0.25,
      hoverKey: false
    }
  },
  async created() {
    document.title = this.$t('theory')
  },
  computed: {
    keys() {
      let keys = []
      let index = Notes.indexOf(Voices.bass.from.slice(0, -1))
      let octave = Voices.bass.from.slice(-1) * 1
      while (keys[keys.length - 1] != Voices.soprano.to) {
        keys.push(Notes[index] + octave)
        index++
        if (index == Notes.length) {
          index = 0
          octave++
        }
      }
      return keys
    },
  },
  methods: {
    disableMode() {
      this.selectedIntervals = this.selectedIntervals.unique()
    },
    async play(index) {
      const instrument = this.$refs.piano
      const playingKeys = []
      for (const interval of this.selectedIntervals) {
        let key = this.keys[(index + interval)]
        if (key) {
          playingKeys.push(key)
          await instrument.playKeys(key)
        }
      }
      if (this.$refs.chord.valid && playingKeys.length > 1) {
        await instrument.playKeys(playingKeys)
      }
      this.playedKeys = []
    },
  }
};
</script>
<style lang="scss">
#theory {
  background: rgb(255, 255, 255);

  .sticky-main {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;

    #chordMaker,
    #modes {
      text-align: center;
      width: fit-content;
      vertical-align: text-top;
    }

    #modes {

      >div {

        div:not(.possible) {
          color: rgba(118, 118, 118, 0.7);
        }
      }
    }
  }
}
</style>
