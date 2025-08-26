import Layout from "@/components/Layout";
import { ThemeProvider } from "@/context/theme-provider";
import { useEventsStore } from "@/stores/eventsStore";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const Bootstrap = ({ children }: { children: React.ReactNode }) => {

  const loadOnce = useEventsStore(state => state.loadOnce);
  const loaded = useEventsStore(state => state.loaded);

  useEffect(() => {
    if (!loaded) {
      loadOnce();
    }
  }, [loadOnce, loaded]);

  if (!loaded) {
    return <div>Laster hendelser...</div>;
  }
  return <>{children}</>;
};

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark">
      <Layout>
        <Bootstrap>
          <Outlet />
        </Bootstrap>
      </Layout>
    </ThemeProvider >
  )
})

