import SVGInjector from 'svg-injector';

export default {
	// afficher les svg une fois la page chargée
	injectSvg: () => {
		const svgs = document.querySelectorAll('img.js-inject-me');
		SVGInjector(svgs);
	},
};
