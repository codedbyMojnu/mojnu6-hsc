export default function playSound(src, volume = 1) {
  const sound = new Audio(src);
  sound.volume = volume;
  sound.play();
}
