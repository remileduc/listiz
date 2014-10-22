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
function DAOParameters (database)
{
	var db = database;
	
	Object.defineProperties(this, {
		"put": {
			/**
			 * insert the given parameters int the database.
			 * @param parameters the parameters to insert
			 * @param on success the function to call in case of success. success(id) will be called with the id in the DB of the inserted parameters
			 */
			value: function (parameters, onSuccess)
			{
				db.transaction([DAOParameters.NAME], "readwrite").objectStore(DAOParameters.NAME).put(DAOParameters.ModelToDao(parameters)).onsuccess = function (event) {
					onSuccess(event.target.result);
				};
			}
		},
		
		"get": {
			/**
			 * return the current saved parameters (there can only be one parameter object in the DB)
			 * @param onSuccess (parameters) the function to call in case of success
			 */
			value: function (onSuccess)
			{
				db.transaction([DAOParameters.NAME]).objectStore(DAOParameters.NAME).get(1).onsuccess = function (event) {
					onSuccess(DAOParameters.DaoToModel(event.target.result));
				};
			}
		},
		
		"delete": {
			value: function (onSuccess)
			{
				this.clear(onSuccess);
			}
		},
		
		"clear": {
			value: function (onSuccess)
			{
				db.transaction([DAOParameters.NAME], "readwrite").objectStore(DAOParameters.NAME).clear().onsuccess = onSuccess;
			}
		}
	});
}

Object.defineProperties(DAOParameters, {
	"NAME": {
		value: "parameters",
		enumerable: true
	},
	
	"DBUpgradeNeeded": {
		value: function (event)
		{
			var db = event.target.result;
			db.createObjectStore(DAOParameters.NAME, { keyPath: "id", autoIncrement: true });
		}
	},
	
	"DaoToModel": {
		value: function(dao)
		{
			var members = undefined, parameters = null;
			
			if (typeof dao === "undefined")
				return null;

			parameters = new Parameters();
			for (members in dao)
			{
				if (members !== "id")
					parameters[members] = dao[members];
			}
			return parameters;
		}
	},
	
	"ModelToDao": {
		value: function (model)
		{
			return model;
		}
	}
});
