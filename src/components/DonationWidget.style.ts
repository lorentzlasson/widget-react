import { styled } from '../styles/stitches.config'

export const DonationWidgetWrapper = styled('div', {
  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
  fontFamily: 'Roboto,Arial,sans-serif',
  fontWeight: 300,

  '& *, & ::after, & ::before': {
    boxSizing: 'border-box',
  },
})
