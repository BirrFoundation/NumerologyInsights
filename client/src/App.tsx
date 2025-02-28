import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DreamJournal from "@/pages/dream-journal";

function Router() {
  return (
    <div className="min-h-screen pt-0 md:pt-4 px-4 md:px-6">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dreams" component={DreamJournal} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;