# UrbanWorld - Estructura del Proyecto

Este documento define la **estructura oficial** de carpetas y archivos del proyecto **UrbanWorld**.  
Se usará como base para organizar todos los módulos, código, datos, documentación y recursos visuales.

---

## 📂 Estructura de carpetas

```
UrbanWorld
├── images                # Recursos gráficos e imágenes
│   ├── brands_icons      # Iconos de marcas
│   └── brands            # Logos, catálogos y recursos por marca
│       ├── loop
│       ├── montana_cans
│       ├── montana_colors
│       ├── grog
│       ├── aka_colors
│       ├── happy_ink
│       ├── eggshell
│       └── molotow
│
├── css                   # Hojas de estilo (globales y modulares)
│
├── js                    # Código JavaScript organizado por módulos
│   ├── maps              # Lógica de mapas interactivos
│   ├── artists           # Funcionalidades relacionadas con artistas
│   └── marketplace       # Funcionalidades del marketplace
│
├── data                  # Archivos de datos en formato JSON
│   ├── murals.json       # Información sobre murales
│   ├── artists.json      # Información sobre artistas
│   └── materials.json    # Información sobre materiales
│
├── components            # Componentes modulares reutilizables
│   ├── artist_profiles   # Perfiles de artistas
│   ├── mural_map         # Mapas de murales
│   └── marketplace       # Componentes del marketplace
│
├── tutorials             # Material educativo
│   ├── art               # Tutoriales relacionados con arte urbano
│   └── music             # Tutoriales relacionados con música
│
└── docs                  # Documentación del proyecto
    └── project_plan      # Plan y evolución del proyecto
```

---

## 📌 Propósito de la estructura

- **Organización clara:** cada parte del proyecto tiene un lugar definido.
- **Modularidad:** separar por módulos (`components`, `js`) para facilitar escalabilidad.
- **Datos centralizados:** toda la información dinámica se guarda en `/data`.
- **Soporte multimedia:** recursos visuales y tutoriales organizados en `/images` y `/tutorials`.
- **Documentación unificada:** todo lo relacionado con la planificación y documentación se guarda en `/docs`.

---

## 📖 Referencias

- 📑 [Plantilla "De la chispa a la idea de proyecto"](./Plantilla_Chispa_Idea_Proyecto.pdf)  
- 🌍 Proyecto **UrbanWorld**: Plataforma digital para conectar artistas urbanos y músicos, con mapas de murales, marketplace de materiales, y tutoriales.

---
