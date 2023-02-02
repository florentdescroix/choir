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

import { createApp } from 'vue'
import i18n from "@/plugins/i18n";
import router from "@/plugins/router";
import store from "@/plugins/store";
import App from './App.vue'


Object.defineProperty(Array.prototype, 'unique', {
  value() {
    return this.filter((val, index, self) => self.indexOf(val) === index)
  },
  enumerable: false,
});


const app = createApp(App)
  .use(i18n)
  .use(router)
  .use(store)

app.config.globalProperties.$id = (id) => id.replace(/[^\w\s]/gi, '_').replaceAll(' ', '_')

app.mount('#app')