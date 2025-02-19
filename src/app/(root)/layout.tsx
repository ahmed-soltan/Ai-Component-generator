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
      <main>{children}</main>
      <Footer />
    </ContainerWrapper>
  );
}
