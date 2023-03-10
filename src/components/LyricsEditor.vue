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
  <div class="toolbar-wrapper">
    <div :id="`toolbar-${uuid}`"></div>
  </div>
  <div class="editor-container">
    <Editor is="editor" class="editor" v-bind="$attrs" initial-value="modelValue"
      api-key="obxtg43v00kcomg2zvm4hsgcmpzk37sg7bwcimz3im92ueqp" :init="init" v-model="value" @click="click">
    </Editor>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import { Voices } from '@/helpers/Constants'

const LyricsElements = {
  section: ["verse", "chorus"],
  voice: Object.keys(Voices),
  repeat: ["x2", "x3", "x4", "x5"],
}

let uuid = 0

export default {
  name: 'LyricsEditor',
  components: { Editor },
  inheritAttrs: false,
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
    uuid++
    return {
      value: this.modelValue,
      uuid: uuid,
      buttons: {},
      init: {
        inline: true,
        menubar: false,
        statusbar: false,
        paste_block_drop: false,
        newline_behavior: 'invert',
        forced_root_block: "section",
        forced_root_block_attrs: { class: "verse" },
        invalid_elements: "*",
        valid_children: `-section[section],-repeat[section]`,
        valid_classes: {
          section: LyricsElements.section.join(" "),
          voice: LyricsElements.voice.join(" "),
          repeat: LyricsElements.repeat.join(" ").replaceAll('x', '')
        },
        valid_elements: "br,section[!class],repeat[!class],voice[!class]",
        custom_elements: "section,repeat,~voice",
        fixed_toolbar_container: `#toolbar-${uuid}`,
        toolbar: "bass tenor alto soprano | x1 x2 x3 x4 x5 | removeformat | update",
        formats: {
          removeformat: { selector: 'repeat,voice', remove: 'all', deep: true },
          section: { block: "section", attributes: { class: '%value' } },
          repeat: { block: "repeat", attributes: { class: '%value' }, merge_siblings: false },
          voice: { inline: "voice", classes: '%value', block_expand: true, split: false }
        },
        setup: (editor) => {
          this.editor = editor

          editor.ui.registry.addButton("update", {
            text: "update",
            onAction:() => {
              this.updateToNewForm()
            }
          })

          for (const name of LyricsElements.voice) {
            editor.ui.registry.addToggleButton(name, {
              text: this.$t(`short.${name}`),
              onAction: () => {
                editor.formatter.toggle("voice", { value: name })
              },
              onSetup: (api) => {
                this.buttons[name] = api
                api.setEnabled(this.voices[name]?.note)
                api.setActive(editor.formatter.match("voice", { value: name }))
                editor.formatter.formatChanged("voice", (state) => {
                  api.setActive(state)
                }, false, { value: name })
                editor.formatter.formatChanged("voice", (state) => {
                  api.setActive(state)
                }, false, { value: name })
              }
            })
          }

          for (const name of LyricsElements.repeat) {
            const value = name.slice(-1)
            editor.ui.registry.addToggleButton(name, {
              text: this.$t(`short.${name}`),
              onAction: () => {
                if (editor.selection.isCollapsed() && editor.formatter.match('repeat', { value })) {
                  editor.formatter.remove('repeat', { value }, editor.selection.getNode())
                } else if (!editor.selection.isCollapsed()) {
                  const selectedContent = editor.selection.getContent()
                  if (!selectedContent.includes("section")) {
                    const element = document.createElement('repeat')
                    element.className = value
                    element.innerHTML = selectedContent
                    editor.selection.setContent(element.outerHTML)
                  }
                }
              },
              onSetup: (api) => {
                api.setActive(editor.formatter.match('repeat', { value }))
                editor.on('SelectionChange', () => {
                  api.setActive(editor.selection.isCollapsed() && editor.formatter.match('repeat', { value }))
                })
              }
            })
          }
        }
      }
    }
  },
  computed: {
    voices() {
      return this.$parent.song.voices
    }
  },
  watch: {
    value() {
      this.$emit('update:modelValue', this.value)
    },
    voices: {
      deep: true,
      handler() {
        for (const name in this.voices) {
          this.buttons?.[name]?.setEnabled(this.voices[name]?.note)
        }
      }
    }
  },
  methods: {
    click(e, editor) {
      if (editor && e.target?.tagName == 'SECTION') {
        editor.formatter.toggle("section", { value: 'chorus' })
      } else if (editor && e.target?.tagName == 'REPEAT') {
        editor.formatter.remove("repeat", { value: e.target.className }, e.target)
      }
    },
    updateToNewForm() {
      let lyrics = this.modelValue

      for (const type in LyricsElements) {
        for (const el of LyricsElements[type]) {
          lyrics = lyrics.replaceAll(`<${el}>`, `<${type} class="${el}">`)
          lyrics = lyrics.replaceAll(`</${el}>`, `</${type}>`)
        }
      }

      console.log(lyrics)
      this.value = lyrics
    }
  }
}
</script>

<style lang="scss">
.toolbar-wrapper {
  position: sticky;
  top: 22px;
  height: 0;
  z-index: 10;

  [id|=toolbar] {
    position: absolute;
    top: -45px;
    width: max-content;

    button[aria-disabled="true"] {
      display: none;
    }
  }
}


.editor {
  outline: none;
  width: max-content;
  min-width: 184px;
  padding: 4px;

  &:focus-visible {
    >* {
      outline-style: auto;
      outline-color: rgb(0, 95, 204);
      outline-offset: 5px;
    }

    section {
      position: relative;
      pointer-events: none;

      &::before {
        content: "";
        position: absolute;
        left: -18px;
        top: calc(50% - 7px);
        color: grey;
        font-size: 14px;
        line-height: 14px;
        pointer-events: all;
      }

      &.verse::before {
        content: "→";
        cursor: e-resize;
      }

      &.chorus::before {
        content: "←";
        cursor: w-resize;
        left: -20px;
      }
    }
  }

  repeat {
    pointer-events: none;

    &::after {
      pointer-events: all;
      cursor: url('@/assets/cross.png') 8 8, auto;
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
