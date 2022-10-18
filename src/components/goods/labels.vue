<!-- 空白显示组件 可自定义图片、文字、按钮-->
  <template >
    <div class="goods-label-container">
      <span class="goods-label" :style="labelStyle" v-for="(labelItem,index) in labels" :key="index">{{typeof labelItem == 'string' ? labelItem : labelItem.tags[0]}}</span>
    </div>
  </template>

<script>
export default {
  props: {
    //数据，为空才显示
    labels: {
      type: [String, Object, Array],
      default: []
    },
    labelStyle:{
      type:String,
      default:''
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  methods: {

  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.goods-label-container{
  display: flex;
  margin:6px 0px;
  justify-content: flex-start;
  flex-wrap: wrap;
  .goods-label{
    max-height: 30px;
    text-align: left;
    font-size: 10px;
    display: block;
    margin-right: 6px;
    margin-top: 5px;
    color: #f15353;
    border-radius: 3px;
    padding: 0 5px;
    border: 1px solid #f15353;
  }
}
</style>
