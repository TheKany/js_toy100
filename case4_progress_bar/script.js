(function () {
  'use strict';

  const get = (target) => {
    return document.querySelector(target);
  };

  let timerId;

  /* throttle 활용 해보기 */
  const throttle = (callback, time) => {
    if (timerId) return;

    timerId = setTimeout(() => {
      callback();
      timerId = undefined;
    }, time);
  };

  const $progressBar = get('.progress-bar');

  const onScroll = () => {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrollTop = document.documentElement.scrollTop;

    const width = (scrollTop / height) * 100;
    $progressBar.style.width = `${width}%`;
  };

  window.addEventListener('scroll', () => onScroll());
  /* throttle 사용시 */
  // window.addEventListener('scroll', () => throttle(onScroll, 1000));
})();
