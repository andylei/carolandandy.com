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
/******/ 	return __webpack_require__(__webpack_require__.s = 48);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
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

/***/ 1:
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

/***/ 2:
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

/***/ 3:
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

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Fjalla+One|Roboto|Great+Vibes);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"MrsEaves\";\n  src: url(" + __webpack_require__(5) + ") format(\"truetype\");\n}\n\nbody {\n  margin: 0;\n}\n\n#nav {\n  margin-top: 1vh;\n  position: fixed;\n  top: 5px;\n  left: 10px;\n\n  height: 48px;\n  max-width: 48px;\n  overflow: hidden;\n\n  transition: max-width 700ms ease, background-color 100ms linear 700ms;\n  font-family: \"Fjalla One\", sans;\n  font-size: 14px;\n\n  z-index: 1000;\n}\n\n#nav button {\n  background: none !important;\n  color: black;\n  border: none;\n  padding: 0! important;\n  font: inherit;\n  cursor: pointer;\n  outline: inherit !important;\n\n  height: 48px;\n  width: 48px;\n\n  transition: transform .5s ease;\n  transform: rotate(0deg);\n}\n\n#nav.open {\n  background-color: rgba(255, 255, 255, 0.9);\n\n  max-width: 500px;\n  transition: max-width 700ms ease, background-color 200ms ease;\n}\n\n#nav.open button {\n  transition: transform .5s ease;\n  transform: rotate(90deg);\n}\n\n#links {\n  float: right;\n  line-height: 48px;\n}\n\n#links .separator {\n  border-right: 1px solid black;\n  margin-right: 10px;\n  height: 30px;\n}\n\n#nav a {\n  color: black;\n  text-decoration: none;\n  font-size: 1.5em;\n  \n  padding-right: 10px;\n}\n\n#nav a:last-child {\n  padding-right: 10px;\n}\n\n.hidden {\n  display: none;\n}\n\n#nav:not(.open) {\n  animation: 10s linear 5s infinite normal pulseBackground;\n}\n\n@keyframes pulseBackground {\n  0% { background-color: rgba(255, 255, 255, 0); }\n  5% { background-color: rgba(255, 255, 255, .7); }\n  10% { background-color: rgba(255, 255, 255, 0); }\n  100% { background-color: rgba(255, 255, 255, 0); }\n}", ""]);

// exports


/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_css__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rsvp_css__ = __webpack_require__(49);
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

function handleDietaryExpansion(e) {
  e.preventDefault();
  hideEle(e.target);
  showEle(e.target.nextElementSibling)
  e.target.nextElementSibling.focus();
}

function handleGuestNameInput(form$) {
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
      <div class="guest">
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

/***/ 49:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(50);
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

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "4427f1ea50aefd7e8ae7bb8ec2b22398.ttf";

/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n  font-family: \"Roboto\", sans-serif;\n}\n\n:root {\n  --hl-color: #4a7292;\n}\n\n#nav {\n  position: absolute;\n}\n\n.logo > table {\n  font-size: calc(32px + 4vh);\n}\n\n.logo a {\n  text-decoration: none;\n}\n\n.logo .hl {\n  -webkit-text-stroke-width: 1px;\n  -webkit-text-stroke-color: var(--hl-color);\n}\n\n.title {\n  margin-top: 0;\n  height: 100%;\n  min-height: 100vh;\n}\n\n.title h1 {\n  font-size: 6vh;\n}\n\n.reservation > .panel {\n  width: 12em;\n  font-size: 28px;\n  min-width: 30vw;\n  max-width: 95vw;\n  margin-bottom: 2em;\n}\n\n#success {\n  text-shadow: .05em .05em .05em var(--hl-color);\n  background-color: rgba(255, 255, 255, .7);\n  padding: .5em 0;\n}\n\n@media\nscreen and (max-width: 400px) {\n  .reservation > * {\n    font-size: 24px;\n  }\n}\n\n.reservation input, .reservation button, .reservation textarea {\n  font-size: inherit;\n  line-height: inherit;\n}\n\n.reservation .name {\n  border-bottom: 1px solid grey;\n  margin-bottom: .4em;\n}\n\n.reservation .rsvp {\n  font-size: 75%;\n}\n\n.reservation .rsvp > * {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n}\n\n.reservation .rsvp .coming {\n  margin-bottom: .7em;\n}\n\n.rsvp .answer {\n  flex-grow: .2;\n}\n\n.rsvp .answer > label, .rsvp .answer > div {\n  text-align: left;\n  margin-bottom: .3em;\n}\n\n.rsvp label {\n  display: block;\n  width: fit-content;\n}\n\n.rsvp .dietary {\n  margin-left: 1.2em;\n  text-align: left;\n}\n\n.rsvp .dietary textarea {\n  font-family: inherit;\n  width: 9em;\n}\n\n.rsvp .dietary > button {\n  display: inline;\n  background-color: #afafaf;\n  width: fit-content;\n\n  border: 1px solid black;\n}\n\n.rsvp .dietary > button.hidden {\n  display: none;\n}\n\n.reservation button.hidden {\n  display: none;\n}\n\n#reservation-error, .reservation input[type=text], .reservation button {\n  margin-bottom: 1vh;\n}\n\n#reservation-error {\n  color: #e91e63;\n  background-color: rgba(255, 255, 255, .7);\n  font-size: 75%;\n  padding: .2em 0;\n}\n\n.reservation input[type=text], .reservation button {\n  display: block;\n  text-align: center;\n  font-family: inherit;\n  border: none;\n  width: 100%;\n}\n\ninput[type=\"radio\"] {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer;\n}\n\ninput[type=\"radio\"] + label {\n  cursor: pointer;\n}\n\ninput[type=\"radio\"] + label::before {\n  content       : '\\2713';\n  display       : inline-block;\n  width         : 1em;\n  color         : rgba(0,0,0,0);\n  font-size     : .8em;\n  line-height   : 1em;\n  font-weight   : bold;\n  margin        : .25em;\n  border-bottom : .05em solid black;\n  vertical-align: middle;\n}\n\ninput[type=\"radio\"]:checked + label::before {\n  color: var(--hl-color);\n}\n\ninput[type=\"radio\"]:checked + label {\n  text-shadow: 1px 1px 1px var(--hl-color);\n}\n\ninput {\n  background-color: rgba(255, 255, 255, .7);\n}\n\ninput:focus {\n  outline-color: var(--hl-color);\n  background-color: rgba(255, 255, 255, .9);\n}\n\nbutton[disabled] {\n  background-color: lightgrey;\n}\n\nbutton {\n  background-color: var(--hl-color);\n  cursor: pointer;\n}\n\n.guest {\n  background-color: rgba(255, 255, 255, .7);\n  margin-bottom: .5em;\n  max-height: 0;\n  overflow: hidden;\n  transition: max-height 1s;\n  padding: .3em;\n}\n\n.guest.visible {\n  max-height: 12em;\n}\n", ""]);

// exports


/***/ }),

/***/ 6:
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

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "3a09a3c2756963e8b3dc7e6ec883014c.jpg";

/***/ }),

/***/ 8:
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

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n  font-family: MrsEaves, Georgia, serif;\n}\n\nhtml {\n  background: url(" + __webpack_require__(7) + ") no-repeat center center fixed;\n  background-size: cover;\n}\n\n.title {\n  padding: 4vh 0;\n  margin-top: 25vh;\n  width: 100%;\n  text-align: center;\n\n  color: black;\n  background-color: rgba(256, 256, 256, .4);\n}\n\n.title > * {\n  margin: 3vh auto;\n  width: fit-content;\n}\n\n.title h1 {\n  font-weight: 1000;\n  font-size: 10vh;\n  font-family: bombshell;\n}\n\n.logo {\n  cursor: pointer;\n}\n\n.logo table {\n  font-family: MrsEaves;\n  font-size: 6vh;\n  text-align: center;\n  color: black;\n}\n\n.hl {\n  color: white;\n}\n\n.countdown {\n  position: fixed;\n  bottom: 5px;\n  right: 10px;\n  font-size: 3vh;\n}", ""]);

// exports


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzVhOWNhMTk0MTZjZmE5YWIwZmIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZS5jc3M/YmQ4NCIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovLy8uL3NyYy9yc3ZwLmpzIiwid2VicGFjazovLy8uL3NyYy9yc3ZwLmNzcz9iMWVmIiwid2VicGFjazovLy8uL3NyYy9mb250cy9tcnNlYXZlcy50dGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JzdnAuY3NzIiwid2VicGFjazovLy8uL3NyYy9uYXYuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltZy9iZzUuanBnIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5jc3M/NWQxNSIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFEQUFxRCwwQ0FBMEM7QUFDL0Y7QUFDQTtBQUNBLHFEQUFxRCwwQ0FBMEM7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLEtBQUssZUFBZSxtQkFBbUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELEtBQUs7QUFDdkQ7QUFDQTtB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QThDLEdBQUcsc0JBQXNCLGdDQUFnQyxHQUFHLFlBQVksc0NBQXNDLG9CQUFvQixHQUFHLFlBQVksOENBQThDLHdCQUF3QixrQkFBa0IscUJBQXFCLDhCQUE4QixrQkFBa0IsR0FBRyxvQkFBb0IscUJBQXFCLEdBQUc7O0FBRTl4Rzs7Ozs7Ozs7OztBQ1BBO0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBSUE7Ozs7Ozs7O0FDZEEsZ0Y7Ozs7Ozs7QUNBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMsQzs7Ozs7OztBQ3pCQTtBQUNBOzs7QUFHQTtBQUNBLCtCQUFnQywwQ0FBMEMsR0FBRyxVQUFVLGtGQUFvRiwyQkFBMkIsR0FBRyxZQUFZLG1CQUFtQixxQkFBcUIsZ0JBQWdCLHVCQUF1QixtQkFBbUIsOENBQThDLEdBQUcsZ0JBQWdCLHFCQUFxQix1QkFBdUIsR0FBRyxlQUFlLHNCQUFzQixvQkFBb0IsMkJBQTJCLEdBQUcsV0FBVyxvQkFBb0IsR0FBRyxpQkFBaUIsMEJBQTBCLG1CQUFtQix1QkFBdUIsaUJBQWlCLEdBQUcsU0FBUyxpQkFBaUIsR0FBRyxnQkFBZ0Isb0JBQW9CLGdCQUFnQixnQkFBZ0IsbUJBQW1CLEdBQUc7O0FBRWh3QiIsImZpbGUiOiJyc3ZwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNDgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDM1YTljYTE5NDE2Y2ZhOWFiMGZiIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cblxudmFyIHN0eWxlc0luRG9tID0ge307XG5cbnZhclx0bWVtb2l6ZSA9IGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbztcblxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH07XG59O1xuXG52YXIgaXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xuXHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcblx0Ly8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG5cdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG59KTtcblxudmFyIGdldEVsZW1lbnQgPSAoZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vID0ge307XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vW3NlbGVjdG9yXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dmFyIHN0eWxlVGFyZ2V0ID0gZm4uY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG5cdFx0XHQvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXHRcdFx0aWYgKHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcblx0XHRcdFx0XHQvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBzdHlsZVRhcmdldDtcblx0XHR9XG5cdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdH07XG59KShmdW5jdGlvbiAodGFyZ2V0KSB7XG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldClcbn0pO1xuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhclx0c2luZ2xldG9uQ291bnRlciA9IDA7XG52YXJcdHN0eWxlc0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vdXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKCFvcHRpb25zLnNpbmdsZXRvbiAmJiB0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gIT09IFwiYm9vbGVhblwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0SW50bykgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKCFvcHRpb25zLmluc2VydEF0KSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZSAobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSBkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20gKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzIChsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKSBzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2UgbmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50IChvcHRpb25zLCBzdHlsZSkge1xuXHR2YXIgdGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cblx0aWYgKCF0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlc0luc2VydGVkQXRUb3Bbc3R5bGVzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdFx0fVxuXHRcdHN0eWxlc0luc2VydGVkQXRUb3AucHVzaChzdHlsZSk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwib2JqZWN0XCIgJiYgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpIHtcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50byArIFwiIFwiICsgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpO1xuXHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIG5leHRTaWJsaW5nKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJbU3R5bGUgTG9hZGVyXVxcblxcbiBJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0JyAoJ29wdGlvbnMuaW5zZXJ0QXQnKSBmb3VuZC5cXG4gTXVzdCBiZSAndG9wJywgJ2JvdHRvbScsIG9yIE9iamVjdC5cXG4gKGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyI2luc2VydGF0KVxcblwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQgKHN0eWxlKSB7XG5cdGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xuXG5cdHZhciBpZHggPSBzdHlsZXNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGUpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlc0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YWRkQXR0cnMoc3R5bGUsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGUpO1xuXG5cdHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YWRkQXR0cnMobGluaywgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rKTtcblxuXHRyZXR1cm4gbGluaztcbn1cblxuZnVuY3Rpb24gYWRkQXR0cnMgKGVsLCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZSAob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZSwgdXBkYXRlLCByZW1vdmUsIHJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXG5cdFx0c3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuXG5cdH0gZWxzZSBpZiAoXG5cdFx0b2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCJcblx0KSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cblx0XHRcdGlmKHN0eWxlLmhyZWYpIFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGUuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZSA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqKSB7XG5cdFx0aWYgKG5ld09iaikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG5cdFx0XHRcdG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmXG5cdFx0XHRcdG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXBcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyAoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnIChzdHlsZSwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayAobGluaywgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKlxuXHRcdElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRcdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdFx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdFx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKSB7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmsuaHJlZjtcblxuXHRsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYykgVVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC8pL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vc3R5bGUuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3N0eWxlLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9zdHlsZS5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlLmNzc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiQGltcG9ydCB1cmwoaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PUZqYWxsYStPbmV8Um9ib3RvfEdyZWF0K1ZpYmVzKTtcIiwgXCJcIl0pO1xuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJNcnNFYXZlc1xcXCI7XFxuICBzcmM6IHVybChcIiArIHJlcXVpcmUoXCIuL2ZvbnRzL21yc2VhdmVzLnR0ZlwiKSArIFwiKSBmb3JtYXQoXFxcInRydWV0eXBlXFxcIik7XFxufVxcblxcbmJvZHkge1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG4jbmF2IHtcXG4gIG1hcmdpbi10b3A6IDF2aDtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIHRvcDogNXB4O1xcbiAgbGVmdDogMTBweDtcXG5cXG4gIGhlaWdodDogNDhweDtcXG4gIG1heC13aWR0aDogNDhweDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuXFxuICB0cmFuc2l0aW9uOiBtYXgtd2lkdGggNzAwbXMgZWFzZSwgYmFja2dyb3VuZC1jb2xvciAxMDBtcyBsaW5lYXIgNzAwbXM7XFxuICBmb250LWZhbWlseTogXFxcIkZqYWxsYSBPbmVcXFwiLCBzYW5zO1xcbiAgZm9udC1zaXplOiAxNHB4O1xcblxcbiAgei1pbmRleDogMTAwMDtcXG59XFxuXFxuI25hdiBidXR0b24ge1xcbiAgYmFja2dyb3VuZDogbm9uZSAhaW1wb3J0YW50O1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgcGFkZGluZzogMCEgaW1wb3J0YW50O1xcbiAgZm9udDogaW5oZXJpdDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIG91dGxpbmU6IGluaGVyaXQgIWltcG9ydGFudDtcXG5cXG4gIGhlaWdodDogNDhweDtcXG4gIHdpZHRoOiA0OHB4O1xcblxcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC41cyBlYXNlO1xcbiAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxufVxcblxcbiNuYXYub3BlbiB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7XFxuXFxuICBtYXgtd2lkdGg6IDUwMHB4O1xcbiAgdHJhbnNpdGlvbjogbWF4LXdpZHRoIDcwMG1zIGVhc2UsIGJhY2tncm91bmQtY29sb3IgMjAwbXMgZWFzZTtcXG59XFxuXFxuI25hdi5vcGVuIGJ1dHRvbiB7XFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gLjVzIGVhc2U7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7XFxufVxcblxcbiNsaW5rcyB7XFxuICBmbG9hdDogcmlnaHQ7XFxuICBsaW5lLWhlaWdodDogNDhweDtcXG59XFxuXFxuI2xpbmtzIC5zZXBhcmF0b3Ige1xcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgYmxhY2s7XFxuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XFxuICBoZWlnaHQ6IDMwcHg7XFxufVxcblxcbiNuYXYgYSB7XFxuICBjb2xvcjogYmxhY2s7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBmb250LXNpemU6IDEuNWVtO1xcbiAgXFxuICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xcbn1cXG5cXG4jbmF2IGE6bGFzdC1jaGlsZCB7XFxuICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xcbn1cXG5cXG4uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbiNuYXY6bm90KC5vcGVuKSB7XFxuICBhbmltYXRpb246IDEwcyBsaW5lYXIgNXMgaW5maW5pdGUgbm9ybWFsIHB1bHNlQmFja2dyb3VuZDtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZUJhY2tncm91bmQge1xcbiAgMCUgeyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDApOyB9XFxuICA1JSB7IGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjcpOyB9XFxuICAxMCUgeyBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDApOyB9XFxuICAxMDAlIHsgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwKTsgfVxcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyIS4vc3JjL3N0eWxlLmNzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQgNSA2IiwiaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcbmltcG9ydCBcIi4vaW5kZXguY3NzXCI7XG5pbXBvcnQgXCIuL3JzdnAuY3NzXCI7XG5cbmltcG9ydCBpbml0X25hdl9idXR0b24gZnJvbSBcIi4vbmF2XCI7XG5cbmxldCBIT1NUO1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgSE9TVCA9ICdodHRwczovL2Nhcm9sLWFuZC1hbmR5LmFwcHNwb3QuY29tJztcbn0gZWxzZSB7XG4gIEhPU1QgPSAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJztcbn1cblxubGV0IExPQURFRF9SRVNFUlZBVElPTiA9IG51bGw7XG5cbmZ1bmN0aW9uIHRlc3RfaW5pdCgpIHtcbiAgbGV0IG5hbWUkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JzdnAtbmFtZScpO1xuICBuYW1lJC52YWx1ZSA9ICdkYXZpZCBsZWknO1xuICBuYW1lJC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnKSk7XG4gIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyc3ZwLW9rJykuY2xpY2soKTtcbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgYmluZFJzdnBTZWFyY2hFdmVudHMoKTtcbiAgaGFuZGxlUnN2cFZpc2liaWxpdHkoKTtcbiAgaW5pdF9uYXZfYnV0dG9uKCk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyc3ZwLW5hbWUnKS5mb2N1cygpO1xufVxuXG5mdW5jdGlvbiBzaG93RWxlKGVsZSwgYW5pbWF0ZUNsYXNzKSB7XG4gIGVsZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbn1cblxuZnVuY3Rpb24gc2hvdyhpZCwgYW5pbWF0ZUNsYXNzKSB7XG4gIHNob3dFbGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLCBhbmltYXRlQ2xhc3MpO1xufVxuXG5mdW5jdGlvbiBoaWRlRWxlKGVsZSkge1xuICBlbGUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG59XG5cbmZ1bmN0aW9uIGhpZGUoaWQpIHtcbiAgaGlkZUVsZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpO1xufVxuXG5mdW5jdGlvbiBiaW5kUnN2cFNlYXJjaEV2ZW50cygpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JzdnAtb2snKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZVJzdnBTZWFyY2gpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncnN2cC1uYW1lJykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVSc3ZwVmlzaWJpbGl0eSlcbn1cblxuZnVuY3Rpb24gYmluZEd1ZXN0RXZlbnRzKCkge1xuICBmb3IgKGxldCBpbnB1dCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmFtZSA+IGlucHV0W3R5cGU9dGV4dF0nKSkge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oZXZlbnQpIHsgaGFuZGxlR3Vlc3ROYW1lSW5wdXQoZXZlbnQudGFyZ2V0LmZvcm0pIH0gKTtcbiAgfVxuICBmb3IgKGxldCBpbnB1dCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29taW5nIGlucHV0W3R5cGU9cmFkaW9dJykpIHtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKGV2ZW50KSB7IGhhbmRsZUd1ZXN0TmFtZUlucHV0KGV2ZW50LnRhcmdldC5mb3JtKSB9ICk7XG4gIH1cbiAgZm9yIChsZXQgYnRuIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kaWV0YXJ5ID4gYnV0dG9uJykpIHtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVEaWV0YXJ5RXhwYW5zaW9uKTtcbiAgfVxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtI2d1ZXN0cycpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGhhbmRsZUd1ZXN0U2F2ZSk7XG59XG5cbmZ1bmN0aW9uIGdldEZvcm1EYXRhKGZvcm0kKSB7XG4gIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0kKTtcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGxldCBpdGVtIG9mIGRhdGEpIHtcbiAgICByZXN1bHRbaXRlbVswXV0gPSBpdGVtWzFdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGlzRm9ybVZhbGlkKGZvcm0pIHtcbiAgbGV0IHJlcyA9IExPQURFRF9SRVNFUlZBVElPTjtcbiAgaWYgKCFyZXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGZvcm1EYXRhID0gZ2V0Rm9ybURhdGEoZm9ybSk7XG4gIGZvciAobGV0IGd1ZXN0IG9mIHJlcy5ndWVzdHMpIHtcbiAgICBpZiAoZ3Vlc3QubmFtZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGxldCBjb21pbmcgPSBmb3JtRGF0YVsnY29taW5nLScgKyBndWVzdC5pZF0gPT09ICd5ZXMnO1xuICAgIGxldCBuYW1lID0gZm9ybURhdGFbJ25hbWUtJyArIGd1ZXN0LmlkXTtcbiAgICBpZiAoY29taW5nICYmICFuYW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGhhbmRsZURpZXRhcnlFeHBhbnNpb24oZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGhpZGVFbGUoZS50YXJnZXQpO1xuICBzaG93RWxlKGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZylcbiAgZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLmZvY3VzKCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUd1ZXN0TmFtZUlucHV0KGZvcm0kKSB7XG4gIGxldCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3Vlc3RzLXNhdmUnKTtcbiAgaWYgKGlzRm9ybVZhbGlkKGZvcm0kKSkge1xuICAgIGJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gIH0gZWxzZSB7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVHdWVzdFNhdmUoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgbGV0IHJlcyA9IExPQURFRF9SRVNFUlZBVElPTjtcbiAgaWYgKCFyZXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZ3Vlc3RTYXZlTG9hZGluZygpO1xuICBsZXQgZm9ybURhdGEgPSBnZXRGb3JtRGF0YShldmVudC50YXJnZXQpO1xuICBmb3IgKGxldCBndWVzdCBvZiByZXMuZ3Vlc3RzKSB7XG4gICAgZ3Vlc3QuY29taW5nID0gZm9ybURhdGFbJ2NvbWluZy0nICsgZ3Vlc3QuaWRdID09PSAneWVzJztcbiAgICBsZXQgbmFtZSA9IGZvcm1EYXRhWyduYW1lLScgKyBndWVzdC5pZF07XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGd1ZXN0Lm5hbWUgPSBuYW1lO1xuICAgIH1cbiAgICBndWVzdC5kaW5uZXIgPSBmb3JtRGF0YVsnZGlubmVyLScgKyBndWVzdC5pZF0gfHwgbnVsbDtcbiAgICBndWVzdC5kaWV0YXJ5ID0gZm9ybURhdGFbJ2RpZXRhcnktJyArIGd1ZXN0LmlkXSB8fCBudWxsO1xuICB9XG4gIHJlcy5yZXNlcnZhdGlvbi5ndWVzdHMgPSByZXMuZ3Vlc3RzO1xuICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIGxldCB1cmwgPSBgJHtIT1NUfS9yZXNlcnZhdGlvbi8ke3Jlcy5yZXNlcnZhdGlvbi5pZH1gO1xuICB4aHIub3BlbignUFVUJywgdXJsKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJylcbiAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGd1ZXN0U2F2ZURvbmVMb2FkaW5nKCk7XG4gICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgc2hvd1N1Y2Nlc3MocmVzLmd1ZXN0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dDYXRhc3Ryb3BoaWNGYWlsdXJlKCk7XG4gICAgfVxuICB9XG4gIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHJlcykpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSc3ZwVmlzaWJpbGl0eSgpIHtcbiAgbGV0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncnN2cC1uYW1lJykudmFsdWU7XG4gIGxldCBlbmFibGVkID0gbmFtZSAmJiBuYW1lLnRyaW0oKTtcbiAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyc3ZwLW9rJyk7XG4gIGlmIChlbmFibGVkKSB7XG4gICAgYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfSBlbHNlIHtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJzdnBTZWFyY2goKSB7XG4gIGhpZGUoJ3Jlc2VydmF0aW9uLWVycm9yJyk7XG4gIHJzdnBTZWFyY2hMb2FkaW5nKCk7XG4gIGxldCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JzdnAtbmFtZScpLnZhbHVlO1xuXG4gIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgbGV0IHVybCA9IEhPU1QgKyAnL3Jlc2VydmF0aW9uP25hbWU9JztcbiAgeGhyLm9wZW4oJ0dFVCcsIHVybCArIGVzY2FwZShuYW1lKSk7XG4gIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICByc3ZwU2VhcmNoRG9uZUxvYWRpbmcoKTtcbiAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICBzaG93UmVzZXJ2YXRpb24oSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgfSBlbHNlIGlmICh4aHIuc3RhdHVzID09PSA0MDQpIHtcbiAgICAgIHNob3dSZXNlcnZhdGlvbk5vdEZvdW5kKG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaG93Q2F0YXN0cm9waGljRmFpbHVyZSgpO1xuICAgIH1cbiAgfTtcbiAgeGhyLnNlbmQoKTtcbn1cblxuZnVuY3Rpb24gZ3Vlc3RTYXZlTG9hZGluZygpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2d1ZXN0cy1zYXZlJykuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICBoaWRlKCdndWVzdHMtc2F2ZS1sYWJlbCcpO1xuICBzaG93KCdndWVzdHMtc2F2ZS1zcGlubmVyJyk7XG59XG5cbmZ1bmN0aW9uIGd1ZXN0U2F2ZURvbmVMb2FkaW5nKCkge1xuICBzaG93KCdndWVzdHMtc2F2ZS1sYWJlbCcpO1xuICBoaWRlKCdndWVzdHMtc2F2ZS1zcGlubmVyJyk7XG59XG5cbmZ1bmN0aW9uIHNob3dTdWNjZXNzKGd1ZXN0cykge1xuICBoaWRlKCdzaG93LXJlc2VydmF0aW9uJyk7XG4gIGxldCBhbnlDb21pbmcgPSBndWVzdHMuZmlsdGVyKGcgPT4gZy5jb21pbmcpLmxlbmd0aDtcbiAgbGV0IHRleHQgPSBhbnlDb21pbmdcbiAgICA/ICdUaGFua3MgZm9yIFJTVlBpbmchIEV4Y2l0ZWQgdG8gc2VlIHlvdSAgYXQgdGhlIHdlZGRpbmchJ1xuICAgIDogXCJTb3JyeSB5b3UgY2FuJ3QgbWFrZSBpdCEgSG9wZSB0byBzZWUgeW91IHNvb24hXCI7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWNjZXNzJykuaW5uZXJUZXh0ID0gdGV4dDtcbiAgc2hvdygnc3VjY2VzcycpO1xufVxuXG5mdW5jdGlvbiBzaG93Q2F0YXN0cm9waGljRmFpbHVyZSgpIHtcbiAgbGV0IGVycm9yRWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2VydmF0aW9uLWVycm9yJyk7XG4gIGVycm9yRWxlLmlubmVySFRNTCA9IGBcbiAgICBTb21ldGhpbmcgYmFkIGhhcHBlbmVkLiBJdCdzIHByb2JhYnkgQW5keSdzIGZhdWx0Ljxicj5cbiAgICBUcnkgYWdhaW4gbGF0ZXIsIG9yIGNvbnRhY3QgQW5keSBvciBDYXJvbCB3aXRoIHlvdXIgUlNWUC5cbiAgYDtcbiAgc2hvd0VsZShlcnJvckVsZSk7XG4gIGhpZGUoJ3JzdnAtbmFtZScpO1xufVxuXG5mdW5jdGlvbiByc3ZwU2VhcmNoRG9uZUxvYWRpbmcoKSB7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyc3ZwLW9rJykucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICBoaWRlKCdyc3ZwLW9rLXNwaW5uZXInKTtcbiAgc2hvdygncnN2cC1vay1sYWJlbCcpO1xufVxuXG5mdW5jdGlvbiByc3ZwU2VhcmNoTG9hZGluZygpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JzdnAtb2snKS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gIHNob3coJ3JzdnAtb2stc3Bpbm5lcicpO1xuICBoaWRlKCdyc3ZwLW9rLWxhYmVsJyk7XG59XG5cbmZ1bmN0aW9uIHNob3dSZXNlcnZhdGlvbk5vdEZvdW5kKG5hbWUpIHtcbiAgbGV0IGVycm9yRWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2VydmF0aW9uLWVycm9yJyk7XG4gIGVycm9yRWxlLmlubmVySFRNTCA9IGBcbiAgICBDb3VsZCBub3QgZmluZCB0aGUgZ3Vlc3QgPHNwYW4gY2xhc3M9XCJuYW1lXCI+JHtuYW1lfTwvc3Bhbj4uXG4gICAgUGxlYXNlIHRyeSBhZ2FpbiB3aXRoIHlvdXIgZnVsbCBuYW1lLlxuICBgO1xuICBzaG93RWxlKGVycm9yRWxlKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JzdnAtbmFtZScpLmZvY3VzKCk7XG59XG5cbmZ1bmN0aW9uIHNob3dBbHJlYWR5UnN2cGQoZ3Vlc3RzKSB7XG4gIGZvciAobGV0IGd1ZXN0IG9mIGd1ZXN0cykge1xuICAgIGlmIChndWVzdC5jb21pbmcgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGxldCBlcnJvckVsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNlcnZhdGlvbi1lcnJvcicpO1xuICBlcnJvckVsZS5pbm5lckhUTUwgPSBgXG4gICAgSXQgbG9va3MgbGlrZSB5b3UgYWxyZWFkeSBSU1ZQJ2QuXG4gICAgPGJyPlxuICAgIElmIHdlIG1hZGUgYSBtaXN0YWtlIG9yIHlvdSBuZWVkIHRvIGNoYW5nZSB5b3VyIFJTVlAsIHBsZWFzZVxuICAgIGNvbnRhY3QgQW5keSBvciBDYXJvbCBkaXJlY3RseS5cbiAgYDtcbiAgc2hvd0VsZShlcnJvckVsZSk7XG4gIGhpZGUoJ3JzdnAtb2snKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JzdnAtbmFtZScpLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc2hvd1Jlc2VydmF0aW9uKGpzb24pIHtcbiAgTE9BREVEX1JFU0VSVkFUSU9OID0ganNvbjtcbiAgbGV0IGd1ZXN0cyA9IGpzb24uZ3Vlc3RzO1xuXG4gIC8vIGlmIHRoZSBndWVzdHMgaGF2IGFscmVhZHkgcnN2cCdkIHNob3cgYW4gZXJyb3JcbiAgaWYgKHNob3dBbHJlYWR5UnN2cGQoZ3Vlc3RzKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGhpZGUoJ2ZpbmQtcmVzZXJ2YXRpb24nKTtcbiAgc2hvdygnc2hvdy1yZXNlcnZhdGlvbicpO1xuICBsZXQgZ3Vlc3RMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2d1ZXN0LWxpc3QnKTtcbiAgZm9yIChsZXQgZ3Vlc3Qgb2YgZ3Vlc3RzKSB7XG4gICAgbGV0IG5hbWVIdG1sO1xuICAgIGlmIChndWVzdC5uYW1lKSB7XG4gICAgICBuYW1lSHRtbCA9IGd1ZXN0Lm5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWVIdG1sID0gYDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lLSR7Z3Vlc3QuaWR9XCIgcGxhY2Vob2xkZXI9XCJuYW1lIG9mICsxXCIgLz5gO1xuICAgIH1cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJndWVzdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmFtZVwiPiR7bmFtZUh0bWx9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyc3ZwXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbWluZ1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInF1ZXN0aW9uXCI+UlNWUDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFuc3dlclwiPlxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgICAgICAgICAgIG5hbWU9XCJjb21pbmctJHtndWVzdC5pZH1cIlxuICAgICAgICAgICAgICAgIGlkPVwiY29taW5nLSR7Z3Vlc3QuaWR9LXllc1wiXG4gICAgICAgICAgICAgICAgdmFsdWU9XCJ5ZXNcIlxuICAgICAgICAgICAgICAgIGNoZWNrZWQ9XCJjaGVja2VkXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY29taW5nLSR7Z3Vlc3QuaWR9LXllc1wiPkhhcHBpbHkgYWNjZXB0czwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJyYWRpb1wiXG4gICAgICAgICAgICAgICAgbmFtZT1cImNvbWluZy0ke2d1ZXN0LmlkfVwiXG4gICAgICAgICAgICAgICAgaWQ9XCJjb21pbmctJHtndWVzdC5pZH0tbm9cIlxuICAgICAgICAgICAgICAgIHZhbHVlPVwibm9cIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjb21pbmctJHtndWVzdC5pZH0tbm9cIj5SZWdyZXRmdWxseSBkZWNsaW5lczwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlubmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicXVlc3Rpb25cIj5cbiAgICAgICAgICAgICAgRGlubmVyXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnN3ZXJcIj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwiZGlubmVyLSR7Z3Vlc3QuaWR9XCJcbiAgICAgICAgICAgICAgICBpZD1cImRpbm5lci0ke2d1ZXN0LmlkfS1iZWVmXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT1cImJlZWZcIlxuICAgICAgICAgICAgICAgIGNoZWNrZWQ9XCJjaGVja2VkXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZGlubmVyLSR7Z3Vlc3QuaWR9LWJlZWZcIj5DaGlsaSBjaXRydXMgc2hvcnQgcmliPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwiZGlubmVyLSR7Z3Vlc3QuaWR9XCJcbiAgICAgICAgICAgICAgICBpZD1cImRpbm5lci0ke2d1ZXN0LmlkfS1maXNoXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT1cImZpc2hcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJkaW5uZXItJHtndWVzdC5pZH0tZmlzaFwiPk1pc28gcm9hc3RlZCBzYWxtb248L2xhYmVsPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlldGFyeVwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24+RGlldGFyeSByZXN0cmljdGlvbnM/PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiaGlkZGVuXCIgbmFtZT1cImRpZXRhcnktJHtndWVzdC5pZH1cIiBwbGFjZWhvbGRlcj1cIkRpZXRhcnkgcmVzdHJpY3Rpb25zP1wiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+YC50cmltKCk7XG4gICAgZ3Vlc3RMaXN0LmFwcGVuZENoaWxkKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICB9XG4gIGhhbmRsZUd1ZXN0TmFtZUlucHV0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdndWVzdHMnKSk7XG4gIGJpbmRHdWVzdEV2ZW50cygpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3Vlc3QnKS5mb3JFYWNoKGcgPT4gZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJykpXG59XG5cbmluaXQoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3JzdnAuanNcbi8vIG1vZHVsZSBpZCA9IDQ4XG4vLyBtb2R1bGUgY2h1bmtzID0gMiIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3JzdnAuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3JzdnAuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3JzdnAuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9yc3ZwLmNzc1xuLy8gbW9kdWxlIGlkID0gNDlcbi8vIG1vZHVsZSBjaHVua3MgPSAyIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiNDQyN2YxZWE1MGFlZmQ3ZThhZTdiYjhlYzJiMjIzOTgudHRmXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvZm9udHMvbXJzZWF2ZXMudHRmXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA1IDYiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiUm9ib3RvXFxcIiwgc2Fucy1zZXJpZjtcXG59XFxuXFxuOnJvb3Qge1xcbiAgLS1obC1jb2xvcjogIzRhNzI5MjtcXG59XFxuXFxuI25hdiB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxufVxcblxcbi5sb2dvID4gdGFibGUge1xcbiAgZm9udC1zaXplOiBjYWxjKDMycHggKyA0dmgpO1xcbn1cXG5cXG4ubG9nbyBhIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuLmxvZ28gLmhsIHtcXG4gIC13ZWJraXQtdGV4dC1zdHJva2Utd2lkdGg6IDFweDtcXG4gIC13ZWJraXQtdGV4dC1zdHJva2UtY29sb3I6IHZhcigtLWhsLWNvbG9yKTtcXG59XFxuXFxuLnRpdGxlIHtcXG4gIG1hcmdpbi10b3A6IDA7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG59XFxuXFxuLnRpdGxlIGgxIHtcXG4gIGZvbnQtc2l6ZTogNnZoO1xcbn1cXG5cXG4ucmVzZXJ2YXRpb24gPiAucGFuZWwge1xcbiAgd2lkdGg6IDEyZW07XFxuICBmb250LXNpemU6IDI4cHg7XFxuICBtaW4td2lkdGg6IDMwdnc7XFxuICBtYXgtd2lkdGg6IDk1dnc7XFxuICBtYXJnaW4tYm90dG9tOiAyZW07XFxufVxcblxcbiNzdWNjZXNzIHtcXG4gIHRleHQtc2hhZG93OiAuMDVlbSAuMDVlbSAuMDVlbSB2YXIoLS1obC1jb2xvcik7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIC43KTtcXG4gIHBhZGRpbmc6IC41ZW0gMDtcXG59XFxuXFxuQG1lZGlhXFxuc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0MDBweCkge1xcbiAgLnJlc2VydmF0aW9uID4gKiB7XFxuICAgIGZvbnQtc2l6ZTogMjRweDtcXG4gIH1cXG59XFxuXFxuLnJlc2VydmF0aW9uIGlucHV0LCAucmVzZXJ2YXRpb24gYnV0dG9uLCAucmVzZXJ2YXRpb24gdGV4dGFyZWEge1xcbiAgZm9udC1zaXplOiBpbmhlcml0O1xcbiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XFxufVxcblxcbi5yZXNlcnZhdGlvbiAubmFtZSB7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgZ3JleTtcXG4gIG1hcmdpbi1ib3R0b206IC40ZW07XFxufVxcblxcbi5yZXNlcnZhdGlvbiAucnN2cCB7XFxuICBmb250LXNpemU6IDc1JTtcXG59XFxuXFxuLnJlc2VydmF0aW9uIC5yc3ZwID4gKiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbn1cXG5cXG4ucmVzZXJ2YXRpb24gLnJzdnAgLmNvbWluZyB7XFxuICBtYXJnaW4tYm90dG9tOiAuN2VtO1xcbn1cXG5cXG4ucnN2cCAuYW5zd2VyIHtcXG4gIGZsZXgtZ3JvdzogLjI7XFxufVxcblxcbi5yc3ZwIC5hbnN3ZXIgPiBsYWJlbCwgLnJzdnAgLmFuc3dlciA+IGRpdiB7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgbWFyZ2luLWJvdHRvbTogLjNlbTtcXG59XFxuXFxuLnJzdnAgbGFiZWwge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICB3aWR0aDogZml0LWNvbnRlbnQ7XFxufVxcblxcbi5yc3ZwIC5kaWV0YXJ5IHtcXG4gIG1hcmdpbi1sZWZ0OiAxLjJlbTtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxufVxcblxcbi5yc3ZwIC5kaWV0YXJ5IHRleHRhcmVhIHtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xcbiAgd2lkdGg6IDllbTtcXG59XFxuXFxuLnJzdnAgLmRpZXRhcnkgPiBidXR0b24ge1xcbiAgZGlzcGxheTogaW5saW5lO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2FmYWZhZjtcXG4gIHdpZHRoOiBmaXQtY29udGVudDtcXG5cXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbn1cXG5cXG4ucnN2cCAuZGlldGFyeSA+IGJ1dHRvbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLnJlc2VydmF0aW9uIGJ1dHRvbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuI3Jlc2VydmF0aW9uLWVycm9yLCAucmVzZXJ2YXRpb24gaW5wdXRbdHlwZT10ZXh0XSwgLnJlc2VydmF0aW9uIGJ1dHRvbiB7XFxuICBtYXJnaW4tYm90dG9tOiAxdmg7XFxufVxcblxcbiNyZXNlcnZhdGlvbi1lcnJvciB7XFxuICBjb2xvcjogI2U5MWU2MztcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjcpO1xcbiAgZm9udC1zaXplOiA3NSU7XFxuICBwYWRkaW5nOiAuMmVtIDA7XFxufVxcblxcbi5yZXNlcnZhdGlvbiBpbnB1dFt0eXBlPXRleHRdLCAucmVzZXJ2YXRpb24gYnV0dG9uIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBib3JkZXI6IG5vbmU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBvcGFjaXR5OiAwO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5pbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJdICsgbGFiZWwge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5pbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJdICsgbGFiZWw6OmJlZm9yZSB7XFxuICBjb250ZW50ICAgICAgIDogJ1xcXFwyNzEzJztcXG4gIGRpc3BsYXkgICAgICAgOiBpbmxpbmUtYmxvY2s7XFxuICB3aWR0aCAgICAgICAgIDogMWVtO1xcbiAgY29sb3IgICAgICAgICA6IHJnYmEoMCwwLDAsMCk7XFxuICBmb250LXNpemUgICAgIDogLjhlbTtcXG4gIGxpbmUtaGVpZ2h0ICAgOiAxZW07XFxuICBmb250LXdlaWdodCAgIDogYm9sZDtcXG4gIG1hcmdpbiAgICAgICAgOiAuMjVlbTtcXG4gIGJvcmRlci1ib3R0b20gOiAuMDVlbSBzb2xpZCBibGFjaztcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxufVxcblxcbmlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl06Y2hlY2tlZCArIGxhYmVsOjpiZWZvcmUge1xcbiAgY29sb3I6IHZhcigtLWhsLWNvbG9yKTtcXG59XFxuXFxuaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXTpjaGVja2VkICsgbGFiZWwge1xcbiAgdGV4dC1zaGFkb3c6IDFweCAxcHggMXB4IHZhcigtLWhsLWNvbG9yKTtcXG59XFxuXFxuaW5wdXQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAuNyk7XFxufVxcblxcbmlucHV0OmZvY3VzIHtcXG4gIG91dGxpbmUtY29sb3I6IHZhcigtLWhsLWNvbG9yKTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjkpO1xcbn1cXG5cXG5idXR0b25bZGlzYWJsZWRdIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JleTtcXG59XFxuXFxuYnV0dG9uIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhsLWNvbG9yKTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLmd1ZXN0IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgLjcpO1xcbiAgbWFyZ2luLWJvdHRvbTogLjVlbTtcXG4gIG1heC1oZWlnaHQ6IDA7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgdHJhbnNpdGlvbjogbWF4LWhlaWdodCAxcztcXG4gIHBhZGRpbmc6IC4zZW07XFxufVxcblxcbi5ndWVzdC52aXNpYmxlIHtcXG4gIG1heC1oZWlnaHQ6IDEyZW07XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIhLi9zcmMvcnN2cC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMiIsImZ1bmN0aW9uIG5hdigpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5pdF9uYXZfYnV0dG9uKCkge1xuICBuYXYoKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG5hdlRvZ2dsZUhhbmRsZXIpO1xufVxuXG5mdW5jdGlvbiBuYXZUb2dnbGVIYW5kbGVyKCkgIHtcbiAgbmF2KCkuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xufVxuXG5leHBvcnQge1xuICBuYXZUb2dnbGVIYW5kbGVyXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9uYXYuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDUgNiIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjNhMDlhM2MyNzU2OTYzZThiM2RjN2U2ZWM4ODMwMTRjLmpwZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ltZy9iZzUuanBnXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMiAzIDUiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9pbmRleC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vaW5kZXguY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2luZGV4LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMiAzIDUiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiBNcnNFYXZlcywgR2VvcmdpYSwgc2VyaWY7XFxufVxcblxcbmh0bWwge1xcbiAgYmFja2dyb3VuZDogdXJsKFwiICsgcmVxdWlyZShcIi4vaW1nL2JnNS5qcGdcIikgKyBcIikgbm8tcmVwZWF0IGNlbnRlciBjZW50ZXIgZml4ZWQ7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbn1cXG5cXG4udGl0bGUge1xcbiAgcGFkZGluZzogNHZoIDA7XFxuICBtYXJnaW4tdG9wOiAyNXZoO1xcbiAgd2lkdGg6IDEwMCU7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFxuICBjb2xvcjogYmxhY2s7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NiwgMjU2LCAyNTYsIC40KTtcXG59XFxuXFxuLnRpdGxlID4gKiB7XFxuICBtYXJnaW46IDN2aCBhdXRvO1xcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xcbn1cXG5cXG4udGl0bGUgaDEge1xcbiAgZm9udC13ZWlnaHQ6IDEwMDA7XFxuICBmb250LXNpemU6IDEwdmg7XFxuICBmb250LWZhbWlseTogYm9tYnNoZWxsO1xcbn1cXG5cXG4ubG9nbyB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5sb2dvIHRhYmxlIHtcXG4gIGZvbnQtZmFtaWx5OiBNcnNFYXZlcztcXG4gIGZvbnQtc2l6ZTogNnZoO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5cXG4uaGwge1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4uY291bnRkb3duIHtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIGJvdHRvbTogNXB4O1xcbiAgcmlnaHQ6IDEwcHg7XFxuICBmb250LXNpemU6IDN2aDtcXG59XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL3NyYy9pbmRleC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAyIDMgNSJdLCJzb3VyY2VSb290IjoiIn0=