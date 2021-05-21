var data;
var requestUrl = "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
var request = new XMLHttpRequest();
//取得資料
var lgChoose = document.querySelector('.cs-choose');
var hotArea = document.querySelector('.hotarea');
var list = document.querySelector('.ct-list');
var listTitle = document.querySelector('.ct-title');
var backTop = document.querySelector('.backTop');
var pageBtn = document.querySelector('.pagebtn');
var page;
//最開始呈現的頁面
var onepageData;
//設定一頁抓幾筆資料
var chooselistData;
//對應區域的資料Data
var range=[] ;
lgChoose.addEventListener('click', choosearea);
//行政區選擇
hotArea.addEventListener('click',choosehot);
//熱門行政區選擇
pageBtn.addEventListener('click',setTempList);
//換頁
window.addEventListener('scroll',btnbackTop);
//滾動速度控制
backTop.addEventListener('click',scrollSpeed);
//返回最上面按鈕
request.open('GET', requestUrl, true);
request.send(null)
request.onload = function () {
    data = JSON.parse(request.responseText).result.records;
    setAllarea();
    setPageBtn();
    setList();
}

function setAllarea() {
    let areaList = [];
    let str = '<option value="all">--請選擇行政區</option>';
    for (let i = 0; i < data.length; i++) {
        if (areaList.indexOf(data[i].Zone) === -1) {
            areaList.push(data[i].Zone);
        }
    }
    for (let i = 0; i < areaList.length; i++) {
        str += '<option>' + areaList[i] + '</option>';
    }
    lgChoose.innerHTML = str;
};

function choosearea(chooseZone) {
    let zone = chooseZone.target.value;
    if(zone === 'all'){
        listTitle.innerHTML='高雄市';
    }else{
    listTitle.innerHTML=zone;
    }
    setList(zone);
    // setPageBtn();
    //按鈕設置問題,不知道怎麼換成只有兩頁或一頁
}
function choosehot(choosehotZone) {
    let zone = choosehotZone.target.innerHTML;
    console.log(zone);
    listTitle.innerHTML=zone;
    setList(zone);
    // setPageBtn();
    //按鈕設置問題,不知道怎麼換成只有兩頁或一頁

    console.log(range.length);
}
function setList(e="all") {
    range = [];
    let str = '';
    if (e === 'all') {
        for (let i = 0; i < chooselistData.length; i++) {
                range.push(chooselistData[i]);
        }
    }
    else{
        for(let i = 0;i<data.length;  i++){
            if(data[i].Zone===e){
                range.push(data[i]);
              }
        }
    }
    for (let i = 0; i < range.length; i++) {
        str += ' <div class="card"><div class="card-img" style="background: no-repeat url(' + range[i].Picture1 + ') center/cover;"><h4>' + range[i].Name + '</h4><p>' + range[i].Zone + '</p></div><li class="card-content"><ul class="card-detail"><li><img src="../assets/icons_clock.png"><span>' + range[i].Opentime + '</span></li><li><img src="../assets/icons_pin.png"><span>' + range[i].Add + '</span></li><li><img src="../assets/icons_phone.png"><span>' + range[i].Tel + '</span></li></ul><ul class="card-logo"><li><img src="../assets/icons_tag.png"><span>' + range[i].Ticketinfo + '</span></li></ul></li></div>'
    }
    list.innerHTML = str;
}
function setPageBtn(e){
    let pageAmount;
    Page=1;
    onepageData=6;
    pageAmount=parseInt(data.length/onepageData)+1;
    //記得問老師怎麼做page按鈕的設置
    console.log(range.length);
    let str=`<li><a href="#" class="active">1</a></li>`;
    for(let i=1;i<pageAmount;i++){
      str+='<li><a href="#">'+(i+1)+'</a></li>';
    }
    pageBtn.innerHTML=str;
    chooselistData=[];
    for(let i=0;i<6;i++){
      chooselistData.push(data[i]);   
    }
  }
  
  function setTempList(e){
    e.preventDefault();
    chooselistData=[];
    if(e.target.nodeName!=="A"){return};
    let temp=onepageData*(e.target.textContent-1);
  
    for(let i=0;i<6;i++){ 
      if (temp+i<data.length){
        chooselistData.push(data[temp+i]);  
      } 
    }
    e.target.classList.add("active");
    //要問老師怎麼讓其他的active消失,e.target.parentNode.parentNode是undefined
    setList();
    window.scrollTo({
      top:0
    });
  }
function btnbackTop(e){
    if(window.scrollY<=350){
        backTop.classList.add('d-none');
    }else{
        backTop.classList.remove('d-none');
    }
} 
function scrollSpeed(e){
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
}