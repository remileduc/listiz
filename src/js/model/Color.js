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
 * A color
 */
function Color ()
{
	Object.defineProperties(this, {
		/** the name of the color */
		"name": {
			enumerable: true,
			writable: true
		},
		
		/** the red component */
		"red": {
			value: 0,
			enumerable: true,
			writable: true
		},

		/** the blue component */
		"blue": {
			value: 0,
			enumerable: true,
			writable: true
		},

		/** the green component */
		"green": {
			value: 0,
			enumerable: true,
			writable: true
		},

		/** the alpha component */
		"alpha": {
			value: 1,
			enumerable: true,
			writable: true
		},
		
		/** return a string representing the color: "rgba(r,g,b,a)" */
		"toStringRGBA": {
			value: function ()
			{
				return "rgba(" + this.red + "," + this.blue + "," + this.green + "," + this.alpha + ")";
			}
		}
	});
	
	this.type = Color.TYPE;
}
//héritage
Color.prototype = new ModelObject();

Object.defineProperty(Color, "TYPE", { value: "color" });

