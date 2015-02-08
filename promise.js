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
    this._handleThen();

    return this;
  }

  Promise.prototype.reject = function(reason) {
    if (this.state !== 'pending') return;

    this.state = 'rejected';
    this.reason = reason;
    this._handleThen();

    return this;
  }

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
      var returnValue = null;
      try {
        switch(this.state) {
          case 'fullfilled':
            returnValue = this.pending[i].onFullfilled(this.value);
            this.pending[i].promise.resolve(returnValue);
            break;
          case 'rejected':
            returnValue = this.pending[i].onRejected(this.reason);
            this.pending[i].promise.reject(returnValue);
            break;
        }

        if (returnValue && (typeof returnValue.then === 'function')) {
          this.pending[i].promise.then(this.pending[i].promise.resolve, this.pending[i].promise.reject);
        } 
      } catch(e) {
        this.pending[i].reject(e);
      }
    }  
  }
}
