import React, { useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createBreakpoints } from '@mui/system';
import '@mui/lab/themeAugmentation';
import '@mui/x-data-grid/themeAugmentation';

import { ReactComponent as CheckboxOff } from '../assets/icons/checkbox-off.svg';
import { ReactComponent as CheckBoxOn } from '../assets/icons/checkbox-on.svg';
import { ReactComponent as ExpandMore } from '../assets/icons/expand_more.svg';

const breakpoints = createBreakpoints({})
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    secondary: true;
  }
}


export const MainTheme = ({ children }: any) => {
  const theme = useMemo(
    () => createTheme({
      palette: {
        // palette values for light mode
        primary: {
          main: '#36CB83',
          light: 'rgba(54, 203, 131, .5)'
        },
        error: {
          main: '#F1404B'
        },
        warning: {
          main: '#F07810'
        },
        info: {
          main: '#EEC60A'
        },
        success: {
          main: '#36CB83',
        },
        text: {
          primary: '#1A324A',
        },
      },
      typography: {
        fontFamily: [
          '"Overpass"',
          'sans-serif',
        ].join(','),
        htmlFontSize: 16,
        fontWeightRegular: 500,
        button: {
          textTransform: 'none',
        },
        h1: {
          fontSize: 28,
          fontWeight: 'bold',
          lineHeight: '35px',
        },
        h2: {
          fontSize: 24,
          fontWeight: 'bold',
          lineHeight: '28px',
        },
        h3: {
          fontSize: 22,
          fontWeight: 'bold',
          lineHeight: '28px',
        },
        h4: {
          fontSize: 18,
          fontWeight: 'bold',
          lineHeight: '26px',
        },
        h5: {
          fontSize: 18,
          fontWeight: '600',
          lineHeight: '26px',
        },
        body1: {
          fontSize: 16,
          lineHeight: '24px',
          fontWeight: '500',
        }
      },
      components: {
        MuiTypography: {
          styleOverrides: {
            root: {
              color: '#222',
            }
          }
        },
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              borderRadius: '4px',
              textTransform: 'none',
              lineHeight: '22px',
            },

          },
          variants: [
            {
              props: { size: 'small' },
              style: {
                fontSize: 14,
                fontWeight: 700,
                padding: '8px 14px',
              }
            },
            {
              props: { size: 'medium' },
              style: {
                fontSize: 14,
                fontWeight: 700,
                padding: '8px 14px',
              }
            },
            {
              props: { size: 'large' },
              style: {
                fontSize: 16,
                fontWeight: 700,
                padding: '14px',
              }
            },
            {
              props: { variant: 'contained' },
              style: {
                color: '#fff',
                backgroundColor: 'rgba(30, 190, 113, 1)',
                ':disabled': {
                  color: '#fff',
                  backgroundColor: 'rgba(30, 190, 113, 1)',
                  opacity: 0.2,
                },
              }
            },
            {
              props: { variant: 'secondary' },
              style: {
                color: '#36CB83',
                backgroundColor: 'rgba(30, 190, 113, .1)',
                ':disabled': {
                  color: '#36CB83',
                  backgroundColor: 'rgba(30, 190, 113, .4)',
                  opacity: 0.1,
                },
              }
            },
            {
              props: { variant: 'text' },
              style: {
                color: 'rgba(30, 190, 113, 1)',
                backgroundColor: 'transparent',
                ':disabled': {
                  color: 'rgba(30, 190, 113, 1)',
                  backgroundColor: 'rgba(30, 190, 113, 1)',
                  opacity: 0.1,
                },
                ':hover': {
                  backgroundColor: 'transparent',
                }
              }
            },
          ],
        },
        MuiFormControl: {
          styleOverrides: {
            root: {
              width: '100%',
            },
          },
        },
        MuiStep: {
          styleOverrides: {
            root: {
              text: {
                fontSize: 12,
                lineHeight: '0',
                fontWeight: 'bold',
                fill: '#36CB83',
              },
              '.MuiSvgIcon-root': {
                fill: 'rgba(54, 203, 131, .1)',
                height: '40px',
                width: '40px',
                color: 'red',
              },
              '.MuiStepLabel-label': {
                fontWeight: '700',
                color: '#C0C0C0',
                marginTop: '10px',
              }
            },
          },
          variants: [
            {
              props: { active: true },
              style: {
                text: {
                  fontSize: 12,
                  lineHeight: '0',
                  fontWeight: 'bold',
                  fill: '#fff',
                },
                '.MuiSvgIcon-root': {
                  fill: 'rgba(54, 203, 131, 1)',
                  height: '40px',
                  width: '40px',
                },
                '.MuiStepLabel-label': {
                  fontWeight: '700',
                  color: '#222',
                  marginTop: '10px',
                }
              },
            },
            {
              props: { completed: true },
              style: {
                text: {
                  fontSize: 12,
                  lineHeight: '0',
                  fontWeight: 'bold',
                  fill: '#fff',
                },
                '.MuiSvgIcon-root': {
                  fill: 'rgba(54, 203, 131, 1)',
                  height: '40px',
                  width: '40px',
                },
                '.MuiStepLabel-label': {
                  fontWeight: '700',
                  color: '#222',
                  marginTop: '10px',
                }
              }
            }
          ],
        },
        MuiStepConnector: {
          styleOverrides: {
            root: {
              top: '19px;',
              left: 'calc(-50% + 30px)',
              right: 'calc(50% + 30px)',
            },
            line: {
              borderColor: 'rgba(54, 203, 131, .1)',
              borderWidth: '2px',
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: '4px',
              border: 'none',
              color: '#aeaeae',
              endAdornment: {
                color: '#222',
              },
            },
            input: {
              padding: '10px 13px',
              color: '#222',
              lineHeight: '24px',
              height: 'unset',
              ':placeholder': {
                color: '#999',
              },
            },
          }
        },
        MuiAutocomplete: {
          defaultProps: {
            popupIcon: <ExpandMore />,
          },
          styleOverrides: {
            root: {
              '.MuiOutlinedInput-root': {
                padding: '3px 8px',
              },
            },
          }
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              ':hover': {
                backgroundColor: '#EBFAF3',
              }
            },
          },
        },
        MuiChip: {
          variants: [
            {
              props: { color: 'success' },
              style: {
                color: '#80B918',
                backgroundColor: 'rgba(128, 185, 24, 0.1)',
                borderRadius: '5px',
              }
            },
            {
              props: { color: 'warning' },
              style: {
                color: '#EEC60A',
                backgroundColor: 'rgba(238, 198, 10, 0.1)',
                borderRadius: '5px',
              }
            },
            {
              props: { color: 'secondary' },
              style: {
                color: '#F07810',
                backgroundColor: 'rgba(240, 120, 16, 0.1)',
                borderRadius: '5px',
              }
            },
            {
              props: { color: 'info' },
              style: {
                color: '#3366CC',
                backgroundColor: 'rgba(51, 102, 204, 0.1)',
                borderRadius: '5px',
              }
            },
            {
              props: { color: 'error' },
              style: {
                color: '#F1404B',
                backgroundColor: 'rgba(241, 64, 75, 0.1)',
                borderRadius: '5px',
                fontWeight: 500,
              }
            },
            {
              props: { color: 'default' },
              style: {
                borderRadius: '5px',
                fontWeight: 500,
              }
            },
          ],
          styleOverrides: {
            root: {
              lineHeight: '16px',
              fontSize: '14px',
            }
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              fontSize: 16,
              lineHeight: '24px',
              color: '#222',
              marginBottom: '5px',
            }
          },
        },
        MuiFormHelperText: {
          styleOverrides: {
            root: {
              marginLeft: 'auto',
              marginRight: '0px',
            }
          }
        },
        MuiSelect: {
          defaultProps: {
            IconComponent: ExpandMore,
          },
          styleOverrides: {
            outlined: {
              lineHeight: '22px',

            },
            icon: {
              top: 'unset',
            }
          }
        },
        MuiLink: {
          styleOverrides: {
            root: {
              color: '#36CB83',
              textDecoration: 'none',
              fontSize: 16,
              lineHeight: '24px',
              fontStyle: 'normal',
              fontFamily: 'Overpass, sans-serif',
            },
          },
        },
        MuiAvatar: {
          styleOverrides: {
            root: {
              lineHeight: 'unset',
              backgroundColor: 'rgba(54, 203, 131, .1)',
              color: '#36CB83',
            }
          }
        },
        MuiCheckbox: {
          defaultProps: {
            disableRipple: true,
            icon: <CheckboxOff />,
            indeterminateIcon: <CheckBoxOn />,
            checkedIcon: <CheckBoxOn />,
          },
        },
        MuiDataGrid: {
          styleOverrides: {
            root: {
              border: 'none',
              maxWidth: '100%',
              overflowX: 'hidden',
            },
            row: {
              position: 'relative',
              overflow: 'hidden',
              ':hover': {
                backgroundColor: '#fff',
                border: 'border: 1px solid #E7E7E7',
                ':before': {
                  content: '""',
                  position: 'absolute',
                  left: '0',
                  height: '100%',
                  width: '3px',
                  backgroundColor: '#36CB83',
                }
              },
            },
            columnHeaders: {
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '13px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
            },
            columnHeaderTitle: {
              fontWeight: '700',
              letterSpacing: '0.5px',
            },
            columnSeparator: {
              display: 'none',
            },
            cell: {
              maxHeight: '75px',
              height: '100%',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: '500',
              padding: '20px 10px',
              borderBottom: 'none',
              borderRadius: '4px',
            },
            virtualScroller: {
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                display: 'none',
              }
            },
            footerContainer: {
              '.MuiTablePagination-root': {
                flex: 1,
              },
              '.MuiTablePagination-spacer': {
                display: 'none',
              },
              '.MuiTablePagination-displayedRows': {
                marginLeft: 'auto',
              },
            },
          }
        },
        MuiCssBaseline: {
          styleOverrides: {
            html: {
              minHeight: '100vh',
              width: '100vw',
              height: '100%',
              overflowX: 'hidden',
            },
            body: {
              height: '100%',
              width: '100%',
              overflowY: 'scroll',
              textarea: {
                padding: '0!important',
              },
              lineHeight: 'normal',
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
