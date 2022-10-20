import EventEmitter from "eventemitter3";
import createWebp from "./createWebp";
import removeWebp from "./removeWebp";

const Event = new EventEmitter();

Event.on("create-webp", createWebp);
Event.on("remove-webp", removeWebp);
