import { View, CollectionView } from '../../vendors.js';

function childViewOptions() {
	const opts = this.getOptions(['collection', 'filter', 'selector', 'recordsetChildView'], true);
	return opts;
}

const BodyView = CollectionView.extend({
	baseClassName: 'recordset-body',
	childView() { return this.getOption('recordsetChildView', true); }
});

const TableBodyView = BodyView.extend({
	className: 'table',
	
});

const PlatesBodyView = BodyView.extend({
	className: 'plates',
	initialize() { console.log('CARDS', this) },
	
	// _renderChildren() {
	// 	try {
	// 		debugger
	// 		BodyView.prototype._renderChildren.apply(this, arguments);
	// 	} catch (err) {
	// 		console.warn('err', err)
	// 	}
	// }
});



const ContentView = View.extend({
	baseClassName:'recordset-content',
	children: [
		v => v.getHeader(),
		v => v.getBody(),
		v => v.getFooter()
	],
	getHeader() { },
	getBody() {
		return PlatesBodyView
	},
	getFooter() { },
	childViewOptions,
	initialize() { console.log('CONTENT', this) },
});

export const RecordsetView = View.extend({
	baseClassName: 'recordset-container',
	children:[
		v => v.getPagination(),
		v => v.getRecordsetInfo(),
		v => v.getContent(),
		v => v.getPagination(true),
	],
	getPagination(bottom) {},
	getRecordsetInfo() {},
	getContent() {
		return ContentView
	},
	childViewOptions,
	initialize() { console.log('LAYOUT', this) },
});