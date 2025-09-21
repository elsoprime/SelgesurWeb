/**
 * @description Consumir API REST de WordPress con configuración avanzada
 * Service to consume WordPress REST API with advanced configuration
 * @author Esteban Soto Ojeda @elsoprimeDev
 * @version 2.0.0
 * @license MIT
 */

// Tipos para la configuración del API
export interface ApiConfig {
  baseUrl: string
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
}

// Tipo para respuestas con error
export interface ApiError {
  message: string
  status?: number
  code?: string
}

// Configuración por defecto
const defaultConfig: Required<Omit<ApiConfig, 'baseUrl'>> = {
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
}

export class ApiService {
  private config: Required<ApiConfig>

  constructor(config: ApiConfig) {
    this.config = {
      ...defaultConfig,
      ...config
    }
  }

  /**
   * Crea una instancia del servicio con variables de entorno
   */
  static fromEnvironment(): ApiService {
    const baseUrl = import.meta.env.PUBLIC_API_BASE_URL

    if (!baseUrl) {
      throw new Error(
        'PUBLIC_API_BASE_URL no está configurada en las variables de entorno'
      )
    }

    return new ApiService({
      baseUrl,
      timeout:
        Number(import.meta.env.PUBLIC_API_TIMEOUT) || defaultConfig.timeout,
      retryAttempts:
        Number(import.meta.env.PUBLIC_API_RETRY_ATTEMPTS) ||
        defaultConfig.retryAttempts
    })
  }

  /**
   * Realiza una petición GET con retry logic y timeout
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.requestWithRetry<T>('GET', endpoint, options)
  }

  /**
   * Realiza una petición POST
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    const requestOptions: RequestInit = {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    }

    return this.requestWithRetry<T>('POST', endpoint, requestOptions)
  }

  /**
   * Método privado para manejar reintentos
   */
  private async requestWithRetry<T>(
    method: string,
    endpoint: string,
    options?: RequestInit,
    attempt = 1
  ): Promise<T> {
    try {
      const url = `${this.config.baseUrl}${endpoint}`

      // Crear AbortController para timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      )

      const response = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await this.handleErrorResponse(response)
        throw new Error(
          `HTTP ${response.status}: ${errorData.message || response.statusText}`
        )
      }

      const data: T = await response.json()
      return data
    } catch (error) {
      // Si es el último intento, lanzar el error
      if (attempt >= this.config.retryAttempts) {
        console.error(`API request failed after ${attempt} attempts:`, error)
        throw this.formatError(error)
      }

      // Si no es un error de red, no reintentar
      if (
        error instanceof TypeError &&
        error.message.includes('Failed to fetch')
      ) {
        console.warn(
          `Attempt ${attempt} failed, retrying in ${this.config.retryDelay}ms...`
        )
        await this.delay(this.config.retryDelay)
        return this.requestWithRetry<T>(method, endpoint, options, attempt + 1)
      }

      throw this.formatError(error)
    }
  }

  /**
   * Maneja respuestas de error del servidor
   */
  private async handleErrorResponse(response: Response): Promise<ApiError> {
    try {
      const errorData = await response.json()
      return {
        message: errorData.message || 'Error desconocido del servidor',
        status: response.status,
        code: errorData.code
      }
    } catch {
      return {
        message: response.statusText || 'Error del servidor',
        status: response.status
      }
    }
  }

  /**
   * Formatea errores para consistencia
   */
  private formatError(error: unknown): Error {
    if (error instanceof Error) {
      return error
    }
    return new Error(String(error))
  }

  /**
   * Utilidad para delay en reintentos
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Obtiene la configuración actual
   */
  getConfig(): Required<ApiConfig> {
    return {...this.config}
  }
}
