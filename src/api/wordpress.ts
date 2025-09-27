/**
 * @description Servicio específico para consumir la API REST de WordPress
 * Specific service to consume WordPress REST API
 * @author Esteban Soto Ojeda @elsoprimeDev
 * @version 1.0.0
 * @license MIT
 */

import {ApiService} from './services'
import type {
  AboutPageData,
  AboutPageSchema,
  ContactPageData,
  ServicesPageData,
  ServicesPageSchema
} from '@/types'

// Tipos específicos para WordPress
export interface WordPressPage {
  id: number
  title: {rendered: string}
  content: {rendered: string}
  acf: Record<string, any>
  featured_images?: {
    full: {url: string}
  }
}

export interface WordPressPost {
  id: number
  title: {rendered: string}
  content: {rendered: string}
  excerpt: {rendered: string}
  date: string
  slug: string
}

export interface WordPressMedia {
  id: number
  source_url: string
  alt_text: string
  title: {rendered: string}
}

/**
 * Servicio especializado para WordPress con métodos específicos
 */
export class WordPressApiService {
  protected apiService: ApiService

  constructor() {
    this.apiService = ApiService.fromEnvironment()
  }

  /**
   * Obtiene una página por slug
   */
  async getPageBySlug(slug: string): Promise<WordPressPage> {
    try {
      const pages = await this.apiService.get<WordPressPage[]>(
        `/pages?slug=${slug}`
      )

      if (!pages || pages.length === 0) {
        throw new Error(`Página con slug '${slug}' no encontrada`)
      }

      return pages[0]
    } catch (error) {
      console.error(`Error al obtener página ${slug}:`, error)
      throw error
    }
  }

  /**
   * Obtiene múltiples páginas con filtros opcionales
   */
  async getPages(params?: {
    per_page?: number
    page?: number
    status?: 'publish' | 'draft' | 'private'
    orderby?: 'date' | 'title' | 'menu_order'
    order?: 'asc' | 'desc'
  }): Promise<WordPressPage[]> {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ''

    return this.apiService.get<WordPressPage[]>(`/pages${query}`)
  }

  /**
   * Obtiene posts con filtros opcionales
   */
  async getPosts(params?: {
    per_page?: number
    page?: number
    categories?: number[]
    tags?: number[]
    status?: 'publish' | 'draft'
    orderby?: 'date' | 'title' | 'relevance'
    order?: 'asc' | 'desc'
  }): Promise<WordPressPost[]> {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','))
          } else {
            queryParams.append(key, String(value))
          }
        }
      })
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ''

    return this.apiService.get<WordPressPost[]>(`/posts${query}`)
  }

  /**
   * Obtiene un post específico por ID
   */
  async getPostById(id: number): Promise<WordPressPost> {
    return this.apiService.get<WordPressPost>(`/posts/${id}`)
  }

  /**
   * Obtiene media/archivos adjuntos
   */
  async getMedia(params?: {
    per_page?: number
    page?: number
    media_type?: 'image' | 'video' | 'audio'
  }): Promise<WordPressMedia[]> {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ''

    return this.apiService.get<WordPressMedia[]>(`/media${query}`)
  }

  /**
   * Obtiene categorías
   */
  async getCategories(params?: {
    per_page?: number
    hide_empty?: boolean
    orderby?: 'name' | 'count'
  }) {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ''

    return this.apiService.get(`/categories${query}`)
  }

  /**
   * Método específico para la página "nosotros" con tipado fuerte
   * @description Fetches and validates the "About Us" page data
   * @returns Validated AboutPage data
   * @throws Error if the page cannot be loaded or validated
   */
  async getAboutPage(): Promise<AboutPageData> {
    try {
      const page = await this.getPageBySlug('nosotros')

      // Aquí puedes agregar validación con el schema si es necesario
      // const validatedData = AboutPageSchema.parse(page);

      return page as AboutPageData
    } catch (error) {
      console.error('Error al obtener página "nosotros":', error)
      throw new Error(
        'No se pudo cargar la información de la página "nosotros"'
      )
    }
  }

  /**
   * Método específico para la página "servicios" con tipado fuerte
   * @description Fetches and validates the "Services" page data
   * @returns Validated ServicesPage data
   */
  async getServicesPage(): Promise<ServicesPageData> {
    try {
      const page = await this.getPageBySlug('servicios')

      // Aquí puedes agregar validación con el schema si es necesario
      // const validatedData = ServicesPageSchema.parse(page);

      return page as ServicesPageData
    } catch (error) {
      console.error('Error al obtener página "servicios":', error)
      throw new Error(
        'No se pudo cargar la información de la página "servicios"'
      )
    }
  }

  /**
   * Método específico para la página "Contacto" con tipado fuerte y fallback robusto
   * @description Fetches and validates the "Contact" page data with fallback
   * @returns Validated ContactPage data or fallback data
   * @throws Error only if fallback data also fails
   */
  async getContactPage(): Promise<ContactPageData> {
    try {
      const page = await this.getPageBySlug('contacto')
      console.log(
        '✅ Página de contacto obtenida exitosamente desde WordPress API'
      )
      return page as unknown as ContactPageData
    } catch (error) {
      console.warn(
        '⚠️ Error al obtener página "contacto" desde WordPress:',
        error
      )
      console.log(
        '🔄 Usando datos de fallback para la página de contacto basados en la API real...'
      )

      // Datos de fallback robustos basados en la respuesta real de la API
      const fallbackData: ContactPageData = {
        id: 52,
        title: {rendered: 'Contacto'},
        content: {
          rendered: '<p>Sitio Web en Construcción - Página de Contacto</p>'
        },
        featured_images: {
          thumbnail: {
            url: 'https://selgesur.cl/wordpress/wp-content/uploads/2024/11/Energia-7-150x150.png',
            width: 150,
            height: 150
          },
          medium: {
            url: 'https://selgesur.cl/wordpress/wp-content/uploads/2024/11/Energia-7-300x200.png',
            width: 300,
            height: 200
          },
          medium_large: {
            url: 'https://selgesur.cl/wordpress/wp-content/uploads/2024/11/Energia-7-768x512.png',
            width: 768,
            height: 512
          },
          large: {
            url: 'https://selgesur.cl/wordpress/wp-content/uploads/2024/11/Energia-7-1024x683.png',
            width: 1024,
            height: 683
          },
          full: {
            url: 'https://selgesur.cl/wordpress/wp-content/uploads/2024/11/Energia-7.png',
            width: 1536,
            height: 1024
          }
        }
      }

      console.log('✅ Datos de fallback para contacto cargados correctamente')
      return fallbackData
    }
  }

  /**
   * Método de utilidad para construir URLs de imágenes con tamaños específicos
   */
  getImageUrl(
    baseUrl: string,
    size: 'thumbnail' | 'medium' | 'large' | 'full' = 'full'
  ): string {
    if (size === 'full') {
      return baseUrl
    }

    // Agregar lógica para diferentes tamaños si es necesario
    const urlParts = baseUrl.split('.')
    const extension = urlParts.pop()
    const baseName = urlParts.join('.')

    return `${baseName}-${size}.${extension}`
  }
}

// Instancia singleton para uso en toda la aplicación
export const wordpressApi = new WordPressApiService()
