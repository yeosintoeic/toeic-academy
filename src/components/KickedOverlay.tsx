"use client";

export default function KickedOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9998] bg-red-950/95 flex flex-col items-center justify-center text-white text-center p-8">
      <div className="text-6xl mb-6">🚫</div>
      <h1 className="text-3xl font-black mb-3 text-red-300">동시 접속 감지</h1>
      <div className="bg-red-900/60 border border-red-600 rounded-2xl px-8 py-5 max-w-sm mb-6">
        <p className="text-lg font-semibold mb-1">다른 기기에서 로그인이 감지되었습니다.</p>
        <p className="text-red-300 text-sm">계정은 한 기기에서만 이용 가능합니다.</p>
      </div>
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        잠시 후 자동으로 로그아웃됩니다...
      </div>
    </div>
  );
}
