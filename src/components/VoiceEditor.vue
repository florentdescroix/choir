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
  <div class="voice">
    <h3 class="title">
      <span @click="$emits('click', voiceName)">
        {{ $t(voiceName) + ' ' }}
      </span>
      <span v-if="!disabled" class="note">
        <select v-model="voice.note">
          <option value="">{{ $t('none') }}</option>
          <option value="?">?</option>
          <option v-for="note in notes" :key="note" :value="note">
            {{ $t(`note.${note}`) }}
          </option>
        </select>
      </span>
      <span v-else class="note" clickable @mousedown="play(voice.note)" @mouseup="stop()" @mouseleave="stop()"> {{ $t(`note.${ voice.note }`) }}
      </span>
      <BumbleBee v-if="!disabled && voice.note || disabled && voice.drone" class="drone" :disabled="disabled"
        v-model="voice.drone" />
    </h3>
    <LinksEditor v-if="voice.note" v-model="voice.links" :disabled="disabled" />
  </div>
</template>

<script>
import { deepVModel } from "@/plugins/utils"
import { Voice } from "@/helpers/Objects"
import { Notes } from "@/helpers/Constants"
import BumbleBee from "./BumbleBee.vue"
import LinksEditor from "./LinksEditor.vue"
import * as Tone from 'tone'

export default {
  name: "VoiceEditor",
  components: { BumbleBee, LinksEditor },
  emits: ["click"],
  props: {
    voiceName: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [deepVModel('voice', new Voice())],
  data() {
    return {
      notes: Notes,
    }
  },
  created() {
    this.synth = new Tone.Synth().toDestination();
  },
  methods: {
    play(note) {
      const octave = this.voiceName == 'bass' ||  this.voiceName == 'tenor' ? 3 : 4
      this.synth.triggerAttack(note + octave, Tone.now())
    },
    stop() {
      this.synth.triggerRelease(Tone.now())
    }
  }
}
</script>

<style lang="scss">
.voice {

  .note {
    font-size: 0.8em;
    font-weight: normal;
  }

  .drone {
    margin-left: 5px;
  }
}
</style>