/*----------- 돈을 칩으로 계산 ----------------*/
var RandomDollar = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;     //1000 ~ 10000 랜덤값 추출

document.getElementById("total_dollar").innerHTML += RandomDollar;  //html 기존 텍스트 뒤에 추가(총 금액)

var CHIP = [1000, 500, 100, 25, 5, 1]
var nChips = new Array()    //칩 개수 저장

for (let i = 0; i < CHIP.length; i++) {
    let num = Math.floor(RandomDollar / CHIP[i])    //칩 개수 계산
    nChips.push(num)

    RandomDollar %= CHIP[i]     //거스름돈 계산
}

// 각 div를 선택
const divs = document.querySelectorAll(".chip-box");

for (let i = 0; i < divs.length && i < nChips.length; i++) {    //div에 개수
    if (nChips[i] != 0) {
        divs[i].innerHTML = `${nChips[i]}개`;
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


/* ------- 카드 뽑기 ---------- */

var player_card = [];   //플레이어 보유 카드 목록
var deler_card = [];    //딜러 보유 카드 목록

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
    var cell = document.getElementsByClassName("player-board"); // 플레이어 카드가 표시될 HTML 요소 가져오기

    //기존의 카드 요소 제거(중복 카드 표시 방지)
    while (cell.hasChildNodes()) { // 요소가 자식 노드를 가질 때까지 반복
        cell.removeChild(cell.firstChild); // 기존 카드 요소를 모두 제거
    }

    // player_card 배열의 모든 카드를 차례대로 출력
    for (var i = 0; i < player_card.length; i++) { 
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
    var cell = document.getElementsByClassName("deler-board"); // 딜러 카드가 표시될 HTML 요소 가져오기

    while (cell.hasChildNodes()) { // 요소가 자식 노드를 가질 때까지 반복
        cell.removeChild(cell.firstChild); // 기존 카드 요소를 모두 제거
    }

    if (num == 1) { // 딜러의 첫 번째 카드 뒷면
        var div = document.createElement("div"); // 새로운 div 요소 생성

        div.id = "deler" + 0; // 첫 번째 카드에 고유한 ID 부여
        div.style.backgroundImage = "url('/image/PNG-cards/card_back.png')"; // 카드 뒷면 이미지를 설정
        div.style.backgroundSize = "120px 180px"; // 카드 이미지 크기 설정
        cell.appendChild(div); // 딜러 보드에 카드 추가
    }

    for (var i = num; i < deler_card.length; i++) { // com_card 배열의 카드들을 차례대로 출력
        var div = document.createElement("div"); // 새로운 div 요소 생성

        div.id = "deler" + i; // 각 카드에 고유한 ID 부여
        // 카드 이미지를 배경으로 설정
        div.style.backgroundImage = "url('/image/PNG-cards/" + deler_card[i] + ".png')"; // 딜러 카드 이미지를 설정
        div.style.backgroundSize = "120px 180px"; // 카드 이미지 크기 설정
        cell.appendChild(div); // 딜러 보드에 카드 추가
    }
}
