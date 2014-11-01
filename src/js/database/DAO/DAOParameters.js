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
	Object.defineProperties(this, {
		"db": {
			value: database
		},
	
		"put": {
			value: function (parameters, onSuccess) { DAOParameters.prototype.put.call(this, parameters, onSuccess); }
		},
		
		"get": {
			value: function (onSuccess) { DAOParameters.prototype.get.call(this, 1, onSuccess); }
		},
		
		"getAll": {
			value: function (onSuccess) { DAOParameters.prototype.getAll.call(this, onSuccess); }
		},
		
		"del": {
			value: function (parameters, onSuccess) { this.clear(onSuccess); }
		},
		
		"clear": {
			value: function (onSuccess) { DAOParameters.prototype.clear.call(this, onSuccess); }
		}
	});
}
//héritage
DAOParameters.prototype = new DAO();

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
	}
});

Object.defineProperties(DAOParameters.prototype, {
	"NAME": {
		value: DAOParameters.NAME
	},
	
	"DaoToModel": {
		value: function(dao)
		{
			var members, parameters = null;
			
			if (typeof dao === "undefined")
				return null;

			parameters = new Parameters();
			for (members in dao)
			{
				if (typeof members !== "undefined" && members !== "id")
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
