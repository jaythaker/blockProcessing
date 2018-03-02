"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import external library references
var $ = require("jquery");
// Import internal library references
var common_1 = require("./common");
var blockProcessing = /** @class */ (function () {
    function blockProcessing(rejected, completed) {
        this.defaultTimeout = 30000;
        this.Rejected = rejected;
        this.Completed = completed;
    }
    blockProcessing.prototype.registerCallbacks = function (processingType, callback) {
        if (this.callbacks[processingType] === undefined) {
            this.callbacks[processingType] = new common_1.CallbackMetdata();
        }
        this.callbacks[processingType].functor.push(callback);
    };
    blockProcessing.prototype.startProcessing = function (processingType) {
        var dfd = $.Deferred();
        var callbackMetadata = this.callbacks[processingType];
        callbackMetadata.index = 0;
        this.processNext(callbackMetadata, dfd);
        $.when(dfd).then(function (status) {
            // This will be last function called when any of the chained function will reject it.
            if (this.Rejected) {
                this.Rejected();
            }
        }, function (status) {
            // This will be the last function call when the chain has completed processing.
            if (this.Completed) {
                this.Completed();
            }
        }, function (status) {
            this.processNext(callbackMetadata, dfd);
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
    blockProcessing.prototype.processNext = function (callbackMetadata, dfd) {
        if (callbackMetadata.index > callbackMetadata.functor.length - 1) {
            dfd.resolve();
            return;
        }
        callbackMetadata.functor[callbackMetadata.index++](dfd);
    };
    return blockProcessing;
}());
//# sourceMappingURL=blockProcessing.js.map