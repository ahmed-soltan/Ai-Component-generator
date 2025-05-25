import { Navbar } from "@/components/navbar";
import { ContainerWrapper } from "@/components/container-wrapper";
import { Footer } from "@/components/footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContainerWrapper>
      <Navbar />
      <main className="bg-white">{children}</main>
      <Footer />
    </ContainerWrapper>
  );
}
