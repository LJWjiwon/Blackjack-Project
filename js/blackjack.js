/*----------- 돈을 칩으로 계산 ----------------*/

function RandomChip() {
    var RandomDollar = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;     //1000 ~ 10000 랜덤값 추출

    document.getElementById("total_dollar").innerHTML = RandomDollar;  //html 기존 텍스트 뒤에 추가(총 금액)

    var CHIP = [1000, 500, 100, 25, 5, 1]
    var nChips = new Array()    //칩 개수 저장

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

            if (img.onclick == null) {  //칩 onclick 다시 활성화
                img.onclick = img_click();
                img.style.opacity = "1";
            }
            img.style.cursor = "pointer";   //커서 손가락 모양으로
        }
        else {  //0개면 칩 onclick 비활성화
            const img = document.getElementById("chip" + i);

            img.onclick = null;
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

    if (num == 1) { // 딜러의 첫 번째 카드 뒷면
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
    RandomChip();
    suple();
    setTimeout(turn_start, 1000);
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
}

/* -------------- 버스트 ------------------- */

//플레이어 버스트
function P_bust() {
    if(player_bust == 0) { 
        player_bust = 1;    //플레이어 버스트 상태 변환
        alert("Bust!\n게임에서 졌습니다.");

        player_card_show(); // 플레이어의 카드 상태를 화면에 업데이트
        deler_card_show(0); // 딜러의 첫 번째 카드 오픈

        setTimeout(end, 100); // 100ms 후 게임 종료 함수 호출
    }
}

// 딜러 버스트 함수
function D_burst() { 
    deler_card_show(0); // 딜러의 카드 상태를 화면에 업데이트 (첫 번째 카드 보이기)
    
    // com_burst가 0이면 (딜러가 아직 버스트 상태가 아닐 경우)
    if (deler_burst == 0) {
        deler_burst = 1; // 딜러의 버스트 상태를 1로 설정

        alert("Deler Bust!\n게임에서 이겼습니다.");
    }
    
    deler_card_show(0); // 딜러의 카드 상태를 다시 업데이트
    setTimeout(end, 300); // 300ms 후 게임 종료 함수 호출
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

        var player_card_sum = document.getElementById('player-card_sum');
        player_card_sum.value = Player_sum;    //합계 화면에 보여짐

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

        var player_card_sum = document.getElementById('player-card_sum');
        player_card_sum.value = Player_sum;

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

    return Deler_sum;
}


/* --------- 이미지 onclick 함수 ------------- */
function img_click() {
    alert('칩 클릭');
}
