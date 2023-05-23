import { state, airports, airlines } from '@/store'
import { Airport } from '~~/types';


export const useAppState = () => state
export function useAirports(): Record<string, Airport>;
export function useAirports (iata?: string): Airport
export function useAirports (iata?: string) {
	if (!iata) return airports.value
	if (airports.value[iata]) return airports.value[iata]
	queryAirports(useAlgoliaSearch("AIRPORTS"), iata)
	return airports.value[iata]
}
export const useAirlines = () => airlines