/**
 * AeroTab Themes Definition & Adaptive Contrast Engine
 * Features 100% authentic archival wallpapers spanning the 7 core sub-genres:
 * Frutiger Aero, Frutiger Aqua, Frutiger Eco, Dark Aero, Dorfic, Frutiger Metro, and Frutiger Zen.
 * Dynamically adapts UI glass tint, text contrast, and button luminances for flawless legibility.
 */

const Themes = {
  subgenres: [
    { id: 'all', name: 'All Worlds' },
    { id: 'aero', name: 'Frutiger Aero' },
    { id: 'aqua', name: 'Frutiger Aqua' },
    { id: 'eco', name: 'Frutiger Eco' },
    { id: 'dark', name: 'Dark Aero' },
    { id: 'dorfic', name: 'Dorfic' },
    { id: 'metro', name: 'Frutiger Metro' },
    { id: 'zen', name: 'Frutiger Zen' }
  ],

  definitions: {
    /* === 1. FRUTIGER AERO === */
    'bliss-4k': {
      id: 'bliss-4k',
      name: 'Windows XP Bliss (Original 4K)',
      subgenre: 'aero',
      subgenreName: 'Frutiger Aero',
      wallpaper: 'wallpapers/bliss-4k.png',
      description: 'The legendary Sonoma County rolling hill by Charles O\'Rear. Uncompressed authentic 4K scan.',
      swatchGradient: 'linear-gradient(135deg, #38bdf8 0%, #4ade80 50%, #16a34a 100%)',
      tone: 'light',
      cssOverrides: {
        '--glass-bg': 'rgba(255, 255, 255, 0.42)',
        '--glass-bg-hover': 'rgba(255, 255, 255, 0.55)',
        '--glass-border': 'rgba(255, 255, 255, 0.85)',
        '--glass-border-bright': 'rgba(255, 255, 255, 1)',
        '--glass-header-bg': 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(220,245,255,0.45) 100%)',
        '--glass-header-text': '#034870',
        '--aero-accent': '#22c55e',
        '--text-primary': '#ffffff',
        '--text-shadow': '0 2px 6px rgba(10, 45, 10, 0.85), 0 1px 3px rgba(0, 0, 0, 0.9)',
        '--gadget-shadow': '0 16px 40px rgba(10, 50, 15, 0.45)',
        '--input-bg': 'rgba(255, 255, 255, 0.7)',
        '--input-color': '#003311',
        '--taskbar-bg': 'linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, rgba(200,240,220,0.55) 100%)'
      }
    },
    'vista-aurora': {
      id: 'vista-aurora',
      name: 'Windows Vista Aurora Classic',
      subgenre: 'aero',
      subgenreName: 'Frutiger Aero',
      wallpaper: 'wallpapers/windows-vista.jpg',
      description: 'Official 2006 Windows Vista RTM default emerald and deep azure aurora light rays.',
      swatchGradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #1e40af 100%)',
      tone: 'vibrant',
      cssOverrides: {
        '--glass-bg': 'rgba(210, 245, 255, 0.28)',
        '--glass-bg-hover': 'rgba(230, 250, 255, 0.42)',
        '--glass-border': 'rgba(255, 255, 255, 0.75)',
        '--glass-border-bright': 'rgba(255, 255, 255, 0.98)',
        '--glass-header-bg': 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(180,230,255,0.4) 100%)',
        '--glass-header-text': '#023859',
        '--aero-accent': '#1aabf0',
        '--text-primary': '#ffffff',
        '--text-shadow': '0 2px 6px rgba(0, 20, 50, 0.85), 0 1px 3px rgba(0, 0, 0, 0.9)',
        '--gadget-shadow': '0 16px 40px rgba(0, 25, 60, 0.45)',
        '--input-bg': 'rgba(255, 255, 255, 0.65)',
        '--input-color': '#002244',
        '--taskbar-bg': 'linear-gradient(to bottom, rgba(220,245,255,0.35) 0%, rgba(140,205,245,0.45) 100%)'
      }
    },
    'aero-tech-globe': {
      id: 'aero-tech-globe',
      name: 'Aero Tech-Optimism (3D Earth)',
      subgenre: 'aero',
      subgenreName: 'Frutiger Aero',
      wallpaper: 'wallpapers/frutiger-aero-asadal-stock-197.jpg',
      description: 'Authentic 2000s Asadal Korean stock: 3D metallic green Earth, clean water ribbon, and futuristic city.',
      swatchGradient: 'linear-gradient(135deg, #00b4d8 0%, #22c55e 50%, #0369a1 100%)',
      tone: 'vibrant',
      cssOverrides: {
        '--glass-bg': 'rgba(235, 252, 255, 0.35)',
        '--glass-bg-hover': 'rgba(245, 255, 255, 0.48)',
        '--glass-border': 'rgba(255, 255, 255, 0.82)',
        '--glass-border-bright': 'rgba(255, 255, 255, 1)',
        '--glass-header-bg': 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(200,245,235,0.4) 100%)',
        '--glass-header-text': '#024430',
        '--aero-accent': '#00b4d8',
        '--text-primary': '#ffffff',
        '--text-shadow': '0 2px 6px rgba(0, 30, 40, 0.85), 0 1px 3px rgba(0, 0, 0, 0.9)',
        '--gadget-shadow': '0 16px 40px rgba(0, 40, 50, 0.45)',
        '--input-bg': 'rgba(255, 255, 255, 0.7)',
        '--input-color': '#003322',
        '--taskbar-bg': 'linear-gradient(to bottom, rgba(240,255,250,0.4) 0%, rgba(160,230,220,0.5) 100%)'
      }
    },

    /* === 2. FRUTIGER AQUA === */
    'aqua-reef': {
      id: 'aqua-reef',
      name: 'Aqua Marine Tropical Reef',
      subgenre: 'aqua',
      subgenreName: 'Frutiger Aqua',
      wallpaper: 'wallpapers/aquarium.png',
      description: 'Authentic high-resolution coral reef aquarium with glowing turquoise water and swimming angelfish.',
      swatchGradient: 'linear-gradient(135deg, #00d2ff 0%, #0077b6 50%, #03045e 100%)',
      tone: 'ocean',
      cssOverrides: {
        '--glass-bg': 'rgba(180, 240, 255, 0.32)',
        '--glass-bg-hover': 'rgba(210, 248, 255, 0.45)',
        '--glass-border': 'rgba(255, 255, 255, 0.85)',
        '--glass-border-bright': 'rgba(255, 255, 255, 1)',
        '--glass-header-bg': 'linear-gradient(to bottom, rgba(220,250,255,0.85) 0%, rgba(130,220,255,0.35) 100%)',
        '--glass-header-text': '#013a63',
        '--aero-accent': '#00b4d8',
        '--text-primary': '#ffffff',
        '--text-shadow': '0 2px 8px rgba(0, 20, 70, 0.9), 0 0 12px rgba(0, 180, 216, 0.5)',
        '--gadget-shadow': '0 16px 40px rgba(0, 30, 80, 0.5)',
        '--input-bg': 'rgba(255, 255, 255, 0.7)',
        '--input-color': '#012a4a',
        '--taskbar-bg': 'linear-gradient(to bottom, rgba(180,240,255,0.38) 0%, rgba(0,119,182,0.45) 100%)'
      }
    },
    'aqua-pool': {
      id: 'aqua-pool',
      name: 'Aqua Y2K Pool Sanctuary',
      subgenre: 'aqua',
      subgenreName: 'Frutiger Aqua',
      wallpaper: 'wallpapers/archpool.png',
      description: 'Pristine indoor architectural pool with sparkling turquoise caustic water ripples and glass skylight.',
      swatchGradient: 'linear-gradient(135deg, #48cae4 0%, #0096c7 50%, #0077b6 100%)',
      tone: 'ocean',
      cssOverrides: {
        '--glass-bg': 'rgba(220, 250, 255, 0.35)',
        '--glass-bg-hover': 'rgba(240, 255, 255, 0.5)',
        '--glass-border': 'rgba(255, 255, 255, 0.88)',
        '--glass-border-bright': 'rgba(255, 255, 255, 1)',
        '--glass-header-bg': 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(180,240,255,0.4) 100%)',
        '--glass-header-text': '#005073',
        '--aero-accent': '#0096c7',
        '--text-primary': '#ffffff',
        '--text-shadow': '0 2px 6px rgba(0, 35, 65, 0.85), 0 1px 3px rgba(0, 0, 0, 0.9)',
        '--gadget-shadow': '0 16px 40px rgba(0, 40, 80, 0.45)',
        '--input-bg': 'rgba(255, 255, 255, 0.72)',
        '--input-color': '#00334e',
        '--taskbar-bg': 'linear-gradient(to bottom, rgba(220,250,255,0.4) 0%, rgba(72,202,228,0.45) 100%)'
      }
    },

    /* === 3. FRUTIGER ECO === */
    'eco-arcology': {
      id: 'eco-arcology',
      name: 'Eco-Arcology Meadow',
      subgenre: 'eco',
      subgenreName: 'Frutiger Eco',
      wallpaper: 'wallpapers/frutiger-aero-asadal-stock-66.jpg',
      description: 'Authentic 2000s Asadal Korean stock: Rolling sunlit lawn, futuristic glass skyscrapers, and clear blue sky.',
      swatchGradient: 'linear-gradient(135deg, #86efac 0%, #22c55e 50%, #0284c7 100%)',
      tone: 'light',
      cssOverrides: {
        '--glass-bg': 'rgba(245, 255, 248, 0.42)',
        '--glass-bg-hover': 'rgba(255, 255, 255, 0.55)',
        '--glass-border': 'rgba(255, 255, 255, 0.88)',
        '--glass-border-bright': 'rgba(255, 255, 255, 1)',
        '--glass-header-bg': 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(210,250,225,0.45) 100%)',
        '--glass-header-text': '#046a38',
        '--aero-accent': '#16a34a',
        '--text-primary': '#ffffff',
        '--text-shadow': '0 2px 6px rgba(10, 45, 15, 0.9), 0 1px 3px rgba(0, 0, 0, 0.9)',
        '--gadget-shadow': '0 16px 40px rgba(10, 45, 20, 0.45)',
        '--input-bg': 'rgba(255, 255, 255, 0.72)',
        '--input-color': '#024220',
        '--taskbar-bg': 'linear-gradient(to bottom, rgba(245,255,248,0.45) 0%, rgba(180,240,200,0.5) 100%)'
      }
    },

    /* === 4. DARK AERO === */
    'dark-aero': {
      id: 'dark-aero',
      name: 'Dark Aero Vista Ultimate',
      subgenre: 'dark',
      subgenreName: 'Dark Aero',
      wallpaper: 'wallpapers/dark-aero-ultimate.png',
      description: 'Official Windows Vista Ultimate Extras obsidian dark acrylic glass with bioluminescent emerald aurora rays.',
      swatchGradient: 'linear-gradient(135deg, #091a24 0%, #0d3b4c 50%, #06b6d4 100%)',
      tone: 'dark',
      cssOverrides: {
        '--glass-bg': 'rgba(12, 28, 42, 0.68)',
        '--glass-bg-hover': 'rgba(18, 42, 64, 0.78)',
        '--glass-border': 'rgba(77, 201, 246, 0.55)',
        '--glass-border-bright': 'rgba(125, 221, 255, 0.95)',
        '--glass-header-bg': 'linear-gradient(to bottom, rgba(16,44,66,0.9) 0%, rgba(8,24,36,0.7) 100%)',
        '--glass-header-text': '#67e8f9',
        '--aero-accent': '#06b6d4',
        '--text-primary': '#ffffff',
        '--text-shadow': '0 2px 6px rgba(0, 0, 0, 0.95), 0 0 10px rgba(6, 182, 212, 0.6)',
        '--gadget-shadow': '0 20px 48px rgba(0, 10, 20, 0.75), 0 0 20px rgba(6, 182, 212, 0.25)',
        '--input-bg': 'rgba(10, 25, 40, 0.8)',
        '--input-color': '#e0f7ff',
        '--taskbar-bg': 'linear-gradient(to bottom, rgba(15,35,55,0.75) 0%, rgba(5,15,25,0.85) 100%)'
      }
    },

    /* === 5. DORFIC === */
    'dorfic-strands': {
      id: 'dorfic-strands',
      name: 'Dorfic Organic Strands',
      subgenre: 'dorfic',
      subgenreName: 'Dorfic',
      wallpaper: 'wallpapers/dorfic-strands.png',
      description: 'Official Windows Vista Ultimate Extras flowing vector ribbons, organic curves, and deep midnight indigo glow.',
      swatchGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #38bdf8 100%)',
      tone: 'dark',
      cssOverrides: {
        '--glass-bg': 'rgba(18, 24, 48, 0.65)',
        '--glass-bg-hover': 'rgba(28, 38, 72, 0.76)',
        '--glass-border': 'rgba(129, 140, 248, 0.55)',
        '--glass-border-bright': 'rgba(165, 180, 252, 0.9)',
        '--glass-header-bg': 'linear-gradient(to bottom, rgba(30,35,70,0.9) 0%, rgba(15,18,40,0.7) 100%)',
        '--glass-header-text': '#c7d2fe',
        '--aero-accent': '#818cf8',
        '--text-primary': '#ffffff',
        '--text-shadow': '0 2px 6px rgba(0, 0, 0, 0.95), 0 0 12px rgba(129, 140, 248, 0.5)',
        '--gadget-shadow': '0 20px 48px rgba(5, 8, 25, 0.75), 0 0 20px rgba(129, 140, 248, 0.2)',
        '--input-bg': 'rgba(15, 20, 45, 0.8)',
        '--input-color': '#e0e7ff',
        '--taskbar-bg': 'linear-gradient(to bottom, rgba(20,28,60,0.75) 0%, rgba(10,12,30,0.85) 100%)'
      }
    },

    /* === 6. FRUTIGER METRO === */
    'metro-zune': {
      id: 'metro-zune',
      name: 'Frutiger Metro (Zune Legacy)',
      subgenre: 'metro',
      subgenreName: 'Frutiger Metro',
      wallpaper: 'wallpapers/frutiger-metro-zune.png',
      description: 'Authentic 2007-2009 Zune aesthetic: Sharp geometric typography, luminous translucent overlays, and magenta accents.',
      swatchGradient: 'linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #f43f5e 100%)',
      tone: 'dark',
      cssOverrides: {
        '--glass-bg': 'rgba(24, 24, 27, 0.65)',
        '--glass-bg-hover': 'rgba(39, 39, 42, 0.78)',
        '--glass-border': 'rgba(244, 63, 94, 0.55)',
        '--glass-border-bright': 'rgba(251, 113, 133, 0.95)',
        '--glass-header-bg': 'linear-gradient(to bottom, rgba(45,45,50,0.9) 0%, rgba(20,20,24,0.7) 100%)',
        '--glass-header-text': '#fecdd3',
        '--aero-accent': '#f43f5e',
        '--text-primary': '#ffffff',
        '--text-shadow': '0 2px 6px rgba(0, 0, 0, 0.95), 0 0 10px rgba(244, 63, 94, 0.5)',
        '--gadget-shadow': '0 20px 48px rgba(0, 0, 0, 0.8), 0 0 18px rgba(244, 63, 94, 0.25)',
        '--input-bg': 'rgba(30, 30, 35, 0.82)',
        '--input-color': '#ffe4e6',
        '--taskbar-bg': 'linear-gradient(to bottom, rgba(30,30,35,0.8) 0%, rgba(15,15,18,0.9) 100%)'
      }
    },

    /* === 7. FRUTIGER ZEN === */
    'zen-garden': {
      id: 'zen-garden',
      name: 'Zen Garden Willow Pond',
      subgenre: 'zen',
      subgenreName: 'Frutiger Zen',
      wallpaper: 'wallpapers/frutiger-aero-asadal-stock-137.jpg',
      description: 'Authentic 2000s Asadal Korean stock: Tranquil wooden bench, weeping willows, calm lily pond, and cottage.',
      swatchGradient: 'linear-gradient(135deg, #a7f3d0 0%, #34d399 50%, #059669 100%)',
      tone: 'light',
      cssOverrides: {
        '--glass-bg': 'rgba(240, 253, 245, 0.42)',
        '--glass-bg-hover': 'rgba(250, 255, 250, 0.55)',
        '--glass-border': 'rgba(255, 255, 255, 0.88)',
        '--glass-border-bright': 'rgba(255, 255, 255, 1)',
        '--glass-header-bg': 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(200,245,220,0.45) 100%)',
        '--glass-header-text': '#065f46',
        '--aero-accent': '#059669',
        '--text-primary': '#ffffff',
        '--text-shadow': '0 2px 6px rgba(5, 45, 30, 0.85), 0 1px 3px rgba(0, 0, 0, 0.9)',
        '--gadget-shadow': '0 16px 40px rgba(5, 40, 25, 0.45)',
        '--input-bg': 'rgba(255, 255, 255, 0.72)',
        '--input-color': '#064e3b',
        '--taskbar-bg': 'linear-gradient(to bottom, rgba(240,253,245,0.45) 0%, rgba(167,243,208,0.5) 100%)'
      }
    }
  },

  currentTheme: 'bliss-4k',

  aliases: {
    'bliss': 'bliss-4k',
    'aqua-marine': 'aqua-reef',
    'vista': 'vista-aurora',
    'eco': 'eco-arcology',
    'eco-biophilia': 'eco-arcology',
    'minimalist-dusk': 'dark-aero'
  },

  apply: function(themeId, isPreset = false) {
    if (this.aliases[themeId]) themeId = this.aliases[themeId];
    const theme = this.definitions[themeId] || this.definitions['bliss-4k'];
    this.currentTheme = theme.id;

    const root = document.documentElement;
    const body = document.body;

    // Set Tone & Subgenre attributes on body for adaptive CSS rules
    body.setAttribute('data-theme-tone', theme.tone || 'light');
    body.setAttribute('data-theme-subgenre', theme.subgenre || 'aero');
    body.setAttribute('data-theme-id', theme.id);

    if (theme.cssOverrides) {
      Object.entries(theme.cssOverrides).forEach(([prop, val]) => {
        root.style.setProperty(prop, val);
      });
    }

    if (window.BackgroundEngine && typeof window.BackgroundEngine.setTheme === 'function') {
      window.BackgroundEngine.setTheme(theme, isPreset);
    }

    // Save to storage
    if (window.AeroStorage) {
      AeroStorage.set('theme', theme.id);
    }

    // Update active highlight in theme selector
    document.querySelectorAll('.theme-card').forEach(card => {
      card.classList.toggle('active', card.dataset.themeId === theme.id);
    });
  }
};

window.Themes = Themes;
