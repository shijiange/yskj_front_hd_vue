module.exports = {
  processors: [],
  plugins: [],
  extends: "stylelint-config-standard", // 这是官方推荐的方式
  rules: {
    "indentation": 2,
    "block-no-empty": true,
    // 字体文件相关
    "font-family-no-missing-generic-family-keyword": null,
    // 空的样式文件
    "no-empty-source": null,
    // 计算属性 calc()
    "function-calc-no-invalid": null,
    // 禁止低优先级的选择器出现在高优先级的选择器之后
    "no-descending-specificity": null,
    // 禁止重复选择器
    "no-duplicate-selectors": null,
    // 在单行声明块中限制声明的数量
    "declaration-block-single-line-max-declarations": null,
    "declaration-block-no-shorthand-property-overrides": null
  }
};
