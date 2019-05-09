export default class Slider {
  constructor() {
    this.slider = document.createElement('div');
    this.slider.classList.add('slider');
    this.slider.innerHTML = `
      <div class="container-slide"></div>
      <div class="container-points"></div>
    `;

    document.body.appendChild(this.slider);

    this.containerSlide = document.querySelector('.container-slide');
    this.containerPoints = document.querySelector('.container-points');

    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.followingMouse = this.followingMouse.bind(this);
    this.moveSlide = this.moveSlide.bind(this);
    this.startFollowingX = 0;
    this.indexActiveSlide = 0;
    this.createPoints();

    this.slider.addEventListener('mousedown', this.dragStart);
    this.slider.addEventListener('touchstart', this.dragStart);
  }

  dragStart(event) {
    document.removeEventListener('mouseup', this.dragEnd);
    document.removeEventListener('touchend', this.dragEnd);

    this.startPosXContainer = this.containerSlide.getBoundingClientRect().left;
    this.startPosXContainer -= this.slider.getBoundingClientRect().left;

    if (event.target.classList.contains('slider-point')) {
      let x = +event.target.dataset.slideIndex - this.indexActiveSlide;
      this.indexActiveSlide = x + this.indexActiveSlide;
      x = x * this.containerSlide.offsetWidth - this.startPosXContainer;

      this.moveSlide(x * -1);
      this.createPoints();
      return;
    }

    if (event.target.classList.contains('container-points')) return;

    document.addEventListener('mouseup', this.dragEnd);
    document.addEventListener('touchend', this.dragEnd);

    this.startFollowingX = event.pageX || event.changedTouches[0].pageX;
    this.shiftX = this.startFollowingX - this.containerSlide.getBoundingClientRect().left;

    this.containerSlide.classList.add('no-transition');
    this.slider.addEventListener('mousemove', this.followingMouse);
    this.slider.addEventListener('touchmove', this.followingMouse);
  }

  dragEnd(event) {
    this.containerSlide.classList.remove('no-transition');
    this.slider.removeEventListener('mousemove', this.followingMouse);
    this.slider.removeEventListener('touchmove', this.followingMouse);

    setTimeout(() => {
      const x = (event.pageX || event.changedTouches[0].pageX);

      if (Math.abs(x - this.startFollowingX) >= this.containerSlide.offsetWidth / 5
      && this.startFollowingX >= this.startPosXContainer + this.containerSlide.offsetWidth / 5) {
        if (x > this.startFollowingX) {
          let posX = this.startPosXContainer + this.containerSlide.offsetWidth;
          if (posX > 0) posX = 0;

          if (this.indexActiveSlide > 0) this.indexActiveSlide -= 1;

          this.moveSlide(posX);
        } else {
          this.indexActiveSlide += 1;

          this.moveSlide(this.startPosXContainer - this.containerSlide.offsetWidth);
        }

        this.createPoints();
      } else {
        this.moveSlide(this.startPosXContainer);
      }

      this.startFollowingX = 0;
    }, 0);
  }

  followingMouse(event) {
    let x = (event.pageX || event.changedTouches[0].pageX);
    x -= (this.slider.getBoundingClientRect().left + this.shiftX);
    this.moveSlide(x);
  }

  moveSlide(x) {
    this.containerSlide.style.left = `${x}px`;
  }

  createPoints() {
    this.containerPoints.innerHTML = '';

    if (this.indexActiveSlide > 1) this.containerPoints.innerHTML += `<div class="slider-point" data-slide-index=${this.indexActiveSlide - 2}>${this.indexActiveSlide - 2}</div>`;
    if (this.indexActiveSlide > 0) this.containerPoints.innerHTML += `<div class="slider-point" data-slide-index=${this.indexActiveSlide - 1}>${this.indexActiveSlide - 1}</div>`;

    this.containerPoints.innerHTML += `
      <div class="slider-point slider-point_active" data-slide-index=${this.indexActiveSlide}>${this.indexActiveSlide}</div>
      <div class="slider-point" data-slide-index=${this.indexActiveSlide + 1}>${this.indexActiveSlide + 1}</div>
    `;
  }
}
