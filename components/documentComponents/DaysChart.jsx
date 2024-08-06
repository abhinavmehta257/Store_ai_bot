import React, {useEffect, useRef, useState} from 'react';
import ReactECharts from 'echarts-for-react';

const DaysChart = ({data}) => {
    const chartRef = useRef(null);
    const [url,
        SetUrl] = useState("");

    data.sort((a, b) => b.value - a.value);

    const colors = [
        '#36ebc3', // Darkest green
        '#66edd0',
        '#80efd9',
        '#99f2e1',
        '#b3f4e8',
        '#ccf7f0',
        '#e6faf8' // Lightest green
    ];

    data.forEach((item, index) => {
        item.itemStyle = {
            color: colors[index]
        };
    });

    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'top',
            itemGap: 8,
            itemWidth: 24,
            itemHeight: 12,
            textStyle: {
                fontSize: 12,
                color: 'white'
            },
            formatter: function (name) {
                let value = data
                    .find(item => item.name === name)
                    .value;
                return `${name} (${value})`;
            }
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '100%',
                center: [
                    '75%', '50%'
                ],
                label: {
                    show: false
                },
                data: data
            }
        ]
    };

    const handleDownload = () => {
        const echartsInstance = chartRef
            .current
            .getEchartsInstance();
        const url = echartsInstance.getDataURL({type: 'png', pixelRatio: 2, backgroundColor: 'transparent'});
        SetUrl(url)
        // const a = document.createElement('a'); a.href = url; a.download =
        // 'chart.png'; a.click();

    };

    useEffect(() => {
        handleDownload();
    }, []);

    return (
        <div
            class="w-[492px] h-[242px] bg-[#3F6E8C] rounded-[8px] mt-[32px] bg-[#3f6e8c] rounded-[8px] p-[24px]">
            <div class="text-white text-base font-semibold font-['Inter']">What day do you message ?</div>
            <div className="mt-[16px]">
                <ReactECharts
                    ref={chartRef}
                    option={option}
                    style={{
                    height: "145px"
                }}/>
                <img src={url} alt="" className='relative top-[-145px]'/> {/* <button onClick={handleDownload}>Download PNG</button> */}
            </div>
        </div>

    );
};

export default DaysChart;
