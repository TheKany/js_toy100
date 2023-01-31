(function () {
  'use strict';

  const get = (target) => {
    return document.querySelector(target);
  };

  const getAll = (target) => {
    return document.querySelectorAll(target);
  };

  const keys = Array.from(getAll('.key'));

  const soundsRoot = 'assets/sounds/';
  const drumSounds = [
    { key: 81, sound: 'clap.wav' },
    { key: 87, sound: 'crash.wav' },
    { key: 69, sound: 'hihat.wav' },
    { key: 65, sound: 'kick.wav' },
    { key: 83, sound: 'openhat.wav' },
    { key: 68, sound: 'ride.wav' },
    { key: 90, sound: 'shaker.wav' },
    { key: 88, sound: 'snare.wav' },
    { key: 67, sound: 'tom.wav' },
  ];

  const getAudioElement = (idx) => {
    const audio = document.createElement('audio');
    audio.dataset.key = drumSounds[idx].key;
    audio.src = soundsRoot + drumSounds[idx].sound;
    return audio;
  };

  const playSound = (keycode) => {
    const $audio = get(`audio[data-key="${keycode}"]`);
    const $key = get(`div[data-key="${keycode}"]`);

    if ($audio && $key) {
      $key.classList.add('playing');
      $audio.currnetTime = 0;
      $audio.play();
    }
  };

  const onKeyDown = (e) => {
    playSound(e.keyCode);
  };

  const onMouseDown = (e) => {
    const keyCode = e.target.getAttribute('data-key');
    playSound(keyCode);
  };

  const onTransitionEnd = (e) => {
    if (e.propertyName === 'transform') {
      e.target.classList.remove('playing');
    }
  };

  const init = () => {
    window.addEventListener('keydown', onKeyDown);
    keys.forEach((key, idx) => {
      const audio = getAudioElement(idx);
      key.appendChild(audio);
      key.dataset.key = drumSounds[idx].key;
      key.addEventListener('click', onMouseDown);
      key.addEventListener('transitionend', onTransitionEnd);
    });
  };

  init();
})();
