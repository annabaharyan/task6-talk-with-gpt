const microphone = document.querySelector("button");
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;

recognition.lang = "en-US";
let recognizing;

function reset() {
  recognizing = false;
  document.querySelector("button").style.color = " rgb(4, 97, 97)";
}
recognition.onresult = function (event) {
  loading();
  fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      speach: {
        transcript: event.results[0][0].transcript,
      },
    }),
  })
    .then((res) => {
      loading(res);
      return res.json();
    })
    .then((answer) => answerToSpeach(answer.answer));
};

function toggleStartStop() {
  if (recognizing) {
    console.log("end");
    recognition.stop();
    reset();
  } else {
    recognition.start();
    document.querySelector("button").style.color = "red";
    console.log("start");
    recognizing = true;
  }
}

microphone.addEventListener("mousedown", toggleStartStop);
microphone.addEventListener("mouseup", toggleStartStop);

function answerToSpeach(answ) {
  let utterance = new SpeechSynthesisUtterance(answ);
  let voices = window.speechSynthesis.getVoices();

  utterance.voice = voices.filter(function (voice) {
    return voice.name == "Microsoft Zira - English (United States)";
  })[0];
  utterance.lang = "en-US";
  utterance.volume = 1;
  utterance.rate = 1.1;
  utterance.pitch = 1.1;
  synth.speak(utterance);
}

function loading(res) {
  if (!res) {
    document.querySelector("span").classList.add("loader");
  } else {
    document.querySelector("span").classList.remove("loader");
  }
}
