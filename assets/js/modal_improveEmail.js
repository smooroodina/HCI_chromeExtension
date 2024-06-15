var improveEmail = {
  paramList: [
    //API에 전달할 파라미터 id 목록
    "tone",
    "quantity",
    "expression",
    "spelling_1",
    "spelling_2",
    "spelling_3",
    "mood",
    "emailBody",
  ],
  selectedRanges: [],
  option_description: [],
  init: function () {
    fetch("assets/json/slider_description.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        improveEmail.option_description = data;
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
    document
      .getElementById("formImproveEmail")
      .querySelectorAll("input")
      .forEach((option) => {
        option.addEventListener(
          "mouseover",
          improveEmail.showOptionDescription
        );
        option.addEventListener("change", improveEmail.showOptionDescription);
      });
    document
      .getElementById("improveBtn")
      .addEventListener("click", improveEmail.APIRequest);
    document
      .getElementById("backToOptionBtn")
      .addEventListener("click", improveEmail.backToOption);
    document
      .getElementById("applyBtn")
      .addEventListener("click", improveEmail.Apply);
    document
      .getElementById("spelling_all")
      .addEventListener("click", improveEmail.SpellingAll);
  },
  SpellingAll: function (e) {
    document
      .querySelectorAll(".spelling")
      .forEach((spelling) => (spelling.checked = e.target.checked));
  },
  APIRequest: function () {
    params = modal.GetParams(improveEmail.paramList);
    params["emailBody"] = document.getElementById("emailBody").textContent;
    if (params == false) return false;
    /*const changeSelectedOnly = document.getElementById("changeSelectedOnly");
        if(changeSelectedOnly.checked) {
            params["emailBody_selected"] = selectedRanges;
        }else {
            const emailBody = document.getElementById("emailBody");
            params["emailBody_selected"] = [{start:0, end:emailBody.textContent.length}]
        }*/
    params["spelling"] = [];
    for (const key in params) {
      const [groupKey, index] = key.split("_");
      if (groupKey == "spelling" && index != undefined) {
        if (params[key] != null) {
          params[groupKey].push(params[key]);
        }
        delete params[key];
      }
    }
    document.getElementById("inputEmailArea").value = params["emailBody"];
    improveEmail.gotoResultPage();
    document.getElementById("loading").style.display = "flex";
    document.getElementById("output").style.display = "none";
    modal.APIRequest(
      "http://34.22.72.121/correctEmail",
      params,
      improveEmail.showResult
    );
  },

  showOptionDescription: function (e) {
    option = e.target.name;
    value = e.target.value;
    console.log(option);
    optionDescriptionArea = document.getElementById("optionDescriptionArea");
    exampleArea = optionDescriptionArea.querySelector("#exampleArea");
    optionDescriptionArea.style.opacity = "100%";
    desc =
      improveEmail.option_description[option][value] ??
      improveEmail.option_description[option] ??
      null;
    if (desc != null) {
      optionDescriptionArea.children[0].innerText =
        desc.level + "\n" + desc.description;
      exampleArea.value = desc.example;
    }
  },
  gotoResultPage: function () {
    var view1 = document.getElementById("improveEmailModal_1");
    var view2 = document.getElementById("improveEmailModal_2");
    view1.style.display = "none";
    view2.style.display = "block";
  },

  showResult: function (result) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("output").style.display = "flex";
    document.getElementById("outputEmailArea").value =
      result.correctedBody ?? "서버에서 결과 불러오기에 실패했습니다:(";
  },

  backToOption: function () {
    var view1 = document.getElementById("improveEmailModal_1");
    var view2 = document.getElementById("improveEmailModal_2");
    view1.style.display = "block";
    view2.style.display = "none";
  },

  Apply: async function (e) {
    let resultText = document.getElementById("outputEmailArea").value;
    await navigator.clipboard.writeText(resultText);
    console.log("copied to clipboard");
    e.target.innerText += "✔";
  },

  MaintainDraggedText: function () {
    const emailBody = document.getElementById("emailBody");
    const highlightDiv = document.getElementById("highlightDiv");

    emailBody.addEventListener("input", updateHighlight);
    emailBody.addEventListener("scroll", syncScroll);
    emailBody.addEventListener("mouseup", handleSelection);

    function updateHighlight() {
      highlightDiv.textContent = emailBody.textContent;
      selectedRanges = [];
      applyHighlights();
    }
    function syncScroll() {
      highlightDiv.scrollTop = emailBody.scrollTop;
      highlightDiv.scrollLeft = emailBody.scrollLeft;
    }

    function handleSelection(event) {
      const selection = window.getSelection();
      let start = selection.anchorOffset;
      let end = selection.focusOffset;

      if (start === end) {
        return;
      }
      if (start > end) {
        let temp = start;
        start = end;
        end = temp;
      }
      if (event.ctrlKey || event.shiftKey) {
        addRange(start, end);
      } else if (event.altKey) {
        removeRange(start, end);
      } else {
        clearRanges();
        addRange(start, end);
      }
      document.getElementById("hiddenInput").focus();
      applyHighlights();
    }

    function addRange(start, end) {
      selectedRanges.push({ start, end });
      mergeOverlappingRanges();
    }

    function removeRange(start, end) {
      selectedRanges = excludeRange(start, end);
      mergeOverlappingRanges();
    }
    function excludeRange(excludeStart, excludeEnd) {
      ranges = selectedRanges;
      let newRanges = [];

      ranges.forEach((range) => {
        if (range.end < excludeStart || range.start > excludeEnd) {
          // The range is completely outside the exclusion range
          newRanges.push(range);
        } else {
          // The range overlaps with the exclusion range
          if (range.start < excludeStart) {
            newRanges.push({ start: range.start, end: excludeStart - 1 });
          }
          if (range.end >= excludeEnd) {
            newRanges.push({ start: excludeEnd, end: range.end });
          }
        }
      });
      return newRanges;
    }

    function clearRanges() {
      selectedRanges = [];
    }

    function mergeOverlappingRanges() {
      selectedRanges.sort((a, b) => a.start - b.start);
      let mergedRanges = [];
      let currentRange = null;

      selectedRanges.forEach((range) => {
        if (!currentRange) {
          currentRange = range;
        } else if (range.start <= currentRange.end) {
          currentRange.end = Math.max(currentRange.end, range.end);
        } else {
          mergedRanges.push(currentRange);
          currentRange = range;
        }
      });

      if (currentRange) {
        mergedRanges.push(currentRange);
      }

      selectedRanges = mergedRanges;
    }

    function applyHighlights() {
      const text = emailBody.textContent;
      let highlightedText = "";
      let lastIndex = 0;

      selectedRanges.forEach((range) => {
        highlightedText += text.substring(lastIndex, range.start);
        highlightedText += `<span class="highlight">${text.substring(
          range.start,
          range.end
        )}</span>`;
        lastIndex = range.end;
      });

      highlightedText += text.substring(lastIndex);
      highlightDiv.innerHTML = highlightedText;
    }
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    document.addEventListener("keydown", (event) => {
      if (event.altKey) {
        styleElement.textContent = `::selection { background: lightcoral; color: black; }`;
      }
    });

    document.addEventListener("keyup", (event) => {
      if (!event.altKey) {
        styleElement.textContent = `::selection { background: lightblue; color: black; }`;
      }
    });

    document.addEventListener("blur", () => {
      styleElement.textContent = `::selection { background: lightblue; color: black; }`;
    });

    // Initial update
    updateHighlight();
  },
};

improveEmail.init();
improveEmail.MaintainDraggedText();
const overlay = document.querySelector(".modal-footer-top-grad");
overlay.addEventListener("click", function (event) {
  event.stopPropagation();
});
console.log("modal_improveEmail.js loaded");
