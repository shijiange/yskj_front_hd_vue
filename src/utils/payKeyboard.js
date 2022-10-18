class PayKeyboardAsync {
  constructor(){
    this.completeFn=null;
  }
  addCompleteFn(fn) {
    this.completeFn = fn;
  }

  complete(pass) {
    this.completeFn(pass);
  }
}

let payKeyboardAsync = new PayKeyboardAsync();

exports.payKeyboardAsync = payKeyboardAsync;
