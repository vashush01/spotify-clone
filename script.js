let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const PlayMusic = (track,pause=false)=> {
  currentSong.src = "/songs/" + track 
  if(!pause){
    currentSong.play()
    play.src = "img/pause.svg" 
  } 
  
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00" 
   // let audio = new Audio("/songs/" + track) 
}

async function main() {

    songs = await getSongs("songs/");
 PlayMusic(songs[0],true)
// Show all the songs in the Playlist
  let songurl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songurl.innerHTML =
      songurl.innerHTML +
      ` <li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
              <div>${song.replaceAll("%20", " ")} </li> </div>
              <div> Vashu Sharma </div>
            </div>
            <div class="playnow">
              <span>Play Now</span>
              <img class="invert" src="img/play.svg" alt="">
            </div> </li>`;      
  }

  //attach a event listner to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element =>{
    console.log(e.querySelector(".info").firstElementChild.innerHTML)
    PlayMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
  })
})

// Attach an event listner to play , next and previous
    play.addEventListener("click",()=> {
      if(currentSong.paused){
        currentSong.play()
        play.src = "img/pause.svg"
      } else {
        currentSong.pause()
        play.src = "img/play.svg"
      }
    })
    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // add an event lister to seekbar 
    document.querySelector(".seekbar").addEventListener("click",e=> {
      let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left = percent + "%";
      currentSong.currentTime = ((currentSong.duration)  * percent)/100
    })


    // add evnet listner for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=> {
      document.querySelector(".left").style.left = "0"
    })
    //add an event listner to close button
     document.querySelector(".close").addEventListener("click",()=> {
      document.querySelector(".left").style.left = "-110%"
    })

    // add an event listner to previous and next 
    previous.addEventListener("click",()=> {
      console.log("Previous Clicked")
      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      if((index-1)>= 0){
        PlayMusic(songs[index-1])
      }
    })
    next.addEventListener("click",()=> {
      console.log("Next Clicked")

      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      console.log(songs , index)
      if((index+1) > length)
      PlayMusic(songs[index+1])
    })
    // add an event to volume
    document.querySelector(".range").getElementsByTagName(".input")[0].addEventListener("change",(e)=> {
      (e, e.target, e.target.value)
      currentSong.volume = parseInt(e.target.value)/100
    })

    // add ana event listner to mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
      if(e.target.src.includes("img/volume.svg")){
        e.target.src = e.target.src.replace("img/volume.svg","img/mute.svg")
        currentSong.volume = 0;
      }
      else {
        e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
        currentSong.volume = .10;
      }
    })



}
main();


