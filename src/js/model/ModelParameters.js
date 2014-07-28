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
 * represents the parameters used in the program
 */
function ModelParameters ()
{
	Object.defineProperties(this, {
		/** the criterion we use to sort the lists in the main screen */
		"sortType": {
			value: ModelParameters.NAME,
			enumerable: true,
			writable: true
		},

		/** if the sort is ascendant or descendant */
		"sortOrder": {
			value: ModelParameters.ASCENDANT,
			enumerable: true,
			writable: true
		},

		/** the default color when we create a list */
		"defaultColor": {
			value: new Color(),
			enumerable: true,
			writable: true
		},
		
		/** tells if the done items must be put at the end of the list or not */
		"doneAtEnd": {
			value: true,
			enumerable: true,
			writable: true
		},
		
		/** tells if the text editor should use markdown or not */
		"useMarkDown": {
			value: false,
			enumerable: true,
			writable: true
		}
	});
}

Object.defineProperties(ModelParameters, {
	"ASCENDANT": {
		value: "ascendant"
	},

	"DESCENDANT": {
		value: "descendant"
	},

	"DATE": {
		value: "date"
	},

	"NAME": {
		value: "name"
	},

	"COLOR": {
		value: "color"
	}
});

// héritage
ModelParameters.prototype = Object.create(BasicModelObject.prototype);
