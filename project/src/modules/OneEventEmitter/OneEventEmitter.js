"use strict";

const {
  statusOfCall,
  invokeSync,
  invokeAsync,
  invokeSyncOrAsync
} = require("./../launcherOfMethods");

const statusOfCall_succes = statusOfCall.succes;

const _descriptiorsOfListeners = "_";

const entryAboutListener_listener = "_",
      entryAboutListener_isAsync = '_a';

const OneEventEmitter = class {
  constructor() {
    this[_descriptiorsOfListeners] = [];
  }
  
  addListener(listener, isAsync) {
    if (this.hasListener(listener)) {
      return;
    }
    const descriptor = {
      [entryAboutListener_listener]: listener
    };
    if (isAsync) {
      descriptor[entryAboutListener_isAsync] = true;
    }
    this[_descriptiorsOfListeners].push(descriptor);
  }
  
  hasListener(listener) {
    return this[_descriptiorsOfListeners].findIndex(function(descOfListener) {
      return descOfListener[entryAboutListener_listener] === listener;
    }) !== -1;
  }
  
  hasListeners() {
    return this[_descriptiorsOfListeners].length !== 0;
  }
  
  async _emitAndGetFailed() {
    const args = arguments,
          resultsOfCalls = await this._callListeners(args);
    return _extractFailedResults(resultsOfCalls);
  }
  
  _callListeners(args) {    
    const emittings = [],
          context = null;
    let listener, isAsync, fnToCallListenerForGettingReport;
    
    for (const descOfListener of this[_descriptiorsOfListeners]) {
      listener = descOfListener[entryAboutListener_listener];
      isAsync = descOfListener[entryAboutListener_isAsync];

      if (isAsync === undefined) {
        fnToCallListenerForGettingReport = _callAsyncOrSyncListener;
      } else if (isAsync === true) {
        fnToCallListenerForGettingReport = _callAsyncListener;
      } else if (isAsync === false) {
        fnToCallListenerForGettingReport = _callSyncListener;
      } else {
        fnToCallListenerForGettingReport = _callAsyncOrSyncListener;
      }

      emittings.push(fnToCallListenerForGettingReport(context, listener, args));
    }
    return Promise.all(emittings);
  }
};

const createAsyncFnToCallListenerAndGetReport = (function() {
  const callListenerAndGetReport = async function(invokeFn, context, listener, args) {
    const result = await invokeFn(context, listener, args);
    return _createStatsFromResultOfCall(result, listener);
  };

  return function(invokeFn) {
    return callListenerAndGetReport.bind(null, invokeFn);
  };
})();

const _callAsyncListener = createAsyncFnToCallListenerAndGetReport(invokeAsync),
      _callAsyncOrSyncListener = createAsyncFnToCallListenerAndGetReport(invokeSyncOrAsync);

const _callSyncListener = async function(context, listener, args) {
  const result = launcherOfProcedure.invokeSync(context, listener, args);
  return _createStatsFromResultOfCall(result, listener);
};

const _createStatsFromResultOfCall = async function(resultOfCall, listener) {
  return resultOfCall.status === statusOfCall_succes ?
    reportAboutSuccesCall : 
    {isSucces: false, listener, error: resultOfCall.error};
};

const reportAboutSuccesCall = Object.freeze({isSucces: true})

const _extractFailedResults = function(resultsOfCalls) {
  const len = resultsOfCalls.length,
        failed = [];
        
  let counter = 0,
      statusOfCallListener;
  
  for (; counter < len; counter += 1) {
    statusOfCallListener = resultsOfCalls[counter];
    if (statusOfCallListener.isSucces) {
      continue;
    } else {
      failed.push({
        listener: statusOfCallListener.listener,
        error: statusOfCallListener.error
      });
    }
  }
  
  return failed.length ? failed : statusOfSuccesEmit;
};

const statusOfSuccesEmit = null;

OneEventEmitter.statusOfSuccesEmit = statusOfSuccesEmit;

module.exports = OneEventEmitter;
