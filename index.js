/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(2);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Fjalla+One|Roboto|Great+Vibes);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"MrsEaves\";\n  src: url(" + __webpack_require__(5) + ") format(\"truetype\");\n}\n\nbody {\n  margin: 0;\n}\n\n#nav {\n  margin-top: 1vh;\n  position: fixed;\n  top: 5px;\n  left: 10px;\n\n  height: 48px;\n  max-width: 48px;\n  overflow: hidden;\n\n  transition: max-width 700ms ease, background-color 100ms linear 700ms;\n  font-family: \"Fjalla One\", sans;\n  font-size: 14px;\n\n  z-index: 1000;\n}\n\n#nav button {\n  background: none !important;\n  color: black;\n  border: none;\n  padding: 0! important;\n  font: inherit;\n  cursor: pointer;\n  outline: inherit !important;\n\n  height: 48px;\n  width: 48px;\n\n  transition: transform .5s ease;\n  transform: rotate(0deg);\n}\n\n#nav.open {\n  background-color: rgba(255, 255, 255, 0.9);\n\n  max-width: 500px;\n  transition: max-width 700ms ease, background-color 200ms ease;\n}\n\n#nav.open button {\n  transition: transform .5s ease;\n  transform: rotate(90deg);\n}\n\n#links {\n  float: right;\n  line-height: 48px;\n}\n\n#links .separator {\n  border-right: 1px solid black;\n  margin-right: 10px;\n  height: 30px;\n}\n\n#nav a {\n  color: black;\n  text-decoration: none;\n  font-size: 1.5em;\n  \n  padding-right: 10px;\n}\n\n#nav a:last-child {\n  padding-right: 10px;\n}\n\n.hidden {\n  display: none;\n}\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "4427f1ea50aefd7e8ae7bb8ec2b22398.ttf";

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = init_nav_button;
function init_nav_button() {
  let nav = document.getElementById('nav');
  nav.addEventListener('click', function() {
    nav.classList.toggle('open');
  })
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./index.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n  font-family: MrsEaves, Georgia, serif;\n}\n\nhtml {\n  background: url(" + __webpack_require__(9) + ") no-repeat center center fixed;\n  background-size: cover;\n}\n\n.title {\n  padding: 4vh 0;\n  margin-top: 25vh;\n  width: 100%;\n  text-align: center;\n\n  color: black;\n  background-color: rgba(256, 256, 256, .4);\n}\n\n.title > * {\n  margin: 3vh auto;\n  width: fit-content;\n}\n\n.title h1 {\n  font-weight: 1000;\n  font-size: 10vh;\n  font-family: bombshell;\n}\n\n.logo table {\n  font-family: MrsEaves;\n  font-size: 6vh;\n  text-align: center;\n  color: black;\n}\n\n.hl {\n  color: white;\n}\n\n.countdown {\n  position: fixed;\n  bottom: 5px;\n  right: 10px;\n  font-size: 3vh;\n}", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "3a09a3c2756963e8b3dc7e6ec883014c.jpg";

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_css__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__nav__ = __webpack_require__(6);





const countdown = __webpack_require__(15);
const THE_DATE = new Date(1534626000000);
const COUNTDOWN_UNITS = countdown.DAYS | countdown.HOURS | countdown.MINUTES;

const SECONDS = 1000;
const MINUTES = SECONDS * 60;

function tick_countdown() {
  let s = 'in ' + countdown(THE_DATE, null, COUNTDOWN_UNITS).toString();
  let elements = document.getElementsByClassName('countdown');
  for (let ele of elements) {
    ele.innerHTML = s.replace(' and', ',');
  }
}

function begin_countdown_loop() {
  tick_countdown();
  window.setInterval(tick_countdown, 1 * MINUTES);
}

function init() {
  begin_countdown_loop();
  Object(__WEBPACK_IMPORTED_MODULE_2__nav__["a" /* default */])();
}

init();


/***/ }),
/* 15 */
/***/ (function(module, exports) {

/*global window */
/**
 * @license countdown.js v2.6.0 http://countdownjs.org
 * Copyright (c)2006-2014 Stephen M. McKamey.
 * Licensed under The MIT License.
 */
/*jshint bitwise:false */

/**
 * @public
 * @type {Object|null}
 */
var module;

/**
 * API entry
 * @public
 * @param {function(Object)|Date|number} start the starting date
 * @param {function(Object)|Date|number} end the ending date
 * @param {number} units the units to populate
 * @return {Object|number}
 */
var countdown = (

/**
 * @param {Object} module CommonJS Module
 */
function(module) {
	/*jshint smarttabs:true */

	'use strict';

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS	= 0x001;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var SECONDS			= 0x002;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MINUTES			= 0x004;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var HOURS			= 0x008;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DAYS			= 0x010;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var WEEKS			= 0x020;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MONTHS			= 0x040;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var YEARS			= 0x080;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DECADES			= 0x100;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES		= 0x200;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLENNIA		= 0x400;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DEFAULTS		= YEARS|MONTHS|DAYS|HOURS|MINUTES|SECONDS;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS_PER_SECOND = 1000;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var SECONDS_PER_MINUTE = 60;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MINUTES_PER_HOUR = 60;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var HOURS_PER_DAY = 24;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DAYS_PER_WEEK = 7;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MONTHS_PER_YEAR = 12;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var YEARS_PER_DECADE = 10;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DECADES_PER_CENTURY = 10;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES_PER_MILLENNIUM = 10;

	/**
	 * @private
	 * @param {number} x number
	 * @return {number}
	 */
	var ceil = Math.ceil;

	/**
	 * @private
	 * @param {number} x number
	 * @return {number}
	 */
	var floor = Math.floor;

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @param {number} shift number of months to shift
	 * @return {number} number of days shifted
	 */
	function borrowMonths(ref, shift) {
		var prevTime = ref.getTime();

		// increment month by shift
		ref.setMonth( ref.getMonth() + shift );

		// this is the trickiest since months vary in length
		return Math.round( (ref.getTime() - prevTime) / MILLISECONDS_PER_DAY );
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @return {number} number of days
	 */
	function daysPerMonth(ref) {
		var a = ref.getTime();

		// increment month by 1
		var b = new Date(a);
		b.setMonth( ref.getMonth() + 1 );

		// this is the trickiest since months vary in length
		return Math.round( (b.getTime() - a) / MILLISECONDS_PER_DAY );
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @return {number} number of days
	 */
	function daysPerYear(ref) {
		var a = ref.getTime();

		// increment year by 1
		var b = new Date(a);
		b.setFullYear( ref.getFullYear() + 1 );

		// this is the trickiest since years (periodically) vary in length
		return Math.round( (b.getTime() - a) / MILLISECONDS_PER_DAY );
	}

	/**
	 * Applies the Timespan to the given date.
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {Date=} date
	 * @return {Date}
	 */
	function addToDate(ts, date) {
		date = (date instanceof Date) || ((date !== null) && isFinite(date)) ? new Date(+date) : new Date();
		if (!ts) {
			return date;
		}

		// if there is a value field, use it directly
		var value = +ts.value || 0;
		if (value) {
			date.setTime(date.getTime() + value);
			return date;
		}

		value = +ts.milliseconds || 0;
		if (value) {
			date.setMilliseconds(date.getMilliseconds() + value);
		}

		value = +ts.seconds || 0;
		if (value) {
			date.setSeconds(date.getSeconds() + value);
		}

		value = +ts.minutes || 0;
		if (value) {
			date.setMinutes(date.getMinutes() + value);
		}

		value = +ts.hours || 0;
		if (value) {
			date.setHours(date.getHours() + value);
		}

		value = +ts.weeks || 0;
		if (value) {
			value *= DAYS_PER_WEEK;
		}

		value += +ts.days || 0;
		if (value) {
			date.setDate(date.getDate() + value);
		}

		value = +ts.months || 0;
		if (value) {
			date.setMonth(date.getMonth() + value);
		}

		value = +ts.millennia || 0;
		if (value) {
			value *= CENTURIES_PER_MILLENNIUM;
		}

		value += +ts.centuries || 0;
		if (value) {
			value *= DECADES_PER_CENTURY;
		}

		value += +ts.decades || 0;
		if (value) {
			value *= YEARS_PER_DECADE;
		}

		value += +ts.years || 0;
		if (value) {
			date.setFullYear(date.getFullYear() + value);
		}

		return date;
	}

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MILLISECONDS	= 0;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_SECONDS		= 1;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MINUTES		= 2;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_HOURS			= 3;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_DAYS			= 4;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_WEEKS			= 5;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MONTHS		= 6;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_YEARS			= 7;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_DECADES		= 8;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_CENTURIES		= 9;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MILLENNIA		= 10;

	/**
	 * @private
	 * @type {Array}
	 */
	var LABELS_SINGLUAR;

	/**
	 * @private
	 * @type {Array}
	 */
	var LABELS_PLURAL;

	/**
	 * @private
	 * @type {string}
	 */
	var LABEL_LAST;

	/**
	 * @private
	 * @type {string}
	 */
	var LABEL_DELIM;

	/**
	 * @private
	 * @type {string}
	 */
	var LABEL_NOW;

	/**
	 * Formats a number & unit as a string
	 * 
	 * @param {number} value
	 * @param {number} unit
	 * @return {string}
	 */
	var formatter;

	/**
	 * Formats a number as a string
	 * 
	 * @private
	 * @param {number} value
	 * @return {string}
	 */
	var formatNumber;

	/**
	 * @private
	 * @param {number} value
	 * @param {number} unit unit index into label list
	 * @return {string}
	 */
	function plurality(value, unit) {
		return formatNumber(value)+((value === 1) ? LABELS_SINGLUAR[unit] : LABELS_PLURAL[unit]);
	}

	/**
	 * Formats the entries with singular or plural labels
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @return {Array}
	 */
	var formatList;

	/**
	 * Timespan representation of a duration of time
	 * 
	 * @private
	 * @this {Timespan}
	 * @constructor
	 */
	function Timespan() {}

	/**
	 * Formats the Timespan as a sentence
	 * 
	 * @param {string=} emptyLabel the string to use when no values returned
	 * @return {string}
	 */
	Timespan.prototype.toString = function(emptyLabel) {
		var label = formatList(this);

		var count = label.length;
		if (!count) {
			return emptyLabel ? ''+emptyLabel : LABEL_NOW;
		}
		if (count === 1) {
			return label[0];
		}

		var last = LABEL_LAST+label.pop();
		return label.join(LABEL_DELIM)+last;
	};

	/**
	 * Formats the Timespan as a sentence in HTML
	 * 
	 * @param {string=} tag HTML tag name to wrap each value
	 * @param {string=} emptyLabel the string to use when no values returned
	 * @return {string}
	 */
	Timespan.prototype.toHTML = function(tag, emptyLabel) {
		tag = tag || 'span';
		var label = formatList(this);

		var count = label.length;
		if (!count) {
			emptyLabel = emptyLabel || LABEL_NOW;
			return emptyLabel ? '<'+tag+'>'+emptyLabel+'</'+tag+'>' : emptyLabel;
		}
		for (var i=0; i<count; i++) {
			// wrap each unit in tag
			label[i] = '<'+tag+'>'+label[i]+'</'+tag+'>';
		}
		if (count === 1) {
			return label[0];
		}

		var last = LABEL_LAST+label.pop();
		return label.join(LABEL_DELIM)+last;
	};

	/**
	 * Applies the Timespan to the given date
	 * 
	 * @param {Date=} date the date to which the timespan is added.
	 * @return {Date}
	 */
	Timespan.prototype.addTo = function(date) {
		return addToDate(this, date);
	};

	/**
	 * Formats the entries as English labels
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @return {Array}
	 */
	formatList = function(ts) {
		var list = [];

		var value = ts.millennia;
		if (value) {
			list.push(formatter(value, LABEL_MILLENNIA));
		}

		value = ts.centuries;
		if (value) {
			list.push(formatter(value, LABEL_CENTURIES));
		}

		value = ts.decades;
		if (value) {
			list.push(formatter(value, LABEL_DECADES));
		}

		value = ts.years;
		if (value) {
			list.push(formatter(value, LABEL_YEARS));
		}

		value = ts.months;
		if (value) {
			list.push(formatter(value, LABEL_MONTHS));
		}

		value = ts.weeks;
		if (value) {
			list.push(formatter(value, LABEL_WEEKS));
		}

		value = ts.days;
		if (value) {
			list.push(formatter(value, LABEL_DAYS));
		}

		value = ts.hours;
		if (value) {
			list.push(formatter(value, LABEL_HOURS));
		}

		value = ts.minutes;
		if (value) {
			list.push(formatter(value, LABEL_MINUTES));
		}

		value = ts.seconds;
		if (value) {
			list.push(formatter(value, LABEL_SECONDS));
		}

		value = ts.milliseconds;
		if (value) {
			list.push(formatter(value, LABEL_MILLISECONDS));
		}

		return list;
	};

	/**
	 * Borrow any underflow units, carry any overflow units
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {string} toUnit
	 */
	function rippleRounded(ts, toUnit) {
		switch (toUnit) {
			case 'seconds':
				if (ts.seconds !== SECONDS_PER_MINUTE || isNaN(ts.minutes)) {
					return;
				}
				// ripple seconds up to minutes
				ts.minutes++;
				ts.seconds = 0;

				/* falls through */
			case 'minutes':
				if (ts.minutes !== MINUTES_PER_HOUR || isNaN(ts.hours)) {
					return;
				}
				// ripple minutes up to hours
				ts.hours++;
				ts.minutes = 0;

				/* falls through */
			case 'hours':
				if (ts.hours !== HOURS_PER_DAY || isNaN(ts.days)) {
					return;
				}
				// ripple hours up to days
				ts.days++;
				ts.hours = 0;

				/* falls through */
			case 'days':
				if (ts.days !== DAYS_PER_WEEK || isNaN(ts.weeks)) {
					return;
				}
				// ripple days up to weeks
				ts.weeks++;
				ts.days = 0;

				/* falls through */
			case 'weeks':
				if (ts.weeks !== daysPerMonth(ts.refMonth)/DAYS_PER_WEEK || isNaN(ts.months)) {
					return;
				}
				// ripple weeks up to months
				ts.months++;
				ts.weeks = 0;

				/* falls through */
			case 'months':
				if (ts.months !== MONTHS_PER_YEAR || isNaN(ts.years)) {
					return;
				}
				// ripple months up to years
				ts.years++;
				ts.months = 0;

				/* falls through */
			case 'years':
				if (ts.years !== YEARS_PER_DECADE || isNaN(ts.decades)) {
					return;
				}
				// ripple years up to decades
				ts.decades++;
				ts.years = 0;

				/* falls through */
			case 'decades':
				if (ts.decades !== DECADES_PER_CENTURY || isNaN(ts.centuries)) {
					return;
				}
				// ripple decades up to centuries
				ts.centuries++;
				ts.decades = 0;

				/* falls through */
			case 'centuries':
				if (ts.centuries !== CENTURIES_PER_MILLENNIUM || isNaN(ts.millennia)) {
					return;
				}
				// ripple centuries up to millennia
				ts.millennia++;
				ts.centuries = 0;
				/* falls through */
			}
	}

	/**
	 * Ripple up partial units one place
	 * 
	 * @private
	 * @param {Timespan} ts timespan
	 * @param {number} frac accumulated fractional value
	 * @param {string} fromUnit source unit name
	 * @param {string} toUnit target unit name
	 * @param {number} conversion multiplier between units
	 * @param {number} digits max number of decimal digits to output
	 * @return {number} new fractional value
	 */
	function fraction(ts, frac, fromUnit, toUnit, conversion, digits) {
		if (ts[fromUnit] >= 0) {
			frac += ts[fromUnit];
			delete ts[fromUnit];
		}

		frac /= conversion;
		if (frac + 1 <= 1) {
			// drop if below machine epsilon
			return 0;
		}

		if (ts[toUnit] >= 0) {
			// ensure does not have more than specified number of digits
			ts[toUnit] = +(ts[toUnit] + frac).toFixed(digits);
			rippleRounded(ts, toUnit);
			return 0;
		}

		return frac;
	}

	/**
	 * Ripple up partial units to next existing
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {number} digits max number of decimal digits to output
	 */
	function fractional(ts, digits) {
		var frac = fraction(ts, 0, 'milliseconds', 'seconds', MILLISECONDS_PER_SECOND, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'seconds', 'minutes', SECONDS_PER_MINUTE, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'minutes', 'hours', MINUTES_PER_HOUR, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'hours', 'days', HOURS_PER_DAY, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'days', 'weeks', DAYS_PER_WEEK, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'weeks', 'months', daysPerMonth(ts.refMonth)/DAYS_PER_WEEK, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'months', 'years', daysPerYear(ts.refMonth)/daysPerMonth(ts.refMonth), digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'years', 'decades', YEARS_PER_DECADE, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'decades', 'centuries', DECADES_PER_CENTURY, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'centuries', 'millennia', CENTURIES_PER_MILLENNIUM, digits);

		// should never reach this with remaining fractional value
		if (frac) { throw new Error('Fractional unit overflow'); }
	}

	/**
	 * Borrow any underflow units, carry any overflow units
	 * 
	 * @private
	 * @param {Timespan} ts
	 */
	function ripple(ts) {
		var x;

		if (ts.milliseconds < 0) {
			// ripple seconds down to milliseconds
			x = ceil(-ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.seconds -= x;
			ts.milliseconds += x * MILLISECONDS_PER_SECOND;

		} else if (ts.milliseconds >= MILLISECONDS_PER_SECOND) {
			// ripple milliseconds up to seconds
			ts.seconds += floor(ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.milliseconds %= MILLISECONDS_PER_SECOND;
		}

		if (ts.seconds < 0) {
			// ripple minutes down to seconds
			x = ceil(-ts.seconds / SECONDS_PER_MINUTE);
			ts.minutes -= x;
			ts.seconds += x * SECONDS_PER_MINUTE;

		} else if (ts.seconds >= SECONDS_PER_MINUTE) {
			// ripple seconds up to minutes
			ts.minutes += floor(ts.seconds / SECONDS_PER_MINUTE);
			ts.seconds %= SECONDS_PER_MINUTE;
		}

		if (ts.minutes < 0) {
			// ripple hours down to minutes
			x = ceil(-ts.minutes / MINUTES_PER_HOUR);
			ts.hours -= x;
			ts.minutes += x * MINUTES_PER_HOUR;

		} else if (ts.minutes >= MINUTES_PER_HOUR) {
			// ripple minutes up to hours
			ts.hours += floor(ts.minutes / MINUTES_PER_HOUR);
			ts.minutes %= MINUTES_PER_HOUR;
		}

		if (ts.hours < 0) {
			// ripple days down to hours
			x = ceil(-ts.hours / HOURS_PER_DAY);
			ts.days -= x;
			ts.hours += x * HOURS_PER_DAY;

		} else if (ts.hours >= HOURS_PER_DAY) {
			// ripple hours up to days
			ts.days += floor(ts.hours / HOURS_PER_DAY);
			ts.hours %= HOURS_PER_DAY;
		}

		while (ts.days < 0) {
			// NOTE: never actually seen this loop more than once

			// ripple months down to days
			ts.months--;
			ts.days += borrowMonths(ts.refMonth, 1);
		}

		// weeks is always zero here

		if (ts.days >= DAYS_PER_WEEK) {
			// ripple days up to weeks
			ts.weeks += floor(ts.days / DAYS_PER_WEEK);
			ts.days %= DAYS_PER_WEEK;
		}

		if (ts.months < 0) {
			// ripple years down to months
			x = ceil(-ts.months / MONTHS_PER_YEAR);
			ts.years -= x;
			ts.months += x * MONTHS_PER_YEAR;

		} else if (ts.months >= MONTHS_PER_YEAR) {
			// ripple months up to years
			ts.years += floor(ts.months / MONTHS_PER_YEAR);
			ts.months %= MONTHS_PER_YEAR;
		}

		// years is always non-negative here
		// decades, centuries and millennia are always zero here

		if (ts.years >= YEARS_PER_DECADE) {
			// ripple years up to decades
			ts.decades += floor(ts.years / YEARS_PER_DECADE);
			ts.years %= YEARS_PER_DECADE;

			if (ts.decades >= DECADES_PER_CENTURY) {
				// ripple decades up to centuries
				ts.centuries += floor(ts.decades / DECADES_PER_CENTURY);
				ts.decades %= DECADES_PER_CENTURY;

				if (ts.centuries >= CENTURIES_PER_MILLENNIUM) {
					// ripple centuries up to millennia
					ts.millennia += floor(ts.centuries / CENTURIES_PER_MILLENNIUM);
					ts.centuries %= CENTURIES_PER_MILLENNIUM;
				}
			}
		}
	}

	/**
	 * Remove any units not requested
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {number} units the units to populate
	 * @param {number} max number of labels to output
	 * @param {number} digits max number of decimal digits to output
	 */
	function pruneUnits(ts, units, max, digits) {
		var count = 0;

		// Calc from largest unit to smallest to prevent underflow
		if (!(units & MILLENNIA) || (count >= max)) {
			// ripple millennia down to centuries
			ts.centuries += ts.millennia * CENTURIES_PER_MILLENNIUM;
			delete ts.millennia;

		} else if (ts.millennia) {
			count++;
		}

		if (!(units & CENTURIES) || (count >= max)) {
			// ripple centuries down to decades
			ts.decades += ts.centuries * DECADES_PER_CENTURY;
			delete ts.centuries;

		} else if (ts.centuries) {
			count++;
		}

		if (!(units & DECADES) || (count >= max)) {
			// ripple decades down to years
			ts.years += ts.decades * YEARS_PER_DECADE;
			delete ts.decades;

		} else if (ts.decades) {
			count++;
		}

		if (!(units & YEARS) || (count >= max)) {
			// ripple years down to months
			ts.months += ts.years * MONTHS_PER_YEAR;
			delete ts.years;

		} else if (ts.years) {
			count++;
		}

		if (!(units & MONTHS) || (count >= max)) {
			// ripple months down to days
			if (ts.months) {
				ts.days += borrowMonths(ts.refMonth, ts.months);
			}
			delete ts.months;

			if (ts.days >= DAYS_PER_WEEK) {
				// ripple day overflow back up to weeks
				ts.weeks += floor(ts.days / DAYS_PER_WEEK);
				ts.days %= DAYS_PER_WEEK;
			}

		} else if (ts.months) {
			count++;
		}

		if (!(units & WEEKS) || (count >= max)) {
			// ripple weeks down to days
			ts.days += ts.weeks * DAYS_PER_WEEK;
			delete ts.weeks;

		} else if (ts.weeks) {
			count++;
		}

		if (!(units & DAYS) || (count >= max)) {
			//ripple days down to hours
			ts.hours += ts.days * HOURS_PER_DAY;
			delete ts.days;

		} else if (ts.days) {
			count++;
		}

		if (!(units & HOURS) || (count >= max)) {
			// ripple hours down to minutes
			ts.minutes += ts.hours * MINUTES_PER_HOUR;
			delete ts.hours;

		} else if (ts.hours) {
			count++;
		}

		if (!(units & MINUTES) || (count >= max)) {
			// ripple minutes down to seconds
			ts.seconds += ts.minutes * SECONDS_PER_MINUTE;
			delete ts.minutes;

		} else if (ts.minutes) {
			count++;
		}

		if (!(units & SECONDS) || (count >= max)) {
			// ripple seconds down to milliseconds
			ts.milliseconds += ts.seconds * MILLISECONDS_PER_SECOND;
			delete ts.seconds;

		} else if (ts.seconds) {
			count++;
		}

		// nothing to ripple milliseconds down to
		// so ripple back up to smallest existing unit as a fractional value
		if (!(units & MILLISECONDS) || (count >= max)) {
			fractional(ts, digits);
		}
	}

	/**
	 * Populates the Timespan object
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {?Date} start the starting date
	 * @param {?Date} end the ending date
	 * @param {number} units the units to populate
	 * @param {number} max number of labels to output
	 * @param {number} digits max number of decimal digits to output
	 */
	function populate(ts, start, end, units, max, digits) {
		var now = new Date();

		ts.start = start = start || now;
		ts.end = end = end || now;
		ts.units = units;

		ts.value = end.getTime() - start.getTime();
		if (ts.value < 0) {
			// swap if reversed
			var tmp = end;
			end = start;
			start = tmp;
		}

		// reference month for determining days in month
		ts.refMonth = new Date(start.getFullYear(), start.getMonth(), 15, 12, 0, 0);
		try {
			// reset to initial deltas
			ts.millennia = 0;
			ts.centuries = 0;
			ts.decades = 0;
			ts.years = end.getFullYear() - start.getFullYear();
			ts.months = end.getMonth() - start.getMonth();
			ts.weeks = 0;
			ts.days = end.getDate() - start.getDate();
			ts.hours = end.getHours() - start.getHours();
			ts.minutes = end.getMinutes() - start.getMinutes();
			ts.seconds = end.getSeconds() - start.getSeconds();
			ts.milliseconds = end.getMilliseconds() - start.getMilliseconds();

			ripple(ts);
			pruneUnits(ts, units, max, digits);

		} finally {
			delete ts.refMonth;
		}

		return ts;
	}

	/**
	 * Determine an appropriate refresh rate based upon units
	 * 
	 * @private
	 * @param {number} units the units to populate
	 * @return {number} milliseconds to delay
	 */
	function getDelay(units) {
		if (units & MILLISECONDS) {
			// refresh very quickly
			return MILLISECONDS_PER_SECOND / 30; //30Hz
		}

		if (units & SECONDS) {
			// refresh every second
			return MILLISECONDS_PER_SECOND; //1Hz
		}

		if (units & MINUTES) {
			// refresh every minute
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
		}

		if (units & HOURS) {
			// refresh hourly
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
		}
		
		if (units & DAYS) {
			// refresh daily
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
		}

		// refresh the rest weekly
		return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
	}

	/**
	 * API entry point
	 * 
	 * @public
	 * @param {Date|number|Timespan|null|function(Timespan,number)} start the starting date
	 * @param {Date|number|Timespan|null|function(Timespan,number)} end the ending date
	 * @param {number=} units the units to populate
	 * @param {number=} max number of labels to output
	 * @param {number=} digits max number of decimal digits to output
	 * @return {Timespan|number}
	 */
	function countdown(start, end, units, max, digits) {
		var callback;

		// ensure some units or use defaults
		units = +units || DEFAULTS;
		// max must be positive
		max = (max > 0) ? max : NaN;
		// clamp digits to an integer between [0, 20]
		digits = (digits > 0) ? (digits < 20) ? Math.round(digits) : 20 : 0;

		// ensure start date
		var startTS = null;
		if ('function' === typeof start) {
			callback = start;
			start = null;

		} else if (!(start instanceof Date)) {
			if ((start !== null) && isFinite(start)) {
				start = new Date(+start);
			} else {
				if ('object' === typeof startTS) {
					startTS = /** @type{Timespan} */(start);
				}
				start = null;
			}
		}

		// ensure end date
		var endTS = null;
		if ('function' === typeof end) {
			callback = end;
			end = null;

		} else if (!(end instanceof Date)) {
			if ((end !== null) && isFinite(end)) {
				end = new Date(+end);
			} else {
				if ('object' === typeof end) {
					endTS = /** @type{Timespan} */(end);
				}
				end = null;
			}
		}

		// must wait to interpret timespans until after resolving dates
		if (startTS) {
			start = addToDate(startTS, end);
		}
		if (endTS) {
			end = addToDate(endTS, start);
		}

		if (!start && !end) {
			// used for unit testing
			return new Timespan();
		}

		if (!callback) {
			return populate(new Timespan(), /** @type{Date} */(start), /** @type{Date} */(end), /** @type{number} */(units), /** @type{number} */(max), /** @type{number} */(digits));
		}

		// base delay off units
		var delay = getDelay(units),
			timerId,
			fn = function() {
				callback(
					populate(new Timespan(), /** @type{Date} */(start), /** @type{Date} */(end), /** @type{number} */(units), /** @type{number} */(max), /** @type{number} */(digits)),
					timerId
				);
			};

		fn();
		return (timerId = setInterval(fn, delay));
	}

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MILLISECONDS = MILLISECONDS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.SECONDS = SECONDS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MINUTES = MINUTES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.HOURS = HOURS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DAYS = DAYS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.WEEKS = WEEKS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MONTHS = MONTHS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.YEARS = YEARS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DECADES = DECADES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.CENTURIES = CENTURIES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MILLENNIA = MILLENNIA;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DEFAULTS = DEFAULTS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.ALL = MILLENNIA|CENTURIES|DECADES|YEARS|MONTHS|WEEKS|DAYS|HOURS|MINUTES|SECONDS|MILLISECONDS;

	/**
	 * Customize the format settings.
	 * @public
	 * @param {Object} format settings object
	 */
	var setFormat = countdown.setFormat = function(format) {
		if (!format) { return; }

		if ('singular' in format || 'plural' in format) {
			var singular = format.singular || [];
			if (singular.split) {
				singular = singular.split('|');
			}
			var plural = format.plural || [];
			if (plural.split) {
				plural = plural.split('|');
			}

			for (var i=LABEL_MILLISECONDS; i<=LABEL_MILLENNIA; i++) {
				// override any specified units
				LABELS_SINGLUAR[i] = singular[i] || LABELS_SINGLUAR[i];
				LABELS_PLURAL[i] = plural[i] || LABELS_PLURAL[i];
			}
		}

		if ('string' === typeof format.last) {
			LABEL_LAST = format.last;
		}
		if ('string' === typeof format.delim) {
			LABEL_DELIM = format.delim;
		}
		if ('string' === typeof format.empty) {
			LABEL_NOW = format.empty;
		}
		if ('function' === typeof format.formatNumber) {
			formatNumber = format.formatNumber;
		}
		if ('function' === typeof format.formatter) {
			formatter = format.formatter;
		}
	};

	/**
	 * Revert to the default formatting.
	 * @public
	 */
	var resetFormat = countdown.resetFormat = function() {
		LABELS_SINGLUAR = ' millisecond| second| minute| hour| day| week| month| year| decade| century| millennium'.split('|');
		LABELS_PLURAL = ' milliseconds| seconds| minutes| hours| days| weeks| months| years| decades| centuries| millennia'.split('|');
		LABEL_LAST = ' and ';
		LABEL_DELIM = ', ';
		LABEL_NOW = '';
		formatNumber = function(value) { return value; };
		formatter = plurality;
	};

	/**
	 * Override the unit labels.
	 * @public
	 * @param {string|Array=} singular a pipe ('|') delimited list of singular unit name overrides
	 * @param {string|Array=} plural a pipe ('|') delimited list of plural unit name overrides
	 * @param {string=} last a delimiter before the last unit (default: ' and ')
	 * @param {string=} delim a delimiter to use between all other units (default: ', ')
	 * @param {string=} empty a label to use when all units are zero (default: '')
	 * @param {function(number):string=} formatNumber a function which formats numbers as a string
	 * @param {function(number,number):string=} formatter a function which formats a number/unit pair as a string
	 * @deprecated since version 2.6.0
	 */
	countdown.setLabels = function(singular, plural, last, delim, empty, formatNumber, formatter) {
		setFormat({
			singular: singular,
			plural: plural,
			last: last,
			delim: delim,
			empty: empty,
			formatNumber: formatNumber,
			formatter: formatter
		});
	};

	/**
	 * Revert to the default unit labels.
	 * @public
	 * @deprecated since version 2.6.0
	 */
	countdown.resetLabels = resetFormat;

	resetFormat();

	if (module && module.exports) {
		module.exports = countdown;

	} else if (typeof window.define === 'function' && typeof window.define.amd !== 'undefined') {
		window.define('countdown', [], function() {
			return countdown;
		});
	}

	return countdown;

})(module);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTM2NWQ1YTdhMzQ1MTFhMDdhZTciLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZS5jc3M/YmQ4NCIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovLy8uL3NyYy9mb250cy9tcnNlYXZlcy50dGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL25hdi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguY3NzPzVkMTUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL2JnNS5qcGciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3VudGRvd24vY291bnRkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7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QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7O0FBRUEsNkJBQTZCLG1CQUFtQjs7QUFFaEQ7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM1V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLFdBQVcsRUFBRTtBQUNyRCx3Q0FBd0MsV0FBVyxFQUFFOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLHNDQUFzQztBQUN0QyxHQUFHO0FBQ0g7QUFDQSw4REFBOEQ7QUFDOUQ7O0FBRUE7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBOzs7Ozs7O0FDeEZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFD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WDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EsZ0JBQWdCLFFBQVE7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUMsb0JBQW9CO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsY0FBYztBQUNoRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksY0FBYztBQUMxQixZQUFZLGNBQWM7QUFDMUIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixZQUFZLFFBQVE7QUFDcEIsWUFBWSx5QkFBeUI7QUFDckMsWUFBWSxnQ0FBZ0M7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQSxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDUzNjVkNWE3YTM0NTExYTA3YWU3IiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRFbGVtZW50ID0gKGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbyA9IHt9O1xuXG5cdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHZhciBzdHlsZVRhcmdldCA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0Ly8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblx0XHRcdGlmIChzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG5cdFx0XHRcdFx0Ly8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1lbW9bc2VsZWN0b3JdID0gc3R5bGVUYXJnZXQ7XG5cdFx0fVxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24gJiYgdHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uICE9PSBcImJvb2xlYW5cIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcblx0aWYgKCFvcHRpb25zLmluc2VydEludG8pIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICghb3B0aW9ucy5pbnNlcnRBdCkgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUgKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykgZG9tU3R5bGUucGFydHNbal0oKTtcblxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cblx0XHRpZighbmV3U3R5bGVzW2lkXSkgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudCAob3B0aW9ucywgc3R5bGUpIHtcblx0dmFyIHRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXG5cdGlmICghdGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZXNJbnNlcnRlZEF0VG9wW3N0eWxlc0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCB0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHRcdH1cblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcIm9iamVjdFwiICYmIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKSB7XG5cdFx0dmFyIG5leHRTaWJsaW5nID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8gKyBcIiBcIiArIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKTtcblx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBuZXh0U2libGluZyk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiW1N0eWxlIExvYWRlcl1cXG5cXG4gSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcgKCdvcHRpb25zLmluc2VydEF0JykgZm91bmQuXFxuIE11c3QgYmUgJ3RvcCcsICdib3R0b20nLCBvciBPYmplY3QuXFxuIChodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlciNpbnNlcnRhdClcXG5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vc3R5bGUuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3N0eWxlLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9zdHlsZS5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlLmNzc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1GamFsbGErT25lfFJvYm90b3xHcmVhdCtWaWJlcyk7XCIsIFwiXCJdKTtcblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJAZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiTXJzRWF2ZXNcXFwiO1xcbiAgc3JjOiB1cmwoXCIgKyByZXF1aXJlKFwiLi9mb250cy9tcnNlYXZlcy50dGZcIikgKyBcIikgZm9ybWF0KFxcXCJ0cnVldHlwZVxcXCIpO1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuI25hdiB7XFxuICBtYXJnaW4tdG9wOiAxdmg7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB0b3A6IDVweDtcXG4gIGxlZnQ6IDEwcHg7XFxuXFxuICBoZWlnaHQ6IDQ4cHg7XFxuICBtYXgtd2lkdGg6IDQ4cHg7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcblxcbiAgdHJhbnNpdGlvbjogbWF4LXdpZHRoIDcwMG1zIGVhc2UsIGJhY2tncm91bmQtY29sb3IgMTAwbXMgbGluZWFyIDcwMG1zO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJGamFsbGEgT25lXFxcIiwgc2FucztcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG5cXG4gIHotaW5kZXg6IDEwMDA7XFxufVxcblxcbiNuYXYgYnV0dG9uIHtcXG4gIGJhY2tncm91bmQ6IG5vbmUgIWltcG9ydGFudDtcXG4gIGNvbG9yOiBibGFjaztcXG4gIGJvcmRlcjogbm9uZTtcXG4gIHBhZGRpbmc6IDAhIGltcG9ydGFudDtcXG4gIGZvbnQ6IGluaGVyaXQ7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBvdXRsaW5lOiBpbmhlcml0ICFpbXBvcnRhbnQ7XFxuXFxuICBoZWlnaHQ6IDQ4cHg7XFxuICB3aWR0aDogNDhweDtcXG5cXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuNXMgZWFzZTtcXG4gIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xcbn1cXG5cXG4jbmF2Lm9wZW4ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcblxcbiAgbWF4LXdpZHRoOiA1MDBweDtcXG4gIHRyYW5zaXRpb246IG1heC13aWR0aCA3MDBtcyBlYXNlLCBiYWNrZ3JvdW5kLWNvbG9yIDIwMG1zIGVhc2U7XFxufVxcblxcbiNuYXYub3BlbiBidXR0b24ge1xcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC41cyBlYXNlO1xcbiAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xcbn1cXG5cXG4jbGlua3Mge1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgbGluZS1oZWlnaHQ6IDQ4cHg7XFxufVxcblxcbiNsaW5rcyAuc2VwYXJhdG9yIHtcXG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIGJsYWNrO1xcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xcbiAgaGVpZ2h0OiAzMHB4O1xcbn1cXG5cXG4jbmF2IGEge1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgZm9udC1zaXplOiAxLjVlbTtcXG4gIFxcbiAgcGFkZGluZy1yaWdodDogMTBweDtcXG59XFxuXFxuI25hdiBhOmxhc3QtY2hpbGQge1xcbiAgcGFkZGluZy1yaWdodDogMTBweDtcXG59XFxuXFxuLmhpZGRlbiB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyIS4vc3JjL3N0eWxlLmNzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjQ0MjdmMWVhNTBhZWZkN2U4YWU3YmI4ZWMyYjIyMzk4LnR0ZlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ZvbnRzL21yc2VhdmVzLnR0ZlxuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluaXRfbmF2X2J1dHRvbigpIHtcbiAgbGV0IG5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYnKTtcbiAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgbmF2LmNsYXNzTGlzdC50b2dnbGUoJ29wZW4nKTtcbiAgfSlcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9uYXYuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9pbmRleC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vaW5kZXguY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2luZGV4LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMiA0IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiYm9keSB7XFxuICBmb250LWZhbWlseTogTXJzRWF2ZXMsIEdlb3JnaWEsIHNlcmlmO1xcbn1cXG5cXG5odG1sIHtcXG4gIGJhY2tncm91bmQ6IHVybChcIiArIHJlcXVpcmUoXCIuL2ltZy9iZzUuanBnXCIpICsgXCIpIG5vLXJlcGVhdCBjZW50ZXIgY2VudGVyIGZpeGVkO1xcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXG59XFxuXFxuLnRpdGxlIHtcXG4gIHBhZGRpbmc6IDR2aCAwO1xcbiAgbWFyZ2luLXRvcDogMjV2aDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcblxcbiAgY29sb3I6IGJsYWNrO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTYsIDI1NiwgMjU2LCAuNCk7XFxufVxcblxcbi50aXRsZSA+ICoge1xcbiAgbWFyZ2luOiAzdmggYXV0bztcXG4gIHdpZHRoOiBmaXQtY29udGVudDtcXG59XFxuXFxuLnRpdGxlIGgxIHtcXG4gIGZvbnQtd2VpZ2h0OiAxMDAwO1xcbiAgZm9udC1zaXplOiAxMHZoO1xcbiAgZm9udC1mYW1pbHk6IGJvbWJzaGVsbDtcXG59XFxuXFxuLmxvZ28gdGFibGUge1xcbiAgZm9udC1mYW1pbHk6IE1yc0VhdmVzO1xcbiAgZm9udC1zaXplOiA2dmg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBjb2xvcjogYmxhY2s7XFxufVxcblxcbi5obCB7XFxuICBjb2xvcjogd2hpdGU7XFxufVxcblxcbi5jb3VudGRvd24ge1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgYm90dG9tOiA1cHg7XFxuICByaWdodDogMTBweDtcXG4gIGZvbnQtc2l6ZTogM3ZoO1xcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyIS4vc3JjL2luZGV4LmNzc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDIgNCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjNhMDlhM2MyNzU2OTYzZThiM2RjN2U2ZWM4ODMwMTRjLmpwZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9iZzUuanBnXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMiA0IiwiaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcbmltcG9ydCBcIi4vaW5kZXguY3NzXCI7XG5cbmltcG9ydCBpbml0X25hdl9idXR0b24gZnJvbSBcIi4vbmF2XCI7XG5cbmNvbnN0IGNvdW50ZG93biA9IHJlcXVpcmUoJ2NvdW50ZG93bicpO1xuY29uc3QgVEhFX0RBVEUgPSBuZXcgRGF0ZSgxNTM0NjI2MDAwMDAwKTtcbmNvbnN0IENPVU5URE9XTl9VTklUUyA9IGNvdW50ZG93bi5EQVlTIHwgY291bnRkb3duLkhPVVJTIHwgY291bnRkb3duLk1JTlVURVM7XG5cbmNvbnN0IFNFQ09ORFMgPSAxMDAwO1xuY29uc3QgTUlOVVRFUyA9IFNFQ09ORFMgKiA2MDtcblxuZnVuY3Rpb24gdGlja19jb3VudGRvd24oKSB7XG4gIGxldCBzID0gJ2luICcgKyBjb3VudGRvd24oVEhFX0RBVEUsIG51bGwsIENPVU5URE9XTl9VTklUUykudG9TdHJpbmcoKTtcbiAgbGV0IGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY291bnRkb3duJyk7XG4gIGZvciAobGV0IGVsZSBvZiBlbGVtZW50cykge1xuICAgIGVsZS5pbm5lckhUTUwgPSBzLnJlcGxhY2UoJyBhbmQnLCAnLCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJlZ2luX2NvdW50ZG93bl9sb29wKCkge1xuICB0aWNrX2NvdW50ZG93bigpO1xuICB3aW5kb3cuc2V0SW50ZXJ2YWwodGlja19jb3VudGRvd24sIDEgKiBNSU5VVEVTKTtcbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgYmVnaW5fY291bnRkb3duX2xvb3AoKTtcbiAgaW5pdF9uYXZfYnV0dG9uKCk7XG59XG5cbmluaXQoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDQiLCIvKmdsb2JhbCB3aW5kb3cgKi9cbi8qKlxuICogQGxpY2Vuc2UgY291bnRkb3duLmpzIHYyLjYuMCBodHRwOi8vY291bnRkb3duanMub3JnXG4gKiBDb3B5cmlnaHQgKGMpMjAwNi0yMDE0IFN0ZXBoZW4gTS4gTWNLYW1leS5cbiAqIExpY2Vuc2VkIHVuZGVyIFRoZSBNSVQgTGljZW5zZS5cbiAqL1xuLypqc2hpbnQgYml0d2lzZTpmYWxzZSAqL1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqIEB0eXBlIHtPYmplY3R8bnVsbH1cbiAqL1xudmFyIG1vZHVsZTtcblxuLyoqXG4gKiBBUEkgZW50cnlcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KXxEYXRlfG51bWJlcn0gc3RhcnQgdGhlIHN0YXJ0aW5nIGRhdGVcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KXxEYXRlfG51bWJlcn0gZW5kIHRoZSBlbmRpbmcgZGF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHVuaXRzIHRoZSB1bml0cyB0byBwb3B1bGF0ZVxuICogQHJldHVybiB7T2JqZWN0fG51bWJlcn1cbiAqL1xudmFyIGNvdW50ZG93biA9IChcblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gbW9kdWxlIENvbW1vbkpTIE1vZHVsZVxuICovXG5mdW5jdGlvbihtb2R1bGUpIHtcblx0Lypqc2hpbnQgc21hcnR0YWJzOnRydWUgKi9cblxuXHQndXNlIHN0cmljdCc7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIE1JTExJU0VDT05EU1x0PSAweDAwMTtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgU0VDT05EU1x0XHRcdD0gMHgwMDI7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIE1JTlVURVNcdFx0XHQ9IDB4MDA0O1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBIT1VSU1x0XHRcdD0gMHgwMDg7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIERBWVNcdFx0XHQ9IDB4MDEwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBXRUVLU1x0XHRcdD0gMHgwMjA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIE1PTlRIU1x0XHRcdD0gMHgwNDA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIFlFQVJTXHRcdFx0PSAweDA4MDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgREVDQURFU1x0XHRcdD0gMHgxMDA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIENFTlRVUklFU1x0XHQ9IDB4MjAwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNSUxMRU5OSUFcdFx0PSAweDQwMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgREVGQVVMVFNcdFx0PSBZRUFSU3xNT05USFN8REFZU3xIT1VSU3xNSU5VVEVTfFNFQ09ORFM7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIE1JTExJU0VDT05EU19QRVJfU0VDT05EID0gMTAwMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgU0VDT05EU19QRVJfTUlOVVRFID0gNjA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIE1JTlVURVNfUEVSX0hPVVIgPSA2MDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgSE9VUlNfUEVSX0RBWSA9IDI0O1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNSUxMSVNFQ09ORFNfUEVSX0RBWSA9IEhPVVJTX1BFUl9EQVkgKiBNSU5VVEVTX1BFUl9IT1VSICogU0VDT05EU19QRVJfTUlOVVRFICogTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQ7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIERBWVNfUEVSX1dFRUsgPSA3O1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNT05USFNfUEVSX1lFQVIgPSAxMjtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgWUVBUlNfUEVSX0RFQ0FERSA9IDEwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBERUNBREVTX1BFUl9DRU5UVVJZID0gMTA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIENFTlRVUklFU19QRVJfTUlMTEVOTklVTSA9IDEwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0geCBudW1iZXJcblx0ICogQHJldHVybiB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIGNlaWwgPSBNYXRoLmNlaWw7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4IG51bWJlclxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0RhdGV9IHJlZiByZWZlcmVuY2UgZGF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2hpZnQgbnVtYmVyIG9mIG1vbnRocyB0byBzaGlmdFxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9IG51bWJlciBvZiBkYXlzIHNoaWZ0ZWRcblx0ICovXG5cdGZ1bmN0aW9uIGJvcnJvd01vbnRocyhyZWYsIHNoaWZ0KSB7XG5cdFx0dmFyIHByZXZUaW1lID0gcmVmLmdldFRpbWUoKTtcblxuXHRcdC8vIGluY3JlbWVudCBtb250aCBieSBzaGlmdFxuXHRcdHJlZi5zZXRNb250aCggcmVmLmdldE1vbnRoKCkgKyBzaGlmdCApO1xuXG5cdFx0Ly8gdGhpcyBpcyB0aGUgdHJpY2tpZXN0IHNpbmNlIG1vbnRocyB2YXJ5IGluIGxlbmd0aFxuXHRcdHJldHVybiBNYXRoLnJvdW5kKCAocmVmLmdldFRpbWUoKSAtIHByZXZUaW1lKSAvIE1JTExJU0VDT05EU19QRVJfREFZICk7XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtEYXRlfSByZWYgcmVmZXJlbmNlIGRhdGVcblx0ICogQHJldHVybiB7bnVtYmVyfSBudW1iZXIgb2YgZGF5c1xuXHQgKi9cblx0ZnVuY3Rpb24gZGF5c1Blck1vbnRoKHJlZikge1xuXHRcdHZhciBhID0gcmVmLmdldFRpbWUoKTtcblxuXHRcdC8vIGluY3JlbWVudCBtb250aCBieSAxXG5cdFx0dmFyIGIgPSBuZXcgRGF0ZShhKTtcblx0XHRiLnNldE1vbnRoKCByZWYuZ2V0TW9udGgoKSArIDEgKTtcblxuXHRcdC8vIHRoaXMgaXMgdGhlIHRyaWNraWVzdCBzaW5jZSBtb250aHMgdmFyeSBpbiBsZW5ndGhcblx0XHRyZXR1cm4gTWF0aC5yb3VuZCggKGIuZ2V0VGltZSgpIC0gYSkgLyBNSUxMSVNFQ09ORFNfUEVSX0RBWSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RGF0ZX0gcmVmIHJlZmVyZW5jZSBkYXRlXG5cdCAqIEByZXR1cm4ge251bWJlcn0gbnVtYmVyIG9mIGRheXNcblx0ICovXG5cdGZ1bmN0aW9uIGRheXNQZXJZZWFyKHJlZikge1xuXHRcdHZhciBhID0gcmVmLmdldFRpbWUoKTtcblxuXHRcdC8vIGluY3JlbWVudCB5ZWFyIGJ5IDFcblx0XHR2YXIgYiA9IG5ldyBEYXRlKGEpO1xuXHRcdGIuc2V0RnVsbFllYXIoIHJlZi5nZXRGdWxsWWVhcigpICsgMSApO1xuXG5cdFx0Ly8gdGhpcyBpcyB0aGUgdHJpY2tpZXN0IHNpbmNlIHllYXJzIChwZXJpb2RpY2FsbHkpIHZhcnkgaW4gbGVuZ3RoXG5cdFx0cmV0dXJuIE1hdGgucm91bmQoIChiLmdldFRpbWUoKSAtIGEpIC8gTUlMTElTRUNPTkRTX1BFUl9EQVkgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBsaWVzIHRoZSBUaW1lc3BhbiB0byB0aGUgZ2l2ZW4gZGF0ZS5cblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7VGltZXNwYW59IHRzXG5cdCAqIEBwYXJhbSB7RGF0ZT19IGRhdGVcblx0ICogQHJldHVybiB7RGF0ZX1cblx0ICovXG5cdGZ1bmN0aW9uIGFkZFRvRGF0ZSh0cywgZGF0ZSkge1xuXHRcdGRhdGUgPSAoZGF0ZSBpbnN0YW5jZW9mIERhdGUpIHx8ICgoZGF0ZSAhPT0gbnVsbCkgJiYgaXNGaW5pdGUoZGF0ZSkpID8gbmV3IERhdGUoK2RhdGUpIDogbmV3IERhdGUoKTtcblx0XHRpZiAoIXRzKSB7XG5cdFx0XHRyZXR1cm4gZGF0ZTtcblx0XHR9XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBhIHZhbHVlIGZpZWxkLCB1c2UgaXQgZGlyZWN0bHlcblx0XHR2YXIgdmFsdWUgPSArdHMudmFsdWUgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIHZhbHVlKTtcblx0XHRcdHJldHVybiBkYXRlO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gK3RzLm1pbGxpc2Vjb25kcyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0ZGF0ZS5zZXRNaWxsaXNlY29uZHMoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSArIHZhbHVlKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9ICt0cy5zZWNvbmRzIHx8IDA7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRkYXRlLnNldFNlY29uZHMoZGF0ZS5nZXRTZWNvbmRzKCkgKyB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSArdHMubWludXRlcyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0ZGF0ZS5zZXRNaW51dGVzKGRhdGUuZ2V0TWludXRlcygpICsgdmFsdWUpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gK3RzLmhvdXJzIHx8IDA7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRkYXRlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSArIHZhbHVlKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9ICt0cy53ZWVrcyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dmFsdWUgKj0gREFZU19QRVJfV0VFSztcblx0XHR9XG5cblx0XHR2YWx1ZSArPSArdHMuZGF5cyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0ZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgdmFsdWUpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gK3RzLm1vbnRocyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0ZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSArdHMubWlsbGVubmlhIHx8IDA7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHR2YWx1ZSAqPSBDRU5UVVJJRVNfUEVSX01JTExFTk5JVU07XG5cdFx0fVxuXG5cdFx0dmFsdWUgKz0gK3RzLmNlbnR1cmllcyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dmFsdWUgKj0gREVDQURFU19QRVJfQ0VOVFVSWTtcblx0XHR9XG5cblx0XHR2YWx1ZSArPSArdHMuZGVjYWRlcyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dmFsdWUgKj0gWUVBUlNfUEVSX0RFQ0FERTtcblx0XHR9XG5cblx0XHR2YWx1ZSArPSArdHMueWVhcnMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgdmFsdWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIExBQkVMX01JTExJU0VDT05EU1x0PSAwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9TRUNPTkRTXHRcdD0gMTtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfTUlOVVRFU1x0XHQ9IDI7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIExBQkVMX0hPVVJTXHRcdFx0PSAzO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9EQVlTXHRcdFx0PSA0O1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9XRUVLU1x0XHRcdD0gNTtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfTU9OVEhTXHRcdD0gNjtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfWUVBUlNcdFx0XHQ9IDc7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIExBQkVMX0RFQ0FERVNcdFx0PSA4O1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9DRU5UVVJJRVNcdFx0PSA5O1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9NSUxMRU5OSUFcdFx0PSAxMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0dmFyIExBQkVMU19TSU5HTFVBUjtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKi9cblx0dmFyIExBQkVMU19QTFVSQUw7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqL1xuXHR2YXIgTEFCRUxfTEFTVDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICovXG5cdHZhciBMQUJFTF9ERUxJTTtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQHR5cGUge3N0cmluZ31cblx0ICovXG5cdHZhciBMQUJFTF9OT1c7XG5cblx0LyoqXG5cdCAqIEZvcm1hdHMgYSBudW1iZXIgJiB1bml0IGFzIGEgc3RyaW5nXG5cdCAqIFxuXHQgKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHVuaXRcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblx0dmFyIGZvcm1hdHRlcjtcblxuXHQvKipcblx0ICogRm9ybWF0cyBhIG51bWJlciBhcyBhIHN0cmluZ1xuXHQgKiBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cdHZhciBmb3JtYXROdW1iZXI7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gdW5pdCB1bml0IGluZGV4IGludG8gbGFiZWwgbGlzdFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBwbHVyYWxpdHkodmFsdWUsIHVuaXQpIHtcblx0XHRyZXR1cm4gZm9ybWF0TnVtYmVyKHZhbHVlKSsoKHZhbHVlID09PSAxKSA/IExBQkVMU19TSU5HTFVBUlt1bml0XSA6IExBQkVMU19QTFVSQUxbdW5pdF0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZvcm1hdHMgdGhlIGVudHJpZXMgd2l0aCBzaW5ndWxhciBvciBwbHVyYWwgbGFiZWxzXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKiBAcmV0dXJuIHtBcnJheX1cblx0ICovXG5cdHZhciBmb3JtYXRMaXN0O1xuXG5cdC8qKlxuXHQgKiBUaW1lc3BhbiByZXByZXNlbnRhdGlvbiBvZiBhIGR1cmF0aW9uIG9mIHRpbWVcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0aGlzIHtUaW1lc3Bhbn1cblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRmdW5jdGlvbiBUaW1lc3BhbigpIHt9XG5cblx0LyoqXG5cdCAqIEZvcm1hdHMgdGhlIFRpbWVzcGFuIGFzIGEgc2VudGVuY2Vcblx0ICogXG5cdCAqIEBwYXJhbSB7c3RyaW5nPX0gZW1wdHlMYWJlbCB0aGUgc3RyaW5nIHRvIHVzZSB3aGVuIG5vIHZhbHVlcyByZXR1cm5lZFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXHRUaW1lc3Bhbi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihlbXB0eUxhYmVsKSB7XG5cdFx0dmFyIGxhYmVsID0gZm9ybWF0TGlzdCh0aGlzKTtcblxuXHRcdHZhciBjb3VudCA9IGxhYmVsLmxlbmd0aDtcblx0XHRpZiAoIWNvdW50KSB7XG5cdFx0XHRyZXR1cm4gZW1wdHlMYWJlbCA/ICcnK2VtcHR5TGFiZWwgOiBMQUJFTF9OT1c7XG5cdFx0fVxuXHRcdGlmIChjb3VudCA9PT0gMSkge1xuXHRcdFx0cmV0dXJuIGxhYmVsWzBdO1xuXHRcdH1cblxuXHRcdHZhciBsYXN0ID0gTEFCRUxfTEFTVCtsYWJlbC5wb3AoKTtcblx0XHRyZXR1cm4gbGFiZWwuam9pbihMQUJFTF9ERUxJTSkrbGFzdDtcblx0fTtcblxuXHQvKipcblx0ICogRm9ybWF0cyB0aGUgVGltZXNwYW4gYXMgYSBzZW50ZW5jZSBpbiBIVE1MXG5cdCAqIFxuXHQgKiBAcGFyYW0ge3N0cmluZz19IHRhZyBIVE1MIHRhZyBuYW1lIHRvIHdyYXAgZWFjaCB2YWx1ZVxuXHQgKiBAcGFyYW0ge3N0cmluZz19IGVtcHR5TGFiZWwgdGhlIHN0cmluZyB0byB1c2Ugd2hlbiBubyB2YWx1ZXMgcmV0dXJuZWRcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblx0VGltZXNwYW4ucHJvdG90eXBlLnRvSFRNTCA9IGZ1bmN0aW9uKHRhZywgZW1wdHlMYWJlbCkge1xuXHRcdHRhZyA9IHRhZyB8fCAnc3Bhbic7XG5cdFx0dmFyIGxhYmVsID0gZm9ybWF0TGlzdCh0aGlzKTtcblxuXHRcdHZhciBjb3VudCA9IGxhYmVsLmxlbmd0aDtcblx0XHRpZiAoIWNvdW50KSB7XG5cdFx0XHRlbXB0eUxhYmVsID0gZW1wdHlMYWJlbCB8fCBMQUJFTF9OT1c7XG5cdFx0XHRyZXR1cm4gZW1wdHlMYWJlbCA/ICc8Jyt0YWcrJz4nK2VtcHR5TGFiZWwrJzwvJyt0YWcrJz4nIDogZW1wdHlMYWJlbDtcblx0XHR9XG5cdFx0Zm9yICh2YXIgaT0wOyBpPGNvdW50OyBpKyspIHtcblx0XHRcdC8vIHdyYXAgZWFjaCB1bml0IGluIHRhZ1xuXHRcdFx0bGFiZWxbaV0gPSAnPCcrdGFnKyc+JytsYWJlbFtpXSsnPC8nK3RhZysnPic7XG5cdFx0fVxuXHRcdGlmIChjb3VudCA9PT0gMSkge1xuXHRcdFx0cmV0dXJuIGxhYmVsWzBdO1xuXHRcdH1cblxuXHRcdHZhciBsYXN0ID0gTEFCRUxfTEFTVCtsYWJlbC5wb3AoKTtcblx0XHRyZXR1cm4gbGFiZWwuam9pbihMQUJFTF9ERUxJTSkrbGFzdDtcblx0fTtcblxuXHQvKipcblx0ICogQXBwbGllcyB0aGUgVGltZXNwYW4gdG8gdGhlIGdpdmVuIGRhdGVcblx0ICogXG5cdCAqIEBwYXJhbSB7RGF0ZT19IGRhdGUgdGhlIGRhdGUgdG8gd2hpY2ggdGhlIHRpbWVzcGFuIGlzIGFkZGVkLlxuXHQgKiBAcmV0dXJuIHtEYXRlfVxuXHQgKi9cblx0VGltZXNwYW4ucHJvdG90eXBlLmFkZFRvID0gZnVuY3Rpb24oZGF0ZSkge1xuXHRcdHJldHVybiBhZGRUb0RhdGUodGhpcywgZGF0ZSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEZvcm1hdHMgdGhlIGVudHJpZXMgYXMgRW5nbGlzaCBsYWJlbHNcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7VGltZXNwYW59IHRzXG5cdCAqIEByZXR1cm4ge0FycmF5fVxuXHQgKi9cblx0Zm9ybWF0TGlzdCA9IGZ1bmN0aW9uKHRzKSB7XG5cdFx0dmFyIGxpc3QgPSBbXTtcblxuXHRcdHZhciB2YWx1ZSA9IHRzLm1pbGxlbm5pYTtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX01JTExFTk5JQSkpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMuY2VudHVyaWVzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfQ0VOVFVSSUVTKSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSB0cy5kZWNhZGVzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfREVDQURFUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMueWVhcnM7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRsaXN0LnB1c2goZm9ybWF0dGVyKHZhbHVlLCBMQUJFTF9ZRUFSUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMubW9udGhzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfTU9OVEhTKSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSB0cy53ZWVrcztcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX1dFRUtTKSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSB0cy5kYXlzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfREFZUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMuaG91cnM7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRsaXN0LnB1c2goZm9ybWF0dGVyKHZhbHVlLCBMQUJFTF9IT1VSUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMubWludXRlcztcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX01JTlVURVMpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLnNlY29uZHM7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRsaXN0LnB1c2goZm9ybWF0dGVyKHZhbHVlLCBMQUJFTF9TRUNPTkRTKSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSB0cy5taWxsaXNlY29uZHM7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRsaXN0LnB1c2goZm9ybWF0dGVyKHZhbHVlLCBMQUJFTF9NSUxMSVNFQ09ORFMpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbGlzdDtcblx0fTtcblxuXHQvKipcblx0ICogQm9ycm93IGFueSB1bmRlcmZsb3cgdW5pdHMsIGNhcnJ5IGFueSBvdmVyZmxvdyB1bml0c1xuXHQgKiBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtUaW1lc3Bhbn0gdHNcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRvVW5pdFxuXHQgKi9cblx0ZnVuY3Rpb24gcmlwcGxlUm91bmRlZCh0cywgdG9Vbml0KSB7XG5cdFx0c3dpdGNoICh0b1VuaXQpIHtcblx0XHRcdGNhc2UgJ3NlY29uZHMnOlxuXHRcdFx0XHRpZiAodHMuc2Vjb25kcyAhPT0gU0VDT05EU19QRVJfTUlOVVRFIHx8IGlzTmFOKHRzLm1pbnV0ZXMpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHJpcHBsZSBzZWNvbmRzIHVwIHRvIG1pbnV0ZXNcblx0XHRcdFx0dHMubWludXRlcysrO1xuXHRcdFx0XHR0cy5zZWNvbmRzID0gMDtcblxuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRjYXNlICdtaW51dGVzJzpcblx0XHRcdFx0aWYgKHRzLm1pbnV0ZXMgIT09IE1JTlVURVNfUEVSX0hPVVIgfHwgaXNOYU4odHMuaG91cnMpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHJpcHBsZSBtaW51dGVzIHVwIHRvIGhvdXJzXG5cdFx0XHRcdHRzLmhvdXJzKys7XG5cdFx0XHRcdHRzLm1pbnV0ZXMgPSAwO1xuXG5cdFx0XHRcdC8qIGZhbGxzIHRocm91Z2ggKi9cblx0XHRcdGNhc2UgJ2hvdXJzJzpcblx0XHRcdFx0aWYgKHRzLmhvdXJzICE9PSBIT1VSU19QRVJfREFZIHx8IGlzTmFOKHRzLmRheXMpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHJpcHBsZSBob3VycyB1cCB0byBkYXlzXG5cdFx0XHRcdHRzLmRheXMrKztcblx0XHRcdFx0dHMuaG91cnMgPSAwO1xuXG5cdFx0XHRcdC8qIGZhbGxzIHRocm91Z2ggKi9cblx0XHRcdGNhc2UgJ2RheXMnOlxuXHRcdFx0XHRpZiAodHMuZGF5cyAhPT0gREFZU19QRVJfV0VFSyB8fCBpc05hTih0cy53ZWVrcykpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gcmlwcGxlIGRheXMgdXAgdG8gd2Vla3Ncblx0XHRcdFx0dHMud2Vla3MrKztcblx0XHRcdFx0dHMuZGF5cyA9IDA7XG5cblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0Y2FzZSAnd2Vla3MnOlxuXHRcdFx0XHRpZiAodHMud2Vla3MgIT09IGRheXNQZXJNb250aCh0cy5yZWZNb250aCkvREFZU19QRVJfV0VFSyB8fCBpc05hTih0cy5tb250aHMpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHJpcHBsZSB3ZWVrcyB1cCB0byBtb250aHNcblx0XHRcdFx0dHMubW9udGhzKys7XG5cdFx0XHRcdHRzLndlZWtzID0gMDtcblxuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRjYXNlICdtb250aHMnOlxuXHRcdFx0XHRpZiAodHMubW9udGhzICE9PSBNT05USFNfUEVSX1lFQVIgfHwgaXNOYU4odHMueWVhcnMpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHJpcHBsZSBtb250aHMgdXAgdG8geWVhcnNcblx0XHRcdFx0dHMueWVhcnMrKztcblx0XHRcdFx0dHMubW9udGhzID0gMDtcblxuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRjYXNlICd5ZWFycyc6XG5cdFx0XHRcdGlmICh0cy55ZWFycyAhPT0gWUVBUlNfUEVSX0RFQ0FERSB8fCBpc05hTih0cy5kZWNhZGVzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgeWVhcnMgdXAgdG8gZGVjYWRlc1xuXHRcdFx0XHR0cy5kZWNhZGVzKys7XG5cdFx0XHRcdHRzLnllYXJzID0gMDtcblxuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRjYXNlICdkZWNhZGVzJzpcblx0XHRcdFx0aWYgKHRzLmRlY2FkZXMgIT09IERFQ0FERVNfUEVSX0NFTlRVUlkgfHwgaXNOYU4odHMuY2VudHVyaWVzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgZGVjYWRlcyB1cCB0byBjZW50dXJpZXNcblx0XHRcdFx0dHMuY2VudHVyaWVzKys7XG5cdFx0XHRcdHRzLmRlY2FkZXMgPSAwO1xuXG5cdFx0XHRcdC8qIGZhbGxzIHRocm91Z2ggKi9cblx0XHRcdGNhc2UgJ2NlbnR1cmllcyc6XG5cdFx0XHRcdGlmICh0cy5jZW50dXJpZXMgIT09IENFTlRVUklFU19QRVJfTUlMTEVOTklVTSB8fCBpc05hTih0cy5taWxsZW5uaWEpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHJpcHBsZSBjZW50dXJpZXMgdXAgdG8gbWlsbGVubmlhXG5cdFx0XHRcdHRzLm1pbGxlbm5pYSsrO1xuXHRcdFx0XHR0cy5jZW50dXJpZXMgPSAwO1xuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmlwcGxlIHVwIHBhcnRpYWwgdW5pdHMgb25lIHBsYWNlXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0cyB0aW1lc3BhblxuXHQgKiBAcGFyYW0ge251bWJlcn0gZnJhYyBhY2N1bXVsYXRlZCBmcmFjdGlvbmFsIHZhbHVlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmcm9tVW5pdCBzb3VyY2UgdW5pdCBuYW1lXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0b1VuaXQgdGFyZ2V0IHVuaXQgbmFtZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gY29udmVyc2lvbiBtdWx0aXBsaWVyIGJldHdlZW4gdW5pdHNcblx0ICogQHBhcmFtIHtudW1iZXJ9IGRpZ2l0cyBtYXggbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIHRvIG91dHB1dFxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9IG5ldyBmcmFjdGlvbmFsIHZhbHVlXG5cdCAqL1xuXHRmdW5jdGlvbiBmcmFjdGlvbih0cywgZnJhYywgZnJvbVVuaXQsIHRvVW5pdCwgY29udmVyc2lvbiwgZGlnaXRzKSB7XG5cdFx0aWYgKHRzW2Zyb21Vbml0XSA+PSAwKSB7XG5cdFx0XHRmcmFjICs9IHRzW2Zyb21Vbml0XTtcblx0XHRcdGRlbGV0ZSB0c1tmcm9tVW5pdF07XG5cdFx0fVxuXG5cdFx0ZnJhYyAvPSBjb252ZXJzaW9uO1xuXHRcdGlmIChmcmFjICsgMSA8PSAxKSB7XG5cdFx0XHQvLyBkcm9wIGlmIGJlbG93IG1hY2hpbmUgZXBzaWxvblxuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0aWYgKHRzW3RvVW5pdF0gPj0gMCkge1xuXHRcdFx0Ly8gZW5zdXJlIGRvZXMgbm90IGhhdmUgbW9yZSB0aGFuIHNwZWNpZmllZCBudW1iZXIgb2YgZGlnaXRzXG5cdFx0XHR0c1t0b1VuaXRdID0gKyh0c1t0b1VuaXRdICsgZnJhYykudG9GaXhlZChkaWdpdHMpO1xuXHRcdFx0cmlwcGxlUm91bmRlZCh0cywgdG9Vbml0KTtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdHJldHVybiBmcmFjO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJpcHBsZSB1cCBwYXJ0aWFsIHVuaXRzIHRvIG5leHQgZXhpc3Rpbmdcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7VGltZXNwYW59IHRzXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBkaWdpdHMgbWF4IG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyB0byBvdXRwdXRcblx0ICovXG5cdGZ1bmN0aW9uIGZyYWN0aW9uYWwodHMsIGRpZ2l0cykge1xuXHRcdHZhciBmcmFjID0gZnJhY3Rpb24odHMsIDAsICdtaWxsaXNlY29uZHMnLCAnc2Vjb25kcycsIE1JTExJU0VDT05EU19QRVJfU0VDT05ELCBkaWdpdHMpO1xuXHRcdGlmICghZnJhYykgeyByZXR1cm47IH1cblxuXHRcdGZyYWMgPSBmcmFjdGlvbih0cywgZnJhYywgJ3NlY29uZHMnLCAnbWludXRlcycsIFNFQ09ORFNfUEVSX01JTlVURSwgZGlnaXRzKTtcblx0XHRpZiAoIWZyYWMpIHsgcmV0dXJuOyB9XG5cblx0XHRmcmFjID0gZnJhY3Rpb24odHMsIGZyYWMsICdtaW51dGVzJywgJ2hvdXJzJywgTUlOVVRFU19QRVJfSE9VUiwgZGlnaXRzKTtcblx0XHRpZiAoIWZyYWMpIHsgcmV0dXJuOyB9XG5cblx0XHRmcmFjID0gZnJhY3Rpb24odHMsIGZyYWMsICdob3VycycsICdkYXlzJywgSE9VUlNfUEVSX0RBWSwgZGlnaXRzKTtcblx0XHRpZiAoIWZyYWMpIHsgcmV0dXJuOyB9XG5cblx0XHRmcmFjID0gZnJhY3Rpb24odHMsIGZyYWMsICdkYXlzJywgJ3dlZWtzJywgREFZU19QRVJfV0VFSywgZGlnaXRzKTtcblx0XHRpZiAoIWZyYWMpIHsgcmV0dXJuOyB9XG5cblx0XHRmcmFjID0gZnJhY3Rpb24odHMsIGZyYWMsICd3ZWVrcycsICdtb250aHMnLCBkYXlzUGVyTW9udGgodHMucmVmTW9udGgpL0RBWVNfUEVSX1dFRUssIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAnbW9udGhzJywgJ3llYXJzJywgZGF5c1BlclllYXIodHMucmVmTW9udGgpL2RheXNQZXJNb250aCh0cy5yZWZNb250aCksIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAneWVhcnMnLCAnZGVjYWRlcycsIFlFQVJTX1BFUl9ERUNBREUsIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAnZGVjYWRlcycsICdjZW50dXJpZXMnLCBERUNBREVTX1BFUl9DRU5UVVJZLCBkaWdpdHMpO1xuXHRcdGlmICghZnJhYykgeyByZXR1cm47IH1cblxuXHRcdGZyYWMgPSBmcmFjdGlvbih0cywgZnJhYywgJ2NlbnR1cmllcycsICdtaWxsZW5uaWEnLCBDRU5UVVJJRVNfUEVSX01JTExFTk5JVU0sIGRpZ2l0cyk7XG5cblx0XHQvLyBzaG91bGQgbmV2ZXIgcmVhY2ggdGhpcyB3aXRoIHJlbWFpbmluZyBmcmFjdGlvbmFsIHZhbHVlXG5cdFx0aWYgKGZyYWMpIHsgdGhyb3cgbmV3IEVycm9yKCdGcmFjdGlvbmFsIHVuaXQgb3ZlcmZsb3cnKTsgfVxuXHR9XG5cblx0LyoqXG5cdCAqIEJvcnJvdyBhbnkgdW5kZXJmbG93IHVuaXRzLCBjYXJyeSBhbnkgb3ZlcmZsb3cgdW5pdHNcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7VGltZXNwYW59IHRzXG5cdCAqL1xuXHRmdW5jdGlvbiByaXBwbGUodHMpIHtcblx0XHR2YXIgeDtcblxuXHRcdGlmICh0cy5taWxsaXNlY29uZHMgPCAwKSB7XG5cdFx0XHQvLyByaXBwbGUgc2Vjb25kcyBkb3duIHRvIG1pbGxpc2Vjb25kc1xuXHRcdFx0eCA9IGNlaWwoLXRzLm1pbGxpc2Vjb25kcyAvIE1JTExJU0VDT05EU19QRVJfU0VDT05EKTtcblx0XHRcdHRzLnNlY29uZHMgLT0geDtcblx0XHRcdHRzLm1pbGxpc2Vjb25kcyArPSB4ICogTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQ7XG5cblx0XHR9IGVsc2UgaWYgKHRzLm1pbGxpc2Vjb25kcyA+PSBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCkge1xuXHRcdFx0Ly8gcmlwcGxlIG1pbGxpc2Vjb25kcyB1cCB0byBzZWNvbmRzXG5cdFx0XHR0cy5zZWNvbmRzICs9IGZsb29yKHRzLm1pbGxpc2Vjb25kcyAvIE1JTExJU0VDT05EU19QRVJfU0VDT05EKTtcblx0XHRcdHRzLm1pbGxpc2Vjb25kcyAlPSBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORDtcblx0XHR9XG5cblx0XHRpZiAodHMuc2Vjb25kcyA8IDApIHtcblx0XHRcdC8vIHJpcHBsZSBtaW51dGVzIGRvd24gdG8gc2Vjb25kc1xuXHRcdFx0eCA9IGNlaWwoLXRzLnNlY29uZHMgLyBTRUNPTkRTX1BFUl9NSU5VVEUpO1xuXHRcdFx0dHMubWludXRlcyAtPSB4O1xuXHRcdFx0dHMuc2Vjb25kcyArPSB4ICogU0VDT05EU19QRVJfTUlOVVRFO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5zZWNvbmRzID49IFNFQ09ORFNfUEVSX01JTlVURSkge1xuXHRcdFx0Ly8gcmlwcGxlIHNlY29uZHMgdXAgdG8gbWludXRlc1xuXHRcdFx0dHMubWludXRlcyArPSBmbG9vcih0cy5zZWNvbmRzIC8gU0VDT05EU19QRVJfTUlOVVRFKTtcblx0XHRcdHRzLnNlY29uZHMgJT0gU0VDT05EU19QRVJfTUlOVVRFO1xuXHRcdH1cblxuXHRcdGlmICh0cy5taW51dGVzIDwgMCkge1xuXHRcdFx0Ly8gcmlwcGxlIGhvdXJzIGRvd24gdG8gbWludXRlc1xuXHRcdFx0eCA9IGNlaWwoLXRzLm1pbnV0ZXMgLyBNSU5VVEVTX1BFUl9IT1VSKTtcblx0XHRcdHRzLmhvdXJzIC09IHg7XG5cdFx0XHR0cy5taW51dGVzICs9IHggKiBNSU5VVEVTX1BFUl9IT1VSO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5taW51dGVzID49IE1JTlVURVNfUEVSX0hPVVIpIHtcblx0XHRcdC8vIHJpcHBsZSBtaW51dGVzIHVwIHRvIGhvdXJzXG5cdFx0XHR0cy5ob3VycyArPSBmbG9vcih0cy5taW51dGVzIC8gTUlOVVRFU19QRVJfSE9VUik7XG5cdFx0XHR0cy5taW51dGVzICU9IE1JTlVURVNfUEVSX0hPVVI7XG5cdFx0fVxuXG5cdFx0aWYgKHRzLmhvdXJzIDwgMCkge1xuXHRcdFx0Ly8gcmlwcGxlIGRheXMgZG93biB0byBob3Vyc1xuXHRcdFx0eCA9IGNlaWwoLXRzLmhvdXJzIC8gSE9VUlNfUEVSX0RBWSk7XG5cdFx0XHR0cy5kYXlzIC09IHg7XG5cdFx0XHR0cy5ob3VycyArPSB4ICogSE9VUlNfUEVSX0RBWTtcblxuXHRcdH0gZWxzZSBpZiAodHMuaG91cnMgPj0gSE9VUlNfUEVSX0RBWSkge1xuXHRcdFx0Ly8gcmlwcGxlIGhvdXJzIHVwIHRvIGRheXNcblx0XHRcdHRzLmRheXMgKz0gZmxvb3IodHMuaG91cnMgLyBIT1VSU19QRVJfREFZKTtcblx0XHRcdHRzLmhvdXJzICU9IEhPVVJTX1BFUl9EQVk7XG5cdFx0fVxuXG5cdFx0d2hpbGUgKHRzLmRheXMgPCAwKSB7XG5cdFx0XHQvLyBOT1RFOiBuZXZlciBhY3R1YWxseSBzZWVuIHRoaXMgbG9vcCBtb3JlIHRoYW4gb25jZVxuXG5cdFx0XHQvLyByaXBwbGUgbW9udGhzIGRvd24gdG8gZGF5c1xuXHRcdFx0dHMubW9udGhzLS07XG5cdFx0XHR0cy5kYXlzICs9IGJvcnJvd01vbnRocyh0cy5yZWZNb250aCwgMSk7XG5cdFx0fVxuXG5cdFx0Ly8gd2Vla3MgaXMgYWx3YXlzIHplcm8gaGVyZVxuXG5cdFx0aWYgKHRzLmRheXMgPj0gREFZU19QRVJfV0VFSykge1xuXHRcdFx0Ly8gcmlwcGxlIGRheXMgdXAgdG8gd2Vla3Ncblx0XHRcdHRzLndlZWtzICs9IGZsb29yKHRzLmRheXMgLyBEQVlTX1BFUl9XRUVLKTtcblx0XHRcdHRzLmRheXMgJT0gREFZU19QRVJfV0VFSztcblx0XHR9XG5cblx0XHRpZiAodHMubW9udGhzIDwgMCkge1xuXHRcdFx0Ly8gcmlwcGxlIHllYXJzIGRvd24gdG8gbW9udGhzXG5cdFx0XHR4ID0gY2VpbCgtdHMubW9udGhzIC8gTU9OVEhTX1BFUl9ZRUFSKTtcblx0XHRcdHRzLnllYXJzIC09IHg7XG5cdFx0XHR0cy5tb250aHMgKz0geCAqIE1PTlRIU19QRVJfWUVBUjtcblxuXHRcdH0gZWxzZSBpZiAodHMubW9udGhzID49IE1PTlRIU19QRVJfWUVBUikge1xuXHRcdFx0Ly8gcmlwcGxlIG1vbnRocyB1cCB0byB5ZWFyc1xuXHRcdFx0dHMueWVhcnMgKz0gZmxvb3IodHMubW9udGhzIC8gTU9OVEhTX1BFUl9ZRUFSKTtcblx0XHRcdHRzLm1vbnRocyAlPSBNT05USFNfUEVSX1lFQVI7XG5cdFx0fVxuXG5cdFx0Ly8geWVhcnMgaXMgYWx3YXlzIG5vbi1uZWdhdGl2ZSBoZXJlXG5cdFx0Ly8gZGVjYWRlcywgY2VudHVyaWVzIGFuZCBtaWxsZW5uaWEgYXJlIGFsd2F5cyB6ZXJvIGhlcmVcblxuXHRcdGlmICh0cy55ZWFycyA+PSBZRUFSU19QRVJfREVDQURFKSB7XG5cdFx0XHQvLyByaXBwbGUgeWVhcnMgdXAgdG8gZGVjYWRlc1xuXHRcdFx0dHMuZGVjYWRlcyArPSBmbG9vcih0cy55ZWFycyAvIFlFQVJTX1BFUl9ERUNBREUpO1xuXHRcdFx0dHMueWVhcnMgJT0gWUVBUlNfUEVSX0RFQ0FERTtcblxuXHRcdFx0aWYgKHRzLmRlY2FkZXMgPj0gREVDQURFU19QRVJfQ0VOVFVSWSkge1xuXHRcdFx0XHQvLyByaXBwbGUgZGVjYWRlcyB1cCB0byBjZW50dXJpZXNcblx0XHRcdFx0dHMuY2VudHVyaWVzICs9IGZsb29yKHRzLmRlY2FkZXMgLyBERUNBREVTX1BFUl9DRU5UVVJZKTtcblx0XHRcdFx0dHMuZGVjYWRlcyAlPSBERUNBREVTX1BFUl9DRU5UVVJZO1xuXG5cdFx0XHRcdGlmICh0cy5jZW50dXJpZXMgPj0gQ0VOVFVSSUVTX1BFUl9NSUxMRU5OSVVNKSB7XG5cdFx0XHRcdFx0Ly8gcmlwcGxlIGNlbnR1cmllcyB1cCB0byBtaWxsZW5uaWFcblx0XHRcdFx0XHR0cy5taWxsZW5uaWEgKz0gZmxvb3IodHMuY2VudHVyaWVzIC8gQ0VOVFVSSUVTX1BFUl9NSUxMRU5OSVVNKTtcblx0XHRcdFx0XHR0cy5jZW50dXJpZXMgJT0gQ0VOVFVSSUVTX1BFUl9NSUxMRU5OSVVNO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZSBhbnkgdW5pdHMgbm90IHJlcXVlc3RlZFxuXHQgKiBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtUaW1lc3Bhbn0gdHNcblx0ICogQHBhcmFtIHtudW1iZXJ9IHVuaXRzIHRoZSB1bml0cyB0byBwb3B1bGF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gbWF4IG51bWJlciBvZiBsYWJlbHMgdG8gb3V0cHV0XG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBkaWdpdHMgbWF4IG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyB0byBvdXRwdXRcblx0ICovXG5cdGZ1bmN0aW9uIHBydW5lVW5pdHModHMsIHVuaXRzLCBtYXgsIGRpZ2l0cykge1xuXHRcdHZhciBjb3VudCA9IDA7XG5cblx0XHQvLyBDYWxjIGZyb20gbGFyZ2VzdCB1bml0IHRvIHNtYWxsZXN0IHRvIHByZXZlbnQgdW5kZXJmbG93XG5cdFx0aWYgKCEodW5pdHMgJiBNSUxMRU5OSUEpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgbWlsbGVubmlhIGRvd24gdG8gY2VudHVyaWVzXG5cdFx0XHR0cy5jZW50dXJpZXMgKz0gdHMubWlsbGVubmlhICogQ0VOVFVSSUVTX1BFUl9NSUxMRU5OSVVNO1xuXHRcdFx0ZGVsZXRlIHRzLm1pbGxlbm5pYTtcblxuXHRcdH0gZWxzZSBpZiAodHMubWlsbGVubmlhKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdGlmICghKHVuaXRzICYgQ0VOVFVSSUVTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIGNlbnR1cmllcyBkb3duIHRvIGRlY2FkZXNcblx0XHRcdHRzLmRlY2FkZXMgKz0gdHMuY2VudHVyaWVzICogREVDQURFU19QRVJfQ0VOVFVSWTtcblx0XHRcdGRlbGV0ZSB0cy5jZW50dXJpZXM7XG5cblx0XHR9IGVsc2UgaWYgKHRzLmNlbnR1cmllcykge1xuXHRcdFx0Y291bnQrKztcblx0XHR9XG5cblx0XHRpZiAoISh1bml0cyAmIERFQ0FERVMpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgZGVjYWRlcyBkb3duIHRvIHllYXJzXG5cdFx0XHR0cy55ZWFycyArPSB0cy5kZWNhZGVzICogWUVBUlNfUEVSX0RFQ0FERTtcblx0XHRcdGRlbGV0ZSB0cy5kZWNhZGVzO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5kZWNhZGVzKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdGlmICghKHVuaXRzICYgWUVBUlMpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgeWVhcnMgZG93biB0byBtb250aHNcblx0XHRcdHRzLm1vbnRocyArPSB0cy55ZWFycyAqIE1PTlRIU19QRVJfWUVBUjtcblx0XHRcdGRlbGV0ZSB0cy55ZWFycztcblxuXHRcdH0gZWxzZSBpZiAodHMueWVhcnMpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXG5cdFx0aWYgKCEodW5pdHMgJiBNT05USFMpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgbW9udGhzIGRvd24gdG8gZGF5c1xuXHRcdFx0aWYgKHRzLm1vbnRocykge1xuXHRcdFx0XHR0cy5kYXlzICs9IGJvcnJvd01vbnRocyh0cy5yZWZNb250aCwgdHMubW9udGhzKTtcblx0XHRcdH1cblx0XHRcdGRlbGV0ZSB0cy5tb250aHM7XG5cblx0XHRcdGlmICh0cy5kYXlzID49IERBWVNfUEVSX1dFRUspIHtcblx0XHRcdFx0Ly8gcmlwcGxlIGRheSBvdmVyZmxvdyBiYWNrIHVwIHRvIHdlZWtzXG5cdFx0XHRcdHRzLndlZWtzICs9IGZsb29yKHRzLmRheXMgLyBEQVlTX1BFUl9XRUVLKTtcblx0XHRcdFx0dHMuZGF5cyAlPSBEQVlTX1BFUl9XRUVLO1xuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIGlmICh0cy5tb250aHMpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXG5cdFx0aWYgKCEodW5pdHMgJiBXRUVLUykgfHwgKGNvdW50ID49IG1heCkpIHtcblx0XHRcdC8vIHJpcHBsZSB3ZWVrcyBkb3duIHRvIGRheXNcblx0XHRcdHRzLmRheXMgKz0gdHMud2Vla3MgKiBEQVlTX1BFUl9XRUVLO1xuXHRcdFx0ZGVsZXRlIHRzLndlZWtzO1xuXG5cdFx0fSBlbHNlIGlmICh0cy53ZWVrcykge1xuXHRcdFx0Y291bnQrKztcblx0XHR9XG5cblx0XHRpZiAoISh1bml0cyAmIERBWVMpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvL3JpcHBsZSBkYXlzIGRvd24gdG8gaG91cnNcblx0XHRcdHRzLmhvdXJzICs9IHRzLmRheXMgKiBIT1VSU19QRVJfREFZO1xuXHRcdFx0ZGVsZXRlIHRzLmRheXM7XG5cblx0XHR9IGVsc2UgaWYgKHRzLmRheXMpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXG5cdFx0aWYgKCEodW5pdHMgJiBIT1VSUykgfHwgKGNvdW50ID49IG1heCkpIHtcblx0XHRcdC8vIHJpcHBsZSBob3VycyBkb3duIHRvIG1pbnV0ZXNcblx0XHRcdHRzLm1pbnV0ZXMgKz0gdHMuaG91cnMgKiBNSU5VVEVTX1BFUl9IT1VSO1xuXHRcdFx0ZGVsZXRlIHRzLmhvdXJzO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5ob3Vycykge1xuXHRcdFx0Y291bnQrKztcblx0XHR9XG5cblx0XHRpZiAoISh1bml0cyAmIE1JTlVURVMpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgbWludXRlcyBkb3duIHRvIHNlY29uZHNcblx0XHRcdHRzLnNlY29uZHMgKz0gdHMubWludXRlcyAqIFNFQ09ORFNfUEVSX01JTlVURTtcblx0XHRcdGRlbGV0ZSB0cy5taW51dGVzO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5taW51dGVzKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdGlmICghKHVuaXRzICYgU0VDT05EUykgfHwgKGNvdW50ID49IG1heCkpIHtcblx0XHRcdC8vIHJpcHBsZSBzZWNvbmRzIGRvd24gdG8gbWlsbGlzZWNvbmRzXG5cdFx0XHR0cy5taWxsaXNlY29uZHMgKz0gdHMuc2Vjb25kcyAqIE1JTExJU0VDT05EU19QRVJfU0VDT05EO1xuXHRcdFx0ZGVsZXRlIHRzLnNlY29uZHM7XG5cblx0XHR9IGVsc2UgaWYgKHRzLnNlY29uZHMpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXG5cdFx0Ly8gbm90aGluZyB0byByaXBwbGUgbWlsbGlzZWNvbmRzIGRvd24gdG9cblx0XHQvLyBzbyByaXBwbGUgYmFjayB1cCB0byBzbWFsbGVzdCBleGlzdGluZyB1bml0IGFzIGEgZnJhY3Rpb25hbCB2YWx1ZVxuXHRcdGlmICghKHVuaXRzICYgTUlMTElTRUNPTkRTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0ZnJhY3Rpb25hbCh0cywgZGlnaXRzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUG9wdWxhdGVzIHRoZSBUaW1lc3BhbiBvYmplY3Rcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7VGltZXNwYW59IHRzXG5cdCAqIEBwYXJhbSB7P0RhdGV9IHN0YXJ0IHRoZSBzdGFydGluZyBkYXRlXG5cdCAqIEBwYXJhbSB7P0RhdGV9IGVuZCB0aGUgZW5kaW5nIGRhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHVuaXRzIHRoZSB1bml0cyB0byBwb3B1bGF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gbWF4IG51bWJlciBvZiBsYWJlbHMgdG8gb3V0cHV0XG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBkaWdpdHMgbWF4IG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyB0byBvdXRwdXRcblx0ICovXG5cdGZ1bmN0aW9uIHBvcHVsYXRlKHRzLCBzdGFydCwgZW5kLCB1bml0cywgbWF4LCBkaWdpdHMpIHtcblx0XHR2YXIgbm93ID0gbmV3IERhdGUoKTtcblxuXHRcdHRzLnN0YXJ0ID0gc3RhcnQgPSBzdGFydCB8fCBub3c7XG5cdFx0dHMuZW5kID0gZW5kID0gZW5kIHx8IG5vdztcblx0XHR0cy51bml0cyA9IHVuaXRzO1xuXG5cdFx0dHMudmFsdWUgPSBlbmQuZ2V0VGltZSgpIC0gc3RhcnQuZ2V0VGltZSgpO1xuXHRcdGlmICh0cy52YWx1ZSA8IDApIHtcblx0XHRcdC8vIHN3YXAgaWYgcmV2ZXJzZWRcblx0XHRcdHZhciB0bXAgPSBlbmQ7XG5cdFx0XHRlbmQgPSBzdGFydDtcblx0XHRcdHN0YXJ0ID0gdG1wO1xuXHRcdH1cblxuXHRcdC8vIHJlZmVyZW5jZSBtb250aCBmb3IgZGV0ZXJtaW5pbmcgZGF5cyBpbiBtb250aFxuXHRcdHRzLnJlZk1vbnRoID0gbmV3IERhdGUoc3RhcnQuZ2V0RnVsbFllYXIoKSwgc3RhcnQuZ2V0TW9udGgoKSwgMTUsIDEyLCAwLCAwKTtcblx0XHR0cnkge1xuXHRcdFx0Ly8gcmVzZXQgdG8gaW5pdGlhbCBkZWx0YXNcblx0XHRcdHRzLm1pbGxlbm5pYSA9IDA7XG5cdFx0XHR0cy5jZW50dXJpZXMgPSAwO1xuXHRcdFx0dHMuZGVjYWRlcyA9IDA7XG5cdFx0XHR0cy55ZWFycyA9IGVuZC5nZXRGdWxsWWVhcigpIC0gc3RhcnQuZ2V0RnVsbFllYXIoKTtcblx0XHRcdHRzLm1vbnRocyA9IGVuZC5nZXRNb250aCgpIC0gc3RhcnQuZ2V0TW9udGgoKTtcblx0XHRcdHRzLndlZWtzID0gMDtcblx0XHRcdHRzLmRheXMgPSBlbmQuZ2V0RGF0ZSgpIC0gc3RhcnQuZ2V0RGF0ZSgpO1xuXHRcdFx0dHMuaG91cnMgPSBlbmQuZ2V0SG91cnMoKSAtIHN0YXJ0LmdldEhvdXJzKCk7XG5cdFx0XHR0cy5taW51dGVzID0gZW5kLmdldE1pbnV0ZXMoKSAtIHN0YXJ0LmdldE1pbnV0ZXMoKTtcblx0XHRcdHRzLnNlY29uZHMgPSBlbmQuZ2V0U2Vjb25kcygpIC0gc3RhcnQuZ2V0U2Vjb25kcygpO1xuXHRcdFx0dHMubWlsbGlzZWNvbmRzID0gZW5kLmdldE1pbGxpc2Vjb25kcygpIC0gc3RhcnQuZ2V0TWlsbGlzZWNvbmRzKCk7XG5cblx0XHRcdHJpcHBsZSh0cyk7XG5cdFx0XHRwcnVuZVVuaXRzKHRzLCB1bml0cywgbWF4LCBkaWdpdHMpO1xuXG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdGRlbGV0ZSB0cy5yZWZNb250aDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHM7XG5cdH1cblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIGFuIGFwcHJvcHJpYXRlIHJlZnJlc2ggcmF0ZSBiYXNlZCB1cG9uIHVuaXRzXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gdW5pdHMgdGhlIHVuaXRzIHRvIHBvcHVsYXRlXG5cdCAqIEByZXR1cm4ge251bWJlcn0gbWlsbGlzZWNvbmRzIHRvIGRlbGF5XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXREZWxheSh1bml0cykge1xuXHRcdGlmICh1bml0cyAmIE1JTExJU0VDT05EUykge1xuXHRcdFx0Ly8gcmVmcmVzaCB2ZXJ5IHF1aWNrbHlcblx0XHRcdHJldHVybiBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCAvIDMwOyAvLzMwSHpcblx0XHR9XG5cblx0XHRpZiAodW5pdHMgJiBTRUNPTkRTKSB7XG5cdFx0XHQvLyByZWZyZXNoIGV2ZXJ5IHNlY29uZFxuXHRcdFx0cmV0dXJuIE1JTExJU0VDT05EU19QRVJfU0VDT05EOyAvLzFIelxuXHRcdH1cblxuXHRcdGlmICh1bml0cyAmIE1JTlVURVMpIHtcblx0XHRcdC8vIHJlZnJlc2ggZXZlcnkgbWludXRlXG5cdFx0XHRyZXR1cm4gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQgKiBTRUNPTkRTX1BFUl9NSU5VVEU7XG5cdFx0fVxuXG5cdFx0aWYgKHVuaXRzICYgSE9VUlMpIHtcblx0XHRcdC8vIHJlZnJlc2ggaG91cmx5XG5cdFx0XHRyZXR1cm4gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQgKiBTRUNPTkRTX1BFUl9NSU5VVEUgKiBNSU5VVEVTX1BFUl9IT1VSO1xuXHRcdH1cblx0XHRcblx0XHRpZiAodW5pdHMgJiBEQVlTKSB7XG5cdFx0XHQvLyByZWZyZXNoIGRhaWx5XG5cdFx0XHRyZXR1cm4gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQgKiBTRUNPTkRTX1BFUl9NSU5VVEUgKiBNSU5VVEVTX1BFUl9IT1VSICogSE9VUlNfUEVSX0RBWTtcblx0XHR9XG5cblx0XHQvLyByZWZyZXNoIHRoZSByZXN0IHdlZWtseVxuXHRcdHJldHVybiBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCAqIFNFQ09ORFNfUEVSX01JTlVURSAqIE1JTlVURVNfUEVSX0hPVVIgKiBIT1VSU19QRVJfREFZICogREFZU19QRVJfV0VFSztcblx0fVxuXG5cdC8qKlxuXHQgKiBBUEkgZW50cnkgcG9pbnRcblx0ICogXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtEYXRlfG51bWJlcnxUaW1lc3BhbnxudWxsfGZ1bmN0aW9uKFRpbWVzcGFuLG51bWJlcil9IHN0YXJ0IHRoZSBzdGFydGluZyBkYXRlXG5cdCAqIEBwYXJhbSB7RGF0ZXxudW1iZXJ8VGltZXNwYW58bnVsbHxmdW5jdGlvbihUaW1lc3BhbixudW1iZXIpfSBlbmQgdGhlIGVuZGluZyBkYXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyPX0gdW5pdHMgdGhlIHVuaXRzIHRvIHBvcHVsYXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyPX0gbWF4IG51bWJlciBvZiBsYWJlbHMgdG8gb3V0cHV0XG5cdCAqIEBwYXJhbSB7bnVtYmVyPX0gZGlnaXRzIG1heCBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgdG8gb3V0cHV0XG5cdCAqIEByZXR1cm4ge1RpbWVzcGFufG51bWJlcn1cblx0ICovXG5cdGZ1bmN0aW9uIGNvdW50ZG93bihzdGFydCwgZW5kLCB1bml0cywgbWF4LCBkaWdpdHMpIHtcblx0XHR2YXIgY2FsbGJhY2s7XG5cblx0XHQvLyBlbnN1cmUgc29tZSB1bml0cyBvciB1c2UgZGVmYXVsdHNcblx0XHR1bml0cyA9ICt1bml0cyB8fCBERUZBVUxUUztcblx0XHQvLyBtYXggbXVzdCBiZSBwb3NpdGl2ZVxuXHRcdG1heCA9IChtYXggPiAwKSA/IG1heCA6IE5hTjtcblx0XHQvLyBjbGFtcCBkaWdpdHMgdG8gYW4gaW50ZWdlciBiZXR3ZWVuIFswLCAyMF1cblx0XHRkaWdpdHMgPSAoZGlnaXRzID4gMCkgPyAoZGlnaXRzIDwgMjApID8gTWF0aC5yb3VuZChkaWdpdHMpIDogMjAgOiAwO1xuXG5cdFx0Ly8gZW5zdXJlIHN0YXJ0IGRhdGVcblx0XHR2YXIgc3RhcnRUUyA9IG51bGw7XG5cdFx0aWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBzdGFydCkge1xuXHRcdFx0Y2FsbGJhY2sgPSBzdGFydDtcblx0XHRcdHN0YXJ0ID0gbnVsbDtcblxuXHRcdH0gZWxzZSBpZiAoIShzdGFydCBpbnN0YW5jZW9mIERhdGUpKSB7XG5cdFx0XHRpZiAoKHN0YXJ0ICE9PSBudWxsKSAmJiBpc0Zpbml0ZShzdGFydCkpIHtcblx0XHRcdFx0c3RhcnQgPSBuZXcgRGF0ZSgrc3RhcnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCdvYmplY3QnID09PSB0eXBlb2Ygc3RhcnRUUykge1xuXHRcdFx0XHRcdHN0YXJ0VFMgPSAvKiogQHR5cGV7VGltZXNwYW59ICovKHN0YXJ0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzdGFydCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gZW5zdXJlIGVuZCBkYXRlXG5cdFx0dmFyIGVuZFRTID0gbnVsbDtcblx0XHRpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGVuZCkge1xuXHRcdFx0Y2FsbGJhY2sgPSBlbmQ7XG5cdFx0XHRlbmQgPSBudWxsO1xuXG5cdFx0fSBlbHNlIGlmICghKGVuZCBpbnN0YW5jZW9mIERhdGUpKSB7XG5cdFx0XHRpZiAoKGVuZCAhPT0gbnVsbCkgJiYgaXNGaW5pdGUoZW5kKSkge1xuXHRcdFx0XHRlbmQgPSBuZXcgRGF0ZSgrZW5kKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICgnb2JqZWN0JyA9PT0gdHlwZW9mIGVuZCkge1xuXHRcdFx0XHRcdGVuZFRTID0gLyoqIEB0eXBle1RpbWVzcGFufSAqLyhlbmQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVuZCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gbXVzdCB3YWl0IHRvIGludGVycHJldCB0aW1lc3BhbnMgdW50aWwgYWZ0ZXIgcmVzb2x2aW5nIGRhdGVzXG5cdFx0aWYgKHN0YXJ0VFMpIHtcblx0XHRcdHN0YXJ0ID0gYWRkVG9EYXRlKHN0YXJ0VFMsIGVuZCk7XG5cdFx0fVxuXHRcdGlmIChlbmRUUykge1xuXHRcdFx0ZW5kID0gYWRkVG9EYXRlKGVuZFRTLCBzdGFydCk7XG5cdFx0fVxuXG5cdFx0aWYgKCFzdGFydCAmJiAhZW5kKSB7XG5cdFx0XHQvLyB1c2VkIGZvciB1bml0IHRlc3Rpbmdcblx0XHRcdHJldHVybiBuZXcgVGltZXNwYW4oKTtcblx0XHR9XG5cblx0XHRpZiAoIWNhbGxiYWNrKSB7XG5cdFx0XHRyZXR1cm4gcG9wdWxhdGUobmV3IFRpbWVzcGFuKCksIC8qKiBAdHlwZXtEYXRlfSAqLyhzdGFydCksIC8qKiBAdHlwZXtEYXRlfSAqLyhlbmQpLCAvKiogQHR5cGV7bnVtYmVyfSAqLyh1bml0cyksIC8qKiBAdHlwZXtudW1iZXJ9ICovKG1heCksIC8qKiBAdHlwZXtudW1iZXJ9ICovKGRpZ2l0cykpO1xuXHRcdH1cblxuXHRcdC8vIGJhc2UgZGVsYXkgb2ZmIHVuaXRzXG5cdFx0dmFyIGRlbGF5ID0gZ2V0RGVsYXkodW5pdHMpLFxuXHRcdFx0dGltZXJJZCxcblx0XHRcdGZuID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNhbGxiYWNrKFxuXHRcdFx0XHRcdHBvcHVsYXRlKG5ldyBUaW1lc3BhbigpLCAvKiogQHR5cGV7RGF0ZX0gKi8oc3RhcnQpLCAvKiogQHR5cGV7RGF0ZX0gKi8oZW5kKSwgLyoqIEB0eXBle251bWJlcn0gKi8odW5pdHMpLCAvKiogQHR5cGV7bnVtYmVyfSAqLyhtYXgpLCAvKiogQHR5cGV7bnVtYmVyfSAqLyhkaWdpdHMpKSxcblx0XHRcdFx0XHR0aW1lcklkXG5cdFx0XHRcdCk7XG5cdFx0XHR9O1xuXG5cdFx0Zm4oKTtcblx0XHRyZXR1cm4gKHRpbWVySWQgPSBzZXRJbnRlcnZhbChmbiwgZGVsYXkpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLk1JTExJU0VDT05EUyA9IE1JTExJU0VDT05EUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5TRUNPTkRTID0gU0VDT05EUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5NSU5VVEVTID0gTUlOVVRFUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5IT1VSUyA9IEhPVVJTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLkRBWVMgPSBEQVlTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLldFRUtTID0gV0VFS1M7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uTU9OVEhTID0gTU9OVEhTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLllFQVJTID0gWUVBUlM7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uREVDQURFUyA9IERFQ0FERVM7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uQ0VOVFVSSUVTID0gQ0VOVFVSSUVTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLk1JTExFTk5JQSA9IE1JTExFTk5JQTtcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5ERUZBVUxUUyA9IERFRkFVTFRTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLkFMTCA9IE1JTExFTk5JQXxDRU5UVVJJRVN8REVDQURFU3xZRUFSU3xNT05USFN8V0VFS1N8REFZU3xIT1VSU3xNSU5VVEVTfFNFQ09ORFN8TUlMTElTRUNPTkRTO1xuXG5cdC8qKlxuXHQgKiBDdXN0b21pemUgdGhlIGZvcm1hdCBzZXR0aW5ncy5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge09iamVjdH0gZm9ybWF0IHNldHRpbmdzIG9iamVjdFxuXHQgKi9cblx0dmFyIHNldEZvcm1hdCA9IGNvdW50ZG93bi5zZXRGb3JtYXQgPSBmdW5jdGlvbihmb3JtYXQpIHtcblx0XHRpZiAoIWZvcm1hdCkgeyByZXR1cm47IH1cblxuXHRcdGlmICgnc2luZ3VsYXInIGluIGZvcm1hdCB8fCAncGx1cmFsJyBpbiBmb3JtYXQpIHtcblx0XHRcdHZhciBzaW5ndWxhciA9IGZvcm1hdC5zaW5ndWxhciB8fCBbXTtcblx0XHRcdGlmIChzaW5ndWxhci5zcGxpdCkge1xuXHRcdFx0XHRzaW5ndWxhciA9IHNpbmd1bGFyLnNwbGl0KCd8Jyk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgcGx1cmFsID0gZm9ybWF0LnBsdXJhbCB8fCBbXTtcblx0XHRcdGlmIChwbHVyYWwuc3BsaXQpIHtcblx0XHRcdFx0cGx1cmFsID0gcGx1cmFsLnNwbGl0KCd8Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAodmFyIGk9TEFCRUxfTUlMTElTRUNPTkRTOyBpPD1MQUJFTF9NSUxMRU5OSUE7IGkrKykge1xuXHRcdFx0XHQvLyBvdmVycmlkZSBhbnkgc3BlY2lmaWVkIHVuaXRzXG5cdFx0XHRcdExBQkVMU19TSU5HTFVBUltpXSA9IHNpbmd1bGFyW2ldIHx8IExBQkVMU19TSU5HTFVBUltpXTtcblx0XHRcdFx0TEFCRUxTX1BMVVJBTFtpXSA9IHBsdXJhbFtpXSB8fCBMQUJFTFNfUExVUkFMW2ldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZvcm1hdC5sYXN0KSB7XG5cdFx0XHRMQUJFTF9MQVNUID0gZm9ybWF0Lmxhc3Q7XG5cdFx0fVxuXHRcdGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZvcm1hdC5kZWxpbSkge1xuXHRcdFx0TEFCRUxfREVMSU0gPSBmb3JtYXQuZGVsaW07XG5cdFx0fVxuXHRcdGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZvcm1hdC5lbXB0eSkge1xuXHRcdFx0TEFCRUxfTk9XID0gZm9ybWF0LmVtcHR5O1xuXHRcdH1cblx0XHRpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZvcm1hdC5mb3JtYXROdW1iZXIpIHtcblx0XHRcdGZvcm1hdE51bWJlciA9IGZvcm1hdC5mb3JtYXROdW1iZXI7XG5cdFx0fVxuXHRcdGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm9ybWF0LmZvcm1hdHRlcikge1xuXHRcdFx0Zm9ybWF0dGVyID0gZm9ybWF0LmZvcm1hdHRlcjtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIFJldmVydCB0byB0aGUgZGVmYXVsdCBmb3JtYXR0aW5nLlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHR2YXIgcmVzZXRGb3JtYXQgPSBjb3VudGRvd24ucmVzZXRGb3JtYXQgPSBmdW5jdGlvbigpIHtcblx0XHRMQUJFTFNfU0lOR0xVQVIgPSAnIG1pbGxpc2Vjb25kfCBzZWNvbmR8IG1pbnV0ZXwgaG91cnwgZGF5fCB3ZWVrfCBtb250aHwgeWVhcnwgZGVjYWRlfCBjZW50dXJ5fCBtaWxsZW5uaXVtJy5zcGxpdCgnfCcpO1xuXHRcdExBQkVMU19QTFVSQUwgPSAnIG1pbGxpc2Vjb25kc3wgc2Vjb25kc3wgbWludXRlc3wgaG91cnN8IGRheXN8IHdlZWtzfCBtb250aHN8IHllYXJzfCBkZWNhZGVzfCBjZW50dXJpZXN8IG1pbGxlbm5pYScuc3BsaXQoJ3wnKTtcblx0XHRMQUJFTF9MQVNUID0gJyBhbmQgJztcblx0XHRMQUJFTF9ERUxJTSA9ICcsICc7XG5cdFx0TEFCRUxfTk9XID0gJyc7XG5cdFx0Zm9ybWF0TnVtYmVyID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXHRcdGZvcm1hdHRlciA9IHBsdXJhbGl0eTtcblx0fTtcblxuXHQvKipcblx0ICogT3ZlcnJpZGUgdGhlIHVuaXQgbGFiZWxzLlxuXHQgKiBAcHVibGljXG5cdCAqIEBwYXJhbSB7c3RyaW5nfEFycmF5PX0gc2luZ3VsYXIgYSBwaXBlICgnfCcpIGRlbGltaXRlZCBsaXN0IG9mIHNpbmd1bGFyIHVuaXQgbmFtZSBvdmVycmlkZXNcblx0ICogQHBhcmFtIHtzdHJpbmd8QXJyYXk9fSBwbHVyYWwgYSBwaXBlICgnfCcpIGRlbGltaXRlZCBsaXN0IG9mIHBsdXJhbCB1bml0IG5hbWUgb3ZlcnJpZGVzXG5cdCAqIEBwYXJhbSB7c3RyaW5nPX0gbGFzdCBhIGRlbGltaXRlciBiZWZvcmUgdGhlIGxhc3QgdW5pdCAoZGVmYXVsdDogJyBhbmQgJylcblx0ICogQHBhcmFtIHtzdHJpbmc9fSBkZWxpbSBhIGRlbGltaXRlciB0byB1c2UgYmV0d2VlbiBhbGwgb3RoZXIgdW5pdHMgKGRlZmF1bHQ6ICcsICcpXG5cdCAqIEBwYXJhbSB7c3RyaW5nPX0gZW1wdHkgYSBsYWJlbCB0byB1c2Ugd2hlbiBhbGwgdW5pdHMgYXJlIHplcm8gKGRlZmF1bHQ6ICcnKVxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uKG51bWJlcik6c3RyaW5nPX0gZm9ybWF0TnVtYmVyIGEgZnVuY3Rpb24gd2hpY2ggZm9ybWF0cyBudW1iZXJzIGFzIGEgc3RyaW5nXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb24obnVtYmVyLG51bWJlcik6c3RyaW5nPX0gZm9ybWF0dGVyIGEgZnVuY3Rpb24gd2hpY2ggZm9ybWF0cyBhIG51bWJlci91bml0IHBhaXIgYXMgYSBzdHJpbmdcblx0ICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAyLjYuMFxuXHQgKi9cblx0Y291bnRkb3duLnNldExhYmVscyA9IGZ1bmN0aW9uKHNpbmd1bGFyLCBwbHVyYWwsIGxhc3QsIGRlbGltLCBlbXB0eSwgZm9ybWF0TnVtYmVyLCBmb3JtYXR0ZXIpIHtcblx0XHRzZXRGb3JtYXQoe1xuXHRcdFx0c2luZ3VsYXI6IHNpbmd1bGFyLFxuXHRcdFx0cGx1cmFsOiBwbHVyYWwsXG5cdFx0XHRsYXN0OiBsYXN0LFxuXHRcdFx0ZGVsaW06IGRlbGltLFxuXHRcdFx0ZW1wdHk6IGVtcHR5LFxuXHRcdFx0Zm9ybWF0TnVtYmVyOiBmb3JtYXROdW1iZXIsXG5cdFx0XHRmb3JtYXR0ZXI6IGZvcm1hdHRlclxuXHRcdH0pO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXZlcnQgdG8gdGhlIGRlZmF1bHQgdW5pdCBsYWJlbHMuXG5cdCAqIEBwdWJsaWNcblx0ICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAyLjYuMFxuXHQgKi9cblx0Y291bnRkb3duLnJlc2V0TGFiZWxzID0gcmVzZXRGb3JtYXQ7XG5cblx0cmVzZXRGb3JtYXQoKTtcblxuXHRpZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjb3VudGRvd247XG5cblx0fSBlbHNlIGlmICh0eXBlb2Ygd2luZG93LmRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygd2luZG93LmRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0d2luZG93LmRlZmluZSgnY291bnRkb3duJywgW10sIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGNvdW50ZG93bjtcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiBjb3VudGRvd247XG5cbn0pKG1vZHVsZSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jb3VudGRvd24vY291bnRkb3duLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDQiXSwic291cmNlUm9vdCI6IiJ9