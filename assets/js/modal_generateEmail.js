var generateEmail = {
    paramList: [    //API에 전달할 파라미터 id 목록
        "receiver", "purpose"
    ],

    init: function() {
        document.getElementById("generateBtn").addEventListener("click", generateEmail.APIRequest);
        document.getElementById("applyBtn").addEventListener("click", generateEmail.Apply);
    },

    APIRequest: function() {
        params = modal.GetParams(generateEmail.paramList);
        if(params == false) return false;
        document.getElementById("loading").style.display = "flex";
        document.getElementById("resultArea").style.display = "none";
        modal.APIRequest("http://34.22.72.121/createEmail", params, generateEmail.showResult);
    },

    showResult: function(result) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("resultArea").style.display = "flex";
        document.getElementById("resultArea").removeAttribute("disabled");
        document.getElementById("resultArea").value = result.emailBody ?? "서버에서 결과 불러오기에 실패했습니다:(";
        document.getElementById("applyBtn").removeAttribute("disabled");
    },

    Apply: async function(e) {
        let resultText = document.getElementById("resultArea").value;
        await navigator.clipboard.writeText(resultText)
        console.log("copied to clipboard");
        e.target.innerText = "적용(복사)✔";
    },

};

generateEmail.init();
console.log("modal_generateEmail.js loaded");
