
/* -------------- 카드덱 섞기 -----------------*/ 

var dec = ["1a","1b","1c","1d","2a","2b","2c","2d","3a","3b","3c","3d","4a","4b","4c","4d","5a","5b","5c","5d",
    "6a","6b","6c","6d","7a","7b","7c","7d","8a","8b","8c","8d","9a","9b","9c","9d","0a","0b","0c","0d",
    "ja","jb","jc","jd","qa","qb","qc","qd","ka","kb","kc","kd"];   //덱 1개 

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