'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.L20nElement = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // react-l20n.js
// version: 0.0.11
// author: Marc Selman
// license: MIT

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('l20n');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var L20n = function () {
	function L20n() {
		_classCallCheck(this, L20n);

		this.contexts = new Map();
		this.defaultLocale = 'en';
		this.fallbackToDefault = true;
	}

	_createClass(L20n, [{
		key: 'load',
		value: function load(locale, ftl) {
			var ctx = this.contexts.get(locale);
			if (!ctx) {
				ctx = new Intl.MessageContext(locale);
				this.contexts.set(locale, ctx);
			}

			var errors = ctx.addMessages(ftl);
			if (errors.length) {
				console.log(errors);
			}
		}
	}, {
		key: 'getRaw',
		value: function getRaw(key, props) {
			var locale = arguments.length <= 2 || arguments[2] === undefined ? this.defaultLocale : arguments[2];

			var ctx = this.contexts.get(locale);
			if (!ctx) {
				if (this.fallbackToDefault) {
					ctx = this.contexts.get(this.defaultLocale);
				}

				if (!ctx) {
					return 'Locale \'' + locale + '\' missing';
				}
			}

			var template = ctx.messages.get(key);
			if (this.fallbackToDefault && !template && ctx.lang != this.defaultLocale) {
				return this.getRaw(key, props, this.defaultLocale);
			}

			var _ctx$format = ctx.format(template, props);

			var _ctx$format2 = _slicedToArray(_ctx$format, 2);

			var message = _ctx$format2[0];
			var errors = _ctx$format2[1];


			if (errors.length > 0) {
				return undefined;
			}

			return message.replace(String.fromCharCode(8296), '').replace(String.fromCharCode(8297), '');
		}
	}, {
		key: 'get',
		value: function get(key, props) {
			var locale = arguments.length <= 2 || arguments[2] === undefined ? this.defaultLocale : arguments[2];

			var message = this.getRaw(key, props, locale);
			return _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: message } });
		}
	}, {
		key: 'getContext',
		value: function getContext() {
			var locale = arguments.length <= 0 || arguments[0] === undefined ? this.defaultLocale : arguments[0];

			var ctx = this.contexts.get(locale);
			if (!ctx) {
				if (this.fallbackToDefault) {
					ctx = this.contexts.get(this.defaultLocale);
				}

				if (!ctx) {
					return null;
				}
			}

			return ctx;
		}
	}]);

	return L20n;
}();

var L20nElement = exports.L20nElement = function (_React$Component) {
	_inherits(L20nElement, _React$Component);

	function L20nElement(props) {
		_classCallCheck(this, L20nElement);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(L20nElement).call(this, props));
	}

	_createClass(L20nElement, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			this.attrs = Object.assign({}, this.props);
			delete this.attrs['id'];
			delete this.attrs['renderAs'];
			delete this.attrs['locale'];
			delete this.attrs['elementRef'];

			var value = l20n.getRaw(this.props.id, {}, this.props.locale);
			if (value) {
				this.attrs['defaultValue'] = value;
			}

			var ctx = l20n.getContext(this.props.locale);
			if (ctx) {
				var template = ctx.messages.get(this.props.id);
				if (template && template.traits) {
					var attributes = template.traits.filter(function (t) {
						return t.key.ns == 'html';
					}).map(function (t) {
						return [t.key.name, t.val];
					});
					attributes.forEach(function (a) {
						_this2.attrs[a[0]] = a[1];
					});
				}
			}

			return _react2.default.createElement(
				this.props.renderAs,
				_extends({ ref: this.props.elementRef }, this.attrs),
				this.props.children
			);
		}
	}]);

	return L20nElement;
}(_react2.default.Component);

L20nElement.propTypes = {
	id: _react2.default.PropTypes.string.isRequired,
	renderAs: _react2.default.PropTypes.string.isRequired,
	locale: _react2.default.PropTypes.string
};

var l20n = new L20n();

exports.default = l20n;
