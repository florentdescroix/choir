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
    <TextEditor id="song-title" v-model="song.title" :disabled="disabled" :singleLine="true"
      :placeholder="$t('title')" />
  </Teleport>

  <div class="song">
    <TextEditor v-if="!disabled || song.description" id="song-description" v-model="song.description"
      :disabled="disabled" :placeholder="$t('description')" />
    <div class="body">
      <div id="song-lyrics">
        <h3>
          {{ $t('lyrics') }}
          <HelpBubble v-if="!disabled" :modelValue="$t('help.lyrics')" />
        </h3>
        <LyricsEditor v-model="song.lyrics" :disabled="disabled" :placeholder="$t('lyrics')" />
      </div>
      <div v-if="!disabled || song.phonetic" id="song-phonetic">
        <h3>
          {{ $t('phonetic') }}
        </h3>
        <LyricsEditor v-model="song.phonetic" :disabled="disabled" :placeholder="$t('phonetic')" noPopup/>
      </div>
      <div v-if="!disabled || song.translation" id="song-translation">
        <h3>
          {{ $t('translation') }}
        </h3>
        <LyricsEditor v-model="song.translation" :disabled="disabled" :placeholder="$t('translation')" noPopup/>
      </div>
    </div>
  </div>

  <Teleport to="#aside">
    <label v-if="!disabled || song.parent" id="song-parent">
      <h3 class="title">{{ $t('child_of') }} : </h3>
      <select v-if="!disabled" v-model="song.parent">
        <option value="">{{ $t('none') }}</option>
        <template v-for="aSong of $root.songs" :key="aSong._id">
          <option v-if="aSong._id != song._id" :value="aSong._id">{{ aSong._id }}</option>
        </template>
      </select>
      <span v-else class="title">{{ song.parent }}</span>
      <hr />
    </label>
    <div v-if="!disabled || song.links.length > 0" id="song-links">
      <h3 class="title">
        {{ $t('listen') }}
        <HelpBubble v-if="!disabled" :modelValue="$t('help.links')" />
      </h3>
      <LinksEditor v-model="song.links" :disabled="disabled" />
    </div>
    <div id="song-voices">
      <template v-for="voice, voiceName in song.voices" :key="voiceName">
        <template v-if="!disabled || voice.note">
          <VoiceEditor :id="`song-${voiceName}`" :voiceName="voiceName" v-model="song.voices[voiceName]"
            :disabled="disabled" />
        </template>
      </template>
    </div>
    <hr v-if="!disabled || song.tags.length > 0" />
    <TagsEditor id="song-tags" v-model="song.tags" @click="$root.addSearchTag($event)" :disabled="disabled" clickable />
  </Teleport>

</template>

<script>
import { deepVModel } from "@/plugins/utils"
import { Song } from "@/helpers/Objects"
import TextEditor from './TextEditor.vue'
import VoiceEditor from './VoiceEditor.vue'
import LyricsEditor from './LyricsEditor.vue'
import LinksEditor from './LinksEditor.vue'
import TagsEditor from "./TagsEditor.vue"
import HelpBubble from "./HelpBubble.vue"


export default {
  name: "songEditor",
  components: { LyricsEditor, LinksEditor, VoiceEditor, TextEditor, TagsEditor, HelpBubble },
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    teleport: {
      type: Boolean,
      default: true
    },
  },
  mixins: [deepVModel('song', new Song())]
}
</script>

<style lang="scss">
#pageTitle {
  #song-title input:not([disabled]) {
    color: var(--text-color);
    background: white;
  }
}

aside {
  #song-parent .title {
    display: inline-block;
    padding-right: 1ch;
  }
}

.song {
  #song-description {
    display: grid;
    width: fit-content;
    margin: auto;
    font-family: Raleway, sans-serif;
    font-style: italic;
    text-align: justify;
    outline: 0.1mm solid black;
    padding: 1mm 2mm;
  }

  .body {
    text-align: center;

    #song-lyrics,
    #song-phonetic,
    #song-translation {
      display: inline-block;
      text-align: left;
      vertical-align: top;
      min-width: var(--min-col-width);
      margin: 0 auto;
      padding-left: 10px;

      h3 {
        text-align: center;
      }
    }
  }
}
</style>