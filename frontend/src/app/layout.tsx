import Sidebar from "@/components/Sidebar";
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-zinc-200 antialiased h-screen overflow-hidden">
        <div className="flex h-full w-full">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-zinc-900/20">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
