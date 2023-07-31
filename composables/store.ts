import { state, claim, airports, airlines } from '@/store'
import steps from '~/store/steps';
import { Airline, Airport } from '~~/types';


export const useAppState = () => state
export const useClaim = () => claim
export const useSteps = steps
export function useAirports(): Record<string, Airport>;
export function useAirports (iata?: string): Airport
export function useAirports (iata?: string[]): Record<string, Airport>
export function useAirports (iata?: string | string[]) {
	if (!iata?.length) return airports.value
	const iatas = Array.isArray(iata) ? iata : [iata]
	iatas.forEach(iata => {
		if (airports.value[iata]) return
		queryAirports(useAlgoliaSearch("AIRPORTS"), iata)
	})
	return Array.isArray(iata) ? airports.value : airports.value[iata]
}
export function useAirlines (iata: string): Airline
export function useAirlines (iata: string[]): Record<string, Airline>
export function useAirlines (iata?: string | string[]) {
	if (!iata?.length) return airlines.value
	const iatas = Array.isArray(iata) ? iata : [iata]
	iatas.forEach(iata => {
		if (airlines.value[iata]) return
		queryAirlines(iata)
	})
	return Array.isArray(iata) ? airlines.value : airlines.value[iata]
}
