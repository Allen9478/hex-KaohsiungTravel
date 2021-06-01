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
var areaListdata;
//設定一頁抓幾筆資料
var chooselistData;
//對應高雄市區域的資料Data
var range = [];
var newrangeforButton = [];
lgChoose.addEventListener('click', choosearea);
//行政區選擇
hotArea.addEventListener('click', choosehot);
//熱門行政區選擇
pageBtn.addEventListener('click', setTempList);
//換頁
window.addEventListener('scroll', btnbackTop);
//滾動速度控制
backTop.addEventListener('click', scrollSpeed);
//返回最上面按鈕
request.open('GET', requestUrl, true);
request.send(null)
request.onload = function () {
    data = JSON.parse(request.responseText).result.records;
    setAllarea();
    setPageBtn();
    setList();
}

function setAllarea(e = 'all') {
    let areaList = [];
    if (e === 'all') {
        let str = '<option class="optionArea" value="all">高雄市</option>';
        for (let i = 0; i < data.length; i++) {
            if (areaList.indexOf(data[i].Zone) === -1) {
                areaList.push(data[i].Zone);
            }
        }
        for (let i = 0; i < areaList.length; i++) {
            str += '<option class="optionArea">' + areaList[i] + '</option>';
        }
        lgChoose.innerHTML = str;
    }
    //else是為了choosehot時option的字也要跟著改 
    else {
        let areaList = [];
        let str = '<option class="optionArea">' + e + '</option><option class="optionArea" value="all">高雄市</option>';
        for (let i = 0; i < data.length; i++) {
            if (areaList.indexOf(data[i].Zone) === -1) {
                areaList.push(data[i].Zone);
            }
        }
        for (let i = 0; i < areaList.length; i++) {
            str += '<option class="optionArea">' + areaList[i] + '</option>';
        }
        lgChoose.innerHTML = str;
    }
};

function choosearea(chooseZone) {
    let zone = chooseZone.target.value;
    if (zone === 'all') {
        listTitle.innerHTML = '高雄市';
    } else {
        listTitle.innerHTML = zone;
    }
    setList(zone);
    setPageBtn(zone);
}

function choosehot(choosehotZone) {
    let zone = choosehotZone.target.innerHTML;
    console.log(zone);
    if (choosehotZone.target.nodeName !== "BUTTON") {
        return
    };
    listTitle.innerHTML = zone;
    setAllarea(zone);
    setList(zone);
    setPageBtn(zone);
}
function setList(e = "all") {
    range = [];
    newrangeforButton = [];
    let str = '';
    if (e === 'all' || e === '高雄市') {
        for (let i = 0; i < chooselistData.length; i++) {
            range.push(chooselistData[i]);
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            if (data[i].Zone === e) {
                range.push(data[i]);
                newrangeforButton.push(data[i]);
            }
        }
    }
    for (let i = 0; i < range.length; i++) {
        if (i <= 5) {
            str += '<div class="card">\
                        <div class="card-img" style="background: no-repeat url(' + range[i].Picture1 + ') center/cover;">\
                            <h4>' + range[i].Name + '</h4><p>' + range[i].Zone + '</p>\
                    </div>\
                    <li class="card-content">\
                    <ul class="card-detail">\
                        <li><img src="assets/icons_clock.png"><span>' + range[i].Opentime + '</span></li>\
                        <li><img src="assets/icons_pin.png"><span>' + range[i].Add + '</span></li>\
                        <li><img src="assets/icons_phone.png"><span>' + range[i].Tel + '</span></li>\
                    </ul>\
                        <ul class="card-logo">\
                            <li><img src="assets/icons_tag.png"><span>' + range[i].Ticketinfo + '</span></li>\
                        </ul>\
                    </li>\
                    </div>';                   
        }
    }
    list.innerHTML = str;
}

function setPageBtn(e = "all") {
    let pageAmount;
    Page = 1;
    onepageData = 6;
    pageAmount = parseInt(data.length / onepageData) + 1;
    pageAmountChoose = parseInt(range.length / onepageData) + 1;
    let str = `<li><a href="#" class="active">1</a></li>`;
    if (e === "all") {
        for (let i = 1; i < pageAmount; i++) {
            str += '<li><a href="#">' + (i + 1) + '</a></li>';
        }
    } else if (e !== "all" && (range.length > 6)) {
        for (let i = 1; i < pageAmountChoose; i++) {
            str += '<li><a href="#">' + (i + 1) + '</a></li>';
        }
    }
    pageBtn.innerHTML = str;
    chooselistData = [];
    areaListdata = [];
    for (let i = 0; i < 6; i++) {
        if (e === "all" || data[i].Zone !== e) {
            chooselistData.push(data[i]);
        }
        else if (data[i].Zone === e) {
            range.push(data[i]);
        }
    }
}

function setTempList(e) {
    e.preventDefault();
    chooselistData = [];
    areaListdata = [];
    let zone = listTitle.innerHTML;
    if (e.target.nodeName !== "A") {
        return
    };
    let temp = onepageData * (e.target.textContent - 1);
    for (let i = 0; i < 6; i++) {
        if (temp + i < data.length && zone === '高雄市') {
            chooselistData.push(data[temp + i]);
        } else if (temp + i < newrangeforButton.length && zone !== '高雄市') {

            areaListdata.push(newrangeforButton[temp + i]);
        }
}
console.log(areaListdata);
var active = document.querySelector('.active');
if (active !== null) {
    active.classList.remove('active');
}
e.target.className = 'active';
//頁面效果切換方法:如果active不等於null,active移除active的class,然後e點擊後class增加active
clicksetList(zone);
window.scrollTo({
    top: 0
});
}

function btnbackTop(e) {
    if (window.scrollY <= 350) {
        backTop.classList.add('d-none');
    } else {
        backTop.classList.remove('d-none');
    }
}

function scrollSpeed(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function clicksetList(e = "all") {
    range = [];
    let str = '';
    if (e === 'all' || e === '高雄市') {
        for (let i = 0; i < chooselistData.length; i++) {
            range.push(chooselistData[i]);
        }
    } else {
        for (let i = 0; i < areaListdata.length; i++) {
            range.push(areaListdata[i]);
        }
    }
    console.log(range.length);
    for (let i = 0; i < range.length; i++) {
        if (i <= 5) {
        str += '<div class="card">\
                    <div class="card-img" style="background: no-repeat url(' + range[i].Picture1 + ') center/cover;">\
                        <h4>' + range[i].Name + '</h4><p>' + range[i].Zone + '</p>\
                    </div>\
                    <li class="card-content">\
                        <ul class="card-detail">\
                            <li><img src="assets/icons_clock.png"><span>' + range[i].Opentime + '</span></li>\
                            <li><img src="assets/icons_pin.png"><span>' + range[i].Add + '</span></li>\
                            <li><img src="assets/icons_phone.png"><span>' + range[i].Tel + '</span></li>\
                        </ul>\
                        <ul class="card-logo">\
                            <li><img src="assets/icons_tag.png"><span>' + range[i].Ticketinfo + '</span></li>\
                        </ul>\
                     </li>\
                </div>';                  
        }
    }
    list.innerHTML = str;
}
    //問助教為什麼樣版字串無法抓到資料
    // str+= '
    //     <div class="card">
    //         <div class="card-img" style="background: no-repeat url(${range[i].Picture1}) center/cover;">
    //             <h4>${range[i].Name}</h4><p> ${range[i].Zone} </p>
    //         </div>
    //             <li class="card-content">
    //                 <ul class="card-detail">
    //                     <li><img src="assets/icons_clock.png"><span>${range[i].Opentime}</span></li>
    //                     <li><img src="assets/icons_pin.png"><span>${range[i].Add}</span></li>
    //                     <li><img src="assets/icons_phone.png"><span>${range[i].Tel}</span></li>
    //                 </ul>
    //                 <ul class="card-logo">
    //                     <li><img src="assets/icons_tag.png"><span>${range[i].Ticketinfo}</span></li>
    //                 </ul>
    //             </li>
    //     </div>';