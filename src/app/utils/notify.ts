const notifier = require('node-notifier');

/**
 * fires a notification with given messsage
 * @param message
 */
export function notify(title: string, message: string) {
  notifier.notify({
    title: title,
    message: message,
    wait: false,
  });
}
