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
 * represent a list
 */
function List ()
{
	Object.defineProperties(this, {
		"done": {
			value: false,
			enumerable: true,
			writable: true
		},

		"parent": {
			value: null,
			enumerable: true,
			writable: true
		},
		
		/**
		 * add a subElement
		 * @param element the sub element to add (of type List)
		 * @param position the position in the sub elements (can be at the end or in the middle...) by default at the end
		 */
		"addSubEl": {
			value: function (element, position)
			{
				if (typeof position === "undefined")
					this.contents.push(element);
				else if (position === 0)
					this.contents.unshift(element);
				else
					this.contents.splice(position, 0, element);
				element.parent = this;
			}
		},
		
		/**
		 * remove a subElement
		 * @param element the sub element to remove (of type List)
		 */
		"rmSubEl": {
			value: function (element)
			{
				var i = 0;
				
				while (i < this.contents.length && this.contents[i] !== element)
					i++;
				if (i < this.contents.length)
					this.rmSubElIndex(i);
			}
		},
		
		/**
		 * remove a subElement
		 * @param index the index of the element to remove
		 */
		"rmSubElIndex": {
			value: function (index)
			{
				if (index === 0)
					this.contents.shift();
				else if (index === this.contents.length - 1)
					this.contents.pop();
				else if (index > 0 && index < this.contents.length)
					this.contents.splice(index, 1);
			}
		},
		
		/**
		 * move a sub element
		 * @param oldindex the index of the element to move
		 * @param newindex its new index after move
		 */
		"mvSubEl": {
			value: function (oldindex, newindex)
			{
				this.contents.splice(newindex, 0, this.contents.splice(oldindex, 1)[0]);
			}
		},
		
		"toString": {
			value: function (depth)
			{
				var str = this.title + "\n";
				
				if (typeof depth === "undefined")
					depth = 0;
				depth++;
				for (var i = 0; i < this.contents.length; i++)
				{
					for (var j = 0; j < depth; j++)
						str += "\t";
					str += this.contents[i].toString(depth);
				}
				return str;
			}
		}
	});
	
	this.type = List.TYPE;
	this.contents = [];
	this.date = new Date();
}
//héritage
List.prototype = new ModelContainer();

Object.defineProperty(List, "TYPE", { value: "list" });

