export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  return <div className="p-8"><h1>Subject: {params.subjectId}</h1></div>
}
