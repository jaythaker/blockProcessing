"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var CallbackMetdata = /** @class */ (function () {
    function CallbackMetdata() {
    }
    return CallbackMetdata;
}());
var blockProcessing = /** @class */ (function () {
    function blockProcessing() {
        this.defaultTimeout = 30000;
    }
    blockProcessing.prototype.registerCallbacks = function (processingType, callback) {
        if (this.callbacks[processingType] === undefined) {
            this.callbacks[processingType] = new CallbackMetdata();
        }
        this.callbacks[processingType].functor.push(callback);
    };
    blockProcessing.prototype.startProcessing = function (processingType) {
        var dfd = jQuery.Deferred();
        // TODO: Notify the user that we are starting the process.
        var callbackMetadata = this.callbacks[processingType];
        callbackMetadata.index = 0;
        this.processNext(processingType, dfd);
        $.when(dfd).then(function (status) {
            // TODO: Notify user that we timed out
        }, function (status) {
            // TODO: Notify user on error
        }, function (status) {
            this.processNext(processingType, dfd);
        });
        setTimeout(function () {
            if (dfd.state() === "pending") {
                dfd.reject();
            }
            else {
                dfd.resolve();
            }
        }, this.defaultTimeout);
    };
    blockProcessing.prototype.processNext = function (processingType, dfd) {
        var callbackInfo = this.callbacks[processingType];
        if (callbackInfo.index > callbackInfo.functor.length - 1) {
            dfd.resolve();
            return;
        }
        callbackInfo.functor[callbackInfo.index++](dfd);
    };
    return blockProcessing;
}());
//# sourceMappingURL=blockProcessing.js.map