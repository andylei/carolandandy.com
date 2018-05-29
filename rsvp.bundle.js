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
/******/ 	return __webpack_require__(__webpack_require__.s = 33);
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

var	fixUrls = __webpack_require__(5);

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
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Fjalla+One|Roboto|Great+Vibes);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"MrsEaves\";\n  src: url(" + __webpack_require__(4) + ") format(\"truetype\");\n}\n\nbody {\n  margin: 0;\n}\n\n#nav {\n  margin-top: 1vh;\n  position: fixed;\n  top: 5px;\n  left: 10px;\n\n  height: 48px;\n  max-width: 48px;\n  overflow: hidden;\n\n  transition: max-width 700ms ease, background-color 100ms linear 700ms;\n  font-family: \"Fjalla One\", sans;\n  font-size: 14px;\n\n  z-index: 1000;\n}\n\n#nav button {\n  background: none !important;\n  color: black;\n  border: none;\n  padding: 0! important;\n  font: inherit;\n  cursor: pointer;\n  outline: inherit !important;\n\n  height: 48px;\n  width: 48px;\n\n  transition: transform .5s ease;\n  transform: rotate(0deg);\n}\n\n#nav.open {\n  background-color: rgba(255, 255, 255, 0.9);\n\n  max-width: 500px;\n  transition: max-width 700ms ease, background-color 200ms ease;\n}\n\n#nav.open button {\n  transition: transform .5s ease;\n  transform: rotate(90deg);\n}\n\n#links {\n  float: right;\n  line-height: 48px;\n}\n\n#links .separator {\n  border-right: 1px solid black;\n  margin-right: 10px;\n  height: 30px;\n}\n\n#nav a {\n  color: black;\n  text-decoration: none;\n  font-size: 1.5em;\n  \n  padding-right: 10px;\n}\n\n#nav a:last-child {\n  padding-right: 10px;\n}\n\n.hidden {\n  display: none !important;\n}\n\ninput[type=text].hidden {\n  display: none;\n}\n\n#nav:not(.open) {\n  animation: 10s linear 5s infinite normal pulseBackground;\n}\n\n@keyframes pulseBackground {\n  0% { background-color: rgba(255, 255, 255, 0); }\n  5% { background-color: rgba(255, 255, 255, .7); }\n  10% { background-color: rgba(255, 255, 255, 0); }\n  100% { background-color: rgba(255, 255, 255, 0); }\n}", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "4427f1ea50aefd7e8ae7bb8ec2b22398.ttf";

/***/ }),
/* 5 */
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
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_css__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_css__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rsvp_css__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rsvp_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__rsvp_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__nav__ = __webpack_require__(6);






let HOST;
if (true) {
  HOST = 'https://carol-and-andy.appspot.com';
} else {
  HOST = 'http://localhost:8080';
}

let LOADED_RESERVATION = null;

function test_init() {
  let name$ = document.getElementById('rsvp-name');
  name$.value = 'david lei';
  name$.dispatchEvent(new Event('input'));
  // document.getElementById('rsvp-ok').click();
}

function init() {
  bindRsvpSearchEvents();
  handleRsvpVisibility();
  Object(__WEBPACK_IMPORTED_MODULE_3__nav__["a" /* default */])();
  document.getElementById('rsvp-name').focus();
}

function showEle(ele, animateClass) {
  ele.classList.remove('hidden');
}

function show(id, animateClass) {
  showEle(document.getElementById(id), animateClass);
}

function hideEle(ele) {
  ele.classList.add('hidden');
}

function hide(id) {
  hideEle(document.getElementById(id));
}

function bindRsvpSearchEvents() {
  document.getElementById('rsvp-ok').addEventListener('click', handleRsvpSearch);
  document.getElementById('rsvp-name').addEventListener('input', handleRsvpVisibility)
}

function bindGuestEvents() {
  document
    .getElementById('your-email')
    .addEventListener('input', function(event) { handleGuestNameInput(event.target.form) });
  for (let input of document.querySelectorAll('.name > input[type=text]')) {
    input.addEventListener('input', function(event) { handleGuestNameInput(event.target.form) } );
  }
  for (let input of document.querySelectorAll('.coming input[type=radio]')) {
    input.addEventListener('input', function(event) { handleGuestNameInput(event.target.form) } );
  }
  for (let btn of document.querySelectorAll('.dietary > button')) {
    btn.addEventListener('click', handleDietaryExpansion);
  }
  document.querySelector('form#guests').addEventListener('submit', handleGuestSave);
}

function getFormData(form$) {
  let data = new FormData(form$);
  let result = {};
  for (let item of data) {
    result[item[0]] = item[1];
  }
  return result;
}

function isFormValid(form) {
  let res = LOADED_RESERVATION;
  if (!res) {
    return;
  }
  let formData = getFormData(form);
  let email = formData['your-email'];
  if (!email) {
    return false;
  }
  for (let guest of res.guests) {
    if (guest.name) {
      continue;
    }
    let coming = formData['coming-' + guest.id] === 'yes';
    let name = formData['name-' + guest.id];
    if (coming && !name) {
      return false;
    }
  }
  return true
}

function syncAcceptDecline(form$) {
  let res = LOADED_RESERVATION;
  if (!res) {
    return;
  }
  let formData = getFormData(form$);
  let anyNamedGuestsComing = false;
  for (let guest of res.guests) {
    let id = guest.id;
    document.getElementById(`guest-${id}`).classList.remove('hidden');
    let coming = formData[`coming-${id}`] === 'yes';
    if (guest.name && coming) {
      anyNamedGuestsComing = true;
    }
    let nameInput = document.querySelector(`input[name=name-${id}]`);
    if (nameInput) {
      if (coming) {
        nameInput.removeAttribute('disabled');
        nameInput.setAttribute('placeholder', 'Name of guest');
      } else {
        nameInput.setAttribute('disabled', 'disabled');
        nameInput.setAttribute('placeholder', 'Guest');
      }
    }
    let dinner$ = document.querySelector(`#guest-${id} .dinner`);
    if (coming) {
      dinner$.classList.remove('hidden');
    } else {
      dinner$.classList.add('hidden');
    }
  }
  if (!anyNamedGuestsComing) {
    // all unnamed guests should be hidden
    for (let guest of res.guests) {
      if (guest.name) {
        continue;
      }
      let id = guest.id;
      document.getElementById(`guest-${id}`).classList.add('hidden');
      document.getElementById(`coming-${id}-no`).checked = true;
    }
  }
}

function handleDietaryExpansion(e) {
  e.preventDefault();
  hideEle(e.target);
  showEle(e.target.nextElementSibling)
  e.target.nextElementSibling.focus();
}

function handleGuestNameInput(form$) {
  syncAcceptDecline(form$);
  let button = document.getElementById('guests-save');
  if (isFormValid(form$)) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', 'disabled');
  }
}

function handleGuestSave(event) {
  event.preventDefault();
  let res = LOADED_RESERVATION;
  if (!res) {
    return;
  }
  guestSaveLoading();
  let formData = getFormData(event.target);
  for (let guest of res.guests) {
    guest.coming = formData['coming-' + guest.id] === 'yes';
    let name = formData['name-' + guest.id];
    if (name) {
      guest.name = name;
    }
    guest.dinner = formData['dinner-' + guest.id] || null;
    guest.dietary = formData['dietary-' + guest.id] || null;
  }
  res.reservation.guests = res.guests;
  let xhr = new XMLHttpRequest();
  let url = `${HOST}/reservation/${res.reservation.id}`;
  xhr.open('PUT', url);
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = function() {
    guestSaveDoneLoading();
    if (xhr.status === 200) {
      showSuccess(res.guests);
    } else {
      showCatastrophicFailure();
    }
  }
  xhr.send(JSON.stringify(res));
}

function handleRsvpVisibility() {
  let name = document.getElementById('rsvp-name').value;
  let enabled = name && name.trim();
  let button = document.getElementById('rsvp-ok');
  if (enabled) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', 'disabled');
  }
}

function handleRsvpSearch() {
  hide('reservation-error');
  rsvpSearchLoading();
  let name = document.getElementById('rsvp-name').value;

  let xhr = new XMLHttpRequest();
  let url = HOST + '/reservation?name=';
  xhr.open('GET', url + escape(name));
  xhr.onload = function() {
    rsvpSearchDoneLoading();
    if (xhr.status === 200) {
      showReservation(JSON.parse(xhr.responseText));
    } else if (xhr.status === 404) {
      showReservationNotFound(name);
    } else {
      showCatastrophicFailure();
    }
  };
  xhr.send();
}

function guestSaveLoading() {
  document.getElementById('guests-save').setAttribute('disabled', 'disabled');
  hide('guests-save-label');
  show('guests-save-spinner');
}

function guestSaveDoneLoading() {
  show('guests-save-label');
  hide('guests-save-spinner');
}

function showSuccess(guests) {
  hide('show-reservation');
  let anyComing = guests.filter(g => g.coming).length;
  let text = anyComing
    ? 'Thanks for RSVPing! Excited to see you  at the wedding!'
    : "Sorry you can't make it! Hope to see you soon!";
  document.getElementById('success').innerText = text;
  show('success');
}

function showCatastrophicFailure() {
  let errorEle = document.getElementById('reservation-error');
  errorEle.innerHTML = `
    Something bad happened. It's probaby Andy's fault.<br>
    Try again later, or contact Andy or Carol with your RSVP.
  `;
  showEle(errorEle);
  hide('rsvp-name');
}

function rsvpSearchDoneLoading() {
  document.getElementById('rsvp-ok').removeAttribute('disabled');
  hide('rsvp-ok-spinner');
  show('rsvp-ok-label');
}

function rsvpSearchLoading() {
  document.getElementById('rsvp-ok').setAttribute('disabled', 'disabled');
  show('rsvp-ok-spinner');
  hide('rsvp-ok-label');
}

function showReservationNotFound(name) {
  let errorEle = document.getElementById('reservation-error');
  errorEle.innerHTML = `
    Could not find the guest <span class="name">${name}</span>.
    Please try again with your full name.
  `;
  showEle(errorEle);
  document.getElementById('rsvp-name').focus();
}

function showAlreadyRsvpd(guests) {
  for (let guest of guests) {
    if (guest.coming == null) {
      return false;
    }
  }

  let errorEle = document.getElementById('reservation-error');
  errorEle.innerHTML = `
    It looks like you already RSVP'd.
    <br>
    If we made a mistake or you need to change your RSVP, please
    contact Andy or Carol directly.
  `;
  showEle(errorEle);
  hide('rsvp-ok');
  document.getElementById('rsvp-name').setAttribute('disabled', 'disabled')
  return true;
}

function showReservation(json) {
  LOADED_RESERVATION = json;
  let guests = json.guests;

  // if the guests hav already rsvp'd show an error
  if (showAlreadyRsvpd(guests)) {
    return;
  }

  hide('find-reservation');
  show('show-reservation');
  let guestList = document.getElementById('guest-list');
  for (let guest of guests) {
    let nameHtml;
    if (guest.name) {
      nameHtml = guest.name;
    } else {
      nameHtml = `<input type="text" name="name-${guest.id}" placeholder="name of +1" />`;
    }
    let template = document.createElement('template');
    template.innerHTML = `
      <div id="guest-${guest.id}" class="guest">
        <div class="name">${nameHtml}</div>
        <div class="rsvp">
          <div class="coming">
            <div class="question">RSVP</div>
            <div class="answer">
              <input
                type="radio"
                name="coming-${guest.id}"
                id="coming-${guest.id}-yes"
                value="yes"
                checked="checked"
              >
              <label for="coming-${guest.id}-yes">Happily accepts</label>
              <input
                type="radio"
                name="coming-${guest.id}"
                id="coming-${guest.id}-no"
                value="no"
              >
              <label for="coming-${guest.id}-no">Regretfully declines</label>
            </div>
          </div>
          <div class="dinner">
            <div class="question">
              Dinner
            </div>
            <div class="answer">
              <input
                type="radio"
                name="dinner-${guest.id}"
                id="dinner-${guest.id}-beef"
                value="beef"
                checked="checked"
              >
              <label for="dinner-${guest.id}-beef">Chili citrus short rib</label>
              <input
                type="radio"
                name="dinner-${guest.id}"
                id="dinner-${guest.id}-fish"
                value="fish"
              >
              <label for="dinner-${guest.id}-fish">Miso roasted salmon</label>
              <div class="dietary">
                <button>Dietary restrictions?</button>
                <textarea class="hidden" name="dietary-${guest.id}" placeholder="Dietary restrictions?"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>`.trim();
    guestList.appendChild(template.content.firstElementChild);
  }
  handleGuestNameInput(document.getElementById('guests'));
  bindGuestEvents();
  document.querySelectorAll('.guest').forEach(g => g.classList.add('visible'))
}

init();


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
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
		module.hot.accept("!!../node_modules/css-loader/index.js!./rsvp.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./rsvp.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n  font-family: \"Roboto\", sans-serif;\n}\n\n:root {\n  --hl-color: #4a7292;\n}\n\n#nav {\n  position: absolute;\n}\n\n.logo > table {\n  font-size: calc(32px + 4vh);\n}\n\n.logo a {\n  text-decoration: none;\n}\n\n.logo .hl {\n  -webkit-text-stroke-width: 1px;\n  -webkit-text-stroke-color: var(--hl-color);\n}\n\n.title {\n  margin-top: 0;\n  height: 100%;\n  min-height: 100vh;\n}\n\n.title h1 {\n  font-size: 6vh;\n}\n\n.reservation > .panel {\n  width: 12em;\n  font-size: 28px;\n  min-width: 30vw;\n  max-width: 95vw;\n  margin-bottom: 2em;\n}\n\n#success {\n  text-shadow: .05em .05em .05em var(--hl-color);\n  background-color: rgba(255, 255, 255, .7);\n  padding: .5em 0;\n}\n\n@media\nscreen and (max-width: 400px) {\n  .reservation > * {\n    font-size: 24px;\n  }\n}\n\n.reservation input, .reservation button, .reservation textarea {\n  font-size: inherit;\n  line-height: inherit;\n}\n\n.reservation .name {\n  border-bottom: 1px solid grey;\n  margin-bottom: .4em;\n}\n\n.reservation .rsvp {\n  font-size: 75%;\n}\n\n.reservation .rsvp > * {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n}\n\n.reservation .rsvp .coming {\n  margin-bottom: .7em;\n}\n\n.rsvp .answer {\n  flex-grow: .2;\n}\n\n.rsvp .answer > label, .rsvp .answer > div {\n  text-align: left;\n  margin-bottom: .3em;\n}\n\n.rsvp label {\n  display: block;\n  width: fit-content;\n}\n\n.rsvp .dietary {\n  margin-left: 1.2em;\n  text-align: left;\n}\n\n.rsvp .dietary textarea {\n  font-family: inherit;\n  width: 9em;\n}\n\n.rsvp .dietary > button {\n  display: inline;\n  background-color: #afafaf;\n  width: fit-content;\n\n  border: 1px solid black;\n}\n\n.rsvp .dietary > button.hidden {\n  display: none;\n}\n\n.reservation button.hidden {\n  display: none;\n}\n\n#reservation-error, .reservation input[type=text], .reservation button {\n  margin-bottom: 1vh;\n}\n\n#reservation-error {\n  color: #e91e63;\n  background-color: rgba(255, 255, 255, .7);\n  font-size: 75%;\n  padding: .2em 0;\n}\n\n.reservation input[type=text], .reservation button {\n  display: block;\n  text-align: center;\n  font-family: inherit;\n  border: none;\n  width: 100%;\n}\n\ninput[type=\"radio\"] {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer;\n}\n\ninput[type=\"radio\"] + label {\n  cursor: pointer;\n}\n\ninput[type=\"radio\"] + label::before {\n  content       : '\\2713';\n  display       : inline-block;\n  width         : 1em;\n  color         : rgba(0,0,0,0);\n  font-size     : .8em;\n  line-height   : 1em;\n  font-weight   : bold;\n  margin        : .25em;\n  border-bottom : .05em solid black;\n  vertical-align: middle;\n}\n\ninput[type=\"radio\"]:checked + label::before {\n  color: var(--hl-color);\n}\n\ninput[type=\"radio\"]:checked + label {\n  text-shadow: 1px 1px 1px var(--hl-color);\n}\n\ninput {\n  background-color: rgba(255, 255, 255, .7);\n}\n\ninput:focus {\n  outline-color: var(--hl-color);\n  background-color: rgba(255, 255, 255, .9);\n}\n\nbutton[disabled] {\n  background-color: lightgrey;\n}\n\nbutton {\n  background-color: var(--hl-color);\n  cursor: pointer;\n}\n\n.email-container,\n.guest {\n  background-color: rgba(255, 255, 255, .7);\n  margin-bottom: .5em;\n  max-height: 0;\n  overflow: hidden;\n  transition: max-height 1s;\n  padding: .3em;\n}\n\n.email-container,\n.guest.visible {\n  max-height: 12em;\n}\n\n.reservation input[type=text].hidden {\n  display: none;\n}\n\n", ""]);

// exports


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2NmMmEwMjkwOTc4YTIyNzI3OWIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUuY3NzP2JkODQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvZm9udHMvbXJzZWF2ZXMudHRmIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25hdi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1nL2JnNS5qcGciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmNzcz81ZDE1Iiwid2VicGFjazovLy8uL3NyYy9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JzdnAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JzdnAuY3NzP2IxZWYiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JzdnAuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLGdCQUFnQjtBQUNuRCxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0JBQW9CO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxjQUFjOztBQUVsRTtBQUNBOzs7Ozs7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDOztBQUVBO0FBQ0EsbUJBQW1CLDJCQUEyQjs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQiwyQkFBMkI7QUFDNUM7QUFDQTs7QUFFQSxRQUFRLHVCQUF1QjtBQUMvQjtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBLGlCQUFpQix1QkFBdUI7QUFDeEM7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkLGtEQUFrRCxzQkFBc0I7QUFDeEU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7O0FBRUEsNkJBQTZCLG1CQUFtQjs7QUFFaEQ7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7OztBQzdXQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMsQzs7Ozs7O0FDekJBO0FBQ0E7QUFDQSw0R0FBNkc7O0FBRTdHO0FBQ0EscUNBQXNDLDhCQUE4QixrRUFBMkUsR0FBRyxVQUFVLGNBQWMsR0FBRyxVQUFVLG9CQUFvQixvQkFBb0IsYUFBYSxlQUFlLG1CQUFtQixvQkFBb0IscUJBQXFCLDRFQUE0RSxzQ0FBc0Msb0JBQW9CLG9CQUFvQixHQUFHLGlCQUFpQixnQ0FBZ0MsaUJBQWlCLGlCQUFpQiwwQkFBMEIsa0JBQWtCLG9CQUFvQixnQ0FBZ0MsbUJBQW1CLGdCQUFnQixxQ0FBcUMsNEJBQTRCLEdBQUcsZUFBZSwrQ0FBK0MsdUJBQXVCLGtFQUFrRSxHQUFHLHNCQUFzQixtQ0FBbUMsNkJBQTZCLEdBQUcsWUFBWSxpQkFBaUIsc0JBQXNCLEdBQUcsdUJBQXVCLGtDQUFrQyx1QkFBdUIsaUJBQWlCLEdBQUcsWUFBWSxpQkFBaUIsMEJBQTBCLHFCQUFxQiw0QkFBNEIsR0FBRyx1QkFBdUIsd0JBQXdCLEdBQUcsYUFBYSw2QkFBNkIsR0FBRyw2QkFBNkIsa0JBQWtCLEdBQUcscUJBQXFCLDZEQUE2RCxHQUFHLGdDQUFnQyxRQUFRLDBDQUEwQyxFQUFFLFFBQVEsMkNBQTJDLEVBQUUsU0FBUywwQ0FBMEMsRUFBRSxVQUFVLDBDQUEwQyxFQUFFLEdBQUc7O0FBRW5zRDs7Ozs7OztBQ1BBLGdGOzs7Ozs7O0FDQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLFdBQVcsRUFBRTtBQUNyRCx3Q0FBd0MsV0FBVyxFQUFFOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLHNDQUFzQztBQUN0QyxHQUFHO0FBQ0g7QUFDQSw4REFBOEQ7QUFDOUQ7O0FBRUE7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN4RkE7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFJQTs7Ozs7OztBQ2RBLGdGOzs7Ozs7QUNBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMsQzs7Ozs7O0FDekJBO0FBQ0E7OztBQUdBO0FBQ0EsK0JBQWdDLDBDQUEwQyxHQUFHLFVBQVUsa0ZBQW9GLDJCQUEyQixHQUFHLFlBQVksbUJBQW1CLHFCQUFxQixnQkFBZ0IsdUJBQXVCLG1CQUFtQiw4Q0FBOEMsR0FBRyxnQkFBZ0IscUJBQXFCLHVCQUF1QixHQUFHLGVBQWUsc0JBQXNCLG9CQUFvQiwyQkFBMkIsR0FBRyxXQUFXLG9CQUFvQixHQUFHLGlCQUFpQiwwQkFBMEIsbUJBQW1CLHVCQUF1QixpQkFBaUIsR0FBRyxTQUFTLGlCQUFpQixHQUFHLGdCQUFnQixvQkFBb0IsZ0JBQWdCLGdCQUFnQixtQkFBbUIsR0FBRzs7QUFFaHdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELDBDQUEwQztBQUMxRjtBQUNBLHFEQUFxRCwwQ0FBMEM7QUFDL0Y7QUFDQTtBQUNBLHFEQUFxRCwwQ0FBMEM7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLEdBQUc7QUFDeEMsb0NBQW9DLEdBQUc7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsOERBQThELEdBQUc7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsR0FBRztBQUN0RDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLEdBQUc7QUFDMUMsd0NBQXdDLEdBQUc7QUFDM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsS0FBSyxlQUFlLG1CQUFtQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsS0FBSztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLGtEQUFrRCxTQUFTO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixTQUFTO0FBQ2hDLDRCQUE0QixTQUFTO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixTQUFTO0FBQ3hDLDZCQUE2QixTQUFTO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxTQUFTO0FBQzVDO0FBQ0E7QUFDQSwrQkFBK0IsU0FBUztBQUN4Qyw2QkFBNkIsU0FBUztBQUN0QztBQUNBO0FBQ0EsbUNBQW1DLFNBQVM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFNBQVM7QUFDeEMsNkJBQTZCLFNBQVM7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLFNBQVM7QUFDNUM7QUFDQTtBQUNBLCtCQUErQixTQUFTO0FBQ3hDLDZCQUE2QixTQUFTO0FBQ3RDO0FBQ0E7QUFDQSxtQ0FBbUMsU0FBUztBQUM1QztBQUNBO0FBQ0EseURBQXlELFNBQVM7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hYQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMsQzs7Ozs7O0FDekJBO0FBQ0E7OztBQUdBO0FBQ0EsK0JBQWdDLHdDQUF3QyxHQUFHLFdBQVcsd0JBQXdCLEdBQUcsVUFBVSx1QkFBdUIsR0FBRyxtQkFBbUIsZ0NBQWdDLEdBQUcsYUFBYSwwQkFBMEIsR0FBRyxlQUFlLG1DQUFtQywrQ0FBK0MsR0FBRyxZQUFZLGtCQUFrQixpQkFBaUIsc0JBQXNCLEdBQUcsZUFBZSxtQkFBbUIsR0FBRywyQkFBMkIsZ0JBQWdCLG9CQUFvQixvQkFBb0Isb0JBQW9CLHVCQUF1QixHQUFHLGNBQWMsbURBQW1ELDhDQUE4QyxvQkFBb0IsR0FBRywyQ0FBMkMsc0JBQXNCLHNCQUFzQixLQUFLLEdBQUcsb0VBQW9FLHVCQUF1Qix5QkFBeUIsR0FBRyx3QkFBd0Isa0NBQWtDLHdCQUF3QixHQUFHLHdCQUF3QixtQkFBbUIsR0FBRyw0QkFBNEIsa0JBQWtCLHdCQUF3QixrQ0FBa0MsR0FBRyxnQ0FBZ0Msd0JBQXdCLEdBQUcsbUJBQW1CLGtCQUFrQixHQUFHLGdEQUFnRCxxQkFBcUIsd0JBQXdCLEdBQUcsaUJBQWlCLG1CQUFtQix1QkFBdUIsR0FBRyxvQkFBb0IsdUJBQXVCLHFCQUFxQixHQUFHLDZCQUE2Qix5QkFBeUIsZUFBZSxHQUFHLDZCQUE2QixvQkFBb0IsOEJBQThCLHVCQUF1Qiw4QkFBOEIsR0FBRyxvQ0FBb0Msa0JBQWtCLEdBQUcsZ0NBQWdDLGtCQUFrQixHQUFHLDRFQUE0RSx1QkFBdUIsR0FBRyx3QkFBd0IsbUJBQW1CLDhDQUE4QyxtQkFBbUIsb0JBQW9CLEdBQUcsd0RBQXdELG1CQUFtQix1QkFBdUIseUJBQXlCLGlCQUFpQixnQkFBZ0IsR0FBRywyQkFBMkIsdUJBQXVCLGVBQWUsb0JBQW9CLEdBQUcsbUNBQW1DLG9CQUFvQixHQUFHLDJDQUEyQyw2QkFBNkIsaUNBQWlDLHdCQUF3QixrQ0FBa0MseUJBQXlCLHdCQUF3Qix5QkFBeUIsMEJBQTBCLHNDQUFzQywyQkFBMkIsR0FBRyxtREFBbUQsMkJBQTJCLEdBQUcsMkNBQTJDLDZDQUE2QyxHQUFHLFdBQVcsOENBQThDLEdBQUcsaUJBQWlCLG1DQUFtQyw4Q0FBOEMsR0FBRyxzQkFBc0IsZ0NBQWdDLEdBQUcsWUFBWSxzQ0FBc0Msb0JBQW9CLEdBQUcsK0JBQStCLDhDQUE4Qyx3QkFBd0Isa0JBQWtCLHFCQUFxQiw4QkFBOEIsa0JBQWtCLEdBQUcsdUNBQXVDLHFCQUFxQixHQUFHLDBDQUEwQyxrQkFBa0IsR0FBRzs7QUFFbjRHIiwiZmlsZSI6InJzdnAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMzMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGNjZjJhMDI5MDk3OGEyMjcyNzliIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRFbGVtZW50ID0gKGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbyA9IHt9O1xuXG5cdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHZhciBzdHlsZVRhcmdldCA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0Ly8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblx0XHRcdGlmIChzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG5cdFx0XHRcdFx0Ly8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1lbW9bc2VsZWN0b3JdID0gc3R5bGVUYXJnZXQ7XG5cdFx0fVxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24gJiYgdHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uICE9PSBcImJvb2xlYW5cIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcblx0aWYgKCFvcHRpb25zLmluc2VydEludG8pIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICghb3B0aW9ucy5pbnNlcnRBdCkgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUgKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykgZG9tU3R5bGUucGFydHNbal0oKTtcblxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cblx0XHRpZighbmV3U3R5bGVzW2lkXSkgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudCAob3B0aW9ucywgc3R5bGUpIHtcblx0dmFyIHRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXG5cdGlmICghdGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZXNJbnNlcnRlZEF0VG9wW3N0eWxlc0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCB0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHRcdH1cblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcIm9iamVjdFwiICYmIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKSB7XG5cdFx0dmFyIG5leHRTaWJsaW5nID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8gKyBcIiBcIiArIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKTtcblx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBuZXh0U2libGluZyk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiW1N0eWxlIExvYWRlcl1cXG5cXG4gSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcgKCdvcHRpb25zLmluc2VydEF0JykgZm91bmQuXFxuIE11c3QgYmUgJ3RvcCcsICdib3R0b20nLCBvciBPYmplY3QuXFxuIChodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlciNpbnNlcnRhdClcXG5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9zdHlsZS5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vc3R5bGUuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3N0eWxlLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9RmphbGxhK09uZXxSb2JvdG98R3JlYXQrVmliZXMpO1wiLCBcIlwiXSk7XG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogXFxcIk1yc0VhdmVzXFxcIjtcXG4gIHNyYzogdXJsKFwiICsgcmVxdWlyZShcIi4vZm9udHMvbXJzZWF2ZXMudHRmXCIpICsgXCIpIGZvcm1hdChcXFwidHJ1ZXR5cGVcXFwiKTtcXG59XFxuXFxuYm9keSB7XFxuICBtYXJnaW46IDA7XFxufVxcblxcbiNuYXYge1xcbiAgbWFyZ2luLXRvcDogMXZoO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgdG9wOiA1cHg7XFxuICBsZWZ0OiAxMHB4O1xcblxcbiAgaGVpZ2h0OiA0OHB4O1xcbiAgbWF4LXdpZHRoOiA0OHB4O1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG5cXG4gIHRyYW5zaXRpb246IG1heC13aWR0aCA3MDBtcyBlYXNlLCBiYWNrZ3JvdW5kLWNvbG9yIDEwMG1zIGxpbmVhciA3MDBtcztcXG4gIGZvbnQtZmFtaWx5OiBcXFwiRmphbGxhIE9uZVxcXCIsIHNhbnM7XFxuICBmb250LXNpemU6IDE0cHg7XFxuXFxuICB6LWluZGV4OiAxMDAwO1xcbn1cXG5cXG4jbmF2IGJ1dHRvbiB7XFxuICBiYWNrZ3JvdW5kOiBub25lICFpbXBvcnRhbnQ7XFxuICBjb2xvcjogYmxhY2s7XFxuICBib3JkZXI6IG5vbmU7XFxuICBwYWRkaW5nOiAwISBpbXBvcnRhbnQ7XFxuICBmb250OiBpbmhlcml0O1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgb3V0bGluZTogaW5oZXJpdCAhaW1wb3J0YW50O1xcblxcbiAgaGVpZ2h0OiA0OHB4O1xcbiAgd2lkdGg6IDQ4cHg7XFxuXFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjVzIGVhc2U7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG59XFxuXFxuI25hdi5vcGVuIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcXG5cXG4gIG1heC13aWR0aDogNTAwcHg7XFxuICB0cmFuc2l0aW9uOiBtYXgtd2lkdGggNzAwbXMgZWFzZSwgYmFja2dyb3VuZC1jb2xvciAyMDBtcyBlYXNlO1xcbn1cXG5cXG4jbmF2Lm9wZW4gYnV0dG9uIHtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAuNXMgZWFzZTtcXG4gIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTtcXG59XFxuXFxuI2xpbmtzIHtcXG4gIGZsb2F0OiByaWdodDtcXG4gIGxpbmUtaGVpZ2h0OiA0OHB4O1xcbn1cXG5cXG4jbGlua3MgLnNlcGFyYXRvciB7XFxuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCBibGFjaztcXG4gIG1hcmdpbi1yaWdodDogMTBweDtcXG4gIGhlaWdodDogMzBweDtcXG59XFxuXFxuI25hdiBhIHtcXG4gIGNvbG9yOiBibGFjaztcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGZvbnQtc2l6ZTogMS41ZW07XFxuICBcXG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XFxufVxcblxcbiNuYXYgYTpsYXN0LWNoaWxkIHtcXG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XFxufVxcblxcbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xcbn1cXG5cXG5pbnB1dFt0eXBlPXRleHRdLmhpZGRlbiB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4jbmF2Om5vdCgub3Blbikge1xcbiAgYW5pbWF0aW9uOiAxMHMgbGluZWFyIDVzIGluZmluaXRlIG5vcm1hbCBwdWxzZUJhY2tncm91bmQ7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VCYWNrZ3JvdW5kIHtcXG4gIDAlIHsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwKTsgfVxcbiAgNSUgeyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC43KTsgfVxcbiAgMTAlIHsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwKTsgfVxcbiAgMTAwJSB7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMCk7IH1cXG59XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL3NyYy9zdHlsZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjQ0MjdmMWVhNTBhZWZkN2U4YWU3YmI4ZWMyYjIyMzk4LnR0ZlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ZvbnRzL21yc2VhdmVzLnR0ZlxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC8pL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsImZ1bmN0aW9uIG5hdigpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5pdF9uYXZfYnV0dG9uKCkge1xuICBuYXYoKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG5hdlRvZ2dsZUhhbmRsZXIpO1xufVxuXG5mdW5jdGlvbiBuYXZUb2dnbGVIYW5kbGVyKCkgIHtcbiAgbmF2KCkuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xufVxuXG5leHBvcnQge1xuICBuYXZUb2dnbGVIYW5kbGVyXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9uYXYuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjNhMDlhM2MyNzU2OTYzZThiM2RjN2U2ZWM4ODMwMTRjLmpwZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9iZzUuanBnXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDQiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9pbmRleC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vaW5kZXguY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2luZGV4LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDQiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiBNcnNFYXZlcywgR2VvcmdpYSwgc2VyaWY7XFxufVxcblxcbmh0bWwge1xcbiAgYmFja2dyb3VuZDogdXJsKFwiICsgcmVxdWlyZShcIi4vaW1nL2JnNS5qcGdcIikgKyBcIikgbm8tcmVwZWF0IGNlbnRlciBjZW50ZXIgZml4ZWQ7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbn1cXG5cXG4udGl0bGUge1xcbiAgcGFkZGluZzogNHZoIDA7XFxuICBtYXJnaW4tdG9wOiAyNXZoO1xcbiAgd2lkdGg6IDEwMCU7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFxuICBjb2xvcjogYmxhY2s7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NiwgMjU2LCAyNTYsIC40KTtcXG59XFxuXFxuLnRpdGxlID4gKiB7XFxuICBtYXJnaW46IDN2aCBhdXRvO1xcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4udGl0bGUgaDEge1xcbiAgZm9udC13ZWlnaHQ6IDEwMDA7XFxuICBmb250LXNpemU6IDEwdmg7XFxuICBmb250LWZhbWlseTogYm9tYnNoZWxsO1xcbn1cXG5cXG4ubG9nbyB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5sb2dvIHRhYmxlIHtcXG4gIGZvbnQtZmFtaWx5OiBNcnNFYXZlcztcXG4gIGZvbnQtc2l6ZTogNnZoO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5cXG4uaGwge1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4uY291bnRkb3duIHtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIGJvdHRvbTogNXB4O1xcbiAgcmlnaHQ6IDEwcHg7XFxuICBmb250LXNpemU6IDN2aDtcXG59XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL3NyYy9pbmRleC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgNCIsImltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XG5pbXBvcnQgXCIuL2luZGV4LmNzc1wiO1xuaW1wb3J0IFwiLi9yc3ZwLmNzc1wiO1xuXG5pbXBvcnQgaW5pdF9uYXZfYnV0dG9uIGZyb20gXCIuL25hdlwiO1xuXG5sZXQgSE9TVDtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIEhPU1QgPSAnaHR0cHM6Ly9jYXJvbC1hbmQtYW5keS5hcHBzcG90LmNvbSc7XG59IGVsc2Uge1xuICBIT1NUID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCc7XG59XG5cbmxldCBMT0FERURfUkVTRVJWQVRJT04gPSBudWxsO1xuXG5mdW5jdGlvbiB0ZXN0X2luaXQoKSB7XG4gIGxldCBuYW1lJCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyc3ZwLW5hbWUnKTtcbiAgbmFtZSQudmFsdWUgPSAnZGF2aWQgbGVpJztcbiAgbmFtZSQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JykpO1xuICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncnN2cC1vaycpLmNsaWNrKCk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGJpbmRSc3ZwU2VhcmNoRXZlbnRzKCk7XG4gIGhhbmRsZVJzdnBWaXNpYmlsaXR5KCk7XG4gIGluaXRfbmF2X2J1dHRvbigpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncnN2cC1uYW1lJykuZm9jdXMoKTtcbn1cblxuZnVuY3Rpb24gc2hvd0VsZShlbGUsIGFuaW1hdGVDbGFzcykge1xuICBlbGUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG59XG5cbmZ1bmN0aW9uIHNob3coaWQsIGFuaW1hdGVDbGFzcykge1xuICBzaG93RWxlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSwgYW5pbWF0ZUNsYXNzKTtcbn1cblxuZnVuY3Rpb24gaGlkZUVsZShlbGUpIHtcbiAgZWxlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xufVxuXG5mdW5jdGlvbiBoaWRlKGlkKSB7XG4gIGhpZGVFbGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcbn1cblxuZnVuY3Rpb24gYmluZFJzdnBTZWFyY2hFdmVudHMoKSB7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyc3ZwLW9rJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVSc3ZwU2VhcmNoKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JzdnAtbmFtZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlUnN2cFZpc2liaWxpdHkpXG59XG5cbmZ1bmN0aW9uIGJpbmRHdWVzdEV2ZW50cygpIHtcbiAgZG9jdW1lbnRcbiAgICAuZ2V0RWxlbWVudEJ5SWQoJ3lvdXItZW1haWwnKVxuICAgIC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGV2ZW50KSB7IGhhbmRsZUd1ZXN0TmFtZUlucHV0KGV2ZW50LnRhcmdldC5mb3JtKSB9KTtcbiAgZm9yIChsZXQgaW5wdXQgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hbWUgPiBpbnB1dFt0eXBlPXRleHRdJykpIHtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGV2ZW50KSB7IGhhbmRsZUd1ZXN0TmFtZUlucHV0KGV2ZW50LnRhcmdldC5mb3JtKSB9ICk7XG4gIH1cbiAgZm9yIChsZXQgaW5wdXQgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbWluZyBpbnB1dFt0eXBlPXJhZGlvXScpKSB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbihldmVudCkgeyBoYW5kbGVHdWVzdE5hbWVJbnB1dChldmVudC50YXJnZXQuZm9ybSkgfSApO1xuICB9XG4gIGZvciAobGV0IGJ0biBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGlldGFyeSA+IGJ1dHRvbicpKSB7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlRGlldGFyeUV4cGFuc2lvbik7XG4gIH1cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybSNndWVzdHMnKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBoYW5kbGVHdWVzdFNhdmUpO1xufVxuXG5mdW5jdGlvbiBnZXRGb3JtRGF0YShmb3JtJCkge1xuICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtJCk7XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgZm9yIChsZXQgaXRlbSBvZiBkYXRhKSB7XG4gICAgcmVzdWx0W2l0ZW1bMF1dID0gaXRlbVsxXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpc0Zvcm1WYWxpZChmb3JtKSB7XG4gIGxldCByZXMgPSBMT0FERURfUkVTRVJWQVRJT047XG4gIGlmICghcmVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBmb3JtRGF0YSA9IGdldEZvcm1EYXRhKGZvcm0pO1xuICBsZXQgZW1haWwgPSBmb3JtRGF0YVsneW91ci1lbWFpbCddO1xuICBpZiAoIWVtYWlsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZvciAobGV0IGd1ZXN0IG9mIHJlcy5ndWVzdHMpIHtcbiAgICBpZiAoZ3Vlc3QubmFtZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGxldCBjb21pbmcgPSBmb3JtRGF0YVsnY29taW5nLScgKyBndWVzdC5pZF0gPT09ICd5ZXMnO1xuICAgIGxldCBuYW1lID0gZm9ybURhdGFbJ25hbWUtJyArIGd1ZXN0LmlkXTtcbiAgICBpZiAoY29taW5nICYmICFuYW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIHN5bmNBY2NlcHREZWNsaW5lKGZvcm0kKSB7XG4gIGxldCByZXMgPSBMT0FERURfUkVTRVJWQVRJT047XG4gIGlmICghcmVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBmb3JtRGF0YSA9IGdldEZvcm1EYXRhKGZvcm0kKTtcbiAgbGV0IGFueU5hbWVkR3Vlc3RzQ29taW5nID0gZmFsc2U7XG4gIGZvciAobGV0IGd1ZXN0IG9mIHJlcy5ndWVzdHMpIHtcbiAgICBsZXQgaWQgPSBndWVzdC5pZDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgZ3Vlc3QtJHtpZH1gKS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICBsZXQgY29taW5nID0gZm9ybURhdGFbYGNvbWluZy0ke2lkfWBdID09PSAneWVzJztcbiAgICBpZiAoZ3Vlc3QubmFtZSAmJiBjb21pbmcpIHtcbiAgICAgIGFueU5hbWVkR3Vlc3RzQ29taW5nID0gdHJ1ZTtcbiAgICB9XG4gICAgbGV0IG5hbWVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9bmFtZS0ke2lkfV1gKTtcbiAgICBpZiAobmFtZUlucHV0KSB7XG4gICAgICBpZiAoY29taW5nKSB7XG4gICAgICAgIG5hbWVJbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJ05hbWUgb2YgZ3Vlc3QnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICAgIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJ0d1ZXN0Jyk7XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBkaW5uZXIkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2d1ZXN0LSR7aWR9IC5kaW5uZXJgKTtcbiAgICBpZiAoY29taW5nKSB7XG4gICAgICBkaW5uZXIkLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaW5uZXIkLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuICBpZiAoIWFueU5hbWVkR3Vlc3RzQ29taW5nKSB7XG4gICAgLy8gYWxsIHVubmFtZWQgZ3Vlc3RzIHNob3VsZCBiZSBoaWRkZW5cbiAgICBmb3IgKGxldCBndWVzdCBvZiByZXMuZ3Vlc3RzKSB7XG4gICAgICBpZiAoZ3Vlc3QubmFtZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGxldCBpZCA9IGd1ZXN0LmlkO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGd1ZXN0LSR7aWR9YCkuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY29taW5nLSR7aWR9LW5vYCkuY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZURpZXRhcnlFeHBhbnNpb24oZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGhpZGVFbGUoZS50YXJnZXQpO1xuICBzaG93RWxlKGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZylcbiAgZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLmZvY3VzKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUd1ZXN0TmFtZUlucHV0KGZvcm0kKSB7XG4gIHN5bmNBY2NlcHREZWNsaW5lKGZvcm0kKTtcbiAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdndWVzdHMtc2F2ZScpO1xuICBpZiAoaXNGb3JtVmFsaWQoZm9ybSQpKSB7XG4gICAgYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfSBlbHNlIHtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUd1ZXN0U2F2ZShldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBsZXQgcmVzID0gTE9BREVEX1JFU0VSVkFUSU9OO1xuICBpZiAoIXJlcykge1xuICAgIHJldHVybjtcbiAgfVxuICBndWVzdFNhdmVMb2FkaW5nKCk7XG4gIGxldCBmb3JtRGF0YSA9IGdldEZvcm1EYXRhKGV2ZW50LnRhcmdldCk7XG4gIGZvciAobGV0IGd1ZXN0IG9mIHJlcy5ndWVzdHMpIHtcbiAgICBndWVzdC5jb21pbmcgPSBmb3JtRGF0YVsnY29taW5nLScgKyBndWVzdC5pZF0gPT09ICd5ZXMnO1xuICAgIGxldCBuYW1lID0gZm9ybURhdGFbJ25hbWUtJyArIGd1ZXN0LmlkXTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgZ3Vlc3QubmFtZSA9IG5hbWU7XG4gICAgfVxuICAgIGd1ZXN0LmRpbm5lciA9IGZvcm1EYXRhWydkaW5uZXItJyArIGd1ZXN0LmlkXSB8fCBudWxsO1xuICAgIGd1ZXN0LmRpZXRhcnkgPSBmb3JtRGF0YVsnZGlldGFyeS0nICsgZ3Vlc3QuaWRdIHx8IG51bGw7XG4gIH1cbiAgcmVzLnJlc2VydmF0aW9uLmd1ZXN0cyA9IHJlcy5ndWVzdHM7XG4gIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgbGV0IHVybCA9IGAke0hPU1R9L3Jlc2VydmF0aW9uLyR7cmVzLnJlc2VydmF0aW9uLmlkfWA7XG4gIHhoci5vcGVuKCdQVVQnLCB1cmwpO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgZ3Vlc3RTYXZlRG9uZUxvYWRpbmcoKTtcbiAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBzaG93U3VjY2VzcyhyZXMuZ3Vlc3RzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvd0NhdGFzdHJvcGhpY0ZhaWx1cmUoKTtcbiAgICB9XG4gIH1cbiAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkocmVzKSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJzdnBWaXNpYmlsaXR5KCkge1xuICBsZXQgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyc3ZwLW5hbWUnKS52YWx1ZTtcbiAgbGV0IGVuYWJsZWQgPSBuYW1lICYmIG5hbWUudHJpbSgpO1xuICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JzdnAtb2snKTtcbiAgaWYgKGVuYWJsZWQpIHtcbiAgICBidXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICB9IGVsc2Uge1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlUnN2cFNlYXJjaCgpIHtcbiAgaGlkZSgncmVzZXJ2YXRpb24tZXJyb3InKTtcbiAgcnN2cFNlYXJjaExvYWRpbmcoKTtcbiAgbGV0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncnN2cC1uYW1lJykudmFsdWU7XG5cbiAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICBsZXQgdXJsID0gSE9TVCArICcvcmVzZXJ2YXRpb24/bmFtZT0nO1xuICB4aHIub3BlbignR0VUJywgdXJsICsgZXNjYXBlKG5hbWUpKTtcbiAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJzdnBTZWFyY2hEb25lTG9hZGluZygpO1xuICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIHNob3dSZXNlcnZhdGlvbihKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICB9IGVsc2UgaWYgKHhoci5zdGF0dXMgPT09IDQwNCkge1xuICAgICAgc2hvd1Jlc2VydmF0aW9uTm90Rm91bmQobmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dDYXRhc3Ryb3BoaWNGYWlsdXJlKCk7XG4gICAgfVxuICB9O1xuICB4aHIuc2VuZCgpO1xufVxuXG5mdW5jdGlvbiBndWVzdFNhdmVMb2FkaW5nKCkge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3Vlc3RzLXNhdmUnKS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gIGhpZGUoJ2d1ZXN0cy1zYXZlLWxhYmVsJyk7XG4gIHNob3coJ2d1ZXN0cy1zYXZlLXNwaW5uZXInKTtcbn1cblxuZnVuY3Rpb24gZ3Vlc3RTYXZlRG9uZUxvYWRpbmcoKSB7XG4gIHNob3coJ2d1ZXN0cy1zYXZlLWxhYmVsJyk7XG4gIGhpZGUoJ2d1ZXN0cy1zYXZlLXNwaW5uZXInKTtcbn1cblxuZnVuY3Rpb24gc2hvd1N1Y2Nlc3MoZ3Vlc3RzKSB7XG4gIGhpZGUoJ3Nob3ctcmVzZXJ2YXRpb24nKTtcbiAgbGV0IGFueUNvbWluZyA9IGd1ZXN0cy5maWx0ZXIoZyA9PiBnLmNvbWluZykubGVuZ3RoO1xuICBsZXQgdGV4dCA9IGFueUNvbWluZ1xuICAgID8gJ1RoYW5rcyBmb3IgUlNWUGluZyEgRXhjaXRlZCB0byBzZWUgeW91ICBhdCB0aGUgd2VkZGluZyEnXG4gICAgOiBcIlNvcnJ5IHlvdSBjYW4ndCBtYWtlIGl0ISBIb3BlIHRvIHNlZSB5b3Ugc29vbiFcIjtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Y2Nlc3MnKS5pbm5lclRleHQgPSB0ZXh0O1xuICBzaG93KCdzdWNjZXNzJyk7XG59XG5cbmZ1bmN0aW9uIHNob3dDYXRhc3Ryb3BoaWNGYWlsdXJlKCkge1xuICBsZXQgZXJyb3JFbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzZXJ2YXRpb24tZXJyb3InKTtcbiAgZXJyb3JFbGUuaW5uZXJIVE1MID0gYFxuICAgIFNvbWV0aGluZyBiYWQgaGFwcGVuZWQuIEl0J3MgcHJvYmFieSBBbmR5J3MgZmF1bHQuPGJyPlxuICAgIFRyeSBhZ2FpbiBsYXRlciwgb3IgY29udGFjdCBBbmR5IG9yIENhcm9sIHdpdGggeW91ciBSU1ZQLlxuICBgO1xuICBzaG93RWxlKGVycm9yRWxlKTtcbiAgaGlkZSgncnN2cC1uYW1lJyk7XG59XG5cbmZ1bmN0aW9uIHJzdnBTZWFyY2hEb25lTG9hZGluZygpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JzdnAtb2snKS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gIGhpZGUoJ3JzdnAtb2stc3Bpbm5lcicpO1xuICBzaG93KCdyc3ZwLW9rLWxhYmVsJyk7XG59XG5cbmZ1bmN0aW9uIHJzdnBTZWFyY2hMb2FkaW5nKCkge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncnN2cC1vaycpLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgc2hvdygncnN2cC1vay1zcGlubmVyJyk7XG4gIGhpZGUoJ3JzdnAtb2stbGFiZWwnKTtcbn1cblxuZnVuY3Rpb24gc2hvd1Jlc2VydmF0aW9uTm90Rm91bmQobmFtZSkge1xuICBsZXQgZXJyb3JFbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzZXJ2YXRpb24tZXJyb3InKTtcbiAgZXJyb3JFbGUuaW5uZXJIVE1MID0gYFxuICAgIENvdWxkIG5vdCBmaW5kIHRoZSBndWVzdCA8c3BhbiBjbGFzcz1cIm5hbWVcIj4ke25hbWV9PC9zcGFuPi5cbiAgICBQbGVhc2UgdHJ5IGFnYWluIHdpdGggeW91ciBmdWxsIG5hbWUuXG4gIGA7XG4gIHNob3dFbGUoZXJyb3JFbGUpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncnN2cC1uYW1lJykuZm9jdXMoKTtcbn1cblxuZnVuY3Rpb24gc2hvd0FscmVhZHlSc3ZwZChndWVzdHMpIHtcbiAgZm9yIChsZXQgZ3Vlc3Qgb2YgZ3Vlc3RzKSB7XG4gICAgaWYgKGd1ZXN0LmNvbWluZyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgbGV0IGVycm9yRWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2VydmF0aW9uLWVycm9yJyk7XG4gIGVycm9yRWxlLmlubmVySFRNTCA9IGBcbiAgICBJdCBsb29rcyBsaWtlIHlvdSBhbHJlYWR5IFJTVlAnZC5cbiAgICA8YnI+XG4gICAgSWYgd2UgbWFkZSBhIG1pc3Rha2Ugb3IgeW91IG5lZWQgdG8gY2hhbmdlIHlvdXIgUlNWUCwgcGxlYXNlXG4gICAgY29udGFjdCBBbmR5IG9yIENhcm9sIGRpcmVjdGx5LlxuICBgO1xuICBzaG93RWxlKGVycm9yRWxlKTtcbiAgaGlkZSgncnN2cC1vaycpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncnN2cC1uYW1lJykuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBzaG93UmVzZXJ2YXRpb24oanNvbikge1xuICBMT0FERURfUkVTRVJWQVRJT04gPSBqc29uO1xuICBsZXQgZ3Vlc3RzID0ganNvbi5ndWVzdHM7XG5cbiAgLy8gaWYgdGhlIGd1ZXN0cyBoYXYgYWxyZWFkeSByc3ZwJ2Qgc2hvdyBhbiBlcnJvclxuICBpZiAoc2hvd0FscmVhZHlSc3ZwZChndWVzdHMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaGlkZSgnZmluZC1yZXNlcnZhdGlvbicpO1xuICBzaG93KCdzaG93LXJlc2VydmF0aW9uJyk7XG4gIGxldCBndWVzdExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3Vlc3QtbGlzdCcpO1xuICBmb3IgKGxldCBndWVzdCBvZiBndWVzdHMpIHtcbiAgICBsZXQgbmFtZUh0bWw7XG4gICAgaWYgKGd1ZXN0Lm5hbWUpIHtcbiAgICAgIG5hbWVIdG1sID0gZ3Vlc3QubmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZUh0bWwgPSBgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWUtJHtndWVzdC5pZH1cIiBwbGFjZWhvbGRlcj1cIm5hbWUgb2YgKzFcIiAvPmA7XG4gICAgfVxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gYFxuICAgICAgPGRpdiBpZD1cImd1ZXN0LSR7Z3Vlc3QuaWR9XCIgY2xhc3M9XCJndWVzdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmFtZVwiPiR7bmFtZUh0bWx9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyc3ZwXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbWluZ1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInF1ZXN0aW9uXCI+UlNWUDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFuc3dlclwiPlxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgICAgICAgICAgIG5hbWU9XCJjb21pbmctJHtndWVzdC5pZH1cIlxuICAgICAgICAgICAgICAgIGlkPVwiY29taW5nLSR7Z3Vlc3QuaWR9LXllc1wiXG4gICAgICAgICAgICAgICAgdmFsdWU9XCJ5ZXNcIlxuICAgICAgICAgICAgICAgIGNoZWNrZWQ9XCJjaGVja2VkXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY29taW5nLSR7Z3Vlc3QuaWR9LXllc1wiPkhhcHBpbHkgYWNjZXB0czwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJyYWRpb1wiXG4gICAgICAgICAgICAgICAgbmFtZT1cImNvbWluZy0ke2d1ZXN0LmlkfVwiXG4gICAgICAgICAgICAgICAgaWQ9XCJjb21pbmctJHtndWVzdC5pZH0tbm9cIlxuICAgICAgICAgICAgICAgIHZhbHVlPVwibm9cIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjb21pbmctJHtndWVzdC5pZH0tbm9cIj5SZWdyZXRmdWxseSBkZWNsaW5lczwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlubmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicXVlc3Rpb25cIj5cbiAgICAgICAgICAgICAgRGlubmVyXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnN3ZXJcIj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwiZGlubmVyLSR7Z3Vlc3QuaWR9XCJcbiAgICAgICAgICAgICAgICBpZD1cImRpbm5lci0ke2d1ZXN0LmlkfS1iZWVmXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT1cImJlZWZcIlxuICAgICAgICAgICAgICAgIGNoZWNrZWQ9XCJjaGVja2VkXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZGlubmVyLSR7Z3Vlc3QuaWR9LWJlZWZcIj5DaGlsaSBjaXRydXMgc2hvcnQgcmliPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwiZGlubmVyLSR7Z3Vlc3QuaWR9XCJcbiAgICAgICAgICAgICAgICBpZD1cImRpbm5lci0ke2d1ZXN0LmlkfS1maXNoXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT1cImZpc2hcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJkaW5uZXItJHtndWVzdC5pZH0tZmlzaFwiPk1pc28gcm9hc3RlZCBzYWxtb248L2xhYmVsPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlldGFyeVwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24+RGlldGFyeSByZXN0cmljdGlvbnM/PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiaGlkZGVuXCIgbmFtZT1cImRpZXRhcnktJHtndWVzdC5pZH1cIiBwbGFjZWhvbGRlcj1cIkRpZXRhcnkgcmVzdHJpY3Rpb25zP1wiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+YC50cmltKCk7XG4gICAgZ3Vlc3RMaXN0LmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICB9XG4gIGhhbmRsZUd1ZXN0TmFtZUlucHV0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdndWVzdHMnKSk7XG4gIGJpbmRHdWVzdEV2ZW50cygpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3Vlc3QnKS5mb3JFYWNoKGcgPT4gZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJykpXG59XG5cbmluaXQoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3JzdnAuanNcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3JzdnAuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3JzdnAuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3JzdnAuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9yc3ZwLmNzc1xuLy8gbW9kdWxlIGlkID0gMzRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiYm9keSB7XFxuICBmb250LWZhbWlseTogXFxcIlJvYm90b1xcXCIsIHNhbnMtc2VyaWY7XFxufVxcblxcbjpyb290IHtcXG4gIC0taGwtY29sb3I6ICM0YTcyOTI7XFxufVxcblxcbiNuYXYge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbn1cXG5cXG4ubG9nbyA+IHRhYmxlIHtcXG4gIGZvbnQtc2l6ZTogY2FsYygzMnB4ICsgNHZoKTtcXG59XFxuXFxuLmxvZ28gYSB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxufVxcblxcbi5sb2dvIC5obCB7XFxuICAtd2Via2l0LXRleHQtc3Ryb2tlLXdpZHRoOiAxcHg7XFxuICAtd2Via2l0LXRleHQtc3Ryb2tlLWNvbG9yOiB2YXIoLS1obC1jb2xvcik7XFxufVxcblxcbi50aXRsZSB7XFxuICBtYXJnaW4tdG9wOiAwO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxufVxcblxcbi50aXRsZSBoMSB7XFxuICBmb250LXNpemU6IDZ2aDtcXG59XFxuXFxuLnJlc2VydmF0aW9uID4gLnBhbmVsIHtcXG4gIHdpZHRoOiAxMmVtO1xcbiAgZm9udC1zaXplOiAyOHB4O1xcbiAgbWluLXdpZHRoOiAzMHZ3O1xcbiAgbWF4LXdpZHRoOiA5NXZ3O1xcbiAgbWFyZ2luLWJvdHRvbTogMmVtO1xcbn1cXG5cXG4jc3VjY2VzcyB7XFxuICB0ZXh0LXNoYWRvdzogLjA1ZW0gLjA1ZW0gLjA1ZW0gdmFyKC0taGwtY29sb3IpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuNyk7XFxuICBwYWRkaW5nOiAuNWVtIDA7XFxufVxcblxcbkBtZWRpYVxcbnNjcmVlbiBhbmQgKG1heC13aWR0aDogNDAwcHgpIHtcXG4gIC5yZXNlcnZhdGlvbiA+ICoge1xcbiAgICBmb250LXNpemU6IDI0cHg7XFxuICB9XFxufVxcblxcbi5yZXNlcnZhdGlvbiBpbnB1dCwgLnJlc2VydmF0aW9uIGJ1dHRvbiwgLnJlc2VydmF0aW9uIHRleHRhcmVhIHtcXG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcXG4gIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcbn1cXG5cXG4ucmVzZXJ2YXRpb24gLm5hbWUge1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGdyZXk7XFxuICBtYXJnaW4tYm90dG9tOiAuNGVtO1xcbn1cXG5cXG4ucmVzZXJ2YXRpb24gLnJzdnAge1xcbiAgZm9udC1zaXplOiA3NSU7XFxufVxcblxcbi5yZXNlcnZhdGlvbiAucnN2cCA+ICoge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG59XFxuXFxuLnJlc2VydmF0aW9uIC5yc3ZwIC5jb21pbmcge1xcbiAgbWFyZ2luLWJvdHRvbTogLjdlbTtcXG59XFxuXFxuLnJzdnAgLmFuc3dlciB7XFxuICBmbGV4LWdyb3c6IC4yO1xcbn1cXG5cXG4ucnN2cCAuYW5zd2VyID4gbGFiZWwsIC5yc3ZwIC5hbnN3ZXIgPiBkaXYge1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG4gIG1hcmdpbi1ib3R0b206IC4zZW07XFxufVxcblxcbi5yc3ZwIGxhYmVsIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4ucnN2cCAuZGlldGFyeSB7XFxuICBtYXJnaW4tbGVmdDogMS4yZW07XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbn1cXG5cXG4ucnN2cCAuZGlldGFyeSB0ZXh0YXJlYSB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIHdpZHRoOiA5ZW07XFxufVxcblxcbi5yc3ZwIC5kaWV0YXJ5ID4gYnV0dG9uIHtcXG4gIGRpc3BsYXk6IGlubGluZTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNhZmFmYWY7XFxuICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuXFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG59XFxuXFxuLnJzdnAgLmRpZXRhcnkgPiBidXR0b24uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5yZXNlcnZhdGlvbiBidXR0b24uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbiNyZXNlcnZhdGlvbi1lcnJvciwgLnJlc2VydmF0aW9uIGlucHV0W3R5cGU9dGV4dF0sIC5yZXNlcnZhdGlvbiBidXR0b24ge1xcbiAgbWFyZ2luLWJvdHRvbTogMXZoO1xcbn1cXG5cXG4jcmVzZXJ2YXRpb24tZXJyb3Ige1xcbiAgY29sb3I6ICNlOTFlNjM7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC43KTtcXG4gIGZvbnQtc2l6ZTogNzUlO1xcbiAgcGFkZGluZzogLjJlbSAwO1xcbn1cXG5cXG4ucmVzZXJ2YXRpb24gaW5wdXRbdHlwZT10ZXh0XSwgLnJlc2VydmF0aW9uIGJ1dHRvbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xcbiAgYm9yZGVyOiBub25lO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbmlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgb3BhY2l0eTogMDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXSArIGxhYmVsIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXSArIGxhYmVsOjpiZWZvcmUge1xcbiAgY29udGVudCAgICAgICA6ICdcXFxcMjcxMyc7XFxuICBkaXNwbGF5ICAgICAgIDogaW5saW5lLWJsb2NrO1xcbiAgd2lkdGggICAgICAgICA6IDFlbTtcXG4gIGNvbG9yICAgICAgICAgOiByZ2JhKDAsMCwwLDApO1xcbiAgZm9udC1zaXplICAgICA6IC44ZW07XFxuICBsaW5lLWhlaWdodCAgIDogMWVtO1xcbiAgZm9udC13ZWlnaHQgICA6IGJvbGQ7XFxuICBtYXJnaW4gICAgICAgIDogLjI1ZW07XFxuICBib3JkZXItYm90dG9tIDogLjA1ZW0gc29saWQgYmxhY2s7XFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcbn1cXG5cXG5pbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJdOmNoZWNrZWQgKyBsYWJlbDo6YmVmb3JlIHtcXG4gIGNvbG9yOiB2YXIoLS1obC1jb2xvcik7XFxufVxcblxcbmlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl06Y2hlY2tlZCArIGxhYmVsIHtcXG4gIHRleHQtc2hhZG93OiAxcHggMXB4IDFweCB2YXIoLS1obC1jb2xvcik7XFxufVxcblxcbmlucHV0IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjcpO1xcbn1cXG5cXG5pbnB1dDpmb2N1cyB7XFxuICBvdXRsaW5lLWNvbG9yOiB2YXIoLS1obC1jb2xvcik7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC45KTtcXG59XFxuXFxuYnV0dG9uW2Rpc2FibGVkXSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGdyZXk7XFxufVxcblxcbmJ1dHRvbiB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1obC1jb2xvcik7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5lbWFpbC1jb250YWluZXIsXFxuLmd1ZXN0IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjcpO1xcbiAgbWFyZ2luLWJvdHRvbTogLjVlbTtcXG4gIG1heC1oZWlnaHQ6IDA7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgdHJhbnNpdGlvbjogbWF4LWhlaWdodCAxcztcXG4gIHBhZGRpbmc6IC4zZW07XFxufVxcblxcbi5lbWFpbC1jb250YWluZXIsXFxuLmd1ZXN0LnZpc2libGUge1xcbiAgbWF4LWhlaWdodDogMTJlbTtcXG59XFxuXFxuLnJlc2VydmF0aW9uIGlucHV0W3R5cGU9dGV4dF0uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIhLi9zcmMvcnN2cC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDM1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJzb3VyY2VSb290IjoiIn0=