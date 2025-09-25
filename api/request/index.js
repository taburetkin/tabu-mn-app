import { request } from "../../vendors.js"

export const requestApi = {
	setRequested(page) {
		request.page = page;
		request.parentPages = new Set();
		let p = page.parent;
		while(p) {
			request.parentPages.add(p);
			p = p.parent;
		}
	},
	removeRequested() {
		request.page = undefined;
		request.parentPages = new Set();
	},
	isRequested(page) {
		return page === request.page;
	},
	isParentOfRequested(page) {
		if (!request.parentPages) return false;
		return request.parentPages.has(page);
	}
}