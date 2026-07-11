'use client';
import { useForm, FormProvider } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { setCookie } from 'cookies-next';
import { useSearchParams, useRouter } from 'next/navigation';
import StepRenderer from '@/components/stepRenderer';
import fbEvent, { gtagSendEvent } from '@/services/fbEvents';
import { info } from '../../info';
import { motion, AnimatePresence } from 'framer-motion';
import getTrackingData from '@/services/tracking-cookies';

const formSteps = [
  {
    type: 'radio',
    name: 'intention',
    title: '¿Cuál es tu objetivo principal con esta inversión?',
    inputOptions: { required: 'Selecciona una por favor' },
    options: [
      { value: 'renta_plataformas', label: 'Rentar en plataformas (Airbnb, VRBO)' },
      { value: 'renta_tradicional', label: 'Rentar tradicional anual' },
      { value: 'patrimonial', label: 'Inversión patrimonial' },
      { value: 'vivienda', label: 'Vivienda propia (a futuro)' },
    ],
    cols: 1,
  },
  {
    type: 'radio',
    name: 'conscience',
    title: '¿En qué punto estás con tu decisión de inversión?',
    inputOptions: { required: 'Selecciona una por favor' },
    options: [
      { value: 'definiendo-proyecto', label: 'Ya estoy decidido en invertir, busco el proyecto correcto' },
      { value: 'comparando-vs-negocios', label: 'Bienes raíces en la mira pero sigo comparando vs otros negocios' },
      { value: 'capital-sin-rumbo', label: 'Tengo capital disponible pero aún no defino como invertirlo' },
      { value: 'curioso', label: 'Todavía no pienso en invertir, solo me llamó la atención' },
    ],
    cols: 1,
  },
  {
    type: 'radio',
    name: 'budget',
    title: '¿Con qué rango de capital cuentas para esta inversión?',
    inputOptions: { required: 'Selecciona una por favor' },
    options: [
      { value: 'menos_3m', label: 'Menos de $3M MXN' },
      { value: '3m_5m', label: '$3M – $5M MXN' },
      { value: '5m_10m', label: '$5M – $10M MXN' },
      { value: 'mas_10m', label: 'Más de $10M MXN' },
    ],
    cols: 1,
  },
  {
    type: 'radio',
    name: 'timeline',
    title: '¿En cuánto tiempo estás listo para tomar la decisión?',
    inputOptions: { required: 'Selecciona una por favor' },
    options: [
      { value: '1mes', label: 'En el próximo mes' },
      { value: '3meses', label: 'En los próximos 3 meses' },
      { value: 'mas3meses', label: 'Más de 3 meses' },
      { value: 'explorando', label: 'Solo estoy explorando' },
    ],
    cols: 1,
  },
  {
    type: 'checkbox',
    name: 'zone',
    title: '¿Qué zonas o mercado te interesan?',
    inputOptions: { required: 'Selecciona una por favor' },
    options: [
      {value: 'andares', label: 'Andares'},
      {value: 'americana', label: 'Americana'},
      {value: 'providencia', label: 'Providencia'},
      {value: 'arcos-vallarta', label: 'Arcos Vallarta'},
      {value: 'chapultepec', label: 'Chapultepec'},
      // {value: 'ciudad-granja', label: 'Ciudad Granja'},
      // {value: 'country', label: 'El Country'},
      // {value: 'expo', label: 'Expo Guadalajara'},
      // {value: 'la-perla', label: 'La Perla',},
      {value: 'zona-real', label: 'Zona Real'},
      // {value: 'punto-sur', label: 'Punto Sur',},
      {value: 'houston', label: 'Houston',},
    ],
    cols: 2,
  },
  {
    type: 'radio',
    name: 'downPayment',
    title: '¿Cuánto capital tienes disponible para enganche hoy?',
    description: 'El enganche en portafolio va de 10% a 30% del valor de la unidad. Para que ubiques sin sacar calculadora:',
    inputOptions: { required: 'Selecciona una por favor' },
    options: [
      { value: '800_mas', label: '$800,000 MXN o más' },
      { value: '500_800', label: 'Entre $500,000 y $800,000 MXN' },
      { value: '300_500', label: 'Entre $300,000 y $500,000 MXN' },
      { value: 'menos_300', label: 'Menos de $300,000 MXN por ahora' },
    ],
    cols: 1,
  },
  // {
  //   type: 'radio',
  //   name: 'downPayment',
  //   title: '¿Qué porcentaje de enganche podrías comprometer hoy?',
  //   description: 'Los desarrollos en portafolio piden entre 10% y 30% del valor total',
  //   inputOptions: { required: 'Selecciona una por favor' },
  //   options: [
  //     { value: '30_mas', label: '30% o más, sin problema' },
  //     { value: '20_30', label: 'Entre 20% y 30%' },
  //     { value: '10_20', label: 'Entre 10% y 20%' },
  //     { value: 'menos_10', label: 'Menos del 10% por ahora' },
  //   ],
  //   cols: 1,
  // },
  // {
  //   type: 'radio',
  //   name: 'deposit',
  //   title: '¿Estarías dispuesto a separar una unidad con un apartado inicial?',
  //   description: 'El apartado oscila entre 1% y 3% del valor total, asegura tu lugar mientras se define el enganche',
  //   inputOptions: { required: 'Selecciona una por favor' },
  //   options: [
  //     { value: 'si', label: 'Sí, si el proyecto me convence' },
  //     { value: 'tal_vez', label: 'Depende de las condiciones' },
  //     { value: 'no', label: 'Prefiero esperar a tener todo definido' },
  //   ],
  //   cols: 1,
  // },
  {
    type: 'radio',
    name: 'experience',
    title: '¿Cuál es tu experiencia en inversión inmobiliaria?',
    inputOptions: { required: 'Selecciona una por favor' },
    options: [
      { value: 'portfolio', label: 'Ya tengo portafolio inmobiliario activo' },
      { value: 'una_inversion', label: 'He hecho 1–2 inversiones antes' },
      { value: 'broker', label: 'Soy broker' },
      { value: 'nuevo', label: 'Es mi primera inversión inmobiliaria' },
    ],
    cols: 1,
  },
  // {
  //   type: 'radio',
  //   name: 'asistencia',
  //   title: '¿Estarías dispuesto a agendar tu sesión de exploración esta semana?',
  //   inputOptions: { required: 'Selecciona una por favor' },
  //   options: [
  //     { value: 'si_agenda', label: 'Sí, quiero agendarlo esta semana' },
  //     { value: 'si_proxima', label: 'Sí, pero prefiero la próxima semana' },
  //     { value: 'quizas', label: 'Quizás, necesito pensarlo' },
  //     { value: 'no_aun', label: 'Aún no, solo quiero información' },
  //   ],
  //   cols: 1,
  // },
];

export default function SurveyForm() {
  const [showOutro, setShowOutro] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [inputError, setInputError] = useState(null);
  const [sending, setSending] = useState(false);
  const methods = useForm({mode: 'all'});
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = methods;
  const searchParams = useSearchParams();

  const {
    shouldRedirect,
    lead,
    utm
  } = useMemo(() => {
    return getTrackingData(searchParams);
  }, [searchParams]);

  const router = useRouter();

  useEffect(() => {
    if (shouldRedirect) router.push('/#contact');
  }, [shouldRedirect, router]);

  useEffect(() => {
    const current = formSteps[formStep];

    if (current.autoAdvance) {
      const timer = setTimeout(() => {
        setFormStep((prev) => Math.min(prev + 1, formSteps.length - 1));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [formStep]);

  useEffect(() => {
    const step = formSteps[formStep];

    if (step?.type === 'checkpoint') {
      fbEvent(step?.name);
      if (typeof gtag !== 'undefined') gtag('event', step?.name.replace('-', '_'));
    }
  }, [formStep]);

  const lastInputIndex = formSteps.reduce((lastIndex, step, i) => {
    return step.type !== 'checkpoint' ? i : lastIndex;
  }, 0);

  const handleNext = async () => {
    const currentStep = formSteps[formStep];

    if (currentStep.type === 'checkpoint') {
      return setFormStep((prev) => Math.min(prev + 1, formSteps.length - 1));
    }

    const valid = await methods.trigger(currentStep.name);
    if (!valid) {
      setInputError(formStep);
      return;
    }

    setInputError(null);
    window.scrollTo(0, 0);
    setFormStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  };

  const onSubmit = async (data) => {
    setSending(true);
    try {
      const payload = {...lead, ...data, utm};

      const response = await fetch(info.optInWebhook, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();

      fbEvent(
        'Lead',
        {email: payload.email, phone: payload.whatsapp, externalID: res.id},
      );
      gtagSendEvent(
        '',
        {email: payload.email, phone: payload.whatsapp}
      );

      setCookie('lead', {...data, ...lead, id: res.id});

      await router.push('/thankyou');

    } catch (err) {
      console.error('Error al enviar formulario:', err);
      await router.push('/thankyou');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col flex-grow bg-gradient-to-t from-blue-50 to-white">
        <AnimatePresence mode="wait">
          {!showOutro && (
            <motion.div
              key="survey"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.5}}
              className="flex flex-col flex-grow pb-[8rem]"
            >
              <div className="sticky top-0 bg-white mx-auto w-full max-w-[56rem] p-8 z-10">
                <div className="relative bg-gray-200 overflow-hidden">
                  <div className={`h-4 bg-brand-1`} style={{width: `${((formStep + 1) / formSteps.length) * 100}%`}}/>
                </div>
              </div>
              <div
                className="relative container !px-0 md:pb-0 flex flex-col flex-grow md:flex-grow-0 items-center pointer-events-auto touch-auto">
                <div className="survey-card">
                  <FormProvider {...methods}>
                    <form className="flex flex-col flex-grow" onSubmit={handleSubmit(onSubmit)}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={formStep} // importante para animaciones entre pasos
                          initial={{opacity: 0, x: 100}}
                          animate={{opacity: 1, x: 0}}
                          exit={{opacity: 0, x: -100}}
                          transition={{duration: 0.4, ease: 'easeInOut'}}
                        >
                          <StepRenderer
                            step={formSteps[formStep]}
                            index={formStep}
                            currentStep={formStep}
                            errors={errors}
                            inputError={inputError}
                            errorMessage={errors[formSteps[formStep]?.name]?.message}
                            register={register}
                          />
                        </motion.div>
                      </AnimatePresence>
                      <div
                        className={`fixed p-8 bottom-0 inset-x-0 grid ${formSteps[formStep].type === 'checkpoint' ? 'grid-cols-1' : 'grid-cols-2'} gap-8 w-full mt-auto bg-white border-t-2 border-gray-200 z-50`}>
                        {formSteps[formStep].type !== 'checkpoint' &&
                          <button
                            type="button"
                            onClick={() => setFormStep(formStep - 1)}
                            className="!bg-transparent !text-brand-1 border-none !w-full hover:text-brand-1 disabled:!text-gray-100"
                            disabled={formStep <= 0}
                          >Atrás
                          </button>
                        }
                        <button
                          type="button"
                          disabled={sending}
                          onClick={() => {
                            if (formStep === lastInputIndex) {
                              handleSubmit(onSubmit)();
                            } else {
                              handleNext();
                            }
                          }}
                          className="mt-auto !w-full !bg-neutral-900 !text-neutral-100 !hover:bg-brand-1 !no-underline"
                        >
                          {sending && <span className="animate-spin mr-4">+</span>}
                          {formStep === lastInputIndex ? 'Enviar' : '→'}
                        </button>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
