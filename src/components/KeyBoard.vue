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
  <div id="keyboard" :class="{ loading: loading }">
    <template v-for="key, i of keys" :key="i">
      <div :id="key.note + key.octave"
        :class="{ key: true, hover: hoverIndex >= 0 && highlight.includes(i - hoverIndex), played: playedKeys.includes(key) }"
        @mousedown="$emit('click', i)" @mouseleave="hoverIndex = -1"
        @mouseenter="hoverIndex = i; $event.buttons === 1 ? $emit('click', i) : null">
        <template v-for="voice, name, i in voices" :key="name">
          <div v-if="key.note == voice.from.note && key.octave == voice.from.octave"
            :style="{ width: 40 * voice.length + 'px', marginTop: i * 1.2 + 'em' }" :class="[name, 'voice']">
            {{ $t(name) }}
          </div>
        </template>
        <div class="label">{{ key.note.includes('#') ? '' : $t(`note.${key.note}`) }}</div>
      </div>
    </template>
  </div>
</template>

<script>
import * as Tone from 'tone'
import { Voices } from "@/helpers/Constants.js"

export default {
  name: "InstrumentKeyboard",
  props: ['highlight', 'speed', 'keys'],
  emits: ['hover', 'click'],
  data() {
    return {
      voices: Voices,
      hoverIndex: -1,
      playedKeys: [],
      loading: false
    }
  },
  async created() {
    const urls = {}
    for (const key of this.keys) {
      urls[key.note + key.octave] = key.note.replace('#', 's') + key.octave + ".mp3"
    }

    this.sampler = new Tone.Sampler({
      urls,
      release: 1,
      baseUrl: `/samples/piano/`,
    }).toDestination()
    this.loading = true
    await Tone.loaded()
    this.loading = false
  },
  watch: {
    hoverIndex() {
      this.$emit('hover', this.keys[this.hoverIndex])
    }
  },
  computed: {
    whiteAmount() {
      return this.keys.filter(k => !k.note.includes('#')).length
    }
  },
  methods: {
    keyToName(key) {
      return key.note + key.octave
    },
    playKeys(keys) {
      if (!Array.isArray(keys)) {
        keys = [keys]
      }
      this.sampler.triggerAttackRelease(keys.map(this.keyToName), this.speed * 2)
      this.playedKeys = keys
      return new Promise(resolve => setTimeout(() => {
        this.playedKeys = []
        resolve()
      }, 1000 * this.speed))
    },
  }
}
</script>

<style lang="scss">
#keyboard {
  white-space: pre;
  user-select: none;
  position: relative;

  .key {
    position: relative;
    display: inline-block;
    vertical-align: text-top;

    &:not([id*="#"]) {
      height: 170px;
      width: 40px;
      background: linear-gradient(-30deg, #f5f5f5, #fff);
      border: 1px solid #ccc;
      box-shadow: inset 0 1px 0px #fff, inset 0 -1px 0px #fff, inset 1px 0px 0px #fff, inset -1px 0px 0px #fff, 0 4px 3px rgba(0, 0, 0, 70%);
      border-radius: 0 0 3px 3px;

      &.played {
        height: 168px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 40%);

        &::before,
        &::after {
          content: "";
          width: 0px;
          height: 0px;
          border-width: 170px 5px 0px;
          border-style: solid;
          position: absolute;
          top: 0px;
        }

        &::before {
          border-color: transparent transparent transparent rgba(0, 0, 0, 0.1);
          left: 0px;
        }

        &::after {
          border-color: transparent rgba(0, 0, 0, 0.1) transparent transparent;
          right: 0px;
        }
      }

      &:hover,
      &.hover {
        background: linear-gradient(0deg, #f5f5f5, var(--blue));
      }

    }

    &[id*="#"] {
      width: 24px;
      height: 120px;
      margin: 0 -12px;
      background: linear-gradient(-20deg, #333, #000, #333);
      border-width: 1px 2px 7px;
      border-style: solid;
      border-color: #666 #222 #111 #555;
      box-shadow: inset 0px -1px 2px rgba(255, 255, 255, 40%), 0 2px 3px rgba(0, 0, 0, 40%);
      border-radius: 0 0 2px 2px;
      z-index: 2;

      .label {
        color: white
      }

      &.played {
        border-bottom-width: 2px;
        box-shadow: inset 0px -1px 1px rgba(255, 255, 255, 0.4), 0 1px 0px rgba(0, 0, 0, 0.8), 0 2px 2px rgba(0, 0, 0, 0.4), 0 -1px 0px #000;
      }

      &:hover,
      &.hover {
        background: linear-gradient(0deg, #333, var(--blue));
      }
    }

    .label {
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      font-size: 9pt;
      font-weight: bold;
    }

    .voice {
      position: absolute;
      content: "";
      top: 0;
      left: 50%;
      font-size: 15px;
      height: 1.2em;
      line-height: 1em;
      padding-left: 5px;
      color: white;
      font-weight: bold;
      z-index: 3;
      pointer-events: none;
      font-family: Roboto;

      ::after {
        content: attr(class)
      }
    }

    .bass {
      background: rgba(103, 58, 183, 0.75);
    }

    .baritone {
      background: rgba(33, 148, 242, 0.75);
    }

    .tenor {
      background: rgba(76, 175, 80, 0.75);
    }

    .alto {
      background: rgba(255, 193, 7, 0.75);
    }

    .mezzo {
      background: rgba(255, 87, 34, 0.75);
    }

    .soprano {
      background: rgba(233, 30, 99, 0.75);
    }
  }
}
</style>