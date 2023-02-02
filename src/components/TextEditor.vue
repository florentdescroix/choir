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
  <label class="input-sizer" :data-value="text">
    <input v-if="singleLine" v-model="text" :placeholder="$attrs.placeholder" type="text" size="1"
      :disabled="disabled" />
    <textarea v-else v-model="text" rows="1" :placeholder="$attrs.placeholder" :disabled="disabled"></textarea>
  </label>
</template>

<script>
export default {
  name: 'TextEditor',
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
    singleLine: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    text: {
      get() { return this.modelValue },
      set(value) { this.$emit('update:modelValue', value) },
    }
  }
}
</script>

<style lang="scss">
.input-sizer {
  display: inline-grid;
  vertical-align: top;
  align-items: stretch;

  &::after,
  input,
  textarea {
    width: auto;
    min-width: 5em;
    grid-area: 1 / 1;
    font: inherit;
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
    text-transform: inherit;
    font-variant: inherit;
    text-align: inherit;
    padding: 0.25em;
    margin: 0;
    resize: none;
    background: none;
    appearance: none;
    border: none;
    border-radius: 3px;
  }

  input,
  textarea {
    &:not([disabled]) {
      //outline: 1px auto;
    }
  }

  &::after {
    content: attr(data-value) ' ';
    visibility: hidden;
    white-space: pre-wrap;
  }
}
</style>
