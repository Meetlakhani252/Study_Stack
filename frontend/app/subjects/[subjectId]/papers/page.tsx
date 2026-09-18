export default function PapersPage({ params }: { params: { subjectId: string } }) {
  return <div className="p-8"><h1>Previous Year Papers for {params.subjectId}</h1></div>
}
