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
//héritage
ListView.prototype = new ViewObject();

Object.defineProperties(ListView.prototype, {
	/**
	 * set up an element with all the html elements and the callback functions
	 * @param element the element to setup
	 * @param modelObject the model object associated
	 */
	"setup": {
		value: function (modelObject)
		{
			this.model = modelObject;
			
			this.htmlMove = document.createElement("button");
			this.htmlMove.classList.add("movebtn");
			this.htmlMove.textContent = "↕";
			
			this.htmlText = document.createElement("span");
			this.htmlText.textContent = this.model.title;
			this.htmlText.classList.add("textlist");
			this.htmlText.addEventListener("click", this.onExpand.bind(this));
			
			this.htmlAdd = document.createElement("button");
			this.htmlAdd.classList.add("addbtn");
			this.htmlAdd.textContent = "+";
			
			this.htmlRm = document.createElement("button");
			this.htmlRm.classList.add("rmbtn");
			this.htmlRm.textContent = "×";
			this.htmlRm.addEventListener("click", this.onDelete.bind(this));

			this.htmlUl = document.createElement("ul");
			if (modelObject.parent === null) // the head of the list
				this.htmlContents = this.htmlUl;
			else
			{
				this.htmlContents = document.createElement("li");
				this.htmlContents.appendChild(this.htmlMove);
				this.htmlContents.appendChild(this.htmlText);
				this.htmlContents.appendChild(this.htmlAdd);
				this.htmlContents.appendChild(this.htmlRm);
				this.htmlContents.appendChild(this.htmlUl);
				this.setExpandable(this.model.contents.length !== 0);
			}
		}
	},
	
	/** function that initializes the object with the model */
	"init": {
		value: function (modelObject)
		{
			var i, l;
			
			this.setup(modelObject);
			for (i = 0; i < this.model.contents.length; i++)
			{
				l = new ListView();
				l.init(this.model.contents[i]);
				l.parent = this;

				this.subs.push(l);
				this.htmlUl.appendChild(l.htmlContents);
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
			if (this.subs.length === 0)
				this.setExpandable(true);
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
			if (this.subs.length === 0)
				this.setExpandable(true);
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
			if (this.subs.length === 0)
				this.setExpandable(false);
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

	// **************************** CALLBACKS ****************************
	/** expand or not a list item */
	"onExpand": {
		value: function ()
		{
			if (this.subs.length > 0)
				this.htmlContents.dataset.expand = this.htmlContents.dataset.expand === "true" ? "false" : "true";
		}
	},
	
	/** delete an item */
	"onDelete": {
		value: function (e)
		{
			e.preventDefault();
			
			this.parent.rmSubEl(this);
		}
	},
	
	// **************************** PRIVATE ****************************
	/**
	 * set the item as expandable
	 * @param isExpandable if true, the item is expandable
	 */
	"setExpandable": {
		value: function (isExpandable)
		{
			if (isExpandable)
			{
				this.htmlContents.classList.remove("notexpandable");
				this.htmlContents.classList.add("expandable");
				this.htmlContents.dataset.expand = "false";
			}
			else
			{
				this.htmlContents.classList.remove("expandable");
				this.htmlContents.classList.add("notexpandable");
				delete this.htmlContents.dataset.expand;
			}
		}
	}
});

