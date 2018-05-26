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
exports.push([module.i, "@font-face {\n  font-family: \"MrsEaves\";\n  src: url(" + __webpack_require__(5) + ") format(\"truetype\");\n}\n\nbody {\n  margin: 0;\n}\n\n#nav {\n  margin-top: 1vh;\n  position: fixed;\n  top: 5px;\n  left: 10px;\n\n  height: 48px;\n  max-width: 48px;\n  overflow: hidden;\n\n  transition: max-width 700ms ease, background-color 100ms linear 700ms;\n  font-family: \"Fjalla One\", sans;\n  font-size: 14px;\n\n  z-index: 1000;\n}\n\n#nav button {\n  background: none !important;\n  color: black;\n  border: none;\n  padding: 0! important;\n  font: inherit;\n  cursor: pointer;\n  outline: inherit !important;\n\n  height: 48px;\n  width: 48px;\n\n  transition: transform .5s ease;\n  transform: rotate(0deg);\n}\n\n#nav.open {\n  background-color: rgba(255, 255, 255, 0.9);\n\n  max-width: 500px;\n  transition: max-width 700ms ease, background-color 200ms ease;\n}\n\n#nav.open button {\n  transition: transform .5s ease;\n  transform: rotate(90deg);\n}\n\n#links {\n  float: right;\n  line-height: 48px;\n}\n\n#links .separator {\n  border-right: 1px solid black;\n  margin-right: 10px;\n  height: 30px;\n}\n\n#nav a {\n  color: black;\n  text-decoration: none;\n  font-size: 1.5em;\n  \n  padding-right: 10px;\n}\n\n#nav a:last-child {\n  padding-right: 10px;\n}\n\n.hidden {\n  display: none;\n}\n\n#nav:not(.open) {\n  animation: 10s linear 5s infinite normal pulseBackground;\n}\n\n@keyframes pulseBackground {\n  0% { background-color: rgba(255, 255, 255, 0); }\n  5% { background-color: rgba(255, 255, 255, .7); }\n  10% { background-color: rgba(255, 255, 255, 0); }\n  100% { background-color: rgba(255, 255, 255, 0); }\n}", ""]);

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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return navToggleHandler; });
function nav() {
  return document.getElementById('nav');
}

function init_nav_button() {
  nav().addEventListener('click', navToggleHandler);
}

function navToggleHandler()  {
  nav().classList.toggle('open');
}




/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "3a09a3c2756963e8b3dc7e6ec883014c.jpg";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n  font-family: MrsEaves, Georgia, serif;\n}\n\nhtml {\n  background: url(" + __webpack_require__(7) + ") no-repeat center center fixed;\n  background-size: cover;\n}\n\n.title {\n  padding: 4vh 0;\n  margin-top: 25vh;\n  width: 100%;\n  text-align: center;\n\n  color: black;\n  background-color: rgba(256, 256, 256, .4);\n}\n\n.title > * {\n  margin: 3vh auto;\n  width: fit-content;\n}\n\n.title h1 {\n  font-weight: 1000;\n  font-size: 10vh;\n  font-family: bombshell;\n}\n\n.logo {\n  cursor: pointer;\n}\n\n.logo table {\n  font-family: MrsEaves;\n  font-size: 6vh;\n  text-align: center;\n  color: black;\n}\n\n.hl {\n  color: white;\n}\n\n.countdown {\n  position: fixed;\n  bottom: 5px;\n  right: 10px;\n  font-size: 3vh;\n}", ""]);

// exports


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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_css__ = __webpack_require__(8);
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

function init_logo_click() {
  document.querySelector('.logo').addEventListener('click', __WEBPACK_IMPORTED_MODULE_2__nav__["b" /* navToggleHandler */]);
}

function init() {
  begin_countdown_loop();
  Object(__WEBPACK_IMPORTED_MODULE_2__nav__["a" /* default */])();
  init_logo_click();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzVhOWNhMTk0MTZjZmE5YWIwZmIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZS5jc3M/YmQ4NCIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovLy8uL3NyYy9mb250cy9tcnNlYXZlcy50dGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL25hdi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL2JnNS5qcGciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmNzcz81ZDE1Iiwid2VicGFjazovLy8uL3NyYy9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3VudGRvd24vY291bnRkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7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QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7O0FBRUEsNkJBQTZCLG1CQUFtQjs7QUFFaEQ7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM1V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLFdBQVcsRUFBRTtBQUNyRCx3Q0FBd0MsV0FBVyxFQUFFOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLHNDQUFzQztBQUN0QyxHQUFHO0FBQ0g7QUFDQSw4REFBOEQ7QUFDOUQ7O0FBRUE7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBOzs7Ozs7O0FDeEZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FB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Q2pCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksU0FBUztBQUNyQixZQUFZLE1BQU07QUFDbEIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksTUFBTTtBQUNsQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFNBQVM7QUFDckIsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFNBQVM7QUFDckIsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFNBQVM7QUFDckIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGNBQWMsUUFBUTs7QUFFdEI7QUFDQSxjQUFjLFFBQVE7O0FBRXRCO0FBQ0EsY0FBYyxRQUFROztBQUV0QjtBQUNBLGNBQWMsUUFBUTs7QUFFdEI7QUFDQSxjQUFjLFFBQVE7O0FBRXRCO0FBQ0EsY0FBYyxRQUFROztBQUV0QjtBQUNBLGNBQWMsUUFBUTs7QUFFdEI7QUFDQSxjQUFjLFFBQVE7O0FBRXRCO0FBQ0EsY0FBYyxRQUFROztBQUV0Qjs7QUFFQTtBQUNBLGFBQWEsNkNBQTZDO0FBQzFEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksU0FBUztBQUNyQixZQUFZLE1BQU07QUFDbEIsWUFBWSxNQUFNO0FBQ2xCLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7O0FBRUE7QUFDQTtBQUNBLGtDQUFrQztBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG9EQUFvRDtBQUNoRSxZQUFZLG9EQUFvRDtBQUNoRSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EseUJBQXlCLFNBQVM7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLHVCQUF1QixTQUFTO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkNBQTZDLEtBQUssc0JBQXNCLEtBQUssb0JBQW9CLE9BQU8sc0JBQXNCLE9BQU8sb0JBQW9CLE9BQU87QUFDaEs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxLQUFLLHNCQUFzQixLQUFLLG9CQUFvQixPQUFPLHNCQUFzQixPQUFPLG9CQUFvQixPQUFPO0FBQzNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxnQkFBZ0IsUUFBUTs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxvQkFBb0I7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxjQUFjO0FBQ2hEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCLFlBQVksY0FBYztBQUMxQixZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixZQUFZLHlCQUF5QjtBQUNyQyxZQUFZLGdDQUFnQztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxNCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMzVhOWNhMTk0MTZjZmE5YWIwZmIiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgc3R5bGVUYXJnZXQgPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHRcdC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cdFx0XHRpZiAoc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuXHRcdFx0XHRcdC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcblx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRtZW1vW3NlbGVjdG9yXSA9IHN0eWxlVGFyZ2V0O1xuXHRcdH1cblx0XHRyZXR1cm4gbWVtb1tzZWxlY3Rvcl1cblx0fTtcbn0pKGZ1bmN0aW9uICh0YXJnZXQpIHtcblx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KVxufSk7XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyXHRzaW5nbGV0b25Db3VudGVyID0gMDtcbnZhclx0c3R5bGVzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXJcdGZpeFVybHMgPSByZXF1aXJlKFwiLi91cmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYgKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAoIW9wdGlvbnMuc2luZ2xldG9uICYmIHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiAhPT0gXCJib29sZWFuXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJvYmplY3RcIiAmJiBvcHRpb25zLmluc2VydEF0LmJlZm9yZSkge1xuXHRcdHZhciBuZXh0U2libGluZyA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvICsgXCIgXCIgKyBvcHRpb25zLmluc2VydEF0LmJlZm9yZSk7XG5cdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbmV4dFNpYmxpbmcpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIltTdHlsZSBMb2FkZXJdXFxuXFxuIEludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnICgnb3B0aW9ucy5pbnNlcnRBdCcpIGZvdW5kLlxcbiBNdXN0IGJlICd0b3AnLCAnYm90dG9tJywgb3IgT2JqZWN0LlxcbiAoaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIjaW5zZXJ0YXQpXFxuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudCAoc3R5bGUpIHtcblx0aWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0c3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG5cblx0dmFyIGlkeCA9IHN0eWxlc0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZSk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhZGRBdHRycyhzdHlsZSwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZSk7XG5cblx0cmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhZGRBdHRycyhsaW5rLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmspO1xuXG5cdHJldHVybiBsaW5rO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRycyAoZWwsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlIChvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlLCB1cGRhdGUsIHJlbW92ZSwgcmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgcmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cblx0ICAgIGlmIChyZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cblx0XHRzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cblx0fSBlbHNlIGlmIChcblx0XHRvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIlxuXHQpIHtcblx0XHRzdHlsZSA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblxuXHRcdFx0aWYoc3R5bGUuaHJlZikgVVJMLnJldm9rZU9iamVjdFVSTChzdHlsZS5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlIChuZXdPYmopIHtcblx0XHRpZiAobmV3T2JqKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG5ld09iai5jc3MgPT09IG9iai5jc3MgJiZcblx0XHRcdFx0bmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiZcblx0XHRcdFx0bmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcFxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnIChzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlLmNoaWxkTm9kZXM7XG5cblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcgKHN0eWxlLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZS5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcblx0XHR9XG5cblx0XHRzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rIChsaW5rLCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qXG5cdFx0SWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdFx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0XHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0XHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpIHtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZiAoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGluay5ocmVmO1xuXG5cdGxpbmsuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKSBVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9zdHlsZS5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vc3R5bGUuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3N0eWxlLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9RmphbGxhK09uZXxSb2JvdG98R3JlYXQrVmliZXMpO1wiLCBcIlwiXSk7XG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogXFxcIk1yc0VhdmVzXFxcIjtcXG4gIHNyYzogdXJsKFwiICsgcmVxdWlyZShcIi4vZm9udHMvbXJzZWF2ZXMudHRmXCIpICsgXCIpIGZvcm1hdChcXFwidHJ1ZXR5cGVcXFwiKTtcXG59XFxuXFxuYm9keSB7XFxuICBtYXJnaW46IDA7XFxufVxcblxcbiNuYXYge1xcbiAgbWFyZ2luLXRvcDogMXZoO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgdG9wOiA1cHg7XFxuICBsZWZ0OiAxMHB4O1xcblxcbiAgaGVpZ2h0OiA0OHB4O1xcbiAgbWF4LXdpZHRoOiA0OHB4O1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG5cXG4gIHRyYW5zaXRpb246IG1heC13aWR0aCA3MDBtcyBlYXNlLCBiYWNrZ3JvdW5kLWNvbG9yIDEwMG1zIGxpbmVhciA3MDBtcztcXG4gIGZvbnQtZmFtaWx5OiBcXFwiRmphbGxhIE9uZVxcXCIsIHNhbnM7XFxuICBmb250LXNpemU6IDE0cHg7XFxuXFxuICB6LWluZGV4OiAxMDAwO1xcbn1cXG5cXG4jbmF2IGJ1dHRvbiB7XFxuICBiYWNrZ3JvdW5kOiBub25lICFpbXBvcnRhbnQ7XFxuICBjb2xvcjogYmxhY2s7XFxuICBib3JkZXI6IG5vbmU7XFxuICBwYWRkaW5nOiAwISBpbXBvcnRhbnQ7XFxuICBmb250OiBpbmhlcml0O1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgb3V0bGluZTogaW5oZXJpdCAhaW1wb3J0YW50O1xcblxcbiAgaGVpZ2h0OiA0OHB4O1xcbiAgd2lkdGg6IDQ4cHg7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjVzIGVhc2U7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG59XFxuXFxuI25hdi5vcGVuIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXG5cXG4gIG1heC13aWR0aDogNTAwcHg7XFxuICB0cmFuc2l0aW9uOiBtYXgtd2lkdGggNzAwbXMgZWFzZSwgYmFja2dyb3VuZC1jb2xvciAyMDBtcyBlYXNlO1xcbn1cXG5cXG4jbmF2Lm9wZW4gYnV0dG9uIHtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuNXMgZWFzZTtcXG4gIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTtcXG59XFxuXFxuI2xpbmtzIHtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGxpbmUtaGVpZ2h0OiA0OHB4O1xcbn1cXG5cXG4jbGlua3MgLnNlcGFyYXRvciB7XFxuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCBibGFjaztcXG4gIG1hcmdpbi1yaWdodDogMTBweDtcXG4gIGhlaWdodDogMzBweDtcXG59XFxuXFxuI25hdiBhIHtcXG4gIGNvbG9yOiBibGFjaztcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGZvbnQtc2l6ZTogMS41ZW07XFxuICBcXG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XFxufVxcblxcbiNuYXYgYTpsYXN0LWNoaWxkIHtcXG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XFxufVxcblxcbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuI25hdjpub3QoLm9wZW4pIHtcXG4gIGFuaW1hdGlvbjogMTBzIGxpbmVhciA1cyBpbmZpbml0ZSBub3JtYWwgcHVsc2VCYWNrZ3JvdW5kO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlQmFja2dyb3VuZCB7XFxuICAwJSB7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMCk7IH1cXG4gIDUlIHsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuNyk7IH1cXG4gIDEwJSB7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMCk7IH1cXG4gIDEwMCUgeyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDApOyB9XFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIhLi9zcmMvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI0NDI3ZjFlYTUwYWVmZDdlOGFlN2JiOGVjMmIyMjM5OC50dGZcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9mb250cy9tcnNlYXZlcy50dGZcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiIsImZ1bmN0aW9uIG5hdigpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5pdF9uYXZfYnV0dG9uKCkge1xuICBuYXYoKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG5hdlRvZ2dsZUhhbmRsZXIpO1xufVxuXG5mdW5jdGlvbiBuYXZUb2dnbGVIYW5kbGVyKCkgIHtcbiAgbmF2KCkuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xufVxuXG5leHBvcnQge1xuICBuYXZUb2dnbGVIYW5kbGVyXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9uYXYuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjNhMDlhM2MyNzU2OTYzZThiM2RjN2U2ZWM4ODMwMTRjLmpwZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9iZzUuanBnXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMiAzIDUiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9pbmRleC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vaW5kZXguY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2luZGV4LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMiAzIDUiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiBNcnNFYXZlcywgR2VvcmdpYSwgc2VyaWY7XFxufVxcblxcbmh0bWwge1xcbiAgYmFja2dyb3VuZDogdXJsKFwiICsgcmVxdWlyZShcIi4vaW1nL2JnNS5qcGdcIikgKyBcIikgbm8tcmVwZWF0IGNlbnRlciBjZW50ZXIgZml4ZWQ7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbn1cXG5cXG4udGl0bGUge1xcbiAgcGFkZGluZzogNHZoIDA7XFxuICBtYXJnaW4tdG9wOiAyNXZoO1xcbiAgd2lkdGg6IDEwMCU7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFxuICBjb2xvcjogYmxhY2s7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NiwgMjU2LCAyNTYsIC40KTtcXG59XFxuXFxuLnRpdGxlID4gKiB7XFxuICBtYXJnaW46IDN2aCBhdXRvO1xcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4udGl0bGUgaDEge1xcbiAgZm9udC13ZWlnaHQ6IDEwMDA7XFxuICBmb250LXNpemU6IDEwdmg7XFxuICBmb250LWZhbWlseTogYm9tYnNoZWxsO1xcbn1cXG5cXG4ubG9nbyB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5sb2dvIHRhYmxlIHtcXG4gIGZvbnQtZmFtaWx5OiBNcnNFYXZlcztcXG4gIGZvbnQtc2l6ZTogNnZoO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5cXG4uaGwge1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4uY291bnRkb3duIHtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIGJvdHRvbTogNXB4O1xcbiAgcmlnaHQ6IDEwcHg7XFxuICBmb250LXNpemU6IDN2aDtcXG59XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL3NyYy9pbmRleC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAyIDMgNSIsImltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XG5pbXBvcnQgXCIuL2luZGV4LmNzc1wiO1xuXG5pbXBvcnQgaW5pdF9uYXZfYnV0dG9uLCB7IG5hdlRvZ2dsZUhhbmRsZXIgfSBmcm9tIFwiLi9uYXZcIjtcblxuY29uc3QgY291bnRkb3duID0gcmVxdWlyZSgnY291bnRkb3duJyk7XG5jb25zdCBUSEVfREFURSA9IG5ldyBEYXRlKDE1MzQ2MjYwMDAwMDApO1xuY29uc3QgQ09VTlRET1dOX1VOSVRTID0gY291bnRkb3duLkRBWVMgfCBjb3VudGRvd24uSE9VUlMgfCBjb3VudGRvd24uTUlOVVRFUztcblxuY29uc3QgU0VDT05EUyA9IDEwMDA7XG5jb25zdCBNSU5VVEVTID0gU0VDT05EUyAqIDYwO1xuXG5mdW5jdGlvbiB0aWNrX2NvdW50ZG93bigpIHtcbiAgbGV0IHMgPSAnaW4gJyArIGNvdW50ZG93bihUSEVfREFURSwgbnVsbCwgQ09VTlRET1dOX1VOSVRTKS50b1N0cmluZygpO1xuICBsZXQgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb3VudGRvd24nKTtcbiAgZm9yIChsZXQgZWxlIG9mIGVsZW1lbnRzKSB7XG4gICAgZWxlLmlubmVySFRNTCA9IHMucmVwbGFjZSgnIGFuZCcsICcsJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYmVnaW5fY291bnRkb3duX2xvb3AoKSB7XG4gIHRpY2tfY291bnRkb3duKCk7XG4gIHdpbmRvdy5zZXRJbnRlcnZhbCh0aWNrX2NvdW50ZG93biwgMSAqIE1JTlVURVMpO1xufVxuXG5mdW5jdGlvbiBpbml0X2xvZ29fY2xpY2soKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dvJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuYXZUb2dnbGVIYW5kbGVyKTtcbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgYmVnaW5fY291bnRkb3duX2xvb3AoKTtcbiAgaW5pdF9uYXZfYnV0dG9uKCk7XG4gIGluaXRfbG9nb19jbGljaygpO1xufVxuXG5pbml0KCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSA1IiwiLypnbG9iYWwgd2luZG93ICovXG4vKipcbiAqIEBsaWNlbnNlIGNvdW50ZG93bi5qcyB2Mi42LjAgaHR0cDovL2NvdW50ZG93bmpzLm9yZ1xuICogQ29weXJpZ2h0IChjKTIwMDYtMjAxNCBTdGVwaGVuIE0uIE1jS2FtZXkuXG4gKiBMaWNlbnNlZCB1bmRlciBUaGUgTUlUIExpY2Vuc2UuXG4gKi9cbi8qanNoaW50IGJpdHdpc2U6ZmFsc2UgKi9cblxuLyoqXG4gKiBAcHVibGljXG4gKiBAdHlwZSB7T2JqZWN0fG51bGx9XG4gKi9cbnZhciBtb2R1bGU7XG5cbi8qKlxuICogQVBJIGVudHJ5XG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCl8RGF0ZXxudW1iZXJ9IHN0YXJ0IHRoZSBzdGFydGluZyBkYXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCl8RGF0ZXxudW1iZXJ9IGVuZCB0aGUgZW5kaW5nIGRhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSB1bml0cyB0aGUgdW5pdHMgdG8gcG9wdWxhdGVcbiAqIEByZXR1cm4ge09iamVjdHxudW1iZXJ9XG4gKi9cbnZhciBjb3VudGRvd24gPSAoXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IG1vZHVsZSBDb21tb25KUyBNb2R1bGVcbiAqL1xuZnVuY3Rpb24obW9kdWxlKSB7XG5cdC8qanNoaW50IHNtYXJ0dGFiczp0cnVlICovXG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNSUxMSVNFQ09ORFNcdD0gMHgwMDE7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIFNFQ09ORFNcdFx0XHQ9IDB4MDAyO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNSU5VVEVTXHRcdFx0PSAweDAwNDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgSE9VUlNcdFx0XHQ9IDB4MDA4O1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBEQVlTXHRcdFx0PSAweDAxMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgV0VFS1NcdFx0XHQ9IDB4MDIwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNT05USFNcdFx0XHQ9IDB4MDQwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBZRUFSU1x0XHRcdD0gMHgwODA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIERFQ0FERVNcdFx0XHQ9IDB4MTAwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBDRU5UVVJJRVNcdFx0PSAweDIwMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTUlMTEVOTklBXHRcdD0gMHg0MDA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIERFRkFVTFRTXHRcdD0gWUVBUlN8TU9OVEhTfERBWVN8SE9VUlN8TUlOVVRFU3xTRUNPTkRTO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCA9IDEwMDA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIFNFQ09ORFNfUEVSX01JTlVURSA9IDYwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNSU5VVEVTX1BFUl9IT1VSID0gNjA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIEhPVVJTX1BFUl9EQVkgPSAyNDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTUlMTElTRUNPTkRTX1BFUl9EQVkgPSBIT1VSU19QRVJfREFZICogTUlOVVRFU19QRVJfSE9VUiAqIFNFQ09ORFNfUEVSX01JTlVURSAqIE1JTExJU0VDT05EU19QRVJfU0VDT05EO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBEQVlTX1BFUl9XRUVLID0gNztcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTU9OVEhTX1BFUl9ZRUFSID0gMTI7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIFlFQVJTX1BFUl9ERUNBREUgPSAxMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgREVDQURFU19QRVJfQ0VOVFVSWSA9IDEwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBDRU5UVVJJRVNfUEVSX01JTExFTk5JVU0gPSAxMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHggbnVtYmVyXG5cdCAqIEByZXR1cm4ge251bWJlcn1cblx0ICovXG5cdHZhciBjZWlsID0gTWF0aC5jZWlsO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0geCBudW1iZXJcblx0ICogQHJldHVybiB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtEYXRlfSByZWYgcmVmZXJlbmNlIGRhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNoaWZ0IG51bWJlciBvZiBtb250aHMgdG8gc2hpZnRcblx0ICogQHJldHVybiB7bnVtYmVyfSBudW1iZXIgb2YgZGF5cyBzaGlmdGVkXG5cdCAqL1xuXHRmdW5jdGlvbiBib3Jyb3dNb250aHMocmVmLCBzaGlmdCkge1xuXHRcdHZhciBwcmV2VGltZSA9IHJlZi5nZXRUaW1lKCk7XG5cblx0XHQvLyBpbmNyZW1lbnQgbW9udGggYnkgc2hpZnRcblx0XHRyZWYuc2V0TW9udGgoIHJlZi5nZXRNb250aCgpICsgc2hpZnQgKTtcblxuXHRcdC8vIHRoaXMgaXMgdGhlIHRyaWNraWVzdCBzaW5jZSBtb250aHMgdmFyeSBpbiBsZW5ndGhcblx0XHRyZXR1cm4gTWF0aC5yb3VuZCggKHJlZi5nZXRUaW1lKCkgLSBwcmV2VGltZSkgLyBNSUxMSVNFQ09ORFNfUEVSX0RBWSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RGF0ZX0gcmVmIHJlZmVyZW5jZSBkYXRlXG5cdCAqIEByZXR1cm4ge251bWJlcn0gbnVtYmVyIG9mIGRheXNcblx0ICovXG5cdGZ1bmN0aW9uIGRheXNQZXJNb250aChyZWYpIHtcblx0XHR2YXIgYSA9IHJlZi5nZXRUaW1lKCk7XG5cblx0XHQvLyBpbmNyZW1lbnQgbW9udGggYnkgMVxuXHRcdHZhciBiID0gbmV3IERhdGUoYSk7XG5cdFx0Yi5zZXRNb250aCggcmVmLmdldE1vbnRoKCkgKyAxICk7XG5cblx0XHQvLyB0aGlzIGlzIHRoZSB0cmlja2llc3Qgc2luY2UgbW9udGhzIHZhcnkgaW4gbGVuZ3RoXG5cdFx0cmV0dXJuIE1hdGgucm91bmQoIChiLmdldFRpbWUoKSAtIGEpIC8gTUlMTElTRUNPTkRTX1BFUl9EQVkgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0RhdGV9IHJlZiByZWZlcmVuY2UgZGF0ZVxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9IG51bWJlciBvZiBkYXlzXG5cdCAqL1xuXHRmdW5jdGlvbiBkYXlzUGVyWWVhcihyZWYpIHtcblx0XHR2YXIgYSA9IHJlZi5nZXRUaW1lKCk7XG5cblx0XHQvLyBpbmNyZW1lbnQgeWVhciBieSAxXG5cdFx0dmFyIGIgPSBuZXcgRGF0ZShhKTtcblx0XHRiLnNldEZ1bGxZZWFyKCByZWYuZ2V0RnVsbFllYXIoKSArIDEgKTtcblxuXHRcdC8vIHRoaXMgaXMgdGhlIHRyaWNraWVzdCBzaW5jZSB5ZWFycyAocGVyaW9kaWNhbGx5KSB2YXJ5IGluIGxlbmd0aFxuXHRcdHJldHVybiBNYXRoLnJvdW5kKCAoYi5nZXRUaW1lKCkgLSBhKSAvIE1JTExJU0VDT05EU19QRVJfREFZICk7XG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyB0aGUgVGltZXNwYW4gdG8gdGhlIGdpdmVuIGRhdGUuXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKiBAcGFyYW0ge0RhdGU9fSBkYXRlXG5cdCAqIEByZXR1cm4ge0RhdGV9XG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRUb0RhdGUodHMsIGRhdGUpIHtcblx0XHRkYXRlID0gKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSB8fCAoKGRhdGUgIT09IG51bGwpICYmIGlzRmluaXRlKGRhdGUpKSA/IG5ldyBEYXRlKCtkYXRlKSA6IG5ldyBEYXRlKCk7XG5cdFx0aWYgKCF0cykge1xuXHRcdFx0cmV0dXJuIGRhdGU7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgdGhlcmUgaXMgYSB2YWx1ZSBmaWVsZCwgdXNlIGl0IGRpcmVjdGx5XG5cdFx0dmFyIHZhbHVlID0gK3RzLnZhbHVlIHx8IDA7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyB2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gZGF0ZTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9ICt0cy5taWxsaXNlY29uZHMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGRhdGUuc2V0TWlsbGlzZWNvbmRzKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgKyB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSArdHMuc2Vjb25kcyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0ZGF0ZS5zZXRTZWNvbmRzKGRhdGUuZ2V0U2Vjb25kcygpICsgdmFsdWUpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gK3RzLm1pbnV0ZXMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGRhdGUuc2V0TWludXRlcyhkYXRlLmdldE1pbnV0ZXMoKSArIHZhbHVlKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9ICt0cy5ob3VycyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0ZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgKyB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSArdHMud2Vla3MgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHZhbHVlICo9IERBWVNfUEVSX1dFRUs7XG5cdFx0fVxuXG5cdFx0dmFsdWUgKz0gK3RzLmRheXMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHZhbHVlKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9ICt0cy5tb250aHMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgdmFsdWUpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gK3RzLm1pbGxlbm5pYSB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dmFsdWUgKj0gQ0VOVFVSSUVTX1BFUl9NSUxMRU5OSVVNO1xuXHRcdH1cblxuXHRcdHZhbHVlICs9ICt0cy5jZW50dXJpZXMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHZhbHVlICo9IERFQ0FERVNfUEVSX0NFTlRVUlk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgKz0gK3RzLmRlY2FkZXMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHZhbHVlICo9IFlFQVJTX1BFUl9ERUNBREU7XG5cdFx0fVxuXG5cdFx0dmFsdWUgKz0gK3RzLnllYXJzIHx8IDA7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHZhbHVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGF0ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9NSUxMSVNFQ09ORFNcdD0gMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfU0VDT05EU1x0XHQ9IDE7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIExBQkVMX01JTlVURVNcdFx0PSAyO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9IT1VSU1x0XHRcdD0gMztcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfREFZU1x0XHRcdD0gNDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfV0VFS1NcdFx0XHQ9IDU7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIExBQkVMX01PTlRIU1x0XHQ9IDY7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIExBQkVMX1lFQVJTXHRcdFx0PSA3O1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9ERUNBREVTXHRcdD0gODtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfQ0VOVFVSSUVTXHRcdD0gOTtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfTUlMTEVOTklBXHRcdD0gMTA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdHZhciBMQUJFTFNfU0lOR0xVQVI7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdHZhciBMQUJFTFNfUExVUkFMO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdHlwZSB7c3RyaW5nfVxuXHQgKi9cblx0dmFyIExBQkVMX0xBU1Q7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqL1xuXHR2YXIgTEFCRUxfREVMSU07XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqL1xuXHR2YXIgTEFCRUxfTk9XO1xuXG5cdC8qKlxuXHQgKiBGb3JtYXRzIGEgbnVtYmVyICYgdW5pdCBhcyBhIHN0cmluZ1xuXHQgKiBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB1bml0XG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cdHZhciBmb3JtYXR0ZXI7XG5cblx0LyoqXG5cdCAqIEZvcm1hdHMgYSBudW1iZXIgYXMgYSBzdHJpbmdcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXHR2YXIgZm9ybWF0TnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHVuaXQgdW5pdCBpbmRleCBpbnRvIGxhYmVsIGxpc3Rcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblx0ZnVuY3Rpb24gcGx1cmFsaXR5KHZhbHVlLCB1bml0KSB7XG5cdFx0cmV0dXJuIGZvcm1hdE51bWJlcih2YWx1ZSkrKCh2YWx1ZSA9PT0gMSkgPyBMQUJFTFNfU0lOR0xVQVJbdW5pdF0gOiBMQUJFTFNfUExVUkFMW3VuaXRdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3JtYXRzIHRoZSBlbnRyaWVzIHdpdGggc2luZ3VsYXIgb3IgcGx1cmFsIGxhYmVsc1xuXHQgKiBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtUaW1lc3Bhbn0gdHNcblx0ICogQHJldHVybiB7QXJyYXl9XG5cdCAqL1xuXHR2YXIgZm9ybWF0TGlzdDtcblxuXHQvKipcblx0ICogVGltZXNwYW4gcmVwcmVzZW50YXRpb24gb2YgYSBkdXJhdGlvbiBvZiB0aW1lXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdGhpcyB7VGltZXNwYW59XG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0ZnVuY3Rpb24gVGltZXNwYW4oKSB7fVxuXG5cdC8qKlxuXHQgKiBGb3JtYXRzIHRoZSBUaW1lc3BhbiBhcyBhIHNlbnRlbmNlXG5cdCAqIFxuXHQgKiBAcGFyYW0ge3N0cmluZz19IGVtcHR5TGFiZWwgdGhlIHN0cmluZyB0byB1c2Ugd2hlbiBubyB2YWx1ZXMgcmV0dXJuZWRcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblx0VGltZXNwYW4ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oZW1wdHlMYWJlbCkge1xuXHRcdHZhciBsYWJlbCA9IGZvcm1hdExpc3QodGhpcyk7XG5cblx0XHR2YXIgY291bnQgPSBsYWJlbC5sZW5ndGg7XG5cdFx0aWYgKCFjb3VudCkge1xuXHRcdFx0cmV0dXJuIGVtcHR5TGFiZWwgPyAnJytlbXB0eUxhYmVsIDogTEFCRUxfTk9XO1xuXHRcdH1cblx0XHRpZiAoY291bnQgPT09IDEpIHtcblx0XHRcdHJldHVybiBsYWJlbFswXTtcblx0XHR9XG5cblx0XHR2YXIgbGFzdCA9IExBQkVMX0xBU1QrbGFiZWwucG9wKCk7XG5cdFx0cmV0dXJuIGxhYmVsLmpvaW4oTEFCRUxfREVMSU0pK2xhc3Q7XG5cdH07XG5cblx0LyoqXG5cdCAqIEZvcm1hdHMgdGhlIFRpbWVzcGFuIGFzIGEgc2VudGVuY2UgaW4gSFRNTFxuXHQgKiBcblx0ICogQHBhcmFtIHtzdHJpbmc9fSB0YWcgSFRNTCB0YWcgbmFtZSB0byB3cmFwIGVhY2ggdmFsdWVcblx0ICogQHBhcmFtIHtzdHJpbmc9fSBlbXB0eUxhYmVsIHRoZSBzdHJpbmcgdG8gdXNlIHdoZW4gbm8gdmFsdWVzIHJldHVybmVkXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cdFRpbWVzcGFuLnByb3RvdHlwZS50b0hUTUwgPSBmdW5jdGlvbih0YWcsIGVtcHR5TGFiZWwpIHtcblx0XHR0YWcgPSB0YWcgfHwgJ3NwYW4nO1xuXHRcdHZhciBsYWJlbCA9IGZvcm1hdExpc3QodGhpcyk7XG5cblx0XHR2YXIgY291bnQgPSBsYWJlbC5sZW5ndGg7XG5cdFx0aWYgKCFjb3VudCkge1xuXHRcdFx0ZW1wdHlMYWJlbCA9IGVtcHR5TGFiZWwgfHwgTEFCRUxfTk9XO1xuXHRcdFx0cmV0dXJuIGVtcHR5TGFiZWwgPyAnPCcrdGFnKyc+JytlbXB0eUxhYmVsKyc8LycrdGFnKyc+JyA6IGVtcHR5TGFiZWw7XG5cdFx0fVxuXHRcdGZvciAodmFyIGk9MDsgaTxjb3VudDsgaSsrKSB7XG5cdFx0XHQvLyB3cmFwIGVhY2ggdW5pdCBpbiB0YWdcblx0XHRcdGxhYmVsW2ldID0gJzwnK3RhZysnPicrbGFiZWxbaV0rJzwvJyt0YWcrJz4nO1xuXHRcdH1cblx0XHRpZiAoY291bnQgPT09IDEpIHtcblx0XHRcdHJldHVybiBsYWJlbFswXTtcblx0XHR9XG5cblx0XHR2YXIgbGFzdCA9IExBQkVMX0xBU1QrbGFiZWwucG9wKCk7XG5cdFx0cmV0dXJuIGxhYmVsLmpvaW4oTEFCRUxfREVMSU0pK2xhc3Q7XG5cdH07XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgdGhlIFRpbWVzcGFuIHRvIHRoZSBnaXZlbiBkYXRlXG5cdCAqIFxuXHQgKiBAcGFyYW0ge0RhdGU9fSBkYXRlIHRoZSBkYXRlIHRvIHdoaWNoIHRoZSB0aW1lc3BhbiBpcyBhZGRlZC5cblx0ICogQHJldHVybiB7RGF0ZX1cblx0ICovXG5cdFRpbWVzcGFuLnByb3RvdHlwZS5hZGRUbyA9IGZ1bmN0aW9uKGRhdGUpIHtcblx0XHRyZXR1cm4gYWRkVG9EYXRlKHRoaXMsIGRhdGUpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBGb3JtYXRzIHRoZSBlbnRyaWVzIGFzIEVuZ2xpc2ggbGFiZWxzXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKiBAcmV0dXJuIHtBcnJheX1cblx0ICovXG5cdGZvcm1hdExpc3QgPSBmdW5jdGlvbih0cykge1xuXHRcdHZhciBsaXN0ID0gW107XG5cblx0XHR2YXIgdmFsdWUgPSB0cy5taWxsZW5uaWE7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRsaXN0LnB1c2goZm9ybWF0dGVyKHZhbHVlLCBMQUJFTF9NSUxMRU5OSUEpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLmNlbnR1cmllcztcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX0NFTlRVUklFUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMuZGVjYWRlcztcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX0RFQ0FERVMpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLnllYXJzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfWUVBUlMpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLm1vbnRocztcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX01PTlRIUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMud2Vla3M7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRsaXN0LnB1c2goZm9ybWF0dGVyKHZhbHVlLCBMQUJFTF9XRUVLUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMuZGF5cztcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX0RBWVMpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLmhvdXJzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfSE9VUlMpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLm1pbnV0ZXM7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRsaXN0LnB1c2goZm9ybWF0dGVyKHZhbHVlLCBMQUJFTF9NSU5VVEVTKSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSB0cy5zZWNvbmRzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfU0VDT05EUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMubWlsbGlzZWNvbmRzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfTUlMTElTRUNPTkRTKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGxpc3Q7XG5cdH07XG5cblx0LyoqXG5cdCAqIEJvcnJvdyBhbnkgdW5kZXJmbG93IHVuaXRzLCBjYXJyeSBhbnkgb3ZlcmZsb3cgdW5pdHNcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7VGltZXNwYW59IHRzXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0b1VuaXRcblx0ICovXG5cdGZ1bmN0aW9uIHJpcHBsZVJvdW5kZWQodHMsIHRvVW5pdCkge1xuXHRcdHN3aXRjaCAodG9Vbml0KSB7XG5cdFx0XHRjYXNlICdzZWNvbmRzJzpcblx0XHRcdFx0aWYgKHRzLnNlY29uZHMgIT09IFNFQ09ORFNfUEVSX01JTlVURSB8fCBpc05hTih0cy5taW51dGVzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgc2Vjb25kcyB1cCB0byBtaW51dGVzXG5cdFx0XHRcdHRzLm1pbnV0ZXMrKztcblx0XHRcdFx0dHMuc2Vjb25kcyA9IDA7XG5cblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0Y2FzZSAnbWludXRlcyc6XG5cdFx0XHRcdGlmICh0cy5taW51dGVzICE9PSBNSU5VVEVTX1BFUl9IT1VSIHx8IGlzTmFOKHRzLmhvdXJzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgbWludXRlcyB1cCB0byBob3Vyc1xuXHRcdFx0XHR0cy5ob3VycysrO1xuXHRcdFx0XHR0cy5taW51dGVzID0gMDtcblxuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRjYXNlICdob3Vycyc6XG5cdFx0XHRcdGlmICh0cy5ob3VycyAhPT0gSE9VUlNfUEVSX0RBWSB8fCBpc05hTih0cy5kYXlzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgaG91cnMgdXAgdG8gZGF5c1xuXHRcdFx0XHR0cy5kYXlzKys7XG5cdFx0XHRcdHRzLmhvdXJzID0gMDtcblxuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRjYXNlICdkYXlzJzpcblx0XHRcdFx0aWYgKHRzLmRheXMgIT09IERBWVNfUEVSX1dFRUsgfHwgaXNOYU4odHMud2Vla3MpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHJpcHBsZSBkYXlzIHVwIHRvIHdlZWtzXG5cdFx0XHRcdHRzLndlZWtzKys7XG5cdFx0XHRcdHRzLmRheXMgPSAwO1xuXG5cdFx0XHRcdC8qIGZhbGxzIHRocm91Z2ggKi9cblx0XHRcdGNhc2UgJ3dlZWtzJzpcblx0XHRcdFx0aWYgKHRzLndlZWtzICE9PSBkYXlzUGVyTW9udGgodHMucmVmTW9udGgpL0RBWVNfUEVSX1dFRUsgfHwgaXNOYU4odHMubW9udGhzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgd2Vla3MgdXAgdG8gbW9udGhzXG5cdFx0XHRcdHRzLm1vbnRocysrO1xuXHRcdFx0XHR0cy53ZWVrcyA9IDA7XG5cblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0Y2FzZSAnbW9udGhzJzpcblx0XHRcdFx0aWYgKHRzLm1vbnRocyAhPT0gTU9OVEhTX1BFUl9ZRUFSIHx8IGlzTmFOKHRzLnllYXJzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgbW9udGhzIHVwIHRvIHllYXJzXG5cdFx0XHRcdHRzLnllYXJzKys7XG5cdFx0XHRcdHRzLm1vbnRocyA9IDA7XG5cblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0Y2FzZSAneWVhcnMnOlxuXHRcdFx0XHRpZiAodHMueWVhcnMgIT09IFlFQVJTX1BFUl9ERUNBREUgfHwgaXNOYU4odHMuZGVjYWRlcykpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gcmlwcGxlIHllYXJzIHVwIHRvIGRlY2FkZXNcblx0XHRcdFx0dHMuZGVjYWRlcysrO1xuXHRcdFx0XHR0cy55ZWFycyA9IDA7XG5cblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0Y2FzZSAnZGVjYWRlcyc6XG5cdFx0XHRcdGlmICh0cy5kZWNhZGVzICE9PSBERUNBREVTX1BFUl9DRU5UVVJZIHx8IGlzTmFOKHRzLmNlbnR1cmllcykpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gcmlwcGxlIGRlY2FkZXMgdXAgdG8gY2VudHVyaWVzXG5cdFx0XHRcdHRzLmNlbnR1cmllcysrO1xuXHRcdFx0XHR0cy5kZWNhZGVzID0gMDtcblxuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRjYXNlICdjZW50dXJpZXMnOlxuXHRcdFx0XHRpZiAodHMuY2VudHVyaWVzICE9PSBDRU5UVVJJRVNfUEVSX01JTExFTk5JVU0gfHwgaXNOYU4odHMubWlsbGVubmlhKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgY2VudHVyaWVzIHVwIHRvIG1pbGxlbm5pYVxuXHRcdFx0XHR0cy5taWxsZW5uaWErKztcblx0XHRcdFx0dHMuY2VudHVyaWVzID0gMDtcblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJpcHBsZSB1cCBwYXJ0aWFsIHVuaXRzIG9uZSBwbGFjZVxuXHQgKiBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtUaW1lc3Bhbn0gdHMgdGltZXNwYW5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyYWMgYWNjdW11bGF0ZWQgZnJhY3Rpb25hbCB2YWx1ZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZnJvbVVuaXQgc291cmNlIHVuaXQgbmFtZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdG9Vbml0IHRhcmdldCB1bml0IG5hbWVcblx0ICogQHBhcmFtIHtudW1iZXJ9IGNvbnZlcnNpb24gbXVsdGlwbGllciBiZXR3ZWVuIHVuaXRzXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBkaWdpdHMgbWF4IG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyB0byBvdXRwdXRcblx0ICogQHJldHVybiB7bnVtYmVyfSBuZXcgZnJhY3Rpb25hbCB2YWx1ZVxuXHQgKi9cblx0ZnVuY3Rpb24gZnJhY3Rpb24odHMsIGZyYWMsIGZyb21Vbml0LCB0b1VuaXQsIGNvbnZlcnNpb24sIGRpZ2l0cykge1xuXHRcdGlmICh0c1tmcm9tVW5pdF0gPj0gMCkge1xuXHRcdFx0ZnJhYyArPSB0c1tmcm9tVW5pdF07XG5cdFx0XHRkZWxldGUgdHNbZnJvbVVuaXRdO1xuXHRcdH1cblxuXHRcdGZyYWMgLz0gY29udmVyc2lvbjtcblx0XHRpZiAoZnJhYyArIDEgPD0gMSkge1xuXHRcdFx0Ly8gZHJvcCBpZiBiZWxvdyBtYWNoaW5lIGVwc2lsb25cblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdGlmICh0c1t0b1VuaXRdID49IDApIHtcblx0XHRcdC8vIGVuc3VyZSBkb2VzIG5vdCBoYXZlIG1vcmUgdGhhbiBzcGVjaWZpZWQgbnVtYmVyIG9mIGRpZ2l0c1xuXHRcdFx0dHNbdG9Vbml0XSA9ICsodHNbdG9Vbml0XSArIGZyYWMpLnRvRml4ZWQoZGlnaXRzKTtcblx0XHRcdHJpcHBsZVJvdW5kZWQodHMsIHRvVW5pdCk7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gZnJhYztcblx0fVxuXG5cdC8qKlxuXHQgKiBSaXBwbGUgdXAgcGFydGlhbCB1bml0cyB0byBuZXh0IGV4aXN0aW5nXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKiBAcGFyYW0ge251bWJlcn0gZGlnaXRzIG1heCBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgdG8gb3V0cHV0XG5cdCAqL1xuXHRmdW5jdGlvbiBmcmFjdGlvbmFsKHRzLCBkaWdpdHMpIHtcblx0XHR2YXIgZnJhYyA9IGZyYWN0aW9uKHRzLCAwLCAnbWlsbGlzZWNvbmRzJywgJ3NlY29uZHMnLCBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCwgZGlnaXRzKTtcblx0XHRpZiAoIWZyYWMpIHsgcmV0dXJuOyB9XG5cblx0XHRmcmFjID0gZnJhY3Rpb24odHMsIGZyYWMsICdzZWNvbmRzJywgJ21pbnV0ZXMnLCBTRUNPTkRTX1BFUl9NSU5VVEUsIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAnbWludXRlcycsICdob3VycycsIE1JTlVURVNfUEVSX0hPVVIsIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAnaG91cnMnLCAnZGF5cycsIEhPVVJTX1BFUl9EQVksIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAnZGF5cycsICd3ZWVrcycsIERBWVNfUEVSX1dFRUssIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAnd2Vla3MnLCAnbW9udGhzJywgZGF5c1Blck1vbnRoKHRzLnJlZk1vbnRoKS9EQVlTX1BFUl9XRUVLLCBkaWdpdHMpO1xuXHRcdGlmICghZnJhYykgeyByZXR1cm47IH1cblxuXHRcdGZyYWMgPSBmcmFjdGlvbih0cywgZnJhYywgJ21vbnRocycsICd5ZWFycycsIGRheXNQZXJZZWFyKHRzLnJlZk1vbnRoKS9kYXlzUGVyTW9udGgodHMucmVmTW9udGgpLCBkaWdpdHMpO1xuXHRcdGlmICghZnJhYykgeyByZXR1cm47IH1cblxuXHRcdGZyYWMgPSBmcmFjdGlvbih0cywgZnJhYywgJ3llYXJzJywgJ2RlY2FkZXMnLCBZRUFSU19QRVJfREVDQURFLCBkaWdpdHMpO1xuXHRcdGlmICghZnJhYykgeyByZXR1cm47IH1cblxuXHRcdGZyYWMgPSBmcmFjdGlvbih0cywgZnJhYywgJ2RlY2FkZXMnLCAnY2VudHVyaWVzJywgREVDQURFU19QRVJfQ0VOVFVSWSwgZGlnaXRzKTtcblx0XHRpZiAoIWZyYWMpIHsgcmV0dXJuOyB9XG5cblx0XHRmcmFjID0gZnJhY3Rpb24odHMsIGZyYWMsICdjZW50dXJpZXMnLCAnbWlsbGVubmlhJywgQ0VOVFVSSUVTX1BFUl9NSUxMRU5OSVVNLCBkaWdpdHMpO1xuXG5cdFx0Ly8gc2hvdWxkIG5ldmVyIHJlYWNoIHRoaXMgd2l0aCByZW1haW5pbmcgZnJhY3Rpb25hbCB2YWx1ZVxuXHRcdGlmIChmcmFjKSB7IHRocm93IG5ldyBFcnJvcignRnJhY3Rpb25hbCB1bml0IG92ZXJmbG93Jyk7IH1cblx0fVxuXG5cdC8qKlxuXHQgKiBCb3Jyb3cgYW55IHVuZGVyZmxvdyB1bml0cywgY2FycnkgYW55IG92ZXJmbG93IHVuaXRzXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKi9cblx0ZnVuY3Rpb24gcmlwcGxlKHRzKSB7XG5cdFx0dmFyIHg7XG5cblx0XHRpZiAodHMubWlsbGlzZWNvbmRzIDwgMCkge1xuXHRcdFx0Ly8gcmlwcGxlIHNlY29uZHMgZG93biB0byBtaWxsaXNlY29uZHNcblx0XHRcdHggPSBjZWlsKC10cy5taWxsaXNlY29uZHMgLyBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCk7XG5cdFx0XHR0cy5zZWNvbmRzIC09IHg7XG5cdFx0XHR0cy5taWxsaXNlY29uZHMgKz0geCAqIE1JTExJU0VDT05EU19QRVJfU0VDT05EO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5taWxsaXNlY29uZHMgPj0gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQpIHtcblx0XHRcdC8vIHJpcHBsZSBtaWxsaXNlY29uZHMgdXAgdG8gc2Vjb25kc1xuXHRcdFx0dHMuc2Vjb25kcyArPSBmbG9vcih0cy5taWxsaXNlY29uZHMgLyBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCk7XG5cdFx0XHR0cy5taWxsaXNlY29uZHMgJT0gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQ7XG5cdFx0fVxuXG5cdFx0aWYgKHRzLnNlY29uZHMgPCAwKSB7XG5cdFx0XHQvLyByaXBwbGUgbWludXRlcyBkb3duIHRvIHNlY29uZHNcblx0XHRcdHggPSBjZWlsKC10cy5zZWNvbmRzIC8gU0VDT05EU19QRVJfTUlOVVRFKTtcblx0XHRcdHRzLm1pbnV0ZXMgLT0geDtcblx0XHRcdHRzLnNlY29uZHMgKz0geCAqIFNFQ09ORFNfUEVSX01JTlVURTtcblxuXHRcdH0gZWxzZSBpZiAodHMuc2Vjb25kcyA+PSBTRUNPTkRTX1BFUl9NSU5VVEUpIHtcblx0XHRcdC8vIHJpcHBsZSBzZWNvbmRzIHVwIHRvIG1pbnV0ZXNcblx0XHRcdHRzLm1pbnV0ZXMgKz0gZmxvb3IodHMuc2Vjb25kcyAvIFNFQ09ORFNfUEVSX01JTlVURSk7XG5cdFx0XHR0cy5zZWNvbmRzICU9IFNFQ09ORFNfUEVSX01JTlVURTtcblx0XHR9XG5cblx0XHRpZiAodHMubWludXRlcyA8IDApIHtcblx0XHRcdC8vIHJpcHBsZSBob3VycyBkb3duIHRvIG1pbnV0ZXNcblx0XHRcdHggPSBjZWlsKC10cy5taW51dGVzIC8gTUlOVVRFU19QRVJfSE9VUik7XG5cdFx0XHR0cy5ob3VycyAtPSB4O1xuXHRcdFx0dHMubWludXRlcyArPSB4ICogTUlOVVRFU19QRVJfSE9VUjtcblxuXHRcdH0gZWxzZSBpZiAodHMubWludXRlcyA+PSBNSU5VVEVTX1BFUl9IT1VSKSB7XG5cdFx0XHQvLyByaXBwbGUgbWludXRlcyB1cCB0byBob3Vyc1xuXHRcdFx0dHMuaG91cnMgKz0gZmxvb3IodHMubWludXRlcyAvIE1JTlVURVNfUEVSX0hPVVIpO1xuXHRcdFx0dHMubWludXRlcyAlPSBNSU5VVEVTX1BFUl9IT1VSO1xuXHRcdH1cblxuXHRcdGlmICh0cy5ob3VycyA8IDApIHtcblx0XHRcdC8vIHJpcHBsZSBkYXlzIGRvd24gdG8gaG91cnNcblx0XHRcdHggPSBjZWlsKC10cy5ob3VycyAvIEhPVVJTX1BFUl9EQVkpO1xuXHRcdFx0dHMuZGF5cyAtPSB4O1xuXHRcdFx0dHMuaG91cnMgKz0geCAqIEhPVVJTX1BFUl9EQVk7XG5cblx0XHR9IGVsc2UgaWYgKHRzLmhvdXJzID49IEhPVVJTX1BFUl9EQVkpIHtcblx0XHRcdC8vIHJpcHBsZSBob3VycyB1cCB0byBkYXlzXG5cdFx0XHR0cy5kYXlzICs9IGZsb29yKHRzLmhvdXJzIC8gSE9VUlNfUEVSX0RBWSk7XG5cdFx0XHR0cy5ob3VycyAlPSBIT1VSU19QRVJfREFZO1xuXHRcdH1cblxuXHRcdHdoaWxlICh0cy5kYXlzIDwgMCkge1xuXHRcdFx0Ly8gTk9URTogbmV2ZXIgYWN0dWFsbHkgc2VlbiB0aGlzIGxvb3AgbW9yZSB0aGFuIG9uY2VcblxuXHRcdFx0Ly8gcmlwcGxlIG1vbnRocyBkb3duIHRvIGRheXNcblx0XHRcdHRzLm1vbnRocy0tO1xuXHRcdFx0dHMuZGF5cyArPSBib3Jyb3dNb250aHModHMucmVmTW9udGgsIDEpO1xuXHRcdH1cblxuXHRcdC8vIHdlZWtzIGlzIGFsd2F5cyB6ZXJvIGhlcmVcblxuXHRcdGlmICh0cy5kYXlzID49IERBWVNfUEVSX1dFRUspIHtcblx0XHRcdC8vIHJpcHBsZSBkYXlzIHVwIHRvIHdlZWtzXG5cdFx0XHR0cy53ZWVrcyArPSBmbG9vcih0cy5kYXlzIC8gREFZU19QRVJfV0VFSyk7XG5cdFx0XHR0cy5kYXlzICU9IERBWVNfUEVSX1dFRUs7XG5cdFx0fVxuXG5cdFx0aWYgKHRzLm1vbnRocyA8IDApIHtcblx0XHRcdC8vIHJpcHBsZSB5ZWFycyBkb3duIHRvIG1vbnRoc1xuXHRcdFx0eCA9IGNlaWwoLXRzLm1vbnRocyAvIE1PTlRIU19QRVJfWUVBUik7XG5cdFx0XHR0cy55ZWFycyAtPSB4O1xuXHRcdFx0dHMubW9udGhzICs9IHggKiBNT05USFNfUEVSX1lFQVI7XG5cblx0XHR9IGVsc2UgaWYgKHRzLm1vbnRocyA+PSBNT05USFNfUEVSX1lFQVIpIHtcblx0XHRcdC8vIHJpcHBsZSBtb250aHMgdXAgdG8geWVhcnNcblx0XHRcdHRzLnllYXJzICs9IGZsb29yKHRzLm1vbnRocyAvIE1PTlRIU19QRVJfWUVBUik7XG5cdFx0XHR0cy5tb250aHMgJT0gTU9OVEhTX1BFUl9ZRUFSO1xuXHRcdH1cblxuXHRcdC8vIHllYXJzIGlzIGFsd2F5cyBub24tbmVnYXRpdmUgaGVyZVxuXHRcdC8vIGRlY2FkZXMsIGNlbnR1cmllcyBhbmQgbWlsbGVubmlhIGFyZSBhbHdheXMgemVybyBoZXJlXG5cblx0XHRpZiAodHMueWVhcnMgPj0gWUVBUlNfUEVSX0RFQ0FERSkge1xuXHRcdFx0Ly8gcmlwcGxlIHllYXJzIHVwIHRvIGRlY2FkZXNcblx0XHRcdHRzLmRlY2FkZXMgKz0gZmxvb3IodHMueWVhcnMgLyBZRUFSU19QRVJfREVDQURFKTtcblx0XHRcdHRzLnllYXJzICU9IFlFQVJTX1BFUl9ERUNBREU7XG5cblx0XHRcdGlmICh0cy5kZWNhZGVzID49IERFQ0FERVNfUEVSX0NFTlRVUlkpIHtcblx0XHRcdFx0Ly8gcmlwcGxlIGRlY2FkZXMgdXAgdG8gY2VudHVyaWVzXG5cdFx0XHRcdHRzLmNlbnR1cmllcyArPSBmbG9vcih0cy5kZWNhZGVzIC8gREVDQURFU19QRVJfQ0VOVFVSWSk7XG5cdFx0XHRcdHRzLmRlY2FkZXMgJT0gREVDQURFU19QRVJfQ0VOVFVSWTtcblxuXHRcdFx0XHRpZiAodHMuY2VudHVyaWVzID49IENFTlRVUklFU19QRVJfTUlMTEVOTklVTSkge1xuXHRcdFx0XHRcdC8vIHJpcHBsZSBjZW50dXJpZXMgdXAgdG8gbWlsbGVubmlhXG5cdFx0XHRcdFx0dHMubWlsbGVubmlhICs9IGZsb29yKHRzLmNlbnR1cmllcyAvIENFTlRVUklFU19QRVJfTUlMTEVOTklVTSk7XG5cdFx0XHRcdFx0dHMuY2VudHVyaWVzICU9IENFTlRVUklFU19QRVJfTUlMTEVOTklVTTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmUgYW55IHVuaXRzIG5vdCByZXF1ZXN0ZWRcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7VGltZXNwYW59IHRzXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB1bml0cyB0aGUgdW5pdHMgdG8gcG9wdWxhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IG1heCBudW1iZXIgb2YgbGFiZWxzIHRvIG91dHB1dFxuXHQgKiBAcGFyYW0ge251bWJlcn0gZGlnaXRzIG1heCBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgdG8gb3V0cHV0XG5cdCAqL1xuXHRmdW5jdGlvbiBwcnVuZVVuaXRzKHRzLCB1bml0cywgbWF4LCBkaWdpdHMpIHtcblx0XHR2YXIgY291bnQgPSAwO1xuXG5cdFx0Ly8gQ2FsYyBmcm9tIGxhcmdlc3QgdW5pdCB0byBzbWFsbGVzdCB0byBwcmV2ZW50IHVuZGVyZmxvd1xuXHRcdGlmICghKHVuaXRzICYgTUlMTEVOTklBKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIG1pbGxlbm5pYSBkb3duIHRvIGNlbnR1cmllc1xuXHRcdFx0dHMuY2VudHVyaWVzICs9IHRzLm1pbGxlbm5pYSAqIENFTlRVUklFU19QRVJfTUlMTEVOTklVTTtcblx0XHRcdGRlbGV0ZSB0cy5taWxsZW5uaWE7XG5cblx0XHR9IGVsc2UgaWYgKHRzLm1pbGxlbm5pYSkge1xuXHRcdFx0Y291bnQrKztcblx0XHR9XG5cblx0XHRpZiAoISh1bml0cyAmIENFTlRVUklFUykgfHwgKGNvdW50ID49IG1heCkpIHtcblx0XHRcdC8vIHJpcHBsZSBjZW50dXJpZXMgZG93biB0byBkZWNhZGVzXG5cdFx0XHR0cy5kZWNhZGVzICs9IHRzLmNlbnR1cmllcyAqIERFQ0FERVNfUEVSX0NFTlRVUlk7XG5cdFx0XHRkZWxldGUgdHMuY2VudHVyaWVzO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5jZW50dXJpZXMpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXG5cdFx0aWYgKCEodW5pdHMgJiBERUNBREVTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIGRlY2FkZXMgZG93biB0byB5ZWFyc1xuXHRcdFx0dHMueWVhcnMgKz0gdHMuZGVjYWRlcyAqIFlFQVJTX1BFUl9ERUNBREU7XG5cdFx0XHRkZWxldGUgdHMuZGVjYWRlcztcblxuXHRcdH0gZWxzZSBpZiAodHMuZGVjYWRlcykge1xuXHRcdFx0Y291bnQrKztcblx0XHR9XG5cblx0XHRpZiAoISh1bml0cyAmIFlFQVJTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIHllYXJzIGRvd24gdG8gbW9udGhzXG5cdFx0XHR0cy5tb250aHMgKz0gdHMueWVhcnMgKiBNT05USFNfUEVSX1lFQVI7XG5cdFx0XHRkZWxldGUgdHMueWVhcnM7XG5cblx0XHR9IGVsc2UgaWYgKHRzLnllYXJzKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdGlmICghKHVuaXRzICYgTU9OVEhTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIG1vbnRocyBkb3duIHRvIGRheXNcblx0XHRcdGlmICh0cy5tb250aHMpIHtcblx0XHRcdFx0dHMuZGF5cyArPSBib3Jyb3dNb250aHModHMucmVmTW9udGgsIHRzLm1vbnRocyk7XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgdHMubW9udGhzO1xuXG5cdFx0XHRpZiAodHMuZGF5cyA+PSBEQVlTX1BFUl9XRUVLKSB7XG5cdFx0XHRcdC8vIHJpcHBsZSBkYXkgb3ZlcmZsb3cgYmFjayB1cCB0byB3ZWVrc1xuXHRcdFx0XHR0cy53ZWVrcyArPSBmbG9vcih0cy5kYXlzIC8gREFZU19QRVJfV0VFSyk7XG5cdFx0XHRcdHRzLmRheXMgJT0gREFZU19QRVJfV0VFSztcblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZiAodHMubW9udGhzKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdGlmICghKHVuaXRzICYgV0VFS1MpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgd2Vla3MgZG93biB0byBkYXlzXG5cdFx0XHR0cy5kYXlzICs9IHRzLndlZWtzICogREFZU19QRVJfV0VFSztcblx0XHRcdGRlbGV0ZSB0cy53ZWVrcztcblxuXHRcdH0gZWxzZSBpZiAodHMud2Vla3MpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXG5cdFx0aWYgKCEodW5pdHMgJiBEQVlTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly9yaXBwbGUgZGF5cyBkb3duIHRvIGhvdXJzXG5cdFx0XHR0cy5ob3VycyArPSB0cy5kYXlzICogSE9VUlNfUEVSX0RBWTtcblx0XHRcdGRlbGV0ZSB0cy5kYXlzO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5kYXlzKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdGlmICghKHVuaXRzICYgSE9VUlMpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgaG91cnMgZG93biB0byBtaW51dGVzXG5cdFx0XHR0cy5taW51dGVzICs9IHRzLmhvdXJzICogTUlOVVRFU19QRVJfSE9VUjtcblx0XHRcdGRlbGV0ZSB0cy5ob3VycztcblxuXHRcdH0gZWxzZSBpZiAodHMuaG91cnMpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXG5cdFx0aWYgKCEodW5pdHMgJiBNSU5VVEVTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIG1pbnV0ZXMgZG93biB0byBzZWNvbmRzXG5cdFx0XHR0cy5zZWNvbmRzICs9IHRzLm1pbnV0ZXMgKiBTRUNPTkRTX1BFUl9NSU5VVEU7XG5cdFx0XHRkZWxldGUgdHMubWludXRlcztcblxuXHRcdH0gZWxzZSBpZiAodHMubWludXRlcykge1xuXHRcdFx0Y291bnQrKztcblx0XHR9XG5cblx0XHRpZiAoISh1bml0cyAmIFNFQ09ORFMpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgc2Vjb25kcyBkb3duIHRvIG1pbGxpc2Vjb25kc1xuXHRcdFx0dHMubWlsbGlzZWNvbmRzICs9IHRzLnNlY29uZHMgKiBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORDtcblx0XHRcdGRlbGV0ZSB0cy5zZWNvbmRzO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5zZWNvbmRzKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdC8vIG5vdGhpbmcgdG8gcmlwcGxlIG1pbGxpc2Vjb25kcyBkb3duIHRvXG5cdFx0Ly8gc28gcmlwcGxlIGJhY2sgdXAgdG8gc21hbGxlc3QgZXhpc3RpbmcgdW5pdCBhcyBhIGZyYWN0aW9uYWwgdmFsdWVcblx0XHRpZiAoISh1bml0cyAmIE1JTExJU0VDT05EUykgfHwgKGNvdW50ID49IG1heCkpIHtcblx0XHRcdGZyYWN0aW9uYWwodHMsIGRpZ2l0cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFBvcHVsYXRlcyB0aGUgVGltZXNwYW4gb2JqZWN0XG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKiBAcGFyYW0gez9EYXRlfSBzdGFydCB0aGUgc3RhcnRpbmcgZGF0ZVxuXHQgKiBAcGFyYW0gez9EYXRlfSBlbmQgdGhlIGVuZGluZyBkYXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB1bml0cyB0aGUgdW5pdHMgdG8gcG9wdWxhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IG1heCBudW1iZXIgb2YgbGFiZWxzIHRvIG91dHB1dFxuXHQgKiBAcGFyYW0ge251bWJlcn0gZGlnaXRzIG1heCBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgdG8gb3V0cHV0XG5cdCAqL1xuXHRmdW5jdGlvbiBwb3B1bGF0ZSh0cywgc3RhcnQsIGVuZCwgdW5pdHMsIG1heCwgZGlnaXRzKSB7XG5cdFx0dmFyIG5vdyA9IG5ldyBEYXRlKCk7XG5cblx0XHR0cy5zdGFydCA9IHN0YXJ0ID0gc3RhcnQgfHwgbm93O1xuXHRcdHRzLmVuZCA9IGVuZCA9IGVuZCB8fCBub3c7XG5cdFx0dHMudW5pdHMgPSB1bml0cztcblxuXHRcdHRzLnZhbHVlID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcblx0XHRpZiAodHMudmFsdWUgPCAwKSB7XG5cdFx0XHQvLyBzd2FwIGlmIHJldmVyc2VkXG5cdFx0XHR2YXIgdG1wID0gZW5kO1xuXHRcdFx0ZW5kID0gc3RhcnQ7XG5cdFx0XHRzdGFydCA9IHRtcDtcblx0XHR9XG5cblx0XHQvLyByZWZlcmVuY2UgbW9udGggZm9yIGRldGVybWluaW5nIGRheXMgaW4gbW9udGhcblx0XHR0cy5yZWZNb250aCA9IG5ldyBEYXRlKHN0YXJ0LmdldEZ1bGxZZWFyKCksIHN0YXJ0LmdldE1vbnRoKCksIDE1LCAxMiwgMCwgMCk7XG5cdFx0dHJ5IHtcblx0XHRcdC8vIHJlc2V0IHRvIGluaXRpYWwgZGVsdGFzXG5cdFx0XHR0cy5taWxsZW5uaWEgPSAwO1xuXHRcdFx0dHMuY2VudHVyaWVzID0gMDtcblx0XHRcdHRzLmRlY2FkZXMgPSAwO1xuXHRcdFx0dHMueWVhcnMgPSBlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCk7XG5cdFx0XHR0cy5tb250aHMgPSBlbmQuZ2V0TW9udGgoKSAtIHN0YXJ0LmdldE1vbnRoKCk7XG5cdFx0XHR0cy53ZWVrcyA9IDA7XG5cdFx0XHR0cy5kYXlzID0gZW5kLmdldERhdGUoKSAtIHN0YXJ0LmdldERhdGUoKTtcblx0XHRcdHRzLmhvdXJzID0gZW5kLmdldEhvdXJzKCkgLSBzdGFydC5nZXRIb3VycygpO1xuXHRcdFx0dHMubWludXRlcyA9IGVuZC5nZXRNaW51dGVzKCkgLSBzdGFydC5nZXRNaW51dGVzKCk7XG5cdFx0XHR0cy5zZWNvbmRzID0gZW5kLmdldFNlY29uZHMoKSAtIHN0YXJ0LmdldFNlY29uZHMoKTtcblx0XHRcdHRzLm1pbGxpc2Vjb25kcyA9IGVuZC5nZXRNaWxsaXNlY29uZHMoKSAtIHN0YXJ0LmdldE1pbGxpc2Vjb25kcygpO1xuXG5cdFx0XHRyaXBwbGUodHMpO1xuXHRcdFx0cHJ1bmVVbml0cyh0cywgdW5pdHMsIG1heCwgZGlnaXRzKTtcblxuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRkZWxldGUgdHMucmVmTW9udGg7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIERldGVybWluZSBhbiBhcHByb3ByaWF0ZSByZWZyZXNoIHJhdGUgYmFzZWQgdXBvbiB1bml0c1xuXHQgKiBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHVuaXRzIHRoZSB1bml0cyB0byBwb3B1bGF0ZVxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9IG1pbGxpc2Vjb25kcyB0byBkZWxheVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RGVsYXkodW5pdHMpIHtcblx0XHRpZiAodW5pdHMgJiBNSUxMSVNFQ09ORFMpIHtcblx0XHRcdC8vIHJlZnJlc2ggdmVyeSBxdWlja2x5XG5cdFx0XHRyZXR1cm4gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQgLyAzMDsgLy8zMEh6XG5cdFx0fVxuXG5cdFx0aWYgKHVuaXRzICYgU0VDT05EUykge1xuXHRcdFx0Ly8gcmVmcmVzaCBldmVyeSBzZWNvbmRcblx0XHRcdHJldHVybiBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORDsgLy8xSHpcblx0XHR9XG5cblx0XHRpZiAodW5pdHMgJiBNSU5VVEVTKSB7XG5cdFx0XHQvLyByZWZyZXNoIGV2ZXJ5IG1pbnV0ZVxuXHRcdFx0cmV0dXJuIE1JTExJU0VDT05EU19QRVJfU0VDT05EICogU0VDT05EU19QRVJfTUlOVVRFO1xuXHRcdH1cblxuXHRcdGlmICh1bml0cyAmIEhPVVJTKSB7XG5cdFx0XHQvLyByZWZyZXNoIGhvdXJseVxuXHRcdFx0cmV0dXJuIE1JTExJU0VDT05EU19QRVJfU0VDT05EICogU0VDT05EU19QRVJfTUlOVVRFICogTUlOVVRFU19QRVJfSE9VUjtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKHVuaXRzICYgREFZUykge1xuXHRcdFx0Ly8gcmVmcmVzaCBkYWlseVxuXHRcdFx0cmV0dXJuIE1JTExJU0VDT05EU19QRVJfU0VDT05EICogU0VDT05EU19QRVJfTUlOVVRFICogTUlOVVRFU19QRVJfSE9VUiAqIEhPVVJTX1BFUl9EQVk7XG5cdFx0fVxuXG5cdFx0Ly8gcmVmcmVzaCB0aGUgcmVzdCB3ZWVrbHlcblx0XHRyZXR1cm4gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQgKiBTRUNPTkRTX1BFUl9NSU5VVEUgKiBNSU5VVEVTX1BFUl9IT1VSICogSE9VUlNfUEVSX0RBWSAqIERBWVNfUEVSX1dFRUs7XG5cdH1cblxuXHQvKipcblx0ICogQVBJIGVudHJ5IHBvaW50XG5cdCAqIFxuXHQgKiBAcHVibGljXG5cdCAqIEBwYXJhbSB7RGF0ZXxudW1iZXJ8VGltZXNwYW58bnVsbHxmdW5jdGlvbihUaW1lc3BhbixudW1iZXIpfSBzdGFydCB0aGUgc3RhcnRpbmcgZGF0ZVxuXHQgKiBAcGFyYW0ge0RhdGV8bnVtYmVyfFRpbWVzcGFufG51bGx8ZnVuY3Rpb24oVGltZXNwYW4sbnVtYmVyKX0gZW5kIHRoZSBlbmRpbmcgZGF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcj19IHVuaXRzIHRoZSB1bml0cyB0byBwb3B1bGF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcj19IG1heCBudW1iZXIgb2YgbGFiZWxzIHRvIG91dHB1dFxuXHQgKiBAcGFyYW0ge251bWJlcj19IGRpZ2l0cyBtYXggbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIHRvIG91dHB1dFxuXHQgKiBAcmV0dXJuIHtUaW1lc3BhbnxudW1iZXJ9XG5cdCAqL1xuXHRmdW5jdGlvbiBjb3VudGRvd24oc3RhcnQsIGVuZCwgdW5pdHMsIG1heCwgZGlnaXRzKSB7XG5cdFx0dmFyIGNhbGxiYWNrO1xuXG5cdFx0Ly8gZW5zdXJlIHNvbWUgdW5pdHMgb3IgdXNlIGRlZmF1bHRzXG5cdFx0dW5pdHMgPSArdW5pdHMgfHwgREVGQVVMVFM7XG5cdFx0Ly8gbWF4IG11c3QgYmUgcG9zaXRpdmVcblx0XHRtYXggPSAobWF4ID4gMCkgPyBtYXggOiBOYU47XG5cdFx0Ly8gY2xhbXAgZGlnaXRzIHRvIGFuIGludGVnZXIgYmV0d2VlbiBbMCwgMjBdXG5cdFx0ZGlnaXRzID0gKGRpZ2l0cyA+IDApID8gKGRpZ2l0cyA8IDIwKSA/IE1hdGgucm91bmQoZGlnaXRzKSA6IDIwIDogMDtcblxuXHRcdC8vIGVuc3VyZSBzdGFydCBkYXRlXG5cdFx0dmFyIHN0YXJ0VFMgPSBudWxsO1xuXHRcdGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2Ygc3RhcnQpIHtcblx0XHRcdGNhbGxiYWNrID0gc3RhcnQ7XG5cdFx0XHRzdGFydCA9IG51bGw7XG5cblx0XHR9IGVsc2UgaWYgKCEoc3RhcnQgaW5zdGFuY2VvZiBEYXRlKSkge1xuXHRcdFx0aWYgKChzdGFydCAhPT0gbnVsbCkgJiYgaXNGaW5pdGUoc3RhcnQpKSB7XG5cdFx0XHRcdHN0YXJ0ID0gbmV3IERhdGUoK3N0YXJ0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICgnb2JqZWN0JyA9PT0gdHlwZW9mIHN0YXJ0VFMpIHtcblx0XHRcdFx0XHRzdGFydFRTID0gLyoqIEB0eXBle1RpbWVzcGFufSAqLyhzdGFydCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RhcnQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGVuc3VyZSBlbmQgZGF0ZVxuXHRcdHZhciBlbmRUUyA9IG51bGw7XG5cdFx0aWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBlbmQpIHtcblx0XHRcdGNhbGxiYWNrID0gZW5kO1xuXHRcdFx0ZW5kID0gbnVsbDtcblxuXHRcdH0gZWxzZSBpZiAoIShlbmQgaW5zdGFuY2VvZiBEYXRlKSkge1xuXHRcdFx0aWYgKChlbmQgIT09IG51bGwpICYmIGlzRmluaXRlKGVuZCkpIHtcblx0XHRcdFx0ZW5kID0gbmV3IERhdGUoK2VuZCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBlbmQpIHtcblx0XHRcdFx0XHRlbmRUUyA9IC8qKiBAdHlwZXtUaW1lc3Bhbn0gKi8oZW5kKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbmQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIG11c3Qgd2FpdCB0byBpbnRlcnByZXQgdGltZXNwYW5zIHVudGlsIGFmdGVyIHJlc29sdmluZyBkYXRlc1xuXHRcdGlmIChzdGFydFRTKSB7XG5cdFx0XHRzdGFydCA9IGFkZFRvRGF0ZShzdGFydFRTLCBlbmQpO1xuXHRcdH1cblx0XHRpZiAoZW5kVFMpIHtcblx0XHRcdGVuZCA9IGFkZFRvRGF0ZShlbmRUUywgc3RhcnQpO1xuXHRcdH1cblxuXHRcdGlmICghc3RhcnQgJiYgIWVuZCkge1xuXHRcdFx0Ly8gdXNlZCBmb3IgdW5pdCB0ZXN0aW5nXG5cdFx0XHRyZXR1cm4gbmV3IFRpbWVzcGFuKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCFjYWxsYmFjaykge1xuXHRcdFx0cmV0dXJuIHBvcHVsYXRlKG5ldyBUaW1lc3BhbigpLCAvKiogQHR5cGV7RGF0ZX0gKi8oc3RhcnQpLCAvKiogQHR5cGV7RGF0ZX0gKi8oZW5kKSwgLyoqIEB0eXBle251bWJlcn0gKi8odW5pdHMpLCAvKiogQHR5cGV7bnVtYmVyfSAqLyhtYXgpLCAvKiogQHR5cGV7bnVtYmVyfSAqLyhkaWdpdHMpKTtcblx0XHR9XG5cblx0XHQvLyBiYXNlIGRlbGF5IG9mZiB1bml0c1xuXHRcdHZhciBkZWxheSA9IGdldERlbGF5KHVuaXRzKSxcblx0XHRcdHRpbWVySWQsXG5cdFx0XHRmbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjYWxsYmFjayhcblx0XHRcdFx0XHRwb3B1bGF0ZShuZXcgVGltZXNwYW4oKSwgLyoqIEB0eXBle0RhdGV9ICovKHN0YXJ0KSwgLyoqIEB0eXBle0RhdGV9ICovKGVuZCksIC8qKiBAdHlwZXtudW1iZXJ9ICovKHVuaXRzKSwgLyoqIEB0eXBle251bWJlcn0gKi8obWF4KSwgLyoqIEB0eXBle251bWJlcn0gKi8oZGlnaXRzKSksXG5cdFx0XHRcdFx0dGltZXJJZFxuXHRcdFx0XHQpO1xuXHRcdFx0fTtcblxuXHRcdGZuKCk7XG5cdFx0cmV0dXJuICh0aW1lcklkID0gc2V0SW50ZXJ2YWwoZm4sIGRlbGF5KSk7XG5cdH1cblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5NSUxMSVNFQ09ORFMgPSBNSUxMSVNFQ09ORFM7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uU0VDT05EUyA9IFNFQ09ORFM7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uTUlOVVRFUyA9IE1JTlVURVM7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uSE9VUlMgPSBIT1VSUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5EQVlTID0gREFZUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5XRUVLUyA9IFdFRUtTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLk1PTlRIUyA9IE1PTlRIUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5ZRUFSUyA9IFlFQVJTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLkRFQ0FERVMgPSBERUNBREVTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLkNFTlRVUklFUyA9IENFTlRVUklFUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5NSUxMRU5OSUEgPSBNSUxMRU5OSUE7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uREVGQVVMVFMgPSBERUZBVUxUUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5BTEwgPSBNSUxMRU5OSUF8Q0VOVFVSSUVTfERFQ0FERVN8WUVBUlN8TU9OVEhTfFdFRUtTfERBWVN8SE9VUlN8TUlOVVRFU3xTRUNPTkRTfE1JTExJU0VDT05EUztcblxuXHQvKipcblx0ICogQ3VzdG9taXplIHRoZSBmb3JtYXQgc2V0dGluZ3MuXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtPYmplY3R9IGZvcm1hdCBzZXR0aW5ncyBvYmplY3Rcblx0ICovXG5cdHZhciBzZXRGb3JtYXQgPSBjb3VudGRvd24uc2V0Rm9ybWF0ID0gZnVuY3Rpb24oZm9ybWF0KSB7XG5cdFx0aWYgKCFmb3JtYXQpIHsgcmV0dXJuOyB9XG5cblx0XHRpZiAoJ3Npbmd1bGFyJyBpbiBmb3JtYXQgfHwgJ3BsdXJhbCcgaW4gZm9ybWF0KSB7XG5cdFx0XHR2YXIgc2luZ3VsYXIgPSBmb3JtYXQuc2luZ3VsYXIgfHwgW107XG5cdFx0XHRpZiAoc2luZ3VsYXIuc3BsaXQpIHtcblx0XHRcdFx0c2luZ3VsYXIgPSBzaW5ndWxhci5zcGxpdCgnfCcpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHBsdXJhbCA9IGZvcm1hdC5wbHVyYWwgfHwgW107XG5cdFx0XHRpZiAocGx1cmFsLnNwbGl0KSB7XG5cdFx0XHRcdHBsdXJhbCA9IHBsdXJhbC5zcGxpdCgnfCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKHZhciBpPUxBQkVMX01JTExJU0VDT05EUzsgaTw9TEFCRUxfTUlMTEVOTklBOyBpKyspIHtcblx0XHRcdFx0Ly8gb3ZlcnJpZGUgYW55IHNwZWNpZmllZCB1bml0c1xuXHRcdFx0XHRMQUJFTFNfU0lOR0xVQVJbaV0gPSBzaW5ndWxhcltpXSB8fCBMQUJFTFNfU0lOR0xVQVJbaV07XG5cdFx0XHRcdExBQkVMU19QTFVSQUxbaV0gPSBwbHVyYWxbaV0gfHwgTEFCRUxTX1BMVVJBTFtpXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmb3JtYXQubGFzdCkge1xuXHRcdFx0TEFCRUxfTEFTVCA9IGZvcm1hdC5sYXN0O1xuXHRcdH1cblx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmb3JtYXQuZGVsaW0pIHtcblx0XHRcdExBQkVMX0RFTElNID0gZm9ybWF0LmRlbGltO1xuXHRcdH1cblx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmb3JtYXQuZW1wdHkpIHtcblx0XHRcdExBQkVMX05PVyA9IGZvcm1hdC5lbXB0eTtcblx0XHR9XG5cdFx0aWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBmb3JtYXQuZm9ybWF0TnVtYmVyKSB7XG5cdFx0XHRmb3JtYXROdW1iZXIgPSBmb3JtYXQuZm9ybWF0TnVtYmVyO1xuXHRcdH1cblx0XHRpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZvcm1hdC5mb3JtYXR0ZXIpIHtcblx0XHRcdGZvcm1hdHRlciA9IGZvcm1hdC5mb3JtYXR0ZXI7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXZlcnQgdG8gdGhlIGRlZmF1bHQgZm9ybWF0dGluZy5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0dmFyIHJlc2V0Rm9ybWF0ID0gY291bnRkb3duLnJlc2V0Rm9ybWF0ID0gZnVuY3Rpb24oKSB7XG5cdFx0TEFCRUxTX1NJTkdMVUFSID0gJyBtaWxsaXNlY29uZHwgc2Vjb25kfCBtaW51dGV8IGhvdXJ8IGRheXwgd2Vla3wgbW9udGh8IHllYXJ8IGRlY2FkZXwgY2VudHVyeXwgbWlsbGVubml1bScuc3BsaXQoJ3wnKTtcblx0XHRMQUJFTFNfUExVUkFMID0gJyBtaWxsaXNlY29uZHN8IHNlY29uZHN8IG1pbnV0ZXN8IGhvdXJzfCBkYXlzfCB3ZWVrc3wgbW9udGhzfCB5ZWFyc3wgZGVjYWRlc3wgY2VudHVyaWVzfCBtaWxsZW5uaWEnLnNwbGl0KCd8Jyk7XG5cdFx0TEFCRUxfTEFTVCA9ICcgYW5kICc7XG5cdFx0TEFCRUxfREVMSU0gPSAnLCAnO1xuXHRcdExBQkVMX05PVyA9ICcnO1xuXHRcdGZvcm1hdE51bWJlciA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblx0XHRmb3JtYXR0ZXIgPSBwbHVyYWxpdHk7XG5cdH07XG5cblx0LyoqXG5cdCAqIE92ZXJyaWRlIHRoZSB1bml0IGxhYmVscy5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge3N0cmluZ3xBcnJheT19IHNpbmd1bGFyIGEgcGlwZSAoJ3wnKSBkZWxpbWl0ZWQgbGlzdCBvZiBzaW5ndWxhciB1bml0IG5hbWUgb3ZlcnJpZGVzXG5cdCAqIEBwYXJhbSB7c3RyaW5nfEFycmF5PX0gcGx1cmFsIGEgcGlwZSAoJ3wnKSBkZWxpbWl0ZWQgbGlzdCBvZiBwbHVyYWwgdW5pdCBuYW1lIG92ZXJyaWRlc1xuXHQgKiBAcGFyYW0ge3N0cmluZz19IGxhc3QgYSBkZWxpbWl0ZXIgYmVmb3JlIHRoZSBsYXN0IHVuaXQgKGRlZmF1bHQ6ICcgYW5kICcpXG5cdCAqIEBwYXJhbSB7c3RyaW5nPX0gZGVsaW0gYSBkZWxpbWl0ZXIgdG8gdXNlIGJldHdlZW4gYWxsIG90aGVyIHVuaXRzIChkZWZhdWx0OiAnLCAnKVxuXHQgKiBAcGFyYW0ge3N0cmluZz19IGVtcHR5IGEgbGFiZWwgdG8gdXNlIHdoZW4gYWxsIHVuaXRzIGFyZSB6ZXJvIChkZWZhdWx0OiAnJylcblx0ICogQHBhcmFtIHtmdW5jdGlvbihudW1iZXIpOnN0cmluZz19IGZvcm1hdE51bWJlciBhIGZ1bmN0aW9uIHdoaWNoIGZvcm1hdHMgbnVtYmVycyBhcyBhIHN0cmluZ1xuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uKG51bWJlcixudW1iZXIpOnN0cmluZz19IGZvcm1hdHRlciBhIGZ1bmN0aW9uIHdoaWNoIGZvcm1hdHMgYSBudW1iZXIvdW5pdCBwYWlyIGFzIGEgc3RyaW5nXG5cdCAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMi42LjBcblx0ICovXG5cdGNvdW50ZG93bi5zZXRMYWJlbHMgPSBmdW5jdGlvbihzaW5ndWxhciwgcGx1cmFsLCBsYXN0LCBkZWxpbSwgZW1wdHksIGZvcm1hdE51bWJlciwgZm9ybWF0dGVyKSB7XG5cdFx0c2V0Rm9ybWF0KHtcblx0XHRcdHNpbmd1bGFyOiBzaW5ndWxhcixcblx0XHRcdHBsdXJhbDogcGx1cmFsLFxuXHRcdFx0bGFzdDogbGFzdCxcblx0XHRcdGRlbGltOiBkZWxpbSxcblx0XHRcdGVtcHR5OiBlbXB0eSxcblx0XHRcdGZvcm1hdE51bWJlcjogZm9ybWF0TnVtYmVyLFxuXHRcdFx0Zm9ybWF0dGVyOiBmb3JtYXR0ZXJcblx0XHR9KTtcblx0fTtcblxuXHQvKipcblx0ICogUmV2ZXJ0IHRvIHRoZSBkZWZhdWx0IHVuaXQgbGFiZWxzLlxuXHQgKiBAcHVibGljXG5cdCAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMi42LjBcblx0ICovXG5cdGNvdW50ZG93bi5yZXNldExhYmVscyA9IHJlc2V0Rm9ybWF0O1xuXG5cdHJlc2V0Rm9ybWF0KCk7XG5cblx0aWYgKG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY291bnRkb3duO1xuXG5cdH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdy5kZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHdpbmRvdy5kZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuXHRcdHdpbmRvdy5kZWZpbmUoJ2NvdW50ZG93bicsIFtdLCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBjb3VudGRvd247XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gY291bnRkb3duO1xuXG59KShtb2R1bGUpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY291bnRkb3duL2NvdW50ZG93bi5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSA1Il0sInNvdXJjZVJvb3QiOiIifQ==