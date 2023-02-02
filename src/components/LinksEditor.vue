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
  <div class="links">
    <div v-for="link, i of links" :key="i">
      <template v-if="!disabled">
        <label>🔗 <input type="url" v-model="links[i]" @input="updateLinks" /></label>
      </template>
      <audio v-if="getAudioType(link) !== false" controls preload="auto">
        <source :type="getAudioType(link)" :src="'/assets/external?url=' + link" />
        <a :href="link" target="_blank" rel="noopener noreferrer">{{ link }}</a>
      </audio>
      <iframe v-else-if="getYouTubeId(link) !== false" title="YouTube video player" allowfullscreen
        :src="`https://www.youtube-nocookie.com/embed/${getYouTubeId(link)}`"></iframe>
      <a v-else :href="link" target="_blank" rel="noopener noreferrer">{{ link }}</a>
    </div>
  </div>
</template>

<script>
import { deepVModel } from "@/plugins/utils"
import { AudioExt } from "@/helpers/Constants"

export default {
  name: "LinksEditor",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [deepVModel('links', [], (links) => links.filter(val => val))],
  mounted() {
    this.updateLinks();
  },
  methods: {
    updateLinks() {
      this.links = this.links.unique().filter(val => val).map(val => {
        let ytId = this.getYouTubeId(val)
        if (ytId !== false) {
          return `https://www.youtube.com/watch?v=${ytId}`
        } else {
          return val
        }
      })
      this.links.push("")
    },
    getAudioType(src) {
      let ext = src.split(".").pop();
      if (AudioExt.includes(ext)) {
        return AudioExt[ext]
      }
      return false;
    },
    getYouTubeId(src) {
      if (src.includes("youtube")) {
        let url = new URL(src)
        return url.searchParams.get("v")
      }
      return false
    }
  }
}
</script>

<style lang="scss">
.links {
  margin-left: 20px;
}
</style>