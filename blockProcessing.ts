// Import external library references
import $ = require("jquery")

// Import internal library references
import { CallbackMetdata } from "./common"
import { map } from "./common"

class blockProcessing {
    private callbacks: map<string, CallbackMetdata>;
    private defaultTimeout: number = 30000;

    public Rejected: Function;
    public Completed: Function;

    constructor(rejected: Function, completed: Function) {
        this.Rejected = rejected;
        this.Completed = completed;
    }

    public registerCallbacks(processingType: string, callback : Function) {
        if (this.callbacks[processingType] === undefined) {
            this.callbacks[processingType] = new CallbackMetdata();
        }
        this.callbacks[processingType].functor.push(callback);
    }

    public startProcessing(processingType: string) {
        var dfd = jQuery.Deferred();

        var callbackMetadata = this.callbacks[processingType];
        callbackMetadata.index = 0;
        this.processNext(callbackMetadata, dfd);

        $.when(dfd).then(
            function (status) {
                if (this.Rejected) {
                    this.Rejected();
                }
            },
            function (status) {
                if (this.Completed) {
                    this.Completed();
                }
            },
            function (status) {
                this.processNext(callbackMetadata, dfd);
            }
        );
        setTimeout(function () {
            if (dfd.state() === "pending") {
                dfd.reject();
            }
            else {
                dfd.resolve();
            }
        }, this.defaultTimeout);
    }

    private processNext(callbackMetadata: CallbackMetdata, dfd: JQueryDeferred<any>) {
        if (callbackMetadata.index > callbackMetadata.functor.length - 1) {
            dfd.resolve();
            return;
        }
        callbackMetadata.functor[callbackMetadata.index++](dfd);
    }
}