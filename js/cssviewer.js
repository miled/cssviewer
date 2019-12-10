/*!
* CSSViewer, A Google Chrome Extension for fellow web developers, web designers, and hobbyists.
*
* https://github.com/miled/cssviewer
* https://chrome.google.com/webstore/detail/cssviewer/ggfgijbpiheegefliciemofobhmofgce
*
* Copyright (c) 2006, 2008 Nicolas Huon
*
* This source code is licensed under the GNU General Public License,
* Version 2. See the file COPYING for more details.
*
* This version was modified on 12/2019 to support css variables.
*
*/

/*
** Globals
*/

var CSSViewer_element

var CSSViewer_element_cssDefinition

var CSSViewer_container

var CSSViewer_current_element

// CSS Properties
var CSSViewer_pFont = new Array(
	'font-family',
	'font-size',
	'font-style',
	'font-variant',
	'font-weight',
	'letter-spacing',
	'line-height',
	'text-decoration',
	'text-align',
	'text-indent',
	'text-transform',
	'vertical-align',
	'white-space',
	'word-spacing',
	'background-attachment',
	'background-color',
	'background-image',
	'background-position',
	'background-repeat',
	'color',
	'background-attachment',
	'background-color',
	'background-image',
	'background-position',
	'background-repeat',
	'color',
	'height',
	'width',
	'border',
	'border-top',
	'border-right',
	'border-bottom',
	'border-left',
	'margin',
	'padding',
	'max-height',
	'min-height',
	'max-width',
	'min-width',
	'position',
	'top',
	'bottom',
	'right',
	'left',
	'float',
	'display',
	'clear',
	'z-index',
	'list-style-image',
	'list-style-type',
	'list-style-position',
	'border-collapse',
	'border-spacing',
	'caption-side',
	'empty-cells',
	'table-layout',
	'overflow',
	'cursor',
	'visibility',
	'transform',
	'transition',
	'outline',
	'outline-offset',
	'box-sizing',
	'resize',
	'text-shadow',
	'text-overflow',
	'word-wrap',
	'box-shadow',
	'border-top-left-radius',
	'border-top-right-radius',
	'border-bottom-left-radius',
	'border-bottom-right-radius'
);

// CSS Property categories
var CSSViewer_categories = {
	'pFontText'    : CSSViewer_pFont
};

var CSSViewer_categoriesTitle = {
	'pFontText'    : 'Font & Text'
};

// Table tagnames
var CSSViewer_tableTagNames = new Array(
	'TABLE',
	'CAPTION',
	'THEAD',
	'TBODY',
	'TFOOT',
	'COLGROUP',
	'COL',
	'TR',
	'TH',
	'TD'
);

var CSSViewer_listTagNames = new Array(
	'UL',
	'LI',
	'DD',
	'DT',
	'OL'
);

// Hexadecimal
var CSSViewer_hexa = new Array(
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'A',
	'B',
	'C',
	'D',
	'E',
	'F'
);

/*
** Utils
*/

function GetCurrentDocument()
{
	return window.document;
}

function IsInArray(array, name)
{
	for (var i = 0; i < array.length; i++) {
		if (name == array[i])
			return true;
	}

	return false;
}

function DecToHex(nb)
{
	var nbHexa = '';

	nbHexa += CSSViewer_hexa[Math.floor(nb / 16)];
	nb = nb % 16;
	nbHexa += CSSViewer_hexa[nb];

	return nbHexa;
}

function RGBToHex(str)
{
	var start = str.search(/\(/) + 1;
	var end = str.search(/\)/);

	str = str.slice(start, end);

	var hexValues = str.split(', ');
	var hexStr = '#';

	for (var i = 0; i < hexValues.length; i++) {
		hexStr += DecToHex(hexValues[i]);
	}

	if( hexStr == "#00000000" ){
		hexStr = "#FFFFFF";
	}

	hexStr = '<span style="border: 1px solid #000000 !important;width: 8px !important;height: 8px !important;display: inline-block !important;background-color:'+ hexStr +' !important;"></span> ' + hexStr;

	return hexStr;
}

function GetFileName(str)
{
	var start = str.search(/\(/) + 1;
	var end = str.search(/\)/);

	str = str.slice(start, end);

	var path = str.split('/');

	return path[path.length - 1];
}

function RemoveExtraFloat(nb)
{
	nb = nb.substr(0, nb.length - 2);

	return Math.round(nb) + 'px';
}

/*
* CSSFunc
*/

function GetCSSProperty(element, property)
{
	return element.getPropertyValue(property);
}

function SetCSSProperty_var(property, value)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	if(value != "" && li != null){
		li.lastChild.innerHTML = " : " + value;
		li.style.display = 'block';
	}
}

function SetCSSProperty(element, property)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	li.lastChild.innerHTML = " : " + element.getPropertyValue(property);

}

function SetCSSPropertyIf(element, property, condition)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	if (condition) {
		li.lastChild.innerHTML = " : " + element.getPropertyValue(property);
		li.style.display = 'none';

		return 1;
	}
	else {
		li.style.display = 'none';

		return 0;
	}
}

function SetCSSPropertyValue(element, property, value)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	li.lastChild.innerHTML = " : " + value;
	li.style.display = 'none';
}

function SetCSSPropertyValueIf(element, property, value, condition)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	if (condition) {
		li.lastChild.innerHTML = " : " + value;
		li.style.display = 'none';

		return 1;
	}
	else {
		li.style.display = 'none';

		return 0;
	}
}

function HideCSSProperty(property)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	li.style.display = 'none';
}

function HideCSSCategory(category)
{
	var document = GetCurrentDocument();
	var div = document.getElementById('CSSViewer_' + category);

	div.style.display = 'none';
}

function ShowCSSCategory(category)
{
	var document = GetCurrentDocument();
	var div = document.getElementById('CSSViewer_' + category);

	div.style.display = 'block';
}

function getVar(element){
	var el = element;
	var cssProperties = window.getMatchedCSSRules(el)[0]


	for(let i = 0; i < cssProperties.style.length; i++){

		let w = cssProperties.style.item(i)
		let value = cssProperties.style.getPropertyValue(w)

		if(value.startsWith('var(')){
			SetCSSProperty_var(w, value);
		}
	}

}

function UpdatefontText(element)
{

	getVar(element)
}

/*
** Event Handlers
*/

if (typeof window.getMatchedCSSRules !== 'function') {
	var ELEMENT_RE = /[\w-]+/g,
		ID_RE = /#[\w-]+/g,
		CLASS_RE = /\.[\w-]+/g,
		ATTR_RE = /\[[^\]]+\]/g,
		// :not() pseudo-class does not add to specificity, but its content does as if it was outside it
		PSEUDO_CLASSES_RE = /\:(?!not)[\w-]+(\(.*\))?/g,
		PSEUDO_ELEMENTS_RE = /\:\:?(after|before|first-letter|first-line|selection)/g;
	    // convert an array-like object to array
	    function toArray(list) {
		return [].slice.call(list);
	    }

	    // handles extraction of `cssRules` as an `Array` from a stylesheet or something that behaves the same
	    function getSheetRules(stylesheet) {
		var sheet_media = stylesheet.media && stylesheet.media.mediaText;
		// if this sheet is disabled skip it
		if ( stylesheet.disabled ) return [];
		// if this sheet's media is specified and doesn't match the viewport then skip it
		if ( sheet_media && sheet_media.length && ! window.matchMedia(sheet_media).matches ) return [];
		// get the style rules of this sheet
		return toArray(stylesheet.cssRules);
	    }

	    function _find(string, re) {
		var matches = string.match(re);
		return matches ? matches.length : 0;
	    }

	    // calculates the specificity of a given `selector`
	    function calculateScore(selector) {
		var score = [0,0,0],
		    parts = selector.split(' '),
		    part, match;
		//TODO: clean the ':not' part since the last ELEMENT_RE will pick it up
		while (part = parts.shift(), typeof part == 'string') {
		    // find all pseudo-elements
		    match = _find(part, PSEUDO_ELEMENTS_RE);
		    score[2] += match;
		    // and remove them
		    match && (part = part.replace(PSEUDO_ELEMENTS_RE, ''));
		    // find all pseudo-classes
		    match = _find(part, PSEUDO_CLASSES_RE);
		    score[1] += match;
		    // and remove them
		    match && (part = part.replace(PSEUDO_CLASSES_RE, ''));
		    // find all attributes
		    match = _find(part, ATTR_RE);
		    score[1] += match;
		    // and remove them
		    match && (part = part.replace(ATTR_RE, ''));
		    // find all IDs
		    match = _find(part, ID_RE);
		    score[0] += match;
		    // and remove them
		    match && (part = part.replace(ID_RE, ''));
		    // find all classes
		    match = _find(part, CLASS_RE);
		    score[1] += match;
		    // and remove them
		    match && (part = part.replace(CLASS_RE, ''));
		    // find all elements
		    score[2] += _find(part, ELEMENT_RE);
		}
		return parseInt(score.join(''), 10);
	    }

	    // returns the heights possible specificity score an element can get from a give rule's selectorText
	    function getSpecificityScore(element, selector_text) {
		var selectors = selector_text.split(','),
		    selector, score, result = 0;
		while (selector = selectors.shift()) {
		    if (matchesSelector(element, selector)) {
			score = calculateScore(selector);
			result = score > result ? score : result;
		    }
		}
		return result;
	    }

	    function sortBySpecificity(element, rules) {
		// comparing function that sorts CSSStyleRules according to specificity of their `selectorText`
		function compareSpecificity (a, b) {
		    return getSpecificityScore(element, b.selectorText) - getSpecificityScore(element, a.selectorText);
		}

		return rules.sort(compareSpecificity);
	    }

	    // Find correct matchesSelector impl
	    function matchesSelector(el, selector) {
	      var matcher = el.matchesSelector || el.mozMatchesSelector ||
		  el.webkitMatchesSelector || el.oMatchesSelector || el.msMatchesSelector;
	      return matcher.call(el, selector);
	    }

	    //TODO: not supporting 2nd argument for selecting pseudo elements
	    //TODO: not supporting 3rd argument for checking author style sheets only
	    window.getMatchedCSSRules = function (element /*, pseudo, author_only*/) {
		var style_sheets, sheet, sheet_media,
		    rules, rule,
		    result = [];
		// get stylesheets and convert to a regular Array
		style_sheets = toArray(window.document.styleSheets);

		// assuming the browser hands us stylesheets in order of appearance
		// we iterate them from the beginning to follow proper cascade order
		while (sheet = style_sheets.shift()) {
		    // get the style rules of this sheet
		    rules = getSheetRules(sheet);
		    // loop the rules in order of appearance
		    while (rule = rules.shift()) {
			// if this is an @import rule
			if (rule.styleSheet) {
			    // insert the imported stylesheet's rules at the beginning of this stylesheet's rules
			    rules = getSheetRules(rule.styleSheet).concat(rules);
			    // and skip this rule
			    continue;
			}
			// if there's no stylesheet attribute BUT there IS a media attribute it's a media rule
			else if (rule.media) {
			    // insert the contained rules of this media rule to the beginning of this stylesheet's rules
			    rules = getSheetRules(rule).concat(rules);
			    // and skip it
			    continue
			}

			// check if this element matches this rule's selector
			if (matchesSelector(element, rule.selectorText)) {
			    // push the rule to the results set
			    result.push(rule);
			}
		    }
		}
		// sort according to specificity
		return sortBySpecificity(element, result);
	    };
    }


function CSSViewerMouseOver(e)
{
	// Block
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	if( ! block ){
		return;
	}

	block.firstChild.innerHTML = '&lt;' + this.tagName + '&gt;' + (this.id == '' ? '' : ' #' + this.id) + (this.className == '' ? '' : ' .' + this.className);
	// Outline element
	if (this.tagName != 'body') {
		this.style.outline = '1px dashed #f00';
		CSSViewer_current_element = this;
	}


	// Updating CSS properties
	var element = document.defaultView.getComputedStyle(this, null);


	UpdatefontText(this);

	CSSViewer_element = this;

	cssViewerRemoveElement("cssViewerInsertMessage");

	e.stopPropagation();

	// generate simple css definition
	CSSViewer_element_cssDefinition = this.tagName.toLowerCase() + (this.id == '' ? '' : ' #' + this.id) + (this.className == '' ? '' : ' .' + this.className) + " {\n";


	CSSViewer_element_cssDefinition += "\t/* Font & Tesxt */\n";
	for (var i = 0; i < CSSViewer_pFont.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pFont[i] + ': ' + element.getPropertyValue( CSSViewer_pFont[i] ) + ";\n";

	CSSViewer_element_cssDefinition += "}";

}

function CSSViewerMouseOut(e)
{

	cssViewer.Disable();
	cssViewer.Enable();
	this.style.outline = '';

	e.stopPropagation();
}

function CSSViewerMouseMove(e)
{
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	if( ! block ){
		return;
	}

	block.style.display = 'block';

	var pageWidth = window.innerWidth;
	var pageHeight = window.innerHeight;
	var blockWidth = 332;
	var blockHeight = document.defaultView.getComputedStyle(block, null).getPropertyValue('height');

	blockHeight = blockHeight.substr(0, blockHeight.length - 2) * 1;

	if ((e.pageX + blockWidth) > pageWidth) {
		if ((e.pageX - blockWidth - 10) > 0)
			block.style.left = e.pageX - blockWidth - 40 + 'px';
		else
			block.style.left = 0 + 'px';
	}
	else
		block.style.left = (e.pageX + 20) + 'px';

	if ((e.pageY + blockHeight) > pageHeight) {
		if ((e.pageY - blockHeight - 10) > 0)
			block.style.top = e.pageY - blockHeight - 20 + 'px';
		else
			block.style.top = 0 + 'px';
	}
	else
		block.style.top = (e.pageY + 20) + 'px';

	// adapt block top to screen offset
	inView = CSSViewerIsElementInViewport(block);

	if( ! inView )
		block.style.top = ( window.pageYOffset  + 20 ) + 'px';

	e.stopPropagation();
}

// http://stackoverflow.com/a/7557433
function CSSViewerIsElementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/*
* CSSViewer Class
*/
function CSSViewer()
{
	// Create a block to display informations
	this.CreateBlock = function() {
		var document = GetCurrentDocument();
		var block;

		if (document) {
			// Create a div block
			block = document.createElement('div');
			block.id = 'CSSViewer_block';

			// Insert a title for CSS selector
			var header = document.createElement('h1');

			header.appendChild(document.createTextNode(''));
			block.appendChild(header);

			// Insert all properties
			var center = document.createElement('div');

			center.id = 'CSSViewer_center';

			for (var cat in CSSViewer_categories) {
				var div = document.createElement('div');

				div.id = 'CSSViewer_' + cat;
				div.className = 'CSSViewer_category';

				var h2 = document.createElement('h2');

				h2.appendChild(document.createTextNode(CSSViewer_categoriesTitle[cat]));

				var ul = document.createElement('ul');
				var properties = CSSViewer_categories[cat];

				for (var i = 0; i < properties.length; i++) {
					var li = document.createElement('li');

					li.id = 'CSSViewer_' + properties[i];

					var spanName = document.createElement('span');

					spanName.className = 'CSSViewer_property';

					var spanValue = document.createElement('span');

					spanName.appendChild(document.createTextNode(properties[i]));
					li.appendChild(spanName);
					li.appendChild(spanValue);
					ul.appendChild(li);

					li.style.display = 'none';

				}

				div.appendChild(h2);
				div.appendChild(ul);
				center.appendChild(div);
			}

			block.appendChild(center);

			// Insert a footer
			var footer = document.createElement('div');

			footer.id = 'CSSViewer_footer';

			//<
			footer.appendChild( document.createTextNode('CSSViewer 1.7. keys: [f] Un/Freeze. [c] Css. [Esc] Close.') );
			block.appendChild(footer);
		}

		cssViewerInsertMessage( "CSSViewer loaded! Hover any element you want to inspect in the page." );

		return block;
	}
	// Get all elements within the given element
	this.GetAllElements = function(element)
	{
		var elements = new Array();

		if (element && element.hasChildNodes()) {
			elements.push(element);

			var childs = element.childNodes;

			for (var i = 0; i < childs.length; i++) {
				if (childs[i].hasChildNodes()) {
					elements = elements.concat(this.GetAllElements(childs[i]));
				}
				else if (childs[i].nodeType == 1) {
					elements.push(childs[i]);
				}
			}
		}

		return elements;
	}

	// Add bool for knowing all elements having event listeners or not
	this.haveEventListeners = false;

	// Add event listeners for all elements in the current document
	this.AddEventListeners = function()
	{
		var document = GetCurrentDocument();
		var elements = this.GetAllElements(document.body);

		for (var i = 0; i < elements.length; i++)	{
			elements[i].addEventListener("mouseover", CSSViewerMouseOver, false);
			elements[i].addEventListener("mouseout", CSSViewerMouseOut, false);
			elements[i].addEventListener("mousemove", CSSViewerMouseMove, false);
		}
		this.haveEventListeners = true;
	}

	// Remove event listeners for all elements in the current document
	this.RemoveEventListeners = function()
	{
		var document = GetCurrentDocument();
		var elements = this.GetAllElements(document.body);

		for (var i = 0; i < elements.length; i++){
			elements[i].removeEventListener("mouseover", CSSViewerMouseOver, false);
			elements[i].removeEventListener("mouseout", CSSViewerMouseOut, false);
			elements[i].removeEventListener("mousemove", CSSViewerMouseMove, false);
		}
		this.haveEventListeners = false;
	}

	// Set the title of the block
	this.SetTitle = function()
	{}

	// Add a stylesheet to the current document
	this.AddCSS = function(cssFile)
	{
		var document = GetCurrentDocument();
		var link = document.createElement("link");

		link.setAttribute("href", cssFile);
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");

		var heads = document.getElementsByTagName("head");

		if(heads.length > 0)
		    heads[0].appendChild(link);
		else
		    document.documentElement.appendChild(link);
	}

	this.RemoveCSS = function(cssFile)
	{
		var document = GetCurrentDocument();
		var links = document.getElementsByTagName('link');

		for (var i = 0; i < links.length; i++) {
			if (links[i].rel == "stylesheet" && links[i].href == cssFile) {
				var heads = document.getElementsByTagName("head");

				if(heads.length > 0) {
					heads[0].removeChild(links[i]);
				}

				return;
			}
		}
	}
}

/*
* Check if CSSViewer is enabled
*/
CSSViewer.prototype.IsEnabled = function()
{
	var document = GetCurrentDocument();

	if (document.getElementById('CSSViewer_block')) {
		return true;
	}

	return false;
}

/*
* Enable CSSViewer
*/
CSSViewer.prototype.Enable = function()
{
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	if (!block){
		block = this.CreateBlock();
		document.body.appendChild(block);
		this.AddEventListeners();

		return true;
	}

	return false;
}

/*
* Disable CSSViewer
*/
CSSViewer.prototype.Disable = function()
{
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');

	if (block) {
		document.body.removeChild(block);
		this.RemoveEventListeners();

		return true;
	}

	return false;
}

/*
* Freeze CSSViewer
*/
CSSViewer.prototype.Freeze = function()
{
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');
	if ( block && this.haveEventListeners ) {
		this.RemoveEventListeners();

		return true;
	}

	return false;
}

/*
* Unfreeze CSSViewer
*/
CSSViewer.prototype.Unfreeze = function()
{
	var document = GetCurrentDocument();
	var block = document.getElementById('CSSViewer_block');
	if ( block && !this.haveEventListeners ) {
		// Remove the red outline
		CSSViewer_current_element.style.outline = '';
		this.AddEventListeners();

		return true;
	}

	return false;
}

/*
* Display the notification message
*/
function cssViewerInsertMessage( msg )
{
	var oNewP = document.createElement("p");
	var oText = document.createTextNode( msg );

	oNewP.appendChild(oText);
	oNewP.id                    = 'cssViewerInsertMessage';
	oNewP.style.backgroundColor = '#b40000';
	oNewP.style.color           = '#ffffff';
	oNewP.style.position        = "absolute";
	oNewP.style.top             = '10px';
	oNewP.style.left            = '10px';
	oNewP.style.zIndex          = '100';
	oNewP.style.padding         = '3px';

	// https://github.com/miled/cssviewer/issues/5
	// https://github.com/miled/cssviewer/issues/6
	// var beforeMe = document.getElementsByTagName("body");
	// document.body.insertBefore( oNewP, beforeMe[0] );

	// https://github.com/zchee/cssviewer/commit/dad107d27e94aabeb6e11b935ad28c4ff251f895
	document.body.appendChild(oNewP);
}

/*
* Removes and element from the dom, used to remove the notification message
*/
function cssViewerRemoveElement(divid)
{
	var n = document.getElementById(divid);

	if(n){
		document.body.removeChild(n);
	}
}

/*
* Copy current element css to chrome console
*/
function cssViewerCopyCssToConsole(type)
{
	if( 'el' == type ) return console.log( CSSViewer_element );
	if( 'style' == type ) return console.log ( getVariables(CSSViewer_element));
	if( 'id' == type ) return console.log( CSSViewer_element.id );
	if( 'tagName' == type ) return console.log( CSSViewer_element.tagName );
	if( 'className' == type ) return console.log( CSSViewer_element.className );
	// if( 'style' == type ) return console.log( CSSViewer_element.style );
	if( 'cssText' == type ) return console.log( document.defaultView.getComputedStyle(CSSViewer_element, '').cssText );
	if( 'getComputedStyle' == type ) return console.log( document.defaultView.getComputedStyle(CSSViewer_element, null) );
	if( 'simpleCssDefinition' == type ) return console.log( CSSViewer_element_cssDefinition );
}


function getVariables(CSSViewer_element) {
	// console.log(CSSViewer_element.selectorText)
	console.log(CSSViewer_element)


	// console.log(CSSViewer_element.element)
	// console.log(GetCurrentDocument.window.getMatchedCSSRules(CSSViewer_element)[0])

	var variables = Array.from(document.styleSheets)
	.filter(
	  sheet =>
	    sheet.href === null || sheet.href.startsWith(window.location.origin)
	)
	.reduce(
	  (acc, sheet) =>
	    (acc = [
	      ...acc,
	      ...Array.from(sheet.cssRules).reduce(
		(def, rule) =>
		  (def =
		//     rule.selectorText === ":root"
			rule.selectorText === this.selectorText
		      ? [
			  ...def,
			  ...Array.from(rule.style).filter(name =>
			    name.startsWith("--")
			  )
			]
		      : def),
		[]
	      )
	    ]),
	  []
	);
	return variables;
}

/*
*  Close css viewer on clicking 'esc' key
*  Freeze css viewer on clicking 'f' key
*/
function CssViewerKeyMap(e) {
	if( ! cssViewer.IsEnabled() )
		return;

	// ESC: Close the css viewer if the cssViewer is enabled.
	if ( e.keyCode === 27 ){
		// Remove the red outline
		CSSViewer_current_element.style.outline = '';
		cssViewer.Disable();
	}

	if( e.altKey || e.ctrlKey )
		return;

	// f: Freeze or Unfreeze the css viewer if the cssViewer is enabled
	if ( e.keyCode === 70 ){
		if ( cssViewer.haveEventListeners ){
			cssViewer.Freeze();
		}
		else {
			cssViewer.Unfreeze();
		}
	}

	// c: Show code css for selected element.
	// window.prompt should suffice for now.
	if ( e.keyCode === 67 ){
		window.prompt("Simple Css Definition :\n\nYou may copy the code below then hit escape to continue.", CSSViewer_element_cssDefinition);
	}
}


/*
* CSSViewer entry-point
*/
cssViewer = new CSSViewer();

if ( cssViewer.IsEnabled() ){
	cssViewer.Disable();
}
else{
	cssViewer.Enable();
}

// Set event handler for the CssViewer
document.onkeydown = CssViewerKeyMap;
