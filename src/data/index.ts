import {
  serviceIcon1,
  electricIcon,
  bgServices,
  bgClients,
  bgAboutHome,
  bgservicesHome,
  photoService,
  logoSaesa,
  logoInnova,
  logoEnergia7,
  bgClientsSaesa,
  bgClientsInnova,
  bgClientEnergia,
  imageService
} from '@/assets/images'

import {
  Building,
  Shield,
  Gauge,
  UtilityPole,
  CircleGauge,
  ChartColumnDecreasing,
  EyeIcon,
  Group
} from '@lucide/astro'

// Define the structure of your data here for the Home
// Traductor: Definimos la estructura de tus datos aquí para el Home

export const mainContentData = {
  home: {
    id: 1,
    title: {
      rendered: 'Soluciones Integrales de Operación y Mantenimiento Eléctrico'
    },
    acf: {
      subtitle:
        'Brindamos servicios especializados de alta calidad para el sector eléctrico'
    },
    featured_images: {
      // Add your featured images data here according to featuredImagesSchema
      thumbnail: {
        height: 400,
        width: 400,
        url: imageService
      }
    },
    content: {
      rendered:
        'En Selgesur, nos especializamos en ofrecer soluciones integrales de gestión y servicios empresariales. Con años de experiencia en el sector, estamos comprometidos a brindar excelencia y calidad en cada proyecto que emprendemos.' // Add your HTML content here
    }
  },
  about: {
    id: 2,
    title: {
      rendered: 'Quiénes Somos'
    },
    acf: {
      subtitle: ['Confiables', 'desde 2009'],
      blocks: [
        {
          title: 'Acerca de Selgesur',
          subtitle: 'Nuestra Historia',
          icon: Building
        },
        {
          title: 'Acerca de nuestra Misión',
          subtitle: 'Compromiso con la seguridad y calidad',
          icon: ChartColumnDecreasing
        },
        {
          title: 'Acerca de nuestra Visión',
          subtitle: 'Ser un referente en el sector eléctrico',
          icon: EyeIcon
        },
        {
          title: 'Acerca de nuestros Valores',
          subtitle: 'Fundamentos que guían nuestro trabajo',
          icon: Group
        }
      ]
    },
    // Add your featured images data here
    featured_images: {
      // Add your featured images data here according to featuredImagesSchema
      thumbnail: {
        height: 2035,
        width: 1816,
        url: bgAboutHome
      }
    },

    content: {
      rendered:
        'Con mas de 10 años experiencia en el sector de la generación eléctrica, Selgesur se ha consolidado como un referente en la industria, ofreciendo el mejor servicio en cuanto a operacion y mantención de centrales eléctricas.' // Add your HTML content here
    }
  },
  services: {
    id: 3,
    title: {
      rendered: 'Nuestros Servicios'
    },
    acf: {
      subtitle:
        'Servicios especializados para el sector eléctrico, con máxima seguridad y eficiencia.',
      servicesList: [
        {
          title: 'Operación de Centrales Eléctricas',
          description:
            'Servicio especializado en operación segura y eficiente de instalaciones Gx, con precisión técnica, continuidad operativa y compromiso absoluto con la seguridad.',
          icon: serviceIcon1,
          imageCard: photoService
        } // ... other services
      ],
      blocks: [
        // You can add more blocks if needed
        //Características o beneficios adicionales
        {
          icon: Shield,
          title: 'Seguridad Garantizada',
          content:
            'Protocolo riguroso y cumplimiento normativo para proteger a nuestro personal e instalaciones.'
        },
        {
          icon: Gauge,
          title: 'Equipo Profesional',
          content:
            'Contamos con un equipo altamente capacitado y con amplia experiencia en el sector eléctrico, garantizando la calidad de nuestros servicios.'
        },
        {
          icon: UtilityPole,
          title: 'Compromiso con la Seguridad',
          content:
            'La seguridad es nuestra prioridad en todas las operaciones que realizamos.'
        }
      ]
    },
    featured_images: {
      thumbnail: {
        height: 2560,
        width: 1440,
        url: bgservicesHome
      }
    },
    content: {
      rendered: '' // Add your HTML content here
    }
  },
  clients: {
    id: 4,
    title: {
      rendered: 'Confían en nuestra experiencia'
    },
    acf: {
      subtitle: 'Nuestros clientes son nuestra prioridad',
      servicesList: [
        {
          title: 'Grupo Saesa',
          description:
            'Más de 10 años junto al Grupo Saesa, apoyando la operación de sistemas aislados en zonas estratégicas de Puerto Montt y el Archipiélago de Chiloé.',
          icon: logoSaesa,
          imageCard: bgClientsSaesa.src
        },
        {
          title: 'Saesa Innova',
          description:
            'Colaboración con Saesa Innova en instalaciones de respaldo para grandes clientes, presentes en diversas ciudades de la Isla Grande de Chiloé.',
          icon: logoInnova,
          imageCard: bgClientsInnova.src
        },
        {
          title: 'Energía 7',
          description:
            'Alianza con Energía 7 SPA, referente en generación y distribución eléctrica. Colaboramos para asegurar un suministro confiable y sostenible en distintas regiones del país.',
          icon: logoEnergia7,
          imageCard: bgClientEnergia.src
        }
      ]
    }
  },
  testimonials: {
    id: 5,
    title: {
      rendered: 'Testimonios de Clientes'
    },
    acf: {
      subtitle: 'Lo que nuestros clientes dicen sobre nosotros',
      testimonialsList: [
        {
          name: 'René Caceres Soto',
          position: 'Encargado de Operaciones',
          company: 'Zonal Norte - Grupo Saesa',
          content:
            'Selgesur ha demostrado ser un socio confiable y profesional en todos nuestros proyectos durantes estos años.',
          avatar: '/avatars/avatar-1.jpg'
        },
        {
          name: 'María Fernanda Pérez',
          position: 'Jefa de Proyectos',
          company: 'Energía 7',
          content:
            'La colaboración con Selgesur ha sido clave para el éxito de nuestros proyectos de energía renovable.',
          avatar: '/avatars/avatar-2.jpg'
        },
        {
          name: 'Luis Miguel González',
          position: 'Director de Operaciones',
          company: 'Saesa Innova',
          content:
            'Selgesur ha superado nuestras expectativas en términos de calidad y compromiso.',
          avatar: '/avatars/avatar-3.jpg'
        },
        {
          name: 'Ana María López',
          position: 'Gerente de Proyectos',
          company: 'Grupo Saesa',
          content:
            'La experiencia y profesionalismo de Selgesur han sido fundamentales en nuestros proyectos más desafiantes.',
          avatar: '/avatars/avatar-4.jpg'
        },
        {
          name: 'Jorge Alberto Ramírez',
          position: 'Encargado de Mantenimiento',
          company: 'Energía 7',
          content:
            'Selgesur es un aliado estratégico en la operación y mantenimiento de nuestras instalaciones.',
          avatar: '/avatars/avatar-5.jpg'
        },
        {
          name: 'Cecilia Torres',
          position: 'Coordinadora de Proyectos',
          company: 'Saesa Innova',
          content:
            'Trabajar con Selgesur ha sido una experiencia positiva gracias a su enfoque en la seguridad y calidad.',
          avatar: '/avatars/avatar-6.jpg'
        }
      ]
    }
  }

  // ... Continue with other sections following the same pattern
}
