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
  <Teleport to="body" v-if="isOpen">
    <div class="modal">
      <main @keypress.enter="login()">
        <h2>
          {{ $t('help.login') }}
        </h2>
        <input :class="{ error }" v-model="username" :placeholder="$t('prompt.login')" type="text">
        <input :class="{ error }" v-model="password" :placeholder="$t('prompt.password')" type="text">
        <footer>
          <button @click="close()">{{ $t('cancel') }}</button>
          <button @click="login()">{{ $t('validate') }}</button>
        </footer>
      </main>
    </div>
  </Teleport>
  <button @click="$store.logged ? logout() : open()">{{ $store.logged ? $t('logout') : $t('login') }}</button>
</template>

<script>

export default {
  name: "LoginButton",
  data() {
    return {
      isOpen: false,
      username: "",
      password: "",
      error: false
    }
  },
  methods: {
    open() {
      this.username = ""
      this.password = ""
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    },
    async login() {
      let username = this.username.toLocaleLowerCase().replaceAll(" ", "")
      let password = this.password.toLocaleLowerCase().replaceAll(" ", "")
      try {
        await this.$store.login(username, password)
        this.close()
      } catch (err) {
        this.error = true
        setTimeout(() => {
          this.error = false
        }, 3000)
      }
    },
    async logout() {
      await this.$store.logout()
    }
  }
}
</script>

<style lang="scss">
@keyframes error {
  0% {
    outline: 2px auto #EF233C;
  }

  50% {
    outline: 2px auto transparent;
  }

  100% {
    outline: 2px auto #EF233C;
  }
}

body>.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  z-index: 100;
  align-items: center;
  justify-content: center;

  main {
    display: block;
    max-width: 500px;
    max-height: 500px;
    background: white;
    padding: 42px;
    box-shadow: -5px 5px 10px rgba(0, 0, 0, 0.5);
    background-color: var(--text-color);
    color: #fff;
    font-family: monospace, serif;
    letter-spacing: 0.05em;

    input {
      width: 100%;
      padding: 14px 16px;
      margin-top: 12px;
      border: 0;
      background: transparent;
      color: #fff;
      font-family: monospace, serif;
      font-size: 16px;
      transition: all .5s;

      &.error {
        animation: error 1s infinite;
      }
    }

    footer {
      margin-top: 12px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
