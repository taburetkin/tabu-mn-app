import { View } from '../../vendors.js';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import './layout.less';

const Layout = View.extend({
	id: 'app',
	className: 'vertical-layout',
	template: `<header></header><section></section><footer></footer>`,
	considerChildViewKeyAs: 'selector',
	children: {
		header: Header,
		section: Content,
		footer: Footer
	},
	childViewOptions() {
		const { failedPage, contentToShow } = this;
		return { failedPage, contentToShow, contentOptions: this.getOption('contentOptions', true) };
	},
	// sectionOptions() {
	// 	debugger
	// 	return {
	// 		contentOptions: this.getOption('contentOptions', true)
	// 	}
	// },
	onStartPage() {
		delete this.failedPage;
		delete this.contentToShow;
		this.render();
	},
	onStartPageFail(failedPage, contentToShow) {
		this.failedPage = failedPage;
		this.contentToShow = contentToShow;
		this.render();
	}
});

export default Layout;