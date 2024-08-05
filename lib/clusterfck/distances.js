export const euclidean = (v1, v2) => {
  var total = 0;
  for (var i = 0; i < v1.length; i++) {
    total += Math.pow(v2[i] - v1[i], 2);
  }
  return Math.sqrt(total);
};

export const manhattan = (v1, v2) => {
  var total = 0;
  for (var i = 0; i < v1.length; i++) {
    total += Math.abs(v2[i] - v1[i]);
  }
  return total;
};

export const max = (v1, v2) => {
  var max = 0;
  for (var i = 0; i < v1.length; i++) {
    max = Math.max(max, Math.abs(v2[i] - v1[i]));
  }
  return max;
};

export const distances = {
  euclidean,
  manhattan,
  max,
};
