import { Suspense } from 'react'
import SurveyForm from '@/components/survey-form'

export default function SurveyPage() {
  return (
    <Suspense fallback={null}>
      <SurveyForm />
    </Suspense>
  )
}
