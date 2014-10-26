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
 * interacts with the database
 */
var Database = {};

Object.defineProperties(Database, {
	/** private, don't use */
	"db": {
		value: [],
		writable: true
	},

	/**
	 * return the database. Must have been opened before.
	 * 
	 * @param name the name of the database
	 */
	"getDatabase": {
		value: function (name)
		{
			if (typeof Database.db[name] === "undefined")
				throw new Error(name + " is not an opened database.");
			return Database.db[name];
		}
	},

	/**
	 * open the database. it opens the database, and adds to it the listeners.
	 * 
	 * @param name the name of the database
	 * @param success the callback function to call in case of success. success(db) in parameter the DB newly created
	 * @param error the callback function to call in case of error (this callback is permanently added to the database)
	 * @param upgradeneeded the callback function to call in case of upgrade needed
	 */
	"open": {
		value: function (name, version, success, error, upgradeneeded)
		{
			if (typeof Database.db[name] !== "undefined")
				throw new Error(name + " is already opened.");

			var onOpen = function (event)
			{
				Database.db[name] = event.target.result;
				Database.db[name].addEventListener("error", error);
				if (typeof success !== "undefined")
					success(Database.db[name]); // we call this here, otherwise we're not sure the DB is set when we call it
			};

			var onUpgrade = function (event)
			{
				Database.db[name] = event.target.result;
				Database.db[name].addEventListener("error", error);
				if (typeof success !== "undefined")
					upgradeneeded(event); // we call this here, otherwise we're not sure the DB is set when we call it
			};

			var request = indexedDB.open(name, version);
			request.addEventListener("success", onOpen);
			// request.addEventListener("success", success);
			request.addEventListener("upgradeneeded", onUpgrade);
			// request.addEventListener("upgradeneeded", upgradeneeded);
			request.addEventListener("error", error);
		}
	},

	/** close the database */
	"close": {
		value: function (name)
		{
			if (typeof Database.db[name] === "undefined")
				throw new Error(name + " is not an opened database.");
			Database.db[name].close();
			delete Database.db[name];
		}
	},

	/**
	 * erase the database, all its content is lost
	 * 
	 * @param name the name of the database to erase
	 * @param success the callback function to call in case of success
	 * @param error the callback function to call in case of error
	 */
	"eraseDB": {
		value: function (name, success, error)
		{
			var request;

			if (typeof Database.db[name] !== "undefined")
				Database.close(name);
			request = indexedDB.deleteDatabase(name);
			request.addEventListener("error", error);
			request.addEventListener("success", success);
		}
	}
});
