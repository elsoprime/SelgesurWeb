import {z} from 'astro:content'
import {array, record} from 'astro:schema'

/**
 * Schema Images used in WordPress REST API responses.
 */

const ImageSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number()
})

const featuredImagesSchema = z.object({
  thumbnail: ImageSchema,
  medium: ImageSchema,
  medium_large: ImageSchema,
  large: ImageSchema,
  full: ImageSchema
})

/**
 * Blocks ACF Schema (Advanced Custom Fields)
 * Traductor: Esquema de bloques ACF (Advanced Custom Fields)
 * @description Define the structure of individual content blocks used in ACF.
 */
const BlockSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string()
})

/**
 * @description Schema for Organization Chart Members
 * Traductor: Esquema para Miembros del Organigrama de la seccion de Nosotros
 */
const OrganizationMemberSchema = z.object({
  full_name: z.string(),
  company_role: z.string(),
  description: z.string().optional(),
  email: z.string().optional(),
  work_experience: z.string().optional(),
  telephone_number: z.string().optional(),
  profile_picture: z.string().optional(),
  achievements: z.string().optional()
})

/**
 * Base schema for a WordPress post or page.
 */
export const BaseWPSchema = z.object({
  id: z.number(),
  title: z.object({rendered: z.string()}),
  acf: z.object({
    subtitle: z.string()
  }),
  featured_images: featuredImagesSchema,
  content: z.object({rendered: z.string()})
})

/**
 * Schema for About Us Page Data
 */
export const AboutPageSchema = BaseWPSchema.extend({
  acf: z
    .object({
      section_header: z.string(),
      subtitle: z.string(),
      organization_chart: z.record(z.string(), OrganizationMemberSchema)
    })
    .catchall(BlockSchema)
})

/**
 * @description Blocks Schema for Services Page Activities
 * Traductor: Esquema de bloques para las actividades de la pagina de Servicios
 * Cada bloque representa una actividad con su título, descripción e imagen asociada.
 * Estos bloques permiten estructurar y presentar las actividades de manera clara y atractiva.
 */
export const ActivitiesBlockSchema = z.object({
  title: z.string(),
  description: z.string()
})

/**
 * Schema for Services Page Data
 */
export const ServicesPageSchema = BaseWPSchema.extend({
  acf: z
    .object({
      section_title: z.string(),
      subtitle: z.string(),
      activities: z.record(z.string(), ActivitiesBlockSchema)
    })
    .catchall(BlockSchema)
})

/**
 * Schema for Proyectos Post Data
 */

export const ProyectosPostSchema = BaseWPSchema.extend({
  acf: z
    .object({
      section_title: z.string(),
      subtitle: z.string()
    })
    .catchall(BlockSchema)
})

/**
 * Schema for Contact Page Data
 */

export const ContactPageSchema = BaseWPSchema.omit({acf: true})

/**
 * Types inferred from the schemas above.
 */

export type AboutPageData = z.infer<typeof AboutPageSchema>
export type ServicesPageData = z.infer<typeof ServicesPageSchema>
export type ProyectosPostData = z.infer<typeof ProyectosPostSchema>
export type ContactPageData = z.infer<typeof ContactPageSchema>
