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
    <TextEditor id="song-title" v-model="song.title" :disabled="disabled" :singleLine="true" :placeholder="$t('title')" />
  </Teleport>

  <TextEditor v-if="!disabled || song.description" id="song-description" v-model="song.description" :disabled="disabled"
    :placeholder="$t('description')" />

  <div class="body">
    <div class="parts">

      <div class="titles">
        <template v-for="part, i in tabs" :key="i">
          <h3 class="title" v-if="!disabled || song[part].length > 0" @click="tab = part"
            :class="{ active: part == tab }">
            {{ $t(part) }}
          </h3>
        </template>
        <h3>
          <HelpBubble v-if="!disabled">
            <ul>
              <li v-for="(n, i) in 3" :key="i">{{ $t(`help.lyrics[${i}]`) }}</li>
            </ul>
          </HelpBubble>
        </h3>
      </div>

      <template v-for="part, i in tabs" :key="i">
        <component v-if="tab === part" :is="tab == 'lyrics' ? 'LyricsEditor' : 'TextEditor'" class="content"
          v-model="song[part]" :disabled="disabled" :placeholder="$t(part)" />
      </template>

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
  inheritAttrs: false,
  components: { LyricsEditor, LinksEditor, VoiceEditor, TextEditor, TagsEditor, HelpBubble },
  props: {
    disabled: {
      type: Boolean,
      default: true
    }
  },
  mixins: [deepVModel('song', new Song())],
  data() {
    return {
      tabs: ['lyrics', 'phonetic', 'translation'],
      tab: 'lyrics'
    }
  },
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
  #song-parent {
    select {
      text-transform: capitalize;
    }

    .title {
      display: inline-block;
      padding-right: 1ch;
    }
  }
}

#song {
  #song-description {
    display: grid;
    width: fit-content;
    margin: auto;
    font-style: italic;
    text-align: justify;
    outline: 1px solid black;
    padding: 4px 8px;
  }

  .body {
    .parts {
      .titles {
        text-align: center;
        margin-bottom: 20px;

        h3 {
          margin: none;
          display: inline-block;
          cursor: pointer;
        }

        .title {
          margin-left: 20px;
          margin-right: 20px;

          &:not(.active) {
            opacity: .5;
          }

          &.active,
          &:hover {
            border-bottom: 2px solid currentColor;
          }
        }
      }

      .content {
        margin: auto;
      }
    }
  }
}
</style>