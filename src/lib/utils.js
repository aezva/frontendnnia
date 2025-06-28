import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// Servicio de utilidades online para NNIA
class OnlineService {
	constructor() {
		this.cache = new Map();
		this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
	}

	// Obtener fecha y hora real de internet
	async getRealDateTime() {
		const cacheKey = 'realDateTime';
		const cached = this.cache.get(cacheKey);
		
		if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
			return cached.data;
		}

		try {
			// Intentar múltiples servicios para mayor confiabilidad
			const services = [
				'https://worldtimeapi.org/api/ip',
				'https://timeapi.io/api/Time/current/zone?timeZone=UTC',
				'https://api.timezonedb.com/v2.1/get-time-zone?key=demo&format=json&by=zone&zone=UTC'
			];

			for (const service of services) {
				try {
					const response = await fetch(service, { 
						method: 'GET',
						headers: { 'Accept': 'application/json' },
						signal: AbortSignal.timeout(3000) // 3 segundos timeout
					});
					
					if (response.ok) {
						const data = await response.json();
						let realDate;
						
						// Parsear según el servicio
						if (service.includes('worldtimeapi')) {
							realDate = new Date(data.utc_datetime);
						} else if (service.includes('timeapi.io')) {
							realDate = new Date(data.dateTime);
						} else if (service.includes('timezonedb')) {
							realDate = new Date(data.formatted);
						}
						
						if (realDate && !isNaN(realDate.getTime())) {
							const result = {
								date: realDate,
								timestamp: Date.now(),
								source: service,
								timezone: data.timezone || 'UTC'
							};
							
							this.cache.set(cacheKey, {
								data: result,
								timestamp: Date.now()
							});
							
							return result;
						}
					}
				} catch (error) {
					console.warn(`Error obteniendo fecha de ${service}:`, error);
					continue;
				}
			}
			
			// Si todos los servicios fallan, usar fecha local
			console.warn('No se pudo obtener fecha de internet, usando fecha local');
			return {
				date: new Date(),
				timestamp: Date.now(),
				source: 'local',
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
			};
			
		} catch (error) {
			console.error('Error en getRealDateTime:', error);
			return {
				date: new Date(),
				timestamp: Date.now(),
				source: 'local',
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
			};
		}
	}

	// Obtener solo la fecha real (sin cache)
	async getCurrentDate() {
		const dateTime = await this.getRealDateTime();
		return dateTime.date;
	}

	// Verificar si una fecha es futura usando fecha real
	async isFutureDate(dateString, timeString = '00:00') {
		const realDate = await this.getCurrentDate();
		const targetDate = new Date(`${dateString}T${timeString}`);
		return targetDate > realDate;
	}

	// Preparación para futuras funciones online
	async searchOnline(query, type = 'general') {
		// Placeholder para futuras implementaciones de búsqueda web
		console.log(`Búsqueda online: ${query} (tipo: ${type})`);
		throw new Error('Función de búsqueda online no implementada aún');
	}

	// Limpiar cache
	clearCache() {
		this.cache.clear();
	}
}

// Instancia global del servicio online
export const onlineService = new OnlineService();

// Función helper para obtener fecha real (más simple)
export async function getRealDate() {
	return await onlineService.getCurrentDate();
}

// Función helper para verificar si una fecha es futura
export async function isDateInFuture(dateString, timeString = '00:00') {
	return await onlineService.isFutureDate(dateString, timeString);
}

// Función para obtener fecha real desde el backend como respaldo
export async function getRealDateFromBackend() {
	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
	
	try {
		const response = await fetch(`${API_URL}/nnia/real-time`, {
			method: 'GET',
			headers: { 'Accept': 'application/json' },
			signal: AbortSignal.timeout(5000) // 5 segundos timeout
		});
		
		if (response.ok) {
			const data = await response.json();
			if (data.success && data.date) {
				return new Date(data.date);
			}
		}
	} catch (error) {
		console.warn('Error obteniendo fecha del backend:', error);
	}
	
	// Si falla, usar fecha local
	return new Date();
}

// Función unificada que intenta obtener fecha real de múltiples fuentes
export async function getRealDateReliable() {
	try {
		// Primero intentar con el servicio online
		const onlineDate = await getRealDate();
		console.log('🌐 Fecha obtenida de servicio online:', onlineDate);
		return onlineDate;
	} catch (error) {
		console.warn('Error con servicio online, intentando backend:', error);
		
		try {
			// Si falla, intentar con el backend
			const backendDate = await getRealDateFromBackend();
			console.log('🌐 Fecha obtenida del backend:', backendDate);
			return backendDate;
		} catch (backendError) {
			console.warn('Error con backend, usando fecha local:', backendError);
			// Si todo falla, usar fecha local
			return new Date();
		}
	}
}

// Función simplificada para obtener fecha actual
export async function getCurrentDate() {
	try {
		// Intentar obtener fecha de internet
		const response = await fetch('https://worldtimeapi.org/api/ip');
		if (response.ok) {
			const data = await response.json();
			const realDate = new Date(data.datetime);
			console.log('🌐 Fecha obtenida de internet:', realDate);
			return realDate;
		}
	} catch (error) {
		console.log('⚠️ No se pudo obtener fecha de internet, usando fecha local');
	}
	
	// Fallback a fecha local
	const localDate = new Date();
	console.log('📅 Usando fecha local:', localDate);
	return localDate;
}

// Función para formatear fecha
export function formatDate(date) {
	return date.toLocaleDateString('es-ES', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

// Función para obtener fecha actual como string
export function getCurrentDateString() {
	const date = new Date();
	return date.toISOString().split('T')[0]; // YYYY-MM-DD
}