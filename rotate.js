const container = document.getElementById("container");
const cube = document.getElementById("cube");
let prevX;
let prevY;
let diffX = 0;
let diffY = 0;
// let prevRotateY = 0;
// let prevRotateX = 0;
// let prevRotateZ = 0;
let cubeRotate = [
  { transform: "rotateY(0) rotateX(720deg) rotateZ(0)" },
  { transform: "rotateY(360deg) rotateX(0) rotateZ(360deg)" },
];
let timer;

const animation = cube.animate(cubeRotate, {
  // timing options
  duration: 10 * 1000,
  iterations: Infinity,
});

// disable d&d
container.addEventListener("ondragover ondragstart", () => false);

// on grabbing
cube.addEventListener("mousedown", () => {
  cube.classList.remove("grab");
  container.classList.add("grabbing");
  clearTimeout(timer);
  // animation.commitStyles();
  animation.cancel();

  // prevRotateY = /(?<=rotateY\().*?(?=deg\))/.exec(cube.style.transform);
  // prevRotateX = /(?<=rotateX\().*?(?=deg\))/.exec(cube.style.transform);
  // prevRotateZ = /(?<=rotateZ\().*?(?=deg\))/.exec(cube.style.transform);
});

// function of delete grabbing
const deleteGrabbing = debounce(() => {
  if (container.classList.contains("grabbing")) {
    cube.classList.add("grab");
    container.classList.remove("grabbing");
    timer = setTimeout(() => {
      animation.play();
    }, 2000);
  }
}, 50);

// off grabbing
cube.addEventListener("mouseup", deleteGrabbing);

// off grabbing out cube
window.addEventListener("mouseup", () => {
  if (container.classList.contains("grabbing")) {
    const x = event.clientX;
    const y = event.clientY;

    prevX = x + diffX;
    prevY = y + diffY;
  }
});
window.addEventListener("mouseup", deleteGrabbing);

window.addEventListener(
  "mousemove",
  debounce((event) => {
    if (container.classList.contains("grabbing")) {
      let x = event.clientX,
        y = event.clientY,
        cubeCenterX = cube.offsetLeft + cube.offsetWidth / 2,
        cubeCenterY = cube.offsetTop + cube.offsetHeight / 2;

      if (prevX) {
        diffX = prevX - x;
        prevX = null;
      }
      const rotateX = x - cubeCenterX + diffX;

      if (prevY) {
        diffY = prevY - y;
        prevY = null;
      }
      const rotateY = y - cubeCenterY + diffY;

      cube.style = `transform: rotateY(${rotateX}deg) rotateX(${-rotateY}deg);`;
    }
  }),
  50
);

function debounce(func, ms) {
  let callAllowed = true;

  return function () {
    if (!callAllowed) {
      return;
    }

    func.apply(this, arguments);

    callAllowed = false;

    setTimeout(() => {
      callAllowed = true;
    }, ms);
  };
}
