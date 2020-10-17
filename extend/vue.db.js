!function (win, fun) {
    "use strict";
    win.dbVersion = '1.0.0';
    win.ELEMENT = fun(win.Vue);
}(window, function (vue) {
    console.log('abc');
});