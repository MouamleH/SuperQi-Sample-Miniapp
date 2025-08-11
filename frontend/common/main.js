const BASE_URL = "http://192.168.68.100:1999";

class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        fetch("common/header.html")
            .then(res => res.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const template = doc.querySelector("template");
                this.shadowRoot.appendChild(template.content.cloneNode(true));
            });
    }
}

customElements.define("miniapp-header", Header);

class Console extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.logs = [];
        this.originalConsole = {};
        this.horizontalScrollEnabled = false;
        this.isCollapsed = false;
        this.setupConsoleInterceptor();
    }

    connectedCallback() {
        fetch("common/console.html")
            .then(res => res.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const template = doc.querySelector("template");
                this.shadowRoot.appendChild(template.content.cloneNode(true));
                this.updateDisplay();
                this.applyInitialCollapsedState();
            });
    }

    setupConsoleInterceptor() {
        const methods = ['log', 'warn', 'error', 'info', 'debug'];
        
        methods.forEach(method => {
            this.originalConsole[method] = console[method];
            console[method] = (...args) => {
                this.addLog(method, args);
                this.originalConsole[method](...args);
            };
        });
    }

    addLog(type, args) {
        const timestamp = new Date().toLocaleTimeString();
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            }
            return String(arg);
        }).join(' ');

        this.logs.push({ type, message, timestamp });
        this.updateDisplay();
    }

    updateDisplay() {
        const consoleOutput = this.shadowRoot.querySelector('#console-output');
        if (consoleOutput) {
            const wrapClass = this.horizontalScrollEnabled ? '' : ' wrap-mode';
            consoleOutput.innerHTML = this.logs.map(log => 
                `<div class="console-entry console-${log.type} mb-1${wrapClass}">
<span class="console-timestamp text-gray-500 mr-2">[${log.timestamp}]</span>
<span class="console-type font-bold mr-2">[${log.type.toUpperCase()}] - <span class="console-message text-white">${log.message}</span></span>
</div>`
            ).join('');
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            
            // Update the toggle button state
            this.updateScrollMode();
        }
    }

    clear() {
        this.logs = [];
        this.updateDisplay();
    }

    toggleHorizontalScroll() {
        this.horizontalScrollEnabled = !this.horizontalScrollEnabled;
        this.updateScrollMode();
    }

    updateScrollMode() {
        const consoleEntries = this.shadowRoot.querySelectorAll('.console-entry');
        const toggleButton = this.shadowRoot.querySelector('#scroll-toggle');
        
        if (this.horizontalScrollEnabled) {
            consoleEntries.forEach(entry => entry.classList.remove('wrap-mode'));
            if (toggleButton) {
                toggleButton.textContent = '📜 Scroll';
                toggleButton.className = 'text-blue-400 text-sm px-2 py-1 rounded';
            }
        } else {
            consoleEntries.forEach(entry => entry.classList.add('wrap-mode'));
            if (toggleButton) {
                toggleButton.textContent = '📝 Wrap';
                toggleButton.className = 'text-green-400 text-sm px-2 py-1 rounded';
            }
        }
    }

    applyInitialCollapsedState() {
        const container = this.shadowRoot.querySelector('#console-container');
        const collapseButton = this.shadowRoot.querySelector('#collapse-button');
        
        if (this.isCollapsed) {
            container.classList.add('collapsed');
            collapseButton.classList.add('collapsed');
            collapseButton.title = 'Expand Console';
        }
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        const container = this.shadowRoot.querySelector('#console-container');
        const collapseButton = this.shadowRoot.querySelector('#collapse-button');
        
        if (this.isCollapsed) {
            container.classList.add('collapsed');
            collapseButton.classList.add('collapsed');
            collapseButton.title = 'Expand Console';
        } else {
            container.classList.remove('collapsed');
            collapseButton.classList.remove('collapsed');
            collapseButton.title = 'Collapse Console';
        }
    }
}

customElements.define("miniapp-console", Console);