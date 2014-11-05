
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
	
	var suppr = new List();
	l.addSubEl(suppr);
	l.contents[2].title = "second2";
	
	l.addSubEl(new List());
	l.contents[3].title = "second3";
	
	// tests
	l.contents[1].mvSubEl(0, 2);
	l.rmSubEl(suppr);
	
	return l;
}

var l = createList();
var lv = new ListView();
lv.init(l);
lv.show();
var s = document.querySelector("section");

