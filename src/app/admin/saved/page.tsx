"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SavedEntry {
  id: string;
  questionId: string;
  questionText: string;
  savedAt: string;
  user: { id: string; name: string; email: string };
}

interface StudentGroup {
  userId: string;
  name: string;
  email: string;
  items: SavedEntry[];
}

export default function AdminSavedPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/saved-questions")
      .then(r => r.json())
      .then(data => {
        if (!data.saved) { router.push("/login"); return; }
        const map: Record<string, StudentGroup> = {};
        for (const item of data.saved as SavedEntry[]) {
          const uid = item.user.id;
          if (!map[uid]) map[uid] = { userId: uid, name: item.user.name, email: item.user.email, items: [] };
          map[uid].items.push(item);
        }
        setGroups(Object.values(map));
      })
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = groups.filter(g =>
    g.name.includes(search) || g.email.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/admin")} className="text-sm text-slate-500 hover:text-slate-800">
          ← 관리자
        </button>
        <h1 className="font-bold text-slate-800">학생 저장 문제</h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="이름 또는 이메일 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">저장된 문제가 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(g => (
              <div key={g.userId} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [g.userId]: !prev[g.userId] }))}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-semibold text-slate-800">{g.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{g.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
                      저장 {g.items.length}개
                    </span>
                    <span className="text-slate-400 text-sm">{expanded[g.userId] ? "▲" : "▼"}</span>
                  </div>
                </button>

                {expanded[g.userId] && (
                  <div className="border-t border-slate-100">
                    {g.items.map((item, i) => (
                      <div key={item.id} className="px-5 py-3.5 border-b border-slate-100 last:border-b-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-xs text-slate-400 mb-1">#{i + 1} · {item.questionId}</p>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {item.questionText || "(문제 텍스트 없음)"}
                            </p>
                          </div>
                          <p className="text-xs text-slate-400 flex-shrink-0 mt-1">
                            {new Date(item.savedAt).toLocaleDateString("ko-KR", {
                              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
