let recognition;
let isRecording = false;
let audioContext; // Store the AudioContext for the session

const answers = ["48", "30", "36", "15", "35"];
let points = 0;
let audioNum = 0;

// Function to request permission for microphone access
function requestMicPermission() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            console.log("Microphone access granted");
            // Initialize AudioContext for session to ensure it's persistent
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            initializeSpeechRecognition(); // Initialize speech recognition once permission is granted
        })
        .catch((error) => {
            console.error("Microphone access denied:", error);
        });
}

// Initialize the SpeechRecognition API
function initializeSpeechRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Set the language for transcription
    recognition.continuous = false; // Stop after each phrase
    recognition.interimResults = false; // Only return final results, not interim

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Transcription:", transcript);

        document.getElementById("transcript").textContent = `You said: ${transcript}`;
        
        checkAnswer(transcript, audioNum, answers);
        audioNum++;
        displayScore();
        endGame();
    };

    recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
    };

    recognition.onend = () => {
        isRecording = false;
        console.log("Stopped recording");
    };
}

// Function to start speech recognition
function startRecording() {
    if (!isRecording && audioContext) {
        recognition.start();
        isRecording = true;
        console.log("Started recording...");
    }
}

// Function to stop speech recognition
function stopRecording() {
    if (isRecording) {
        recognition.stop();
    }
}

function playAudio(audioNum) {
    let path = "./assets/audio/mult" + (audioNum + 1) + ".mp3";
    console.log('Playing audio path:', path);
    let audio = new Audio(path);
    audio.play();
}

function checkAnswer(answer, audioNum, answers) {
    console.log(answers[audioNum]);
    if (answer === answers[audioNum]) {
        document.getElementById("answer").textContent = `Result: CORRECT`;
        points++;
    } else {
        document.getElementById("answer").textContent = `Result: INCORRECT`;
    }
}

function displayScore() {
    var myScoreDiv = document.getElementById("score");
    myScoreDiv.textContent = "Score: " + points;
}

function endGame() {
    if (audioNum === 5) {
        document.getElementById("content").textContent = `Game Over! Your Final Score: ` + points + `/5`;
    }
}

// Add event listeners to detect spacebar press and release
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && !isRecording) {
        startRecording();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === ' ' && isRecording) {
        stopRecording();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.shiftKey) {
        console.log('Audio button pressed!');
        playAudio(audioNum);
    }
});

// Request microphone access on page load
window.onload = () => {
    requestMicPermission();
};
