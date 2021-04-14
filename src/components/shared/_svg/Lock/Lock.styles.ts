import { css } from '../../../../styles/stitches.config'

export const locked = css({
  opacity: 1,
})

export const unLocked = css({
  opacity: 0.5,
  '&:hover': { opacity: 1 },
})

export const disabled = css({
  opacity: 0.3,
  cursor: 'unset',
})
