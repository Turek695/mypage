// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Get the motion toggle element
const getMotionToggle = (): HTMLInputElement | null => {
    return document.querySelector('#pulseToggle') as HTMLInputElement;
};

// Check if pulsing is enabled
const isPulsingEnabled = (): boolean => {
    const toggle = getMotionToggle();
    return toggle ? toggle.checked : !prefersReducedMotion;
};

document.addEventListener('DOMContentLoaded', () => {
    // Get metronome elements from HTML
    const bpmInput = document.querySelector('.bpm-slider') as HTMLInputElement;
    const bpmDisplay = document.querySelector('.bpm-display') as HTMLElement;
    const startButton = document.querySelector('.start-button') as HTMLButtonElement;
    const buttonText = startButton.querySelector('.button-text') as HTMLElement;
    const buttonIcon = startButton.querySelector('svg') as SVGSVGElement;
    const metronomeContainer = document.querySelector('.metronome-container') as HTMLElement;
    const pulseToggle = getMotionToggle();
    
    // Set initial toggle state based on user preference
    if (pulseToggle) {
        pulseToggle.checked = !prefersReducedMotion;
    }

    // Metronome state
    let interval: NodeJS.Timeout | null = null;
    let isRunning = false;
    let beatCount = 0;

    // Update BPM display when slider changes
    bpmInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const bpm = parseInt(target.value);
        bpmDisplay.innerHTML = `${bpm} <span class="bpm-label">BPM</span>`;
        
        if (interval) {
            clearInterval(interval);
            startMetronome(bpm);
        }
    });

    // Toggle metronome on button click
    startButton.addEventListener('click', toggleMetronome);

    // Add keyboard support (Space to toggle, ArrowUp/Down to adjust BPM)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            toggleMetronome();
        } else if (e.code === 'ArrowUp' && !isRunning) {
            e.preventDefault();
            bpmInput.stepUp();
            bpmInput.dispatchEvent(new Event('input'));
        } else if (e.code === 'ArrowDown' && !isRunning) {
            e.preventDefault();
            bpmInput.stepDown();
            bpmInput.dispatchEvent(new Event('input'));
        }
    });

    function toggleMetronome() {
        if (!isRunning) {
            const bpm = parseInt(bpmInput.value);
            startMetronome(bpm);
            buttonText.textContent = 'Stop';
            buttonIcon.innerHTML = '<path d="M6 6h12v12H6z"/>';
            startButton.setAttribute('aria-label', 'Stop metronome');
        } else {
            stopMetronome();
            buttonText.textContent = 'Start';
            buttonIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
            startButton.setAttribute('aria-label', 'Start metronome');
        }
        isRunning = !isRunning;
    }

    function startMetronome(bpm: number) {
        const intervalTime = 60000 / bpm; // Convert BPM to milliseconds
        
        // Play first beat immediately
        playBeat();
        
        // Set up interval for subsequent beats
        interval = setInterval(playBeat, intervalTime);
    }

    function playBeat() {
        // Visual feedback only if pulsing is enabled
        beatCount++;
        
        if (isPulsingEnabled()) {
            metronomeContainer.classList.add('beat-active');
            setTimeout(() => {
                metronomeContainer.classList.remove('beat-active');
            }, 100);
        }

        // Audio feedback
        const audio = new Audio('/sounds/message-pop.mp3');
        audio.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    }

    function stopMetronome() {
        if (interval) {
            clearInterval(interval);
            interval = null;
            beatCount = 0;
            metronomeContainer.classList.remove('beat-active');
        }
    }

    // Initialize display
    bpmInput.dispatchEvent(new Event('input'));
});
