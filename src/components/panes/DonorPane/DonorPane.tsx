import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Validate from 'validator'

import { DonorType } from '../../../constants/enums/DonorType'
import useAllTexts from '../../../hooks/content/useAllTexts'
import useTypedDispatch from '../../../hooks/store/useTypedDispatch'
import useTypedSelector from '../../../hooks/store/useTypedSelector'
import { donationActions } from '../../../store/donation/donation.slice'
import { DonorInput } from '../../../store/state'
import { uiActions } from '../../../store/ui/ui.slice'
import { NavigationButtons } from '../../shared/Buttons/NavigationButtons'
import ErrorField from '../../shared/Error/ErrorField'
import { TextInput } from '../../shared/Input/TextInput'
import { RichSelect } from '../../shared/RichSelect/RichSelect'
import { RichSelectOption } from '../../shared/RichSelect/RichSelectOption'
import { ToolTip } from '../../shared/ToolTip/ToolTip'
import ActionString from '../../shared/_functional/ActionString'
import {
  InputFieldWrapper,
  SmallInputFieldWrapper,
  Container,
  CheckboxLabel,
  CheckBox,
  CheckboxWrapper,
} from '../Forms.style'
import { PrimaryLink, Pane } from '../Panes.style'

interface DonorFormValues extends DonorInput {
  privacyPolicy: boolean
}

export function DonorPane() {
  const dispatch = useTypedDispatch()
  const initialDonorType = useTypedSelector((state) => state.donation.donorType)
  const [selectedDonorType, setDonorType] = useState<DonorType>(
    initialDonorType
  )
  const donor = useTypedSelector((state) => state.donation.donor)

  const texts = useAllTexts()
  const paneTexts = texts.donations.donor
  const isAnonymous = selectedDonorType === DonorType.Anonymous

  const { register, watch, errors, handleSubmit } = useForm<DonorFormValues>({
    defaultValues: isAnonymous
      ? {}
      : {
          name: donor?.name,
          email: donor?.email,
          taxDeduction: donor?.taxDeduction,
          ssn: donor?.taxDeduction ? donor?.ssn : undefined,
          newsletter: donor?.newsletter,
          approvesPrivacyPolicy: donor?.approvesPrivacyPolicy,
        },
  })

  const watchAllFields = watch()

  const isNameInvalid = Boolean(errors.name)
  const isEmailInvalid = Boolean(errors.email)
  const isSsnInvalid = Boolean(errors.ssn)
  const isPrivacyPolicyInvalid = Boolean(errors.privacyPolicy)

  const isNextDisabled = !isAnonymous && Object.keys(errors).length > 0

  function onFormSubmit(formValues: DonorFormValues) {
    let donorInfo: Required<DonorInput>
    if (isAnonymous) {
      donorInfo = { ...paneTexts.anonymousDonor }
    } else {
      donorInfo = {
        name: formValues.name ?? '',
        email: formValues.email ?? '',
        taxDeduction: formValues.taxDeduction ?? false,
        ssn: formValues.ssn ?? -1,
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
                name="name"
                type="text"
                placeholder={paneTexts.namePlaceholder}
                innerRef={register({ required: !isAnonymous, minLength: 1 })}
                valid={!isNameInvalid}
              />
              {isNameInvalid && <ErrorField text={paneTexts.nameError} />}

              <TextInput
                name="email"
                inputMode="email"
                type="text"
                placeholder={paneTexts.emailPlaceholder}
                innerRef={register({
                  required: !isAnonymous,
                  validate: (val) => Validate.isEmail(val),
                })}
                valid={!isEmailInvalid}
              />
              {isEmailInvalid && <ErrorField text={paneTexts.emailError} />}
            </InputFieldWrapper>

            <Container>
              <CheckboxWrapper>
                <CheckBox name="taxDeduction" type="checkbox" ref={register} />

                <CheckboxLabel>{paneTexts.taxDeductionLabel}</CheckboxLabel>

                <ToolTip
                  text={paneTexts.taxDeductionTooltip}
                  link={paneTexts.taxDeductionLink}
                />
              </CheckboxWrapper>

              {watch('taxDeduction') && (
                <SmallInputFieldWrapper>
                  <TextInput
                    name="ssn"
                    type="number"
                    inputMode="numeric"
                    placeholder={paneTexts.ssnPlaceholder}
                    innerRef={register({
                      required: false,
                      validate: (val) =>
                        !watchAllFields.taxDeduction ||
                        (Validate.isInt(val) &&
                          Validate.isLength(val, { min: 9, max: 11 })),
                    })}
                    valid={!isSsnInvalid}
                  />

                  {isSsnInvalid && <ErrorField text={paneTexts.ssnError} />}
                </SmallInputFieldWrapper>
              )}

              <CheckboxWrapper>
                <CheckBox
                  name="privacyPolicy"
                  type="checkbox"
                  ref={register({ required: !isAnonymous })}
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
                <CheckBox name="newsletter" type="checkbox" ref={register} />
                <CheckboxLabel>{paneTexts.newsletterLabel}</CheckboxLabel>
              </CheckboxWrapper>
            </Container>
          </RichSelectOption>

          <RichSelectOption
            label={paneTexts.donateAnonymouslyLabel}
            value={DonorType.Anonymous}
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
