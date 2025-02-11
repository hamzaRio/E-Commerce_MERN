"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userServices_1 = require("../services/userServices");
const route = express_1.default.Router();
route.post('/register', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstname, lastname } = request.body;
    const { statusCode, data } = yield (0, userServices_1.register)({ email, password, firstname, lastname });
    response.status(statusCode).send(data);
}));
route.post('/login', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    const { statusCode, data } = yield (0, userServices_1.login)({ email, password });
    response.status(statusCode).send(data);
}));
exports.default = route;
