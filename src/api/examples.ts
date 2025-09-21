/**
 * Ejemplos de uso de los servicios de API
 * Usage examples for API services
 * @author Esteban Soto Ojeda @elsoprimeDev
 * @version 1.0.0
 * @license MIT
 */

import {ApiService} from '@/api/services'
import {wordpressApi, WordPressApiService} from '@/api/wordpress'

// ============================================
// 1. USANDO EL SERVICIO GENÉRICO ApiService
// ============================================

// Crear instancia con variables de entorno
const apiService = ApiService.fromEnvironment()

// O crear con configuración manual
const customApiService = new ApiService({
  baseUrl: 'https://mi-api.com/api/v1',
  timeout: 5000,
  retryAttempts: 2
})

// Uso básico del servicio genérico
async function ejemploApiGenerico() {
  try {
    // GET simple
    const posts = await apiService.get('/posts')
    console.log('Posts obtenidos:', posts)

    // POST con datos
    const newPost = await apiService.post('/posts', {
      title: 'Mi nuevo post',
      content: 'Contenido del post'
    })
    console.log('Post creado:', newPost)
  } catch (error) {
    console.error('Error en API:', error)
  }
}

// ============================================
// 2. USANDO EL SERVICIO DE WORDPRESS
// ============================================

// Usar la instancia singleton
async function ejemploWordPressBasico() {
  try {
    // Obtener página específica
    const aboutPage = await wordpressApi.getAboutPage()
    console.log('Página nosotros:', aboutPage.title.rendered)

    // Obtener página por slug
    const contactPage = await wordpressApi.getPageBySlug('contacto')
    console.log('Página contacto:', contactPage)

    // Obtener posts recientes
    const recentPosts = await wordpressApi.getPosts({
      per_page: 5,
      orderby: 'date',
      order: 'desc'
    })
    console.log('Posts recientes:', recentPosts)

    // Obtener categorías
    const categories = await wordpressApi.getCategories({
      per_page: 10,
      hide_empty: true
    })
    console.log('Categorías:', categories)
  } catch (error) {
    console.error('Error con WordPress API:', error)
  }
}

// ============================================
// 3. EJEMPLO EN PÁGINA ASTRO
// ============================================

// En el frontmatter de una página .astro
/*
---
import { wordpressApi } from '@/api/wordpress';

// Obtener datos del servidor
const posts = await wordpressApi.getPosts({
  per_page: 10,
  status: 'publish'
});

const pages = await wordpressApi.getPages({
  per_page: 5,
  orderby: 'menu_order',
  order: 'asc'
});
---

<div>
  <h2>Posts</h2>
  {posts.map(post => (
    <article key={post.id}>
      <h3>{post.title.rendered}</h3>
      <div set:html={post.excerpt.rendered} />
    </article>
  ))}
</div>

<div>
  <h2>Páginas</h2>
  {pages.map(page => (
    <div key={page.id}>
      <h4>{page.title.rendered}</h4>
    </div>
  ))}
</div>
*/

// ============================================
// 4. MANEJO DE ERRORES AVANZADO
// ============================================

async function ejemploManejoErrores() {
  try {
    const page = await wordpressApi.getPageBySlug('pagina-inexistente')
    console.log(page)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error específico:', error.message)

      // Podrías implementar fallbacks
      if (error.message.includes('no encontrada')) {
        console.log('Redirigiendo a página 404...')
        // return Astro.redirect('/404');
      }
    }
  }
}

// ============================================
// 5. CREANDO SERVICIO PERSONALIZADO
// ============================================

class CustomApiService extends WordPressApiService {
  /**
   * Método personalizado para obtener productos (si usas WooCommerce)
   */
  async getProducts(params?: {
    per_page?: number
    category?: string
    featured?: boolean
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

    return this.apiService.get(`/products${query}`)
  }

  /**
   * Obtener menús personalizados
   */
  async getMenus(location?: string) {
    const endpoint = location ? `/menus/${location}` : '/menus'
    return this.apiService.get(endpoint)
  }
}

export {
  ejemploApiGenerico,
  ejemploWordPressBasico,
  ejemploManejoErrores,
  CustomApiService
}
