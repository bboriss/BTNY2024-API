const { Schema, model } = require('mongoose');

const LocationSchema = new Schema({
  type: { type: String, required: true },
  coordinates: { type: [Number], required: true },
});

const TourSchema = new Schema({
  tripduration: { type: Number, required: true },
  startStationId: { type: Number, required: true },
  startStationName: { type: String, required: true },
  endStationId: { type: Number, required: true },
  endStationName: { type: String, required: true },
  bikeid: { type: Number, required: true },
  usertype: { type: String, required: true },
  birthYear: { type: Number, required: true },
  startStationLocation: { type: LocationSchema, required: true },
  endStationLocation: { type: LocationSchema, required: true },
  startTime: { type: Date, required: true },
  stopTime: { type: Date, required: true },
});

const Tour = model('Tour', TourSchema, 'trips');

module.exports = Tour;
