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
  <!-- <Teleport to="#aside"> -->
    <h3 v-html="$t('help.welcome')"></h3>
  <!-- </Teleport> -->
</template>

<script>

export default {
  name: "HomeView",
  async created() {
    document.title = this.$t("main_title");
  },
  methods: {
  }
};
</script>

<style lang="scss">
main#home {
  pointer-events: none;
}
</style>
