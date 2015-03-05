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
	var _done = false;
	Object.defineProperties(this, {
		/**
		 * tells if the item is done or not
		 * @param isDone if true, the item is done, and all its children are done. If all its brothers are done too, its parent is set to done.
		 * If false, the item is not done, and its parent is not done too
		 */
		"done": {
			enumerable: true,
			get: function () { return _done; },
			set: function (isDone)
			{
				var i, size;
				
				if (_done !== isDone)
				{
					_done = isDone;
					this.fire("done");
					if (!_done && this.parent !== null && this.parent.done) // if !done, parent is not done too
						this.parent.done = false;
					else if (_done) // if done
					{
						for (i = 0, size = this.contents.length; i < size; i++) // children are done too
							this.contents[i].done = _done;
						if (this.parent !== null && !this.parent.done)
						{
							for (i = 0, size = this.parent.contents.length; i < size; i++) // if brothers are done, parent is done too
							{
								if (!this.parent.contents[i].done)
									return;
							}
							this.parent.done = _done;
						}
					}
				}
			}
		},

		"parent": {
			value: null,
			enumerable: true,
			writable: true
		},
		
		"listeners": {
			value: { done: [] }
		}
	});
	
	this.type = List.TYPE;
	this.contents = [];
	this.date = new Date();
}
//héritage
List.prototype = new ModelContainer();

Object.defineProperties(List.prototype, {
	/**
	 * add a subElement
	 * @param element the sub element to add (of type List)
	 * @param position the position in the sub elements (can be at the end or in the middle...) by default at the end
	 */
	"addSubEl": {
		value: function (element, position)
		{
			if (this.contents.indexOf(element) !== -1)
				return;
			if (typeof position === "undefined")
				this.contents.push(element);
			else if (position === 0)
				this.contents.unshift(element);
			else
				this.contents.splice(position, 0, element);
			element.parent = this;
			element.done = element.done; // sets the parent / children done member
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
			var delel = this.contents[index];
			var i, size;
			if (index === 0)
				this.contents.shift();
			else if (index === this.contents.length - 1)
				this.contents.pop();
			else
				this.contents.splice(index, 1);
			delel.parent = null;
			if (this.parent !== null)
			{
				for (i = 0, size = this.contents.length; i < size; i++) // if brothers are done, parent is done too
				{
					if (!this.contents[i].done)
						return;
				}
				this.parent.done = true;
			}
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
	},
	
	"addEventListener": {
		value: function(type, listener)
		{
			if (typeof this.listeners[type] !== "undefined")
				this.listeners[type].push(listener);
		}
	},

	"removeEventListener": {
		value: function(type, listener)
		{
			var index;
			if (typeof this.listeners[type] !== "undefined")
			{
				index = this.listeners[type].indexOf(listener);
				if (index >= 0)
					this.listeners[type].splice(index, 1);
			}
		}
	},
	
	"fire": {
		value: function(event)
		{
			var i, len, evt;
			if (typeof this.listeners[event] !== "undefined")
			{
				len = this.listeners[event].length;
				evt = { type: event, target: this };
	
				for (i = 0; i < len; i++)
				{
					console.log("FIRE IN THE HOLE");
					this.listeners[event][i].call(this, evt);
				}
			}
		}
	}
});

Object.defineProperty(List, "TYPE", { value: "list" });

