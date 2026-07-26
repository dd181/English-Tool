const blankStyle =
    document.getElementsByName("blankStyle");
const progress = document.getElementById("progress");
const blankCountInput = document.getElementById("blankCount");
const filters = document.getElementsByName("filter");
const filterWords = {

    article:[
        "a",
        "an",
        "the"
    ],

    pronoun:[
        "i",
        "you",
        "he",
        "she",
        "it",
        "we",
        "they",
        "this",
        "that",
        "these",
        "those"
    ],

    preposition:[
        "in",
        "on",
        "at",
        "to",
        "from",
        "with",
        "for",
        "of",
        "by"
    ],

    conjunction:[
        "and",
        "or",
        "but",
        "so",
        "because"
    ]

};

let readings  = [];
async function loadReadings() {

    const response = await fetch("./data/readings.json");

    readings = await response.json();

    console.log(readings);
    console.log(readings.length);
    
}

let currentIndex = 0;
let answerVisible = false;
let currentBlankSentence = "";

const sentenceElement = document.getElementById("sentence");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const showButton = document.getElementById("showButton");

function getFilters(){

    let selected = [];

    for(const filter of filters){

        if(filter.checked){
            selected.push(filter.value);
        }

    }

    return selected;

}

function getBlankStyle() {

    for (const radio of blankStyle) {

        if (radio.checked) {
            return radio.value;
        }

    }

    return "fixed";

}

function randomBlank(text) {

    const words = text.split(" ");

    const candidates = [];

    for (let i = 0; i < words.length; i++) {

        const word = words[i].replace(/[.,!?]/g, "");

        if (word.length >= 3) {
            candidates.push(i);
        }
    }

    let blankCount = parseInt(blankCountInput.value);

    if (blankCount > candidates.length) {
        blankCount = candidates.length;
    }

    // 후보 섞기(Fisher-Yates Shuffle)
    for (let i = candidates.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [candidates[i], candidates[j]] =
        [candidates[j], candidates[i]];
    }

    for (let i = 0; i < blankCount; i++) {

        const originalWord = words[candidates[i]];

const cleanWord =
    originalWord.replace(/[.,!?]/g, "");

if (getBlankStyle() === "fixed") {

    words[candidates[i]] =
        originalWord.replace(
            cleanWord,
            "■".repeat(cleanWord.length)
        );

}
else {

    words[candidates[i]] =
        originalWord.replace(
            cleanWord,
            "_".repeat(cleanWord.length)
        );

}
    }

    return words.join(" ");

}

function render() {

    progress.textContent =
        (currentIndex + 1) + " / " + readings.length;


    const currentReading =
        readings[currentIndex].content;


    if(answerVisible){

        sentenceElement.textContent =
            currentReading;

    }
    else{

        sentenceElement.textContent =
            currentBlankSentence;

    }

}

function nextSentence() {

    currentIndex++;

    if (currentIndex >= readings.length) {
        currentIndex = 0;
    }

    answerVisible = false;

    currentBlankSentence = randomBlank(
    readings[currentIndex].content
);

    render();
}

function previousSentence() {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = readings.length - 1;
    }

    answerVisible = false;

    currentBlankSentence = randomBlank(
        readings[currentIndex].content
    );

    render();

}

function showAnswer() {

    answerVisible = !answerVisible;

    render();

}



prevButton.onclick = previousSentence;
nextButton.onclick = nextSentence;
showButton.onclick = showAnswer;

blankCountInput.onchange = () => {

    currentBlankSentence =
        randomBlank(readings[currentIndex].content);

    render();

};

async function init() {

    await loadReadings();

    currentBlankSentence =
        randomBlank(readings[currentIndex].content);

    render();

}

init();
