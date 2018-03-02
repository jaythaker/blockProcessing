import $  = require("jquery")

class CallbackMetdata {
    public index: number;
    public functor: any[];
}
interface Map {
    [key: string]: CallbackMetdata;
}
class blockProcessing {
    private callbacks: Map;
    private defaultTimeout: number = 30000;

    public registerCallbacks(processingType: string, callback) {
        if (this.callbacks[processingType] === undefined) {
            this.callbacks[processingType] = new CallbackMetdata();
        }
        this.callbacks[processingType].functor.push(callback);
    }

    public startProcessing(processingType: string) {
        var dfd = jQuery.Deferred();

        // TODO: Notify the user that we are starting the process.
        var callbackMetadata = this.callbacks[processingType];
        callbackMetadata.index = 0;
        this.processNext(processingType, dfd);

        $.when(dfd).then(
            function (status) {
                // TODO: Notify user that we timed out
            },
            function (status) {
                // TODO: Notify user on error
            },
            function (status) {
                this.processNext(processingType, dfd);
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

    private processNext(processingType: string, dfd: any) {
        var callbackInfo = this.callbacks[processingType];

        if (callbackInfo.index > callbackInfo.functor.length - 1) {
            dfd.resolve();
            return;
        }
        callbackInfo.functor[callbackInfo.index++](dfd);
    }
}