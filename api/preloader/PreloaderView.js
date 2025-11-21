import { View } from '../../vendors.js';
export const PreloaderView = View.extend({
	baseClassName: 'preloader-container',
	template: `
<div class="wrapper">
	<div class="preloader-content">
		<span class="preloader-icon-container">
			<span class="preloader-icon"></span>
		</span>
		<span class="preloader-message">
			<%= message %>
		</span>
	</div>
</div>
`,
	templateContext() {
		return {
			message: this.getOption('message', true)
		}
	}
});