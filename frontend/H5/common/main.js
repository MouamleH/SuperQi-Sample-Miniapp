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