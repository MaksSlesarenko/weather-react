import { createTheme, type Theme, alpha } from '@mui/material'

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

export function buildMuiTheme(mode: 'light' | 'dark'): Theme {
  const isDark = mode === 'dark'

  const blue = isDark ? '#0A84FF' : '#007AFF'
  const bg = isDark ? '#1C1C1E' : '#F5F5F7'
  const paper = isDark ? '#2C2C2E' : '#FFFFFF'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const inputFill = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
  const inputBorder = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.12)'
  const cardShadow = isDark
    ? '0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)'
    : '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)'

  return createTheme({
    palette: {
      mode,
      primary: { main: blue },
      background: { default: bg, paper },
    },

    typography: {
      fontFamily: SF,
      h1: { fontWeight: 700, letterSpacing: '-0.025em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
      h5: { fontWeight: 600, letterSpacing: '-0.012em' },
      h6: { fontWeight: 600, letterSpacing: '-0.01em' },
      body1: { letterSpacing: '-0.005em' },
      body2: { letterSpacing: '-0.003em' },
      overline: {
        letterSpacing: '0.07em',
        fontWeight: 600,
        fontSize: '0.68rem',
      },
      caption: { letterSpacing: '0.02em' },
    },

    shape: { borderRadius: 10 },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            backgroundColor: isDark ? 'rgba(28,28,30,0.78)' : 'rgba(245,245,247,0.78)',
            borderBottom: `1px solid ${border}`,
            boxShadow: 'none',
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${border}`,
            boxShadow: cardShadow,
            borderRadius: 12,
            transition: 'box-shadow 0.2s ease',
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'box-shadow 0.2s ease',
          },
          rounded: { borderRadius: 12 },
          elevation1: {
            border: `1px solid ${border}`,
            boxShadow: cardShadow,
          },
          elevation3: {
            border: `1px solid ${border}`,
            boxShadow: cardShadow,
          },
          elevation4: {
            border: `1px solid ${border}`,
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)'
              : '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: inputFill,
            transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: inputBorder,
              transition: 'border-color 0.15s ease',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)',
            },
            '&.Mui-focused': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
              boxShadow: `0 0 0 3px ${alpha(blue, isDark ? 0.28 : 0.18)}`,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: blue,
              borderWidth: '1.5px',
            },
          },
          input: {
            padding: '8px 12px',
            fontSize: '0.9375rem',
            '&::placeholder': {
              opacity: isDark ? 0.35 : 0.45,
            },
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'background-color 0.12s ease, opacity 0.12s ease',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            },
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '-0.003em',
          },
        },
      },

      MuiList: {
        styleOverrides: {
          root: { padding: '4px 0' },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '1px 4px',
            transition: 'background-color 0.12s ease',
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: { borderColor: border },
        },
      },

      MuiSnackbar: {
        styleOverrides: {
          root: { bottom: 24 },
        },
      },

      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backdropFilter: 'blur(20px)',
            backgroundColor: isDark ? 'rgba(58,58,60,0.95)' : 'rgba(50,50,52,0.92)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            color: '#FFFFFF',
          },
          action: {
            '& .MuiButton-root': {
              color: '#60A5FA',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(96,165,250,0.15)',
              },
            },
          },
        },
      },

      MuiSkeleton: {
        styleOverrides: {
          root: { borderRadius: 6 },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
    },
  })
}
