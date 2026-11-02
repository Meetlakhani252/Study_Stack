"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getPapersBySubject,
  getSubjectPaperAnalysis,
  uploadAndAnalyzePaper,
  deletePaper,
  PaperItem,
  PaperAnalysisResult,
  TopicFrequency,
} from "@/app/actions/papers";
import {
  FileText,
  UploadCloud,
  Sparkles,
  Trash2,
  X,
  Loader2,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Filter,
} from "lucide-react";

export default function PapersPage() {
  const params = useParams<{ subjectId: string }>();
  const subjectId = params.subjectId;

  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [analysis, setAnalysis] = useState<PaperAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [paperType, setPaperType] = useState<string>("Final Exam");
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    name: string;
    base64: string;
  } | null>(null);
  const [questionsText, setQuestionsText] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "text">("file");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    if (!subjectId) return;
    try {
      const [papersData, analysisData] = await Promise.all([
        getPapersBySubject(subjectId),
        getSubjectPaperAnalysis(subjectId),
      ]);
      setPapers(papersData);
      setAnalysis(analysisData);
    } catch (err: any) {
      console.error("Failed to load papers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [subjectId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      setSelectedFile({
        file,
        name: file.name,
        base64,
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAndAnalyze = async () => {
    if (!subjectId) return;
    if (uploadMode === "file" && !selectedFile) {
      setError("Please choose a PDF file to analyze.");
      return;
    }
    if (uploadMode === "text" && !questionsText.trim()) {
      setError("Please enter or paste examination questions.");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      await uploadAndAnalyzePaper({
        subjectId,
        year,
        paperType,
        pdfBase64: uploadMode === "file" ? selectedFile?.base64 : undefined,
        sampleQuestionsText: uploadMode === "text" ? questionsText.trim() : undefined,
        fileName: selectedFile?.name,
      });

      await loadData();
      setIsModalOpen(false);
      setSelectedFile(null);
      setQuestionsText("");
    } catch (err: any) {
      setError(err.message || "Failed to analyze paper.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (paperId: string) => {
    if (!confirm("Delete this paper and its question frequency data?")) return;
    try {
      await deletePaper(paperId);
      await loadData();
    } catch (err: any) {
      console.error("Delete failed:", err);
    }
  };

  const filteredPapers = papers.filter((p) => {
    if (selectedYear === "All") return true;
    return String(p.year) === selectedYear;
  });

  const availableYears = Array.from(new Set(papers.map((p) => String(p.year)))).sort(
    (a, b) => Number(b) - Number(a)
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader2 className="animate-spin text-blue-600 size-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href={`/subjects/${subjectId}`}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            &larr; Back to Subject
          </Link>

          <button
            onClick={() => {
              setError(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
          >
            <UploadCloud size={16} />
            Upload & Analyze Paper
          </button>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            Previous-Year Paper Analyzer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload previous question papers to automatically extract questions, calculate recurring topic frequencies, and predict high-priority exam topics.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-600 size-5" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Exam Probability & Topic Ranking
              </h2>
            </div>
            {analysis && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Based on {analysis.totalPapers} paper{analysis.totalPapers === 1 ? "" : "s"} ({analysis.totalQuestions} questions analyzed)
              </span>
            )}
          </div>

          {!analysis || analysis.topicFrequencies.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
              No paper data available yet. Click &quot;Upload & Analyze Paper&quot; to discover high-frequency exam topics.
            </div>
          ) : (
            <div className="space-y-3">
              {analysis.topicFrequencies.map((tf: TopicFrequency) => {
                const isExpanded = expandedTopic === tf.topic;
                return (
                  <div
                    key={tf.topic}
                    className="rounded-xl border border-gray-100 dark:border-slate-700/80 p-4 transition hover:bg-gray-50/50 dark:hover:bg-slate-700/20"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer select-none"
                      onClick={() => setExpandedTopic(isExpanded ? null : tf.topic)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                            tf.priority === "High"
                              ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                              : tf.priority === "Medium"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300"
                          }`}
                        >
                          {tf.priority} Priority
                        </span>

                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                            {tf.topic}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Appeared in: {tf.years.length > 0 ? tf.years.join(", ") : "N/A"} · {tf.frequency} question{tf.frequency === 1 ? "" : "s"} total
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                            {tf.probability}%
                          </span>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Exam Chance</p>
                        </div>
                        <span className="text-gray-400">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 h-1.5 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          tf.priority === "High"
                            ? "bg-red-500"
                            : tf.priority === "Medium"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${tf.probability}%` }}
                      />
                    </div>

                    {isExpanded && tf.sampleQuestions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 text-xs space-y-1.5">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                          Sample Questions from Past Papers:
                        </p>
                        {tf.sampleQuestions.map((q, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 dark:bg-slate-900 p-2.5 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-slate-800"
                          >
                            &bull; {q}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-blue-600" />
              Uploaded Papers Repository ({papers.length})
            </h2>

            {availableYears.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 outline-none"
                >
                  <option value="All">All Years</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredPapers.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-800/40">
                <FileText size={32} className="text-gray-400 mb-2" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  No papers matching this filter
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Upload an examination paper in PDF format to start analyzing.
                </p>
              </div>
            ) : (
              filteredPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 shadow-sm transition hover:shadow-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/60 p-2.5 text-blue-600 dark:text-blue-400 shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {paper.file_url}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Year: <span className="font-semibold">{paper.year}</span> · {paper.question_count} questions extracted
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(paper.id)}
                    title="Delete paper"
                    className="p-1.5 text-gray-400 hover:text-red-500 transition rounded-md ml-2 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => !analyzing && setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-blue-600 p-2 text-white">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Upload & Analyze Paper
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  AI extracts questions and matches them against your syllabus
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Exam Year
                  </label>
                  <input
                    type="number"
                    min={2000}
                    max={2030}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent p-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Exam Type
                  </label>
                  <select
                    value={paperType}
                    onChange={(e) => setPaperType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="Final Exam">Final Exam</option>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="Unit Test">Unit Test</option>
                    <option value="Model Paper">Model Paper</option>
                  </select>
                </div>
              </div>

              <div className="flex rounded-lg bg-gray-100 dark:bg-slate-900 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`flex-1 py-1.5 rounded-md font-medium transition ${
                    uploadMode === "file"
                      ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xs"
                      : "text-gray-500"
                  }`}
                >
                  Upload PDF Paper
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("text")}
                  className={`flex-1 py-1.5 rounded-md font-medium transition ${
                    uploadMode === "text"
                      ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xs"
                      : "text-gray-500"
                  }`}
                >
                  Paste Questions Text
                </button>
              </div>

              {uploadMode === "file" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Question Paper (PDF)
                  </label>
                  {selectedFile ? (
                    <div className="flex items-center justify-between rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={18} className="text-blue-600 shrink-0" />
                        <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {selectedFile.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-700 p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-900/50 transition text-gray-500 dark:text-gray-400"
                    >
                      <UploadCloud size={28} className="text-blue-600 mb-1.5" />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        Click to select Question Paper PDF
                      </span>
                      <span className="text-[11px] text-gray-400 mt-0.5">Up to 10MB</span>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Paste Questions (one or multiple)
                  </label>
                  <textarea
                    rows={5}
                    value={questionsText}
                    onChange={(e) => setQuestionsText(e.target.value)}
                    placeholder="Q1. Explain the Mean Value Theorem with proof.&#10;Q2. Compute integral of x*sin(x) dx.&#10;Q3. Define vector spaces and linear independence."
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent p-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500 resize-none font-mono"
                  />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3 text-xs text-red-600 dark:text-red-300">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={analyzing}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={analyzing}
                  onClick={handleUploadAndAnalyze}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
                >
                  {analyzing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Start Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
