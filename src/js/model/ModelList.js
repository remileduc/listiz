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
 * @param parent the parent element (null if none, it is the default)
 */
function ModelList (parent)
{
	Object.defineProperties(this, {
		/** the type (ModelObject.LIST or ModelObject.TEXT) */
		"type": {
			value: ModelObject.LIST,
			writable: false
		},
		
		/** tells if the item is done or not (stripped) */
		"done": {
			value: false,
			writable: true,
			enumerable: true
		},
		
		/** tells if the item is done or not (stripped) */
		"parentElement": {
			value: null,
			writable: true
		},
		
		/** tells if the item is done or not (stripped) */
		"subElements": {
			value: [],
			writable: true,
			enumerable: true
		},
		
		/** 
		 * at a sub-element at the given position
		 * @param element the new element
		 * @param position the position where insert element (at the end by default)
		 */
		"addSubElement": {
			value: function(element, position)
			{
				element.parentElement = this;
				if (typeof position === "undefined")
					this.subElements.push(element);
				else
					this.subElements.splice(position, 0, element);
			}
		},
		
		/**
		 * remove the given element
		 * @param position the position of the element to remove
		 */
		"removeSubElement": {
			value: function(position)
			{
				this.subElements[position].parentElement = null;
				this.subElements.splice(position, 1);
			}
		},
		
		/**
		 * move the element to its new position
		 * @param oldPos the old position
		 * @param newPos the new position
		 */
		"moveElement": {
			value: function(oldPos, newPos)
			{
				var tmp = this.subElements[oldPos];
				this.subElements[oldPos] = this.subElements[newPos];
				this.subElements[newPos] = tmp;
			}
		},
	
		/** export the object in a string */
		"toString": {
			value: function(){},
			writable: false
		}
	});
	
	if (!(typeof parent === "undefined"))
		parent.addSubElement(this);
}

Object.defineProperty(ModelObject, "LIST", {value: "list"});

// héritage
ModelList.prototype = Object.create(ModelObject.prototype);
