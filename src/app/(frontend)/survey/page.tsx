// NOTA: página placeholder (no incluida en los archivos compartidos), creada
// para que el flujo de OptInForm no termine en un 404. Aquí iría el
// cuestionario post opt-in (perfil de inversión, presupuesto, etc.).
export default async function SurveyPage(props: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await props.searchParams

  return (
    <section className="w-full py-32 px-8">
      <div className="reading-container">
        <h1 className="font-bold">Cuéntanos un poco más</h1>
        <p>
          Esta encuesta está en construcción{id ? ` (lead: ${id})` : ''}. Aquí vivirá el
          cuestionario de perfil de inversión posterior al opt-in.
        </p>
      </div>
    </section>
  )
}
