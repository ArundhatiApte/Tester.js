"use strict";

const statusOfCall_succes = 1,
      statusOfCall_error = 2,
      statusOfCall_notAsync = 3;

const statusOfCall = Object.freeze({
  succes: statusOfCall_succes,
  error: statusOfCall_error,
  notAsync: statusOfCall_notAsync
});

const result_succes = Object.freeze({
  status: statusOfCall_succes
});
const result_notAsync = Object.freeze({
  status: statusOfCall_notAsync
});

const launcherOfMethods = {
  statusOfCall,
  
  invokeSync(context, method, args) {
    try {
      args ? 
        method.apply(context, args) :
        method.call(context);
      return result_succes;
    } catch(error) {
      return _createReportAboutError(error);
    }
  },
  
  invokeAsync(context, method, args) {
    return new Promise(function(resolve, reject) {
      try {
        const promise = args ? 
          method.apply(context, args) :
          method.call(context);
        const onSucces = _createAcceptorOfSuccesAsyncCall(resolve),
              onError = _createAcceptorOfFailAsyncCall(resolve);
        try {
          promise.then(onSucces, onError);
        } catch(error) {
          return resolve(result_notAsync);
        }
      } catch(error) {
        resolve(_createReportAboutError(error));
      }
    });
  },

  async invokeSyncOrAsync(context, method, args) {
    let promise;
    try {
      promise = method.apply(context, args);
    } catch(error) {
      return _createReportAboutError(error);
    }

    if (!(promise instanceof Promise)) {
      return result_succes;
    }
    
    try {
      await promise;
    } catch(error) {
      return _createReportAboutError(error);
    }
    return result_succes;
  }
};

const _createReportAboutError = function(error) {
  return {
    status: statusOfCall_error,
    error: error
  };
};

const _createAcceptorOfSuccesAsyncCall = function(resolvePromise) {
  return resolvePromise.bind(null, result_succes);
};

const _createAcceptorOfFailAsyncCall = function(resolvePromise) {
  return function(error) {
    return resolvePromise({
      status: statusOfCall_error,
      error: error
    });
  };
};

module.exports = launcherOfMethods;
