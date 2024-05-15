window.RevealNbisHome = function () {
    return {
	id: "RevealNbisHome",
	init: function (deck) {
	    initNBISHome(deck);
	},
    };
};

// cf https://github.com/denehyg/reveal.js-toolbar
const initNBISHome = function(Reveal){
    const config = Reveal.getConfig();
    const options = config.nbis_home || {};
    const url = options.url || "https://nbis.se";
    var dom = {};

    loadPlugin();

    function loadPlugin() {

	// Cache references to key DOM elements
        dom.reveal = document.querySelector('.reveal');
        dom.nbishome = document.querySelector('.reveal-nbis-home');
	if (!dom.nbishome) {
	    dom.nbishome = createNode(dom.reveal, 'div', 'reveal-nbis-home', null);
	} else {
	    // move the existing nbishome after the other Reveal components
          dom.reveal.appendChild(dom.nbishome);
	}
        dom.nbishome.classList.add(
	    'reveal-nbis-home-bottom'
        );

	function createNbisHomeButton(icon) {
	    var button = createNode(
		dom.nbishome,
		'a',
		'reveal-nbis-home-button',
		null
	    );
	    button.setAttribute('href', url);
	    createNode(button, 'i', ['fa', icon]);
	    return button;
	}
	createNbisHomeButton('fa-home');

        /**
         * Extend object a with the properties of object b.
         * If there's a conflict, object b takes precedence.
         */
        function extend(a, b) {
          for (var i in b) {
            a[i] = b[i];
          }
        }

	/**
         * Dispatches an event of the specified type from the
         * reveal DOM element.
         */
        function dispatchEvent(type, args) {
            var event = document.createEvent('HTMLEvents', 1, 2);
            event.initEvent(type, true, true);
            extend(event, args);
            document.querySelector('.reveal').dispatchEvent(event);

            // If we're in an iframe, post each reveal.js event to the
            // parent window. Used by the notes plugin
            if (config.postMessageEvents && window.parent !== window.self) {
		window.parent.postMessage(
		    JSON.stringify({
			namespace: 'reveal',
			eventName: type,
			state: getState()
		    }),
		    '*'
		);
            }
        }
        dispatchEvent('nbis-home-ready');
    }

    function createNode(container, tagname, classname, innerHTML) {
	var node = document.createElement(tagname);
	if (classname) {
	    if (Array.isArray(classname)) {
		classname.forEach(function(c) {
		    node.classList.add(c);
		});
	    } else {
		node.classList.add(classname);
	    }
	}
	if (typeof innerHTML === 'string') {
	    node.innerHTML = innerHTML;
	}
	container.appendChild(node);
	return node;
    }
}
