var lrcObj = [];
var el = null;
var controlDiv = null;
var lrc = null;
var audio = null;
var curIndex = null;
var offset = 0.2;
var lrcDiv = null;
var lrcUl = null;
var lrcHeight = null;
var liHeight = null;
var timer = 0;
function init(options){
    initData(options);
    render();
    control();
    getLrcAttr();
}
function initData(options){
    el = options.el;
    lrc = options.lrc;
    audio = document.getElementsByTagName('audio')[0];
    controlDiv = el.getElementsByClassName('control')[0];
    lrcObj = getLrc(lrc);

}
function render(){
    renderLrc();
    into();
};
function renderLrc(){
    var lrcUl = el.querySelector('.lrcWord ul');
    var template = '';
    for(var i in lrcObj){
        template+=`
            <li class='li'>${lrcObj[i].words}</li>
        `
    }
    lrcUl.innerHTML = template;
};
function control(){
    audio.ontimeupdate = setCurrentStyle;
    getOffset();
    colseTip();
};
function setCurrentStyle(){
    minIndx = getMinIndex();
    setPosition();
    if(minIndx !== -1 ){
        if(curIndex === null){
            curIndex = minIndx;
        }else{
            var pre = el.getElementsByClassName('active')[0];
            pre.classList.remove('active');
        }
        var oLi = el.getElementsByTagName('li')[minIndx];
        oLi.classList.add('active');
    }
    
};
/**
 * 获取正在演唱歌词句下标
 */
function getMinIndex(){
    var curSecond = audio.currentTime +offset;
    for(var i = lrcObj.length-1; i>=0 ;i--){
        var a = lrcObj[i].time;
        if(a < curSecond){
            return i;
        }
    }
    return -1;
};
/**
 * 在演唱歌词的时候调整歌词的播放速度
 */
function getOffset(){
    var btn = el.getElementsByClassName('offset')[0];
    btn.onclick = function(e){
        isSlow = e.target.classList.contains('reduction');
        isFast = e.target.classList.contains('add');
        if(isSlow){
            offset -= 0.1;
        }else if(isFast){
            offset += 0.1;
        }
    }
};
/**
 * 调整歌词位置
 * 当前演唱歌词始终位于歌词内容区中间位置
 */
function setPosition(){
    var curIndex = getMinIndex();  
    if(curIndex === -1){
        lrcUl.style.top = '20px'
    }else{
        var top = lrcHeight/2 - (liHeight*curIndex + liHeight/2);
        lrcUl.style.top = top>0?'20px':top + 'px';
    }
};
/**
 * 获取歌词div的相关属性
 */
function getLrcAttr(){
    lrcDiv = el.getElementsByClassName('lrcWord')[0];
    var li = lrcDiv.getElementsByClassName('li')[0];
    lrcUl = lrcDiv.getElementsByTagName('ul')[0];
    liHeight = li.offsetHeight;  //每个Li元素的高度
    lrcHeight = lrcDiv.offsetHeight; //歌词div的高度
}
/**
 * 处理歌词文件
 */
function getLrc(data){
    var result = [];
    var lrcArr = data.split('\n');
    for(var i in lrcArr){
        reg = /(\[|\])/g
        var arr = lrcArr[i].split(reg)
        var timeArr = arr[2].split(':');
        var time = timeArr[0]*60 + (+timeArr[1]);
        var words = arr[4];
        result.push({time,words})
    }
    return result;
};

/**
 * 入场样式转换
 */
function into(){
    timer = setTimeout(function(){
        var bgWord = el.getElementsByClassName('bgWord')[0];
        bgWord.style.top = '0px';
        bgWord.children[0].style.fontSize = '60px';
        bgWord.children[1].style.fontSize = '60px';
        lrcDiv.style.top = '150px';
        lrcDiv.style.display = 'block';

    },2000)
};
/**
 * 音乐控制器
 */
function pause(){
    var pauseDiv = document.querySelector('.play .pause');
    var pauseSpan = document.querySelector('.play .pauseico');
    var playSpan = document.querySelector('.play .playico');
    pauseDiv.onclick = function(e){
        var isPause = e.target.classList.contains('pauseico');
        if(isPause){
            audio.play();
            pauseSpan.style.display = 'none';
            playSpan.style.display = 'inline-block';
        }else{
            audio.pause();
            pauseSpan.style.display = 'inline-block';
            playSpan.style.display = 'none';
        }
    };
};
function stop(){
    var stopDiv = document.querySelector('.play .stop');
    var pauseSpan = document.querySelector('.play .pauseico');
    var playSpan = document.querySelector('.play .playico');
    stopDiv.onclick = function(){
        audio.currentTime=0;
        audio.pause();
        pauseSpan.style.display = 'inline-block';
        playSpan.style.display = 'none';
    }
};
function volume(){
    var volumeDiv = document.querySelector('.volume');
    var add = document.querySelector('.volume .add');
    var reduction = document.querySelector('.volume .reduction');
    var noSound = document.querySelector('.volume .noSound');
    volumeDiv.onclick = function(e){
        var isAdd = e.target.classList.contains('add');
        var isRedu = e.target.classList.contains('reduction');
        if(isAdd){
            if(audio.volume>=0 && audio.volume<1){
                reduction.style.display = 'inline-block';
                noSound.style.display = 'none';
            }else if(audio.volume === 1){
                add.style.color = '#ccc'
                return;
            }
            var vol = audio.volume + 0.1;
            audio.volume=vol.toFixed(1);
        }else if(isRedu){
            var vol = audio.volume - 0.1;
            audio.volume=vol.toFixed(1);
            add.style.color = '#bb6222';
            if(audio.volume <= 0){
                reduction.style.display = 'none';
                noSound.style.display = 'inline-block';
                return;
            }
        }
    };
};

function showControl(){
    var controlDiv = el.getElementsByClassName('control')[0];
    var girlDiv = el.getElementsByClassName('girl')[0];
    girlDiv.onmouseenter = function(e){
        controlDiv.style.display = 'flex'
        console.log('触发girl的事件')
    };
    controlDiv.onmouseleave = function(){
        controlDiv.style.display = 'none';
        console.log('触发conDiv的事件')
    }
    controlDiv.addEventListener('click',function(){
        // controlDiv.style.display = 'flex';
        controlDiv.onmouseleave = function(){
            return;
        }
        console.log('监听事件')
    })
    controlDiv.addEventListener('mouseleave',function(){
        controlDiv.style.display = 'none';
        console.log('mouseleave')
    })
   
};
     
pause();
stop();
volume();
function colseTip(){
    var btn = document.querySelector('.tip .tipBtn');
    var tip = el.getElementsByClassName('tip')[0];
    btn.onclick = function(){
        tip.style.display = 'none';
    }
};
