<template>
  <div class="app-container">
    <div class="filter-container">
      <span style="font: 20px Extra large">帮助</span>
      <el-tabs :tab-position="tabPosition" style="font-family: 微软雅黑">
        <el-tab-pane label="数据汇总" v-if="checkPermission(['admin','director'])">
          <el-card shadow="always" class="cards">
            <div class="little_title">统计图表概览</div>
            <img src="@/assets/help/统计图表概览.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.选择对应时间的原始数据时间与对比数据时间，即可查看<br/>
              2.查看具体数据，选择相应的项目，渠道，平台
            </div>
          </el-card>
          <el-card shadow="always" class="cards">
            <div class="little_title">计费统计图表</div>
            <img src="@/assets/help/计费统计图表.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.选择对应时间的原始数据时间与对比数据时间，即可查看<br/>
              2.查看具体数据可通过下方按钮进行筛选
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="数据获取" v-if="checkPermission(['admin','director','operatorleader'])">
          <el-card shadow="always" class="cards">
            <div class="little_title">友盟数据下载</div>
            <img src="@/assets/help/友盟数据下载.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.选择时间，项目并搜索即可将友盟数据在下方表格内预览（数据来源：友盟API，若发现数据异常请前往友盟查看具体情况）<br/>
              2.确认内容无异常后，下载excel表格，修改应用名（部分应用名不规范，直接在excel表格内修改为我们自己定义的应用名，如：一笔画_开心玻璃杯--》开心玻璃杯
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="数据录入" v-if="checkPermission(['admin','director','operatorleader'])">
          <el-card shadow="always" class="cards">
            <div class="little_title">数据录入</div>
            <img src="@/assets/help/数据录入.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.数据录入分为广告统计数据录入和支付数据录入<br/>
              （1）广告统计数据包括友盟（用户数据）和广点通，头条，各个渠道的广告数据（广告数据）<br/>
              （2）支付数据为各个渠道的支付数据（目前只有华为）<br/>
              （3）具体上传格式请查看该页面的文字提示按钮
            </div>
          </el-card>
          <el-card shadow="always" class="cards">
            <div class="little_title">应用列表</div>
            <img src="@/assets/help/应用列表.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.该页面为<span
              style="text-decoration: underline;font-weight: bold">上传数据解析应用名</span>提供数据，可以在此页面进行添加、编辑、删除操作<br/>
              <img src="@/assets/help/添加应用.png" style="margin-left: 30px;" width="500px"><br/>
              1.添加应用时，需要事先添加该应用名所属的项目（应用名添加后不可修改）<br/>
              2.填写应用名，并选择其所属项目，其余默认即可
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="数据分析" v-if="checkPermission(['admin','director','operatorleader','planner','operator'])">
          <el-card shadow="always" class="cards"
                   v-if="checkPermission(['admin','director','operatorleader','planner','operator'])">
            <div class="little_title">展次表（旧）</div>
            <div class="body_txt">
              旧版本展次表下载，选择时间段和项目即可下载（统计部分渠道的展次等数据信息）<br/>
            </div>
            <div class="little_title">展次表（新）</div>
            <div class="body_txt">
              新版本展次表下载，选择时间段和项目即可下载（统计部分渠道的展次等数据信息）<br/>
              （1）相比旧版本，细分广告形式数据，如：<br/>
              &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp旧版本：-开屏<br/><br/>
              &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp新版本：-开屏-普通<br/>
              &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-开屏-渲染<br/>
            </div>
            <div class="little_title">ARPU表</div>
            <div class="body_txt">
              选择时间段和项目即可下载（统计部分渠道arpu等数据信息）<br/>
            </div>
          </el-card>
          <el-card shadow="always" class="cards" v-if="checkPermission(['admin','director','operatorleader'])">
            <div class="little_title">收益表</div>
            <div class="body_txt">
              选择时间段即可下载（统计时间段内所有项目的收益情况）<br/>
            </div>
          </el-card>
          <el-card shadow="always" class="cards"
                   v-if="checkPermission(['admin','director','operatorleader','planner','operator'])">
            <div class="little_title">友盟留存</div>
            <img src="@/assets/help/友盟留存.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.选择时间段和应用可查看该应用所有渠道的留存信息，也可以查看具体渠道（数据来源：友盟）<br/>
              2.表格上方为选择时间段内的多日的留存数据
            </div>
          </el-card>
          <el-card shadow="always" class="cards" v-if="checkPermission(['admin','director','operatorleader'])">
            <div class="little_title">广告数据查重</div>
            <img src="@/assets/help/广告数据查重.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.绿色按钮默认删除重复数据（因命名错误而导致的重复数据，可通过此按钮自动删除）<br/>
              2.手动删除则点击查询重复数据，手动选择问题数据的所在行进行删除（重复数据经过排序成对出现可通过【选择所有偶数行】【选择所有奇数行】进行快捷选择）
            </div>
          </el-card>

        </el-tab-pane>
        <el-tab-pane label="项目管理"  v-if="checkPermission(['admin','director','operatorleader'])">
          <el-card shadow="always" class="cards"  v-if="checkPermission(['admin','director'])">
            <div class="little_title">项目列表</div>
            <img src="@/assets/help/项目列表.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.该页面为项目管理，<span style="text-decoration: underline;font-weight: bold">项目管理关联SDK管理，数据上传解析</span>，可以在此页面进行添加、编辑、删除操作<br/>
              <img src="@/assets/help/添加项目.png" style="margin-left: 30px;" width="500px"><br/>
              1.填写项目名及备注即可（项目名添加后不可修改）
            </div>
          </el-card>
          <el-card shadow="always" class="cards"  v-if="checkPermission(['admin','director','operatorleader'])">
            <div class="little_title">渠道列表</div>
            <img src="@/assets/help/渠道列表.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.该页面为渠道管理，可以在此页面进行渠道列表添加、编辑、删除操作<br/>
              <img src="@/assets/help/添加渠道.png" style="margin-left: 30px;" width="500px"><br/>
              1.添加渠道时，<span style="text-decoration: underline;font-weight: bold">渠道标记必须和友盟一致，</span>渠道名称为改渠道的中文名称
            </div>
          </el-card>
          <el-card shadow="always" class="cards"  v-if="checkPermission(['admin','director','operatorleader'])">
            <div class="little_title">广告类型列表（一般不会进行编辑）</div>
            <img src="@/assets/help/广告类型列表.png" style="margin-left: 30px;" width="1500px"><br/>
            <img src="@/assets/help/添加广告类型.png" style="margin-left: 30px;" width="500px"><br/>
            <div class="body_txt">
              1.该页面为广告类型管理，可以在此页面进行广告类型添加、编辑、删除操作<br/>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="人员管理"  v-if="checkPermission(['admin','director'])">
          <el-card shadow="always" class="cards">
            <div class="little_title">帐号管理</div>
            <img src="@/assets/help/帐号列表.png" style="margin-left: 30px;" width="1500px"><br/>
            <img src="@/assets/help/添加帐号.png" style="margin-left: 30px;" width="500px"><br/>
            <div class="body_txt">
              1.该页面为帐号管理，可以在此页面进行账号添加、编辑、删除操作<br/>
            </div>
          </el-card>
          <el-card shadow="always" class="cards">
            <div class="little_title">角色管理</div>
            <img src="@/assets/help/角色列表.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.该页面为帐号管理，可以在此页面进行账号添加、编辑、删除操作<br/>
              <img src="@/assets/help/添加角色.png" style="margin-left: 30px;" width="500px"><br/>
              1.帐号<span style="text-decoration: underline;font-weight: bold">必须赋予至少一个角色</span>，否则无法访问<br>
              <img src="@/assets/help/权限编辑.png" style="margin-left: 30px;" width="500px"><br/>
              1.帐号<span style="text-decoration: underline;font-weight: bold">必须赋予权限</span>，否则无法访问<br>
            </div>
          </el-card>
          <el-card shadow="always" class="cards">
            <div class="little_title">项目分配</div>
            <img src="@/assets/help/项目分配.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.该页面为项目分配，可以在此页面进行账号的项目分配工作<span
              style="text-decoration: underline;font-weight: bold">（总监，组长，sdk管理员不受限制）</span><br/>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="SDK管理">
          <el-card shadow="always" class="cards"  v-if="checkPermission(['admin','director','operatorleader','sdksuport'])">
            <div class="little_title">SDK模版列表</div>
            <img src="@/assets/help/SDK模版列表.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.该页面为配置SDK模版，具体操作见页面内：<span style="text-decoration: underline;font-weight: bold">SDK模版添加说明</span><br/>
            </div>
          </el-card>
          <el-card shadow="always" class="cards"  v-if="checkPermission(['admin','director','operatorleader'])">
            <div class="little_title">SDK配置表</div>
            <img src="@/assets/help/SDK配置表.png" style="margin-left: 30px;" width="1500px"><br/>
            <img src="@/assets/help/创建配置表.png" style="margin-left: 30px;" width="500px"><br/>
            <div class="body_txt">
              1.该页面为配置表的创建和编辑，<span style="text-decoration: underline;font-weight: bold">SDK创建后包名和渠道名不可修改</span><br/>
              <img src="@/assets/help/编辑配置表.png" style="margin-left: 30px;" width="1500px"><br/>
            </div>
            <div class="body_txt">
              1.编辑页面，会保留上一次编辑后的样式，填写完成后，可以选择保存和发布（发布时会自动保存）
            </div>
          </el-card>
          <el-card shadow="always" class="cards">
            <div class="little_title">配置表发布记录</div>
            <img src="@/assets/help/配置表发布记录.png" style="margin-left: 30px;" width="1500px"><br/>
            <div class="body_txt">
              1.该页面上查看所有发布过的配置表信息
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="系统设置">
          <el-card shadow="always" class="cards">
            <div>
              <div class="little_title">操作日志（未实现）</div>
              <img src="" style="margin-left: 30px;" width="1500px"><br/>
              <div class="body_txt">
              </div>
            </div>
          </el-card>
          <el-card shadow="always" class="cards">
            <div>
              <div class="little_title">帮助？</div>
              <img src="" style="margin-left: 30px;" width="1500px"><br/>
              <div class="body_txt">
              </div>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="Debug" v-if="checkPermission(['admin'])">
          <el-card shadow="always" class="cards">
            <div>
              <div class="little_title">用户数据</div>
              <img src="" style="margin-left: 30px;" width="1500px"><br/>
              <div class="body_txt">
              </div>
            </div>
          </el-card>
          <el-card shadow="always" class="cards">
            <div>
              <div class="little_title">友盟数据</div>
              <img src="" style="margin-left: 30px;" width="1500px"><br/>
              <div class="body_txt">
              </div>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
  export default {
    data() {
      return {
        tabPosition: 'left'
      };
    },
    name: "help",
    methods: {
      checkPermission,
    }
  }
</script>

<style scoped>
  .little_title {
    font: 18px large;
    margin-bottom: 20px;
    font-weight: bolder;
  }

  .body_txt {
    font: 14px Base;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    margin: 10px;
  }

  .cards {
    margin: 7px;
  }


</style>
