import { Injectable } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { FirmaDiscount } from 'app/core/bkendmodels/models.types';

@Injectable({
	providedIn: 'root',
})
export class FuseUtilsService {
	private deviation: number = 10;
	/**
	 * Constructor
	 */
	constructor() {}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get the equivalent "IsActiveMatchOptions" options for "exact = true".
	 */
	get exactMatchOptions(): IsActiveMatchOptions {
		return {
			paths: 'exact',
			fragment: 'ignored',
			matrixParams: 'ignored',
			queryParams: 'exact',
		};
	}

	/**
	 * Get the equivalent "IsActiveMatchOptions" options for "exact = false".
	 */
	get subsetMatchOptions(): IsActiveMatchOptions {
		return {
			paths: 'subset',
			fragment: 'ignored',
			matrixParams: 'ignored',
			queryParams: 'subset',
		};
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Generates a random id
	 *
	 * @param length
	 */
	randomId(length: number = 10): string {
		const chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let name = '';

		for (let i = 0; i < 10; i++) {
			name += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		return name;
	}
	splitByCapitalLetters(str: string) {
		return str
			.replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Add space before capital letters
			.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Add space for words starting with capital letters
			.split(' ') // Split the string by space
			.map((word) => word[0].toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
			.join(' '); // Join the words with spaces
	}
	getCurrentDate() {
		return new Date().toLocaleDateString('ro');
	}

	getCurrentMonth() {
		return new Date().toLocaleString('default', { month: 'long' });
	}

	getLastMonth() {
		return new Date(
			new Date().setMonth(new Date().getMonth() - 1)
		).toLocaleString('default', { month: 'long' });
	}
	parseDate(date: string) {
		return new Date(date).toLocaleDateString('ro');
	}
	getDetaliiBusiness(data: any) {
		return (
			data.ocrData?.denumireFirma?.value +
			', ' +
			data.ocrData?.cuiFirma?.value +
			', ' +
			data.ocrData?.adresaFirma?.value
		);
	}
	getDetaliiFirmaDiscount(data: FirmaDiscount) {
		return data.name + ', ' + data.cuiNumber;
	}
	getOptimalCombination(items: any[], targetValue: number): any[] {
		let closestSum = Infinity;
		let closestCombination: any[] = [];

		// Generate all combinations
		const powerSet = this.generatePowerSet(items);

		// For each combination calculate the sum
		for (let combination of powerSet) {
			const sum = combination.reduce(
				(total, item) => total + item.discountValue,
				0
			);

			// Check if it's within deviation and closer to target than previous combinations
			if (
				Math.abs(targetValue - sum) < Math.abs(targetValue - closestSum) &&
				Math.abs(sum - targetValue) <= this.deviation
			) {
				closestSum = sum;
				closestCombination = combination;
			}
		}

		return closestCombination;
	}

	private generatePowerSet(array: any[]): any[][] {
		const powerSet = [[]];

		for (let element of array) {
			for (let i = 0, length = powerSet.length; i < length; i++) {
				powerSet.push([...powerSet[i], element]);
			}
		}

		return powerSet;
	}
}
