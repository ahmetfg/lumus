(() => {
    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get('debug');
    const hostname = window.location.hostname;
    const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
    const isPrivateIpv4 = /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})$/.test(hostname);
    const isDevPort = new Set(['5173', '4173', '3000', '3001', '8080']).has(window.location.port);
    const isLocalContext =
        window.location.protocol === 'file:' ||
        localHosts.has(hostname) ||
        hostname.endsWith('.local') ||
        hostname.endsWith('.test') ||
        hostname.endsWith('.lan') ||
        hostname.endsWith('.home.arpa') ||
        hostname.endsWith('.internal') ||
        isPrivateIpv4 ||
        isDevPort;

    const debugEnabled =
        debugParam === '1' ||
        debugParam === 'true' ||
        ((debugParam === null || debugParam === '') && isLocalContext);

    window.DESK_DEBUG_UI_ENABLED = debugEnabled;
    document.documentElement.classList.toggle('debug-ui-enabled', debugEnabled);
    document.documentElement.classList.toggle('debug-ui-disabled', !debugEnabled);

    const style = document.createElement('style');
    style.textContent = `
        html.debug-ui-disabled [data-debug-ui],
        html.debug-ui-disabled .dg,
        html.debug-ui-disabled .lil-gui {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    const createControllerStub = () => {
        const controller = {
            name: () => controller,
            onChange: () => controller,
            listen: () => controller,
            step: () => controller,
            min: () => controller,
            max: () => controller
        };

        return controller;
    };

    const createGuiStub = () => {
        const controller = createControllerStub();
        const folder = {
            add: () => controller,
            addColor: () => controller,
            addFolder: () => createGuiStub(),
            open: () => folder,
            close: () => folder,
            destroy: () => undefined,
            domElement: document.createElement('div')
        };

        return folder;
    };

    window.createDeskDebugGui = (factory) => {
        if (window.DESK_DEBUG_UI_ENABLED === false) {
            return createGuiStub();
        }

        return factory();
    };
})();
