interface StreamCallLayoutProps {
  children: React.ReactNode;
}

export default function StreamCallLayout({ children }: StreamCallLayoutProps) {
  return <div className="h-screen bg-black">{children}</div>;
}
