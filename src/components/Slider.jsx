function Slider({ value, handleInput, max, min, step }) {
  return (
    <input
      onInput={handleInput}
      type="range"
      value={value}
      max={max}
      min={min}
      step={step}
    />
  );
}

export default Slider;