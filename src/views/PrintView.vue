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
    {{ $t('print') }}
  </Teleport>

  <div id="booklet" @scroll="scroll" :class="{ loading: loading }">
    <TableOfContents v-if="tocFirst === true" class="page first" :pages="pages" :tags="tocTags" :shift="1" />
    <div v-for="songs, i in pages" :key="i" class="page" ref="pages">
      <SongPrint v-for="song in songs" :key="song._id" ref="songs" :id="$id(song._id)" :song="song" />
      <div class="page-num">{{ i + 1 + tocFirst }}</div>
    </div>
    <TableOfContents v-if="tocFirst === false" class="page last" :pages="pages" :tags="tocTags" :shift="1" />
  </div>


  <Teleport to="#aside">
    <div v-html="$t('help.print')"></div>
    <hr />
    <h3 class="title">{{ $t('toc_options') }}</h3>
    <div>
      <br />
      {{ $t('position') }}
      <select v-model="tocFirst">
        <option :value="true">{{ $t('first_page') }}</option>
        <option :value="false">{{ $t('last_page') }}</option>
        <option :value="undefined">{{ $t('without') }}</option>
      </select>
    </div>
    <div v-if="usedTags.length > 0" id="tocTags">
      <br />
      <div>{{ $t('tags_to_display') }}</div>
      <div v-for="tag of usedTags" :key="tag" class="tag">
        <label><input type="checkbox" v-model="tocTags" :value="tag" />{{ tag }}</label>
      </div>
    </div>
    <hr />
    <button onclick="print()">{{ $t('print') }}</button>
  </Teleport>
</template>

<script>
import SongPrint from "@/components/SongPrint.vue"
import TableOfContents from "@/components/TableOfContents.vue"

const sizes = {
  A0: [841, 1189],
  A1: [594, 841],
  A2: [420, 594],
  A3: [297, 420],
  A4: [210, 297],
  A5: [148, 210]
}

export default {
  name: 'PrintView',
  components: { SongPrint, TableOfContents },
  props: ['id'],
  data() {
    return {
      paper: sizes.A5,
      margin: 5,
      tocFirst: true,
      tocTags: [],
      page: 0,
      loading: false,
      pages: [],
    }
  },
  computed: {
    songs() {
      return this.$root.sortedSongs.filter(song => this.$root.selectedSongs.includes(song._id))
    },
    usedTags() {
      return this.songs.map(song => song.tags).flat().unique()
    },
    pageWidth() {
      return (this.paper[0]) + 'mm'
    },
    pageHeight() {
      return (this.paper[1]) + 'mm'
    },
    marginSize() {
      return this.margin + 'mm'
    },
  },
  async mounted() {
    document.title = this.$t('print')
  },
  watch: {
    songs: {
      immediate: true,
      deep: true,
      handler() {
        if (!this.loading)
          this.fillSongs()
      }
    },
    tocTags() {
      this.tocTags.sort()
    }
  },
  methods: {
    async fillSongs() {
      this.pages = []
      this.loading = true
      const promises = []
      for (const song of this.songs) {
        let index = this.$root.songs.findIndex(s => s._id == song._id)
        if (!this.$root.songs[index].title) {
          const len = promises.push(this.$store.get(song._id))
          promises[len - 1].then(song => this.$root.songs[index] = song)
        }
      }
      await Promise.all(promises)
      if (this.songs.length > 0) {
        let page = 0
        this.pages.push([])
        this.pages[page].push(this.songs[0])
        await this.$nextTick()
        for (let i = 0; i < this.songs.length - 1; i++) {
          this.pages[page].push(this.songs[i + 1])
          await this.$nextTick()
          const pageDiv = this.$refs.pages[page]
          const div1 = this.$refs.songs[i].$el
          const div2 = this.$refs.songs[i + 1].$el
          const width1 = div1.style.width
          for (const width of [this.paper[0] / 2 + 'mm', this.paper[0] + 'mm', '']) {
            div1.style.width = width1 == '' ? width : width1
            div2.style.width = width
            await this.$nextTick()
            if (this.validSizes(div1) && this.validSizes(div2) && this.validSizes(pageDiv)) {
              break
            }
          }
          if (!this.validSizes(pageDiv)) {
            this.pages[page].pop()
            this.pages.push([])
            page++
            this.pages[page].push(this.songs[i + 1])
            await this.$nextTick()
          }
        }
      }
      this.loading = false
    },
    validSizes(div) {
      return div.offsetHeight >= div.scrollHeight && div.offsetWidth >= div.scrollWidth
    },
  }
}
</script>

<style lang="scss">
#print {
  background: rgb(82, 86, 89);

  #booklet {
    margin: auto;

    .page {
      position: relative;
      width: v-bind(pageWidth);
      height: v-bind(pageHeight);
      background: white;
      box-shadow: 0 0 10px black;
      margin: auto;
      margin-bottom: 20px;

      &.toc {
        padding: v-bind(marginSize);
        break-inside: avoid;
      }

      .song-print {
        display: inline-block;
        vertical-align: top;
        padding: v-bind(marginSize);
        min-width: calc(v-bind(pageWidth) / 2);
        max-width: v-bind(pageWidth);
        max-height: v-bind(pageHeight);
        break-inside: avoid;
      }

      .page-num {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: v-bind(marginSize);
        font-size: 3mm;
        line-height: 3mm;
        text-align: center;
      }
    }
  }

}

@page {
  size: A5;
  margin: 0;
}

@media print {
  #app {
    overflow: visible;

    >header {
      display: none;
    }

    >#content {
      margin: 0;

      >nav,
      >aside {
        display: none
      }

      >#print {
        padding: 0;
        background: none;

        #booklet {
          .page {
            width: 100vw;
            height: 100vh;
            background: none;
            box-shadow: none;
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
