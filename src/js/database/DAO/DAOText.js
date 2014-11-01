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
 * class DAO for parameters
 * @param database the database
 */
function DAOText (database)
{
	Object.defineProperties(this, {
		"db": {
			value: database
		},
	
		"put": {
			value: function (text, onSuccess) { DAOText.prototype.put.call(this, text, onSuccess); }
		},
		
		"get": {
			value: function (id, onSuccess) { DAOText.prototype.get.call(this, id, onSuccess); }
		},
		
		"getAll": {
			value: function (onSuccess) { DAOText.prototype.getAll.call(this, onSuccess); }
		},
		
		"del": {
			value: function (text, onSuccess) { DAOText.prototype.del.call(this, text, onSuccess); }
		},
		
		"clear": {
			value: function (onSuccess) { DAOText.prototype.clear.call(this, onSuccess); }
		}
	});
}
//héritage
DAOText.prototype = new DAO();

Object.defineProperties(DAOText, {
	"NAME": {
		value: "lists",
		enumerable: true
	},
	
	"DBUpgradeNeeded": {
		value: function (event)
		{
			// the object store is already created by List.DBUpgradeNeeded()
			/*var db = event.target.result;
			db.createObjectStore(DAOText.NAME, { keyPath: "id", autoIncrement: true });*/
		}
	}
});

Object.defineProperties(DAOText.prototype, {
	"NAME": {
		value: DAOText.NAME
	},
	
	"DaoToModel": {
		value: function(dao)
		{
			var members = undefined, text = null;
			
			if (typeof dao === "undefined")
				return null;

			text = new Text();
			for (members in dao)
			{
				if (typeof members !== "undefined")
					text[members] = dao[members];
			}
			return text;
		}
	},
	
	"ModelToDao": {
		value: function (model)
		{
			return model;
		}
	}
});
