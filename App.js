import { AppObject } from './AppObject.js';
import { routes } from './vendors.js';
import { errResult, okResult } from './async.js';
import { modals, requestApi } from './api/index.js';

export const App = AppObject.extend({

	constructor: function() {
		this.pages = [];
		this._tasks = [];
		AppObject.apply(this, arguments);
	},

	registerPage(page) {
		if (!page) { return; }
		routes.register(page.route, this.processRequest.bind(this, page));
		this.registerPages(page.children);
	},

	registerPages(pages) {
		for(let page of pages) {
			this.registerPage(page);
		}
	},

	async processRequest(page, args, request) {
		let result = await this.stopPageAsync(request.page);
		if (!result.ok) { this.triggerMethod('stop:page:fail', request.page, result.value) }
		
		result = await this.startPageAsync(page, args);
		if (!result.ok) { this.triggerMethod('start:page:fail', request.page, result.value) }
	},


	async stopPageAsync(page) {
		if (!page) { return okResult(); }
		this.triggerMethod('before:stop:page', page);
		
		requestApi.removeRequested(page);

		const res = await page.stopAsync();
		if (res.ok) {
			this.triggerMethod('stop:page', page, res.value)
		}
		return res;
	},

	async startPageAsync(page, args) {
		try {
			modals.destroyAll();
			requestApi.setRequested(page);
			this.triggerMethod('before:start:page', page, args);
			let res = await page.startAsync(args);
			if (res.ok) {

				this.triggerMethod('start:page', page, res.value)			
			}
			return res;
		} catch (exc) {
			console.error(exc);
			return errResult(exc);
		}
	},
	

	addStartTask(arg1, arg2) {
		if (this._started) {
			throw new Error('can\'t add start task - application already started')
		}
		let name, task;
		const type1 = typeof arg1;
		const type2 = typeof arg2;
		if (type1 === 'function') {
			task = arg1;
			name = arg2
		} else if (type2 === 'function') {
			task = arg2;
			name = arg1
		} else {
			throw new Error('unable to add start task, task function expected');
		}
		this._tasks.push({ task, name });
	},

	async start(onStart) {



		if (this._started) {
			new Error('application already started');
		}
		const tasksCount = this._tasks.length;
		this.triggerMethod('before:start', { tasksCount });
		this.triggerMethod('before:tasks');
		const tasks = Array.from(this._tasks);
		for (let { task, name } of tasks) {
			this.triggerMethod('before:task', name);
			const res = await this.asyncResult(task);
			this.triggerMethod('task', name, res.ok);
			if (!res.ok) {
				this.triggerMethod('task:fail', res.value, name);
				this.triggerMethod('start:fail', res.value);
				return res;
			}
		}
		this.triggerMethod('tasks');

		if (typeof onStart === 'function') {
			onStart.call(this, this);
		}

		this._started = true;

		try {
			this.triggerMethod('start');
		} catch (exc) {
			console.error(exc);
			return errResult(exc);
		}

		return okResult();
	}


});