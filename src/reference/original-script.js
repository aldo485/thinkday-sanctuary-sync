// ================================================================= //
// The Think Day Sanctuary - Main Application Logic (v1.0 - Final)
// Author: Gemini (Synthesized from multiple AI versions)
// ================================================================= //

document.addEventListener('DOMContentLoaded', () => {

    /**
     * ThinkDayApp Class
     * A modern, class-based approach to encapsulate all application logic.
     * This keeps the global namespace clean and makes the code highly organized
     * and maintainable, which is ideal for the "vibe coding" workflow.
     */
    class ThinkDayApp {
        constructor() {
            this.state = {}; // Will hold all application data
            this.wheelChart = null; // To hold the Chart.js instance
            this.currentStepIndex = 0;
            this.selectedPrompts = [];
            this.currentPromptIndexInSelection = 0;

            // Cache all DOM elements once on startup for better performance
            this.dom = {};
            this.cacheDOM();
            
            // Kick off the application
            this.init();
        }

        // ================================================================= //
        // 1. INITIALIZATION & STATE MANAGEMENT
        // ================================================================= //

        // Find and store all necessary DOM elements
        cacheDOM() {
            const ids = [
                'app-container', 'dashboard-view', 'start-new-day-btn', 'recent-actions-list',
                'guided-session-container', 'session-nav', 'prev-step-btn', 'next-step-btn', 'complete-session-btn',
                'wheel-of-life-view', 'spiderweb-chart-container', 'wheel-sliders-container', 'wheel-of-life-canvas',
                'fear-setting-view', 'fear-catalyst-prompt', 'go-deeper-btn', 'fear-deep-dive-container',
                'tab-nav', 'define-tab-content', 'benefits-tab-content', 'cost-tab-content', 'fear-define-list', 'add-fear-btn',
                'benefits-textarea', 'cost-6-months', 'cost-1-year', 'cost-3-years',
                'journaling-view', 'prompt-selection-container', 'start-journaling-btn', 'journaling-interface-container',
                'current-prompt-text', 'journal-editor', 'prompt-progress', 'prev-prompt-btn', 'next-prompt-btn',
                'action-steps-view', 'action-plan-textarea', 'copy-asana-btn', 'review-date-picker', 'download-ics-btn',
                'journal-view', 'journal-list-container',
                'settings-view', 'wheel-customization-container', 'save-wheel-settings-btn',
                'prompts-customization-container', 'new-prompt-input', 'add-prompt-btn',
                'export-data-btn', 'import-data-input'
            ];
            ids.forEach(id => this.dom[id] = document.getElementById(id));
            this.dom.mainNavButtons = document.querySelectorAll('#main-nav button');
            this.dom.toolBtns = document.querySelectorAll('.tool-btn');
            this.dom.tabBtns = document.querySelectorAll('.tab-btn');
            this.dom.tabContents = document.querySelectorAll('.tab-content');
            this.dom.views = document.querySelectorAll('.view');
        }

        // The main entry point for the application
        init() {
            this.loadState();
            this.initEventListeners();
            this.renderDashboard();
            this.switchView('dashboard-view');
            this.dom.appContainer.classList.add('loaded');
        }

        // Load state from localStorage or use defaults
        loadState() {
            const defaultState = {
                journal: [], currentSession: null,
                settings: {
                    wheelCategories: ['Mission', 'Family', 'Friends', 'Romance', 'Spiritual', 'Mental', 'Physical', 'Growth', 'Money', 'Joy'],
                    journalPrompts: [
                        "What would I do if money were no object?", "If I didn’t care about making money, how would I use my talents and skills to serve other people?", "What would I like people to say at my funeral? And to what extent am I currently living aligned with that future?", "If I repeated this week's actions for the next ten years, where would that lead me? And is that where I want to be?", "What activities in the last month have energised me, and what activities in the last month have drained me? How can I do more of what energises me and less of what has drained me?", "When it comes to my work or my life, what is the goal and what is the primary bottleneck?", "Do I work for my business or does my business work for me?", "If I knew I was going to die two years from now, how would I spend my time?", "What's the biggest bottleneck to achieving my next goal, and why am I not addressing it more directly?", "How much do my current goals reflect my own desires versus someone else's expectations?", "What are some areas in which I could invest more money to make life smoother and easier for myself?", "What could I do to make my life more meaningful?", "What do I wish I could do more quickly? And what do I wish I could do more slowly?", "What backpack am I carrying that no longer serves me?"
                    ]
                }
            };
            try {
                const savedState = localStorage.getItem('thinkDaySanctuaryState');
                this.state = savedState ? JSON.parse(savedState) : JSON.parse(JSON.stringify(defaultState));
            } catch { this.state = JSON.parse(JSON.stringify(defaultState)); }
        }

        // Save the current state to localStorage
        saveState() {
            try {
                localStorage.setItem('thinkDaySanctuaryState', JSON.stringify(this.state));
            } catch (error) {
                console.error("Could not save state:", error);
                this.showNotification("Error saving progress.", "error");
            }
        }
        
        // ======================= UI & NOTIFICATIONS ======================== //
        
        showNotification(message, type = 'success', duration = 3000) {
            const existingToast = document.querySelector('.notification');
            if (existingToast) existingToast.remove();
            
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 500);
            }, duration);
        }
        
        // ======================= NAVIGATION & WORKFLOW ======================== //

        switchView(viewId) {
            this.dom.views.forEach(view => view.classList.add('hidden'));
            this.dom[viewId]?.classList.remove('hidden');
            this.dom.mainNavButtons.forEach(button => button.classList.toggle('active', button.dataset.view === viewId));
        }

        startSessionAt(stepViewId) {
            const stepIndex = sessionSteps.indexOf(stepViewId);
            if (stepIndex === -1) return;
            
            this.createNewSession();
            this.currentStepIndex = stepIndex;

            this.initAllSessionUI();
            
            this.dom.guidedSessionContainer.classList.remove('hidden');
            this.dom.sessionNav.classList.remove('hidden');
            this.dom['dashboard-view'].classList.add('hidden');
            this.switchView(stepViewId);
            this.updateSessionNav();
        }

        createNewSession() {
            const defaultReviewDate = new Date();
            defaultReviewDate.setDate(defaultReviewDate.getDate() + 30);
            this.state.currentSession = {
                id: Date.now(), date: new Date().toISOString(), title: `Think Day - ${new Date().toLocaleDateString()}`,
                wheelOfLife: Object.fromEntries(this.state.settings.wheelCategories.map(cat => [cat, 5])),
                fearCatalyst: '', fearDefine: [{ worst: '', prevent: '', repair: '' }], fearBenefits: '',
                fearCost: { '6m': '', '1y': '', '3y': '' }, journalEntries: {},
                actionPlan: `Before today I was...\n\nBut as of today I decided that...\n\nAction points:\n1. \n2. \n3. \n\nI will review this on...`,
                reviewDate: defaultReviewDate.toISOString().split('T')[0]
            };
        }

        initAllSessionUI() {
            this.initWheelOfLife(); this.initFearSetting();
            this.initJournaling(); this.initActionSteps();
        }
        
        updateSessionNav() {
            this.dom.prevStepBtn.disabled = this.currentStepIndex === 0;
            this.dom.nextStepBtn.classList.toggle('hidden', this.currentStepIndex === sessionSteps.length - 1);
            this.dom.completeSessionBtn.classList.toggle('hidden', this.currentStepIndex !== sessionSteps.length - 1);
        }
        
        // ======================= FEATURES ======================== //

        renderDashboard() {
            const list = this.dom['recent-actions-list'];
            list.innerHTML = '';
            if (this.state.journal.length > 0 && this.state.journal[0].actionPlan) {
                const actionItems = this.state.journal[0].actionPlan.split('\n').filter(line => line.trim().match(/^(\d+\.|-|\*)\s/));
                if (actionItems.length > 0) {
                    list.classList.remove('empty-state');
                    list.innerHTML = `<ul>${actionItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
                } else {
                    list.innerHTML = `<div class="empty-state"><p>✨ Your last session had no specific action points.</p></div>`;
                }
            } else {
                list.innerHTML = `<div class="empty-state"><p>✨ No recent actions yet. Start a Think Day to create a plan.</p></div>`;
            }
        }
        
        renderJournal() {
            const container = this.dom.journalListContainer;
            container.innerHTML = '';
            if (this.state.journal.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>📖 Your journal is waiting for your first Think Day session.</p></div>';
                return;
            }
            this.state.journal.forEach(session => {
                const el = document.createElement('div'); el.className = 'journal-entry-summary';
                el.innerHTML = `<h3>${session.title || new Date(session.date).toLocaleDateString()}</h3><p>${new Date(session.date).toLocaleString()}</p>`;
                el.addEventListener('click', () => this.showNotification('Viewing full session details is a great future addition!', 'info'));
                container.appendChild(el);
            });
        }
        
        // --- Wheel of Life ---
        initWheelOfLife() {
            this.dom.wheelSlidersContainer.innerHTML = '';
            this.state.settings.wheelCategories.forEach(category => {
                const value = this.state.currentSession.wheelOfLife[category] || 5;
                const item = document.createElement('div'); item.className = 'slider-item';
                item.innerHTML = `<label for="slider-${category}">${category}</label>
                                  <input type="range" id="slider-${category}" min="1" max="10" value="${value}" data-category="${category}">
                                  <span class="slider-value">${value}</span>`;
                this.dom.wheelSlidersContainer.appendChild(item);
            });
            this.renderWheelChart();
        }
        
        renderWheelChart() {
            if (this.wheelChart) this.wheelChart.destroy();
            const ctx = this.dom.wheelOfLifeCanvas.getContext('2d');
            this.wheelChart = new Chart(ctx, {
                type: 'radar', data: { labels: this.state.settings.wheelCategories, datasets: [{
                    data: this.state.settings.wheelCategories.map(cat => this.state.currentSession.wheelOfLife[cat]),
                    backgroundColor: 'rgba(212, 175, 55, 0.2)', borderColor: 'rgba(212, 175, 55, 1)',
                }]},
                options: { scales: { r: {
                    angleLines: { color: 'rgba(234, 234, 234, 0.2)' }, grid: { color: 'rgba(234, 234, 234, 0.2)' },
                    pointLabels: { color: '#EAEAEA', font: { size: 12 } },
                    ticks: { display: false, stepSize: 1 }, min: 0, max: 10
                }}, plugins: { legend: { display: false } } }
            });
        }

        updateWheelChart(category, value) {
            this.state.currentSession.wheelOfLife[category] = value;
            if (this.wheelChart) {
                this.wheelChart.data.datasets[0].data = this.state.settings.wheelCategories.map(cat => this.state.currentSession.wheelOfLife[cat]);
                this.wheelChart.update('none');
            }
            this.saveState();
        }
        
        // --- Fear Setting ---
        initFearSetting() {
            this.dom.fearCatalystPrompt.value = this.state.currentSession.fearCatalyst;
            this.renderFearDefineList();
            this.dom.benefitsTextarea.value = this.state.currentSession.fearBenefits;
            this.dom['cost-6-months'].value = this.state.currentSession.fearCost['6m'];
            this.dom['cost-1-year'].value = this.state.currentSession.fearCost['1y'];
            this.dom['cost-3-years'].value = this.state.currentSession.fearCost['3y'];
        }

        renderFearDefineList() {
            this.dom.fearDefineList.innerHTML = '';
            this.state.currentSession.fearDefine.forEach((fear, index) => {
                const item = document.createElement('div');
                item.className = 'fear-item'; item.dataset.index = index;
                item.innerHTML = `<textarea data-type="worst" placeholder="1. Worst Case...">${fear.worst}</textarea>
                                  <textarea data-type="prevent" placeholder="2. How to Prevent...">${fear.prevent}</textarea>
                                  <textarea data-type="repair" placeholder="3. How to Repair...">${fear.repair}</textarea>`;
                this.dom.fearDefineList.appendChild(item);
            });
        }
        
        // --- Journaling ---
        initJournaling() {
            this.renderPromptSelection();
            this.dom.promptSelectionContainer.classList.remove('hidden');
            this.dom.startJournalingBtn.classList.remove('hidden');
            this.dom.journalingInterfaceContainer.classList.add('hidden');
        }

        renderPromptSelection() {
            const container = this.dom.promptSelectionContainer;
            container.innerHTML = '';
            this.state.settings.journalPrompts.forEach((prompt, index) => {
                const div = document.createElement('div');
                div.className = 'prompt-item';
                div.innerHTML = `<input type="checkbox" id="prompt-${index}" data-index="${index}"><label for="prompt-${index}">${prompt}</label>`;
                container.appendChild(div);
            });
            this.dom.startJournalingBtn.disabled = true;
        }

        displayCurrentPrompt() {
            const promptGlobalIndex = this.selectedPrompts[this.currentPromptIndexInSelection];
            this.dom.currentPromptText.textContent = this.state.settings.journalPrompts[promptGlobalIndex];
            this.dom.journalEditor.innerHTML = this.state.currentSession.journalEntries[promptGlobalIndex] || '';
            this.dom.promptProgress.textContent = `${this.currentPromptIndexInSelection + 1} / ${this.selectedPrompts.length}`;
            this.dom.prevPromptBtn.disabled = this.currentPromptIndexInSelection === 0;
            this.dom.nextPromptBtn.disabled = this.currentPromptIndexInSelection === this.selectedPrompts.length - 1;
        }

        // --- Action Steps & Settings ---
        initActionSteps() {
            this.dom.actionPlanTextarea.value = this.state.currentSession.actionPlan;
            this.dom.reviewDatePicker.value = this.state.currentSession.reviewDate;
        }

        renderSettings() {
            const wheelContainer = this.dom.wheelCustomizationContainer;
            wheelContainer.innerHTML = '';
            this.state.settings.wheelCategories.forEach((cat, index) => {
                wheelContainer.innerHTML += `<input type="text" value="${cat}" data-index="${index}">`;
            });
            const promptsContainer = this.dom.promptsCustomizationContainer;
            promptsContainer.innerHTML = '';
            this.state.settings.journalPrompts.forEach((prompt, index) => {
                const div = document.createElement('div'); div.className = 'prompt-item';
                div.innerHTML = `<span>${prompt}</span><button data-index="${index}" class="btn-secondary">Delete</button>`;
                promptsContainer.appendChild(div);
            });
        }
        
        // ======================= EVENT LISTENERS ======================== //
        initEventListeners() {
            // Main Navigation
            this.dom.mainNavButtons.forEach(button => button.addEventListener('click', (e) => {
                const viewId = e.currentTarget.dataset.view;
                if (viewId === 'journal-view') this.renderJournal();
                if (viewId === 'settings-view') this.renderSettings();
                this.switchView(viewId);
            }));

            // Dashboard & Toolbox
            this.dom.startNewDayBtn.addEventListener('click', () => this.startSessionAt(sessionSteps[0]));
            this.dom.toolBtns.forEach(btn => btn.addEventListener('click', (e) => this.startSessionAt(e.currentTarget.dataset.tool)));

            // Session Navigation
            this.dom.prevStepBtn.addEventListener('click', () => { if (this.currentStepIndex > 0) { this.currentStepIndex--; this.switchView(sessionSteps[this.currentStepIndex]); this.updateSessionNav(); } });
            this.dom.nextStepBtn.addEventListener('click', () => { if (this.currentStepIndex < sessionSteps.length - 1) { this.currentStepIndex++; this.switchView(sessionSteps[this.currentStepIndex]); this.updateSessionNav(); } });
            this.dom.completeSessionBtn.addEventListener('click', () => {
                this.state.journal.unshift(this.state.currentSession); this.state.currentSession = null;
                this.saveState(); this.renderDashboard(); this.switchView('dashboard-view');
                this.showNotification('Think Day session saved!');
            });
            
            // Wheel Sliders
            this.dom.wheelSlidersContainer.addEventListener('input', (e) => {
                if (e.target.type === 'range') {
                    e.target.nextElementSibling.textContent = e.target.value;
                    this.updateWheelChart(e.target.dataset.category, parseInt(e.target.value, 10));
                }
            });

            // Fear Setting (delegated for dynamic elements)
            this.dom.fearCatalystPrompt.addEventListener('input', (e) => this.state.currentSession.fearCatalyst = e.target.value);
            this.dom.benefitsTextarea.addEventListener('input', (e) => this.state.currentSession.fearBenefits = e.target.value);
            this.dom['cost-6-months'].addEventListener('input', (e) => this.state.currentSession.fearCost['6m'] = e.target.value);
            this.dom['cost-1-year'].addEventListener('input', (e) => this.state.currentSession.fearCost['1y'] = e.target.value);
            this.dom['cost-3-years'].addEventListener('input', (e) => this.state.currentSession.fearCost['3y'] = e.target.value);
            this.dom.goDeeperBtn.addEventListener('click', () => { this.dom.fearDeepDiveContainer.classList.remove('hidden'); this.dom.goDeeperBtn.classList.add('hidden'); });
            this.dom.tabNav.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-btn')) {
                    this.dom.tabBtns.forEach(btn => btn.classList.remove('active')); e.target.classList.add('active');
                    this.dom.tabContents.forEach(c => c.classList.add('hidden'));
                    this.dom[`${e.target.dataset.tab}-tab-content`].classList.remove('hidden');
                }
            });
            this.dom.fearDefineList.addEventListener('input', (e) => {
                if (e.target.tagName === 'TEXTAREA') {
                    const index = e.target.closest('.fear-item').dataset.index;
                    this.state.currentSession.fearDefine[index][e.target.dataset.type] = e.target.value;
                    this.saveState();
                }
            });
            this.dom.addFearBtn.addEventListener('click', () => { this.state.currentSession.fearDefine.push({ worst: '', prevent: '', repair: '' }); this.renderFearDefineList(); this.saveState(); });

            // Journaling
            this.dom.promptSelectionContainer.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    e.target.parentElement.classList.toggle('selected', e.target.checked);
                    this.dom.startJournalingBtn.disabled = !this.dom.promptSelectionContainer.querySelector('input:checked');
                }
            });
            this.dom.startJournalingBtn.addEventListener('click', () => {
                this.selectedPrompts = Array.from(this.dom.promptSelectionContainer.querySelectorAll('input:checked')).map(cb => parseInt(cb.dataset.index));
                this.currentPromptIndexInSelection = 0;
                this.dom.promptSelectionContainer.classList.add('hidden');
                this.dom.startJournalingBtn.classList.add('hidden');
                this.dom.journalingInterfaceContainer.classList.remove('hidden');
                this.displayCurrentPrompt();
            });
            this.dom.prevPromptBtn.addEventListener('click', () => { if (this.currentPromptIndexInSelection > 0) { this.currentPromptIndexInSelection--; this.displayCurrentPrompt(); }});
            this.dom.nextPromptBtn.addEventListener('click', () => { if (this.currentPromptIndexInSelection < this.selectedPrompts.length - 1) { this.currentPromptIndexInSelection++; this.displayCurrentPrompt(); }});
            this.dom.journalEditor.addEventListener('input', () => {
                const promptGlobalIndex = this.selectedPrompts[this.currentPromptIndexInSelection];
                this.state.currentSession.journalEntries[promptGlobalIndex] = this.dom.journalEditor.innerHTML;
                this.saveState();
            });

            // Action Steps
            this.dom.actionPlanTextarea.addEventListener('input', (e) => { this.state.currentSession.actionPlan = e.target.value; this.saveState(); });
            this.dom.reviewDatePicker.addEventListener('change', (e) => { this.state.currentSession.reviewDate = e.target.value; this.saveState(); });
            this.dom.copyAsanaBtn.addEventListener('click', () => {
                const actionItems = this.dom.actionPlanTextarea.value.split('\n').filter(line => line.trim().match(/^(\d+\.|-|\*)\s/));
                if (actionItems.length > 0) navigator.clipboard.writeText(actionItems.join('\n')).then(() => this.showNotification('Action plan copied!'));
                else this.showNotification('No action points found to copy.', 'error');
            });
            this.dom.downloadIcsBtn.addEventListener('click', () => {
                const reviewDate = this.dom.reviewDatePicker.value; if (!reviewDate) { this.showNotification('Please select a review date.', 'error'); return; }
                const icsDate = new Date(reviewDate).toISOString().replace(/[-:]|\.\d{3}/g, "");
                const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g, "")}Z\nDTSTART;VALUE=DATE:${icsDate.substring(0,8)}\nSUMMARY:Review Think Day Action Plan\nEND:VEVENT\nEND:VCALENDAR`;
                const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'think_day_review.ics'; link.click(); URL.revokeObjectURL(link.href);
            });

            // Settings
            this.dom.saveWheelSettingsBtn.addEventListener('click', () => {
                this.state.settings.wheelCategories = Array.from(this.dom.wheelCustomizationContainer.querySelectorAll('input')).map(input => input.value);
                this.saveState(); this.showNotification('Wheel categories saved!');
            });
            this.dom.addPromptBtn.addEventListener('click', () => {
                const newPrompt = this.dom.newPromptInput.value.trim();
                if (newPrompt) { this.state.settings.journalPrompts.push(newPrompt); this.dom.newPromptInput.value = ''; this.saveState(); this.renderSettings(); }
            });
            this.dom.promptsCustomizationContainer.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') { this.state.settings.journalPrompts.splice(e.target.dataset.index, 1); this.saveState(); this.renderSettings(); }
            });
            this.dom.exportDataBtn.addEventListener('click', () => {
                const dataStr = JSON.stringify(this.state, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `thinkday_backup_${new Date().toISOString().split('T')[0]}.json`; link.click();
            });
            this.dom.importDataInput.addEventListener('change', (e) => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importedState = JSON.parse(event.target.result);
                        if (importedState.journal && importedState.settings) {
                            this.state = importedState; this.saveState();
                            this.showNotification('Data restored! App will reload.');
                            setTimeout(() => location.reload(), 1500);
                        } else { this.showNotification('Invalid backup file.', 'error'); }
                    } catch { this.showNotification('Error reading file.', 'error'); }
                };
                reader.readAsText(file);
            });
        }
    }

    // Instantiate and start the app
    new ThinkDayApp();
});