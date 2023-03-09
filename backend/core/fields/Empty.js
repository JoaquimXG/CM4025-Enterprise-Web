// Used to represent empty values for fields.
// Required as null can be a valid value and trusting undefined is a fools game.
// This is also inspired by DRF
module.exports = class Empty {};
