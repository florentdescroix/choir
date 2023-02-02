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
  <div class="toc">
    <h2 class="title">{{ $t('table_of_contents') }}</h2>
    <div>
      <ul>
        <template v-for="songs, i of pages">
          <li v-for="song in songs" :key="song._id" :class="{ title: true, child: song.parent }">
            <a :href="`#${$id(song._id)}`">{{ song.title }}</a>
            <span>{{ i + 1 + shift }}</span>
          </li>
        </template>
      </ul>
    </div>
    <template v-if="tags.length > 0">
      <h2 class="title">{{ $t('tags') }}</h2>
      <div v-for="tag of tags" :key="tag" class="toc-tag">
        <h3 class="title">{{ tag }}</h3>
        <ul>
          <template v-for="songs, i of pages">
            <template v-for="song in songs" :key="song._id">
              <li v-if="song.tags.includes(tag)" :class="{ title: true, child: song.parent }">
                <a :href="`#${$id(song._id)}`">{{ song.title }}</a>
                <span>{{ i + 1 + shift }}</span>
              </li>
            </template>
          </template>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "TableOfOCntents",
  props: {
    shift: {
      type: Number,
      default: 0
    },
    pages: {
      type: Array,
      default: () => []
    },
    tags: {
      type: Array,
      default: () => []
    },
  }
}
</script>

<style lang="scss">
#app > #content .toc {
  column-count: 2;
  column-fill: auto;
  font-size: 3.5mm;

  h1,
  h2 {
    column-span: all;
    text-align: center;
    font-weight: bold;
  }

  .title {
    margin: 0;
  }

  >div {
    overflow: auto;

    ul {
      margin: 0;
      margin-bottom: 5mm;
      padding: 0;
      overflow-x: hidden;
      list-style: none;

      li {
        overflow: hidden;

        &.child {
          margin-left: 1em;
        }

        &::before {
          float: left;
          width: 0;
          white-space: nowrap;
          content: ". . . . . . . . . . . . . . . . . . . . "
            ". . . . . . . . . . . . . . . . . . . . "
            ". . . . . . . . . . . . . . . . . . . . "
            ". . . . . . . . . . . . . . . . . . . . "
        }

        a {
          color: inherit;
          text-decoration: none;
          padding-right: 0.33em;
          background: white
        }

        span {
          float: right;
          padding-left: 0.33em;
          background: white
        }
      }
    }
  }
}
</style>