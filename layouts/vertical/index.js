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
	onStartPage() {
		this.render();
	},
	onStartPageFail(exc) {
		console.error(exc);
	}
});

export default Layout;