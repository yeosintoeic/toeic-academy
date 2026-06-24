"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Lecture {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

function getEmbedUrl(url: string) {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;
  return url;
}

export default function LecturesPage() {
  const router = useRouter();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selected, setSelected] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lectures")
      .then(async (r) => {
        if (r.status === 401) { router.push("/login"); return; }
        if (r.status === 403) { router.push("/dashboard?noaccess=lecture"); return; }
        const data = await r.json().catch(() => []);
        const list = Array.isArray(data) ? data : [];
        setLectures(list);
        if (list.length > 0) setSelected(list[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-slate-500 hover:text-slate-800">
          ← 대시보드
        </button>
        <h1 className="font-bold text-slate-800">여신토익 강의</h1>
      </header>

      {lectures.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-slate-400">
          등록된 강의가 없습니다.
        </div>
      ) : (
        <div className="flex h-[calc(100vh-57px)]">
          {/* 강의 목록 사이드바 */}
          <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-4 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">강의 목록</p>
            </div>
            <div className="divide-y divide-slate-50">
              {lectures.map((lec, i) => (
                <button
                  key={lec.id}
                  onClick={() => setSelected(lec)}
                  className={`w-full text-left px-4 py-4 hover:bg-slate-50 transition-colors ${
                    selected?.id === lec.id ? "bg-blue-50 border-r-2 border-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      selected?.id === lec.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {i + 1}
                    </span>
                    <span className={`text-sm font-medium leading-snug ${
                      selected?.id === lec.id ? "text-blue-700" : "text-slate-700"
                    }`}>
                      {lec.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* 강의 플레이어 */}
          <main className="flex-1 overflow-y-auto">
            {selected && (
              <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">{selected.title}</h2>
                {selected.description && (
                  <p className="text-sm text-slate-500 mb-4">{selected.description}</p>
                )}
                {selected.videoUrl ? (
                  <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={getEmbedUrl(selected.videoUrl)}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                    영상이 없습니다.
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
