/*----------- 돈을 칩으로 계산 ----------------*/

var CHIP = [1000, 500, 100, 25, 5, 1];  //칩 금액 
var nChips = Array(6).fill(0);    //칩 개수 저장

//랜덤 달러 함수
function RandomChip() {     //처음 시작할 때 실행
    var RandomDollar = 0;
    nChips = [];

    RandomDollar = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;     //1000 ~ 10000 랜덤값 추출
    
    convert_Chip(RandomDollar);
}

// 달러 칩으로 바꿈
function convert_Chip(RandomDollar) {  
    console.log("총 달러 : " + RandomDollar);

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

//받은 베팅 금액 칩으로 변환
function convert_bet_Chip(betting_dollar) {   
    var earn_nChips = Array(6).fill(0);

    for (let i = 0; i < CHIP.length; i++) {
        let num = Math.floor(betting_dollar / CHIP[i])    //칩 개수 계산
        earn_nChips[i] = num;

        betting_dollar %= CHIP[i]     //거스름돈 계산
    }

    console.log(nChips);

    for (let i = 0; i < nChips.length; i++) {   //현재 가지고 있는 칩과 얻은 칩 개수 합침
        nChips[i] = nChips[i] + earn_nChips[i];
    }

    console.log(nChips);
}

//칩의 개수로 칩 보여줌
function chip_show() {
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

var rst = [];   //랜덤한 수 저장될 배열(인덱스 수)
var card=[];    //섞인 카드 저장될 배열

function supple(){ //카드 섞기
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
    supple();
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

let isPlayerBust = false;  // 중복 실행 방지 위해 체크. 

//플레이어 버스트
function P_bust() {
    if (isPlayerBust) return;  // 이미 실행된 경우 함수 종료
    isPlayerBust = true;       // 실행된 상태로 설정

    if(player_bust == 0) { 
        player_card_show(); // 플레이어의 카드 상태를 화면에 업데이트
        setTimeout(function() {
            deler_card_show(0); // 딜러의 첫 번째 카드 오픈

            player_bust = 1;    //플레이어 버스트 상태 변환

            Sum_Deler = sum_deler(0);   //딜러 카드 합계 띄우기
            var dealerSum_txt = document.getElementById('deler_sum_txt');
            dealerSum_txt.textContent = "Deler 카드 합계 : " + Sum_Deler;  // 텍스트를 추가

            setTimeout(function() {
                alert("Bust!\n게임에서 졌습니다.");

                Lose();
            }, 500);
        }, 500);
    }
}

// 딜러 버스트 함수
function D_bust() { 
    deler_card_show(0); // 딜러의 카드 상태를 화면에 업데이트 (첫 번째 카드 보이기)
    
    // com_bust가 0이면 (딜러가 아직 버스트 상태가 아닐 경우)
    if (deler_bust == 0) {
        deler_bust = 1; // 딜러의 버스트 상태를 1로 설정

        Sum_Deler = sum_deler(0);   //딜러 카드 합계 띄우기
        var dealerSum_txt = document.getElementById('deler_sum_txt');
        dealerSum_txt.textContent = "Deler 카드 합계 : " + Sum_Deler;  // 텍스트를 추가

        setTimeout(function() {
            alert("Deler Bust!\n게임에서 이겼습니다.");

            Win();
        }, 500);
    }
}

function BlackJack_check() {
    var player_sum = sum_player(0);
    var deler_sum = sum_deler(0);

    if (player_sum == 21) { 
        if (deler_sum == 21) {
            deler_card_show(0);

            Sum_Deler = sum_deler(0);   //딜러 카드 합계 띄우기
            var dealerSum_txt = document.getElementById('deler_sum_txt');
            dealerSum_txt.textContent = "Deler 카드 합계 : " + Sum_Deler;  // 텍스트를 추가

            setTimeout(function() {
                alert("무승부입니다.");

                Draw();
            }, 500);
        }
        else {
            deler_card_show(0);

            Sum_Deler = sum_deler(0);   //딜러 카드 합계 띄우기
            var dealerSum_txt = document.getElementById('deler_sum_txt');
            dealerSum_txt.textContent = "Deler 카드 합계 : " + Sum_Deler;  // 텍스트를 추가

            setTimeout(function() {
                alert("Black Jack! 축하드립니다.");

                Blackjack();
            }, 500);
        }
    }
    else if (deler_sum == 21) {
        deler_card_show(0);

        Sum_Deler = sum_deler(0);   //딜러 카드 합계 띄우기
        var dealerSum_txt = document.getElementById('deler_sum_txt');
        dealerSum_txt.textContent = "Deler 카드 합계 : " + Sum_Deler;  // 텍스트를 추가

        setTimeout(function() {
            alert("딜러 Black Jack. 게임에서 졌습니다.");

            Lose();
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

var selectedChips = []; // 선택된 칩 이미지 URL을 저장할 배열

function img_click(event) {
    const imageUrl = event.target.src; // 클릭한 이미지의 URL
            
    // 클릭한 이미지가 이미 배열에 있는지 확인
    if (!selectedChips.includes(imageUrl)) {
        selectedChips.push(imageUrl); // 배열에 이미지 URL 추가
        display_ChipImages(); // 이미지 표시 함수 호출
    }

    cal_Bet_convert(imageUrl);  //금액, 개수 업데이트
}

// 기존 이미지를 초기화, 배열에 있는 이미지를 순차적으로 삽입
function display_ChipImages() {
    for (let i = 0; i < 6; i++) {  
        const bet_chip_div = document.getElementById(`bet-chip-box${i}`); // div 선택

         // 이미지를 추가하기 전에 기존의 이미지가 있으면 제거하고 span은 유지
        const existingImage = bet_chip_div.querySelector('img');
        if (existingImage) {
            bet_chip_div.removeChild(existingImage); // 기존 이미지 제거
        } 

        if (selectedChips[i]) { // 배열에 해당하는 이미지가 있으면
            const imgElement = document.createElement('img'); // 새로운 이미지 요소 생성
            imgElement.src = selectedChips[i]; // URL 설정
            imgElement.alt = 'Selected Image'; // 대체 텍스트 설정
            bet_chip_div.appendChild(imgElement); // div에 이미지 추가
        }
    }
}


/*--------------- 베팅할때 금액과 개수 변경 -------------------*/

var bet_amount = 0; //베팅 금액
var bet_nChips = Array(6).fill(0);  //베팅칩 개수

function cal_Bet_convert(imageUrl) {
    document.addEventListener('click', function(event) {
        // 클릭된 요소의 id 가져오기
        const clickedChipId = event.target.id;
        var chip_num = clickedChipId[4];    //어떤 칩인지 구분하기 위해
        var total_Dollar = cal_total_dollar();  //현재 금액
        const chip_divs = document.querySelectorAll(".chip-count");  //칩 div 가져오기
        const bet_divs = document.querySelectorAll(".bet_chip-count");  //베팅 칩 div 가져오기
        const img = document.getElementById("chip" + chip_num);

        //금액 변경
        total_Dollar -= CHIP[chip_num];

        //베팅 금액 변경
        bet_amount += CHIP[chip_num];

        //칩 개수 변경
        nChips[chip_num] -= 1;
        chip_divs[chip_num].textContent = `${nChips[chip_num]}개`;

        //가지고 있는 칩이 0개가 되면 비활성화
        if (nChips[chip_num] == 0) {    
            img.removeEventListener('click', img_click);  // 이벤트 핸들러 제거
            img.removeAttribute('data-click-active');  // 클릭 활성화 상태 제거
            img.style.opacity = "0.5";
            img.style.cursor = "default";
            chip_divs[chip_num].textContent = '';
        }

        //베팅칩 개수 변경
        bet_nChips[chip_num] += 1;
        //베팅칩 개수 텍스트 업데이트
        for (let i = 0; i < selectedChips.length; i++) {
            const bet_chip_div = document.getElementById(`bet-chip-box${i}`); // div 선택
            const imgElement = bet_chip_div.querySelector('img'); // div에서 이미지 요소 선택

            // 이미지가 존재하고 클릭한 이미지 URL과 같으면
            if (imgElement && imgElement.src === imageUrl) {
                bet_divs[i].textContent = `${bet_nChips[chip_num]}개`; // 텍스트 업데이트
            }
        }
    }, { once: true }); // 한 번만 실행되도록 설정
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

            Sum_Deler = sum_deler(0);   //딜러 카드 합계 띄우기
            var dealerSum_txt = document.getElementById('deler_sum_txt');
            dealerSum_txt.textContent = "Deler 카드 합계 : " + Sum_Deler;  // 텍스트를 추가

            setTimeout(function() {
                alert("무승부입니다.");

                Draw();
            }, 500);
        }
        else {
            deler_card_show(0);

            Sum_Deler = sum_deler(0);   //딜러 카드 합계 띄우기
            var dealerSum_txt = document.getElementById('deler_sum_txt');
            dealerSum_txt.textContent = "Deler 카드 합계 : " + Sum_Deler;  // 텍스트를 추가

            setTimeout(function() {
                alert("Win!");

                Win();
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
        D_bust();    //딜러 버스트
    }
    else if(deler_sum < 17){    //딜러 17 미만일 경우 카드 뽑기
        deler_draw();
        deler_card_show(1);
    }
    else {
        if ((player_sum > deler_sum) || deler_sum > 21) {    //플레이어 승
            deler_card_show(0);

            Sum_Deler = sum_deler(0);   //딜러 카드 합계 띄우기
            var dealerSum_txt = document.getElementById('deler_sum_txt');
            dealerSum_txt.textContent = "Deler 카드 합계 : " + Sum_Deler;  // 텍스트를 추가

            setTimeout(function() {
                alert("Win");

                Win();
            }, 500);
        }
        else if (player_sum < deler_sum){   //플레이어 패
            deler_card_show(0);

            Sum_Deler = sum_deler(0);   //딜러 카드 합계 띄우기
            var dealerSum_txt = document.getElementById('deler_sum_txt');
            dealerSum_txt.textContent = "Deler 카드 합계 : " + Sum_Deler;  // 텍스트를 추가

            setTimeout(function() {
                alert("Lose!");

                Lose();
            }, 500);
        }
        else{
            deler_card_show(0);

            Sum_Deler = sum_deler(0);   //딜러 카드 합계 띄우기
            var dealerSum_txt = document.getElementById('deler_sum_txt');
            dealerSum_txt.textContent = "Deler 카드 합계 : " + Sum_Deler;  // 텍스트를 추가
            
            setTimeout(function() {
                alert("무승부입니다."); 

                Draw();
            }, 500);    //무승부
        }
    }
}



/*------------------- 활성/비활성 --------------------*/

//칩 존재 여부 검사 후 onclick 이벤트 추가 
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

function start_btn_hidden() {   //시작 클릭후 버튼 숨기기
    const start_button = document.getElementById('start');

    start_button.classList.add('hidden'); 
    alert('베팅하기를 클릭하여 베팅해주세요.');
    RandomChip();   //랜덤 달러 배정
}



/*------------------ 베팅 -------------------*/     

function Play_bet() {   //칩 베팅하기
    add_click_event();  //베팅하기 누르면 버튼 onclick 이벤트 활성
    selectedChips = []; //베팅한 칩 이미지 배열 초기화 

    for (let i = 0; i < 6; i++) {  //베팅 칩 이미지 초기화
        const bet_chip_div = document.getElementById(`bet-chip-box${i}`); // div 선택
        const existingImage = bet_chip_div.querySelector('img');

        if (existingImage) {
            bet_chip_div.removeChild(existingImage); // 기존 이미지 제거
        }
    }

    setTimeout(function() {
        alert("칩을 누르면 베팅이 됩니다.\n베팅이 끝났을 경우 베팅 버튼을 눌러서 게임을 시작해주세요.");
    }, 300);
}

//베팅 누르면 베팅하기하고 베팅 버튼 비활성화
function betting() {    
    if(bet_amount == 0) {
        alert("칩을 눌러서 베팅을 해주세요!");
        return;
    }

    console.log("베팅한 금액 : " + bet_amount);

    var bet_play_btn = document.getElementsByClassName('beting-play-button');    
    var bet_btn = document.getElementsByClassName('beting-button');

    for (let i = 0; i < bet_play_btn.length; i++) { //getElementsByClassName가 반환하는 HTMLCollection는 여러 요소를 담고 있음. 그래서 반복문 사용
        bet_play_btn[i].onclick = null;
        bet_play_btn[i].style.opacity = "0.5";
        bet_play_btn[i].style.cursor = "default";
    }

    for (let i = 0; i < bet_btn.length; i++) {
        bet_btn[i].onclick = null;
        bet_btn[i].style.opacity = "0.5";
        bet_btn[i].style.cursor = "default";
    }

    new_start();
}


/*------------------- 금액 ----------------------*/ 

//총 금액 계산하는 함수
function cal_total_dollar() {   
    var total_Dollar = 0;

    for (var i = 0; i < nChips.length; i++) {
        total_Dollar += nChips[i] * CHIP[i];
    }
    
    return total_Dollar;
}

function Win() {    //이겼을 경우
    console.log("베팅 후 달러 : " + cal_total_dollar());

    bet_amount += bet_amount;   //베팅한 금액의 1배 더 받음
    console.log("승리 후 받는 금액 : " + bet_amount);
    
    convert_bet_Chip(bet_amount);   // 총 칩 개수 계산
    chip_show();    //칩 보여줌
    total_Dollar = cal_total_dollar();  //총 달러
    console.log("승리 후 달러 : " + total_Dollar); 

    for (let i = 0; i < 6; i++) {  //베팅 칩 이미지 초기화
        const bet_chip_div = document.getElementById(`bet-chip-box${i}`); // div 선택
        
        if (bet_chip_div) {
            const existingImage = bet_chip_div.querySelector('img');

            // existingImage가 유효한지 확인
            if (existingImage) {
                bet_chip_div.removeChild(existingImage); // 기존 이미지 제거

                const bet_divs = document.querySelectorAll(".bet_chip-count");  //베팅 칩 div 가져오기
                bet_divs[i].textContent = ``; // 텍스트 지우기
            } 
        }
    }
    end();
}

function Lose() {   //졌을 경우
    console.log("베팅 후 달러 : " + cal_total_dollar());

    bet_amount = 0;     //베팅 금액 초기화

    total_Dollar = cal_total_dollar();
    console.log("진 후 달러 : " + total_Dollar);

    for (let i = 0; i < 6; i++) {  //베팅 칩 이미지 초기화
        const bet_chip_div = document.getElementById(`bet-chip-box${i}`); // div 선택

        if (bet_chip_div) {
            const existingImage = bet_chip_div.querySelector('img');

            // existingImage가 유효한지 확인
            if (existingImage) {
                bet_chip_div.removeChild(existingImage); // 기존 이미지 제거
                
                const bet_divs = document.querySelectorAll(".bet_chip-count");  //베팅 칩 div 가져오기
                bet_divs[i].textContent = ``; // 텍스트 지우기
            } 
        }
    }

    end();
}

function Blackjack() {  //플레이어 블랙잭
    console.log("베팅 후 달러 : " + cal_total_dollar());

    bet_amount = bet_amount + (bet_amount * 1.5);   //베팅 금액의 1.5배 더 
    console.log("블랙잭 후 받는 금액 : " + bet_amount);
    
    convert_bet_Chip(bet_amount);   // 총 칩 개수 계산
    chip_show();    //칩 보여줌
    total_Dollar = cal_total_dollar();  //총 달러
    console.log("블랙잭 후 달러 : " + total_Dollar); 

    for (let i = 0; i < 6; i++) {  //베팅 칩 이미지 초기화
        const bet_chip_div = document.getElementById(`bet-chip-box${i}`); // div 선택
        
        if (bet_chip_div) {
            const existingImage = bet_chip_div.querySelector('img');

            // existingImage가 유효한지 확인
            if (existingImage) {
                bet_chip_div.removeChild(existingImage); // 기존 이미지 제거
                
                const bet_divs = document.querySelectorAll(".bet_chip-count");  //베팅 칩 div 가져오기
                bet_divs[i].textContent = ``; // 텍스트 지우기
            } 
        }
    }
    end();

}

function Draw() {   //무승부
    console.log("베팅 후 달러 : " + cal_total_dollar());

    console.log("무승부 후 받는 금액 : " + bet_amount);   //베팅한 금액 그대로 받음

    convert_bet_Chip(bet_amount);   // 총 칩 개수 계산
    chip_show();    //칩 보여줌
    total_Dollar = cal_total_dollar();  //총 달러
    console.log("무승부 후 달러 : " + total_Dollar); 

    for (let i = 0; i < 6; i++) {  //베팅 칩 이미지 초기화
        const bet_chip_div = document.getElementById(`bet-chip-box${i}`); // div 선택
        
        if (bet_chip_div) {
            const existingImage = bet_chip_div.querySelector('img');

            // existingImage가 유효한지 확인
            if (existingImage) {
                bet_chip_div.removeChild(existingImage); // 기존 이미지 제거
                
                const bet_divs = document.querySelectorAll(".bet_chip-count");  //베팅 칩 div 가져오기
                bet_divs[i].textContent = ``; // 텍스트 지우기
            } 
        }
    }
    end();
}



/*------------------게임 끝----------------------*/ 
function end() {
    var total_Dollar = 0;

    total_Dollar = cal_total_dollar();
    if(total_Dollar == 0) {
        alert("베팅할 수 있는 칩이 없습니다. 게임 종료.");
    }
}