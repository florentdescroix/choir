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
  <Teleport to="#actions">
    <template v-if="editable">
      <HelpBubble is="button" class="material-symbols-outlined green" @click="save" :modelValue="$t('help.save')">
        save
      </HelpBubble>
      <HelpBubble v-if="id != 'new'" is="button" class="material-symbols-outlined red" @click="remove"
        :modelValue="$t('help.remove')">
        delete
      </HelpBubble>
      <HelpBubble is="button" class="material-symbols-outlined blue" @click="cancel" :modelValue="$t('help.cancel')">
        close
      </HelpBubble>
    </template>
    <template v-else>
      <HelpBubble is="button" class="material-symbols-outlined blue" @click="edit" :modelValue="$t('help.edit')">
        edit
      </HelpBubble>
    </template>
  </Teleport>

  <SongEditor v-if="song" @update:modelValue="hasChanged++" v-model="song" :disabled="!editable" />
</template>
  
<script>
import SongEditor from "@/components/SongEditor.vue"
import HelpBubble from "@/components/HelpBubble.vue"
import { Song } from "@/helpers/Objects"

export default {
  name: 'SongView',
  components: { SongEditor, HelpBubble },
  props: ['id'],
  data() {
    return {
      editable: false,
      song: false,
      hasChanged: 0
    }
  },
  async mounted() {
    this.reload()
    document.title = this.id.charAt(0).toUpperCase() + this.id.slice(1)
  },
  methods: {
    async reload() {
      if (this.id === 'new') {
        this.song = new Song()
        this.editable = true
      } else {
        this.song = await this.$store.get(this.id)
      }
    },
    edit() {
      this.editable = true
    },
    async cancel() {
      this.editable = false
      if (this.id === 'new') {
        this.$router.push({ name: 'home' })
      } else {
        this.reload()
      }
    },
    async remove() {
      this.editable = false
      try {
        if (confirm(this.$t('prompt.remove'))) {
          await this.$store.remove(this.song)
          this.$router.push({ name: 'home' })
        }
      } catch (err) {
        await this.reload()
        alert(this.$t(`error.${err.error}`))
      }
    },
    async save() {
      if (!this.song.title) {
        alert(this.$t('error.song_need_title'))
      } else {
        this.editable = false
        if (this.hasChanged > 1) {
          try {
            this.song = await this.$store.upsert(this.song)
            this.$root.reloadSongs()
            if (this.id !== this.song._id) {
              this.$router.push({ name: 'song', params: { id: this.song._id } })
            }
          } catch (err) {
            await this.reload()
            alert(this.$t(`error.${err.error}`))
          }
        }
      }
    }
  }
}
</script>
  
<style lang="scss">

</style>
  