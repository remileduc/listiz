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
 * Model for a text object
 */
function ModelText ()
{
	Object.defineProperties(this, {
		/** the type (ModelObject.LIST or ModelObject.TEXT) */
		"type" : {
			value : ModelObject.TEXT,
			writable : false
		},

		/** tells if the text is markdown formatted or not */
		"useMarkdown" : {
			value : false,
			enumerable : true,
			writable : true
		},

		/** export the object in a string */
		"toString" : {
			value : function ()
			{
			},
			writable : false
		}
	});
}

Object.defineProperty(ModelObject, "TEXT", {
	value : "text"
});

// héritage
ModelText.prototype = new ModelObject();
