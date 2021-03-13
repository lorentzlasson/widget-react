import { WritableDraft } from 'immer/dist/internal'

import { Cause } from '../../@types/import/content/organizations.types'
import { ShareType } from '../../constants/enums/ShareType'
import { roundRobinUpdateValueAtIndex } from '../../utils/donationUtils'

import {
  BaseDistribution,
  CauseDistribution,
  OrganizationDistribution,
} from './donation.types'

export function resetDistributionsHelper(causesData: Cause[]) {
  let totalCauseShareLeft = 100

  return causesData.map((cause) => {
    const share = Math.max(
      totalCauseShareLeft - cause.standardShare,
      cause.standardShare
    )

    totalCauseShareLeft -= share

    let totalOrganizationShareLeft = 100
    const nbrOfOrganizations = cause.organizations.length

    const causeDistribution: CauseDistribution = {
      id: cause.id,

      share,
      shareType: ShareType.Standard,

      lastOrganizationRoundRobinIndex: 0,

      organizationsDistribution: cause.organizations.map(
        (organization, index) => {
          const isLast = index === nbrOfOrganizations - 1

          const startShare = isLast
            ? totalOrganizationShareLeft
            : Math.min(
                totalOrganizationShareLeft,
                Math.round(100 / nbrOfOrganizations)
              )

          totalOrganizationShareLeft -= startShare

          const organizationDistribution: OrganizationDistribution = {
            id: organization.id,
            share: startShare,
          }

          return organizationDistribution
        }
      ),
    }

    return causeDistribution
  })
}

export function updateDistributionsHelper(
  distributions: BaseDistribution[],
  updatedId: BaseDistribution['id'],
  updatedValue: number,
  lastRoundRobinIndex: number
) {
  const itemIndex = distributions.findIndex((item) => item.id === updatedId)

  if (itemIndex === -1) {
    return null
  }

  const currentValues = distributions.map((item) => item.share)

  return roundRobinUpdateValueAtIndex(
    currentValues,
    itemIndex,
    updatedValue,
    lastRoundRobinIndex
  )
}

export function updateDistributionValuesHelper(
  distributions: WritableDraft<BaseDistribution>[],
  values: number[]
) {
  distributions.forEach((item, index) => {
    item.share = values[index]
  })
}
