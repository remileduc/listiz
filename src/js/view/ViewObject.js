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
 * view object that contains only the basic informations.
 */
function ViewObject ()
{
	Object.defineProperties(this, {
		/** the model to show */
		"model": {
			value: null,
			enumerable: true,
			writable: true
		},


		/** bool: if true, the user can change the values in the page */
		"editable": {
			enumerable: true,
			writable: true
		},

		/** the contents to integrate to the webpage */
		"htmlContents": {
			enumerable: true,
			writable: true
		}
	});
}

Object.defineProperties(ViewObject.prototype, {
	/** function that initializes the object with the model */
	"init": {
		writable: true
	},
	
	/** prints the contents in the web page */
	"show": {
		value: function ()
		{
			document.querySelector("#title").textContent = this.model.title;
			document.querySelector("#contents").appendChild(this.htmlContents);
		}
	},
	
	/** remove the contents of the web page */
	"hide": {
		value: function ()
		{
			document.querySelector("#title").textContent = "";
			document.querySelector("#contents").removeChild(this.htmlContents);
		}
	}
});

