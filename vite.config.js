import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Incluimos explícitamente los iconos para que se guarden en caché
      includeAssets: ['logo.svg', 'index.html', 'pwa-192x192.png', 'pwa-512x512.png'], 
      manifest: {
        name: 'FinFlow - Inteligencia Financiera',
        short_name: 'FinFlow',
        description: 'Controla tus gastos con análisis psicológico y alcanza tus metas.',
        
        // CORRECCIÓN: Usamos tu color de marca exacto (#5454FF)
        theme_color: '#5454FF', 
        background_color: '#050514', // Fondo oscuro para inicio elegante
        
        display: 'standalone',
        orientation: 'portrait',
        
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            // 'maskable' asegura que en Android se vea bien (círculo/cuadrado)
            purpose: 'any maskable' 
          }
        ],
        
        // AGREGADO PRO: Menú rápido al mantener presionado el icono
        shortcuts: [
          {
            name: "Nuevo Gasto",
            short_name: "Gasto",
            description: "Registrar movimiento rápido",
            url: "/dashboard",
            icons: [{ src: "pwa-192x192.png", sizes: "192x192" }]
          },
          {
            name: "Ver Metas",
            short_name: "Metas",
            description: "Revisar objetivos",
            url: "/goals",
            icons: [{ src: "pwa-192x192.png", sizes: "192x192" }]
          }
        ]
      }
    })
  ]
})