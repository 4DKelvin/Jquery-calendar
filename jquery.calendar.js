(function ($) {
  $.fn.calendar = function (args) {

    var self = this;

    var $this = $(this);

    //控件内部用变量
    var $data = function (key, value) {
      if (value) {
        $this.data(key, value);
      } else {
        return $this.data()[key];
      }
    };

    //表头
    var $header = $('<div/>', {
      class: 'ui-header'
    });

    //内容区域
    var $content = $('<div/>', {
      class: 'ui-content'
    });

    //默认的配置选项
    var _options = {
      currentDate: new Date(), //当前日期
      onBeforeChange: function ($calendar) {
        //这里可以添加Ajax代码，注意要async:false
      },
      onRender: function (date, $calendar) {
        //这里可以定制你的日历内容
        return null;
      },
      onItemClick: function (date, $dayWrapper) {
        //某一天点击的事件
      },
      onInit: function ($calendar) {
        //初始化事件
      }
    };

    //上一个月
    this.prev = function () {
      return self.setDate($data('currentDate').setMonth($data('currentDate').getMonth() - 1));
    };

    //下一个月
    this.next = function () {
      return self.setDate($data('currentDate').setMonth($data('currentDate').getMonth() + 1));
    };

    this.setDate = function (date) {
      $data('currentDate', new Date(new Date(date).setDate(1)));
      self._render();
      return $this;
    };

    this.getDate = function () {
      return $data('currentDate')
    };

    this._render = function () {
      //获取当前月分的第一日和最后一日
      var first = new Date($data('currentDate').getFullYear(), $data('currentDate').getMonth(), 1).getDay();
      var last = new Date($data('currentDate').getFullYear(), $data('currentDate').getMonth() + 1, 0).getDay();
      //从而得到日历的开始日期和结束日期
      var startDate = new Date($data('currentDate').getFullYear(), $data('currentDate').getMonth(), 1 - first);
      var endDate = new Date($data('currentDate').getFullYear(), $data('currentDate').getMonth() + 1, 7 - last - 1);

      //加载中。。。
      $this.addClass('loading');
      $data('onBeforeChange')($this);

      //根据日历的start to end 做循环
      var contentRow, currentDate = startDate;
      while (currentDate <= endDate) {
        if (currentDate.getDay() == 0) {
          //如果是星期日
          if (contentRow) {
            //如果原来行有数据就先添加到内容区域
            contentRow.appendTo($content);
          }
          contentRow = $('<div/>', {
            class: 'ui-week'
          });
        }
        var contentCell = $data('onRender')(currentDate, $this);
        if (!contentCell) {
          //如果调用没有设置的日历内容，则使用默认的
          contentCell = $('<div/>');
          if (currentDate.getDate() == 1) {
            //如果是第一日就添加月份
            contentCell.append($('<i/>').html(currentDate.getMonth() + 1 + "月"))
          }
          contentCell.append($('<span/>').html(currentDate.getDate()));
        }

        $(contentCell).attr({
          'year': currentDate.getFullYear(),
          'month': currentDate.getMonth() + 1,
          'day': currentDate.getDate()
        });

        //如果大于今日就加上属性
        if (currentDate >= new Date()) {
          $(contentCell).addClass('enable-date ui-date');
        } else {
          $(contentCell).addClass('ui-date');
        }

        $(contentCell).appendTo(contentRow);

        $(contentCell).off('click').on('click', function () {
          //当日历被点击，触发事件
          $data('onItemClick')(currentDate, $(contentCell));
        });
        //每次循环当前日期加一
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      }
      $this.find('.ui-content').remove();
      $content.append(contentRow).appendTo($this);
      $this.removeClass('loading');
    };

    //初始化事件
    this.init = function (options) {
      //将初始化参数持久化
      $options = $.extend(_options, options);
      for (var k in $options) {
        $data(k, $options[k]);
      }
      //生成日历的表头
      $(["日", "一", "二", "三", "四", "五", "六"]).each(function (i, e) {
        $('<div/>', {
          class: 'ui-date'
        }).html(e).appendTo($header);
      });
      //清理目标区域的html
      $this.addClass('ui-calendar').html('');
      //将表头和内容输出
      $header.appendTo($this);
      $content.appendTo($this);
      //触发事件
      $data('onInit')($this);
      //按Option生成内容部分
      self.setDate($data('currentDate'));
    };

    if (args == undefined || args.constructor == Object) {
      return this['init'](args);
    } else {
      return this[args](arguments[1]);
    }

    return $this;//return jquery obj
  };
}(jQuery));
