/* Allows for an error to be thrown during validation to short circuit validation
 * if the field can be skipped
 */
module.exports = class SkipField extends Error {};
