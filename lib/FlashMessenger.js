/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import $ from 'jquery';
import screenUtils from '@arturdoruch/util/lib/screen-utils';
import objectUtils from '@arturdoruch/util/lib/object-utils';
import typeChecker from '@arturdoruch/util/lib/type-checker';
import HtmlElement from "@arturdoruch/html/lib/element/HtmlElement";
import elementFactory from "@arturdoruch/html/lib/element/html-element-factory";

let defaultOptions = {
    elementsClassPrefix: 'flash-message',
    containerClass: null,
    removeAfter: 5,
    removeOnClick: true,
    positionVertical: 'top',
    positionHorizontal: 'center',
    //updateContainerPos: true,
};

/**
 * Sets global options for the flash message HTML elements.
 *
 * @param {{}} options
 * @param {string}   [options.elementsClassPrefix = 'flash-message'] The class name prefix of the message container and item elements.
 * @param {int|null} [options.removeAfter = 5] Time (in seconds) after message item will be removed form the container.
 *                                             If null message item will not be removed until will be clicked.
 * @param {boolean}  [options.removeOnClick = true] Specifies whether the message item should be removed after clicking.
 * @param {string}   [options.positionVertical = 'top'] Vertical position of displayed message container. One of: "top", "center", "bottom".
 * @param {string}   [options.positionHorizontal = 'center'] Horizontal position of displayed message container. One of: "left", "center", "right".
 */
export function setOptions(options) {
    defaultOptions = Object.assign(defaultOptions,
        objectUtils.filter(options, ['elementsClassPrefix', 'removeAfter', 'removeOnClick', 'positionVertical', 'positionHorizontal'])
    );
}

/**
 * Displays flash messages on the screen.
 */
export default class FlashMessenger {
    /**
     * @todo Slide message box from outside the viewport.
     *
     * @param {object}   [options]
     * @param {string}   [options.containerClass] Adds custom class name for message container div element.
     * @param {int|null} [options.removeAfter = 5] Time (in seconds) after message item should be removed form the container.
     *                                             If null message item will not be removed until will be clicked.
     * @param {boolean}  [options.removeOnClick = true] Specifies whether the message item will be removed after clicking.
     * @param {string}   [options.positionVertical = 'top'] Vertical position of displayed message container. One of: "top", "center", "bottom".
     * @param {string}   [options.positionHorizontal = 'center'] Horizontal position of displayed message container. One of: "left", "center", "right".     *
     */
    constructor(options = {}) {
        this._opts = Object.assign({}, defaultOptions,
            objectUtils.filter(options, ['containerClass', 'removeAfter', 'removeOnClick', 'positionVertical', 'positionHorizontal'])
        );

        this._messages = [];
        this._container = new HtmlElement('div', {
            class: [this._opts.elementsClassPrefix + '__container', this._opts.containerClass]
        }).appendTo().hide();
    }

    /**
     * Adds a message to the stack.
     *
     * @param {string} type The message type, e.g. "error", "success", "notice", ect.
     * @param {string} message
     */
    add(type, message) {
        if (typeChecker.isString(type) && typeChecker.isString(message)) {
            this._messages.push(new Message(type, message));
        }
    }

    /**
     * Displays stack messages on the screen.
     *
     * @param {string} [type] The message type.
     * @param {int} [removeAfter] Time (in seconds) after message item should be removed form the container.
     *                            Overrides "removeAfter" options property only for this messages set.
     */
    display(type, removeAfter) {
        if (this._messages.length === 0) {
            return;
        }

        const self = this;
        self._appendMessageItems(type);
        self._setContainerPosition();

        self._container.$el.fadeIn(200, function() {
            self._attachRemoveEvent(removeAfter);
        });
    }

    _appendMessageItems(type) {
        for (let i = 0; i < this._messages.length; i++) {
            let message = this._messages[i];

            if (!type || message.type === type) {
                this._container.el.appendChild(
                    elementFactory.create('div', message.message, [this._opts.elementsClassPrefix + '__item', message.type])
                );

                delete this._messages[i];
            }
        }
    }

    /**
     * @param {Number} removeAfter
     */
    _attachRemoveEvent(removeAfter) {
        let intervals = [],
            $items = this._container.$el.find('div'),
            self = this;

        removeAfter = removeAfter !== undefined ? removeAfter : this._opts.removeAfter;

        for (let i = 0; i < $items.length; i++) {
            let $item = $($items[i]);

            if (this._opts.removeOnClick === true) {
                $item.one('click', function () {
                    clearTimeout(intervals[i]);
                    self._removeItem($item);
                });
            }

            if (removeAfter > 0) {
                intervals[i] = setTimeout(function () {
                    clearTimeout(intervals[i]);
                    self._removeItem($item);
                }, removeAfter * 1000);
            }
        }
    }

    /**
     * Removes message item form the container.
     *
     * @param {jQuery} $item
     */
    _removeItem($item) {
        let self = this;

        $item.fadeOut(200, function() {
            $item.remove();

            if (self._container.el.children.length === 0) {
                self._container.hide();
            }/* else if (self._opts.updateContainerPos === true) {
                self._setContainerPosition();
            }*/
        });
    }

    _setContainerPosition() {
        screenUtils.setElementPosition(this._container.el, this._opts.positionVertical, this._opts.positionHorizontal);
    }
}

function Message(type, message) {
    this.type = type;
    this.message = message;
}
