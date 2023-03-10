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
  <div class="song-print" v-if="song.title">
    <div class="header clearfix">
      <table class="voices">
        <tr>
          <template v-for="(voice, name) in song.voices" :key="name">
            <th v-if="voice.note">
              <voice :class="name">
                <BumbleBee v-if="voice.drone" disabled />
                <template v-else>
                  {{ $t(`short.${name}`) }}
                </template>
              </voice>
            </th>
          </template>
        </tr>
        <tr>
          <template v-for="(voice, name) in song.voices" :key="name">
            <td v-if="voice.note">
              {{ $t(`note.${voice.note}`) }}
            </td>
          </template>
        </tr>
      </table>
      <div class="title"> {{ song.title }} </div>
      <div class="description" v-html="song.description"></div>
    </div>
    <div class="body">
      <div class="lyrics" ref="lyrics" v-html="song.lyrics"
        :style="{ columnWidth: columnWidth + 'px', minWidth: columnWidth + 'px', flex: columnWidth ? 1 : 'initial' }">
      </div>
      <div class="phonetic" v-if="song.phonetic" v-html="song.phonetic"
        :style="{ columnWidth: columnWidth + 'px', minWidth: columnWidth + 'px', flex: columnWidth ? 1 : 'initial' }">
      </div>
      <div class="translation" v-if="song.translation" v-html="song.translation"
        :style="{ columnWidth: columnWidth + 'px', minWidth: columnWidth + 'px', flex: columnWidth ? 1 : 'initial' }">
      </div>
    </div>
  </div>
</template>

<script>
import BumbleBee from "./BumbleBee.vue"

export default {
  name: "SongPrint",
  components: { BumbleBee },
  emits: ['update:size'],
  props: {
    song: {
      type: Object,
      default: () => { },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columnWidth: false,
    }
  },
  watch: {
    song: {
      immediate: true,
      async handler() {
        if (this.song.title) {
          this.columnWidth = false
          await this.$nextTick()
          this.columnWidth = this.$refs.lyrics.offsetWidth
        }
      }
    }
  },
}
</script>

<style lang="scss">
#app {
  .song-print {
    color: black;
    font-family: EBGaramond, serif;
    position: relative;
    font-size: 3mm;
    width: fit-content;
    height: min-content;

    .header {
      min-height: 1em;
      margin-bottom: 3mm;

      .title,
      .description {
        width: 100%;
        font-family: Raleway, sans-serif;
      }


      .title {
        margin: auto;
        margin-bottom: 1mm;
        text-align: center;
        font-size: 5mm;
        font-weight: bold;
      }

      .description {
        font-style: italic;
        white-space: pre-line;
        font-weight: bold;
        text-align: justify;
        text-align-last: center;
        font-size: 2.5mm;
      }

      .voices {
        float: right;
        margin-left: 1mm;
        border-collapse: collapse;
        font-family: Helvetica, Arial, sans-serif;
        text-align: center;

        th {
          font-weight: normal;
          padding: 0;
          position: relative;
        }

        td {
          border: 1px solid black;
          width: 7mm;
          height: 7mm;
          padding: 0;
        }
      }
    }

    .body {
      width: 100%;
      display: flex;
      column-gap: 5mm;

      .lyrics,
      .phonetic,
      .translation {
        display: inline-block;
        vertical-align: top;
        min-width: 150px;
        letter-spacing: -0.19px;
        column-gap: 1.5mm;

        chorus,
        verse {
          margin-bottom: 0.5em;
        }
      }
    }
  }
}
</style>