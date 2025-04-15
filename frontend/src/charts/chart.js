import React, { useEffect, useRef } from 'react';
import candleData from '../testdata/candleData'
import { createChart, CrosshairMode } from 'lightweight-charts';

const StockChart = () => {
    const chartContainerRef = useRef();
    const chart = useRef();
    const resizeObserver = useRef();

    useEffect(() => {
        chart.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: {
                background: { color: 'rgb(31, 41, 55)' }, 
                textColor: '#FFFFFF', 
            },
            grid: {
                vertLines: {
                    color: 'rgba(255, 255, 255, 0.1)', 
                },
                horzLines: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            priceScale: {
                borderColor: 'rgba(255, 255, 255, 0.2)', 
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.2)', 
                rightOffset: 0,
                fixRightEdge: true, 
                barSpacing: 15,  
            },
        });

        const candleSeries = chart.current.addCandlestickSeries({
            upColor: '#4CAF50', 
            downColor: '#FF5252',
            borderDownColor: '#FF5252',
            borderUpColor: '#4CAF50',
            wickDownColor: '#FF5252',
            wickUpColor: '#4CAF50',
        });

        
        candleSeries.setData(candleData);

        const handleResize = () => {
            chart.current.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        resizeObserver.current = new ResizeObserver(handleResize);
        resizeObserver.current.observe(chartContainerRef.current);

        return () => {
            chart.current.remove();
            resizeObserver.current.disconnect();
        };
    }, []);

    return <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />;
};

export default StockChart;
