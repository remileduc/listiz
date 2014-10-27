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
 * class abstract DAO
 * @param database the db
 */
function DAO (database)
{
	Object.defineProperty(this, "db", {
			writable :true
		});
}

Object.defineProperties(DAO.prototype, {
	"NAME": {
		value: "",
		writable: true,
		enumerable: true
	},
	
	"put": {
		/**
		 * insert the given model object in the database.
		 * @param model the model object to insert
		 * @param on success the function to call in case of success. success(id) will be called with the id in the DB of the inserted model object
		 */
		value: function (model, onSuccess)
		{
			this.db.transaction([this.NAME], "readwrite").objectStore(this.NAME).put(this.ModelToDao(model)).onsuccess = function (event) {
				onSuccess(event.target.result);
			};
		}
	},
	
	"get": {
		/**
		 * return the current saved model object with the given ID
		 * @param id the id of the object to retrieve
		 * @param onSuccess(modelObject) the function to call in case of success
		 */
		value: function (id, onSuccess)
		{
			var that = this;
			this.db.transaction([this.NAME]).objectStore(this.NAME).get(id).onsuccess = function (event) {
				onSuccess(that.DaoToModel(event.target.result));
			};
		}
	},
	
	"getAll": {
		/**
		 * return all the model objects that are stored in the object store
		 * @param onSuccess(modelObjects) the function to call in case of success, we give it an array with all the model objects
		 */
		value: function (onSuccess)
		{
			var that = this;
			var models = [];

			this.db.transaction([this.NAME]).objectStore(this.NAME).openCursor().onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor)
				{
					models.push(that.DaoToModel(cursor.value));
					cursor.continue();
				}
				else
					onSuccess(models);
			};
		}
	},
	
	"del": {
		value: function (model, onSuccess)
		{
			this.db.transaction([this.NAME], "readwrite").objectStore(this.NAME).delete(model.id).onsuccess = onSuccess;
		}
	},
	
	"clear": {
		value: function (onSuccess)
		{
			this.db.transaction([this.NAME], "readwrite").objectStore(this.NAME).clear().onsuccess = onSuccess;
		}
	},
	
	"DaoToModel": { // pure virtual method
		writable: true,
		enumerable: true,
		configurable: true
	},
	
	"ModelToDao": { // pure virtual method
		writable: true,
		enumerable: true,
		configurable: true
	}
});
