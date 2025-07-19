import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Waves, Fish, Shield, Eye, EyeOff } from "lucide-react";
import aquaHero from "@/assets/aqua-hero.jpg";
import { useLoginMutation } from "@/lib/services/auth";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Joi from "joi";
import { ILoginInput } from "@/types/user";
import useUser from "@/hooks/use-user";

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a valid email address",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useLoginMutation();
  const setUser = useUser((state) => state.setUser);
  const setToken = useUser((state) => state.setToken);

  const handleLogin = async (values: ILoginInput) => {
    try {
      const response = await login.mutateAsync(values);
      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      setUser(user);
      setToken(token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // Optionally handle login error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero Image and Branding */}
        <div className="relative hidden lg:block">
          <div className="relative overflow-hidden rounded-2xl shadow-card">
            <img
              src={aquaHero}
              alt="AquaSense Pond Monitoring"
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Waves className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">AquaSense</h1>
                  <p className="text-white/90">Pond Monitor</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">Fish Pond Monitoring</h2>
              <p className="text-lg text-white/90 mb-4">
                Real-time aquaculture management system
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Fish className="h-4 w-4" />
                  <span>12 Active Ponds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>99.8% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary rounded-xl">
                <Waves className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  AquaSense
                </h1>
                <p className="text-muted-foreground">Pond Monitor</p>
              </div>
            </div>
          </div>

          <Card className="shadow-card border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">
                Welcome back
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to your AquaSense dashboard to monitor your aquaculture
                operations
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Formik
                initialValues={{ email: "", password: "" }}
                validate={(values) => {
                  const { error } = schema.validate(values, {
                    abortEarly: false,
                  });
                  const errors: Record<string, string> = {};
                  if (error) {
                    error.details.forEach((detail) => {
                      errors[detail.path[0]] = detail.message;
                    });
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  handleLogin(values);
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-foreground font-medium"
                      >
                        Email Address
                      </Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Admin@aquasense.com"
                        className="h-11 bg-background border-border focus:ring-primary focus:border-primary"
                      />
                      <ErrorMessage name="email">
                        {(msg) => (
                          <div className="text-red-500 text-sm mt-1">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-foreground font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-11 bg-background border-border focus:ring-primary focus:border-primary pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="password">
                        {(msg) => (
                          <div className="text-red-500 text-sm mt-1">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-muted-foreground">
                          Remember me
                        </span>
                      </label>
                      <a
                        href="#"
                        className="text-sm text-primary hover:text-primary-glow font-medium"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 hover:shadow-aqua text-primary-foreground font-medium transition-all duration-200"
                      disabled={isSubmitting || login.isPending}
                    >
                      {isSubmitting || login.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                          Signing in...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="text-primary hover:text-primary-glow font-medium"
                  >
                    Contact administrator
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <p>Real-time monitoring • Online</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-healthy"></div>
                      All systems operational
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
