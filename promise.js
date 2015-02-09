var exports = this;
var Xiaoming = Xiaoming || {};

~function() {
  // TODO: 用 Xiaoming.Class 重写对象的生成
  Xiaoming.Promise = Promise = function() {
    // 初始化 state && pending
    this.state = 'pending';
    this.pending = [];
  }

  Promise.prototype.resolve = function(value) {
    // promise 的状态只能由 pending 转为 fullfilled || rejected
    if (this.state !== 'pending') return;

    this.state = 'fullfilled';
    this.value = value;
    this._handleThe();

    return this;
  }

  Promise.prototype.reject = function(reason) {
    if (this.state !== 'pending') return;

    this.state = 'rejected';
    this.reason = reason;
    this._handleThen();

    return this;
  }

  // TODO: additional helpers
  Promise.prototype.done = function() {};

  Promise.prototype.always = function() {};

  Promise.prototype.catch = function() {};

  Promise.prototype.when = function() {};

  Promise.prototype.all = function() {};

  Promise.prototype.then = function(onFullfilled, onRejected) {
    var then = {};
    
    if (onFullfilled && (typeof onFullfilled === 'function')) then.onFullfilled = onFullfilled;
    if (onRejected && (typeof onRejected === 'function')) then.onRejected = onRejected;

    // 创建新的 promise 供链式或内部继续调用
    then.promise = new Promise();
    this.pending.push(then); 

    return then.promise();
  }

  Promise.prototype._handleThen = function() {
    for (var i = 0, ii = this.pending.length; i < ii; i++) {
      // nextPromise 为 then 之后的 promise
      // returnValue 为 onFullfilled/onRejected 返回的 value/reason
      var nextPromise = this.pending[i].promise;
      var returnValue = null;

      try {
        switch(this.state) {
          case 'fullfilled':
            returnValue = this.pending[i].onFullfilled(this.value);
            nextPromise.resolve(returnValue);
            break;
          case 'rejected':
            returnValue = this.pending[i].onRejected(this.reason);
            nextPromise.reject(returnValue);
            break;
        }

        if (returnValue && (typeof returnValue.then === 'function')) {
          nextPromise.then(nextPromise.resolve.call(this), nextPromise.reject.call(this));
        } 
      } catch(e) {
        this.pending[i].reject(e);
      }
    }  
  }
}
