/** Shared fetch helper for /api/remove-bg — used by ChangeBgTool and RemoveBgTool */
export async function removeBg(file: File): Promise<Blob> {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch("/api/remove-bg", { method: "POST", body: form });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `服务器错误 ${res.status}`);
  }
  return res.blob();
}
