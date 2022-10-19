const EventEmitter = require("eventemitter3");
const createWebp = require("./createWebp");
const removeWebp = require("./removeWebp");

const Event = new EventEmitter();

Event.on("create-webp", createWebp);
Event.on("remove-webp", removeWebp);
