var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var axios = require("axios").default;
var express = require("express");
var JSDOM = require("jsdom").JSDOM;
var router = express.Router();
var getKeySafe = function (getFn) {
    try {
        return getFn();
    }
    catch (_a) {
        return null;
    }
};
var fetchSearchResultsFromApi = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, data, items;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                setSearchProgress(10);
                return [4 /*yield*/, fetch("https://youtube-search-results.p.rapidapi.com/youtube-search/?q=".concat(searchStrRef.current), {
                        method: "GET",
                        headers: {
                            "x-rapidapi-host": "youtube-search-results.p.rapidapi.com",
                            "x-rapidapi-key": process.env.RAPID_API_KEY,
                        },
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    console.log("error fetching search results:");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                console.log(JSON.stringify(data));
                items = data.items.filter(function (item) { return item.type === "video"; });
                setSearchResults(items);
                return [2 /*return*/];
        }
    });
}); };
var scrapeSearch = function (query) { return __awaiter(_this, void 0, void 0, function () {
    var ytInitialData, data, doc, scripts, ytDataScript, contents, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ytInitialData = null;
                return [4 /*yield*/, axios.get(encodeURI("https://www.youtube.com/results?search_query=".concat(query)))];
            case 1:
                data = (_a.sent()).data;
                doc = new JSDOM(data).window.document;
                scripts = doc.querySelectorAll("script");
                if (scripts[33].textContent.includes("var ytInitialData")) {
                    ytDataScript = scripts[33].textContent;
                }
                else {
                    console.log("script moved from index 33, searching manually..");
                    scripts.forEach(function (s) {
                        if (s.textContent.includes("var ytInitialData")) {
                            ytDataScript = s.textContent;
                            return;
                        }
                    });
                }
                try {
                    ytInitialData = JSON.parse(ytDataScript.substring(20, ytDataScript.length - 1));
                }
                catch (_b) {
                    return [2 /*return*/, null];
                }
                contents = getKeySafe(function () {
                    return ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents
                        .sectionListRenderer.contents[0].itemSectionRenderer;
                }).contents;
                results = contents
                    .filter(function (v) {
                    return "videoRenderer" in v &&
                        getKeySafe(function () {
                            return v.videoRenderer.ownerBadges[0].metadataBadgeRenderer.icon.iconType;
                        }) === "OFFICIAL_ARTIST_BADGE";
                })
                    .map(function (v) {
                    var vid = v.videoRenderer;
                    return {
                        id: vid.videoId,
                        title: vid.title.runs[0].text,
                        artist: {
                            title: vid.ownerText.runs[0].text,
                            imgs: vid.channelThumbnailSupportedRenderers
                                .channelThumbnailWithLinkRenderer.thumbnail.thumbnails,
                        },
                        imgs: vid.thumbnail.thumbnails,
                    };
                });
                return [2 /*return*/, results];
        }
    });
}); };
router.get("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var q, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                q = req.query.q;
                return [4 /*yield*/, scrapeSearch(q)];
            case 1:
                results = _a.sent();
                // const results = await youtube(q);
                res.send(results);
                return [2 /*return*/];
        }
    });
}); });
module.exports = router;
