import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
				colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// procell design system colors
				'procell-primary': 'hsl(var(--procell-primary))',
				'procell-primary-light': 'hsl(var(--procell-primary-light))',
				'procell-secondary': 'hsl(var(--procell-secondary))',
				'procell-secondary-light': 'hsl(var(--procell-secondary-light))',
				'procell-accent': 'hsl(var(--procell-accent))',
				'procell-accent-light': 'hsl(var(--procell-accent-light))',
				// Blue gradient colors
				'gradient-blue-start': 'hsl(var(--gradient-blue-start))',
				'gradient-blue-mid': 'hsl(var(--gradient-blue-mid))',
				'gradient-blue-end': 'hsl(var(--gradient-blue-end))',
				'gradient-deep-start': 'hsl(var(--gradient-deep-start))',
				'gradient-deep-end': 'hsl(var(--gradient-deep-end))',
				'procell-neutral': 'hsl(var(--procell-neutral))',
				'procell-dark': 'hsl(var(--procell-dark))',
				'procell-light': 'hsl(var(--procell-light))',
				'procell-gray': 'hsl(var(--procell-gray))',
				'procell-success': 'hsl(var(--procell-success))',
				'procell-warning': 'hsl(var(--procell-warning))',
				'procell-error': 'hsl(var(--procell-error))',
				'procell-info': 'hsl(var(--procell-info))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
