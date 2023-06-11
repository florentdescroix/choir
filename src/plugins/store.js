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

import { reactive } from 'vue'
import PouchDB from 'pouchdb'
PouchDB.plugin(find)

function createStore(url, name) {

  const db = new PouchDB(url.href + name, { skip_setup: true })

  async function exec(method, path, body) {
    let resp = await fetch(url + path,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : body
      })
    return await resp.json()
  }

  async function login(name, password) {
    const resp = await exec("POST", "_session", { name, password })
    if (resp.error) {
      throw resp
    }
    this.logged = true
  }

  async function logout() {
    const resp = await exec("DELETE", "_session")
    if (resp.error) {
      throw resp
    }
    this.logged = false
  }



  async function getAll(full = false) {
    let response
    if (full) {
      response = (await db.allDocs({ include_docs: true })).rows.map(e => e.doc)
    } else {
      response = (await db.query("views/songTags")).rows.map(e => ({ _id: e.id, ...e.value }))
    }
    return response
  }

  function get(id) {
    return db.get(id)
  }

  async function upsert(song) {
    if (!song.title) {
      throw "Missing song title"
    }
    song.title = song.title.toLowerCase()
    let id = song.title.normalize("NFD").replace(/\p{Diacritic}/gu, "")
    if (song._id != id) {
      song._id = id
      delete song._rev
    }
    let response = await db.put(song)
    return get(response.id)
  }

  async function remove(song) {
    let response = await db.remove(song)
    return response.id
  }

  return {
    async install(app) {
      const store = reactive({
        get,
        getAll,
        upsert,
        remove,
        login,
        logout,
        logged: false,
      })
      app.config.globalProperties.$store = store
      const resp = await exec("GET", "_session")
      store.logged = resp?.userCtx?.name !== null
    }
  }
}

const store = createStore(new URL(window.location.origin + "/ws/"), "choir");

export default store;