// Quiz Bot v2.0 - Production Ready
(() => {
    'use strict';
    
    console.log('🚀 Quiz Bot v2.0 Loading...');
    
    // Prevent multiple instances
    if (window.quizBotActive) {
        console.log('⚠️ Quiz Bot already running');
        return;
    }
    window.quizBotActive = true;

    // Anti-detection setup
    const stealth = {
        init() {
            // Hide webdriver traces
            try {
                Object.defineProperty(navigator, 'webdriver', { 
                    get: () => undefined,
                    configurable: true 
                });
            } catch(e) {}
            
            // Random base delay
            this.baseDelay = 100 + Math.random() * 200;
            console.log('🥷 Stealth mode activated');
        },
        
        async wait(ms = 100) {
            const randomDelay = ms + (Math.random() * ms * 0.3);
            return new Promise(resolve => setTimeout(resolve, randomDelay));
        },
        
        async humanClick(element) {
            if (!element) return false;
            
            try {
                // Smooth scroll
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                await this.wait(150);
                
                // Mouse events for human-like behavior
                const rect = element.getBoundingClientRect();
                const x = rect.left + rect.width * (0.4 + Math.random() * 0.2);
                const y = rect.top + rect.height * (0.4 + Math.random() * 0.2);
                
                element.dispatchEvent(new MouseEvent('mouseover', { 
                    clientX: x, clientY: y, bubbles: true 
                }));
                await this.wait(50);
                
                element.click();
                await this.wait(100);
                return true;
            } catch (error) {
                console.warn('Click failed:', error);
                return false;
            }
        }
    };

    // UI Creation
    const ui = {
        create() {
            // Remove existing UI if any
            const existing = document.getElementById('quiz-bot-ui');
            if (existing) existing.remove();
            
            const uiContainer = document.createElement('div');
            uiContainer.id = 'quiz-bot-ui';
            uiContainer.innerHTML = `
                <style>
                    #quiz-bot-ui {
                        position: fixed !important;
                        top: 20px !important;
                        right: 20px !important;
                        z-index: 999999 !important;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        color: white !important;
                        padding: 15px !important;
                        border-radius: 12px !important;
                        font-family: Arial, sans-serif !important;
                        font-size: 14px !important;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
                        border: 1px solid rgba(255,255,255,0.2) !important;
                        min-width: 280px !important;
                        max-width: 320px !important;
                    }
                    .qb-header {
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        margin-bottom: 15px !important;
                        font-weight: bold !important;
                        font-size: 16px !important;
                    }
                    .qb-button {
                        background: rgba(255,255,255,0.2) !important;
                        border: none !important;
                        color: white !important;
                        padding: 10px 15px !important;
                        border-radius: 6px !important;
                        cursor: pointer !important;
                        margin: 4px 2px !important;
                        transition: all 0.3s ease !important;
                        font-size: 13px !important;
                        width: 48% !important;
                        text-align: center !important;
                    }
                    .qb-button:hover {
                        background: rgba(255,255,255,0.3) !important;
                        transform: translateY(-1px) !important;
                    }
                    .qb-button.active {
                        background: #4CAF50 !important;
                        box-shadow: 0 0 10px rgba(76,175,80,0.5) !important;
                    }
                    .qb-button.danger {
                        background: #f44336 !important;
                        width: 100% !important;
                        margin-top: 10px !important;
                    }
                    .qb-status {
                        background: rgba(0,0,0,0.3) !important;
                        padding: 10px !important;
                        border-radius: 6px !important;
                        margin-top: 15px !important;
                        font-size: 12px !important;
                        text-align: center !important;
                        min-height: 20px !important;
                    }
                    .qb-controls {
                        display: flex !important;
                        flex-wrap: wrap !important;
                        justify-content: space-between !important;
                        margin-bottom: 10px !important;
                    }
                    .qb-spam-controls {
                        display: none !important;
                        margin-top: 10px !important;
                        padding: 10px !important;
                        background: rgba(0,0,0,0.2) !important;
                        border-radius: 6px !important;
                    }
                    .qb-select, .qb-input {
                        background: rgba(255,255,255,0.2) !important;
                        border: none !important;
                        color: white !important;
                        padding: 8px !important;
                        border-radius: 4px !important;
                        margin: 4px 2px !important;
                        width: 45% !important;
                    }
                    .qb-select option {
                        background: #333 !important;
                        color: white !important;
                    }
                    .qb-minimize {
                        cursor: pointer !important;
                        font-size: 18px !important;
                        user-select: none !important;
                    }
                    .qb-minimize:hover {
                        opacity: 0.7 !important;
                    }
                </style>
                <div class="qb-header">
                    <span>🤖 Quiz Bot v2.0</span>
                    <span class="qb-minimize" title="Minimize">−</span>
                </div>
                <div class="qb-content">
                    <div class="qb-controls">
                        <button class="qb-button" id="qb-brute">🎯 Brute Force</button>
                        <button class="qb-button" id="qb-spam-toggle">🚀 Spam Mode</button>
                        <button class="qb-button" id="qb-blur">👁️ Remove Blur</button>
                        <button class="qb-button" id="qb-auto">🔄 Auto Mode</button>
                    </div>
                    <div class="qb-spam-controls" id="qb-spam-controls">
                        <div style="margin-bottom: 8px; font-size: 13px;">Spam Settings:</div>
                        <select class="qb-select" id="qb-answer">
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                        </select>
                        <input class="qb-input" type="number" id="qb-limit" placeholder="Max (50)" value="50" min="1" max="200">
                        <button class="qb-button" id="qb-start-spam" style="width: 100%; margin-top: 8px;">Start Spam Answer</button>
                    </div>
                    <button class="qb-button danger" id="qb-stop">⏹️ STOP ALL</button>
                    <div class="qb-status" id="qb-status">Ready to start...</div>
                </div>
            `;
            
            document.body.appendChild(uiContainer);
            this.bindEvents();
            console.log('🎨 UI created successfully');
        },
        
        bindEvents() {
            // Minimize/maximize
            document.querySelector('.qb-minimize').onclick = () => {
                const content = document.querySelector('.qb-content');
                const minimizer = document.querySelector('.qb-minimize');
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    minimizer.textContent = '−';
                } else {
                    content.style.display = 'none';
                    minimizer.textContent = '+';
                }
            };
            
            // Button events
            document.getElementById('qb-brute').onclick = () => bot.startBruteForce();
            document.getElementById('qb-spam-toggle').onclick = () => {
                const controls = document.getElementById('qb-spam-controls');
                controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
            };
            document.getElementById('qb-start-spam').onclick = () => {
                const answer = document.getElementById('qb-answer').value;
                const limit = parseInt(document.getElementById('qb-limit').value) || 50;
                bot.startSpamAnswer(answer, limit);
            };
            document.getElementById('qb-blur').onclick = () => bot.removeBlur();
            document.getElementById('qb-auto').onclick = () => bot.startAutoMode();
            document.getElementById('qb-stop').onclick = () => bot.stopAll();
        },
        
        updateStatus(message, type = 'info') {
            const status = document.getElementById('qb-status');
            if (status) {
                status.textContent = message;
                const colors = {
                    'info': 'white',
                    'success': '#51cf66',
                    'error': '#ff6b6b',
                    'warning': '#ffd43b'
                };
                status.style.color = colors[type] || 'white';
            }
            console.log(`📊 ${message}`);
        },
        
        setButtonActive(buttonId, active = true) {
            const button = document.getElementById(buttonId);
            if (button) {
                if (active) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        }
    };

    // Main bot logic
    const bot = {
        isRunning: false,
        currentMode: null,
        stats: { questions: 0, correct: 0, attempts: 0 },
        
        // Utility functions
        getChoiceButtons() {
            const validAnswers = ["A", "B", "C", "D", "E"];
            return Array.from(document.querySelectorAll("p")).filter(e => {
                const text = e.innerText?.trim();
                if (!text) return false;
                
                // Check if it's a valid answer choice
                if (validAnswers.includes(text)) return true;
                
                // Check by styling (alternative method)
                const style = window.getComputedStyle(e);
                return style.display === "flex" && 
                       parseFloat(style.fontSize) > 15 && 
                       (style.fontWeight === "bold" || parseInt(style.fontWeight) > 400);
            });
        },
        
        isCorrect() {
            return Array.from(document.querySelectorAll("h5, div, span"))
                .some(e => e.innerText?.trim() === "Correct!");
        },
        
        isIncorrect() {
            return Array.from(document.querySelectorAll("h5, div, span"))
                .some(e => e.innerText?.trim() === "Incorrect!");
        },
        
        async pressCheck() {
            const checkButtons = Array.from(document.querySelectorAll("p, button, div"))
                .filter(e => {
                    const text = e.innerText?.trim().toLowerCase();
                    return text === "check" || text === "submit answer" || text === "periksa";
                });
            
            if (checkButtons.length > 0) {
                await stealth.humanClick(checkButtons[0]);
                return true;
            }
            return false;
        },
        
        async goToNext() {
            const nextButtons = Array.from(document.querySelectorAll("p, button, a, div"))
                .filter(e => {
                    const text = e.innerText?.trim().toLowerCase();
                    const style = window.getComputedStyle(e);
                    return (text === "next" || text === "save & next" || text === "save" || 
                           text === "continue" || text === "lanjut") && 
                           (style.display === "flex" || style.display === "inline-block" || 
                           style.display === "block");
                });
            
            if (nextButtons.length > 0) {
                await stealth.humanClick(nextButtons[0]);
                return true;
            }
            return false;
        },
        
        deleteIncorrectMessages() {
            Array.from(document.querySelectorAll("h5, div, span"))
                .filter(e => e.innerText?.trim() === "Incorrect!")
                .forEach(e => {
                    try { e.remove(); } catch(err) {}
                });
        },
        
        // Main automation functions
        async startBruteForce() {
            if (this.isRunning) {
                ui.updateStatus('Bot already running!', 'warning');
                return;
            }
            
            this.isRunning = true;
            this.currentMode = 'brute';
            this.stats = { questions: 0, correct: 0, attempts: 0 };
            
            ui.updateStatus('🎯 Starting Brute Force...', 'info');
            ui.setButtonActive('qb-brute', true);
            
            try {
                let consecutiveFailures = 0;
                
                for (let i = 0; i < 200 && this.isRunning; i++) {
                    const result = await this.bruteForceQuestion();
                    
                    if (result) {
                        consecutiveFailures = 0;
                        ui.updateStatus(`Brute Force: Q${this.stats.questions} | ✅${this.stats.correct}`, 'success');
                    } else {
                        consecutiveFailures++;
                        ui.updateStatus(`Brute Force: Q${this.stats.questions} | Trying...`, 'info');
                    }
                    
                    // Stop if too many consecutive failures (might be end of quiz)
                    if (consecutiveFailures > 10) {
                        ui.updateStatus('No more questions found. Quiz might be complete!', 'success');
                        break;
                    }
                    
                    await stealth.wait(1000);
                }
                
            } catch (error) {
                ui.updateStatus(`Error: ${error.message}`, 'error');
                console.error('Brute force error:', error);
            }
            
            this.stopAll();
        },
        
        async startSpamAnswer(answer, limit) {
            if (this.isRunning) {
                ui.updateStatus('Bot already running!', 'warning');
                return;
            }
            
            this.isRunning = true;
            this.currentMode = 'spam';
            this.stats = { questions: 0, correct: 0, attempts: 0 };
            
            ui.updateStatus(`🚀 Spamming answer ${answer}...`, 'info');
            
            try {
                for (let i = 0; i < limit && this.isRunning; i++) {
                    const result = await this.spamSingleAnswer(answer);
                    
                    if (result) {
                        this.stats.questions++;
                        ui.updateStatus(`Spam ${answer}: ${i + 1}/${limit} | Q${this.stats.questions}`, 'success');
                    } else {
                        ui.updateStatus(`Spam ${answer}: ${i + 1}/${limit} | Searching...`, 'info');
                    }
                    
                    await stealth.wait(800);
                    
                    // Check if quiz is complete
                    const choices = this.getChoiceButtons();
                    if (choices.length === 0) {
                        ui.updateStatus('Quiz completed or no more questions!', 'success');
                        break;
                    }
                }
                
            } catch (error) {
                ui.updateStatus(`Error: ${error.message}`, 'error');
                console.error('Spam answer error:', error);
            }
            
            this.stopAll();
        },
        
        async startAutoMode() {
            if (this.isRunning) {
                ui.updateStatus('Bot already running!', 'warning');
                return;
            }
            
            ui.updateStatus('🔄 Auto Mode: Trying smart approach...', 'info');
            ui.setButtonActive('qb-auto', true);
            
            // Try brute force approach
            await this.startBruteForce();
        },
        
        async bruteForceQuestion() {
            const choices = this.getChoiceButtons();
            if (choices.length === 0) {
                console.log('No choice buttons found');
                return false;
            }
            
            // Check if already correct
            if (this.isCorrect()) {
                this.stats.correct++;
                this.stats.questions++;
                await stealth.wait(500);
                await this.goToNext();
                return true;
            }
            
            // Clear any existing incorrect messages
            this.deleteIncorrectMessages();
            
            // Try each choice
            for (const choice of choices) {
                if (!this.isRunning) break;
                
                console.log(`Trying choice: ${choice.innerText?.trim()}`);
                
                // Click the choice
                const clicked = await stealth.humanClick(choice);
                if (!clicked) continue;
                
                await stealth.wait(200);
                
                // Press check button
                await this.pressCheck();
                await stealth.wait(600);
                
                // Check result
                if (this.isCorrect()) {
                    this.stats.correct++;
                    this.stats.questions++;
                    console.log('✅ Correct answer found!');
                    await stealth.wait(300);
                    await this.goToNext();
                    return true;
                }
                
                if (this.isIncorrect()) {
                    console.log('❌ Wrong answer, trying next...');
                    this.deleteIncorrectMessages();
                    await stealth.wait(200);
                    continue;
                }
                
                // If no clear result, wait and try next
                await stealth.wait(300);
            }
            
            this.stats.attempts++;
            return false;
        },
        
        async spamSingleAnswer(answer) {
            const choices = this.getChoiceButtons();
            const target = choices.find(e => e.innerText?.trim() === answer);
            
            if (!target) {
                console.log(`Answer ${answer} not found in choices`);
                return false;
            }
            
            console.log(`Clicking answer: ${answer}`);
            
            const clicked = await stealth.humanClick(target);
            if (!clicked) return false;
            
            await stealth.wait(200);
            await this.pressCheck();
            await stealth.wait(400);
            await this.goToNext();
            await stealth.wait(200);
            
            return true;
        },
        
        removeBlur() {
            try {
                // Remove blur effects
                const blurSelectors = [
                    ".bl-p-l.bl-relative.bl-col-between",
                    "[class*='blur']",
                    "[style*='blur']"
                ];
                
                let removedCount = 0;
                blurSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => {
                        element.style.filter = "none";
                        element.style.webkitFilter = "none";
                        if (element.onblur) element.onblur = null;
                        element.addEventListener("blur", event => {
                            event.stopImmediatePropagation();
                            event.preventDefault();
                        }, true);
                        removedCount++;
                    });
                });
                
                ui.updateStatus(`Blur removed from ${removedCount} elements`, 'success');
                
            } catch (error) {
                ui.updateStatus('Failed to remove blur effects', 'error');
                console.error('Remove blur error:', error);
            }
        },
        
        stopAll() {
            this.isRunning = false;
            this.currentMode = null;
            
            // Remove active states from all buttons
            document.querySelectorAll('.qb-button.active').forEach(btn => {
                btn.classList.remove('active');
            });
            
            ui.updateStatus(`Stopped | Stats: ${this.stats.questions} questions, ${this.stats.correct} correct`, 'warning');
            console.log('🛑 Bot stopped');
        }
    };

    // Initialize everything
    try {
        stealth.init();
        ui.create();
        
        // Welcome message
        setTimeout(() => {
            ui.updateStatus('Quiz Bot ready! Choose your mode 🚀', 'success');
        }, 1000);
        
        console.log('✅ Quiz Bot v2.0 loaded successfully!');
        console.log('📱 Look for the UI panel in the top-right corner');
        
    } catch (error) {
        console.error('❌ Quiz Bot initialization failed:', error);
        alert('Quiz Bot failed to initialize. Check console for details.');
    }

})();
