import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DreamJournal from "@/pages/dream-journal";
import Login from "@/pages/login";
import Signup from "@/pages/signup";

function AuthenticatedRoute({ component: Component, ...rest }: { component: React.ComponentType }) {
  return (
    <Route
      {...rest}
      component={props => {
        // Redirect to login if not authenticated
        if (!localStorage.getItem('isAuthenticated')) {
          window.location.href = '/login';
          return null;
        }
        return <Component {...props} />;
      }}
    />
  );
}

function Router() {
  return (
    <div className="min-h-screen pt-0 md:pt-4 px-4 md:px-6">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <AuthenticatedRoute path="/" component={Home} />
        <AuthenticatedRoute path="/dreams" component={DreamJournal} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;