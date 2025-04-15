import React from 'react';
import GaugeComponent from 'react-gauge-component';


const FicoGauge = ({ score }) => (
    <GaugeComponent
        value={score}
        type="radial"
        minValue={300}
        maxValue={850}
        style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
        labels={{
        // 1) Outer tick labels for each boundary
            tickLabels: {
                type: "outer",
                ticks: [
                {
                    value: 300,
                    valueConfig: {
                    formatTextValue: () => "300", // Show numeric + label
                    style: { fontSize: "14px", fill: "#fff" }
                    }
                },
                {
                    value: 579,
                    valueConfig: {
                    formatTextValue: () => "579",
                    style: { fontSize: "14px", fill: "#fff" }
                    }
                },
                {
                    value: 669,
                    valueConfig: {
                    formatTextValue: () => "669",
                    style: { fontSize: "14px", fill: "#fff" }
                    }
                },
                {
                    value: 739,
                    valueConfig: {
                    formatTextValue: () => "739",
                    style: { fontSize: "14px", fill: "#fff" }
                    }
                },
                {
                    value: 799,
                    valueConfig: {
                    formatTextValue: () => "799",
                    style: { fontSize: "14px", fill: "#fff" }
                    }
                },
                {
                    value: 850,
                    valueConfig: {
                    formatTextValue: () => "850",
                    style: { fontSize: "14px", fill: "#fff" }
                    }
                }
                ]
            },
            // 2) Center value label to show numeric score + label
            valueLabel: {
                formatTextValue: (val) => {
                return `${val}`;
                },
                style: {
                fontSize: "30px",
                fill: "#fff",
                textShadow: "1px 1px 2px #000",
                textAnchor: "middle"
                }
            }
            }}
            arc={{
            // Colors for each subArc range
            colorArray: ["#E5515E", "#E7612F", "#FCF10B", "#18FD05", "#3862F1"],
            // Fully override the default subArcs with explicit limits
            subArcs: [
                { limit: 579 }, // Poor
                { limit: 669 }, // Fair
                { limit: 739 }, // Good
                { limit: 799 }, // Very Good
                { limit: 850 }  // Exceptional
            ],
                padding: 0.02,
                width: 0.3
            }}
            pointer={{
                elastic: true,
                animationDelay: 0,
                length: 0.85,
            }}
    />
);

export default FicoGauge;
