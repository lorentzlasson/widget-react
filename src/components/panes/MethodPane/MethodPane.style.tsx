import { styled } from '../../../styles/stitches.config'
import { pxToRem } from '../../../utils/styleUtils'

export const MethodWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

export const TextWrapper = styled('div', {
  display: 'flex',
  marginBottom: '$s100',
  marginTop: '$s100',
})

export const InfoText = styled('p', {
  color: '$grey20',
  fontSize: '$12',
  lineHeight: '150%',
  margin: 0,
})

export const MethodButton = styled('button', {
  alignItems: 'center',
  backgroundColor: '$white',
  border: 0,
  boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.15)',
  boxSizing: 'border-box',
  color: '$grey20',
  cursor: 'pointer',
  display: 'flex',
  height: pxToRem(80),
  justifyContent: 'flex-end',
  marginBottom: 15,
  position: 'relative',
  transition: 'box-shadow 90ms',
  userSelect: 'none',
  width: '100%',

  ':active': {
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  },

  '::after': {
    backgroundColor: '$primary100',
    content: '""',
    height: '30%',
    position: 'absolute',
    right: '$s100',
    top: '50%',
    transform: 'rotate(45deg)',
    transformOrigin: 'center top',
    width: 2,
  },

  '::before': {
    backgroundColor: '$primary100',
    bottom: '50%',
    content: '""',
    height: '30%',
    position: 'absolute',
    right: '$s100',
    transform: 'rotate(-45deg)',
    transformOrigin: 'center bottom',
    width: 2,
  },

  variants: {
    paymentType: {
      bank: {
        backgroundImage: `url('https://storage.googleapis.com/effekt-widget/assets/logos/bank.png')`,
        backgroundPosition: '16px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 120,
      },

      swish: {
        backgroundImage: `url('/images/swish-logotype.svg')`,
        backgroundPosition: '16px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 120,
      },
    },
  },
})

export const RecurringSelectWrapper = styled('div', {
  paddingBottom: 15,
  paddingTop: 10,
})
