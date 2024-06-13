// 클릭해 창을 열 수 있는 icon을 표시
window.onload = function() {
    loadOpenIcon();

}
function loadOpenIcon() {
    document.head.appendChild(parseHTML('<link rel="stylesheet" href="'
        + chrome.runtime.getURL("/assets/css/icon.css")
        + '">'));
    document.body.appendChild(parseHTML('<div id="widgetOpenMenu" class="widget widget-bottom-right"><img class="icon icon-middle" src="'
        + chrome.runtime.getURL("/assets/img/icon.png")
        + '" alt="icom image"></div>'));
    console.log("Icon Appended!");
    let openIcon = document.getElementById("widgetOpenMenu");
    openIcon.addEventListener('mouseover', function() {
        console.log("Hover on Icon!");
    })
    openIcon.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'openPopup' });
    })
}
function parseHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
}

function getFileContentFromChromeExtension(url) { //오류남...
    fetch(chrome.runtime.getURL(url))
        .then(response => response.text())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching modal.html:', error);
        });
}

// 메일 웹사이트 종류마다 다르게 메일창 자동 인식 및 채우기 구현
// 이전 메일 목록 가져오기


