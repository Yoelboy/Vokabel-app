let dictionary = JSON.parse(localStorage.getItem('dictionary')) || {};
let randomWord;
let direction = 'de-to-en'; // Standardrichtung: Deutsch → Englisch
let attempts = 0; // Zählt die Versuche

// Funktion zum Testen des nächsten Vokabels
function nextVocabulary() {
    const keys = Object.keys(dictionary);
    if (keys.length === 0) {
        document.getElementById('word').innerText = "Keine Vokabeln vorhanden!";
        document.getElementById('question').innerText = "";
        attempts = 0; // Reset attempts
        return; // Abbrechen, wenn kein Vokabel vorhanden ist
    }

    randomWord = keys[Math.floor(Math.random() * keys.length)];
    direction = document.getElementById('direction').value; // Richtung abrufen

    if (direction === 'de-to-en') {
        document.getElementById('word').innerText = randomWord; // Deutsch
        document.getElementById('question').innerText = 'Was bedeutet:';
    } else {
        document.getElementById('word').innerText = dictionary[randomWord]; // Englisch
        document.getElementById('question').innerText = 'Was ist das deutsche Wort für:';
    }

    attempts = 0; // Reset attempts für das neue Wort
}

// Vokabel hinzufügen
function addVokabel(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    const germanTextElement = document.getElementById('germenText');
    const englishTextElement = document.getElementById('englishText');
    const germanWord = germanTextElement.value.trim();
    const englishWord = englishTextElement.value.trim();

    if (germanWord === "" || englishWord === "") {
        alert("Bitte beide Felder ausfüllen.");
        return;
    }

    // Füge das deutsche und englische Wort zum Dictionary hinzu
    dictionary[germanWord] = englishWord;

    // Eingabefelder leeren
    germanTextElement.value = '';
    englishTextElement.value = '';

    // Wörterbuch im localStorage speichern
    localStorage.setItem('dictionary', JSON.stringify(dictionary));

    render(); // Anzeige aktualisieren
}

// Vergleichsfunktion für den Vokabeltest
function compare() {
    const userInput = document.getElementById('germenText').value.trim();

    let correctAnswer;
    if (direction === 'de-to-en') {
        correctAnswer = dictionary[randomWord]; // Englisch
    } else {
        correctAnswer = randomWord; // Deutsch
    }

    if (userInput.toLowerCase() === correctAnswer.toLowerCase()) {
        document.getElementById('text').innerText = 'Richtig!';
        nextVocabulary(); // Nächstes Vokabel anzeigen
    } else {
        if (attempts === 0) {
            document.getElementById('text').innerText = 'Falsch! Versuch es nochmal.';
            attempts++; // Erhöhe den Versuchszähler
        } else {
            document.getElementById('text').innerText = `Falsch! Die richtige Antwort ist: ${correctAnswer}`;
            attempts = 0; // Reset attempts für das nächste Wort
            nextVocabulary(); // Nächstes Vokabel anzeigen
        }
    }

    document.getElementById('germenText').value = ''; // Eingabefeld leeren
    document.getElementById('germenText').focus(); // Fokus auf das Eingabefeld setzen
}

// Funktion zum Löschen eines Vokabels
function deleteVocabulary(germanWord) {
    delete dictionary[germanWord]; // Lösche den Eintrag aus dem Dictionary
    localStorage.setItem('dictionary', JSON.stringify(dictionary)); // Speichere die Änderungen
    render(); // Anzeige aktualisieren
}

// Wörterbuch-Liste anzeigen
function render() {
    const vokabelliste = document.getElementById('vokabelliste');
    vokabelliste.innerHTML = ''; // Vorherige Liste leeren

    Object.keys(dictionary).forEach((key) => {
        const li = document.createElement('li');
        li.className = 'mdl-list__item';
        li.innerText = `${key} - ${dictionary[key]}`;

        // Löschen-Button hinzufügen
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Löschen';
        deleteButton.onclick = () => deleteVocabulary(key);
        li.appendChild(deleteButton);

        vokabelliste.appendChild(li);
    });
}
// Stelle sicher, dass beim Laden der Seite die Vokabeln angezeigt werden
window.onload = () => {
    if (document.getElementById('vokabelliste')) {
        render();
    }
    nextVocabulary();
};


function speakWord() {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
        // Warte, bis die Stimmen verfügbar sind
        window.speechSynthesis.onvoiceschanged = () => {
            startSpeech();
        };
    } else {
        startSpeech(); // Stimmen sind schon verfügbar
    }
}

function startSpeech() {
    let speech = new SpeechSynthesisUtterance();
    const word = randomWord; // Verwendet das aktuell zufällig gewählte Wort

    speech.text = (direction === 'de-to-en') ? word : dictionary[word]; // Deutsch oder Englisch
    speech.lang = (direction === 'de-to-en') ? 'de-DE' : 'en-US'; // Sprache einstellen

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.lang === speech.lang);
    
    if (selectedVoice) {
        speech.voice = selectedVoice; // Die passende Stimme setzen
    }

    window.speechSynthesis.speak(speech);
}
