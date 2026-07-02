import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    certificateNumber: {
        type: String,
        required: true,
        unique: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    verificationCode: {
        type: String,
        required: true,
        unique: true
    },
    pdfUrl: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['VALID', 'REVOKED'],
        default: 'VALID'
    }
}, {
    timestamps: true
});

certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
