function generateLight(type) {
  return function ({ color, intensity }) {
    return new type(color, intensity);
  };
}

export default {
  generateLight,
};
