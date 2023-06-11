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
  <Editor is="editor" class="editor" ref="editor" @click="click" :init="init" v-model="value" />
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import { genInit } from '@/helpers/TinyMce'

export default {
  name: 'LyricsEditor',
  components: { Editor },
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: [Array, String],
      default: () => [],
    }
  },
  data() {
    return {
      value: typeof this.modelValue == 'string' ? this.modelValue : this.toHTML({
        div: 'editor',
        content: this.modelValue
      }).innerHTML,
      buttons: {},
      init: genInit('#song .body', this.setup)
    }
  },
  computed: {
    voices() {
      return this.$parent.song.voices
    }
  },
  watch: {
    value() {
      const div = document.createElement('div')
      div.innerHTML = this.value
      this.$emit('update:modelValue', this.toJson(div).content)
    },
    voices: {
      deep: true,
      handler() {
        this.updateVoicesButton()
      }
    }
  },
  methods: {
    setup(editor, voicesApi) {
      this.editor = editor
      this.buttons = voicesApi
      this.updateVoicesButton()
    },
    updateVoicesButton() {
      for (const name in this.voices) {
        this.buttons?.[name]?.setEnabled(this.voices[name]?.note)
      }
    },
    click(e, editor) {
      // Two events are triggered : native's and editor's
      if (editor) {
        const box = e.target.getBoundingClientRect()
        if (e.clientX < box.left && e.target?.tagName == 'SECTION') {
          editor.formatter.toggle("section", { value: 'chorus' })
        } else if (e.clientX < box.left && e.target?.tagName == 'REPEAT') {
          editor.formatter.remove("repeat", { value: e.target.className }, e.target)
        }
      }
    },
    toJson(node) {
      if (node.nodeType == 3) {
        return node.textContent
      } else {
        return {
          [node.tagName.toLowerCase()]: node.className,
          content: [...node.childNodes].map(this.toJson).filter(part => part.br != undefined || part?.length || part?.content?.length)
        }
      }
    },
    toHTML(obj) {
      if (typeof obj == 'string') {
        return document.createTextNode(obj)
      } else {
        const tag = Object.keys(obj).find(key => key !== 'content')
        const el = document.createElement(tag)
        el.className = obj[tag]
        const children = obj.content.map(this.toHTML)
        el.append(...children)
        return el
      }
    }
  }
}
</script>

<style lang="scss">
.tox-pop {
  max-width: 500px !important;
}


.editor {
  outline: none;
  width: max-content;
  max-width: 100%;
  min-width: 184px;
  padding: 4px 8px;

  &::before {
    cursor: text;
    margin-left: 10px;
    color: #757575;
  }

  &:focus-within {
    >* {
      outline-style: auto;
      outline-color: rgb(0, 95, 204);
      outline-offset: .25em;
    }

    section {
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: -20px;
        top: calc(50% - 6px);
        color: grey;
        font-size: 14px;
        line-height: 14px;
      }

      &.verse::before {
        content: "▶";
        cursor: e-resize;
      }

      &.chorus::before {
        content: "◀";
        cursor: w-resize;
        left: -24px;
      }
    }
  }

  repeat {
    pointer-events: none;

    &::after {
      pointer-events: all;
      cursor: url('@/assets/icons/cancel.svg') 12 12, auto;
    }
  }
}

.toggler {
  cursor: row-resize;
  position: absolute;
  left: 0;
  width: 100%;
  height: .4em;
  display: flex;
  align-items: center;
  z-index: 999;

  &::before {
    content: "";
    display: block;
    height: 1px;
    width: 50%;
    background: rgba(0, 0, 0, 0.25);
  }

  &.merge {
    cursor: ns-resize;
    height: 1em;
  }
}

trix-editor:not(.hasSelection)+div .floating-toolbar {
  display: none;
}

.floating-toolbar {
  position: absolute;
  margin-top: -5px;
  width: max-content;
  transform: translate(-50%, -100%);
  border-radius: 25px;
  box-shadow: 2px 2px 10px -5px black;
  z-index: 2;

  button {
    width: 25px;
    height: 25px;
    border-width: 1px;
    margin: 0;
    background: white;
    font-weight: inherit;

    x2,
    x3 {
      &::after {
        display: none;
      }
    }

    &:first-child {
      border-top-left-radius: 25px;
      border-bottom-left-radius: 25px;
    }

    &:last-child {
      border-top-right-radius: 25px;
      border-bottom-right-radius: 25px;
    }

    &.trix-active {
      background: #CCC;
    }
  }
}
</style>
