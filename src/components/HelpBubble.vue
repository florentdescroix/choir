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
  <component :is="is" :class="$slots.icon ? '' : 'helper'" @mouseenter="enter" @mouseleave="leave" v-bind="$attrs">
    <template v-if="$slots.icon">
      <slot name="icon"></slot>
    </template>
    <template v-else>
      <img src="@/assets/icons/help.svg" />
    </template>
  </component>
  <Teleport to="body">
    <div v-if="open" id="tooltip" ref="tooltip" :style="{ top: top + 'px', left: left + 'px', width: width + 'px' }">
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <template v-else>
        {{ modelValue }}
      </template>
    </div>
  </Teleport>
</template>

<script>

export default {
  name: "HelpBubble",
  inheritAttrs: false,
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    is: {
      type: String,
      default: "span",
    },
  },
  data() {
    return {
      open: false,
      top: 0,
      left: 0,
      width: 0
    }
  },
  methods: {
    async enter(e) {
      if (this.modelValue || this.$slots.default) {
        this.open = true
        this.width = 300
        await this.$nextTick()

        let tootltip = document.getElementById("tooltip")

        if (tootltip.offsetHeight > 30) {
          this.width = 250
        }
        let height = tootltip.offsetHeight
        while (this.width > 0 && tootltip.offsetHeight <= height) {
          this.width--
          await this.$nextTick()
        }
        this.width++

        let x = e.clientX - tootltip.offsetWidth / 2
        let maxX = window.innerWidth - tootltip.offsetWidth
        this.left = Math.max(0, Math.min(x, maxX))

        let bottomY = e.clientY + 10
        let topY = Math.max(0, e.clientY - 10 - tootltip.offsetHeight)
        let maxY = window.innerHeight - tootltip.offsetHeight
        this.top = bottomY > maxY ? topY : bottomY
      }
    },
    leave() {
      this.open = false
    }
  }

}
</script>

<style lang="scss">
.helper {
  cursor: help;
  width: 24px;
  position: relative;

  img {
    position: absolute;
    margin-left: 5px;
  }
}

#tooltip {
  position: fixed;
  width: max-content;
  font-size: 12px;
  line-height: 1.2em;
  color: white;
  padding: 4px 6px;
  background: rgba(82, 83, 85, 0.9);
  background-clip: padding-box;
  border: 1px solid rgba(82, 83, 85, 0.25);
  border-radius: 3px;
  z-index: 999;

  ul {
    margin: 0;
    padding-left: 20px;
  }
}
</style>