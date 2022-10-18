<template>
    <div id="myMerchants">
        <div class="input">
            <input type="text" @focus="beginSearch" name="" v-model="searchVal"  placeholder="搜索供应商ID/昵称/姓名">
        </div>
        <ul class="merchants_list">
            <li v-for="(elem,i) in merchantsList" :key='i'>
                <div class="left">
                    <img src="">
                    <b>{{elem.name}}</b>
                </div>
                <div class="right">
                    <span>分红金额</span> <br>
                    <b>{{elem.salary}}</b>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default{
  methods:{
    beginSearch(){
      this.$emit('emitFocus',true);
    }
  },
  props: ['searchVal','merchantsList'],
  data(){
    return{

    };
  }
};

</script>

<style  lang="scss" rel="stylesheet/scss" scoped>
#myMerchants {
  background: #fff;

  .input {
    input {
      margin: 0.625rem 5%;
      width: 80%;
      height: 1.875rem;
      border-radius: 0.375rem;
      border: 0;
      outline: 0;
      padding-left: 1.875rem;
      background: url(../../../../assets/images/search.png) no-repeat 0.625rem 0.5rem #f2f2f2;
    }
  }

  .merchants_list {
    margin-top: 0.625rem;
    overflow: hidden;

    li {
      padding: 0.625rem;
      border-bottom: 0.0625rem solid #ebebeb;
      overflow: hidden;

      .left {
        width: 40%;
        float: left;

        img {
          width: 3.4375rem;
          height: 3.4375rem;
          background: #ccc;
          vertical-align: middle;
        }

        b {
          font-size: 15px;
          color: #333;
          padding-left: 0.625rem;
        }
      }

      .right {
        width: 40%;
        float: right;
        text-align: right;

        span {
          font-size: 11px;
          color: #333;
        }

        b {
          color: #f15353;
          font-size: 16px;
          line-height: 1.875rem;
        }
      }
    }

    li:last-child {
      border-bottom: 0;
    }
  }
}
</style>