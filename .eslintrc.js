module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "vue"
  ],
  "rules": {
    "indent": ["error", 2],
    "comma-dangle": "off",
    "function-paren-newline": "off",
    "global-require": "off",
    "import/no-dynamic-require": "off",
    "no-inner-declarations": "off",
    // New rules
    "class-methods-use-this": "off",
    "import/extensions": "off",
    "import/prefer-default-export": "off",
    // render不规范
    "react/display-name": "off",
    "react/prop-types": "off",
    "require-atomic-updates": "off",
    // 数组统一空格 [1, 2, 3, ...]
    "array-bracket-spacing": 2,
    // prettier 中默认函数名不加空格，类似 function add() {}，而eslint中默认为function add () {}
    "space-before-function-paren": 0,
    //禁止在使用new构造一个实例后不赋值
    "no-new": 0,
    "no-unused-vars": [2, {
      // 允许声明未使用变量
      "vars": "all",
      // 参数不检查
      "args": "none"
    }],
    // 语句强制分号结尾
    "semi": [2, "always"],
    //空行最多不能超过10行
    "no-multiple-empty-lines": [0, { "max": 10 }],
    "no-useless-escape":  0,  //正则中多余的斜杠
    "no-prototype-builtins": 0,
    "no-sparse-arrays": 0,
    //关闭禁止混用tab和空格
    // "no-mixed-spaces-and-tabs": [0],
    // "no-self-assign": 0,   // 自我分配
    "no-undef": 0,//不能有未定义的变量
    "vue/no-parsing-error": [2, {
      "x-invalid-end-tag": false, //忽略某些不常规的闭合标签报错
      "invalid-first-character-of-tag-name": false, //忽略 template 中的三元运算符使用小于号（<）时报错
    }],
    "vue/no-use-v-if-with-v-for": ["error", {
      "allowUsingIterationVar": true //v-if和v-for混用
    }],
    
  }
};
