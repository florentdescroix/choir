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
  <div id="fontLoader">
    <template v-for="name in ['Raleway', 'EBGaramond']" :key="name">
      <span
        v-for="style, i in [{}, { fontStyle: 'italic' }, { fontWeight: 'bold' }, { fontStyle: 'italic', fontWeight: 'bold' }]"
        :key="i" :style="{ fontFamily: name, ...style }">
        abcdefghijklmnopqrstuvwxyz
      </span>
    </template>
  </div>

  <header>
    <div class="left">
      <router-link id="mainTitle" :to="{ name: 'home' }">
        <h1>{{ $t('main_title') }}</h1>
      </router-link>
    </div>
    <div class="center">
      <h1 id="pageTitle" class="title"></h1>
    </div>
    <div class="right">
      <div id="buttons">
        <span v-show="logged" id="actions">
        </span>
      </div>
    </div>
  </header>
  <div id="content">
    <nav>
      <div>
        <div>
          🔍 <input type="text" v-model="search" :placeholder="$t('title_search')">
        </div>
        <div>
          🏷
          <TagsEditor ref="tagSearch" v-model="tagSearch" :placeholder="$t('tag_search')" />
        </div>
      </div>
      <div id="songList">
        <label v-if="$route.name == 'print'" class="title select_all" clickable>
          {{ allChecked? $t('unselect_all'): $t('select_all') }} <input type="checkbox" v-model="allChecked" />
        </label>
        <div v-for="song in filteredSongs" :key="song._id" :class="{ title: true, child: !!song.parent }">
          <input v-if="$route.name == 'print'" type="checkbox" :value="song._id" v-model="selectedSongs" />
          <router-link :to="{ name: 'song', params: { id: song._id } }" :class="{active: song._id == $route.params.id}">
            {{ song._id }}
          </router-link>
        </div>
      </div>
      <footer>
        <router-link v-if="logged" :to="{ name: 'song', params: { id: 'new' } }">
          <button>{{ $t('new_song') }}</button>
        </router-link>
        <router-link :to="{ name: 'print' }">
          <button>{{ $t('generate_booklet') }}</button>
        </router-link>
      </footer>
    </nav>

    <main :id="$route.name">
      <router-view v-if="!loading" :key="$route.fullPath"></router-view>
    </main>

    <aside>
      <div id="aside">
      </div>
      <footer>
        <router-link :to="{ name: 'theory' }">
          <button>{{ $t('theory') }}</button>
        </router-link>
        <button @click="logged ? logout() : login()">{{ logged? $t('logout'): $t('login')}}</button>
      </footer>
    </aside>
  </div>

  <footer>
  </footer>

  <datalist id="tagList">
    <option v-for="(tag, i) in tagList" :key="i" :value="tag">
    </option>
  </datalist>
</template>

<script>
import TagsEditor from './components/TagsEditor.vue'

export default {
  name: 'App',
  components: { TagsEditor },
  data() {
    return {
      songs: [],
      selectedSongs: [],
      tagList: [],
      logged: false,
      search: "",
      tagSearch: [],
      loading: false
    }
  },
  async created() {
    this.$router.beforeEach((to) => {
      if (to.hash) {
        return false
      }
    })
    this.$router.afterEach(() => {
      this.reloadSongs()
    })
    let resp = await this.$store.logged()
    this.logged = resp.userCtx.name != null
  },
  computed: {
    sortedSongs() {
      let songs = []
      for (const song of this.songs) {
        if (!song.parent) {
          songs.push(song)
          let children = this.songs.filter(child => child.parent == song._id)
          songs.push(...children)
        }
      }
      return songs
    },
    filteredSongs() {
      return this.sortedSongs.filter(song => {
        return song._id.includes(this.search.toLowerCase()) && this.tagSearch.every(v => song.tags.includes(v))
      })
    },
    allChecked: {
      get() {
        return this.filteredSongs.every(song => this.selectedSongs.includes(song._id))
      },
      set(value) {
        if (value) {
          this.selectedSongs.push(...this.filteredSongs.map(song => song._id).filter(id => !this.selectedSongs.includes(id)))
        } else {
          for (const song of this.filteredSongs) {
            let index = this.selectedSongs.findIndex(id => id == song._id)
            if (index != -1) {
              this.selectedSongs.splice(index, 1)
            }
          }
        }
      }
    }
  },
  methods: {
    async reloadSongs() {
      this.loading = true
      this.songs = await this.$store.getAll()
      this.tagList = this.songs.map(song => song.tags).flat().unique()
      this.loading = false
    },
    addSearchTag(tag) {
      this.$refs.tagSearch.addNewTag(tag)
    },
    async login() {
      let login = prompt(this.$t('prompt.login'))
      if (login) {
        login = login.toLocaleLowerCase().replaceAll(" ", "")
        let password = prompt(this.$t('prompt.password'))
        if (password) {
          password = password.toLocaleLowerCase().replaceAll(" ", "")
          try {
            await this.$store.login(login, password)
            this.logged = true
          } catch (err) {
            alert(this.$t(`error.${err.error}`))
          }
        }
      }
    },
    async logout() {
      await this.$store.logout()
      this.logged = false
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/fonts.scss";
@import "@/assets/variables.scss";
@import "@/assets/lyrics.scss";
@import "@/assets/layout.scss";

#fontLoader {
  position: fixed;
  opacity: 0;
  z-index: -10;
}

html,
body {
  margin: 0;
  padding: 0;
}

html {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font: 400 1em/1.4 Open Sans, sans-serif;
  color: var(--text-color)
}

* {
  box-sizing: border-box;
}

a {
  color: var(--text-color);
  text-decoration: none;
}

.clearfix {
  &::after {
    display: block;
    content: "";
    clear: both;
  }
}

button {
  height: 32px;
  vertical-align: middle;
  font-variant: small-caps;
  font-weight: bold;
}

label {
  input[type="radio"] {
    display: none;

    &:checked+span {
      color: var(--blue)
    }

    &:not(:disabled)+span:hover {
      cursor: pointer;
      text-decoration: underline;
    }

    &:disabled+span {
      color: rgba(118, 118, 118, 0.3)
    }
  }
}

.loading {
  opacity: 0.5;
  filter: grayscale(100%);
  pointer-events: none;
  position: relative;
}

[clickable] {
  cursor: pointer;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .title {
    text-transform: capitalize;
    font-variant: small-caps;
    margin: 5px 0;
  }

  header {

    background-color: var(--text-color);

    h1 {
      align-items: baseline;
      margin: 0;
      font-size: 1.5em;
      font-weight: 600;
      line-height: 1;
      word-spacing: 0.08em;
    }

    #mainTitle,
    #pageTitle {
      color: white;
    }

    #mainTitle {
      font-family: cursive;
      padding-left: 15px;
    }

    #pageTitle {
      color: white;
      text-align: center;
    }

    #buttons {
      >button {
        margin-left: 20px;
      }
    }
  }

  >#content {

    >nav,
    >aside {

      h2 {
        margin: 0;
        text-align: center;
      }
    }

    >nav,
    >aside {

      >footer {
        display: flex;

        a,
        button {
          flex: 1 50%;

          button,
          a {
            width: 100%;
          }
        }
      }

      #songList,
      #aside {
        flex: 1;
        overflow-y: scroll;

        .select_all {
          input {
            display: none;
          }
        }

        .child {
          margin-left: 20px;
        }

        .active {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
