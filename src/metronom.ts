document.addEventListener('DOMContentLoaded', () => {
    // Get metronome elements from HTML
    const bpmInput = document.querySelector('.bpm-slider') as HTMLInputElement;
    const bpmDisplay = document.querySelector('.bpm-display') as HTMLSpanElement;
    const startButton = document.querySelector('.start-button') as HTMLButtonElement;

    // Metronome state
    let interval: NodeJS.Timeout | null = null;
    let isRunning = false;

    // Update BPM display when slider changes
    bpmInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        bpmDisplay.textContent = `BPM: ${target.value}`;
        if (interval) {
            clearInterval(interval);
            startMetronome(parseInt(target.value));
        }
    });

    // Start/Stop metronome
    startButton.addEventListener('click', () => {
        if (!isRunning) {
            startMetronome(parseInt(bpmInput.value));
            startButton.textContent = 'Stop';
        } else {
            stopMetronome();
            startButton.textContent = 'Start';
        }
        isRunning = !isRunning;
    });

    function startMetronome(bpm: number) {
        const intervalTime = 60000 / bpm; // Convert BPM to milliseconds
        interval = setInterval(() => {
            // Play click sound
            const audio = new Audio('/sounds/message-pop.mp3');
            console.count('beep');
            audio.play();
        }, intervalTime);
    }

    function stopMetronome() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }
});
