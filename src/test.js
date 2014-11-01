
function createList ()
{
	var l = new List();
	l.title = "first";
	
	l.addSubEl(new List());
	l.contents[0].title = "second0";
	
	l.addSubEl(new List());
	l.contents[1].title = "second1";
	
	l.contents[1].addSubEl(new List());
	l.contents[1].contents[0].title = "third0";
	
	l.contents[1].addSubEl(new List());
	l.contents[1].contents[1].title = "third1";
	
	l.contents[1].addSubEl(new List());
	l.contents[1].contents[2].title = "third2";
	
	l.addSubEl(new List());
	l.contents[2].title = "second2";
	
	return l;
}

function sort (mainlist, type, order) {
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
}

var l = createList();

