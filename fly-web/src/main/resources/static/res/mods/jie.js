/**

 @Name: 求解板块

 */
 
layui.define('fly', function(exports){

  var $ = layui.jquery
      ,layer = layui.layer
      ,util = layui.util
      ,laytpl = layui.laytpl
      ,laypage=layui.laypage
      ,form = layui.form
      ,fly = layui.fly;
  
  var gather = {}, dom = {
    jieda: $('#jieda')
    ,content: $('#L_content')
    ,jiedaCount: $('#jiedaCount')
  };

  //监听专栏选择
  form.on('select(column)', function(obj){
    var value = obj.value
    ,elemQuiz = $('#LAY_quiz')
    ,tips = {
      tips: 1
      ,maxWidth: 250
      ,time: 10000
    };
    elemQuiz.addClass('layui-hide');
    if(value === '0'){
      layer.tips('下面的信息将便于您获得更好的答案', obj.othis, tips);
      elemQuiz.removeClass('layui-hide');
    } else if(value === '99'){
      layer.tips('系统会对【分享】类型的帖子予以飞吻奖励，但我们需要审核，通过后方可展示', obj.othis, tips);
    }
  });

  //提交回答
  fly.form['/article/reply/'] = function(data, required,res){
    var tpl = '<li data-id="{{d.id}}">\
      <div class="detail-about detail-about-reply">\
        <a class="fly-avatar" href="/u/{{ d.user.uid }}" target="_blank">\
          <img src="{{d.user.avatar}}" alt="{{d.user.username}}">\
        </a>\
        <div class="fly-detail-user">\
          <a href="/u/{{ d.user.uid }}" target="_blank" class="fly-link">\
            <cite>{{d.user.username}}</cite>\
            {{# if(d.user.auth){ }}\
            <i class="iconfont icon-renzheng" title="认证信息：{{d.user.auth}}"></i>\
            {{# }}}\
           {{# if(d.user.vip){ }}\
            <i class="layui-badge fly-badge-vip">{{d.user.vip}}</i>\
           {{# }}}\
        </a>\
         {{# if(d.author){ }}\
        <span>(楼主)</span>\
          {{# }}}\
        </div>\
        <div class="detail-hits">\
          <span>刚刚</span>\
        </div>\
      </div>\
      <div class="detail-body jieda-body photos">\
        {{ d.content}}\
      </div>\
      <div class="jieda-reply">\
        <span class="jieda-zan" type="zan">\
        <i class="iconfont icon-zan"></i>\
        <em>0</em>\
        </span>\
        </div>\
    </li>'
      /**
       * // <div class="jieda-admin">
       //     <span type="edit">编辑</span>
       //     <span type="del">删除</span>
       //     </div>
       * */
    data.id=res.data;
    data.author=layui.cache.user.uid==$('#hidden_author_id').val();
    data.content = fly.content(data.content);
    laytpl(tpl).render($.extend(data, {
      user: layui.cache.user
    }), function(html){
      required[0].value = '';
      dom.jieda.find('.fly-none').remove();
      dom.jieda.append(html);
      
      var count = dom.jiedaCount.text()|0;
      dom.jiedaCount.text(++count);
    });
  };

  //求解管理
  gather.jieAdmin = {
    //删求解
    del: function(div){
      layer.confirm('确认删除吗？', function(index){
        layer.close(index);
        var id = $('#hidden_article_id').val()||0;
        fly.json('/article/remove/'+id, {
        }, function(res){
          if(res.code == 0){
            location.href = '/';
          } else {
            layer.msg(res.msg);
          }
        });
      });
    }
    
    //设置置顶、状态
    ,set: function(div){
      var othis = $(this);
      fly.json('/api/jie-set/', {
        id: div.data('id')
        ,rank: othis.attr('rank')
        ,field: othis.attr('field')
      }, function(res){
        if(res.status === 0){
          location.reload();
        }
      });
    }

    //收藏
    ,collect: function(div){
      var othis = $(this), type = othis.data('type');
      fly.json('/collection/'+ type +'/', {
        cid: div.data('id')
      }, function(res){
        if(type === 'add'){
          othis.data('type', 'remove').html('取消收藏').addClass('layui-btn-danger');
        } else if(type === 'remove'){
          othis.data('type', 'add').html('收藏').removeClass('layui-btn-danger');
        }
      });
    }
  };

  $('body').on('click', '.jie-admin', function(){
    var othis = $(this), type = othis.attr('type');
    gather.jieAdmin[type] && gather.jieAdmin[type].call(this, othis.parent());
  });

    var getCommentUrl=function (page) {
        var id = $('#hidden_article_id').val(), aid = $('#hidden_author_id').val();
        return '/jie/comment/' + id + '/' + aid + '/' + page
    },loadComments=function (page) {
        fly.json(getCommentUrl(page), {}, function (html) {
            var e = document.getElementById('jieda');
            e.innerHTML = html;
            var bodys =document.getElementsByClassName('jieda-body');
            for (var i=0;i<bodys.length;i++){
                bodys[i].innerHTML = fly.content(bodys[i].innerText);
            }
         var c = parseInt($('#jiedaCount').text());
            if(c>20) {
              layui.laypage.render({
                elem: 'comment_page'
                , count: parseInt($('#jiedaCount').text())
                , limit: 20
                , curr: page
                , jump: function (obj, first) {
                  if (!first) {
                    var curr = obj.curr;
                    loadComments(curr);
                  }
                }
              });
            }
        }, {type: 'GET', dataType: 'html'});
    }
    var renderComments = function () {
      var e = document.getElementById('div_article_content');
      if (e) {
        var interval = setInterval(function () {
          if (fly.faces) {
            clearInterval(interval);
            e.innerHTML = fly.content(e.innerText);
            e.removeAttribute('style');
            loadComments(1);
          }
        }, 1);
      }
    }
  //异步渲染
  var asyncRender = function(){
    var div = $('.fly-admin-box'), jieAdmin = $('#LAY_jieAdmin');
    //查询帖子是否收藏
    if(jieAdmin[0] && layui.cache.user.uid != -1){
        jieAdmin.append('<span class="layui-btn layui-btn-xs jie-admin layui-btn-danger" type="collect" data-type="add">收藏</span>');
      // fly.json('/collection/find/', {
      //   cid: div.data('id')
      // }, function(res){
      //   jieAdmin.append('<span class="layui-btn layui-btn-xs jie-admin '+ (res.data.collection ? 'layui-btn-danger' : '') +'" type="collect" data-type="'+ (res.data.collection ? 'remove' : 'add') +'">'+ (res.data.collection ? '取消收藏' : '收藏') +'</span>');
      // });
    }
    renderComments();
  }();
  //解答操作
  gather.jiedaActive = {
    zan: function(li){ //赞
      var othis = $(this), ok = othis.hasClass('zanok');
      fly.json('/api/jieda-zan/', {
        ok: ok
        ,id: li.data('id')
      }, function(res){
        if(res.status === 0){
          var zans = othis.find('em').html()|0;
          othis[ok ? 'removeClass' : 'addClass']('zanok');
          othis.find('em').html(ok ? (--zans) : (++zans));
        } else {
          layer.msg(res.msg);
        }
      });
    }
    ,reply: function(li){ //回复
      var val = dom.content.val();
      var aite = '@'+ li.find('.fly-detail-user cite').text().replace(/\s/g, '');
      dom.content.focus()
      if(val.indexOf(aite) !== -1) return;
      $('#hidden_article_reply_id').val(li.data('id'));
      dom.content.val(aite +' ' + val);
    }
    ,accept: function(li){ //采纳
      var othis = $(this);
      layer.confirm('是否采纳该回答为最佳答案？', function(index){
        layer.close(index);
        fly.json('/article/reply/adopt/'+li.data('id'), {artId:$('#hidden_article_id').val()}, function(res){
          if(res.code === 0){
            $('.jieda-accept').remove();
            li.addClass('jieda-daan');
            li.find('.detail-about').append('<i class="iconfont icon-caina" title="最佳答案"></i>');
          } else {
            layer.msg(res.msg);
          }
        });
      });
    }
    ,edit: function(li){ //编辑
      fly.json('/article/reply/content/'+li.data('id'), {}, function(res){
        layer.prompt({
          formType: 2
          ,value: res.data
          ,maxlength: 100000
          ,title: '编辑回帖'
          ,area: ['728px', '300px']
          ,success: function(layero){
            fly.layEditor({
              elem: layero.find('textarea')
            });
          }
        }, function(value, index){
          fly.json('/article/reply/content/'+li.data('id'),{content: value
          }, function(res){
            layer.close(index);
            li.find('.detail-body').html(fly.content(value));
          });
        });
      },{type:'GET'});
    }
    ,del: function(li){ //删除
      layer.confirm('确认删除该回答么？', function(index){
        layer.close(index);
        fly.json('/article/reply/remove/'+li.data('id'), { }, function(res){
          if(res.code === 0){
            var count = dom.jiedaCount.text()|0;
            dom.jiedaCount.html(--count);
            li.remove();
            //如果删除了最佳答案
            if(li.hasClass('jieda-daan')){
              $('.jie-status').removeClass('jie-status-ok').text('求解中');
            }
          } else {
            layer.msg(res.msg);
          }
        });
      });    
    }
  };

  $(document).on('click','.jieda-reply span',function () {
    var othis = $(this), type = othis.attr('type');
    gather.jiedaActive[type].call(this, othis.parents('li'));
  });


  //定位分页
  if(/\/page\//.test(location.href) && !location.hash){
    var replyTop = $('#flyReply').offset().top - 80;
    $('html,body').scrollTop(replyTop);
  }

  exports('jie', null);
});