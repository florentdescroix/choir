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

export function mapVModel(struct) {
  const pattern = {}
  for (const prop in struct) {
    pattern[prop] = {
      get: function () {
        return this.modelValue[prop]
      },
      set: function (value) {
        this.$emit(`update:modelValue`, { ...this.modelValue, [prop]: value })
        return true
      },
    }
  }
  return pattern
}

export const deepVModel = (name, defaultValue, beforeUpdate = false) => ({
  props: {
    modelValue: {
      type: Object,
      default: () => defaultValue
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      [name]: {},
      selfEditing: false
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (!this.selfEditing) {
          this[name] = structuredClone(newValue)
        } else {
          this.selfEditing = false
        }
      }
    },
    [name]: {
      deep: true,
      handler(newValue) {
        if (beforeUpdate) {
          newValue = beforeUpdate(newValue)
        }
        this.selfEditing = true
        this.$emit('update:modelValue', structuredClone(newValue))
      },
    },
  },
})