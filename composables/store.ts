import { state, claim, airports, airlines } from '@/store'
import steps from '~/store/steps';
import { Airline, Airport } from '~~/types';


export const useAppState = () => state
export const useClaim = () => claim
export const useSteps = steps
export async function useAirports(): Promise<Record<string, Airport>>;
export async function useAirports (iata?: string): Promise<Airport>
export async function useAirports (iata?: string[]): Promise<Record<string, Airport>>
export async function useAirports (iata?: string | string[]) {
	if (!iata?.length) return airports.value
	const iatas = Array.isArray(iata) ? iata : [iata]
	await Promise.all(iatas.map(async (iata) => {
		if (airports.value[iata]) return
		return await queryAirports(useAlgoliaSearch("AIRPORTS"), iata)
	}))
	return Array.isArray(iata) ? airports.value : airports.value[iata]
}
export async function useAirlines (iata: string): Promise<Airline>
export async function useAirlines (iata: string[]): Promise<Record<string, Airline>>
export async function useAirlines (iata?: string | string[]) {
	if (!iata?.length) return airlines.value
	const iatas = Array.isArray(iata) ? iata : [iata]
	await Promise.all(iatas.map(async (iata) => {
		if (airlines.value[iata]) return
		return await queryAirlines(iata)
	}))
	return Array.isArray(iata) ? airlines.value : airlines.value[iata]
}
