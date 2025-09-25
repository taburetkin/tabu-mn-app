import { View, Model } from '../../vendors.js';

const Layout = View.extend({
	className: 'application-starting',
	template: `<div class="wrapper">
		<div class="box">
			<header><%= header %></header>
			<progress max="100" value="<%= progress %>"><%= progress %>%</progress>
			<label><%= message %></label>
		</div>
</div>`,
	ui: {
		header: 'header',
		progress: 'progress',
		message: 'label'
	},
	initialize() {
		if (!this.model) {
			this.model = new Model({ header: '', progress: 0, message: '' });
		} else {
			const { header = '', progress = 0, message = '' } = this.model.attributes;
			this.model.set({ header, progress, message });
		}
	},
	modelEvents: {
		'change':'update'
	},
	update() {
		const { header = '', progress = 0, message = '' } = this.model.attributes;
		this.ui.header.html(header);
		this.ui.progress.get(0).value = parseInt(progress, 10);
		this.ui.message.html(message);
	},
	set(attrs) {
		this.model.set(attrs);
	}
});
export default Layout;