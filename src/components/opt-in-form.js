'use client';

import Link from 'next/link';
import { info } from '../../info';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { useMemo, useState } from 'react';
import { restrictNumber, emailRegExp } from '@/utils/formValidators';
import fbEvent from '@/services/fbEvents';
import getTrackingData from '@/services/tracking-cookies';

export default function OptInForm({development = '', lastClick = ''}) {
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const searchParams = useSearchParams();
  const {utm, fbc, fbp} = useMemo(() => {
    return getTrackingData(searchParams);
  }, [searchParams]);

  const onSubmit = async (data) => {
    data.whatsapp = '521' + data.phone.replace(/^\+?((MX)?\s?(52)?)?\s?0?1?|\s|\(|\)|-/g, '');
    data.development = development;
    data.lastClick = lastClick;

    try {
      setSending(true);
      const payload = {...data, utm, fbp, fbc};

      const result = await fetch(info.optInWebhook, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await result.json();
      const {id} = res;

      fbEvent(
        'CompleteRegistration',
        {email: data.email, phone: data.phone, externalID: id},
      );
      setCookie('lead', {...data, lastClick, id});
      setCookie('utm', {...utm});
      router.push(`/survey?id=${id}`);
    } catch {
      fbEvent(
        'CompleteRegistration',
        {email: data.email, phone: data.phone, externalID: ''},
      );
      setCookie('lead', {...data});
      setCookie('utm', {...utm});
      router.push(`/thankyou`)
    }
  };

  return (
    <form className="flex flex-col w-full mt-0 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register(
          'fullName',
          {
            required: true,
          },
        )}
        className={errors.fullName ? '!border-brand-2' : ''}
        placeholder="tu nombre"
      />
      <input
        {...register(
          'email',
          {
            required: true,
            pattern: {
              value: emailRegExp,
              message: 'Revisa tu correo',
            },
          },
        )}
        className={errors.email ? '!border-brand-2' : ''}
        placeholder="un email que si uses"
      />
      {errors.email && <span className="-ft-3 text-brand-2">Revisa tu email</span>}
      <input
        {...register(
          'phone',
          {required: true, maxLength: 10, minLength: 10},
        )}
        className={errors.phone ? '!border-brand-2' : ''}
        onKeyDown={restrictNumber}
        placeholder="teléfono de WhatsApp"
      />
      {errors.phone && <span className="-ft-3 text-brand-2">Solo 10 dígitos sin espacios</span>}

      <button disabled={sending} className="!bg-brand-2 w-full font-bold text-white">
        {sending && <span className="animate-spin mr-4">+</span>}
        {!sending ? 'Siguiente (→)' : 'Ahí vamos'}
      </button>

      <p className="-ft-3 mt-4 text-center">Al dar clic aceptas nuestra&nbsp;
        <Link href={info.privacyNotice}>política de privacidad</Link>
      </p>
    </form>
  );
}
