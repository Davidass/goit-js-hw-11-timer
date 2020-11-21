const refs = {
  days: document.querySelector('span[data-value="days"]'),
  hours: document.querySelector('span[data-value="hours"]'),
  mins: document.querySelector('span[data-value="mins"]'),
  secs: document.querySelector('span[data-value="secs"]'),

  clockface: document.querySelector('.js-clockface'),

  btnStart: document.querySelector('.btn[data-active="start"]'),
  btnStop: document.querySelector('.btn[data-active="stop"]'),
};

class CountdownTimer {
  constructor({ selector, targetDate, onTimer }) {
    this.intervalId = null;
    this.selector = document.querySelector(selector);
    this.isActive = false;
    this.targetDate = targetDate;
    this.onTimer = onTimer;
    this.init();
  }

  init() {
    const time = this.updateClockface(0);
    this.onTimer(time);
  }

  start() {
    if (this.isActive) {
      return;
    }

    const startTime = this.targetDate;
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = startTime - currentTime;
      const time = this.updateClockface(deltaTime);

      this.onTimer(time);
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
    const time = this.updateClockface(0);
    this.onTimer(time);
  }

  updateClockface(time) {
    /*
     * Оставшиеся дни: делим значение UTC на 1000 * 60 * 60 * 24, количество
     * миллисекунд в одном дне (миллисекунды * секунды * минуты * часы)
     */
    const days = this.pad(Math.floor(time / (1000 * 60 * 60 * 24)));

    /*
     * Оставшиеся часы: получаем остаток от предыдущего расчета с помощью оператора
     * остатка % и делим его на количество миллисекунд в одном часе
     * (1000 * 60 * 60 = миллисекунды * минуты * секунды)
     */
    const hours = this.pad(
      Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    );

    /*
     * Оставшиеся минуты: получаем оставшиеся минуты и делим их на количество
     * миллисекунд в одной минуте (1000 * 60 = миллисекунды * секунды)
     */
    const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));

    /*
     * Оставшиеся секунды: получаем оставшиеся секунды и делим их на количество
     * миллисекунд в одной секунде (1000)
     */
    const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

    return { days, hours, mins, secs };
  }

  // eslint-disable-next-line class-methods-use-this
  pad(value) {
    return String(value).padStart(2, '0');
  }
}

function showClockFace({ days, hours, mins, secs }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.mins.textContent = `${mins}`;
  refs.secs.textContent = `${secs}`;
}

const timer = new CountdownTimer({
  selector: '#timer-1',
  targetDate: new Date(2021, 0, 1, 0, 0),
  onTimer: showClockFace,
});

refs.btnStart.addEventListener('click', timer.start.bind(timer));
refs.btnStop.addEventListener('click', timer.stop.bind(timer));
