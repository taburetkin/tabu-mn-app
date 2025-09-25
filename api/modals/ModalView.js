import { View } from '../../vendors.js';
// import { ModalFooter } from './ModalFooter.js';

const CloseButton = View.extend({
	tagName: 'button',
	className: 'app-btn modal-close',
	template: '<span><i class="fa fa-x"></span>',
	triggers: {
		'click': 'modal:close'
	}
});

const ModalHeaderText = View.extend({
	name: 'headerTextView',
	className: 'modal-header-text',
	template: '<%= text %>',
	templateContext() {
		return {
			text: this.getOption('text', true)
		}
	}
});

const ModalHeader = View.extend({
	tagName: 'header',
	replaceParentContainer: true,
	headerTextViewOptions() {
		return {
			text: this.getOption('headerText', true)
		}
	},
	children: [
		{ class: ModalHeaderText, name: 'headerTextView' },
		CloseButton
	],
	childViewTriggers: {
		'modal:close':'modal:close'
	},
});


const ModalBox = View.extend({
	name: 'modalBox',
	baseClassName: 'modal-box',
	// considerChildViewKeyAs: ['selector','name'],
	// template: `
	// 	<header></header>
	// 	<section class="modal-content"></section>`,
	templateContext() {

	},
	headerOptions() {
		return {
			headerText: this.getOption('headerText', true)
		}
	},
	// children: {
	// 	header: ModalHeader,
	// 	section: v => v.getOption('content', true), //({ class: ModalContent, children: [v.getOption('content', true)] }),
	// },
	children() {
		let views = [
			this.getOption('content', true)
		];
		const noHeader = this.getOption('noHeader', true);
		if (!noHeader) {
			const headerText = this.getOption('headerText', true);
			views.unshift({ class: ModalHeader, headerText });
		}
		return views;
	},
	childViewTriggers: {
		'modal:close':'modal:close',
		'modal:resolve':'modal:resolve',
		'modal:reject':'modal:reject',
	},

});



export const ModalView = View.extend({
	//DEBUGRENDERCHILD: true,
	baseClassName: 'modal-container',
	className: [
		v => v.getOption('modalClassName', true)
	],
	childViewContainer: '.modal-wrapper',
	template: `<%= bgHtml %><div class="modal-wrapper"></div>`,
	ui: {
		bg: '.modal-bg'
	},

	templateContext() {
		return {
			bgHtml: this._getBgHtml()
		}
	},

	_getBgHtml() { 
		if (this.getOption('noBg', true)) return '';
		return '<div class="modal-bg"></div>';
	},

	isExternalElement(el) {
		if (!this.el.contains(el)) { return true; }
		if (this.noBg) {
			return this.el === el;
		} else {
			return this.ui.bg.get(0) === el;
		}
	},

	childViewOptions() {
		let opts = this.getOptions(['content','headerText', 'noFooter', 'noHeader', 'footerView', 'footerVariant', 'footerButtons'], true)
		opts.className = this.getOption('modalBoxClassName', true);
		console.log('opts', opts)
		return opts;
	},
	children: [
		ModalBox
	],
	childViewTriggers: {
		'modal:close':'modal:close',
		'modal:resolve':'modal:resolve',
		'modal:reject':'modal:reject',		
	},

});