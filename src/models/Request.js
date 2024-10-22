import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  prompt: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'completed'] },
  public: { type: Boolean, default: false },
  flag: {
    type: String,
    default: 'none',
    enum: ['none', 'inappropriate', 'spam', 'other'],
  },
  parameters: {
    n_samples: Number,
    cfg_scale: Number,
    seed: Number,
    num_inference_steps: Number,
    height: Number,
    width: Number,
    style: String,
  },
  output: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const Request =
  mongoose.models.Request || mongoose.model('Request', requestSchema);

export default Request;
