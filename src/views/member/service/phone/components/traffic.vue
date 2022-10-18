<template>
  <div id="traffic">
    <ul class="traffic-box">
      <li class="info" v-for="(item,index) in items" :key='index' @click="selectedStyle($event,index)">
        <u></u> <b>{{item.num}}</b> <i></i>
      </li>
    </ul>

    <div class="traffic-money">
      <div class="item" @click="selectMoney($event,item.price)" :key='i' v-for="(item,i) in data">
        <div class="lf">
          <p class="one"><b>{{$i18n.t("money")}}{{item.price}}</b> <span v-show="item.span">{{item.span}}</span></p>
          <p class="two">{{item.des}}</p>
        </div>
        <div class="rt"><span class="circle"></span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: true,
      data: [
        { price: "44.5", span: "赠送100积分", des: "当月有效，全国通用，即时生效，支持3G/4G" },
        { price: "50", des: "当月有效，全国通用，即时生效，支持3G/4G" },
        { price: "44.5", span: "赠送100积分", des: "当月有效，全国通用，即时生效，支持3G/4G" }],
      items: [{
        num: "1G", data: [
          { price: "44.5", span: "赠送100积分", des: "当月有效，全国通用，即时生效，支持3G/4G" },
          { price: "50", des: "当月有效，全国通用，即时生效，支持3G/4G" },
          { price: "44.5", span: "赠送100积分", des: "当月有效，全国通用，即时生效，支持3G/4G" }]
      },
      {
        num: "2G", data: [
          { price: "99.8", span: "赠送100积分", des: "当月有效，全国通用，即时生效，支持3G/4G" },
          { price: "100", des: "当月有效，全国通用，即时生效，支持3G/4G" },
          { price: "102", span: "赠送100积分", des: "当月有效，全国通用，即时生效，支持3G/4G" }]
      },
      {
        num: "3G", data: [
          { price: "134", span: "赠送100积分", des: "当月有效，全国通用，即时生效，支持3G/4G" },
          { price: "145", des: "当月有效，全国通用，即时生效，支持3G/4G" },
          { price: "150", span: "赠送100积分", des: "当月有效，全国通用，即时生效，支持3G/4G" }]
      }]
    };
  },
  methods: {
    selectedStyle(e, n) {
      var boxs = document.getElementById("traffic").getElementsByClassName("info");
      for (var i = 0; i < boxs.length; i++) {
        boxs[i].className = "info";
      }
      e.currentTarget.className = "info active";

      this.data = this.items[n].data;
    },
    selectMoney(e, money) {
      var boxs = document.getElementById("traffic").getElementsByClassName("item");
      for (var i = 0; i < boxs.length; i++) {
        boxs[i].lastElementChild.lastElementChild.className = "";
      }
      e.currentTarget.lastElementChild.lastElementChild.className = "active";
      this.$emit("payMoney", money);
    }
  },
  mounted() {
    var boxs = document.getElementById("traffic").getElementsByClassName("info");
    boxs[0].className = "info active";

    var circles = document.getElementById("traffic").getElementsByClassName("circle");
    circles[0].className = "circle active";
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: border-box;
  }

  #traffic {
    .traffic-box {
      margin: 1.25rem 0.875rem;
      justify-content: space-around;
      flex-flow: row;
      flex-direction: row;
      display: flex;

      li {
        width: 30%;
        height: 4.375rem;
        border: 0.125rem solid #ccc;
        border-radius: 0.25rem;
        font-size: 22px;
        color: #666;
        padding-top: 1.25rem;

        b {
          font-weight: normal;
        }
      }

      li.active {
        position: relative;
        border: 0.125rem solid #f15353;

        u {
          position: absolute;
          width: 3.125rem;
          height: 1.875rem;
          display: inline-block;
          top: 0;
          left: 0;
          background: url(../../../../../assets/images/favourablE.png) no-repeat 0 0;
        }

        i {
          width: 1.875rem;
          height: 1rem;
          display: inline-block;
          position: absolute;
          right: 0;
          bottom: 0;
          background: url(../../../../../assets/images/checke.png) no-repeat 0.0625rem 0;
        }
      }
    }

    .traffic-money {
      .item:last-child {
        border: none;
      }

      .item {
        margin-left: 1.25rem;
        padding-right: 1.25rem;
        padding-top: 0.625rem;
        padding-bottom: 0.625rem;
        border-bottom: solid 0.0625rem #ebebeb;
        overflow: hidden;

        div.lf {
          width: 80%;

          p {
            clear: both;
          }

          .one {
            line-height: 1.875rem;
            text-align: left;

            b {
              font-size: 22px;
              color: #333;
              font-weight: normal;
              float: left;
              margin-right: 1rem;
            }

            span {
              padding: 0.125rem 0.5rem;
              background: #f15353;
              color: #fff;
              border-radius: 0.25rem;
              font-size: 10px;
            }
          }

          .two {
            font-size: 12px;
            color: #666;
            text-align: left;
            line-height: 1.5rem;
          }
        }

        div.rt {
          width: 20%;

          span {
            width: 1.25rem;
            height: 1.25rem;
            display: inline-block;
            border: 0.0625rem solid #aaa;
            border-radius: 50%;
            margin-top: 1.25rem;
            float: right;
          }

          .active {
            border: 0.0625rem solid #f15353;
            background: url(../../../../../assets/images/mark-a.png) no-repeat 0.1875rem 0.1875rem;
            background-position: center;
          }
        }
      }
    }
  }
</style>
