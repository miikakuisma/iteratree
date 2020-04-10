export function bindKeys(keyMap) {
  window.onkeydown = e => {
    keyMap.forEach((shortcut) => {
      if (shortcut.withCmd) {
        if (e.key === shortcut.key && (e.metaKey || e.ctrlKey)) {
          shortcut.fn();
        }
      } else {
        if (e.key === shortcut.key) {
          shortcut.fn();
        }
      }
    });
  }
}
