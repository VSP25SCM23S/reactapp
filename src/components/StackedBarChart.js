import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Refer the high charts "https://github.com/highcharts/highcharts-react" for more information

const StackedBarChart = (props) => {
	const config = {
		chart: {
			type: "column",
		},
		title: {
			text: props.title,
		},
		xAxis: {
			type: "category",
			labels: {
				rotation: -45,
				style: {
					fontSize: "13px",
					fontFamily: "Verdana, sans-serif",
				},
			},
		},
		yAxis: {
			min: 0,
			title: {
				text: props.text,
			},
		},
		legend: {
			enabled: true,
			reversed: true,
		},
		tooltip: {
			pointFormat: `${props.text}: <b>{point.y} </b>`,
		},
		plotOptions: {
			column: {
				stacking: "normal",
				dataLabels: {
					enabled: true,
				},
			},
		},
		series: [
			{
				name: props.totalIssueText,
				data: props.data,
				dataLabels: {
					enabled: true,
					rotation: -90,
					color: "#FFFFFF",
					align: "right",
					format: "{point.y}", // one decimal
					y: 2, // 2 pixels down from the top
					style: {
						fontSize: "10px",
						fontFamily: "Verdana, sans-serif",
					},
				},
			},
			{
				name: props.closedIssueText,
				data: props.closedIssueData,
				dataLabels: {
					enabled: true,
					rotation: -90,
					color: "#FFFFFF",
					align: "right",
					format: "{point.y}", // one decimal
					y: 2, // 2 pixels down from the top
					style: {
						fontSize: "10px",
						fontFamily: "Verdana, sans-serif",
					},
				},
			},
		],
	};
	return (
		<div>
			<div>
				<HighchartsReact
					highcharts={Highcharts}
					options={config}
				></HighchartsReact>
			</div>
		</div>
	);
};

export default StackedBarChart;
