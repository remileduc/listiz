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
 * class DAO for the main list in the DB
 * @param database the database
 */
function DAOMainList (database)
{
	Object.defineProperties(this, {
		"db": {
			value: database
		},
	
		"put": {
			value: function (list, onSuccess) { DAOMainList.prototype.put.call(this, list, onSuccess); }
		},
		
		"get": {
			value: function (onSuccess) { DAOMainList.prototype.get.call(this, 1, onSuccess); }
		},
		
		"getAll": {
			value: function (onSuccess) { DAOMainList.prototype.getAll.call(this, onSuccess); }
		},
		
		/**
		 * return the main list ordered as required
		 * @param type the type of ordering: Parameters.(DATE | TITLE | COLOR)
		 * @param order the order: Parameters.(ASCENDANT | DESCENDANT)
		 * @param onSuccess the method to call in case of success: onSuccess(mainList)
		 */
		"getAllSorted": {
			value: function (type, order, onSuccess)
			{
				this.get(function(mainlist) {
					if (type === Parameters.TITLE && order === Parameters.ASCENDANT)
						mainlist.contents.sort();
					else if (type === Parameters.TITLE && order === Parameters.DESCENDANT)
					{
						mainlist.contents.sort(function (a, b) {
							return a.title < b.title ? 1 : -1;
						});
					}
					else if (type === Parameters.DATE && order === Parameters.ASCENDANT)
					{
						mainlist.contents.sort(function (a, b) {
							return a.date.getTime() - b.date.getTime();
						});
					}
					else if (type === Parameters.DATE && order === Parameters.DESCENDANT)
					{
						mainlist.contents.sort(function (a, b) {
							return b.date.getTime() - a.date.getTime();
						});
					}
					else if (type === Parameters.COLOR && order === Parameters.ASCENDANT)
					{
						mainlist.contents.sort(function (a, b) {
							return a.color.sortBefore(b);
						});
					}
					else if (type === Parameters.COLOR && order === Parameters.DESCENDANT)
					{
						mainlist.contents.sort(function (a, b) {
							return b.color.sortBefore(a);
						});
					}
					
					onSuccess(mainlist);
				});
			}
		},
		
		"del": {
			value: function (list, onSuccess) { this.clear(onSuccess); }
		},
		
		"clear": {
			value: function (onSuccess) { DAOMainList.prototype.clear.call(this, onSuccess); }
		}
	});
}
//héritage
DAOMainList.prototype = new DAOList();

Object.defineProperties(DAOMainList, {
	"NAME": {
		value: "mainlist",
		enumerable: true
	},
	
	"DBUpgradeNeeded": {
		value: function (event)
		{
			var db = event.target.result;
			db.createObjectStore(DAOMainList.NAME, { keyPath: "id", autoIncrement: true });
		}
	}
});

Object.defineProperties(DAOMainList.prototype, {
	"NAME": {
		value: DAOMainList.NAME
	}
});
