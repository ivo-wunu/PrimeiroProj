//Utilizando o DOM para trazer os id´s e as classes
const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

//selecionar as musicas e os artistas
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong(); 
});

// pegar o nome do artista e as musicas 
function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `imagens/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `musica/${allMusic[indexNumb - 1].src}.mp3`;
}

//função para reproduzir as musicas
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector(".play").src="imagens/video-pause-button.png";
  mainAudio.play();
}

//função para pausar
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector(".play").src="imagens/play-button.png";
  mainAudio.pause();
}

//Função para recuar a musica
function prevMusic(){
  musicIndex--; // decrementa 1 da musica
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

//Avançae a musica
function nextMusic(){
  musicIndex++;
  // aumenta um valor no tamanho do vector
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

//Pausar ou tocar a mucisa
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
 
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

//botão para recuar 
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

//Botão para avançar
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// barra de processo enquanto a musica reproduz
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; //pegar o tempo da musica
  const duration = e.target.duration; //pegar a duração total da musica
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", ()=>{
    // actualizar a duração total da musica
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });

  // actualizar o tempo total da musica
  let currentMin = Math.floor(currentTime / 60);// retorna o menor numero
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){// adicionar 00 se o segundo for menor que 10, 
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// actualizar a barra de processo consoante o som que está a tocar;
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; //pegar o processo bar
  let clickedOffsetX = e.offsetX; 
  let songDuration = mainAudio.duration; 
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); //chamada da playlist 
  playingSong();
});

//mostrar a lista de reprodução de musicas
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");// executar a ação mostrar quando é clicado no botão, o show, está no css
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// criar uma lista com as musicas da outra pagina
for (let i = 0; i < allMusic.length; i++) {
  //colocar o nome do artista e o titulo da musica no array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:10</span>
                <audio class="${allMusic[i].src}" src="musica/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //mostrar a playlist completa

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passar o total da duração da musica
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

//tocar as musicas a partir da lista de reprodução
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //adicionar playng na musica que esta a tocar
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//tocar o som que foi clicado
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; 
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}