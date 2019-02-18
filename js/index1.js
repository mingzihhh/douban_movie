/* 图标点击切换*/
$('footer>div').on('click',function(){
    var index = $(this).index()
    $('section').hide().eq(index).fadeIn()
    $(this).addClass('active').siblings().removeClass('active')
})

var index = 0
var isLoading = false
start()
/*获取数据*/
function start() {
    if(isLoading) return 
    isLoading = true
    $('.loading').show()
    $.ajax({
        type: 'GET',
        url: 'http://api.douban.com/v2/movie/top250',
        data: {
            start: index,
            count: 20
        },
        dataType: 'jsonp'
    }).done(function(ret){
        console.log(ret)
        setData(ret)
        index += 20
    }).fail(function(){
        console.log('error ...')
    }).always(function(){
        isLoading = false
        $('.loading').hide()
    })
}
/*显示top250*/
function setData(data){
    data.subjects.forEach(function(movie){
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
        $node.find('.director').text(function(){
            var directorArr = []
            movie.directors.forEach(function(item){
                directorArr.push(item.name)
            })
            return directorArr.join('、')
        })
        $node.find('.actor').text(function(){
            var actorArr = []
            movie.casts.forEach(function(item){
                actorArr.push(item.name)
            })
            return actorArr.join('、')
        })

        $('#top250 .container').append($node)

    })

}

/*滚动到底部加载下一批数据*/
/*节流*/
// var time
// $('main').scroll(function(){
//     $('.loading').show()
//     if(time) {
//         clearTimeout(time)
//     }
//     time = setTimeout(function(){
//         if ($('section').eq(0).height() - 10 <= $('main').height() + $('main').scrollTop()) {
//             start()          
//         }
//     },3000)

// })
$('main').scroll(function(){
    if ($('section').eq(0).height() - 10 <= $('main').height() + $('main').scrollTop()) {
        start()          
    }
})