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
		
		/** button to check or not the item */
		"htmlCehck": {
			enumerable: true,
			writable: true
		},

		/** the input where we show the text */
		"htmlText": {
			enumerable: true,
			writable: true
		},

		/** button to add */
		"htmlExpand": {
			enumerable: true,
			writable: true
		},

		/** button to add */
		"htmlAdd": {
			enumerable: true,
			writable: true
		},

		/** button to add */
		"htmlEdit": {
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
			value: document.createElement("ul"),
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
		},

		// **************************** CALLBACKS ****************************
		/** expand or not a list item */
		"onExpand": {
			value: (function ()
			{
				if (this.subs.length > 0)
				{
					this.htmlContents.dataset.expand = this.htmlContents.dataset.expand === "true" ? "false" : "true";
					this.htmlExpand.textContent = this.htmlContents.dataset.expand === "true" ? "-" : "+";
				}
			}).bind(this)
		},
		
		/** add a new subitem at the end */
		"onAppend": {
			value: (function ()
			{
				var element = new ListView();
				element.init(new List());
				this.appendSubEl(element);
			}).bind(this)
		},
		
		/** add a new subitem at the beginning */
		"onPrepend": {
			value: (function ()
			{
				var element = new ListView();
				element.init(new List());
				this.appendSubEl(element);
			}).bind(this)
		},
		
		/** delete an item */
		"onDelete": {
			value: (function ()
			{
				this.parent.rmSubEl(this);
			}).bind(this)
		},
		
		/** call when an item must be set to done */
		"onDone": {
			value: (function (e)
			{
				this.setDone(e.type === "done" ? this.model.done : !this.model.done);
			}).bind(this)
		},
		
		/** call when an item has changed */
		"onChange": {
			value: (function (e)
			{
				this.htmlText.textContent = this.htmlEdit.value;
			}).bind(this)
		}
	});
	
	this.htmlContents = this.htmlUl;
}
//héritage
ListView.prototype = new ViewObject();

Object.defineProperties(ListView.prototype, {
	// **************************** ACCESSORS ****************************
	/** function that initializes the object with the model */
	"init": {
		value: function (modelObject)
		{
			var i, l;
			
			this.model = modelObject;
			this.model.addEventListener("done", this.onDone);
			this.htmlContents = this.htmlUl;
			for (i = 0; i < this.model.contents.length; i++)
			{
				l = new ListView();
				l.init(this.model.contents[i]);
				this.appendSubEl(l);
			}
		}
	},

	/**
	 * sets the item to done
	 * @param done if true the item is done.
	 */
	"setDone": {
		value: function (done)
		{
			this.htmlContents.dataset.done = done;
			this.htmlCheck.checked = done;
			if (this.model.done !== done)
				this.model.done = done;
		}
	},
	
	// **************************** MANAGE FUNCTIONS ****************************
	/**
	 * prepend a subElement
	 * @param element the sub element to add (of type ListView)
	 */
	"prependSubEl": {
		value: function (element)
		{
			element.prepareSubEl();
			this.subs.unshift(element);
			this.model.addSubEl(element.model, 0);
			element.parent = this;
			this.htmlUl.insertBefore(element.htmlContents, this.htmlContents.firstChild);
			this.setExpandable(true);
		}
	},
	
	/**
	 * append a subElement
	 * @param element the sub element to add (of type ListView)
	 */
	"appendSubEl": {
		value: function (element)
		{
			element.prepareSubEl();
			this.subs.push(element);
			this.model.addSubEl(element.model);
			element.parent = this;
			this.htmlUl.appendChild(element.htmlContents);
			this.setExpandable(true);
		}
	},
	
	/**
	 * remove a subElement
	 * @param element the sub element to remove (of type ListListView)
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

			if (index >= 0 && index <= this.subs.length)
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
	
	// **************************** PRIVATE ****************************
	/**
	 * transforms the element in a sub element with all the html elements...
	 */
	"prepareSubEl": {
		value: function ()
		{
			this.htmlMove = document.createElement("button");
			this.htmlMove.classList.add("movebtn");
			this.htmlMove.textContent = "↕";
			
			this.htmlCheck = document.createElement("input");
			this.htmlCheck.value = "";
			this.htmlCheck.setAttribute("type", "checkbox");
			this.htmlCheck.classList.add("checkdone");
			this.htmlCheck.addEventListener("click", this.onDone);
			
			this.htmlText = document.createElement("span");
			this.htmlText.textContent = this.model.title;
			this.htmlText.classList.add("textlist");
			this.htmlText.addEventListener("click", this.onDone);
			
			this.htmlEdit = document.createElement("input");
			this.htmlEdit.value = this.model.title;
			this.htmlEdit.setAttribute("type", "text");
			this.htmlEdit.setAttribute("placeholder", "Écrivez votre tâche ici");
			this.htmlEdit.setAttribute("required", "required");
			this.htmlEdit.setAttribute("autocomplete", "off");
			this.htmlEdit.setAttribute("inputmode", "latin-prose");
			this.htmlEdit.setAttribute("spellcheck", "true");
			this.htmlEdit.classList.add("textedit");
			this.htmlEdit.addEventListener("input", this.onChange);
			
			this.htmlExpand = document.createElement("button");
			this.htmlExpand.classList.add("expandbtn");
			this.htmlExpand.textContent = "+";
			this.htmlExpand.addEventListener("click", this.onExpand);
			
			this.htmlAdd = document.createElement("button");
			this.htmlAdd.classList.add("addbtn");
			this.htmlAdd.textContent = "+";
			this.htmlAdd.addEventListener("click", this.onAppend);
			
			this.htmlRm = document.createElement("button");
			this.htmlRm.classList.add("rmbtn");
			this.htmlRm.textContent = "×";
			this.htmlRm.addEventListener("click", this.onDelete);
			
			this.htmlContents = document.createElement("li");
			this.htmlContents.appendChild(this.htmlMove);
			this.htmlContents.appendChild(this.htmlCheck);
			this.htmlContents.appendChild(this.htmlText);
			this.htmlContents.appendChild(this.htmlEdit);
			this.htmlContents.appendChild(this.htmlExpand);
			this.htmlContents.appendChild(this.htmlAdd);
			this.htmlContents.appendChild(this.htmlRm);
			this.htmlContents.appendChild(this.htmlUl);
			this.setExpandable(this.model.contents.length !== 0);
			this.setDone(this.model.done);
		}
	},
	
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

