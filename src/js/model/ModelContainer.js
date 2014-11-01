/*
listiz is a TODO list for Firefox OS that supports many lists, and even sublists!!!
Copyright © 2014 xinouch
remi.ducceschi@gmail.com

This file is part of listiz

listiz is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

/**
 * abstract class for lists and texts
 */
function ModelContainer ()
{
	Object.defineProperties(this, {
		/** the title of the object, to show in the webpage */
		"title": {
			value: "",
			enumerable: true,
			writable: true
		},

		/** the color of the object */
		"color": {
			value: new Color(),
			enumerable: true,
			writable: true
		},

		/** the contents */
		"contents": {
			value: null,
			enumerable: true,
			writable: true
		},
		
		/** The date of creation */
		"date": {
			enumerable: true,
			writable: true
		}
	});
	
	this.type = ModelContainer.TYPE;
}
//héritage
ModelContainer.prototype = new ModelObject();

Object.defineProperty(ModelContainer, "TYPE", { value: "container" });

