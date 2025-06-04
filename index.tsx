/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

type View = 'landing' | 'q1' | 'q2' | 'loading' | 'result';

interface AppState {
    currentView: View;
    answer1: number | null;
    answer2: string | null;
    apiResult: ApiResultData | null; // Typed the API result
    error: string | null;
}

interface ApiResultData {
    orakelSpruch?: string;
    hauptbotschaft?: string;
    witzigeErkenntnis?: string;
    // Allow any other properties that might come from the webhook
    [key: string]: any;
}

const appState: AppState = {
    currentView: 'landing',
    answer1: null,
    answer2: null,
    apiResult: null,
    error: null,
};

const APP_ID = 'app';
let appElement: HTMLElement | null = null;
let loadingTextIntervalId: number | undefined;


function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    options?: {
        id?: string;
        className?: string;
        textContent?: string;
        type?: string;
        placeholder?: string;
        value?: string | number;
        min?: string;
        required?: boolean;
        onClick?: (event: MouseEvent) => void;
        innerHTML?: string;
        ariaLabel?: string;
        style?: string; // Added style property
        href?: string; // Added for anchor tags
    }
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    if (options?.id) el.id = options.id;
    if (options?.className) el.className = options.className;
    if (options?.textContent) el.textContent = options.textContent;
    if (options?.innerHTML) el.innerHTML = options.innerHTML;
    if (options?.ariaLabel) el.setAttribute('aria-label', options.ariaLabel);
    if (options?.style) el.style.cssText = options.style; // Apply styles
    if (options?.href && tag === 'a') (el as HTMLAnchorElement).href = options.href;


    if ((tag === 'input' || tag === 'textarea') && options) {
        const inputEl = el as HTMLInputElement | HTMLTextAreaElement;
        if (options.type) (inputEl as HTMLInputElement).type = options.type;
        if (options.placeholder) inputEl.placeholder = options.placeholder;
        if (options.value !== undefined) inputEl.value = String(options.value);
        if (options.min && (inputEl as HTMLInputElement).type === 'number') (inputEl as HTMLInputElement).min = options.min;
        if (options.required) inputEl.required = options.required;
    }
    if (options?.onClick) {
      el.addEventListener('click', options.onClick);
    }
    return el;
}

function navigateTo(view: View) {
    if (appState.currentView === 'loading' && loadingTextIntervalId) {
        clearInterval(loadingTextIntervalId);
        loadingTextIntervalId = undefined;
    }
    appState.currentView = view;
    render();
    window.scrollTo(0, 0); // Scroll to top on view change
}

function observeScrollAnimations() {
    const animatedElements = document.querySelectorAll<HTMLElement>('.content-block');
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { 
            if (entry.isIntersecting) {
                const targetElement = entry.target as HTMLElement;
                targetElement.classList.add('visible');
                observer.unobserve(targetElement);
            }
        });
    }, { threshold: 0.1 }); 

    animatedElements.forEach(el => observer.observe(el));
}


function renderLandingPage() {
    if (!appElement) return;
    appElement.innerHTML = '';

    const heroSection = createElement('div', { className: 'section landing-hero' });
    const title = createElement('h1', { textContent: 'Jannicks CV-Gelenkwellen Wunderland!' });
    const subtitle = createElement('p', { textContent: 'Hey Jannick! Bereit, die tiefsten Geheimnisse der CV-Gelenkwellen zu lüften und zu staunen, was man in Rekordzeit auf die digitalen Beine stellen kann? Dieses kleine Abenteuer ist NUR für dich (und deine Faltenbalgbinder)!' });
    const startButton = createElement('button', {
        className: 'btn', 
        textContent: 'Quiz starten & Abstauben!',
        onClick: () => navigateTo('q1')
    });

    heroSection.append(title, subtitle, startButton);
    appElement.appendChild(heroSection);

    const scrollSection = createElement('div', { className: 'scroll-content' });
    const scrollTitle = createElement('h2', { textContent: 'Die geheime Welt der CV-Gelenkwellen & Web-Magie' });
    scrollSection.appendChild(scrollTitle);

    const content1 = createElement('div', { className: 'content-block' });
    content1.appendChild(createElement('h3', { textContent: 'CV-Gelenkwellen: Mehr als nur Metall!' }));
    content1.appendChild(createElement('p', { textContent: "Wusstest du, dass jede CV-Gelenkwelle eine eigene kleine Persönlichkeit hat? Okay, vielleicht nicht, aber sie sind definitiv spannender als dein letzter Montag! Und moderne Webseiten bauen geht schneller, als du 'Differentialausgleichsgetriebe' fehlerfrei aussprechen kannst." }));
    scrollSection.appendChild(content1);

    const content2 = createElement('div', { className: 'content-block' });
    content2.appendChild(createElement('h3', { textContent: 'Interaktive CV-Abenteuer' }));
    content2.appendChild(createElement('p', { textContent: "Von null auf 'BOAH, KRASS!' in wenigen Codezeilen. Gleich testest du dein ultimatives CV-Fachwissen. Anschnallen, es wird... äh... geschmeidig und vielleicht ein bisschen ölig!" }));
    scrollSection.appendChild(content2);

    const content3 = createElement('div', { className: 'content-block' });
    content3.appendChild(createElement('h3', { textContent: 'Datenübertragung: Direkt aus der CV-Zentrale' }));
    content3.appendChild(createElement('p', { textContent: 'Deine genialen Antworten werden direkt an unseren hochmodernen CV-Analyse-Server übermittelt. Mal sehen, ob er bereit für deine Genialität ist!' }));
    scrollSection.appendChild(content3);
    
    const cleanSectionBlock = createElement('div', { className: 'content-block' }); // New clean section
    cleanSectionBlock.appendChild(createElement('h3', { textContent: 'Die Kunst der Reduktion: Weniger ist CV-Mehr!' }));
    cleanSectionBlock.appendChild(createElement('p', { textContent: "Manchmal, Jannick, liegt die wahre Ingenieurskunst nicht im Hinzufügen, sondern im Weglassen. Ein perfekt reduziertes System, eine klare Linie – das ist wie ein CV-Gelenk, das ohne unnötigen Schnickschnack einfach seine Arbeit macht: geschmeidig, effizient, brillant. Diese Seite hier? Ein kleiner Beweis, dass auch im Webdesign Eleganz durch Einfachheit entsteht." }));
    scrollSection.appendChild(cleanSectionBlock);


    appElement.appendChild(scrollSection);
    requestAnimationFrame(() => { 
        observeScrollAnimations();
    });
}

function renderQuestion1Page() {
    if (!appElement) return;
    appElement.innerHTML = '';

    const section = createElement('div', { className: 'section quiz-section' });
    const title = createElement('h2', { textContent: 'Frage 1: CV-Teamwork-Kalkulator' });
    const questionText = createElement('p', { textContent: 'Hand aufs Herz: Wie viele Ingenieure braucht es, um eine CV-Gelenkwelle anzulegen (und das, ohne die Zeichnung zu erstellen?)?' });

    const input = createElement('input', {
        id: 'answer1',
        type: 'number',
        placeholder: 'Anzahl der Superhelden',
        min: '0',
        value: appState.answer1 ?? '',
        ariaLabel: 'Anzahl der Ingenieure'
    }) as HTMLInputElement;

    const nextButton = createElement('button', {
        className: 'btn',
        textContent: 'Weiter zur nächsten kniffligen Frage',
        onClick: () => {
            const value = parseInt(input.value, 10);
            if (isNaN(value) || value < 0) {
                alert('Bitte gib eine gültige, nicht-negative Zahl ein, Jannick! Auch wenn es nur einer ist, der Magie wirkt.');
                return;
            }
            appState.answer1 = value;
            navigateTo('q2');
        }
    });
    section.append(title, questionText, input, nextButton);
    appElement.appendChild(section);
    input.focus();
}

function renderQuestion2Page() {
    if (!appElement) return;
    appElement.innerHTML = '';

    const section = createElement('div', { className: 'section quiz-section' });
    const title = createElement('h2', { textContent: 'Frage 2: Das CV-Gelenk-Experiment des Jahrhunderts!' });
    const questionText = createElement('p', { textContent: 'Stell dir vor, Jannick: Ein mutiges 311er Gelenk (legendär!) trifft auf ein unschuldiges 7er Rohr. Was für ein episches (oder urkomisches) Szenario spielt sich da in deiner Fantasie ab?' });

    const input = createElement('input', {
        id: 'answer2',
        type: 'text',
        placeholder: 'Deine explosive (oder ölige) Theorie...',
        value: appState.answer2 ?? '',
        ariaLabel: 'Theorie zum Gelenk-Rohr-Treffen'
    }) as HTMLInputElement;

    const submitButton = createElement('button', {
        className: 'btn', 
        textContent: 'Absenden & das CV-Orakel befragen!',
        onClick: () => {
            if (!input.value.trim()) {
                alert('Komm schon, Jannick, ein paar Worte zu diesem epischen Treffen fallen dir doch sicher ein!');
                return;
            }
            appState.answer2 = input.value.trim();
            handleFormSubmit();
        }
    });

    section.append(title, questionText, input, submitButton);
    appElement.appendChild(section);
    input.focus();
}

async function handleFormSubmit() {
    navigateTo('loading');
    const webhookUrl = 'https://hook.eu2.make.com/az9qe07qy6if3nltru41ft2opyvqa5mf';
    const payload = {
        kollege: "Jannick der CV-Meister",
        antwortFrage1_IngenieurAnzahl: appState.answer1,
        antwortFrage2_GelenkRohrTheorie: appState.answer2,
        zeitstempel: new Date().toISOString()
    };

    let responseText = ''; 

    try {
        const responsePromise = fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const minDelayPromise = new Promise(resolve => setTimeout(resolve, 8000));

        const [fetchResult] = await Promise.all([responsePromise, minDelayPromise]);
        const response = fetchResult as Response;

        responseText = await response.text(); 

        if (!response.ok) {
            throw new Error(`Datenfunk-Störung! Fehler ${response.status}: ${responseText || response.statusText}. Vielleicht ist das Internet heute auch nur ein bisschen ölig.`);
        }
        
        try {
            appState.apiResult = JSON.parse(responseText);
        } catch (initialParseError) {
            console.warn('JSON-Parsing-Fehler (erster Versuch):', initialParseError);
            console.warn('Empfangener Roh-Text:', responseText);
            
            const cleanedText = responseText.replace(/[\u0000-\u001F]/g, (match) => {
                switch (match) {
                    case '\b': return '\\b'; 
                    case '\f': return '\\f'; 
                    case '\n': return '\\n'; 
                    case '\r': return '\\r'; 
                    case '\t': return '\\t'; 
                    default:
                        return '\\u' + match.charCodeAt(0).toString(16).padStart(4, '0');
                }
            });
            
            console.log('Versuche erneut zu parsen mit bereinigtem Text.');
            appState.apiResult = JSON.parse(cleanedText); 
        }
        
        appState.error = null;

    } catch (err) {
        console.error('Fehler beim Senden/Verarbeiten der CV-Daten:', err);
        appState.apiResult = null; 
        
        let errorMessage = (err as Error).message || 'Ein unbekannter Fehler ist beim Daten-Gelenk aufgetreten.';
        if (responseText && !(err as Error).message.includes(responseText.substring(0,50))) { 
             errorMessage += ` | Antwort vom Server (Beginn): ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`;
        }
        appState.error = errorMessage;
    }
    navigateTo('result');
}

function renderLoadingPage() {
    if (!appElement) return;
    appElement.innerHTML = '';

    const loadingOverlay = createElement('div', { className: 'loading-section' });
    const spinner = createElement('div', {className: 'clean-spinner'});
    
    const loadingTextElement = createElement('p', { 
        textContent: 'Jannicks CV-Theorien werden mit Hochdruck & Präzisionsfett analysiert...' 
    });

    loadingOverlay.append(spinner, loadingTextElement);
    appElement.appendChild(loadingOverlay);

    const loadingMessages = [
        "CV-Gelenke werden auf Hochglanz poliert...",
        "Zapfwinkel werden feinkalibriert...",
        "Achsmanschetten-Origami – fast fertig...",
        "Spezialfett wird exakt temperiert...",
        "Prüfstand meldet: Alles im grünen Bereich (fast)...",
        "Jannicks Genialität überlastet kurzzeitig die Matrix...",
        "Drehmomentschlüssel suchen das richtige Drehmoment...",
        "SAP zeigt mal wieder unerklärliche Fehler an... typisch Montag!",
        "Moment, da war doch was mit dem Sprengring...",
        "Der Super-Server gönnt sich einen letzten Schluck Kaffee...",
        "Die Bits & Bytes tanzen CV-Walzer...",
        "Faltenbalgbinder werden fachgerecht verzurrt...",
        "Warte, ich muss nur noch schnell die Kardanwelle wuchten..."
    ];
    let messageIndex = 0;
    loadingTextElement.textContent = loadingMessages[messageIndex];

    if (loadingTextIntervalId) { // Clear any existing interval before starting a new one
        clearInterval(loadingTextIntervalId);
    }

    loadingTextIntervalId = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loadingTextElement.textContent = loadingMessages[messageIndex];
    }, 2500);
}


function renderResultPage() {
    if (!appElement) return;
    appElement.innerHTML = '';

    const section = createElement('div', { className: 'section result-section' });
    const title = createElement('h2', { textContent: 'Jannicks CV-Gelenkwellen-Offenbarung!' });
    section.appendChild(title);

    if (appState.error) {
        const errorDisplay = createElement('p', { className: 'error-message' });
        errorDisplay.innerHTML = `<strong>Oops! Irgendwas ist beim Kontakt mit dem CV-Orakel schiefgelaufen.</strong><br>${appState.error}<br>Vielleicht hat ein Gelenk geklemmt oder der Kardanwellentunnel hatte kein WLAN?`;
        section.appendChild(errorDisplay);
    } else if (appState.apiResult) {
        const resultIntro = createElement('p', { textContent: 'Das große CV-Orakel hat gesprochen! Trommelwirbel... hier ist das Ergebnis deiner genialen Eingebungen, Jannick:' });
        section.appendChild(resultIntro);

        const cardsContainer = createElement('div', { className: 'result-cards-container' });

        const { orakelSpruch, hauptbotschaft, witzigeErkenntnis, ...otherData } = appState.apiResult;

        if (orakelSpruch) {
            const card = createElement('div', { className: 'result-card' });
            card.appendChild(createElement('h3', { className: 'result-card-title', textContent: 'Orakelspruch des Tages:' }));
            card.appendChild(createElement('p', { className: 'result-card-value', textContent: orakelSpruch }));
            cardsContainer.appendChild(card);
        }
        if (hauptbotschaft) {
            const card = createElement('div', { className: 'result-card' });
            card.appendChild(createElement('h3', { className: 'result-card-title', textContent: 'Deine Hauptbotschaft vom Universum:' }));
            card.appendChild(createElement('p', { className: 'result-card-value', textContent: hauptbotschaft }));
            cardsContainer.appendChild(card);
        }
        if (witzigeErkenntnis) {
            const card = createElement('div', { className: 'result-card' });
            card.appendChild(createElement('h3', { className: 'result-card-title', textContent: 'Eine witzige Erkenntnis am Rande:' }));
            card.appendChild(createElement('p', { className: 'result-card-value', textContent: witzigeErkenntnis }));
            cardsContainer.appendChild(card);
        }
        
        const otherKeys = Object.keys(otherData);
        if (otherKeys.length > 0) {
            const card = createElement('div', { className: 'result-card' });
            card.appendChild(createElement('h3', { className: 'result-card-title', textContent: 'Zusätzliche Daten vom Orakel:' }));
            const pre = createElement('pre', {className: 'result-card-value'});
            try {
                 pre.textContent = JSON.stringify(otherData, null, 2);
            } catch (e) {
                pre.textContent = "Weitere Daten konnten nicht formatiert werden.";
            }
            card.appendChild(pre)
            cardsContainer.appendChild(card);
        }

        if (cardsContainer.children.length === 0) {
             const noSpecificData = createElement('p', {textContent: 'Das Orakel hat geantwortet, aber die spezifischen Botschaften sind... äh... wohlgehütete Geheimnisse geblieben. Hier sind die Rohdaten:'});
             const pre = createElement('pre', {
                className: 'result-card-value', 
                style: 'background-color: var(--bg-medium); padding: 15px; border-radius: 8px; white-space: pre-wrap; word-break: break-all;'
             });
             pre.textContent = JSON.stringify(appState.apiResult, null, 2);
             section.append(noSpecificData, pre);
        } else {
            section.appendChild(cardsContainer);
        }

    } else {
        const noResult = createElement('p', { textContent: 'Seltsam... weder Ergebnisse noch Fehlermeldungen. Hat das CV-Gelenk etwa... nichts gesagt? Mysteriös!' });
        section.appendChild(noResult);
    }

    const retryButton = createElement('button', {
        className: 'btn btn-secondary', 
        textContent: 'Noch eine Runde CV-Wahnsinn?',
        onClick: () => {
            appState.answer1 = null;
            appState.answer2 = null;
            appState.apiResult = null;
            appState.error = null;
            navigateTo('landing');
        }
    });
    section.appendChild(retryButton);
    appElement.appendChild(section);
}

function renderFooter() {
    if (!appElement) return;

    const footer = createElement('footer');
    const copyrightText = `© ${new Date().getFullYear()} – Für Jannick, von einem Bewunderer deiner CV-Skills.`;
    const copyright = createElement('p', { textContent: copyrightText });
    
    const linksContainer = createElement('div', { className: 'footer-links' });
    
    const link1 = createElement('a', { 
        textContent: 'Zurück zum Start', 
        href: '#', 
        onClick: (e) => { e.preventDefault(); navigateTo('landing'); }
    });
    const link2 = createElement('a', { 
        textContent: 'Jannicks CV-Ehrenkodex', 
        href: '#',
        onClick: (e) => { e.preventDefault(); navigateTo('landing'); }
    });
    const link3 = createElement('a', { 
        textContent: 'Impressum des Multiversums', 
        href: '#',
        onClick: (e) => { e.preventDefault(); navigateTo('landing'); }
    });

    linksContainer.append(link1, link2, link3);
    footer.append(linksContainer, copyright);
    appElement.appendChild(footer);
}


function render() {
    if (!appElement) {
        console.error(`${APP_ID} element not found in the DOM.`);
        return;
    }

    const oldView = appElement.dataset.view;
    const newView = appState.currentView;

    if (oldView && oldView !== newView) {
        appElement.classList.add('view-exit-active');
        appElement.addEventListener('animationend', () => {
            appElement.classList.remove('view-exit-active');
            appElement.innerHTML = ''; 
            appElement.className = `app-container view-${newView}`;
            appElement.dataset.view = newView;
            renderCurrentView();
            renderFooter(); 
            requestAnimationFrame(() => {
                 appElement.classList.add('view-enter-active');
                 appElement.addEventListener('animationend', () => {
                    appElement.classList.remove('view-enter-active');
                 }, { once: true });
            });
        }, { once: true });
    } else {
        appElement.innerHTML = ''; 
        appElement.className = `app-container view-${newView}`;
        appElement.dataset.view = newView;
        renderCurrentView();
        renderFooter(); 
        if (!oldView) { 
            requestAnimationFrame(() => { 
                appElement.classList.add('view-enter-active');
                appElement.addEventListener('animationend', () => {
                    appElement.classList.remove('view-enter-active');
                }, { once: true });
            });
        }
    }
}

function renderCurrentView() {
     switch (appState.currentView) {
        case 'landing':
            renderLandingPage(); 
            break;
        case 'q1':
            renderQuestion1Page(); 
            break;
        case 'q2':
            renderQuestion2Page(); 
            break;
        case 'loading':
            renderLoadingPage(); 
            break;
        case 'result':
            renderResultPage(); 
            break;
        default:
            console.error('Unbekannte Ansicht:', appState.currentView);
            renderLandingPage();  
    }
}


document.addEventListener('DOMContentLoaded', () => {
    appElement = document.getElementById(APP_ID);
    if (!appElement) {
        console.error('App container nicht gefunden!');
        return;
    }
    render(); 
});
