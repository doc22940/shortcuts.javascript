/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;

const { idFromURL, getShortcutDetails } = require("./..");

const id = "e04c0db9ef974178b60f94518daeb8f2";

const apiMock = require("./apiMock.json");
const nock = require("nock");

describe("getShortcutDetails", () => {
	beforeEach(() => {
		nock("https://www.icloud.com")
			.get("/shortcuts/api/records/" + id)
			.reply(200, apiMock);
	});

	it("equal response to mock", () => {
		return getShortcutDetails(id)
			.then(shortcut => {
				assert.strictEqual(JSON.stringify(shortcut.response), JSON.stringify(apiMock));
			});
	});

});

describe("idFromURL", () => {

	describe("return type", () => {
		it("returns string when valid", () => {
			assert.isString(idFromURL(id));
		});
		it("returns false when invalid", () => {
			assert.isFalse(idFromURL("this is not valid!"));
		});
	});

	describe("input formats", () => {
		it("gets id if input is just id", () => {
			assert.strictEqual(idFromURL(id), id);
		});
		it("gets id if input has http protocol", () => {
			assert.strictEqual(idFromURL("http://icloud.com/shortcuts/" + id), id);
		});
		it("gets id if input has https protocol", () => {
			assert.strictEqual(idFromURL("https://icloud.com/shortcuts/" + id), id);
		});
		it("gets id if input doesn't specify protocol", () => {
			assert.strictEqual(idFromURL("http://icloud.com/shortcuts/" + id), id);
		});
	});
});
