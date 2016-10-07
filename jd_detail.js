//专门用于简化使用选择器查找任意元素的方法
//参数selector是一个字符串格式的选择器
window.$=HTMLElement.prototype.$=function(selector){
  //如果$在全局调用，说明在整个网页中查找，就用document
  //否则$在当前元素下找，就用this指代当前元素
  var  elems=
  (this==window?document:this).querySelectorAll(selector);
  return elems.length==0?null://如果集合为空，说明没找到
        //如果集合只有一个，就自动取出仅有的一个元素返回
         elems.length==1?elems[0]:
                         elems;//否则,返回完整集合
}
/*顶部菜单*/
function showItems(){//this->li
  //找到当前li下id以_items结尾的一个元素，保存在items中
  //设置items显示
  this.$("[id$='_items']").style.display="block";
  //在当前li下找到b元素的下一个兄弟a元素，设置其class为hover
  this.$("b+a").className="hover";
}
function hideItems(){
  //找到当前li下id以_items结尾的一个元素，保存在items中
  //设置items为隐藏
  this.$("[id$='_items']").style.display="none";
  //在当前li下找到b元素的下一个兄弟a元素，清除其class
  this.$("b+a").className="";
}
window.onload=function(){
  //为class为app_jd的li绑定鼠标进入事件为showItems
  $(".app_jd").addEventListener("mouseover",showItems);
  //为class为service的li绑定鼠标移出事件为hideItems
  $(".app_jd").addEventListener("mouseout",hideItems);
  //为service绑定鼠标进入事件为showItems
  $(".service").addEventListener("mouseover",showItems);
  //为service绑定鼠标移出事件为hideItems
  $(".service").addEventListener("mouseout",hideItems);
  
  //为id为category的div绑定鼠标进入事件为showSub1
  $("#category").addEventListener("mouseover",showSub1);
  //为id为category的div绑定鼠标移出事件为hideSub1
  $("#category").addEventListener("mouseout",hideSub1);

  //为id为cate_box的ul绑定鼠标进入事件为showSub2
  $("#cate_box").addEventListener("mouseover",showSub2);
  //为id为cate_box的ul绑定鼠标移出事件为hideSub2
  $("#cate_box").addEventListener("mouseout",hideSub2);

  //为id为product_detail下的class为main_tabs的ul绑定单击事件为change
  $("#product_detail>.main_tabs").addEventListener("click",change);

  zoom.init();
}
function change(e){//获得事件对象e
  //获得目标元素target
  var target=e.target;
  //如果target是a，就将target换成其父元素
  target.nodeName=="A"&&(target=target.parentNode);
  //如果target是li,且target的class不是current
  if(target.nodeName=="LI"&&target.className!="current"){
    //找到target的父元素下class为current的li，清除其样式
    target.parentNode.$("li.current").className="";
    //设置target的class为current
    target.className="current";
    //找到id为product_detail下的class为show的直接子元素，保存在变量curr中
    var curr=$("#product_detail>.show");
    //如果curr不等于null，就清除curr的class
    curr&&(curr.className="");
    if(target.dataset.i!=-1){//如果target的i不是-1
      //获得target的i，保存在变量i中
      var i=target.dataset.i;
      //找到id为product_detail下的所有id以product_开头的直接子元素，取其中第i个，设置其class为show
      $("#product_detail>[id^='product_']")[i].className="show";
    }
  }
}
/*全部商品分类菜单*/
function showSub1(){//显示一级子菜单
  //找到id为cate_box的ul，设置其显示
  $("#cate_box").style.display="block";
}
function hideSub1(){//隐藏一级子菜单
  //找到id为cate_box的ul，设置其隐藏
  $("#cate_box").style.display="none";
}
function showSub2(e){//显示二级子菜单
  var target=e.target;//获得目标元素target
  if(target.id!="cate_box"){//如果target.id不是cate_box
    //从target起，向上逐级查找父元素，直到li
    while(!(target.nodeName=="LI"
            &&target.parentNode.id=="cate_box")){
      target=target.parentNode;//将target换成其父元素
    }
    //(循环结束: target已经到li)
    //找到target下class为sub_cate_box的div，设置其显示
    target.$(".sub_cate_box").style.display="block";
    //找到target下的h3元素，设置其class为hover
    target.$("h3").className="hover";
  }
}
function hideSub2(e){//隐藏二级子菜单
  var target=e.target;//获得目标元素target
  if(target.id!="cate_box"){//如果target.id不是cate_box
    //从target起，向上逐级查找父元素，直到li
    while(!(target.nodeName=="LI"
            &&target.parentNode.id=="cate_box")){
      target=target.parentNode;//将target换成其父元素
    }
    //(循环结束: target已经到li)
    //找到target下class为sub_cate_box的div，设置其显示
    target.$(".sub_cate_box").style.display="none";
    //找到target下的h3元素，清除其class
    target.$("h3").className="";
  }
}

var zoom={
  WIDTH:0,//保存每个图片的宽度
  OFFSET:0,//保存起始的left值
  moved:0,//保存已经左移的图片个数

  MSIZE:0,//保存mask的宽和高
  MAX:0,//保存最大可用的top和left
  
  init:function(){//初始化zoom对象
    //找到id为icon_list下的第一个li，获得其计算后的样式中的width，转为浮点数,保存在WIDTH属性中
    this.WIDTH=parseFloat(getComputedStyle(
      $("#icon_list>li:first-child")
    ).width);
    //找到id为icon_list的ul，获得其计算后的样式中的left，转为浮点数保存在OFFSET属性中
    this.OFFSET=parseFloat(
      getComputedStyle($("#icon_list")).left
    );
    //找到id为preview下的直接子元素h1，为其绑定单击事件为move
    $("#preview>h1").addEventListener(
      "click",this.move.bind(this)
    );

    //为id为icon_list的ul绑定鼠标进入事件为
    $("#icon_list").addEventListener(
      "mouseover",this.changeMImg);

    //为id为superMask的div绑定鼠标进入事件为
    $("#superMask").addEventListener(
      "mouseover",function(){
      //设置id为mask的div显示
      $("#mask").style.display="block";
      //获得id为mImg的元素的src属性，保存在变量src中
      var src=$("#mImg").src;
      //查找src中最后一个.的位置i
      var i=src.lastIndexOf(".");
      //修改src为: 截取src中0~i-1的子字符串,拼l,拼src中i到结尾的剩余内容
      src=src.slice(0,i-1)+"l"+src.slice(i);
      //设置id为largeDiv的元素的背景图片为:"url("+src+")"
     $("#largeDiv").style.backgroundImage="url("+src+")";
      //设置id为largeDiv的元素显示
      $("#largeDiv").style.display="block";
    });
    //为id为superMask的div绑定鼠标移出事件为
    $("#superMask").addEventListener(
      "mouseout",function(){
        //设置id为mask的div隐藏
        $("#mask").style.display="none";
        //设置id为largeDiv的元素隐藏
        $("#largeDiv").style.display="none";
    });
  
    //获得id为mask的div计算后的样式中的width属性，转为浮点数，保存在MSIZE属性中
    this.MSIZE=parseFloat(
      getComputedStyle($("#mask")).width
    );
    //获得id为superMask的div计算后的样式中的width属性，转为浮点数保存在变量ssize中
    var ssize=
      parseFloat(getComputedStyle($("#superMask")).width
    );
    //计算MAX: ssize-MSIZE;
    this.MAX=ssize-this.MSIZE;
    //为id为superMask的div绑定鼠标移动事件为maskMove
    $("#superMask").addEventListener(
      "mousemove",this.maskMove.bind(this));
  },
  //专门负责响应mousemove事件，移动mask
  maskMove:function(e){//获得事件对象
    //获得鼠标相对于superMask的x坐标，保存在x中
    var x=e.offsetX;
    //获得鼠标相对于superMask的y坐标，保存在y中
    var y=e.offsetY;
    //计算top: y-MSIZE/2 保存在变量t中
    var t=y-this.MSIZE/2;
    //计算left: x-MSIZE/2 保存在变量l中
    var l=x-this.MSIZE/2;
    //如果t<0,就改回0，否则如果t>MAX，就改回MAX
    t=t<0?0:t>this.MAX?this.MAX:t;
    //如果left<0,就改回0，否则如果left>MAX，就改回MAX
    l=l<0?0:l>this.MAX?this.MAX:l;
    //设置id为mask的元素的top为t
    $("#mask").style.top=t+"px";
    //设置id为mask的元素的left为l
    $("#mask").style.left=l+"px";
    //修改largeDiv的背景图片位置为-l*倍数和-t*倍数
    $("#largeDiv").style.backgroundPosition=
      -l*16/7+"px "+(-t*16/7)+"px"
  },
  changeMImg:function(e){//专门用于切换中图片
    var target=e.target;//获得目标元素target
    if(target.nodeName=="IMG"){//如果target是img
      //获得target的src，保存在变量src中
      var src=target.src;
      //查找src中最后一个.的位置i
      var i=src.lastIndexOf(".");
      //设置id为mImg的元素的src属性为:
        //截取src中0~i之前的子字符串，拼接-m，再拼接src中i到结尾的剩余子字符串
      $("#mImg").src=src.slice(0,i)+"-m"+src.slice(i);
    }
  },
  move:function(e){//负责移动icon_list
    var target=e.target;//获得目标元素target
    //如果target是A，且target的class不以_disabled结尾
    if(target.nodeName=="A"
      &&target.className.indexOf("_disabled")==-1){
      //moved,如果target的class以forward开头，就+1，否则-1
      this.moved+=
        target.className.indexOf("forward")!=-1?1:-1;
      //计算ul新的left: -(WIDTH*moved-OFFSET)
      var left=-(this.WIDTH*this.moved-this.OFFSET);
      //设置id为icon_list的ul的left为left
      $("#icon_list").style.left=left+"px";
      this.checkA();//调用checkA，检查并修改按钮的状态
    }
  },
  checkA:function(){//负责检查并修改两个按钮的状态
    if(this.moved==0){//如果moved等于0
      //找到class以backward开头的a，为其class后拼接_disabled
      $("[class^='backward']").className+="_disabled";
    }else if(this.moved==$("#icon_list>li").length-5){
      //否则，如果moved等id为icon_list下所有li的length-5
      //找到class以forward开头的a，为其class后拼接_disabled
      $("[class^='forward']").className+="_disabled";
    }else{//否则
      //找到class以backward开头的a，设置其class为backward
      $("[class^='backward']").className="backward";
      //找到class以forward开头的a，设置其class为forward
      $("[class^='forward']").className="forward";
    }
  }
}