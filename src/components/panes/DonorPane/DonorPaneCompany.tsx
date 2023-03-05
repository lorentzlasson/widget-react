import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Validate from 'validator'

import { DonorType } from '../../../constants/enums/DonorType'
import { PaymentMethod } from '../../../constants/enums/PaymentMethod'
import useAllTexts from '../../../hooks/content/useAllTexts'
import useTypedDispatch from '../../../hooks/store/useTypedDispatch'
import useTypedSelector from '../../../hooks/store/useTypedSelector'
import { donationActions } from '../../../store/donation/donation.slice'
import { DonorInputCompany } from '../../../store/state'
import { uiActions } from '../../../store/ui/ui.slice'
import { NavigationButtons } from '../../shared/Buttons/NavigationButtons'
import ErrorField from '../../shared/Error/ErrorField'
import TextInput from '../../shared/Input/TextInput'
import { PrimaryLink } from '../../shared/Link/PrimaryLink'
import { RichSelect } from '../../shared/RichSelect/RichSelect'
import { RichSelectOption } from '../../shared/RichSelect/RichSelectOption'
import ActionString from '../../shared/_functional/ActionString'
import {
  InputFieldWrapper,
  Container,
  CheckboxLabel,
  CheckBox,
  CheckboxWrapper,
} from '../Forms.style'
import { Pane } from '../Panes.style'

interface DonorFormValues extends DonorInputCompany {
  privacyPolicy: boolean
}

export function DonorPaneCompany() {
  const dispatch = useTypedDispatch()
  const initialDonorType = useTypedSelector((state) => state.donation.donorType)
  const [selectedDonorType, setDonorType] =
    useState<DonorType>(initialDonorType)
  const donor = useTypedSelector((state) => state.donation.donor)
  const paymentMethod = useTypedSelector((state) => state.donation.method)

  const texts = useAllTexts()
  const paneTexts = texts.donations.donor
  const isAnonymous = selectedDonorType === DonorType.Anonymous

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonorFormValues>({
    defaultValues: isAnonymous
      ? {}
      : {
          name: donor?.name,
          companyName: donor?.companyName,
          email: donor?.email,
          organizationNumber: donor?.organizationNumber,
          newsletter: donor?.newsletter,
          approvesPrivacyPolicy: donor?.approvesPrivacyPolicy,
        },
  })

  const isNameInvalid = Boolean(errors.name)
  const isCompanyNameInvalid = Boolean(errors.companyName)
  const isOrganizationNumberInvalid = Boolean(errors.organizationNumber)
  const isEmailInvalid = Boolean(errors.email)
  const isPrivacyPolicyInvalid = Boolean(errors.privacyPolicy)

  const isNextDisabled = !isAnonymous && Object.keys(errors).length > 0

  function onFormSubmit(formValues: DonorFormValues) {
    let donorInfo: Required<DonorInputCompany>
    if (isAnonymous) {
      donorInfo = { ...paneTexts.anonymousDonor }
    } else {
      donorInfo = {
        name: formValues.name ?? '',
        companyName: formValues.companyName ?? '',
        email: formValues.email ?? '',
        organizationNumber: formValues.organizationNumber ?? '',
        newsletter: formValues.newsletter ?? false,
        approvesPrivacyPolicy: formValues.privacyPolicy,
      }
    }
    dispatch(donationActions.setDonorType(selectedDonorType))
    dispatch(donationActions.setDonorInformation(donorInfo))
    dispatch(uiActions.goToNextStep())
  }

  const formId = 'donorForm'
  return (
    <Pane>
      <form id={formId} onSubmit={handleSubmit(onFormSubmit)}>
        <RichSelect
          name="donorType"
          selected={selectedDonorType}
          onChange={setDonorType}
        >
          <RichSelectOption
            label={paneTexts.personalInfoLabel}
            value={DonorType.Donor}
          >
            <InputFieldWrapper>
              <TextInput
                type="text"
                placeholder={paneTexts.namePlaceholder}
                {...register('name', { required: !isAnonymous, minLength: 1 })}
                valid={!isNameInvalid}
              />
              {isNameInvalid && <ErrorField text={paneTexts.nameError} />}

              <TextInput
                type="text"
                placeholder={paneTexts.companyNamePlaceholder}
                {...register('companyName', {
                  required: true,
                  minLength: 1,
                })}
                valid={!isCompanyNameInvalid}
              />

              {isCompanyNameInvalid && (
                <ErrorField text={paneTexts.companyNameError} />
              )}

              <TextInput
                type="text"
                placeholder={paneTexts.organizationNumberPlaceholder}
                {...register('organizationNumber', {
                  required: true,
                  validate: (val) =>
                    val && Validate.matches(val, /^(\d{1})(\d{5})\-(\d{4})$/),
                })}
                valid={!isOrganizationNumberInvalid}
              />

              {isOrganizationNumberInvalid && (
                <ErrorField text={paneTexts.organizationNumberError} />
              )}

              <TextInput
                inputMode="email"
                type="text"
                placeholder={paneTexts.emailPlaceholder}
                {...register('email', {
                  required: !isAnonymous,
                  validate: (val) => val && Validate.isEmail(val),
                })}
                valid={!isEmailInvalid}
              />
              {isEmailInvalid && <ErrorField text={paneTexts.emailError} />}
            </InputFieldWrapper>

            <Container>
              <CheckboxWrapper>
                <CheckBox
                  type="checkbox"
                  {...register('privacyPolicy', { required: !isAnonymous })}
                />

                <CheckboxLabel>
                  <ActionString value={paneTexts.privacyPolicyLabel}>
                    {(text, link) => (
                      <PrimaryLink
                        target="_blank"
                        rel="noopener noreferrer"
                        href={link}
                      >
                        {text}
                      </PrimaryLink>
                    )}
                  </ActionString>
                </CheckboxLabel>
              </CheckboxWrapper>

              {isPrivacyPolicyInvalid && (
                <ErrorField text={paneTexts.privacyPolicyError} />
              )}

              <CheckboxWrapper>
                <CheckBox type="checkbox" {...register('newsletter')} />
                <CheckboxLabel>{paneTexts.newsletterLabel}</CheckboxLabel>
              </CheckboxWrapper>
            </Container>
          </RichSelectOption>

          <RichSelectOption
            label={paneTexts.donateAnonymouslyLabel}
            value={DonorType.Anonymous}
            sublabel={
              isAnonymous && paymentMethod == PaymentMethod.Swish
                ? paneTexts.anonymousSwishInfo
                : undefined
            }
          />
        </RichSelect>
        <NavigationButtons
          isNextDisabled={isNextDisabled}
          formId={formId}
          nextButtonOnClick={() => {}}
        />
      </form>
    </Pane>
  )
}
