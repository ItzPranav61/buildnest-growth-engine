type ToastProps = {
  message: string;
};

export function Toast({ message }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-xl border border-line bg-white px-5 py-4 text-sm font-semibold text-ink shadow-[0_16px_36px_rgba(36,48,65,0.16)]">
      {message}
    </div>
  );
}
