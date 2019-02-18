var Helper = {
    isBottom: function($viewport,$content){
        return $content.height() - 10 <= $viewport.height() + $viewport.scrollTop()
    },
    createNode: function(movie){
        var template = `<div class="item">
            <a href="#">
            <div class="cover">
            <img src="http://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg" alt="">
                    </div>
            <div class="detail">
                <h2></h2>
                <div class="extra">
                    <span class="score"></span>分/
                    <span class='collect'></span>收藏
                </div>
                <div class="extra">
                    <span class='year'></span>/
                    <span class='type'></span>
                </div>
                <div class="extra">
                    导演：<span class='director'></span>
                </div>
                <div class="extra">
                    主演：<span class='actor'></span>
                </div>
            </div>
            </a>           
            </div>`
        var $node = $(template)
        $node.find('.cover img').attr('src', movie.images.medium)
        $node.find('.detail h2').text(movie.title)
        $node.find('.score').text(movie.rating.average)
        $node.find('.collect').text(movie.collect_count)
        $node.find('.year').text(movie.year)
        $node.find('.type').text(movie.genres.join('/'))
        $node.find('.director').text(function () {
            var directorArr = []
            movie.directors.forEach(function (item) {
                directorArr.push(item.name)
            })
            return directorArr.join('、')
        })
        $node.find('.actor').text(function () {
            var actorArr = []
            movie.casts.forEach(function (item) {
                actorArr.push(item.name)
            })
            return actorArr.join('、')
        })

        return $node
    }

}
//分页跳转
var Paging = {
    init: function () {
        this.$tabs = $('footer>div')
        this.$panels = $('section')
        this.bind()
    },
    bind: function () {
        var _this = this
        this.$tabs.on('click', function () {
            $(this).addClass('active').siblings().removeClass('active')
            _this.$panels.eq($(this).index()).fadeIn().siblings().hide()
        })
    }
}

//排行前250
var top250 = {
    init: function(){
        this.index = 0
        this.isLoading = false
        this.$container = $('#top250')
        this.$content = this.$container.find('.container')
        this.isFinished = false

        this.bind()
        this.start()
    },
    bind: function(){
        var _this = this
        this.$container.on('scroll', function () {
            if(Helper.isBottom(_this.$container,_this.$content)&&!_this.isFinished&&!_this.isLoading){
                 _this.start()
            }      
        })
    },
    start: function(){
        var _this = this
        this.getData(function(data){
            _this.render(data)
        })
    },
    getData: function(callback){
        var _this = this
        if(_this.isLoading) return
        _this.isLoading = true
        _this.$container.find('.loading').show()
        $.ajax({
            type: 'GET',
            url: 'http://api.douban.com/v2/movie/top250',
            data: {
                start: _this.index,
                count: _this.count
            },
            dataType: 'jsonp'
        }).done(function(ret){
            console.log(ret)
            callback&&callback(ret)
            _this.index += 20
            if(_this.index >= ret.total){
                _this.isFinished = true
            }
        }).fail(function(){
            console.log('error')
        }).always(function(){
            _this.isLoading = false
            _this.$container.find('.loading').hide()
        })

    },
    render: function(data){
        var _this =  this
        data.subjects.forEach(function(movie){
            _this.$content.append(Helper.createNode(movie))
        })
    }
}

//北美地区票房排行
var Usbox = {
    init: function(){
        this.$container = $('#usBox')
        this.$content = this.$container.find('.container')

        this.start()
        
    },
    start: function(){
        var _this = this
        this.getData(function(data){
            _this.render(data)
        })
    },
    getData: function(callback){
        var _this = this
        _this.$container.find('.loading').show()
        $.ajax({
            type: 'GET',
            url: 'http://api.douban.com/v2/movie/us_box',
            dataType: 'jsonp'
        }).done(function(ret){
            console.log(ret)
            callback&&callback(ret)
        }).fail(function(){
            console.log('error')
        }).always(function(){
            _this.$container.find('.loading').hide()
        })
    },
    render: function(data){
        var _this = this
        data.subjects.forEach(function(movie){
            _this.$content.append(Helper.createNode(movie.subject))
        })

    }
}

//搜索电影
var Search = {
    init: function(){
        this.$container = $('#search')
        this.$content = this.$container.find('.container')
        this.keyword = ''
        this.isLoading = false
        this.isFinished = false
        this.index = 0
        this.count = 20

        this.bind()


    },
    bind: function(){
        var _this = this
        this.$content.find('.button').on('click',function(){
            _this.keyword = _this.$content.find('input').val()
            _this.start()

        })
        this.$container.on('scroll',function(){
            if (Helper.isBottom(_this.$container,_this.$content)&&!_this.isFinished&&!_this.isLoading){
                _this.start()
            }
        })
    },
    start: function(){
        var _this = this 
        this.getData(function(data){
            _this.render(data)
        })

    },
    getData: function(callback){
        var _this = this
        if(this.isLoading) return 
        this.isLoading = true
        this.$container.find('.loading').show()
        $.ajax({
            type: 'GET',
            url: 'http://api.douban.com/v2/movie/search',
            data:{
                q: _this.keyword,
                count: _this.count,
                start: _this.index
            },
            dataType: 'jsonp'
        }).done(function(ret){
            console.log(ret)
            callback&&callback(ret)
            _this.index += 20
            if(_this.index >= ret.total){
                _this.isFinished = true
            }
        }).fail(function(){
            console.log('error')
        }).always(function(){
            _this.isLoading = false
            _this.$container.find('.loading').hide()
        })

        
    },
    render: function(data){
        var _this = this
        data.subjects.forEach(function(movie){
            _this.$content.find('.search_result').append(Helper.createNode(movie))
        })

    }
}
var App = {
    init: function () {
        Paging.init()
        top250.init()
        Usbox.init()
        Search.init()
    }
}
App.init()