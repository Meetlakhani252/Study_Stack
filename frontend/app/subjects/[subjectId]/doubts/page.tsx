export default function DoubtsPage({ params }: { params: { subjectId: string } }) {
  return <div className="p-8"><h1>Doubts for {params.subjectId}</h1></div>
}
