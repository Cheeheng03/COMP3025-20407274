import React from "react";

const steps = [
    "Extracting Wallet On-chain Features",
    "Sign Transaction to Calculate Credit Score and Store on-Chain",
    "Running Chainlink Node and Aggregating Results (This may take a while)",
    "Fetching Credit Score from On-Chain and Displaying in Gauge"
];

const LoadingDialog = ({ open, currentStep }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-8 text-center">Processing Credit Score</h2>
                <ol className="space-y-6">
                    {steps.map((label, idx) => (
                        <li key={idx} className="flex items-center">
                            <span
                                className={`flex-shrink-0 flex items-center justify-center min-w-[3rem] w-12 h-12 rounded-full mr-6 text-2xl font-bold
                                    ${currentStep === idx + 1
                                        ? 'bg-blue-500 text-white animate-pulse'
                                        : currentStep > idx + 1
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-300 text-gray-600'
                                    }`
                                }
                                style={{ lineHeight: '3rem' }}
                            >
                                {idx + 1}
                            </span>
                            <span className={`flex-1 text-left ${currentStep === idx + 1 ? "font-semibold" : ""} text-base md:text-lg break-words`}
                                    style={{wordBreak: 'break-word'}}>
                                {label}
                            </span>
                        </li>
                    ))}
                </ol>
                <p className="text-center text-gray-500 mt-8 text-base">Please wait, do not close or refresh the page.</p>
            </div>
        </div>
    );
};

export default LoadingDialog; 