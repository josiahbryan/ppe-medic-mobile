import React from 'react';
import styles from './PpeCalc.module.scss';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import KeySpline from '../utils/spline';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function PpeCalc() {
	const [ modelInputs, setModelInputs ] = React.useState({
		numChws: 1500,
		numHouseholds: 200000,
		
		// Assumptions
		hhVisitsPerChwPerMonth: 2,
		ppeUsageTimes: 4,
		costPerPpe: 10,
		extraKitMultiplier: 1.1,

		// Model demand curve, initial values based on trial-and-error
		// via https://cubic-bezier.com/#.17,.67,.55,.97
		curveA: .17,
		curveB: .67,
		curveC: .55,
		curveD: .97,
	});

	const [ showAssumptions, setShowAssumptions ] = React.useState(false)

	const [ modelOutput, setModelOutput ] = React.useState({ list: [], vars: { hhPerChw: 0 } })

	const updateModelOutput = (inputs) => {
		if(!inputs) {
			inputs = modelInputs;
		}
		const output = {};
		const timeRange = [ 1, 3, 6, 9, 12 ];
		
		const hhPerChw =
			inputs.numHouseholds /
			inputs.numChws;

		const hhPerChwPerMonth = 
			hhPerChw * 
			inputs.hhVisitsPerChwPerMonth;
		
		const ppeNeededPerChwPerMonth = 
			hhPerChwPerMonth / 
			inputs.ppeUsageTimes *
			inputs.extraKitMultiplier;

		const ppeCostPerChwPerMonth = 
			ppeNeededPerChwPerMonth *
			inputs.costPerPpe;

		const totalPpeNeededPerMonth = 
			inputs.numChws *
			ppeNeededPerChwPerMonth;

		const totalPpeCostPerMonth = 
			inputs.numChws *
			ppeCostPerChwPerMonth;

		// Collect for possible display later
		output.vars = {
			hhPerChw,
			hhPerChwPerMonth,
			ppeNeededPerChwPerMonth,
			ppeCostPerChwPerMonth,
			totalPpeNeededPerMonth,
			totalPpeCostPerMonth
		};

		const tidy = num => numberWithCommas(Math.round(num));
		const round2digits = num => Math.round((num + Number.EPSILON) * 100) / 100;

		// Make numbers nice if we need to display
		Object.keys(output.vars).forEach(key => {
			output.vars[key] = round2digits(output.vars[key])
		})

		// Build table 
		output.list = [];

		const enableSpline = [
			inputs.curveA,
			inputs.curveB,
			inputs.curveC,
			inputs.curveD,
		].find(x => x > 0);

		const spline = new KeySpline(
			inputs.curveA,
			inputs.curveB,
			inputs.curveC,
			inputs.curveD,
		);

		const sum = (list, key) => list.reduce((sum, val) => sum += val[key], 0);

		timeRange.forEach(month => {
			const months = new Array(month)
				.fill()
				.map((unused, num) => {
					num = num + 1;
					const demandModelingValue = enableSpline ? Math.max(1, .5 + spline.get(num / 6)) : 1;
					return {
						num,
						demandModelingValue: demandModelingValue,
						ppeNeeded:  num * demandModelingValue * totalPpeNeededPerMonth,
						ppeCost:    num * demandModelingValue * totalPpeCostPerMonth,
						kitsPerChw: num * demandModelingValue * ppeNeededPerChwPerMonth,
					}
				});
			console.log(months);
			
			
			output.list.push({
				month,
				demandModelingValue: round2digits(sum(months, 'demandModelingValue')),
				ppeNeeded:  tidy(sum(months, 'ppeNeeded')),
				ppeCost:    tidy(sum(months, 'ppeCost')),
				kitsPerChw: tidy(sum(months, 'kitsPerChw')),
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

			updateModelOutput(inputs);
		}
	}

	if(!modelOutput.list.length) {
		updateModelOutput();
	}

	return (<div className={styles.root}>
		<Card className={styles.inputCard} variant="outlined">
			<CardContent>
				<Typography className={styles.title} color="textSecondary">
					PPE for CHWs Calculator
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
					label="Avg HHs per CHW"
					defaultValue={modelOutput.vars.hhPerChw}
					disabled
				/>

				{showAssumptions ?
					<div className={styles.assumptions}>
						<Typography className={styles.title} color="textSecondary">
							Assumptions Used in Calculations
						</Typography>

						<TextField
							required
							label="Physical Households Visits Per CHW Per Month"
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
							label="Cost per PPE in USD ($)"
							defaultValue={modelInputs.costPerPpe}
							onChange={evt => updateModelField('costPerPpe', evt.target.value)}
						/>

						<TextField
							required
							label="Extra Kit Multiplier for Redundancy"
							defaultValue={modelInputs.extraKitMultiplier}
							onChange={evt => updateModelField('extraKitMultiplier', evt.target.value)}
						/>

						<TextField
							required
							label="Demand Curve Control A"
							defaultValue={modelInputs.curveA}
							onChange={evt => updateModelField('curveA', evt.target.value)}
						/>

						<TextField
							required
							label="Demand Curve Control B"
							defaultValue={modelInputs.curveB}
							onChange={evt => updateModelField('curveB', evt.target.value)}
						/>

						<TextField
							required
							label="Demand Curve Control C"
							defaultValue={modelInputs.curveC}
							onChange={evt => updateModelField('curveC', evt.target.value)}
						/>

						<TextField
							required
							label="Demand Curve Control D"
							defaultValue={modelInputs.curveD}
							onChange={evt => updateModelField('curveD', evt.target.value)}
						/>
						
						<p className={styles.hint}>Use this tool to generate demand control curve points: <a href='https://cubic-bezier.com/#.17,.67,.55,.97' target='_new'>https://cubic-bezier.com/#.17,.67,.55,.97</a></p>
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
									Estimated Duration of Outbreak
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
										${ppeCost}
									</td>
								)}
							</tr>
							<tr>
								<td className={styles.key}>
									Avg Kits per CHW
								</td>
								{modelOutput.list.map(({ month, kitsPerChw }) =>
									<td key={month}>
										{kitsPerChw}
									</td>
								)}
							</tr>
							{/* <tr>
								<td className={styles.key}>
								demandModelingValue
								</td>
								{modelOutput.list.map(({ month, demandModelingValue }) =>
									<td key={month}>
										{demandModelingValue}
									</td>
								)}
							</tr> */}
						</tbody>
					</table>
				</div>


			</CardContent>
		</Card>
		
	</div>);
}