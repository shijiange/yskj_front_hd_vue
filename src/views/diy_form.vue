<template>
  <div id="all">
    <diyfrom v-if="form_id" :form_id="form_id" :goodsId="goodsId" :optionsId="optionsId" :total="total" :tag="tag"></diyfrom>
  </div>
</template>

<script>
import diyform from "./diy_form_controller";

export default diyform;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>

  #tool ul li {
    width: 100% !important;
    padding-left: 0.75rem !important;
  }

  .yd-cell-title {
    height: 2.5rem !important;
    line-height: 2.5rem !important;
  }

  .yd-cell-box {
    margin-bottom: 0 !important;
  }

  .yd-btn-block {
    margin-top: 0.1875rem;
  }

  .introTitle {
    border-top: 0.0625rem solid #dedddd;
  }

  .yd-checkbox {
    padding-bottom: 0.625rem;
  }

  .intro {
    padding: 1.25rem;
  }

  .checkbox {
    background: #fff;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    border-bottom: 0.0625rem solid #ece9e9;
    text-align: left;
    padding-left: 0.75rem;
  }

  .photobox {
    position: relative;
    width: 5rem;
    height: 5rem;
    border: 1px dashed #c0ccda;

    /* float: left; */
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    margin-bottom: 0.2rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  /* 清除浮动代码 */
  .clearfloat::after {
    display: block;
    clear: both;
    content: '';
    visibility: hidden;
    height: 0;
  }

  .clearfloat {
    zoom: 1;
  }

  #member {
    .van-cell-group__title {
      text-align: left;
      padding: 2.5px 12px 5px;
    }

    /deep/ textarea::placeholder {
      color: #555;
    }

    .city-text {
      margin-top: 10px;
      margin-bottom: 10px;

      /deep/ .van-cell__title {
        text-align: left;
        flex: none;
        width: auto;
        margin-right: 0;
      }

      input {
        width: 100%;
        border: none;
        color: #333;
      }

      select {
        width: 100%;
        border: none;
        color: #555;
      }

      .van-cell {
        height: 50px;
        padding: 0 12px;
        color: #555;
      }
    }

    .data-text {
      .van-cell {
        height: 50px;
        padding: 0 12px;
        color: #555;
      }
    }

    .checkbox-text {
      text-align: left;
      color: #555;
    }

    .data-text {
      .van-cell {
        height: 50px;
        padding: 0 12px;
        color: #555;
      }

      .van-cell__value {
        span {
          color: #555;
        }
      }
    }

    .diyform {
      .van-cell__title {
        text-align: left;
        color: #555;
      }

      .diyform-textarea {
        .van-field {
          padding: 10px 0;

          /deep/ textarea {
            color: #555;
          }
        }
      }
    }

    /deep/ .van-cell--clickable:active {
      background-color: #fff;
    }
  }

  .diy-style {
    .van-cell {
      padding: 0 12px;
      height: 50px;

      .van-cell__title {
        flex: none;
        width: auto;
        white-space: nowrap;
      }

      /deep/ .yd-input > input {
        color: #555;
      }
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .vant-sure-class {
    .van-field__right-icon {
      color: green;
    }
  }

  .vant-no-sure-class {
    .van-field__right-icon {
      color: red;
    }
  }
</style>
