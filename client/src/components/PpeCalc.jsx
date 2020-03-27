import React from 'react';
import styles from './PpeCalc.module.scss';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';

import {  InputBase, Typography, ListItemAvatar, Avatar, ListSubheader, Fab, Tooltip, IconButton, ButtonBase } from '@material-ui/core';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function PpeCalc() {
	const [ modelInputs, setModelInputs ] = React.useState({
		numChws: 1500,
		numHouseholds: 200000,
		hhPerChw: 135,

		// Assumptions
		hhVisitsPerChwPerMonth: 2,
		ppeUsageTimes: 4,
		costPerPpe: 10,
	});

	const [ showAssumptions, setShowAssumptions ] = React.useState(false)

	const [ modelOutput, setModelOutput ] = React.useState({ list: [] })

	const updateModelOutput = () => {
		const output = {};
		const timeRange = [ 1, 3, 6, 9, 12 ];

		output.list = [];
		// output.vars = {};

		const hhPerChwPerMonth = 
			modelInputs.hhPerChw * 
			modelInputs.hhVisitsPerChwPerMonth;
		
		const ppeNeededPerChwPerMonth = 
			hhPerChwPerMonth / 
			modelInputs.ppeUsageTimes;

		const ppeCostPerChwPerMonth = 
			ppeNeededPerChwPerMonth *
			modelInputs.costPerPpe;

		const totalPpeNeededPerMonth = 
			modelInputs.numChws *
			ppeNeededPerChwPerMonth;

		const totalPpeCostPerMonth = 
			modelInputs.numChws *
			ppeCostPerChwPerMonth;

		const tidy = num => numberWithCommas(Math.round(num));

		timeRange.forEach(month => {
			output.list.push({
				month,
				ppeNeeded: tidy(month * totalPpeNeededPerMonth),
				ppeCost:   tidy(month * totalPpeCostPerMonth),
			});
		})

		setModelOutput(output);
		console.log("New output:", output);
	};

	const updateModelField = (field, value) => {
		value = parseFloat(value);
		if(!isNaN(value)) {
			const inputs = { ...modelInputs, [field]: value };
			setModelInputs(inputs);
			console.log("Updated inputs:", inputs);

			updateModelOutput();
		}
	}

	if(!modelOutput.list.length) {
		updateModelOutput();
	}

	return (<div className={styles.root}>
		<Card className={styles.inputCard} variant="outlined">
			<CardContent>
				<Typography className={styles.title} color="textSecondary">
					PPE Calculator
				</Typography>

				<TextField
					required
					label="Number of CHWs (total)"
					defaultValue={modelInputs.numChws}
					onChange={evt => updateModelField('numChws', evt.target.value)}
				/>

				<TextField
					required
					label="Households (total)"
					defaultValue={modelInputs.numHouseholds}
					onChange={evt => updateModelField('numHouseholds', evt.target.value)}
				/>

				<TextField
					required
					label="Households per CHW (total)"
					defaultValue={modelInputs.hhPerChw}
					onChange={evt => updateModelField('hhPerChw', evt.target.value)}
				/>

				{showAssumptions ?
					<div className={styles.assumptions}>
						<Typography className={styles.title} color="textSecondary">
							Assumptions Used in Calculations
						</Typography>

						<TextField
							required
							label="Households Visits Per CHW Per Month"
							defaultValue={modelInputs.hhVisitsPerChwPerMonth}
							onChange={evt => updateModelField('hhVisitsPerChwPerMonth', evt.target.value)}
						/>

						<TextField
							required
							label="Number of Times PPE Can be Used"
							defaultValue={modelInputs.ppeUsageTimes}
							onChange={evt => updateModelField('ppeUsageTimes', evt.target.value)}
						/>

						<TextField
							required
							label="Cost per PPE"
							defaultValue={modelInputs.costPerPpe}
							onChange={evt => updateModelField('costPerPpe', evt.target.value)}
						/>
					</div>
				:""}
				
			</CardContent>
			<CardActions>
				<Button 
					onClick={() => setShowAssumptions(!showAssumptions)}
				>
					{!showAssumptions ? "Show":"Hide"}{" "} Assumptions
				</Button>
			</CardActions>
		</Card>

		<Card className={styles.outputCard} variant="outlined">
			<CardContent>
				<Typography className={styles.title} color="textSecondary">
					PPE Projections from 1 - 12 months
				</Typography>

				<div className={styles.wrap}>
					<table>
						<thead>
							<tr>
								<td className={styles.key}>
									Time Range
								</td>
								{modelOutput.list.map(({ month }) =>
									<td key={month}>
										{month} mo
									</td>
								)}
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className={styles.key}>
									Kits Needed
								</td>
								{modelOutput.list.map(({ month, ppeNeeded }) =>
									<td key={month}>
										{ppeNeeded}
									</td>
								)}
							</tr>
							<tr>
								<td className={styles.key}>
									Total Cost for Kits
								</td>
								{modelOutput.list.map(({ month, ppeCost }) =>
									<td key={month}>
										{ppeCost}
									</td>
								)}
							</tr>
						</tbody>
					</table>
				</div>


			</CardContent>
		</Card>
		
	</div>);
}