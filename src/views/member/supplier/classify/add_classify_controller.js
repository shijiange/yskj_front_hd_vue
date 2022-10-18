import cTitle from 'components/title';
import { Toast } from 'vant';
export default{
  components: { cTitle },
  data(){
    return{
      classify_name: '',
      isRecommend: '',
      isOpen: '',
      judgeState: true,
      //setting sun
      imageUrl: '',
      uploadUrl:'',
      thumb: '', 
    };
  },
  activated() {
    this.init();
    this.urlUp();	
  },
  methods:{
    init(){
      this.classify_name = '';
      this.thumb = '';
      this.imageUrl = '';
      this.isRecommend = '';
      this.isOpen = '';
    },
    //确定添加
    sureAdd(){
      // let isHome = '';
      // if(this.isRecommend == '是'){
      //     isHome = 1;
      // }else if(this.isRecommend == '否'){
      //     isHome = 0;
      // }
      let isEnabled = '';
      if(this.isOpen == '1'){
        isEnabled = 1;
      }else if(this.isOpen == '0'){
        isEnabled = 0;
      }
      var that = this;
      that.judge();
      var json;
      if(that.judgeState == true){
        if(that.$route.params.classify_id == 'add'){
          json = {
            store_id: that.$route.params.store_id,
            name: that.classify_name,
            // thumb: that.thumb,
            // is_home: isHome,
            enabled: isEnabled,
            level: that.$route.params.level,
          };
        }else{
          json = {
            store_id: that.$route.params.store_id,
            name: that.classify_name,
            // thumb: that.thumb,
            // is_home: isHome,
            enabled: isEnabled,
            parent_id: that.$route.params.classify_id,
            level: that.$route.params.level,
          };
        }
                
        $http.post('plugin.store-cashier.frontend.store.goods-category.add-category',json).then(function (response) {
          console.log('显示add',response);
          if(response.result == 1){
            that.$router.push(that.fun.getUrl('GoodsClassify',{store_id: that.$route.params.store_id}));
            // that.$message({
            //     message: '添加成功',
            //     type: 'success'
            // });
            that.$notify({
              background:'#f0f9eb',
              message: '添加成功',
              color:'#67c23a'
            });
          }else{
            // that.$message.error(response.msg);
            that.$notify(response.msg);
          }
        }, function (response) {
          console.log(response);
        });
      }else{
        // that.$message({
        //     message: '分类信息不完整',
        //     type: 'warning'
        // });
        that.$notify({
          background:'#fef0f0',
          message: '分类信息不完整',
          color:'#f56c6c'
        });
      }	
    },
    judge(){
      this.judgeState = true;
      if(this.classify_name == ''||this.isOpen == ''){
        this.judgeState = false;
      }
    },
    //setting sun
    //商品分类图片
    //上传url
    urlUp(){
      this.uploadUrl = this.fun.getRealUrl("plugin.store-cashier.frontend.store.goods.upload",{});
    },
    handleStoreSuccess(res, file) {
      console.log(res);
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.result == 1) {
        this.thumb = res.data.img;
      } else {
        Toast(res.msg);
      }
    },
    beforeUpload(file) {
      const isPNG = (file.type === 'image/png' || file.type === 'image/jpeg');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG) {
        this.$notify("上传头像图片只能是 JPG或PNG 格式!");
        // this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
      }
      if (!isLt2M) {
        this.$notify("上传头像图片大小不能超过 2MB!");
        // this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isPNG && isLt2M;
    },

  }
};