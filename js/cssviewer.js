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
*/

// Roadmap/ToDos
//    1. Make the initial code more readable 
//    2. Comment the initial code
//    3. Fix issues if any
//    4. Add new features (feasible and useful ones)
//    5. Make a new branch and start re-factoring the entire code

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
	'word-spacing'
);

var CSSViewer_pColorBg = new Array(
	'background-attachment', 
	'background-color', 
	'background-image',
	'background-position',
	'background-repeat',
	'color'
);

var CSSViewer_pBox = new Array(
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
	'min-width'
);

var CSSViewer_pPositioning = new Array(
	'position', 
	'top', 
	'bottom', 
	'right', 
	'left', 
	'float', 
	'display', 
	'clear', 
	'z-index'
);

var CSSViewer_pList = new Array(
	'list-style-image', 
	'list-style-type', 
	'list-style-position'
);

var CSSViewer_pTable = new Array(
	'border-collapse',
	'border-spacing',
	'caption-side',
	'empty-cells',
	'table-layout'
);

var CSSViewer_pMisc = new Array(
	'overflow', 
	'cursor', 
	'visibility'
);

var CSSViewer_pEffect = new Array(
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
	'pFontText'    : CSSViewer_pFont, 
	'pColorBg'     : CSSViewer_pColorBg, 
	'pBox'         : CSSViewer_pBox, 
	'pPositioning' : CSSViewer_pPositioning, 
	'pList'        : CSSViewer_pList, 
	'pTable'       : CSSViewer_pTable, 
	'pMisc'        : CSSViewer_pMisc, 
	'pEffect'      : CSSViewer_pEffect 
};

var CSSViewer_categoriesTitle = { 
	'pFontText'    : 'Font & Text', 
	'pColorBg'     : 'Color & Background', 
	'pBox'         : 'Box', 
	'pPositioning' : 'Positioning', 
	'pList'        : 'List', 
	'pTable'       : 'Table', 
	'pMisc'        : 'Miscellaneous', 
	'pEffect'      : 'Effects' 
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
		li.style.display = 'block';

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
	li.style.display = 'block';
}

function SetCSSPropertyValueIf(element, property, value, condition)
{
	var document = GetCurrentDocument();
	var li = document.getElementById('CSSViewer_' + property);

	if (condition) {
		li.lastChild.innerHTML = " : " + value;
		li.style.display = 'block';

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

function UpdatefontText(element)
{
	// Font
	SetCSSProperty(element, 'font-family');
	SetCSSProperty(element, 'font-size');

	SetCSSPropertyIf(element, 'font-weight'    , GetCSSProperty(element, 'font-weight') != '400');
	SetCSSPropertyIf(element, 'font-variant'   , GetCSSProperty(element, 'font-variant') != 'normal');
	SetCSSPropertyIf(element, 'font-style'     , GetCSSProperty(element, 'font-style') != 'normal');
	
	// Text
	SetCSSPropertyIf(element, 'letter-spacing' , GetCSSProperty(element, 'letter-spacing') != 'normal');
	SetCSSPropertyIf(element, 'line-height'    , GetCSSProperty(element, 'line-height') != 'normal');
	SetCSSPropertyIf(element, 'text-decoration', GetCSSProperty(element, 'text-decoration') != 'none');
	SetCSSPropertyIf(element, 'text-align'     , GetCSSProperty(element, 'text-align') != 'start');
	SetCSSPropertyIf(element, 'text-indent'    , GetCSSProperty(element, 'text-indent') != '0px');
	SetCSSPropertyIf(element, 'text-transform' , GetCSSProperty(element, 'text-transform') != 'none');
	SetCSSPropertyIf(element, 'vertical-align' , GetCSSProperty(element, 'vertical-align') != 'baseline');
	SetCSSPropertyIf(element, 'white-space'    , GetCSSProperty(element, 'white-space') != 'normal');
	SetCSSPropertyIf(element, 'word-spacing'   , GetCSSProperty(element, 'word-spacing') != 'normal');
}

function UpdateColorBg(element)
{
	// Color
	SetCSSPropertyValue(element, 'color', RGBToHex(GetCSSProperty(element, 'color')));

	// Background
	SetCSSPropertyValueIf(element, 'background-color', RGBToHex(GetCSSProperty(element, 'background-color')), GetCSSProperty(element, 'background-color') != 'transparent');
	SetCSSPropertyIf(element, 'background-attachment', GetCSSProperty(element, 'background-attachment') != 'scroll');
	SetCSSPropertyValueIf(element, 'background-image', GetFileName(GetCSSProperty(element, 'background-image')), GetCSSProperty(element, 'background-image') != 'none');
	SetCSSPropertyIf(element, 'background-position'  , GetCSSProperty(element, 'background-position') != '');
	SetCSSPropertyIf(element, 'background-repeat'    , GetCSSProperty(element, 'background-repeat') != 'repeat');
}

function UpdateBox(element)
{
	// Width/Height
	SetCSSPropertyIf(element, 'height', RemoveExtraFloat(GetCSSProperty(element, 'height')) != 'auto');
	SetCSSPropertyIf(element, 'width', RemoveExtraFloat(GetCSSProperty(element, 'width')) != 'auto');

	// Border
	var borderTop    = RemoveExtraFloat(GetCSSProperty(element, 'border-top-width')) + ' ' + GetCSSProperty(element, 'border-top-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-top-color'));
	var borderBottom = RemoveExtraFloat(GetCSSProperty(element, 'border-bottom-width')) + ' ' + GetCSSProperty(element, 'border-bottom-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-bottom-color'));
	var borderRight  = RemoveExtraFloat(GetCSSProperty(element, 'border-right-width')) + ' ' + GetCSSProperty(element, 'border-right-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-right-color'));
	var borderLeft   = RemoveExtraFloat(GetCSSProperty(element, 'border-left-width')) + ' ' + GetCSSProperty(element, 'border-left-style') + ' ' + RGBToHex(GetCSSProperty(element, 'border-left-color'));

	if (borderTop == borderBottom && borderBottom == borderRight && borderRight == borderLeft && GetCSSProperty(element, 'border-top-style') != 'none') {
		SetCSSPropertyValue(element, 'border', borderTop);

		HideCSSProperty('border-top');
		HideCSSProperty('border-bottom');
		HideCSSProperty('border-right');
		HideCSSProperty('border-left');
	}
	else {
		SetCSSPropertyValueIf(element, 'border-top'   , borderTop   , GetCSSProperty(element, 'border-top-style') != 'none');
		SetCSSPropertyValueIf(element, 'border-bottom', borderBottom, GetCSSProperty(element, 'border-bottom-style') != 'none');
		SetCSSPropertyValueIf(element, 'border-right' , borderRight , GetCSSProperty(element, 'border-right-style') != 'none');
		SetCSSPropertyValueIf(element, 'border-left'  , borderLeft  , GetCSSProperty(element, 'border-left-style') != 'none');

		HideCSSProperty('border');
	}
	
	// Margin
	var marginTop    = RemoveExtraFloat(GetCSSProperty(element, 'margin-top'));
	var marginBottom = RemoveExtraFloat(GetCSSProperty(element, 'margin-bottom'));
	var marginRight  = RemoveExtraFloat(GetCSSProperty(element, 'margin-right'));
	var marginLeft   = RemoveExtraFloat(GetCSSProperty(element, 'margin-left'));
	var margin       = (marginTop == '0px' ? '0' : marginTop) + ' ' + (marginRight == '0px' ? '0' : marginRight) + ' '  + (marginBottom == '0px' ? '0' : marginBottom) + ' '  + (marginLeft == '0px' ? '0' : marginLeft);

	SetCSSPropertyValueIf(element, 'margin', margin, margin != '0 0 0 0');

	// padding
	var paddingTop    = RemoveExtraFloat(GetCSSProperty(element, 'padding-top'));
	var paddingBottom = RemoveExtraFloat(GetCSSProperty(element, 'padding-bottom'));
	var paddingRight  = RemoveExtraFloat(GetCSSProperty(element, 'padding-right'));
	var paddingLeft   = RemoveExtraFloat(GetCSSProperty(element, 'padding-left'));
	var padding       = (paddingTop == '0px' ? '0' : paddingTop) + ' ' + (paddingRight == '0px' ? '0' : paddingRight) + ' '  + (paddingBottom == '0px' ? '0' : paddingBottom) + ' '  + (paddingLeft == '0px' ? '0' : paddingLeft);

	SetCSSPropertyValueIf(element, 'padding', padding, padding != '0 0 0 0');

	// Max/Min Width/Height
	SetCSSPropertyIf(element, 'min-height', GetCSSProperty(element, 'min-height') != '0px');
	SetCSSPropertyIf(element, 'max-height', GetCSSProperty(element, 'max-height') != 'none');
	SetCSSPropertyIf(element, 'min-width' , GetCSSProperty(element, 'min-width') != '0px');
	SetCSSPropertyIf(element, 'max-width' , GetCSSProperty(element, 'max-width') != 'none');
}

function UpdatePositioning(element)
{
	SetCSSPropertyIf(element, 'position', GetCSSProperty(element, 'position') != 'static');
	SetCSSPropertyIf(element, 'top'     , GetCSSProperty(element, 'top') != 'auto');
	SetCSSPropertyIf(element, 'bottom'  , GetCSSProperty(element, 'bottom') != 'auto');
	SetCSSPropertyIf(element, 'right'   , GetCSSProperty(element, 'right') != 'auto');
	SetCSSPropertyIf(element, 'left'    , GetCSSProperty(element, 'left') != 'auto');
	SetCSSPropertyIf(element, 'float'   , GetCSSProperty(element, 'float') != 'none');

	SetCSSProperty(element, 'display');

	SetCSSPropertyIf(element, 'clear'   , GetCSSProperty(element, 'clear') != 'none');
	SetCSSPropertyIf(element, 'z-index' , GetCSSProperty(element, 'z-index') != 'auto');
}

function UpdateTable(element, tagName)
{
	if (IsInArray(CSSViewer_tableTagNames, tagName)) {
		var nbProperties = 0;

		nbProperties += SetCSSPropertyIf(element, 'border-collapse', GetCSSProperty(element, 'border-collapse') != 'separate');
		nbProperties += SetCSSPropertyIf(element, 'border-spacing' , GetCSSProperty(element, 'border-spacing') != '0px 0px');
		nbProperties += SetCSSPropertyIf(element, 'caption-side'   , GetCSSProperty(element, 'caption-side') != 'top');
		nbProperties += SetCSSPropertyIf(element, 'empty-cells'    , GetCSSProperty(element, 'empty-cells') != 'show');
		nbProperties += SetCSSPropertyIf(element, 'table-layout'   , GetCSSProperty(element, 'table-layout') != 'auto');

		if (nbProperties > 0)
			ShowCSSCategory('pTable');
		else
			HideCSSCategory('pTable');
	}
	else {
		HideCSSCategory('pTable');
	}
}

function UpdateList(element, tagName)
{
	if (IsInArray(CSSViewer_listTagNames, tagName)) {
		ShowCSSCategory('pList');

		var listStyleImage = GetCSSProperty(element, 'list-style-image');

		if (listStyleImage == 'none') {
			SetCSSProperty(element, 'list-style-type');
			HideCSSProperty('list-style-image');
		}
		else {
			SetCSSPropertyValue(element, 'list-style-image', listStyleImage);
			HideCSSProperty('list-style-type');
		}

		SetCSSProperty(element, 'list-style-position');
	}
	else {
		HideCSSCategory('pList');
	}
}

function UpdateMisc(element)
{
	var nbProperties = 0;

	nbProperties += SetCSSPropertyIf(element, 'overflow'  , GetCSSProperty(element, 'overflow') != 'visible');
	nbProperties += SetCSSPropertyIf(element, 'cursor'    , GetCSSProperty(element, 'cursor') != 'auto');
	nbProperties += SetCSSPropertyIf(element, 'visibility', GetCSSProperty(element, 'visibility') != 'visible'); 

	if (nbProperties > 0)
		ShowCSSCategory('pMisc');
	else
		HideCSSCategory('pMisc');
}

function UpdateEffects(element)
{
	var nbProperties = 0;

	nbProperties += SetCSSPropertyIf(element, 'transform'                 , GetCSSProperty(element, 'transform') ); 
	nbProperties += SetCSSPropertyIf(element, 'transition'                , GetCSSProperty(element, 'transition') ); 
	nbProperties += SetCSSPropertyIf(element, 'outline'                   , GetCSSProperty(element, 'outline') ); 
	nbProperties += SetCSSPropertyIf(element, 'outline-offset'            , GetCSSProperty(element, 'outline-offset') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'box-sizing'                , GetCSSProperty(element, 'box-sizing') != 'content-box'); 
	nbProperties += SetCSSPropertyIf(element, 'resize'                    , GetCSSProperty(element, 'resize') != 'none'); 

	nbProperties += SetCSSPropertyIf(element, 'text-shadow'               , GetCSSProperty(element, 'text-shadow') != 'none'); 
	nbProperties += SetCSSPropertyIf(element, 'text-overflow'             , GetCSSProperty(element, 'text-overflow') != 'clip'); 
	nbProperties += SetCSSPropertyIf(element, 'word-wrap'                 , GetCSSProperty(element, 'word-wrap') != 'normal'); 
	nbProperties += SetCSSPropertyIf(element, 'box-shadow'                , GetCSSProperty(element, 'box-shadow') != 'none');  

	nbProperties += SetCSSPropertyIf(element, 'border-top-left-radius'    , GetCSSProperty(element, 'border-top-left-radius') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'border-top-right-radius'   , GetCSSProperty(element, 'border-top-right-radius') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'border-bottom-left-radius' , GetCSSProperty(element, 'border-bottom-left-radius') != '0px'); 
	nbProperties += SetCSSPropertyIf(element, 'border-bottom-right-radius', GetCSSProperty(element, 'border-bottom-right-radius') != '0px'); 

	if (nbProperties > 0)
		ShowCSSCategory('pEffect');
	else
		HideCSSCategory('pEffect');
}

/*
** Event Handlers
*/

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

	UpdatefontText(element);
	UpdateColorBg(element);
	UpdateBox(element);
	UpdatePositioning(element);
	UpdateTable(element, this.tagName);
	UpdateList(element, this.tagName);
	UpdateMisc(element);
	UpdateEffects(element);

	CSSViewer_element = this;

	cssViewerRemoveElement("cssViewerInsertMessage");

	e.stopPropagation();

	// generate simple css definition
	CSSViewer_element_cssDefinition = this.tagName.toLowerCase() + (this.id == '' ? '' : ' #' + this.id) + (this.className == '' ? '' : ' .' + this.className) + " {\n";

	CSSViewer_element_cssDefinition += "\t/* Font & Text */\n"; 
	for (var i = 0; i < CSSViewer_pFont.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pFont[i] + ': ' + element.getPropertyValue( CSSViewer_pFont[i] ) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Color & Background */\n";
	for (var i = 0; i < CSSViewer_pColorBg.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pColorBg[i] + ': ' + element.getPropertyValue( CSSViewer_pColorBg[i] ) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Box */\n";
	for (var i = 0; i < CSSViewer_pBox.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pBox[i] + ': ' + element.getPropertyValue( CSSViewer_pBox[i] ) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Positioning */\n";
	for (var i = 0; i < CSSViewer_pPositioning.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pPositioning[i] + ': ' + element.getPropertyValue( CSSViewer_pPositioning[i] ) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* List */\n";
	for (var i = 0; i < CSSViewer_pList.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pList[i] + ': ' + element.getPropertyValue( CSSViewer_pList[i] ) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Table */\n";
	for (var i = 0; i < CSSViewer_pTable.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pTable[i] + ': ' + element.getPropertyValue( CSSViewer_pTable[i] ) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Miscellaneous */\n";
	for (var i = 0; i < CSSViewer_pMisc.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pMisc[i] + ': ' + element.getPropertyValue( CSSViewer_pMisc[i] ) + ";\n";

	CSSViewer_element_cssDefinition += "\n\t/* Effects */\n"; 
	for (var i = 0; i < CSSViewer_pEffect.length; i++)
		CSSViewer_element_cssDefinition += "\t" + CSSViewer_pEffect[i] + ': ' + element.getPropertyValue( CSSViewer_pEffect[i] ) + ";\n";

	CSSViewer_element_cssDefinition += "}";

	// console.log( element.cssText ); //< debug the hovered el css
}

function CSSViewerMouseOut(e)
{
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
	if( 'id' == type ) return console.log( CSSViewer_element.id );
	if( 'tagName' == type ) return console.log( CSSViewer_element.tagName );
	if( 'className' == type ) return console.log( CSSViewer_element.className );
	if( 'style' == type ) return console.log( CSSViewer_element.style ); 
	if( 'cssText' == type ) return console.log( document.defaultView.getComputedStyle(CSSViewer_element, null).cssText );
	if( 'getComputedStyle' == type ) return console.log( document.defaultView.getComputedStyle(CSSViewer_element, null) );
	if( 'simpleCssDefinition' == type ) return console.log( CSSViewer_element_cssDefinition );
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
