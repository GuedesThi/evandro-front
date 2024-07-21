import { useRouter } from 'next/router';
import DefaultLayout from './DefaultLayout';
import NothingLayout from './NothingLayout';


type LayoutChooserProps = {
  children: React.ReactNode;
};

// Mapeie suas rotas para layouts específicos usando prefixos
const layoutMap: { [key: string]: React.FC<{ children: React.ReactNode }> } = {
  '/login': NothingLayout,
  '/account': NothingLayout,
  '/test': NothingLayout,
};

export function LayoutChooser({ children }: LayoutChooserProps) {
  const router = useRouter();
  const pathname = router.pathname;

  // Obtenha o layout para a rota atual baseado no prefixo mais longo que corresponde
  const layoutPrefix = Object.keys(layoutMap).find(prefix => pathname.startsWith(prefix));
  const Layout = layoutPrefix ? layoutMap[layoutPrefix] : DefaultLayout;

  return <Layout>{children}</Layout>;
}