import { DonorType } from '../../constants/enums/DonorType'
import { PaymentMethod } from '../../constants/enums/PaymentMethod'
import { DonationFrequency } from '../../constants/enums/RecurringDonation'
import { ShareType } from '../../constants/enums/ShareType'

export interface DonationState {
  recurring: DonationFrequency

  method: PaymentMethod | null

  donorType: DonorType
  donor?: Donor

  sum: number | null

  lastCauseRoundRobinIndex: number
  causesDistribution: CauseDistribution[]
  chosenOrganizationId?: string
  chosenCauseId?: string
}

export interface Donor {
  name: string
  email: string
  approvesPrivacyPolicy: boolean
  newsletter: boolean
}

export interface DonorIndividual extends Donor {
  taxDeduction: boolean
  ssn: string
}

export interface DonorCompany extends Donor {
  companyName: string
  organizationNumber: string
}

export interface BaseDistribution {
  id: string
  name: string
  isLocked: boolean
  share: number
  sum: number
}

export interface CauseDistribution extends BaseDistribution {
  shareType: ShareType
  lastOrganizationRoundRobinIndex: number
  organizationsDistribution: OrganizationDistribution[]
}

export type OrganizationDistribution = BaseDistribution
