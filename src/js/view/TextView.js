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
function TextView ()
{
	Object.defineProperties(this, {
		"show": {
			value: function () { TextView.prototype.show.call(this); }
		}
	});
}

TextView.prototype = new ViewObject();

Object.defineProperties(TextView.prototype, {
	/** function that initializes the object with the model */
	"init": {
		value: function (modelObject)
		{
			this.model = modelObject;
			this.htmlContents = document.createTextNode(markdown.toHTML(model.contents));
		}
	}
});

/*
document.querySelector("div").innerHTML =
markdown.toHTML(document.querySelector("p").innerHTML.replace(/<br( \\)?>/gi, "\n").replace(/&nbsp;/gi, " "))
*/
