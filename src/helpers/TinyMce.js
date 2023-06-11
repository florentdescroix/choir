/******
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
*****/

import 'tinymce'
import 'tinymce/icons/default'
import 'tinymce/models/dom/model'
import 'tinymce/themes/silver'
import 'tinymce/skins/ui/oxide/skin.css'
import 'tinymce/skins/ui/oxide/content.inline.css' 
import 'tinymce/plugins/quickbars'

import i18n from '../plugins/i18n'
const { t } = i18n.global

import { Voices } from '@/helpers/Constants'
const LyricsElements = {
  section: ["verse", "chorus"],
  voice: Object.keys(Voices),
  repeat: ["x2", "x3", "x4", "x5"],
}

export function genInit(containerSelector, callback) {
  return {
    inline: true,
    menubar: false,
    statusbar: false,
    skin: false,
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
    toolbar: false,
    plugins: 'quickbars',
    fixed_toolbar_container: containerSelector,
    quickbars_insert_toolbar: false,
    quickbars_image_toolbar: false,
    quickbars_selection_toolbar: "bass tenor alto soprano repeat removeformat",
    formats: {
      removeformat: { selector: 'repeat,voice', remove: 'all', deep: true },
      section: { block: "section", attributes: { class: '%value' } },
      repeat: { block: "repeat", attributes: { class: '%value' }, merge_siblings: false },
      voice: { inline: "voice", classes: '%value', block_expand: true, split: false }
    },
    setup: (editor) => {
      const voicesApi = {}
      for (const name of LyricsElements.voice) {
        editor.ui.registry.addToggleButton(name, {
          text: t(`short.${name}`),
          onAction: () => {
            editor.formatter.toggle("voice", { value: name })
          },
          onSetup: (api) => {
            voicesApi[name] = api
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


      editor.ui.registry.addMenuButton('repeat', {
        text: '×',
        fetch: (callback) => {
          const items = []
          for (const name of LyricsElements.repeat) {
            const value = name.slice(-1)
            items.push({
              type: 'togglemenuitem',
              text: t(`short.${name}`),
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
          callback(items);
        }
      })
      if (callback) {
        callback(editor, voicesApi)
      }
    }
  }
}