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
  <div class="editor-container">

    <div v-if="!disabled" v-show="hover" class="toggler" ref="toggler" :style="togglerStyle" @click="splitOrMerge">
    </div>

    <input ref="input" :id="`trix-${id}-input`" :value="modelValue" type="hidden" />
    <trix-editor ref="trix" :class="{ hasFocus, hasSelection, disabled }" @trix-change="change"
      @trix-before-paste="paste" @click="click" @mousemove="mousemove" @focus="hasFocus = true"
      @blur="hasFocus = false; hasSelection = false" @keydown="keydown" :input="`trix-${id}-input`"
      :toolbar="`trix-${id}-toolbar`" :placeholder="$attrs.placeholder" :contenteditable="!disabled">
    </trix-editor>

    <div :id="`trix-${id}-toolbar`">
      <div v-if="!noPopup" class="floating-toolbar" :style="floatingToolbarStyle">
        <button v-for="name in buttons" :data-trix-attribute="name" :key="name">
          <component :is="name">
            {{ $t(`short.${name}`) }}
          </component>
        </button>
        <button @mousedown="clearStyle">✕</button>
      </div>
    </div>

  </div>
</template>

<script>
import Trix from "trix"
import { Voices } from "@/helpers/Constants";
const Repetitions = ['x2', 'x3']

let uuid = 0

function getElementDefaultDisplay(tag) {
  var cStyle,
    t = document.createElement(tag),
    gcs = "getComputedStyle" in window;

  document.body.appendChild(t);
  cStyle = (gcs ? window.getComputedStyle(t, "") : t.currentStyle).display;
  document.body.removeChild(t);

  return cStyle;
}

for (const voice in Voices) {
  Trix.config.textAttributes[voice] = {
    tagName: voice,
    inheritable: true,
    className: "voice",
    parser: function (element) {
      return element.tagName === voice
    }
  }
}

for (const repeat of Repetitions) {
  Trix.config.textAttributes[repeat] = {
    tagName: repeat,
    group: true,
    parser: function (element) {
      return element.tagName === repeat
    }
  }
}

Trix.config.blockAttributes.default.tagName = "verse"
Trix.config.blockAttributes.default.exclusive = true
Trix.config.blockAttributes.default.nestable = false

Trix.config.blockAttributes.chorus = {
  tagName: "chorus",
  exclusive: true,
  nestable: false,
  group: false,
  // terminal: true,
  parser: function (element) {
    return element.tagName === "chorus"
  }
}

export default {
  name: 'LyricsEditor',
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    noPopup: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      id: uuid++,
      floatingToolbarStyle: {},
      togglerStyle: {},
      hover: false,
      hasFocus: false,
      hasSelection: false,
    }
  },
  computed: {
    buttons() {
      return [...Object.keys(Voices).filter(v => this.$parent.song.voices[v]?.note), ...Repetitions]
    }
  },
  async mounted() {
    document.addEventListener("selectionchange", this.select)
    await this.$nextTick()
    this.editor = this.$refs.trix.editor
  },
  unmounted() {
    document.removeEventListener("selectionchange", this.select)
  },
  methods: {
    keydown(e) {
      if ((e.ctrlKey || e.metaKey)) {
        if (e.key === 'Z')
          this.editor.undoManager.redo()
        else if (e.key === 'z')
          this.editor.undoManager.undo()
      }
    },
    click(e) {
      if (!this.disabled && this.hasFocus) {
        let tagName = e.target?.tagName
        if (tagName === 'VERSE' || tagName === 'CHORUS') {
          let other = document.createElement(tagName === 'VERSE' ? 'chorus' : 'verse')
          other.innerHTML = e.target.innerHTML
          this.$refs.trix.replaceChild(other, e.target)
        }
      }
    },
    change() {
      this.$emit('update:modelValue', this.$refs.input.value)
    },
    paste(event) {
      if (!this.disabled && event.paste.html) {
        let div = document.createElement("div")
        div.innerHTML = event.paste.html
        event.paste.html = "<verse>" + this.html2text(div) + "</verse>"
      }
    },
    mousemove(e) {
      if (!this.disabled && this.hasFocus) {
        this.hover = false
        const origin = this.$refs.trix.getBoundingClientRect()
        for (const elem of this.$refs.trix.querySelectorAll('br, verse, chorus')) {
          const rect = elem.getBoundingClientRect()
          if (e.clientX > origin.left && e.clientX < origin.right
            && e.clientY > rect.bottom - 5 && e.clientY < rect.bottom + 5) {
            this.hover = elem
            this.togglerStyle.top = rect.bottom - origin.top + "px"
            if (elem.tagName == 'BR') {
              this.$refs.toggler.classList.remove("merge")
            } else {
              this.$refs.toggler.classList.add("merge")
            }

          }
        }
      }
    },
    select() {
      if (!this.disabled && this.hasFocus) {
        this.hasSelection = !getSelection().isCollapsed
        if (this.hasSelection) {
          let range = this.editor.getSelectedRange()
          let start = this.editor.getClientRectAtPosition(Math.min(...range))
          let origin = this.editor.getClientRectAtPosition(0)
          this.floatingToolbarStyle.top = start.top - origin.top + "px"
          this.floatingToolbarStyle.left = start.left - origin.left + "px"
        }
      }
    },
    splitOrMerge() {
      if (this.hover.tagName === "BR") { // Split
        this.editor.recordUndoEntry("Split block")
        let newPart = document.createElement("verse")
        let next = this.hover.nextSibling
        while (next) {
          let realNext = next.nextSibling
          newPart.appendChild(next)
          next = realNext
        }
        this.hover.parentNode.after(newPart)
      } else { // Merge
        this.editor.recordUndoEntry("Merge block")
        this.hover.appendChild(document.createElement("br"))
        let next = this.hover.nextSibling.firstChild
        while (next) {
          let realNext = next.nextSibling
          this.hover.appendChild(next)
          next = realNext
        }
        this.hover.parentNode.removeChild(this.hover.nextSibling)
      }
      this.hover = false
    },
    clearStyle() {
      this.editor.recordUndoEntry("Clear styles")
      for (const name of this.buttons) {
        this.editor.deactivateAttribute(name);
      }
    },
    html2text(el) {
      if (el.nodeName === "#text") {
        return el.textContent || el.innerText || ""
      } else if (el.tagName === "BR") {
        return "<br>"
      } else if (["VERSE", "CHORUS", "SOPRANO", "ALTO", "TENOR", "BASS"].includes(el.nodeName)) {
        return el.outerHTML
      } else {
        let text = "";
        if (el.childElementCount != el.childNodes.length
          && getElementDefaultDisplay(el.tagName) === "block") {
          text += "</verse><verse>"
        }
        el.childNodes.forEach(
          child => {
            text += this.html2text(child)
          }
        )
        return text
      }
    }
  }
}
</script>

<style lang="scss">
.editor-container {
  position: relative;

  trix-editor {
    border: none;
    outline: none;
    width: max-content;
    min-width: 184px;
    padding: 4px;

    &:empty::before {
      content: attr(placeholder);
      color: graytext;
    }

    &:focus-visible {
      >* {
        outline-style: auto;
        outline-color: rgb(0, 95, 204);
        outline-offset: 2.5px;
      }
    }

    &.hasFocus:not(.disabled) {

      chorus,
      verse {
        position: relative;
        pointer-events: none;

        &::before {
          content: "";
          position: absolute;
          left: -10px;
          top: 0;
          height: 100%;
          width: 10px;
          pointer-events: all;
        }
      }

      verse::before {
        cursor: e-resize;
      }

      chorus::before {
        cursor: w-resize;
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
}
</style>
