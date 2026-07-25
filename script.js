const blankStyle =
    document.getElementsByName("blankStyle");
const progress = document.getElementById("progress");
const blankCountInput = document.getElementById("blankCount");

let sentences = [];
async function loadSentences() {

    const response = await fetch("./data/Sentences.csv");

    const text = await response.text();

    const lines = text.split("\n");

    sentences = lines
        .slice(1)
        .filter(line => line.trim() !== "")
        .map(line => ({
            sentence: line.trim()
        }));

}

let currentIndex = 0;
let answerVisible = false;
let currentBlankSentence = "";

const sentenceElement = document.getElementById("sentence");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const showButton = document.getElementById("showButton");


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
    (currentIndex + 1) + " / " + sentences.length;

    const currentSentence = sentences[currentIndex].sentence;

    if (answerVisible) {

        sentenceElement.textContent = currentSentence;

    } else {

        sentenceElement.textContent = currentBlankSentence;

    }

}

function nextSentence() {

    currentIndex++;

    if (currentIndex >= sentences.length) {
        currentIndex = 0;
    }

    answerVisible = false;

    currentBlankSentence = randomBlank(
    sentences[currentIndex].sentence
);

    render();
}

function previousSentence() {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = sentences.length - 1;
    }

    answerVisible = false;

    currentBlankSentence = randomBlank(
        sentences[currentIndex].sentence
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
        randomBlank(sentences[currentIndex].sentence);

    render();

};

async function init() {

    await loadSentences();

    currentBlankSentence =
        randomBlank(sentences[currentIndex].sentence);

    for (const radio of blankStyle) {

        radio.onchange = () => {

            currentBlankSentence =
                randomBlank(sentences[currentIndex].sentence);

            render();

        };

    }

    render();

}


init();
