module.exports = (val, fallback) => {
  // Return true if val is a truthy string, e.g. true, TRUE, True
  if (typeof val !== 'string') return fallback;

  return ['true', 'y', '1'].includes(val)
}