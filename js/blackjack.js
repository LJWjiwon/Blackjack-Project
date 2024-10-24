/*----------- 돈을 칩으로 계산 ----------------*/
var nChips = new Array()    //칩 개수 저장

function RandomChip() {     //처음 시작할 때 실행
    var RandomDollar = 0;
    nChips = [];

    RandomDollar = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;     //1000 ~ 10000 랜덤값 추출

    convert_Chip(RandomDollar);
}

function convert_Chip(RandomDollar) {  
    document.getElementById("total_dollar").innerHTML = RandomDollar;  //html 기존 텍스트 뒤에 추가(총 금액)

    var CHIP = [1000, 500, 100, 25, 5, 1]

    for (let i = 0; i < CHIP.length; i++) {
        let num = Math.floor(RandomDollar / CHIP[i])    //칩 개수 계산
        nChips.push(num)

        RandomDollar %= CHIP[i]     //거스름돈 계산
    }

    // 각 div를 선택
    const divs = document.querySelectorAll(".chip-count");

    for (let i = 0; i < divs.length && i < nChips.length; i++) {    //div에 개수
        if (nChips[i] != 0) {
            const img = document.getElementById("chip" + i);

            divs[i].textContent = `${nChips[i]}개`;

            img.style.opacity = "1";
            img.style.cursor = "pointer";   //커서 손가락 모양으로
        }
        else {  //0개면 칩 투명도 낮춤
            const img = document.getElementById("chip" + i);
            
            img.style.opacity = "0.5";
            img.style.cursor = "default";

            divs[i].textContent = ``;
        }
    }
}



/* -------------- 카드덱 섞기 -----------------*/ 

var dec = [];   //덱 저장(1개)
var cardName = ["ace", "jack", "king", "queen"];

for (var i = 2; i < 11; i++) {
    dec.push(i + "_clubs");
    dec.push(i + "_diamonds");
    dec.push(i + "_hearts");
    dec.push(i + "_spades");
}

for(var i = 0; i < 4; i++) {
    dec.push(cardName[i] + "_clubs");
    dec.push(cardName[i] + "_diamonds");
    dec.push(cardName[i] + "_hearts");
    dec.push(cardName[i] + "_spades");
}

// 4개의 카드 덱을 사용
var fullDeck = dec.concat(dec, dec, dec);  // 카드덱 합침

var card=[];    //섞인 카드 저장될 배열
var rst = [];   //랜덤한 수 저장될 배열(인덱스 수)

function getRandom(min, max) {
return Math.floor((Math.random() * (max - min + 1)) + min);     //min에서 max까지 중 랜덤한 수 추출
}


function getRandom_Index(min, max, count) {  //랜덤 인덱스 값 뽑는 함수
    while (1) {     
        var index = getRandom(min, max);

        if (rst.indexOf(index) > -1) {      //중복되면 다시 뽑기
            continue;
        }
        rst.push(index);    //rst 배열에 랜덤 수 넣음

        // 원하는 배열 갯수가 되면 종료
        if (rst.length == count) {
            break;
        }
    }

    return rst;
}

function suple(){ //카드 섞기
    getRandom_Index(0, fullDeck.length-1, fullDeck.length);

    for (var i = 0; i < fullDeck.length ; i++) {
        card.push(fullDeck[rst.pop()]);  //fullDeck[rst에서 꺼낸 랜덤값] 카드를 card 배열에 집어넣음
    }
}


/* -------------- 카드 뽑기 ------------------ */

var player_card = [];   //플레이어 보유 카드 목록
var deler_card = [];    //딜러 보유 카드 목록
var deler_bust = 0;    //버스트 상태 확인
var player_bust = 0;

var count = 0;  //뽑을 카드 인덱스

//플레이어 카드 1장 뽑기 함수
function player_draw() {    
    player_card.push(card[count++]);    //플레이어 카드 뽑고 인덱스 증가
    sum_player(0);  //플레이어 점수 계산 함수 호출
}

//딜러 카드 1장 뽑기 함수
function deler_draw() {
    var deler_score = parseInt(sum_deler(0));   //딜러 점수

    if(deler_score < 17) {  //16이하일 경우 hit
        deler_card.push(card[count++]);
        sum_deler(0);   //딜러 점수 계산
    }
}

//플레이어 카드 보여주는 함수
function player_card_show() {   
    var cell = document.querySelector(".player-board"); // 플레이어 카드가 표시될 HTML 요소 가져오기

    //기존의 카드 요소 제거(중복 카드 표시 방지)
    while (cell.hasChildNodes()) { // 요소가 자식 노드를 가질 때까지 반복
        cell.removeChild(cell.firstChild); // 기존 카드 요소를 모두 제거
    }

    // player_card 배열의 모든 카드를 차례대로 출력
    for (var i = 0; i < player_card.length; i++) { 
        console.log(player_card[i]);
        var div = document.createElement("div"); // 새로운 div 요소 생성

        div.id = "player" + i; // 각 카드에 고유한 ID 부여

        // 카드 이미지를 배경으로 설정
        div.style.backgroundImage = "url('/image/PNG-cards/" + player_card[i] + ".png')"; // 플레이어 카드 이미지를 설정   //card배열값.png
        div.style.backgroundSize = "120px 180px"; // 카드 이미지 크기 설정
        cell.appendChild(div); // 플레이어 보드에 카드 추가
    }
}

// 딜러 카드 보여주기 함수
function deler_card_show(num) {
    var cell = document.querySelector(".deler-board");

    while (cell.hasChildNodes()) { //기존 요소 제거
        cell.removeChild(cell.firstChild); 
    }

    if (num == 1) { // 딜러의 첫 번째 카드 숨김
        var div = document.createElement("div"); // 새로운 div 요소 생성

        div.id = "deler" + 0; // 첫 번째 카드에 고유한 ID 부여
        div.style.backgroundImage = "url('/image/PNG-cards/card_back.png')"; 
        div.style.backgroundSize = "120px 180px"; 
        cell.appendChild(div); 
    }

    for (var i = num; i < deler_card.length; i++) { 
        var div = document.createElement("div"); 

        div.id = "deler" + i; 
        div.style.backgroundImage = "url('/image/PNG-cards/" + deler_card[i] + ".png')"; 
        div.style.backgroundSize = "120px 180px"; 
        cell.appendChild(div); // 딜러 보드에 카드 추가
    }
}

//다시시작
function new_start(){ 
    suple();
    turn_start();
}


/* ---------------------턴 시작 -------------- */

function turn_start() { //카드 각각 2장씩 뽑기
    player_card = [];  // 플레이어의 카드 배열 초기화
    deler_card = [];     // 딜러의 카드 배열 초기화 
    deler_bust = 0;
    player_bust = 0;

    player_draw();     
    deler_draw();        
    player_draw();     
    deler_draw();        
    
    player_card_show(); // 플레이어의 카드를 화면에 표시
    deler_card_show(1);   // 딜러의 카드를 화면에 표시 (첫 번째 카드는 뒷면으로)

    BlackJack_check();  //블랙잭 체크

    var player_sum = sum_player(0);
    if (player_sum > 21) {
        P_bust();
    }
}

/* -------------- 버스트, 블랙잭 ------------------- */

//플레이어 버스트
function P_bust() {
    if(player_bust == 0) { 
        player_card_show(); // 플레이어의 카드 상태를 화면에 업데이트
        setTimeout(function() {
            deler_card_show(0); // 딜러의 첫 번째 카드 오픈

            player_bust = 1;    //플레이어 버스트 상태 변환
            setTimeout(function() {
                alert("Bust!\n게임에서 졌습니다.");
            }, 500);
        }, 500);
    }
    console.log(nChips);
}

// 딜러 버스트 함수
function D_bust() { 
    deler_card_show(0); // 딜러의 카드 상태를 화면에 업데이트 (첫 번째 카드 보이기)
    
    // com_bust가 0이면 (딜러가 아직 버스트 상태가 아닐 경우)
    if (deler_bust == 0) {
        deler_bust = 1; // 딜러의 버스트 상태를 1로 설정

        setTimeout(function() {
            alert("Deler Bust!\n게임에서 이겼습니다.");
        }, 500);
    }
}

function BlackJack_check() {
    var player_sum = sum_player(0);
    var deler_sum = sum_deler(0);

    if (player_sum == 21) { 
        if (deler_sum == 21) {
            deler_card_show(0);
            setTimeout(function() {
                alert("무승부입니다.");
            }, 500);
        }
        else {
            deler_card_show(0);
            setTimeout(function() {
                alert("Black Jack! 축하드립니다.");
            }, 500);
        }
    }
    else if (deler_sum == 21) {
        deler_card_show(0);
        setTimeout(function() {
            alert("딜러 Black Jack. 게임에서 졌습니다.");
        }, 500);
    }
}



/* ------------ 합계 계산 ------------ */

//플레이어 카드 합 계산
function sum_player(ace){ 
    var Player_sum = 0;

    if(ace == 0){
        for (var i = 0; i < player_card.length; i++) {
            if(player_card[i][1] == '0' || player_card[i][0] == 'j'|| player_card[i][0] == 'q' || player_card[i][0] == 'k'){
                Player_sum += 10;
            }
            else if (player_card[i][0]=='a') {    //A는 11로 계산 한 다음 합이 21이 넘으면 1로 계산
                Player_sum += 11;
            }
            else{
                Player_sum += parseInt(player_card[i][0]);
            }
        }

        const player_sum_txt = document.getElementById("player_card_sum");
        player_sum_txt.textContent = Player_sum;

        if (Player_sum > 21){
            return sum_player(1);   //합 21 넘어서 A 1로 
        }
    }

    if(ace == 1) {
        for (var i = 0; i < player_card.length; i++) {
            if(player_card[i][1]=='0'||player_card[i][0]=='j'||player_card[i][0]=='q'||player_card[i][0]=='k'){
                Player_sum += 10;
            }
            else if (player_card[i][0] == 'a') {    //A를 1로 
                Player_sum += 1;
            }
            else{
                Player_sum += parseInt(player_card[i][0]);
            }
        }

        const player_sum_txt = document.getElementById("player_card_sum");
        player_sum_txt.textContent = Player_sum;

        if(Player_sum > 21) {
            setTimeout(P_bust, 100);
        }
    }

    return Player_sum;
}

//딜러 합 계산
function sum_deler(ace){    
    var Deler_sum = 0;

    if(ace == 0) {
        for (var i = 0; i < deler_card.length; i++) {
            if(deler_card[i][1]=='0'|| deler_card[i][0]=='j'|| deler_card[i][0]=='q'|| deler_card[i][0]=='k'){
                Deler_sum += 10;
            }
            else if (deler_card[i][0]=='a') {   //A는 11로 계산 한 다음 합이 21이 넘으면 1로 계산
                Deler_sum += 11;
            }
            else{
                Deler_sum += parseInt(deler_card[i][0]);
            }
        }

        if (Deler_sum > 21) {
            return sum_deler(1);
        }
    }

    if (ace == 1) {
        for (var i = 0; i < deler_card.length; i++) {
            if(deler_card[i][1]=='0'||deler_card[i][0]=='j'||deler_card[i][0]=='q'||deler_card[i][0]=='k'){
                Deler_sum += 10;
            }
            else if (deler_card[i][0] == 'a') {
                Deler_sum += 1;
            }
            else {
                Deler_sum += parseInt(deler_card[i][0]);
            }
        }
    }

    console.log(Deler_sum);

    return Deler_sum;
}


/* --------- 이미지 onclick 함수 ------------- */

var selectedChips = []; // 선택된 칩 이미지 URL을 저장할 배열

function img_click(event) {
    console.log(selectedChips);

    const imageUrl = event.target.src; // 클릭한 이미지의 URL
            
    // 클릭한 이미지가 이미 배열에 있는지 확인
    if (!selectedChips.includes(imageUrl)) {
        selectedChips.push(imageUrl); // 배열에 이미지 URL 추가
        display_ChipImages(); // 이미지 표시 함수 호출
    }
}

// 기존 이미지를 초기화, 배열에 있는 이미지를 순차적으로 삽입
function display_ChipImages() {
    for (let i = 0; i < 6; i++) {  
        const bet_chip_div = document.getElementById(`bet-chip-box${i}`); // div 선택

        bet_chip_div.innerHTML = ''; // 기존 이미지 초기화

        if (selectedChips[i]) { // 배열에 해당하는 이미지가 있으면
            const imgElement = document.createElement('img'); // 새로운 이미지 요소 생성
            imgElement.src = selectedChips[i]; // URL 설정
            imgElement.alt = 'Selected Image'; // 대체 텍스트 설정
            bet_chip_div.appendChild(imgElement); // div에 이미지 추가
        }
    }
}



/* ------------------ hit, stay ------------------- */

function Hit(){    // hit
    player_draw();  //카드 한장 뽑기 
    player_card_show();

    var player_sum = sum_player(0);
    var deler_sum = sum_deler(0);

    if (player_sum == 21) {
        if(deler_sum == 21) {
            deler_card_show(0);
            setTimeout(function() {
                alert("draw!무승부!");
            }, 500);
        }
        else {
            deler_card_show(0);
            setTimeout(function() {
                alert("Your Win!");
            }, 500);
        }
    }
    else if (player_sum > 21) {
        P_bust();
        
    }
    else {
        setTimeout(function() {     //0.5초후 딜러 카드 뽑기
            deler_draw();     
            deler_card_show(1);   
            sum_deler(0);
        }, 500);
    }
}

function Stay(){  //stay
    var player_sum = sum_player(0);
    var deler_sum = sum_deler(0);

    player_card_show();
   
    if(deler_sum > 21) {    //딜러 버스트 상태 확인
        setTimeout(D_bust,100);    //딜러 버스트
    }
    else if(deler_sum < 17){    //딜러 17 미만일 경우 카드 뽑기
        deler_draw();
        deler_card_show(1);
    }
    else {
        if ((player_sum > deler_sum) || deler_sum > 21) {    //플레이어 승
            deler_card_show(0);
            setTimeout(function() {
                alert("Your win");
            }, 500);
        }
        else if (player_sum < deler_sum){   //플레이어 패
            deler_card_show(0);
            setTimeout(function() {
                alert("deler win");
            }, 500);
        }
        else{
            deler_card_show(0);
            setTimeout(function() {
                alert("draw!무승부!"); 
            }, 500);    //무승부
        }
    }
}



/*------------------- 활성/비활성 --------------------*/

//버튼 존재 여부 검사 후 onclick 이벤트 추가 
function add_click_event() {    

    for (let i = 0; i < nChips.length; i++) {    //div에 개수
        const img = document.getElementById("chip" + i);

        if (nChips[i] != 0) {
            if (!img.hasAttribute('data-click-active')) {  //칩 onclick 활성화
                img.addEventListener('click', img_click);   //onclick 이벤트 추가
                img.setAttribute('data-click-active', 'true');  // 클릭 활성화 상태 표시
            }
        }
        else {  //0개면 칩 onclick 비활성화
            if (img.hasAttribute('data-click-active')) {    //onclick 이벤트 있는 상태라면
                img.removeEventListener('click', img_click);  // 이벤트 핸들러 제거
                img.removeAttribute('data-click-active');  // 클릭 활성화 상태 제거
            }
        }
    }
}



/*------------------ 베팅 -------------------*/     

function Play_bet() {   //칩 베팅하기
    add_click_event();  //베팅하기 누르면 버튼 onclick 이벤트 활성
    selectedChips = []; //전에 베팅한 칩 이미지 초기화 

    for (let i = 0; i < 6; i++) {  //베팅 칩 이미지 초기화
        const bet_chip_div = document.getElementById(`bet-chip-box${i}`); // div 선택

        bet_chip_div.innerHTML = ''; 
    }

    setTimeout(function() {
        alert("칩을 누르면 베팅이 됩니다.\n베팅이 끝났을 경우 베팅 버튼을 눌러서 게임을 시작해주세요.");
    }, 300);
}

function betting() {    //베팅 누르면 베팅하기하고 베팅 버튼 없어지게 
    new_start();
}


/*------------------- 금액 ----------------------*/ 




/*------------------게임 끝----------------------*/ 