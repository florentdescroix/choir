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
  <div id="stickers" v-show="loaded == images.length">
    <a v-for="url, i of images" :key="i" :href="url" target="_blank" v-once>
      <img :src="url" :style="getStyle(i)" ref="stickers" @load="loaded++" />
    </a>
  </div>
</template>

<script>
import Images from '@/assets/stickers.json'

function randomInt(min, max) {
  return Math.floor((Math.random() * (max - min) + min))
}

export default {
  name: "StickerBackground",
  data() {
    return {
      images: [],
      loaded: 0
    };
  },
  async created() {
    document.title = this.$t("main_title")
    this.images = Images.sort(() => 0.5 - Math.random()).slice(0, this.amount)
  },
  computed: {
    amount() {
      const screenArea = window.innerWidth * window.innerHeight
      const stickerArea = 180 ** 2
      return screenArea / stickerArea + 5
    }
  },
  methods: {
    getStyle() {
      return {
        transform: `rotate(${randomInt(-100, 100)}deg)`,
        zIndex: randomInt(-100, -100 + this.images.length)
      }
    },
  }
};
</script>

<style lang="scss">
#stickers {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150%;
  column-width: calc(0.75 * var(--min-col-width));
  text-align: center;

  a {
    display: inline-block;

    img {
      position: relative;
      width: var(--min-col-width);
      vertical-align: middle;
      transition: .5s;
      pointer-events: none;
      margin: -25%;
    }

    &:hover {
      img {
        transform: rotate(0) !important;
        z-index: 99 !important;
      }
    }
  }
}
</style>
