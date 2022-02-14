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
var express = require("express");
var router = express.Router();
var _a = require("../models/index.js"), Playlist = _a.Playlist, Song = _a.Song;
router.post("/create", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var playlist, savedPlaylist, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, new Playlist({
                        name: req.body.name,
                        createdBy: req.user._id,
                    }).save()];
            case 1:
                playlist = _a.sent();
                return [4 /*yield*/, playlist.save()];
            case 2:
                savedPlaylist = _a.sent();
                res.json(savedPlaylist);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                res.status(500).json({ message: "internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/addsong", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var song, playlist, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("adding song to playlist");
                console.log(req.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, Song.findOne({ src: req.body.songId })];
            case 2:
                song = _a.sent();
                if (!song) {
                    res.status(404).json({ message: "song does not exists" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Playlist.findOne({ _id: req.body.playlistId })];
            case 3:
                playlist = _a.sent();
                if (!playlist) {
                    res.status(404).json({ message: "playlist does not exists" });
                    return [2 /*return*/];
                }
                if (playlist.songs.includes(song._id)) {
                    res
                        .status(400)
                        .json({ message: "song already exists in playlist ".concat(playlist.name) });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, playlist.songs.push(song._id)];
            case 4:
                _a.sent();
                return [4 /*yield*/, playlist.save()];
            case 5:
                _a.sent();
                res.status(200).json(playlist);
                return [3 /*break*/, 7];
            case 6:
                e_2 = _a.sent();
                console.log(e_2);
                res.status(500).json({ message: "internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get("/all", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var playlists, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(req.user._id);
                return [4 /*yield*/, Playlist.find({ createdBy: req.user._id })];
            case 1:
                playlists = _a.sent();
                res.send(playlists);
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                res.status(500).json({ message: "internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var playlist, songs, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Playlist.findOne({ _id: req.params.id })];
            case 1:
                playlist = _a.sent();
                if (!playlist) {
                    res.status(404).json({ message: "not found" });
                }
                return [4 /*yield*/, playlist.populate("songs")];
            case 2:
                songs = _a.sent();
                res.status(200).json(songs);
                return [3 /*break*/, 4];
            case 3:
                e_4 = _a.sent();
                console.log(e_4);
                res.status(500).json({ message: "internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
