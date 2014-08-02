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
function BaseDB ()
{
	/** the database */
	var db = null;
	/** contains all the listener of this object */
	var listeners = {
		upgradeneeded: [], // can only be called during openning
		success: [], // can be called by the database or a request
		error: [] // can be called by the database or a request
	};

	// public:
	Object.defineProperties(this, {
		/**
		 * open the database.
		 * it opens the database, and adds to it the listeners.
		 * @param name the name of the database
		 */
		"open": {
			value: function (name)
			{
				var onOpen = function (event)
				{
					db = event.target.result;
					db.addEventListener("error", error);
				};
				
				var onUpgrade = function (event)
				{
					db = event.target.result;
					db.addEventListener("error", error);
					upgradeneeded(); // we call this here, otherwise we're not sure the DB is set when we call it
				};
				
				var request = indexedDB.open(name);
				request.addEventListener("success", onOpen);
				request.addEventListener("success", success);
				request.addEventListener("upgradeneeded", onUpgrade);
				//request.addEventListener("upgradeneeded", upgradeneeded);
				request.addEventListener("error", error);
			}
		},
		
		/** close the database */
		"close": {
			value: function ()
			{
				if (db !== null)
					db.close();
			}
		},
		
		/** erase the database, all its content is lost */
		"eraseDB": {
			value: function ()
			{
				var name, request;
				
				if (db !== null)
				{
					name = db.name;
					this.close();
					request = indexDB.deleteDatabase(name);
					request.addEventListener("error", error);
					request.addEventListener("success", success);
				}
			}
		},
		
		// For the events:
		/**
		 * add an event listener that will be called when the database or a request send such an event ("upgradeneeded",
		 * "success", "error")
		 */
		"addEventListener": {
			value: function (type, listener)
			{
				if (typeof listeners[type] !== "undefined")
					listeners[type].push(listener);
			}
		},

		/** remove an event listener ("upgradeneeded", "success", "error") */
		"removeEventListener": {
			value: function (type, listener)
			{
				var index;
				if (typeof listeners[type] !== "undefined")
				{
					index = listeners[type].indexOf(listener);
					if (index >= 0)
						listeners[type].splice(index, 1);
				}
			}
		}
	});

	// private:
	var success = function (event)
	{
		callListeners("success", event);
	};
	
	var error = function (event)
	{
		callListeners("error", event);
	};
	
	var upgradeneeded = function (event)
	{
		callListeners("upgradeneeded", event);
	};
	
	/**
	 * call all the registered listeners for this eventName
	 * @param eventName the name of the event (upgradeneeded, success or error)
	 * @param event then event sent that we must send to the listeners
	 */
	var callListeners = function (eventName, event)
	{
		var i;
		for (i = 0; i < listeners[eventName].length; i++)
			listeners[eventName][i](event);
	};
}
