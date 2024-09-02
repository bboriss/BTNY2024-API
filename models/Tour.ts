import mongoose, { Schema, Document } from 'mongoose';

interface ILocation {
  type: string;
  coordinates: number[];
}

export interface ITour extends Document {
  tripduration: number;
  startStationId: number;
  startStationName: string;
  endStationId: number;
  endStationName: string;
  bikeid: number;
  usertype: string;
  birthYear: number;
  startStationLocation: ILocation;
  endStationLocation: ILocation;
  startTime: Date;
  stopTime: Date;
}

const LocationSchema: Schema = new Schema({
  type: { type: String, required: true },
  coordinates: { type: [Number], required: true },
});

const TourSchema: Schema = new Schema({
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

export default mongoose.model<ITour>('Tour', TourSchema, 'trips');
