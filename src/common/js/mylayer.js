
//通用弹框
// 需要加载css：layer.css和layer.m.js



const G_POP_LOADING = {
    index: -1,
    show: function (str) {
        if (G_POP_LOADING.index == -1) {
            G_POP_LOADING.index = layer.open({
                type: 2,
                shadeClose: false,
                content: (str ? str : '加载中...')
            });
        }
    },
    hide: function () {
        layer.close(G_POP_LOADING.index);
        G_POP_LOADING.index = -1;
    }
}


export function PopAlert(content, time) {
  if (!time) {
    /*time=Math.ceil(content.length/4);
     if(time==0)
     time=1;*/
    time = 3;
  }

  layer.open({
    type: 3,
    content: content,
    style: "background-color:#000;color:#fff;text-align:center;",
    time: time,
    anim: true,
  });
}

export  function PopDialog(v) {
  var title = v.title ? v.title : '';
  var content = v.content;
  var ybtn = v.ybtn ? v.ybtn : '';
  var onyes = v.onyes;

  var mp = {
    content: content,
    anim: true,
    yes: function (i) {
      onyes && onyes(i);
    },
    cancel: function (i) {
      layer.close(i)
    },
    shadeClose: false
  };

  if (title)
    mp['title'] = [title, 'background-color:#fff'];

  if (!ybtn && v.onyes) {
    ybtn = '确定';
  }

  if (ybtn)
    mp['btn'] = ['<span style="color:#212121">' + ybtn + '</span>'];

  layer.open(mp);

}

export function PopConfirm(v) {
  var title = v.title ? v.title : '';
  var content = v.content;
  var ybtn = v.ybtn ? v.ybtn : '确认';
  var nbtn = v.nbtn ? v.nbtn : '取消';
  var onyes = v.onyes;
  var onno = v.onno;
  var oncancel = v.oncancel;

  var mp = {
    content: content,
    btn: [ybtn, nbtn],
    yes: function (i) {
      onyes && onyes(i)
    },
    no: function (i) {
      onno && onno(i);
    },
    cancel: function (i) {
      oncancel && oncancel(i);
    },
    shadeClose: false
  };
  if (title != '') {
    mp['title'] = [title, 'background-color:#fff'];
  }
  layer.open(mp);
}


export function ShowLoading(str) {
  G_POP_LOADING.show(str);
}

export function HideLoading() {
  G_POP_LOADING.hide();
}

