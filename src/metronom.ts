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

// Convert BPM to milliseconds (ms per beat)
const bpmToMs = (bpm: number): number => {
    // Ensure we don't divide by zero and respect minimum interval of 250ms
    const calculatedMs = 60000 / Math.max(1, bpm);
    return Math.round(calculatedMs);
};

// Convert milliseconds to BPM (beats per minute)
const msToBpm = (ms: number): number => {
    // Ensure we don't divide by zero and respect maximum BPM of 240
    const calculatedBpm = 60000 / Math.max(250, ms);
    return Math.min(240, Math.round(calculatedBpm));
};

document.addEventListener('DOMContentLoaded', () => {
    // Get metronome elements from HTML
    const bpmInput = document.querySelector('.bpm-slider') as HTMLInputElement;
    const bpmDisplay = document.querySelector('.bpm-display') as HTMLElement;
    const intervalInput = document.querySelector('.interval-slider') as HTMLInputElement;
    const intervalDisplay = document.querySelector('.interval-value') as HTMLElement;
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

    // Format interval display and update the DOM
    const updateIntervalDisplayElement = (ms: number) => {
        const safeMs = Math.max(250, Math.min(60000, ms));
        const displayElement = intervalDisplay.parentElement as HTMLElement;
        
        if (safeMs >= 1000) {
            intervalDisplay.textContent = (safeMs / 1000).toFixed(1);
            displayElement.setAttribute('data-format', 'seconds');
        } else {
            intervalDisplay.textContent = safeMs.toString();
            displayElement.removeAttribute('data-format');
        }
        return safeMs;
    };

    // Update BPM and sync interval when BPM slider changes
    const updateBpmDisplay = (bpm: number) => {
        const safeBpm = Math.max(1, Math.min(240, bpm));
        bpmDisplay.innerHTML = `${safeBpm} <span class="bpm-label">BPM</span>`;
        const ms = bpmToMs(safeBpm);
        intervalInput.value = ms.toString();
        updateIntervalDisplayElement(ms);
    };

    // Update interval display and sync BPM when interval slider changes
    const updateIntervalDisplay = (ms: number) => {
        const safeMs = updateIntervalDisplayElement(ms);
        const bpm = msToBpm(safeMs);
        bpmInput.value = bpm.toString();
        bpmDisplay.innerHTML = `${bpm} <span class="bpm-label">BPM</span>`;
        return safeMs; // Return the safe value for further use
    };

    // Update BPM display when slider changes
    bpmInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const bpm = parseInt(target.value);
        updateBpmDisplay(bpm);
        
        if (interval) {
            clearInterval(interval);
            startMetronome(bpm);
        }
    });

    // Update interval display when slider changes
    intervalInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const ms = parseInt(target.value);
        const safeMs = updateIntervalDisplay(ms);
        
        if (interval) {
            clearInterval(interval);
            startMetronome(msToBpm(safeMs));
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
        const audio = new Audio('/sounds/cooking-bell.wav');
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

    // Initialize displays
    const initialBpm = parseInt(bpmInput.value);
    updateBpmDisplay(initialBpm);
    updateIntervalDisplay(bpmToMs(initialBpm));
});
