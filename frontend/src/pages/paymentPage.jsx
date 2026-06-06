import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderById } from "../hook/useOrder";
import { usePayment } from "../hook/usePayment";
import Toast from "../components/toast/toast.jsx";
import { useState } from "react";

export default function PaymentPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const { order, loading: orderLoading, error: orderError } = useGetOrderById(orderId);
    const { verifyPayment, isLoading: paymentLoading} = usePayment(orderId);

    const [selectedMethod, setSelectedMethod] = useState("vnpay");
    const [toast, setToast] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handlePayment = async () => {
        try {
            setProcessing(true);
            await verifyPayment({ orderId, paymentMethod: selectedMethod, amount: order.amount });
            setToast({ message: "Payment successful! Redirecting to your courses...", type: "success" });
            setTimeout(() => navigate(`/courses/${order.courseId._id}`), 2000);
        } catch (err) {
            setToast({ message: err.message || "Payment failed", type: "error" });
        } finally {
            setProcessing(false);
        }
    };

    if (orderLoading || paymentLoading) return (
        <div className="container py-5 text-center">
            <h3>Loading payment information...</h3>
        </div>
    );

    if (orderError) return (
        <div className="container py-5">
            <Toast message={orderError} type="error" onClose={() => setToast(null)} />
        </div>
    );

    if (!order) return (
        <div className="container py-5 text-center">
            <h3>Order not found</h3>
        </div>
    );

    return (
        <div className="container">
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            <div className="row g-4 align-items-start">

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

                        <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div>
                                <h2 className="fw-bold mb-1 text-feature-title">Complete Your Payment</h2>
                                <p className="text-muted mb-0">Secure checkout for your course enrollment</p>
                            </div>

                            <span className={`badge px-3 py-2 rounded-pill fs-6 ${order.status === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="p-4">
                            <div className="d-flex flex-column flex-md-row gap-4">

                                <img
                                    src={order.courseId?.thumbnail || "https://placehold.co/600x400?text=Course"}
                                    alt="course-thumbnail"
                                    className="rounded-4 shadow-sm"
                                    style={{ width: "260px", maxWidth: "100%", objectFit: "cover" }}
                                />

                                <div className="flex-grow-1">

                                    <div className="mb-4">
                                        <h3 className="fw-bold text-subheading mb-2">{order.courseId?.title}</h3>
                                        <p className="text-muted mb-0">Order ID: {order._id}</p>
                                    </div>

                                    <div className="row g-3">

                                        <div className="col-sm-6">
                                            <div className="border rounded-4 p-3 h-100 bg-light-subtle">
                                                <div className="text-muted small mb-1">Course Price</div>
                                                <div className="fw-bold fs-5 text-success">{order.amount.toLocaleString()} VND</div>
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="border rounded-4 p-3 h-100 bg-light-subtle">
                                                <div className="text-muted small mb-1">Payment Method</div>
                                                <div className="fw-semibold text-capitalize">{selectedMethod}</div>
                                            </div>
                                        </div>

                                    </div>

                                    <hr className="my-4" />

                                    <h5 className="fw-bold mb-3">Choose Payment Method</h5>

                                    <div className="d-flex flex-column gap-3">

                                        <label className={`border rounded-4 p-3 d-flex align-items-center gap-3 ${selectedMethod === "vnpay" ? "border-primary bg-primary-subtle" : ""}`}>
                                            <input type="radio" checked={selectedMethod === "vnpay"} onChange={() => setSelectedMethod("vnpay")} />

                                            <div>
                                                <div className="fw-semibold">VNPay</div>
                                                <div className="small text-muted">Vietnamese online payment gateway</div>
                                            </div>
                                        </label>

                                        <label className={`border rounded-4 p-3 d-flex align-items-center gap-3 ${selectedMethod === "momo" ? "border-primary bg-primary-subtle" : ""}`}>
                                            <input type="radio" checked={selectedMethod === "momo"} onChange={() => setSelectedMethod("momo")} />

                                            <div>
                                                <div className="fw-semibold">MoMo</div>
                                                <div className="small text-muted">E-wallet payment</div>
                                            </div>
                                        </label>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 sticky-top">

                        <div className="p-4 border-bottom">
                            <h4 className="fw-bold mb-0">Payment Summary</h4>
                        </div>

                        <div className="p-4">

                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Course Price</span>
                                <span className="fw-semibold">{order.amount.toLocaleString()} VND</span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Discount</span>
                                <span className="fw-semibold text-success">0 VND</span>
                            </div>

                            <div className="d-flex justify-content-between mb-4">
                                <span className="text-muted">Payment Method</span>
                                <span className="fw-semibold text-capitalize">{selectedMethod}</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fw-bold fs-5">Total</span>
                                <span className="fw-bold fs-4 text-success">{order.amount.toLocaleString()} VND</span>
                            </div>

                            <button
                                className="btn btn-primary w-100 py-3 fw-semibold rounded-4"
                                onClick={handlePayment}
                                disabled={processing || order.status === "paid"}
                            >
                                {processing ? "Processing Payment..." : order.status === "paid" ? "Already Paid" : "Pay Now"}
                            </button>

                            <button
                                className="btn btn-light border w-100 py-3 fw-semibold rounded-4 mt-3"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>

                            <div className="mt-4 small text-muted text-center">
                                Your payment is secured and encrypted.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}