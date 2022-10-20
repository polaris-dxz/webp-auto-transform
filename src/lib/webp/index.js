import EventEmitter from 'eventemitter3';
import createWebp from './createWebp';
import removeWebp from './removeWebp';

export const CreateWebpEventName = 'create-webp';
export const RemoveWebpEventName = 'remove-webp';

function WebpInit(options) {
  const event = new EventEmitter();

  event.on(CreateWebpEventName, createWebp, { options });
  event.on(RemoveWebpEventName, removeWebp, { options });

  return event;
}

export default WebpInit;
