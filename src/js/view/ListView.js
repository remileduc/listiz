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
 * view object for a list.
 */
function ListView ()
{
	Object.defineProperties(this, {
		/** button to move the object */
		"htmlMove": {
			enumerable: true,
			writable: true
		},

		/** the input where we show the text */
		"htmlText": {
			enumerable: true,
			writable: true
		},

		/** button to add */
		"htmlAdd": {
			enumerable: true,
			writable: true
		},

		/** button to remove */
		"htmlRm": {
			enumerable: true,
			writable: true
		},

		/** the list that contains the sub elements */
		"htmlUl": {
			enumerable: true,
			writable: true
		},

		/** listview parent element */
		"parent": {
			value: null,
			enumerable: true,
			writable: true
		},

		/** sub elements */
		"subs": {
			value: [],
			enumerable: true,
			writable: true
		},
		
		"show": {
			value: function () { ListView.prototype.show.call(this); }
		}
	});
}

ListView.prototype = new ViewObject();

Object.defineProperties(ListView.prototype, {
	/**
	 * create an element with all the html elements and the callback functions
	 * @param element the element to setup
	 * @param modelObject the model object associated
	 */
	"setup": {
		value: function (element, modelObject)
		{
			element.model = modelObject;
			
			element.htmlMove = document.createElement("button");
			element.htmlMove.classList.add("movebtn");
			element.htmlMove.textContent = "↕";
			
			element.htmlText = document.createElement("span");
			element.htmlText.textContent = element.model.title;
			element.htmlText.classList.add("textlist");
			element.htmlText.addEventListener("click", this.onExpand);
			
			element.htmlAdd = document.createElement("button");
			element.htmlAdd.classList.add("addbtn");
			element.htmlAdd.textContent = "+";
			
			element.htmlRm = document.createElement("button");
			element.htmlRm.classList.add("rmbtn");
			element.htmlRm.textContent = "×";
			element.htmlRm.addEventListener("click", this.onDelete.bind(element));
			
			element.htmlContents = document.createElement("li");
			element.htmlContents.appendChild(element.htmlMove);
			element.htmlContents.appendChild(element.htmlText);
			element.htmlContents.appendChild(element.htmlAdd);
			element.htmlContents.appendChild(element.htmlRm);
			
			if (element.model.contents.length !== 0)
			{
				element.htmlContents.classList.add("expandable");
				element.htmlContents.dataset.expand = "false";
			}
		}
	},
	
	/** function that initializes the object with the model */
	"init": {
		value: function (modelObject)
		{
			var i, l;
			
			if (modelObject.parent === null) // the head of the list
				this.model = modelObject;
			else
				this.setup(this, modelObject);
			
			if (this.model.contents.length !== 0)
			{
				this.htmlUl = document.createElement("ul");
				if (typeof this.htmlContents === "undefined") // head of the list
					this.htmlContents = this.htmlUl;
				else
					this.htmlContents.appendChild(this.htmlUl);
				for (i = 0; i < this.model.contents.length; i++)
				{
					l = new ListView();
					l.init(this.model.contents[i]);
					l.parent = this;

					this.subs.push(l);
					this.htmlUl.appendChild(l.htmlContents);
				}
			}
		}
	},
	
	/**
	 * prepend a subElement
	 * @param element the sub element to add (of type List)
	 */
	"prependSubEl": {
		value: function (element)
		{
			this.subs.unshift(element);
			this.model.addSubEl(element.model, 0);
			element.parent = this;
			this.htmlContents.insertBefore(element.htmlContents, this.htmlContents.firstChild);
		}
	},
	
	/**
	 * append a subElement
	 * @param element the sub element to add (of type List)
	 */
	"appendSubEl": {
		value: function (element)
		{
			this.subs.push(element);
			this.model.addSubEl(element);
			element.parent = this;
			this.htmlContents.appendChild(element.htmlContents);
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
			
			while (i < this.subs.length && this.subs[i] !== element)
				i++;
			if (i < this.subs.length)
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
			this.htmlUl.removeChild(this.subs[index].htmlContents);
			this.model.rmSubElIndex(index);

			if (index === 0)
				this.subs.shift();
			else if (index === this.subs.length - 1)
				this.subs.pop();
			else if (index > 0 && index < this.subs.length)
				this.subs.splice(index, 1);
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
			this.htmlContents.removeChild(this.subs[oldindex].htmlContents);
			this.subs.splice(newindex, 0, this.subs.splice(oldindex, 1)[0]);
			this.model.mvSubEl(oldindex, newindex);
			if (newindex >= this.subs.length - 1)
				this.htmlContents.appendChild(this.subs[newindex].htmlContents);
			else
				this.htmlContents.insertBefore(this.subs[newindex].htmlContents, this.subs[newindex + 1].htmlContents);
		}
	},
	
	/** expand or not a list item */
	"onExpand": {
		value: function () { this.parentElement.dataset.expand = this.parentElement.dataset.expand === "true" ? "false" : "true"; }
	},
	
	/** delete an item */
	"onDelete": {
		value: function (e)
		{
			e.preventDefault();
			
			this.parent.rmSubEl(this);
		}
	}
});

