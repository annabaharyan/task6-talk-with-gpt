const microphone = document.querySelector("button");
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;

recognition.lang = "en-US";
let recognizing;

function reset() {
  recognizing = false;
}
recognition.onresult = function (event) {
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
    .then((res) => res.json())
    .then((answer) => answerToSpeach(answer.answer));
};

function toggleStartStop() {
  if (recognizing) {
    console.log("end");
    recognition.stop();
    reset();
  } else {
    recognition.start();
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
    return voice.name == "Microsoft David - English (United States)";
  })[0];
  utterance.lang = "en-US";
  utterance.volume = 1;
  utterance.rate = 0.7;
  utterance.pitch = 0.4;
  synth.speak(utterance);
}
