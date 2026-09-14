"use client";

interface WhatsAppShareButtonProps {
  title: string;
  url: string;
}

export function WhatsAppShareButton({ title, url }: WhatsAppShareButtonProps) {
  const message = `Check this out: ${title} - ${url}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      Share on WhatsApp
    </a>
  );
}
