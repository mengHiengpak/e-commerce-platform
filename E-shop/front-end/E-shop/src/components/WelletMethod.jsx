import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { FaArrowLeft, FaMoneyBill, FaCheckCircle } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { useBakong } from "./hook/bakong/useBakong.js";
import { useBakongPayment } from "./hook/bakong/useBakongPayment.js";
import useCurrent from "./hook/Auth/useCurrent.js";
import toast from "react-hot-toast";

function Field({ icon: Icon, label, placeholder, ...props }) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
                {label}
            </label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Icon className="h-4 w-4" />
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    {...props}
                />
            </div>
        </div>
    );
}

function WelletMethod({ price = 0 }) {
    const { data: customer, isLoading } = useCurrent()
    const { generateQr, qrData, loading: qrLoading } = useBakong()
    const { verifyPayment, loading: verifyLoading } = useBakongPayment()

    const amount = price > 0 ? price : 0
    const [entered, setEntered] = useState('')
    const [confirmed, setConfirmed] = useState(false)
    const [waiting, setWaiting] = useState(false)
    const [error, setError] = useState('')
    const pollingRef = useRef(null)

    const topUp = Number(entered || amount || 0)

    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current)
            pollingRef.current = null
        }
        setWaiting(false)
    }

    useEffect(() => {
        if (!customer || !topUp) {
            setError('')
            return
        }
        stopPolling()
        setConfirmed(false)
        setError('')
        ;(async () => {
            const result = await generateQr(customer._id, { amount: topUp })
            if (!result?.qr_code) {
                setError('Failed to generate the QR code. Please check the amount and try again.')
            }
        })()
        // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, [customer, topUp])

    const confirmPayment = async (silent = false) => {
        if (!customer || !qrData?.qr_md5) return null
        return verifyPayment(customer._id, { qr_md5: qrData.qr_md5 }, { silent })
    }

    useEffect(() => {
        if (!customer || !qrData?.qr_md5 || confirmed) return

        setWaiting(true)
        let attempts = 0
        pollingRef.current = setInterval(async () => {
            attempts += 1
            const result = await confirmPayment(true)
            if (result?.success) {
                stopPolling()
                setConfirmed(true)
                toast.success(result?.message || 'Wallet topped up successfully!')
            } else if (attempts >= 20) {
                stopPolling()
                toast.error('Payment not detected. Please scan the QR and try again.')
            }
        }, 5000)

        return stopPolling
        // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, [customer, qrData, confirmed])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!customer) {
            toast.error('Please sign in as a customer first.')
            return
        }
        if (!topUp) {
            toast.error('Please enter an amount greater than 0.')
            return
        }
        if (!qrData?.qr_md5) {
            const generated = await generateQr(customer._id, { amount: topUp })
            if (!generated?.qr_md5) return
        }
        const result = await confirmPayment()
        if (result?.success) {
            stopPolling()
            setConfirmed(true)
        }
    }

    const showQr = !qrLoading && !!qrData?.qr_code

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <Link
                    to={`/account`}
                    className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                    <FaArrowLeft className="h-3.5 w-3.5" />
                    Back to account
                </Link>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                            Payment QR
                        </h2>
                        {customer ? (
                            <p className="mt-1 text-xs text-slate-400">
                                Signed in as {customer.name || customer.phone || customer.email || customer._id}
                            </p>
                        ) : !isLoading ? (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                You are not signed in. <Link to="/signin" className="underline">Sign in</Link> as a customer first.
                            </p>
                        ) : null}
                        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
                            {qrLoading ? (
                                <p className="text-sm text-slate-400">Generating QR...</p>
                            ) : confirmed ? (
                                <div className="flex flex-col items-center gap-3 py-6 text-center">
                                    <FaCheckCircle className="h-12 w-12 text-emerald-500" />
                                    <p className="text-sm font-semibold text-slate-700">Payment confirmed, wallet topped up!</p>
                                </div>
                            ) : showQr ? (
                                <>
                                    <QRCodeSVG
                                        value={qrData.qr_code}
                                        size={192}
                                        level="H"
                                        className="h-48 w-48 rounded-xl border border-slate-200 bg-white object-contain"
                                    />
                                    <p className="text-xs font-medium text-slate-500">Scan to top up your wallet</p>
                                    {waiting && (
                                        <p className="text-xs text-slate-400">Waiting for payment confirmation...</p>
                                    )}
                                </>
                            ) : isLoading ? (
                                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                    Loading...
                                </span>
                            ) : (
                                <>
                                    <div className="grid aspect-square w-48 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                                        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Scan to pay
                                        </span>
                                    </div>
                                    {error ? (
                                        <p className="text-xs font-medium text-red-500">{error}</p>
                                    ) : !customer && !isLoading ? (
                                        <p className="text-xs text-slate-400">Sign in to generate your QR code.</p>
                                    ) : topUp > 0 ? (
                                        <p className="text-xs text-slate-400">No QR available — please try again.</p>
                                    ) : (
                                        <p className="text-xs text-center text-slate-400">Enter an amount above to generate your QR code.</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h1 className="text-lg font-bold text-slate-900">Add to wallet</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Top up your wallet to cover this payment.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            <Field
                                icon={FaMoneyBill}
                                label="Amount"
                                name="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                required
                                autoFocus
                                placeholder={amount > 0 ? `${amount} $` : 'Enter amount'}
                                value={entered}
                                onChange={(e) => setEntered(e.target.value)}
                            />

                            <div className="border-t border-gray-200" />

                            <button
                                type="submit"
                                disabled={qrLoading || verifyLoading || waiting || !customer}
                                className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {qrLoading || verifyLoading || waiting ? 'Processing...' : `Add to wallet $${topUp.toFixed(2)}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelletMethod;