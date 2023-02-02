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
  <span class="tags">
    <div v-for="(tag, i) in tags" :key="i" class="tag">
      <label @click="disabled ? $emit('click', tag) : undefined" v-bind="$attrs">{{ tag }}</label>
      <span v-if="!disabled" class="remover" clickable @click="tags.splice(i, 1)">×</span>
    </div>
    <input v-if="!disabled" type="text" list="tagList" :placeholder="$attrs.placeholder || $t('new_tag')"
      v-model="newTag" @keyup.enter="addNewTag()" />
  </span>
</template>

<script>
import { deepVModel } from "@/plugins/utils"

export default {
  name: "TagsEditor",
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['click'],
  mixins: [deepVModel('tags', [])],
  data() {
    return {
      newTag: ""
    }
  },
  watch: {
    newTag() {
      if (this.newTag.slice(-1) == "," || this.$root.tagList.includes(this.newTag)) {
        this.addNewTag()
      }
    },
  },
  methods: {
    addNewTag(tag = this.newTag) {
      this.tags.push(tag.replace(',', '').trim().toLowerCase())
      this.tags = this.tags.unique().filter(val => val)
      this.tags.sort()
      this.newTag = ""
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.tag {
  background: var(--text-color);
  color: white;
  border-radius: 1em;
  margin: 1px;
  display: inline-block;
  font-size: 13px;

  * {
    vertical-align: middle;
  }

  >label,
  span {
    display: inline-block;
    padding: 0.25em 0.5em;
  }

  >span {
    display: inline-block;
    padding: 0.25em 0.5em;
    background: rgba(255, 255, 255, .25);
    border-top-right-radius: 1em;
    border-bottom-right-radius: 1em;
  }
}
</style>