import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            index: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: ["vnpay", "momo", "stripe", "paypal"],
            default: "vnpay"
        },

        status: {
            type: String,
            enum: ["pending", "paid", "failed", "cancelled"],
            default: "pending",
            index: true
        },

        transactionId: {
            type: String,
            default: null
        },

        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

orderSchema.index(
    { studentId: 1, courseId: 1, status: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: "paid"
        }
    }
);
orderSchema.index(
  { studentId: 1, courseId: 1 },
  { unique: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;