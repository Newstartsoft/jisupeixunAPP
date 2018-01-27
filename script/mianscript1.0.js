//任务下拉刷新
function FreshRW(){
  getrenwuList(nowState,1);
  $.pullToRefreshDone('.renwu');
  $.toast('刷新成功！');

}
