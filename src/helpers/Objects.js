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

export class Voice {
  constructor() {
    this.note = ""
    this.drone = false
    this.links = []
  }
}
export class Voices {
  constructor() {
    this.soprano = new Voice()
    // this.mezzo = new Voice()
    this.alto = new Voice()
    this.tenor = new Voice()
    // this.baritone = new Voice()
    this.bass = new Voice()
  }
}

export class Song {
  constructor() {
    this.title = ""
    this.description = ""
    this.lyrics = ""
    this.phonetic = ""
    this.translation = ""
    this.lead = ""
    this.links = []
    this.tags = []
    this.voices = new Voices()
    this.parent = ""
  }
}