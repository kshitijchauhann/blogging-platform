import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider"
import { TRPCProvider } from '@/lib/trpc/provider';

export const metadata: Metadata = {
  title: "Blogging App",
  description: "Multi-User Blogging Platform",
  icons: {
    icon: "/blogLogo.svg"
},
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <TRPCProvider>
        <Provider>{children}</Provider>
        </TRPCProvider>
      </body>
    </html>
  )
}
