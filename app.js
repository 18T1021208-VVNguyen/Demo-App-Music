const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const playBtn = $('.btn-toggle-play')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    isPlay : false,
    isRandom : false,
    isRepeat : false,
    currentIndex : 0,
    // config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))  ||  {} ,
    songs: [
        {
            title:'Roi Toi Luon',
            singer:'Nal',
            imgUrl:'./images/roi-toi-luon.jpeg',
            audioSrc:'./audio/roi-toi-luon.mp3'
        },

        {
            title:'Thien Dang',
            singer:'Wowwy & Jolipoli',
            imgUrl:'./images/thien-dang.jpeg',
            audioSrc:'./audio/thien-dang.mp3'
        },

        {
            title:'Hoa Hai Duong',
            singer:'Jack',
            imgUrl:'./images/hoa-hai-duong.jpeg',
            audioSrc:'./audio/hoa-hai-duong.mp3'
        },
    
        {
            title:'Sau Hong Gai',
            singer:'G5R Squad',
            imgUrl:'./images/sau-hong-gai.jpeg',
            audioSrc:'./audio/sau-hong-gai.mp3'
        },
    
        {
            title:'Thuong Nhau Toi Ben',
            singer:'Nal',
            imgUrl:'./images/thuong-nhau-toi-ben.jpeg',
            audioSrc:'./audio/thuong-nhau-toi-ben.mp3'
        },
    
        {
            title:'Khue Moc Lang',
            singer:'Huong Ly',
            imgUrl:'./images/khue-moc-lang.jpeg',
            audioSrc:'./audio/khue-moc-lang.mp3'
        },
        {
            title : 'Tướng Quân',
            singer : 'Nhật Phong',
            imgUrl : './images/Tuong-Quan-Remix.jpg',
            audioSrc : './audio/Tuong-Quan-Remix.mp3'
        },
        {
            title : 'Y Chang Xuân Sang',
            singer : 'Nal',
            imgUrl : './images/y-chang-xuan-sang.jpeg',
            audioSrc : './audio/y-chang-xuan-sang.mp3'
        }
    ],
    // setConfig: function(key,value){
    //     this.config[key] = value;
    //     localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify( this.config))
    // },
    render : function(){
            const htmls = this.songs.map( (song , index) => 
                `<div id = "song${index}" class="song"  data-index = "${index}">
                    <div class="thumb" style="background-image: url(${song.imgUrl})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.title}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`
             )
            playlist.innerHTML = htmls.join('')
    },
    currentSong : function(){
        return this.songs[this.currentIndex];
    },
    loadCurrenSong : function(){
        
        heading.innerText = this.currentSong().title
        cdThumb.style.backgroundImage = `url('${this.currentSong().imgUrl}')`
        audio.src = this.currentSong().audioSrc
        $(`#song${this.currentIndex}`).classList.add("active");
      
    },
    handleEvents: function(){
            const _this = this;
            const cd = $('.cd');
            const cdWidth = cd.offsetWidth
            // lắng nghe nhấn nút chạy nhạc
            playBtn.onclick = function(){
                    !_this.isPlay ? audio.play() : audio.pause();
                    _this.isPlay = ! _this.isPlay
        
            }
            // lắng nghe khi kết thúc bài hát 
            audio.onended = function(){
              _this.isRepeat ? audio.play() :_this.prevAndNextSong(_this.nextSong())
            }
            // lắng nghe khi audio.pause()
            audio.onpause = function(){
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }
            // lắng nghe khi audio.play()
            audio.onplay = function(){
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            
           // lắng nghe lúc nhạc đang chạy
            audio.ontimeupdate = function(){
                if(audio.duration)
                {
                    const progressPercent = audio.currentTime / audio.duration * 100
                    progress.step = progressPercent - progress.value;
                    progress.value = progressPercent  
                }
            }
            // khi tua bài hát
            progress.oninput = function(e){
                const seekTime = (e.target.value / 100) * audio.duration
                audio.currentTime = seekTime
            }
            // lắng nghe thay đổi kích thước CD
            document.onscroll = function(){
                
                const scrollTop = window.screenY || document.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop;
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                cd.style.opacity = newCdWidth / cdWidth
            }
            // Xử lý CD quay
            const cdThumbAnimate = cdThumb.animate([
                {transform : ' rotate(360deg)'}
            ],{duration : 10000 ,// 10 seconds
                iteration: Infinity } ) 
            cdThumbAnimate.pause()

            // Xử lý nextSong
            nextBtn.onclick = function(){
                _this.prevAndNextSong(_this.nextSong())
                _this.scrollToActiveSong()
            }
            // xử lý khi lùi
            prevBtn.onclick = function(){
               _this.prevAndNextSong(_this.prevSong())
                
            }
            
            // lắng nghe khi click random
            randomBtn.onclick = function(){
                    _this.isRandom = !_this.isRandom
                   // _this.setConfig('isRandom',_this.isRandom)
                    randomBtn.classList.toggle('active',_this.isRandom)
            }

            // Xử lý lặp lại song
            repeatBtn.onclick =function(){
                _this.isRepeat = ! _this.isRepeat
                //_this.setConfig('isRepeat',_this.isRepeat)
                repeatBtn.classList.toggle('active',_this.isRepeat)
            }

            playlist.onclick = function(e){
                // đi tìm element nào có class tên song mà loại class tên .active ra
                const songNode = e.target.closest('.song:not(.active)');
                const optionNode = e.target.closest('.option')
                if(songNode || optionNode ){
                    if(songNode)
                    {
                        $(`#song${_this.currentIndex}`).classList.remove("active")
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrenSong();
                        progress.value = 0
                        _this.isPlay ? audio.play() : audio.pause();
                    }
                    if(optionNode){

                    }
                }
            }
    },
    scrollToActiveSong : function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block : 'nearest'
            })
        },300)
    },
    // xử lý khi sự kiện nhấn nexSong và kết thúc bài hát 
    prevAndNextSong : function( callBack){
        !this.isRandom ? callBack : this.playRandomSong() 
        this.isPlay ? audio.play() : audio.pause();
        progress.value = 0
    },
    // xử lý nextSong 
    nextSong : function(){
        $(`#song${this.currentIndex}`).classList.remove("active")
        this.currentIndex ++;
        if(this.currentIndex>= this.songs.length)
            this.currentIndex = 0;
        this.loadCurrenSong();
        
        
    },
    // xử lý PrevSong
    prevSong : function(){
        $(`#song${this.currentIndex}`).classList.remove("active")
        this.currentIndex -- ;
        if(this.currentIndex <0)
            this.currentIndex = this.songs.length -1;
      
        this.loadCurrenSong();
        
    },
    playRandomSong : function(){
        let newIndex = 0;
        do{
                newIndex  = Math.floor(Math.random()*this.songs.length)
        }while (newIndex === this.currentIndex)
        $(`#song${this.currentIndex}`).classList.remove("active")
        this.currentIndex = newIndex;
        this.loadCurrenSong();
    },
    repeatSong :function(){
        audio.currentTime =0;
        progress.value = 0
    },
    start : function(){
             this.render()
            this.loadCurrenSong();
            this.handleEvents()
           
    },   
}
app.start();

