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
 * class DAO for the lists in the DB
 * @param database the database
 */
function DAOList (database)
{
	Object.defineProperties(this, {
		"db": {
			value: database
		},
	
		"put": {
			value: function (list, onSuccess) { DAOList.prototype.put.call(this, list, onSuccess); }
		},
		
		"get": {
			value: function (onSuccess) { DAOList.prototype.get.call(this, 1, onSuccess); }
		},
		
		"getAll": {
			value: function (onSuccess) { DAOList.prototype.getAll.call(this, onSuccess); }
		},
		
		"del": {
			value: function (list, onSuccess) { DAOList.prototype.del.call(this, list, onSuccess); }
		},
		
		"clear": {
			value: function (onSuccess) { DAOList.prototype.clear.call(this, onSuccess); }
		}
	});
}
//héritage
DAOList.prototype = new DAO();

Object.defineProperties(DAOList, {
	"NAME": {
		value: "lists",
		enumerable: true
	},
	
	"DBUpgradeNeeded": {
		value: function (event)
		{
			var db = event.target.result;
			db.createObjectStore(DAOList.NAME, { keyPath: "id", autoIncrement: true });
		}
	}
});

Object.defineProperties(DAOList.prototype, {
	"NAME": {
		value: DAOList.NAME
	},
	
	"DaoToModel": {
		value: function(dao)
		{
			var members, list = null, i;
			
			if (typeof dao === "undefined")
				return null;

			list = new List();
			
			if (typeof dao.contents.push === "undefined") // this is not an array
				dao.contents = JSON.parse(dao.contents);
			for (members in dao)
			{
				if (typeof members !== "undefined" && members !== "contents" && members !== "color")
					list[members] = dao[members];
			}
			list.color = new Color();
			for (members in dao.color)
			{
				if (typeof members !== "undefined")
					list.color[members] = dao.color[members];
			}
			
			for (i = 0; i < dao.contents.length; i++)
				list.addSubEl(this.DaoToModel(dao.contents[i]));
			
			return list;
		}
	},
	
	"ModelToDao": {
		value: function (model)
		{
			var copy = { contents: "" };
			var members, toJSON = [];
			
			for (members in model)
			{
				if (typeof members !== "undefined" && members !== "parent")
				{
					toJSON.push(members);
					if (members !== "contents")
						copy[members] = model[members];
				}
			}
			for (members in model.color)
			{
				if (typeof members !== "undefined")
					toJSON.push(members);
			}
			copy.contents = JSON.stringify(model.contents, toJSON, "\t");
			
			return copy;
		}
	}
});
