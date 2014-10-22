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

(function()
{
	var model = null; // the model to see (list or text)
	var parameters = null;
	var type = ""; // the type of the model (list or text)
	
	// first we open / create the database
	openDB(onOpenDBSuccess);
	
	function onOpenDBSuccess ()
	{
		var locationSearch = location.search.substr(1).split(/[=&]/);
		
		// we retrieve the object to display
		if (locationSearch[0] !== "id")
		{
			// main page
			// test retrieve parameters // TODO enlever
			var daop = new DAOParameters(Database.getDatabase(Parameters.DBNAME));
			daop.get(onDAORetrieveSuccess);
		}
		else
		{
			// list, text or parameters
		}
		
		if (type !== Parameters.TYPE)
		{
			// we retrieve the parameters
		}
	}
	
	function onDAORetrieveSuccess(par)
	{
		parameters = par;
		if (parameters != null)
		{
			console.log("Retreived!");
			console.log(parameters);
			Database.eraseDB(Parameters.DBNAME, function(event){console.log("Database erased"); console.log(event);}, onError);
		}
		else
		{
			parameters = new Parameters();
			parameters.sortOrder = Parameters.DESCENDANT;
			parameters.doneAtEnd = false;
			var daop = new DAOParameters(Database.getDatabase(Parameters.DBNAME));
			daop.put(parameters, function(id){console.log("saved!"); console.log(id);});
		}
	}
	
	/** 
	 * open the database
	 * @param onSuccess the function to call in case of success
	 */
	function openDB (onSuccess)
	{
		Database.open(Parameters.DBNAME, Parameters.DBVERSION, onSuccess, onError, onUpgradeNeeded);
	}
	
	/** log the errors of the database */
	function onError (event)
	{
		console.log("DB ERROR:");
		console.log(event);
	}
	
	/** calls all the function to create the database */
	function onUpgradeNeeded (event)
	{
		DAOParameters.DBUpgradeNeeded(event);
	}
})();

