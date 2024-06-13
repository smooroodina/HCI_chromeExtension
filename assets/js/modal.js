
chrome.runtime?.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openPopup') {
        chrome.action.openPopup();
    }
}); 

var modal = {
    init: function() {
        
    },

    GetParams: function(paramList) {
        let params = {}
        let blank = false;
        paramList.forEach((param, index) => {
            value = document.querySelector(`[name=${param}]:not([type=checkbox]):not([type=radio]), input[name=${param}]:checked`)?.value ?? null;
            if(value == '') {
                blank = true;
                return false;
            }
            params[paramList[index]] = !isNaN(parseInt(value))?parseInt(value):value;
        });
        if(blank) return false;
        return params;
    },

    APIRequest: async function(url, params, callback) {
        try {
            let response = await fetch(url, {
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(params)
                });
                if(!response.ok) {
                    throw new Error('error'); 
                }
                let data = await response.json();
                callback(data);
        }catch(e) {
            console.log("Error: cannot fetch from " + url)
            callback("any text when cannot fetch from api ~ ~ ~ ~ ~")
        }
    }
};

modal.init();

console.log("modal.js loaded");